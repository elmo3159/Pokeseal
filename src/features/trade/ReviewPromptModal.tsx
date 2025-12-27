/**
 * レビュー誘導ポップアップモーダル
 * - 交換成立後に表示
 * - App Store / Google Play へのレビュー誘導
 * - レビュー報酬（シルチケ5枚）
 */

'use client'

import { useState } from 'react'
import {
  Platform,
  detectPlatform,
  openStoreReview,
  REVIEW_REWARD,
} from '@/services/reviewReward/reviewRewardService'

interface ReviewPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onClaimReward: (platform: Platform) => Promise<boolean>
  iosClaimed: boolean
  androidClaimed: boolean
}

export default function ReviewPromptModal({
  isOpen,
  onClose,
  onClaimReward,
  iosClaimed,
  androidClaimed,
}: ReviewPromptModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [rewardedPlatform, setRewardedPlatform] = useState<Platform | null>(null)

  const currentPlatform = detectPlatform()

  if (!isOpen) return null

  // すべて受け取り済みの場合は表示しない
  if (iosClaimed && androidClaimed) {
    return null
  }

  const handleReviewClick = async (platform: Platform) => {
    if (isProcessing) return

    // 既に受け取り済みかチェック
    if (platform === 'ios' && iosClaimed) return
    if (platform === 'android' && androidClaimed) return

    setIsProcessing(true)

    try {
      // ストアを開く
      await openStoreReview(platform)

      // 報酬を付与
      const success = await onClaimReward(platform)

      if (success) {
        setRewardedPlatform(platform)
        setShowSuccess(true)

        // 2秒後に閉じる
        setTimeout(() => {
          setShowSuccess(false)
          onClose()
        }, 2000)
      }
    } catch (error) {
      console.error('[ReviewPromptModal] Error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 背景オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="relative bg-gradient-to-b from-pink-100 to-white rounded-3xl p-6 mx-4 max-w-sm w-full shadow-2xl animate-bounce-in">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        {showSuccess ? (
          // 成功表示
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🥹✨</div>
            <h2 className="text-xl font-bold text-pink-600 mb-2">
              応援ありがとう！
            </h2>
            <p className="text-gray-600 mb-3">
              とってもうれしいよ💓
            </p>
            <div className="flex items-center justify-center gap-2 text-lg">
              <span className="text-2xl">🎫</span>
              <span className="font-bold text-purple-600">
                シルチケ × {REVIEW_REWARD.tickets}
              </span>
              <span>ゲット！</span>
            </div>
          </div>
        ) : (
          // 通常表示
          <>
            {/* ヘッダー */}
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                ポケシルを楽しんでくれて
                <br />
                ありがとう！
              </h2>
              <p className="text-base text-gray-700 leading-relaxed">
                レビューで応援してくれたら
                <br />
                すっごくうれしいな<span className="text-lg">🥺💓</span>
              </p>
            </div>

            {/* 報酬案内 */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-4 text-center border border-pink-200">
              <p className="text-sm text-gray-600 mb-1">お礼に…</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">🎫</span>
                <span className="text-2xl font-bold text-purple-600">
                  シルチケ × {REVIEW_REWARD.tickets}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">プレゼントするね！</p>
            </div>

            {/* ストアボタン */}
            <div className="space-y-3 mb-4">
              {/* iOS (App Store) */}
              {(currentPlatform === 'ios' || currentPlatform === 'web') && (
                <button
                  onClick={() => handleReviewClick('ios')}
                  disabled={isProcessing || iosClaimed}
                  className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
                    iosClaimed
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800 active:scale-95'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span className="font-bold">
                    {iosClaimed ? '応援ありがとう！' : 'App Store で応援する'}
                  </span>
                </button>
              )}

              {/* Android (Google Play) */}
              {(currentPlatform === 'android' || currentPlatform === 'web') && (
                <button
                  onClick={() => handleReviewClick('android')}
                  disabled={isProcessing || androidClaimed}
                  className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
                    androidClaimed
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31M6.05 2.66l10.76 6.22-2.27 2.27L6.05 2.66z" />
                  </svg>
                  <span className="font-bold">
                    {androidClaimed ? '応援ありがとう！' : 'Google Play で応援する'}
                  </span>
                </button>
              )}
            </div>

            {/* スキップ */}
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-500 text-sm hover:text-gray-700"
            >
              あとで
            </button>
          </>
        )}
      </div>

      {/* アニメーション用スタイル */}
      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
