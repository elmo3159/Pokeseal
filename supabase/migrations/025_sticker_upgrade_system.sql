-- シールアップグレードシステム
-- ダブりシールを集めてアップグレードできるシステム
-- ランク: 0=ノーマル, 1=シルバー, 2=ゴールド, 3=プリズム

-- 1. user_stickers テーブルに upgrade_rank カラムを追加
ALTER TABLE user_stickers
ADD COLUMN IF NOT EXISTS upgrade_rank INTEGER DEFAULT 0;

-- 2. upgraded_at カラムを追加（アップグレード実行日時）
ALTER TABLE user_stickers
ADD COLUMN IF NOT EXISTS upgraded_at TIMESTAMP WITH TIME ZONE;

-- 3. 既存のユニーク制約を削除
ALTER TABLE user_stickers
DROP CONSTRAINT IF EXISTS user_stickers_user_id_sticker_id_key;

-- 4. 新しいユニーク制約を追加（user_id, sticker_id, upgrade_rank）
-- これにより同じシールの異なるランクを複数所持可能に
ALTER TABLE user_stickers
ADD CONSTRAINT user_stickers_user_id_sticker_id_upgrade_rank_key
UNIQUE (user_id, sticker_id, upgrade_rank);

-- 5. upgrade_rank にインデックスを追加（フィルタリング用）
CREATE INDEX IF NOT EXISTS idx_user_stickers_upgrade_rank
ON user_stickers (upgrade_rank);

-- 6. user_sticker_achievements テーブルを作成（図鑑進捗表示用）
CREATE TABLE IF NOT EXISTS user_sticker_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sticker_id TEXT NOT NULL REFERENCES stickers(id) ON DELETE CASCADE,
  max_upgrade_rank INTEGER DEFAULT 0,
  first_silver_at TIMESTAMP WITH TIME ZONE,
  first_gold_at TIMESTAMP WITH TIME ZONE,
  first_prism_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, sticker_id)
);

-- 7. achievementsテーブルのインデックス
CREATE INDEX IF NOT EXISTS idx_user_sticker_achievements_user_id
ON user_sticker_achievements (user_id);

CREATE INDEX IF NOT EXISTS idx_user_sticker_achievements_max_rank
ON user_sticker_achievements (max_upgrade_rank);

-- 8. RLSポリシーを設定
ALTER TABLE user_sticker_achievements ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のachievementsのみ読み取り可能
CREATE POLICY "Users can view own achievements"
ON user_sticker_achievements FOR SELECT
USING (auth.uid() = user_id);

-- ユーザーは自分のachievementsを作成可能
CREATE POLICY "Users can create own achievements"
ON user_sticker_achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のachievementsを更新可能
CREATE POLICY "Users can update own achievements"
ON user_sticker_achievements FOR UPDATE
USING (auth.uid() = user_id);

-- 9. アップグレード履歴テーブル（オプション：詳細な履歴追跡用）
CREATE TABLE IF NOT EXISTS sticker_upgrade_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sticker_id TEXT NOT NULL REFERENCES stickers(id) ON DELETE CASCADE,
  from_rank INTEGER NOT NULL,
  to_rank INTEGER NOT NULL,
  consumed_quantity INTEGER NOT NULL, -- 消費したシール数
  upgraded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 履歴テーブルのインデックス
CREATE INDEX IF NOT EXISTS idx_sticker_upgrade_history_user_id
ON sticker_upgrade_history (user_id);

CREATE INDEX IF NOT EXISTS idx_sticker_upgrade_history_sticker_id
ON sticker_upgrade_history (sticker_id);

-- 履歴テーブルのRLSポリシー
ALTER TABLE sticker_upgrade_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own upgrade history"
ON sticker_upgrade_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own upgrade history"
ON sticker_upgrade_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 10. 既存データのupgrade_rankを0に初期化（念のため）
UPDATE user_stickers SET upgrade_rank = 0 WHERE upgrade_rank IS NULL;

-- 11. コメント追加
COMMENT ON COLUMN user_stickers.upgrade_rank IS 'アップグレードランク: 0=ノーマル, 1=シルバー, 2=ゴールド, 3=プリズム';
COMMENT ON COLUMN user_stickers.upgraded_at IS 'このランクにアップグレードした日時';
COMMENT ON TABLE user_sticker_achievements IS '各シールの最高到達ランクを記録（図鑑表示用）';
COMMENT ON TABLE sticker_upgrade_history IS 'アップグレード履歴（いつ何をアップグレードしたか）';
