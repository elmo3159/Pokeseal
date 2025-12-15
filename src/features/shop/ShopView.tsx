'use client'

import React, { useState } from 'react'
import {
  UserMonetization,
  STAR_PACKS,
  SUBSCRIPTION_PLANS,
  DAILY_MISSIONS,
  SubscriptionTier,
  getRemainingAdWatches,
  getMaxDailyGachaPulls,
} from '@/domain/monetization'

interface ShopViewProps {
  userMonetization: UserMonetization
  onPurchaseStars: (packId: string) => void
  onSubscribe: (tier: SubscriptionTier) => void
  onWatchAd: () => void
  onOpenSubscriptionModal: () => void
}

export function ShopView({
  userMonetization,
  onPurchaseStars,
  onSubscribe,
  onWatchAd,
  onOpenSubscriptionModal,
}: ShopViewProps) {
  const [selectedTab, setSelectedTab] = useState<'stars' | 'pass'>('stars')
  const remainingAds = getRemainingAdWatches(userMonetization)
  const currentPlan = SUBSCRIPTION_PLANS[userMonetization.subscription]
  const maxDailyPulls = getMaxDailyGachaPulls(userMonetization.subscription)

  return (
    <div
      className="h-full flex flex-col"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* ヘッダー：所持通貨 */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        }}
      >
        <h1 className="text-white font-bold text-lg">ショップ</h1>
        <div className="flex items-center gap-2">
          {/* シルチケ */}
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
            <span className="text-pink-200 text-xs">🎫</span>
            <span className="text-white font-bold text-xs">
              {userMonetization.tickets}
            </span>
          </div>
          {/* プレシル */}
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
            <span className="text-blue-200 text-xs">💎</span>
            <span className="text-white font-bold text-xs">
              {userMonetization.gems}
            </span>
          </div>
          {/* どろっぷ */}
          <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
            <span className="text-yellow-300 text-xs">💧</span>
            <span className="text-white font-bold text-xs">
              {userMonetization.stars.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* サブスク状態表示 */}
      {userMonetization.subscription !== 'none' && (
        <div
          className="mx-4 mt-3 p-3 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            border: '2px solid #F59E0B',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {currentPlan.badgeType === 'rainbow' ? '★★★' :
                 currentPlan.badgeType === 'double-star' ? '★★' : '★'}
              </span>
              <span className="font-bold text-amber-800">{currentPlan.name}</span>
            </div>
            <span className="text-xs text-amber-600">かにゅうちゅう</span>
          </div>
        </div>
      )}

      {/* タブ切り替え */}
      <div className="flex px-4 mt-3 gap-2">
        <button
          onClick={() => setSelectedTab('stars')}
          className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${
            selectedTab === 'stars'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-purple-100 text-purple-600'
          }`}
        >
          どろっぷをかう
        </button>
        <button
          onClick={() => setSelectedTab('pass')}
          className={`flex-1 py-2 rounded-full font-bold text-sm transition-all ${
            selectedTab === 'pass'
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-pink-100 text-pink-600'
          }`}
        >
          パスにはいる
        </button>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {selectedTab === 'stars' ? (
          <div className="space-y-3">
            {/* 初回購入ボーナス表示 */}
            {userMonetization.isFirstPurchase && (
              <div
                className="p-3 rounded-xl text-center"
                style={{
                  background: 'linear-gradient(135deg, #FECACA 0%, #FCA5A5 100%)',
                  border: '2px dashed #EF4444',
                }}
              >
                <p className="font-bold text-red-600 text-sm">
                  はじめてのおかいもの 2ばい！
                </p>
                <p className="text-xs text-red-500 mt-1">
                  さいしょの1かいだけ、どろっぷが2ばいもらえるよ
                </p>
              </div>
            )}

            {/* どろっぷパック一覧 */}
            <div className="grid grid-cols-2 gap-3">
              {STAR_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => onPurchaseStars(pack.id)}
                  className={`relative p-3 rounded-xl text-center transition-all active:scale-95 ${
                    pack.isPopular
                      ? 'ring-2 ring-yellow-400 shadow-lg'
                      : 'shadow-md'
                  }`}
                  style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%)',
                  }}
                >
                  {/* 人気バッジ */}
                  {pack.isPopular && (
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{
                        background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
                      }}
                    >
                      にんき！
                    </div>
                  )}

                  {/* どろっぷアイコン */}
                  <div className="text-2xl mb-1">
                    {pack.stars >= 4800 ? '★★★' :
                     pack.stars >= 1800 ? '★★' : '★'}
                  </div>

                  {/* どろっぷ数 */}
                  <div className="font-bold text-purple-700 text-lg">
                    {pack.stars.toLocaleString()}
                    <span className="text-xs ml-1">どろっぷ</span>
                  </div>

                  {/* ボーナス */}
                  {pack.bonusPercent > 0 && (
                    <div className="text-xs text-green-600 font-bold">
                      +{pack.bonusPercent}% おとく！
                    </div>
                  )}

                  {/* 価格 */}
                  <div
                    className="mt-2 py-1 rounded-full text-white font-bold text-sm"
                    style={{
                      background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
                    }}
                  >
                    ¥{pack.price.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>

            {/* 注意書き */}
            <p className="text-center text-xs text-gray-400 mt-4">
              おかいものは、おうちの人にかくにんしてね
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* パスプラン一覧 */}
            {(['light', 'plus', 'deluxe'] as const).map((tier) => {
              const plan = SUBSCRIPTION_PLANS[tier]
              const isCurrentPlan = userMonetization.subscription === tier
              const isUpgrade = tier !== 'light' &&
                (userMonetization.subscription === 'none' ||
                 userMonetization.subscription === 'light' ||
                 (userMonetization.subscription === 'plus' && tier === 'deluxe'))

              return (
                <button
                  key={tier}
                  onClick={() => !isCurrentPlan && onSubscribe(tier)}
                  disabled={isCurrentPlan}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    isCurrentPlan
                      ? 'opacity-70'
                      : 'active:scale-[0.98] shadow-md hover:shadow-lg'
                  }`}
                  style={{
                    background: tier === 'deluxe'
                      ? 'linear-gradient(135deg, #FDF4FF 0%, #FAE8FF 100%)'
                      : tier === 'plus'
                        ? 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'
                        : 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                    border: `2px solid ${
                      tier === 'deluxe' ? '#D946EF' :
                      tier === 'plus' ? '#F97316' : '#22C55E'
                    }`,
                  }}
                >
                  {/* プラン名と価格 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {tier === 'deluxe' ? '★★★' :
                         tier === 'plus' ? '★★' : '★'}
                      </span>
                      <span
                        className="font-bold"
                        style={{
                          color: tier === 'deluxe' ? '#A855F7' :
                                 tier === 'plus' ? '#EA580C' : '#16A34A',
                        }}
                      >
                        {plan.name}
                      </span>
                    </div>
                    <span
                      className="font-bold"
                      style={{
                        color: tier === 'deluxe' ? '#A855F7' :
                               tier === 'plus' ? '#EA580C' : '#16A34A',
                      }}
                    >
                      ¥{plan.price}/つき
                    </span>
                  </div>

                  {/* 説明 */}
                  <p className="text-sm text-gray-600 mb-2">{plan.description}</p>

                  {/* 特典リスト */}
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1 text-gray-700">
                      <span className="text-green-500">◆</span>
                      まいにち +{plan.dailyBonusTickets}かい ガチャ
                    </div>
                    <div className="flex items-center gap-1 text-gray-700">
                      <span className="text-green-500">◆</span>
                      まいにち {plan.dailyStars}どろっぷ
                    </div>
                    {plan.skipAds && (
                      <div className="flex items-center gap-1 text-gray-700">
                        <span className="text-yellow-500">◆</span>
                        こうこくなし！+10かい
                      </div>
                    )}
                    {plan.weeklyPremiumGacha > 0 && (
                      <div className="flex items-center gap-1 text-gray-700">
                        <span className="text-pink-500">◆</span>
                        まいしゅう {plan.weeklyPremiumGacha}かい プレミアムガチャ
                      </div>
                    )}
                    {plan.monthlyLimitedSticker && (
                      <div className="flex items-center gap-1 text-gray-700">
                        <span className="text-purple-500">◆</span>
                        まいつき げんていシール
                      </div>
                    )}
                  </div>

                  {/* ボタン状態 */}
                  <div
                    className="mt-3 py-2 rounded-full text-center font-bold text-sm text-white"
                    style={{
                      background: isCurrentPlan
                        ? '#9CA3AF'
                        : tier === 'deluxe'
                          ? 'linear-gradient(90deg, #A855F7 0%, #EC4899 100%)'
                          : tier === 'plus'
                            ? 'linear-gradient(90deg, #F97316 0%, #FB923C 100%)'
                            : 'linear-gradient(90deg, #22C55E 0%, #4ADE80 100%)',
                    }}
                  >
                    {isCurrentPlan ? 'かにゅうちゅう' : 'このパスにはいる'}
                  </div>
                </button>
              )
            })}

            {/* 注意書き */}
            <p className="text-center text-xs text-gray-400 mt-4">
              おうちの人といっしょにきめてね
            </p>
          </div>
        )}
      </div>

      {/* 広告ボーナスボタン（パスプラス未満の場合のみ） */}
      {!SUBSCRIPTION_PLANS[userMonetization.subscription].skipAds && remainingAds > 0 && (
        <div className="px-4 py-3 border-t border-purple-100">
          <button
            onClick={onWatchAd}
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{
              background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            <span>▷</span>
            <span>こうこくをみて シルチケをもらう</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              のこり{remainingAds}かい
            </span>
          </button>
        </div>
      )}
    </div>
  )
}

export default ShopView
