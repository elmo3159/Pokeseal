/**
 * キャッシングサービス
 * メモリキャッシュとlocalStorageキャッシュを提供
 */

// キャッシュエントリの型
interface CacheEntry<T> {
  value: T
  expiresAt: number | null  // null = 期限なし
  createdAt: number
}

// キャッシュオプション
export interface CacheOptions {
  ttlMs?: number           // Time to live in milliseconds
  persistent?: boolean     // Use localStorage instead of memory
}

// デフォルトTTL（5分）
const DEFAULT_TTL = 5 * 60 * 1000

// メモリキャッシュ
const memoryCache = new Map<string, CacheEntry<unknown>>()

// localStorage キー接頭辞
const STORAGE_PREFIX = 'pokeseal_cache_'

/**
 * キャッシュにデータを保存
 */
export function setCache<T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): void {
  const { ttlMs = DEFAULT_TTL, persistent = false } = options

  const entry: CacheEntry<T> = {
    value,
    expiresAt: ttlMs ? Date.now() + ttlMs : null,
    createdAt: Date.now(),
  }

  if (persistent && typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry))
    } catch (e) {
      console.warn('[Cache] Failed to save to localStorage:', e)
      // フォールバックとしてメモリキャッシュを使用
      memoryCache.set(key, entry)
    }
  } else {
    memoryCache.set(key, entry)
  }
}

/**
 * キャッシュからデータを取得
 */
export function getCache<T>(key: string, persistent = false): T | null {
  let entry: CacheEntry<T> | null = null

  if (persistent && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key)
      if (stored) {
        entry = JSON.parse(stored) as CacheEntry<T>
      }
    } catch {
      // パースエラーの場合は無視
    }
  } else {
    entry = memoryCache.get(key) as CacheEntry<T> | null
  }

  if (!entry) {
    return null
  }

  // 期限切れチェック
  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    deleteCache(key, persistent)
    return null
  }

  return entry.value
}

/**
 * キャッシュからデータを削除
 */
export function deleteCache(key: string, persistent = false): void {
  if (persistent && typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_PREFIX + key)
  }
  memoryCache.delete(key)
}

/**
 * キャッシュをクリア
 */
export function clearCache(persistent = false): void {
  memoryCache.clear()

  if (persistent && typeof window !== 'undefined') {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }
}

/**
 * 期限切れエントリをクリーンアップ
 */
export function cleanupExpiredCache(): void {
  const now = Date.now()

  // メモリキャッシュ
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt && now > entry.expiresAt) {
      memoryCache.delete(key)
    }
  }

  // localStorage
  if (typeof window !== 'undefined') {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(STORAGE_PREFIX)) {
        try {
          const entry = JSON.parse(localStorage.getItem(key) || '')
          if (entry.expiresAt && now > entry.expiresAt) {
            keysToRemove.push(key)
          }
        } catch {
          // 無効なエントリは削除
          keysToRemove.push(key)
        }
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }
}

/**
 * キャッシュ付きフェッチ関数
 * キャッシュがあればそれを返し、なければfetcherを実行してキャッシュ
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { persistent = false } = options

  // キャッシュを確認
  const cached = getCache<T>(key, persistent)
  if (cached !== null) {
    return cached
  }

  // フェッチして保存
  const result = await fetcher()
  setCache(key, result, options)
  return result
}

/**
 * SWR (Stale-While-Revalidate) パターンのキャッシュ
 * 古いデータを即座に返しつつ、バックグラウンドで更新
 */
export function swrCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions & { onUpdate?: (value: T) => void } = {}
): { value: T | null; isStale: boolean; refetch: () => Promise<T> } {
  const { persistent = false, onUpdate } = options

  const cached = getCache<T>(key, persistent)

  const refetch = async (): Promise<T> => {
    const result = await fetcher()
    setCache(key, result, options)
    onUpdate?.(result)
    return result
  }

  // キャッシュがあればバックグラウンドで更新
  if (cached !== null) {
    // 非同期で更新（結果は待たない）
    refetch().catch(console.error)
    return { value: cached, isStale: true, refetch }
  }

  return { value: null, isStale: false, refetch }
}

// 定期的なクリーンアップ（ブラウザのみ）
if (typeof window !== 'undefined') {
  // 5分ごとにクリーンアップ
  setInterval(cleanupExpiredCache, 5 * 60 * 1000)
}

// 事前定義されたキャッシュキー
export const CACHE_KEYS = {
  // ユーザー関連
  userProfile: (userId: string) => `user_profile_${userId}`,
  userStickers: (userId: string) => `user_stickers_${userId}`,
  userCurrency: (userId: string) => `user_currency_${userId}`,

  // マスターデータ
  allStickers: 'all_stickers',
  allSeries: 'all_series',

  // タイムライン
  timelinePosts: (page: number) => `timeline_posts_${page}`,

  // 交換
  activeTrades: (userId: string) => `active_trades_${userId}`,
} as const

export default {
  setCache,
  getCache,
  deleteCache,
  clearCache,
  cachedFetch,
  swrCache,
  CACHE_KEYS,
}
