'use client'

import React, { useState, useCallback } from 'react'
import { tradeBoardService } from '@/services/tradeBoard/tradeBoardService'
import { WantedStickerSelector } from './WantedStickerSelector'
import { TRADE_BOARD_RULES } from '@/domain/tradeBoard'
import type { BookSnapshot, BookSnapshotPage } from '@/domain/tradeBoard'
import type { BookPage } from '@/features/sticker-book/BookView'
import type { PlacedSticker } from '@/features/sticker-book/StickerPlacement'
import type { PlacedDecoItem } from '@/domain/decoItems'

interface TradeBoardCreateModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  pages: BookPage[]
  placedStickers: PlacedSticker[]
  placedDecoItems: PlacedDecoItem[]
  coverDesignId: string
  onCreated: () => void
}

export const TradeBoardCreateModal: React.FC<TradeBoardCreateModalProps> = ({
  isOpen,
  onClose,
  userId,
  pages,
  placedStickers,
  placedDecoItems,
  coverDesignId,
  onCreated,
}) => {
  const [step, setStep] = useState<'stickers' | 'message'>('stickers')
  const [selectedStickerIds, setSelectedStickerIds] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleClose = useCallback(() => {
    setStep('stickers')
    setSelectedStickerIds([])
    setMessage('')
    onClose()
  }, [onClose])

  const captureBookSnapshot = useCallback((): BookSnapshot => {
    const snapshotPages: BookSnapshotPage[] = pages.map((page, index) => {
      const pageStickers = placedStickers.filter(s => s.pageId === page.id)
      const pageDecos = placedDecoItems.filter(d => d.pageId === page.id)

      return {
        pageId: page.id,
        pageNumber: index,
        pageType: page.type,
        side: page.side,
        themeConfig: page.theme ? (page.theme as Record<string, unknown>) : undefined,
        placedStickers: pageStickers.map(s => ({
          id: s.id,
          stickerId: s.stickerId,
          sticker: {
            id: s.sticker.id,
            name: s.sticker.name,
            image_url: s.sticker.imageUrl || '',
            rarity: s.sticker.rarity,
            character: (s.sticker as Record<string, unknown>).character as string | undefined,
          },
          x: s.x,
          y: s.y,
          rotation: s.rotation,
          scale: s.scale,
          zIndex: s.zIndex,
          upgradeRank: s.upgradeRank,
        })),
        placedDecoItems: pageDecos.map(d => ({
          id: d.id,
          decoItemId: d.decoItemId,
          decoItem: {
            id: d.decoItem.id,
            name: d.decoItem.name,
            image_url: d.decoItem.imageUrl || '',
          },
          x: d.x,
          y: d.y,
          rotation: d.rotation,
          scale: d.scale,
          width: d.width,
          height: d.height,
          zIndex: d.zIndex,
        })),
      }
    })

    return {
      pages: snapshotPages,
      coverDesignId,
      capturedAt: new Date().toISOString(),
    }
  }, [pages, placedStickers, placedDecoItems, coverDesignId])

  const handleSubmit = useCallback(async () => {
    if (selectedStickerIds.length === 0) return
    setSubmitting(true)

    const bookSnapshot = captureBookSnapshot()
    const result = await tradeBoardService.createPost(userId, {
      wantedStickerIds: selectedStickerIds,
      message: message.trim() || undefined,
      bookSnapshot,
    })

    setSubmitting(false)
    if (result) {
      handleClose()
      onCreated()
    }
  }, [selectedStickerIds, message, captureBookSnapshot, userId, handleClose, onCreated])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-t-3xl flex flex-col"
        style={{
          background: '#FFF5F8',
          maxHeight: '85vh',
        }}
      >
        {/* Header */}
        <div
          className="shrink-0 px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '2px solid #E8D4C0' }}
        >
          <button
            onClick={step === 'message' ? () => setStep('stickers') : handleClose}
            className="text-sm font-bold"
            style={{ color: '#A67C52' }}
          >
            {step === 'message' ? '← もどる' : '✕ とじる'}
          </button>
          <h3 className="text-base font-bold" style={{ color: '#8B5A2B' }}>
            {step === 'stickers' ? 'ほしいシールをえらぶ' : 'メッセージ'}
          </h3>
          <div className="w-12" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {step === 'stickers' ? (
            <>
              <p className="text-xs mb-3" style={{ color: '#A67C52' }}>
                こうかんしてほしいシールをえらんでね（さいだい{TRADE_BOARD_RULES.maxWantedStickers}まい）
              </p>
              <WantedStickerSelector
                selectedIds={selectedStickerIds}
                onChangeSelected={setSelectedStickerIds}
              />
            </>
          ) : (
            <>
              <p className="text-xs mb-3" style={{ color: '#A67C52' }}>
                メッセージをつけよう（にんい）
              </p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value.slice(0, TRADE_BOARD_RULES.maxMessageLength))}
                placeholder="このシールさがしてます！"
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{
                  background: '#FFFFFF',
                  border: '2px solid #E8D4C0',
                  color: '#8B5A2B',
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                }}
              />
              <div className="text-right text-xs mt-1" style={{ color: '#C4A484' }}>
                {message.length}/{TRADE_BOARD_RULES.maxMessageLength}
              </div>

              {/* プレビュー */}
              <div className="mt-4">
                <div className="text-xs font-bold mb-2" style={{ color: '#A67C52' }}>
                  シール帳もいっしょに投稿されるよ
                </div>
                <div
                  className="rounded-xl p-3 flex items-center gap-3"
                  style={{
                    background: '#FBF5EF',
                    border: '1.5px solid #E8D4C0',
                  }}
                >
                  <span style={{ fontSize: '32px' }}>&#x1F4D6;</span>
                  <div>
                    <div className="text-sm font-bold" style={{ color: '#8B5A2B' }}>
                      あなたのシール帳
                    </div>
                    <div className="text-xs" style={{ color: '#C4A484' }}>
                      {pages.length}ページ ・ {placedStickers.length}まいのシール
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 py-4" style={{ borderTop: '2px solid #E8D4C0' }}>
          {step === 'stickers' ? (
            <button
              onClick={() => setStep('message')}
              disabled={selectedStickerIds.length === 0}
              className="w-full py-3.5 rounded-2xl font-bold text-base transition-all active:scale-95"
              style={{
                background: selectedStickerIds.length > 0
                  ? 'linear-gradient(135deg, #C4956A, #A67C52)'
                  : '#D4C4B0',
                color: '#FFF',
                opacity: selectedStickerIds.length > 0 ? 1 : 0.6,
              }}
            >
              つぎへ ({selectedStickerIds.length}まいえらんだ)
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl font-bold text-base transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #C4956A, #A67C52)',
                color: '#FFF',
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? '投稿ちゅう...' : '投稿する'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
