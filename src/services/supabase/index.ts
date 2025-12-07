// クライアントサイド用のみエクスポート
// サーバーサイド用は直接 '@/services/supabase/server' からインポートしてください
export { createClient, getSupabase } from './client'
