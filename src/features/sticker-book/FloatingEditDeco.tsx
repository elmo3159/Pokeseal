'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { PlacedDecoItem } from '@/domain/decoItems'

interface FloatingEditDecoProps {
  decoItem: PlacedDecoItem
  bookContainerRef: React.RefObject<HTMLDivElement | null>
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
  pageWidth: number
  pageHeight: number
  isSpreadView: boolean
  pageSide?: 'left' | 'right'
  onDrag: (x: number, y: number) => void
  onResize: (width: number, height: number) => void
  onRotate: (rotation: number) => void
  onDragEnd?: () => void
  onPageSideChange?: (newSide: 'left' | 'right') => void
}

// 自動スクロールの設定
const SCROLL_EDGE_THRESHOLD = 60
const SCROLL_SPEED = 8

// リサイズの最小/最大サイズ（小さすぎず大きすぎない範囲）
const MIN_WIDTH = 40
const MIN_HEIGHT = 25
const MAX_WIDTH = 280
const MAX_HEIGHT = 70

/**
 * 編集中のデコアイテムをBookViewの外側にフローティング表示するコンポーネント
 * リサイズハンドル付きで、ユーザーが長さを調整できる
 */
export function FloatingEditDeco({
  decoItem,
  bookContainerRef,
  scrollContainerRef,
  pageWidth,
  pageHeight,
  isSpreadView,
  pageSide,
  onDrag,
  onResize,
  onRotate,
  onDragEnd,
  onPageSideChange,
}: FloatingEditDecoProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<'left' | 'right' | 'top' | 'bottom' | null>(null)
  const [currentRotation, setCurrentRotation] = useState(decoItem.rotation ?? 0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({
    width: decoItem.width ?? decoItem.decoItem.baseWidth ?? 60,
    height: decoItem.height ?? decoItem.decoItem.baseHeight ?? 60
  })
  const decoRef = useRef<HTMLDivElement>(null)
  const currentPageSideRef = useRef<'left' | 'right' | undefined>(pageSide)

  const isDraggingRef = useRef(false)
  const isResizingRef = useRef(false)
  const isRotatingRef = useRef(false)
  const activePointerId = useRef<number | null>(null)
  const scrollAnimationRef = useRef<number | null>(null)
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const rotationStartAngleRef = useRef<number>(0)
  const rotationStartValueRef = useRef<number>(0)

  // 本の実際の領域を計算
  const getActualBookBounds = useCallback(() => {
    if (!bookContainerRef.current) return null
    const containerRect = bookContainerRef.current.getBoundingClientRect()

    const actualBookWidth = isSpreadView ? pageWidth * 2 : pageWidth
    const containerWidth = containerRect.width
    const horizontalOffset = (containerWidth - actualBookWidth) / 2

    const bookLeft = containerRect.left + horizontalOffset
    const topOffset = 8
    const bookTop = containerRect.top + topOffset

    return {
      left: bookLeft,
      top: bookTop,
      width: actualBookWidth,
      height: pageHeight,
    }
  }, [bookContainerRef, pageWidth, pageHeight, isSpreadView])

  // 初期位置を計算
  useEffect(() => {
    if (isDraggingRef.current || isResizingRef.current) return

    const bounds = getActualBookBounds()
    if (!bounds) return

    let absoluteX: number
    if (isSpreadView && pageSide === 'right') {
      absoluteX = bounds.left + pageWidth + (decoItem.x * pageWidth) - size.width / 2
    } else {
      absoluteX = bounds.left + (decoItem.x * pageWidth) - size.width / 2
    }
    const absoluteY = bounds.top + (decoItem.y * pageHeight) - size.height / 2

    setPosition({ x: absoluteX, y: absoluteY })
  }, [getActualBookBounds, decoItem.x, decoItem.y, pageWidth, pageHeight, isSpreadView, pageSide, size.width, size.height])

  // サイズの同期
  useEffect(() => {
    const newWidth = decoItem.width ?? decoItem.decoItem.baseWidth ?? 60
    const newHeight = decoItem.height ?? decoItem.decoItem.baseHeight ?? 60
    setSize({ width: newWidth, height: newHeight })
  }, [decoItem.width, decoItem.height, decoItem.decoItem.baseWidth, decoItem.decoItem.baseHeight])

  // 回転の同期
  useEffect(() => {
    setCurrentRotation(decoItem.rotation ?? 0)
  }, [decoItem.rotation])

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (decoRef.current && activePointerId.current !== null) {
        try {
          decoRef.current.releasePointerCapture(activePointerId.current)
        } catch {}
      }
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current)
      }
    }
  }, [])

  const isAutoScrollingRef = useRef(false)
  const bookBoundsRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; width: number; height: number; posX: number; posY: number }>({ mouseX: 0, mouseY: 0, width: 0, height: 0, posX: 0, posY: 0 })

  // 自動スクロール
  const handleEdgeScroll = useCallback(() => {
    if ((!isDraggingRef.current && !isResizingRef.current && !isRotatingRef.current) || !scrollContainerRef?.current) {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current)
        scrollAnimationRef.current = null
      }
      isAutoScrollingRef.current = false
      return
    }

    const container = scrollContainerRef.current
    const screenWidth = window.innerWidth
    const { x } = lastPositionRef.current

    let scrollDelta = 0

    if (x < SCROLL_EDGE_THRESHOLD) {
      scrollDelta = -SCROLL_SPEED * (1 - x / SCROLL_EDGE_THRESHOLD)
    } else if (x > screenWidth - SCROLL_EDGE_THRESHOLD) {
      scrollDelta = SCROLL_SPEED * (1 - (screenWidth - x) / SCROLL_EDGE_THRESHOLD)
    }

    if (scrollDelta !== 0) {
      isAutoScrollingRef.current = true
      container.scrollLeft += scrollDelta
      bookBoundsRef.current = getActualBookBounds()
    } else {
      isAutoScrollingRef.current = false
    }

    scrollAnimationRef.current = requestAnimationFrame(handleEdgeScroll)
  }, [scrollContainerRef, getActualBookBounds])

  // ドラッグ開始
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (decoRef.current) {
      bookBoundsRef.current = getActualBookBounds()
      dragOffsetRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }

      isDraggingRef.current = true
      setIsDragging(true)
      activePointerId.current = e.pointerId
      decoRef.current.setPointerCapture(e.pointerId)
    }
  }, [getActualBookBounds, position])

  // ドラッグ中
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging && !isResizing && !isRotating) return
    e.stopPropagation()

    lastPositionRef.current = { x: e.clientX, y: e.clientY }

    // 回転中の処理
    if (isRotating) {
      // デコアイテムの中心座標を計算
      const centerX = position.x + size.width / 2
      const centerY = position.y + size.height / 2

      // 中心からカーソルへの角度を計算
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)

      // 角度の差分から回転量を計算
      const angleDelta = currentAngle - rotationStartAngleRef.current
      let newRotation = rotationStartValueRef.current + angleDelta

      // -180〜180度の範囲に正規化
      while (newRotation > 180) newRotation -= 360
      while (newRotation < -180) newRotation += 360

      // 15度単位でスナップ（近い場合）
      const snapAngle = Math.round(newRotation / 15) * 15
      if (Math.abs(newRotation - snapAngle) < 5) {
        newRotation = snapAngle
      }

      setCurrentRotation(newRotation)
      onRotate(newRotation)
      return
    }

    if (isDragging) {
      const offset = dragOffsetRef.current
      const newX = e.clientX - offset.x
      const newY = e.clientY - offset.y
      setPosition({ x: newX, y: newY })

      // 自動スクロール
      const screenWidth = window.innerWidth
      if (e.clientX < SCROLL_EDGE_THRESHOLD || e.clientX > screenWidth - SCROLL_EDGE_THRESHOLD) {
        if (!scrollAnimationRef.current) {
          scrollAnimationRef.current = requestAnimationFrame(handleEdgeScroll)
        }
      } else {
        if (scrollAnimationRef.current) {
          cancelAnimationFrame(scrollAnimationRef.current)
          scrollAnimationRef.current = null
        }
      }

      // 相対座標を計算
      const bounds = bookBoundsRef.current
      if (bounds) {
        const decoCenterX = newX + size.width / 2
        const decoCenterY = newY + size.height / 2

        let relativeX: number
        if (isSpreadView) {
          const spreadRelativeX = (decoCenterX - bounds.left) / bounds.width
          const newPageSide: 'left' | 'right' = spreadRelativeX >= 0.5 ? 'right' : 'left'

          if (newPageSide !== currentPageSideRef.current) {
            currentPageSideRef.current = newPageSide
            onPageSideChange?.(newPageSide)
          }

          if (newPageSide === 'right') {
            relativeX = (spreadRelativeX - 0.5) * 2
          } else {
            relativeX = spreadRelativeX * 2
          }
        } else {
          relativeX = (decoCenterX - bounds.left) / bounds.width
        }

        const relativeY = (decoCenterY - bounds.top) / bounds.height
        const clampedX = Math.max(0.05, Math.min(0.95, relativeX))
        const clampedY = Math.max(0.05, Math.min(0.95, relativeY))

        onDrag(clampedX, clampedY)
      }
    }

    if (isResizing && resizeHandle) {
      const start = resizeStartRef.current
      const deltaX = e.clientX - start.mouseX
      const deltaY = e.clientY - start.mouseY

      let newWidth = start.width
      let newHeight = start.height
      let newX = start.posX
      let newY = start.posY

      if (resizeHandle === 'right') {
        newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, start.width + deltaX))
      } else if (resizeHandle === 'left') {
        const widthChange = -deltaX
        newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, start.width + widthChange))
        newX = start.posX - (newWidth - start.width)
      } else if (resizeHandle === 'bottom') {
        newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, start.height + deltaY))
      } else if (resizeHandle === 'top') {
        const heightChange = -deltaY
        newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, start.height + heightChange))
        newY = start.posY - (newHeight - start.height)
      }

      setSize({ width: newWidth, height: newHeight })
      setPosition({ x: newX, y: newY })
      onResize(newWidth, newHeight)
    }
  }, [isDragging, isResizing, isRotating, resizeHandle, size.width, size.height, position, onDrag, onResize, onRotate, isSpreadView, onPageSideChange, handleEdgeScroll])

  // ドラッグ/リサイズ/回転終了
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging && !isResizing && !isRotating) return
    e.stopPropagation()

    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current)
      scrollAnimationRef.current = null
    }

    if (decoRef.current && activePointerId.current !== null) {
      try {
        decoRef.current.releasePointerCapture(activePointerId.current)
      } catch {}
    }
    activePointerId.current = null
    isDraggingRef.current = false
    isResizingRef.current = false
    isRotatingRef.current = false
    setIsDragging(false)
    setIsResizing(false)
    setIsRotating(false)
    setResizeHandle(null)
    bookBoundsRef.current = null
    onDragEnd?.()
  }, [isDragging, isResizing, isRotating, onDragEnd])

  // リサイズハンドルのポインターダウン
  const handleResizePointerDown = useCallback((e: React.PointerEvent, handle: 'left' | 'right' | 'top' | 'bottom') => {
    e.stopPropagation()
    e.preventDefault()

    if (decoRef.current) {
      resizeStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        width: size.width,
        height: size.height,
        posX: position.x,
        posY: position.y,
      }

      isResizingRef.current = true
      setIsResizing(true)
      setResizeHandle(handle)
      activePointerId.current = e.pointerId
      decoRef.current.setPointerCapture(e.pointerId)
    }
  }, [size, position])

  // 回転ハンドルのポインターダウン
  const handleRotatePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (decoRef.current) {
      // デコアイテムの中心座標を計算
      const centerX = position.x + size.width / 2
      const centerY = position.y + size.height / 2

      // 中心からカーソルへの初期角度を保存
      rotationStartAngleRef.current = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
      rotationStartValueRef.current = currentRotation

      isRotatingRef.current = true
      setIsRotating(true)
      activePointerId.current = e.pointerId
      decoRef.current.setPointerCapture(e.pointerId)
    }
  }, [position, size, currentRotation])

  const imageUrl = decoItem.decoItem.imageUrl

  return (
    <div
      ref={decoRef}
      className={`
        fixed cursor-grab select-none z-[60]
        ${isDragging ? 'cursor-grabbing' : ''}
      `}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        transform: `rotate(${currentRotation}deg) ${isDragging ? 'scale(1.05)' : ''}`,
        touchAction: 'none',
        opacity: 1,
        filter: isDragging
          ? 'drop-shadow(0 8px 16px rgba(236, 72, 153, 0.4))'
          : 'drop-shadow(0 4px 8px rgba(236, 72, 153, 0.3))',
        transition: isDragging ? 'none' : 'filter 0.15s ease-out',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* デコ画像 */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={decoItem.decoItem.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-pink-100 rounded text-2xl">
          {decoItem.decoItem.type === 'tape' && '📏'}
          {decoItem.decoItem.type === 'lace' && '🎀'}
          {decoItem.decoItem.type === 'stamp' && '🔖'}
          {decoItem.decoItem.type === 'glitter' && '✨'}
          {decoItem.decoItem.type === 'frame' && '🖼️'}
        </div>
      )}

      {/* 選択枠 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          border: '2px dashed #EC4899',
          borderRadius: '4px',
        }}
      />

      {/* 左リサイズハンドル */}
      <div
        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-10 rounded-full cursor-ew-resize flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #F9A8D4 0%, #EC4899 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
        onPointerDown={(e) => handleResizePointerDown(e, 'left')}
      >
        <span className="text-white text-xs">◀</span>
      </div>

      {/* 右リサイズハンドル */}
      <div
        className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-6 h-10 rounded-full cursor-ew-resize flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #F9A8D4 0%, #EC4899 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
        onPointerDown={(e) => handleResizePointerDown(e, 'right')}
      >
        <span className="text-white text-xs">▶</span>
      </div>

      {/* 上リサイズハンドル */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-6 rounded-full cursor-ns-resize flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #F9A8D4 0%, #EC4899 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
        onPointerDown={(e) => handleResizePointerDown(e, 'top')}
      >
        <span className="text-white text-xs">▲</span>
      </div>

      {/* 下リサイズハンドル */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-10 h-6 rounded-full cursor-ns-resize flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #F9A8D4 0%, #EC4899 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
        onPointerDown={(e) => handleResizePointerDown(e, 'bottom')}
      >
        <span className="text-white text-xs">▼</span>
      </div>

      {/* 回転ハンドル（右下角） */}
      <div
        className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full cursor-alias flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
          boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)',
          border: '2px solid white',
        }}
        onPointerDown={handleRotatePointerDown}
      >
        <span className="text-white text-sm">↻</span>
      </div>

      {/* ドラッグ中のヒント */}
      {isDragging && (
        <div
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #86EFAC 0%, #4ADE80 100%)',
            color: 'white',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          ゆびをはなして配置！
        </div>
      )}

      {/* リサイズ中のヒント */}
      {isResizing && (
        <div
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #F9A8D4 0%, #EC4899 100%)',
            color: 'white',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          ながさを調整中...
        </div>
      )}

      {/* 回転中のヒント */}
      {isRotating && (
        <div
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
            color: 'white',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          かくどを調整中... {Math.round(currentRotation)}°
        </div>
      )}

      {/* サイズ・角度表示 */}
      <div
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded text-[10px] whitespace-nowrap pointer-events-none"
        style={{
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
        }}
      >
        {Math.round(size.width)} × {Math.round(size.height)} · {Math.round(currentRotation)}°
      </div>
    </div>
  )
}

export default FloatingEditDeco
