'use client'

import React, { useState, useMemo, memo } from 'react'
import { RankEffectOverlay } from '@/components'
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
  filterStickers,
  getTagsForSticker,
  allThemeTags
} from '@/domain/stickerTags'

// シールの型定義
export interface CollectionSticker {
  id: string
  name: string
  imageUrl?: string
  rarity: 1 | 2 | 3 | 4 | 5
  type: 'normal' | 'puffy' | 'sparkle'
  series: string
  owned: boolean
  quantity: number
  rank: number // 1-5 (MAX is 5)
  totalAcquired: number // 累計獲得数（ランク計算用）
  baseRate?: number // 基本レート
  firstAcquiredAt?: string
}

// レアリティの星表示
const RarityStars: React.FC<{ rarity: number }> = ({ rarity }) => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-xs ${i < rarity ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

// ランク進捗バー
const RankProgressBar: React.FC<{ totalAcquired: number }> = ({ totalAcquired }) => {
  const progress = getRankProgress(totalAcquired)
  const currentRank = calculateRank(totalAcquired) as RankLevel
  const nextReq = getNextRankRequirement(currentRank, totalAcquired)

  if (currentRank >= 5) {
    return (
      <div className="text-center">
        <span className="text-xs text-pink-500 font-bold">{rankNamesKids[5]}</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[10px] text-purple-400 text-center mt-0.5">
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
  return <span className="text-sm">{icons[type]}</span>
}

// 個別シールカード
interface StickerCardProps {
  sticker: CollectionSticker
  onClick: (sticker: CollectionSticker) => void
}

const StickerCard: React.FC<StickerCardProps> = memo(({ sticker, onClick }) => {
  const { owned, type, name, quantity, rank, imageUrl, totalAcquired } = sticker

  // ランクを計算（totalAcquiredがあればそれを使用、なければrankを使用）
  const actualRank = (totalAcquired ? calculateRank(totalAcquired) : rank) as RankLevel

  // ぷっくりシール用のシャドウ
  const puffyClass = type === 'puffy' ? 'shadow-lg' : ''

  const cardContent = (
    <button
      onClick={() => onClick(sticker)}
      className={`
        relative w-full aspect-square rounded-2xl overflow-hidden
        transition-all duration-200 active:scale-95
        ${owned ? 'bg-white/70 backdrop-blur-sm' : 'bg-gray-200/50'}
        ${puffyClass}
        border ${owned ? 'border-purple-200/50' : 'border-gray-300/50'}
        shadow-[0_2px_8px_rgba(139,92,246,0.1)]
      `}
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* シール画像エリア */}
      <div className={`
        w-full h-full flex items-center justify-center
        ${!owned ? 'opacity-30 grayscale' : ''}
      `}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} loading="lazy" className="w-full h-full object-contain p-2" />
        ) : (
          <div className="text-4xl">
            {type === 'sparkle' ? '✨' : type === 'puffy' ? '🌟' : '⭐'}
          </div>
        )}
      </div>

      {/* 未所持オーバーレイ */}
      {!owned && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">❓</span>
        </div>
      )}

      {/* 所持数バッジ */}
      {owned && quantity > 1 && (
        <div className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold z-10">
          ×{quantity}
        </div>
      )}

      {/* キラキラエフェクト（typeがsparkleの場合） */}
      {owned && type === 'sparkle' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/30 to-transparent animate-shine" />
        </div>
      )}
    </button>
  )

  // 所持している場合はランクエフェクトを適用
  if (owned && actualRank > 0) {
    return (
      <RankEffectOverlay rank={actualRank} size="sm">
        {cardContent}
      </RankEffectOverlay>
    )
  }

  return cardContent
})

