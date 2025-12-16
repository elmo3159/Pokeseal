-- =============================================
-- Migration: Anonymous Auth + 6-digit User Code
-- 匿名認証システムとユーザーコード（フレンド検索用）
-- =============================================

-- 1. user_codeカラムを追加（6桁の一意なコード）
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS user_code TEXT UNIQUE;

-- 2. usernameをNULL許容に変更（匿名ユーザーはusernameなし）
ALTER TABLE profiles
ALTER COLUMN username DROP NOT NULL;

-- 3. 一意な6桁コードを生成する関数
CREATE OR REPLACE FUNCTION generate_unique_user_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
  max_attempts INT := 100;
  attempt INT := 0;
BEGIN
  LOOP
    -- 6桁のランダムな数字を生成（100000-999999）
    new_code := LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');

    -- 既存のコードと重複していないか確認
    SELECT EXISTS(SELECT 1 FROM profiles WHERE user_code = new_code) INTO code_exists;

    -- 重複がなければ返す
    IF NOT code_exists THEN
      RETURN new_code;
    END IF;

    -- 無限ループ防止
    attempt := attempt + 1;
    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Could not generate unique user code after % attempts', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 4. プロフィール作成時に自動でuser_codeを付与するトリガー
CREATE OR REPLACE FUNCTION set_user_code_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_code IS NULL THEN
    NEW.user_code := generate_unique_user_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_user_code_trigger ON profiles;
CREATE TRIGGER set_user_code_trigger
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_user_code_on_insert();

-- 5. 既存のプロフィールにuser_codeを付与
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT id FROM profiles WHERE user_code IS NULL
  LOOP
    UPDATE profiles
    SET user_code = generate_unique_user_code()
    WHERE id = profile_record.id;
  END LOOP;
END;
$$;

-- 6. user_codeにインデックスを作成（検索用）
CREATE INDEX IF NOT EXISTS idx_profiles_user_code ON profiles(user_code);

-- 7. user_codeでユーザーを検索する関数
CREATE OR REPLACE FUNCTION search_user_by_code(p_user_code TEXT)
RETURNS TABLE (
  id UUID,
  user_code TEXT,
  display_name TEXT,
  avatar_url TEXT,
  total_stickers INTEGER,
  total_trades INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.user_code,
    p.display_name,
    p.avatar_url,
    p.total_stickers,
    p.total_trades
  FROM profiles p
  WHERE p.user_code = p_user_code;
END;
$$ LANGUAGE plpgsql;

-- 8. 匿名ユーザー用のRLSポリシー更新
-- 匿名ユーザーも自分のプロフィールを作成・更新できるようにする
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 匿名ユーザーも含めて全員がプロフィールを閲覧可能
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- 9. コメント追加
COMMENT ON COLUMN profiles.user_code IS '6桁のユーザーコード（フレンド検索用）';
