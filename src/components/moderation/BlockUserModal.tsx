'use client'

import React, { useState } from 'react'
import { moderationService } from '@/services/moderation'

interface BlockUserModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string // ブロックする人
  targetUserId: string // ブロックされる人
  targetUserName: string
  targetUserAvatar?: string | null
  onBlocked?: () => void
}

export const BlockUserModal: React.FC<BlockUserModalProps> = ({
  isOpen,
  onClose,
  userId,
  targetUserId,
  targetUserName,
  targetUserAvatar,
  onBlocked,
}) => {
  const [isBlocking, setIsBlocking] = useState(false)
  const [blocked, setBlocked] = useState(false)

  if (!isOpen) return null

  const handleBlock = async () => {
    setIsBlocking(true)

    const success = await moderationService.blockUser(userId, targetUserId)

    setIsBlocking(false)

    if (success) {
      setBlocked(true)
      onBlocked?.()
    }
  }

  const handleClose = () => {
    setBlocked(false)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* オーバーレイ */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* モーダル */}
      <div
        style={{
          position: 'relative',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '360px',
          overflow: 'hidden',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #F3E8FF',
            background: 'linear-gradient(to right, #FEE2E2, #FCE7F3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#DC2626', margin: 0 }}>
              {blocked ? 'ブロックしました' : 'ブロックする'}
            </h2>
            <button
              onClick={handleClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#FEE2E2',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: '#DC2626',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div style={{ padding: '24px' }}>
          {blocked ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>
                ブロック完了
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, marginBottom: '20px' }}>
                {targetUserName} さんをブロックしました。<br />
                投稿やタイムラインに表示されなくなります。
              </p>
              <button
                onClick={handleClose}
                style={{
                  padding: '12px 32px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
                  color: 'white',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                とじる
              </button>
            </div>
          ) : (
            <>
              {/* ユーザー情報 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#E5E7EB',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {targetUserAvatar ? (
                    <img
                      src={targetUserAvatar}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                      }}
                    >
                      👤
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151' }}>
                    {targetUserName}
                  </div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                    このユーザーをブロックしますか？
                  </div>
                </div>
              </div>

              {/* 説明 */}
              <div
                style={{
                  background: '#FEF2F2',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px',
                }}
              >
                <p style={{ fontSize: '13px', color: '#DC2626', fontWeight: 'bold', marginBottom: '8px' }}>
                  ブロックすると...
                </p>
                <ul style={{ fontSize: '12px', color: '#6B7280', margin: 0, paddingLeft: '16px', lineHeight: 1.8 }}>
                  <li>相手のタイムライン投稿が見えなくなります</li>
                  <li>相手と交換ができなくなります</li>
                  <li>相手からのコメントが見えなくなります</li>
                  <li>相手には通知されません</li>
                </ul>
              </div>

              {/* ボタン */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    background: '#F3F4F6',
                    color: '#374151',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleBlock}
                  disabled={isBlocking}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                    color: 'white',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    opacity: isBlocking ? 0.7 : 1,
                  }}
                >
                  {isBlocking ? 'ブロック中...' : 'ブロックする'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlockUserModal
