'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Next.js App Router のグローバルエラーページ
 * ルートレイアウトでのエラーもキャッチ
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[GlobalError] Critical error:', error)
  }, [error])

  return (
    <html lang="ja">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom, #FFF5F8, #F3E8FF)',
            padding: '24px',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>💔</div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1F2937',
                marginBottom: '8px',
              }}
            >
              アプリがクラッシュしました
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '24px',
              }}
            >
              予期せぬエラーが発生しました。
              <br />
              ページを再読み込みしてください。
            </p>

            <button
              onClick={reset}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#9333EA',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              再読み込み
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#F3F4F6',
                color: '#374151',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              ページをリフレッシュ
            </button>
          </div>

          <p
            style={{
              marginTop: '24px',
              fontSize: '12px',
              color: '#9CA3AF',
            }}
          >
            Error ID: {error.digest || 'unknown'}
          </p>
        </div>
      </body>
    </html>
  )
}
