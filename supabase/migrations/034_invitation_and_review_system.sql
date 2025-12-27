-- =====================================================
-- 招待システム & レビュー報酬システム
-- =====================================================

-- =====================================================
-- 1. 招待コードテーブル
-- =====================================================
CREATE TABLE IF NOT EXISTS user_invitation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitation_code VARCHAR(12) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_invitation_code UNIQUE (user_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_invitation_codes_code ON user_invitation_codes(invitation_code);
CREATE INDEX IF NOT EXISTS idx_invitation_codes_user ON user_invitation_codes(user_id);

-- =====================================================
-- 2. 招待履歴テーブル
-- =====================================================
CREATE TABLE IF NOT EXISTS user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitation_code VARCHAR(12) NOT NULL,
  inviter_reward_claimed BOOLEAN DEFAULT FALSE,
  invitee_reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 同じ人を2回招待できない
  CONSTRAINT unique_invitee UNIQUE (invitee_id),
  -- 自分自身を招待できない
  CONSTRAINT no_self_invite CHECK (inviter_id != invitee_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_invitations_inviter ON user_invitations(inviter_id);
CREATE INDEX IF NOT EXISTS idx_invitations_invitee ON user_invitations(invitee_id);
CREATE INDEX IF NOT EXISTS idx_invitations_created ON user_invitations(created_at);

-- =====================================================
-- 3. 月間招待カウントビュー
-- =====================================================
CREATE OR REPLACE VIEW monthly_invitation_counts AS
SELECT
  inviter_id,
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS invitation_count
FROM user_invitations
GROUP BY inviter_id, DATE_TRUNC('month', created_at);

-- =====================================================
-- 4. レビュー報酬テーブル
-- =====================================================
CREATE TABLE IF NOT EXISTS user_review_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  reward_claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 各プラットフォームで1回のみ
  CONSTRAINT unique_user_platform_review UNIQUE (user_id, platform)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_review_rewards_user ON user_review_rewards(user_id);

-- =====================================================
-- 5. 招待コード生成関数
-- =====================================================
CREATE OR REPLACE FUNCTION generate_invitation_code()
RETURNS VARCHAR(12) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result VARCHAR(12) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. ユーザーの招待コードを取得または生成する関数
-- =====================================================
CREATE OR REPLACE FUNCTION get_or_create_invitation_code(p_user_id UUID)
RETURNS VARCHAR(12) AS $$
DECLARE
  v_code VARCHAR(12);
  v_attempts INTEGER := 0;
BEGIN
  -- 既存のコードがあれば返す
  SELECT invitation_code INTO v_code
  FROM user_invitation_codes
  WHERE user_id = p_user_id;

  IF v_code IS NOT NULL THEN
    RETURN v_code;
  END IF;

  -- 新しいコードを生成（重複チェック付き）
  LOOP
    v_code := generate_invitation_code();
    v_attempts := v_attempts + 1;

    BEGIN
      INSERT INTO user_invitation_codes (user_id, invitation_code)
      VALUES (p_user_id, v_code);
      RETURN v_code;
    EXCEPTION WHEN unique_violation THEN
      IF v_attempts >= 10 THEN
        RAISE EXCEPTION 'Failed to generate unique invitation code';
      END IF;
    END;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. 招待を適用する関数
-- =====================================================
CREATE OR REPLACE FUNCTION apply_invitation(
  p_invitee_id UUID,
  p_invitation_code VARCHAR(12)
)
RETURNS JSONB AS $$
DECLARE
  v_inviter_id UUID;
  v_monthly_count INTEGER;
  v_result JSONB;
BEGIN
  -- 招待コードからinviter_idを取得
  SELECT user_id INTO v_inviter_id
  FROM user_invitation_codes
  WHERE invitation_code = UPPER(p_invitation_code);

  IF v_inviter_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_code');
  END IF;

  -- 自分自身を招待できない
  IF v_inviter_id = p_invitee_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'self_invite');
  END IF;

  -- 既に招待済みかチェック
  IF EXISTS (SELECT 1 FROM user_invitations WHERE invitee_id = p_invitee_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_invited');
  END IF;

  -- 月間招待上限チェック（50人/月）
  SELECT COUNT(*) INTO v_monthly_count
  FROM user_invitations
  WHERE inviter_id = v_inviter_id
    AND created_at >= DATE_TRUNC('month', NOW());

  IF v_monthly_count >= 50 THEN
    RETURN jsonb_build_object('success', false, 'error', 'monthly_limit_reached');
  END IF;

  -- 招待を記録
  INSERT INTO user_invitations (inviter_id, invitee_id, invitation_code)
  VALUES (v_inviter_id, p_invitee_id, UPPER(p_invitation_code));

  RETURN jsonb_build_object(
    'success', true,
    'inviter_id', v_inviter_id,
    'invitee_id', p_invitee_id
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. 招待報酬を受け取る関数（招待した人用）
-- =====================================================
CREATE OR REPLACE FUNCTION claim_inviter_reward(p_user_id UUID, p_invitation_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_invitation RECORD;
BEGIN
  -- 招待を取得
  SELECT * INTO v_invitation
  FROM user_invitations
  WHERE id = p_invitation_id AND inviter_id = p_user_id;

  IF v_invitation IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'invitation_not_found');
  END IF;

  IF v_invitation.inviter_reward_claimed THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_claimed');
  END IF;

  -- 報酬を付与済みにマーク
  UPDATE user_invitations
  SET inviter_reward_claimed = true
  WHERE id = p_invitation_id;

  -- 報酬: シルチケ10枚 + プレシル1枚
  RETURN jsonb_build_object(
    'success', true,
    'rewards', jsonb_build_object(
      'tickets', 10,
      'gems', 1
    )
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. 招待報酬を受け取る関数（招待された人用）
-- =====================================================
CREATE OR REPLACE FUNCTION claim_invitee_reward(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_invitation RECORD;
BEGIN
  -- 招待を取得
  SELECT * INTO v_invitation
  FROM user_invitations
  WHERE invitee_id = p_user_id;

  IF v_invitation IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_invited');
  END IF;

  IF v_invitation.invitee_reward_claimed THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_claimed');
  END IF;

  -- 報酬を付与済みにマーク
  UPDATE user_invitations
  SET invitee_reward_claimed = true
  WHERE invitee_id = p_user_id;

  -- 報酬: シルチケ15枚 + プレシル1枚
  RETURN jsonb_build_object(
    'success', true,
    'rewards', jsonb_build_object(
      'tickets', 15,
      'gems', 1
    )
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 10. レビュー報酬を受け取る関数
-- =====================================================
CREATE OR REPLACE FUNCTION claim_review_reward(p_user_id UUID, p_platform VARCHAR(20))
RETURNS JSONB AS $$
DECLARE
  v_existing RECORD;
BEGIN
  -- プラットフォームチェック
  IF p_platform NOT IN ('ios', 'android', 'web') THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_platform');
  END IF;

  -- 既に受け取り済みかチェック
  SELECT * INTO v_existing
  FROM user_review_rewards
  WHERE user_id = p_user_id AND platform = p_platform;

  IF v_existing IS NOT NULL AND v_existing.reward_claimed THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_claimed');
  END IF;

  -- レコードを作成または更新
  INSERT INTO user_review_rewards (user_id, platform, reward_claimed, claimed_at)
  VALUES (p_user_id, p_platform, true, NOW())
  ON CONFLICT (user_id, platform)
  DO UPDATE SET reward_claimed = true, claimed_at = NOW();

  -- 報酬: シルチケ5枚
  RETURN jsonb_build_object(
    'success', true,
    'rewards', jsonb_build_object(
      'tickets', 5
    )
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 11. ユーザーの招待統計を取得する関数
-- =====================================================
CREATE OR REPLACE FUNCTION get_invitation_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_code VARCHAR(12);
  v_total_invites INTEGER;
  v_monthly_invites INTEGER;
  v_unclaimed_rewards INTEGER;
  v_was_invited BOOLEAN;
  v_invitee_reward_claimed BOOLEAN;
BEGIN
  -- 招待コードを取得（なければ生成）
  v_code := get_or_create_invitation_code(p_user_id);

  -- 総招待数
  SELECT COUNT(*) INTO v_total_invites
  FROM user_invitations
  WHERE inviter_id = p_user_id;

  -- 今月の招待数
  SELECT COUNT(*) INTO v_monthly_invites
  FROM user_invitations
  WHERE inviter_id = p_user_id
    AND created_at >= DATE_TRUNC('month', NOW());

  -- 未受け取り報酬数
  SELECT COUNT(*) INTO v_unclaimed_rewards
  FROM user_invitations
  WHERE inviter_id = p_user_id
    AND inviter_reward_claimed = false;

  -- 自分が招待されたかどうか
  SELECT
    TRUE,
    invitee_reward_claimed
  INTO v_was_invited, v_invitee_reward_claimed
  FROM user_invitations
  WHERE invitee_id = p_user_id;

  IF v_was_invited IS NULL THEN
    v_was_invited := false;
    v_invitee_reward_claimed := false;
  END IF;

  RETURN jsonb_build_object(
    'invitation_code', v_code,
    'total_invites', v_total_invites,
    'monthly_invites', v_monthly_invites,
    'monthly_limit', 50,
    'remaining_invites', 50 - v_monthly_invites,
    'unclaimed_rewards', v_unclaimed_rewards,
    'was_invited', v_was_invited,
    'invitee_reward_claimed', v_invitee_reward_claimed
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 12. レビュー報酬状態を取得する関数
-- =====================================================
CREATE OR REPLACE FUNCTION get_review_reward_status(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_ios_claimed BOOLEAN := false;
  v_android_claimed BOOLEAN := false;
BEGIN
  SELECT reward_claimed INTO v_ios_claimed
  FROM user_review_rewards
  WHERE user_id = p_user_id AND platform = 'ios';

  SELECT reward_claimed INTO v_android_claimed
  FROM user_review_rewards
  WHERE user_id = p_user_id AND platform = 'android';

  RETURN jsonb_build_object(
    'ios_claimed', COALESCE(v_ios_claimed, false),
    'android_claimed', COALESCE(v_android_claimed, false),
    'can_claim_ios', NOT COALESCE(v_ios_claimed, false),
    'can_claim_android', NOT COALESCE(v_android_claimed, false)
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 13. RLSポリシー
-- =====================================================

-- user_invitation_codes
ALTER TABLE user_invitation_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invitation code"
  ON user_invitation_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view any invitation code for lookup"
  ON user_invitation_codes FOR SELECT
  USING (true);

-- user_invitations
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invitations they are part of"
  ON user_invitations FOR SELECT
  USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

CREATE POLICY "System can insert invitations"
  ON user_invitations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update invitations"
  ON user_invitations FOR UPDATE
  USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

-- user_review_rewards
ALTER TABLE user_review_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own review rewards"
  ON user_review_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own review rewards"
  ON user_review_rewards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own review rewards"
  ON user_review_rewards FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- 14. 招待リスト取得関数
-- =====================================================
CREATE OR REPLACE FUNCTION get_invitation_list(p_user_id UUID)
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', i.id,
        'invitee_id', i.invitee_id,
        'invitee_name', p.display_name,
        'reward_claimed', i.inviter_reward_claimed,
        'created_at', i.created_at
      )
      ORDER BY i.created_at DESC
    ), '[]'::jsonb)
    FROM user_invitations i
    LEFT JOIN profiles p ON p.id = i.invitee_id
    WHERE i.inviter_id = p_user_id
  );
END;
$$ LANGUAGE plpgsql;
