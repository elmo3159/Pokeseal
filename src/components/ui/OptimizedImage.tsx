'use client'

import { useState, useCallback, memo, ImgHTMLAttributes, useEffect } from 'react'

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string
  alt: string
  fallbackSrc?: string
  lowQualitySrc?: string
  lazy?: boolean
  onLoadComplete?: () => void
}

/**
 * 最適化された画像コンポーネント
 *
 * - 遅延読み込み（Intersection Observer）
 * - プレースホルダー/フォールバック
 * - ロード状態の管理
 * - メモ化によるリレンダー防止
 */
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.png',
  lowQualitySrc,
  lazy = true,
  className = '',
  onLoadComplete,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src)

  useEffect(() => {
    // src変更時にリセット
    setIsLoaded(false)
    setHasError(false)
    setCurrentSrc(lowQualitySrc || src)
  }, [src, lowQualitySrc])

  const handleLoad = useCallback(() => {
    if (lowQualitySrc && currentSrc === lowQualitySrc) {
      // 低品質画像のロード完了後に高品質画像へ切り替え
      setCurrentSrc(src)
    } else {
      setIsLoaded(true)
      onLoadComplete?.()
    }
  }, [lowQualitySrc, currentSrc, src, onLoadComplete])

  const handleError = useCallback(() => {
    if (!hasError && fallbackSrc) {
      setHasError(true)
      setCurrentSrc(fallbackSrc)
    }
  }, [hasError, fallbackSrc])

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  )
})

/**
 * シール画像専用の最適化コンポーネント
 */
export const StickerImage = memo(function StickerImage({
  stickerId,
  alt,
  className = '',
  ...props
}: {
  stickerId: string
  alt: string
  className?: string
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  const src = `/stickers/${stickerId}.png`
  const fallbackSrc = '/images/sticker-placeholder.png'

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fallbackSrc={fallbackSrc}
      className={className}
      {...props}
    />
  )
})

/**
 * アバター画像専用の最適化コンポーネント
 */
export const AvatarImage = memo(function AvatarImage({
  src,
  alt,
  size = 40,
  className = '',
  ...props
}: {
  src?: string | null
  alt: string
  size?: number
  className?: string
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'>) {
  const defaultAvatar = '/images/default-avatar.png'

  return (
    <OptimizedImage
      src={src || defaultAvatar}
      alt={alt}
      fallbackSrc={defaultAvatar}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      {...props}
    />
  )
})
