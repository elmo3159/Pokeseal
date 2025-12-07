-- ポケシル RLS (Row Level Security) ポリシー
-- CLAUDE.md仕様に基づくセキュリティ設定

-- ========================================
-- 全テーブルでRLSを有効化
-- ========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sticker_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE sticker_book_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sticker_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE charms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_charms ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gacha_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- ========================================
-- profiles テーブル
-- ========================================
-- 自分のプロフィールは閲覧・更新可能
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 公開プロフィールは誰でも閲覧可能
CREATE POLICY "Users can view public profiles"
ON profiles FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles p
  WHERE p.id = profiles.id
));

-- 自分のプロフィールのみ更新可能
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 新規登録時にプロフィール作成可能
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- ========================================
-- sticker_books テーブル
-- ========================================
-- 自分のシール帳は閲覧可能
CREATE POLICY "Users can view their own sticker books"
ON sticker_books FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 公開シール帳は誰でも閲覧可能
CREATE POLICY "Users can view public sticker books"
ON sticker_books FOR SELECT
TO authenticated
USING (is_public = true);

-- 自分のシール帳のみ作成・更新・削除可能
CREATE POLICY "Users can insert their own sticker books"
ON sticker_books FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own sticker books"
ON sticker_books FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own sticker books"
ON sticker_books FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ========================================
-- sticker_book_pages テーブル
-- ========================================
-- 自分のシール帳のページは閲覧可能
CREATE POLICY "Users can view their own book pages"
ON sticker_book_pages FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM sticker_books sb
  WHERE sb.id = sticker_book_pages.book_id
  AND sb.user_id = auth.uid()
));

-- 公開シール帳のページは誰でも閲覧可能
CREATE POLICY "Users can view pages of public books"
ON sticker_book_pages FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM sticker_books sb
  WHERE sb.id = sticker_book_pages.book_id
  AND sb.is_public = true
));

-- 自分のシール帳のページのみ操作可能
CREATE POLICY "Users can manage their own book pages"
ON sticker_book_pages FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM sticker_books sb
  WHERE sb.id = sticker_book_pages.book_id
  AND sb.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM sticker_books sb
  WHERE sb.id = sticker_book_pages.book_id
  AND sb.user_id = auth.uid()
));

-- ========================================
-- stickers テーブル（マスターデータ）
-- ========================================
-- 全員が閲覧可能（マスターデータなので読み取り専用）
CREATE POLICY "Everyone can view stickers"
ON stickers FOR SELECT
TO authenticated
USING (true);

-- ========================================
-- user_stickers テーブル
-- ========================================
-- 自分の所持シールは閲覧可能
CREATE POLICY "Users can view their own stickers"
ON user_stickers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 交換中は相手の所持シールも閲覧可能
CREATE POLICY "Users can view trading partner stickers"
ON user_stickers FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM trades t
  WHERE t.status IN ('negotiating', 'user1_ready', 'user2_ready')
  AND ((t.user1_id = auth.uid() AND t.user2_id = user_stickers.user_id)
    OR (t.user2_id = auth.uid() AND t.user1_id = user_stickers.user_id))
));

-- 自分の所持シールのみ操作可能
CREATE POLICY "Users can manage their own stickers"
ON user_stickers FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ========================================
-- sticker_placements テーブル
-- ========================================
-- 自分のシール配置は閲覧可能
CREATE POLICY "Users can view their own placements"
ON sticker_placements FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM sticker_book_pages sbp
  JOIN sticker_books sb ON sb.id = sbp.book_id
  WHERE sbp.id = sticker_placements.page_id
  AND sb.user_id = auth.uid()
));

-- 公開シール帳のシール配置は誰でも閲覧可能
CREATE POLICY "Users can view placements of public books"
ON sticker_placements FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM sticker_book_pages sbp
  JOIN sticker_books sb ON sb.id = sbp.book_id
  WHERE sbp.id = sticker_placements.page_id
  AND sb.is_public = true
));

-- 自分のシール配置のみ操作可能
CREATE POLICY "Users can manage their own placements"
ON sticker_placements FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM sticker_book_pages sbp
  JOIN sticker_books sb ON sb.id = sbp.book_id
  WHERE sbp.id = sticker_placements.page_id
  AND sb.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM sticker_book_pages sbp
  JOIN sticker_books sb ON sb.id = sbp.book_id
  WHERE sbp.id = sticker_placements.page_id
  AND sb.user_id = auth.uid()
));

-- ========================================
-- trades テーブル
-- ========================================
-- 当事者のみ閲覧可能
CREATE POLICY "Trade participants can view trades"
ON trades FOR SELECT
TO authenticated
USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- 当事者のみ更新可能
CREATE POLICY "Trade participants can update trades"
ON trades FOR UPDATE
TO authenticated
USING (user1_id = auth.uid() OR user2_id = auth.uid())
WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- 認証ユーザーは交換を開始可能
CREATE POLICY "Authenticated users can create trades"
ON trades FOR INSERT
TO authenticated
WITH CHECK (user1_id = auth.uid());

-- ========================================
-- trade_items テーブル
-- ========================================
-- 交換当事者のみ閲覧可能
CREATE POLICY "Trade participants can view trade items"
ON trade_items FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM trades t
  WHERE t.id = trade_items.trade_id
  AND (t.user1_id = auth.uid() OR t.user2_id = auth.uid())
));

