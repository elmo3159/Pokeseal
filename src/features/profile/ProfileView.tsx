'use client'

import React from 'react'
import { ProgressBar } from '@/components/progress/ProgressBar'
import { RankProgressCard, type RankCounts } from '@/components/upgrade'

// ユーザー情報
export interface UserProfile {
  id: string
  name: string
  avatarUrl?: string
  level: number
  exp: number
  expToNextLevel: number
  title?: string
  bio?: string
  createdAt: string
}

// 統計情報
export interface UserStats {
  totalStickers: number
  uniqueStickers: number
  completedSeries: number
  totalTrades: number
  friendsCount: number
  followersCount: number
  followingCount: number
  postsCount: number
  reactionsReceived: number
  // アップグレードランク達成数
  rankCounts?: RankCounts
}

// 実績情報
export interface Achievement {
  id: string
  name: string
  icon: string
  description: string
  unlockedAt?: string
  isUnlocked: boolean
}

interface ProfileViewProps {
  profile: UserProfile
  stats: UserStats
  achievements: Achievement[]
  onEditProfile: () => void
  onOpenSettings: () => void
  onViewStickerBook: () => void
  onViewAchievements: () => void
  onViewFriends: () => void
  onViewStats: () => void
  onViewFollowers: () => void
  onViewFollowing: () => void
  onViewDailyMissions: () => void
  onViewCollection: () => void
  onOpenSearch?: () => void
  onViewUpgradeProgress?: () => void
}

// 統計カード（画像フレーム使用）
const StatCard: React.FC<{
  icon: React.ReactNode
  label: string
  value: number
  frameImage: string
  onClick?: () => void
}> = ({ icon, label, value, frameImage, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        aspectRatio: '1/1.3',
        background: 'transparent',
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        transition: onClick ? 'transform 0.2s' : 'none',
      }}
    >
      {/* フレーム画像 */}
      <img
        src={frameImage}
        alt=""
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', objectFit: 'contain' }}
      />
      {/* コンテンツ */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '8px' }}>
        <div style={{ marginBottom: '2px' }}>{icon}</div>
        <span
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#4A2068',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          {value.toLocaleString()}
        </span>
        <span
          style={{
            fontSize: '12px',
            color: '#7A5090',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          {label}
        </span>
      </div>
    </button>
  )
}

// ピルボタン（画像フレーム使用）
const PillButton: React.FC<{
  icon: React.ReactNode
  label: string
  frameImage: string
  onClick: () => void
}> = ({ icon, label, frameImage, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        flex: 1,
        height: '48px',
        transition: 'transform 0.2s',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <img
        src={frameImage}
        alt=""
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', objectFit: 'contain' }}
      />
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '100%' }}>
        {icon}
        <span
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          {label}
        </span>
      </div>
    </button>
  )
}

// SVGアイコンコンポーネント
const SettingsIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" fill="#7C3AED" stroke="#7C3AED" strokeWidth="1.5"/>
    <path d="M12 1V4M12 20V23M23 12H20M4 12H1M20.5 3.5L18 6M6 18L3.5 20.5M20.5 20.5L18 18M6 6L3.5 3.5" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const UserIcon: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill="#C084FC" stroke="#A855F7" strokeWidth="1"/>
    <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" fill="#E9D5FF"/>
  </svg>
)

const EditIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M16 3L21 8L8 21H3V16L16 3Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
)

const StickerIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5"/>
    <circle cx="9" cy="10" r="2" fill="#7C3AED"/>
    <circle cx="15" cy="10" r="2" fill="#7C3AED"/>
    <path d="M8 15C8 15 10 17 12 17C14 17 16 15 16 15" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const BookIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="3" width="16" height="18" rx="2" fill="#60A5FA" stroke="#3B82F6" strokeWidth="1.5"/>
    <line x1="8" y1="8" x2="16" y2="8" stroke="white" strokeWidth="1.5"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="white" strokeWidth="1.5"/>
    <line x1="8" y1="16" x2="12" y2="16" stroke="white" strokeWidth="1.5"/>
  </svg>
)

const TradeIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7 17L3 13L7 9" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 13H16" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 7L21 11L17 15" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 11H8" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const FriendsIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="8" r="3" fill="#EC4899" stroke="#DB2777" strokeWidth="1"/>
    <circle cx="16" cy="8" r="3" fill="#60A5FA" stroke="#3B82F6" strokeWidth="1"/>
    <path d="M2 18C2 15.5 4.5 13 8 13C9.5 13 10.8 13.4 12 14" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 18C22 15.5 19.5 13 16 13C14.5 13 13.2 13.4 12 14" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const ChartIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="14" width="4" height="8" rx="1" fill="white"/>
    <rect x="10" y="10" width="4" height="12" rx="1" fill="white"/>
    <rect x="17" y="4" width="4" height="18" rx="1" fill="white"/>
  </svg>
)

const TrophyIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M8 4H16V10C16 12.2 14.2 14 12 14C9.8 14 8 12.2 8 10V4Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5"/>
    <path d="M8 6H4V8C4 9.6 5.4 11 7 11H8" stroke="#F59E0B" strokeWidth="1.5"/>
    <path d="M16 6H20V8C20 9.6 18.6 11 17 11H16" stroke="#F59E0B" strokeWidth="1.5"/>
    <rect x="10" y="14" width="4" height="4" fill="#F59E0B"/>
    <rect x="7" y="18" width="10" height="2" rx="1" fill="#F59E0B"/>
  </svg>
)

const FollowersIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="4" fill="#EC4899" stroke="#DB2777" strokeWidth="1.5"/>
    <path d="M3 19C3 16 5.5 13 9 13C12.5 13 15 16 15 19" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="8" r="3" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1"/>
    <path d="M14 18C14 16 15.5 14 17 14C18.5 14 20 16 20 18" stroke="#EC4899" strokeWidth="1" strokeLinecap="round"/>
  </svg>
)

const FollowingIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="7" r="4" fill="#60A5FA" stroke="#3B82F6" strokeWidth="1.5"/>
    <path d="M4 19C4 16 7 13 12 13C17 13 20 16 20 19" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17 10V16M14 13H20" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// デイリーミッションアイコン
const MissionIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1.5"/>
    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// コレクションアイコン
const CollectionIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="1" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1"/>
    <rect x="13" y="3" width="8" height="8" rx="1" fill="#FCA5A5" stroke="#EF4444" strokeWidth="1"/>
    <rect x="3" y="13" width="8" height="8" rx="1" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
    <rect x="13" y="13" width="8" height="8" rx="1" fill="#86EFAC" stroke="#22C55E" strokeWidth="1"/>
  </svg>
)

// フォロー・フォロワー統計バー
const FollowStatsBar: React.FC<{
  followersCount: number
  followingCount: number
  onViewFollowers: () => void
  onViewFollowing: () => void
}> = ({ followersCount, followingCount, onViewFollowers, onViewFollowing }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '8px',
      }}
    >
      {/* フォロワー */}
      <button
        onClick={onViewFollowers}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: '12px',
          border: '2px solid #F9A8D4',
          boxShadow: '0 2px 8px rgba(236, 72, 153, 0.15)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <FollowersIcon />
        <span
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#DB2777',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          {followersCount.toLocaleString()}
        </span>
        <span
          style={{
            fontSize: '11px',
            color: '#7A5090',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          フォロワー
        </span>
      </button>

      {/* フォロー中 */}
      <button
        onClick={onViewFollowing}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: 'rgba(255, 255, 255, 0.85)',
          borderRadius: '12px',
          border: '2px solid #93C5FD',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <FollowingIcon />
        <span
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#3B82F6',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          {followingCount.toLocaleString()}
        </span>
        <span
          style={{
            fontSize: '11px',
            color: '#7A5090',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          フォロー中
        </span>
      </button>
    </div>
  )
}

// 検索アイコン
const SearchIcon: React.FC = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="10" cy="10" r="6" stroke="#EC4899" strokeWidth="2.5"/>
    <path d="M14.5 14.5L20 20" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)

// ヘッダーバー（検索ボタン + 設定ボタン）
const ProfileHeader: React.FC<{
  onOpenSettings: () => void
  onOpenSearch?: () => void
}> = ({ onOpenSettings, onOpenSearch }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px' }}>
      {/* 検索ボタン */}
      {onOpenSearch && (
        <button
          onClick={onOpenSearch}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            background: 'linear-gradient(135deg, #FFE4F0 0%, #FFD0E8 100%)',
            boxShadow: '0 2px 8px rgba(236, 72, 153, 0.25)',
            border: '2px solid #FFB6D9',
            cursor: 'pointer',
          }}
          title="おともだちを さがす"
        >
          <SearchIcon />
        </button>
      )}
      {/* 設定ボタン */}
      <button
        onClick={onOpenSettings}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <SettingsIcon />
      </button>
    </div>
  )
}

