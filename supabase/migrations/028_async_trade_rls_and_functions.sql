-- =============================================
-- 非同期交換システム - RLSポリシーと関数追加
-- =============================================

-- オファーからシールが削除された時の処理
CREATE OR REPLACE FUNCTION on_async_trade_offer_sticker_deleted()
RETURNS TRIGGER AS $$
DECLARE
  v_session RECORD;
  v_other_user_id UUID;
BEGIN
  -- 削除されたシールが含まれる交換セッションを取得
  FOR v_session IN
    SELECT ts.id, ts.requester_id, ts.responder_id, ts.requester_confirmed, ts.responder_confirmed
    FROM async_trade_sessions ts
    INNER JOIN async_trade_offers tof ON tof.session_id = ts.id
    WHERE tof.user_sticker_id = OLD.id
    AND ts.status IN ('pending', 'active')
  LOOP
    -- 確認状態をリセット
    UPDATE async_trade_sessions
    SET
      requester_confirmed = FALSE,
      responder_confirmed = FALSE,
      requester_confirmed_at = NULL,
      responder_confirmed_at = NULL,
      updated_at = NOW()
    WHERE id = v_session.id
    AND (requester_confirmed = TRUE OR responder_confirmed = TRUE);

    -- 相手を特定
    IF OLD.user_id = v_session.requester_id THEN
      v_other_user_id := v_session.responder_id;
    ELSE
      v_other_user_id := v_session.requester_id;
    END IF;

    -- システムメッセージを追加
    INSERT INTO async_trade_messages (session_id, sender_id, message_type, content)
    VALUES (v_session.id, OLD.user_id, 'system', 'sticker_unavailable_offer');
  END LOOP;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- リクエストからシールが削除された時の処理
CREATE OR REPLACE FUNCTION on_async_trade_request_sticker_deleted()
RETURNS TRIGGER AS $$
DECLARE
  v_session RECORD;
BEGIN
  -- 削除されたシールがリクエストされている交換セッションを取得
  FOR v_session IN
    SELECT ts.id, ts.requester_id, ts.responder_id
    FROM async_trade_sessions ts
    INNER JOIN async_trade_requests tr ON tr.session_id = ts.id
    WHERE tr.target_user_sticker_id = OLD.id
    AND ts.status IN ('pending', 'active')
  LOOP
    -- 確認状態をリセット
    UPDATE async_trade_sessions
    SET
      requester_confirmed = FALSE,
      responder_confirmed = FALSE,
      requester_confirmed_at = NULL,
      responder_confirmed_at = NULL,
      updated_at = NOW()
    WHERE id = v_session.id
    AND (requester_confirmed = TRUE OR responder_confirmed = TRUE);

    -- システムメッセージを追加
    INSERT INTO async_trade_messages (session_id, sender_id, message_type, content)
    VALUES (v_session.id, OLD.user_id, 'system', 'sticker_unavailable_request');
  END LOOP;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- user_stickers削除時のトリガー
DROP TRIGGER IF EXISTS trigger_async_trade_offer_cleanup ON user_stickers;
CREATE TRIGGER trigger_async_trade_offer_cleanup
  BEFORE DELETE ON user_stickers
  FOR EACH ROW
  EXECUTE FUNCTION on_async_trade_offer_sticker_deleted();

DROP TRIGGER IF EXISTS trigger_async_trade_request_cleanup ON user_stickers;
CREATE TRIGGER trigger_async_trade_request_cleanup
  BEFORE DELETE ON user_stickers
  FOR EACH ROW
  EXECUTE FUNCTION on_async_trade_request_sticker_deleted();

-- 交換成立処理
CREATE OR REPLACE FUNCTION complete_async_trade_session(p_session_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_session RECORD;
  v_offer RECORD;
  v_valid BOOLEAN := TRUE;
BEGIN
  -- セッション情報取得
  SELECT * INTO v_session
  FROM async_trade_sessions
  WHERE id = p_session_id
  AND status = 'active'
  AND requester_confirmed = TRUE
  AND responder_confirmed = TRUE
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- 全オファーシールの存在確認
  FOR v_offer IN
    SELECT tof.*, us.user_id as sticker_owner
    FROM async_trade_offers tof
    INNER JOIN user_stickers us ON us.id = tof.user_sticker_id
    WHERE tof.session_id = p_session_id
  LOOP
    -- シールの所有者が正しいか確認
    IF v_offer.sticker_owner != v_offer.user_id THEN
      v_valid := FALSE;
      EXIT;
    END IF;
  END LOOP;

  IF NOT v_valid THEN
    -- 確認状態をリセット
    UPDATE async_trade_sessions
    SET
      requester_confirmed = FALSE,
      responder_confirmed = FALSE,
      requester_confirmed_at = NULL,
      responder_confirmed_at = NULL,
      updated_at = NOW()
    WHERE id = p_session_id;
    RETURN FALSE;
  END IF;

  -- シールの所有権を交換
  -- requesterが出すシール → responderへ
  UPDATE user_stickers us
  SET user_id = v_session.responder_id, updated_at = NOW()
  FROM async_trade_offers tof
  WHERE tof.session_id = p_session_id
  AND tof.user_id = v_session.requester_id
  AND us.id = tof.user_sticker_id;

  -- responderが出すシール → requesterへ
  UPDATE user_stickers us
  SET user_id = v_session.requester_id, updated_at = NOW()
  FROM async_trade_offers tof
  WHERE tof.session_id = p_session_id
  AND tof.user_id = v_session.responder_id
  AND us.id = tof.user_sticker_id;

  -- セッションを完了に
  UPDATE async_trade_sessions
  SET
    status = 'completed',
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_session_id;

  -- 完了メッセージ
  INSERT INTO async_trade_messages (session_id, sender_id, message_type, content)
  VALUES (p_session_id, v_session.requester_id, 'system', 'trade_completed');

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- RLS有効化
ALTER TABLE async_trade_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE async_trade_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE async_trade_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE async_trade_messages ENABLE ROW LEVEL SECURITY;

-- async_trade_sessions: 参加者のみアクセス可能
DROP POLICY IF EXISTS "Users can view own async trade sessions" ON async_trade_sessions;
CREATE POLICY "Users can view own async trade sessions" ON async_trade_sessions
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = responder_id);

