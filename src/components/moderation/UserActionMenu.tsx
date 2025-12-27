'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { moderationService } from '@/services/moderation'
import { ReportModal } from './ReportModal'
import { BlockUserModal } from './BlockUserModal'

interface UserActionMenuProps {
  isOpen: boolean
  onClose: () => void
  currentUserId: string
  targetUserId: string
  targetUserName: string
  targetUserAvatar?: string | null
  onBlocked?: () => void
  onReported?: () => void
}

export const UserActionMenu: React.FC<UserActionMenuProps> = ({
  isOpen,
  onClose,
  currentUserId,
  targetUserId,
  targetUserName,
  targetUserAvatar,
  onBlocked,
  onReported,
}) => {
  const [isBlocked, setIsBlocked] = useState(false)
  const [checkingBlock, setCheckingBlock] = useState(true)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [isUnblocking, setIsUnblocking] = useState(false)

  const checkBlockStatus = useCallback(async () => {
    setCheckingBlock(true)
    const blocked = await moderationService.isBlocked(currentUserId, targetUserId)
    setIsBlocked(blocked)
    setCheckingBlock(false)
  }, [currentUserId, targetUserId])

  useEffect(() => {
    if (isOpen) {
      checkBlockStatus()
    }
  }, [isOpen, checkBlockStatus])

  if (!isOpen) return null

  const handleUnblock = async () => {
    setIsUnblocking(true)
    const success = await moderationService.unblockUser(currentUserId, targetUserId)
    if (success) {
      setIsBlocked(false)
      onBlocked?.()
    }
    setIsUnblocking(false)
    onClose()
  }

  const handleBlockClick = () => {
    onClose()
    setShowBlockModal(true)
  }

  const handleReportClick = () => {
    onClose()
    setShowReportModal(true)
  }

  const handleBlocked = () => {
    setIsBlocked(true)
    onBlocked?.()
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
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
            background: 'rgba(0, 0, 0, 0.4)',
          }}
        />

        {/* メニュー */}
        <div
          style={{
            position: 'relative',
            background: 'white',
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
            width: '100%',
            maxWidth: '500px',
            padding: '8px 16px 24px',
            animation: 'slideUp 0.2s ease-out',
          }}
        >
          {/* ハンドル */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '2px',
                background: '#D1D5DB',
              }}
            />
          </div>

          {/* ユーザー情報 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              marginBottom: '8px',
              background: '#F9FAFB',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
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
                    fontSize: '18px',
                  }}
                >
                  👤
                </div>
              )}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#374151' }}>
              {targetUserName}
            </div>
          </div>

          {/* メニューアイテム */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* 通報 */}
            <button
              onClick={handleReportClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '20px' }}>🚨</span>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#DC2626' }}>
                  通報する
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  問題のある行動を報告
                </div>
              </div>
            </button>

            {/* ブロック/ブロック解除 */}
            {checkingBlock ? (
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: '#9CA3AF' }}>読み込み中...</span>
              </div>
            ) : isBlocked ? (
              <button
                onClick={handleUnblock}
                disabled={isUnblocking}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'transparent',
                  cursor: isUnblocking ? 'not-allowed' : 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  opacity: isUnblocking ? 0.7 : 1,
                }}
              >
                <span style={{ fontSize: '20px' }}>✅</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#10B981' }}>
                    {isUnblocking ? 'ブロック解除中...' : 'ブロック解除'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    このユーザーをブロック中です
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={handleBlockClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '20px' }}>🚫</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#374151' }}>
                    ブロックする
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    投稿や交換を非表示にする
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* キャンセルボタン */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: '#F3F4F6',
              color: '#374151',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              marginTop: '12px',
            }}
          >
            キャンセル
          </button>
        </div>
      </div>

      {/* 通報モーダル */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetType="user"
        targetId={targetUserId}
        targetName={targetUserName}
        reporterId={currentUserId}
        onReportSubmitted={onReported}
      />

      {/* ブロックモーダル */}
      <BlockUserModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        userId={currentUserId}
        targetUserId={targetUserId}
        targetUserName={targetUserName}
        targetUserAvatar={targetUserAvatar}
        onBlocked={handleBlocked}
      />

      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}

export default UserActionMenu
