-- =====================================================
-- RPC関数のテーブル名・カラム名を修正
-- 実際のスキーマに合わせて修正
-- =====================================================

-- =====================================================
-- 1. get_user_stats - 統計取得関数の修正
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
  -- 取引統計（async_trade_sessions から）
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed')
  INTO v_total_trades, v_successful_trades
  FROM async_trade_sessions
  WHERE requester_id = p_user_id OR responder_id = p_user_id;

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

  -- いいね受け取り数（reactions + posts テーブル）
  SELECT COUNT(*) INTO v_reactions_received
  FROM reactions r
  INNER JOIN posts p ON r.post_id = p.id
  WHERE p.user_id = p_user_id;

  -- 投稿数（posts テーブル）
  SELECT COUNT(*) INTO v_posts_count
  FROM posts WHERE user_id = p_user_id;

  -- ログイン日数（user_progressから、なければlogin_bonus_historyから推定）
  SELECT COALESCE(
    (SELECT login_streak FROM user_progress WHERE user_id = p_user_id),
    (SELECT COUNT(DISTINCT login_date) FROM login_bonus_history WHERE user_id = p_user_id),
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
-- 2. update_daily_mission_progress - デイリーミッション進捗更新の修正
-- カラム名修正: mission_type→type, target_count→goal, current_progress→progress, mission_date→date
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
    SELECT dm.id as definition_id, udm.id as user_mission_id, udm.progress, dm.goal
    FROM daily_missions dm
    LEFT JOIN user_daily_missions udm ON dm.id = udm.mission_id
      AND udm.user_id = p_user_id
      AND udm.date = v_today
    WHERE dm.type = p_mission_type
      AND dm.is_active = true
  LOOP
    IF v_mission.user_mission_id IS NULL THEN
      -- レコードがなければ作成
      INSERT INTO user_daily_missions (user_id, mission_id, date, progress)
      VALUES (p_user_id, v_mission.definition_id, v_today, p_increment);
      v_updated_count := v_updated_count + 1;
    ELSIF v_mission.progress < v_mission.goal THEN
      -- 未達成なら進捗を更新
      UPDATE user_daily_missions
      SET progress = LEAST(progress + p_increment, v_mission.goal),
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
-- 3. claim_daily_mission_reward - ミッション報酬受け取りの修正
-- カラム名修正: target_count→goal, current_progress→progress,
-- is_claimed→claimed, reward_tickets/gems/exp→reward_type/reward_amount
-- =====================================================
CREATE OR REPLACE FUNCTION claim_daily_mission_reward(
  p_user_id UUID,
  p_mission_id TEXT
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
    AND date = v_today;

  IF v_user_mission IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'no_progress');
  END IF;

  IF v_user_mission.claimed THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_claimed');
  END IF;

  IF v_user_mission.progress < v_mission.goal THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_completed');
  END IF;

  -- 報酬を受け取り済みにマーク
  UPDATE user_daily_missions
  SET claimed = true, completed_at = NOW()
  WHERE id = v_user_mission.id;

  RETURN jsonb_build_object(
    'success', true,
    'rewards', jsonb_build_object(
      'reward_type', v_mission.reward_type,
      'reward_amount', v_mission.reward_amount
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. get_collection_rewards_status - コレクション報酬状態取得の修正
-- カラム名修正: milestone_percent→completion_percentage,
-- reward_tickets/gems→reward_type/reward_amount
-- user_collection_rewardsにはis_claimed列がない（claimed_atで判定）
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
      'completion_percentage', cr.completion_percentage,
      'reward_type', cr.reward_type,
      'reward_amount', cr.reward_amount,
      'badge_title', cr.badge_title,
      'badge_description', cr.badge_description,
      'badge_icon', cr.badge_icon,
      'is_claimable', v_completion_rate >= cr.completion_percentage,
      'is_claimed', ucr.claimed_at IS NOT NULL,
      'claimed_at', ucr.claimed_at
    )
    ORDER BY cr.sort_order, cr.completion_percentage
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
-- 5. claim_collection_reward - コレクション報酬受け取りの修正
-- カラム名修正: milestone_percent→completion_percentage
-- is_claimed列がないので、claimed_atで判定
-- =====================================================
CREATE OR REPLACE FUNCTION claim_collection_reward(
  p_user_id UUID,
  p_reward_id TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_reward RECORD;
  v_completion_rate NUMERIC;
  v_total_stickers INTEGER;
  v_unique_owned INTEGER;
  v_already_claimed TIMESTAMP WITH TIME ZONE;
BEGIN
  -- 報酬定義を取得
  SELECT * INTO v_reward
  FROM collection_rewards
  WHERE id = p_reward_id;

  IF v_reward IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'reward_not_found');
  END IF;

  -- 既に受け取り済みかチェック（claimed_atで判定）
  SELECT claimed_at INTO v_already_claimed
  FROM user_collection_rewards
  WHERE user_id = p_user_id AND reward_id = p_reward_id;

  IF v_already_claimed IS NOT NULL THEN
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
  IF v_completion_rate < v_reward.completion_percentage THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_eligible');
  END IF;

  -- 報酬を受け取り
  INSERT INTO user_collection_rewards (user_id, reward_id, claimed_at)
  VALUES (p_user_id, p_reward_id, NOW())
  ON CONFLICT (user_id, reward_id)
  DO UPDATE SET claimed_at = NOW();

  RETURN jsonb_build_object(
    'success', true,
    'rewards', jsonb_build_object(
      'reward_type', v_reward.reward_type,
      'reward_amount', v_reward.reward_amount
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. get_today_missions - 今日のミッション一覧取得の修正
-- カラム名修正: mission_type→type, target_count→goal,
-- current_progress→progress, is_claimed→claimed, mission_date→date
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
        'type', dm.type,
        'title', dm.title,
        'description', dm.description,
        'goal', dm.goal,
        'progress', COALESCE(udm.progress, 0),
        'is_completed', COALESCE(udm.progress, 0) >= dm.goal,
        'is_claimed', COALESCE(udm.claimed, false),
        'reward_type', dm.reward_type,
        'reward_amount', dm.reward_amount,
        'difficulty', dm.difficulty
      )
      ORDER BY dm.id
    )
    FROM daily_missions dm
    LEFT JOIN user_daily_missions udm ON dm.id = udm.mission_id
      AND udm.user_id = p_user_id
      AND udm.date = v_today
    WHERE dm.is_active = true
  ), '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. get_or_create_user_progress - 変更なし（正しい）
-- =====================================================
-- この関数は既に正しいカラム名を使用しているため、再定義不要

-- =====================================================
-- 8. add_user_exp - 変更なし（正しい）
-- =====================================================
-- この関数は既に正しいカラム名を使用しているため、再定義不要

-- =====================================================
-- 9-14. ミッション関連のヘルパー関数 - 変更なし
-- これらはupdate_daily_mission_progressを呼び出すのみなので
-- 修正済みの親関数が正しく動作すれば問題なし
-- =====================================================

-- =====================================================
-- 追加: シンプルなユーザー統計取得関数（軽量版）
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_simple_stats(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_followers_count INTEGER := 0;
  v_following_count INTEGER := 0;
  v_posts_count INTEGER := 0;
  v_unique_stickers INTEGER := 0;
BEGIN
  -- フォロワー数
  SELECT COUNT(*) INTO v_followers_count
  FROM follows WHERE following_id = p_user_id;

  -- フォロー数
  SELECT COUNT(*) INTO v_following_count
  FROM follows WHERE follower_id = p_user_id;

  -- 投稿数
  SELECT COUNT(*) INTO v_posts_count
  FROM posts WHERE user_id = p_user_id;

  -- ユニークシール数
  SELECT COUNT(DISTINCT sticker_id) INTO v_unique_stickers
  FROM user_stickers WHERE user_id = p_user_id;

  RETURN jsonb_build_object(
    'followers_count', v_followers_count,
    'following_count', v_following_count,
    'posts_count', v_posts_count,
    'unique_stickers', v_unique_stickers
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RPC関数にパーミッション付与
-- =====================================================
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_simple_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_daily_mission_progress(UUID, VARCHAR, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION claim_daily_mission_reward(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_collection_rewards_status(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION claim_collection_reward(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_today_missions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_user_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION add_user_exp(UUID, INTEGER, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION record_gacha_pull(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION record_timeline_post(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION record_reaction(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION record_sticker_book_save(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION record_trade_complete(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION record_daily_login(UUID) TO authenticated;
