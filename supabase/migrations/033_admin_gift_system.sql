-- =============================================
-- 管理者ギフト・配布システム
-- 通貨配布、シール付与、お知らせ機能
-- =============================================

-- =============================================
-- 1. 管理者ギフトログテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS admin_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  gift_type TEXT NOT NULL CHECK (gift_type IN ('currency', 'sticker', 'item')),
  -- 対象ユーザー（NULLの場合は全員）
  target_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('single', 'all', 'selected')),
  -- ギフト詳細
  currency_type TEXT CHECK (currency_type IN ('silchike', 'preshiru', 'drop')),
  currency_amount INTEGER,
  sticker_id TEXT,
  sticker_rank INTEGER DEFAULT 0,
  item_id TEXT,
  item_amount INTEGER,
  -- メタ情報
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_admin_gifts_admin ON admin_gifts(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_gifts_target ON admin_gifts(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_gifts_created ON admin_gifts(created_at DESC);

COMMENT ON TABLE admin_gifts IS '管理者によるギフト配布ログ';

-- =============================================
-- 2. お知らせテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT NOT NULL DEFAULT 'info' CHECK (announcement_type IN ('info', 'update', 'event', 'maintenance', 'urgent')),
  -- 表示期間
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  -- ステータス
  is_active BOOLEAN DEFAULT TRUE,
  is_pinned BOOLEAN DEFAULT FALSE,
  -- メタ情報
  image_url TEXT,
  action_url TEXT,
  action_label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_announcements_created ON announcements(created_at DESC);

COMMENT ON TABLE announcements IS 'アプリ内お知らせ';

-- =============================================
-- 3. お知らせ既読テーブル
-- =============================================
CREATE TABLE IF NOT EXISTS announcement_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, announcement_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_announcement_reads_user ON announcement_reads(user_id);

-- =============================================
-- 4. 通貨付与関数
-- =============================================
CREATE OR REPLACE FUNCTION admin_grant_currency(
  p_admin_id UUID,
  p_target_user_id UUID,
  p_currency_type TEXT,
  p_amount INTEGER,
  p_reason TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_admin_user_id UUID;
BEGIN
  -- 管理者チェック
  SELECT id INTO v_admin_user_id FROM admin_users
  WHERE user_id = p_admin_id AND is_active = TRUE;

  IF v_admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authorized as admin';
  END IF;

  -- 通貨を付与
  IF p_currency_type = 'silchike' THEN
    UPDATE profiles SET silchike = COALESCE(silchike, 0) + p_amount WHERE id = p_target_user_id;
  ELSIF p_currency_type = 'preshiru' THEN
    UPDATE profiles SET preshiru = COALESCE(preshiru, 0) + p_amount WHERE id = p_target_user_id;
  ELSIF p_currency_type = 'drop' THEN
    UPDATE profiles SET drops = COALESCE(drops, 0) + p_amount WHERE id = p_target_user_id;
  ELSE
    RAISE EXCEPTION 'Invalid currency type: %', p_currency_type;
  END IF;

  -- ギフトログを記録
  INSERT INTO admin_gifts (admin_id, gift_type, target_user_id, target_type, currency_type, currency_amount, reason)
  VALUES (v_admin_user_id, 'currency', p_target_user_id, 'single', p_currency_type, p_amount, p_reason);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 5. シール付与関数
-- =============================================
CREATE OR REPLACE FUNCTION admin_grant_sticker(
  p_admin_id UUID,
  p_target_user_id UUID,
  p_sticker_id TEXT,
  p_rank INTEGER DEFAULT 0,
  p_quantity INTEGER DEFAULT 1,
  p_reason TEXT DEFAULT '管理者付与'
) RETURNS BOOLEAN AS $$
DECLARE
  v_admin_user_id UUID;
  i INTEGER;
BEGIN
  -- 管理者チェック
  SELECT id INTO v_admin_user_id FROM admin_users
  WHERE user_id = p_admin_id AND is_active = TRUE;

  IF v_admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authorized as admin';
  END IF;

  -- シールを付与（指定枚数分）
  FOR i IN 1..p_quantity LOOP
    INSERT INTO user_stickers (user_id, sticker_id, upgrade_rank, obtained_at, source)
    VALUES (p_target_user_id, p_sticker_id, p_rank, NOW(), 'admin_gift');
  END LOOP;

  -- ギフトログを記録
  INSERT INTO admin_gifts (admin_id, gift_type, target_user_id, target_type, sticker_id, sticker_rank, item_amount, reason)
  VALUES (v_admin_user_id, 'sticker', p_target_user_id, 'single', p_sticker_id, p_rank, p_quantity, p_reason);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. 全員への通貨配布関数
-- =============================================
CREATE OR REPLACE FUNCTION admin_grant_currency_to_all(
  p_admin_id UUID,
  p_currency_type TEXT,
  p_amount INTEGER,
  p_reason TEXT
) RETURNS INTEGER AS $$
DECLARE
  v_admin_user_id UUID;
  v_affected_count INTEGER;
BEGIN
  -- 管理者チェック
  SELECT id INTO v_admin_user_id FROM admin_users
  WHERE user_id = p_admin_id AND is_active = TRUE;

  IF v_admin_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authorized as admin';
  END IF;

  -- 全ユーザーに通貨を付与
  IF p_currency_type = 'silchike' THEN
    UPDATE profiles SET silchike = COALESCE(silchike, 0) + p_amount;
  ELSIF p_currency_type = 'preshiru' THEN
    UPDATE profiles SET preshiru = COALESCE(preshiru, 0) + p_amount;
  ELSIF p_currency_type = 'drop' THEN
    UPDATE profiles SET drops = COALESCE(drops, 0) + p_amount;
  ELSE
    RAISE EXCEPTION 'Invalid currency type: %', p_currency_type;
  END IF;

  GET DIAGNOSTICS v_affected_count = ROW_COUNT;

  -- ギフトログを記録
  INSERT INTO admin_gifts (admin_id, gift_type, target_user_id, target_type, currency_type, currency_amount, reason)
  VALUES (v_admin_user_id, 'currency', NULL, 'all', p_currency_type, p_amount, p_reason);

  RETURN v_affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. RLSポリシー
-- =============================================

-- admin_gifts: 管理者のみ
ALTER TABLE admin_gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin_gifts"
  ON admin_gifts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = TRUE
    )
  );

CREATE POLICY "Admins can create admin_gifts"
  ON admin_gifts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = TRUE
    )
  );

-- announcements: 誰でも読める、管理者のみ作成・編集
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active announcements"
  ON announcements FOR SELECT
  USING (is_active = TRUE AND starts_at <= NOW() AND (ends_at IS NULL OR ends_at > NOW()));

CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.user_id = auth.uid() AND au.is_active = TRUE
    )
  );

-- announcement_reads: 自分の既読のみ
ALTER TABLE announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reads"
  ON announcement_reads FOR ALL
  USING (auth.uid() = user_id);

-- =============================================
-- 8. profilesにsilchike/preshiru/dropsがなければ追加
-- =============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS silchike INTEGER DEFAULT 10;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preshiru INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS drops INTEGER DEFAULT 0;
