-- ポケシル データベーステーブル作成
-- CLAUDE.md仕様に基づくテーブル設計

-- ========================================
-- 拡張機能の有効化
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- profiles テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  star_points INTEGER DEFAULT 0,
  total_stickers INTEGER DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  selected_charm_id UUID,
  selected_theme_id UUID,
  tutorial_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- sticker_books テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS sticker_books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  theme_id UUID,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- sticker_book_pages テーブル
-- ========================================
CREATE TYPE page_type AS ENUM ('cover', 'page', 'back-cover');
CREATE TYPE page_side AS ENUM ('left', 'right');

CREATE TABLE IF NOT EXISTS sticker_book_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  book_id UUID REFERENCES sticker_books(id) ON DELETE CASCADE NOT NULL,
  page_number INTEGER NOT NULL,
  page_type page_type NOT NULL,
  side page_side,
  spread_id VARCHAR(100),
  theme_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, page_number)
);

-- ========================================
-- stickers テーブル（マスターデータ）
-- ========================================
CREATE TYPE sticker_type AS ENUM ('normal', 'puffy', 'sparkle');

CREATE TABLE IF NOT EXISTS stickers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  rarity INTEGER CHECK (rarity BETWEEN 1 AND 5) NOT NULL,
  type sticker_type NOT NULL,
  series VARCHAR(100),
  base_rate INTEGER DEFAULT 100,
  gacha_weight INTEGER DEFAULT 100,
  is_limited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- user_stickers テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS user_stickers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sticker_id UUID REFERENCES stickers(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_acquired INTEGER DEFAULT 1,
  rank INTEGER DEFAULT 1,
  first_acquired_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, sticker_id)
);

-- ========================================
-- sticker_placements テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS sticker_placements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES sticker_book_pages(id) ON DELETE CASCADE NOT NULL,
  user_sticker_id UUID REFERENCES user_stickers(id) ON DELETE CASCADE NOT NULL,
  position_x NUMERIC(5, 4) CHECK (position_x BETWEEN 0 AND 1) NOT NULL,
  position_y NUMERIC(5, 4) CHECK (position_y BETWEEN 0 AND 1) NOT NULL,
  rotation INTEGER DEFAULT 0,
  scale NUMERIC(3, 2) DEFAULT 1.0,
  z_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- trades テーブル
-- ========================================
CREATE TYPE trade_status AS ENUM ('matching', 'negotiating', 'user1_ready', 'user2_ready', 'completed', 'cancelled');

CREATE TABLE IF NOT EXISTS trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status trade_status DEFAULT 'matching',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- trade_items テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS trade_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user_sticker_id UUID REFERENCES user_stickers(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- trade_messages テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS trade_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message_type VARCHAR(20) DEFAULT 'stamp',
  stamp_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- friendships テーブル
-- ========================================
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked');

CREATE TABLE IF NOT EXISTS friendships (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status friendship_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- ========================================
-- posts テーブル
-- ========================================
CREATE TYPE post_visibility AS ENUM ('public', 'friends', 'private');

CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  page_id UUID REFERENCES sticker_book_pages(id) ON DELETE SET NULL,
  image_url TEXT,
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  visibility post_visibility DEFAULT 'public',
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- reactions テーブル
-- ========================================
CREATE TYPE reaction_type AS ENUM ('like', 'sparkle', 'hot', 'cute');

CREATE TABLE IF NOT EXISTS reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type reaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, type)
);

-- ========================================
-- charms テーブル（マスターデータ）
-- ========================================
CREATE TABLE IF NOT EXISTS charms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  color VARCHAR(20) NOT NULL,
  unlock_condition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- user_charms テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS user_charms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  charm_id UUID REFERENCES charms(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, charm_id)
);

-- ========================================
-- themes テーブル（マスターデータ）
-- ========================================
CREATE TABLE IF NOT EXISTS themes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  cover_config JSONB NOT NULL,
  page_config JSONB NOT NULL,
  unlock_condition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- user_themes テーブル
-- ========================================
CREATE TABLE IF NOT EXISTS user_themes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  theme_id UUID REFERENCES themes(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, theme_id)
);

-- ========================================
-- gacha_history テーブル
-- ========================================
CREATE TYPE gacha_type AS ENUM ('normal', 'premium', 'event', 'collab');

CREATE TABLE IF NOT EXISTS gacha_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  gacha_type gacha_type NOT NULL,
  sticker_id UUID REFERENCES stickers(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- reports テーブル
-- ========================================
CREATE TYPE report_target_type AS ENUM ('user', 'post', 'trade');
CREATE TYPE report_category AS ENUM ('spam', 'inappropriate', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved');

CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  target_type report_target_type NOT NULL,
  target_id UUID NOT NULL,
  category report_category NOT NULL,
  description TEXT,
  status report_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- インデックス
-- ========================================
CREATE INDEX idx_sticker_books_user_id ON sticker_books(user_id);
CREATE INDEX idx_sticker_book_pages_book_id ON sticker_book_pages(book_id);
CREATE INDEX idx_user_stickers_user_id ON user_stickers(user_id);
CREATE INDEX idx_user_stickers_sticker_id ON user_stickers(sticker_id);
CREATE INDEX idx_sticker_placements_page_id ON sticker_placements(page_id);
CREATE INDEX idx_trades_user1_id ON trades(user1_id);
CREATE INDEX idx_trades_user2_id ON trades(user2_id);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trade_items_trade_id ON trade_items(trade_id);
CREATE INDEX idx_trade_messages_trade_id ON trade_messages(trade_id);
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_visibility ON posts(visibility);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_reactions_post_id ON reactions(post_id);
CREATE INDEX idx_gacha_history_user_id ON gacha_history(user_id);
CREATE INDEX idx_gacha_history_created_at ON gacha_history(created_at DESC);

-- ========================================
-- トリガー: updated_at自動更新
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sticker_books_updated_at
  BEFORE UPDATE ON sticker_books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sticker_book_pages_updated_at
  BEFORE UPDATE ON sticker_book_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stickers_updated_at
  BEFORE UPDATE ON stickers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stickers_updated_at
  BEFORE UPDATE ON user_stickers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sticker_placements_updated_at
  BEFORE UPDATE ON sticker_placements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON trades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 外部キー参照（遅延追加）
-- ========================================
ALTER TABLE profiles
  ADD CONSTRAINT fk_profiles_selected_charm
  FOREIGN KEY (selected_charm_id) REFERENCES charms(id) ON DELETE SET NULL;

ALTER TABLE profiles
  ADD CONSTRAINT fk_profiles_selected_theme
  FOREIGN KEY (selected_theme_id) REFERENCES themes(id) ON DELETE SET NULL;

ALTER TABLE sticker_books
  ADD CONSTRAINT fk_sticker_books_theme
  FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE SET NULL;
