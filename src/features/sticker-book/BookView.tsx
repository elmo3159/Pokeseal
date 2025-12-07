'use client'

import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle, useMemo, useEffect, TouchEvent as ReactTouchEvent } from 'react'
import dynamic from 'next/dynamic'
import './book.css'
import { StickerBookTheme, CoverDesign, getCoverDesignById } from '@/domain/theme'
import type { PlacedSticker } from './StickerPlacement'
import type { Sticker } from './StickerTray'

// Dynamic import for SSR compatibility
const HTMLFlipBook = dynamic(() => import('react-pageflip').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-purple-400">読み込み中...</div>
})

export interface BookPage {
  id: string
  type: 'cover' | 'page' | 'back-cover' | 'inner-cover'
  content?: React.ReactNode
  // 見開きページ用のプロパティ
  side?: 'left' | 'right' // ページが左右どちらか
  spreadId?: string // 同じ見開きに属するページを識別
  theme?: PageTheme // ページのテーマ装飾
}

// ページテーマ（見開き左ページの装飾用）
export interface PageTheme {
  backgroundColor?: string
  pattern?: 'dots' | 'grid' | 'lines' | 'stars' | 'hearts' | 'none'
  patternColor?: string
  decoration?: 'ribbon' | 'flower' | 'star' | 'heart' | 'none'
}

interface BookViewProps {
  pages: BookPage[]
  onPageChange?: (pageNumber: number) => void
  width?: number
  height?: number
  bookTheme?: StickerBookTheme // グローバルテーマ
  coverDesignId?: string // 表紙デザインID
  onThemeButtonClick?: () => void // テーマ変更ボタンクリック
  onExportButtonClick?: () => void // 画像エクスポートボタンクリック
  renderNavigation?: boolean // ナビゲーションを内部でレンダリングするか（デフォルト: true）
  disableSwipeFlip?: boolean // スワイプでのページめくりを無効化（見開き時に横スクロールと競合させないため）
  // シールをページ内に埋め込むためのprops
  placedStickers?: PlacedSticker[] // 配置済みシール
  editingStickerId?: string | null // 編集中のシールID（非表示にする）
  onStickerLongPress?: (sticker: PlacedSticker) => void // シール長押し時のコールバック
}

// 外部からBookViewを制御するためのハンドル
export interface BookViewHandle {
  flipNext: () => void
  flipPrev: () => void
  currentPage: number
  totalPages: number
  isOnCover: boolean
  isOnBackCover: boolean
}

// ページコンポーネント - forwardRefで作成（react-pageflip必須）
interface PageProps {
  page: BookPage
  pageNumber: number
  bookTheme?: StickerBookTheme
  coverDesign?: CoverDesign // 表紙デザイン
  pageStickers?: PlacedSticker[] // このページのシール
  editingStickerId?: string | null
  onStickerLongPress?: (sticker: PlacedSticker) => void
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ page, pageNumber, bookTheme, coverDesign, pageStickers, editingStickerId, onStickerLongPress }, ref) => {
  // ハードページを使用（シールが3D変形に正しく追従するため）
  // ソフトページはcanvasレンダリングを使用し、DOM要素が追従しない問題がある
  return (
    <div
      ref={ref}
      className="book-page"
      data-density="hard"
    >
      <PageContent
        page={page}
        pageNumber={pageNumber}
        bookTheme={bookTheme}
        coverDesign={coverDesign}
        pageStickers={pageStickers}
        editingStickerId={editingStickerId}
        onStickerLongPress={onStickerLongPress}
      />
    </div>
  )
})
Page.displayName = 'Page'

// 下部スワイプゾーンコンポーネント - リアルな指追従ページめくり
// 本の下半分を占め、ここをスワイプするとページがめくれる
// 上半分は横スクロール用にイベントを通過させる
interface SwipeZoneProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bookRef: React.RefObject<any>
  bookContainerRef: React.RefObject<HTMLDivElement | null>
  heightPercent?: number // 本の何%を占めるか（デフォルト50%）
  bookWidth: number
  bookHeight: number
  isOnCover: boolean
  isOnBackCover: boolean
}

