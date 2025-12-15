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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(74, 32, 104, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={closeOnOverlay ? onClose : undefined}
    >
      {/* モーダル本体 */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
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
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '24px',
              paddingRight: '24px',
              paddingTop: '16px',
              paddingBottom: '16px',
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
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '16px',
            paddingBottom: '16px',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <p
          style={{
            fontSize: '16px',
            color: '#7A5090',
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '12px',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(155, 111, 208, 0.3)',
              color: '#7A5090',
              cursor: 'pointer',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            style={{
              flex: 1,
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '12px',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              background: variant === 'danger'
                ? 'linear-gradient(135deg, #F44336 0%, #E53935 100%)'
                : 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
              color: '#FFFFFF',
              boxShadow: variant === 'danger'
                ? '0 4px 16px rgba(244, 67, 54, 0.3)'
                : '0 4px 16px rgba(139, 92, 246, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}
