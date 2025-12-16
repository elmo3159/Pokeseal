'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/services/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('認証中...')

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getSupabase()

      // URLからcodeを取得してセッションを確立
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      )

      if (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('認証に失敗しました')
        // 3秒後にホームへ
        setTimeout(() => router.push('/'), 3000)
        return
      }

      setStatus('success')
      setMessage('連携完了！')

      // 1秒後にホームへ
      setTimeout(() => router.push('/'), 1000)
    }

    handleCallback()
  }, [router])

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #FDF2F8 0%, #F5F3FF 100%)',
      }}
    >
      <div
        className="p-8 rounded-3xl text-center"
        style={{
          background: 'white',
          boxShadow: '0 4px 20px rgba(168, 85, 247, 0.15)',
        }}
      >
        {status === 'loading' && (
          <>
            <div className="text-6xl mb-4 animate-bounce">🔄</div>
            <p
              className="text-lg font-bold text-purple-700"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              {message}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <p
              className="text-lg font-bold text-green-600"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              {message}
            </p>
            <p
              className="text-sm text-purple-500 mt-2"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              データが守られました！
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <p
              className="text-lg font-bold text-red-500"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              {message}
            </p>
            <p
              className="text-sm text-purple-500 mt-2"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              ホームに戻ります...
            </p>
          </>
        )}
      </div>
    </div>
  )
}