DROP POLICY IF EXISTS "Users can create async trade sessions" ON async_trade_sessions;
CREATE POLICY "Users can create async trade sessions" ON async_trade_sessions
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

DROP POLICY IF EXISTS "Participants can update async trade sessions" ON async_trade_sessions;
CREATE POLICY "Participants can update async trade sessions" ON async_trade_sessions
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = responder_id);

-- async_trade_offers: 参加者のみアクセス可能
DROP POLICY IF EXISTS "Participants can view async trade offers" ON async_trade_offers;
CREATE POLICY "Participants can view async trade offers" ON async_trade_offers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM async_trade_sessions ts
      WHERE ts.id = session_id
      AND (ts.requester_id = auth.uid() OR ts.responder_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can add own async offers" ON async_trade_offers;
CREATE POLICY "Users can add own async offers" ON async_trade_offers
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM async_trade_sessions ts
      WHERE ts.id = session_id
      AND (ts.requester_id = auth.uid() OR ts.responder_id = auth.uid())
      AND ts.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users can remove own async offers" ON async_trade_offers;
CREATE POLICY "Users can remove own async offers" ON async_trade_offers
  FOR DELETE USING (auth.uid() = user_id);

-- async_trade_requests: 参加者のみアクセス可能
DROP POLICY IF EXISTS "Participants can view async trade requests" ON async_trade_requests;
CREATE POLICY "Participants can view async trade requests" ON async_trade_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM async_trade_sessions ts
      WHERE ts.id = session_id
      AND (ts.requester_id = auth.uid() OR ts.responder_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can add async requests" ON async_trade_requests;
CREATE POLICY "Users can add async requests" ON async_trade_requests
  FOR INSERT WITH CHECK (
    auth.uid() = requester_id
    AND EXISTS (
      SELECT 1 FROM async_trade_sessions ts
      WHERE ts.id = session_id
      AND (ts.requester_id = auth.uid() OR ts.responder_id = auth.uid())
      AND ts.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users can remove own async requests" ON async_trade_requests;
CREATE POLICY "Users can remove own async requests" ON async_trade_requests
  FOR DELETE USING (auth.uid() = requester_id);

-- async_trade_messages: 参加者のみアクセス可能
DROP POLICY IF EXISTS "Participants can view async messages" ON async_trade_messages;
CREATE POLICY "Participants can view async messages" ON async_trade_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM async_trade_sessions ts
      WHERE ts.id = session_id
      AND (ts.requester_id = auth.uid() OR ts.responder_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Participants can send async messages" ON async_trade_messages;
CREATE POLICY "Participants can send async messages" ON async_trade_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM async_trade_sessions ts
      WHERE ts.id = session_id
      AND (ts.requester_id = auth.uid() OR ts.responder_id = auth.uid())
      AND ts.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Users can mark messages as read" ON async_trade_messages;
CREATE POLICY "Users can mark messages as read" ON async_trade_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM async_trade_sessions ts
      WHERE ts.id = session_id
      AND (ts.requester_id = auth.uid() OR ts.responder_id = auth.uid())
    )
  );

-- updated_atの自動更新
DROP TRIGGER IF EXISTS update_async_trade_sessions_updated_at ON async_trade_sessions;
CREATE TRIGGER update_async_trade_sessions_updated_at
  BEFORE UPDATE ON async_trade_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 期限切れセッションの自動処理用ビュー
CREATE OR REPLACE VIEW expired_async_trade_sessions AS
SELECT id, requester_id, responder_id, status, expires_at
FROM async_trade_sessions
WHERE status IN ('pending', 'active')
AND expires_at < NOW();
