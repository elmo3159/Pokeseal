'use client'

import React from 'react'
import { UPGRADE_RANKS, RANK_NAMES, type UpgradeRank } from '@/constants/upgradeRanks'

// ランク別達成数
export interface RankCounts {
  silver: number
  gold: number
  prism: number
  total: number // 全シール種類数（母数）
}

interface RankProgressCardProps {
  counts: RankCounts
  onClick?: () => void
}

// ランクアイコン（シンプルな星1つ）
const RankIcon: React.FC<{ rank: UpgradeRank }> = ({ rank }) => {
  const getGradientId = () => `rank-star-${rank}`

  const getGradientStops = () => {
    switch (rank) {
      case UPGRADE_RANKS.SILVER:
        return (
          <>
            <stop offset="0%" stopColor="#A8A8A8" />
            <stop offset="50%" stopColor="#E8E8E8" />
            <stop offset="100%" stopColor="#C0C0C0" />
          </>
        )
      case UPGRADE_RANKS.GOLD:
        return (
          <>
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFF8DC" />
            <stop offset="100%" stopColor="#FFA500" />
          </>
        )
      case UPGRADE_RANKS.PRISM:
        return (
          <>
            <stop offset="0%" stopColor="#FF6B6B">
              <animate attributeName="stop-color" values="#FF6B6B;#FFE66D;#4ECDC4;#A78BFA;#FF6B9D;#FF6B6B" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#4ECDC4">
              <animate attributeName="stop-color" values="#4ECDC4;#A78BFA;#FF6B9D;#FF6B6B;#FFE66D;#4ECDC4" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#A78BFA">
              <animate attributeName="stop-color" values="#A78BFA;#FF6B9D;#FF6B6B;#FFE66D;#4ECDC4;#A78BFA" dur="2s" repeatCount="indefinite" />
            </stop>
          </>
        )
      default:
        return (
          <>
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#FFA500" />
          </>
        )
    }
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <defs>
        <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="100%">
          {getGradientStops()}
        </linearGradient>
      </defs>
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={`url(#${getGradientId()})`}
        stroke={rank === UPGRADE_RANKS.PRISM ? 'rgba(255,255,255,0.5)' : 'transparent'}
        strokeWidth="0.5"
      />
    </svg>
  )
}

// ランク別プログレスバー
const RankProgressBar: React.FC<{
  rank: UpgradeRank
  count: number
  total: number
}> = ({ rank, count, total }) => {
  const percentage = total > 0 ? Math.min((count / total) * 100, 100) : 0

  // ランクごとのグラデーションカラー
  const getGradient = () => {
    switch (rank) {
      case UPGRADE_RANKS.SILVER:
        return 'linear-gradient(90deg, #C0C0C0, #E8E8E8)'
      case UPGRADE_RANKS.GOLD:
        return 'linear-gradient(90deg, #FFD700, #FFF4A3)'
      case UPGRADE_RANKS.PRISM:
        return 'linear-gradient(90deg, #FF6B6B, #FFE66D, #4ECDC4, #A78BFA, #FF6B9D)'
      default:
        return 'linear-gradient(90deg, #E0E0E0, #F0F0F0)'
    }
  }

  const getBorderColor = () => {
    switch (rank) {
      case UPGRADE_RANKS.SILVER:
        return '#A0A0A0'
      case UPGRADE_RANKS.GOLD:
        return '#DAA520'
      case UPGRADE_RANKS.PRISM:
        return '#A78BFA'
      default:
        return '#D0D0D0'
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      {/* ランク星アイコン */}
      <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
        <RankIcon rank={rank} />
      </div>

      {/* プログレスバー */}
      <div
        style={{
          flex: 1,
          height: '18px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '9px',
          border: `2px solid ${getBorderColor()}`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* 進捗バー */}
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: getGradient(),
            borderRadius: '7px',
            transition: 'width 0.5s ease-out',
          }}
        />

        {/* パーセント表示（バー中央） */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: percentage > 50 ? '#4A2068' : '#7A5090',
              textShadow: percentage > 50 ? '0 0 2px rgba(255,255,255,0.8)' : 'none',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            {count}/{total}
          </span>
        </div>
      </div>

      {/* ランク名 */}
      <div style={{ width: '50px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: getBorderColor(),
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          {RANK_NAMES[rank]}
        </span>
      </div>
    </div>
  )
}

// メインの進捗カードコンポーネント
export const RankProgressCard: React.FC<RankProgressCardProps> = ({
  counts,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        border: '2px solid #E9D5FF',
        boxShadow: '0 4px 12px rgba(167, 139, 250, 0.2)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        textAlign: 'left',
      }}
    >
      {/* タイトル */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
        }}
      >
        {/* ダイヤアイコン（SVG） */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 9L12 22L22 9L12 2Z"
            fill="url(#diamondGradient)"
            stroke="#A78BFA"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M2 9H22M12 2L7 9L12 22L17 9L12 2Z"
            stroke="#A78BFA"
            strokeWidth="1"
            strokeLinejoin="round"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="diamondGradient" x1="2" y1="2" x2="22" y2="22">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
        </svg>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#4A2068',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          ランクアップ進捗
        </span>
      </div>

      {/* プログレスバー群 */}
      <div>
        <RankProgressBar
          rank={UPGRADE_RANKS.SILVER}
          count={counts.silver}
          total={counts.total}
        />
        <RankProgressBar
          rank={UPGRADE_RANKS.GOLD}
          count={counts.gold}
          total={counts.total}
        />
        <RankProgressBar
          rank={UPGRADE_RANKS.PRISM}
          count={counts.prism}
          total={counts.total}
        />
      </div>

      {/* プリズム達成時のメッセージ */}
      {counts.prism > 0 && (
        <div
          style={{
            marginTop: '8px',
            padding: '6px 12px',
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1), rgba(167, 139, 250, 0.1))',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: '#7C3AED',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            プリズムランク {counts.prism}種 達成！
          </span>
        </div>
      )}
    </button>
  )
}

export default RankProgressCard
