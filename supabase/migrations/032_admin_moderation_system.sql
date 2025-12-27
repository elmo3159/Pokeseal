-- =============================================
-- 管理・モデレーションシステム
-- ユーザー通報、ブロック、管理者機能を実装
-- =============================================

-- =============================================
-- 1. ユーザーブロックテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT, -- ブロック理由（オプション）
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 同じユーザーを2回ブロックできないように
  UNIQUE(blocker_id, blocked_id),
  -- 自分自身をブロックできないように
  CHECK (blocker_id != blocked_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocker ON user_blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked ON user_blocks(blocked_id);

COMMENT ON TABLE user_blocks IS 'ユーザー間のブロック関係';

-- =============================================
-- 2. 管理者テーブル
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL UNIQUE, -- 管理者のメールアドレス
  role TEXT NOT NULL DEFAULT 'moderator' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions JSONB DEFAULT '[]'::jsonb, -- 細かい権限設定
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE admin_users IS '管理者ユーザー（ゲーム運営者）';
COMMENT ON COLUMN admin_users.role IS 'super_admin: 全権限, admin: ほぼ全権限, moderator: 通報処理のみ';

-- =============================================
-- 3. 管理者アクションログテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'report_reviewed', 'report_resolved', 'report_dismissed',
    'user_warned', 'user_suspended', 'user_banned', 'user_unbanned',
    'post_hidden', 'post_deleted', 'post_restored',
    'comment_hidden', 'comment_deleted',
    'trade_cancelled',
    'content_moderated',
    'setting_changed'
  )),
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'post', 'comment', 'trade', 'report', 'system')),
  target_id TEXT NOT NULL,
  reason TEXT, -- アクションの理由
  details JSONB DEFAULT '{}'::jsonb, -- 追加情報
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON admin_actions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created ON admin_actions(created_at DESC);

COMMENT ON TABLE admin_actions IS '管理者アクションの監査ログ';

-- =============================================
-- 4. reportsテーブルの拡張
-- =============================================
-- 既存のreportsテーブルに追加カラム
ALTER TABLE reports ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal'
  CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
ALTER TABLE reports ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES admin_users(id);
ALTER TABLE reports ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS action_taken TEXT;

-- 新しいカテゴリを追加（既存のCHECK制約を更新）
ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_category_check;
ALTER TABLE reports ADD CONSTRAINT reports_category_check
  CHECK (category IN ('spam', 'inappropriate', 'harassment', 'cheating', 'impersonation', 'other'));

-- 新しいステータスを追加
ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_status_check;
ALTER TABLE reports ADD CONSTRAINT reports_status_check
  CHECK (status IN ('pending', 'reviewing', 'reviewed', 'resolved', 'dismissed'));

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_priority ON reports(priority);
CREATE INDEX IF NOT EXISTS idx_reports_created ON reports(created_at DESC);

-- =============================================
-- 5. ユーザー停止/BAN管理テーブル
-- =============================================
CREATE TABLE IF NOT EXISTS user_suspensions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id),
  suspension_type TEXT NOT NULL CHECK (suspension_type IN ('warning', 'temporary', 'permanent')),
  reason TEXT NOT NULL,
  related_report_id UUID REFERENCES reports(id),
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ, -- NULLの場合は永久BAN
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_user_suspensions_user ON user_suspensions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_suspensions_active ON user_suspensions(is_active) WHERE is_active = TRUE;

COMMENT ON TABLE user_suspensions IS 'ユーザー停止・BAN履歴';

-- =============================================
-- 6. profilesテーブルに停止フラグ追加
-- =============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspension_reason TEXT;

-- =============================================
-- 7. RLSポリシー設定
-- =============================================

-- user_blocks: 自分のブロック情報のみアクセス可能
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own blocks"
  ON user_blocks FOR SELECT
  USING (auth.uid() = blocker_id OR auth.uid() = blocked_id);

CREATE POLICY "Users can create blocks"
  ON user_blocks FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can delete their own blocks"
  ON user_blocks FOR DELETE
  USING (auth.uid() = blocker_id);

-- admin_users: 管理者のみアクセス
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin_users"
  ON admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = TRUE
    )
  );

-- admin_actions: 管理者のみアクセス
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin_actions"
  ON admin_actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = TRUE
    )
  );

CREATE POLICY "Admins can create admin_actions"
  ON admin_actions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = TRUE
    )
  );

-- user_suspensions: 管理者のみ全アクセス、ユーザーは自分の停止情報のみ閲覧可
ALTER TABLE user_suspensions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own suspensions"
  ON user_suspensions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage suspensions"
  ON user_suspensions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = TRUE
    )
  );

-- reports: ユーザーは自分の通報のみ、管理者は全て
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own reports" ON reports;
DROP POLICY IF EXISTS "Users can create reports" ON reports;
DROP POLICY IF EXISTS "Admins can manage reports" ON reports;

CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can manage all reports"
  ON reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = TRUE
    )
  );

-- =============================================
-- 8. 便利な関数
-- =============================================

-- ユーザーがブロックされているかチェック
CREATE OR REPLACE FUNCTION is_user_blocked(checker_id UUID, target_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_blocks
    WHERE blocker_id = checker_id AND blocked_id = target_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 相互ブロックチェック（どちらかがブロックしていればtrue）
CREATE OR REPLACE FUNCTION is_mutually_blocked(user1_id UUID, user2_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_blocks
    WHERE (blocker_id = user1_id AND blocked_id = user2_id)
       OR (blocker_id = user2_id AND blocked_id = user1_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザーが管理者かチェック
CREATE OR REPLACE FUNCTION is_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = check_user_id AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザーが停止中かチェック
CREATE OR REPLACE FUNCTION is_user_suspended(check_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  suspended BOOLEAN;
BEGIN
  SELECT is_suspended INTO suspended
  FROM profiles
  WHERE id = check_user_id;

  -- 期限切れの停止を解除
  IF suspended THEN
    UPDATE profiles
    SET is_suspended = FALSE, suspended_until = NULL, suspension_reason = NULL
    WHERE id = check_user_id
    AND suspended_until IS NOT NULL
    AND suspended_until < NOW();

    -- 再チェック
    SELECT is_suspended INTO suspended
    FROM profiles
    WHERE id = check_user_id;
  END IF;

  RETURN COALESCE(suspended, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 9. 初期管理者を追加（あなたのメールアドレスを設定してください）
-- =============================================
-- 注意: 実際の運用時はあなたのメールアドレスに変更してください
INSERT INTO admin_users (email, role, permissions)
VALUES ('admin@pokeseal.app', 'super_admin', '["all"]'::jsonb)
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- 10. Realtime設定
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE reports;
ALTER PUBLICATION supabase_realtime ADD TABLE user_blocks;
