'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { BookPage, PageTheme } from './BookView'
import { PlacedSticker } from './StickerPlacement'
import { CoverDesign, StickerBookTheme, defaultThemes } from '@/domain/theme'


const mapCornerStyleToDecoration = (
  cornerStyle?: StickerBookTheme['decoration']['cornerStyle']
): PageTheme['decoration'] => {
  switch (cornerStyle) {
    case 'ribbon':
      return 'ribbon'
    case 'heart':
      return 'heart'
    case 'star':
      return 'star'
    case 'flower':
      return 'flower'
    case 'image':
      return 'image'
    default:
      return 'none'
  }
}

const toPageTheme = (theme: StickerBookTheme): PageTheme => ({
  id: theme.id,
  backgroundColor: theme.page.backgroundColor,
  backgroundGradientTo: theme.page.backgroundGradientTo,
  pattern: theme.page.pattern === 'plain' ? 'none' : theme.page.pattern,
  patternColor: theme.page.patternColor,
  patternOpacity: theme.page.patternOpacity,
  frameColor: theme.page.frameColor,
  frameAccentColor: theme.page.frameAccentColor,
  frameGlowColor: theme.page.frameGlowColor,
  decoration: mapCornerStyleToDecoration(theme.decoration.cornerStyle),
  cornerImage: theme.decoration.cornerImage,
})

// ページテーマのプリセット
export const pageThemePresets: { id: string; name: string; emoji: string; theme: PageTheme }[] = [
  { id: 'hearts', name: 'ハート', emoji: '💕', theme: { id: 'hearts', backgroundColor: '#FFF0F5', pattern: 'hearts', decoration: 'heart' } },
  { id: 'stars', name: 'スター', emoji: '⭐', theme: { id: 'stars', backgroundColor: '#FFFAF0', pattern: 'stars', decoration: 'star' } },
  { id: 'dots', name: 'ドット', emoji: '🔵', theme: { id: 'dots', backgroundColor: '#F0FFF0', pattern: 'dots', decoration: 'ribbon' } },
  { id: 'grid', name: 'グリッド', emoji: '📐', theme: { id: 'grid', backgroundColor: '#F0F8FF', pattern: 'grid', decoration: 'none' } },
  { id: 'plain', name: 'シンプル', emoji: '📄', theme: { id: 'plain', backgroundColor: '#FFFFFF', pattern: 'none', decoration: 'none' } },
  ...defaultThemes.map((theme) => ({
    id: theme.id,
    name: theme.name,
    emoji: theme.previewEmoji,
    theme: toPageTheme(theme),
  })),
]

const defaultPageTheme = pageThemePresets.find(preset => preset.id === 'plain')?.theme
  ?? pageThemePresets[0].theme

interface PageEditModalProps {
  isOpen: boolean
  pages: BookPage[]
  placedStickers: PlacedSticker[] // 配置済みシール
  currentCoverId: string
  availableCovers: CoverDesign[]
  onClose: () => void
  onPagesChange: (pages: BookPage[]) => void
  onCoverChange: (coverId: string) => void
}