function SwipeZone({
  bookRef,
  bookContainerRef,
  heightPercent = 50,
  bookWidth,
  bookHeight,
  isOnCover,
  isOnBackCover
}: SwipeZoneProps) {
  const isDragging = useRef(false)
  const isFlipStarted = useRef(false) // ページめくりが実際に開始されたか
  const startX = useRef<number>(0)
  const startY = useRef<number>(0)
  const dragDirection = useRef<'left' | 'right' | null>(null)

  // スワイプ開始のしきい値（この距離以上水平移動したらページめくり開始）
  const SWIPE_START_THRESHOLD = 20

  // ブックコンテナの位置を取得
  const getBookRect = useCallback(() => {
    if (!bookContainerRef.current) return null
    return bookContainerRef.current.getBoundingClientRect()
  }, [bookContainerRef])

  // クライアント座標をブック内ローカル座標に変換
  const clientToBookLocal = useCallback((clientX: number, clientY: number) => {
    const rect = getBookRect()
    if (!rect) return { x: 0, y: 0 }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }, [getBookRect])

  // ドラッグ開始（位置記録のみ、ページめくりはまだ開始しない）
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    const pageFlip = bookRef.current?.pageFlip()
    if (!pageFlip) return

    isDragging.current = true
    isFlipStarted.current = false // まだページめくりは開始していない
    startX.current = clientX
    startY.current = clientY
    dragDirection.current = null

    // 注意: ここではstartUserTouch()を呼ばない
    // 十分な水平移動があった場合のみhandleDragMoveで開始する
  }, [bookRef])

  // ドラッグ中
  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return

    const pageFlip = bookRef.current?.pageFlip()
    if (!pageFlip) return

    const deltaX = clientX - startX.current

    // 十分な水平移動があった場合のみページめくりを開始
    if (!isFlipStarted.current && Math.abs(deltaX) >= SWIPE_START_THRESHOLD) {
      // ページめくりを開始
      const startLocalPos = clientToBookLocal(startX.current, startY.current)
      try {
        pageFlip.startUserTouch(startLocalPos)
        isFlipStarted.current = true
        dragDirection.current = deltaX < 0 ? 'left' : 'right'
      } catch {
        // エラーは無視（ページめくり不可の状態など）
      }
    }

    // ページめくりが開始されている場合のみ更新
    if (isFlipStarted.current) {
      const localPos = clientToBookLocal(clientX, clientY)
      try {
        pageFlip.userMove(localPos, false)
      } catch {
        // エラーは無視
      }
    }
  }, [bookRef, clientToBookLocal])

  // ドラッグ終了
  const handleDragEnd = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return

    const pageFlip = bookRef.current?.pageFlip()
    if (!pageFlip) {
      isDragging.current = false
      isFlipStarted.current = false
      return
    }

    // ページめくりが開始されている場合のみ終了処理
    if (isFlipStarted.current) {
      const localPos = clientToBookLocal(clientX, clientY)
      try {
        // ユーザー操作終了 - ライブラリが自動的にフリップ完了または戻りを判断
        pageFlip.userStop(localPos, false)
      } catch {
        // エラーは無視
      }
    }
    // ページめくりが開始されていない場合（長押しやタップ）は何もしない

    isDragging.current = false
    isFlipStarted.current = false
    dragDirection.current = null
  }, [bookRef, clientToBookLocal])

  // タッチイベントハンドラ
  const handleTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleDragStart(touch.clientX, touch.clientY)
  }, [handleDragStart])

  const handleTouchMove = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleDragMove(touch.clientX, touch.clientY)
  }, [handleDragMove])

  const handleTouchEnd = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    const touch = e.changedTouches[0]
    handleDragEnd(touch.clientX, touch.clientY)
  }, [handleDragEnd])

  // マウスイベントハンドラ
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleDragStart(e.clientX, e.clientY)

    // マウスムーブとマウスアップをドキュメントレベルで監視
    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleDragMove(moveEvent.clientX, moveEvent.clientY)
    }

    const handleMouseUp = (upEvent: MouseEvent) => {
      handleDragEnd(upEvent.clientX, upEvent.clientY)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [handleDragStart, handleDragMove, handleDragEnd])

  // 高さをピクセルで計算
  const zoneHeight = bookHeight * (heightPercent / 100)

  return (
    <div
      className="swipe-zone absolute left-0 right-0 bottom-0 z-30 flex items-end justify-center cursor-grab active:cursor-grabbing select-none"
      style={{
        height: `${zoneHeight}px`,
        background: 'linear-gradient(180deg, rgba(139, 92, 246, 0) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(139, 92, 246, 0.15) 100%)',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px',
        touchAction: 'none', // タッチスクロールを無効化
        pointerEvents: 'auto', // 明示的にポインターイベントを有効化
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* スワイプヒント - 下部に配置 */}
      <div className="flex items-center gap-2 opacity-50 pointer-events-none pb-3">
        <span className="text-sm" style={{ color: '#8B5CF6' }}>👈</span>
        <span
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{
            color: '#8B5CF6',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            background: 'rgba(139, 92, 246, 0.1)',
          }}
        >
          ここをスワイプでめくる
        </span>
        <span className="text-sm" style={{ color: '#8B5CF6' }}>👉</span>
      </div>
    </div>
  )
}

