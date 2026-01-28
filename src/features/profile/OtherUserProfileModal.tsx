'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserStats } from './ProfileView'
import { BookView, BookPage, PlacedSticker } from '@/features/sticker-book'
import type { PlacedDecoItem } from '@/domain/decoItems'
import { Avatar } from '@/components/ui/Avatar'

// 他ユーザーのプロフィール情報
export interface OtherUserProfile {
  id: string
  name: string
  avatarUrl?: string
  frameId?: string | null  // キャラクター報酬で解放したフレーム
  level: number
  title?: string
  bio?: string
  isFollowing: boolean
  stats: {
    totalStickers: number
    uniqueStickers: number
    completedSeries: number
    followersCount: number
    followingCount: number
  }
}

// シール帳ページのプレビュー
export interface StickerBookPreview {
  pageId: string
  pageNumber: number
  thumbnailUrl?: string
  stickerCount: number
}

interface OtherUserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: OtherUserProfile | null
  stickerBookPages: StickerBookPreview[]
  // 新しいprops: フルBookView表示用
  bookPages?: BookPage[]
  bookStickers?: PlacedSticker[]
  bookDecoItems?: PlacedDecoItem[]
  coverDesignId?: string // ユーザーの表紙デザインID
  onFollowToggle: (userId: string, isFollowing: boolean) => void
  onViewStickerBook: (userId: string, pageId?: string) => void
  onInviteToTrade?: (userId: string, userName: string) => void // 交換に誘うコールバック
  onReport: (userId: string) => void
  onBlock: (userId: string) => void
}

// アイコンコンポーネント
const UserIcon: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill="#C084FC" stroke="#A855F7" strokeWidth="1"/>
    <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" fill="#E9D5FF"/>
  </svg>
)

const StickerIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="1.5"/>
    <circle cx="9" cy="10" r="1.5" fill="#4A2068"/>
    <circle cx="15" cy="10" r="1.5" fill="#4A2068"/>
    <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" stroke="#4A2068" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const BookIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" fill="#E9D5FF" stroke="#A78BFA" strokeWidth="2"/>
  </svg>
)

const FollowersIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="4" fill="#EC4899" stroke="#DB2777" strokeWidth="1.5"/>
    <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" fill="#FBCFE8" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="19" cy="7" r="3" fill="#F9A8D4" stroke="#DB2777" strokeWidth="1"/>
    <path d="M18 14h2a3 3 0 0 1 3 3v2" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// メニューアイコン（3点）
const MoreIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="6" r="2" fill="white"/>
    <circle cx="12" cy="12" r="2" fill="white"/>
    <circle cx="12" cy="18" r="2" fill="white"/>
  </svg>
)

