-- =============================================
-- Pokeseal テストデータ投入スクリプト
-- 001_create_tables.sql の後に実行してください
-- =============================================

-- =============================================
-- 1. テストユーザーの作成（認証なしでテスト用）
-- =============================================
-- 注意: 本番環境ではSupabase Authを使用してユーザーを作成します
-- テスト用に固定UUIDを使用

INSERT INTO profiles (id, username, display_name, bio, star_points, tutorial_completed)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'test-user-a', 'テストユーザーA', '🐱 シールあつめがすき！', 1000, true),
  ('22222222-2222-2222-2222-222222222222', 'test-user-b', 'テストユーザーB', '🐶 シールあつめがすき！', 1000, true),
  ('33333333-3333-3333-3333-333333333333', 'test-user-c', 'テストユーザーC', '🐰 シールあつめがすき！', 1000, true)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  updated_at = NOW();

-- =============================================
-- 2. シールマスターデータの投入（12キャラ x 15種類 = 180枚）
-- =============================================

-- もっちも（★5 レジェンド）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight)
SELECT
  'mocchimo-' || n,
  'もっちも ' || n,
  '/stickers/もっちも/もっちも_' || n || '.png',
  5,
  'sparkle',
  'もっちも',
  500,
  1
FROM generate_series(1, 15) AS n
ON CONFLICT (id) DO NOTHING;

-- ウールン（★5 レジェンド）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight)
SELECT
  'woolun-' || n,
  'ウールン ' || n,
  '/stickers/ウールン/ウールン_' || n || '.png',
  5,
  'sparkle',
  'ウールン',
  500,
  1
FROM generate_series(1, 15) AS n
ON CONFLICT (id) DO NOTHING;

-- トイラン（★5 レジェンド）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight)
SELECT
  'toiran-' || n,
  'トイラン ' || n,
  '/stickers/トイラン/トイラン_' || n || '.png',
  5,
  'sparkle',
  'トイラン',
  500,
  1
FROM generate_series(1, 15) AS n
ON CONFLICT (id) DO NOTHING;

-- スタラ（★4 スーパーレア）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight)
SELECT
  'sutara-' || n,
  'スタラ ' || n,
  '/stickers/スタラ/スタラ_' || n || '.png',
  4,
  'puffy',
  'スタラ',
  200,
  5
FROM generate_series(1, 15) AS n
ON CONFLICT (id) DO NOTHING;

-- チャックン（★4 スーパーレア）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight)
SELECT
  'chakkun-' || n,
  'チャックン ' || n,
  '/stickers/チャックン/チャックン_' || n || '.png',
  4,
  'puffy',
  'チャックン',
  200,
  5
FROM generate_series(1, 15) AS n
ON CONFLICT (id) DO NOTHING;

-- ドロル（★3 レア）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight)
SELECT
  'dororu-' || n,
  'ドロル ' || n,
  '/stickers/ドロル/ドロル_' || n || '.png',
  3,
  'normal',
  'ドロル',
  100,
  15
FROM generate_series(1, 15) AS n
ON CONFLICT (id) DO NOTHING;

-- サニたん（★3 レア）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight)
SELECT
  'sanitan-' || n,
  'サニたん ' || n,
  '/stickers/サニたん/サニたん_' || n || '.png',
  3,
  'normal',
  'サニたん',
  100,
  15
FROM generate_series(1, 15) AS n
ON CONFLICT (id) DO NOTHING;

-- コケボ（★2 アンコモン）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight)
SELECT
  'kokebo-' || n,
  'コケボ ' || n,
  '/stickers/コケボ/コケボ_' || n || '.png',
  2,
  'normal',
  'コケボ',
  50,
  30
FROM generate_series(1, 15) AS n
ON CONFLICT (id) DO NOTHING;

-- キノぼう（★2 アンコモン）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight)
SELECT
  'kinobou-' || n,
  'キノぼう ' || n,
  '/stickers/キノぼう/キノぼう_' || n || '.png',
  2,
  'normal',
  'キノぼう',
  50,
  30
FROM generate_series(1, 15) AS n
ON CONFLICT (id) DO NOTHING;

-- ポフン（★1 コモン）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight)
SELECT
  'pofun-' || n,
  'ポフン ' || n,
  '/stickers/ポフン/sticker_' || n || '.png',
  1,
  'normal',
  'ポフン',
  20,
  55