// シール名表示
const StickerLabel: React.FC<{ sticker: CollectionSticker }> = ({ sticker }) => {
  return (
    <div className="mt-1 text-center">
      <p className="text-xs font-medium text-purple-800 truncate px-1">
        {sticker.owned ? sticker.name : '???'}
      </p>
      <div className="flex items-center justify-center gap-1 mb-1">
        <RarityStars rarity={sticker.rarity} />
        <TypeIcon type={sticker.type} />
      </div>
      {/* ランク進捗（所持している場合のみ） */}
      {sticker.owned && sticker.totalAcquired > 0 && (
        <RankProgressBar totalAcquired={sticker.totalAcquired} />
      )}
    </div>
  )
}

// シールのタグ表示
const StickerTags: React.FC<{ stickerName: string }> = ({ stickerName }) => {
  const tags = getTagsForSticker(stickerName)

  if (tags.length === 0) return null

  // 最大2つのタグを表示
  const displayTags = tags.slice(0, 2)
  const tagInfos = displayTags.map(tag => allThemeTags.find(t => t.id === tag)).filter(Boolean)

  return (
    <div className="flex flex-wrap justify-center gap-0.5 mt-1">
      {tagInfos.map((tagInfo) => tagInfo && (
        <span
          key={tagInfo.id}
          className="text-[9px] px-1 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: tagInfo.color,
            color: tagInfo.textColor,
          }}
        >
          {tagInfo.emoji}
        </span>
      ))}
      {tags.length > 2 && (
        <span className="text-[9px] text-purple-400">+{tags.length - 2}</span>
      )}
    </div>
  )
}


// コレクション統計 - iOS風カード
interface CollectionStatsProps {
  total: number
  owned: number
}

const CollectionStats: React.FC<CollectionStatsProps> = ({ total, owned }) => {
  const percentage = Math.round((owned / total) * 100)

  return (
    <div
      className="bg-gradient-to-r from-purple-500/90 to-pink-500/90 backdrop-blur-md rounded-2xl p-4 mb-4 text-white shadow-[0_4px_16px_rgba(139,92,246,0.3)] border border-white/20"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg">コレクション</h3>
        <span className="text-2xl font-bold">{percentage}%</span>
      </div>
      <div className="h-3 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm mt-2 text-white/80">
        {owned} / {total} シール
      </p>
    </div>
  )
}

// メインのCollectionView
interface CollectionViewProps {
  stickers: CollectionSticker[]
  onStickerClick?: (sticker: CollectionSticker) => void
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  stickers,
  onStickerClick
}) => {
  // 新しいフィルターシステムを使用
  const [filter, setFilter] = useState<StickerSearchFilter>(defaultSearchFilter)

  // フィルター適用（新しいfilterStickers関数を使用）
  const filteredStickers = useMemo(() => {
    return filterStickers(stickers, filter)
  }, [stickers, filter])

  // 統計
  const stats = useMemo(() => ({
    total: stickers.length,
    owned: stickers.filter(s => s.owned).length
  }), [stickers])

  const handleStickerClick = (sticker: CollectionSticker) => {
    onStickerClick?.(sticker)
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* ヘッダー統計 */}
      <CollectionStats total={stats.total} owned={stats.owned} />

      {/* 新しい検索フィルターパネル */}
      <div className="mb-4">
        <SearchFilterPanel
          filter={filter}
          onFilterChange={setFilter}
          showOwnedFilter={true}
        />
      </div>

      {/* シールグリッド */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="grid grid-cols-3 gap-3">
          {filteredStickers.map((sticker) => (
            <div key={sticker.id}>
              <StickerCard sticker={sticker} onClick={handleStickerClick} />
              <StickerLabel sticker={sticker} />
              {/* タグ表示（所持シールのみ） */}
              {sticker.owned && (
                <StickerTags stickerName={sticker.name} />
              )}
            </div>
          ))}
        </div>

        {/* 結果なし - iOS風 */}
        {filteredStickers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-purple-400 bg-white/50 backdrop-blur-sm rounded-2xl mx-4">
            <span className="text-4xl mb-2">🔍</span>
            <p className="text-sm">みつかりませんでした</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionView
