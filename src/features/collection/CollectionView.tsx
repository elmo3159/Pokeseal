'use client'

import React, { useState, useMemo, memo, useEffect, useCallback, useRef } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { FloatingTooltip } from '@/components'
import { RankStars, StickerAura } from '@/components/upgrade'
import { UPGRADE_RANKS, UPGRADE_REQUIREMENTS, RANK_NAMES, formatNameWithRank } from '@/constants/upgradeRanks'
import type { UpgradeRank } from '@/constants/upgradeRanks'
import { SearchFilterPanel } from '@/features/search'
import {
  StickerSearchFilter,
  defaultSearchFilter,
  filterStickers
} from '@/domain/stickerTags'
import { CharacterProgressModal } from './CharacterProgressModal'

const VirtuosoScroller = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => (
    <div
      {...props}
      ref={ref}
      style={{
        ...props.style,
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}
    />
  )
)
VirtuosoScroller.displayName = 'VirtuosoScroller'

const PREFETCH_ROW_BEFORE = 2
const PREFETCH_ROW_AFTER = 5

const resolveImageUrl = (url?: string) => {
  if (!url) return undefined
  return url.startsWith('/') ? url : `/${url}`
}

// 画面幅に応じたグリッド列数を計算するカスタムフック
const useResponsiveColumns = () => {
  const [columns, setColumns] = useState(4)

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      // モバイル (〜480px): 4列
      // タブレット (481px〜768px): 5列
      // PC (769px〜): 6列以上
      if (width <= 480) {
        setColumns(4)
      } else if (width <= 768) {
        setColumns(5)
      } else if (width <= 1024) {
        setColumns(6)
      } else {
        setColumns(Math.min(8, Math.floor(width / 120)))
      }
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  return columns
}

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
  upgradeRank?: number // アップグレードランク（0=ノーマル, 1=シルバー, 2=ゴールド, 3=プリズム）
  effectiveRarity?: number // 実効レアリティ（rarity + アップグレードボーナス）フィルタリング用
}

// RarityStarsは削除 - 常にRankStarsを使用

// アップグレード進捗バー - vw単位でレスポンシブ
const UpgradeProgressBar: React.FC<{ quantity: number; upgradeRank: UpgradeRank }> = ({ quantity, upgradeRank }) => {
  // プリズムランクは最高なので進捗不要
  if (upgradeRank === UPGRADE_RANKS.PRISM) {
    return (
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontSize: 'clamp(6px, 1.8vw, 9px)',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #ff6b6b, #ffe66d, #4ecdc4, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          MAX
        </span>
      </div>
    )
  }

  // 次のランクへの必要枚数を取得
  const nextRank = (upgradeRank + 1) as 1 | 2 | 3
  const requirement = UPGRADE_REQUIREMENTS[nextRank]
  const needed = requirement.count
  const progress = Math.min((quantity / needed) * 100, 100)
  const canUpgrade = quantity >= needed
  const neededMore = Math.max(0, needed - quantity)

  if (canUpgrade) {
    return (
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontSize: 'clamp(6px, 1.8vw, 9px)',
          color: '#22C55E',
          fontWeight: 'bold'
        }}>
          ↑{RANK_NAMES[nextRank]}可能
        </span>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', padding: '0 2px', minWidth: 0 }}>
      <div style={{
        height: 'clamp(2px, 0.8vw, 4px)',
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
        fontSize: 'clamp(6px, 1.6vw, 8px)',
        color: '#A78BFA',
        textAlign: 'center',
        marginTop: '1px',
        margin: 0,
      }}>
        {RANK_NAMES[nextRank]}まであと{neededMore}まい
      </p>
    </div>
  )
}

// シールタイプアイコン - vw単位でレスポンシブ
const TypeIcon: React.FC<{ type: 'normal' | 'puffy' | 'sparkle' }> = ({ type }) => {
  const icons = {
    normal: '📄',
    puffy: '🫧',
    sparkle: '✨'
  }
  return <span style={{ fontSize: 'clamp(12px, 3.5vw, 18px)' }}>{icons[type]}</span>
}

// 個別シールカード - vw単位でレスポンシブ
interface StickerCardProps {
  sticker: CollectionSticker
  onClick: (sticker: CollectionSticker) => void
}

