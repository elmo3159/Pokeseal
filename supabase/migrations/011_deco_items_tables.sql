-- =============================================
-- Migration: deco_items & deco_placements tables
-- デコアイテムのマスターデータと配置データを管理
-- =============================================

-- 1. デコアイテムマスターテーブル
CREATE TABLE IF NOT EXISTS deco_items (
  id TEXT PRIMARY KEY,  -- 'lace-hime-1' のような識別子
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tape', 'lace', 'stamp', 'glitter', 'frame')),
  image_url TEXT NOT NULL,
  base_width INTEGER NOT NULL DEFAULT 50,
  base_height INTEGER NOT NULL DEFAULT 50,
  rotatable BOOLEAN NOT NULL DEFAULT TRUE,
  rarity INTEGER NOT NULL DEFAULT 1 CHECK (rarity >= 1 AND rarity <= 5),
  obtain_method TEXT NOT NULL DEFAULT 'default' CHECK (obtain_method IN ('default', 'gacha', 'event', 'purchase')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. デコ配置テーブル（sticker_placementsと同様の構造）
CREATE TABLE IF NOT EXISTS deco_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES sticker_book_pages(id) ON DELETE CASCADE,
  deco_item_id TEXT NOT NULL REFERENCES deco_items(id) ON DELETE CASCADE,
  position_x NUMERIC(10, 6) NOT NULL DEFAULT 0.5,  -- 相対座標 (0-1)
  position_y NUMERIC(10, 6) NOT NULL DEFAULT 0.5,  -- 相対座標 (0-1)
  rotation NUMERIC(10, 2) NOT NULL DEFAULT 0,       -- 回転角度
  width NUMERIC(10, 2) NOT NULL DEFAULT 60,         -- 表示幅 (px)
  height NUMERIC(10, 2) NOT NULL DEFAULT 60,        -- 表示高さ (px)
  z_index INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_deco_placements_page_id ON deco_placements(page_id);
CREATE INDEX IF NOT EXISTS idx_deco_items_type ON deco_items(type);

-- RLSを無効化（開発用）
ALTER TABLE deco_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deco_placements ENABLE ROW LEVEL SECURITY;

-- すべてのユーザーがデコアイテムマスターを読める
CREATE POLICY "Anyone can read deco_items"
  ON deco_items FOR SELECT
  USING (true);

-- 自分のシール帳ページのデコを管理できる
CREATE POLICY "Users can manage own deco_placements"
  ON deco_placements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM sticker_book_pages sbp
      JOIN sticker_books sb ON sbp.book_id = sb.id
      WHERE sbp.id = deco_placements.page_id
      AND sb.user_id = auth.uid()
    )
  );

-- 公開シール帳のデコは誰でも見れる
CREATE POLICY "Anyone can view public book deco_placements"
  ON deco_placements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sticker_book_pages sbp
      JOIN sticker_books sb ON sbp.book_id = sb.id
      WHERE sbp.id = deco_placements.page_id
      AND sb.is_public = true
    )
  );

-- =============================================
-- 3. デフォルトデコアイテムをシード
-- =============================================

-- レース - 姫系 (hime)
INSERT INTO deco_items (id, name, type, image_url, base_width, base_height, rotatable, rarity, obtain_method) VALUES
  ('lace-hime-1', '姫レース1', 'lace', '/images/deco/lace/hime/hime_1.png', 150, 40, TRUE, 2, 'default'),
  ('lace-hime-2', '姫レース2', 'lace', '/images/deco/lace/hime/hime_2.png', 150, 40, TRUE, 2, 'default'),
  ('lace-hime-3', '姫レース3', 'lace', '/images/deco/lace/hime/hime_3.png', 150, 40, TRUE, 2, 'default'),
  ('lace-hime-4', '姫レース4', 'lace', '/images/deco/lace/hime/hime_4.png', 150, 40, TRUE, 3, 'default'),
  ('lace-hime-5', '姫レース5', 'lace', '/images/deco/lace/hime/hime_5.png', 150, 40, TRUE, 3, 'default'),
  ('lace-hime-6', '姫レース6', 'lace', '/images/deco/lace/hime/hime_6.png', 150, 40, TRUE, 3, 'default')
