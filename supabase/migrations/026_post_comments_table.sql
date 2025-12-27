-- =============================================
-- 投稿コメントテーブル
-- =============================================

-- コメントテーブル作成
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);

-- いいね済み投稿取得用のインデックス（reactionsテーブル）
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_created_at ON reactions(created_at DESC);

-- 更新日時自動更新トリガー
DROP TRIGGER IF EXISTS update_post_comments_updated_at ON post_comments;
CREATE TRIGGER update_post_comments_updated_at
  BEFORE UPDATE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS有効化
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- RLSポリシー
-- コメントは誰でも閲覧可能
CREATE POLICY "Comments are viewable by everyone" ON post_comments
  FOR SELECT USING (true);

-- 自分のコメントのみ作成可能
CREATE POLICY "Users can create own comments" ON post_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分のコメントのみ更新可能
CREATE POLICY "Users can update own comments" ON post_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- 自分のコメントのみ削除可能
CREATE POLICY "Users can delete own comments" ON post_comments
  FOR DELETE USING (auth.uid() = user_id);

-- 投稿のcomment_countカラムを追加
ALTER TABLE posts ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;

-- コメント数を自動更新する関数
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- コメント追加/削除時に投稿のcomment_countを更新
DROP TRIGGER IF EXISTS trigger_update_comment_count ON post_comments;
CREATE TRIGGER trigger_update_comment_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comment_count();

-- いいね数を自動更新する関数（type='like'のみカウント）
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.type = 'like' THEN
    UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' AND OLD.type = 'like' THEN
    UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- いいね追加/削除時に投稿のlike_countを更新
DROP TRIGGER IF EXISTS trigger_update_like_count ON reactions;
CREATE TRIGGER trigger_update_like_count
  AFTER INSERT OR DELETE ON reactions
  FOR EACH ROW
  EXECUTE FUNCTION update_post_like_count();
