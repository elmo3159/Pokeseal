'use client'

import { ReactNode, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { IconButton } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  showCloseButton?: boolean
  size?: 'sm' | 'md' | 'lg' | 'full'
  closeOnOverlay?: boolean
}

const sizeStyles = {
  sm: { width: '320px', maxHeight: '60vh' },
  md: { width: '400px', maxHeight: '70vh' },
  lg: { width: '500px', maxHeight: '80vh' },
  full: { width: '95vw', maxHeight: '90vh' },
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  size = 'md',
  closeOnOverlay = true,
}: ModalProps) {
  // ESCキーで閉じる
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  const sizeConfig = sizeStyles[size]

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(74, 32, 104, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={closeOnOverlay ? onClose : undefined}
    >
      {/* モーダル本体 */}
      <div
        className="relative flex flex-col"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '24px',
          boxShadow: '0 16px 48px rgba(139, 92, 246, 0.2), 0 4px 16px rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          width: sizeConfig.width,
          maxWidth: '95vw',
          maxHeight: sizeConfig.maxHeight,
          animation: 'scaleIn 0.2s ease-out',
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        {(title || showCloseButton) && (
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{
              borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
            }}
          >
            {title && (
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#6B3FA0',
                }}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <IconButton
                icon="✕"
                size="sm"
                variant="ghost"
                onClick={onClose}
                aria-label="とじる"
              />
            )}
          </div>
        )}

        {/* コンテンツ */}
        <div
          className="flex-1 overflow-y-auto px-6 py-4"
          style={{
            overscrollBehavior: 'contain',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )

  // Portalでbodyに追加
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}

// 確認ダイアログ
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'はい',
  cancelText = 'いいえ',
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" showCloseButton={false}>
      <div className="flex flex-col gap-6">
        <p
          style={{
            fontSize: '16px',
            color: '#7A5090',
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold transition-all hover:opacity-80 active:scale-95"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(155, 111, 208, 0.3)',
              color: '#7A5090',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 py-3 rounded-xl font-bold transition-all hover:opacity-80 active:scale-95"
            style={{
              background: variant === 'danger'
                ? 'linear-gradient(135deg, #F44336 0%, #E53935 100%)'
                : 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
              color: '#FFFFFF',
              boxShadow: variant === 'danger'
                ? '0 4px 16px rgba(244, 67, 54, 0.3)'
                : '0 4px 16px rgba(139, 92, 246, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
