'use client'

import { useState } from 'react'

// チャームの種類
export type CharmType =
  | 'heart'
  | 'star'
  | 'ribbon'
  | 'flower'
  | 'moon'
  | 'diamond'
  | 'clover'
  | 'rainbow'

// チャームデータ
export interface CharmData {
  id: string
  type: CharmType
  name: string
  emoji: string
  color: string
}

// 利用可能なチャーム一覧
export const CHARM_LIST: CharmData[] = [
  { id: 'heart', type: 'heart', name: 'ハート', emoji: '💖', color: '#FF69B4' },
  { id: 'star', type: 'star', name: 'スター', emoji: '⭐', color: '#FFD700' },
  { id: 'ribbon', type: 'ribbon', name: 'リボン', emoji: '🎀', color: '#FF1493' },
  { id: 'flower', type: 'flower', name: 'おはな', emoji: '🌸', color: '#FFB7C5' },
  { id: 'moon', type: 'moon', name: 'おつきさま', emoji: '🌙', color: '#FFF8DC' },
  { id: 'diamond', type: 'diamond', name: 'ダイヤ', emoji: '💎', color: '#B9F2FF' },
  { id: 'clover', type: 'clover', name: 'クローバー', emoji: '🍀', color: '#98FB98' },
  { id: 'rainbow', type: 'rainbow', name: 'にじ', emoji: '🌈', color: '#FF7F50' },
]

interface CharmProps {
  charmId?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// 単一チャームコンポーネント
export function Charm({ charmId = 'heart', size = 'md', className = '' }: CharmProps) {
  const charm = CHARM_LIST.find((c) => c.id === charmId) || CHARM_LIST[0]

  const sizeStyles = {
    sm: { fontSize: '24px', chainHeight: '20px' },
    md: { fontSize: '32px', chainHeight: '30px' },
    lg: { fontSize: '48px', chainHeight: '40px' },
  }

  const style = sizeStyles[size]

  return (
    <div
      className={`charm-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transformOrigin: 'top center',
        animation: 'charm-swing 3s ease-in-out infinite',
        zIndex: 10,
        position: 'absolute' as const,
        top: '0px',
      }}
    >
      {/* チェーン部分 */}
      <div
        className="charm-chain"
        style={{
          width: '2px',
          height: style.chainHeight,
          background: 'linear-gradient(180deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
          borderRadius: '1px',
        }}
      />

      {/* リング部分 */}
      <div
        className="charm-ring"
        style={{
          width: '12px',
          height: '12px',
          border: '2px solid #FFD700',
          borderRadius: '50%',
          marginTop: '-2px',
        }}
      />

      {/* チャーム本体 */}
      <div
        className="charm-body"
        style={{
          fontSize: style.fontSize,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          marginTop: '-4px',
        }}
      >
        {charm.emoji}
      </div>
    </div>
  )
}

interface CharmBarProps {
  charms?: string[] // 表示するチャームIDの配列
  maxCharms?: number
  className?: string
}

// シール帳上部に表示するチャームバー
export function CharmBar({
  charms = ['heart'],
  maxCharms = 3,
  className = '',
}: CharmBarProps) {
  const displayCharms = charms.slice(0, maxCharms)

  return (
    <div
      className={`charm-bar ${className}`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        padding: '8px 0',
      }}
    >
      {displayCharms.map((charmId, index) => (
        <div
          key={`${charmId}-${index}`}
          style={{
            animationDelay: `${index * 0.5}s`,
          }}
        >
          <Charm charmId={charmId} size="md" />
        </div>
      ))}
    </div>
  )
}

interface CharmSelectorProps {
  selectedCharmId?: string
  onSelect?: (charmId: string) => void
  ownedCharmIds?: string[] // 所持しているチャームID
  className?: string
}

// チャーム選択UI
export function CharmSelector({
  selectedCharmId,
  onSelect,
  ownedCharmIds = CHARM_LIST.map((c) => c.id), // デフォルトは全て所持
  className = '',
}: CharmSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className={`charm-selector ${className}`}>
      <h3
        className="text-lg font-bold mb-4 text-center"
        style={{ color: 'var(--color-text-primary)' }}
      >
        チャームをえらぼう
      </h3>

      <div
        className="grid grid-cols-4 gap-4"
        style={{
          maxWidth: '320px',
          margin: '0 auto',
        }}
      >
        {CHARM_LIST.map((charm) => {
          const isOwned = ownedCharmIds.includes(charm.id)
          const isSelected = selectedCharmId === charm.id
          const isHovered = hoveredId === charm.id

          return (
            <button
              key={charm.id}
              onClick={() => isOwned && onSelect?.(charm.id)}
              onMouseEnter={() => setHoveredId(charm.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={!isOwned}
              className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: isSelected
                  ? 'var(--color-primary)'
                  : isHovered && isOwned
                    ? 'var(--color-accent)'
                    : 'var(--color-surface)',
                opacity: isOwned ? 1 : 0.4,
                transform: isSelected || isHovered ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isSelected
                  ? '0 4px 12px rgba(107, 63, 160, 0.3)'
                  : 'var(--shadow-card)',
                cursor: isOwned ? 'pointer' : 'not-allowed',
              }}
            >
              <span className="text-3xl">{charm.emoji}</span>
              <span
                className="text-xs"
                style={{
                  color: isSelected ? 'white' : 'var(--color-text-secondary)',
                }}
              >
                {charm.name}
              </span>
              {!isOwned && (
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  🔒
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* プレビュー */}
      {selectedCharmId && (
        <div className="mt-6 flex flex-col items-center">
          <p
            className="text-sm mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            プレビュー
          </p>
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'var(--color-background)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <Charm charmId={selectedCharmId} size="lg" />
          </div>
        </div>
      )}
    </div>
  )
}
