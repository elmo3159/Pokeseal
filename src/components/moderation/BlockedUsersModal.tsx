'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { moderationService, type UserBlock } from '@/services/moderation'

interface BlockedUsersModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export const BlockedUsersModal: React.FC<BlockedUsersModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [blockedUsers, setBlockedUsers] = useState<UserBlock[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [unblockingId, setUnblockingId] = useState<string | null>(null)

  const fetchBlockedUsers = useCallback(async () => {
    setIsLoading(true)
    const users = await moderationService.getBlockedUsers(userId)
    setBlockedUsers(users)
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    if (isOpen) {
      fetchBlockedUsers()
    }
  }, [isOpen, fetchBlockedUsers])

  if (!isOpen) return null

  const handleUnblock = async (blockedId: string) => {
    setUnblockingId(blockedId)
    const success = await moderationService.unblockUser(userId, blockedId)
    if (success) {
      setBlockedUsers(prev => prev.filter(u => u.blockedId !== blockedId))
    }
    setUnblockingId(null)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
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
        onClick={onClose}
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
          maxWidth: '400px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #F3E8FF',
            background: 'linear-gradient(to right, #F3E8FF, #FCE7F3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6B3FA0', margin: 0 }}>
              ブロック中のユーザー
            </h2>
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#F3E8FF',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: '#6B3FA0',
              }}
            >
              ✕
            </button>
          </div>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
            ブロック解除するとまた表示されるようになります
          </p>
        </div>

        {/* コンテンツ */}
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              <p style={{ fontSize: '14px', color: '#9CA3AF' }}>読み込み中...</p>
            </div>
          ) : blockedUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>
                ブロック中のユーザーはいません
              </h3>
              <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
                みんなと仲良くしてますね！
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {blockedUsers.map(block => (
                <div
                  key={block.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: '#F9FAFB',
                    borderRadius: '12px',
                  }}
                >
                  {/* アバター */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#E5E7EB',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {block.blockedUser?.avatarUrl ? (
                      <img
                        src={block.blockedUser.avatarUrl}
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
                          fontSize: '20px',
                        }}
                      >
                        👤
                      </div>
                    )}
                  </div>

                  {/* ユーザー情報 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#374151',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {block.blockedUser?.displayName || '不明なユーザー'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                      {formatDate(block.createdAt)} にブロック
                    </div>
                  </div>

                  {/* 解除ボタン */}
                  <button
                    onClick={() => handleUnblock(block.blockedId)}
                    disabled={unblockingId === block.blockedId}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: unblockingId === block.blockedId ? '#E5E7EB' : '#FEE2E2',
                      color: unblockingId === block.blockedId ? '#9CA3AF' : '#DC2626',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: unblockingId === block.blockedId ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    {unblockingId === block.blockedId ? '解除中...' : '解除'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* フッター */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #F3F4F6',
            background: '#FAFAFA',
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
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
      </div>
    </div>
  )
}

export default BlockedUsersModal
