'use client'

import { useEffect } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Next.js App Router のエラーページ
 * ルート全体でのエラーをキャッチして表示
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // エラーをログに記録
    console.error('[ErrorPage] Unhandled error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">😭</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          ごめんね！
        </h1>
        <h2 className="text-lg text-gray-600 mb-4">
          エラーが発生しました
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          アプリの読み込み中に問題が発生しました。
          <br />
          もう一度お試しください。
        </p>

        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-base hover:bg-purple-700 transition-colors"
          >
            もう一度試す
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-base hover:bg-gray-200 transition-colors"
          >
            ホームに戻る
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-gray-400 cursor-pointer">
              エラー詳細（開発用）
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs text-gray-700 overflow-auto max-h-40">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>

      <p className="mt-6 text-xs text-gray-400">
        問題が続く場合は、アプリを再起動してください
      </p>
    </div>
  )
}
