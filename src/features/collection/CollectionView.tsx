'use client'

import React, { useState, useMemo, memo } from 'react'
import { RankEffectOverlay, FloatingTooltip } from '@/components'
import {
  RankLevel,
  calculateRank,
  getRankProgress,
  getNextRankRequirement,
  rankNamesKids
} from '@/domain/stickerRank'
import { SearchFilterPanel } from '@/features/search'
import {
  StickerSearchFilter,
  defaultSearchFilter,
  filterStickers
} from '@/domain/stickerTags'

/**
 * CollectionView - Container Query Units (cqw, cqh) を使用したレスポンシブ設計
 *
 * 親要素に container-type: size が設定されている前提で、
 * すべてのサイズを cqw/cqh/cqmin 単位で指定することで、
 * どの画面サイズでも崩れないレイアウトを実現
 */

// シールの型定義
export interface CollectionSticker {
  id: string
  name: string
  imageUrl?: string
  rarity: 1 | 2 | 3 | 4 | 5
  type: 'normal' | 'puffy' | 'sparkle'
  series: string
  character?: string
  owned: boolean
  quantity: number
  rank: number
  totalAcquired: number
  baseRate?: number
  firstAcquiredAt?: string
}

// レアリティの星表示 - cqmin単位でレスポンシブ
const RarityStars: React.FC<{ rarity: number }> = ({ rarity }) => {
  return (
    <div style={{ display: 'flex', gap: '0.5cqw' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: '3cqw',
            color: i < rarity ? '#FACC15' : '#D1D5DB',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

// ランク進捗バー - cqw単位でレスポンシブ
const RankProgressBar: React.FC<{ totalAcquired: number }> = ({ totalAcquired }) => {
  const progress = getRankProgress(totalAcquired)
  const currentRank = calculateRank(totalAcquired) as RankLevel
  const nextReq = getNextRankRequirement(currentRank, totalAcquired)

  if (currentRank >= 5) {
    return (
      <div style={{ textAlign: 'center' }}>
        <span style={{ fontSize: '3cqw', color: '#EC4899', fontWeight: 'bold' }}>
          {rankNamesKids[5]}
        </span>
      </div>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        height: '1.5cqw',
        background: '#E5E7EB',
        borderRadius: '9999px',
        overflow: 'hidden'
      }}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(to right, #A78BFA, #F472B6)',
            transition: 'all 0.3s',
            width: `${progress}%`,
          }}
        />
      </div>
      <p style={{
        fontSize: '2.5cqw',
        color: '#A78BFA',
        textAlign: 'center',
        marginTop: '0.5cqw'
      }}>
        つぎまであと{nextReq}まい
      </p>
    </div>
  )
}

// シールタイプアイコン
const TypeIcon: React.FC<{ type: 'normal' | 'puffy' | 'sparkle' }> = ({ type }) => {
  const icons = {
    normal: '📄',
    puffy: '🫧',
    sparkle: '✨'
  }
  return <span style={{ fontSize: '3.5cqw' }}>{icons[type]}</span>
}

// 個別シールカード - Container Query対応
interface StickerCardProps {
  sticker: CollectionSticker
  onClick: (sticker: CollectionSticker) => void
}

const StickerCard: React.FC<StickerCardProps> = memo(({ sticker, onClick }) => {
  const { owned, type, name, quantity, rank, imageUrl, totalAcquired } = sticker
  const actualRank = (totalAcquired ? calculateRank(totalAcquired) : rank) as RankLevel

  const cardContent = (
    <button
      onClick={() => onClick(sticker)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: '4cqw',
        overflow: 'hidden',
        transition: 'all 0.2s',
        background: owned ? 'rgba(255, 255, 255, 0.7)' : 'rgba(229, 231, 235, 0.5)',
        border: owned ? '1px solid rgba(196, 181, 253, 0.5)' : '1px solid rgba(209, 213, 219, 0.5)',
        boxShadow: type === 'puffy'
          ? '0 2cqw 4cqw rgba(0, 0, 0, 0.1)'
          : '0 0.5cqw 2cqw rgba(139, 92, 246, 0.1)',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {/* シール画像エリア */}
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: owned ? 1 : 0.3,
        filter: owned ? 'none' : 'grayscale(100%)',
      }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '2cqw'
            }}
          />
        ) : (
          <div style={{ fontSize: '8cqw' }}>
            {type === 'sparkle' ? '✨' : type === 'puffy' ? '🌟' : '⭐'}
          </div>
        )}
      </div>

      {/* 未所持オーバーレイ */}
      {!owned && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: '7cqw' }}>❓</span>
        </div>
      )}

      {/* 所持数バッジ */}
      {owned && quantity > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '1cqw',
          left: '1cqw',
          background: '#7C3AED',
          color: 'white',
          fontSize: '3cqw',
          paddingLeft: '1.5cqw',
          paddingRight: '1.5cqw',
          paddingTop: '0.5cqw',
          paddingBottom: '0.5cqw',
          borderRadius: '9999px',
          fontWeight: 'bold',
          zIndex: 10,
        }}>
          ×{quantity}
        </div>
      )}

      {/* キラキラエフェクト */}
      {owned && type === 'sparkle' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <div className="animate-shine" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom right, transparent, rgba(255, 255, 255, 0.3), transparent)',
          }} />
        </div>
      )}
    </button>
  )

  if (owned && actualRank > 0) {
    return (
      <RankEffectOverlay rank={actualRank} size="sm">
        {cardContent}
      </RankEffectOverlay>
    )
  }

  return cardContent
})

