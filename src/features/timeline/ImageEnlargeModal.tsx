'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { PlacedSticker } from '@/features/sticker-book'

interface ImageEnlargeModalProps {
  isOpen: boolean
  onClose: () => void
  // 画像URLまたはシール帳ページのデータ
  imageUrl?: string
  // シール帳ページとして表示する場合
  pageData?: {
    placedStickers: PlacedSticker[]
    backgroundColor?: string
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

        {/* シール帳ページ表示の場合 */}
        {pageData && (
          <div
            style={{
              position: 'relative',
              width: '90vw',
              maxWidth: '500px',
              aspectRatio: '3/4',
              background: pageData.backgroundColor || '#fff',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
          >
            {/* グリッドライン */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.2, pointerEvents: 'none' }}>
              {Array.from({ length: 6 }).map((_, row) =>
                Array.from({ length: 4 }).map((_, col) => (
                  <div
                    key={`grid-${row}-${col}`}
                    style={{
                      position: 'absolute',
                      width: '25%',
                      height: '16.666%',
                      border: '1px solid #E9D5FF',
                      left: `${col * 25}%`,
                      top: `${row * 16.666}%`,
                    }}
                  />
                ))
              )}
            </div>

            {/* シール */}
            {pageData.placedStickers.map((sticker) => (
              <div
                key={sticker.id}
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  left: `${sticker.x * 100}%`,
                  top: `${sticker.y * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale || 1})`,
                  width: '80px',
                  height: '80px',
                  zIndex: sticker.zIndex || 1,
                }}
              >
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
              </div>
            ))}
          </div>
        )}

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
