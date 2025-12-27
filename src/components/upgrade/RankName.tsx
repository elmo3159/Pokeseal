'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { UPGRADE_RANKS, RANK_MARK_COUNT, type UpgradeRank } from '@/constants/upgradeRanks'

interface RankNameProps {
  name: string
  upgradeRank: UpgradeRank
  size?: 'sm' | 'md' | 'lg'
  showAnimation?: boolean
}

/**
 * ランクに応じた装飾付き名前を表示するコンポーネント
 * 絵文字を使わず、CSSで装飾
 */
export const RankName: React.FC<RankNameProps> = ({
  name,
  upgradeRank,
  size = 'md',
  showAnimation = true,
}) => {
  const markCount = RANK_MARK_COUNT[upgradeRank]

  const sizeMap = {
    sm: { fontSize: 10, markSize: 8 },
    md: { fontSize: 12, markSize: 10 },
    lg: { fontSize: 14, markSize: 12 },
  }
  const { fontSize, markSize } = sizeMap[size]

  // ランクに応じたスタイル
  const getNameStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      fontSize: fontSize,
      fontWeight: 'bold',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }

    switch (upgradeRank) {
      case UPGRADE_RANKS.SILVER:
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #8B8B8B 0%, #C0C0C0 30%, #E8E8E8 50%, #C0C0C0 70%, #8B8B8B 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }
      case UPGRADE_RANKS.GOLD:
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #B8860B 0%, #FFD700 30%, #FFF8DC 50%, #FFD700 70%, #B8860B 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }
      case UPGRADE_RANKS.PRISM:
        return {
          ...baseStyle,
          background: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: showAnimation ? 'rainbow-text 3s linear infinite' : undefined,
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }
      default:
        return {
          ...baseStyle,
          color: '#8B5A3C',
        }
    }
  }

  // マーク（◆）のスタイル
  const getMarkStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'inline-block',
      width: markSize,
      height: markSize,
      marginRight: 2,
    }

    switch (upgradeRank) {
      case UPGRADE_RANKS.SILVER:
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #A8A8A8 0%, #E8E8E8 50%, #C0C0C0 100%)',
          transform: 'rotate(45deg)',
          boxShadow: '0 0 4px rgba(192,192,192,0.6)',
        }
      case UPGRADE_RANKS.GOLD:
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #FFD700 0%, #FFF8DC 50%, #FFA500 100%)',
          transform: 'rotate(45deg)',
          boxShadow: '0 0 6px rgba(255,215,0,0.7)',
        }
      case UPGRADE_RANKS.PRISM:
        return {
          ...baseStyle,
          background: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
          backgroundSize: '200% 100%',
          transform: 'rotate(45deg)',
          animation: showAnimation ? 'rainbow-mark 2s linear infinite' : undefined,
          boxShadow: '0 0 8px rgba(255,0,255,0.8)',
        }
      default:
        return baseStyle
    }
  }

  // ダイヤモンド形のマークをSVGで描画
  const DiamondMark = ({ index }: { index: number }) => (
    <motion.span
      initial={showAnimation ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: index * 0.1,
        type: 'spring',
        stiffness: 300,
      }}
      style={getMarkStyle()}
    />
  )

  return (
    <>
      <style jsx global>{`
        @keyframes rainbow-text {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes rainbow-mark {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* マークを表示 */}
        {markCount > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', marginRight: 4 }}>
            {Array.from({ length: markCount }).map((_, i) => (
              <DiamondMark key={i} index={i} />
            ))}
          </span>
        )}
        {/* 名前 */}
        <motion.span
          initial={showAnimation ? { opacity: 0, y: 5 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: markCount * 0.1 + 0.1 }}
          style={getNameStyle()}
        >
          {name}
        </motion.span>
      </div>
    </>
  )
}

export default RankName