const StickerCard: React.FC<StickerCardProps> = memo(({ sticker, onClick }) => {
  const { owned, type, name, quantity, imageUrl, upgradeRank = 0 } = sticker
  const resolvedImageUrl = resolveImageUrl(imageUrl)

  const cardContent = (
    <button
      onClick={() => onClick(sticker)}
      style={{
        position: 'relative',
        width: '100%',
        minWidth: 0, // グリッドアイテムの縮小を許可
        display: 'block',
        paddingTop: '100%',
        transition: 'all 0.2s',
        background: owned ? 'rgba(255, 255, 255, 0.7)' : 'rgba(229, 231, 235, 0.5)',
        border: owned ? '1px solid rgba(196, 181, 253, 0.5)' : '1px solid rgba(209, 213, 219, 0.5)',
        borderRadius: 'clamp(6px, 2vw, 12px)',
        overflow: 'hidden',
        boxShadow: type === 'puffy'
          ? '0 4px 8px rgba(0, 0, 0, 0.1)'
          : '0 2px 4px rgba(139, 92, 246, 0.1)',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        cursor: 'pointer',
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
          {/* シール画像エリア - アップグレードランクに基づくオーラ */}
          <StickerAura upgradeRank={upgradeRank as UpgradeRank}>
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: owned ? 1 : 0.3,
              filter: owned ? 'none' : 'grayscale(100%)',
            }}>
              {resolvedImageUrl ? (
                <img
                  src={resolvedImageUrl}
                  alt={name}
                  loading="lazy"
                  decoding="async"
                  width={256}
                  height={256}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '4%'
                  }}
                />
              ) : (
                <div style={{ fontSize: 'clamp(16px, 5vw, 24px)' }}>
                  {type === 'sparkle' ? '?' : type === 'puffy' ? '??' : '?'}
                </div>
              )}
            </div>
          </StickerAura>

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
              <span style={{ fontSize: 'clamp(14px, 4.5vw, 22px)' }}>?</span>
            </div>
          )}

          {/* 所持数バッジ */}
          {owned && quantity > 1 && (
            <div style={{
              position: 'absolute',
              bottom: '2%',
              left: '2%',
              background: '#7C3AED',
              color: 'white',
              fontSize: 'clamp(8px, 2.2vw, 11px)',
              paddingLeft: '1vw',
              paddingRight: '1vw',
              paddingTop: '0.5vw',
              paddingBottom: '0.5vw',
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
        </div>
    </button>
  )

  return cardContent
})

// シール名表示 - vw単位でレスポンシブ
const StickerLabel: React.FC<{ sticker: CollectionSticker }> = ({ sticker }) => {
  const upgradeRank = sticker.upgradeRank ?? 0

  return (
    <div style={{ marginTop: '2px', textAlign: 'center', minWidth: 0, overflow: 'hidden' }}>
      <p style={{
        fontSize: 'clamp(8px, 2.2vw, 11px)',
        fontWeight: 500,
        color: '#6B21A8',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        padding: '0 2px',
        lineHeight: 1.2,
        margin: 0,
      }}>
        {sticker.owned ? formatNameWithRank(sticker.name, upgradeRank as UpgradeRank) : '???'}
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1px',
        marginBottom: '2px'
      }}>
        {/* 常にSVGベースのRankStarsを使用 */}
        <RankStars
          baseRarity={sticker.rarity}
          upgradeRank={(upgradeRank ?? 0) as UpgradeRank}
          size="sm"
          showAnimation={false}
        />
      </div>
      {sticker.owned && (
        <UpgradeProgressBar quantity={sticker.quantity} upgradeRank={upgradeRank as UpgradeRank} />
      )}
    </div>
  )
}

// コレクション統計 - vw単位でレスポンシブ
interface CollectionStatsProps {
  total: number
  owned: number
  onRewardsClick?: () => void
}

