-- =============================================
-- Migration: Extend profiles for level system
-- プロフィールテーブルにレベル・経験値関連カラムを追加
-- =============================================

-- 経験値カラムを追加（レベルは経験値から計算）
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS total_exp INTEGER DEFAULT 0;

-- テストユーザーの経験値を初期化
UPDATE profiles
SET total_exp = 0
WHERE total_exp IS NULL;

-- コメント追加
COMMENT ON COLUMN profiles.total_exp IS '累積経験値（レベルは経験値から計算）';
COMMENT ON COLUMN profiles.display_name IS 'ユーザー表示名';
COMMENT ON COLUMN profiles.bio IS '自己紹介文（50文字まで）';
COMMENT ON COLUMN profiles.avatar_url IS 'アバター画像URL';
