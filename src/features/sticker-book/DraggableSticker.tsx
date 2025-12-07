'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Sticker } from './StickerTray'

interface DraggableStickerProps {
  sticker: Sticker
  onPlace: (x: number, y: number, rotation: number) => void
  onCancel: () => void
  bookRef: React.RefObject<HTMLDivElement | null>
  bookWidth?: number  // 1ページの幅
  bookHeight?: number // 本の実際の高さ
  isSpreadView?: boolean // 見開き状態かどうか（見開きなら幅は2倍）
  scrollContainerRef?: React.RefObject<HTMLDivElement | null> // スクロールコンテナへの参照
}

// 自動スクロールの設定
const SCROLL_EDGE_THRESHOLD = 60 // 画面端からこのピクセル以内でスクロール開始
const SCROLL_SPEED = 8 // スクロール速度（ピクセル/フレーム）

export function DraggableSticker({
  sticker,
  onPlace,
  onCancel,
  bookRef,
  bookWidth = 300,
  bookHeight = 420,
  isSpreadView = false,
  scrollContainerRef,
}: DraggableStickerProps) {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isOverBook, setIsOverBook] = useState(false)
  const [showInitial, setShowInitial] = useState(true)
  const stickerRef = useRef<HTMLDivElement>(null)
  const initialPos = useRef({ x: 0, y: 0 })
  const activePointerId = useRef<number | null>(null)
  const scrollAnimationRef = useRef<number | null>(null)
  const lastPositionRef = useRef({ x: 0, y: 0 })

  // 本の実際の領域を計算
  // bookRefは正確な幅を持つコンテナを指すので、getBoundingClientRect()で直接位置を取得
  const getActualBookBounds = useCallback(() => {
    if (!bookRef.current) return null
    const containerRect = bookRef.current.getBoundingClientRect()

    // 見開き状態では2ページ分の幅、そうでなければ1ページ分
    const actualBookWidth = isSpreadView ? bookWidth * 2 : bookWidth

    // 重要: containerRectの実際の幅を使用して、コンテナ内での本の位置を計算
    // bookContainerRefの幅とactualBookWidthが異なる場合があるため
    // 常にコンテナの実際の中央に本があると仮定
    const containerWidth = containerRect.width
    const horizontalOffset = (containerWidth - actualBookWidth) / 2

    // 水平方向: コンテナの左端 + 水平オフセット
    const bookLeft = containerRect.left + horizontalOffset
    const bookRight = bookLeft + actualBookWidth

    // 垂直方向: BookView内のflex構造による余白を考慮
    // BookViewは flex-col items-center で、上部にmt-2(8px)程度の余白
    const topOffset = 8
    const bookTop = containerRect.top + topOffset
    const bookBottom = bookTop + bookHeight

    console.log('getActualBookBounds debug:', {
      containerRect: {
        left: containerRect.left,
        width: containerRect.width,
        top: containerRect.top,
      },
      actualBookWidth,
      horizontalOffset,
      bookLeft,
      bookRight,
      isSpreadView,
    })

    return {
      left: bookLeft,
      right: bookRight,
      top: bookTop,
      bottom: bookBottom,
      width: actualBookWidth,
      height: bookHeight,
    }
  }, [bookRef, bookHeight, bookWidth, isSpreadView])

  // 画面中央に初期配置
  useEffect(() => {
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2 - 100
    setPosition({ x: centerX, y: centerY })
    initialPos.current = { x: centerX, y: centerY }
  }, [])

  // アンマウント時にポインターキャプチャを確実に解放
  useEffect(() => {
    return () => {
      if (stickerRef.current && activePointerId.current !== null) {
        try {
          stickerRef.current.releasePointerCapture(activePointerId.current)
        } catch {
          // すでに解放されている場合のエラーを無視
        }
      }
      // スクロールアニメーションもクリーンアップ
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current)
      }
    }
  }, [])

  // 画面端での自動スクロール処理
  const handleEdgeScroll = useCallback(() => {
    if (!isDragging || !scrollContainerRef?.current) {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current)
        scrollAnimationRef.current = null
      }
      return
    }

    const container = scrollContainerRef.current
    const screenWidth = window.innerWidth
    const { x } = lastPositionRef.current

    let scrollDelta = 0

    // 左端に近い場合
    if (x < SCROLL_EDGE_THRESHOLD) {
      scrollDelta = -SCROLL_SPEED * (1 - x / SCROLL_EDGE_THRESHOLD)
    }
    // 右端に近い場合
    else if (x > screenWidth - SCROLL_EDGE_THRESHOLD) {
      scrollDelta = SCROLL_SPEED * (1 - (screenWidth - x) / SCROLL_EDGE_THRESHOLD)
    }

    if (scrollDelta !== 0) {
      container.scrollLeft += scrollDelta
    }

    // 次のフレームでも継続
    scrollAnimationRef.current = requestAnimationFrame(handleEdgeScroll)
  }, [isDragging, scrollContainerRef])

  // ポインターダウン - ドラッグ開始
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setShowInitial(false)
    activePointerId.current = e.pointerId
    stickerRef.current?.setPointerCapture(e.pointerId)
  }, [])

  // ポインターを動かす - ドラッグ中
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return

    const newX = e.clientX
    const newY = e.clientY
    setPosition({ x: newX, y: newY })
    lastPositionRef.current = { x: newX, y: newY }

    // シール帳の実際の領域の上にいるか確認
    const bookBounds = getActualBookBounds()
    if (bookBounds) {
      const isOver = (
        newX >= bookBounds.left &&
        newX <= bookBounds.right &&
        newY >= bookBounds.top &&
        newY <= bookBounds.bottom
      )
      setIsOverBook(isOver)
    }

    // 画面端に近い場合は自動スクロールを開始
    const screenWidth = window.innerWidth
    if (newX < SCROLL_EDGE_THRESHOLD || newX > screenWidth - SCROLL_EDGE_THRESHOLD) {
      if (!scrollAnimationRef.current) {
        scrollAnimationRef.current = requestAnimationFrame(handleEdgeScroll)
      }
    } else {
      // 端から離れたらスクロールを停止
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current)
        scrollAnimationRef.current = null
      }
    }
  }, [isDragging, getActualBookBounds, handleEdgeScroll])

  // ポインターアップ - ドロップ
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return

    setIsDragging(false)

    // 自動スクロールを停止
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current)
      scrollAnimationRef.current = null
    }

    // ポインターキャプチャを確実に解放
    if (stickerRef.current && activePointerId.current !== null) {
      try {
        stickerRef.current.releasePointerCapture(activePointerId.current)
      } catch {
        // すでに解放されている場合のエラーを無視
      }
    }
    activePointerId.current = null

    // シール帳の上でドロップした場合
    const bookBounds = getActualBookBounds()
    if (bookBounds && isOverBook) {
      // 重要: 本の実際の領域を使って相対座標を計算
      // これにより、視覚的なシールの中心位置 = 実際の配置位置 になる
      const relativeX = (position.x - bookBounds.left) / bookBounds.width
      const relativeY = (position.y - bookBounds.top) / bookBounds.height

      console.log('DraggableSticker drop debug:', {
        position,
        bookBounds,
        relativeX,
        relativeY,
        isSpreadView,
      })

      // 範囲内に収める
      const clampedX = Math.max(0.15, Math.min(0.85, relativeX))
      const clampedY = Math.max(0.15, Math.min(0.85, relativeY))

      onPlace(clampedX, clampedY, rotation)
    } else {
      // シール帳の外でドロップした場合、元の位置に戻す
      setPosition(initialPos.current)
      setShowInitial(true)
    }
  }, [isDragging, isOverBook, getActualBookBounds, rotation, onPlace, position, isSpreadView])

  // 回転を変更
  const handleRotationChange = (delta: number) => {
    setRotation(prev => {
      const newRotation = prev + delta
      // -180 to 180 の範囲に正規化
      if (newRotation > 180) return newRotation - 360
      if (newRotation < -180) return newRotation + 360
      return newRotation
    })
  }

  // シール帳上では実際のサイズ(60px)、それ以外では大きめ(90px)で表示
  const actualStickerSize = 60 // 実際に貼られる時のサイズ
  const previewStickerSize = 90 // プレビュー時の大きめサイズ
  const currentSize = isOverBook ? actualStickerSize : previewStickerSize

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* 背景オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onCancel}
      />

      {/* ドラッグ可能なシール */}
      <div
        ref={stickerRef}
        className={`
          absolute pointer-events-auto cursor-grab select-none
          ${isDragging ? 'cursor-grabbing' : ''}
          ${showInitial ? 'animate-bounce-in' : ''}
        `}
        style={{
          // GPU アクセラレーションのため translate3d を使用
          // left/top ではなく transform で位置を設定することでレイアウト再計算を回避
          left: 0,
          top: 0,
          transform: `translate3d(${position.x - currentSize / 2}px, ${position.y - currentSize / 2}px, 0) rotate(${rotation}deg)`,
          width: currentSize,
          height: currentSize,
          touchAction: 'none',
          // will-change で GPU レイヤーを事前に確保
          willChange: isDragging ? 'transform' : 'auto',
          filter: isDragging ? 'drop-shadow(0 8px 16px rgba(139, 92, 246, 0.4))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          // ドラッグ中は transition を無効化して遅延を防ぐ
          transition: isDragging ? 'none' : 'width 0.15s ease-out, height 0.15s ease-out, filter 0.15s ease-out',
          // シール帳上では緑の枠で「ここに貼られる」を明示
          outline: isOverBook ? '3px solid #4ADE80' : 'none',
          outlineOffset: '2px',
          borderRadius: isOverBook ? '8px' : '0',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {sticker.imageUrl ? (
          <img
            src={sticker.imageUrl}
            alt={sticker.name}
            className="w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🌟
          </div>
        )}
      </div>

      {/* コントロールパネル（下部） */}
      {!isDragging && (
        <div
          className="fixed bottom-32 left-4 right-4 pointer-events-auto"
          style={{
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <div
            className="rounded-3xl p-5 mx-auto max-w-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
            }}
          >
            {/* シール名 */}
            <div className="text-center mb-4">
              <h3
                className="text-lg font-bold"
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  color: '#7C3AED',
                }}
              >
                {sticker.name}
              </h3>
              <p
                className="text-xs mt-1"
                style={{
                  color: '#A78BFA',
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                }}
              >
                ドラッグしてシール帳に貼ってね！
              </p>
            </div>

            {/* 回転コントロール */}
            <div className="mb-4">
              <label
                className="text-sm mb-2 block text-center"
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  color: '#8B5CF6',
                }}
              >
                かいてん: {rotation}°
              </label>
              <div className="flex items-center gap-3 justify-center">
                <button
                  onClick={() => handleRotationChange(-15)}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 100%)',
                    color: '#7C3AED',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)',
                  }}
                >
                  ↺
                </button>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #C4B5FD 0%, #8B5CF6 50%, #C4B5FD 100%)`,
                  }}
                />
                <button
                  onClick={() => handleRotationChange(15)}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 100%)',
                    color: '#7C3AED',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)',
                  }}
                >
                  ↻
                </button>
              </div>
            </div>

            {/* キャンセルボタン */}
            <button
              onClick={onCancel}
              className="w-full py-3 rounded-full font-medium transition-all active:scale-98"
              style={{
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#EF4444',
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* ドラッグ中のヒント - シールの下に小さく表示 */}
      {isDragging && (
        <div
          className="fixed pointer-events-none whitespace-nowrap"
          style={{
            // シールの下に表示（シールの中心からオフセット）
            left: position.x,
            top: position.y + currentSize / 2 + 12,
            transform: 'translateX(-50%)',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            background: isOverBook
              ? 'linear-gradient(135deg, #86EFAC 0%, #4ADE80 100%)'
              : 'rgba(255, 255, 255, 0.9)',
            color: isOverBook ? 'white' : '#7C3AED',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'background 0.15s ease-out, color 0.15s ease-out',
            zIndex: 60,
          }}
        >
          {isOverBook ? '✨ はなしてね' : '📖 シール帳へ'}
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0) rotate(${rotation}deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(${rotation}deg);
          }
          100% {
            transform: scale(1) rotate(${rotation}deg);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
        @keyframes slideUp {
          from {
            transform: translateY(100px);
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

export default DraggableSticker
