-- =============================================
-- Migration: Mystery Posts Table
-- ミステリーポスト（シールの投函・受け取り）機能用テーブル
-- =============================================

-- ミステリーポストテーブル
CREATE TABLE IF NOT EXISTS mystery_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 投函者情報
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_sticker_id UUID NOT NULL REFERENCES user_stickers(id) ON DELETE CASCADE,

  -- メッセージ（任意）
  message TEXT,

  -- ステータス
  -- pending: マッチング待ち
  -- matched: マッチ完了（配達待ち）
  -- delivered: 配達済み
  -- expired: 期限切れ（返却）
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'delivered', 'expired')),

  -- 受取人情報（マッチ後に設定）
  recipient_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  matched_post_id UUID REFERENCES mystery_posts(id) ON DELETE SET NULL,

  -- タイムスタンプ
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  matched_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_mystery_posts_sender ON mystery_posts(sender_id);
CREATE INDEX IF NOT EXISTS idx_mystery_posts_recipient ON mystery_posts(recipient_id);
CREATE INDEX IF NOT EXISTS idx_mystery_posts_status ON mystery_posts(status);
CREATE INDEX IF NOT EXISTS idx_mystery_posts_expires ON mystery_posts(expires_at) WHERE status = 'pending';

-- RLS有効化
ALTER TABLE mystery_posts ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（テスト用に緩めの設定）
-- 自分の投稿は読み書き可能
CREATE POLICY "Users can manage own mystery posts"
  ON mystery_posts FOR ALL
  USING (true);

-- トリガー：updated_at 自動更新
DROP TRIGGER IF EXISTS update_mystery_posts_updated_at ON mystery_posts;
CREATE TRIGGER update_mystery_posts_updated_at
  BEFORE UPDATE ON mystery_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ミステリーポストマッチング関数
-- レアリティが±1以内のシールをマッチング
-- =============================================
CREATE OR REPLACE FUNCTION match_mystery_posts()
RETURNS INTEGER AS $$
DECLARE
  matched_count INTEGER := 0;
  post1 RECORD;
  post2 RECORD;
BEGIN
  -- ペンディング状態の投稿を取得してマッチング
  FOR post1 IN
    SELECT mp.*, s.rarity
    FROM mystery_posts mp
    JOIN user_stickers us ON mp.user_sticker_id = us.id
    JOIN stickers s ON us.sticker_id = s.id
    WHERE mp.status = 'pending'
    AND mp.expires_at > NOW()
    ORDER BY mp.posted_at ASC
  LOOP
    -- 同じユーザー以外で、レアリティが±1以内の投稿を探す
    SELECT mp.*, s.rarity INTO post2
    FROM mystery_posts mp
    JOIN user_stickers us ON mp.user_sticker_id = us.id
    JOIN stickers s ON us.sticker_id = s.id
    WHERE mp.status = 'pending'
    AND mp.sender_id != post1.sender_id
    AND mp.id != post1.id
    AND mp.expires_at > NOW()
    AND ABS(s.rarity - post1.rarity) <= 1
    ORDER BY mp.posted_at ASC
    LIMIT 1;

    -- マッチング成立
    IF post2.id IS NOT NULL THEN
      -- 両方のステータスを更新
      UPDATE mystery_posts
      SET status = 'matched',
          matched_at = NOW(),
          recipient_id = post2.sender_id,
          matched_post_id = post2.id
      WHERE id = post1.id;

      UPDATE mystery_posts
      SET status = 'matched',
          matched_at = NOW(),
          recipient_id = post1.sender_id,
          matched_post_id = post1.id
      WHERE id = post2.id;

      matched_count := matched_count + 1;
    END IF;
  END LOOP;

  RETURN matched_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 配達処理関数（毎日6時に実行想定）
-- =============================================
CREATE OR REPLACE FUNCTION deliver_mystery_posts()
RETURNS INTEGER AS $$
DECLARE
  delivered_count INTEGER := 0;
BEGIN
  -- マッチ済みで未配達の投稿を配達済みに更新
  UPDATE mystery_posts
  SET status = 'delivered',
      delivered_at = NOW()
  WHERE status = 'matched'
  AND matched_at IS NOT NULL;

  GET DIAGNOSTICS delivered_count = ROW_COUNT;

  -- 期限切れの投稿を処理
  UPDATE mystery_posts
  SET status = 'expired'
  WHERE status = 'pending'
  AND expires_at < NOW();

  RETURN delivered_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE mystery_posts IS 'ミステリーポスト機能：シールを投函してランダムな相手とシールを交換';
