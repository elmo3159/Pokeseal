import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Supabaseクライアントの型
export type TypedSupabaseClient = SupabaseClient<Database>

// グローバルスコープでシングルトンを管理（HMRでも維持）
declare global {
  // eslint-disable-next-line no-var
  var __supabaseClient: TypedSupabaseClient | undefined
}

// ブラウザ用Supabaseクライアント
function createClientInternal(): TypedSupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] 環境変数が未設定。ダミーURLを使用')
    return createSupabaseClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  const client = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: 'implicit',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'sb-pokeseal-auth-token',
      // デバッグログは無効化（大量のログを防ぐ）
      debug: false,
    }
  })

  // 壊れたセッションの自動クリーンアップ（エラー時のみログ出力）
  if (typeof window !== 'undefined') {
    client.auth.onAuthStateChange((event, session) => {
      // セッションエラーの場合のみログ出力
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.warn('[Supabase] Token refresh failed, clearing storage')
        localStorage.removeItem('sb-pokeseal-auth-token')
      }
    })
  }

  return client
}

// 後方互換性のため
export function createClient(): TypedSupabaseClient {
  return getSupabase()
}

// シングルトンインスタンス取得（グローバルスコープでHMR耐性あり）
export function getSupabase(): TypedSupabaseClient {
  // ブラウザ環境でグローバル変数を使用
  if (typeof window !== 'undefined') {
    if (!globalThis.__supabaseClient) {
      globalThis.__supabaseClient = createClientInternal()
    }
    return globalThis.__supabaseClient
  }

  // サーバーサイドの場合は毎回新しいインスタンスを作成
  return createClientInternal()
}
