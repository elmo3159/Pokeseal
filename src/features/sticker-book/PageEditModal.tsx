'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { BookPage, PageTheme } from './BookView'
import { PlacedSticker } from './StickerPlacement'

// 表紙デザインの型定義
export interface CoverDesign {
  id: string
  name: string
  previewEmoji?: string // プレビュー用の絵文字
  coverImage: string // 実際に使用される表紙画像
  backCoverImage?: string // 裏表紙画像
  category: 'basic' | 'cute' | 'cool' | 'seasonal'
  isOwned: boolean
  obtainMethod: 'default' | 'starpoints' | 'gacha' | 'event'
  starPointCost?: number
}

// ページテーマのプリセット
export const pageThemePresets: { id: string; name: string; emoji: string; theme: PageTheme }[] = [
  { id: 'hearts', name: 'ハート', emoji: '💕', theme: { backgroundColor: '#FFF0F5', pattern: 'hearts', decoration: 'heart' } },
  { id: 'stars', name: 'スター', emoji: '⭐', theme: { backgroundColor: '#FFFAF0', pattern: 'stars', decoration: 'star' } },
  { id: 'dots', name: 'ドット', emoji: '🔵', theme: { backgroundColor: '#F0FFF0', pattern: 'dots', decoration: 'ribbon' } },
  { id: 'grid', name: 'グリッド', emoji: '📐', theme: { backgroundColor: '#F0F8FF', pattern: 'grid', decoration: 'none' } },
  { id: 'plain', name: 'シンプル', emoji: '📄', theme: { backgroundColor: '#FFFFFF', pattern: 'none', decoration: 'none' } },
]

interface PageEditModalProps {
  isOpen: boolean
  pages: BookPage[]
  placedStickers: PlacedSticker[] // 配置済みシール
  currentCoverId: string
  availableCovers: CoverDesign[]
  currentCharmId: string
  availableCharms: { id: string; name: string; emoji: string; isOwned: boolean }[]
  onClose: () => void
  onPagesChange: (pages: BookPage[]) => void
  onCoverChange: (coverId: string) => void
  onCharmChange: (charmId: string) => void
}

type TabType = 'pages' | 'cover' | 'charm'

// 見開きデータの型
interface SpreadData {
  spreadId: string
  leftPage: BookPage
  rightPage: BookPage
  leftPageStickers: PlacedSticker[]
  rightPageStickers: PlacedSticker[]
}

