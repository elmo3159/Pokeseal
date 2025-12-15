'use client'

import { useCallback } from 'react'

// レイヤーアイテムの共通型
export interface LayerItem {
  id: string
  type: 'sticker' | 'deco'
  name: string
  imageUrl?: string // 画像URLはオプショナル
  zIndex: number
}

interface LayerControlPanelProps {
  /** 現在のページにある全アイテム */
  items: LayerItem[]
  /** 選択中のアイテムID */
  selectedItemId: string | null
  /** アイテム選択コールバック */
  onSelectItem: (id: string) => void
  /** z-index変更コールバック */
  onChangeZIndex: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void
  /** パネルが開いているか */
  isOpen: boolean
  /** 開閉コールバック */
  onClose: () => void
}

/**
 * レイヤー制御パネル
 * シールやデコの重なり順（前面・背面）を調整するUI
 * 小学生でもわかりやすい「前に」「後ろに」ボタン
 */
export function LayerControlPanel({
  items,
  selectedItemId,
  onSelectItem,
  onChangeZIndex,
  isOpen,
  onClose,
}: LayerControlPanelProps) {
  // z-indexでソート（大きい順 = 前面が上）
  const sortedItems = [...items].sort((a, b) => b.zIndex - a.zIndex)

  // レイヤー移動ハンドラー
  const handleMoveUp = useCallback(() => {
    if (selectedItemId) {
      onChangeZIndex(selectedItemId, 'up')
    }
  }, [selectedItemId, onChangeZIndex])

  const handleMoveDown = useCallback(() => {
    if (selectedItemId) {
      onChangeZIndex(selectedItemId, 'down')
    }
  }, [selectedItemId, onChangeZIndex])

  const handleMoveTop = useCallback(() => {
    if (selectedItemId) {
      onChangeZIndex(selectedItemId, 'top')
    }
  }, [selectedItemId, onChangeZIndex])

  const handleMoveBottom = useCallback(() => {
    if (selectedItemId) {
      onChangeZIndex(selectedItemId, 'bottom')
    }
  }, [selectedItemId, onChangeZIndex])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] rounded-t-2xl shadow-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F8 100%)',
          maxHeight: '70vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
          }}
        >
          <h2
            className="text-white font-bold text-base"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            📚 レイヤー（かさなり）
          </h2>
          <button
            onClick={onClose}
            className="text-white text-xl leading-none hover:opacity-70"
          >
            ×
          </button>
        </div>

        {/* 説明 */}
        <div
          className="px-4 py-2 text-xs text-purple-600"
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          💡 「前に」「後ろに」でシールの重なり順を変えられるよ！
        </div>

        {/* コントロールボタン */}
        {selectedItemId && (
          <div
            className="px-4 py-3 flex justify-center gap-2"
            style={{
              borderBottom: '1px solid #E9D5FF',
            }}
          >
            <button
              onClick={handleMoveTop}
              className="px-3 py-2 rounded-lg text-xs font-bold
                bg-purple-100 text-purple-700 hover:bg-purple-200
                transition-all duration-200 active:scale-95"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              ⏫ いちばん前
            </button>
            <button
              onClick={handleMoveUp}
              className="px-4 py-2 rounded-lg text-sm font-bold
                bg-purple-500 text-white hover:bg-purple-600
                transition-all duration-200 active:scale-95 shadow-md"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              ⬆️ 前に
            </button>
            <button
              onClick={handleMoveDown}
              className="px-4 py-2 rounded-lg text-sm font-bold
                bg-purple-500 text-white hover:bg-purple-600
                transition-all duration-200 active:scale-95 shadow-md"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              ⬇️ 後ろに
            </button>
            <button
              onClick={handleMoveBottom}
              className="px-3 py-2 rounded-lg text-xs font-bold
                bg-purple-100 text-purple-700 hover:bg-purple-200
                transition-all duration-200 active:scale-95"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              ⏬ いちばん後ろ
            </button>
          </div>
        )}

        {/* レイヤーリスト */}
        <div
          className="px-4 py-3 overflow-y-auto"
          style={{
            maxHeight: '300px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#D8B4FE transparent',
          }}
        >
          {sortedItems.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-sm">
              まだ何も置いていないよ
            </div>
          ) : (
            <div className="space-y-2">
              {sortedItems.map((item, index) => {
                const isSelected = item.id === selectedItemId
                const isTop = index === 0
                const isBottom = index === sortedItems.length - 1

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem(item.id)}
                    className={`
                      w-full flex items-center gap-3 p-2 rounded-xl
                      transition-all duration-200
                      ${isSelected
                        ? 'bg-purple-100 ring-2 ring-purple-500 shadow-md'
                        : 'bg-white hover:bg-purple-50 shadow-sm'
                      }
                    `}
                  >
                    {/* 順番バッジ */}
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center
                        text-xs font-bold flex-shrink-0"
                      style={{
                        background: isTop
                          ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                          : isBottom
                            ? 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)'
                            : 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                        color: 'white',
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* アイテムサムネイル */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center
                        text-lg flex-shrink-0 overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #F5F5F5 0%, #EBEBEB 100%)',
                      }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          draggable={false}
                        />
                      ) : (
                        item.type === 'sticker' ? '🏷️' : '✨'
                      )}
                    </div>

                    {/* アイテム情報 */}
                    <div className="flex-1 text-left min-w-0">
                      <div
                        className="text-sm font-bold truncate"
                        style={{
                          color: isSelected ? '#7C3AED' : '#374151',
                          fontFamily: "'M PLUS Rounded 1c', sans-serif",
                        }}
                      >
                        {item.name}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {item.type === 'sticker' ? 'シール' : 'デコ'}
                        {isTop && ' • 🔝いちばん前'}
                        {isBottom && ' • いちばん後ろ'}
                      </div>
                    </div>

                    {/* 選択インジケーター */}
                    {isSelected && (
                      <div className="text-purple-500 text-lg">✓</div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* フッター */}
        <div
          className="px-4 py-3 text-center"
          style={{
            borderTop: '1px solid #E9D5FF',
            background: 'rgba(139, 92, 246, 0.05)',
          }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full text-sm font-bold
              bg-purple-500 text-white hover:bg-purple-600
              transition-all duration-200 active:scale-95 shadow-md"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            かんりょう！
          </button>
        </div>
      </div>
    </div>
  )
}

export default LayerControlPanel
