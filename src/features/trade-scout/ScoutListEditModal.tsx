'use client'

import { useState, useCallback, useMemo } from 'react'
import { ScoutSticker, MAX_WANT_LIST, MAX_OFFER_LIST } from '@/domain/tradeScout'

interface StickerOption {
  id: string
  name: string
  imageUrl: string
  rarity: number
  owned: boolean
  quantity: number
}

interface ScoutListEditModalProps {
  isOpen: boolean
  onClose: () => void
  /** リストの種類 */
  listType: 'want' | 'offer'
  /** 現在の選択済みリスト */
  currentList: ScoutSticker[]
  /** 選択可能なシール一覧 */
  availableStickers: StickerOption[]
  /** 保存コールバック */
  onSave: (stickers: ScoutSticker[]) => void
}

/**
 * スカウトリスト編集モーダル
 * 欲しいシール/出せるシールを選択
 */
export function ScoutListEditModal({
  isOpen,
  onClose,
  listType,
  currentList,
  availableStickers,
  onSave,
}: ScoutListEditModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(currentList.map(s => s.stickerId))
  )

  const maxItems = listType === 'want' ? MAX_WANT_LIST : MAX_OFFER_LIST
  const title = listType === 'want' ? '💚 ほしいシール' : '🤝 だせるシール'
  const description = listType === 'want'
    ? 'ほしいシールをえらんでね（最大5枚）'
    : 'こうかんに出せるシールをえらんでね（最大5枚）'

  // 選択可能なシールをフィルター
  const filteredStickers = useMemo(() => {
    if (listType === 'want') {
      // 欲しいシールは未所持または少ないシール
      return availableStickers.filter(s => !s.owned || s.quantity < 2)
    } else {
      // 出せるシールはダブりがあるシール
      return availableStickers.filter(s => s.owned && s.quantity >= 2)
    }
  }, [availableStickers, listType])

  // 選択/解除のトグル
  const toggleSelect = useCallback((stickerId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(stickerId)) {
        newSet.delete(stickerId)
      } else if (newSet.size < maxItems) {
        newSet.add(stickerId)
      }
      return newSet
    })
  }, [maxItems])

  // 保存
  const handleSave = useCallback(() => {
    const selectedStickers: ScoutSticker[] = Array.from(selectedIds)
      .map(id => {
        const sticker = availableStickers.find(s => s.id === id)
        if (!sticker) return null
        return {
          stickerId: sticker.id,
          stickerName: sticker.name,
          stickerImageUrl: sticker.imageUrl,
          rarity: sticker.rarity,
        }
      })
      .filter((s): s is ScoutSticker => s !== null)

    onSave(selectedStickers)
    onClose()
  }, [selectedIds, availableStickers, onSave, onClose])

  // モーダルを閉じる
  const handleClose = useCallback(() => {
    setSelectedIds(new Set(currentList.map(s => s.stickerId)))
    onClose()
  }, [currentList, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0, 0, 0, 0.5)' }} onClick={handleClose}>
      <div className="w-full max-w-md rounded-t-3xl overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)', maxHeight: '85vh' }} onClick={(e) => e.stopPropagation()}>
        {/* ヘッダー */}
        <div className="px-4 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(90deg, #10B981 0%, #14B8A6 100%)' }}>
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
            {title}
          </h2>
          <button onClick={handleClose} className="text-white text-2xl leading-none hover:opacity-70">
            ×
          </button>
        </div>

        {/* 選択数表示 */}
        <div className="px-4 py-3 border-b border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-emerald-600" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
              {description}
            </span>
            <span className="text-sm font-bold text-emerald-700" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
              {selectedIds.size}/{maxItems}
            </span>
          </div>
        </div>

        {/* シール一覧 */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: '50vh' }}>
          {filteredStickers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-emerald-600 font-bold" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                {listType === 'want' ? 'コレクションがいっぱい！' : 'ダブりシールがないよ'}
              </p>
              <p className="text-sm text-emerald-400 mt-2" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                {listType === 'want' ? 'すごい！' : 'ガチャでシールをあつめよう！'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {filteredStickers.map(sticker => {
                const isSelected = selectedIds.has(sticker.id)
                return (
                  <button key={sticker.id} onClick={() => toggleSelect(sticker.id)} className={`relative rounded-xl p-2 transition-all duration-200 active:scale-95 ${isSelected ? 'bg-gradient-to-br from-emerald-100 to-teal-100 ring-2 ring-emerald-400' : 'bg-white hover:bg-emerald-50'}`} style={{ boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(0,0,0,0.05)' }} disabled={!isSelected && selectedIds.size >= maxItems}>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <div className="w-full aspect-square rounded-lg bg-emerald-50 mb-1 flex items-center justify-center overflow-hidden">
                      {sticker.imageUrl ? (
                        <img src={sticker.imageUrl} alt={sticker.name} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-2xl">🏷️</span>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-700 truncate text-center" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                      {sticker.name}
                    </div>
                    <div className="text-[8px] text-yellow-500 text-center">
                      {'★'.repeat(sticker.rarity)}
                    </div>
                    {listType === 'offer' && sticker.quantity > 1 && (
                      <div className="text-[8px] text-emerald-500 text-center">
                        ×{sticker.quantity}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* 保存ボタン */}
        <div className="px-4 py-4 border-t border-emerald-100">
          <button onClick={handleSave} className="w-full py-3 rounded-full font-bold text-white transition-all active:scale-95 shadow-lg" style={{ background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)', fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
            ほぞんする ✨
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScoutListEditModal
