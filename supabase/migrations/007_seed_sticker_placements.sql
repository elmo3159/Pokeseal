-- =============================================
-- シール配置テストデータ
-- 各テストユーザーのシール帳にシールを配置
-- =============================================

-- 一時テーブルで配置データを管理
CREATE TEMP TABLE temp_placements AS
WITH user_sticker_ranks AS (
  -- 各ユーザーの所持シールに連番を付与
  SELECT
    us.id as user_sticker_id,
    us.user_id,
    us.sticker_id,
    ROW_NUMBER() OVER (PARTITION BY us.user_id ORDER BY us.sticker_id) as rn
  FROM user_stickers us
),
page_data AS (
  -- 各ユーザーのページ情報
  SELECT
    p.id as page_id,
    b.user_id,
    p.page_number
  FROM sticker_book_pages p
  JOIN sticker_books b ON b.id = p.book_id
  WHERE p.page_type = 'page'
)
SELECT
  pd.page_id,
  usr.user_sticker_id,
  -- ランダムな位置を生成（0.1〜0.9の範囲）
  0.1 + (random() * 0.8) as position_x,
  0.1 + (random() * 0.8) as position_y,
  -- ランダムな回転（-15〜15度）
  -15 + (random() * 30) as rotation,
  1.0 as scale,
  usr.rn as z_index
FROM page_data pd
JOIN user_sticker_ranks usr ON usr.user_id = pd.user_id
WHERE
  -- 各ページに配置するシールを決定
  (pd.user_id = '11111111-1111-1111-1111-111111111111' AND (
    (pd.page_number = 2 AND usr.rn BETWEEN 1 AND 3) OR
    (pd.page_number = 3 AND usr.rn BETWEEN 4 AND 7) OR
    (pd.page_number = 4 AND usr.rn BETWEEN 8 AND 10)
  ))
  OR
  (pd.user_id = '22222222-2222-2222-2222-222222222222' AND (
    (pd.page_number = 2 AND usr.rn BETWEEN 1 AND 3) OR
    (pd.page_number = 3 AND usr.rn BETWEEN 4 AND 7) OR
    (pd.page_number = 4 AND usr.rn BETWEEN 8 AND 10) OR
    (pd.page_number = 5 AND usr.rn BETWEEN 11 AND 13)
  ))
  OR
  (pd.user_id = '33333333-3333-3333-3333-333333333333' AND (
    (pd.page_number = 2 AND usr.rn BETWEEN 1 AND 4) OR
    (pd.page_number = 3 AND usr.rn BETWEEN 5 AND 7)
  ));

-- 配置データを挿入
INSERT INTO sticker_placements (page_id, user_sticker_id, position_x, position_y, rotation, scale, z_index)
SELECT page_id, user_sticker_id, position_x, position_y, rotation, scale, z_index
FROM temp_placements
ON CONFLICT DO NOTHING;

-- 一時テーブルを削除
DROP TABLE temp_placements;

-- =============================================
-- 確認
-- =============================================
DO $$
DECLARE
  user_a_count INTEGER;
  user_b_count INTEGER;
  user_c_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_a_count
  FROM sticker_placements sp
  JOIN sticker_book_pages p ON p.id = sp.page_id
  JOIN sticker_books b ON b.id = p.book_id
  WHERE b.user_id = '11111111-1111-1111-1111-111111111111';

  SELECT COUNT(*) INTO user_b_count
  FROM sticker_placements sp
  JOIN sticker_book_pages p ON p.id = sp.page_id
  JOIN sticker_books b ON b.id = p.book_id
  WHERE b.user_id = '22222222-2222-2222-2222-222222222222';

  SELECT COUNT(*) INTO user_c_count
  FROM sticker_placements sp
  JOIN sticker_book_pages p ON p.id = sp.page_id
  JOIN sticker_books b ON b.id = p.book_id
  WHERE b.user_id = '33333333-3333-3333-3333-333333333333';

  RAISE NOTICE 'シール配置データ投入完了！';
  RAISE NOTICE 'テストユーザーA: % 枚', user_a_count;
  RAISE NOTICE 'テストユーザーB: % 枚', user_b_count;
  RAISE NOTICE 'テストユーザーC: % 枚', user_c_count;
END;
$$;
