-- =============================================
-- 交換実行関数のロジック修正
-- trade_items.user_id は「欲しい人」を表す
-- =============================================

CREATE OR REPLACE FUNCTION execute_trade(p_trade_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_trade RECORD;
  v_item RECORD;
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

  -- User1が欲しいシール（User2から）をUser1に移動
  -- trade_items.user_id = User1 → User1がこのシールを欲しい
  -- user_sticker_id → User2のシール（User1が欲しいから）
  FOR v_item IN
    SELECT ti.*, us.sticker_id, us.user_id as owner_id
    FROM trade_items ti
    JOIN user_stickers us ON ti.user_sticker_id = us.id
    WHERE ti.trade_id = p_trade_id AND ti.user_id = v_trade.user1_id
  LOOP
    -- 元の所有者（User2）の所持数を減らす
    UPDATE user_stickers
    SET quantity = quantity - v_item.quantity,
        updated_at = NOW()
    WHERE id = v_item.user_sticker_id;

    -- User1に追加（User1が欲しかったシール）
    INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
    VALUES (v_trade.user1_id, v_item.sticker_id, v_item.quantity, v_item.quantity)
    ON CONFLICT (user_id, sticker_id)
    DO UPDATE SET
      quantity = user_stickers.quantity + EXCLUDED.quantity,
      total_acquired = user_stickers.total_acquired + EXCLUDED.quantity,
      updated_at = NOW();
  END LOOP;

  -- User2が欲しいシール（User1から）をUser2に移動
  FOR v_item IN
    SELECT ti.*, us.sticker_id, us.user_id as owner_id
    FROM trade_items ti
    JOIN user_stickers us ON ti.user_sticker_id = us.id
    WHERE ti.trade_id = p_trade_id AND ti.user_id = v_trade.user2_id
  LOOP
    -- 元の所有者（User1）の所持数を減らす
    UPDATE user_stickers
    SET quantity = quantity - v_item.quantity,
        updated_at = NOW()
    WHERE id = v_item.user_sticker_id;

    -- User2に追加（User2が欲しかったシール）
    INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
    VALUES (v_trade.user2_id, v_item.sticker_id, v_item.quantity, v_item.quantity)
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

  -- 所持数が0以下のレコードを削除（CASCADE で sticker_placements も削除される）
  DELETE FROM user_stickers WHERE quantity <= 0;

  RETURN jsonb_build_object('success', true, 'trade_id', p_trade_id);
END;
$$ LANGUAGE plpgsql;

-- 確認メッセージ
DO $$
BEGIN
  RAISE NOTICE '✅ execute_trade関数を修正しました';
  RAISE NOTICE 'trade_items.user_id = 欲しい人のID として処理';
END;
$$;
