'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { PlacedSticker } from '@/features/sticker-book'
import { PlacedDecoItem } from '@/domain/decoItems'
import { StickerAura } from '@/components/upgrade'
import { UPGRADE_RANKS, type UpgradeRank } from '@/constants/upgradeRanks'
import { getPatternStyle, getDecorationEmoji } from '@/features/sticker-book/BookView'
import type { PageTheme } from '@/features/sticker-book/BookView'

interface ImageEnlargeModalProps {
  isOpen: boolean
  onClose: () => void
  // 画像URLまたはシール帳ページのデータ
  imageUrl?: string
  // シール帳ページとして表示する場合
  pageData?: {
    placedStickers: PlacedSticker[]
    placedDecoItems?: PlacedDecoItem[]
    backgroundColor?: string
    themeConfig?: Record<string, unknown> | null
  }
  userName?: string
  caption?: string
}

export const ImageEnlargeModal: React.FC<ImageEnlargeModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  pageData,
  userName,
  caption,
}) => {
  const [mounted, setMounted] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // モーダルが開いたときにスクロールを無効化
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  if (!mounted || !isOpen) return null

  const modalContent = (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        transition: 'opacity 0.2s ease',
        opacity: isClosing ? 0 : 1,
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* 閉じるボタン */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10,
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s',
          paddingTop: 'max(16px, env(safe-area-inset-top, 16px))',
        }}
      >
        <span style={{ fontSize: '24px' }}>✕</span>
      </button>

      {/* メインコンテンツ */}
      <div
        style={{
          position: 'relative',
          maxWidth: '95vw',
          maxHeight: '85vh',
          transition: 'transform 0.2s',
          transform: isClosing ? 'scale(0.95)' : 'scale(1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 画像表示の場合 */}
        {imageUrl && !pageData && (
          <div style={{ position: 'relative' }}>
            <img
              src={imageUrl}
              alt="拡大表示"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
            />
          </div>
        )}

        {/* シール帳ページ表示の場合 - BookViewと同じ表示方式 */}
        {pageData && (() => {
          const theme = pageData.themeConfig as PageTheme | null | undefined
          const bgColor = theme?.backgroundColor || '#FEFBFF'
          const bgGradientTo = theme?.backgroundGradientTo || '#FFFFFF'
          const pattern = theme?.pattern || 'dots'
          const patternColor = theme?.patternColor || 'rgba(167, 139, 250, 0.3)'
          const patternOpacity = theme?.patternOpacity ?? 0.15
          const decoration = theme?.decoration || 'none'
          const decorationEmoji = getDecorationEmoji(decoration)
          const patternStyle = getPatternStyle(pattern, patternColor)

          return (
          <div
            style={{
              position: 'relative',
              // BookViewと同じアスペクト比 (320:480 = 2:3)
              width: '320px',
              height: '480px',
              maxWidth: '90vw',
              maxHeight: '70vh',
              background: `linear-gradient(180deg, ${bgColor} 0%, ${bgGradientTo} 100%)`,
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
          >
            {/* パターン背景 */}
            <div style={{ position: 'absolute', inset: '16px', ...patternStyle, opacity: patternOpacity, zIndex: 2, pointerEvents: 'none' }} />

            {/* フレーム装飾 */}
            {theme?.frameColor && (
              <div
                style={{
                  position: 'absolute',
                  inset: '6px',
                  borderRadius: '22px',
                  border: `4px solid ${theme.frameColor}`,
                  boxShadow: theme.frameGlowColor
                    ? `0 0 20px ${theme.frameGlowColor}, 0 0 40px ${theme.frameGlowColor}40, inset 0 0 12px ${theme.frameGlowColor}`
                    : 'none',
                  zIndex: 6,
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* コーナー装飾（絵文字） */}
            {decorationEmoji && (
              <>
                <div style={{ position: 'absolute', top: 12, left: 12, fontSize: 24, opacity: 0.6, zIndex: 7 }}>{decorationEmoji}</div>
                <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 24, opacity: 0.6, transform: 'scaleX(-1)', zIndex: 7 }}>{decorationEmoji}</div>
                <div style={{ position: 'absolute', bottom: 32, left: 12, fontSize: 24, opacity: 0.6, transform: 'scaleY(-1)', zIndex: 7 }}>{decorationEmoji}</div>
                <div style={{ position: 'absolute', bottom: 32, right: 12, fontSize: 24, opacity: 0.6, transform: 'scale(-1)', zIndex: 7 }}>{decorationEmoji}</div>
              </>
            )}

            {/* コーナー装飾（画像） */}
            {decoration === 'image' && theme?.cornerImage && (
              <>
                <img src={theme.cornerImage} alt="" style={{ position: 'absolute', top: 8, left: 8, width: 48, height: 48, objectFit: 'contain', opacity: 0.9, zIndex: 7 }} />
                <img src={theme.cornerImage} alt="" style={{ position: 'absolute', top: 8, right: 8, width: 48, height: 48, objectFit: 'contain', opacity: 0.9, transform: 'scaleX(-1)', zIndex: 7 }} />
                <img src={theme.cornerImage} alt="" style={{ position: 'absolute', bottom: 8, left: 8, width: 48, height: 48, objectFit: 'contain', opacity: 0.9, transform: 'scaleY(-1)', zIndex: 7 }} />
                <img src={theme.cornerImage} alt="" style={{ position: 'absolute', bottom: 8, right: 8, width: 48, height: 48, objectFit: 'contain', opacity: 0.9, transform: 'scale(-1)', zIndex: 7 }} />
              </>
            )}

            {/* シール配置 - BookViewのPageStickersと同じ構造 */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 40,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                overflow: 'visible',
              }}
            >
              {pageData.placedStickers.map((sticker) => {
                // BookViewと同じ計算: 60 * scale
                const stickerSize = 60 * (sticker.scale || 1)
                const upgradeRank = (sticker.upgradeRank ?? UPGRADE_RANKS.NORMAL) as UpgradeRank
                return (
                  <div
                    key={sticker.id}
                    style={{
                      position: 'absolute',
                      left: `${sticker.x * 100}%`,
                      top: `${sticker.y * 100}%`,
                      width: stickerSize,
                      height: stickerSize,
                      transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                      zIndex: 40 + (sticker.zIndex || 1),
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                      overflow: 'visible',
                    }}
                  >
                    <StickerAura upgradeRank={upgradeRank} style={{ width: '100%', height: '100%' }}>
                      <img
                        src={sticker.sticker.imageUrl}
                        alt={sticker.sticker.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1))',
                        }}
                        draggable={false}
                      />
                    </StickerAura>
                  </div>
                )
              })}
            </div>

            {/* デコアイテム配置 - BookViewのPageDecosと同じ構造 */}
            {pageData.placedDecoItems && pageData.placedDecoItems.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none',
                  zIndex: 50,
                  backfaceVisibility: 'hidden',
                }}
              >
                {pageData.placedDecoItems.map((deco) => {
                  // BookViewと同じ計算
                  const decoWidth = deco.width ?? deco.decoItem.baseWidth ?? 60
                  const decoHeight = deco.height ?? deco.decoItem.baseHeight ?? 60
                  return (
                    <div
                      key={deco.id}
                      style={{
                        position: 'absolute',
                        left: `${deco.x * 100}%`,
                        top: `${deco.y * 100}%`,
                        width: decoWidth,
                        height: decoHeight,
                        transform: `translate(-50%, -50%) rotate(${deco.rotation}deg)`,
                        zIndex: 50 + (deco.zIndex ?? 1),
                      }}
                    >
                      <img
                        src={deco.decoItem.imageUrl}
                        alt={deco.decoItem.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                        draggable={false}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          )
        })()}

        {/* ユーザー名とキャプション */}
        {(userName || caption) && (
          <div style={{ marginTop: '16px', paddingLeft: '16px', paddingRight: '16px', textAlign: 'center' }}>
            {userName && (
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '4px' }}>@{userName}</p>
            )}
            {caption && (
              <p style={{ color: 'white', fontSize: '16px', maxWidth: '448px', marginLeft: 'auto', marginRight: 'auto' }}>{caption}</p>
            )}
          </div>
        )}
      </div>

      {/* ピンチズームのヒント */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '8px',
        paddingBottom: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '9999px',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '12px',
      }}>
        タップで閉じる
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default ImageEnlargeModal