// ページカード（並び替え用）- シールプレビュー付き・ドラッグ&ドロップ対応
const PageCard: React.FC<{
  spread: SpreadData
  spreadIndex: number
  onDelete: () => void
  onThemeChange: (theme: PageTheme) => void
  canDelete: boolean
  // ドラッグ&ドロップ用
  isDragging: boolean
  isDragOver: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  // タッチ用
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
}> = ({
  spread,
  spreadIndex,
  onDelete,
  onThemeChange,
  canDelete,
  isDragging,
  isDragOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  const [showThemeSelect, setShowThemeSelect] = useState(false)
  const theme = spread.leftPage.theme

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`
        bg-white rounded-2xl p-3 shadow-sm border-2 transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 scale-95 border-purple-400' : ''}
        ${isDragOver ? 'border-purple-500 bg-purple-50 scale-102' : 'border-purple-100'}
      `}
    >
      <div className="flex items-center gap-3">
        {/* ドラッグハンドル */}
        <div className="flex flex-col items-center justify-center text-purple-300 select-none">
          <span className="text-lg">⋮⋮</span>
        </div>

        {/* 見開きプレビュー - 左右ページとシール */}
        <div className="flex rounded-lg border-2 border-purple-200 overflow-hidden">
          {/* 左ページ */}
          <div
            className="w-12 h-16 relative"
            style={{ backgroundColor: theme?.backgroundColor || '#FFFFFF' }}
          >
            {/* 左ページのシール */}
            {spread.leftPageStickers.slice(0, 3).map((sticker, i) => (
              <div
                key={sticker.id}
                className="absolute"
                style={{
                  left: `${sticker.x * 100}%`,
                  top: `${sticker.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '16px',
                  height: '16px',
                  zIndex: i,
                }}
              >
                {sticker.sticker.imageUrl ? (
                  <img
                    src={sticker.sticker.imageUrl}
                    alt=""
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <span className="text-[8px]">🌟</span>
                )}
              </div>
            ))}
            {spread.leftPageStickers.length > 3 && (
              <span className="absolute bottom-0 right-0 text-[8px] bg-purple-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                +{spread.leftPageStickers.length - 3}
              </span>
            )}
          </div>
          {/* 右ページ */}
          <div
            className="w-12 h-16 border-l border-purple-200 relative"
            style={{ backgroundColor: theme?.backgroundColor || '#FFFFFF' }}
          >
            {/* 右ページのシール */}
            {spread.rightPageStickers.slice(0, 3).map((sticker, i) => (
              <div
                key={sticker.id}
                className="absolute"
                style={{
                  left: `${sticker.x * 100}%`,
                  top: `${sticker.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '16px',
                  height: '16px',
                  zIndex: i,
                }}
              >
                {sticker.sticker.imageUrl ? (
                  <img
                    src={sticker.sticker.imageUrl}
                    alt=""
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <span className="text-[8px]">🌟</span>
                )}
              </div>
            ))}
            {spread.rightPageStickers.length > 3 && (
              <span className="absolute bottom-0 right-0 text-[8px] bg-purple-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                +{spread.rightPageStickers.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* ページ情報 */}
        <div className="flex-1">
          <p className="font-bold text-purple-700 text-sm">
            見開き {spreadIndex + 1}
          </p>
          <p className="text-xs text-purple-400 mt-0.5">
            シール: {spread.leftPageStickers.length + spread.rightPageStickers.length}枚
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowThemeSelect(!showThemeSelect)
            }}
            className="text-xs text-purple-500 mt-1 hover:underline"
          >
            🎨 テーマを変更
          </button>
        </div>

        {/* 削除ボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          disabled={!canDelete}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0
            ${canDelete ? 'bg-red-100 text-red-500 active:scale-95' : 'bg-gray-100 text-gray-300'}`}
        >
          ×
        </button>
      </div>

      {/* テーマ選択パネル */}
      {showThemeSelect && (
        <div className="mt-3 pt-3 border-t border-purple-100">
          <div className="flex flex-wrap gap-2">
            {pageThemePresets.map((preset) => (
              <button
                key={preset.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onThemeChange(preset.theme)
                  setShowThemeSelect(false)
                }}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium
                  transition-all duration-200
                  ${theme?.decoration === preset.theme.decoration
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}
                `}
              >
                {preset.emoji} {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 表紙カード
const CoverCard: React.FC<{
  cover: CoverDesign
  isSelected: boolean
  onSelect: () => void
}> = ({ cover, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      disabled={!cover.isOwned}
      className={`
        relative rounded-2xl overflow-hidden transition-all duration-200
        ${isSelected ? 'ring-4 ring-purple-500 scale-105' : ''}
        ${!cover.isOwned ? 'opacity-50' : 'hover:scale-102'}
      `}
    >
      {/* 表紙プレビュー */}
      <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
        {cover.coverImage ? (
          <img src={cover.coverImage} alt={cover.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">{cover.previewEmoji || '📕'}</span>
        )}
      </div>

      {/* 表紙名 */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-2 py-1">
        <p className="text-white text-xs font-medium truncate">{cover.name}</p>
      </div>

      {/* 未所持マーク */}
      {!cover.isOwned && (
        <div className="absolute top-2 right-2 bg-gray-800/70 text-white text-xs px-2 py-0.5 rounded-full">
          🔒
        </div>
      )}

      {/* 選択中マーク */}
      {isSelected && (
        <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
          ✓
        </div>
      )}
    </button>
  )
}

// チャームカード
const CharmCard: React.FC<{
  charm: { id: string; name: string; emoji: string; isOwned: boolean }
  isSelected: boolean
  onSelect: () => void
}> = ({ charm, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      disabled={!charm.isOwned}
      className={`
        relative w-20 h-24 rounded-2xl flex flex-col items-center justify-center gap-2
        transition-all duration-200
        ${isSelected ? 'bg-purple-500 text-white ring-4 ring-purple-300' : 'bg-white text-purple-700'}
        ${!charm.isOwned ? 'opacity-50' : 'hover:scale-105'}
        shadow-sm border border-purple-100
      `}
    >
      <span className="text-3xl">{charm.emoji}</span>
      <span className="text-xs font-medium">{charm.name}</span>

      {!charm.isOwned && (
        <div className="absolute top-1 right-1 text-xs">🔒</div>
      )}
    </button>
  )
}

export const PageEditModal: React.FC<PageEditModalProps> = ({
  isOpen,
  pages,
  placedStickers,
  currentCoverId,
  availableCovers,
  currentCharmId,
  availableCharms,
  onClose,
  onPagesChange,
  onCoverChange,
  onCharmChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('pages')
  const [localPages, setLocalPages] = useState<BookPage[]>(pages)

  // ドラッグ&ドロップ用の状態
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // タッチドラッグ用の状態
  const [touchDragIndex, setTouchDragIndex] = useState<number | null>(null)
  const touchStartY = useRef<number>(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // propsが変わったらlocalPagesを更新
  useEffect(() => {
    setLocalPages(pages)
  }, [pages])

  // 見開きデータを構築
  const spreads: SpreadData[] = React.useMemo(() => {
    const result: SpreadData[] = []
    const pageOnlyPages = localPages.filter(p => p.type === 'page')

    // 左ページを基準に見開きを作成
    for (let i = 0; i < pageOnlyPages.length; i += 2) {
      const leftPage = pageOnlyPages[i]
      const rightPage = pageOnlyPages[i + 1]

      if (leftPage && rightPage) {
        result.push({
          spreadId: leftPage.spreadId || `spread-${i/2}`,
          leftPage,
          rightPage,
          leftPageStickers: placedStickers.filter(s => s.pageId === leftPage.id),
          rightPageStickers: placedStickers.filter(s => s.pageId === rightPage.id),
        })
      }
    }

    return result
  }, [localPages, placedStickers])

  // ページを追加
  const handleAddPage = useCallback(() => {
    const newSpreadIndex = spreads.length + 1
    const newSpreadId = `spread-${Date.now()}`

    // 裏表紙の位置を見つける
    const backCoverIndex = localPages.findIndex(p => p.type === 'back-cover')

    const newLeftPage: BookPage = {
      id: `page-${newSpreadIndex}-left-${Date.now()}`,
      type: 'page',
      side: 'left',
      spreadId: newSpreadId,
      theme: pageThemePresets[0].theme,
    }

    const newRightPage: BookPage = {
      id: `page-${newSpreadIndex}-right-${Date.now()}`,
      type: 'page',
      side: 'right',
      spreadId: newSpreadId,
    }

    const newPages = [...localPages]
    newPages.splice(backCoverIndex, 0, newLeftPage, newRightPage)
    setLocalPages(newPages)
    onPagesChange(newPages)
  }, [localPages, spreads.length, onPagesChange])

  // ページを削除
  const handleDeletePage = useCallback((spreadIndex: number) => {
    const spreadToDelete = spreads[spreadIndex]
    if (!spreadToDelete) return

    const newPages = localPages.filter(p =>
      p.id !== spreadToDelete.leftPage.id && p.id !== spreadToDelete.rightPage.id
    )
    setLocalPages(newPages)
    onPagesChange(newPages)
  }, [localPages, spreads, onPagesChange])

  // ページを並び替え（ドラッグ&ドロップ用）
  const handleReorderSpreads = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    // ページ配列を再構築
    const cover = localPages.filter(p => p.type === 'cover')
    const backCover = localPages.filter(p => p.type === 'back-cover')

    // 新しい見開き順序を作成
    const newSpreads = [...spreads]
    const [movedSpread] = newSpreads.splice(fromIndex, 1)
    newSpreads.splice(toIndex, 0, movedSpread)

    // ページ配列に変換
    const newMiddlePages = newSpreads.flatMap(s => [s.leftPage, s.rightPage])
    const newPages = [...cover, ...newMiddlePages, ...backCover]

    setLocalPages(newPages)
    onPagesChange(newPages)
  }, [localPages, spreads, onPagesChange])

  // ドラッグ&ドロップハンドラー
  const handleDragStart = useCallback((index: number) => (e: React.DragEvent) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setDragOverIndex(null)
  }, [])

  const handleDragOver = useCallback((index: number) => (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragIndex !== null && dragIndex !== index) {
      setDragOverIndex(index)
    }
  }, [dragIndex])

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null)
  }, [])

  const handleDrop = useCallback((toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
    if (!isNaN(fromIndex) && fromIndex !== toIndex) {
      handleReorderSpreads(fromIndex, toIndex)
    }
    setDragIndex(null)
    setDragOverIndex(null)
  }, [handleReorderSpreads])

  // タッチドラッグハンドラー（モバイル対応）
  const handleTouchStart = useCallback((index: number) => (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
    setTouchDragIndex(index)
  }, [])

  const handleTouchMove = useCallback((index: number) => (e: React.TouchEvent) => {
    if (touchDragIndex === null) return

    const currentY = e.touches[0].clientY
    const deltaY = currentY - touchStartY.current

    // 上下の移動量で移動先を判定
    const cardHeight = 100 // おおよそのカード高さ
    const moveCount = Math.round(deltaY / cardHeight)

    if (moveCount !== 0) {
      const targetIndex = Math.max(0, Math.min(spreads.length - 1, index + moveCount))
      setDragOverIndex(targetIndex !== index ? targetIndex : null)
    }
  }, [touchDragIndex, spreads.length])

  const handleTouchEnd = useCallback((index: number) => () => {
    if (touchDragIndex !== null && dragOverIndex !== null && touchDragIndex !== dragOverIndex) {
      handleReorderSpreads(touchDragIndex, dragOverIndex)
    }
    setTouchDragIndex(null)
    setDragOverIndex(null)
  }, [touchDragIndex, dragOverIndex, handleReorderSpreads])

  // テーマ変更
  const handleThemeChange = useCallback((spreadIndex: number, theme: PageTheme) => {
    const spread = spreads[spreadIndex]
    if (!spread) return

    const newPages = localPages.map(page => {
      // 左ページにテーマを適用
      if (page.id === spread.leftPage.id) {
        return { ...page, theme }
      }
      return page
    })
    setLocalPages(newPages)
    onPagesChange(newPages)
  }, [localPages, spreads, onPagesChange])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* モーダル本体 */}
      <div className="relative bg-gradient-to-b from-purple-50 to-pink-50 w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">📚 シール帳をへんしゅう</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* タブ */}
        <div className="flex bg-white/50 border-b border-purple-100">
          {[
            { id: 'pages' as TabType, label: 'ページ', emoji: '📄' },
            { id: 'cover' as TabType, label: 'ひょうし', emoji: '📕' },
            { id: 'charm' as TabType, label: 'チャーム', emoji: '✨' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? 'text-purple-700 border-b-2 border-purple-500 bg-white/50'
                  : 'text-purple-400'}`}
            >
              <span className="mr-1">{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* コンテンツ */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {/* ページ編集タブ */}
          {activeTab === 'pages' && (
            <div className="space-y-3">
              {/* 現在のページ数表示 */}
              <div className="text-center text-sm text-purple-600 font-medium">
                現在 {spreads.length} 見開き（{spreads.length * 2} ページ）
              </div>

              {/* ページ追加ボタン */}
              <button
                onClick={handleAddPage}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold flex items-center justify-center gap-2 active:scale-98"
              >
                <span>➕</span>
                <span>あたらしいページを追加</span>
              </button>

              {/* ドラッグ操作の説明 */}
              <div className="text-center text-xs text-purple-400 mb-2">
                ⋮⋮ をドラッグして並び替えできます
              </div>

              {/* ページ一覧 */}
              {spreads.map((spread, index) => (
                <PageCard
                  key={`${spread.leftPage.id}-${spread.rightPage.id}`}
                  spread={spread}
                  spreadIndex={index}
                  onDelete={() => handleDeletePage(index)}
                  onThemeChange={(theme) => handleThemeChange(index, theme)}
                  canDelete={spreads.length > 1}
                  // ドラッグ&ドロップ
                  isDragging={dragIndex === index || touchDragIndex === index}
                  isDragOver={dragOverIndex === index}
                  onDragStart={handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver(index)}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop(index)}
                  // タッチ
                  onTouchStart={handleTouchStart(index)}
                  onTouchMove={handleTouchMove(index)}
                  onTouchEnd={handleTouchEnd(index)}
                />
              ))}
            </div>
          )}

          {/* 表紙編集タブ */}
          {activeTab === 'cover' && (
            <div>
              <p className="text-sm text-purple-600 mb-3">
                すきなひょうしを選んでね！
              </p>
              <div className="grid grid-cols-3 gap-3">
                {availableCovers.map((cover) => (
                  <CoverCard
                    key={cover.id}
                    cover={cover}
                    isSelected={cover.id === currentCoverId}
                    onSelect={() => onCoverChange(cover.id)}
                  />
                ))}
              </div>

              {/* 表紙画像の説明 */}
              <div className="mt-6 p-4 bg-white/70 rounded-2xl">
                <h4 className="font-bold text-purple-700 text-sm mb-2">📐 カスタム表紙について</h4>
                <p className="text-xs text-purple-600 leading-relaxed">
                  オリジナルの表紙を作成する場合は、以下のサイズで画像を用意してください：
                </p>
                <ul className="text-xs text-purple-500 mt-2 space-y-1">
                  <li>• 表紙サイズ: <strong>320 × 480 ピクセル</strong></li>
                  <li>• 裏表紙サイズ: <strong>320 × 480 ピクセル</strong></li>
                  <li>• 形式: PNG または JPEG</li>
                </ul>
                <div className="mt-3 flex justify-center">
                  <div className="flex border-2 border-purple-300 rounded-lg overflow-hidden text-xs">
                    <div className="w-16 h-24 bg-purple-100 flex items-center justify-center border-r border-purple-200">
                      裏表紙
                    </div>
                    <div className="w-2 h-24 bg-purple-300 flex items-center justify-center border-r border-purple-200">
                    </div>
                    <div className="w-16 h-24 bg-purple-100 flex items-center justify-center">
                      表紙
                    </div>
                  </div>
                </div>
                <p className="text-xs text-purple-400 mt-2 text-center">
                  ※ 背表紙は自動生成されます
                </p>
              </div>
            </div>
          )}

          {/* チャーム編集タブ */}
          {activeTab === 'charm' && (
            <div>
              <p className="text-sm text-purple-600 mb-3">
                シール帳につけるチャームを選んでね！
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {availableCharms.map((charm) => (
                  <CharmCard
                    key={charm.id}
                    charm={charm}
                    isSelected={charm.id === currentCharmId}
                    onSelect={() => onCharmChange(charm.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default PageEditModal
