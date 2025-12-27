'use client'

import { HTMLAttributes, ReactNode } from 'react'
import { StickerAura } from '@/components/upgrade'
import { UPGRADE_RANKS, STAR_BONUS, formatNameWithRank, type UpgradeRank } from '@/constants/upgradeRanks'

type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat' | 'glass'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | 'full'
  clickable?: boolean
}

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 4px 24px rgba(139, 92, 246, 0.08)',
    border: 'none',
  },
  elevated: {
    backgroundColor: '#FFFFFF',
    boxShadow: '0 8px 40px rgba(139, 92, 246, 0.12)',
    border: 'none',
  },
  outlined: {
    backgroundColor: '#FFFFFF',
    boxShadow: 'none',
    border: '1px solid rgba(167, 139, 250, 0.2)',
  },
  flat: {
    backgroundColor: '#FFFFFF',
    boxShadow: 'none',
    border: 'none',
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
  },
}

// 余白を2倍に拡張
const paddingMap: Record<'none' | 'sm' | 'md' | 'lg' | 'xl', string> = {
  none: '0',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px',
}

const roundedMap: Record<'md' | 'lg' | 'xl' | '2xl' | 'full', string> = {
  md: '16px',
  lg: '20px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
}

export function Card({
  variant = 'default',
  children,
  padding = 'md',
  rounded = 'xl',
  clickable = false,
  className = '',
  style,
  ...props
}: CardProps) {
  const baseStyles: React.CSSProperties = {
    ...variantStyles[variant],
    padding: paddingMap[padding],
    borderRadius: roundedMap[rounded],
    cursor: clickable ? 'pointer' : 'default',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    ...style,
  }

  return (
    <div
      className={`${clickable ? 'hover:scale-[1.02] active:scale-[0.98]' : ''} ${className}`}
      style={baseStyles}
      {...props}
    >
      {children}
    </div>
  )
}

// シールカード専用コンポーネント
interface StickerCardProps {
  imageUrl?: string
  name: string
  rarity?: number // 1-5の星
  onClick?: () => void
  selected?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  compact?: boolean // 名前と星を非表示にしてコンパクト表示
  upgradeRank?: number // アップグレードランク（0=ノーマル, 1=シルバー, 2=ゴールド, 3=プリズム）
}

const stickerSizeMap: Record<'xs' | 'sm' | 'md' | 'lg', { width: string; height: string }> = {
  xs: { width: '70px', height: '70px' },
  sm: { width: '88px', height: '88px' },
  md: { width: '110px', height: '110px' },
  lg: { width: '150px', height: '150px' },
}

export function StickerCard({
  imageUrl,
  name,
  rarity = 1,
  onClick,
  selected = false,
  size = 'md',
  compact = false,
  upgradeRank = 0,
}: StickerCardProps) {
  const sizeConfig = stickerSizeMap[size]
  const effectiveUpgradeRank = (upgradeRank ?? UPGRADE_RANKS.NORMAL) as UpgradeRank

  // 有効レア度 = ベースレア度 + アップグレードボーナス（最大10まで）
  const starBonus = STAR_BONUS[effectiveUpgradeRank] ?? 0
  const effectiveRarity = Math.min(rarity + starBonus, 10)

  // レア度に応じたパステルグラデーションカラー（有効レア度を使用）
  const getRarityGradient = () => {
    if (effectiveRarity >= 5) return 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 50%, #F9A8D4 100%)'
    if (effectiveRarity >= 4) return 'linear-gradient(135deg, #C4B5FD 0%, #F9A8D4 100%)'
    if (effectiveRarity >= 3) return 'linear-gradient(135deg, #93C5FD 0%, #A78BFA 100%)'
    return 'linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 100%)'
  }

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-2 cursor-pointer transition-all duration-300"
      style={{
        transform: selected ? 'translateY(-6px) scale(1.05)' : 'translateY(0) scale(1)',
        // カード全体の幅を画像サイズに合わせて固定
        width: sizeConfig.width,
        maxWidth: sizeConfig.width,
      }}
    >
      {/* シール画像エリア - モダンな浮遊感 + アップグレードオーラ */}
      <StickerAura upgradeRank={effectiveUpgradeRank}>
        <div
          className="flex items-center justify-center rounded-2xl overflow-hidden relative"
          style={{
            width: sizeConfig.width,
            height: sizeConfig.height,
            background: '#FFFFFF',
            boxShadow: selected
              ? '0 8px 32px rgba(139, 92, 246, 0.25), 0 0 0 3px rgba(167, 139, 250, 0.5)'
              : '0 4px 20px rgba(139, 92, 246, 0.1)',
          }}
        >
          {/* レア度に応じた背景グロー（有効レア度を使用） */}
          {effectiveRarity >= 4 && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: getRarityGradient(),
                filter: 'blur(12px)',
              }}
            />
          )}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-contain relative z-10"
              style={{
                filter: selected ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' : 'none',
              }}
            />
          ) : (
            <span className="text-3xl relative z-10">🎨</span>
          )}
        </div>
      </StickerAura>

      {/* レア度表示 - アップグレードランクに応じた色の星（compact時は非表示）*/}
      {/* 5個で改行、最大10個（2行×5個） */}
      {!compact && (() => {
        const firstRowCount = Math.min(effectiveRarity, 5)
        const secondRowCount = Math.max(effectiveRarity - 5, 0)

        // アップグレードランクに応じた星の色
        const getStarStyle = (): React.CSSProperties => {
          switch (effectiveUpgradeRank) {
            case UPGRADE_RANKS.PRISM:
              return {
                background: 'linear-gradient(135deg, #FF6B9D, #C084FC, #60A5FA, #34D399, #FBBF24, #F87171)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 3px rgba(192, 132, 252, 0.8))',
              }
            case UPGRADE_RANKS.GOLD:
              return {
                color: '#FFD700',
                textShadow: '0 0 6px rgba(255, 215, 0, 0.8), 0 0 12px rgba(255, 180, 0, 0.5)',
              }
            case UPGRADE_RANKS.SILVER:
              return {
                color: '#C0C0C0',
                textShadow: '0 0 4px rgba(192, 192, 192, 0.6)',
              }
            default:
              return {
                color: '#FCD34D',
                textShadow: '0 1px 4px rgba(252, 211, 77, 0.4)',
              }
          }
        }

        return (
          <div className="flex flex-col items-center gap-0">
            {/* 1行目: 星1-5 */}
            <div className="flex gap-0.5 justify-center">
              {Array.from({ length: firstRowCount }).map((_, i) => (
                <span key={i} className="text-xs" style={getStarStyle()}>★</span>
              ))}
            </div>
            {/* 2行目: 星6-10（6個以上の場合のみ） */}
            {secondRowCount > 0 && (
              <div className="flex gap-0.5 justify-center">
                {Array.from({ length: secondRowCount }).map((_, i) => (
                  <span key={i + 5} className="text-xs" style={getStarStyle()}>★</span>
                ))}
              </div>
            )}
          </div>
        )
      })()}

      {/* シール名 - 丸みのあるフォント（compact時は非表示）- 2行表示対応 + ランクマーク */}
      {!compact && (
        <span
          className="text-center block w-full"
          style={{
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            fontWeight: 500,
            color: '#7C3AED',
            letterSpacing: '0.02em',
            fontSize: '10px',
            lineHeight: '1.3',
            maxWidth: '100%',
            minHeight: '26px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-all',
          }}
        >
          {formatNameWithRank(name, effectiveUpgradeRank)}
        </span>
      )}
    </div>
  )
}
