-- =============================================
-- Phase 3.1: 古い交換のクリーンアップと改善
-- =============================================

-- 1. 古いマッチング待機交換をキャンセル（10分以上経過）
UPDATE trades
SET status = 'cancelled', updated_at = NOW()
WHERE status = 'matching'
  AND created_at < NOW() - INTERVAL '10 minutes';

-- 2. find_waiting_trades関数を改善（最近10分以内の交換のみ）
CREATE OR REPLACE FUNCTION find_waiting_trades(p_user_id UUID)
RETURNS SETOF trades AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM trades
  WHERE status = 'matching'
    AND user1_id != p_user_id
    AND user2_id IS NULL
    AND created_at > NOW() - INTERVAL '10 minutes'  -- 10分以内の交換のみ
  ORDER BY created_at DESC  -- 最新を優先
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- 3. 自分の古いマッチング交換を自動キャンセルする関数
CREATE OR REPLACE FUNCTION cleanup_my_old_trades(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE trades
  SET status = 'cancelled', updated_at = NOW()
  WHERE user1_id = p_user_id
    AND status = 'matching'
    AND created_at < NOW() - INTERVAL '5 minutes';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;
