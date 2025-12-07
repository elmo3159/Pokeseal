'use client'

import { StatusDot } from './Badge'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: AvatarSize
  fallback?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  badge?: string // 絵文字バッジ
}

const sizeMap: Record<AvatarSize, { size: string; fontSize: string; statusSize: 'sm' | 'md' | 'lg' }> = {
  xs: { size: '32px', fontSize: '14px', statusSize: 'sm' },
  sm: { size: '40px', fontSize: '16px', statusSize: 'sm' },
  md: { size: '56px', fontSize: '24px', statusSize: 'md' },
  lg: { size: '80px', fontSize: '32px', statusSize: 'md' },
  xl: { size: '120px', fontSize: '48px', statusSize: 'lg' },
}

export function Avatar({
  src,
  alt = 'ユーザー',
  size = 'md',
  fallback,
  status,
  badge,
}: AvatarProps) {
  const config = sizeMap[size]

  // フォールバック文字（名前の最初の文字など）
  const fallbackText = fallback || alt.charAt(0) || '?'

  return (
    <div className="relative inline-flex">
      {/* アバター本体 */}
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          width: config.size,
          height: config.size,
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // 画像読み込み失敗時はフォールバック表示
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : (
          <span
            style={{
              fontSize: config.fontSize,
              fontWeight: 'bold',
              color: 'var(--color-text-primary)',
            }}
          >
            {fallbackText}
          </span>
        )}
      </div>

      {/* ステータスドット */}
      {status && (
        <div className="absolute bottom-0 right-0">
          <StatusDot status={status} size={config.statusSize} />
        </div>
      )}

      {/* 絵文字バッジ */}
      {badge && (
        <span
          className="absolute -bottom-1 -right-1 flex items-center justify-center"
          style={{
            width: parseInt(config.size) * 0.4 + 'px',
            height: parseInt(config.size) * 0.4 + 'px',
            fontSize: parseInt(config.fontSize) * 0.6 + 'px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: '50%',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {badge}
        </span>
      )}
    </div>
  )
}

// アバターグループ（複数のアバターを重ねて表示）
interface AvatarGroupProps {
  avatars: Array<{ src?: string | null; alt?: string }>
  max?: number
  size?: AvatarSize
}

export function AvatarGroup({ avatars, max = 3, size = 'sm' }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max)
  const remaining = avatars.length - max

  const config = sizeMap[size]
  const overlapOffset = parseInt(config.size) * 0.3

  return (
    <div className="flex items-center">
      {visibleAvatars.map((avatar, index) => (
        <div
          key={index}
          style={{
            marginLeft: index === 0 ? 0 : `-${overlapOffset}px`,
            zIndex: visibleAvatars.length - index,
          }}
        >
          <Avatar src={avatar.src} alt={avatar.alt} size={size} />
        </div>
      ))}

      {remaining > 0 && (
        <div
          className="flex items-center justify-center"
          style={{
            marginLeft: `-${overlapOffset}px`,
            width: config.size,
            height: config.size,
            borderRadius: '50%',
            backgroundColor: 'var(--color-secondary)',
            color: '#FFFFFF',
            fontSize: parseInt(config.fontSize) * 0.7 + 'px',
            fontWeight: 'bold',
            zIndex: 0,
          }}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
