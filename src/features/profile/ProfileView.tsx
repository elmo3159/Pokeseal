'use client'

import React from 'react'

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
  postsCount: number
  reactionsReceived: number
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
}

// レベルプログレスバー（画像フレーム使用）- 拡大サイズ
const LevelProgress: React.FC<{
  level: number
  exp: number
  expToNextLevel: number
}> = ({ level, exp, expToNextLevel }) => {
  const progress = (exp / expToNextLevel) * 100

  return (
    <div className="flex items-center gap-2 px-1 py-2">
      {/* レベルバッジ - 小さめサイズ */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <img
          src="/images/level_badge.png"
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
        />
        <span
          className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold"
          style={{
            color: '#7C3AED',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            textShadow: '0 1px 2px rgba(255,255,255,0.8)',
          }}
        >
          {level}
        </span>
      </div>

      {/* プログレスバー - 横幅いっぱいに拡大 */}
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span
            className="font-extrabold"
            style={{ color: '#7C3AED', fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            Lv.{level}
          </span>
          <div className="flex items-center gap-1">
            <span className="font-bold" style={{ color: '#9B6FD0' }}>{exp}/{expToNextLevel}</span>
          </div>
        </div>
        <div className="relative h-10">
          {/* プログレス部分（虹色グラデーション）- 枠の中に収まるように調整 */}
          <div
            className="absolute rounded-full z-0"
            style={{
              top: '12px',
              left: '16px',
              right: '16px',
              height: '16px',
              width: `calc(${progress}% - 32px)`,
              background: 'linear-gradient(90deg, #FF6B9D 0%, #FFB347 20%, #FFEB3B 40%, #4ADE80 60%, #60A5FA 80%, #A78BFA 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          />
          {/* フレーム画像（上に配置して宝石を見せる） */}
          <img
            src="/images/level_bar_frame.png"
            alt=""
            className="absolute inset-0 w-full h-full object-fill z-10"
          />
        </div>
      </div>
    </div>
  )
}

// 統計カード（画像フレーム使用）
const StatCard: React.FC<{
  icon: string
  label: string
  value: number
  frameImage: string
  onClick?: () => void
}> = ({ icon, label, value, frameImage, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        relative flex flex-col items-center justify-center
        ${onClick ? 'active:scale-95 transition-transform' : ''}
      `}
      style={{ width: '100%', aspectRatio: '1/1.3' }}
    >
      {/* フレーム画像 */}
      <img
        src={frameImage}
        alt=""
        className="absolute inset-0 w-full h-full object-contain"
      />
      {/* コンテンツ */}
      <div className="relative z-10 flex flex-col items-center pt-2">
        <span className="text-2xl mb-0.5">{icon}</span>
        <span
          className="text-xl font-bold"
          style={{
            color: '#4A2068',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          {value.toLocaleString()}
        </span>
        <span
          className="text-xs"
          style={{
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
  icon: string
  label: string
  frameImage: string
  onClick: () => void
}> = ({ icon, label, frameImage, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex-1 h-12 active:scale-95 transition-transform"
    >
      <img
        src={frameImage}
        alt=""
        className="absolute inset-0 w-full h-full object-contain"
      />
      <div className="relative z-10 flex items-center justify-center gap-2 h-full">
        <span className="text-lg">{icon}</span>
        <span
          className="text-sm font-bold"
          style={{
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

// ヘッダーバー（コイン表示・設定ボタン）
const ProfileHeader: React.FC<{
  onOpenSettings: () => void
}> = ({ onOpenSettings }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      {/* 左：ホームアイコン */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #FF6B9D 0%, #FF4777 100%)',
          boxShadow: '0 2px 8px rgba(255, 71, 119, 0.3)',
        }}
      >
        <span className="text-white text-lg">🏠</span>
      </div>

      {/* 右側のコントロール */}
      <div className="flex items-center gap-3">
        {/* コイン表示 */}
        <div
          className="flex items-center gap-1 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <span className="text-lg">💎</span>
          <span
            className="font-bold text-sm"
            style={{ color: '#7C3AED' }}
          >
            621
          </span>
          <span style={{ color: '#A78BFA' }}>/</span>
          <span
            className="font-bold text-sm"
            style={{ color: '#F59E0B' }}
          >
            56
          </span>
        </div>

        {/* 設定ボタン */}
        <button
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <span className="text-xl">⚙️</span>
        </button>
      </div>
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
  onViewFriends
}) => {
  return (
    <div
      className="relative flex flex-col"
      style={{
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        minHeight: '100%',
        backgroundImage: 'url(/images/bg_profile.png)',
        backgroundSize: '120%',
        backgroundPosition: 'center top',
        backgroundRepeat: 'repeat-y',
      }}
    >
      {/* コンテンツ */}
      <div className="relative flex flex-col">

      {/* ヘッダー */}
      <div className="relative z-10">
        <ProfileHeader onOpenSettings={onOpenSettings} />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 flex flex-col items-center px-2 pt-0 pb-28">
        {/* メインのオーバルフレーム - 大きく表示 */}
        <div className="relative w-full" style={{ maxWidth: '460px' }}>
          {/* オーバルフレーム画像 */}
          <img
            src="/images/frame_oval.png"
            alt=""
            className="w-full h-auto"
          />

          {/* フレーム内のコンテンツ */}
          <div className="absolute inset-0 flex flex-col items-center pt-6">
            {/* アバター部分 - frame_avatar_ring.pngを360pxで表示 */}
            <div className="relative mb-1" style={{ width: '293px', height: '293px' }}>
              {/* アバター画像（フレームの下に配置・中央に） */}
              <div
                className="absolute rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center overflow-hidden z-0"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90px',
                  height: '90px',
                }}
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl text-purple-400">👤</span>
                )}
              </div>
              {/* アバターリングフレーム画像 - 360pxで表示 */}
              <img
                src="/images/frame_avatar_ring.png"
                alt=""
                className="absolute z-10 pointer-events-none"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '360px',
                  height: '360px',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* ユーザー名 */}
            <h2
              className="text-xl font-bold mb-1"
              style={{ color: '#4A2068' }}
            >
              {profile.name}
            </h2>

            {/* 称号バッジ */}
            {profile.title && (
              <div
                className="px-4 py-1 rounded-full mb-2"
                style={{
                  background: 'linear-gradient(135deg, #FF9ED2 0%, #FF6BAE 100%)',
                  boxShadow: '0 2px 8px rgba(255, 107, 174, 0.3)',
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                >
                  {profile.title}
                </span>
              </div>
            )}

            {/* 自己紹介 */}
            {profile.bio && (
              <p
                className="text-sm mb-3"
                style={{ color: '#7A5090' }}
              >
                {profile.bio}
              </p>
            )}

            {/* レベルセクション - 大きく */}
            <div className="w-full px-4 mb-2">
              <LevelProgress
                level={profile.level}
                exp={profile.exp}
                expToNextLevel={profile.expToNextLevel}
              />
            </div>

            {/* 統計カード - 4つ横並び */}
            <div className="grid grid-cols-4 gap-1 w-full px-6 mb-3">
              <StatCard
                icon="🎨"
                label="シール"
                value={stats.totalStickers}
                frameImage="/images/stat_card_frame_red.png"
              />
              <StatCard
                icon="📚"
                label="コンプ"
                value={stats.completedSeries}
                frameImage="/images/stat_card_frame_yellow.png"
              />
              <StatCard
                icon="🤝"
                label="交換"
                value={stats.totalTrades}
                frameImage="/images/stat_card_frame_green.png"
              />
              <StatCard
                icon="👫"
                label="フレンド"
                value={stats.friendsCount}
                frameImage="/images/stat_card_frame_blue.png"
                onClick={onViewFriends}
              />
            </div>

            {/* ボタン - とうけい・じっせき */}
            <div className="flex gap-3 w-full px-6">
              <PillButton
                icon="📊"
                label="とうけい"
                frameImage="/images/pill_button_blue.png"
                onClick={() => {
                  // TODO: 統計詳細モーダル
                  console.log('とうけい')
                }}
              />
              <PillButton
                icon="🏆"
                label="じっせき"
                frameImage="/images/pill_button_pink.png"
                onClick={onViewAchievements}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default ProfileView
