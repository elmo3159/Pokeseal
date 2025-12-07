import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Supabaseクライアントの型
export type TypedSupabaseClient = SupabaseClient<Database>

// ブラウザ用Supabaseクライアント
export function createClient(): TypedSupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase環境変数が設定されていません。ダミーURLを使用します。')
    // 開発時のフォールバック（実際のAPIは動作しない）
    return createBrowserClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// シングルトンインスタンス（クライアントサイドで再利用）
let supabaseInstance: TypedSupabaseClient | null = null

export function getSupabase(): TypedSupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}
