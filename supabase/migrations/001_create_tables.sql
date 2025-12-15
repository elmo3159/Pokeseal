-- =============================================
-- Pokeseal データベース初期化スクリプト
-- Supabase SQL Editorで実行してください
-- =============================================

-- pgcrypto拡張機能を有効化（gen_random_uuid用）
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. プロフィールテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  star_points INTEGER DEFAULT 0,
  total_stickers INTEGER DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  selected_charm_id TEXT,
  selected_theme_id TEXT,
  tutorial_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. シールマスターデータテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS stickers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  rarity INTEGER NOT NULL CHECK (rarity >= 1 AND rarity <= 5),
  type TEXT NOT NULL CHECK (type IN ('normal', 'puffy', 'sparkle')),
  series TEXT,
  base_rate INTEGER DEFAULT 100,
  gacha_weight INTEGER DEFAULT 10,
  is_limited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. ユーザー所持シールテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS user_stickers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sticker_id TEXT NOT NULL REFERENCES stickers(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  total_acquired INTEGER DEFAULT 1,
  rank INTEGER DEFAULT 1,
  first_acquired_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, sticker_id)
);

-- =============================================
-- 4. 交換セッションテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id TEXT, -- マッチング待機中は空文字列
  status TEXT NOT NULL DEFAULT 'matching' CHECK (
    status IN ('matching', 'negotiating', 'user1_ready', 'user2_ready', 'completed', 'cancelled')
  ),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. 交換アイテムテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS trade_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_sticker_id UUID NOT NULL REFERENCES user_stickers(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. 交換メッセージテーブル（スタンプ）
-- =============================================
CREATE TABLE IF NOT EXISTS trade_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL DEFAULT 'stamp' CHECK (message_type = 'stamp'),
  stamp_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. シール帳テーブル
-- =============================================
CREATE TABLE IF NOT EXISTS sticker_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'マイシール帳',
  theme_id TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 8. シール帳ページテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS sticker_book_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES sticker_books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  page_type TEXT NOT NULL CHECK (page_type IN ('cover', 'page', 'back-cover')),
  side TEXT CHECK (side IN ('left', 'right')),
  spread_id TEXT,
  theme_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 9. シール配置テーブル
-- =============================================
CREATE TABLE IF NOT EXISTS sticker_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES sticker_book_pages(id) ON DELETE CASCADE,
  user_sticker_id UUID NOT NULL REFERENCES user_stickers(id) ON DELETE CASCADE,
  position_x DECIMAL NOT NULL,
  position_y DECIMAL NOT NULL,
  rotation DECIMAL DEFAULT 0,
  scale DECIMAL DEFAULT 1,
  z_index INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 10. フレンドシップテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- =============================================
-- 11. 投稿テーブル
-- =============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  page_id UUID REFERENCES sticker_book_pages(id) ON DELETE SET NULL,
  image_url TEXT,
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 12. リアクションテーブル
-- =============================================
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'sparkle', 'hot', 'cute')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, type)
);

-- =============================================
-- 13. ガチャ履歴テーブル
-- =============================================
CREATE TABLE IF NOT EXISTS gacha_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  gacha_type TEXT NOT NULL CHECK (gacha_type IN ('normal', 'premium', 'event', 'collab')),
  sticker_id TEXT NOT NULL REFERENCES stickers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 14. 通報テーブル
-- =============================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('user', 'post', 'trade')),
  target_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('spam', 'inappropriate', 'other')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- インデックス作成
-- =============================================
CREATE INDEX IF NOT EXISTS idx_user_stickers_user_id ON user_stickers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stickers_sticker_id ON user_stickers(sticker_id);
CREATE INDEX IF NOT EXISTS idx_trades_user1_id ON trades(user1_id);
CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trade_items_trade_id ON trade_items(trade_id);
CREATE INDEX IF NOT EXISTS idx_trade_messages_trade_id ON trade_messages(trade_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);

-- =============================================
-- 交換回数インクリメント関数
-- =============================================
CREATE OR REPLACE FUNCTION increment_trade_count(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET total_trades = total_trades + 1,
      updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 更新日時自動更新トリガー
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガーを適用
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['profiles', 'stickers', 'user_stickers', 'trades', 'sticker_books', 'sticker_book_pages', 'sticker_placements', 'friendships', 'posts', 'reports'])
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
    ', t, t, t, t);
  END LOOP;
END;
$$;

-- =============================================
-- Row Level Security (RLS) ポリシー
-- =============================================

-- プロフィール: 誰でも閲覧可、本人のみ更新可
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ユーザーシール: 本人のみアクセス可
ALTER TABLE user_stickers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own stickers" ON user_stickers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stickers" ON user_stickers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stickers" ON user_stickers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stickers" ON user_stickers FOR DELETE USING (auth.uid() = user_id);

-- 交換: 参加者のみアクセス可
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trade participants can view" ON trades FOR SELECT USING (
  auth.uid() = user1_id OR auth.uid()::text = user2_id
);
CREATE POLICY "Anyone can create trade" ON trades FOR INSERT WITH CHECK (auth.uid() = user1_id);
CREATE POLICY "Trade participants can update" ON trades FOR UPDATE USING (
  auth.uid() = user1_id OR auth.uid()::text = user2_id
);

-- 投稿: 公開投稿は誰でも閲覧可
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public posts are viewable by everyone" ON posts FOR SELECT USING (
  visibility = 'public' OR auth.uid() = user_id
);
CREATE POLICY "Users can create own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);

-- シールマスターデータ: 誰でも閲覧可
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stickers are viewable by everyone" ON stickers FOR SELECT USING (true);