export const BookView = forwardRef<BookViewHandle, BookViewProps>(({
  pages,
  onPageChange,
  width = 320,
  height = 480,
  bookTheme,
  coverDesignId,
  onThemeButtonClick,
  onExportButtonClick,
  renderNavigation = true,
  disableSwipeFlip = false,
  placedStickers = [],
  editingStickerId = null,
  onStickerLongPress,
}, ref) => {
  // 表紙デザインを取得
  const coverDesign = coverDesignId ? getCoverDesignById(coverDesignId) : undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null)
  const bookContainerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)

  // ページ順序のキー（順序変更検知用）
  const pagesKey = useMemo(() => pages.map(p => p.id).join(','), [pages])
  // 前回のページキーを保持
  const prevPagesKeyRef = useRef(pagesKey)

  // ページ順序が変わった時にcurrentPageを0にリセット（react-pageflipの初期化問題を回避）
  useEffect(() => {
    if (prevPagesKeyRef.current !== pagesKey) {
      // ページ順序が変わった場合のみリセット
      setCurrentPage(0)
      onPageChange?.(0)
      prevPagesKeyRef.current = pagesKey
    }
  }, [pagesKey, onPageChange])

  // ページごとのシールをマッピング
  const stickersByPage = useMemo(() => {
    const map: Record<string, PlacedSticker[]> = {}
    for (const sticker of placedStickers) {
      if (!map[sticker.pageId]) {
        map[sticker.pageId] = []
      }
      map[sticker.pageId].push(sticker)
    }
    return map
  }, [placedStickers])

  // シール状態を含むキー（シール変更時にリマウントするため）
  // 編集中のシールは除外する（位置変更中にリマウントが発生してチラつくのを防ぐ）
  const stickersKey = useMemo(() => {
    return placedStickers
      .filter(s => s.id !== editingStickerId) // 編集中のシールを除外
      .map(s => `${s.id}:${s.x.toFixed(2)}:${s.y.toFixed(2)}:${s.rotation}`)
      .join('|')
  }, [placedStickers, editingStickerId])

  // 表紙ページかどうか（閉じた状態）
  const isOnCover = currentPage === 0
  // 裏表紙ページかどうか
  const isOnBackCover = currentPage === pages.length - 1

  // ページめくりイベント
  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data)
    onPageChange?.(e.data)
  }, [onPageChange])

  // ページめくりのコントロール
  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext()
  }, [])

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev()
  }, [])

  // 外部からの制御用ハンドルを公開
  useImperativeHandle(ref, () => ({
    flipNext,
    flipPrev,
    currentPage,
    totalPages: pages.length,
    isOnCover,
    isOnBackCover,
  }), [flipNext, flipPrev, currentPage, pages.length, isOnCover, isOnBackCover])

  // 表紙スタイル生成
  const getCoverStyle = (): React.CSSProperties => {
    if (!bookTheme) {
      return {
        background: 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 25%, #8B5CF6 50%, #C4B5FD 75%, #A78BFA 100%)',
        boxShadow: 'inset 0 0 40px rgba(139, 92, 246, 0.2), inset 0 2px 0 rgba(255,255,255,0.2)',
      }
    }
    const { binder } = bookTheme
    let background = binder.color
    if (binder.gradientFrom && binder.gradientTo) {
      background = `linear-gradient(135deg, ${binder.gradientFrom} 0%, ${binder.gradientTo} 25%, ${binder.gradientFrom} 50%, ${binder.gradientTo} 75%, ${binder.gradientFrom} 100%)`
    }
    return {
      background,
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.1)',
      border: binder.borderColor ? `3px solid ${binder.borderColor}` : undefined,
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* シール帳本体 - 3Dリアル表現 */}
      <div
        className="relative"
        style={{
          perspective: '1500px',
          transformStyle: 'preserve-3d',
          // 見開き状態では幅を明示的に設定
          width: (isOnCover || isOnBackCover) ? `${width}px` : `${width * 2}px`,
          transition: 'width 0.3s ease-out',
          // 見開き時は横スクロールのためにoverflowを許可、表紙/裏表紙時のみ制限
          overflow: (isOnCover || isOnBackCover) ? 'hidden' : 'visible',
          // clipPath は表紙・裏表紙時のみ使用（3D変換との互換性のため）
          clipPath: (isOnCover || isOnBackCover) ? 'inset(0)' : 'none',
        }}
      >
        {/* 本の背表紙（スパイン）- 閉じた状態でのみ表示 */}
        {/* 表紙のときは左側のみ表示（裏表紙では右側にはみ出すため非表示） */}
        {isOnCover && (
          <div
            className="absolute top-0 bottom-0 z-10 left-0"
            style={{
              width: '16px',
              background: bookTheme?.binder.gradientFrom
                ? `linear-gradient(90deg, ${bookTheme.binder.gradientFrom} 0%, ${bookTheme.binder.gradientTo || bookTheme.binder.gradientFrom} 50%, ${bookTheme.binder.gradientFrom} 100%)`
                : 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 50%, #8B5CF6 100%)',
              borderRadius: '3px 0 0 3px',
              transform: 'translateX(-14px) rotateY(-15deg)',
              boxShadow: 'inset -3px 0 8px rgba(139, 92, 246, 0.3), inset 2px 0 4px rgba(255,255,255,0.2)',
            }}
          />
        )}

        {/* 本の厚み（ページ束）表現 - 閉じた状態でのみ表示 */}
        {/* 表紙のときは左側のみ表示（裏表紙では右側にはみ出すため非表示） */}
        {isOnCover && (
          <div
            className="absolute top-2 bottom-2 left-0"
            style={{
              width: '12px',
              background: 'linear-gradient(90deg, #f5f0e8 0%, #fff 20%, #f8f5f0 40%, #fff 60%, #f5f0e8 100%)',
              transform: 'translateX(-12px)',
              borderRadius: '2px 0 0 2px',
              boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.1)',
            }}
          >
            {/* ページの線を表現 */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full"
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)',
                  top: `${12 + i * 12}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* 3D風の影と立体感 - メイン・パステル */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.06) 0%, transparent 50%, rgba(0,0,0,0.03) 100%)',
            transform: 'translateZ(-30px) rotateX(2deg) rotateY(-1deg)',
            boxShadow: `
              0 25px 50px rgba(139, 92, 246, 0.15),
              0 15px 30px rgba(139, 92, 246, 0.08),
              0 5px 15px rgba(0, 0, 0, 0.05)
            `,
            borderRadius: '8px',
          }}
        />

        {/* 光沢エフェクト */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)',
            zIndex: 1,
          }}
        />

        {/* HTMLFlipBookコンテナ - 閉じた状態では表紙のみ表示 */}
        <div
          ref={bookContainerRef}
          className={`book-container relative ${(isOnCover || isOnBackCover) ? 'book-closed' : ''} ${isOnBackCover ? 'book-on-back-cover' : ''}`}
          style={{
            // 常に見開き幅を確保し、表示領域をコンテナ幅で制御
            width: (isOnCover || isOnBackCover) ? `${width}px` : `${width * 2}px`,
            height: `${height}px`,
            overflow: (isOnCover || isOnBackCover) ? 'hidden' : 'visible',
            // clip-pathを使用：3D変換と組み合わせてもクリッピングが効く
            clipPath: (isOnCover || isOnBackCover) ? 'inset(0)' : 'none',
            transform: 'rotateX(2deg)',
            transformStyle: 'preserve-3d',
            borderRadius: (isOnCover || isOnBackCover) ? '4px 8px 8px 4px' : '8px',
            boxShadow: `
              0 2px 4px rgba(139, 92, 246, 0.06),
              0 8px 16px rgba(139, 92, 246, 0.1),
              inset 0 1px 0 rgba(255,255,255,0.4)
            `,
            zIndex: 10,
            position: 'relative',
            transition: 'width 0.3s ease-out',
          }}
        >
          {/* 内部コンテナ - 表紙表示時は右にシフトして表紙を中央に見せる */}
          <div
            style={{
              // 表紙（ページ0）は右側に描画されるので、左にシフトして表示
              // 裏表紙のページ位置はCSSで調整するためtransformは0
              // 見開き時は左端から表示
              transform: isOnCover ? `translateX(-${width}px)` : 'translateX(0)',
              transition: 'transform 0.3s ease-out',
              width: `${width * 2}px`,
              height: '100%',
            }}
          >
          <HTMLFlipBook
            // Key based on page order only - シール変更では再マウントしない
            // ページ順序変更時のみ再マウントし、currentPageは0にリセット済み
            key={pagesKey}
            ref={bookRef}
            width={width}
            height={height}
            minWidth={width}
            maxWidth={width * 2}
            minHeight={height}
            maxHeight={height}
            size="fixed"
            showCover={true}
            // マウス/タッチイベントは無効化し、SwipeZoneのみでページめくりを制御
            // これにより、シール長押し時の誤めくりを防止
            mobileScrollSupport={false}
            clickEventForward={true}
            useMouseEvents={false}
            swipeDistance={30}
            drawShadow={true}
            flippingTime={600}
            usePortrait={false}
            startZIndex={10}
            autoSize={false}
            maxShadowOpacity={0.5}
            showPageCorners={false}
            disableFlipByClick={true}
            onFlip={onFlip}
            className="book-flip-container"
            style={{}}
            startPage={currentPage}
          >
            {pages.map((page, index) => (
              <Page
                key={`${page.id}-${index}`}
                page={page}
                pageNumber={index}
                bookTheme={bookTheme}
                coverDesign={coverDesign}
                pageStickers={stickersByPage[page.id] || []}
                editingStickerId={editingStickerId}
                onStickerLongPress={onStickerLongPress}
              />
            ))}
          </HTMLFlipBook>
          </div>

          {/* 下部スワイプゾーン - 本の下半分をカバーしページめくり用 */}
          {/* 上半分は横スクロールのためにイベントを通過させる */}
          <SwipeZone
            bookRef={bookRef}
            bookContainerRef={bookContainerRef}
            bookWidth={width}
            bookHeight={height}
            isOnCover={isOnCover}
            isOnBackCover={isOnBackCover}
            heightPercent={50}
          />
        </div>

        {/* 本の右端（めくり待ちページ）のヒント */}
        <div
          className="absolute right-0 top-4 bottom-4 w-2 rounded-r-sm pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.03))',
            transform: 'translateX(2px)',
          }}
        />
      </div>

      {/* ページナビゲーション - モダンデザイン（renderNavigationがtrueの場合のみ） */}
      {renderNavigation && (
        <>
          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={flipPrev}
              disabled={currentPage === 0}
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 disabled:opacity-40 font-bold text-white text-lg"
              style={{
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
                background: currentPage === 0
                  ? 'rgba(167, 139, 250, 0.2)'
                  : 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 50%, #8B5CF6 100%)',
                color: currentPage === 0 ? '#A78BFA' : 'white',
                boxShadow: currentPage === 0
                  ? 'none'
                  : '0 4px 20px rgba(139, 92, 246, 0.25)',
              }}
            >
              ←
            </button>

            <span
              className="text-sm px-6 py-2.5 rounded-full min-w-[90px] text-center"
              style={{
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
                fontWeight: 600,
                background: 'rgba(167, 139, 250, 0.1)',
                color: '#8B5CF6',
              }}
            >
              {currentPage + 1} / {pages.length}
            </span>

            <button
              onClick={flipNext}
              disabled={currentPage >= pages.length - 1}
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 disabled:opacity-40 font-bold text-white text-lg"
              style={{
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
                background: currentPage >= pages.length - 1
                  ? 'rgba(167, 139, 250, 0.2)'
                  : 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 50%, #8B5CF6 100%)',
                color: currentPage >= pages.length - 1 ? '#A78BFA' : 'white',
                boxShadow: currentPage >= pages.length - 1
                  ? 'none'
                  : '0 4px 20px rgba(139, 92, 246, 0.25)',
              }}
            >
              →
            </button>

            {/* テーマ変更ボタン - パステル */}
            {onThemeButtonClick && (
              <button
                onClick={onThemeButtonClick}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 ml-2 text-lg"
                style={{
                  background: 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)',
                  boxShadow: '0 4px 16px rgba(252, 211, 77, 0.3)',
                }}
                title="きせかえ"
              >
                🎨
              </button>
            )}

            {/* 画像エクスポートボタン - パステルグリーン */}
            {onExportButtonClick && (
              <button
                onClick={onExportButtonClick}
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95 ml-2 text-lg"
                style={{
                  background: 'linear-gradient(135deg, #86EFAC 0%, #4ADE80 100%)',
                  boxShadow: '0 4px 16px rgba(74, 222, 128, 0.3)',
                }}
                title="がぞうにほぞん"
              >
                📸
              </button>
            )}
          </div>

          {/* 操作ヒント - モダンテキスト */}
          <p
            className="mt-6 text-xs"
            style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              color: '#A78BFA',
            }}
          >
            シールを長押しで編集できるよ！
          </p>
        </>
      )}
    </div>
  )
})
BookView.displayName = 'BookView'

// ページ内シール表示コンポーネント
interface PageStickersProps {
  stickers: PlacedSticker[]
  editingStickerId?: string | null
  onLongPress?: (sticker: PlacedSticker) => void
}

function PageStickers({ stickers, editingStickerId, onLongPress }: PageStickersProps) {
  const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  const handlePointerDown = (sticker: PlacedSticker) => {
    longPressTimerRef.current = setTimeout(() => {
      onLongPress?.(sticker)
    }, 500)
  }

  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 20, // ページコンテンツ(z-10)より上に配置してタッチイベントを受け取れるようにする
        // 3D変形を継承してページと一緒にめくれるように
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      {stickers.map((sticker) => {
        // 編集中のシールも表示する（以前は非表示にしていたが、見えなくなる問題があったため変更）
        const isEditing = sticker.id === editingStickerId

        const stickerSize = 60 * sticker.scale
        const x = sticker.x * 100
        const y = sticker.y * 100
        const imageUrl = sticker.sticker.imageUrl

        // レア度に応じた光彩
        // 注意: box-shadowはシールの透過形状に沿わず四角くなるため削除
        const getRarityGlow = () => {
          // すべてのレアリティでbox-shadowを使用しない（四角いエフェクトを避けるため）
          return 'none'
        }

        // ぷっくりシールの立体感
        const getPuffyStyle = () => {
          if (sticker.sticker.type === 'puffy') {
            return {
              boxShadow: `0 4px 8px rgba(0,0,0,0.3), inset 0 -3px 6px rgba(0,0,0,0.15), inset 0 3px 6px rgba(255,255,255,0.4), ${getRarityGlow()}`,
              transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(1.02)`,
            }
          }
          return {
            boxShadow: getRarityGlow(),
            transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
          }
        }

        return (
          <div
            key={sticker.id}
            data-sticker-id={sticker.id}
            className={`absolute pointer-events-auto cursor-pointer transition-transform duration-150 active:scale-105 ${isEditing ? 'ring-2 ring-purple-500 ring-offset-2 rounded-lg animate-pulse' : ''}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${stickerSize}px`,
              height: `${stickerSize}px`,
              zIndex: isEditing ? 100 : (sticker.zIndex ?? 0), // 編集中は最前面
              // 3D変形継承
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              ...getPuffyStyle(),
            }}
            onPointerDown={(e) => {
              e.stopPropagation()
              e.preventDefault()
              // ポインターをキャプチャして、要素外に移動してもイベントを受け取れるようにする
              ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
              handlePointerDown(sticker)
            }}
            onPointerUp={(e) => {
              e.stopPropagation()
              try {
                ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
              } catch {}
              handlePointerUp()
            }}
            onPointerCancel={(e) => {
              try {
                ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
              } catch {}
              handlePointerUp()
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={sticker.sticker.name}
                className="w-full h-full object-contain"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                🌟
              </div>
            )}
            {/* キラキラシールのエフェクト */}
            {sticker.sticker.type === 'sparkle' && (
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                  animation: 'shimmer 2s ease-in-out infinite',
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ページコンテンツコンポーネント
interface PageContentProps {
  page: BookPage
  pageNumber: number
  bookTheme?: StickerBookTheme
  coverDesign?: CoverDesign
  pageStickers?: PlacedSticker[]
  editingStickerId?: string | null
  onStickerLongPress?: (sticker: PlacedSticker) => void
}

function PageContent({ page, pageNumber, bookTheme, coverDesign, pageStickers = [], editingStickerId, onStickerLongPress }: PageContentProps) {
  // 表紙のスタイルを生成 - パステルカラー
  const getCoverStyle = (): React.CSSProperties => {
    if (!bookTheme) {
      return {
        background: 'linear-gradient(135deg, #C4B5FD 0%, #A78BFA 25%, #8B5CF6 50%, #C4B5FD 75%, #A78BFA 100%)',
        boxShadow: 'inset 0 0 40px rgba(139, 92, 246, 0.2), inset 0 2px 0 rgba(255,255,255,0.2)',
      }
    }
    const { binder } = bookTheme
    let background = binder.color
    if (binder.gradientFrom && binder.gradientTo) {
      background = `linear-gradient(135deg, ${binder.gradientFrom} 0%, ${binder.gradientTo} 25%, ${binder.gradientFrom} 50%, ${binder.gradientTo} 75%, ${binder.gradientFrom} 100%)`
    }
    return {
      background,
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.1)',
      border: binder.borderColor ? `3px solid ${binder.borderColor}` : undefined,
    }
  }

  // 表紙
  if (page.type === 'cover') {
    // カスタム表紙画像がある場合
    if (coverDesign?.coverImage) {
      return (
        <div className="w-full h-full rounded-r-lg relative overflow-hidden">
          {/* カスタム表紙画像 */}
          <img
            src={coverDesign.coverImage}
            alt="表紙"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* 軽い光沢効果 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(120deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.08) 100%)',
            }}
          />
        </div>
      )
    }

    // デフォルトの表紙デザイン
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center rounded-r-lg relative overflow-hidden"
        style={getCoverStyle()}
      >
        {/* 革のような質感 */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l9.9-9.9h-2.83zM32 0l-3.535 3.535L29.88 4.95 32 2.828l2.12 2.122 1.414-1.415L32 0z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        {/* テクスチャオーバーレイ */}
        {bookTheme?.binder.texture === 'glitter' && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'1\' fill=\'white\'/%3E%3Ccircle cx=\'12\' cy=\'8\' r=\'0.5\' fill=\'white\'/%3E%3Ccircle cx=\'8\' cy=\'15\' r=\'1\' fill=\'white\'/%3E%3Ccircle cx=\'18\' cy=\'3\' r=\'0.5\' fill=\'white\'/%3E%3C/svg%3E")',
              animation: 'sparkle 2s ease-in-out infinite',
            }}
          />
        )}
        {bookTheme?.binder.texture === 'leather' && (
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'8\' height=\'8\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'8\' height=\'8\' fill=\'none\' stroke=\'black\' stroke-width=\'0.3\'/%3E%3C/svg%3E")',
            }}
          />
        )}

        {/* 光沢効果 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0.2) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)',
          }}
        />

        {/* 装飾フレーム */}
        <div
          className="absolute inset-4 border-2 border-white/20 rounded-lg pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)',
          }}
        />

        <div className="text-center relative z-10">
          {/* デコレーション */}
          <div className="flex justify-center gap-2 mb-2 text-2xl">
            <span className="animate-pulse">💖</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
            <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>🎀</span>
            <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🩷</span>
            <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>✨</span>
          </div>

          <h2
            className="text-2xl font-bold text-white mb-3"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3)',
            }}
          >
            わたしのシールちょう
          </h2>
          <p
            className="text-white/80 text-sm"
            style={{
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            下をスワイプしてひらく
          </p>
        </div>

        {/* 角の装飾 */}
        <div className="absolute top-4 right-4 text-3xl opacity-40 drop-shadow-lg">⭐</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-40 drop-shadow-lg">🌟</div>
      </div>
    )
  }

  // 見返しページ（表紙の内側）
  if (page.type === 'inner-cover') {
    const innerCoverStyle = getCoverStyle()
    // 表紙と同じテーマカラーを使うが、より落ち着いた内側の雰囲気に
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center rounded-l-lg relative overflow-hidden"
        style={{
          ...innerCoverStyle,
          filter: 'brightness(1.1) saturate(0.8)',
        }}
      >
        {/* 紙のような質感 */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.2) 100%)',
          }}
        />

        {/* 細かいドットパターン */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
          }}
        />

        {/* 光沢効果 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)',
          }}
        />

        {/* 縁取り */}
        <div
          className="absolute inset-3 border border-white/20 rounded-lg pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 15px rgba(255,255,255,0.08)',
          }}
        />

        {/* 小さな装飾 */}
        <div className="absolute top-6 left-6 text-xl opacity-30">✨</div>
        <div className="absolute bottom-6 right-6 text-xl opacity-30">💫</div>
      </div>
    )
  }

  // 裏表紙
  if (page.type === 'back-cover') {
    // カスタム裏表紙画像がある場合
    if (coverDesign?.backCoverImage) {
      return (
        <div className="w-full h-full rounded-l-lg relative overflow-hidden">
          {/* カスタム裏表紙画像 */}
          <img
            src={coverDesign.backCoverImage}
            alt="裏表紙"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* 軽い光沢効果 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(120deg, rgba(255,255,255,0.15) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.08) 100%)',
            }}
          />
        </div>
      )
    }

    // デフォルトの裏表紙デザイン
    const backCoverStyle = getCoverStyle()
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center rounded-l-lg relative overflow-hidden"
        style={backCoverStyle}
      >
        {/* 革のような質感 */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l9.9-9.9h-2.83zM32 0l-3.535 3.535L29.88 4.95 32 2.828l2.12 2.122 1.414-1.415L32 0z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        {/* テクスチャオーバーレイ */}
        {bookTheme?.binder.texture === 'glitter' && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'1\' fill=\'white\'/%3E%3Ccircle cx=\'12\' cy=\'8\' r=\'0.5\' fill=\'white\'/%3E%3Ccircle cx=\'8\' cy=\'15\' r=\'1\' fill=\'white\'/%3E%3Ccircle cx=\'18\' cy=\'3\' r=\'0.5\' fill=\'white\'/%3E%3C/svg%3E")',
            }}
          />
        )}

        {/* 光沢効果 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(120deg, rgba(255,255,255,0.2) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.1) 100%)',
          }}
        />

        <div className="text-center relative z-10">
          <div className="text-4xl mb-4">🎀</div>
          <p
            className="text-white/80 text-sm"
            style={{
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            おわり
          </p>
        </div>
      </div>
    )
  }

  // 左ページ（装飾・テーマ用）
  if (page.side === 'left') {
    return (
      <LeftPage
        page={page}
        pageNumber={pageNumber}
        pageStickers={pageStickers}
        editingStickerId={editingStickerId}
        onStickerLongPress={onStickerLongPress}
      />
    )
  }

  // 右ページ（シール貼り付け用メインスペース）または通常ページ
  return (
    <RightPage
      page={page}
      pageNumber={pageNumber}
      pageStickers={pageStickers}
      editingStickerId={editingStickerId}
      onStickerLongPress={onStickerLongPress}
    />
  )
}

// 左ページコンポーネントのProps型
interface LeftPageProps {
  page: BookPage
  pageNumber: number
  pageStickers?: PlacedSticker[]
  editingStickerId?: string | null
  onStickerLongPress?: (sticker: PlacedSticker) => void
}

// 左ページコンポーネント（装飾・テーマ表示用）- パステルカラー
function LeftPage({ page, pageNumber, pageStickers = [], editingStickerId, onStickerLongPress }: LeftPageProps) {
  const theme = page.theme || {}
  const bgColor = theme.backgroundColor || '#FEFBFF'
  const pattern = theme.pattern || 'dots'
  const patternColor = theme.patternColor || 'rgba(167, 139, 250, 0.3)'
  const decoration = theme.decoration || 'none'

  // パターン生成 - パステルカラー
  const getPatternStyle = () => {
    switch (pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(circle, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }
      case 'grid':
        return {
          backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }
      case 'lines':
        return {
          backgroundImage: `repeating-linear-gradient(0deg, ${patternColor} 0px, ${patternColor} 1px, transparent 1px, transparent 20px)`,
        }
      case 'stars':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ctext x='5' y='15' font-size='10' fill='%23A78BFA' opacity='0.3'%3E⭐%3C/text%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }
      case 'hearts':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ctext x='5' y='15' font-size='10' fill='%23F9A8D4' opacity='0.4'%3E♡%3C/text%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px',
        }
      default:
        return {}
    }
  }

  // 装飾取得
  const getDecorationEmoji = () => {
    switch (decoration) {
      case 'ribbon': return '🎀'
      case 'flower': return '🌸'
      case 'star': return '⭐'
      case 'heart': return '💖'
      default: return null
    }
  }

  const decorationEmoji = getDecorationEmoji()

  return (
    <div
      className="w-full h-full p-4 relative"
      style={{
        background: `linear-gradient(180deg, ${bgColor} 0%, #FFFFFF 100%)`,
        boxShadow: 'inset -5px 0 15px rgba(139, 92, 246, 0.03), inset 0 0 20px rgba(139, 92, 246, 0.02)',
        // 3D変形継承（overflow-hiddenを削除）
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* ページ番号 */}
      <div
        className="absolute bottom-2 left-3 text-xs font-medium"
        style={{
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
          color: '#A78BFA',
          opacity: 0.5,
        }}
      >
        {pageNumber}
      </div>

      {/* パターン背景 */}
      <div
        className="absolute inset-4 opacity-15"
        style={getPatternStyle()}
      />

      {/* コーナー装飾 */}
      {decorationEmoji && (
        <>
          <div className="absolute top-3 left-3 text-2xl opacity-40">{decorationEmoji}</div>
          <div className="absolute top-3 right-3 text-2xl opacity-40 scale-x-[-1]">{decorationEmoji}</div>
          <div className="absolute bottom-8 left-3 text-2xl opacity-40 scale-y-[-1]">{decorationEmoji}</div>
          <div className="absolute bottom-8 right-3 text-2xl opacity-40 scale-[-1]">{decorationEmoji}</div>
        </>
      )}

      {/* 見開き表示のラベル */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-4xl mb-2 opacity-20">📝</div>
        <p
          className="text-xs opacity-40"
          style={{
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            color: '#A78BFA',
          }}
        >
          メモページ
        </p>
      </div>

      {/* ページコンテンツ */}
      <div className="relative z-10 w-full h-full">
        {page.content}
      </div>

      {/* ページ内シール表示 - ページと一緒にめくれる */}
      <PageStickers
        stickers={pageStickers}
        editingStickerId={editingStickerId}
        onLongPress={onStickerLongPress}
      />
    </div>
  )
}

