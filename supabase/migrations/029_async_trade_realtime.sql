-- =============================================
-- 非同期交換テーブルのRealtime設定
-- =============================================

-- 既存のpublicationを削除して新しく作成
-- 非同期交換テーブルを追加
DROP PUBLICATION IF EXISTS supabase_realtime;

CREATE PUBLICATION supabase_realtime FOR TABLE
  -- 既存の交換テーブル
  trades,
  trade_items,
  trade_messages,
  -- 非同期交換テーブル
  async_trade_sessions,
  async_trade_offers,
  async_trade_requests,
  async_trade_messages;

-- REPLICA IDENTITYをFULLに設定（DELETE時にoldデータを取得するため）
ALTER TABLE async_trade_sessions REPLICA IDENTITY FULL;
ALTER TABLE async_trade_offers REPLICA IDENTITY FULL;
ALTER TABLE async_trade_requests REPLICA IDENTITY FULL;
ALTER TABLE async_trade_messages REPLICA IDENTITY FULL;
