'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { UPGRADE_RANKS, STAR_BONUS, type UpgradeRank } from '@/constants/upgradeRanks'

interface RankStarsProps {
  baseRarity: number // 元のレアリティ（1-5）
  upgradeRank: UpgradeRank
  size?: 'sm' | 'md' | 'lg'
  showAnimation?: boolean
}

// ユニークIDを生成するカウンター
let starIdCounter = 0

/**
 * ランクに応じた星を表示するコンポーネント
 * 絵文字を使わず、SVGで星を描画
 * 星が6個以上の場合は2行で表示（各行最大5個）
 */
export const RankStars: React.FC<RankStarsProps> = ({
  baseRarity,
  upgradeRank,
  size = 'md',
  showAnimation = true,
}) => {
  const starBonus = STAR_BONUS[upgradeRank]
  const totalStars = Math.min(baseRarity + starBonus, 10) // 最大10個

  const sizeMap = {
    sm: 8,
    md: 12,
    lg: 16,
  }
  const starSize = sizeMap[size]
  const gap = size === 'sm' ? 0 : 1

  // 1行目と2行目の星を分割
  const firstRowStars = Math.min(totalStars, 5)
  const secondRowStars = Math.max(totalStars - 5, 0)

  // SVG星のパス
  const StarSVG = ({ index, uniqueId }: { index: number; uniqueId: string }) => (
    <motion.div
      initial={showAnimation ? { scale: 0, rotate: -180 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        delay: index * 0.03,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      style={{
        width: starSize,
        height: starSize,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={starSize}
        height={starSize}
        style={{
          filter: upgradeRank === UPGRADE_RANKS.PRISM
            ? 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))'
            : upgradeRank === UPGRADE_RANKS.GOLD
            ? 'drop-shadow(0 0 1px rgba(255, 215, 0, 0.6))'
            : upgradeRank === UPGRADE_RANKS.SILVER
            ? 'drop-shadow(0 0 1px rgba(192, 192, 192, 0.6))'
            : 'drop-shadow(0 0 1px rgba(255, 215, 0, 0.4))',
        }}
      >
        <defs>
          <linearGradient id={`star-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {upgradeRank === UPGRADE_RANKS.SILVER && (
              <>
                <stop offset="0%" stopColor="#A8A8A8" />
                <stop offset="50%" stopColor="#E8E8E8" />
                <stop offset="100%" stopColor="#C0C0C0" />
              </>
            )}
            {upgradeRank === UPGRADE_RANKS.GOLD && (
              <>
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFF8DC" />
                <stop offset="100%" stopColor="#FFA500" />
              </>
            )}
            {upgradeRank === UPGRADE_RANKS.PRISM && (
              <>
                <stop offset="0%" stopColor="#ff0000">
                  <animate attributeName="stop-color" values="#ff0000;#ff7f00;#ffff00;#00ff00;#0000ff;#4b0082;#9400d3;#ff0000" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="#00ff00">
                  <animate attributeName="stop-color" values="#00ff00;#0000ff;#4b0082;#9400d3;#ff0000;#ff7f00;#ffff00;#00ff00" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#9400d3">
                  <animate attributeName="stop-color" values="#9400d3;#ff0000;#ff7f00;#ffff00;#00ff00;#0000ff;#4b0082;#9400d3" dur="2s" repeatCount="indefinite" />
                </stop>
              </>
            )}
            {upgradeRank === UPGRADE_RANKS.NORMAL && (
              <>
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFF8DC" />
                <stop offset="100%" stopColor="#FFD700" />
              </>
            )}
          </linearGradient>
        </defs>
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill={`url(#star-grad-${uniqueId})`}
          stroke={upgradeRank === UPGRADE_RANKS.PRISM ? 'rgba(255,255,255,0.5)' : 'transparent'}
          strokeWidth="0.5"
        />
      </svg>
    </motion.div>
  )

  // 各レンダリングでユニークなIDを生成
  const instanceId = React.useMemo(() => ++starIdCounter, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}
    >
      {/* 1行目: 星1-5 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: gap,
        }}
      >
        {Array.from({ length: firstRowStars }).map((_, i) => (
          <StarSVG key={i} index={i} uniqueId={`${instanceId}-${i}`} />
        ))}
      </div>

      {/* 2行目: 星6-10（6個以上の場合のみ表示） */}
      {secondRowStars > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: gap,
            marginTop: size === 'sm' ? 0 : 1,
          }}
        >
          {Array.from({ length: secondRowStars }).map((_, i) => (
            <StarSVG key={i + 5} index={i + 5} uniqueId={`${instanceId}-${i + 5}`} />
          ))}
        </div>
      )}
    </div>
  )
}

export default RankStars