const CollectionStats: React.FC<CollectionStatsProps> = ({ total, owned, onRewardsClick }) => {
  const percentage = Math.round((owned / total) * 100)

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 'clamp(10px, 3vw, 16px)',
        padding: 'clamp(10px, 3vw, 16px)',
        marginBottom: 'clamp(8px, 2vw, 12px)',
        border: '3px solid #B8956B',
        boxShadow: `
          0 0 6px 1px rgba(184, 149, 107, 0.4),
          0 0 12px 3px rgba(184, 149, 107, 0.2),
          inset 0 0 8px rgba(184, 149, 107, 0.1)
        `,
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'clamp(4px, 1.5vw, 8px)'
      }}>
        <h3 style={{ fontWeight: 'bold', fontSize: 'clamp(14px, 3.5vw, 18px)', color: '#8B5A2B' }}>
          📚 コレクション
        </h3>
        <span style={{
          fontSize: 'clamp(16px, 4.5vw, 22px)',
          fontWeight: 'bold',
          color: '#D4A574',
          textShadow: '0 1px 2px rgba(139, 90, 43, 0.2)'
        }}>
          {percentage}%
        </span>
      </div>
      <div style={{
        height: 'clamp(8px, 2.5vw, 12px)',
        background: 'linear-gradient(to bottom, #E8DDD4, #F5EDE6)',
        borderRadius: '9999px',
        overflow: 'hidden',
        border: '2px solid #C4A484',
        boxShadow: 'inset 0 2px 4px rgba(139, 90, 43, 0.15)'
      }}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(to right, #E8B88A, #D4A574, #C4956A)',
            borderRadius: '9999px',
            transition: 'all 0.5s',
            width: `${percentage}%`,
            boxShadow: '0 0 8px rgba(212, 165, 116, 0.6)'
          }}
        />
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'clamp(4px, 1.5vw, 8px)',
      }}>
        <p style={{ fontSize: 'clamp(10px, 2.5vw, 14px)', color: '#A67C52', margin: 0 }}>
          {owned} / {total} シール
        </p>
        {onRewardsClick && (
          <button
            onClick={onRewardsClick}
            style={{
              padding: 'clamp(4px, 1.5vw, 8px) clamp(8px, 2.5vw, 12px)',
              borderRadius: 'clamp(8px, 2vw, 12px)',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              color: 'white',
              fontSize: 'clamp(10px, 2.5vw, 12px)',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🏆</span>
            <span>シリーズ報酬</span>
          </button>
        )}
      </div>
    </div>
  )
}