ON CONFLICT (id) DO NOTHING;

-- レース - 姫系2 (hime2)
INSERT INTO deco_items (id, name, type, image_url, base_width, base_height, rotatable, rarity, obtain_method) VALUES
  ('lace-hime2-1', 'プリンセス1', 'lace', '/images/deco/lace/hime2/hime2_1.png', 150, 40, TRUE, 2, 'default'),
  ('lace-hime2-2', 'プリンセス2', 'lace', '/images/deco/lace/hime2/hime2_2.png', 150, 40, TRUE, 2, 'default'),
  ('lace-hime2-3', 'プリンセス3', 'lace', '/images/deco/lace/hime2/hime2_3.png', 150, 40, TRUE, 2, 'default'),
  ('lace-hime2-4', 'プリンセス4', 'lace', '/images/deco/lace/hime2/hime2_4.png', 150, 40, TRUE, 3, 'default'),
  ('lace-hime2-5', 'プリンセス5', 'lace', '/images/deco/lace/hime2/hime2_5.png', 150, 40, TRUE, 3, 'default'),
  ('lace-hime2-6', 'プリンセス6', 'lace', '/images/deco/lace/hime2/hime2_6.png', 150, 40, TRUE, 3, 'default')
ON CONFLICT (id) DO NOTHING;

-- レース - 地雷系 (jirai)
INSERT INTO deco_items (id, name, type, image_url, base_width, base_height, rotatable, rarity, obtain_method) VALUES
  ('lace-jirai-1', '地雷レース1', 'lace', '/images/deco/lace/jirai/jirai_1.png', 150, 40, TRUE, 2, 'default'),
  ('lace-jirai-2', '地雷レース2', 'lace', '/images/deco/lace/jirai/jirai_2.png', 150, 40, TRUE, 2, 'default'),
  ('lace-jirai-3', '地雷レース3', 'lace', '/images/deco/lace/jirai/jirai_3.png', 150, 40, TRUE, 2, 'default'),
  ('lace-jirai-4', '地雷レース4', 'lace', '/images/deco/lace/jirai/jirai_4.png', 150, 40, TRUE, 3, 'default'),
  ('lace-jirai-5', '地雷レース5', 'lace', '/images/deco/lace/jirai/jirai_5.png', 150, 40, TRUE, 3, 'default'),
  ('lace-jirai-6', '地雷レース6', 'lace', '/images/deco/lace/jirai/jirai_6.png', 150, 40, TRUE, 3, 'default')
ON CONFLICT (id) DO NOTHING;

-- レース - キッズ (kids)
INSERT INTO deco_items (id, name, type, image_url, base_width, base_height, rotatable, rarity, obtain_method) VALUES
  ('lace-kids-1', 'ポップレース1', 'lace', '/images/deco/lace/kids/kids_1.png', 150, 40, TRUE, 1, 'default'),
  ('lace-kids-2', 'ポップレース2', 'lace', '/images/deco/lace/kids/kids_2.png', 150, 40, TRUE, 1, 'default'),
  ('lace-kids-3', 'ポップレース3', 'lace', '/images/deco/lace/kids/kids_3.png', 150, 40, TRUE, 1, 'default'),
  ('lace-kids-4', 'ポップレース4', 'lace', '/images/deco/lace/kids/kids_4.png', 150, 40, TRUE, 2, 'default'),
  ('lace-kids-5', 'ポップレース5', 'lace', '/images/deco/lace/kids/kids_5.png', 150, 40, TRUE, 2, 'default'),
  ('lace-kids-6', 'ポップレース6', 'lace', '/images/deco/lace/kids/kids_6.png', 150, 40, TRUE, 2, 'default')
ON CONFLICT (id) DO NOTHING;

