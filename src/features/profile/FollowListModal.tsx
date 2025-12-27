'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// フォローユーザー情報
export interface FollowUser {
  id: string
  name: string
  avatarUrl?: string
  level: number
  title?: string
  isFollowing?: boolean  // 自分がフォローしているかどうか
}

interface FollowListModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab: 'followers' | 'following'
  followers: FollowUser[]
  following: FollowUser[]
  onUserClick: (userId: string) => void
  onFollowToggle: (userId: string, isFollowing: boolean) => void
}

// ユーザーアイコン（SVG）
const UserIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill="#C084FC" stroke="#A855F7" strokeWidth="1"/>
    <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" fill="#E9D5FF"/>
  </svg>
)

// ユーザーカードコンポーネント
const UserCard: React.FC<{
  user: FollowUser
  onUserClick: (userId: string) => void
  onFollowToggle: (userId: string, isFollowing: boolean) => void
  showFollowButton?: boolean
}> = ({ user, onUserClick, onFollowToggle, showFollowButton = true }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {/* アバター */}
      <button
        onClick={() => onUserClick(user.id)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '2px solid #A78BFA',
          overflow: 'hidden',
          flexShrink: 0,
          cursor: 'pointer',
          background: 'linear-gradient(to bottom right, #E9D5FF, #FBCFE8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <UserIcon size={32} />
        )}
      </button>

      {/* ユーザー情報 */}
      <button
        onClick={() => onUserClick(user.id)}
        style={{
          flex: 1,
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#4A2068',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            {user.name}
          </span>
          <span
            style={{
              fontSize: '12px',
              color: '#7C3AED',
              background: 'rgba(124, 58, 237, 0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 'bold',
            }}
          >
            Lv.{user.level}
          </span>
        </div>
        {user.title && (
          <span
            style={{
              fontSize: '12px',
              color: '#7A5090',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            {user.title}
          </span>
        )}
      </button>

      {/* フォローボタン */}
      {showFollowButton && (
        <button
          onClick={() => onFollowToggle(user.id, !user.isFollowing)}
          style={{
            padding: '6px 16px',
            borderRadius: '9999px',
            border: user.isFollowing ? '2px solid #A78BFA' : 'none',
            background: user.isFollowing
              ? 'transparent'
              : 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
            color: user.isFollowing ? '#7C3AED' : 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          {user.isFollowing ? 'フォロー中' : 'フォロー'}
        </button>
      )}
    </div>
  )
}

// タブボタンコンポーネント
const TabButton: React.FC<{
  label: string
  count: number
  isActive: boolean
  onClick: () => void
  color: string
}> = ({ label, count, isActive, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px 16px',
        border: 'none',
        borderBottom: isActive ? `3px solid ${color}` : '3px solid transparent',
        background: isActive ? 'rgba(255,255,255,0.8)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <span
        style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: isActive ? color : '#9B6FD0',
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
        }}
      >
        {label}
      </span>
      <span
        style={{
          marginLeft: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: isActive ? '#4A2068' : '#9B6FD0',
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
        }}
      >
        {count.toLocaleString()}
      </span>
    </button>
  )
}

export const FollowListModal: React.FC<FollowListModalProps> = ({
  isOpen,
  onClose,
  initialTab,
  followers,
  following,
  onUserClick,
  onFollowToggle,
}) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab)

  const currentList = activeTab === 'followers' ? followers : following

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* バックドロップ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
            }}
          />

          {/* モーダルコンテナ */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              pointerEvents: 'none',
              padding: '20px',
            }}
          >
            {/* モーダル */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                width: '100%',
                maxWidth: '400px',
                maxHeight: '80vh',
                background: 'linear-gradient(135deg, #FFF5F8 0%, #F3E8FF 100%)',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto',
              }}
            >
              {/* ヘッダー */}
              <div
                style={{
                  padding: '16px 24px',
                  backgroundImage: 'url(/images/Header_UI.png)',
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center top',
                  backgroundRepeat: 'no-repeat',
                  position: 'relative',
                }}
              >
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    textShadow: '0 1px 3px rgba(157, 76, 108, 0.6), 0 0 8px rgba(255, 255, 255, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  フォロー・フォロワー
                </h2>

                {/* 閉じるボタン */}
                <button
                  onClick={onClose}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.8)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <span style={{ color: '#9D4C6C', fontSize: '18px' }}>✕</span>
                </button>
              </div>

              {/* タブ */}
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid rgba(167, 139, 250, 0.2)',
                }}
              >
                <TabButton
                  label="フォロワー"
                  count={followers.length}
                  isActive={activeTab === 'followers'}
                  onClick={() => setActiveTab('followers')}
                  color="#DB2777"
                />
                <TabButton
                  label="フォロー中"
                  count={following.length}
                  isActive={activeTab === 'following'}
                  onClick={() => setActiveTab('following')}
                  color="#3B82F6"
                />
              </div>

              {/* リスト */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {currentList.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#9B6FD0',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      {activeTab === 'followers' ? '👥' : '➡️'}
                    </div>
                    <p style={{ fontSize: '14px' }}>
                      {activeTab === 'followers'
                        ? 'まだフォロワーがいません'
                        : 'まだ誰もフォローしていません'}
                    </p>
                  </div>
                ) : (
                  currentList.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onUserClick={onUserClick}
                      onFollowToggle={onFollowToggle}
                      showFollowButton={activeTab === 'followers'}
                    />
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FollowListModal