// シール名表示 - Container Query対応
const StickerLabel: React.FC<{ sticker: CollectionSticker }> = ({ sticker }) => {
  return (
    <div style={{ marginTop: '1cqw', textAlign: 'center' }}>
      <p style={{
        fontSize: '3cqw',
        fontWeight: 500,
        color: '#6B21A8',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        paddingLeft: '1cqw',
        paddingRight: '1cqw',
      }}>
        {sticker.owned ? sticker.name : '???'}
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1cqw',
        marginBottom: '1cqw'
      }}>
        <RarityStars rarity={sticker.rarity} />
        <TypeIcon type={sticker.type} />
      </div>
      {sticker.owned && sticker.totalAcquired > 0 && (
        <RankProgressBar totalAcquired={sticker.totalAcquired} />
      )}
    </div>
  )
}

// コレクション統計 - Container Query対応
interface CollectionStatsProps {
  total: number
  owned: number
}

const CollectionStats: React.FC<CollectionStatsProps> = ({ total, owned }) => {
  const percentage = Math.round((owned / total) * 100)

  return (
    <div
      style={{
        background: 'linear-gradient(to right, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9))',
        backdropFilter: 'blur(12px)',
        borderRadius: '4cqw',
        padding: '4cqw',
        marginBottom: '4cqw',
        color: 'white',
        boxShadow: '0 1cqw 4cqw rgba(139, 92, 246, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2cqw'
      }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '4.5cqw' }}>コレクション</h3>
        <span style={{ fontSize: '6cqw', fontWeight: 'bold' }}>{percentage}%</span>
      </div>
      <div style={{
        height: '3cqw',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '9999px',
        overflow: 'hidden'
      }}>
        <div
          style={{
            height: '100%',
            background: 'white',
            borderRadius: '9999px',
            transition: 'all 0.5s',
            width: `${percentage}%`,
          }}
        />
      </div>
      <p style={{ fontSize: '3.5cqw', marginTop: '2cqw', color: 'rgba(255, 255, 255, 0.8)' }}>
        {owned} / {total} シール
      </p>
    </div>
  )
}

// メインのCollectionView - Container Query対応
interface CollectionViewProps {
  stickers: CollectionSticker[]
  onStickerClick?: (sticker: CollectionSticker) => void
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  stickers,
  onStickerClick
}) => {
  const [filter, setFilter] = useState<StickerSearchFilter>(defaultSearchFilter)

  const filteredStickers = useMemo(() => {
    return filterStickers(stickers, filter)
  }, [stickers, filter])

  const stats = useMemo(() => ({
    total: stickers.length,
    owned: stickers.filter(s => s.owned).length
  }), [stickers])

  const handleStickerClick = (sticker: CollectionSticker) => {
    onStickerClick?.(sticker)
  }

  return (
    <div
      style={{
        // Container Query 設定 - このコンテナ内で cqw/cqh が有効
        containerType: 'size',
        containerName: 'collection-view',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        overflowX: 'hidden',
      }}
    >
      {/* ヘッダー統計 */}
      <CollectionStats total={stats.total} owned={stats.owned} />

      {/* 検索フィルターパネル */}
      <div style={{ marginBottom: '4cqw' }}>
        <SearchFilterPanel
          filter={filter}
          onFilterChange={setFilter}
          showOwnedFilter={true}
        />
      </div>

      {/* シールグリッド - Container Query ベースのレスポンシブ */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '4cqw',
        overflowX: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3cqw',
        }}>
          {filteredStickers.map((sticker) => (
            <div key={sticker.id}>
              <FloatingTooltip
                content={
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{sticker.name}</div>
                    <div>レア度: {'★'.repeat(sticker.rarity)}</div>
                    {sticker.owned && (
                      <div>所持数: {sticker.quantity}枚</div>
                    )}
                  </div>
                }
                placement="top"
                disabled={!sticker.owned}
              >
                <StickerCard sticker={sticker} onClick={handleStickerClick} />
              </FloatingTooltip>
              <StickerLabel sticker={sticker} />
            </div>
          ))}
        </div>

        {/* 結果なし */}
        {filteredStickers.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '12cqw',
            paddingBottom: '12cqw',
            color: '#A78BFA',
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(4px)',
            borderRadius: '4cqw',
            marginLeft: '4cqw',
            marginRight: '4cqw',
          }}>
            <span style={{ fontSize: '8cqw', marginBottom: '2cqw' }}>🔍</span>
            <p style={{ fontSize: '3.5cqw' }}>みつかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionView
