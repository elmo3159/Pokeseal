-- 021: Phase 1 - 図鑑コンプリート報酬システム

-- 図鑑報酬定義テーブル（マスターデータ）
CREATE TABLE IF NOT EXISTS collection_rewards (
  id TEXT PRIMARY KEY,
  completion_percentage INTEGER NOT NULL UNIQUE,
  reward_type TEXT NOT NULL, -- 'tickets', 'stars', 'gems', 'gacha_ticket', 'cover_design'
  reward_amount INTEGER NOT NULL,
  badge_title TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  badge_icon TEXT, -- バッジのアイコンURL or emoji
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザーが獲得した図鑑報酬
CREATE TABLE IF NOT EXISTS user_collection_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id TEXT NOT NULL REFERENCES collection_rewards(id) ON DELETE CASCADE,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, reward_id)
);

-- RLS有効化
ALTER TABLE collection_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collection_rewards ENABLE ROW LEVEL SECURITY;

-- ポリシー: 報酬定義は全員が読める
CREATE POLICY "Anyone can read collection rewards"
  ON collection_rewards FOR SELECT
  USING (true);

-- ポリシー: 自分の獲得報酬のみ読み書き可能
CREATE POLICY "Users can read own collection rewards"
  ON user_collection_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own collection rewards"
  ON user_collection_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_collection_rewards_percentage ON collection_rewards(completion_percentage);
CREATE INDEX idx_user_collection_rewards_user ON user_collection_rewards(user_id, claimed_at DESC);

-- 初期報酬データを投入
INSERT INTO collection_rewards (id, completion_percentage, reward_type, reward_amount, badge_title, badge_description, badge_icon, sort_order) VALUES
  ('completion_10', 10, 'tickets', 10, 'コレクター見習い', 'シールを10%集めたよ！', '🌱', 1),
  ('completion_25', 25, 'gacha_ticket', 1, 'コレクター', 'シールを25%集めたよ！★3確定チケットゲット！', '🌿', 2),
  ('completion_50', 50, 'gacha_ticket', 1, '上級コレクター', 'シールを50%集めたよ！★4確定チケットゲット！', '🌳', 3),
  ('completion_75', 75, 'gems', 20, 'マスターコレクター', 'シールを75%集めたよ！プレシル大量ゲット！', '⭐', 4),
  ('completion_90', 90, 'gacha_ticket', 1, 'レジェンドコレクター', 'シールを90%集めたよ！★5確定チケットゲット！', '💎', 5),
  ('completion_100', 100, 'cover_design', 1, 'コンプリートマスター', '全シールコンプリート！特別なカバーデザインをゲット！', '👑', 6)
ON CONFLICT (id) DO NOTHING;

-- 図鑑達成率を計算する関数
CREATE OR REPLACE FUNCTION get_collection_completion_rate(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_stickers INTEGER;
  owned_stickers INTEGER;
BEGIN
  -- 全シール数を取得
  SELECT COUNT(*) INTO total_stickers
  FROM stickers
  WHERE gacha_weight > 0; -- ガチャで入手可能なシールのみ

  -- 所有シール数を取得（uniqueで）
  SELECT COUNT(DISTINCT sticker_id) INTO owned_stickers
  FROM user_stickers
  WHERE user_id = p_user_id;

  -- 達成率を計算（小数点第1位まで）
  IF total_stickers = 0 THEN
    RETURN 0;
  END IF;

  RETURN ROUND((owned_stickers::NUMERIC / total_stickers::NUMERIC) * 100, 1);
END;
$$ LANGUAGE plpgsql;

-- 未獲得の報酬を取得する関数
CREATE OR REPLACE FUNCTION get_unclaimed_collection_rewards(p_user_id UUID)
RETURNS TABLE(
  reward_id TEXT,
  completion_percentage INTEGER,
  reward_type TEXT,
  reward_amount INTEGER,
  badge_title TEXT,
  badge_description TEXT,
  badge_icon TEXT,
  current_completion NUMERIC
) AS $$
DECLARE
  completion_rate NUMERIC;
BEGIN
  -- 現在の達成率を取得
  completion_rate := get_collection_completion_rate(p_user_id);

  RETURN QUERY
  SELECT
    cr.id,
    cr.completion_percentage,
    cr.reward_type,
    cr.reward_amount,
    cr.badge_title,
    cr.badge_description,
    cr.badge_icon,
    completion_rate
  FROM collection_rewards cr
  WHERE cr.completion_percentage <= completion_rate
    AND NOT EXISTS (
      SELECT 1 FROM user_collection_rewards ucr
      WHERE ucr.user_id = p_user_id AND ucr.reward_id = cr.id
    )
  ORDER BY cr.sort_order;
END;
$$ LANGUAGE plpgsql;

-- コメント
COMMENT ON TABLE collection_rewards IS 'Collection completion rewards (master data)';
COMMENT ON TABLE user_collection_rewards IS 'User claimed collection rewards';
COMMENT ON FUNCTION get_collection_completion_rate IS 'Calculate collection completion percentage for a user';
COMMENT ON FUNCTION get_unclaimed_collection_rewards IS 'Get unclaimed rewards that user is eligible for';
