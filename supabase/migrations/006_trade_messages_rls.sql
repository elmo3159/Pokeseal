-- =============================================
-- trade_messagesテーブルのRLSポリシー
-- =============================================

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "trade_messages_insert_policy" ON trade_messages;
DROP POLICY IF EXISTS "trade_messages_select_policy" ON trade_messages;
DROP POLICY IF EXISTS "trade_messages_allow_all" ON trade_messages;

-- テスト用: 全員が挿入・閲覧できるポリシー
CREATE POLICY "trade_messages_allow_all" ON trade_messages
FOR ALL USING (true) WITH CHECK (true);