FROM generate_series(1, 15) AS n
ON CONFLICT (id) DO NOTHING;

-- ポリ（★1 コモン）
INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight)
SELECT
  'pori-' || n,
  'ポリ ' || n,
  '/stickers/ポリ/ポリ_' || n || '.png',
  1,
  'normal',
  'ポリ',
  20,
  55
FROM generate_series(1, 15) AS n
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 3. テストユーザーにシールを配布
-- =============================================

-- テストユーザーA: もっちも系とポフン系を多めに
INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
SELECT
  '11111111-1111-1111-1111-111111111111',
  'mocchimo-' || n,
  2,
  2
FROM generate_series(1, 5) AS n
ON CONFLICT (user_id, sticker_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
SELECT
  '11111111-1111-1111-1111-111111111111',
  'pofun-' || n,
  3,
  3
FROM generate_series(1, 10) AS n
ON CONFLICT (user_id, sticker_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
SELECT
  '11111111-1111-1111-1111-111111111111',
  'kokebo-' || n,
  2,
  2
FROM generate_series(1, 5) AS n
ON CONFLICT (user_id, sticker_id) DO UPDATE SET quantity = EXCLUDED.quantity;

-- テストユーザーB: ウールン系とドロル系を多めに
INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
SELECT
  '22222222-2222-2222-2222-222222222222',
  'woolun-' || n,
  2,
  2
FROM generate_series(1, 5) AS n
ON CONFLICT (user_id, sticker_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
SELECT
  '22222222-2222-2222-2222-222222222222',
  'dororu-' || n,
  3,
  3
FROM generate_series(1, 10) AS n
ON CONFLICT (user_id, sticker_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
SELECT
  '22222222-2222-2222-2222-222222222222',
  'kinobou-' || n,
  2,
  2
FROM generate_series(1, 5) AS n
ON CONFLICT (user_id, sticker_id) DO UPDATE SET quantity = EXCLUDED.quantity;

-- テストユーザーC: トイラン系とスタラ系を多めに
INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
SELECT
  '33333333-3333-3333-3333-333333333333',
  'toiran-' || n,
  2,
  2
FROM generate_series(1, 5) AS n
ON CONFLICT (user_id, sticker_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
SELECT
  '33333333-3333-3333-3333-333333333333',
  'sutara-' || n,
  3,
  3
FROM generate_series(1, 10) AS n
ON CONFLICT (user_id, sticker_id) DO UPDATE SET quantity = EXCLUDED.quantity;

INSERT INTO user_stickers (user_id, sticker_id, quantity, total_acquired)
SELECT
  '33333333-3333-3333-3333-333333333333',
  'sanitan-' || n,
  2,
  2
FROM generate_series(1, 5) AS n
ON CONFLICT (user_id, sticker_id) DO UPDATE SET quantity = EXCLUDED.quantity;

-- =============================================
-- 4. 各ユーザーのシール帳を作成
-- =============================================

INSERT INTO sticker_books (id, user_id, name)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'テストユーザーAのシール帳'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'テストユーザーBのシール帳'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'テストユーザーCのシール帳')
ON CONFLICT (id) DO NOTHING;

-- 各シール帳に6ページを追加
INSERT INTO sticker_book_pages (book_id, page_number, page_type, side)
SELECT
  book_id,
  page_num,
  CASE
    WHEN page_num = 1 THEN 'cover'
    WHEN page_num = 6 THEN 'back-cover'
    ELSE 'page'
  END,
  CASE
    WHEN page_num = 1 THEN 'right'
    WHEN page_num = 6 THEN 'left'
    WHEN page_num % 2 = 0 THEN 'left'
    ELSE 'right'
  END
FROM (
  SELECT unnest(ARRAY[
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid
  ]) AS book_id
) books
CROSS JOIN generate_series(1, 6) AS page_num
ON CONFLICT DO NOTHING;

-- =============================================
-- 完了メッセージ
-- =============================================
DO $$
BEGIN
  RAISE NOTICE 'テストデータ投入完了！';
  RAISE NOTICE 'テストユーザーA: 11111111-1111-1111-1111-111111111111';
  RAISE NOTICE 'テストユーザーB: 22222222-2222-2222-2222-222222222222';
  RAISE NOTICE 'テストユーザーC: 33333333-3333-3333-3333-333333333333';
END;
$$;
