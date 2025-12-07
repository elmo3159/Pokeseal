'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { StickerCard } from '@/components/ui/Card'

// シールの型定義
export interface Sticker {
  id: string
  name: string
  imageUrl?: string
  rarity: number // 1-5
  type: 'normal' | 'puffy' | 'sparkle'
  series?: string
}

interface StickerTrayProps {
  stickers: Sticker[]
  onStickerSelect?: (sticker: Sticker) => void
  selectedStickerId?: string | null
}

// フィルターオプション
type RarityFilter = 'all' | 1 | 2 | 3 | 4 | 5
type TypeFilter = 'all' | 'normal' | 'puffy' | 'sparkle'

// 高さの定義
const COLLAPSED_HEIGHT = 140 // コンパクト表示（画像のみ）の高さ
const EXPANDED_HEIGHT_VH = 75 // 画面の75%
const DEFAULT_EXPANDED_HEIGHT = 500 // SSR時のデフォルト値

export function StickerTray({
  stickers,
  onStickerSelect,
  selectedStickerId,
}: StickerTrayProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [isExpanded, setIsExpanded] = useState(false)

  // ドラッグ関連の状態
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [currentHeight, setCurrentHeight] = useState(COLLAPSED_HEIGHT)
  const containerRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const activePointerId = useRef<number | null>(null)

  // クライアントサイドでのみ高さを計算（ハイドレーション対策）
  const [isMounted, setIsMounted] = useState(false)
  const [expandedHeight, setExpandedHeight] = useState(DEFAULT_EXPANDED_HEIGHT)

  useEffect(() => {
    setIsMounted(true)
    // クライアントサイドで実際の高さを計算
    const calculateHeight = () => {
      const height = Math.min(
        window.innerHeight * (EXPANDED_HEIGHT_VH / 100),
        window.innerHeight - 120
      )
      setExpandedHeight(height)
    }
    calculateHeight()

    // リサイズ時に再計算
    window.addEventListener('resize', calculateHeight)
    return () => window.removeEventListener('resize', calculateHeight)
  }, [])

  // フィルタリング
  const filteredStickers = stickers.filter((sticker) => {
    if (rarityFilter !== 'all' && sticker.rarity !== rarityFilter) return false
    if (typeFilter !== 'all' && sticker.type !== typeFilter) return false
    return true
  })

  // シール選択時にトレイを閉じる
  const handleStickerClick = (sticker: Sticker) => {
    onStickerSelect?.(sticker)
    // 選択後にトレイを閉じる
    setIsExpanded(false)
    setCurrentHeight(COLLAPSED_HEIGHT)
  }

  // ドラッグ開始
  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true)
    setDragStartY(clientY)
  }, [])

  // ドラッグ中
  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return

    const deltaY = dragStartY - clientY // 上方向が正、下方向が負

    let newHeight: number
    if (isExpanded) {
      // 展開状態から縮小: 下スワイプ(deltaY負)で高さを減らす
      newHeight = expandedHeight + deltaY
    } else {
      // 縮小状態から展開: 上スワイプ(deltaY正)で高さを増やす
      newHeight = COLLAPSED_HEIGHT + deltaY
    }

    // 範囲制限
    newHeight = Math.max(COLLAPSED_HEIGHT, Math.min(expandedHeight, newHeight))
    setCurrentHeight(newHeight)
  }, [isDragging, dragStartY, isExpanded, expandedHeight])

  // ドラッグ終了
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = (expandedHeight - COLLAPSED_HEIGHT) / 2 + COLLAPSED_HEIGHT

    // しきい値を超えたら展開/縮小を切り替え
    if (currentHeight > threshold) {
      setIsExpanded(true)
      setCurrentHeight(expandedHeight)
    } else {
      setIsExpanded(false)
      setCurrentHeight(COLLAPSED_HEIGHT)
    }
  }, [isDragging, currentHeight, expandedHeight])

  // ポインターイベントハンドラー
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    handleDragStart(e.clientY)
    activePointerId.current = e.pointerId
    handleRef.current?.setPointerCapture(e.pointerId)
  }, [handleDragStart])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    handleDragMove(e.clientY)
  }, [handleDragMove])

  const handlePointerUp = useCallback(() => {
    // ポインターキャプチャを確実に解放
    if (handleRef.current && activePointerId.current !== null) {
      try {
        handleRef.current.releasePointerCapture(activePointerId.current)
      } catch {
        // すでに解放されている場合のエラーを無視
      }
    }
    activePointerId.current = null
    handleDragEnd()
  }, [handleDragEnd])

  // タップで切り替え
  const handleHandleTap = useCallback(() => {
    if (isDragging) return
    if (isExpanded) {
      setIsExpanded(false)
      setCurrentHeight(COLLAPSED_HEIGHT)
    } else {
      setIsExpanded(true)
      setCurrentHeight(expandedHeight)
    }
  }, [isDragging, isExpanded, expandedHeight])

  return (
    <>
      {/* 展開時のオーバーレイ背景 */}
      {(isExpanded || isDragging) && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          style={{
            opacity: isDragging
              ? Math.min(1, (currentHeight - COLLAPSED_HEIGHT) / (expandedHeight - COLLAPSED_HEIGHT) * 0.5)
              : 0.5,
            transition: isDragging ? 'none' : 'opacity 0.3s ease-out',
          }}
          onClick={() => {
            setIsExpanded(false)
            setCurrentHeight(COLLAPSED_HEIGHT)
          }}
        />
      )}

      <div
        ref={containerRef}
        className="fixed left-4 right-4"
        style={{
          zIndex: 250,
          bottom: '100px',
          // シンプルな高さベースのアプローチ - 表示する高さだけを設定
          height: isDragging ? currentHeight : (isExpanded ? expandedHeight : COLLAPSED_HEIGHT),
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: (isExpanded || (isDragging && currentHeight > COLLAPSED_HEIGHT + 50))
            ? '0 -8px 48px rgba(139, 92, 246, 0.25)'
            : '0 8px 32px rgba(139, 92, 246, 0.12)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          // ドラッグ中は即座に、それ以外はスムーズにアニメーション
          transition: isDragging ? 'none' : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease-out',
          willChange: isDragging ? 'height' : 'auto',
        }}
      >
        {/* ドラッグハンドル */}
        <div
          ref={handleRef}
          className="flex flex-col items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleHandleTap}
        >
          {/* ハンドルバー */}
          <div
            className="w-12 h-1.5 rounded-full transition-all duration-200"
            style={{
              background: 'linear-gradient(90deg, #C4B5FD 0%, #F9A8D4 100%)',
            }}
          />
          {/* スワイプヒント */}
          <p
            className="text-xs mt-1.5 transition-opacity duration-200"
            style={{
              color: '#A78BFA',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              opacity: isExpanded ? 0 : 0.8,
            }}
          >
            ↕️ スワイプで開閉 ↔️ 横スクロール
          </p>
        </div>

        {/* フィルターバー（展開時のみ） */}
        {isExpanded && (
          <div
            className="flex flex-wrap items-center gap-2 px-4 pb-3 overflow-x-auto"
            style={{
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {/* レア度フィルター */}
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 1, 2, 3, 4, 5] as RarityFilter[]).map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => setRarityFilter(rarity)}
                  className="px-2.5 py-1 rounded-full text-xs transition-all duration-300"
                  style={{
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    fontWeight: 500,
                    backgroundColor:
                      rarityFilter === rarity
                        ? 'rgba(167, 139, 250, 0.25)'
                        : 'rgba(255, 255, 255, 0.6)',
                    color:
                      rarityFilter === rarity
                        ? '#7C3AED'
                        : '#A78BFA',
                    boxShadow: rarityFilter === rarity
                      ? '0 2px 8px rgba(139, 92, 246, 0.15)'
                      : 'none',
                  }}
                >
                  {rarity === 'all' ? 'ぜんぶ' : '★'.repeat(rarity)}
                </button>
              ))}
            </div>

            {/* 種類フィルター */}
            <div className="flex gap-1.5 flex-wrap">
              {(
                [
                  { key: 'all', label: 'すべて' },
                  { key: 'normal', label: 'ふつう' },
                  { key: 'puffy', label: 'ぷっくり' },
                  { key: 'sparkle', label: 'キラキラ' },
                ] as { key: TypeFilter; label: string }[]
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTypeFilter(key)}
                  className="px-2.5 py-1 rounded-full text-xs transition-all duration-300 whitespace-nowrap"
                  style={{
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    fontWeight: 500,
                    backgroundColor:
                      typeFilter === key
                        ? 'rgba(249, 168, 212, 0.25)'
                        : 'rgba(255, 255, 255, 0.6)',
                    color:
                      typeFilter === key
                        ? '#DB2777'
                        : '#F9A8D4',
                    boxShadow: typeFilter === key
                      ? '0 2px 8px rgba(244, 114, 182, 0.15)'
                      : 'none',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* シール一覧 */}
        <div
          ref={scrollRef}
          className="px-4 pb-2 overflow-auto"
          style={{
            height: isExpanded ? 'calc(100% - 100px)' : 'calc(100% - 50px)',
            scrollbarWidth: 'thin',
          }}
        >
          {filteredStickers.length === 0 ? (
            <div
              className="flex items-center justify-center w-full py-8"
              style={{
                color: '#A78BFA',
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
              }}
            >
              <p className="text-sm">シールがありません</p>
            </div>
          ) : isExpanded ? (
            // 展開時: グリッド表示
            <div className="grid grid-cols-4 gap-3">
              {filteredStickers.map((sticker) => (
                <div key={sticker.id} className="flex justify-center">
                  <StickerCard
                    imageUrl={sticker.imageUrl}
                    name={sticker.name}
                    rarity={sticker.rarity}
                    onClick={() => handleStickerClick(sticker)}
                    selected={selectedStickerId === sticker.id}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          ) : (
            // 縮小時: 横スクロール（コンパクト表示）
            <div
              className="flex gap-3 overflow-x-auto scrollbar-hide"
              style={{
                scrollSnapType: 'x mandatory',
              }}
            >
              {filteredStickers.map((sticker) => (
                <div
                  key={sticker.id}
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <StickerCard
                    imageUrl={sticker.imageUrl}
                    name={sticker.name}
                    rarity={sticker.rarity}
                    onClick={() => handleStickerClick(sticker)}
                    selected={selectedStickerId === sticker.id}
                    size="sm"
                    compact={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
