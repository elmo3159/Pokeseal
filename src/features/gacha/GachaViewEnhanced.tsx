'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 確認ダイアログの状態
interface ConfirmDialogState {
  isOpen: boolean
  pullType: 'single' | 'multi' | null
  cost: number
  currency: 'ticket' | 'star' | 'gem'
}

// ガチャの種類
export type GachaType = 'normal' | 'premium' | 'event' | 'collab'

// 排出レート（レアリティごと）
export interface GachaRate {
  stars: number // レアリティ（1-5）
  rate: string // 表示用レート（例: "1.4%"）
}

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
  rates?: GachaRate[] // バナーごとの排出レート
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
  onOpenShop?: () => void
  onInsufficientFunds?: (fundType: 'tickets' | 'stars', required: number, current: number) => void
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
// 通貨アイコン（大きめ）- SVGベース
// ============================================
const CurrencyIcon: React.FC<{ type: 'ticket' | 'star' | 'gem'; size?: 'sm' | 'md' | 'lg' }> = ({
  type,
  size = 'md',
}) => {
  const sizes = {
    sm: { width: 16, height: 16 },
    md: { width: 24, height: 24 },
    lg: { width: 32, height: 32 },
  }
  const { width, height } = sizes[size]

  if (type === 'ticket') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="20" height="12" rx="2" fill="#A855F7" stroke="#7C3AED" strokeWidth="1.5"/>
        <circle cx="2" cy="12" r="2" fill="#FDF2F8"/>
        <circle cx="22" cy="12" r="2" fill="#FDF2F8"/>
        <line x1="8" y1="6" x2="8" y2="18" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>
    )
  }
  if (type === 'star') {
    return (
      <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1"/>
      </svg>
    )
  }
  // gem
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 8L12 22L20 8L12 2Z" fill="#60A5FA" stroke="#3B82F6" strokeWidth="1.5"/>
      <path d="M4 8H20L12 2L4 8Z" fill="#93C5FD"/>
      <line x1="12" y1="2" x2="12" y2="22" stroke="#3B82F6" strokeWidth="0.5"/>
    </svg>
  )
}

// ============================================
// マシン周りの浮遊キラキラエフェクト
// ============================================
const FloatingSparkle: React.FC<{
  delay: number
  duration: number
  x: number
  size: number
  color: string
}> = ({ delay, duration, x, size, color }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, bottom: '10%' }}
    initial={{ y: 0, opacity: 0, scale: 0 }}
    animate={{
      y: [0, -200, -300],
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1.2, 0],
      x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
        fill={color}
        style={{ filter: `drop-shadow(0 0 ${size/3}px ${color})` }}
      />
    </svg>
  </motion.div>
)

