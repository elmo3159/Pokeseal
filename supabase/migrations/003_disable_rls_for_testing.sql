-- =============================================
-- テスト用: RLSを無効化
-- 本番環境では実行しないでください！
-- =============================================

-- 全テーブルのRLSを無効化（テスト用）
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_stickers DISABLE ROW LEVEL SECURITY;
ALTER TABLE trades DISABLE ROW LEVEL SECURITY;
ALTER TABLE trade_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE trade_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE sticker_books DISABLE ROW LEVEL SECURITY;
ALTER TABLE sticker_book_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE sticker_placements DISABLE ROW LEVEL SECURITY;
ALTER TABLE friendships DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE reactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE stickers DISABLE ROW LEVEL SECURITY;
ALTER TABLE gacha_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- 確認メッセージ
DO $$
BEGIN
  RAISE NOTICE '⚠️ RLSが無効化されました（テストモード）';
  RAISE NOTICE '本番環境では001_create_tables.sqlのRLSポリシーを再度適用してください';
END;
$$;
