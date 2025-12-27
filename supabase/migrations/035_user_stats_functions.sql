-- =====================================================
-- ユーザー統計用RPC関数
-- 統計・実績・ミッション・コレクション機能の本番実装
-- =====================================================

-- =====================================================
-- 1. ユーザー統計を取得する関数（総合）
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total_trades INTEGER := 0;
  v_successful_trades INTEGER := 0;
  v_friends_count INTEGER := 0;
  v_followers_count INTEGER := 0;
  v_following_count INTEGER := 0;
  v_reactions_received INTEGER := 0;
  v_posts_count INTEGER := 0;
  v_login_days INTEGER := 1;
  v_completed_series INTEGER := 0;
  v_total_stickers INTEGER := 0;
  v_unique_stickers INTEGER := 0;
  v_prism_stickers INTEGER := 0;
  v_gacha_pulls INTEGER := 0;
  v_mystery_posts_sent INTEGER := 0;
  v_mystery_posts_received INTEGER := 0;
BEGIN
  -- 取引統計（async_trades から）
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed')
  INTO v_total_trades, v_successful_trades
  FROM async_trades
  WHERE sender_id = p_user_id OR receiver_id = p_user_id;

  -- フォロー統計
  SELECT COUNT(*) INTO v_followers_count
  FROM follows WHERE following_id = p_user_id;

  SELECT COUNT(*) INTO v_following_count
  FROM follows WHERE follower_id = p_user_id;

  -- 相互フォロー（フレンド）数
  SELECT COUNT(*) INTO v_friends_count
  FROM follows f1
  INNER JOIN follows f2 ON f1.follower_id = f2.following_id AND f1.following_id = f2.follower_id
  WHERE f1.follower_id = p_user_id;

  -- いいね受け取り数
  SELECT COUNT(*) INTO v_reactions_received
  FROM timeline_reactions tr
  INNER JOIN timeline_posts tp ON tr.post_id = tp.id
  WHERE tp.user_id = p_user_id;

  -- 投稿数
  SELECT COUNT(*) INTO v_posts_count
  FROM timeline_posts WHERE user_id = p_user_id;

  -- ログイン日数（user_progressから、なければlogin_bonusから推定）
  SELECT COALESCE(
    (SELECT login_streak FROM user_progress WHERE user_id = p_user_id),
    (SELECT COUNT(DISTINCT DATE(claimed_at)) FROM login_bonus_claims WHERE user_id = p_user_id),
    1
  ) INTO v_login_days;

  -- シール統計
  SELECT
    COALESCE(SUM(quantity), 0),
    COUNT(DISTINCT sticker_id)
  INTO v_total_stickers, v_unique_stickers
  FROM user_stickers WHERE user_id = p_user_id;

  -- プリズムシール数
  SELECT COUNT(*) INTO v_prism_stickers
  FROM user_stickers
  WHERE user_id = p_user_id AND upgrade_rank = 3;

  -- ガチャ回数（user_progressから）
  SELECT COALESCE(gacha_pulls, 0) INTO v_gacha_pulls
  FROM user_progress WHERE user_id = p_user_id;

  -- ミステリーポスト統計
  SELECT COUNT(*) INTO v_mystery_posts_sent
  FROM mystery_posts WHERE sender_id = p_user_id;

  SELECT COUNT(*) INTO v_mystery_posts_received
  FROM mystery_posts WHERE receiver_id = p_user_id;

  -- コンプリートシリーズ数を計算
  -- 各シリーズのシール数と所持数を比較
  WITH series_completion AS (
    SELECT
      s.series,
      COUNT(DISTINCT s.id) as total_in_series,
      COUNT(DISTINCT us.sticker_id) as owned_in_series
    FROM stickers s
    LEFT JOIN user_stickers us ON s.id = us.sticker_id AND us.user_id = p_user_id
    WHERE s.series IS NOT NULL AND s.series != ''
    GROUP BY s.series
  )
  SELECT COUNT(*) INTO v_completed_series
  FROM series_completion
  WHERE total_in_series = owned_in_series AND owned_in_series > 0;

  RETURN jsonb_build_object(
    'total_trades', v_total_trades,
    'successful_trades', v_successful_trades,
    'friends_count', v_friends_count,
    'followers_count', v_followers_count,
    'following_count', v_following_count,
    'reactions_received', v_reactions_received,
    'posts_count', v_posts_count,
    'login_days', v_login_days,
    'completed_series', v_completed_series,
    'total_stickers', v_total_stickers,
    'unique_stickers', v_unique_stickers,
    'prism_stickers', v_prism_stickers,
    'gacha_pulls', v_gacha_pulls,
    'mystery_posts_sent', v_mystery_posts_sent,
    'mystery_posts_received', v_mystery_posts_received
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. デイリーミッション進捗を一括更新する関数
-- =====================================================
CREATE OR REPLACE FUNCTION update_daily_mission_progress(
  p_user_id UUID,
  p_mission_type VARCHAR(50),
  p_increment INTEGER DEFAULT 1
)
RETURNS JSONB AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_mission RECORD;
  v_updated_count INTEGER := 0;
BEGIN
  -- 今日の該当タイプのミッションを全て更新
  FOR v_mission IN
    SELECT dm.id as definition_id, udm.id as user_mission_id, udm.current_progress, dm.target_count
    FROM daily_missions dm
    LEFT JOIN user_daily_missions udm ON dm.id = udm.mission_id
      AND udm.user_id = p_user_id
      AND udm.mission_date = v_today
    WHERE dm.mission_type = p_mission_type
      AND dm.is_active = true
  LOOP
    IF v_mission.user_mission_id IS NULL THEN
      -- レコードがなければ作成
      INSERT INTO user_daily_missions (user_id, mission_id, mission_date, current_progress)
      VALUES (p_user_id, v_mission.definition_id, v_today, p_increment);
      v_updated_count := v_updated_count + 1;
    ELSIF v_mission.current_progress < v_mission.target_count THEN
      -- 未達成なら進捗を更新
      UPDATE user_daily_missions
      SET current_progress = LEAST(current_progress + p_increment, v_mission.target_count),
          updated_at = NOW()
      WHERE id = v_mission.user_mission_id;
      v_updated_count := v_updated_count + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'updated_count', v_updated_count,
    'mission_type', p_mission_type
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. ミッション完了時に報酬を受け取る関数（改良版）
-- =====================================================
CREATE OR REPLACE FUNCTION claim_daily_mission_reward(
  p_user_id UUID,
  p_mission_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_mission RECORD;
  v_user_mission RECORD;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- ミッション定義を取得
  SELECT * INTO v_mission
  FROM daily_missions
  WHERE id = p_mission_id;

  IF v_mission IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'mission_not_found');
  END IF;

  -- ユーザーの進捗を取得
  SELECT * INTO v_user_mission
  FROM user_daily_missions
  WHERE user_id = p_user_id
    AND mission_id = p_mission_id
    AND mission_date = v_today;

  IF v_user_mission IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'no_progress');
  END IF;

  IF v_user_mission.is_claimed THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_claimed');
  END IF;

  IF v_user_mission.current_progress < v_mission.target_count THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_completed');
  END IF;

  -- 報酬を受け取り済みにマーク
  UPDATE user_daily_missions
  SET is_claimed = true, claimed_at = NOW()
  WHERE id = v_user_mission.id;

  RETURN jsonb_build_object(
    'success', true,
    'rewards', jsonb_build_object(
      'tickets', v_mission.reward_tickets,
      'gems', v_mission.reward_gems,
      'exp', v_mission.reward_exp
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. コレクション報酬の状態を取得する関数（改良版）
-- =====================================================
CREATE OR REPLACE FUNCTION get_collection_rewards_status(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_total_stickers INTEGER;
  v_unique_owned INTEGER;
  v_completion_rate NUMERIC;
  v_rewards JSONB;
BEGIN
  -- 全シール数を取得
  SELECT COUNT(*) INTO v_total_stickers FROM stickers;

  -- ユーザーが所持するユニークシール数
  SELECT COUNT(DISTINCT sticker_id) INTO v_unique_owned
  FROM user_stickers WHERE user_id = p_user_id;

  -- 完成率を計算
  IF v_total_stickers > 0 THEN
    v_completion_rate := (v_unique_owned::NUMERIC / v_total_stickers) * 100;
  ELSE
    v_completion_rate := 0;
  END IF;

  -- 各報酬の状態を取得
  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', cr.id,
      'milestone_percent', cr.milestone_percent,
      'reward_tickets', cr.reward_tickets,
      'reward_gems', cr.reward_gems,
      'is_claimable', v_completion_rate >= cr.milestone_percent,
      'is_claimed', COALESCE(ucr.is_claimed, false),
      'claimed_at', ucr.claimed_at
    )
    ORDER BY cr.milestone_percent
  ), '[]'::jsonb) INTO v_rewards
  FROM collection_rewards cr
  LEFT JOIN user_collection_rewards ucr ON cr.id = ucr.reward_id AND ucr.user_id = p_user_id;

  RETURN jsonb_build_object(
    'total_stickers', v_total_stickers,
    'unique_owned', v_unique_owned,
    'completion_rate', ROUND(v_completion_rate, 2),
    'rewards', v_rewards
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. コレクション報酬を受け取る関数
-- =====================================================
CREATE OR REPLACE FUNCTION claim_collection_reward(
  p_user_id UUID,
  p_reward_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_reward RECORD;
  v_completion_rate NUMERIC;
  v_total_stickers INTEGER;
  v_unique_owned INTEGER;
  v_already_claimed BOOLEAN;
BEGIN
  -- 報酬定義を取得
  SELECT * INTO v_reward
  FROM collection_rewards
  WHERE id = p_reward_id;

  IF v_reward IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'reward_not_found');
  END IF;

  -- 既に受け取り済みかチェック
  SELECT is_claimed INTO v_already_claimed
  FROM user_collection_rewards
  WHERE user_id = p_user_id AND reward_id = p_reward_id;

  IF v_already_claimed THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_claimed');
  END IF;

  -- 完成率を計算
  SELECT COUNT(*) INTO v_total_stickers FROM stickers;
  SELECT COUNT(DISTINCT sticker_id) INTO v_unique_owned
  FROM user_stickers WHERE user_id = p_user_id;

  IF v_total_stickers > 0 THEN
    v_completion_rate := (v_unique_owned::NUMERIC / v_total_stickers) * 100;
  ELSE
    v_completion_rate := 0;
  END IF;

  -- 条件を満たしているかチェック
  IF v_completion_rate < v_reward.milestone_percent THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_eligible');
  END IF;

  -- 報酬を受け取り
  INSERT INTO user_collection_rewards (user_id, reward_id, is_claimed, claimed_at)
  VALUES (p_user_id, p_reward_id, true, NOW())
  ON CONFLICT (user_id, reward_id)
  DO UPDATE SET is_claimed = true, claimed_at = NOW();

  RETURN jsonb_build_object(
    'success', true,
    'rewards', jsonb_build_object(
      'tickets', v_reward.reward_tickets,
      'gems', v_reward.reward_gems
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. 今日のデイリーミッション一覧を取得（進捗込み）
-- =====================================================
CREATE OR REPLACE FUNCTION get_today_missions(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
BEGIN
  RETURN COALESCE((
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', dm.id,
        'mission_type', dm.mission_type,
        'title', dm.title,
        'description', dm.description,
        'target_count', dm.target_count,
        'current_progress', COALESCE(udm.current_progress, 0),
        'is_completed', COALESCE(udm.current_progress, 0) >= dm.target_count,
        'is_claimed', COALESCE(udm.is_claimed, false),
        'reward_tickets', dm.reward_tickets,
        'reward_gems', dm.reward_gems,
        'reward_exp', dm.reward_exp
      )
      ORDER BY dm.sort_order
    )
    FROM daily_missions dm
    LEFT JOIN user_daily_missions udm ON dm.id = udm.mission_id
      AND udm.user_id = p_user_id
      AND udm.mission_date = v_today
    WHERE dm.is_active = true
  ), '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. ユーザー進捗を取得または作成（改良版）
-- =====================================================
CREATE OR REPLACE FUNCTION get_or_create_user_progress(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_progress RECORD;
BEGIN
  -- 既存の進捗を取得
  SELECT * INTO v_progress
  FROM user_progress
  WHERE user_id = p_user_id;

  -- なければ作成
  IF v_progress IS NULL THEN
    INSERT INTO user_progress (user_id, level, total_exp, login_streak, last_login_date)
    VALUES (p_user_id, 1, 0, 1, CURRENT_DATE)
    RETURNING * INTO v_progress;
  END IF;

  RETURN jsonb_build_object(
    'user_id', v_progress.user_id,
    'level', v_progress.level,
    'total_exp', v_progress.total_exp,
    'login_streak', v_progress.login_streak,
    'last_login_date', v_progress.last_login_date,
    'gacha_pulls', COALESCE(v_progress.gacha_pulls, 0),
    'badges', COALESCE(v_progress.badges, '[]'::jsonb)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. 経験値を追加してレベルアップ処理
-- =====================================================
CREATE OR REPLACE FUNCTION add_user_exp(
  p_user_id UUID,
  p_exp_amount INTEGER,
  p_action_type VARCHAR(50) DEFAULT 'other'
)
RETURNS JSONB AS $$
DECLARE
  v_progress RECORD;
  v_new_total_exp INTEGER;
  v_new_level INTEGER;
  v_level_up BOOLEAN := false;
BEGIN
  -- 進捗を取得（なければ作成）
  SELECT * INTO v_progress
  FROM user_progress
  WHERE user_id = p_user_id;

  IF v_progress IS NULL THEN
    INSERT INTO user_progress (user_id, level, total_exp)
    VALUES (p_user_id, 1, 0)
    RETURNING * INTO v_progress;
  END IF;

  -- 新しい経験値を計算
  v_new_total_exp := v_progress.total_exp + p_exp_amount;

  -- レベル計算（100exp per level、簡易版）
  v_new_level := GREATEST(1, (v_new_total_exp / 100) + 1);

  IF v_new_level > v_progress.level THEN
    v_level_up := true;
  END IF;

  -- 更新
  UPDATE user_progress
  SET total_exp = v_new_total_exp,
      level = v_new_level,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'old_level', v_progress.level,
    'new_level', v_new_level,
    'old_exp', v_progress.total_exp,
    'new_exp', v_new_total_exp,
    'exp_gained', p_exp_amount,
    'level_up', v_level_up,
    'action_type', p_action_type
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. ガチャ回数を記録（ミッション進捗も更新）
-- =====================================================
CREATE OR REPLACE FUNCTION record_gacha_pull(
  p_user_id UUID,
  p_pull_count INTEGER DEFAULT 1
)
RETURNS JSONB AS $$
DECLARE
  v_mission_update JSONB;
BEGIN
  -- user_progressのガチャ回数を更新
  UPDATE user_progress
  SET gacha_pulls = COALESCE(gacha_pulls, 0) + p_pull_count,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  -- レコードがなければ作成
  IF NOT FOUND THEN
    INSERT INTO user_progress (user_id, gacha_pulls)
    VALUES (p_user_id, p_pull_count);
  END IF;

  -- デイリーミッションの進捗を更新
  SELECT update_daily_mission_progress(p_user_id, 'gacha', p_pull_count) INTO v_mission_update;

  RETURN jsonb_build_object(
    'success', true,
    'pull_count', p_pull_count,
    'mission_update', v_mission_update
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. タイムライン投稿時のミッション進捗更新
-- =====================================================
CREATE OR REPLACE FUNCTION record_timeline_post(p_user_id UUID)
RETURNS JSONB AS $$
BEGIN
  RETURN update_daily_mission_progress(p_user_id, 'post', 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 11. いいね時のミッション進捗更新
-- =====================================================
CREATE OR REPLACE FUNCTION record_reaction(p_user_id UUID)
RETURNS JSONB AS $$
BEGIN
  RETURN update_daily_mission_progress(p_user_id, 'reaction', 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 12. シール帳保存時のミッション進捗更新
-- =====================================================
CREATE OR REPLACE FUNCTION record_sticker_book_save(p_user_id UUID)
RETURNS JSONB AS $$
BEGIN
  RETURN update_daily_mission_progress(p_user_id, 'sticker_book', 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 13. 交換完了時のミッション進捗更新
-- =====================================================
CREATE OR REPLACE FUNCTION record_trade_complete(p_user_id UUID)
RETURNS JSONB AS $$
BEGIN
  RETURN update_daily_mission_progress(p_user_id, 'trade', 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 14. ログイン記録（ログインボーナス連携）
-- =====================================================
CREATE OR REPLACE FUNCTION record_daily_login(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_progress RECORD;
  v_last_login DATE;
  v_new_streak INTEGER;
  v_mission_update JSONB;
BEGIN
  SELECT * INTO v_progress
  FROM user_progress
  WHERE user_id = p_user_id;

  IF v_progress IS NULL THEN
    INSERT INTO user_progress (user_id, login_streak, last_login_date)
    VALUES (p_user_id, 1, CURRENT_DATE)
    RETURNING * INTO v_progress;
    v_new_streak := 1;
  ELSE
    v_last_login := v_progress.last_login_date;

    IF v_last_login = CURRENT_DATE THEN
      -- 今日既にログイン済み
      RETURN jsonb_build_object(
        'success', true,
        'already_logged_in', true,
        'login_streak', v_progress.login_streak
      );
    ELSIF v_last_login = CURRENT_DATE - INTERVAL '1 day' THEN
      -- 連続ログイン
      v_new_streak := v_progress.login_streak + 1;
    ELSE
      -- 連続切れ
      v_new_streak := 1;
    END IF;

    UPDATE user_progress
    SET login_streak = v_new_streak,
        last_login_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  -- デイリーミッションの進捗を更新（ログインミッション）
  SELECT update_daily_mission_progress(p_user_id, 'login', 1) INTO v_mission_update;

  RETURN jsonb_build_object(
    'success', true,
    'login_streak', v_new_streak,
    'mission_update', v_mission_update
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