// メインのCollectionView - vw単位でレスポンシブ
interface CollectionViewProps {
  stickers: CollectionSticker[]
  onStickerClick?: (sticker: CollectionSticker) => void
  onGoGacha?: () => void
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  stickers,
  onStickerClick,
  onGoGacha
}) => {
  const [filter, setFilter] = useState<StickerSearchFilter>(defaultSearchFilter)
  const [isSeriesModalOpen, setIsSeriesModalOpen] = useState(false)
  const columns = useResponsiveColumns()
  const containerRef = useRef<HTMLDivElement>(null)
  const preloadedImagesRef = useRef<Set<string>>(new Set())

  const filteredStickers = useMemo(() => {
    return filterStickers(stickers, filter)
  }, [stickers, filter])

  const stats = useMemo(() => ({
    total: stickers.length,
    owned: stickers.filter(s => s.owned).length
  }), [stickers])

  const handleStickerClick = useCallback((sticker: CollectionSticker) => {
    onStickerClick?.(sticker)
  }, [onStickerClick])

  // シールを行ごとにグループ化（仮想スクロール用）
  const rows = useMemo(() => {
    const result: CollectionSticker[][] = []
    for (let i = 0; i < filteredStickers.length; i += columns) {
      result.push(filteredStickers.slice(i, i + columns))
    }
    return result
  }, [filteredStickers, columns])

  const preloadImage = useCallback((url: string) => {
    if (!url) return
    if (preloadedImagesRef.current.has(url)) return
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    preloadedImagesRef.current.add(url)
  }, [])

  const preloadRows = useCallback((startIndex: number, endIndex: number) => {
    if (rows.length === 0) return
    const start = Math.max(0, startIndex)
    const end = Math.min(rows.length - 1, endIndex)
    for (let rowIndex = start; rowIndex <= end; rowIndex += 1) {
      const row = rows[rowIndex]
      if (!row) continue
      for (const sticker of row) {
        const resolved = resolveImageUrl(sticker.imageUrl)
        if (resolved) {
          preloadImage(resolved)
        }
      }
    }
  }, [rows, preloadImage])

  const handleRangeChanged = useCallback((range: { startIndex: number; endIndex: number }) => {
    preloadRows(range.startIndex - PREFETCH_ROW_BEFORE, range.endIndex + PREFETCH_ROW_AFTER)
  }, [preloadRows])

  useEffect(() => {
    preloadRows(0, PREFETCH_ROW_AFTER)
  }, [preloadRows])

  // 行のレンダリング
  const rowContent = useCallback((index: number) => {
    const rowStickers = rows[index]
    if (!rowStickers) return null

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: 'clamp(4px, 1.5vw, 8px)',
          width: '100%',
          paddingBottom: 'clamp(4px, 1.5vw, 8px)',
        }}
      >
        {rowStickers.map((sticker) => (
          <div key={sticker.id} style={{ minWidth: 0, overflow: 'hidden' }}>
            <FloatingTooltip
              content={
                <div>
                  <div style={{ fontWeight: 'bold' }}>{formatNameWithRank(sticker.name, (sticker.upgradeRank ?? 0) as UpgradeRank)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>レア度:</span>
                    <RankStars
                      baseRarity={sticker.rarity}
                      upgradeRank={(sticker.upgradeRank ?? 0) as UpgradeRank}
                      size="sm"
                      showAnimation={false}
                    />
                  </div>
                  {sticker.owned && (
                    <div>所持数: {sticker.quantity}枚</div>
                  )}
                </div>
              }
              placement="top"
              disabled={!sticker.owned}
              block
            >
              <StickerCard sticker={sticker} onClick={handleStickerClick} />
            </FloatingTooltip>
            <StickerLabel sticker={sticker} />
          </div>
        ))}
      </div>
    )
  }, [rows, columns, handleStickerClick])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー統計 */}
      <CollectionStats
        total={stats.total}
        owned={stats.owned}
        onRewardsClick={() => setIsSeriesModalOpen(true)}
      />

      {/* 検索フィルターパネル */}
      <div style={{ marginBottom: 'clamp(6px, 2vw, 12px)' }}>
        <SearchFilterPanel
          filter={filter}
          onFilterChange={setFilter}
          showOwnedFilter={true}
        />
      </div>

      {/* シールグリッド - ふわふわフレーム付きコンテナ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        minWidth: 0,
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
      }}>
        {/* ふわふわフレーム - ぼかし付き実線（太め） */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            minWidth: 0,
            width: '100%',
            maxWidth: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 'clamp(10px, 3vw, 16px)',
            border: '3px solid #B8956B',
            boxShadow: `
              0 0 8px 2px rgba(184, 149, 107, 0.5),
              0 0 16px 4px rgba(184, 149, 107, 0.3),
              inset 0 0 10px rgba(184, 149, 107, 0.15)
            `,
            padding: 'clamp(6px, 2vw, 10px)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {rows.length > 0 ? (
            <Virtuoso
              style={{
                height: '100%',
                width: '100%',
              }}
              components={{
                Scroller: VirtuosoScroller,
              }}
              totalCount={rows.length}
              itemContent={rowContent}
              overscan={300} // 画面外300pxまで先読み
              increaseViewportBy={{ top: 200, bottom: 200 }}
              rangeChanged={handleRangeChanged}
            />
          ) : (
            /* 結果なし */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 'clamp(24px, 8vw, 48px)',
              paddingBottom: 'clamp(24px, 8vw, 48px)',
              color: '#A78BFA',
            }}>
              <span style={{ fontSize: 'clamp(20px, 6vw, 32px)', marginBottom: 'clamp(6px, 1.5vw, 10px)' }}>🔍</span>
              <p style={{ fontSize: 'clamp(12px, 2.5vw, 16px)' }}>みつからないよ</p>
              {onGoGacha && (
                <button
                  onClick={onGoGacha}
                  style={{
                    marginTop: 'clamp(8px, 2vw, 12px)',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: 'clamp(12px, 2.5vw, 16px)',
                    fontWeight: 'bold',
                    color: 'white',
                    background: 'linear-gradient(135deg, #F472B6 0%, #A78BFA 100%)',
                    boxShadow: '0 4px 12px rgba(167, 139, 250, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  }}
                >
                  がちゃへ
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* キャラクター報酬モーダル */}
      <CharacterProgressModal
        isOpen={isSeriesModalOpen}
        onClose={() => setIsSeriesModalOpen(false)}
      />
    </div>
  )
}

export default CollectionView
