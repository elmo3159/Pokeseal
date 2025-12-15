'use client'

import { useState, useCallback } from 'react'
import {
  DecoItemData,
  DecoItemType,
  DECO_CATEGORY_NAMES,
  DECO_CATEGORY_DESCRIPTIONS,
  groupDecoItemsByType,
} from '@/domain/decoItems'

interface DecoDrawerProps {
  /** 利用可能なデコアイテム */
  availableItems: DecoItemData[]
  /** 選択中のデコアイテム */
  selectedItem: DecoItemData | null
  /** デコアイテム選択時のコールバック */
  onSelectItem: (item: DecoItemData | null) => void
  /** ドロワーが開いているかどうか */
  isOpen: boolean
  /** ドロワーの開閉コールバック */
  onToggle: () => void
}

/**
 * デコ・ドロワー: シール帳を飾るデコ素材を選ぶUI
 * 小学生でも使いやすいシンプルなデザイン
 */
export function DecoDrawer({
  availableItems,
  selectedItem,
  onSelectItem,
  isOpen,
  onToggle,
}: DecoDrawerProps) {
  // カテゴリでグループ化
  const groupedItems = groupDecoItemsByType(availableItems)

  // 選択中のカテゴリ
  const [activeCategory, setActiveCategory] = useState<DecoItemType>('tape')

  // カテゴリタブの順番
  const categoryOrder: DecoItemType[] = ['tape', 'lace', 'stamp', 'glitter', 'frame']

  // アイテム選択ハンドラー
  const handleItemClick = useCallback((item: DecoItemData) => {
    if (selectedItem?.id === item.id) {
      // 同じアイテムをクリックしたら選択解除
      onSelectItem(null)
    } else {
      onSelectItem(item)
    }
  }, [selectedItem, onSelectItem])

  // レアリティの星表示
  const renderRarityStars = (rarity: number) => {
    return '★'.repeat(rarity) + '☆'.repeat(5 - rarity)
  }

  // 開いていない場合は何も表示しない
  if (!isOpen) return null

  return (
    <div
      className="fixed left-0 right-0 z-[250] transition-all duration-300 ease-out"
      style={{
        bottom: '70px', // 下部ナビにかぶせる
        height: '280px',
      }}
    >
      {/* ドロワー本体 */}
      <div
        className="h-full rounded-t-2xl shadow-2xl overflow-hidden mx-2 relative"
        style={{
          background: 'linear-gradient(180deg, #FFF5F8 0%, #FFFFFF 100%)',
          border: '3px solid #F9A8D4',
          borderBottom: 'none',
        }}
      >
        {/* ×ボタン */}
        <button
          onClick={onToggle}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center
            bg-pink-100 text-pink-500 font-bold text-lg z-10
            active:scale-95 transition-transform hover:bg-pink-200"
          aria-label="閉じる"
        >
          ×
        </button>
        {/* カテゴリタブ */}
        <div
          className="flex overflow-x-auto px-2 py-2 gap-1"
          style={{
            background: 'linear-gradient(90deg, #FCE7F3 0%, #FDF2F8 100%)',
            borderBottom: '1px solid #FBCFE8',
          }}
        >
          {categoryOrder.map(category => {
            const items = groupedItems[category]
            const isActive = activeCategory === category
            const hasItems = items.length > 0

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                disabled={!hasItems}
                className={`
                  flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold
                  transition-all duration-200
                  ${isActive
                    ? 'bg-pink-500 text-white shadow-md scale-105'
                    : hasItems
                      ? 'bg-white text-pink-600 hover:bg-pink-100'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                }}
              >
                {DECO_CATEGORY_NAMES[category]}
                <span className="ml-1 text-[10px] opacity-70">
                  ({items.length})
                </span>
              </button>
            )
          })}
        </div>

        {/* カテゴリ説明 */}
        <div
          className="px-4 py-1.5 text-xs text-pink-600"
          style={{
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            background: 'rgba(249, 168, 212, 0.1)',
          }}
        >
          💡 {DECO_CATEGORY_DESCRIPTIONS[activeCategory]}
        </div>

        {/* アイテムグリッド */}
        <div
          className="h-[180px] overflow-y-auto px-3 py-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#F9A8D4 transparent',
          }}
        >
          {groupedItems[activeCategory].length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              まだ持っていないよ
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {groupedItems[activeCategory].map(item => {
                const isSelected = selectedItem?.id === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`
                      relative p-2 rounded-xl transition-all duration-200
                      ${isSelected
                        ? 'bg-pink-200 ring-2 ring-pink-500 scale-105 shadow-lg'
                        : 'bg-white hover:bg-pink-50 shadow-sm hover:shadow-md'
                      }
                    `}
                    style={{
                      aspectRatio: '1',
                    }}
                  >
                    {/* アイテム画像 */}
                    <div
                      className="w-full h-full rounded-lg flex items-center justify-center text-2xl overflow-hidden"
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)'
                          : 'linear-gradient(135deg, #F5F5F5 0%, #EBEBEB 100%)',
                      }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // 画像読み込み失敗時はプレースホルダー表示
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      {/* フォールバック用プレースホルダー */}
                      <span className={item.imageUrl ? 'hidden' : ''}>
                        {item.type === 'tape' && '📏'}
                        {item.type === 'lace' && '🎀'}
                        {item.type === 'stamp' && '🔖'}
                        {item.type === 'glitter' && '✨'}
                        {item.type === 'frame' && '🖼️'}
                      </span>
                    </div>

                    {/* アイテム名 */}
                    <div
                      className="absolute bottom-0 left-0 right-0 px-1 py-0.5
                        text-[8px] text-center truncate rounded-b-xl"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      }}
                    >
                      {item.name}
                    </div>

                    {/* レアリティバッジ */}
                    {item.rarity >= 3 && (
                      <div
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full
                          flex items-center justify-center text-[8px]"
                        style={{
                          background: item.rarity >= 4
                            ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                            : 'linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%)',
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        {item.rarity >= 4 ? '👑' : '⭐'}
                      </div>
                    )}

                    {/* 選択インジケーター */}
                    {isSelected && (
                      <div
                        className="absolute -top-1 -left-1 w-5 h-5 rounded-full
                          flex items-center justify-center text-xs"
                        style={{
                          background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                          color: 'white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DecoDrawer
