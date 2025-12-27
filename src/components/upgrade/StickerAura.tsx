'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { UPGRADE_RANKS, type UpgradeRank } from '@/constants/upgradeRanks'

interface StickerAuraProps {
  upgradeRank: UpgradeRank
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * シールの形に沿って漂うオーラエフェクト
 * CSS filter: drop-shadowを使用してシール形状を保持
 */
export const StickerAura: React.FC<StickerAuraProps> = ({
  upgradeRank,
  children,
  className,
  style,
}) => {
  // ノーマルはエフェクトなし
  if (upgradeRank === UPGRADE_RANKS.NORMAL) {
    return (
      <div className={className} style={{ ...style, width: '100%', height: '100%' }}>
        {children}
      </div>
    )
  }

  // プリズムのキラキラ生成
  const sparkles = useMemo(() => {
    if (upgradeRank !== UPGRADE_RANKS.PRISM) return []
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
      delay: Math.random() * 2,
      duration: 0.8 + Math.random() * 0.8,
      size: 8 + Math.random() * 8,
      color: ['#FF6B9D', '#C084FC', '#60A5FA', '#34D399', '#FBBF24', '#F87171'][Math.floor(Math.random() * 6)],
    }))
  }, [upgradeRank])

  // アニメーション変形
  const getAnimationVariants = () => {
    switch (upgradeRank) {
      case UPGRADE_RANKS.SILVER:
        return {
          animate: {
            filter: [
              'drop-shadow(0 0 2px rgba(100, 180, 255, 0.6)) drop-shadow(0 0 4px rgba(80, 160, 240, 0.4))',
              'drop-shadow(0 0 3px rgba(100, 180, 255, 1.0)) drop-shadow(0 0 6px rgba(80, 160, 240, 0.8))',
              'drop-shadow(0 0 2px rgba(100, 180, 255, 0.6)) drop-shadow(0 0 4px rgba(80, 160, 240, 0.4))',
            ],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        }
      case UPGRADE_RANKS.GOLD:
        return {
          animate: {
            filter: [
              'drop-shadow(0 0 2px rgba(255, 200, 0, 0.5)) drop-shadow(0 0 4px rgba(255, 160, 0, 0.3))',
              'drop-shadow(0 0 4px rgba(255, 200, 0, 0.9)) drop-shadow(0 0 8px rgba(255, 160, 0, 0.6))',
              'drop-shadow(0 0 2px rgba(255, 200, 0, 0.5)) drop-shadow(0 0 4px rgba(255, 160, 0, 0.3))',
            ],
          },
          transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        }
      case UPGRADE_RANKS.PRISM:
        // 常に虹色全6色を表示（赤・橙・黄・緑・青・紫）
        // どのタイミングでキャプチャしても虹色とわかるように
        return {
          animate: {
            filter: [
              // 色の位置（blur半径）を回転させて動きを出す - 範囲を狭めて引き締まったオーラに
              'drop-shadow(0 0 1px rgba(255, 50, 100, 0.9)) drop-shadow(0 0 2px rgba(255, 165, 0, 0.85)) drop-shadow(0 0 3px rgba(255, 255, 0, 0.8)) drop-shadow(0 0 4px rgba(50, 255, 100, 0.8)) drop-shadow(0 0 5px rgba(50, 150, 255, 0.85)) drop-shadow(0 0 6px rgba(180, 50, 255, 0.9))',
              // 色の位置をシフト（回転効果）
              'drop-shadow(0 0 1px rgba(255, 165, 0, 0.9)) drop-shadow(0 0 2px rgba(255, 255, 0, 0.85)) drop-shadow(0 0 3px rgba(50, 255, 100, 0.8)) drop-shadow(0 0 4px rgba(50, 150, 255, 0.8)) drop-shadow(0 0 5px rgba(180, 50, 255, 0.85)) drop-shadow(0 0 6px rgba(255, 50, 100, 0.9))',
              // さらにシフト
              'drop-shadow(0 0 1px rgba(255, 255, 0, 0.9)) drop-shadow(0 0 2px rgba(50, 255, 100, 0.85)) drop-shadow(0 0 3px rgba(50, 150, 255, 0.8)) drop-shadow(0 0 4px rgba(180, 50, 255, 0.8)) drop-shadow(0 0 5px rgba(255, 50, 100, 0.85)) drop-shadow(0 0 6px rgba(255, 165, 0, 0.9))',
              // さらにシフト
              'drop-shadow(0 0 1px rgba(50, 255, 100, 0.9)) drop-shadow(0 0 2px rgba(50, 150, 255, 0.85)) drop-shadow(0 0 3px rgba(180, 50, 255, 0.8)) drop-shadow(0 0 4px rgba(255, 50, 100, 0.8)) drop-shadow(0 0 5px rgba(255, 165, 0, 0.85)) drop-shadow(0 0 6px rgba(255, 255, 0, 0.9))',
              // さらにシフト
              'drop-shadow(0 0 1px rgba(50, 150, 255, 0.9)) drop-shadow(0 0 2px rgba(180, 50, 255, 0.85)) drop-shadow(0 0 3px rgba(255, 50, 100, 0.8)) drop-shadow(0 0 4px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 5px rgba(255, 255, 0, 0.85)) drop-shadow(0 0 6px rgba(50, 255, 100, 0.9))',
              // さらにシフト
              'drop-shadow(0 0 1px rgba(180, 50, 255, 0.9)) drop-shadow(0 0 2px rgba(255, 50, 100, 0.85)) drop-shadow(0 0 3px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 4px rgba(255, 255, 0, 0.8)) drop-shadow(0 0 5px rgba(50, 255, 100, 0.85)) drop-shadow(0 0 6px rgba(50, 150, 255, 0.9))',
              // 最初に戻る
              'drop-shadow(0 0 1px rgba(255, 50, 100, 0.9)) drop-shadow(0 0 2px rgba(255, 165, 0, 0.85)) drop-shadow(0 0 3px rgba(255, 255, 0, 0.8)) drop-shadow(0 0 4px rgba(50, 255, 100, 0.8)) drop-shadow(0 0 5px rgba(50, 150, 255, 0.85)) drop-shadow(0 0 6px rgba(180, 50, 255, 0.9))',
            ],
          },
          transition: {
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear' as const,
          },
        }
      default:
        return {}
    }
  }

  const animationProps = getAnimationVariants()

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {/* プリズムの細かいキラキラスパークル */}
      {upgradeRank === UPGRADE_RANKS.PRISM && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
            overflow: 'visible',
          }}
        >
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              style={{
                position: 'absolute',
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: sparkle.duration,
                repeat: Infinity,
                delay: sparkle.delay,
                ease: 'easeInOut',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="100%"
                height="100%"
              >
                <path
                  d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
                  fill={sparkle.color}
                />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* メインコンテンツ（オーラ付き） */}
      <motion.div
        {...animationProps}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default StickerAura
