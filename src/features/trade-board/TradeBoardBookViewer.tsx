'use client'

import React, { useMemo, lazy, Suspense } from 'react'
import type { BookSnapshot } from '@/domain/tradeBoard'
import type { BookPage } from '@/features/sticker-book/BookView'
import type { PlacedSticker } from '@/features/sticker-book/StickerPlacement'
import type { PlacedDecoItem } from '@/domain/decoItems'

const BookView = lazy(() => import('@/features/sticker-book/BookView').then(m => ({ default: m.BookView })))

interface TradeBoardBookViewerProps {
  snapshot: BookSnapshot
  width?: number
  height?: number
  displayScale?: number
}

export const TradeBoardBookViewer: React.FC<TradeBoardBookViewerProps> = ({
  snapshot,
  width = 280,
  height = 420,
  displayScale,
}) => {
  const { pages, placedStickers, placedDecoItems } = useMemo(() => {
    const bookPages: BookPage[] = snapshot.pages.map(p => ({
      id: p.pageId,
      type: p.pageType || 'page',
      side: p.side,
      theme: p.themeConfig as BookPage['theme'] ?? undefined,
    }))

    const allStickers: PlacedSticker[] = snapshot.pages.flatMap(p =>
      p.placedStickers.map(s => ({
        id: s.id,
        stickerId: s.stickerId,
        sticker: {
          id: s.sticker.id,
          name: s.sticker.name,
          imageUrl: s.sticker.image_url,
          rarity: s.sticker.rarity,
          type: 'normal' as const,
          series: undefined,
          upgradeRank: s.upgradeRank,
        },
        pageId: p.pageId,
        x: s.x,
        y: s.y,
        rotation: s.rotation,
        scale: s.scale,
        zIndex: s.zIndex,
        placedAt: new Date().toISOString(),
        upgradeRank: s.upgradeRank,
      }))
    )

    const allDecos: PlacedDecoItem[] = snapshot.pages.flatMap(p =>
      (p.placedDecoItems || []).map(d => ({
        id: d.id,
        decoItemId: d.decoItemId,
        decoItem: {
          id: d.decoItem.id,
          name: d.decoItem.name,
          type: 'stamp' as const,
          imageUrl: d.decoItem.image_url,
          baseWidth: d.width || 60,
          baseHeight: d.height || 60,
          rotatable: true,
          rarity: 1 as const,
          obtainMethod: 'default' as const,
        },
        pageId: p.pageId,
        x: d.x,
        y: d.y,
        rotation: d.rotation,
        scale: d.scale,
        width: d.width,
        height: d.height,
        zIndex: d.zIndex,
        placedAt: new Date().toISOString(),
      }))
    )

    return { pages: bookPages, placedStickers: allStickers, placedDecoItems: allDecos }
  }, [snapshot])

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center" style={{ width, height }}>
        <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#D4C4B0', borderTopColor: 'transparent' }} />
      </div>
    }>
      <BookView
        pages={pages}
        width={width}
        height={height}
        coverDesignId={snapshot.coverDesignId}
        hideHints
        placedStickers={placedStickers}
        placedDecoItems={placedDecoItems}
        renderNavigation
        displayScale={displayScale}
      />
    </Suspense>
  )
}
