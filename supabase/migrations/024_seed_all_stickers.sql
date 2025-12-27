-- =============================================
-- シールマスターデータの更新マイグレーション
-- 全45キャラクター × 合計1,156枚のシールを追加
-- =============================================

-- 既存のシールマスターデータを削除（user_stickersとの関連は維持）
-- 注意: user_stickersに存在しないsticker_idは外部キー制約違反になる可能性あり
-- そのため、既存データはUPSERTで更新し、新規データのみINSERTする

-- sticker_type カラムを追加（まだ存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stickers' AND column_name = 'sticker_type'
  ) THEN
    ALTER TABLE stickers ADD COLUMN sticker_type TEXT DEFAULT 'classic';
  END IF;
END;
$$;

-- 全シールデータの投入（UPSERT）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-1', 'いちごにゃん #1', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_1.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-2', 'いちごにゃん #2', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_2.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-3', 'いちごにゃん #3', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_3.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-4', 'いちごにゃん #4', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_4.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-5', 'いちごにゃん #5', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_5.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-6', 'いちごにゃん #6', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_6.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-7', 'いちごにゃん #7', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_7.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-8', 'いちごにゃん #8', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_8.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-9', 'いちごにゃん #9', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_9.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-10', 'いちごにゃん #10', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_10.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-11', 'いちごにゃん #11', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_11.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-12', 'いちごにゃん #12', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_12.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-13', 'いちごにゃん #13', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_13.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-14', 'いちごにゃん #14', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_14.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-bondro-15', 'いちごにゃん #15', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_15.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-1', 'いちごにゃん #16', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_16.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-2', 'いちごにゃん #17', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_17.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-3', 'いちごにゃん #18', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_18.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-4', 'いちごにゃん #19', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_19.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-5', 'いちごにゃん #20', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_20.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-6', 'いちごにゃん #21', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_21.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-7', 'いちごにゃん #22', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_22.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-8', 'いちごにゃん #23', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_23.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-9', 'いちごにゃん #24', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_24.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-10', 'いちごにゃん #25', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_25.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-11', 'いちごにゃん #26', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_26.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-12', 'いちごにゃん #27', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_27.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-13', 'いちごにゃん #28', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_28.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-14', 'いちごにゃん #29', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_29.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('いちごにゃん-marshmallow-15', 'いちごにゃん #30', '/stickers/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%84%E3%81%A1%E3%81%94%E3%81%AB%E3%82%83%E3%82%93_30.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-1', 'きらきらシャボンうさぎ #1', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_1.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-2', 'きらきらシャボンうさぎ #2', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_2.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-3', 'きらきらシャボンうさぎ #3', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_3.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-4', 'きらきらシャボンうさぎ #4', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_4.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-5', 'きらきらシャボンうさぎ #5', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_5.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-6', 'きらきらシャボンうさぎ #6', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_6.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-7', 'きらきらシャボンうさぎ #7', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_7.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-8', 'きらきらシャボンうさぎ #8', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_8.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-9', 'きらきらシャボンうさぎ #9', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_9.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-10', 'きらきらシャボンうさぎ #10', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_10.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-11', 'きらきらシャボンうさぎ #11', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_11.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-12', 'きらきらシャボンうさぎ #12', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_12.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-13', 'きらきらシャボンうさぎ #13', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_13.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-14', 'きらきらシャボンうさぎ #14', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_14.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-bondro-15', 'きらきらシャボンうさぎ #15', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_15.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-1', 'きらきらシャボンうさぎ #16', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_16.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-2', 'きらきらシャボンうさぎ #17', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_17.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-3', 'きらきらシャボンうさぎ #18', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_18.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-4', 'きらきらシャボンうさぎ #19', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_19.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-5', 'きらきらシャボンうさぎ #20', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_20.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-6', 'きらきらシャボンうさぎ #21', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_21.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-7', 'きらきらシャボンうさぎ #22', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_22.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-8', 'きらきらシャボンうさぎ #23', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_23.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-9', 'きらきらシャボンうさぎ #24', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_24.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-10', 'きらきらシャボンうさぎ #25', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_25.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-11', 'きらきらシャボンうさぎ #26', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_26.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-12', 'きらきらシャボンうさぎ #27', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_27.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-13', 'きらきらシャボンうさぎ #28', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_28.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-14', 'きらきらシャボンうさぎ #29', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_29.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらきらシャボンうさぎ-marshmallow-15', 'きらきらシャボンうさぎ #30', '/stickers/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%8D%E3%82%89%E3%82%B7%E3%83%A3%E3%83%9C%E3%83%B3%E3%81%86%E3%81%95%E3%81%8E_30.png', 4, 'puffy', 'きらきらコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-1', 'きらぼし #1', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_1.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-2', 'きらぼし #2', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_2.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-3', 'きらぼし #3', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_3.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-4', 'きらぼし #4', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_4.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-5', 'きらぼし #5', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_5.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-6', 'きらぼし #6', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_6.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-7', 'きらぼし #7', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_7.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-8', 'きらぼし #8', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_8.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-9', 'きらぼし #9', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_9.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-10', 'きらぼし #10', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_10.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-11', 'きらぼし #11', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_11.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-12', 'きらぼし #12', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_12.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-13', 'きらぼし #13', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_13.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-14', 'きらぼし #14', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_14.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-bondro-15', 'きらぼし #15', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_15.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-1', 'きらぼし #16', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_16.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-2', 'きらぼし #17', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_17.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-3', 'きらぼし #18', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_18.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-4', 'きらぼし #19', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_19.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-5', 'きらぼし #20', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_20.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-6', 'きらぼし #21', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_21.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-7', 'きらぼし #22', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_22.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-8', 'きらぼし #23', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_23.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-9', 'きらぼし #24', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_24.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-10', 'きらぼし #25', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_25.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-11', 'きらぼし #26', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_26.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-12', 'きらぼし #27', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_27.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-13', 'きらぼし #28', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_28.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-14', 'きらぼし #29', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_29.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('きらぼし-marshmallow-15', 'きらぼし #30', '/stickers/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8D%E3%82%89%E3%81%BC%E3%81%97_30.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-1', 'くまグミ #1', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_1.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-2', 'くまグミ #2', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_2.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-3', 'くまグミ #3', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_3.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-4', 'くまグミ #4', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_4.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-5', 'くまグミ #5', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_5.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-6', 'くまグミ #6', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_6.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-7', 'くまグミ #7', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_7.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-8', 'くまグミ #8', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_8.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-9', 'くまグミ #9', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_9.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-10', 'くまグミ #10', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_10.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-11', 'くまグミ #11', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_11.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-12', 'くまグミ #12', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_12.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-13', 'くまグミ #13', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_13.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-14', 'くまグミ #14', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_14.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-bondro-15', 'くまグミ #15', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_15.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-1', 'くまグミ #16', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_16.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-2', 'くまグミ #17', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_17.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-3', 'くまグミ #18', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_18.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-4', 'くまグミ #19', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_19.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-5', 'くまグミ #20', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_20.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-6', 'くまグミ #21', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_21.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-7', 'くまグミ #22', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_22.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-8', 'くまグミ #23', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_23.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-9', 'くまグミ #24', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_24.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-10', 'くまグミ #25', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_25.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-11', 'くまグミ #26', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_26.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-12', 'くまグミ #27', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_27.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-13', 'くまグミ #28', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_28.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-14', 'くまグミ #29', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_29.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('くまグミ-marshmallow-15', 'くまグミ #30', '/stickers/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%8F%E3%81%BE%E3%82%B0%E3%83%9F_30.png', 2, 'normal', 'スイーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-1', 'けいとにゃん #1', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_1.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-2', 'けいとにゃん #2', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_2.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-3', 'けいとにゃん #3', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_3.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-4', 'けいとにゃん #4', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_4.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-5', 'けいとにゃん #5', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_5.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-6', 'けいとにゃん #6', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_6.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-7', 'けいとにゃん #7', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_7.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-8', 'けいとにゃん #8', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_8.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-9', 'けいとにゃん #9', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_9.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-10', 'けいとにゃん #10', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_10.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-11', 'けいとにゃん #11', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_11.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-12', 'けいとにゃん #12', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_12.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-13', 'けいとにゃん #13', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_13.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-14', 'けいとにゃん #14', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_14.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-bondro-15', 'けいとにゃん #15', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_15.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-1', 'けいとにゃん #16', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_16.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-2', 'けいとにゃん #17', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_17.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-3', 'けいとにゃん #18', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_18.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-4', 'けいとにゃん #19', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_19.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-5', 'けいとにゃん #20', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_20.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-6', 'けいとにゃん #21', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_21.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-7', 'けいとにゃん #22', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_22.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-8', 'けいとにゃん #23', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_23.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-9', 'けいとにゃん #24', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_24.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-10', 'けいとにゃん #25', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_25.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-11', 'けいとにゃん #26', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_26.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-12', 'けいとにゃん #27', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_27.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-13', 'けいとにゃん #28', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_28.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-14', 'けいとにゃん #29', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_29.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('けいとにゃん-marshmallow-15', 'けいとにゃん #30', '/stickers/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%91%E3%81%84%E3%81%A8%E3%81%AB%E3%82%83%E3%82%93_30.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-1', 'ころりんご #1', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_1.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-2', 'ころりんご #2', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_2.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-3', 'ころりんご #3', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_3.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-4', 'ころりんご #4', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_4.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-5', 'ころりんご #5', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_5.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-6', 'ころりんご #6', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_6.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-7', 'ころりんご #7', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_7.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-8', 'ころりんご #8', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_8.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-9', 'ころりんご #9', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_9.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-10', 'ころりんご #10', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_10.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-11', 'ころりんご #11', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_11.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-12', 'ころりんご #12', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_12.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-13', 'ころりんご #13', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_13.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-14', 'ころりんご #14', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_14.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-bondro-15', 'ころりんご #15', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_15.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-1', 'ころりんご #16', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_16.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-2', 'ころりんご #17', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_17.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-3', 'ころりんご #18', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_18.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-4', 'ころりんご #19', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_19.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-5', 'ころりんご #20', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_20.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-6', 'ころりんご #21', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_21.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-7', 'ころりんご #22', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_22.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-8', 'ころりんご #23', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_23.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-9', 'ころりんご #24', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_24.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-10', 'ころりんご #25', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_25.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-11', 'ころりんご #26', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_26.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-12', 'ころりんご #27', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_27.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-13', 'ころりんご #28', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_28.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-14', 'ころりんご #29', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_29.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ころりんご-marshmallow-15', 'ころりんご #30', '/stickers/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%93%E3%82%8D%E3%82%8A%E3%82%93%E3%81%94_30.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-1', 'さくらんぼーず #1', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_1.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-2', 'さくらんぼーず #2', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_2.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-3', 'さくらんぼーず #3', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_3.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-4', 'さくらんぼーず #4', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_4.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-5', 'さくらんぼーず #5', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_5.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-6', 'さくらんぼーず #6', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_6.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-7', 'さくらんぼーず #7', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_7.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-8', 'さくらんぼーず #8', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_8.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-9', 'さくらんぼーず #9', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_9.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-10', 'さくらんぼーず #10', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_10.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-11', 'さくらんぼーず #11', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_11.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-12', 'さくらんぼーず #12', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_12.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-13', 'さくらんぼーず #13', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_13.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-14', 'さくらんぼーず #14', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_14.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-bondro-15', 'さくらんぼーず #15', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_15.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-1', 'さくらんぼーず #16', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_16.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-2', 'さくらんぼーず #17', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_17.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-3', 'さくらんぼーず #18', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_18.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-4', 'さくらんぼーず #19', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_19.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-5', 'さくらんぼーず #20', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_20.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-6', 'さくらんぼーず #21', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_21.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-7', 'さくらんぼーず #22', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_22.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-8', 'さくらんぼーず #23', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_23.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-9', 'さくらんぼーず #24', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_24.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-10', 'さくらんぼーず #25', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_25.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-11', 'さくらんぼーず #26', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_26.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-12', 'さくらんぼーず #27', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_27.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-13', 'さくらんぼーず #28', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_28.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-14', 'さくらんぼーず #29', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_29.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('さくらんぼーず-marshmallow-15', 'さくらんぼーず #30', '/stickers/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%95%E3%81%8F%E3%82%89%E3%82%93%E3%81%BC%E3%83%BC%E3%81%9A_30.png', 2, 'normal', 'フルーツコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-1', 'しゃぼんちゃん #1', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_1.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-2', 'しゃぼんちゃん #2', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_2.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-3', 'しゃぼんちゃん #3', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_3.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-4', 'しゃぼんちゃん #4', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_4.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-5', 'しゃぼんちゃん #5', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_5.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-6', 'しゃぼんちゃん #6', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_6.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-7', 'しゃぼんちゃん #7', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_7.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-8', 'しゃぼんちゃん #8', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_8.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-9', 'しゃぼんちゃん #9', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_9.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-10', 'しゃぼんちゃん #10', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_10.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-11', 'しゃぼんちゃん #11', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_11.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-12', 'しゃぼんちゃん #12', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_12.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-13', 'しゃぼんちゃん #13', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_13.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-14', 'しゃぼんちゃん #14', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_14.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-bondro-15', 'しゃぼんちゃん #15', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_15.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-1', 'しゃぼんちゃん #16', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_16.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-2', 'しゃぼんちゃん #17', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_17.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-3', 'しゃぼんちゃん #18', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_18.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-4', 'しゃぼんちゃん #19', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_19.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-5', 'しゃぼんちゃん #20', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_20.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-6', 'しゃぼんちゃん #21', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_21.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-7', 'しゃぼんちゃん #22', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_22.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-8', 'しゃぼんちゃん #23', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_23.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-9', 'しゃぼんちゃん #24', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_24.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-10', 'しゃぼんちゃん #25', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_25.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-11', 'しゃぼんちゃん #26', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_26.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-12', 'しゃぼんちゃん #27', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_27.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-13', 'しゃぼんちゃん #28', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_28.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-14', 'しゃぼんちゃん #29', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_29.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゃぼんちゃん-marshmallow-15', 'しゃぼんちゃん #30', '/stickers/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%83%E3%81%BC%E3%82%93%E3%81%A1%E3%82%83%E3%82%93_30.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-1', 'しゅわぴー #1', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_1.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-2', 'しゅわぴー #2', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_2.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-3', 'しゅわぴー #3', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_3.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-4', 'しゅわぴー #4', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_4.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-5', 'しゅわぴー #5', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_5.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-6', 'しゅわぴー #6', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_6.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-7', 'しゅわぴー #7', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_7.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-8', 'しゅわぴー #8', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_8.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-9', 'しゅわぴー #9', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_9.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-10', 'しゅわぴー #10', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_10.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-11', 'しゅわぴー #11', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_11.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-12', 'しゅわぴー #12', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_12.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-13', 'しゅわぴー #13', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_13.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-14', 'しゅわぴー #14', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_14.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-bondro-15', 'しゅわぴー #15', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_15.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-1', 'しゅわぴー #16', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_16.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-2', 'しゅわぴー #17', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_17.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-3', 'しゅわぴー #18', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_18.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-4', 'しゅわぴー #19', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_19.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-5', 'しゅわぴー #20', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_20.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-6', 'しゅわぴー #21', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_21.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-7', 'しゅわぴー #22', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_22.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-8', 'しゅわぴー #23', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_23.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-9', 'しゅわぴー #24', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_24.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-10', 'しゅわぴー #25', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_25.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-11', 'しゅわぴー #26', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_26.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-12', 'しゅわぴー #27', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_27.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-13', 'しゅわぴー #28', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_28.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-14', 'しゅわぴー #29', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_29.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('しゅわぴー-marshmallow-15', 'しゅわぴー #30', '/stickers/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%97%E3%82%85%E3%82%8F%E3%81%B4%E3%83%BC_30.png', 2, 'normal', 'きらきらコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-1', 'とろりんプリンひよこ #1', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_1.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-2', 'とろりんプリンひよこ #2', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_2.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-3', 'とろりんプリンひよこ #3', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_3.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-4', 'とろりんプリンひよこ #4', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_4.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-5', 'とろりんプリンひよこ #5', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_5.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-6', 'とろりんプリンひよこ #6', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_6.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-7', 'とろりんプリンひよこ #7', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_7.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-8', 'とろりんプリンひよこ #8', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_8.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-9', 'とろりんプリンひよこ #9', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_9.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-10', 'とろりんプリンひよこ #10', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_10.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-11', 'とろりんプリンひよこ #11', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_11.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-12', 'とろりんプリンひよこ #12', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_12.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-13', 'とろりんプリンひよこ #13', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_13.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-14', 'とろりんプリンひよこ #14', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_14.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-bondro-15', 'とろりんプリンひよこ #15', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_15.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-1', 'とろりんプリンひよこ #16', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_16.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-2', 'とろりんプリンひよこ #17', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_17.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-3', 'とろりんプリンひよこ #18', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_18.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-4', 'とろりんプリンひよこ #19', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_19.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-5', 'とろりんプリンひよこ #20', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_20.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-6', 'とろりんプリンひよこ #21', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_21.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-7', 'とろりんプリンひよこ #22', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_22.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-8', 'とろりんプリンひよこ #23', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_23.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-9', 'とろりんプリンひよこ #24', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_24.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-10', 'とろりんプリンひよこ #25', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_25.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-11', 'とろりんプリンひよこ #26', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_26.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-12', 'とろりんプリンひよこ #27', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_27.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-13', 'とろりんプリンひよこ #28', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_28.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-14', 'とろりんプリンひよこ #29', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_29.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('とろりんプリンひよこ-marshmallow-15', 'とろりんプリンひよこ #30', '/stickers/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%A8%E3%82%8D%E3%82%8A%E3%82%93%E3%83%97%E3%83%AA%E3%83%B3%E3%81%B2%E3%82%88%E3%81%93_30.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-1', 'にじたま #1', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_1.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-2', 'にじたま #2', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_2.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-3', 'にじたま #3', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_3.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-4', 'にじたま #4', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_4.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-5', 'にじたま #5', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_5.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-6', 'にじたま #6', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_6.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-7', 'にじたま #7', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_7.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-8', 'にじたま #8', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_8.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-9', 'にじたま #9', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_9.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-10', 'にじたま #10', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_10.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-11', 'にじたま #11', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_11.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-12', 'にじたま #12', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_12.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-13', 'にじたま #13', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_13.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-14', 'にじたま #14', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_14.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-bondro-15', 'にじたま #15', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_15.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-1', 'にじたま #16', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_16.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-2', 'にじたま #17', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_17.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-3', 'にじたま #18', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_18.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-4', 'にじたま #19', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_19.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-5', 'にじたま #20', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_20.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-6', 'にじたま #21', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_21.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-7', 'にじたま #22', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_22.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-8', 'にじたま #23', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_23.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-9', 'にじたま #24', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_24.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-10', 'にじたま #25', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_25.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-11', 'にじたま #26', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_26.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-12', 'にじたま #27', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_27.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-13', 'にじたま #28', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_28.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-14', 'にじたま #29', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_29.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('にじたま-marshmallow-15', 'にじたま #30', '/stickers/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AB%E3%81%98%E3%81%9F%E3%81%BE_30.png', 3, 'normal', 'きらきらコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-1', 'ねこマカロン #1', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_1.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-2', 'ねこマカロン #2', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_2.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-3', 'ねこマカロン #3', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_3.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-4', 'ねこマカロン #4', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_4.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-5', 'ねこマカロン #5', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_5.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-6', 'ねこマカロン #6', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_6.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-7', 'ねこマカロン #7', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_7.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-8', 'ねこマカロン #8', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_8.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-9', 'ねこマカロン #9', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_9.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-10', 'ねこマカロン #10', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_10.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-11', 'ねこマカロン #11', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_11.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-12', 'ねこマカロン #12', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_12.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-13', 'ねこマカロン #13', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_13.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-14', 'ねこマカロン #14', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_14.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-bondro-15', 'ねこマカロン #15', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_15.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-1', 'ねこマカロン #16', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_16.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-2', 'ねこマカロン #17', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_17.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-3', 'ねこマカロン #18', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_18.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-4', 'ねこマカロン #19', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_19.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-5', 'ねこマカロン #20', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_20.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-6', 'ねこマカロン #21', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_21.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-7', 'ねこマカロン #22', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_22.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-8', 'ねこマカロン #23', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_23.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-9', 'ねこマカロン #24', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_24.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-10', 'ねこマカロン #25', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_25.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-11', 'ねこマカロン #26', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_26.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-12', 'ねこマカロン #27', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_27.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-13', 'ねこマカロン #28', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_28.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-14', 'ねこマカロン #29', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_29.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねこマカロン-marshmallow-15', 'ねこマカロン #30', '/stickers/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%81%93%E3%83%9E%E3%82%AB%E3%83%AD%E3%83%B3_30.png', 4, 'puffy', 'スイーツコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-1', 'ねりあめちゃん #1', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_1.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-2', 'ねりあめちゃん #2', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_2.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-3', 'ねりあめちゃん #3', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_3.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-4', 'ねりあめちゃん #4', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_4.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-5', 'ねりあめちゃん #5', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_5.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-6', 'ねりあめちゃん #6', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_6.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-7', 'ねりあめちゃん #7', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_7.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-8', 'ねりあめちゃん #8', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_8.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-9', 'ねりあめちゃん #9', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_9.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-10', 'ねりあめちゃん #10', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_10.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-11', 'ねりあめちゃん #11', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_11.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-12', 'ねりあめちゃん #12', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_12.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-13', 'ねりあめちゃん #13', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_13.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-14', 'ねりあめちゃん #14', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_14.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-bondro-15', 'ねりあめちゃん #15', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_15.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-1', 'ねりあめちゃん #16', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_16.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-2', 'ねりあめちゃん #17', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_17.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-3', 'ねりあめちゃん #18', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_18.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-4', 'ねりあめちゃん #19', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_19.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-5', 'ねりあめちゃん #20', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_20.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-6', 'ねりあめちゃん #21', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_21.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-7', 'ねりあめちゃん #22', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_22.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-8', 'ねりあめちゃん #23', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_23.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-9', 'ねりあめちゃん #24', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_24.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-10', 'ねりあめちゃん #25', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_25.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-11', 'ねりあめちゃん #26', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_26.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-12', 'ねりあめちゃん #27', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_27.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-13', 'ねりあめちゃん #28', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_28.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-14', 'ねりあめちゃん #29', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_29.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ねりあめちゃん-marshmallow-15', 'ねりあめちゃん #30', '/stickers/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%AD%E3%82%8A%E3%81%82%E3%82%81%E3%81%A1%E3%82%83%E3%82%93_30.png', 3, 'normal', 'スイーツコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-1', 'ふわふわコットンキャンディねこ #1', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_1.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-2', 'ふわふわコットンキャンディねこ #2', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_2.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-3', 'ふわふわコットンキャンディねこ #3', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_3.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-4', 'ふわふわコットンキャンディねこ #4', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_4.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-5', 'ふわふわコットンキャンディねこ #5', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_5.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-6', 'ふわふわコットンキャンディねこ #6', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_6.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-7', 'ふわふわコットンキャンディねこ #7', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_7.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-8', 'ふわふわコットンキャンディねこ #8', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_8.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-9', 'ふわふわコットンキャンディねこ #9', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_9.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-10', 'ふわふわコットンキャンディねこ #10', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_10.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-11', 'ふわふわコットンキャンディねこ #11', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_11.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-12', 'ふわふわコットンキャンディねこ #12', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_12.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-13', 'ふわふわコットンキャンディねこ #13', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_13.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-14', 'ふわふわコットンキャンディねこ #14', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_14.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-bondro-15', 'ふわふわコットンキャンディねこ #15', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_15.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-1', 'ふわふわコットンキャンディねこ #16', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_16.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-2', 'ふわふわコットンキャンディねこ #17', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_17.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-3', 'ふわふわコットンキャンディねこ #18', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_18.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-4', 'ふわふわコットンキャンディねこ #19', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_19.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-5', 'ふわふわコットンキャンディねこ #20', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_20.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-6', 'ふわふわコットンキャンディねこ #21', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_21.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-7', 'ふわふわコットンキャンディねこ #22', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_22.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-8', 'ふわふわコットンキャンディねこ #23', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_23.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-9', 'ふわふわコットンキャンディねこ #24', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_24.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-10', 'ふわふわコットンキャンディねこ #25', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_25.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-11', 'ふわふわコットンキャンディねこ #26', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_26.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-12', 'ふわふわコットンキャンディねこ #27', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_27.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-13', 'ふわふわコットンキャンディねこ #28', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_28.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-14', 'ふわふわコットンキャンディねこ #29', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_29.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわふわコットンキャンディねこ-marshmallow-15', 'ふわふわコットンキャンディねこ #30', '/stickers/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E3%82%B3%E3%83%83%E3%83%88%E3%83%B3%E3%82%AD%E3%83%A3%E3%83%B3%E3%83%87%E3%82%A3%E3%81%AD%E3%81%93_30.png', 4, 'puffy', 'ふわもこコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-1', 'ふわもくん #1', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_1.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-2', 'ふわもくん #2', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_2.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-3', 'ふわもくん #3', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_3.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-4', 'ふわもくん #4', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_4.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-5', 'ふわもくん #5', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_5.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-6', 'ふわもくん #6', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_6.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-7', 'ふわもくん #7', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_7.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-8', 'ふわもくん #8', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_8.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-9', 'ふわもくん #9', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_9.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-10', 'ふわもくん #10', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_10.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-11', 'ふわもくん #11', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_11.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-12', 'ふわもくん #12', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_12.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-13', 'ふわもくん #13', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_13.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-14', 'ふわもくん #14', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_14.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-bondro-15', 'ふわもくん #15', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_15.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-1', 'ふわもくん #16', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_16.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-2', 'ふわもくん #17', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_17.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-3', 'ふわもくん #18', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_18.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-4', 'ふわもくん #19', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_19.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-5', 'ふわもくん #20', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_20.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-6', 'ふわもくん #21', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_21.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-7', 'ふわもくん #22', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_22.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-8', 'ふわもくん #23', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_23.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-9', 'ふわもくん #24', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_24.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-10', 'ふわもくん #25', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_25.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-11', 'ふわもくん #26', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_26.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-12', 'ふわもくん #27', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_27.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-13', 'ふわもくん #28', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_28.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-14', 'ふわもくん #29', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_29.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもくん-marshmallow-15', 'ふわもくん #30', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%8F%E3%82%93_30.png', 2, 'normal', 'ふわもこコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-1', 'ふわもちパン #1', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_1.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-2', 'ふわもちパン #2', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_2.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-3', 'ふわもちパン #3', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_3.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-4', 'ふわもちパン #4', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_4.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-5', 'ふわもちパン #5', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_5.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-6', 'ふわもちパン #6', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_6.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-7', 'ふわもちパン #7', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_7.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-8', 'ふわもちパン #8', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_8.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-9', 'ふわもちパン #9', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_9.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-10', 'ふわもちパン #10', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_10.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-11', 'ふわもちパン #11', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_11.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-12', 'ふわもちパン #12', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_12.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-13', 'ふわもちパン #13', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_13.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-14', 'ふわもちパン #14', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_14.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-bondro-15', 'ふわもちパン #15', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_15.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-1', 'ふわもちパン #16', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_16.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-2', 'ふわもちパン #17', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_17.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-3', 'ふわもちパン #18', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_18.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-4', 'ふわもちパン #19', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_19.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-5', 'ふわもちパン #20', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_20.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-6', 'ふわもちパン #21', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_21.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-7', 'ふわもちパン #22', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_22.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-8', 'ふわもちパン #23', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_23.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-9', 'ふわもちパン #24', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_24.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-10', 'ふわもちパン #25', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_25.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-11', 'ふわもちパン #26', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_26.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-12', 'ふわもちパン #27', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_27.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-13', 'ふわもちパン #28', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_28.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-14', 'ふわもちパン #29', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_29.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわもちパン-marshmallow-15', 'ふわもちパン #30', '/stickers/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%82%E3%81%A1%E3%83%91%E3%83%B3_30.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-1', 'ふわりぼん #1', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_1.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-2', 'ふわりぼん #2', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_2.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-3', 'ふわりぼん #3', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_3.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-4', 'ふわりぼん #4', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_4.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-5', 'ふわりぼん #5', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_5.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-6', 'ふわりぼん #6', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_6.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-7', 'ふわりぼん #7', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_7.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-8', 'ふわりぼん #8', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_8.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-9', 'ふわりぼん #9', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_9.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-10', 'ふわりぼん #10', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_10.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-11', 'ふわりぼん #11', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_11.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-12', 'ふわりぼん #12', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_12.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-13', 'ふわりぼん #13', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_13.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-14', 'ふわりぼん #14', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_14.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-bondro-15', 'ふわりぼん #15', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_15.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-1', 'ふわりぼん #16', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_16.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-2', 'ふわりぼん #17', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_17.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-3', 'ふわりぼん #18', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_18.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-4', 'ふわりぼん #19', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_19.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-5', 'ふわりぼん #20', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_20.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-6', 'ふわりぼん #21', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_21.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-7', 'ふわりぼん #22', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_22.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-8', 'ふわりぼん #23', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_23.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-9', 'ふわりぼん #24', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_24.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-10', 'ふわりぼん #25', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_25.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-11', 'ふわりぼん #26', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_26.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-12', 'ふわりぼん #27', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_27.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-13', 'ふわりぼん #28', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_28.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-14', 'ふわりぼん #29', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_29.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ふわりぼん-marshmallow-15', 'ふわりぼん #30', '/stickers/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B5%E3%82%8F%E3%82%8A%E3%81%BC%E3%82%93_30.png', 2, 'normal', 'ガーリーコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-1', 'ぷちぷちにゃん #1', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_1.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-2', 'ぷちぷちにゃん #2', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_2.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-3', 'ぷちぷちにゃん #3', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_3.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-4', 'ぷちぷちにゃん #4', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_4.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-5', 'ぷちぷちにゃん #5', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_5.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-6', 'ぷちぷちにゃん #6', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_6.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-7', 'ぷちぷちにゃん #7', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_7.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-8', 'ぷちぷちにゃん #8', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_8.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-9', 'ぷちぷちにゃん #9', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_9.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-10', 'ぷちぷちにゃん #10', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_10.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-11', 'ぷちぷちにゃん #11', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_11.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-12', 'ぷちぷちにゃん #12', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_12.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-13', 'ぷちぷちにゃん #13', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_13.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-14', 'ぷちぷちにゃん #14', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_14.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-bondro-15', 'ぷちぷちにゃん #15', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_15.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-1', 'ぷちぷちにゃん #16', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_16.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-2', 'ぷちぷちにゃん #17', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_17.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-3', 'ぷちぷちにゃん #18', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_18.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-4', 'ぷちぷちにゃん #19', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_19.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-5', 'ぷちぷちにゃん #20', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_20.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-6', 'ぷちぷちにゃん #21', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_21.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-7', 'ぷちぷちにゃん #22', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_22.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-8', 'ぷちぷちにゃん #23', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_23.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-9', 'ぷちぷちにゃん #24', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_24.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-10', 'ぷちぷちにゃん #25', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_25.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-11', 'ぷちぷちにゃん #26', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_26.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-12', 'ぷちぷちにゃん #27', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_27.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-13', 'ぷちぷちにゃん #28', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_28.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-14', 'ぷちぷちにゃん #29', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_29.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷちぷちにゃん-marshmallow-15', 'ぷちぷちにゃん #30', '/stickers/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%A1%E3%81%B7%E3%81%A1%E3%81%AB%E3%82%83%E3%82%93_30.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-1', 'ぷにねこ #1', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_1.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-2', 'ぷにねこ #2', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_2.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-3', 'ぷにねこ #3', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_3.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-4', 'ぷにねこ #4', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_4.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-5', 'ぷにねこ #5', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_5.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-6', 'ぷにねこ #6', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_6.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-7', 'ぷにねこ #7', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_7.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-8', 'ぷにねこ #8', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_8.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-9', 'ぷにねこ #9', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_9.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-10', 'ぷにねこ #10', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_10.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-11', 'ぷにねこ #11', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_11.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-12', 'ぷにねこ #12', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_12.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-13', 'ぷにねこ #13', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_13.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-14', 'ぷにねこ #14', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_14.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-bondro-15', 'ぷにねこ #15', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_15.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-1', 'ぷにねこ #16', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_16.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-2', 'ぷにねこ #17', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_17.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-3', 'ぷにねこ #18', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_18.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-4', 'ぷにねこ #19', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_19.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-5', 'ぷにねこ #20', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_20.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-6', 'ぷにねこ #21', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_21.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-7', 'ぷにねこ #22', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_22.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-8', 'ぷにねこ #23', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_23.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-9', 'ぷにねこ #24', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_24.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-10', 'ぷにねこ #25', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_25.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-11', 'ぷにねこ #26', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_26.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-12', 'ぷにねこ #27', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_27.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-13', 'ぷにねこ #28', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_28.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-14', 'ぷにねこ #29', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_29.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷにねこ-marshmallow-15', 'ぷにねこ #30', '/stickers/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%81%AB%E3%81%AD%E3%81%93_30.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-1', 'ぷりんぬ #1', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_1.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-2', 'ぷりんぬ #2', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_2.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-3', 'ぷりんぬ #3', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_3.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-4', 'ぷりんぬ #4', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_4.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-5', 'ぷりんぬ #5', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_5.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-6', 'ぷりんぬ #6', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_6.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-7', 'ぷりんぬ #7', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_7.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-8', 'ぷりんぬ #8', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_8.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-9', 'ぷりんぬ #9', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_9.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-10', 'ぷりんぬ #10', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_10.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-11', 'ぷりんぬ #11', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_11.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-12', 'ぷりんぬ #12', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_12.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-13', 'ぷりんぬ #13', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_13.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-14', 'ぷりんぬ #14', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_14.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-bondro-15', 'ぷりんぬ #15', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_15.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-1', 'ぷりんぬ #16', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_16.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-2', 'ぷりんぬ #17', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_17.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-3', 'ぷりんぬ #18', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_18.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-4', 'ぷりんぬ #19', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_19.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-5', 'ぷりんぬ #20', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_20.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-6', 'ぷりんぬ #21', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_21.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-7', 'ぷりんぬ #22', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_22.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-8', 'ぷりんぬ #23', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_23.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-9', 'ぷりんぬ #24', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_24.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-10', 'ぷりんぬ #25', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_25.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-11', 'ぷりんぬ #26', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_26.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-12', 'ぷりんぬ #27', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_27.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-13', 'ぷりんぬ #28', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_28.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-14', 'ぷりんぬ #29', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_29.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷりんぬ-marshmallow-15', 'ぷりんぬ #30', '/stickers/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8A%E3%82%93%E3%81%AC_30.png', 1, 'normal', 'スイーツコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-1', 'ぷるるん #1', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_1.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-2', 'ぷるるん #2', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_2.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-3', 'ぷるるん #3', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_3.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-4', 'ぷるるん #4', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_4.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-5', 'ぷるるん #5', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_5.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-6', 'ぷるるん #6', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_6.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-7', 'ぷるるん #7', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_7.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-8', 'ぷるるん #8', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_8.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-9', 'ぷるるん #9', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_9.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-10', 'ぷるるん #10', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_10.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-11', 'ぷるるん #11', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_11.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-12', 'ぷるるん #12', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_12.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-13', 'ぷるるん #13', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_13.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-14', 'ぷるるん #14', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_14.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-bondro-15', 'ぷるるん #15', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_15.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-1', 'ぷるるん #16', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_16.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-2', 'ぷるるん #17', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_17.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-3', 'ぷるるん #18', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_18.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-4', 'ぷるるん #19', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_19.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-5', 'ぷるるん #20', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_20.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-6', 'ぷるるん #21', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_21.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-7', 'ぷるるん #22', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_22.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-8', 'ぷるるん #23', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_23.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-9', 'ぷるるん #24', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_24.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-10', 'ぷるるん #25', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_25.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-11', 'ぷるるん #26', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_26.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-12', 'ぷるるん #27', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_27.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-13', 'ぷるるん #28', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_28.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-14', 'ぷるるん #29', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_29.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぷるるん-marshmallow-15', 'ぷるるん #30', '/stickers/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%B7%E3%82%8B%E3%82%8B%E3%82%93_30.png', 1, 'normal', 'ぷにぷにコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-1', 'ほわほわん #1', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_1.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-2', 'ほわほわん #2', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_2.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-3', 'ほわほわん #3', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_3.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-4', 'ほわほわん #4', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_4.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-5', 'ほわほわん #5', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_5.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-6', 'ほわほわん #6', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_6.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-7', 'ほわほわん #7', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_7.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-8', 'ほわほわん #8', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_8.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-9', 'ほわほわん #9', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_9.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-10', 'ほわほわん #10', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_10.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-11', 'ほわほわん #11', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_11.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-12', 'ほわほわん #12', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_12.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-13', 'ほわほわん #13', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_13.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-14', 'ほわほわん #14', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_14.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-bondro-15', 'ほわほわん #15', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_15.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-1', 'ほわほわん #16', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_16.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-2', 'ほわほわん #17', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_17.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-3', 'ほわほわん #18', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_18.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-4', 'ほわほわん #19', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_19.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-5', 'ほわほわん #20', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_20.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-6', 'ほわほわん #21', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_21.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-7', 'ほわほわん #22', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_22.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-8', 'ほわほわん #23', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_23.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-9', 'ほわほわん #24', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_24.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-10', 'ほわほわん #25', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_25.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-11', 'ほわほわん #26', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_26.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-12', 'ほわほわん #27', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_27.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-13', 'ほわほわん #28', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_28.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-14', 'ほわほわん #29', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_29.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ほわほわん-marshmallow-15', 'ほわほわん #30', '/stickers/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BB%E3%82%8F%E3%81%BB%E3%82%8F%E3%82%93_30.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-1', 'ぽよたまご #1', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_1.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-2', 'ぽよたまご #2', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_2.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-3', 'ぽよたまご #3', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_3.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-4', 'ぽよたまご #4', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_4.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-5', 'ぽよたまご #5', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_5.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-6', 'ぽよたまご #6', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_6.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-7', 'ぽよたまご #7', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_7.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-8', 'ぽよたまご #8', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_8.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-9', 'ぽよたまご #9', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_9.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-10', 'ぽよたまご #10', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_10.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-11', 'ぽよたまご #11', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_11.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-12', 'ぽよたまご #12', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_12.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-13', 'ぽよたまご #13', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_13.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-14', 'ぽよたまご #14', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_14.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-bondro-15', 'ぽよたまご #15', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_15.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-1', 'ぽよたまご #16', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_16.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-2', 'ぽよたまご #17', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_17.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-3', 'ぽよたまご #18', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_18.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-4', 'ぽよたまご #19', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_19.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-5', 'ぽよたまご #20', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_20.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-6', 'ぽよたまご #21', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_21.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-7', 'ぽよたまご #22', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_22.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-8', 'ぽよたまご #23', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_23.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-9', 'ぽよたまご #24', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_24.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-10', 'ぽよたまご #25', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_25.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-11', 'ぽよたまご #26', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_26.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-12', 'ぽよたまご #27', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_27.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-13', 'ぽよたまご #28', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_28.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-14', 'ぽよたまご #29', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_29.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよたまご-marshmallow-15', 'ぽよたまご #30', '/stickers/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%9F%E3%81%BE%E3%81%94_30.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-1', 'ぽよまる #1', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_1.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-2', 'ぽよまる #2', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_2.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-3', 'ぽよまる #3', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_3.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-4', 'ぽよまる #4', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_4.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-5', 'ぽよまる #5', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_5.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-6', 'ぽよまる #6', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_6.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-7', 'ぽよまる #7', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_7.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-8', 'ぽよまる #8', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_8.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-9', 'ぽよまる #9', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_9.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-10', 'ぽよまる #10', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_10.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-11', 'ぽよまる #11', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_11.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-12', 'ぽよまる #12', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_12.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-13', 'ぽよまる #13', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_13.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-14', 'ぽよまる #14', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_14.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-bondro-15', 'ぽよまる #15', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_15.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-1', 'ぽよまる #16', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_16.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-2', 'ぽよまる #17', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_17.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-3', 'ぽよまる #18', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_18.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-4', 'ぽよまる #19', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_19.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-5', 'ぽよまる #20', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_20.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-6', 'ぽよまる #21', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_21.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-7', 'ぽよまる #22', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_22.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-8', 'ぽよまる #23', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_23.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-9', 'ぽよまる #24', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_24.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-10', 'ぽよまる #25', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_25.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-11', 'ぽよまる #26', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_26.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-12', 'ぽよまる #27', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_27.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-13', 'ぽよまる #28', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_28.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-14', 'ぽよまる #29', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_29.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ぽよまる-marshmallow-15', 'ぽよまる #30', '/stickers/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%81%BD%E3%82%88%E3%81%BE%E3%82%8B_30.png', 1, 'normal', 'ぽよぽよコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-1', 'もこたんぽぽ #1', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_1.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-2', 'もこたんぽぽ #2', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_2.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-3', 'もこたんぽぽ #3', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_3.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-4', 'もこたんぽぽ #4', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_4.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-5', 'もこたんぽぽ #5', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_5.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-6', 'もこたんぽぽ #6', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_6.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-7', 'もこたんぽぽ #7', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_7.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-8', 'もこたんぽぽ #8', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_8.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-9', 'もこたんぽぽ #9', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_9.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-10', 'もこたんぽぽ #10', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_10.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-11', 'もこたんぽぽ #11', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_11.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-12', 'もこたんぽぽ #12', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_12.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-13', 'もこたんぽぽ #13', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_13.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-14', 'もこたんぽぽ #14', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_14.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-bondro-15', 'もこたんぽぽ #15', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_15.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-1', 'もこたんぽぽ #16', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_16.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-2', 'もこたんぽぽ #17', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_17.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-3', 'もこたんぽぽ #18', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_18.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-4', 'もこたんぽぽ #19', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_19.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-5', 'もこたんぽぽ #20', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_20.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-6', 'もこたんぽぽ #21', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_21.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-7', 'もこたんぽぽ #22', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_22.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-8', 'もこたんぽぽ #23', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_23.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-9', 'もこたんぽぽ #24', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_24.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-10', 'もこたんぽぽ #25', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_25.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-11', 'もこたんぽぽ #26', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_26.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-12', 'もこたんぽぽ #27', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_27.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-13', 'もこたんぽぽ #28', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_28.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-14', 'もこたんぽぽ #29', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_29.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もこたんぽぽ-marshmallow-15', 'もこたんぽぽ #30', '/stickers/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%93%E3%81%9F%E3%82%93%E3%81%BD%E3%81%BD_30.png', 1, 'normal', 'ふわもこコレクション', 20, 55, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-1', 'もちぷに #1', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_1.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-2', 'もちぷに #2', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_2.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-3', 'もちぷに #3', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_3.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-4', 'もちぷに #4', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_4.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-5', 'もちぷに #5', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_5.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-6', 'もちぷに #6', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_6.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-7', 'もちぷに #7', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_7.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-8', 'もちぷに #8', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_8.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-9', 'もちぷに #9', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_9.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-10', 'もちぷに #10', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_10.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-11', 'もちぷに #11', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_11.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-12', 'もちぷに #12', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_12.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-13', 'もちぷに #13', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_13.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-14', 'もちぷに #14', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_14.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-bondro-15', 'もちぷに #15', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_15.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-1', 'もちぷに #16', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_16.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-2', 'もちぷに #17', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_17.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-3', 'もちぷに #18', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_18.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-4', 'もちぷに #19', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_19.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-5', 'もちぷに #20', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_20.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-6', 'もちぷに #21', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_21.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-7', 'もちぷに #22', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_22.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-8', 'もちぷに #23', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_23.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-9', 'もちぷに #24', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_24.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-10', 'もちぷに #25', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_25.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-11', 'もちぷに #26', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_26.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-12', 'もちぷに #27', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_27.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-13', 'もちぷに #28', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_28.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-14', 'もちぷに #29', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_29.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もちぷに-marshmallow-15', 'もちぷに #30', '/stickers/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%A1%E3%81%B7%E3%81%AB_30.png', 2, 'normal', 'ぷにぷにコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-1', 'もっちも #1', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_1.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-2', 'もっちも #2', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_2.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-3', 'もっちも #3', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_3.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-4', 'もっちも #4', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_4.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-5', 'もっちも #5', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_5.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-6', 'もっちも #6', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_6.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-7', 'もっちも #7', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_7.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-8', 'もっちも #8', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_8.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-9', 'もっちも #9', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_9.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-10', 'もっちも #10', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_10.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-11', 'もっちも #11', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_11.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-12', 'もっちも #12', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_12.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-13', 'もっちも #13', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_13.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-14', 'もっちも #14', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_14.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もっちも-15', 'もっちも #15', '/stickers/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82/%E3%82%82%E3%81%A3%E3%81%A1%E3%82%82_15.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-1', 'もふもふポップコーンぴよ #1', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_1.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-2', 'もふもふポップコーンぴよ #2', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_2.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-3', 'もふもふポップコーンぴよ #3', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_3.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-4', 'もふもふポップコーンぴよ #4', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_4.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-5', 'もふもふポップコーンぴよ #5', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_5.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-6', 'もふもふポップコーンぴよ #6', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_6.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-7', 'もふもふポップコーンぴよ #7', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_7.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-8', 'もふもふポップコーンぴよ #8', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_8.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-9', 'もふもふポップコーンぴよ #9', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_9.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-10', 'もふもふポップコーンぴよ #10', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_10.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-11', 'もふもふポップコーンぴよ #11', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_11.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-12', 'もふもふポップコーンぴよ #12', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_12.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-13', 'もふもふポップコーンぴよ #13', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_13.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-14', 'もふもふポップコーンぴよ #14', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_14.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-bondro-15', 'もふもふポップコーンぴよ #15', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_15.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-marshmallow-1', 'もふもふポップコーンぴよ #16', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_16.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-marshmallow-2', 'もふもふポップコーンぴよ #17', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_17.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-marshmallow-3', 'もふもふポップコーンぴよ #18', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_18.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-marshmallow-4', 'もふもふポップコーンぴよ #19', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_19.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-marshmallow-5', 'もふもふポップコーンぴよ #20', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_20.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('もふもふポップコーンぴよ-marshmallow-6', 'もふもふポップコーンぴよ #21', '/stickers/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%82%E3%81%B5%E3%82%82%E3%81%B5%E3%83%9D%E3%83%83%E3%83%97%E3%82%B3%E3%83%BC%E3%83%B3%E3%81%B4%E3%82%88_21.png', 3, 'normal', 'ふわもこコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-1', 'ゆめくも #1', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_1.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-2', 'ゆめくも #2', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_2.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-3', 'ゆめくも #3', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_3.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-4', 'ゆめくも #4', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_4.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-5', 'ゆめくも #5', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_5.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-6', 'ゆめくも #6', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_6.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-7', 'ゆめくも #7', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_7.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-8', 'ゆめくも #8', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_8.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-9', 'ゆめくも #9', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_9.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-10', 'ゆめくも #10', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_10.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-11', 'ゆめくも #11', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_11.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-12', 'ゆめくも #12', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_12.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-13', 'ゆめくも #13', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_13.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-14', 'ゆめくも #14', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_14.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-bondro-15', 'ゆめくも #15', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_15.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-1', 'ゆめくも #16', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_16.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-2', 'ゆめくも #17', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_17.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-3', 'ゆめくも #18', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_18.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-4', 'ゆめくも #19', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_19.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-5', 'ゆめくも #20', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_20.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-6', 'ゆめくも #21', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_21.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-7', 'ゆめくも #22', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_22.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-8', 'ゆめくも #23', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_23.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-9', 'ゆめくも #24', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_24.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-10', 'ゆめくも #25', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_25.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-11', 'ゆめくも #26', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_26.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-12', 'ゆめくも #27', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_27.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-13', 'ゆめくも #28', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_28.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-14', 'ゆめくも #29', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_29.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくも-marshmallow-15', 'ゆめくも #30', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%82_30.png', 2, 'normal', 'ゆめかわコレクション', 50, 30, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-1', 'ゆめくらげ #1', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_1.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-2', 'ゆめくらげ #2', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_2.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-3', 'ゆめくらげ #3', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_3.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-4', 'ゆめくらげ #4', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_4.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-5', 'ゆめくらげ #5', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_5.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-6', 'ゆめくらげ #6', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_6.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-7', 'ゆめくらげ #7', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_7.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-8', 'ゆめくらげ #8', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_8.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-9', 'ゆめくらげ #9', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_9.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-10', 'ゆめくらげ #10', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_10.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-11', 'ゆめくらげ #11', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_11.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-12', 'ゆめくらげ #12', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_12.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-13', 'ゆめくらげ #13', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_13.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-14', 'ゆめくらげ #14', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_14.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-bondro-15', 'ゆめくらげ #15', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_15.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-1', 'ゆめくらげ #16', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_16.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-2', 'ゆめくらげ #17', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_17.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-3', 'ゆめくらげ #18', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_18.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-4', 'ゆめくらげ #19', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_19.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-5', 'ゆめくらげ #20', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_20.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-6', 'ゆめくらげ #21', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_21.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-7', 'ゆめくらげ #22', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_22.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-8', 'ゆめくらげ #23', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_23.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-9', 'ゆめくらげ #24', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_24.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-10', 'ゆめくらげ #25', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_25.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-11', 'ゆめくらげ #26', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_26.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-12', 'ゆめくらげ #27', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_27.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-13', 'ゆめくらげ #28', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_28.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-14', 'ゆめくらげ #29', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_29.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめくらげ-marshmallow-15', 'ゆめくらげ #30', '/stickers/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%8F%E3%82%89%E3%81%92_30.png', 4, 'puffy', 'ゆめかわコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-1', 'ゆめひつじ #1', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_1.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-2', 'ゆめひつじ #2', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_2.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-3', 'ゆめひつじ #3', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_3.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-4', 'ゆめひつじ #4', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_4.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-5', 'ゆめひつじ #5', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_5.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-6', 'ゆめひつじ #6', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_6.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-7', 'ゆめひつじ #7', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_7.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-8', 'ゆめひつじ #8', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_8.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-9', 'ゆめひつじ #9', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_9.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-10', 'ゆめひつじ #10', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_10.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-11', 'ゆめひつじ #11', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_11.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-12', 'ゆめひつじ #12', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_12.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-13', 'ゆめひつじ #13', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_13.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-14', 'ゆめひつじ #14', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_14.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-bondro-15', 'ゆめひつじ #15', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_15.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-1', 'ゆめひつじ #16', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_16.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-2', 'ゆめひつじ #17', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_17.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-3', 'ゆめひつじ #18', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_18.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-4', 'ゆめひつじ #19', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_19.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-5', 'ゆめひつじ #20', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_20.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-6', 'ゆめひつじ #21', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_21.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-7', 'ゆめひつじ #22', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_22.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-8', 'ゆめひつじ #23', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_23.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-9', 'ゆめひつじ #24', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_24.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-10', 'ゆめひつじ #25', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_25.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-11', 'ゆめひつじ #26', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_26.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-12', 'ゆめひつじ #27', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_27.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-13', 'ゆめひつじ #28', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_28.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-14', 'ゆめひつじ #29', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_29.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ゆめひつじ-marshmallow-15', 'ゆめひつじ #30', '/stickers/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%86%E3%82%81%E3%81%B2%E3%81%A4%E3%81%98_30.png', 3, 'normal', 'ゆめかわコレクション', 100, 15, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-1', 'ウールン #1', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_1.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-2', 'ウールン #2', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_2.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-3', 'ウールン #3', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_3.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-4', 'ウールン #4', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_4.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-5', 'ウールン #5', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_5.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-6', 'ウールン #6', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_6.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-7', 'ウールン #7', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_7.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-8', 'ウールン #8', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_8.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-9', 'ウールン #9', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_9.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-10', 'ウールン #10', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_10.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-11', 'ウールン #11', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_11.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-12', 'ウールン #12', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_12.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-13', 'ウールン #13', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_13.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-14', 'ウールン #14', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_14.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ウールン-15', 'ウールン #15', '/stickers/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3/%E3%82%A6%E3%83%BC%E3%83%AB%E3%83%B3_15.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-1', 'キノぼう #1', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_1.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-2', 'キノぼう #2', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_2.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-3', 'キノぼう #3', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_3.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-4', 'キノぼう #4', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_4.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-5', 'キノぼう #5', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_5.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-6', 'キノぼう #6', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_6.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-7', 'キノぼう #7', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_7.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-8', 'キノぼう #8', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_8.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-9', 'キノぼう #9', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_9.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-10', 'キノぼう #10', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_10.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-11', 'キノぼう #11', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_11.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-12', 'キノぼう #12', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_12.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-13', 'キノぼう #13', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_13.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-14', 'キノぼう #14', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_14.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('キノぼう-15', 'キノぼう #15', '/stickers/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86/%E3%82%AD%E3%83%8E%E3%81%BC%E3%81%86_15.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-1', 'クリームソーダちゃん #1', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_1.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-2', 'クリームソーダちゃん #2', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_2.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-3', 'クリームソーダちゃん #3', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_3.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-4', 'クリームソーダちゃん #4', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_4.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-5', 'クリームソーダちゃん #5', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_5.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-6', 'クリームソーダちゃん #6', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_6.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-7', 'クリームソーダちゃん #7', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_7.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-8', 'クリームソーダちゃん #8', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_8.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-9', 'クリームソーダちゃん #9', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_9.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-10', 'クリームソーダちゃん #10', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_10.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-11', 'クリームソーダちゃん #11', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_11.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-12', 'クリームソーダちゃん #12', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_12.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-13', 'クリームソーダちゃん #13', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_13.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-bondro-14', 'クリームソーダちゃん #14', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_14.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-1', 'クリームソーダちゃん #15', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_16.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-2', 'クリームソーダちゃん #16', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_17.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-3', 'クリームソーダちゃん #17', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_18.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-4', 'クリームソーダちゃん #18', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_19.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-5', 'クリームソーダちゃん #19', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_20.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-6', 'クリームソーダちゃん #20', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_21.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-7', 'クリームソーダちゃん #21', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_22.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-8', 'クリームソーダちゃん #22', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_23.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-9', 'クリームソーダちゃん #23', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_24.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-10', 'クリームソーダちゃん #24', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_25.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-11', 'クリームソーダちゃん #25', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_26.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('クリームソーダちゃん-marshmallow-12', 'クリームソーダちゃん #26', '/stickers/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%A0%E3%82%BD%E3%83%BC%E3%83%80%E3%81%A1%E3%82%83%E3%82%93_27.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-1', 'コケボ #1', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_1.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-2', 'コケボ #2', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_2.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-3', 'コケボ #3', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_3.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-4', 'コケボ #4', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_4.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-5', 'コケボ #5', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_5.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-6', 'コケボ #6', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_6.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-7', 'コケボ #7', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_7.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-8', 'コケボ #8', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_8.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-9', 'コケボ #9', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_9.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-10', 'コケボ #10', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_10.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-11', 'コケボ #11', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_11.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-12', 'コケボ #12', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_12.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-13', 'コケボ #13', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_13.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-14', 'コケボ #14', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_14.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('コケボ-15', 'コケボ #15', '/stickers/%E3%82%B3%E3%82%B1%E3%83%9C/%E3%82%B3%E3%82%B1%E3%83%9C_15.png', 2, 'normal', 'アンコモンコレクション', 50, 30, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-1', 'サニたん #1', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_1.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-2', 'サニたん #2', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_2.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-3', 'サニたん #3', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_3.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-4', 'サニたん #4', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_4.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-5', 'サニたん #5', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_5.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-6', 'サニたん #6', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_6.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-7', 'サニたん #7', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_7.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-8', 'サニたん #8', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_8.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-9', 'サニたん #9', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_9.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-10', 'サニたん #10', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_10.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-11', 'サニたん #11', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_11.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-12', 'サニたん #12', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_12.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-13', 'サニたん #13', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_13.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-14', 'サニたん #14', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_14.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('サニたん-15', 'サニたん #15', '/stickers/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93/%E3%82%B5%E3%83%8B%E3%81%9F%E3%82%93_15.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-1', 'スタラ #1', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_1.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-2', 'スタラ #2', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_2.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-3', 'スタラ #3', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_3.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-4', 'スタラ #4', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_4.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-5', 'スタラ #5', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_5.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-6', 'スタラ #6', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_6.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-7', 'スタラ #7', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_7.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-8', 'スタラ #8', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_8.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-9', 'スタラ #9', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_9.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-10', 'スタラ #10', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_10.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-11', 'スタラ #11', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_11.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-12', 'スタラ #12', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_12.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-13', 'スタラ #13', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_13.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-14', 'スタラ #14', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_14.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('スタラ-15', 'スタラ #15', '/stickers/%E3%82%B9%E3%82%BF%E3%83%A9/%E3%82%B9%E3%82%BF%E3%83%A9_15.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-1', 'チャックン #1', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_1.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-2', 'チャックン #2', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_2.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-3', 'チャックン #3', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_3.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-4', 'チャックン #4', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_4.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-5', 'チャックン #5', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_5.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-6', 'チャックン #6', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_6.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-7', 'チャックン #7', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_7.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-8', 'チャックン #8', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_8.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-9', 'チャックン #9', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_9.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-10', 'チャックン #10', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_10.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-11', 'チャックン #11', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_11.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-12', 'チャックン #12', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_12.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-13', 'チャックン #13', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_13.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-14', 'チャックン #14', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_14.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('チャックン-15', 'チャックン #15', '/stickers/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3/%E3%83%81%E3%83%A3%E3%83%83%E3%82%AF%E3%83%B3_15.png', 4, 'puffy', 'スーパーレアコレクション', 200, 5, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-1', 'トイラン #1', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_1.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-2', 'トイラン #2', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_2.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-3', 'トイラン #3', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_3.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-4', 'トイラン #4', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_4.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-5', 'トイラン #5', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_5.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-6', 'トイラン #6', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_6.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-7', 'トイラン #7', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_7.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-8', 'トイラン #8', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_8.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-9', 'トイラン #9', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_9.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-10', 'トイラン #10', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_10.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-11', 'トイラン #11', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_11.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-12', 'トイラン #12', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_12.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-13', 'トイラン #13', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_13.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-14', 'トイラン #14', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_14.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('トイラン-15', 'トイラン #15', '/stickers/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3/%E3%83%88%E3%82%A4%E3%83%A9%E3%83%B3_15.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-1', 'ドロル #1', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_1.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-2', 'ドロル #2', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_2.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-3', 'ドロル #3', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_3.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-4', 'ドロル #4', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_4.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-5', 'ドロル #5', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_5.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-6', 'ドロル #6', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_6.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-7', 'ドロル #7', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_7.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-8', 'ドロル #8', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_8.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-9', 'ドロル #9', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_9.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-10', 'ドロル #10', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_10.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-11', 'ドロル #11', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_11.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-12', 'ドロル #12', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_12.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-13', 'ドロル #13', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_13.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-14', 'ドロル #14', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_14.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ドロル-15', 'ドロル #15', '/stickers/%E3%83%89%E3%83%AD%E3%83%AB/%E3%83%89%E3%83%AD%E3%83%AB_15.png', 3, 'normal', 'レアコレクション', 100, 15, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-1', 'ビー玉にゃんこ #1', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_1.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-2', 'ビー玉にゃんこ #2', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_2.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-3', 'ビー玉にゃんこ #3', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_3.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-4', 'ビー玉にゃんこ #4', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_4.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-5', 'ビー玉にゃんこ #5', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_5.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-6', 'ビー玉にゃんこ #6', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_6.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-7', 'ビー玉にゃんこ #7', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_7.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-8', 'ビー玉にゃんこ #8', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_8.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-9', 'ビー玉にゃんこ #9', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_9.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-10', 'ビー玉にゃんこ #10', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_10.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-11', 'ビー玉にゃんこ #11', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_11.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-12', 'ビー玉にゃんこ #12', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_12.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-13', 'ビー玉にゃんこ #13', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_13.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-bondro-14', 'ビー玉にゃんこ #14', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_14.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-1', 'ビー玉にゃんこ #15', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_16.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-2', 'ビー玉にゃんこ #16', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_17.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-3', 'ビー玉にゃんこ #17', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_18.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-4', 'ビー玉にゃんこ #18', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_19.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-5', 'ビー玉にゃんこ #19', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_20.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-6', 'ビー玉にゃんこ #20', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_21.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-7', 'ビー玉にゃんこ #21', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_22.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-8', 'ビー玉にゃんこ #22', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_23.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-9', 'ビー玉にゃんこ #23', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_24.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-10', 'ビー玉にゃんこ #24', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_25.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-11', 'ビー玉にゃんこ #25', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_26.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-12', 'ビー玉にゃんこ #26', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_27.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-13', 'ビー玉にゃんこ #27', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_28.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-14', 'ビー玉にゃんこ #28', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_29.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ビー玉にゃんこ-marshmallow-15', 'ビー玉にゃんこ #29', '/stickers/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%93%E3%83%BC%E7%8E%89%E3%81%AB%E3%82%83%E3%82%93%E3%81%93_30.png', 5, 'sparkle', 'スイーツコレクション', 500, 1, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-1', 'ポフン #1', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_1.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-2', 'ポフン #2', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_2.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-3', 'ポフン #3', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_3.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-4', 'ポフン #4', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_4.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-5', 'ポフン #5', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_5.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-6', 'ポフン #6', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_6.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-7', 'ポフン #7', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_7.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-8', 'ポフン #8', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_8.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-9', 'ポフン #9', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_9.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-10', 'ポフン #10', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_10.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-11', 'ポフン #11', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_11.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-12', 'ポフン #12', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_12.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-13', 'ポフン #13', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_13.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-14', 'ポフン #14', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_14.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポフン-15', 'ポフン #15', '/stickers/%E3%83%9D%E3%83%95%E3%83%B3/sticker_15.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-1', 'ポリ #1', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_1.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-2', 'ポリ #2', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_2.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-3', 'ポリ #3', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_3.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-4', 'ポリ #4', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_4.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-5', 'ポリ #5', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_5.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-6', 'ポリ #6', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_6.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-7', 'ポリ #7', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_7.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-8', 'ポリ #8', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_8.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-9', 'ポリ #9', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_9.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-10', 'ポリ #10', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_10.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-11', 'ポリ #11', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_11.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-12', 'ポリ #12', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_12.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-13', 'ポリ #13', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_13.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-14', 'ポリ #14', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_14.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ポリ-15', 'ポリ #15', '/stickers/%E3%83%9D%E3%83%AA/%E3%83%9D%E3%83%AA_15.png', 1, 'normal', 'コモンコレクション', 20, 55, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-1', 'リボンちゃん #1', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_1.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-2', 'リボンちゃん #2', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_2.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-3', 'リボンちゃん #3', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_3.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-4', 'リボンちゃん #4', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_4.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-5', 'リボンちゃん #5', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_5.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-6', 'リボンちゃん #6', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_6.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-7', 'リボンちゃん #7', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_7.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-8', 'リボンちゃん #8', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_8.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-9', 'リボンちゃん #9', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_9.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-10', 'リボンちゃん #10', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_10.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-11', 'リボンちゃん #11', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_11.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-12', 'リボンちゃん #12', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_12.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-13', 'リボンちゃん #13', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_13.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-14', 'リボンちゃん #14', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_14.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-bondro-15', 'リボンちゃん #15', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9C%E3%83%B3%E3%83%89%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_15.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'bondro')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-1', 'リボンちゃん #16', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_16.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-2', 'リボンちゃん #17', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_17.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-3', 'リボンちゃん #18', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_18.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-4', 'リボンちゃん #19', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_19.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-5', 'リボンちゃん #20', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_20.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-6', 'リボンちゃん #21', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_21.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-7', 'リボンちゃん #22', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_22.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-8', 'リボンちゃん #23', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_23.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-9', 'リボンちゃん #24', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_24.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-10', 'リボンちゃん #25', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_25.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-11', 'リボンちゃん #26', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_26.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-12', 'リボンちゃん #27', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_27.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-13', 'リボンちゃん #28', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_28.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-14', 'リボンちゃん #29', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_29.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('リボンちゃん-marshmallow-15', 'リボンちゃん #30', '/stickers/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93/%E3%83%9E%E3%82%B7%E3%83%A5%E3%83%9E%E3%83%AD/%E3%83%AA%E3%83%9C%E3%83%B3%E3%81%A1%E3%82%83%E3%82%93_30.png', 4, 'puffy', 'ガーリーコレクション', 200, 5, 'marshmallow')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-1', 'ルミナ・スターダスト #1', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_1.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-2', 'ルミナ・スターダスト #2', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_2.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-3', 'ルミナ・スターダスト #3', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_3.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-4', 'ルミナ・スターダスト #4', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_4.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-5', 'ルミナ・スターダスト #5', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_5.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-6', 'ルミナ・スターダスト #6', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_6.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-7', 'ルミナ・スターダスト #7', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_7.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-8', 'ルミナ・スターダスト #8', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_8.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-9', 'ルミナ・スターダスト #9', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_9.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-10', 'ルミナ・スターダスト #10', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_10.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-11', 'ルミナ・スターダスト #11', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_11.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-12', 'ルミナ・スターダスト #12', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_12.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-13', 'ルミナ・スターダスト #13', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_13.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-14', 'ルミナ・スターダスト #14', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_14.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('ルミナ・スターダスト-15', 'ルミナ・スターダスト #15', '/stickers/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88/%E3%83%AB%E3%83%9F%E3%83%8A%E3%83%BB%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%80%E3%82%B9%E3%83%88_15.png', 5, 'sparkle', 'レジェンドコレクション', 500, 1, 'classic')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();

-- =============================================
-- 完了メッセージ
-- =============================================
DO $$
DECLARE
  sticker_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO sticker_count FROM stickers;
  RAISE NOTICE 'シールマスターデータ更新完了！ 合計: % 枚', sticker_count;
END;
$$;
