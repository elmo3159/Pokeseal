'use client'

import React, { useState } from 'react'
import {
  UserMonetization,
  STAR_PACKS,
  SUBSCRIPTION_PLANS,
  SubscriptionTier,
  getRemainingAdWatches,
} from '@/domain/monetization'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'

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
}: ShopViewProps) {
  const [selectedTab, setSelectedTab] = useState<'stars' | 'pass'>('stars')
  const remainingAds = getRemainingAdWatches(userMonetization)
  const currentPlan = SUBSCRIPTION_PLANS[userMonetization.subscription]
  const showAdButton = !SUBSCRIPTION_PLANS[userMonetization.subscription].skipAds && remainingAds > 0

  // どろっぷアイコンの数を取得
  const getDropIconCount = (stars: number): number => {
    if (stars >= 4800) return 3
    if (stars >= 1800) return 2
    return 1
  }

  // パスのアイコン数を取得
  const getPlanIconCount = (tier: string): number => {
    if (tier === 'deluxe') return 3
    if (tier === 'plus') return 2
    return 1
  }

  return (
    <div
      className="flex-1 flex flex-col min-h-0"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* 固定ヘッダー部分 */}
      <div className="flex-shrink-0">
        {/* サブスク状態表示 */}
        {userMonetization.subscription !== 'none' && (
          <div
            className="mx-4 mt-3 p-3 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #FEF9C3 0%, #FDE047 100%)',
              border: '2px solid #EAB308',
              boxShadow: '0 2px 8px rgba(234, 179, 8, 0.3)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(getPlanIconCount(userMonetization.subscription))].map((_, i) => (
                    <CurrencyIcon key={i} type="star" size="sm" className="-ml-1 first:ml-0" />
                  ))}
                </div>
                <span className="font-bold text-amber-800">{currentPlan.name}</span>
              </div>
              <div
                className="px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: 'linear-gradient(90deg, #F59E0B, #D97706)' }}
              >
                かにゅうちゅう
              </div>
            </div>
          </div>
        )}

        {/* タブ切り替え（固定） */}
        <div className="flex px-4 mt-3 gap-2 pb-2">
          <button
            onClick={() => setSelectedTab('stars')}
            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
            style={{
              background: selectedTab === 'stars'
                ? 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)'
                : 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
              color: selectedTab === 'stars' ? 'white' : '#7C3AED',
              boxShadow: selectedTab === 'stars' ? '0 4px 12px rgba(139, 92, 246, 0.4)' : 'none',
              border: selectedTab === 'stars' ? 'none' : '2px solid #DDD6FE',
            }}
          >
            <CurrencyIcon type="star" size="sm" />
            <span>どろっぷをかう</span>
          </button>
          <button
            onClick={() => setSelectedTab('pass')}
            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
            style={{
              background: selectedTab === 'pass'
                ? 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)'
                : 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
              color: selectedTab === 'pass' ? 'white' : '#DB2777',
              boxShadow: selectedTab === 'pass' ? '0 4px 12px rgba(236, 72, 153, 0.4)' : 'none',
              border: selectedTab === 'pass' ? 'none' : '2px solid #FBCFE8',
            }}
          >
            <CurrencyIcon type="gem" size="sm" />
            <span>パスにはいる</span>
          </button>
        </div>
      </div>

      {/* スクロール可能なコンテンツエリア */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4"
      >
        {selectedTab === 'stars' ? (
          <div className="space-y-4 py-2">
            {/* 初回購入ボーナス表示 */}
            {userMonetization.isFirstPurchase && (
              <div
                className="p-4 rounded-2xl text-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                  border: '3px dashed #EF4444',
                }}
              >
                {/* キラキラ装飾 */}
                <div className="absolute top-2 left-4 text-yellow-400 text-lg">✦</div>
                <div className="absolute top-3 right-6 text-yellow-400 text-sm">✦</div>
                <div className="absolute bottom-2 left-8 text-yellow-400 text-sm">✦</div>
                <div className="absolute bottom-3 right-4 text-yellow-400 text-lg">✦</div>

                <p className="font-bold text-red-600 text-base">
                  はじめてのおかいもの 2ばい！
                </p>
                <p className="text-sm text-red-500 mt-1">
                  さいしょの1かいだけ、どろっぷが2ばいもらえるよ
                </p>
              </div>
            )}

            {/* どろっぷパック一覧 */}
            <div className="grid grid-cols-2 gap-3">
              {STAR_PACKS.map((pack) => {
                const iconCount = getDropIconCount(pack.stars)

                return (
                  <button
                    key={pack.id}
                    onClick={() => onPurchaseStars(pack.id)}
                    className="relative p-4 rounded-2xl text-center transition-all active:scale-95"
                    style={{
                      background: pack.isPopular
                        ? 'linear-gradient(180deg, #FEF9C3 0%, #FDE68A 100%)'
                        : 'linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%)',
                      boxShadow: pack.isPopular
                        ? '0 4px 16px rgba(251, 191, 36, 0.4), inset 0 1px 0 rgba(255,255,255,0.8)'
                        : '0 2px 8px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
                      border: pack.isPopular
                        ? '3px solid #F59E0B'
                        : '2px solid #E9D5FF',
                    }}
                  >
                    {/* 人気バッジ */}
                    {pack.isPopular && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                        style={{
                          background: 'linear-gradient(90deg, #EF4444 0%, #F97316 100%)',
                          boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                        }}
                      >
                        にんき！
                      </div>
                    )}

                    {/* どろっぷアイコン */}
                    <div className="flex justify-center items-center gap-0.5 mb-2 mt-1">
                      {[...Array(iconCount)].map((_, i) => (
                        <CurrencyIcon key={i} type="star" size="lg" />
                      ))}
                    </div>

                    {/* どろっぷ数 */}
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <span className="font-bold text-purple-700 text-xl">
                        {pack.stars.toLocaleString()}
                      </span>
                      <span className="text-purple-600 text-xs font-bold">どろっぷ</span>
                    </div>

                    {/* ボーナス */}
                    {pack.bonusPercent > 0 && (
                      <div
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2"
                        style={{
                          background: 'linear-gradient(90deg, #10B981 0%, #34D399 100%)',
                          color: 'white',
                        }}
                      >
                        +{pack.bonusPercent}% おとく！
                      </div>
                    )}

                    {/* 価格ボタン */}
                    <div
                      className="py-2 rounded-xl text-white font-bold text-base"
                      style={{
                        background: pack.isPopular
                          ? 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)'
                          : 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
                        boxShadow: pack.isPopular
                          ? '0 3px 8px rgba(245, 158, 11, 0.4)'
                          : '0 3px 8px rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      ¥{pack.price.toLocaleString()}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* 注意書き */}
            <p className="text-center text-xs text-gray-400 mt-2 pb-4">
              おかいものは、おうちの人にかくにんしてね
            </p>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* パスプラン一覧 */}
            {(['light', 'plus', 'deluxe'] as const).map((tier) => {
              const plan = SUBSCRIPTION_PLANS[tier]
              const isCurrentPlan = userMonetization.subscription === tier
              const iconCount = getPlanIconCount(tier)

              // 色の定義
              const colors = {
                light: {
                  bg: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                  border: '#22C55E',
                  text: '#16A34A',
                  button: 'linear-gradient(90deg, #22C55E 0%, #4ADE80 100%)',
                  light: '#D1FAE5',
                },
                plus: {
                  bg: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
                  border: '#F97316',
                  text: '#EA580C',
                  button: 'linear-gradient(90deg, #F97316 0%, #FB923C 100%)',
                  light: '#FED7AA',
                },
                deluxe: {
                  bg: 'linear-gradient(135deg, #FDF4FF 0%, #FAE8FF 100%)',
                  border: '#D946EF',
                  text: '#A855F7',
                  button: 'linear-gradient(90deg, #A855F7 0%, #D946EF 100%)',
                  light: '#F5D0FE',
                },
              }

              const color = colors[tier]

              return (
                <button
                  key={tier}
                  onClick={() => !isCurrentPlan && onSubscribe(tier)}
                  disabled={isCurrentPlan}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    isCurrentPlan
                      ? 'opacity-70'
                      : 'active:scale-[0.98]'
                  }`}
                  style={{
                    background: color.bg,
                    border: `3px solid ${color.border}`,
                    boxShadow: isCurrentPlan ? 'none' : `0 4px 12px ${color.border}33`,
                  }}
                >
                  {/* プラン名と価格 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(iconCount)].map((_, i) => (
                          <CurrencyIcon key={i} type="star" size="md" className="-ml-1 first:ml-0" />
                        ))}
                      </div>
                      <span className="font-bold text-lg" style={{ color: color.text }}>
                        {plan.name}
                      </span>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full font-bold text-sm"
                      style={{
                        background: `${color.border}20`,
                        color: color.text,
                      }}
                    >
                      ¥{plan.price}/つき
                    </div>
                  </div>

                  {/* 説明 */}
                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>

                  {/* 特典リスト（文字で詳しく説明） */}
                  <div
                    className="p-3 rounded-xl space-y-2.5 mb-3"
                    style={{ background: 'rgba(255,255,255,0.7)' }}
                  >
                    {/* シルチケボーナス */}
                    <div className="flex items-start gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5"
                        style={{ background: color.button }}
                      >
                        ✓
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          まいにちシルチケ +{plan.dailyBonusTickets}まい
                        </p>
                        <p className="text-xs text-gray-500">
                          ログインするだけでシルチケがもらえる
                        </p>
                      </div>
                    </div>

                    {/* どろっぷボーナス */}
                    <div className="flex items-start gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5"
                        style={{ background: color.button }}
                      >
                        ✓
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          まいにちどろっぷ +{plan.dailyStars}
                        </p>
                        <p className="text-xs text-gray-500">
                          どろっぷでシルチケやアイテムを買おう
                        </p>
                      </div>
                    </div>

                    {/* 広告スキップ */}
                    {plan.skipAds && (
                      <div className="flex items-start gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5"
                          style={{ background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }}
                        >
                          ✓
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            こうこくなし＋シルチケ10まい
                          </p>
                          <p className="text-xs text-gray-500">
                            広告を見なくてもシルチケがもらえる
                          </p>
                        </div>
                      </div>
                    )}

                    {/* プレミアムガチャ */}
                    {plan.weeklyPremiumGacha > 0 && (
                      <div className="flex items-start gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5"
                          style={{ background: 'linear-gradient(90deg, #EC4899, #A855F7)' }}
                        >
                          ✓
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            まいしゅうプレシルチケ {plan.weeklyPremiumGacha}まい
                          </p>
                          <p className="text-xs text-gray-500">
                            プレミアムガチャが引けるチケット
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 限定シール */}
                    {plan.monthlyLimitedSticker && (
                      <div className="flex items-start gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs mt-0.5"
                          style={{ background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' }}
                        >
                          ✓
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            まいつきげんていシール
                          </p>
                          <p className="text-xs text-gray-500">
                            パス会員だけの特別なシールがもらえる
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ボタン */}
                  <div
                    className="py-3 rounded-xl text-center font-bold text-white"
                    style={{
                      background: isCurrentPlan ? '#9CA3AF' : color.button,
                      boxShadow: isCurrentPlan ? 'none' : `0 4px 12px ${color.border}40`,
                    }}
                  >
                    {isCurrentPlan ? 'かにゅうちゅう' : 'このパスにはいる'}
                  </div>
                </button>
              )
            })}

            {/* 注意書き */}
            <p className="text-center text-xs text-gray-400 mt-2 pb-4">
              おうちの人といっしょにきめてね
            </p>
          </div>
        )}
      </div>

      {/* 広告ボーナスボタン（固定フッター） */}
      {showAdButton && (
        <div
          className="flex-shrink-0 px-4 py-3"
          style={{
            borderTop: '2px solid #E9D5FF',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F3FF 100%)',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
          }}
        >
          <button
            onClick={onWatchAd}
            className="w-full py-3 rounded-2xl font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-all"
            style={{
              background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
            }}
          >
            <div
              className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
            >
              <span className="text-sm">▷</span>
            </div>
            <span>こうこくをみて</span>
            <CurrencyIcon type="ticket" size="sm" />
            <span>をもらう</span>
            <div
              className="px-2 py-1 rounded-full text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.25)' }}
            >
              のこり{remainingAds}
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export default ShopView
