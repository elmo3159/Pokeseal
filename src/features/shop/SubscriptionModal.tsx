'use client'

import React, { useState } from 'react'
import {
  SubscriptionTier,
  SUBSCRIPTION_PLANS,
} from '@/domain/monetization'

interface SubscriptionModalProps {
  isOpen: boolean
  selectedTier: SubscriptionTier
  currentTier: SubscriptionTier
  onConfirm: () => void
  onClose: () => void
}

export function SubscriptionModal({
  isOpen,
  selectedTier,
  currentTier,
  onConfirm,
  onClose,
}: SubscriptionModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const plan = SUBSCRIPTION_PLANS[selectedTier]

  if (!isOpen || selectedTier === 'none') return null

  const isUpgrade = currentTier !== 'none' && selectedTier !== currentTier
  const tierColors = {
    light: { primary: '#22C55E', bg: '#F0FDF4' },
    plus: { primary: '#F97316', bg: '#FFF7ED' },
    deluxe: { primary: '#A855F7', bg: '#FDF4FF' },
  }
  const colors = tierColors[selectedTier as keyof typeof tierColors]

  const handleConfirm = () => {
    if (!isConfirming) {
      setIsConfirming(true)
      return
    }
    onConfirm()
    setIsConfirming(false)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] rounded-t-2xl overflow-hidden"
        style={{
          background: colors.bg,
          maxHeight: '85vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          className="px-4 py-4 text-center relative"
          style={{ background: colors.primary }}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"
          >
            x
          </button>
          <div className="text-3xl mb-2">
            {selectedTier === 'deluxe' ? '★★★' :
             selectedTier === 'plus' ? '★★' : '★'}
          </div>
          <h2
            className="text-white font-bold text-xl"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            {plan.name}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            ¥{plan.price} / つき
          </p>
        </div>

        {/* 特典リスト */}
        <div
          className="px-4 py-4 overflow-y-auto"
          style={{ maxHeight: '50vh', fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
        >
          <h3 className="font-bold text-gray-700 mb-3">とくてん</h3>

          <div className="space-y-3">
            {/* デイリーガチャ */}
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: colors.primary }}
              >
                ♪
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">
                  まいにち +{plan.dailyBonusTickets}かい ガチャ
                </p>
                <p className="text-xs text-gray-500">
                  ログインするだけでシルチケがふえるよ
                </p>
              </div>
            </div>

            {/* デイリーどろっぷ */}
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: colors.primary }}
              >
                ★
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">
                  まいにち {plan.dailyStars}どろっぷ
                </p>
                <p className="text-xs text-gray-500">
                  つきに{plan.dailyStars * 30}どろっぷ ぶん！
                </p>
              </div>
            </div>

            {/* 広告スキップ */}
            {plan.skipAds && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm ring-2 ring-yellow-400">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ background: '#F59E0B' }}
                >
                  ▷
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">
                    こうこくなし！
                  </p>
                  <p className="text-xs text-gray-500">
                    こうこくをみなくても +10かい もらえる
                  </p>
                </div>
              </div>
            )}

            {/* プレミアムガチャ */}
            {plan.weeklyPremiumGacha > 0 && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ background: '#EC4899' }}
                >
                  ★★
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">
                    まいしゅう {plan.weeklyPremiumGacha}かい プレミアムガチャ
                  </p>
                  <p className="text-xs text-gray-500">
                    レアがでやすい とくべつガチャ！
                  </p>
                </div>
              </div>
            )}

            {/* 月間限定シール */}
            {plan.monthlyLimitedSticker && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm ring-2 ring-purple-400">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ background: '#A855F7' }}
                >
                  ★★★
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">
                    まいつき げんていシール
                  </p>
                  <p className="text-xs text-gray-500">
                    ★4いじょうの とくべつシールがとどく！
                  </p>
                </div>
              </div>
            )}

            {/* 全デコ解放 */}
            {plan.unlockAllDeco && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ background: '#8B5CF6' }}
                >
                  ◇
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">
                    ぜんぶのデコがつかえる
                  </p>
                  <p className="text-xs text-gray-500">
                    レースやマステ、ぜんしゅるい！
                  </p>
                </div>
              </div>
            )}

            {/* バッジ */}
            <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: plan.badgeType === 'rainbow'
                    ? 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #3B82F6 100%)'
                    : colors.primary,
                  color: 'white',
                }}
              >
                {plan.badgeType === 'rainbow' ? '★' :
                 plan.badgeType === 'double-star' ? '★' : '★'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">
                  とくべつバッジ
                </p>
                <p className="text-xs text-gray-500">
                  プロフィールに
                  {plan.badgeType === 'rainbow' ? 'にじいろ' :
                   plan.badgeType === 'double-star' ? 'ダブル' : ''}
                  とくべつマークがつく！
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div
          className="px-4 py-4 border-t"
          style={{
            borderColor: colors.primary + '30',
            background: 'white',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          {/* 確認メッセージ */}
          {isConfirming && (
            <div className="mb-3 p-3 rounded-xl bg-yellow-50 border border-yellow-300 text-center">
              <p className="text-sm text-yellow-800 font-bold">
                ほんとうに このパスにはいる？
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                おうちの人にかくにんしてね
              </p>
            </div>
          )}

          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-xl font-bold text-white text-lg active:scale-95 transition-all"
            style={{
              background: isConfirming
                ? 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)'
                : `linear-gradient(90deg, ${colors.primary} 0%, ${colors.primary}CC 100%)`,
              boxShadow: `0 4px 12px ${colors.primary}40`,
            }}
          >
            {isConfirming ? 'はい、はいります！' : `¥${plan.price}/つき ではいる`}
          </button>

          {isUpgrade && (
            <p className="text-center text-xs text-gray-400 mt-2">
              いまのパスからアップグレードされます
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionModal
