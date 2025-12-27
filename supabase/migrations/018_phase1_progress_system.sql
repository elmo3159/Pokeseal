-- 018: Phase 1 - プログレスシステム（レベル・経験値・称号）

-- ユーザー進捗テーブル
CREATE TABLE IF NOT EXISTS user_progress (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  title TEXT DEFAULT '初心者コレクター',
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS有効化
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- ポリシー: 自分の進捗は読み書き可能
CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 他のユーザーの進捗も読み取り可能（レベル比較用）
CREATE POLICY "Users can read others progress"
  ON user_progress FOR SELECT
  USING (true);

-- updated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_user_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_progress_updated_at();

-- インデックス
CREATE INDEX idx_user_progress_level ON user_progress(level DESC);
CREATE INDEX idx_user_progress_exp ON user_progress(exp DESC);

-- コメント
COMMENT ON TABLE user_progress IS 'User progression system - levels, experience, titles, and badges';
COMMENT ON COLUMN user_progress.level IS 'User level (starts at 1, no upper limit)';
COMMENT ON COLUMN user_progress.exp IS 'Current experience points';
COMMENT ON COLUMN user_progress.title IS 'User title/rank (e.g., 初心者コレクター, シール帳マスター)';
COMMENT ON COLUMN user_progress.badges IS 'Array of earned badges as JSON';