// 右ページコンポーネントのProps型
interface RightPageProps {
  page: BookPage
  pageNumber: number
  pageStickers?: PlacedSticker[]
  editingStickerId?: string | null
  onStickerLongPress?: (sticker: PlacedSticker) => void
}

// 右ページコンポーネント（シール貼り付けメインスペース）- パステルカラー
function RightPage({ page, pageNumber, pageStickers = [], editingStickerId, onStickerLongPress }: RightPageProps) {
  return (
    <div
      className="w-full h-full p-4 relative"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FEFBFF 100%)',
        boxShadow: 'inset 5px 0 15px rgba(139, 92, 246, 0.02), inset 0 0 20px rgba(139, 92, 246, 0.01)',
        // 3D変形継承
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* ページ番号 */}
      <div
        className="absolute bottom-2 right-3 text-xs font-medium"
        style={{
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
          color: '#A78BFA',
          opacity: 0.5,
        }}
      >
        {pageNumber}
      </div>

      {/* グリッドライン（ドット柄）- パステル */}
      <div
        className="absolute inset-4 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(167, 139, 250, 0.4) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* シール配置ガイド - パステル */}
      <div
        className="absolute inset-6 border-2 border-dashed rounded-xl pointer-events-none"
        style={{
          borderColor: 'rgba(167, 139, 250, 0.12)',
        }}
      />

      {/* ページコンテンツ */}
      <div className="relative z-10 w-full h-full">
        {page.content || (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-3xl mb-2 opacity-30">✨</div>
              <p
                className="text-sm"
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  color: '#A78BFA',
                }}
              >
                シールをはってね！
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ページ内シール表示 - ページと一緒にめくれる */}
      <PageStickers
        stickers={pageStickers}
        editingStickerId={editingStickerId}
        onLongPress={onStickerLongPress}
      />
    </div>
  )
}
