'use client'

import React, { useState } from 'react'

// ガチャの種類
export type GachaType = 'normal' | 'premium' | 'event' | 'collab'

// ガチャバナー情報
export interface GachaBanner {
  id: string
  type: GachaType
  name: string
  description: string
  endDate?: string
  featuredStickers?: string[]
  costSingle: number
  costMulti: number
  currency: 'ticket' | 'star' | 'gem'
}

// ユーザー所持通貨
export interface UserCurrency {
  tickets: number
  stars: number
  gems: number
}

interface GachaViewProps {
  banners: GachaBanner[]
  userCurrency: UserCurrency
  onPullSingle: (bannerId: string) => void
  onPullMulti: (bannerId: string) => void
  backgroundImage?: string
}

// 通貨アイコン
const CurrencyIcon: React.FC<{ type: 'ticket' | 'star' | 'gem'; size?: 'sm' | 'md' | 'lg' }> = ({ type, size = 'md' }) => {
  const icons = {
    ticket: '🎟️',
    star: '⭐',
    gem: '💎'
  }
  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  return <span className={sizes[size]}>{icons[type]}</span>
}

// 通貨表示バー - iOS風
const CurrencyBar: React.FC<{ currency: UserCurrency }> = ({ currency }) => {
  return (
    <div
      className="flex items-center justify-center gap-4 bg-white/70 backdrop-blur-md rounded-2xl px-4 py-3 shadow-[0_2px_8px_rgba(139,92,246,0.1)] border border-white/50"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      <div className="flex items-center gap-1">
        <CurrencyIcon type="ticket" />
        <span className="font-bold text-purple-700">{currency.tickets}</span>
      </div>
      <div className="flex items-center gap-1">
        <CurrencyIcon type="star" />
        <span className="font-bold text-yellow-600">{currency.stars}</span>
      </div>
      <div className="flex items-center gap-1">
        <CurrencyIcon type="gem" />
        <span className="font-bold text-cyan-600">{currency.gems}</span>
      </div>
    </div>
  )
}

// ガチャマシン表示
const GachaMachine: React.FC<{ banner: GachaBanner; isAnimating: boolean }> = ({ banner, isAnimating }) => {
  const typeColors = {
    normal: 'from-purple-400 to-pink-400',
    premium: 'from-yellow-400 to-orange-400',
    event: 'from-cyan-400 to-blue-400',
    collab: 'from-green-400 to-emerald-400'
  }

  const typeLabels = {
    normal: 'ノーマル',
    premium: 'プレミアム',
    event: 'イベント',
    collab: 'コラボ'
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* タイプラベル */}
      <div className={`
        px-4 py-1 rounded-full text-white text-sm font-bold mb-2
        bg-gradient-to-r ${typeColors[banner.type]}
      `}>
        {typeLabels[banner.type]}
      </div>

      {/* ガチャマシン本体 */}
      <div className={`
        relative w-64 h-72 rounded-3xl overflow-hidden
        bg-gradient-to-b ${typeColors[banner.type]}
        shadow-2xl
        ${isAnimating ? 'animate-bounce' : ''}
      `}>
        {/* マシン上部 */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-white/20 flex items-center justify-center">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {banner.name}
          </h3>
        </div>

        {/* カプセルエリア */}
        <div className="absolute top-20 left-4 right-4 bottom-24 bg-white/30 rounded-2xl flex items-center justify-center overflow-hidden">
          {/* カプセルたち */}
          <div className="relative w-full h-full">
            {/* カプセル1 */}
            <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-pink-400 shadow-lg animate-float" />
            <div className="absolute top-8 right-6 w-10 h-10 rounded-full bg-yellow-400 shadow-lg animate-float-delayed" />
            <div className="absolute top-16 left-12 w-11 h-11 rounded-full bg-cyan-400 shadow-lg animate-float" />
            <div className="absolute top-20 right-10 w-9 h-9 rounded-full bg-purple-400 shadow-lg animate-float-delayed" />
            <div className="absolute bottom-16 left-8 w-10 h-10 rounded-full bg-green-400 shadow-lg animate-float" />
            <div className="absolute bottom-12 right-8 w-12 h-12 rounded-full bg-orange-400 shadow-lg animate-float-delayed" />
            <div className="absolute top-12 left-1/2 w-10 h-10 rounded-full bg-red-400 shadow-lg animate-float" />
          </div>

          {/* キラキラオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30" />
        </div>

        {/* 出口 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center shadow-inner">
          <div className="w-12 h-12 bg-gray-900 rounded-full" />
        </div>
      </div>

      {/* 説明 */}
      <p className="mt-3 text-sm text-purple-600 text-center w-64 whitespace-normal">
        {banner.description}
      </p>

      {/* 終了日 */}
      {banner.endDate && (
        <p className="mt-1 text-xs text-orange-500 font-medium">
          終了まで: {banner.endDate}
        </p>
      )}
    </div>
  )
}

// ガチャボタン
interface GachaPullButtonProps {
  label: string
  cost: number
  currency: 'ticket' | 'star' | 'gem'
  isPrimary?: boolean
  disabled?: boolean
  onClick: () => void
}

