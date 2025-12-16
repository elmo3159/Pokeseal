-- 017: テストデータのクリーンアップ
-- mystery_postsとtrade_scout関連のテストデータを削除

-- mystery_postsテーブルの全データを削除
DELETE FROM mystery_posts;

-- trade_scout_settingsテーブルの全データを削除
DELETE FROM trade_scout_settings;

-- trade_scout_matchesテーブルの全データを削除
DELETE FROM trade_scout_matches;

-- コメント追加
COMMENT ON TABLE mystery_posts IS 'Mystery post system - cleaned up on 2025-12-17';
COMMENT ON TABLE trade_scout_settings IS 'Trade scout settings - cleaned up on 2025-12-17';
COMMENT ON TABLE trade_scout_matches IS 'Trade scout matches - cleaned up on 2025-12-17';
