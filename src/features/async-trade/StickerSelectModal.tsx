'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { stickerService, UserStickerWithDetails } from '@/services/stickers/stickerService'

interface StickerSelectModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  excludedStickerIds: string[] // 既にオファー済みのシールIDを除外
  onSelect: (userStickerId: string) => void
}

// レアリティフィルター
type RarityFilter = 'all' | 1 | 2 | 3 | 4 | 5

// ソート順
type SortOrder = 'newest' | 'rarity' | 'name'

// シールカード
const StickerCard: React.FC<{
  sticker: UserStickerWithDetails
  onSelect: () => void
}> = ({ sticker, onSelect }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className="relative rounded-xl overflow-hidden"
      style={{
        aspectRatio: '1',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid #D4C4B0',
        boxShadow: '0 2px 8px rgba(184, 149, 107, 0.15)',
      }}
    >
      {/* シール画像 */}
      <img
        src={sticker.sticker.image_url}
        alt={sticker.sticker.name}
        className="w-full h-full object-cover"
      />

      {/* レアリティ星 */}
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center px-1 py-0.5 rounded"
        style={{ background: 'rgba(255, 255, 255, 0.9)' }}
      >
        {Array.from({ length: sticker.sticker.rarity }).map((_, i) => (
          <span key={i} className="text-[10px]" style={{ color: '#FFD700' }}>
            ★
          </span>
        ))}
      </div>

      {/* アップグレードランク表示 */}
      {sticker.upgrade_rank && sticker.upgrade_rank > 0 && (
        <div
          className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-xs font-bold"
          style={{
            background:
              sticker.upgrade_rank === 3
                ? 'linear-gradient(135deg, #FF69B4, #8A2BE2, #00CED1)'
                : sticker.upgrade_rank === 2
                ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                : 'linear-gradient(135deg, #C0C0C0, #E8E8E8)',
            color: 'white',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          {sticker.upgrade_rank === 3 ? 'P' : sticker.upgrade_rank === 2 ? 'G' : 'S'}
        </div>
      )}

      {/* 所持数（2以上の場合） */}
      {(sticker.quantity ?? 0) > 1 && (
        <div
          className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold"
          style={{ background: 'rgba(139, 90, 43, 0.9)', color: 'white' }}
        >
          ×{sticker.quantity}
        </div>
      )}
    </motion.button>
  )
}

// フィルターボタン
const FilterButton: React.FC<{
  label: string
  isActive: boolean
  onClick: () => void
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
    style={{
      background: isActive ? '#C4956A' : 'rgba(212, 196, 176, 0.3)',
      color: isActive ? 'white' : '#8B5A2B',
    }}
  >
    {label}
  </button>
)

export const StickerSelectModal: React.FC<StickerSelectModalProps> = ({
  isOpen,
  onClose,
  userId,
  excludedStickerIds,
  onSelect,
}) => {
  const [stickers, setStickers] = useState<UserStickerWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [searchQuery, setSearchQuery] = useState('')

  // シール取得
  useEffect(() => {
    if (!isOpen || !userId) return

    const fetchStickers = async () => {
      setIsLoading(true)
      try {
        const userStickers = await stickerService.getUserStickers(userId)
        setStickers(userStickers)
      } catch (error) {
        console.error('[StickerSelect] Fetch stickers error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStickers()
  }, [isOpen, userId])

  // フィルター・ソート済みシール
  const filteredStickers = useMemo(() => {
    let result = stickers.filter((s) => !excludedStickerIds.includes(s.id))

    // レアリティフィルター
    if (rarityFilter !== 'all') {
      result = result.filter((s) => s.sticker.rarity === rarityFilter)
    }

    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.sticker.name.toLowerCase().includes(query) ||
          (s.sticker.series && s.sticker.series.toLowerCase().includes(query))
      )
    }

    // ソート
    switch (sortOrder) {
      case 'rarity':
        result.sort((a, b) => b.sticker.rarity - a.sticker.rarity)
        break
      case 'name':
        result.sort((a, b) => a.sticker.name.localeCompare(b.sticker.name, 'ja'))
        break
      case 'newest':
      default:
        // 既に取得順（created_at desc）でソートされている
        break
    }

    return result
  }, [stickers, excludedStickerIds, rarityFilter, sortOrder, searchQuery])

  const handleSelect = (userStickerId: string) => {
    onSelect(userStickerId)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col"
          style={{
            background: 'linear-gradient(180deg, #FFF8F5 0%, #F8F4F0 100%)',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          {/* ヘッダー */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
            style={{ borderColor: '#D4C4B0', background: 'rgba(255, 255, 255, 0.9)' }}
          >
            <button
              onClick={onClose}
              className="text-xl"
              style={{ color: '#A67C52' }}
            >
              ✕
            </button>
            <h2 className="font-bold" style={{ color: '#8B5A2B' }}>
              シールをえらぶ
            </h2>
            <div className="w-6" />
          </div>

          {/* 検索バー */}
          <div className="px-4 py-2 flex-shrink-0">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid #D4C4B0' }}
            >
              <span style={{ color: '#A67C52' }}>🔍</span>
              <input
                type="text"
                placeholder="なまえでさがす..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: '#8B5A2B' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ color: '#A67C52' }}>
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* フィルター */}
          <div className="px-4 py-2 flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              {/* レアリティ */}
              <FilterButton
                label="ぜんぶ"
                isActive={rarityFilter === 'all'}
                onClick={() => setRarityFilter('all')}
              />
              {[5, 4, 3, 2, 1].map((rarity) => (
                <FilterButton
                  key={rarity}
                  label={'★'.repeat(rarity)}
                  isActive={rarityFilter === rarity}
                  onClick={() => setRarityFilter(rarity as RarityFilter)}
                />
              ))}
            </div>

            {/* ソート */}
            <div className="flex gap-2 mt-2">
              <span className="text-xs" style={{ color: '#A67C52' }}>
                ならべかえ:
              </span>
              <FilterButton
                label="あたらしい順"
                isActive={sortOrder === 'newest'}
                onClick={() => setSortOrder('newest')}
              />
              <FilterButton
                label="レア順"
                isActive={sortOrder === 'rarity'}
                onClick={() => setSortOrder('rarity')}
              />
              <FilterButton
                label="なまえ順"
                isActive={sortOrder === 'name'}
                onClick={() => setSortOrder('name')}
              />
            </div>
          </div>

          {/* シールグリッド */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div
                  className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: '#C4956A', borderTopColor: 'transparent' }}
                />
              </div>
            ) : filteredStickers.length > 0 ? (
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
              >
                {filteredStickers.map((sticker) => (
                  <StickerCard
                    key={sticker.id}
                    sticker={sticker}
                    onSelect={() => handleSelect(sticker.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-sm" style={{ color: '#A67C52' }}>
                  {searchQuery
                    ? 'みつかりませんでした'
                    : stickers.length === 0
                    ? 'シールがありません'
                    : 'えらべるシールがありません'}
                </p>
              </div>
            )}
          </div>

          {/* フッター情報 */}
          <div
            className="px-4 py-3 text-center text-xs flex-shrink-0 border-t"
            style={{ color: '#A67C52', borderColor: '#D4C4B0' }}
          >
            {filteredStickers.length} / {stickers.length - excludedStickerIds.length} まい
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StickerSelectModal
