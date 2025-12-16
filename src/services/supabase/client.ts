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

  console.log('[Supabase] createClient called')
  console.log('[Supabase] URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET')
  console.log('[Supabase] Key:', supabaseAnonKey ? 'SET (length: ' + supabaseAnonKey.length + ')' : 'NOT SET')

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase環境変数が設定されていません。ダミーURLを使用します。')
    return createSupabaseClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  console.log('[Supabase] Creating supabase-js client...')
  const client = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true, // トークンの自動リフレッシュを有効化（セッション維持に必須）
      detectSessionInUrl: false,
      flowType: 'implicit',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'sb-pokeseal-auth-token',
      // デバッグログを有効化
      debug: process.env.NODE_ENV === 'development',
    }
  })
  console.log('[Supabase] Client created successfully')

  // 壊れたセッションの自動クリーンアップ
  if (typeof window !== 'undefined') {
    client.auth.onAuthStateChange((event, session) => {
      console.log('[Supabase] Auth state changed:', event, session ? 'session exists' : 'no session')

      // セッションエラーの場合、localStorageをクリア
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.warn('[Supabase] Token refresh failed, clearing storage')
        localStorage.removeItem('sb-pokeseal-auth-token')
      }
      if (event === 'SIGNED_OUT') {
        console.log('[Supabase] User signed out')
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
      console.log('[Supabase] Creating new global singleton instance')
      globalThis.__supabaseClient = createClientInternal()
    } else {
      console.log('[Supabase] Using existing global singleton instance')
    }
    return globalThis.__supabaseClient
  }

  // サーバーサイドの場合は毎回新しいインスタンスを作成
  console.log('[Supabase] Server-side: creating new instance')
  return createClientInternal()
}