type TabType = 'pages' | 'cover'

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
  const themeLabel = theme?.id
    ? pageThemePresets.find(preset => preset.id === theme.id)?.name
    : undefined

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={{
        background: isDragOver && !isDragging ? '#F3E8FF' : 'white',
        borderRadius: '16px',
        padding: '12px',
        boxShadow: isDragging
          ? '0 20px 40px rgba(139, 92, 246, 0.4), 0 8px 16px rgba(0, 0, 0, 0.15)'
          : '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderWidth: '2px',
        borderStyle: isDragOver && !isDragging ? 'dashed' : 'solid',
        borderColor: isDragging || (isDragOver && !isDragging)
          ? '#8B5CF6'
          : '#F3E8FF',
        transition: 'all 0.2s',
        cursor: 'default',
        opacity: isDragging ? 0.7 : 1,
        transform: isDragging ? 'scale(1.05) rotate(2deg)' : isDragOver && !isDragging ? 'scale(1.02)' : 'none',
        zIndex: isDragging ? 50 : 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* ドラッグハンドル */}
        <div
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          paddingLeft: '4px',
          paddingRight: '4px',
          paddingTop: '8px',
          paddingBottom: '8px',
          borderRadius: '8px',
          color: isDragging ? '#7C3AED' : '#A78BFA',
          background: isDragging ? '#DDD6FE' : 'transparent',
          transition: 'all 0.15s',
          cursor: 'grab',
          touchAction: 'none',
        }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>⋮⋮</span>
          <span style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>ドラッグ</span>
        </div>

        {/* 見開きプレビュー - 左右ページとシール */}
        <div style={{ display: 'flex', borderRadius: '8px', border: '2px solid #DDD6FE', overflow: 'hidden', position: 'relative' }}>
          {themeLabel && (
            <div
              style={{
                position: 'absolute',
                top: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '2px 6px',
                borderRadius: '9999px',
                background: 'rgba(139, 92, 246, 0.9)',
                color: 'white',
                fontSize: '8px',
                fontWeight: 600,
                zIndex: 5,
                pointerEvents: 'none',
                maxWidth: '88px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {themeLabel}
            </div>
          )}
          {/* 左ページ */}
          <div
            style={{
              width: '48px',
              height: '64px',
              position: 'relative',
              backgroundColor: theme?.backgroundColor || '#FFFFFF',
            }}
          >
            {/* 左ページのシール */}
            {spread.leftPageStickers.slice(0, 3).map((sticker, i) => (
              <div
                key={sticker.id}
                style={{
                  position: 'absolute',
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
                    style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
                  />
                ) : (
                  <span style={{ fontSize: '8px' }}>🌟</span>
                )}
              </div>
            ))}
            {spread.leftPageStickers.length > 3 && (
              <span style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                fontSize: '8px',
                background: '#8B5CF6',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                +{spread.leftPageStickers.length - 3}
              </span>
            )}
          </div>
          {/* 右ページ */}
          <div
            style={{
              width: '48px',
              height: '64px',
              borderLeft: '1px solid #DDD6FE',
              position: 'relative',
              backgroundColor: theme?.backgroundColor || '#FFFFFF',
            }}
          >
            {/* 右ページのシール */}
            {spread.rightPageStickers.slice(0, 3).map((sticker, i) => (
              <div
                key={sticker.id}
                style={{
                  position: 'absolute',
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
                    style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
                  />
                ) : (
                  <span style={{ fontSize: '8px' }}>🌟</span>
                )}
              </div>
            ))}
            {spread.rightPageStickers.length > 3 && (
              <span style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                fontSize: '8px',
                background: '#8B5CF6',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                +{spread.rightPageStickers.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* ページ情報 */}
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 'bold', color: '#6B21A8', fontSize: '14px' }}>
            見開き {spreadIndex + 1}
          </p>
          <p style={{ fontSize: '12px', color: '#A78BFA', marginTop: '2px' }}>
            シール: {spread.leftPageStickers.length + spread.rightPageStickers.length}枚
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowThemeSelect(!showThemeSelect)
            }}
            style={{
              fontSize: '12px',
              color: '#8B5CF6',
              marginTop: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
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
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            flexShrink: 0,
            background: canDelete ? '#FEE2E2' : '#F3F4F6',
            color: canDelete ? '#EF4444' : '#D1D5DB',
            border: 'none',
            cursor: canDelete ? 'pointer' : 'not-allowed',
          }}
        >
          ×
        </button>
      </div>

      {/* テーマ選択パネル */}
      {showThemeSelect && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F3E8FF' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {pageThemePresets.map((preset) => {
              const isSelected = theme?.id
                ? theme.id === preset.id
                : theme?.pattern === preset.theme.pattern &&
                  theme?.decoration === preset.theme.decoration &&
                  theme?.backgroundColor === preset.theme.backgroundColor

              return (
                <button
                  key={preset.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onThemeChange(preset.theme)
                    setShowThemeSelect(false)
                  }}
                  style={{
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    background: isSelected ? '#8B5CF6' : '#F3E8FF',
                    color: isSelected ? 'white' : '#7C3AED',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {preset.emoji} {preset.name}
                </button>
              )
            })}
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
  const isOwned = cover.isOwned
  return (
    <button
      onClick={isOwned ? onSelect : undefined}
      disabled={!isOwned}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        transition: 'all 0.2s',
        border: isSelected ? '4px solid #8B5CF6' : '4px solid transparent',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        cursor: isOwned ? 'pointer' : 'not-allowed',
        background: 'none',
        padding: 0,
        opacity: isOwned ? 1 : 0.6,
      }}
    >
      {/* 表紙プレビュー */}
      <div style={{
        aspectRatio: '3/4',
        background: 'linear-gradient(to bottom right, #F3E8FF, #FCE7F3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {cover.coverImage ? (
          <img src={cover.coverImage} alt={cover.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '36px' }}>{cover.previewEmoji || '📕'}</span>
        )}
      </div>

      {/* 表紙名 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        paddingLeft: '8px',
        paddingRight: '8px',
        paddingTop: '4px',
        paddingBottom: '4px',
      }}>
        <p style={{ color: 'white', fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cover.name}</p>
      </div>

      {/* 未所持マーク */}
      {!cover.isOwned && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(31, 41, 55, 0.7)',
          color: 'white',
          fontSize: '12px',
          paddingLeft: '8px',
          paddingRight: '8px',
          paddingTop: '2px',
          paddingBottom: '2px',
          borderRadius: '9999px',
        }}>
          🔒
        </div>
      )}

      {/* 選択中マーク */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          background: '#8B5CF6',
          color: 'white',
          fontSize: '12px',
          paddingLeft: '8px',
          paddingRight: '8px',
          paddingTop: '2px',
          paddingBottom: '2px',
          borderRadius: '9999px',
        }}>
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
      style={{
        position: 'relative',
        width: '80px',
        height: '96px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s',
        background: isSelected ? '#8B5CF6' : 'white',
        color: isSelected ? 'white' : '#6B21A8',
        border: isSelected ? '4px solid #C4B5FD' : '1px solid #F3E8FF',
        opacity: !charm.isOwned ? 0.5 : 1,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        cursor: !charm.isOwned ? 'not-allowed' : 'pointer',
        transform: !charm.isOwned ? 'none' : 'scale(1)',
      }}
    >
      <span style={{ fontSize: '30px' }}>{charm.emoji}</span>
      <span style={{ fontSize: '12px', fontWeight: 500 }}>{charm.name}</span>

      {!charm.isOwned && (
        <div style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '12px' }}>🔒</div>
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
  onClose,
  onPagesChange,
  onCoverChange,
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
      theme: defaultPageTheme,
    }

    const newRightPage: BookPage = {
      id: `page-${newSpreadIndex}-right-${Date.now()}`,
      type: 'page',
      side: 'right',
      spreadId: newSpreadId,
      theme: defaultPageTheme,
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
      // 左右ページにテーマを適用
      if (page.id === spread.leftPage.id || page.id === spread.rightPage.id) {
        return { ...page, theme }
      }
      return page
    })
    setLocalPages(newPages)
    onPagesChange(newPages)
  }, [localPages, spreads, onPagesChange])

  if (!isOpen) return null

  const isReordering = dragIndex !== null || touchDragIndex !== null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0, // モーダル表示中はタブバーが非表示のため、画面下部まで拡張
      zIndex: 50,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }}>
      {/* オーバーレイ */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }} onClick={onClose} />

      {/* モーダル本体 */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(to bottom, #FAF5FF, #FCE7F3)',
        width: '100%',
        maxWidth: '512px',
        maxHeight: '85vh',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        overflow: 'hidden',
      }}>
        {/* ヘッダー */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '16px',
          paddingBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>📚 シール帳をへんしゅう</h2>
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* タブ */}
        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.5)', borderBottom: '1px solid #F3E8FF' }}>
          {[
            { id: 'pages' as TabType, label: 'ページ', emoji: '📄' },
            { id: 'cover' as TabType, label: 'ひょうし', emoji: '📕' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                paddingTop: '12px',
                paddingBottom: '12px',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s',
                color: activeTab === tab.id ? '#6B21A8' : '#A78BFA',
                borderBottom: activeTab === tab.id ? '2px solid #8B5CF6' : '2px solid transparent',
                background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span style={{ marginRight: '4px' }}>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* コンテンツ */}
        <div
          style={{
            padding: '16px',
            overflowY: isReordering ? 'hidden' : 'auto',
            maxHeight: 'calc(85vh - 140px)',
            overscrollBehavior: 'contain',
            touchAction: isReordering ? 'none' : 'auto',
          }}
        >
          {/* ページ編集タブ */}
          {activeTab === 'pages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* 現在のページ数表示 */}
              <div style={{ textAlign: 'center', fontSize: '14px', color: '#7C3AED', fontWeight: 500 }}>
                現在 {spreads.length} 見開き（{spreads.length * 2} ページ）
              </div>

              {/* ページ追加ボタン */}
              <button
                onClick={handleAddPage}
                style={{
                  width: '100%',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  borderRadius: '16px',
                  background: 'linear-gradient(to right, #4ADE80, #10B981)',
                  color: 'white',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span>➕</span>
                <span>あたらしいページを追加</span>
              </button>

              {/* ドラッグ操作の説明 */}
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#A78BFA', marginBottom: '8px' }}>
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
              <p style={{ fontSize: '14px', color: '#7C3AED', marginBottom: '12px' }}>
                すきなひょうしを選んでね！
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {availableCovers.map((cover) => (
                  <CoverCard
                    key={cover.id}
                    cover={cover}
                    isSelected={cover.id === currentCoverId}
                    onSelect={() => onCoverChange(cover.id)}
                  />
                ))}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default PageEditModal
