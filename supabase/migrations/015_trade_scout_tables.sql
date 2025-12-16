-- =============================================
-- Migration: Trade Scout Tables
-- スカウト機能（欲しいシール・出せるシール登録、自動マッチング）用テーブル
-- =============================================

-- =============================================
-- 1. スカウト設定テーブル
-- =============================================
CREATE TABLE IF NOT EXISTS trade_scout_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- 欲しいシールリスト（最大5枚、JSONB配列）
  -- 例: [{"stickerId": "mocchimo-1", "priority": 1}, ...]
  want_list JSONB DEFAULT '[]'::jsonb,

  -- 出せるシールリスト（最大5枚、JSONB配列）
  -- 例: [{"stickerId": "pofun-1", "userStickerId": "uuid..."}, ...]
  offer_list JSONB DEFAULT '[]'::jsonb,

  -- スカウト有効フラグ
  is_active BOOLEAN DEFAULT FALSE,

  -- 通知設定
  notify_on_match BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_trade_scout_settings_user ON trade_scout_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_trade_scout_settings_active ON trade_scout_settings(is_active) WHERE is_active = TRUE;

-- RLS有効化
ALTER TABLE trade_scout_settings ENABLE ROW LEVEL SECURITY;

-- RLSポリシー
CREATE POLICY "Users can manage own scout settings"
  ON trade_scout_settings FOR ALL
  USING (true);

-- トリガー
DROP TRIGGER IF EXISTS update_trade_scout_settings_updated_at ON trade_scout_settings;
CREATE TRIGGER update_trade_scout_settings_updated_at
  BEFORE UPDATE ON trade_scout_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 2. スカウトマッチテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS trade_scout_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- マッチしたユーザー（user1が検索者、user2がマッチ相手）
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- マッチスコア（0-100）
  match_score INTEGER DEFAULT 0,

  -- マッチ詳細（どのシールがマッチしたか）
  -- 例: {"user1_wants": ["mocchimo-1"], "user2_offers": ["mocchimo-1"], ...}
  match_details JSONB DEFAULT '{}'::jsonb,

  -- ステータス
  -- found: マッチング検出
  -- notified: 通知済み
  -- viewed: 閲覧済み
  -- trade_started: 交換開始
  -- expired: 期限切れ
  status TEXT DEFAULT 'found' CHECK (status IN ('found', 'notified', 'viewed', 'trade_started', 'expired')),

  -- 交換が開始された場合のtrade_id
  trade_id UUID REFERENCES trades(id) ON DELETE SET NULL,

  -- タイムスタンプ
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 同じペアの重複マッチを防ぐ
  UNIQUE(user1_id, user2_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_trade_scout_matches_user1 ON trade_scout_matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_trade_scout_matches_user2 ON trade_scout_matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_trade_scout_matches_status ON trade_scout_matches(status);

-- RLS有効化
ALTER TABLE trade_scout_matches ENABLE ROW LEVEL SECURITY;

-- RLSポリシー
CREATE POLICY "Users can view own scout matches"
  ON trade_scout_matches FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own scout matches"
  ON trade_scout_matches FOR ALL
  USING (true);

-- トリガー
DROP TRIGGER IF EXISTS update_trade_scout_matches_updated_at ON trade_scout_matches;
CREATE TRIGGER update_trade_scout_matches_updated_at
  BEFORE UPDATE ON trade_scout_matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 3. スカウトマッチング実行関数
-- =============================================
CREATE OR REPLACE FUNCTION find_scout_matches(p_user_id UUID)
RETURNS TABLE (
  matched_user_id UUID,
  matched_user_name TEXT,
  match_score INTEGER,
  wants_matched TEXT[],
  offers_matched TEXT[]
) AS $$
DECLARE
  my_wants JSONB;
  my_offers JSONB;
BEGIN
  -- 自分のスカウト設定を取得
  SELECT want_list, offer_list INTO my_wants, my_offers
  FROM trade_scout_settings
  WHERE user_id = p_user_id AND is_active = TRUE;

  IF my_wants IS NULL THEN
    RETURN;
  END IF;

  -- 他のアクティブユーザーとマッチング
  RETURN QUERY
  WITH my_want_stickers AS (
    SELECT jsonb_array_elements(my_wants)->>'stickerId' AS sticker_id
  ),
  my_offer_stickers AS (
    SELECT jsonb_array_elements(my_offers)->>'stickerId' AS sticker_id
  ),
  other_users AS (
    SELECT
      tss.user_id,
      p.display_name,
      tss.want_list AS other_wants,
      tss.offer_list AS other_offers
    FROM trade_scout_settings tss
    JOIN profiles p ON tss.user_id = p.id
    WHERE tss.user_id != p_user_id
    AND tss.is_active = TRUE
  )
  SELECT
    ou.user_id AS matched_user_id,
    ou.display_name AS matched_user_name,
    -- マッチスコア計算（簡易版）
    (
      (SELECT COUNT(*) FROM my_want_stickers mw
       WHERE mw.sticker_id IN (
         SELECT jsonb_array_elements(ou.other_offers)->>'stickerId'
       ))::INTEGER * 25 +
      (SELECT COUNT(*) FROM my_offer_stickers mo
       WHERE mo.sticker_id IN (
         SELECT jsonb_array_elements(ou.other_wants)->>'stickerId'
       ))::INTEGER * 25
    )::INTEGER AS match_score,
    -- マッチした欲しいシール
    ARRAY(
      SELECT mw.sticker_id FROM my_want_stickers mw
      WHERE mw.sticker_id IN (
        SELECT jsonb_array_elements(ou.other_offers)->>'stickerId'
      )
    ) AS wants_matched,
    -- マッチした出せるシール
    ARRAY(
      SELECT mo.sticker_id FROM my_offer_stickers mo
      WHERE mo.sticker_id IN (
        SELECT jsonb_array_elements(ou.other_wants)->>'stickerId'
      )
    ) AS offers_matched
  FROM other_users ou
  WHERE (
    -- 相手が出せるシールに自分の欲しいシールがある
    EXISTS (
      SELECT 1 FROM my_want_stickers mw
      WHERE mw.sticker_id IN (
        SELECT jsonb_array_elements(ou.other_offers)->>'stickerId'
      )
    )
    OR
    -- 自分が出せるシールに相手の欲しいシールがある
    EXISTS (
      SELECT 1 FROM my_offer_stickers mo
      WHERE mo.sticker_id IN (
        SELECT jsonb_array_elements(ou.other_wants)->>'stickerId'
      )
    )
  )
  ORDER BY match_score DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE trade_scout_settings IS 'スカウト設定：欲しいシールと出せるシールを登録';
COMMENT ON TABLE trade_scout_matches IS 'スカウトマッチ：自動検出されたマッチング候補';
