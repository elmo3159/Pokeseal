-- =============================================
-- Phase 3: 交換機能強化マイグレーション
-- =============================================

-- =============================================
-- 1. trades テーブルの user2_id を UUID に変更
-- =============================================

-- 既存のRLSポリシーを削除（user2_idに依存しているため）
DROP POLICY IF EXISTS "Trade participants can view" ON trades;
DROP POLICY IF EXISTS "Trade participants can update" ON trades;

-- user2_id の型を UUID に変更
ALTER TABLE trades
  ALTER COLUMN user2_id TYPE UUID USING NULLIF(user2_id, '')::UUID;

-- user2_id に外部キー制約を追加
ALTER TABLE trades
  ADD CONSTRAINT fk_trades_user2
  FOREIGN KEY (user2_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- RLSポリシーを再作成（UUIDで比較）
CREATE POLICY "Trade participants can view" ON trades FOR SELECT USING (
  auth.uid() = user1_id OR auth.uid() = user2_id
);
CREATE POLICY "Trade participants can update" ON trades FOR UPDATE USING (
  auth.uid() = user1_id OR auth.uid() = user2_id
);

-- =============================================
-- 2. Realtime 用の publication 設定
-- =============================================
-- 既存の publication があれば削除
DROP PUBLICATION IF EXISTS supabase_realtime;

-- 新しい publication を作成（交換関連テーブルを含む）
CREATE PUBLICATION supabase_realtime FOR TABLE
  trades,
  trade_items,
  trade_messages;

-- =============================================
-- 3. 交換成立時の原子的処理関数
-- =============================================
CREATE OR REPLACE FUNCTION execute_trade(p_trade_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_trade RECORD;
  v_user1_items RECORD;
  v_user2_items RECORD;
  v_result JSONB;
BEGIN
  -- 交換セッションを取得してロック
  SELECT * INTO v_trade FROM trades WHERE id = p_trade_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Trade not found');
  END IF;

  -- 両者がready状態かチェック
  IF v_trade.status NOT IN ('user1_ready', 'user2_ready') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Trade not ready');
  END IF;

  -- User1のアイテムをUser2に移動
  FOR v_user1_items IN
    SELECT ti.*, us.sticker_id
    FROM trade_items ti
    JOIN user_stickers us ON ti.user_sticker_id = us.id
    WHERE ti.trade_id = p_trade_id AND ti.user_id = v_trade.user1_id
  LOOP
    -- User1の所持数を減らす
    UPDATE user_stickers
    SET quantity = quantity - v_user1_items.quantity,
        updated_at = NOW()
    WHERE id = v_user1_items.user_sticker_id;

    -- User2に追加（既存があれば加算、なければ新規作成）
    INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
    VALUES (v_trade.user2_id, v_user1_items.sticker_id, v_user1_items.quantity, v_user1_items.quantity)
    ON CONFLICT (user_id, sticker_id)
    DO UPDATE SET
      quantity = user_stickers.quantity + EXCLUDED.quantity,
      total_acquired = user_stickers.total_acquired + EXCLUDED.quantity,
      updated_at = NOW();
  END LOOP;

  -- User2のアイテムをUser1に移動
  FOR v_user2_items IN
    SELECT ti.*, us.sticker_id
    FROM trade_items ti
    JOIN user_stickers us ON ti.user_sticker_id = us.id
    WHERE ti.trade_id = p_trade_id AND ti.user_id = v_trade.user2_id
  LOOP
    -- User2の所持数を減らす
    UPDATE user_stickers
    SET quantity = quantity - v_user2_items.quantity,
        updated_at = NOW()
    WHERE id = v_user2_items.user_sticker_id;

    -- User1に追加
    INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
    VALUES (v_trade.user1_id, v_user2_items.sticker_id, v_user2_items.quantity, v_user2_items.quantity)
    ON CONFLICT (user_id, sticker_id)
    DO UPDATE SET
      quantity = user_stickers.quantity + EXCLUDED.quantity,
      total_acquired = user_stickers.total_acquired + EXCLUDED.quantity,
      updated_at = NOW();
  END LOOP;

  -- 交換を完了状態に
  UPDATE trades
  SET status = 'completed',
      completed_at = NOW(),
      updated_at = NOW()
  WHERE id = p_trade_id;

  -- 両ユーザーの交換回数をインクリメント
  PERFORM increment_trade_count(v_trade.user1_id);
  PERFORM increment_trade_count(v_trade.user2_id);

  -- 所持数が0のレコードを削除
  DELETE FROM user_stickers WHERE quantity <= 0;

  RETURN jsonb_build_object('success', true, 'trade_id', p_trade_id);
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 4. マッチング待機中のユーザーを検索する関数
-- =============================================
CREATE OR REPLACE FUNCTION find_waiting_trades(p_user_id UUID)
RETURNS SETOF trades AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM trades
  WHERE status = 'matching'
    AND user1_id != p_user_id
    AND user2_id IS NULL
  ORDER BY created_at ASC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 5. 交換に参加する関数
-- =============================================
CREATE OR REPLACE FUNCTION join_trade(p_trade_id UUID, p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_trade RECORD;
BEGIN
  -- 交換セッションを取得してロック
  SELECT * INTO v_trade FROM trades WHERE id = p_trade_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Trade not found');
  END IF;

  IF v_trade.status != 'matching' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Trade not in matching status');
  END IF;

  IF v_trade.user2_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Trade already has a partner');
  END IF;

  IF v_trade.user1_id = p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Cannot join own trade');
  END IF;

  -- 参加
  UPDATE trades
  SET user2_id = p_user_id,
      status = 'negotiating',
      updated_at = NOW()
  WHERE id = p_trade_id;

  RETURN jsonb_build_object('success', true, 'trade_id', p_trade_id);
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 6. trade_items の RLS ポリシー追加
-- =============================================
ALTER TABLE trade_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trade item participants can view" ON trade_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM trades t
    WHERE t.id = trade_items.trade_id
    AND (auth.uid() = t.user1_id OR auth.uid() = t.user2_id)
  )
);

CREATE POLICY "Trade participants can insert items" ON trade_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM trades t
    WHERE t.id = trade_items.trade_id
    AND (auth.uid() = t.user1_id OR auth.uid() = t.user2_id)
  )
);

CREATE POLICY "Trade participants can delete own items" ON trade_items FOR DELETE USING (
  auth.uid() = user_id
);

-- =============================================
-- 7. trade_messages の RLS ポリシー追加
-- =============================================
ALTER TABLE trade_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trade message participants can view" ON trade_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM trades t
    WHERE t.id = trade_messages.trade_id
    AND (auth.uid() = t.user1_id OR auth.uid() = t.user2_id)
  )
);

CREATE POLICY "Trade participants can send messages" ON trade_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM trades t
    WHERE t.id = trade_messages.trade_id
    AND (auth.uid() = t.user1_id OR auth.uid() = t.user2_id)
  )
);