const GachaPullButton: React.FC<GachaPullButtonProps> = ({
  label,
  cost,
  currency,
  isPrimary = false,
  disabled = false,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center
        px-6 py-3 rounded-2xl font-bold
        transition-all duration-200
        ${isPrimary
          ? 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-sm text-white shadow-[0_4px_16px_rgba(139,92,246,0.3)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.4)] active:scale-95 border border-white/20'
          : 'bg-white/70 backdrop-blur-md border border-purple-200/50 text-purple-600 hover:bg-white/90 active:scale-95 shadow-[0_2px_8px_rgba(139,92,246,0.1)]'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      <span className="text-lg">{label}</span>
      <div className="flex items-center gap-1 mt-1">
        <CurrencyIcon type={currency} size="sm" />
        <span className="text-sm">{cost}</span>
      </div>
    </button>
  )
}

// バナー選択タブ
interface BannerTabsProps {
  banners: GachaBanner[]
  selectedId: string
  onSelect: (id: string) => void
}

const BannerTabs: React.FC<BannerTabsProps> = ({ banners, selectedId, onSelect }) => {
  const typeIcons = {
    normal: '🎰',
    premium: '👑',
    event: '🎪',
    collab: '🤝'
  }

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 px-1"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {banners.map((banner) => (
        <button
          key={banner.id}
          onClick={() => onSelect(banner.id)}
          className={`
            flex-shrink-0 px-4 py-2.5 rounded-2xl font-medium text-sm
            transition-all duration-200
            ${selectedId === banner.id
              ? 'bg-purple-600/90 backdrop-blur-sm text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)] border border-white/20'
              : 'bg-white/70 backdrop-blur-md text-purple-600 hover:bg-white/90 border border-white/50 shadow-[0_2px_8px_rgba(139,92,246,0.08)]'
            }
          `}
        >
          <span className="mr-1">{typeIcons[banner.type]}</span>
          {banner.name}
        </button>
      ))}
    </div>
  )
}

// レート表示 - iOS風カード
const RatesInfo: React.FC = () => {
  return (
    <div
      className="bg-white/70 backdrop-blur-md rounded-2xl p-4 text-xs text-purple-600 shadow-[0_2px_8px_rgba(139,92,246,0.08)] border border-white/50"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      <p className="font-bold mb-2">排出レート</p>
      <div className="grid grid-cols-2 gap-2">
        <span className="py-1">★★★★★: 1%</span>
        <span className="py-1">★★★★☆: 5%</span>
        <span className="py-1">★★★☆☆: 15%</span>
        <span className="py-1">★★☆☆☆: 30%</span>
        <span className="py-1">★☆☆☆☆: 49%</span>
      </div>
    </div>
  )
}

// メインのGachaView
export const GachaView: React.FC<GachaViewProps> = ({
  banners,
  userCurrency,
  onPullSingle,
  onPullMulti,
  backgroundImage
}) => {
  const [selectedBannerId, setSelectedBannerId] = useState(banners[0]?.id || '')
  const [isAnimating, setIsAnimating] = useState(false)

  const selectedBanner = banners.find(b => b.id === selectedBannerId) || banners[0]

  const canAffordSingle = () => {
    if (!selectedBanner) return false
    const currency = selectedBanner.currency
    const cost = selectedBanner.costSingle
    return userCurrency[`${currency}s` as keyof UserCurrency] >= cost
  }

  const canAffordMulti = () => {
    if (!selectedBanner) return false
    const currency = selectedBanner.currency
    const cost = selectedBanner.costMulti
    return userCurrency[`${currency}s` as keyof UserCurrency] >= cost
  }

  const handlePullSingle = () => {
    if (!canAffordSingle()) return
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
    onPullSingle(selectedBanner.id)
  }

  const handlePullMulti = () => {
    if (!canAffordMulti()) return
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 500)
    onPullMulti(selectedBanner.id)
  }

  if (!selectedBanner) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
        <p className="text-purple-400">ガチャがありません</p>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        ...(backgroundImage && {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
      }}
    >
      {/* 通貨バー */}
      <div className="mb-4">
        <CurrencyBar currency={userCurrency} />
      </div>

      {/* バナー選択 */}
      <div className="mb-4">
        <BannerTabs
          banners={banners}
          selectedId={selectedBannerId}
          onSelect={setSelectedBannerId}
        />
      </div>

      {/* ガチャマシン */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <GachaMachine banner={selectedBanner} isAnimating={isAnimating} />
      </div>

      {/* ガチャボタン */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <GachaPullButton
          label="1回まわす"
          cost={selectedBanner.costSingle}
          currency={selectedBanner.currency}
          disabled={!canAffordSingle()}
          onClick={handlePullSingle}
        />
        <GachaPullButton
          label="10回まわす"
          cost={selectedBanner.costMulti}
          currency={selectedBanner.currency}
          isPrimary
          disabled={!canAffordMulti()}
          onClick={handlePullMulti}
        />
      </div>

      {/* レート情報 */}
      <RatesInfo />
    </div>
  )
}

export default GachaView