// 戻るアイコン
const BackIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// 統計カードコンポーネント
const MiniStatCard: React.FC<{
  icon: React.ReactNode
  value: number
  label: string
  color: string
}> = ({ icon, value, label, color }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '12px 8px',
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      borderRadius: '12px',
      minWidth: '70px',
    }}
  >
    {icon}
    <span
      style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#4A2068',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {value.toLocaleString()}
    </span>
    <span
      style={{
        fontSize: '10px',
        color: '#7A5090',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {label}
    </span>
  </div>
)

// シール帳ページプレビューカード
const PagePreviewCard: React.FC<{
  page: StickerBookPreview
  onClick: () => void
}> = ({ page, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      aspectRatio: '4/3',
      borderRadius: '12px',
      border: '2px solid #E9D5FF',
      background: 'linear-gradient(135deg, #FFF5F8 0%, #F3E8FF 100%)',
      overflow: 'hidden',
      cursor: 'pointer',
      position: 'relative',
      transition: 'all 0.2s',
    }}
  >
    {page.thumbnailUrl ? (
      <img
        src={page.thumbnailUrl}
        alt={`ページ ${page.pageNumber}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <BookIcon />
        <span
          style={{
            fontSize: '12px',
            color: '#9B6FD0',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          ページ {page.pageNumber}
        </span>
      </div>
    )}
    {/* シール枚数バッジ */}
    <div
      style={{
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        background: 'rgba(167, 139, 250, 0.9)',
        borderRadius: '12px',
        padding: '2px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <span style={{ fontSize: '10px', color: 'white' }}>
        {page.stickerCount}枚
      </span>
    </div>
  </button>
)

// 交換アイコン
const TradeIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M7 16V4M7 4L3 8M7 4L11 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8V20M17 20L21 16M17 20L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const OtherUserProfileModal: React.FC<OtherUserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  stickerBookPages,
  bookPages,
  bookStickers = [],
  bookDecoItems = [],
  coverDesignId,
  onFollowToggle,
  onViewStickerBook,
  onInviteToTrade,
  onReport,
  onBlock,
}) => {
  const [showMenu, setShowMenu] = useState(false)

  // BookViewがあるかどうか
  const hasBookData = bookPages && bookPages.length > 0

  if (!user) return null

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

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: '90vh',
              background: 'linear-gradient(135deg, #FFF5F8 0%, #F3E8FF 100%)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              boxShadow: '0 -8px 32px rgba(124, 58, 237, 0.3)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1001,
            }}
          >
            {/* ヘッダー - 交換タブと同じ背景 */}
            <div
              style={{
                padding: '12px 20px 16px',
                backgroundImage: 'url(/images/bg_trade_pattern.gif)',
                backgroundSize: 'auto',
                backgroundPosition: 'center',
                backgroundRepeat: 'repeat',
                position: 'relative',
                minHeight: '52px',
              }}
            >
              {/* 戻るボタン */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '12px',
                  width: '36px',
                  height: '36px',
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="#9D4C6C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* メニューボタン */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '12px',
                  width: '36px',
                  height: '36px',
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="6" r="2" fill="#9D4C6C"/>
                  <circle cx="12" cy="12" r="2" fill="#9D4C6C"/>
                  <circle cx="12" cy="18" r="2" fill="#9D4C6C"/>
                </svg>
              </button>

              {/* メニュードロップダウン */}
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      position: 'absolute',
                      top: '56px',
                      right: '12px',
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      overflow: 'hidden',
                      zIndex: 10,
                    }}
                  >
                    <button
                      onClick={() => {
                        onReport(user.id)
                        setShowMenu(false)
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px 20px',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#7A5090',
                        fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      }}
                    >
                      通報する
                    </button>
                    <button
                      onClick={() => {
                        onBlock(user.id)
                        setShowMenu(false)
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '12px 20px',
                        border: 'none',
                        background: 'transparent',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#F44336',
                        fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      }}
                    >
                      ブロックする
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* プロフィール情報 */}
              <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                {/* アバター */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <Avatar
                    src={user.avatarUrl}
                    alt={user.name}
                    size="lg"
                    frameId={user.frameId}
                  />
                </div>

                {/* 名前とレベル */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <h2
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#5D3A1A',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      textShadow: '0 1px 2px rgba(255,255,255,0.5)',
                    }}
                  >
                    {user.name}
                  </h2>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'white',
                      background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  >
                    Lv.{user.level}
                  </span>
                </div>

                {/* 称号 */}
                {user.title && (
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#8B5A2B',
                      marginTop: '4px',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      textShadow: '0 1px 1px rgba(255,255,255,0.3)',
                    }}
                  >
                    {user.title}
                  </p>
                )}
              </div>
            </div>

            {/* コンテンツエリア */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 20px',
              }}
            >
              {/* 自己紹介 */}
              {user.bio && (
                <div
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#4A2068',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {user.bio}
                  </p>
                </div>
              )}

              {/* アクションボタン */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                {/* フォローボタン */}
                <button
                  onClick={() => onFollowToggle(user.id, !user.isFollowing)}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    borderRadius: '9999px',
                    border: user.isFollowing ? '2px solid #A78BFA' : 'none',
                    background: user.isFollowing
                      ? 'transparent'
                      : 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
                    color: user.isFollowing ? '#7C3AED' : 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    boxShadow: user.isFollowing ? 'none' : '0 4px 12px rgba(167, 139, 250, 0.4)',
                  }}
                >
                  {user.isFollowing ? 'フォロー中' : 'フォローする'}
                </button>

                {/* 交換に誘うボタン */}
                {onInviteToTrade && (
                  <button
                    onClick={() => onInviteToTrade(user.id, user.name)}
                    style={{
                      flex: 1,
                      padding: '14px 24px',
                      borderRadius: '9999px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      boxShadow: '0 4px 12px rgba(196, 149, 106, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <TradeIcon />
                    こうかんにさそう
                  </button>
                )}
              </div>

              {/* 統計情報 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                <MiniStatCard
                  icon={<StickerIcon />}
                  value={user.stats.totalStickers}
                  label="シール"
                  color="#FF6B6B"
                />
                <MiniStatCard
                  icon={<FollowersIcon />}
                  value={user.stats.followersCount}
                  label="フォロワー"
                  color="#EC4899"
                />
                <MiniStatCard
                  icon={<FollowersIcon />}
                  value={user.stats.followingCount}
                  label="フォロー"
                  color="#60A5FA"
                />
              </div>

              {/* シール帳セクション - 幅いっぱいに表示 */}
              <div style={{ marginLeft: '-20px', marginRight: '-20px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#4A2068',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <BookIcon />
                    シール帳
                  </h3>
                  <button
                    onClick={() => onViewStickerBook(user.id)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '9999px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    }}
                  >
                    すべて見る
                  </button>
                </div>

                {/* めくれるシール帳ビュー */}
                {hasBookData ? (
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      borderRadius: '0',
                      padding: '8px 0',
                    }}
                  >
                    {/* 横スクロール可能なコンテナ */}
                    <div
                      style={{
                        width: '100%',
                        overflowX: 'auto',
                        overflowY: 'visible',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'thin',
                      }}
                    >
                      {/* BookViewを囲むコンテナ - 見開き時に幅が広がっても対応 */}
                      <div
                        style={{
                          minWidth: 'max-content',
                          display: 'flex',
                          justifyContent: 'center',
                          paddingBottom: '8px',
                        }}
                      >
                        <BookView
                          pages={bookPages}
                          placedStickers={bookStickers}
                          placedDecoItems={bookDecoItems}
                          width={175}
                          height={262}
                          renderNavigation={true}
                          coverDesignId={coverDesignId}
                          hideHints={true}
                          displayScale={0.55}
                        />
                      </div>
                    </div>
                  </div>
                ) : stickerBookPages.length > 0 ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '12px',
                    }}
                  >
                    {stickerBookPages.slice(0, 4).map((page) => (
                      <PagePreviewCard
                        key={page.pageId}
                        page={page}
                        onClick={() => onViewStickerBook(user.id, page.pageId)}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      background: 'rgba(255,255,255,0.5)',
                      borderRadius: '16px',
                    }}
                  >
                    <BookIcon />
                    <p
                      style={{
                        marginTop: '12px',
                        fontSize: '14px',
                        color: '#9B6FD0',
                        fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      }}
                    >
                      まだシールが貼られていません
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default OtherUserProfileModal
