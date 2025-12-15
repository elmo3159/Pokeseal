-- =============================================
-- Migration: Fix deco_placements RLS policy
-- テストユーザー対応のため、user_idベースのポリシーに変更
-- =============================================

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can manage own deco_placements" ON deco_placements;
DROP POLICY IF EXISTS "Anyone can view public book deco_placements" ON deco_placements;

-- 新しいポリシー: sticker_booksのuser_idで管理（auth.uid()に依存しない）
-- INSERT用
CREATE POLICY "Users can insert own deco_placements"
  ON deco_placements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sticker_book_pages sbp
      JOIN sticker_books sb ON sbp.book_id = sb.id
      WHERE sbp.id = deco_placements.page_id
    )
  );

-- SELECT用
CREATE POLICY "Users can select deco_placements"
  ON deco_placements FOR SELECT
  USING (true);

-- UPDATE用
CREATE POLICY "Users can update own deco_placements"
  ON deco_placements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sticker_book_pages sbp
      JOIN sticker_books sb ON sbp.book_id = sb.id
      WHERE sbp.id = deco_placements.page_id
    )
  );

-- DELETE用
CREATE POLICY "Users can delete own deco_placements"
  ON deco_placements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM sticker_book_pages sbp
      JOIN sticker_books sb ON sbp.book_id = sb.id
      WHERE sbp.id = deco_placements.page_id
    )
  );
