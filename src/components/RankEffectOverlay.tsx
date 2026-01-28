'use client'

import React, { useMemo } from 'react'
import {
  type UpgradeRank,
  UPGRADE_RANKS,
  getRankEffect,
  getRankColor,
  rankNamesKids
} from '@/domain/stickerRank'

interface RankEffectOverlayProps {
  rank: UpgradeRank
  children: React.ReactNode
  showBadge?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// キラキラパーティクル（ランク3用）
const SparkleParticles: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => {
  const particleCount = size === 'sm' ? 4 : size === 'md' ? 6 : 8
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      top: 10 + Math.random() * 80,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 1
    }))
  }, [particleCount])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-sparkle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        >
          <span className="text-yellow-300" style={{ fontSize: size === 'sm' ? '8px' : '12px' }}>
            ✦
          </span>
        </div>
      ))}
    </div>
  )
}

// 虹色ボーダー（ランク4用）
const RainbowBorder: React.FC = () => {
  return (
    <div
      className="absolute inset-0 rounded-xl pointer-events-none animate-rainbow"
      style={{
        background: 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000)',
        backgroundSize: '400% 100%',
        padding: '3px',
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor'
      }}
    />
  )
}

// プリズムオーラ（PRISM用 - 最高ランク）
const PrismAura: React.FC<{ size: 'sm' | 'md' | 'lg' }> = ({ size }) => {
  const scale = size === 'sm' ? 0.8 : size === 'md' ? 1 : 1.2

  return (
    <>
      {/* 外側のグロー */}
      <div
        className="absolute inset-0 rounded-xl animate-pulse"
        style={{
          boxShadow: `0 0 ${20 * scale}px rgba(255, 105, 180, 0.6), 0 0 ${40 * scale}px rgba(138, 43, 226, 0.4), 0 0 ${60 * scale}px rgba(0, 191, 255, 0.3)`,
          transform: 'scale(1.05)'
        }}
      />

      {/* 光の放射 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
        <div
          className="absolute inset-0 animate-radiate opacity-30"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(255, 105, 180, 0.8), transparent, rgba(138, 43, 226, 0.8), transparent)',
            transformOrigin: 'center'
          }}
        />
      </div>

      {/* 虹色ボーダー */}
      <RainbowBorder />

      {/* キラキラ */}
      <SparkleParticles size={size} />

      {/* プリズムマーク */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 animate-bounce" style={{ animationDuration: '2s' }}>
        <span style={{ fontSize: size === 'sm' ? '12px' : '16px' }}>🌈</span>
      </div>
    </>
  )
}

// ランクバッジ
const RankBadge: React.FC<{ rank: UpgradeRank; size: 'sm' | 'md' | 'lg' }> = ({ rank, size }) => {
  const color = getRankColor(rank)
  const badgeSize = size === 'sm' ? 'text-xs px-1.5 py-0.5' : size === 'md' ? 'text-xs px-2 py-0.5' : 'text-sm px-2 py-1'

  return (
    <div
      className={`absolute -top-1 -right-1 rounded-full font-bold z-10 ${badgeSize}`}
      style={{
        backgroundColor: color,
        color: rank >= UPGRADE_RANKS.GOLD ? '#000' : '#fff',
        boxShadow: rank === UPGRADE_RANKS.PRISM ? '0 0 8px rgba(255, 105, 180, 0.8)' : '0 2px 4px rgba(0,0,0,0.2)'
      }}
    >
      {rankNamesKids[rank]}
    </div>
  )
}

export const RankEffectOverlay: React.FC<RankEffectOverlayProps> = ({
  rank,
  children,
  showBadge = true,
  size = 'md'
}) => {
  const effect = getRankEffect(rank)

  return (
    <div className="relative">
      {/* ベースのコンテンツ */}
      <div className="relative z-0">
        {children}
      </div>

      {/* SILVER (1): グローエフェクト */}
      {effect === 'glow' && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `0 0 10px ${getRankColor(rank)}40, inset 0 0 10px ${getRankColor(rank)}20`,
            border: `2px solid ${getRankColor(rank)}60`
          }}
        />
      )}

      {/* GOLD (2): キラキラパーティクル + 虹ボーダー */}
      {effect === 'sparkle' && (
        <>
          <RainbowBorder />
          <SparkleParticles size={size} />
        </>
      )}

      {/* PRISM (3): プリズムオーラ（最高ランク） */}
      {effect === 'prism' && <PrismAura size={size} />}

      {/* ランクバッジ（NORMAL以外で表示） */}
      {showBadge && rank > UPGRADE_RANKS.NORMAL && <RankBadge rank={rank} size={size} />}
    </div>
  )
}

export default RankEffectOverlay
