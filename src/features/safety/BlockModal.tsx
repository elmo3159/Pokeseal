'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { CreateBlockInput, MAX_BLOCK_REASON_LENGTH } from '@/domain/safety'

interface BlockModalProps {
  isOpen: boolean
  userId: string
  userName: string
  isBlocked: boolean
  onClose: () => void
  onBlock: (input: CreateBlockInput) => void
  onUnblock: (userId: string) => void
}

export const BlockModal: React.FC<BlockModalProps> = ({
  isOpen,
  userId,
  userName,
  isBlocked,
  onClose,
  onBlock,
  onUnblock
}) => {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [action, setAction] = useState<'block' | 'unblock' | null>(null)

  if (!isOpen) return null

  const handleBlock = async () => {
    setIsSubmitting(true)
    try {
      await onBlock({
        blockedId: userId,
        reason: reason.trim() || undefined
      })
      setAction('block')
      setShowConfirm(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnblock = async () => {
    setIsSubmitting(true)
    try {
      await onUnblock(userId)
      setAction('unblock')
      setShowConfirm(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setReason('')
    setShowConfirm(false)
    setAction(null)
    onClose()
  }

  // 完了画面
  if (showConfirm) {
    return createPortal((
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }} onClick={handleClose} />
        <div style={{
          position: 'relative',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '384px',
          overflow: 'hidden',
          padding: '24px',
          textAlign: 'center',
          animation: 'scaleIn 0.2s ease-out',
        }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>
            {action === 'block' ? '🚫' : '✅'}
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6B21A8', marginBottom: '8px' }}>
            {action === 'block' ? 'ブロックしました' : 'ブロックかいじょ'}
          </h2>
          <p style={{ fontSize: '14px', color: '#9333EA', marginBottom: '24px' }}>
            {action === 'block' ? (
              <>
                {userName}さんからの<br />
                こうかん申し込みや投稿が<br />
                見えなくなります
              </>
            ) : (
              <>
                {userName}さんの<br />
                ブロックをかいじょしました
              </>
            )}
          </p>
          <button
            onClick={handleClose}
            style={{
              width: '100%',
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            とじる
          </button>
        </div>
      </div>
    ), document.body)
  }

  // ブロック解除画面
  if (isBlocked) {
    return createPortal((
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }} onClick={handleClose} />
        <div style={{
          position: 'relative',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '384px',
          overflow: 'hidden',
          animation: 'scaleIn 0.2s ease-out',
        }}>
          {/* ヘッダー */}
          <div style={{ background: 'linear-gradient(to right, #9CA3AF, #6B7280)', padding: '16px' }}>
            <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
              🚫 ブロック中
            </h2>
          </div>

          {/* コンテンツ */}
          <div style={{ padding: '16px' }}>
            <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>👤</p>
              <p style={{ fontWeight: 'bold', color: '#6B21A8' }}>{userName}</p>
              <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                この人をブロックしています
              </p>
            </div>

            <div style={{ background: '#FEFCE8', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', color: '#A16207' }}>
                <span style={{ fontWeight: 'bold' }}>ブロックすると：</span><br />
                • こうかん申し込みがとどかない<br />
                • 投稿やコメントがみえない<br />
                • あなたの投稿も相手にみえない
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleClose}
                style={{
                  flex: 1,
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  borderRadius: '12px',
                  background: '#F3F4F6',
                  color: '#4B5563',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                とじる
              </button>
              <button
                onClick={handleUnblock}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(to right, #4ADE80, #34D399)',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? '...' : 'かいじょする'}
              </button>
            </div>
          </div>
        </div>
      </div>
    ), document.body)
  }

  // ブロック確認画面
  return createPortal((
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }} onClick={handleClose} />
      <div style={{
        position: 'relative',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '384px',
        overflow: 'hidden',
        animation: 'scaleIn 0.2s ease-out',
      }}>
        {/* ヘッダー */}
        <div style={{ background: 'linear-gradient(to right, #4B5563, #374151)', padding: '16px' }}>
          <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
            🚫 ブロックしますか？
          </h2>
        </div>

        {/* コンテンツ */}
        <div style={{ padding: '16px' }}>
          <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>👤</p>
            <p style={{ fontWeight: 'bold', color: '#6B21A8' }}>{userName}</p>
          </div>

          <div style={{ background: '#FEFCE8', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: '#A16207' }}>
              <span style={{ fontWeight: 'bold' }}>ブロックすると：</span><br />
              • こうかん申し込みがとどかない<br />
              • 投稿やコメントがみえない<br />
              • あなたの投稿も相手にみえない<br />
              • いつでもかいじょできます
            </p>
          </div>

          {/* 理由入力（任意） */}
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#6B21A8', marginBottom: '8px' }}>
            メモ（じぶんよう）
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, MAX_BLOCK_REASON_LENGTH))}
            placeholder="ブロックする理由をメモできます..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '2px solid #E5E7EB',
              resize: 'none',
              fontSize: '14px',
              outline: 'none',
            }}
            rows={2}
          />
          <p style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'right', marginTop: '4px' }}>
            {reason.length}/{MAX_BLOCK_REASON_LENGTH}
          </p>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              onClick={handleClose}
              style={{
                flex: 1,
                paddingTop: '12px',
                paddingBottom: '12px',
                borderRadius: '12px',
                background: '#F3F4F6',
                color: '#4B5563',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              やめる
            </button>
            <button
              onClick={handleBlock}
              disabled={isSubmitting}
              style={{
                flex: 1,
                paddingTop: '12px',
                paddingBottom: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(to right, #4B5563, #374151)',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? '...' : 'ブロックする'}
            </button>
          </div>
        </div>
      </div>
    </div>
  ), document.body)
}

export default BlockModal
