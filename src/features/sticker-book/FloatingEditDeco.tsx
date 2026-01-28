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

// スタンプのサイズは正方形で固定
const STAMP_MIN_SIZE = 20
const STAMP_MAX_SIZE = 50
const STAMP_STEP = 1
const LACE_MIN_WIDTH = 100
const LACE_MAX_WIDTH = 280
const LACE_MIN_HEIGHT = 15
const LACE_MAX_HEIGHT = 50
const LACE_STEP = 1

const snapStampSize = (value: number) => {
  const clamped = Math.max(STAMP_MIN_SIZE, Math.min(STAMP_MAX_SIZE, value))
  const snapped = Math.round(clamped / STAMP_STEP) * STAMP_STEP
  return Math.max(STAMP_MIN_SIZE, Math.min(STAMP_MAX_SIZE, snapped))
}

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
  const isStamp = decoItem.decoItem.type === 'stamp'
  const isLace = decoItem.decoItem.type === 'lace'
  const useMoveHandle = isStamp || isLace
  const initialWidth = decoItem.width ?? decoItem.decoItem.baseWidth ?? 60
  const initialHeight = decoItem.height ?? decoItem.decoItem.baseHeight ?? 60
  const initialStampSize = snapStampSize(Math.max(initialWidth, initialHeight))
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isRotating, setIsRotating] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<'left' | 'right' | 'top' | 'bottom' | null>(null)
  const [currentRotation, setCurrentRotation] = useState(decoItem.rotation ?? 0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState({
    width: isStamp ? initialStampSize : initialWidth,
    height: isStamp ? initialStampSize : initialHeight
  })
  const decoRef = useRef<HTMLDivElement>(null)
  const currentPageSideRef = useRef<'left' | 'right' | undefined>(pageSide)

  const isDraggingRef = useRef(false)
  const isResizingRef = useRef(false)
  const isRotatingRef = useRef(false)
  const activePointerId = useRef<number | null>(null)
  const scrollAnimationRef = useRef<number | null>(null)
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const dragFrameRef = useRef<number | null>(null)
  const resizeFrameRef = useRef<number | null>(null)
  const rotateFrameRef = useRef<number | null>(null)
  const pendingDragRef = useRef<{ x: number; y: number; clientX: number; clientY: number } | null>(null)
  const pendingResizeRef = useRef<{ width: number; height: number; x: number; y: number } | null>(null)
  const pendingRotationRef = useRef<number | null>(null)
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
    const topOffset = 16
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
    if (isStamp) {
      const nextSize = snapStampSize(Math.max(newWidth, newHeight))
      setSize({ width: nextSize, height: nextSize })
      if (newWidth !== nextSize || newHeight !== nextSize) {
        onResize(nextSize, nextSize)
      }
      return
    }
    if (isLace) {
      const nextWidth = Math.max(LACE_MIN_WIDTH, Math.min(LACE_MAX_WIDTH, newWidth))
      const nextHeight = Math.max(LACE_MIN_HEIGHT, Math.min(LACE_MAX_HEIGHT, newHeight))
      setSize({ width: nextWidth, height: nextHeight })
      if (newWidth !== nextWidth || newHeight !== nextHeight) {
        onResize(nextWidth, nextHeight)
      }
      return
    }
    setSize({ width: newWidth, height: newHeight })
  }, [decoItem.width, decoItem.height, decoItem.decoItem.baseWidth, decoItem.decoItem.baseHeight, isStamp, isLace, onResize])

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
      if (dragFrameRef.current) {
        cancelAnimationFrame(dragFrameRef.current)
      }
      if (resizeFrameRef.current) {
        cancelAnimationFrame(resizeFrameRef.current)
      }
      if (rotateFrameRef.current) {
        cancelAnimationFrame(rotateFrameRef.current)
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

  const flushDragFrame = useCallback(() => {
    dragFrameRef.current = null
    const pending = pendingDragRef.current
    if (!pending) return
    pendingDragRef.current = null

    const { x: newX, y: newY, clientX, clientY } = pending
    setPosition({ x: newX, y: newY })
    lastPositionRef.current = { x: clientX, y: clientY }

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

        if (newPageSide === "right") {
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
  }, [isSpreadView, onDrag, onPageSideChange, size.width, size.height])

  const flushResizeFrame = useCallback(() => {
    resizeFrameRef.current = null
    const pending = pendingResizeRef.current
    if (!pending) return
    pendingResizeRef.current = null
    setSize({ width: pending.width, height: pending.height })
    setPosition({ x: pending.x, y: pending.y })
    onResize(pending.width, pending.height)
  }, [onResize])

  const flushRotateFrame = useCallback(() => {
    rotateFrameRef.current = null
    const pending = pendingRotationRef.current
    if (pending === null) return
    pendingRotationRef.current = null
    setCurrentRotation(pending)
    onRotate(pending)
  }, [onRotate])

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

      pendingRotationRef.current = newRotation
      if (!rotateFrameRef.current) {
        rotateFrameRef.current = requestAnimationFrame(flushRotateFrame)
      }
      return
    }

    if (isDragging) {
      const offset = dragOffsetRef.current
      const newX = e.clientX - offset.x
      const newY = e.clientY - offset.y
      pendingDragRef.current = { x: newX, y: newY, clientX: e.clientX, clientY: e.clientY }
      if (!dragFrameRef.current) {
        dragFrameRef.current = requestAnimationFrame(flushDragFrame)
      }

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

    }

    if (isResizing && resizeHandle) {
      if (isStamp || isLace) return
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

      pendingResizeRef.current = { width: newWidth, height: newHeight, x: newX, y: newY }
      if (!resizeFrameRef.current) {
        resizeFrameRef.current = requestAnimationFrame(flushResizeFrame)
      }
    }
  }, [isDragging, isResizing, isRotating, resizeHandle, position, size.width, size.height, handleEdgeScroll, isStamp, isLace, flushDragFrame, flushResizeFrame, flushRotateFrame])

  // ドラッグ/リサイズ/回転終了
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging && !isResizing && !isRotating) return
    e.stopPropagation()

    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current)
      scrollAnimationRef.current = null
    }
    if (dragFrameRef.current) {
      cancelAnimationFrame(dragFrameRef.current)
      dragFrameRef.current = null
      flushDragFrame()
    }
    if (resizeFrameRef.current) {
      cancelAnimationFrame(resizeFrameRef.current)
      resizeFrameRef.current = null
      flushResizeFrame()
    }
    if (rotateFrameRef.current) {
      cancelAnimationFrame(rotateFrameRef.current)
      rotateFrameRef.current = null
      flushRotateFrame()
    }
    pendingDragRef.current = null
    pendingResizeRef.current = null
    pendingRotationRef.current = null

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
  }, [isDragging, isResizing, isRotating, onDragEnd, flushDragFrame, flushResizeFrame, flushRotateFrame])

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

  const handleStampSizeStep = useCallback((delta: number) => {
    setSize(prev => {
      const next = snapStampSize(prev.width + delta)
      setPosition(pos => {
        const centerX = pos.x + prev.width / 2
        const centerY = pos.y + prev.height / 2
        return { x: centerX - next / 2, y: centerY - next / 2 }
      })
      onResize(next, next)
      return { width: next, height: next }
    })
  }, [onResize])

  const handleStampSizeChange = useCallback((value: number) => {
    const next = snapStampSize(value)
    setPosition(pos => {
      const centerX = pos.x + size.width / 2
      const centerY = pos.y + size.height / 2
      return { x: centerX - next / 2, y: centerY - next / 2 }
    })
    setSize({ width: next, height: next })
    onResize(next, next)
  }, [onResize, size.width, size.height])

  const handleLaceWidthStep = useCallback((delta: number) => {
    setSize(prev => {
      const nextWidth = Math.max(LACE_MIN_WIDTH, Math.min(LACE_MAX_WIDTH, prev.width + delta))
      const nextHeight = prev.height
      setPosition(pos => {
        const centerX = pos.x + prev.width / 2
        const centerY = pos.y + prev.height / 2
        return { x: centerX - nextWidth / 2, y: centerY - nextHeight / 2 }
      })
      onResize(nextWidth, nextHeight)
      return { width: nextWidth, height: nextHeight }
    })
  }, [onResize])

  const handleLaceHeightStep = useCallback((delta: number) => {
    setSize(prev => {
      const nextWidth = prev.width
      const nextHeight = Math.max(LACE_MIN_HEIGHT, Math.min(LACE_MAX_HEIGHT, prev.height + delta))
      setPosition(pos => {
        const centerX = pos.x + prev.width / 2
        const centerY = pos.y + prev.height / 2
        return { x: centerX - nextWidth / 2, y: centerY - nextHeight / 2 }
      })
      onResize(nextWidth, nextHeight)
      return { width: nextWidth, height: nextHeight }
    })
  }, [onResize])

  const handleLaceWidthChange = useCallback((value: number) => {
    const nextWidth = Math.max(LACE_MIN_WIDTH, Math.min(LACE_MAX_WIDTH, value))
    const nextHeight = size.height
    setPosition(pos => {
      const centerX = pos.x + size.width / 2
      const centerY = pos.y + size.height / 2
      return { x: centerX - nextWidth / 2, y: centerY - nextHeight / 2 }
    })
    setSize({ width: nextWidth, height: nextHeight })
    onResize(nextWidth, nextHeight)
  }, [onResize, size.height, size.width])

  const handleLaceHeightChange = useCallback((value: number) => {
    const nextWidth = size.width
    const nextHeight = Math.max(LACE_MIN_HEIGHT, Math.min(LACE_MAX_HEIGHT, value))
    setPosition(pos => {
      const centerX = pos.x + size.width / 2
      const centerY = pos.y + size.height / 2
      return { x: centerX - nextWidth / 2, y: centerY - nextHeight / 2 }
    })
    setSize({ width: nextWidth, height: nextHeight })
    onResize(nextWidth, nextHeight)
  }, [onResize, size.width, size.height])

  const imageUrl = decoItem.decoItem.imageUrl
  const minDim = Math.min(size.width, size.height)
  const rotateHandleSize = isStamp ? 22 : isLace ? 24 : 32
  const baseStampOffset = 24
  const stampOffsetRaw = Math.round(size.width * 0.35)
  const stampShrinkBoost = Math.round(Math.max(0, 30 - size.width) * 0.7)
  const rotateHandleOffset = isStamp
    ? Math.max(baseStampOffset, Math.min(28, stampOffsetRaw + stampShrinkBoost))
    : isLace
      ? Math.max(12, Math.min(26, Math.round(minDim * 0.35)))
      : 12
  const showRotateHandle = true

  return (
    <div
      ref={decoRef}
      className={`
        fixed select-none
        ${isStamp ? '' : 'cursor-grab'}
        ${isDragging ? 'cursor-grabbing' : ''}
      `}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        // iOS Safari対策: 3Dコンテキストより前面に表示するためtranslateZを追加
        transform: `translateZ(10000px) rotate(${currentRotation}deg) ${isDragging ? 'scale(1.05)' : ''}`,
        transformStyle: 'preserve-3d',
        zIndex: 100000,
        willChange: 'transform',
        touchAction: 'none',
        opacity: 1,
        filter: isDragging
          ? 'drop-shadow(0 8px 16px rgba(236, 72, 153, 0.4))'
          : 'drop-shadow(0 4px 8px rgba(236, 72, 153, 0.3))',
        transition: isDragging ? 'none' : 'filter 0.15s ease-out',
      }}
      onPointerDown={useMoveHandle ? undefined : handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* デコ画像 */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={decoItem.decoItem.name}
          className={`w-full h-full ${isStamp ? 'object-contain' : 'object-fill'}`}
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

      {useMoveHandle && !isDragging && !isResizing && !isRotating && (
        <div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-bold cursor-grab active:cursor-grabbing"
          style={{
            background: 'linear-gradient(135deg, #60A5FA 0%, #34D399 100%)',
            color: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            whiteSpace: 'nowrap',
            minWidth: '64px',
            textAlign: 'center',
          }}
          onPointerDown={handlePointerDown}
        >
          うごかす
        </div>
      )}

      {!isStamp && !isLace && (
        <>
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
        </>
      )}

      {/* 回転ハンドル（右下角） */}
      {showRotateHandle && (
        <div
          className="absolute rounded-full cursor-alias flex items-center justify-center"
          style={{
            width: rotateHandleSize,
            height: rotateHandleSize,
            right: (isStamp || isLace) ? -rotateHandleOffset : -12,
            bottom: (isStamp || isLace) ? -rotateHandleOffset : -12,
            background: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)",
            boxShadow: "0 2px 8px rgba(139, 92, 246, 0.4)",
            border: "2px solid white",
          }}
          onPointerDown={handleRotatePointerDown}
        >
          <span className="text-white text-sm">↻</span>
        </div>
      )}

      {isStamp && !isDragging && !isResizing && !isRotating && (
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 px-2 py-1.5 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #E0F2FE',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          <button
            onClick={() => handleStampSizeStep(-STAMP_STEP)}
            className="w-6 h-6 rounded-full text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, #FECACA 0%, #FCA5A5 100%)',
              color: '#7F1D1D',
              border: 'none',
            }}
          >
            -
          </button>
          <input
            type="range"
            min={STAMP_MIN_SIZE}
            max={STAMP_MAX_SIZE}
            step={STAMP_STEP}
            value={size.width}
            onChange={(e) => handleStampSizeChange(Number(e.target.value))}
            style={{ width: '90px' }}
          />
          <button
            onClick={() => handleStampSizeStep(STAMP_STEP)}
            className="w-6 h-6 rounded-full text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, #BBF7D0 0%, #86EFAC 100%)',
              color: '#14532D',
              border: 'none',
            }}
          >
            +
          </button>
          <span className="text-[10px]" style={{ color: '#6B7280' }}>{size.width}×{size.height}</span>
        </div>
      )}

      {isLace && !isDragging && !isResizing && !isRotating && (
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 flex flex-col gap-1 px-2 py-1.5 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #E0F2FE',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px]" style={{ color: '#6B7280' }}>よこ</span>
            <button
              onClick={() => handleLaceWidthStep(-LACE_STEP)}
              className="w-6 h-6 rounded-full text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, #FECACA 0%, #FCA5A5 100%)',
                color: '#7F1D1D',
                border: 'none',
              }}
            >
              -
            </button>
            <input
              type="range"
              min={LACE_MIN_WIDTH}
              max={LACE_MAX_WIDTH}
              step={LACE_STEP}
              value={size.width}
              onChange={(e) => handleLaceWidthChange(Number(e.target.value))}
              style={{ width: '90px' }}
            />
            <button
              onClick={() => handleLaceWidthStep(LACE_STEP)}
              className="w-6 h-6 rounded-full text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, #BBF7D0 0%, #86EFAC 100%)',
                color: '#14532D',
                border: 'none',
              }}
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px]" style={{ color: '#6B7280' }}>たて</span>
            <button
              onClick={() => handleLaceHeightStep(-LACE_STEP)}
              className="w-6 h-6 rounded-full text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, #FECACA 0%, #FCA5A5 100%)',
                color: '#7F1D1D',
                border: 'none',
              }}
            >
              -
            </button>
            <input
              type="range"
              min={LACE_MIN_HEIGHT}
              max={LACE_MAX_HEIGHT}
              step={LACE_STEP}
              value={size.height}
              onChange={(e) => handleLaceHeightChange(Number(e.target.value))}
              style={{ width: '90px' }}
            />
            <button
              onClick={() => handleLaceHeightStep(LACE_STEP)}
              className="w-6 h-6 rounded-full text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, #BBF7D0 0%, #86EFAC 100%)',
                color: '#14532D',
                border: 'none',
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

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

      {/* サイズ表示は下部パネルにまとめる */}
    </div>
  )
}

export default FloatingEditDeco