-- レース - キッズ2 (kids2)
INSERT INTO deco_items (id, name, type, image_url, base_width, base_height, rotatable, rarity, obtain_method) VALUES
  ('lace-kids2-1', 'にじレース1', 'lace', '/images/deco/lace/kids2/kids2_1.png', 150, 40, TRUE, 1, 'default'),
  ('lace-kids2-2', 'にじレース2', 'lace', '/images/deco/lace/kids2/kids2_2.png', 150, 40, TRUE, 1, 'default'),
  ('lace-kids2-3', 'にじレース3', 'lace', '/images/deco/lace/kids2/kids2_3.png', 150, 40, TRUE, 1, 'default'),
  ('lace-kids2-4', 'にじレース4', 'lace', '/images/deco/lace/kids2/kids2_4.png', 150, 40, TRUE, 2, 'default'),
  ('lace-kids2-5', 'にじレース5', 'lace', '/images/deco/lace/kids2/kids2_5.png', 150, 40, TRUE, 2, 'default'),
  ('lace-kids2-6', 'にじレース6', 'lace', '/images/deco/lace/kids2/kids2_6.png', 150, 40, TRUE, 2, 'default')
ON CONFLICT (id) DO NOTHING;

-- スタンプ
INSERT INTO deco_items (id, name, type, image_url, base_width, base_height, rotatable, rarity, obtain_method) VALUES
  ('stamp-1', 'スタンプ1', 'stamp', '/images/deco/stamp/stamp/stamp_1.png', 50, 50, TRUE, 1, 'default'),
  ('stamp-2', 'スタンプ2', 'stamp', '/images/deco/stamp/stamp/stamp_2.png', 50, 50, TRUE, 1, 'default'),
  ('stamp-3', 'スタンプ3', 'stamp', '/images/deco/stamp/stamp/stamp_3.png', 50, 50, TRUE, 1, 'default'),
  ('stamp-4', 'スタンプ4', 'stamp', '/images/deco/stamp/stamp/stamp_4.png', 50, 50, TRUE, 1, 'default'),
  ('stamp-5', 'スタンプ5', 'stamp', '/images/deco/stamp/stamp/stamp_5.png', 50, 50, TRUE, 2, 'default'),
  ('stamp-6', 'スタンプ6', 'stamp', '/images/deco/stamp/stamp/stamp_6.png', 50, 50, TRUE, 2, 'default'),
  ('stamp-7', 'スタンプ7', 'stamp', '/images/deco/stamp/stamp/stamp_7.png', 50, 50, TRUE, 2, 'default'),
  ('stamp-8', 'スタンプ8', 'stamp', '/images/deco/stamp/stamp/stamp_8.png', 50, 50, TRUE, 2, 'default'),
  ('stamp-9', 'スタンプ9', 'stamp', '/images/deco/stamp/stamp/stamp_9.png', 50, 50, TRUE, 2, 'default'),
  ('stamp-10', 'スタンプ10', 'stamp', '/images/deco/stamp/stamp/stamp_10.png', 50, 50, TRUE, 2, 'default'),
  ('stamp-11', 'スタンプ11', 'stamp', '/images/deco/stamp/stamp/stamp_11.png', 50, 50, TRUE, 3, 'default'),
  ('stamp-12', 'スタンプ12', 'stamp', '/images/deco/stamp/stamp/stamp_12.png', 50, 50, TRUE, 3, 'default'),
  ('stamp-13', 'スタンプ13', 'stamp', '/images/deco/stamp/stamp/stamp_13.png', 50, 50, TRUE, 3, 'default'),
  ('stamp-14', 'スタンプ14', 'stamp', '/images/deco/stamp/stamp/stamp_14.png', 50, 50, TRUE, 3, 'default'),
  ('stamp-15', 'スタンプ15', 'stamp', '/images/deco/stamp/stamp/stamp_15.png', 50, 50, TRUE, 3, 'default'),
  ('stamp-16', 'スタンプ16', 'stamp', '/images/deco/stamp/stamp/stamp_16.png', 50, 50, TRUE, 3, 'default')
ON CONFLICT (id) DO NOTHING;
