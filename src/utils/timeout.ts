/**
 * タイムアウトユーティリティ
 * 非同期操作にタイムアウトを設定するためのヘルパー関数
 */

// タイムアウトエラー
export class TimeoutError extends Error {
  constructor(message: string = 'Operation timed out') {
    super(message)
    this.name = 'TimeoutError'
  }
}

// デフォルトタイムアウト値（ミリ秒）
export const DEFAULT_TIMEOUTS = {
  auth: 15000,        // 認証: 15秒
  api: 30000,         // API呼び出し: 30秒
  upload: 60000,      // アップロード: 60秒
  download: 60000,    // ダウンロード: 60秒
  database: 10000,    // DB操作: 10秒
  realtime: 5000,     // リアルタイム接続: 5秒
} as const

/**
 * Promiseにタイムアウトを設定する
 *
 * @param promise - タイムアウトを設定するPromise
 * @param timeoutMs - タイムアウト時間（ミリ秒）
 * @param errorMessage - タイムアウト時のエラーメッセージ
 * @returns タイムアウト付きのPromise
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage?: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new TimeoutError(errorMessage || `Operation timed out after ${timeoutMs}ms`))
    }, timeoutMs)

    promise
      .then((result) => {
        clearTimeout(timeoutId)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        reject(error)
      })
  })
}

/**
 * AbortControllerを使用したタイムアウト付きfetch
 *
 * @param url - フェッチするURL
 * @param options - fetchオプション
 * @param timeoutMs - タイムアウト時間（ミリ秒）
 * @returns Response
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUTS.api
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * リトライ付きの非同期操作
 *
 * @param operation - 実行する非同期操作
 * @param options - リトライオプション
 * @returns 操作結果
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number
    delayMs?: number
    backoffMultiplier?: number
    shouldRetry?: (error: unknown) => boolean
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    shouldRetry = () => true,
  } = options

  let lastError: unknown
  let currentDelay = delayMs

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      // 最後の試行、またはリトライすべきでないエラーの場合
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error
      }

      // 次の試行まで待機
      await new Promise((resolve) => setTimeout(resolve, currentDelay))
      currentDelay *= backoffMultiplier
    }
  }

  throw lastError
}

/**
 * キャンセル可能な非同期操作
 */
export interface CancellableOperation<T> {
  promise: Promise<T>
  cancel: () => void
}

/**
 * キャンセル可能なPromiseを作成
 *
 * @param executor - 実行関数
 * @returns キャンセル可能な操作
 */
export function makeCancellable<T>(
  executor: (signal: AbortSignal) => Promise<T>
): CancellableOperation<T> {
  const controller = new AbortController()

  const promise = new Promise<T>((resolve, reject) => {
    executor(controller.signal)
      .then(resolve)
      .catch((error) => {
        if (controller.signal.aborted) {
          reject(new Error('Operation cancelled'))
        } else {
          reject(error)
        }
      })
  })

  return {
    promise,
    cancel: () => controller.abort(),
  }
}

/**
 * 遅延実行
 *
 * @param ms - 待機時間（ミリ秒）
 * @returns 待機後に解決するPromise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * デバウンス付きの非同期操作
 */
export function debounceAsync<T extends (...args: Parameters<T>) => Promise<ReturnType<T>>>(
  fn: T,
  waitMs: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let pendingPromise: Promise<ReturnType<T>> | null = null

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          pendingPromise = fn(...args)
          const result = await pendingPromise
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          pendingPromise = null
        }
      }, waitMs)
    })
  }
}
