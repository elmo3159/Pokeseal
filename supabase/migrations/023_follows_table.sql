-- フォロー関係テーブル（Twitter式の一方向フォロー）
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),

  -- 同じフォロー関係は1回のみ
  CONSTRAINT unique_follow UNIQUE (follower_id, following_id),
  -- 自分自身をフォローできない
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- コメント
COMMENT ON TABLE follows IS 'User follow relationships (one-way, Twitter-style)';
COMMENT ON COLUMN follows.follower_id IS 'The user who is following';
COMMENT ON COLUMN follows.following_id IS 'The user being followed';

-- RLS有効化（テスト中は無効でも可）
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- RLSポリシー
-- 誰でもフォロー関係を閲覧可能
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  USING (true);

-- 認証済みユーザーは自分のフォロー関係を作成可能
CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- 認証済みユーザーは自分のフォロー関係を削除可能
CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- テスト用：RLSを一時的に無効化
ALTER TABLE follows DISABLE ROW LEVEL SECURITY;