// メインのProfileView
export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  stats,
  onEditProfile,
  onOpenSettings,
  onViewAchievements,
  onViewFriends,
  onViewStats,
  onViewFollowers,
  onViewFollowing,
  onViewDailyMissions,
  onViewCollection,
  onOpenSearch,
  onViewUpgradeProgress,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        backgroundImage: 'url(/images/bg_profile.png)',
        backgroundSize: '120%',
        backgroundPosition: 'center top',
        backgroundRepeat: 'repeat-y',
        overflowY: 'auto',
      }}
    >
      {/* コンテンツ */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>

      {/* ヘッダー */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <ProfileHeader onOpenSettings={onOpenSettings} onOpenSearch={onOpenSearch} />
      </div>

      {/* コンテンツ */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingLeft: '8px',
          paddingRight: '8px',
          paddingTop: 0,
          paddingBottom: '16px',
        }}
      >
        {/* メインのオーバルフレーム - 大きく表示 */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '460px' }}>
          {/* オーバルフレーム画像 */}
          <img
            src="/images/frame_oval.png"
            alt=""
            style={{ width: '100%', height: 'auto' }}
          />

          {/* フレーム内のコンテンツ */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '24px',
            }}
          >
            {/* アバター部分 - frame_avatar_ring.pngを360pxで表示 */}
            <div style={{ position: 'relative', marginBottom: '4px', width: '293px', height: '293px' }}>
              {/* アバター画像（フレームの下に配置・中央に） */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(to bottom right, #E9D5FF, #FBCFE8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  zIndex: 0,
                }}
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <UserIcon size={48} />
                )}
              </div>
              {/* アバターリングフレーム画像 - 360pxで表示 */}
              <img
                src="/images/frame_avatar_ring.png"
                alt=""
                style={{
                  position: 'absolute',
                  zIndex: 10,
                  pointerEvents: 'none',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '360px',
                  height: '360px',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* ユーザー名と編集ボタン */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2
                style={{ fontSize: '20px', fontWeight: 'bold', color: '#4A2068' }}
              >
                {profile.name}
              </h2>
              <button
                onClick={onEditProfile}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  background: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
                  boxShadow: '0 2px 6px rgba(167, 139, 250, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <EditIcon />
              </button>
            </div>

            {/* 称号バッジ */}
            {profile.title && (
              <div
                style={{
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  borderRadius: '9999px',
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #FF9ED2 0%, #FF6BAE 100%)',
                  boxShadow: '0 2px 8px rgba(255, 107, 174, 0.3)',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {profile.title}
                </span>
              </div>
            )}

            {/* 自己紹介 */}
            {profile.bio && (
              <p
                style={{ fontSize: '14px', marginBottom: '12px', color: '#7A5090' }}
              >
                {profile.bio}
              </p>
            )}

            {/* フォロー・フォロワー統計 */}
            <div style={{ width: '100%', paddingLeft: '24px', paddingRight: '24px' }}>
              <FollowStatsBar
                followersCount={stats.followersCount}
                followingCount={stats.followingCount}
                onViewFollowers={onViewFollowers}
                onViewFollowing={onViewFollowing}
              />
            </div>

            {/* レベルセクション - 大きく */}
            <div style={{ width: '100%', paddingLeft: '16px', paddingRight: '16px', marginBottom: '8px' }}>
              <ProgressBar
                level={profile.level}
                currentExp={profile.exp}
                expForNextLevel={profile.expToNextLevel}
                title={profile.title}
                showTitle={false}
                size="medium"
              />
            </div>

            {/* 統計カード - 4つ横並び */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '4px',
                width: '100%',
                paddingLeft: '24px',
                paddingRight: '24px',
                marginBottom: '12px',
              }}
            >
              <StatCard
                icon={<StickerIcon />}
                label="シール"
                value={stats.totalStickers}
                frameImage="/images/stat_card_frame_red.png"
              />
              <StatCard
                icon={<BookIcon />}
                label="コンプ"
                value={stats.completedSeries}
                frameImage="/images/stat_card_frame_yellow.png"
              />
              <StatCard
                icon={<TradeIcon />}
                label="交換"
                value={stats.totalTrades}
                frameImage="/images/stat_card_frame_green.png"
              />
              <StatCard
                icon={<FriendsIcon />}
                label="フレンド"
                value={stats.friendsCount}
                frameImage="/images/stat_card_frame_blue.png"
                onClick={onViewFriends}
              />
            </div>

            {/* ボタン - とうけい・じっせき */}
            <div style={{ display: 'flex', gap: '12px', width: '100%', paddingLeft: '24px', paddingRight: '24px' }}>
              <PillButton
                icon={<ChartIcon />}
                label="とうけい"
                frameImage="/images/pill_button_blue.png"
                onClick={onViewStats}
              />
              <PillButton
                icon={<TrophyIcon />}
                label="じっせき"
                frameImage="/images/pill_button_pink.png"
                onClick={onViewAchievements}
              />
            </div>
          </div>
        </div>

        {/* フレーム外のボタン - ミッション・コレクション */}
        <div style={{
          display: 'flex',
          gap: '12px',
          width: '100%',
          maxWidth: '460px',
          paddingLeft: '24px',
          paddingRight: '24px',
          marginTop: '12px'
        }}>
          <PillButton
            icon={<MissionIcon />}
            label="ミッション"
            frameImage="/images/pill_button_pink.png"
            onClick={onViewDailyMissions}
          />
          <PillButton
            icon={<CollectionIcon />}
            label="コレクション"
            frameImage="/images/pill_button_blue.png"
            onClick={onViewCollection}
          />
        </div>

        {/* ランクアップ進捗カード */}
        {stats.rankCounts && (
          <div style={{
            width: '100%',
            maxWidth: '460px',
            paddingLeft: '24px',
            paddingRight: '24px',
            marginTop: '12px'
          }}>
            <RankProgressCard
              counts={stats.rankCounts}
              onClick={onViewUpgradeProgress}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default ProfileView
