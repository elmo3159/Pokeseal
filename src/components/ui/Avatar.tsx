'use client'

import { StatusDot } from './Badge'
import {
  CHARACTER_THEME_COLORS,
  CHARACTER_ID_MAP,
  FRAME_METADATA,
  getFrameImagePath,
  type CharacterName,
  type FrameMetadata,
} from '@/constants/characterRewards'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string | null
  alt?: string
  size?: AvatarSize
  fallback?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  badge?: string // 絵文字バッジ
  frameId?: string | null       // フレームID (frame_characterId形式)
  frameImageUrl?: string | null // フレーム画像URL（直接指定）
}

// フレーム有無でサイズ調整（フレームは約130%のサイズ）
const sizeMap: Record<AvatarSize, {
  size: number
  fontSize: string
  statusSize: 'sm' | 'md' | 'lg'
  frameSize: number
  frameBorderWidth: number
}> = {
  xs: { size: 32, fontSize: '14px', statusSize: 'sm', frameSize: 42, frameBorderWidth: 3 },
  sm: { size: 40, fontSize: '16px', statusSize: 'sm', frameSize: 52, frameBorderWidth: 4 },
  md: { size: 56, fontSize: '24px', statusSize: 'md', frameSize: 72, frameBorderWidth: 5 },
  lg: { size: 80, fontSize: '32px', statusSize: 'md', frameSize: 104, frameBorderWidth: 6 },
  xl: { size: 120, fontSize: '48px', statusSize: 'lg', frameSize: 156, frameBorderWidth: 8 },
}

// フレームIDからキャラクター名を抽出
function getCharacterNameFromFrameId(frameId: string): CharacterName | null {
  // frame_characterId 形式からcharacterIdを抽出
  const match = frameId.match(/^frame_(.+)$/)
  if (!match) return null

  const characterId = match[1]
  // キャラクターIDからキャラクター名を逆引き（CHARACTER_ID_MAPを使用）
  for (const [name, id] of Object.entries(CHARACTER_ID_MAP)) {
    if (id === characterId) {
      return name as CharacterName
    }
  }
  return null
}

