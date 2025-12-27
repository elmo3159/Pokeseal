-- 019: Phase 1 - デイリーミッションシステム

-- ミッション定義テーブル（マスターデータ）
CREATE TABLE IF NOT EXISTS daily_missions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- 'gacha', 'place_sticker', 'post', 'like', 'trade', 'login'
  goal INTEGER NOT NULL,
  reward_type TEXT NOT NULL, -- 'tickets', 'stars', 'gems', 'exp'
  reward_amount INTEGER NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'easy', -- 'easy', 'medium', 'hard'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザーごとのミッション進捗
CREATE TABLE IF NOT EXISTS user_daily_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL REFERENCES daily_missions(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mission_id, date)
);

-- RLS有効化
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_missions ENABLE ROW LEVEL SECURITY;

-- ポリシー: ミッション定義は全員が読める
CREATE POLICY "Anyone can read daily missions"
  ON daily_missions FOR SELECT
  USING (is_active = true);

-- ポリシー: ユーザーミッションは自分のみ読み書き可能
CREATE POLICY "Users can read own missions"
  ON user_daily_missions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own missions"
  ON user_daily_missions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own missions"
  ON user_daily_missions FOR UPDATE
  USING (auth.uid() = user_id);

-- updated_atを自動更新
CREATE OR REPLACE FUNCTION update_user_daily_missions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_daily_missions_updated_at
  BEFORE UPDATE ON user_daily_missions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_daily_missions_updated_at();

-- インデックス
CREATE INDEX idx_user_daily_missions_user_date ON user_daily_missions(user_id, date DESC);
CREATE INDEX idx_user_daily_missions_completed ON user_daily_missions(user_id, is_completed, date);

-- 初期ミッションデータを投入
INSERT INTO daily_missions (id, title, description, type, goal, reward_type, reward_amount, difficulty) VALUES
  ('gacha_3', 'ガチャを3回ひく', 'ガチャを3回ひいてシールをゲットしよう！', 'gacha', 3, 'stars', 50, 'easy'),
  ('place_stickers_5', 'シールを5枚貼る', 'シール帳にシールを5枚貼ってかわいくしよう！', 'place_sticker', 5, 'tickets', 2, 'easy'),
  ('post_timeline', 'タイムラインに投稿', 'あなたのシール帳をみんなに見せよう！', 'post', 1, 'gems', 1, 'medium'),
  ('like_posts_3', '投稿に3ついいね', '他のユーザーの投稿に3ついいねしよう！', 'like', 3, 'stars', 30, 'easy'),
  ('trade_propose', '交換を1回提案', 'フレンドに交換を提案してみよう！', 'trade', 1, 'exp', 100, 'medium')
ON CONFLICT (id) DO NOTHING;

-- コメント
COMMENT ON TABLE daily_missions IS 'Daily mission definitions (master data)';
COMMENT ON TABLE user_daily_missions IS 'User daily mission progress tracking';
COMMENT ON COLUMN user_daily_missions.progress IS 'Current progress towards goal';
COMMENT ON COLUMN user_daily_missions.is_completed IS 'Whether mission is completed (progress >= goal)';
COMMENT ON COLUMN user_daily_missions.claimed IS 'Whether reward has been claimed';
