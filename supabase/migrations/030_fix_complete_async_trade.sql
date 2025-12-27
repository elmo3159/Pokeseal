-- 交換成立処理を数量ベースに修正
-- ユーザーが既に同じシールを持っている場合は数量を増やし、持っていない場合は所有者を変更

CREATE OR REPLACE FUNCTION complete_async_trade_session(p_session_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_session RECORD;
  v_request RECORD;
  v_existing_id UUID;
  v_source_sticker RECORD;
BEGIN
  -- セッション情報取得（両者が確認済みのアクティブなセッションのみ）
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

  -- responderがリクエストしたシール → requesterからresponderへ
  FOR v_request IN
    SELECT tr.target_user_sticker_id, us.sticker_id, us.upgrade_rank, us.quantity
    FROM async_trade_requests tr
    INNER JOIN user_stickers us ON us.id = tr.target_user_sticker_id
    WHERE tr.session_id = p_session_id
    AND tr.requester_id = v_session.responder_id
    AND us.user_id = v_session.requester_id  -- 現在requesterが所有
  LOOP
    -- responderが既にこのシールを持っているか確認
    SELECT id INTO v_existing_id
    FROM user_stickers
    WHERE user_id = v_session.responder_id
    AND sticker_id = v_request.sticker_id
    AND upgrade_rank = v_request.upgrade_rank;

    IF v_existing_id IS NOT NULL THEN
      -- 既に持っている: 数量を増やして元のレコードを削除
      UPDATE user_stickers SET quantity = quantity + 1, updated_at = NOW()
      WHERE id = v_existing_id;
      -- 配置も削除（外部キー制約で自動削除されない場合）
      DELETE FROM sticker_placements WHERE user_sticker_id = v_request.target_user_sticker_id;
      DELETE FROM user_stickers WHERE id = v_request.target_user_sticker_id;
    ELSE
      -- 持っていない: 所有者を変更
      UPDATE user_stickers SET user_id = v_session.responder_id, updated_at = NOW()
      WHERE id = v_request.target_user_sticker_id;
      -- 配置も削除（新しい所有者のシール帳には配置されていないので）
      DELETE FROM sticker_placements WHERE user_sticker_id = v_request.target_user_sticker_id;
    END IF;
  END LOOP;

  -- requesterがリクエストしたシール → responderからrequesterへ
  FOR v_request IN
    SELECT tr.target_user_sticker_id, us.sticker_id, us.upgrade_rank, us.quantity
    FROM async_trade_requests tr
    INNER JOIN user_stickers us ON us.id = tr.target_user_sticker_id
    WHERE tr.session_id = p_session_id
    AND tr.requester_id = v_session.requester_id
    AND us.user_id = v_session.responder_id  -- 現在responderが所有
  LOOP
    -- requesterが既にこのシールを持っているか確認
    SELECT id INTO v_existing_id
    FROM user_stickers
    WHERE user_id = v_session.requester_id
    AND sticker_id = v_request.sticker_id
    AND upgrade_rank = v_request.upgrade_rank;

    IF v_existing_id IS NOT NULL THEN
      -- 既に持っている: 数量を増やして元のレコードを削除
      UPDATE user_stickers SET quantity = quantity + 1, updated_at = NOW()
      WHERE id = v_existing_id;
      -- 配置も削除
      DELETE FROM sticker_placements WHERE user_sticker_id = v_request.target_user_sticker_id;
      DELETE FROM user_stickers WHERE id = v_request.target_user_sticker_id;
    ELSE
      -- 持っていない: 所有者を変更
      UPDATE user_stickers SET user_id = v_session.requester_id, updated_at = NOW()
      WHERE id = v_request.target_user_sticker_id;
      -- 配置も削除
      DELETE FROM sticker_placements WHERE user_sticker_id = v_request.target_user_sticker_id;
    END IF;
  END LOOP;

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
