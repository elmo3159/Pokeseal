'use client'

import React, { useEffect, useState, useRef } from 'react'
import { playSoundIfEnabled, injectAnimationStyles } from '@/utils'

interface PeelEffectProps {
  /** エフェクトを表示するかどうか */
  isActive: boolean
  /** シールの画像URL */
  stickerImageUrl?: string
  /** エフェクト表示位置（画面座標） */
  position: { x: number; y: number }
  /** シールサイズ */
  size?: number
  /** エフェクト完了時のコールバック */
  onComplete?: () => void
}

/**
 * シールを剥がす時のペリペリエフェクト
 * - 「ペリッ」という音
 * - シールがめくれるアニメーション
 * - 「ペリッ♪」テキスト表示
 */
export function PeelEffect({
  isActive,
  stickerImageUrl,
  position,
  size = 80,
  onComplete,
}: PeelEffectProps) {
  const [showEffect, setShowEffect] = useState(false)
  const [showText, setShowText] = useState(false)
  const hasPlayedRef = useRef(false)

  // アニメーションCSSを注入
  useEffect(() => {
    injectAnimationStyles()
  }, [])

  // onCompleteのrefを保持（依存配列から除外してタイマーが意図せずクリアされることを防ぐ）
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // エフェクトを発動
  useEffect(() => {
    if (isActive && !hasPlayedRef.current) {
      hasPlayedRef.current = true
      setShowEffect(true)
      setShowText(true)

      // 効果音を再生
      playSoundIfEnabled('peel', 0.4)

      // エフェクト終了
      const timer = setTimeout(() => {
        setShowEffect(false)
        setShowText(false)
        hasPlayedRef.current = false
        onCompleteRef.current?.()
      }, 600)

      return () => clearTimeout(timer)
    } else if (!isActive) {
      hasPlayedRef.current = false
    }
  }, [isActive])

  if (!showEffect) return null

  return (
    <>
      {/* シール剥がしアニメーション */}
      <div
        className="fixed pointer-events-none z-[100]"
        style={{
          left: position.x - size / 2,
          top: position.y - size / 2,
          width: size,
          height: size,
        }}
      >
        {stickerImageUrl && (
          <img
            src={stickerImageUrl}
            alt=""
            className="w-full h-full object-contain animate-peel"
            draggable={false}
          />
        )}
      </div>

      {/* 「ペリッ♪」テキスト */}
      {showText && (
        <div
          className="fixed pointer-events-none z-[101] animate-peel-text"
          style={{
            left: position.x,
            top: position.y - size / 2 - 10,
            transform: 'translateX(-50%)',
          }}
        >
          <span
            className="px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              color: '#92400E',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            ペリッ♪
          </span>
        </div>
      )}
    </>
  )
}

/**
 * シールを貼る時のペタッエフェクト
 */
interface PlaceEffectProps {
  isActive: boolean
  position: { x: number; y: number }
  size?: number
  onComplete?: () => void
}

export function PlaceEffect({
  isActive,
  position,
  size = 80,
  onComplete,
}: PlaceEffectProps) {
  const [showEffect, setShowEffect] = useState(false)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    injectAnimationStyles()
  }, [])

  useEffect(() => {
    if (isActive && !hasPlayedRef.current) {
      hasPlayedRef.current = true
      setShowEffect(true)

      // 効果音
      playSoundIfEnabled('place', 0.3)

      const timer = setTimeout(() => {
        setShowEffect(false)
        hasPlayedRef.current = false
        onComplete?.()
      }, 400)

      return () => clearTimeout(timer)
    } else if (!isActive) {
      hasPlayedRef.current = false
    }
  }, [isActive, onComplete])

  if (!showEffect) return null

  return (
    <div
      className="fixed pointer-events-none z-[101] animate-peel-text"
      style={{
        left: position.x,
        top: position.y - size / 2 - 10,
        transform: 'translateX(-50%)',
      }}
    >
      <span
        className="px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap"
        style={{
          background: 'linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 100%)',
          color: '#065F46',
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        ペタッ♪
      </span>
    </div>
  )
}

/**
 * シール剥がし回数のトラッキング（粘着力演出用）
 */
interface StickerUsageStats {
  [stickerId: string]: number // シールIDごとの剥がし回数
}

let stickerUsageStats: StickerUsageStats = {}

export function trackPeel(stickerId: string): number {
  if (!stickerUsageStats[stickerId]) {
    stickerUsageStats[stickerId] = 0
  }
  stickerUsageStats[stickerId]++
  return stickerUsageStats[stickerId]
}

export function getPeelCount(stickerId: string): number {
  return stickerUsageStats[stickerId] || 0
}

// 粘着力メッセージ（何度も剥がすと表示される小ネタ）
export function getStickinessMessage(peelCount: number): string | null {
  if (peelCount === 5) {
    return 'このシール、よく動かすね！'
  }
  if (peelCount === 10) {
    return 'そろそろ粘着力が…（うそだよ！）'
  }
  if (peelCount === 20) {
    return 'まだまだ元気なシールだよ✨'
  }
  if (peelCount >= 30 && peelCount % 10 === 0) {
    return 'ベテランシール！💪'
  }
  return null
}

export default PeelEffect