// プレースホルダーフレームのSVGを生成
function generatePlaceholderFrame(
  characterName: CharacterName | null,
  frameSize: number,
  borderWidth: number
): string {
  const colors = characterName
    ? CHARACTER_THEME_COLORS[characterName]
    : { primary: '#A78BFA', secondary: '#E9D5FF', accent: '#8B5CF6' }

  // グラデーション円形フレームのSVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${frameSize}" height="${frameSize}" viewBox="0 0 ${frameSize} ${frameSize}">
      <defs>
        <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.accent};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="${frameSize / 2}"
        cy="${frameSize / 2}"
        r="${frameSize / 2 - borderWidth / 2}"
        fill="none"
        stroke="url(#frameGrad)"
        stroke-width="${borderWidth}"
        filter="url(#glow)"
      />
    </svg>
  `
  return `data:image/svg+xml,${encodeURIComponent(svg.trim())}`
}

export function Avatar({
  src,
  alt = 'ユーザー',
  size = 'md',
  fallback,
  status,
  badge,
  frameId,
  frameImageUrl,
}: AvatarProps) {
  const config = sizeMap[size]

  // フォールバック文字（名前の最初の文字など）
  const fallbackText = fallback || alt.charAt(0) || '?'

  // フレームの有無を判定
  const hasFrame = !!(frameId || frameImageUrl)

  // フレームIDからキャラクター名を取得
  const characterName = frameId ? getCharacterNameFromFrameId(frameId) : null

  // 実際のフレーム画像があるかチェック（メタデータが存在する場合）
  const frameMetadata: FrameMetadata | null = characterName ? (FRAME_METADATA[characterName] || null) : null
  const hasRealFrameImage = !!frameMetadata

  // フレーム画像URLを決定
  // 1. frameImageUrl が直接指定されている場合はそれを使用
  // 2. frameId があり、メタデータが存在する場合は実際のフレーム画像を使用
  // 3. frameId があるがメタデータがない場合はプレースホルダーを生成
  const frameUrl = frameImageUrl
    ? frameImageUrl
    : (frameId && characterName)
      ? (hasRealFrameImage
          ? getFrameImagePath(characterName)
          : generatePlaceholderFrame(
              characterName,
              config.frameSize,
              config.frameBorderWidth
            ))
      : null

  // コンテナサイズとアバター位置の計算
  let containerWidth = hasFrame ? config.frameSize : config.size
  let containerHeight = hasFrame ? config.frameSize : config.size
  let avatarSize = config.size
  let avatarOffsetX = 0
  let avatarOffsetY = 0

  // プレースホルダーフレーム使用時は、アバターを少し小さくしてフレーム内に収める
  if (hasFrame && !hasRealFrameImage) {
    // プレースホルダーフレームの場合、アバターサイズをフレームに合わせて調整
    avatarSize = config.frameSize - config.frameBorderWidth * 2 - 4
  }

  if (hasFrame && hasRealFrameImage && frameMetadata) {
    // 実際のフレーム画像がある場合：メタデータに基づいて位置を計算
    // 表示サイズはconfig.frameSizeを基準にスケール
    const scale = config.frameSize / Math.max(frameMetadata.frameWidth, frameMetadata.frameHeight)

    // コンテナサイズをフレームのアスペクト比に合わせる
    containerWidth = frameMetadata.frameWidth * scale
    containerHeight = frameMetadata.frameHeight * scale

    // アバターサイズをメタデータの直径に基づいてスケール
    avatarSize = frameMetadata.iconDiameter * scale

    // アバターの中心位置をスケール
    const scaledCenterX = frameMetadata.iconCenterX * scale
    const scaledCenterY = frameMetadata.iconCenterY * scale

    // オフセット = 中心位置 - コンテナ中央
    avatarOffsetX = scaledCenterX - containerWidth / 2
    avatarOffsetY = scaledCenterY - containerHeight / 2

    // フレームごとの微調整（描画後のpx）
    if (typeof frameMetadata.iconOffsetX === 'number') {
      avatarOffsetX += frameMetadata.iconOffsetX
    }
    if (typeof frameMetadata.iconOffsetY === 'number') {
      avatarOffsetY += frameMetadata.iconOffsetY
    }
  }

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{
        width: containerWidth,
        height: containerHeight,
      }}
    >
      {/* フレーム（ある場合）- アイコンより手前に表示 */}
      {hasFrame && frameUrl && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            width: containerWidth,
            height: containerHeight,
            zIndex: 2,
          }}
        >
          <img
            src={frameUrl}
            alt="フレーム"
            className="w-full h-full"
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}

      {/* アバター本体 */}
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          position: hasFrame ? 'absolute' : 'relative',
          left: hasFrame ? (hasRealFrameImage ? `calc(50% + ${avatarOffsetX}px)` : '50%') : undefined,
          top: hasFrame ? (hasRealFrameImage ? `calc(50% + ${avatarOffsetY}px)` : '50%') : undefined,
          transform: hasFrame ? 'translate(-50%, -50%)' : undefined,
          width: avatarSize,
          height: avatarSize,
          borderRadius: '50%',
          backgroundColor: '#f9a8d4',
          boxShadow: hasFrame ? 'none' : 'var(--shadow-card)',
          zIndex: 1,
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
              fontSize: `${avatarSize * 0.4}px`,
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
        <div
          className="absolute"
          style={{
            bottom: hasFrame ? 0 : 0,
            right: hasFrame ? 0 : 0,
            zIndex: 10,
          }}
        >
          <StatusDot status={status} size={config.statusSize} />
        </div>
      )}

      {/* 絵文字バッジ */}
      {badge && (
        <span
          className="absolute flex items-center justify-center"
          style={{
            bottom: -4,
            right: -4,
            width: avatarSize * 0.4 + 'px',
            height: avatarSize * 0.4 + 'px',
            fontSize: avatarSize * 0.25 + 'px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: '50%',
            boxShadow: 'var(--shadow-card)',
            zIndex: 10,
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
  const overlapOffset = config.size * 0.3

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
