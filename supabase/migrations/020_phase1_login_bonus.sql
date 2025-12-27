-- 020: Phase 1 - ログインボーナスシステム

-- ログインボーナス履歴テーブル
CREATE TABLE IF NOT EXISTS login_bonus_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  login_date DATE NOT NULL DEFAULT CURRENT_DATE,
  consecutive_days INTEGER NOT NULL, -- 連続ログイン日数 (1-7)
  reward_day INTEGER NOT NULL, -- 1-7のどの報酬か
  reward_type TEXT NOT NULL, -- 'tickets', 'stars', 'gems', 'gacha_ticket', 'deco_item'
  reward_amount INTEGER NOT NULL,
  reward_description TEXT, -- 特別報酬の説明
  claimed BOOLEAN NOT NULL DEFAULT false,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, login_date)
);

-- RLS有効化
ALTER TABLE login_bonus_history ENABLE ROW LEVEL SECURITY;

-- ポリシー: 自分の履歴のみ読み書き可能
CREATE POLICY "Users can read own login bonus"
  ON login_bonus_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own login bonus"
  ON login_bonus_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own login bonus"
  ON login_bonus_history FOR UPDATE
  USING (auth.uid() = user_id);

-- インデックス
CREATE INDEX idx_login_bonus_user_date ON login_bonus_history(user_id, login_date DESC);
CREATE INDEX idx_login_bonus_consecutive ON login_bonus_history(user_id, consecutive_days);

-- ログインボーナス報酬設定を取得する関数
CREATE OR REPLACE FUNCTION get_login_bonus_reward(day INTEGER)
RETURNS TABLE(reward_type TEXT, reward_amount INTEGER, reward_description TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE day
      WHEN 1 THEN 'tickets'::TEXT
      WHEN 2 THEN 'tickets'::TEXT
      WHEN 3 THEN 'gems'::TEXT
      WHEN 4 THEN 'tickets'::TEXT
      WHEN 5 THEN 'deco_item'::TEXT
      WHEN 6 THEN 'tickets'::TEXT
      WHEN 7 THEN 'gacha_ticket'::TEXT
    END,
    CASE day
      WHEN 1 THEN 2
      WHEN 2 THEN 3
      WHEN 3 THEN 1
      WHEN 4 THEN 5
      WHEN 5 THEN 1
      WHEN 6 THEN 10
      WHEN 7 THEN 1
    END,
    CASE day
      WHEN 1 THEN 'シルチケ×2'::TEXT
      WHEN 2 THEN 'シルチケ×3'::TEXT
      WHEN 3 THEN 'プレシル×1'::TEXT
      WHEN 4 THEN 'シルチケ×5'::TEXT
      WHEN 5 THEN 'デコアイテム'::TEXT
      WHEN 6 THEN 'シルチケ×10'::TEXT
      WHEN 7 THEN '★4確定ガチャチケット'::TEXT
    END;
END;
$$ LANGUAGE plpgsql;

-- 連続ログイン日数を計算する関数
CREATE OR REPLACE FUNCTION calculate_consecutive_days(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  last_login_date DATE;
  consecutive_count INTEGER;
BEGIN
  -- 最後のログイン日を取得
  SELECT login_date INTO last_login_date
  FROM login_bonus_history
  WHERE user_id = p_user_id
  ORDER BY login_date DESC
  LIMIT 1;

  -- 初回ログインの場合
  IF last_login_date IS NULL THEN
    RETURN 1;
  END IF;

  -- 前日にログインしていた場合は連続
  IF last_login_date = CURRENT_DATE - INTERVAL '1 day' THEN
    SELECT consecutive_days INTO consecutive_count
    FROM login_bonus_history
    WHERE user_id = p_user_id AND login_date = last_login_date;

    -- 7日目を超えたら1に戻る
    IF consecutive_count >= 7 THEN
      RETURN 1;
    ELSE
      RETURN consecutive_count + 1;
    END IF;
  -- 今日既にログインしている場合
  ELSIF last_login_date = CURRENT_DATE THEN
    RETURN (SELECT consecutive_days FROM login_bonus_history
            WHERE user_id = p_user_id AND login_date = CURRENT_DATE);
  -- 連続ログインが途切れた場合
  ELSE
    RETURN 1;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- コメント
COMMENT ON TABLE login_bonus_history IS 'Login bonus history tracking';
COMMENT ON COLUMN login_bonus_history.consecutive_days IS 'Consecutive login days (1-7, resets after 7)';
COMMENT ON COLUMN login_bonus_history.reward_day IS 'Which day reward (1-7) - may differ from consecutive_days if user missed days';
COMMENT ON FUNCTION calculate_consecutive_days IS 'Calculate consecutive login days for a user';
COMMENT ON FUNCTION get_login_bonus_reward IS 'Get reward configuration for a specific day (1-7)';
