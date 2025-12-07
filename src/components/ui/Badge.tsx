'use client'

import { ReactNode } from 'react'

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  primary: { bg: 'var(--color-primary)', text: '#FFFFFF' },
  secondary: { bg: 'var(--color-secondary)', text: '#FFFFFF' },
  success: { bg: 'var(--color-success)', text: '#FFFFFF' },
  warning: { bg: 'var(--color-warning)', text: '#333' },
  error: { bg: 'var(--color-error)', text: '#FFFFFF' },
  accent: { bg: 'var(--color-accent)', text: 'var(--color-text-primary)' },
}

const sizeStyles: Record<BadgeSize, { padding: string; fontSize: string }> = {
  sm: { padding: '2px 8px', fontSize: '10px' },
  md: { padding: '4px 12px', fontSize: '12px' },
  lg: { padding: '6px 16px', fontSize: '14px' },
}

export function Badge({ children, variant = 'primary', size = 'md' }: BadgeProps) {
  const { bg, text } = variantStyles[variant]
  const { padding, fontSize } = sizeStyles[size]

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding,
        fontSize,
        fontWeight: 'bold',
        backgroundColor: bg,
        color: text,
        borderRadius: '9999px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

// 通知バッジ（数字付き）
interface NotificationBadgeProps {
  count: number
  maxCount?: number
  children: ReactNode
  showZero?: boolean
}

export function NotificationBadge({
  count,
  maxCount = 99,
  children,
  showZero = false,
}: NotificationBadgeProps) {
  const displayCount = count > maxCount ? `${maxCount}+` : count
  const shouldShow = showZero || count > 0

  return (
    <div className="relative inline-flex">
      {children}
      {shouldShow && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center"
          style={{
            minWidth: '20px',
            height: '20px',
            padding: '0 6px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: 'var(--color-error)',
            color: '#FFFFFF',
            borderRadius: '9999px',
            border: '2px solid var(--color-surface)',
          }}
        >
          {displayCount}
        </span>
      )}
    </div>
  )
}

// ステータスドット
interface StatusDotProps {
  status: 'online' | 'offline' | 'busy' | 'away'
  size?: 'sm' | 'md' | 'lg'
}

const statusColors: Record<StatusDotProps['status'], string> = {
  online: 'var(--color-success)',
  offline: '#999',
  busy: 'var(--color-error)',
  away: 'var(--color-warning)',
}

const dotSizes: Record<'sm' | 'md' | 'lg', string> = {
  sm: '8px',
  md: '12px',
  lg: '16px',
}

export function StatusDot({ status, size = 'md' }: StatusDotProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: dotSizes[size],
        height: dotSizes[size],
        borderRadius: '50%',
        backgroundColor: statusColors[status],
        boxShadow: status === 'online' ? '0 0 6px var(--color-success)' : 'none',
      }}
    />
  )
}

// レア度バッジ（星）
interface RarityBadgeProps {
  rarity: number // 1-5
  size?: 'sm' | 'md' | 'lg'
}

const raritySizes: Record<'sm' | 'md' | 'lg', string> = {
  sm: '10px',
  md: '14px',
  lg: '18px',
}

export function RarityBadge({ rarity, size = 'md' }: RarityBadgeProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          style={{
            fontSize: raritySizes[size],
            color: i < rarity ? '#FFD700' : 'rgba(0,0,0,0.2)',
            textShadow: i < rarity ? '0 0 4px rgba(255, 215, 0, 0.5)' : 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}
