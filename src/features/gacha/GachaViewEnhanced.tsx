'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'

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
  onWatchAd?: () => void
  remainingAdWatches?: number
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
        <p className="text-xs sm:text-sm text-purple-600 mt-0.5 line-clamp-1 max-w-[240px]">
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
      whileHover={disabled ? {} : { scale: 1.03, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`
        relative overflow-hidden
        flex items-center justify-center gap-2
        px-4 py-3.5 rounded-xl font-extrabold
        flex-1
        transition-all duration-300
        ${
          isPrimary
            ? 'text-white'
            : 'bg-white text-purple-600 border-2 border-purple-300'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}
      `}
      style={isPrimary && !disabled ? {
        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 30%, #F97316 60%, #FBBF24 100%)',
        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4), 0 0 30px rgba(236, 72, 153, 0.2)',
      } : isPrimary ? {
        background: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
      } : {
        boxShadow: '0 3px 12px rgba(139, 92, 246, 0.2)',
      }}
    >
      {/* 虹色シャインエフェクト（プライマリのみ） */}
      {isPrimary && !disabled && (
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
          }}
          animate={{ x: ['-200%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* キラキラパーティクル */}
      {isPrimary && !disabled && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${20 + i * 20}%` }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '-20%', opacity: [0, 1, 0] }}
              transition={{
                duration: 1.5,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="white"/>
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* アイコン */}
      <motion.div
        className="relative z-10 w-6 h-6 flex-shrink-0"
        animate={isPrimary && !disabled ? { rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      >
        {count === 1 ? (
          /* ガチャカプセルアイコン */
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <circle cx="12" cy="12" r="10" fill="url(#capsuleGrad1)" stroke="#8B5CF6" strokeWidth="1.5"/>
            <path d="M2.5 12h19" stroke="#8B5CF6" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="10" fill="url(#capsuleShine)" fillOpacity="0.4"/>
            <defs>
              <linearGradient id="capsuleGrad1" x1="12" y1="2" x2="12" y2="22">
                <stop offset="0%" stopColor="#EC4899"/>
                <stop offset="45%" stopColor="#EC4899"/>
                <stop offset="55%" stopColor="#FAFAFA"/>
                <stop offset="100%" stopColor="#FAFAFA"/>
              </linearGradient>
              <radialGradient id="capsuleShine" cx="0.3" cy="0.3" r="0.7">
                <stop offset="0%" stopColor="white"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
            </defs>
          </svg>
        ) : (
          /* キラキラ星アイコン */
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="0.5"/>
            <path d="M19 3L19.8 5.5L22 6L19.8 6.5L19 9L18.2 6.5L16 6L18.2 5.5L19 3Z" fill="#EC4899"/>
            <path d="M5 14L5.6 16L7 16.5L5.6 17L5 19L4.4 17L3 16.5L4.4 16L5 14Z" fill="#8B5CF6"/>
          </svg>
        )}
      </motion.div>

      {/* ラベル */}
      <span className="relative z-10 text-lg whitespace-nowrap">{label}</span>

      {/* 通貨アイコン + コスト */}
      <div className="relative z-10 flex items-center gap-0.5 flex-shrink-0">
        <CurrencyIcon type={currency} size="sm" />
        <span className="text-sm font-bold">{cost}</span>
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
  return <CurrencyIcon type={type} size="lg" />
}

// ガチャ確認ダイアログ
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
    gem: 'プレシルチケ',
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
            <img
              src="/images/Gacha_Tab/Gacha2.png"
              alt="ガチャマシン"
              className="mx-auto w-20 h-auto"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))' }}
            />
            <p className="text-lg font-bold text-purple-600 mt-2">
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
// レート表示（モーダル形式）
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

// 排出レートモーダル
const RatesModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  rates?: GachaRate[]
}> = ({ isOpen, onClose, rates: bannerRates }) => {
  const rates = bannerRates || defaultRates

  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 背景オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <motion.div
        className="relative bg-white rounded-3xl overflow-hidden shadow-2xl"
        style={{
          width: '90%',
          maxWidth: '360px',
        }}
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
      >
        {/* ヘッダー */}
        <div
          className="relative px-6 py-4"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%)',
          }}
        >
          <h3 className="text-xl font-bold text-white text-center">
            排出レート
          </h3>
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-5">
          <div className="space-y-3">
            {rates.map((rate) => (
              <motion.div
                key={rate.stars}
                className="flex items-center justify-between p-3 rounded-2xl"
                style={{
                  background: rate.stars >= 4
                    ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
                    : rate.stars === 3
                    ? 'linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%)'
                    : 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (5 - rate.stars) * 0.1 }}
              >
                {/* 星表示 */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: rate.stars }).map((_, i) => (
                      <span
                        key={i}
                        className="text-lg"
                        style={{
                          color: rate.stars >= 4 ? '#F59E0B' : rate.stars === 3 ? '#8B5CF6' : '#9CA3AF',
                          filter: rate.stars >= 4 ? 'drop-shadow(0 0 4px rgba(245,158,11,0.6))' : 'none',
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-600">
                    {rate.stars === 5 ? 'ウルトラレア' :
                     rate.stars === 4 ? 'スーパーレア' :
                     rate.stars === 3 ? 'レア' :
                     rate.stars === 2 ? 'アンコモン' : 'コモン'}
                  </span>
                </div>

                {/* レート */}
                <span
                  className={`
                    px-3 py-1.5 rounded-xl text-white text-base font-bold
                    bg-gradient-to-r ${rateColors[rate.stars] || rateColors[1]}
                  `}
                  style={{
                    boxShadow: rate.stars >= 4 ? '0 2px 8px rgba(245,158,11,0.4)' : 'none',
                  }}
                >
                  {rate.rate}
                </span>
              </motion.div>
            ))}
          </div>

          {/* 注意書き */}
          <p className="text-center text-xs text-gray-400 mt-4">
            ※レートは小数点以下で四捨五入されています
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// 排出レートを見るボタン
const RatesButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-full"
      style={{
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
      }}
      whileHover={{ scale: 1.02, background: 'rgba(139, 92, 246, 0.15)' }}
      whileTap={{ scale: 0.98 }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="14" width="4" height="8" rx="1" fill="#8B5CF6"/>
        <rect x="10" y="10" width="4" height="12" rx="1" fill="#8B5CF6"/>
        <rect x="17" y="4" width="4" height="18" rx="1" fill="#8B5CF6"/>
      </svg>
      <span className="text-purple-600 text-sm font-bold">排出レートを見る</span>
    </motion.button>
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
  onWatchAd,
  remainingAdWatches = 0,
}) => {
  const [selectedBannerId, setSelectedBannerId] = useState(banners[0]?.id || '')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false)
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
      <div className="flex flex-col h-full px-2 pt-10 pb-[81px]">
        {/* バナー選択 */}
        <div className="flex-shrink-0 mb-2">
          <BannerTabs banners={banners} selectedId={selectedBannerId} onSelect={setSelectedBannerId} />
        </div>

        {/* 巨大ガチャマシン - 残りスペースを使用 */}
        <div className="flex-1 flex items-center justify-center min-h-0 overflow-visible">
          <div className="transform scale-[0.85] sm:scale-95 md:scale-100 origin-center overflow-visible">
            <GiantGachaMachine
              banner={selectedBanner}
              isAnimating={isAnimating}
            />
          </div>
        </div>

        {/* ボタン群 - 下部に固定配置 */}
        <div className="flex-shrink-0 flex flex-col px-4 pb-2">
          {/* ガチャボタン - 横並び1行 */}
          <div className="flex items-center gap-3 mb-4">
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

          {/* 広告視聴でシルチケゲット */}
          {onWatchAd && (
            <div className="flex justify-center mb-2">
              <motion.button
                onClick={onWatchAd}
                disabled={remainingAdWatches <= 0}
                className="flex items-center gap-2 px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: remainingAdWatches > 0
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
                  boxShadow: remainingAdWatches > 0
                    ? '0 3px 10px rgba(16, 185, 129, 0.4)'
                    : 'none',
                }}
                whileHover={remainingAdWatches > 0 ? { scale: 1.03 } : {}}
                whileTap={remainingAdWatches > 0 ? { scale: 0.97 } : {}}
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xs">▷</span>
                </div>
                <span className="font-bold text-sm text-white text-center leading-tight">
                  {remainingAdWatches > 0
                    ? <>こうこくをみて<br />シルチケをゲット！</>
                    : 'きょうのこうこくはおわり'}
                </span>
                {remainingAdWatches > 0 && (
                  <>
                    <CurrencyIcon type="ticket" size="sm" />
                    <span className="text-white text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">
                      のこり{remainingAdWatches}回
                    </span>
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* 排出レートを見るボタン */}
          <div className="flex justify-center">
            <RatesButton onClick={() => setIsRatesModalOpen(true)} />
          </div>
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

      {/* 排出レートモーダル */}
      <AnimatePresence>
        {isRatesModalOpen && (
          <RatesModal
            isOpen={isRatesModalOpen}
            onClose={() => setIsRatesModalOpen(false)}
            rates={selectedBanner?.rates}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default GachaViewEnhanced
