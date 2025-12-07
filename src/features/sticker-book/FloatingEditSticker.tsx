'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { PlacedSticker } from './StickerPlacement'

interface FloatingEditStickerProps {
  sticker: PlacedSticker
  bookContainerRef: React.RefObject<HTMLDivElement | null>
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>  // スクロールコンテナへの参照
  pageWidth: number  // 1ページの幅
  pageHeight: number
  isSpreadView: boolean
  pageSide?: 'left' | 'right'  // 見開き時にシールがどちらのページにあるか
  onDrag: (x: number, y: number) => void
  onDragEnd?: () => void
  onPageSideChange?: (newSide: 'left' | 'right') => void  // ページを跨いだ時に呼ばれる
}

// 自動スクロールの設定
const SCROLL_EDGE_THRESHOLD = 60 // 画面端からこのピクセル以内でスクロール開始
const SCROLL_SPEED = 8 // スクロール速度（ピクセル/フレーム）

/**
 * 編集中のシールをBookViewの外側にフローティング表示するコンポーネント
 * これにより、ドラッグイベントがreact-pageflipに到達することを防ぐ
 */
export function FloatingEditSticker({
  sticker,
  bookContainerRef,
  scrollContainerRef,
  pageWidth,
  pageHeight,
  isSpreadView,
  pageSide,
  onDrag,
  onDragEnd,
  onPageSideChange,
}: FloatingEditStickerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const stickerRef = useRef<HTMLDivElement>(null)
  // 現在のページサイド（ドラッグ中にページを跨いだ場合に更新される）
  const currentPageSideRef = useRef<'left' | 'right' | undefined>(pageSide)

  // ドラッグ中は位置の再計算をスキップするためのフラグ
  const isDraggingRef = useRef(false)
  // アクティブなポインターIDを追跡
  const activePointerId = useRef<number | null>(null)
  // 自動スクロール用
  const scrollAnimationRef = useRef<number | null>(null)
  const lastPositionRef = useRef({ x: 0, y: 0 })

  const stickerSize = 60 * sticker.scale

  // 本の実際の領域を計算（DraggableStickerと同じロジック）
  const getActualBookBounds = useCallback(() => {
    if (!bookContainerRef.current) return null
    const containerRect = bookContainerRef.current.getBoundingClientRect()

    // 見開き状態では2ページ分の幅、そうでなければ1ページ分
    const actualBookWidth = isSpreadView ? pageWidth * 2 : pageWidth

    // コンテナ内での本の位置を計算（中央配置の場合のオフセット）
    const containerWidth = containerRect.width
    const horizontalOffset = (containerWidth - actualBookWidth) / 2

    // 水平方向: コンテナの左端 + 水平オフセット
    const bookLeft = containerRect.left + horizontalOffset

    // 垂直方向: BookView内のflex構造による余白を考慮
    const topOffset = 8
    const bookTop = containerRect.top + topOffset

    return {
      left: bookLeft,
      top: bookTop,
      width: actualBookWidth,
      height: pageHeight,
    }
  }, [bookContainerRef, pageWidth, pageHeight, isSpreadView])

  // 初期位置をシールの現在位置に基づいて計算
  // ドラッグ中は再計算しない（onDragで親の座標が更新されても位置がジャンプしないように）
  useEffect(() => {
    // ドラッグ中は位置を再計算しない
    if (isDraggingRef.current) return

    const bounds = getActualBookBounds()
    if (!bounds) return

    // シールの相対位置から絶対位置を計算
    // sticker.x は 0〜1 でそのページ内の相対位置
    // 見開き時、右ページのシールは左ページ幅分のオフセットが必要
    let absoluteX: number
    if (isSpreadView && pageSide === 'right') {
      // 右ページ: 本の左端 + 左ページ幅 + (シールのX座標 * 右ページ幅)
      absoluteX = bounds.left + pageWidth + (sticker.x * pageWidth) - stickerSize / 2
    } else {
      // 左ページまたは単ページ: 本の左端 + (シールのX座標 * ページ幅)
      absoluteX = bounds.left + (sticker.x * pageWidth) - stickerSize / 2
    }
    const absoluteY = bounds.top + (sticker.y * pageHeight) - stickerSize / 2

    setPosition({ x: absoluteX, y: absoluteY })
  }, [getActualBookBounds, sticker.x, sticker.y, pageWidth, pageHeight, isSpreadView, pageSide, stickerSize])

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

  // 自動スクロール中かどうかのフラグ（handleContainerScrollとの二重処理を防ぐ）
  const isAutoScrollingRef = useRef(false)

  // 画面端での自動スクロール処理
  const handleEdgeScroll = useCallback(() => {
    if (!isDraggingRef.current || !scrollContainerRef?.current) {
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

    // 左端に近い場合
    if (x < SCROLL_EDGE_THRESHOLD) {
      scrollDelta = -SCROLL_SPEED * (1 - x / SCROLL_EDGE_THRESHOLD)
    }
    // 右端に近い場合
    else if (x > screenWidth - SCROLL_EDGE_THRESHOLD) {
      scrollDelta = SCROLL_SPEED * (1 - (screenWidth - x) / SCROLL_EDGE_THRESHOLD)
    }

    if (scrollDelta !== 0) {
      isAutoScrollingRef.current = true
      container.scrollLeft += scrollDelta

      // スクロール後、本の領域を再計算
      // 注意: シールは position: fixed なので画面位置は変わらない
      // ただし、本との相対位置が変わるので bookBoundsRef を更新
      bookBoundsRef.current = getActualBookBounds()
    } else {
      isAutoScrollingRef.current = false
    }

    // 次のフレームでも継続
    scrollAnimationRef.current = requestAnimationFrame(handleEdgeScroll)
  }, [scrollContainerRef, getActualBookBounds])

  // ドラッグ開始時の本の領域とタッチオフセットを保存
  const bookBoundsRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)
  // タッチ位置とシール左上角の差を保存（シンプルなオフセット計算）
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // スクロールイベントハンドラー（手動スクロール時の補正用）
  const handleContainerScroll = useCallback(() => {
    // 自動スクロール中は処理しない（二重処理防止）
    if (isAutoScrollingRef.current) return
    if (!isDraggingRef.current || !scrollContainerRef?.current) return

    // スクロール後、本の領域を再計算
    // 注意: シールは position: fixed なので画面位置は変わらない
    // ただし、本との相対位置が変わるので bookBoundsRef を更新
    bookBoundsRef.current = getActualBookBounds()
  }, [scrollContainerRef, getActualBookBounds])

  // ドラッグ中のスクロールイベントを監視
  useEffect(() => {
    if (!isDragging || !scrollContainerRef?.current) return

    const container = scrollContainerRef.current

    container.addEventListener('scroll', handleContainerScroll)
    return () => {
      container.removeEventListener('scroll', handleContainerScroll)
    }
  }, [isDragging, scrollContainerRef, handleContainerScroll])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (stickerRef.current) {
      // ドラッグ開始時に本の領域を保存
      bookBoundsRef.current = getActualBookBounds()

      // シンプルなオフセット計算：タッチ位置とシールの左上角の差
      // これにより、シールを掴んだ位置を維持してドラッグできる
      dragOffsetRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }

      isDraggingRef.current = true
      setIsDragging(true)
      activePointerId.current = e.pointerId
      stickerRef.current.setPointerCapture(e.pointerId)
    }
  }, [getActualBookBounds, position])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    e.stopPropagation()

    // シンプルな位置計算：マウス位置 - オフセット = シールの左上角
    const offset = dragOffsetRef.current
    const newX = e.clientX - offset.x
    const newY = e.clientY - offset.y
    setPosition({ x: newX, y: newY })

    // 自動スクロール用に現在位置を保存（クライアント座標）
    lastPositionRef.current = { x: e.clientX, y: e.clientY }

    // 画面端に近い場合は自動スクロールを開始
    const screenWidth = window.innerWidth
    if (e.clientX < SCROLL_EDGE_THRESHOLD || e.clientX > screenWidth - SCROLL_EDGE_THRESHOLD) {
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

    // 相対座標を計算してコールバック（シールの中心位置を基準に）
    const bounds = bookBoundsRef.current
    if (bounds) {
      // シールの中心位置を計算（左上角 + サイズの半分）
      const stickerCenterX = newX + stickerSize / 2
      const stickerCenterY = newY + stickerSize / 2

      // 見開き時は全体幅（600px）に対する相対座標を計算してから、
      // 単一ページ座標（0-1 で 300px）に変換する
      let relativeX: number
      if (isSpreadView) {
        // 見開き全体に対する相対座標
        const spreadRelativeX = (stickerCenterX - bounds.left) / bounds.width

        // 現在どちらのページにあるか判定（0.5 を境界として）
        const newPageSide: 'left' | 'right' = spreadRelativeX >= 0.5 ? 'right' : 'left'

        // ページを跨いだ場合は通知
        if (newPageSide !== currentPageSideRef.current) {
          currentPageSideRef.current = newPageSide
          onPageSideChange?.(newPageSide)
        }

        // 現在のページに基づいて座標を計算
        if (newPageSide === 'right') {
          // 右ページ: spreadX の 0.5-1.0 を pageX の 0-1 に変換
          relativeX = (spreadRelativeX - 0.5) * 2
        } else {
          // 左ページ: spreadX の 0-0.5 を pageX の 0-1 に変換
          relativeX = spreadRelativeX * 2
        }
      } else {
        // 単ページ時はそのまま
        relativeX = (stickerCenterX - bounds.left) / bounds.width
      }

      const relativeY = (stickerCenterY - bounds.top) / bounds.height

      // 範囲内に制限
      const clampedX = Math.max(0.15, Math.min(0.85, relativeX))
      const clampedY = Math.max(0.15, Math.min(0.85, relativeY))

      onDrag(clampedX, clampedY)
    }
  }, [isDragging, stickerSize, onDrag, isSpreadView, onPageSideChange])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    e.stopPropagation()

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
    isDraggingRef.current = false
    setIsDragging(false)
    bookBoundsRef.current = null
    onDragEnd?.()
  }, [isDragging, onDragEnd])

  const imageUrl = sticker.sticker.imageUrl
  const icon = '🌟' // フォールバック

  return (
    <div
      ref={stickerRef}
      className={`
        fixed cursor-grab select-none z-[60]
        ${isDragging ? 'cursor-grabbing' : ''}
        ring-2 ring-purple-500 ring-opacity-75 rounded-lg
      `}
      style={{
        left: position.x,
        top: position.y,
        width: stickerSize,
        height: stickerSize,
        transform: `rotate(${sticker.rotation}deg) ${isDragging ? 'scale(1.1)' : ''}`,
        touchAction: 'none',
        // 常に不透明（ページ上のシールは非表示にしているため）
        opacity: 1,
        filter: isDragging
          ? 'drop-shadow(0 8px 16px rgba(139, 92, 246, 0.4))'
          : 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))',
        transition: isDragging ? 'none' : 'filter 0.15s ease-out',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={sticker.sticker.name}
          className="w-full h-full object-contain"
          draggable={false}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ fontSize: `${stickerSize * 0.6}px` }}
        >
          {icon}
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
    </div>
  )
}

export default FloatingEditSticker