// ハートエフェクト
const FloatingHeart: React.FC<{
  delay: number
  x: number
  size: number
}> = ({ delay, x, size }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, bottom: '5%' }}
    initial={{ y: 0, opacity: 0, scale: 0 }}
    animate={{
      y: [0, -150, -250],
      opacity: [0, 1, 0.8, 0],
      scale: [0, 1, 0.8, 0],
      rotate: [0, 15, -15, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  >
    <span style={{ fontSize: size, filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.8))' }}>💖</span>
  </motion.div>
)

// 星エフェクト
const FloatingStar: React.FC<{
  delay: number
  x: number
  size: number
}> = ({ delay, x, size }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, bottom: '15%' }}
    initial={{ y: 0, opacity: 0, scale: 0, rotate: 0 }}
    animate={{
      y: [0, -180, -280],
      opacity: [0, 1, 0.6, 0],
      scale: [0, 1.2, 1, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 5,
      delay,
      repeat: Infinity,
      ease: 'easeOut',
    }}
  >
    <span style={{ fontSize: size, filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.9))' }}>⭐</span>
  </motion.div>
)

// ============================================
// 新しいガチャマシン（画像ベース + エフェクト）
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

  // キラキラの設定
  const sparkles = [
    { delay: 0, duration: 3, x: 15, size: 16, color: '#FFD700' },
    { delay: 0.5, duration: 3.5, x: 85, size: 14, color: '#FF69B4' },
    { delay: 1, duration: 4, x: 25, size: 12, color: '#00BFFF' },
    { delay: 1.5, duration: 3.2, x: 75, size: 18, color: '#FFB6C1' },
    { delay: 2, duration: 3.8, x: 50, size: 14, color: '#98FB98' },
    { delay: 2.5, duration: 3.3, x: 35, size: 16, color: '#DDA0DD' },
    { delay: 3, duration: 4.2, x: 65, size: 12, color: '#FFDAB9' },
  ]

  return (
    <motion.div
      className="relative flex flex-col items-center overflow-visible"
      style={{ overflow: 'visible' }}
      animate={isAnimating ? { scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* 背景グロー - パルス効果 */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '300px',
          height: '350px',
          background: `radial-gradient(ellipse, ${config.glow} 0%, rgba(249, 168, 212, 0.3) 40%, transparent 70%)`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 回転するリング装飾 */}
      <motion.div
        className="absolute"
        style={{
          width: '280px',
          height: '280px',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '2px dashed rgba(251, 191, 36, 0.3)',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* 浮遊エフェクト群 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* キラキラ */}
        {sparkles.map((sparkle, i) => (
          <FloatingSparkle key={`sparkle-${i}`} {...sparkle} />
        ))}
        {/* ハート */}
        <FloatingHeart delay={0.3} x={20} size={20} />
        <FloatingHeart delay={2.1} x={80} size={16} />
        <FloatingHeart delay={3.8} x={45} size={18} />
        {/* 星 */}
        <FloatingStar delay={1.2} x={10} size={22} />
        <FloatingStar delay={2.8} x={90} size={18} />
        <FloatingStar delay={4.5} x={55} size={20} />
      </div>

      {/* マシン本体（画像） */}
      <motion.div
        className="relative z-10"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* ガチャマシン画像 - overflow visible で切れないようにする */}
        <motion.img
          src="/images/Gacha_Tab/Gacha2.png"
          alt="ガチャマシン"
          className="w-52 sm:w-60 md:w-72 h-auto max-h-none"
          style={{
            filter: `drop-shadow(0 0 25px ${config.glow}) drop-shadow(0 10px 20px rgba(0,0,0,0.15))`,
            objectFit: 'contain',
          }}
          animate={isAnimating ? {
            filter: [
              `drop-shadow(0 0 25px ${config.glow}) drop-shadow(0 10px 20px rgba(0,0,0,0.15))`,
              `drop-shadow(0 0 50px ${config.glow}) drop-shadow(0 0 70px rgba(255,215,0,0.6))`,
              `drop-shadow(0 0 25px ${config.glow}) drop-shadow(0 10px 20px rgba(0,0,0,0.15))`,
            ],
          } : {}}
          transition={{ duration: 0.5 }}
          draggable={false}
        />

        {/* 周囲のキラキラ装飾（相対位置で自然に配置） */}
        <motion.div
          className="absolute -top-4 right-2 pointer-events-none"
          animate={{ rotate: 360, scale: [1, 1.3, 1] }}
          transition={{ rotate: { duration: 6, repeat: Infinity, ease: 'linear' }, scale: { duration: 1.5, repeat: Infinity } }}
        >
          <span style={{ fontSize: '22px', filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.8))' }}>✨</span>
        </motion.div>
        <motion.div
          className="absolute -top-3 left-0 pointer-events-none"
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity, delay: 0.5 } }}
        >
          <span style={{ fontSize: '18px', filter: 'drop-shadow(0 0 8px rgba(244,114,182,0.8))' }}>💫</span>
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 -right-5 pointer-events-none"
          animate={{ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span style={{ fontSize: '16px', filter: 'drop-shadow(0 0 6px rgba(147,197,253,0.8))' }}>🌟</span>
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 -left-5 pointer-events-none"
          animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        >
          <span style={{ fontSize: '14px', filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.8))' }}>⭐</span>
        </motion.div>
      </motion.div>

      {/* バナー名と説明 */}
      <motion.div
        className="mt-3 sm:mt-4 text-center px-4 relative z-10"
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
            className="text-xs text-orange-400 mt-0.5 font-bold flex items-center justify-center gap-1"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#FED7AA" stroke="#F97316" strokeWidth="2"/>
              <path d="M12 6V12L16 14" stroke="#F97316" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {banner.endDate}まで
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
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${15 + i * 14}%` }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '-20%', opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                delay: i * 0.25,
                repeat: Infinity,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="white"/>
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-1 sm:gap-2">
          <motion.div
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
            animate={isPrimary && !disabled ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            {count === 1 ? (
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <rect x="3" y="4" width="18" height="16" rx="3" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1.5"/>
                <rect x="6" y="8" width="4" height="8" rx="1" fill="#FDE68A"/>
                <rect x="10" y="8" width="4" height="8" rx="1" fill="#FDE68A"/>
                <rect x="14" y="8" width="4" height="8" rx="1" fill="#FDE68A"/>
                <circle cx="8" cy="12" r="1.5" fill="#EF4444"/>
                <circle cx="12" cy="12" r="1.5" fill="#22C55E"/>
                <circle cx="16" cy="12" r="1.5" fill="#3B82F6"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path d="M12 2L14 8H20L15 12L17 18L12 14L7 18L9 12L4 8H10L12 2Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1"/>
                <circle cx="6" cy="4" r="2" fill="#EC4899"/>
                <circle cx="18" cy="4" r="2" fill="#8B5CF6"/>
                <circle cx="4" cy="16" r="1.5" fill="#22C55E"/>
                <circle cx="20" cy="16" r="1.5" fill="#3B82F6"/>
              </svg>
            )}
          </motion.div>
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
// バナータブ用SVGアイコン
const BannerIcon: React.FC<{ type: GachaType }> = ({ type }) => {
  const size = 18
  switch (type) {
    case 'normal':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="7" y="8" width="3" height="8" rx="1" fill="currentColor"/>
          <rect x="10.5" y="8" width="3" height="8" rx="1" fill="currentColor"/>
          <rect x="14" y="8" width="3" height="8" rx="1" fill="currentColor"/>
        </svg>
      )
    case 'premium':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15 8H21L16 12L18 19L12 15L6 19L8 12L3 8H9L12 2Z" fill="currentColor"/>
        </svg>
      )
    case 'event':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14 6H18L15 9L16 14L12 11L8 14L9 9L6 6H10L12 2Z" fill="currentColor"/>
          <rect x="4" y="14" width="16" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1"/>
        </svg>
      )
    case 'collab':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M7 17L3 13L7 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 7L21 11L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 11H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    default:
      return null
  }
}

const BannerTabs: React.FC<{
  banners: GachaBanner[]
  selectedId: string
  onSelect: (id: string) => void
}> = ({ banners, selectedId, onSelect }) => {
  const typeConfig = {
    normal: { color: 'from-purple-500 via-pink-500 to-rose-500' },
    premium: { color: 'from-yellow-400 via-orange-500 to-red-500' },
    event: { color: 'from-cyan-400 via-blue-500 to-purple-500' },
    collab: { color: 'from-green-400 via-emerald-500 to-teal-500' },
  }

  return (
    <div className="relative">
      <div className="flex justify-center gap-1.5 pb-2 px-1 flex-wrap">
        {banners.map((banner) => {
          const config = typeConfig[banner.type]
          const isSelected = selectedId === banner.id

          return (
            <motion.button
              key={banner.id}
              onClick={() => onSelect(banner.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`
                relative px-2.5 py-1.5 rounded-xl font-bold text-xs
                transition-all duration-300 overflow-hidden
                ${
                  isSelected
                    ? 'text-white shadow-md'
                    : 'bg-white/90 text-purple-600 hover:bg-white border border-purple-200'
                }
              `}
              style={isSelected ? {
                boxShadow: '0 3px 12px rgba(139, 92, 246, 0.35)',
              } : {}}
            >
              {isSelected && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${config.color}`}
                  layoutId="selectedBannerBg"
                />
              )}
              <span className="relative z-10 flex items-center gap-1">
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
// 確認ダイアログ
// ============================================
// 確認ダイアログ用の通貨アイコン（大きめ）
export const ConfirmCurrencyIcon: React.FC<{ type: 'ticket' | 'star' | 'gem' }> = ({ type }) => {
  const size = 32
  if (type === 'ticket') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="20" height="12" rx="2" fill="#A855F7" stroke="#7C3AED" strokeWidth="1.5"/>
        <circle cx="2" cy="12" r="2" fill="#FDF2F8"/>
        <circle cx="22" cy="12" r="2" fill="#FDF2F8"/>
        <line x1="8" y1="6" x2="8" y2="18" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="2 2"/>
      </svg>
    )
  }
  if (type === 'star') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1"/>
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 8L12 22L20 8L12 2Z" fill="#60A5FA" stroke="#3B82F6" strokeWidth="1.5"/>
      <path d="M4 8H20L12 2L4 8Z" fill="#93C5FD"/>
    </svg>
  )
}

