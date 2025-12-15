'use client'

import React, { useState, useEffect } from 'react'
import { MAX_AD_WATCHES_PER_DAY, TICKETS_PER_AD } from '@/domain/monetization'

interface AdRewardModalProps {
  isOpen: boolean
  adsWatchedToday: number
  onWatchAd: () => void
  onClose: () => void
}

export function AdRewardModal({
  isOpen,
  adsWatchedToday,
  onWatchAd,
  onClose,
}: AdRewardModalProps) {
  const [isWatching, setIsWatching] = useState(false)
  const [watchProgress, setWatchProgress] = useState(0)
  const [showReward, setShowReward] = useState(false)

  const remainingAds = MAX_AD_WATCHES_PER_DAY - adsWatchedToday
  const canWatch = remainingAds > 0

  // 広告視聴のシミュレーション
  useEffect(() => {
    if (!isWatching) return

    const interval = setInterval(() => {
      setWatchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsWatching(false)
          setShowReward(true)
          return 100
        }
        return prev + 5
      })
    }, 150) // 3秒で完了

    return () => clearInterval(interval)
  }, [isWatching])

  // リワード表示後の処理
  useEffect(() => {
    if (!showReward) return

    const timer = setTimeout(() => {
      onWatchAd()
      setShowReward(false)
      setWatchProgress(0)
    }, 1500)

    return () => clearTimeout(timer)
  }, [showReward, onWatchAd])

  const handleWatchAd = () => {
    if (!canWatch || isWatching) return
    setIsWatching(true)
    setWatchProgress(0)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.6)' }}
      onClick={!isWatching ? onClose : undefined}
    >
      <div
        className="w-[90%] max-w-[320px] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          className="px-4 py-4 text-center relative"
          style={{
            background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
          }}
        >
          {!isWatching && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"
            >
              x
            </button>
          )}
          <h2
            className="text-white font-bold text-lg"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            こうこくを みる
          </h2>
        </div>

        {/* コンテンツ */}
        <div
          className="px-6 py-6 text-center"
          style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
        >
          {showReward ? (
            // リワード獲得表示
            <div className="py-8">
              <div className="text-6xl mb-4 animate-bounce">♪</div>
              <p className="text-2xl font-bold text-green-600 mb-2">
                シルチケ ゲット！
              </p>
              <p className="text-gray-500">
                +{TICKETS_PER_AD}まい
              </p>
            </div>
          ) : isWatching ? (
            // 広告視聴中
            <div className="py-8">
              <div className="text-4xl mb-4">▷</div>
              <p className="text-gray-600 mb-4">こうこくを みています...</p>

              {/* プログレスバー */}
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-150"
                  style={{
                    width: `${watchProgress}%`,
                    background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">
                おわるまで まってね
              </p>
            </div>
          ) : (
            // 通常表示
            <>
              <div className="text-5xl mb-4">▷</div>

              <p className="text-gray-600 mb-4">
                こうこくを みると
                <br />
                シルチケが もらえるよ！
              </p>

              {/* 報酬表示 */}
              <div
                className="py-3 px-4 rounded-xl mb-4 inline-block"
                style={{
                  background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                }}
              >
                <span className="text-green-700 font-bold">
                  +{TICKETS_PER_AD} シルチケ
                </span>
              </div>

              {/* 残り回数 */}
              <div className="mb-6">
                <p className="text-sm text-gray-500">きょうの のこり</p>
                <div className="flex justify-center gap-1 mt-2">
                  {Array.from({ length: MAX_AD_WATCHES_PER_DAY }).map((_, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full"
                      style={{
                        background: i < remainingAds
                          ? 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
                          : '#E5E7EB',
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {remainingAds}かい のこっているよ
                </p>
              </div>
            </>
          )}
        </div>

        {/* フッター */}
        {!isWatching && !showReward && (
          <div className="px-6 pb-6">
            {canWatch ? (
              <button
                onClick={handleWatchAd}
                className="w-full py-3 rounded-xl font-bold text-white active:scale-95 transition-all"
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
              >
                こうこくを みる
              </button>
            ) : (
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">
                  きょうは もう みれないよ
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl font-bold text-gray-600 bg-gray-100 active:scale-95 transition-all"
                  style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                >
                  とじる
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdRewardModal
