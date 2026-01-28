'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { stickerService } from '@/services/stickers/stickerService'
import { TRADE_BOARD_RULES } from '@/domain/tradeBoard'

interface StickerOption {
  id: string
  name: string
  image_url: string
  rarity: number
  character?: string
  series?: string
}

interface WantedStickerSelectorProps {
  selectedIds: string[]
  onChangeSelected: (ids: string[]) => void
}

export const WantedStickerSelector: React.FC<WantedStickerSelectorProps> = ({
  selectedIds,
  onChangeSelected,
}) => {
  const [allStickers, setAllStickers] = useState<StickerOption[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const stickers = await stickerService.getAllStickers()
      setAllStickers(stickers.map(s => ({
        id: s.id,
        name: s.name,
        image_url: s.image_url,
        rarity: s.rarity,
        character: s.character || undefined,
        series: s.series || undefined,
      })))
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!search) return allStickers
    const q = search.toLowerCase()
    return allStickers.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.character && s.character.toLowerCase().includes(q)) ||
      (s.series && s.series.toLowerCase().includes(q))
    )
  }, [allStickers, search])

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const toggle = (id: string) => {
    if (selectedSet.has(id)) {
      onChangeSelected(selectedIds.filter(x => x !== id))
    } else if (selectedIds.length < TRADE_BOARD_RULES.maxWantedStickers) {
      onChangeSelected([...selectedIds, id])
    }
  }

  // 選択済みシールを上に表示
  const selectedStickers = allStickers.filter(s => selectedSet.has(s.id))

  return (
    <div style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
      {/* 選択済み表示 */}
      {selectedStickers.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-bold mb-1.5" style={{ color: '#A67C52' }}>
            えらんだシール ({selectedStickers.length}/{TRADE_BOARD_RULES.maxWantedStickers})
          </div>
          <div className="flex gap-2 flex-wrap">
            {selectedStickers.map(s => (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full active:scale-95 transition-transform"
                style={{
                  background: '#FFF0E8',
                  border: '2px solid #D4764A',
                }}
              >
                <img src={s.image_url} alt={s.name} className="w-6 h-6 object-contain rounded-full" style={{ background: '#FFF' }} />
                <span className="text-xs font-bold" style={{ color: '#8B5A2B' }}>{s.name}</span>
                <span className="text-xs" style={{ color: '#D4764A' }}>✕</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 検索 */}
      <div className="mb-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="シールをさがす..."
          className="w-full px-3 py-2 rounded-xl text-sm outline-none"
          style={{
            background: '#FFF8F0',
            border: '2px solid #E8D4C0',
            color: '#8B5A2B',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        />
      </div>

      {/* シール一覧グリッド */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#D4C4B0', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div
          className="grid grid-cols-4 gap-2 overflow-y-auto"
          style={{ maxHeight: '280px' }}
        >
          {filtered.map(sticker => {
            const isSelected = selectedSet.has(sticker.id)
            const isMaxed = !isSelected && selectedIds.length >= TRADE_BOARD_RULES.maxWantedStickers
            return (
              <button
                key={sticker.id}
                onClick={() => !isMaxed && toggle(sticker.id)}
                className="flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all active:scale-95"
                style={{
                  background: isSelected ? '#FFF0E8' : '#FFFFFF',
                  border: isSelected ? '2px solid #D4764A' : '2px solid #E8D4C0',
                  opacity: isMaxed ? 0.4 : 1,
                }}
              >
                <img
                  src={sticker.image_url}
                  alt={sticker.name}
                  className="w-12 h-12 object-contain"
                />
                <span
                  className="text-[10px] font-bold truncate w-full text-center"
                  style={{ color: '#8B5A2B' }}
                >
                  {sticker.name}
                </span>
                {/* レア度 */}
                <div className="flex gap-0.5">
                  {Array.from({ length: sticker.rarity }).map((_, i) => (
                    <span key={i} style={{ fontSize: '8px', color: '#FFB800' }}>&#x2B50;</span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