-- 交換当事者のみ操作可能
CREATE POLICY "Trade participants can manage trade items"
ON trade_items FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM trades t
  WHERE t.id = trade_items.trade_id
  AND (t.user1_id = auth.uid() OR t.user2_id = auth.uid())
  AND t.status IN ('negotiating', 'user1_ready', 'user2_ready')
))
WITH CHECK (EXISTS (
  SELECT 1 FROM trades t
  WHERE t.id = trade_items.trade_id
  AND (t.user1_id = auth.uid() OR t.user2_id = auth.uid())
  AND t.status IN ('negotiating', 'user1_ready', 'user2_ready')
));

-- ========================================
-- trade_messages テーブル
-- ========================================
-- 交換当事者のみ閲覧可能
CREATE POLICY "Trade participants can view messages"
ON trade_messages FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM trades t
  WHERE t.id = trade_messages.trade_id
  AND (t.user1_id = auth.uid() OR t.user2_id = auth.uid())
));

-- 交換当事者のみメッセージ送信可能
CREATE POLICY "Trade participants can send messages"
ON trade_messages FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM trades t
    WHERE t.id = trade_messages.trade_id
    AND (t.user1_id = auth.uid() OR t.user2_id = auth.uid())
    AND t.status IN ('negotiating', 'user1_ready', 'user2_ready')
  )
);

-- ========================================
-- friendships テーブル
-- ========================================
-- 自分が関係するフレンドシップは閲覧可能
CREATE POLICY "Users can view their own friendships"
ON friendships FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR friend_id = auth.uid());

-- 自分からのフレンドリクエストのみ作成可能
CREATE POLICY "Users can create friendship requests"
ON friendships FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() AND status = 'pending');

-- 自分が関係するフレンドシップのみ更新可能
CREATE POLICY "Users can update their own friendships"
ON friendships FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR friend_id = auth.uid())
WITH CHECK (user_id = auth.uid() OR friend_id = auth.uid());

-- 自分からのフレンドシップのみ削除可能
CREATE POLICY "Users can delete their own friendships"
ON friendships FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ========================================
-- posts テーブル
-- ========================================
-- 公開投稿は誰でも閲覧可能
CREATE POLICY "Users can view public posts"
ON posts FOR SELECT
TO authenticated
USING (visibility = 'public');

-- フレンド限定投稿はフレンドのみ閲覧可能
CREATE POLICY "Friends can view friends-only posts"
ON posts FOR SELECT
TO authenticated
USING (
  visibility = 'friends' AND
  EXISTS (
    SELECT 1 FROM friendships f
    WHERE f.status = 'accepted'
    AND ((f.user_id = auth.uid() AND f.friend_id = posts.user_id)
      OR (f.friend_id = auth.uid() AND f.user_id = posts.user_id))
  )
);

-- 自分の投稿は常に閲覧可能
CREATE POLICY "Users can view their own posts"
ON posts FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 自分の投稿のみ作成・更新・削除可能
CREATE POLICY "Users can create their own posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ========================================
-- reactions テーブル
-- ========================================
-- リアクションは誰でも閲覧可能
CREATE POLICY "Everyone can view reactions"
ON reactions FOR SELECT
TO authenticated
USING (true);

-- 自分のリアクションのみ作成・削除可能
CREATE POLICY "Users can create their own reactions"
ON reactions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own reactions"
ON reactions FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ========================================
-- charms テーブル（マスターデータ）
-- ========================================
-- 全員が閲覧可能
CREATE POLICY "Everyone can view charms"
ON charms FOR SELECT
TO authenticated
USING (true);

-- ========================================
-- user_charms テーブル
-- ========================================
-- 自分の所持チャームは閲覧可能
CREATE POLICY "Users can view their own charms"
ON user_charms FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 自分の所持チャームのみ操作可能
CREATE POLICY "Users can manage their own charms"
ON user_charms FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ========================================
-- themes テーブル（マスターデータ）
-- ========================================
-- 全員が閲覧可能
CREATE POLICY "Everyone can view themes"
ON themes FOR SELECT
TO authenticated
USING (true);

-- ========================================
-- user_themes テーブル
-- ========================================
-- 自分の所持テーマは閲覧可能
CREATE POLICY "Users can view their own themes"
ON user_themes FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 自分の所持テーマのみ操作可能
CREATE POLICY "Users can manage their own themes"
ON user_themes FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ========================================
-- gacha_history テーブル
-- ========================================
-- 自分のガチャ履歴のみ閲覧可能
CREATE POLICY "Users can view their own gacha history"
ON gacha_history FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 自分のガチャ履歴のみ作成可能
CREATE POLICY "Users can create their own gacha history"
ON gacha_history FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- ========================================
-- reports テーブル
-- ========================================
-- 自分の通報は閲覧可能
CREATE POLICY "Users can view their own reports"
ON reports FOR SELECT
TO authenticated
USING (reporter_id = auth.uid());

-- 自分の通報のみ作成可能
CREATE POLICY "Users can create reports"
ON reports FOR INSERT
TO authenticated
WITH CHECK (reporter_id = auth.uid());

-- ========================================
-- ヘルパー関数
-- ========================================
-- フレンドかどうかを判定する関数
CREATE OR REPLACE FUNCTION is_friend(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM friendships
    WHERE status = 'accepted'
    AND ((user_id = auth.uid() AND friend_id = target_user_id)
      OR (friend_id = auth.uid() AND user_id = target_user_id))
  );
END;
$$;

-- ブロックされているかを判定する関数
CREATE OR REPLACE FUNCTION is_blocked(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM friendships
    WHERE status = 'blocked'
    AND ((user_id = auth.uid() AND friend_id = target_user_id)
      OR (friend_id = auth.uid() AND user_id = target_user_id))
  );
END;
$$;
