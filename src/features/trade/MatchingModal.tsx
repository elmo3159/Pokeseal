'use client'

import React, { useState, useEffect } from 'react'

// マッチング状態
export type MatchingStatus = 'idle' | 'searching' | 'found' | 'timeout' | 'cancelled'

// マッチした相手の情報
export interface MatchedUser {
  id: string
  name: string
  avatarUrl?: string
  level?: number
}

interface MatchingModalProps {
  isOpen: boolean
  status: MatchingStatus
  matchedUser?: MatchedUser
  onCancel: () => void
  onStartTrade: () => void
  onRetry: () => void
}

// 検索中アニメーション
const SearchingAnimation: React.FC = () => {
  return (
    <div className="relative w-40 h-40 mx-auto">
      {/* 外側のリング */}
      <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping" />
      <div className="absolute inset-2 rounded-full border-4 border-pink-200 animate-ping animation-delay-200" />
      <div className="absolute inset-4 rounded-full border-4 border-purple-200 animate-ping animation-delay-400" />

      {/* 中央のアイコン */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-xl">
          <span className="text-4xl animate-bounce">🔍</span>
        </div>
      </div>

      {/* 周囲を回る点 */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-500 rounded-full" />
      </div>
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-pink-500 rounded-full" />
      </div>
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '2s' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full" />
      </div>
    </div>
  )
}

// マッチ成功アニメーション
const MatchFoundAnimation: React.FC<{ user: MatchedUser }> = ({ user }) => {
  return (
    <div className="relative">
      {/* キラキラ背景 */}
      <div className="absolute -inset-8 flex items-center justify-center">
        <div className="text-4xl absolute top-0 left-4 animate-ping">✨</div>
        <div className="text-3xl absolute top-4 right-2 animate-ping animation-delay-200">⭐</div>
        <div className="text-2xl absolute bottom-4 left-2 animate-ping animation-delay-400">✨</div>
        <div className="text-3xl absolute bottom-0 right-4 animate-ping animation-delay-600">⭐</div>
      </div>

      {/* ユーザーカード */}
      <div className="
        relative bg-white rounded-3xl p-6 shadow-2xl
        animate-[scaleIn_0.5s_ease-out]
      ">
        {/* アバター */}
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-5xl shadow-lg mb-4">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            '👤'
          )}
        </div>

        {/* 名前 */}
        <h3 className="text-xl font-bold text-purple-700 text-center mb-1">
          {user.name}
        </h3>

        {/* レベル */}
        {user.level && (
          <p className="text-sm text-purple-400 text-center">
            Lv.{user.level}
          </p>
        )}
      </div>
    </div>
  )
}

// タイムアウト表示
const TimeoutDisplay: React.FC = () => {
  return (
    <div className="text-center">
      <div className="text-6xl mb-4">😢</div>
      <h3 className="text-xl font-bold text-purple-700 mb-2">
        みつかりませんでした
      </h3>
      <p className="text-sm text-purple-400">
        もういちどためしてみてね
      </p>
    </div>
  )
}

// メインのMatchingModal
export const MatchingModal: React.FC<MatchingModalProps> = ({
  isOpen,
  status,
  matchedUser,
  onCancel,
  onStartTrade,
  onRetry
}) => {
  const [searchTime, setSearchTime] = useState(0)
  const [dots, setDots] = useState('')

  // 検索時間カウンター
  useEffect(() => {
    if (!isOpen || status !== 'searching') {
      setSearchTime(0)
      return
    }

    const timer = setInterval(() => {
      setSearchTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, status])

  // ドットアニメーション
  useEffect(() => {
    if (status !== 'searching') return

    const timer = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(timer)
  }, [status])

  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景 */}
      <div className="
        absolute inset-0
        bg-gradient-to-b from-purple-900/90 via-pink-900/90 to-purple-900/90
      " />

      {/* コンテンツ */}
      <div className="relative w-full max-w-sm px-6 py-8">
        {/* 検索中 */}
        {status === 'searching' && (
          <div className="flex flex-col items-center">
            <SearchingAnimation />

            <h2 className="text-2xl font-bold text-white mt-8 mb-2">
              さがしています{dots}
            </h2>

            <p className="text-purple-200 mb-4">
              {formatTime(searchTime)}
            </p>

            <p className="text-sm text-purple-300 text-center mb-8">
              せかいちゅうのともだちを<br />さがしています...
            </p>

            <button
              onClick={onCancel}
              className="
                px-8 py-3 rounded-full
                bg-white/20 text-white font-bold
                hover:bg-white/30 transition-colors
              "
            >
              キャンセル
            </button>
          </div>
        )}

        {/* マッチ成功 */}
        {status === 'found' && matchedUser && (
          <div className="flex flex-col items-center">
            <div className="text-3xl text-white font-bold mb-6">
              🎉 マッチ！ 🎉
            </div>

            <MatchFoundAnimation user={matchedUser} />

            <p className="text-purple-200 mt-6 mb-4 text-center">
              こうかんあいてがみつかりました！
            </p>

            <button
              onClick={onStartTrade}
              className="
                w-full py-4 rounded-2xl
                bg-gradient-to-r from-purple-500 to-pink-500
                text-white font-bold text-lg
                shadow-lg hover:shadow-xl
                transition-all active:scale-95
              "
            >
              こうかんをはじめる！
            </button>
          </div>
        )}

        {/* タイムアウト */}
        {status === 'timeout' && (
          <div className="flex flex-col items-center">
            <TimeoutDisplay />

            <div className="flex gap-4 mt-8">
              <button
                onClick={onCancel}
                className="
                  flex-1 py-3 px-4 rounded-xl
                  bg-white/20 text-white font-bold
                  hover:bg-white/30 transition-colors
                "
              >
                もどる
              </button>
              <button
                onClick={onRetry}
                className="
                  flex-1 py-3 px-4 rounded-xl
                  bg-gradient-to-r from-purple-500 to-pink-500
                  text-white font-bold
                  shadow-lg hover:shadow-xl transition-all
                "
              >
                もういちど
              </button>
            </div>
          </div>
        )}

        {/* キャンセル済み */}
        {status === 'cancelled' && (
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-4">👋</div>
            <h3 className="text-xl font-bold text-white mb-2">
              キャンセルしました
            </h3>
            <p className="text-purple-200 text-sm">
              またいつでもあそびにきてね
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchingModal
