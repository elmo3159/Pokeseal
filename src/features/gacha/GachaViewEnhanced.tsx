'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface GachaViewEnhancedProps {
  banners: GachaBanner[]
  userCurrency: UserCurrency
  onPullSingle: (bannerId: string) => void
  onPullMulti: (bannerId: string) => void
}

// ============================================
// 派手なキラキラパーティクル
// ============================================
const MegaSparkles: React.FC<{ count?: number }> = ({ count = 20 }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.5 + Math.random() * 2,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
              fill={['#FFD700', '#FF69B4', '#00BFFF', '#FF6B6B', '#98FB98', '#FFB6C1', '#E6E6FA', '#FFDAB9'][i % 8]}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

// レインボーグロー背景
const RainbowGlow: React.FC = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none"
    animate={{
      background: [
        'radial-gradient(circle at 30% 30%, rgba(255,105,180,0.3) 0%, transparent 50%)',
        'radial-gradient(circle at 70% 30%, rgba(138,43,226,0.3) 0%, transparent 50%)',
        'radial-gradient(circle at 70% 70%, rgba(0,191,255,0.3) 0%, transparent 50%)',
        'radial-gradient(circle at 30% 70%, rgba(255,215,0,0.3) 0%, transparent 50%)',
        'radial-gradient(circle at 30% 30%, rgba(255,105,180,0.3) 0%, transparent 50%)',
      ],
    }}
    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
  />
)

// ============================================
// 通貨アイコン（大きめ）
// ============================================
const CurrencyIcon: React.FC<{ type: 'ticket' | 'star' | 'gem'; size?: 'sm' | 'md' | 'lg' }> = ({
  type,
  size = 'md',
}) => {
  const icons = {
    ticket: '🎟️',
    star: '⭐',
    gem: '💎',
  }
  const sizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return <span className={sizes[size]}>{icons[type]}</span>
}

// ============================================
// 通貨表示バー（派手版・モバイル対応）
// ============================================
const CurrencyBar: React.FC<{ currency: UserCurrency }> = ({ currency }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap"
    >
      {[
        { type: 'ticket' as const, value: currency.tickets, color: 'from-purple-500 via-purple-400 to-pink-500' },
        { type: 'star' as const, value: currency.stars, color: 'from-yellow-400 via-orange-400 to-red-500' },
        { type: 'gem' as const, value: currency.gems, color: 'from-cyan-400 via-blue-500 to-purple-600' },
      ].map((item) => (
        <motion.div
          key={item.type}
          whileHover={{ scale: 1.05 }}
          className={`
            flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl
            bg-gradient-to-r ${item.color}
            shadow-lg text-white font-bold text-sm sm:text-base
          `}
          style={{
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
          }}
        >
          <CurrencyIcon type={item.type} size="sm" />
          <span className="text-sm sm:text-lg">{item.value.toLocaleString()}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

// ============================================
// 巨大カプセルコンポーネント
// ============================================
const BigCapsule: React.FC<{
  color: string
  size: number
  x: number
  y: number
  delay: number
}> = ({ color, size, x, y, delay }) => {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
      }}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 15, -15, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2 + Math.random(),
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className="w-full h-full rounded-full relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 50%, ${color}aa 100%)`,
          boxShadow: `0 4px 12px ${color}80, inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 4px 8px rgba(255,255,255,0.5)`,
        }}
      >
        <div
          className="absolute top-1 left-1 w-1/3 h-1/3 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, transparent 100%)',
          }}
        />
      </div>
    </motion.div>
  )
}

// ============================================
// 巨大ガチャマシン（モバイル対応版）
// ============================================
const GiantGachaMachine: React.FC<{
  banner: GachaBanner
  isAnimating: boolean
}> = ({ banner, isAnimating }) => {
  const typeConfig = {
    normal: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F472B6',
      glow: 'rgba(139, 92, 246, 0.5)',
    },
    premium: {
      primary: '#F59E0B',
      secondary: '#EF4444',
      accent: '#FBBF24',
      glow: 'rgba(245, 158, 11, 0.5)',
    },
    event: {
      primary: '#06B6D4',
      secondary: '#3B82F6',
      accent: '#22D3EE',
      glow: 'rgba(6, 182, 212, 0.5)',
    },
    collab: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      glow: 'rgba(16, 185, 129, 0.5)',
    },
  }

  const config = typeConfig[banner.type]

  // カプセル配置（モバイル用に小さめに）
  const capsules = [
    { color: '#FF6B6B', size: 22, x: 12, y: 15, delay: 0 },
    { color: '#4ECDC4', size: 26, x: 58, y: 10, delay: 0.3 },
    { color: '#FFE66D', size: 20, x: 32, y: 40, delay: 0.6 },
    { color: '#A855F7', size: 24, x: 68, y: 45, delay: 0.9 },
    { color: '#F472B6', size: 18, x: 18, y: 58, delay: 1.2 },
    { color: '#22D3EE', size: 22, x: 52, y: 65, delay: 1.5 },
    { color: '#FB923C', size: 24, x: 38, y: 22, delay: 0.4 },
    { color: '#86EFAC', size: 18, x: 75, y: 28, delay: 0.8 },
    { color: '#FDA4AF', size: 20, x: 25, y: 75, delay: 1.0 },
  ]

  return (
    <motion.div
      className="relative flex flex-col items-center"
      animate={isAnimating ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {/* 背景グロー */}
      <motion.div
        className="absolute -inset-8 sm:-inset-16 rounded-full blur-3xl"
        style={{ background: config.glow }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* マシン本体 - モバイル対応サイズ */}
      <div className="relative w-44 h-56 sm:w-56 sm:h-72 md:w-64 md:h-80">
        {/* 台座 */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 sm:w-52 md:w-60 h-6 sm:h-8 rounded-xl"
          style={{
            background: `linear-gradient(180deg, ${config.primary} 0%, ${config.primary}99 100%)`,
            boxShadow: `0 4px 16px ${config.glow}`,
          }}
        />

        {/* マシン下部 */}
        <div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 h-14 sm:h-18 md:h-20 rounded-2xl"
          style={{
            width: 'calc(100% - 16px)',
            background: `linear-gradient(180deg, ${config.secondary} 0%, ${config.primary} 100%)`,
            boxShadow: `inset 0 4px 12px rgba(255,255,255,0.25), inset 0 -4px 12px rgba(0,0,0,0.25)`,
          }}
        >
          {/* 出口 */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 sm:w-14 h-8 sm:h-10 rounded-xl flex items-end justify-center pb-1"
            style={{
              background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
              boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.6)',
            }}
          >
            <motion.div
              className="w-8 sm:w-10 h-4 rounded-lg"
              style={{
                background: 'linear-gradient(180deg, #2d3748 0%, #1a202c 100%)',
                border: '2px solid #4a5568',
              }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          {/* 装飾ボルト */}
          {[-1, 1].map((dir) => (
            <motion.div
              key={dir}
              className="absolute top-3 w-3 h-3 sm:w-4 sm:h-4 rounded-full"
              style={{
                [dir === -1 ? 'left' : 'right']: '1rem',
                background: 'linear-gradient(135deg, #E5E7EB 0%, #9CA3AF 100%)',
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.2)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>

        {/* ガラスドーム - モバイル対応 */}
        <motion.div
          className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden"
          animate={isAnimating ? { boxShadow: [`0 0 40px ${config.glow}`, `0 0 70px ${config.glow}`, `0 0 40px ${config.glow}`] } : {}}
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%)',
            boxShadow: `
              inset 0 0 30px rgba(255,255,255,0.4),
              inset 0 0 60px ${config.glow},
              0 8px 30px rgba(0,0,0,0.3)
            `,
            border: '4px solid',
            borderColor: config.primary,
          }}
        >
          {/* 内部の背景 */}
          <div
            className="absolute inset-1.5 rounded-full overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${config.primary}50 0%, ${config.secondary}70 100%)`,
            }}
          >
            {/* カプセルたち */}
            {capsules.map((capsule, i) => (
              <BigCapsule key={i} {...capsule} />
            ))}

            {/* キラキラ */}
            <MegaSparkles count={8} />
          </div>

          {/* ガラスの反射 */}
          <div
            className="absolute top-3 left-3 w-12 h-12 sm:w-16 sm:h-16 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%)',
            }}
          />
        </motion.div>

        {/* 上部装飾 */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-28 md:w-32 h-10 sm:h-12 md:h-14 rounded-t-3xl"
          style={{
            background: `linear-gradient(180deg, ${config.accent} 0%, ${config.primary} 100%)`,
            boxShadow: `inset 0 3px 10px rgba(255,255,255,0.4), 0 3px 16px ${config.glow}`,
          }}
        >
          {/* 回転するスター装飾 */}
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2"
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))' }}>⭐</span>
          </motion.div>
        </motion.div>
      </div>

      {/* バナー名と説明 */}
      <motion.div
        className="mt-2 sm:mt-4 text-center px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h3
          className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(135deg, ${config.primary} 0%, ${config.secondary} 50%, ${config.accent} 100%)`,
            textShadow: `0 0 20px ${config.glow}`,
          }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {banner.name}
        </motion.h3>
        <p className="text-xs sm:text-sm text-purple-300 mt-0.5 line-clamp-1 max-w-[240px]">
          {banner.description}
        </p>
        {banner.endDate && (
          <motion.p
            className="text-xs text-orange-400 mt-0.5 font-bold"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⏰ {banner.endDate}まで
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}

// ============================================
// 巨大派手ガチャボタン（モバイル対応）
// ============================================
const MegaGachaPullButton: React.FC<{
  label: string
  count: number
  cost: number
  currency: 'ticket' | 'star' | 'gem'
  isPrimary?: boolean
  disabled?: boolean
  onClick: () => void
}> = ({ label, count, cost, currency, isPrimary = false, disabled = false, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.08, y: -4 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`
        relative overflow-hidden
        flex flex-col items-center justify-center
        px-4 sm:px-8 md:px-12 py-3 sm:py-5 md:py-6 rounded-2xl sm:rounded-3xl font-extrabold
        min-w-[110px] sm:min-w-[140px] md:min-w-[180px]
        transition-all duration-300
        ${
          isPrimary
            ? 'text-white'
            : 'bg-white text-purple-600 border-2 sm:border-4 border-purple-300'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}
      `}
      style={isPrimary && !disabled ? {
        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 30%, #F97316 60%, #FBBF24 100%)',
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.5), 0 0 60px rgba(236, 72, 153, 0.3)',
      } : isPrimary ? {
        background: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
      } : {
        boxShadow: '0 6px 24px rgba(139, 92, 246, 0.25)',
      }}
    >
      {/* 虹色シャインエフェクト（プライマリのみ） */}
      {isPrimary && !disabled && (
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
          }}
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* キラキラパーティクル */}
      {isPrimary && !disabled && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-white text-xs"
              initial={{ x: Math.random() * 100 + '%', y: '100%', opacity: 0 }}
              animate={{ y: '-20%', opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                delay: i * 0.25,
                repeat: Infinity,
              }}
            >
              ✨
            </motion.span>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-1 sm:gap-2">
          <motion.span
            className="text-2xl sm:text-3xl md:text-4xl"
            animate={isPrimary && !disabled ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            {count === 1 ? '🎰' : '🎊'}
          </motion.span>
          <span className="text-lg sm:text-xl md:text-2xl whitespace-nowrap">{label}</span>
        </div>
        <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2">
          <CurrencyIcon type={currency} size="md" />
          <span className="text-base sm:text-lg md:text-xl font-bold">{cost}</span>
        </div>
      </div>
    </motion.button>
  )
}

// ============================================
// バナー選択タブ（大きめ）
// ============================================
const BannerTabs: React.FC<{
  banners: GachaBanner[]
  selectedId: string
  onSelect: (id: string) => void
}> = ({ banners, selectedId, onSelect }) => {
  const typeConfig = {
    normal: { icon: '🎰', color: 'from-purple-500 via-pink-500 to-rose-500' },
    premium: { icon: '👑', color: 'from-yellow-400 via-orange-500 to-red-500' },
    event: { icon: '🎪', color: 'from-cyan-400 via-blue-500 to-purple-500' },
    collab: { icon: '🤝', color: 'from-green-400 via-emerald-500 to-teal-500' },
  }

  return (
    <div className="relative">
      <div
        className="flex gap-2 overflow-x-auto pb-2 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {banners.map((banner) => {
          const config = typeConfig[banner.type]
          const isSelected = selectedId === banner.id

          return (
            <motion.button
              key={banner.id}
              onClick={() => onSelect(banner.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-sm
                transition-all duration-300 overflow-hidden
                ${
                  isSelected
                    ? 'text-white shadow-lg'
                    : 'bg-white/90 text-purple-600 hover:bg-white border-2 border-purple-200'
                }
              `}
              style={isSelected ? {
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
              } : {}}
            >
              {isSelected && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${config.color}`}
                  layoutId="selectedBannerBg"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-lg">{config.icon}</span>
                <span>{banner.name}</span>
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// レート表示（大きめ）
// ============================================
const RatesInfo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  const rates = [
    { stars: 5, rate: '1%', color: 'from-yellow-400 via-orange-500 to-red-500' },
    { stars: 4, rate: '5%', color: 'from-purple-400 via-pink-500 to-rose-500' },
    { stars: 3, rate: '15%', color: 'from-blue-400 via-cyan-500 to-teal-500' },
    { stars: 2, rate: '30%', color: 'from-green-400 via-emerald-500 to-lime-500' },
    { stars: 1, rate: '49%', color: 'from-gray-400 via-slate-500 to-zinc-500' },
  ]

  return (
    <div>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 py-3 text-purple-400 text-base font-bold hover:text-purple-600 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-lg">📊</span>
        <span>排出レートを見る</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-sm">▼</motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 mt-2 border-2 border-purple-200 shadow-xl">
              <div className="grid grid-cols-5 gap-2">
                {rates.map((rate) => (
                  <motion.div
                    key={rate.stars}
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="flex">
                      {Array.from({ length: rate.stars }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm" style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.6))' }}>★</span>
                      ))}
                    </div>
                    <motion.span
                      className={`
                        px-2.5 py-1 rounded-xl text-white text-sm font-bold mt-1
                        bg-gradient-to-r ${rate.color}
                      `}
                      whileHover={{ scale: 1.1 }}
                    >
                      {rate.rate}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// メインコンポーネント
// ============================================
export const GachaViewEnhanced: React.FC<GachaViewEnhancedProps> = ({
  banners,
  userCurrency,
  onPullSingle,
  onPullMulti,
}) => {
  const [selectedBannerId, setSelectedBannerId] = useState(banners[0]?.id || '')
  const [isAnimating, setIsAnimating] = useState(false)

  const selectedBanner = banners.find((b) => b.id === selectedBannerId) || banners[0]

  const canAffordSingle = useCallback(() => {
    if (!selectedBanner) return false
    const currency = selectedBanner.currency
    const cost = selectedBanner.costSingle
    return userCurrency[`${currency}s` as keyof UserCurrency] >= cost
  }, [selectedBanner, userCurrency])

  const canAffordMulti = useCallback(() => {
    if (!selectedBanner) return false
    const currency = selectedBanner.currency
    const cost = selectedBanner.costMulti
    return userCurrency[`${currency}s` as keyof UserCurrency] >= cost
  }, [selectedBanner, userCurrency])

  const handlePullSingle = useCallback(() => {
    if (!canAffordSingle()) return
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
    onPullSingle(selectedBanner.id)
  }, [canAffordSingle, onPullSingle, selectedBanner])

  const handlePullMulti = useCallback(() => {
    if (!canAffordMulti()) return
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
    onPullMulti(selectedBanner.id)
  }, [canAffordMulti, onPullMulti, selectedBanner])

  if (!selectedBanner) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-purple-400 text-lg">ガチャがありません</p>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* 動く背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <RainbowGlow />
        <MegaSparkles count={15} />
      </div>

      {/* コンテンツ - pb-20でボトムナビゲーション分のパディング確保 */}
      <div className="relative z-10 flex flex-col h-full px-3 sm:px-4 py-2 sm:py-3 pb-20">
        {/* 通貨バー */}
        <div className="mb-2 sm:mb-3">
          <CurrencyBar currency={userCurrency} />
        </div>

        {/* バナー選択 */}
        <div className="mb-2 sm:mb-3">
          <BannerTabs banners={banners} selectedId={selectedBannerId} onSelect={setSelectedBannerId} />
        </div>

        {/* 巨大ガチャマシン */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-1 sm:py-2">
          <GiantGachaMachine
            banner={selectedBanner}
            isAnimating={isAnimating}
          />
        </div>

        {/* 巨大ガチャボタン */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-2 sm:py-4">
          <MegaGachaPullButton
            label="1回！"
            count={1}
            cost={selectedBanner.costSingle}
            currency={selectedBanner.currency}
            disabled={!canAffordSingle()}
            onClick={handlePullSingle}
          />
          <MegaGachaPullButton
            label="10連！"
            count={10}
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
    </div>
  )
}

export default GachaViewEnhanced