export const GachaConfirmDialog: React.FC<{
  isOpen: boolean
  pullType: 'single' | 'multi' | null
  cost: number
  currency: 'ticket' | 'star' | 'gem'
  currentAmount: number
  onConfirm: () => void
  onCancel: () => void
}> = ({ isOpen, pullType, cost, currency, currentAmount, onConfirm, onCancel }) => {
  const currencyNames = {
    ticket: 'シルチケ',
    star: 'どろっぷ',
    gem: 'プレシル',
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 背景オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* ダイアログ本体 */}
      <motion.div
        className="relative bg-white rounded-3xl overflow-hidden shadow-2xl"
        style={{
          width: '90%',
          maxWidth: '340px',
          minWidth: '280px',
        }}
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
      >
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-6 py-4">
          <h3 className="text-xl font-bold text-white text-center">
            ガチャをひく？
          </h3>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-5">
          {/* 回数表示 */}
          <div className="text-center mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto">
              <rect x="3" y="4" width="18" height="16" rx="3" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="1.5"/>
              <rect x="6" y="8" width="4" height="8" rx="1" fill="#FDE68A"/>
              <rect x="10" y="8" width="4" height="8" rx="1" fill="#FDE68A"/>
              <rect x="14" y="8" width="4" height="8" rx="1" fill="#FDE68A"/>
              <circle cx="8" cy="12" r="1.5" fill="#EF4444"/>
              <circle cx="12" cy="12" r="1.5" fill="#22C55E"/>
              <circle cx="16" cy="12" r="1.5" fill="#3B82F6"/>
            </svg>
            <p className="text-lg font-bold text-purple-600 mt-1">
              {pullType === 'single' ? '1回ガチャ' : '10連ガチャ'}
            </p>
          </div>

          {/* コスト表示 */}
          <div className="bg-purple-50 rounded-2xl p-4 mb-4">
            <p className="text-center text-sm text-purple-500 mb-2">
              ひくのにひつようなもの
            </p>
            <div className="flex items-center justify-center gap-2">
              <ConfirmCurrencyIcon type={currency} />
              <span className="text-2xl font-bold text-purple-600">
                {cost}
              </span>
              <span className="text-lg text-purple-500">
                {currencyNames[currency]}
              </span>
            </div>
          </div>

          {/* 残り表示 */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              いま もっている {currencyNames[currency]}：
              <span className="font-bold text-purple-600 ml-1">
                {currentAmount}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ひいたあと：
              <span className={`font-bold ml-1 ${currentAmount - cost < 0 ? 'text-red-500' : 'text-green-600'}`}>
                {currentAmount - cost}
              </span>
            </p>
          </div>

          {/* ボタン */}
          <div className="flex gap-3">
            <motion.button
              onClick={onCancel}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-200 text-gray-600 font-bold text-lg transition-colors hover:bg-gray-300"
            >
              いいえ
            </motion.button>
            <motion.button
              onClick={onConfirm}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg"
            >
              はい！
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// レート表示（大きめ）
// ============================================
// レアリティごとのグラデーション色
const rateColors: Record<number, string> = {
  5: 'from-yellow-400 via-orange-500 to-red-500',
  4: 'from-purple-400 via-pink-500 to-rose-500',
  3: 'from-blue-400 via-cyan-500 to-teal-500',
  2: 'from-green-400 via-emerald-500 to-lime-500',
  1: 'from-gray-400 via-slate-500 to-zinc-500',
}

// デフォルト排出レート（通常ガチャ）
const defaultRates: GachaRate[] = [
  { stars: 5, rate: '1.4%' },
  { stars: 4, rate: '4.7%' },
  { stars: 3, rate: '14.1%' },
  { stars: 2, rate: '28.2%' },
  { stars: 1, rate: '51.6%' },
]

const RatesInfo: React.FC<{ rates?: GachaRate[] }> = ({ rates: bannerRates }) => {
  const [isOpen, setIsOpen] = useState(false)

  // バナーにratesが設定されていればそれを使用、なければデフォルト
  const rates = bannerRates || defaultRates

  return (
    <div>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 py-3 text-purple-400 text-base font-bold hover:text-purple-600 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="14" width="4" height="8" rx="1" fill="currentColor"/>
          <rect x="10" y="10" width="4" height="12" rx="1" fill="currentColor"/>
          <rect x="17" y="4" width="4" height="18" rx="1" fill="currentColor"/>
        </svg>
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
                        bg-gradient-to-r ${rateColors[rate.stars] || rateColors[1]}
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
  onOpenShop,
  onInsufficientFunds,
}) => {
  const [selectedBannerId, setSelectedBannerId] = useState(banners[0]?.id || '')
  const [isAnimating, setIsAnimating] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    pullType: null,
    cost: 0,
    currency: 'ticket',
  })

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

  // 現在の通貨残高を取得
  const getCurrentCurrencyAmount = useCallback(() => {
    if (!selectedBanner) return 0
    return userCurrency[`${selectedBanner.currency}s` as keyof UserCurrency]
  }, [selectedBanner, userCurrency])

  // 確認ダイアログを開く
  const openConfirmDialog = useCallback((pullType: 'single' | 'multi') => {
    if (!selectedBanner) return
    const cost = pullType === 'single' ? selectedBanner.costSingle : selectedBanner.costMulti
    setConfirmDialog({
      isOpen: true,
      pullType,
      cost,
      currency: selectedBanner.currency,
    })
  }, [selectedBanner])

  // 確認ダイアログを閉じる
  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }))
  }, [])

  // ガチャ実行
  const executeGacha = useCallback(() => {
    if (!selectedBanner || !confirmDialog.pullType) return

    closeConfirmDialog()
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)

    if (confirmDialog.pullType === 'single') {
      onPullSingle(selectedBanner.id)
    } else {
      onPullMulti(selectedBanner.id)
    }
  }, [selectedBanner, confirmDialog.pullType, closeConfirmDialog, onPullSingle, onPullMulti])

  const handlePullSingle = useCallback(() => {
    if (!selectedBanner) return
    const current = getCurrentCurrencyAmount()
    const cost = selectedBanner.costSingle
    if (current < cost) {
      // 残高不足
      if (onInsufficientFunds) {
        const fundType = selectedBanner.currency === 'ticket' ? 'tickets' : 'stars'
        onInsufficientFunds(fundType, cost, current)
      }
      return
    }
    openConfirmDialog('single')
  }, [selectedBanner, getCurrentCurrencyAmount, onInsufficientFunds, openConfirmDialog])

  const handlePullMulti = useCallback(() => {
    if (!selectedBanner) return
    const current = getCurrentCurrencyAmount()
    const cost = selectedBanner.costMulti
    if (current < cost) {
      // 残高不足
      if (onInsufficientFunds) {
        const fundType = selectedBanner.currency === 'ticket' ? 'tickets' : 'stars'
        onInsufficientFunds(fundType, cost, current)
      }
      return
    }
    openConfirmDialog('multi')
  }, [selectedBanner, getCurrentCurrencyAmount, onInsufficientFunds, openConfirmDialog])

  if (!selectedBanner) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-purple-400 text-lg">ガチャがありません</p>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >

      {/* コンテンツ - ヘッダー下から全画面 */}
      <div className="relative z-10 flex flex-col h-full px-2 pt-3 pb-24 overflow-x-hidden overflow-y-auto">
        {/* バナー選択 */}
        <div className="mb-2">
          <BannerTabs banners={banners} selectedId={selectedBannerId} onSelect={setSelectedBannerId} />
        </div>

        {/* 巨大ガチャマシン */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-1 sm:py-2 overflow-visible">
          <div className="transform scale-[0.85] sm:scale-95 md:scale-100 origin-center overflow-visible">
            <GiantGachaMachine
              banner={selectedBanner}
              isAnimating={isAnimating}
            />
          </div>
        </div>

        {/* 巨大ガチャボタン - 常にアクティブ（残高不足時はショップへ誘導） */}
        <div className="flex-shrink-0 flex items-center justify-center gap-2 sm:gap-4 py-2 sm:py-3">
          <MegaGachaPullButton
            label="1回！"
            count={1}
            cost={selectedBanner.costSingle}
            currency={selectedBanner.currency}
            onClick={handlePullSingle}
          />
          <MegaGachaPullButton
            label="10連！"
            count={10}
            cost={selectedBanner.costMulti}
            currency={selectedBanner.currency}
            isPrimary
            onClick={handlePullMulti}
          />
        </div>

        {/* レート情報 */}
        <div className="flex-shrink-0">
          <RatesInfo rates={selectedBanner?.rates} />
        </div>
      </div>

      {/* 確認ダイアログ */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <GachaConfirmDialog
            isOpen={confirmDialog.isOpen}
            pullType={confirmDialog.pullType}
            cost={confirmDialog.cost}
            currency={confirmDialog.currency}
            currentAmount={getCurrentCurrencyAmount()}
            onConfirm={executeGacha}
            onCancel={closeConfirmDialog}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default GachaViewEnhanced
