'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { AppLayout, TabId } from '@/components'
import {
  BookView,
  BookViewHandle,
  BookPage,
  StickerTray,
  Sticker,
  PlacedSticker,
  EditControls,
  CharmData,
  DraggableSticker,
  FloatingEditSticker,
  FloatingEditDeco,
  PageEditModal,
  CHARM_LIST,
  PeelEffect,
  PlaceEffect,
  trackPeel,
  getStickinessMessage,
  DecoDrawer,
  LayerControlPanel,
  LayerItem,
} from '@/features/sticker-book'
import {
  DecoItemData,
  PlacedDecoItem,
  DEFAULT_DECO_ITEMS,
  getOwnedDecoItems,
} from '@/domain/decoItems'
import { CoverDesign } from '@/domain/theme'
import { CollectionView, CollectionSticker, StickerDetailModal } from '@/features/collection'
import { GachaView, GachaBanner, UserCurrency, GachaResultModal, GachaResultSticker, GachaConfirmDialog, GachaRate } from '@/features/gacha'
import { TradeView, Friend, TradeHistory, MatchingModal, MatchingStatus, MatchedUser, TradeSession, TradeSticker, TradePartner, TradeSessionEnhanced, TradeBookPage, TradeSessionFull, TradeUser, TradeBookPageFull } from '@/features/trade'
import { TimelineView, Post, ReactionType, CreatePostModal, CommentModal, StickerBookPage, Comment } from '@/features/timeline'
import { timelineService } from '@/services/timeline/timelineService'
import { ProfileView, ProfileEditModal, LevelUpModal, StatsModal, AchievementsModal, FollowListModal, OtherUserProfileModal, UserProfile, UserStats, Achievement, FollowUser, OtherUserProfile, StickerBookPreview } from '@/features/profile'
import {
  calculateLevel,
  getCurrentLevelExp,
  getExpToNextLevel,
  getLevelTitle,
  addExp,
  getLevelUpRewards,
  ExpAction,
  ExpGainResult,
  LevelUpReward,
} from '@/domain/levelSystem'
import { TutorialOverlay, defaultTutorialSteps } from '@/features/tutorial'
import { SettingsView, SettingsData } from '@/features/settings'
import { AuthView } from '@/features/auth'
import { useAuth } from '@/contexts/AuthContext'
import { ReportModal, BlockModal } from '@/features/safety'
import { CreateReportInput, CreateBlockInput, ReportTargetType } from '@/domain/safety'
import { ThemeSelectModal } from '@/features/theme'
import { defaultCoverDesigns } from '@/domain/theme'
import {
  MysteryPostView,
  PostStickerModal,
  ReceivedStickerModal,
} from '@/features/mystery-post'
import {
  MysteryPostState,
  ReceivedSticker,
  PostedSticker,
  PresetMessage,
  canPostToday,
  generateAnonymousName,
  getNextDeliveryTime,
} from '@/domain/mysteryPost'
import {
  TradeScoutView,
  ScoutListEditModal,
  MatchDetailModal,
} from '@/features/trade-scout'
import {
  TradeScoutState,
  ScoutSticker,
  ScoutMatch,
  initialTradeScoutState,
} from '@/domain/tradeScout'
import {
  ShopView,
  SubscriptionModal,
  StarPurchaseModal,
  AdRewardModal,
  DailyBonusModal,
  InsufficientFundsModal,
} from '@/features/shop'
import {
  UserMonetization,
  StarPack,
  SubscriptionTier,
  STAR_PACKS,
  DEFAULT_USER_MONETIZATION,
  needsDailyReset,
  collectDailyTickets,
  collectDailyStars,
  watchAdForTicket,
  purchaseStars,
  getRemainingAdWatches,
} from '@/domain/monetization'
import {
  SavedUserData,
  SavedCollectionItem,
  AdminMode,
  createInitialUserData,
  createTestModeData,
  loadAdminMode,
  saveAdminMode,
  addStickersToCollection,
  canPlaceSticker,
  resetAllData,
  TestUser,
  TEST_USERS,
  getCurrentTestUser,
  switchTestUser,
  saveCurrentUserData,
  loadCurrentUserData,
  createInitialUserDataForTestUser,
} from '@/utils/persistence'
import {
  loadCollectionFromSupabase,
  loadAllStickersFromSupabase,
  getDataSource,
  addStickersToSupabase,
} from '@/utils/supabaseSync'
import { useSupabaseTrade } from '@/hooks'
import { AdminView } from '@/features/admin'
import { stickerBookService, type StickerBookPage as SupabaseStickerBookPage } from '@/services/stickerBook'
import { profileService } from '@/services/profile'
import { mysteryPostService } from '@/services/mysteryPost'
import { tradeScoutService } from '@/services/tradeScout'

// キャラクター定義（レアリティ・タイプ・ガチャ重み付き）
// ★★★★★ (5) もっちも, ウールン, トイラン: レジェンド（排出率: 約1.4%）
// ★★★★ (4) スタラ, チャックン: スーパーレア（排出率: 約4.7%）
// ★★★ (3) ドロル, サニたん: レア（排出率: 約14.1%）
// ★★ (2) コケボ, キノぼう: アンコモン（排出率: 約28.2%）
// ★ (1) ポフン, ポリ: コモン（排出率: 約51.6%）
interface CharacterData {
  id: string
  name: string
  folder: string
  prefix: string
  rarity: 1 | 2 | 3 | 4 | 5
  type: 'normal' | 'puffy' | 'sparkle'
  gachaWeight: number
  baseRate: number
}

const characters: CharacterData[] = [
  // ★★★★★ レジェンド（排出率: 約1.4%）
  { id: 'mocchimo', name: 'もっちも', folder: 'もっちも', prefix: 'もっちも_', rarity: 5, type: 'sparkle', gachaWeight: 1, baseRate: 500 },
  { id: 'woolun', name: 'ウールン', folder: 'ウールン', prefix: 'ウールン_', rarity: 5, type: 'sparkle', gachaWeight: 1, baseRate: 500 },
  { id: 'toiran', name: 'トイラン', folder: 'トイラン', prefix: 'トイラン_', rarity: 5, type: 'sparkle', gachaWeight: 1, baseRate: 500 },
  // ★★★★ スーパーレア（排出率: 約4.7%）
  { id: 'sutara', name: 'スタラ', folder: 'スタラ', prefix: 'スタラ_', rarity: 4, type: 'puffy', gachaWeight: 5, baseRate: 200 },
  { id: 'chakkun', name: 'チャックン', folder: 'チャックン', prefix: 'チャックン_', rarity: 4, type: 'puffy', gachaWeight: 5, baseRate: 200 },
  // ★★★ レア（排出率: 約14.1%）
  { id: 'dororu', name: 'ドロル', folder: 'ドロル', prefix: 'ドロル_', rarity: 3, type: 'normal', gachaWeight: 15, baseRate: 100 },
  { id: 'sanitan', name: 'サニたん', folder: 'サニたん', prefix: 'サニたん_', rarity: 3, type: 'normal', gachaWeight: 15, baseRate: 100 },
  // ★★ アンコモン（排出率: 約28.2%）
  { id: 'kokebo', name: 'コケボ', folder: 'コケボ', prefix: 'コケボ_', rarity: 2, type: 'normal', gachaWeight: 30, baseRate: 50 },
  { id: 'kinobou', name: 'キノぼう', folder: 'キノぼう', prefix: 'キノぼう_', rarity: 2, type: 'normal', gachaWeight: 30, baseRate: 50 },
  // ★ コモン（排出率: 約51.6%）
  { id: 'pofun', name: 'ポフン', folder: 'ポフン', prefix: 'sticker_', rarity: 1, type: 'normal', gachaWeight: 55, baseRate: 20 },
  { id: 'pori', name: 'ポリ', folder: 'ポリ', prefix: 'ポリ_', rarity: 1, type: 'normal', gachaWeight: 55, baseRate: 20 },
]

// 全165枚のシールデータを生成
// キャラクターごとにレアリティ・タイプ・ガチャ重みが設定されている
const demoStickers: Sticker[] = characters.flatMap((char) =>
  Array.from({ length: 15 }, (_, i) => ({
    id: `${char.id}-${i + 1}`,
    name: `${char.name} ${i + 1}`,
    imageUrl: `/stickers/${char.folder}/${char.prefix}${i + 1}.png`,
    rarity: char.rarity,  // キャラクターのレアリティを使用
    type: char.type,      // キャラクターのタイプを使用
    series: char.name,
    gachaWeight: char.gachaWeight,  // ガチャ排出重み
    baseRate: char.baseRate,        // 交換レート基準値
  }))
)

// デバッグ: demoStickersの最初の数件を確認
console.log('[DemoStickers Debug] First 3 stickers:', demoStickers.slice(0, 3).map(s => ({ id: s.id, imageUrl: s.imageUrl })))

// Demo placed stickers (いくつかのシールを配置済み)
const demoPlacedStickers: PlacedSticker[] = [
  {
    id: 'placed-1',
    stickerId: 'mocchimo-1',
    sticker: demoStickers[0], // もっちも 1
    pageId: 'page-1',
    x: 0.3,
    y: 0.3,
    rotation: -5,
    scale: 1,
    zIndex: 1,
    placedAt: new Date().toISOString(),
  },
  {
    id: 'placed-2',
    stickerId: 'woolun-3',
    sticker: demoStickers[17], // ウールン 3
    pageId: 'page-1',
    x: 0.7,
    y: 0.5,
    rotation: 10,
    scale: 1.1,
    zIndex: 2,
    placedAt: new Date().toISOString(),
  },
  {
    id: 'placed-3',
    stickerId: 'sanitan-5',
    sticker: demoStickers[64], // サニたん 5
    pageId: 'page-2',
    x: 0.5,
    y: 0.4,
    rotation: 0,
    scale: 1.2,
    zIndex: 1,
    placedAt: new Date().toISOString(),
  },
]

// Demo book pages (initial value)
const initialDemoPages: BookPage[] = [
  { id: 'cover', type: 'cover', side: 'right' },
  { id: 'page-1', type: 'page', side: 'left' },
  { id: 'page-2', type: 'page', side: 'right' },
  { id: 'page-3', type: 'page', side: 'left' },
  { id: 'page-4', type: 'page', side: 'right' },
  { id: 'back', type: 'back-cover', side: 'left' },
]

// Demo collection stickers (各キャラクターから数枚ずつ所持)
const demoCollectionStickers: CollectionSticker[] = demoStickers.map((s, i) => {
  // キャラクターごとに所持状況を変える
  const charIndex = Math.floor(i / 15)
  const stickerIndex = i % 15
  // 最初の5キャラは多め、後半は少なめに所持
  const owned = charIndex < 5 ? stickerIndex < 10 : stickerIndex < 5
  const quantity = owned ? Math.floor(Math.random() * 5) + 1 : 0
  // キャラクター名を取得（フィルタリング用）
  const characterName = characters[charIndex]?.name || ''

  return {
    id: s.id,
    name: s.name,
    imageUrl: s.imageUrl,
    rarity: s.rarity as 1 | 2 | 3 | 4 | 5,
    type: s.type,
    series: s.series || 'ドリームコレクション',
    character: characterName, // キャラクター名を追加
    owned,
    quantity,
    rank: quantity > 3 ? 3 : quantity > 1 ? 2 : 1,
    totalAcquired: owned ? Math.floor(Math.random() * 10) + quantity : 0,
  }
})

// Demo gacha banners
// 終了日を「あと○日」形式で表示するヘルパー関数
const formatEndDate = (date: Date): string => {
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'まもなく終了'
  if (diffDays === 1) return 'あと1日'
  return `あと${diffDays}日`
}

const demoBanners: GachaBanner[] = [
  {
    id: 'banner-1',
    name: 'ドリームコレクション',
    description: 'キラキラシールをゲットしよう！',
    type: 'normal',
    costSingle: 1,
    costMulti: 10,
    currency: 'ticket',
    endDate: formatEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    // 通常ガチャの排出レート（gachaWeightベース: 5=1, 4=3, 3=10, 2=20, 1=37）
    rates: [
      { stars: 5, rate: '1.4%' },
      { stars: 4, rate: '4.2%' },
      { stars: 3, rate: '14.1%' },
      { stars: 2, rate: '28.2%' },
      { stars: 1, rate: '52.1%' },
    ],
  },
  {
    id: 'banner-2',
    name: 'プレミアムガチャ',
    description: 'レアシールが出やすい！',
    type: 'premium',
    costSingle: 100,
    costMulti: 900,
    currency: 'gem',
    // プレミアムガチャの排出レート（高レア確率UP）
    rates: [
      { stars: 5, rate: '5.0%' },
      { stars: 4, rate: '15.0%' },
      { stars: 3, rate: '30.0%' },
      { stars: 2, rate: '30.0%' },
      { stars: 1, rate: '20.0%' },
    ],
  },
]

// Demo user monetization (default state)
const demoUserMonetization: UserMonetization = DEFAULT_USER_MONETIZATION

// Friends list - will be populated from Supabase
const demoFriends: Friend[] = []

// Trade history - will be populated from Supabase
const demoTradeHistory: TradeHistory[] = []

// Demo posts for timeline
const createDemoPosts = (placedStickers: PlacedSticker[]): Post[] => [
  {
    id: 'post-1',
    userId: 'user-1',
    userName: 'ゆうき',
    userAvatarUrl: undefined,
    // pageImageUrl は使わず、pageData を使用
    pageData: {
      placedStickers: [
        {
          id: 'demo-placed-1',
          stickerId: demoStickers[5].id,
          sticker: demoStickers[5],
          pageId: 'demo-page',
          x: 0.3,
          y: 0.35,
          rotation: -8,
          scale: 1,
          zIndex: 1,
          placedAt: new Date().toISOString(),
        },
        {
          id: 'demo-placed-2',
          stickerId: demoStickers[20].id,
          sticker: demoStickers[20],
          pageId: 'demo-page',
          x: 0.7,
          y: 0.5,
          rotation: 12,
          scale: 1.1,
          zIndex: 2,
          placedAt: new Date().toISOString(),
        },
        {
          id: 'demo-placed-3',
          stickerId: demoStickers[45].id,
          sticker: demoStickers[45],
          pageId: 'demo-page',
          x: 0.5,
          y: 0.7,
          rotation: 0,
          scale: 0.9,
          zIndex: 3,
          placedAt: new Date().toISOString(),
        },
      ],
    },
    caption: 'お気に入りのページができました！✨',
    hashtags: ['かわいい', 'シール帳'],
    reactions: [
      { type: 'heart', count: 5, isReacted: false },
    ],
    commentCount: 2,
    createdAt: new Date().toISOString(),
    isFollowing: false,
    visibility: 'public',
  },
]

// 初期累積経験値 (新規ユーザーは0からスタート)
const INITIAL_TOTAL_EXP = 0

// 経験値からプロフィールを計算する関数
function createUserProfile(
  totalExp: number,
  name: string = 'ゲスト',
  bio: string = ''
): UserProfile {
  const level = calculateLevel(totalExp)
  const currentExp = getCurrentLevelExp(totalExp)
  const expNeeded = getExpToNextLevel(totalExp)

  return {
    id: 'user-me',
    name,
    avatarUrl: undefined,
    title: getLevelTitle(level),
    level,
    exp: currentExp,
    expToNextLevel: expNeeded,
    bio,
    createdAt: new Date().toISOString(),
  }
}

// 初期プロフィール
const demoUserProfile: UserProfile = createUserProfile(INITIAL_TOTAL_EXP)

// Demo user stats
const demoUserStats: UserStats = {
  totalStickers: 42,
  uniqueStickers: 35,
  completedSeries: 2,
  totalTrades: 12,
  friendsCount: 8,
  followersCount: 156,
  followingCount: 89,
  postsCount: 5,
  reactionsReceived: 24,
}

// Demo achievements
const demoAchievements: Achievement[] = [
  // コレクション系
  { id: 'collection-1', name: 'はじめの一歩', description: 'はじめてシールをはろう', icon: '⭐', isUnlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'collection-2', name: 'コレクター見習い', description: 'シールを10枚あつめよう', icon: '📦', isUnlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'collection-3', name: 'コレクターマスター', description: 'シールを50枚あつめよう', icon: '🎨', isUnlocked: false },
  { id: 'collection-4', name: 'レジェンドゲット', description: '★5シールを手に入れよう', icon: '👑', isUnlocked: false },
  // 交換系
  { id: 'trade-1', name: 'はじめてのこうかん', description: 'シールをこうかんしよう', icon: '🤝', isUnlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'trade-2', name: 'トレーダー', description: '5回こうかんしよう', icon: '🔄', isUnlocked: false },
  { id: 'trade-3', name: 'こうかん名人', description: '20回こうかんしよう', icon: '💫', isUnlocked: false },
  // ソーシャル系
  { id: 'social-1', name: 'はじめてのフレンド', description: 'フレンドを1人つくろう', icon: '👫', isUnlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'social-2', name: 'にんきもの', description: 'リアクションを10こもらおう', icon: '💖', isUnlocked: false },
  { id: 'social-3', name: 'みんなのなかま', description: 'フレンドを10人つくろう', icon: '🌟', isUnlocked: false },
]

// Demo followers
const demoFollowers: FollowUser[] = [
  { id: 'user-1', name: 'さくら', level: 12, title: 'シールマスター', isFollowing: true },
  { id: 'user-2', name: 'ゆうと', level: 8, title: 'コレクター見習い', isFollowing: false },
  { id: 'user-3', name: 'あおい', level: 15, title: 'レジェンドハンター', isFollowing: true },
  { id: 'user-4', name: 'りく', level: 5, isFollowing: false },
  { id: 'user-5', name: 'ひなた', level: 10, title: 'トレードマニア', isFollowing: true },
]

// Demo following
const demoFollowing: FollowUser[] = [
  { id: 'user-1', name: 'さくら', level: 12, title: 'シールマスター', isFollowing: true },
  { id: 'user-3', name: 'あおい', level: 15, title: 'レジェンドハンター', isFollowing: true },
  { id: 'user-5', name: 'ひなた', level: 10, title: 'トレードマニア', isFollowing: true },
  { id: 'user-6', name: 'みなと', level: 20, title: 'キング・オブ・シール', isFollowing: true },
]

// 他ユーザーの詳細プロフィールデータ（ID->詳細のマップ）
const demoOtherUserProfiles: Record<string, OtherUserProfile> = {
  'user-1': {
    id: 'user-1',
    name: 'さくら',
    level: 12,
    title: 'シールマスター',
    bio: 'シール集め大好き！もっちもが推しです💕 毎日ガチャ引いてます！',
    isFollowing: true,
    stats: {
      totalStickers: 156,
      uniqueStickers: 89,
      completedSeries: 3,
      followersCount: 234,
      followingCount: 45,
    },
  },
  'user-2': {
    id: 'user-2',
    name: 'ゆうと',
    level: 8,
    title: 'コレクター見習い',
    bio: 'シール集め始めました！よろしくお願いします。',
    isFollowing: false,
    stats: {
      totalStickers: 42,
      uniqueStickers: 28,
      completedSeries: 0,
      followersCount: 15,
      followingCount: 32,
    },
  },
  'user-3': {
    id: 'user-3',
    name: 'あおい',
    level: 15,
    title: 'レジェンドハンター',
    bio: '★5シール集めが生きがい！交換いつでも歓迎です。',
    isFollowing: true,
    stats: {
      totalStickers: 312,
      uniqueStickers: 142,
      completedSeries: 5,
      followersCount: 567,
      followingCount: 89,
    },
  },
  'user-4': {
    id: 'user-4',
    name: 'りく',
    level: 5,
    bio: '初心者です。仲良くしてください！',
    isFollowing: false,
    stats: {
      totalStickers: 23,
      uniqueStickers: 18,
      completedSeries: 0,
      followersCount: 8,
      followingCount: 12,
    },
  },
  'user-5': {
    id: 'user-5',
    name: 'ひなた',
    level: 10,
    title: 'トレードマニア',
    bio: '交換で集めるのが楽しい！いつでもマッチングしてね。',
    isFollowing: true,
    stats: {
      totalStickers: 98,
      uniqueStickers: 67,
      completedSeries: 2,
      followersCount: 123,
      followingCount: 78,
    },
  },
  'user-6': {
    id: 'user-6',
    name: 'みなと',
    level: 20,
    title: 'キング・オブ・シール',
    bio: '全シールコンプリート目指してます！困ってる人は声かけてね。',
    isFollowing: true,
    stats: {
      totalStickers: 523,
      uniqueStickers: 158,
      completedSeries: 8,
      followersCount: 1234,
      followingCount: 156,
    },
  },
}

// 他ユーザーのシール帳プレビューデータ
const getDemoStickerBookPreviews = (userId: string): StickerBookPreview[] => {
  // ユーザーごとに異なるプレビューを返す（デモ用）
  const basePreviews: StickerBookPreview[] = [
    { pageId: `${userId}-page-1`, pageNumber: 1, stickerCount: 5 },
    { pageId: `${userId}-page-2`, pageNumber: 2, stickerCount: 3 },
    { pageId: `${userId}-page-3`, pageNumber: 3, stickerCount: 7 },
    { pageId: `${userId}-page-4`, pageNumber: 4, stickerCount: 2 },
  ]
  return basePreviews
}

// 他ユーザーのシール帳ページデータ（BookView用）
const getDemoOtherUserBookPages = (userId: string): BookPage[] => {
  return [
    { id: `${userId}-cover`, type: 'cover', side: 'right' },
    { id: `${userId}-page-1`, type: 'page', side: 'left' },
    { id: `${userId}-page-2`, type: 'page', side: 'right' },
    { id: `${userId}-page-3`, type: 'page', side: 'left' },
    { id: `${userId}-page-4`, type: 'page', side: 'right' },
    { id: `${userId}-back`, type: 'back-cover', side: 'left' },
  ]
}

// 他ユーザーのシールデータ（BookView用）
// 実際のdemoStickersを使用して、ユーザーごとに異なるシール配置を生成
const getDemoOtherUserStickers = (userId: string): PlacedSticker[] => {
  // ユーザーIDからハッシュ値を生成して異なるシールを選択
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // demoStickersから異なるシールを選択（実際のシールデータを使用）
  const stickerIndices = [
    hash % demoStickers.length,
    (hash * 2 + 5) % demoStickers.length,
    (hash * 3 + 10) % demoStickers.length,
    (hash * 4 + 15) % demoStickers.length,
    (hash * 5 + 20) % demoStickers.length,
  ]

  return [
    {
      id: `${userId}-sticker-1`,
      stickerId: demoStickers[stickerIndices[0]].id,
      sticker: demoStickers[stickerIndices[0]],
      pageId: `${userId}-page-1`,
      x: 0.3,
      y: 0.35,
      rotation: 5,
      scale: 0.5,
      zIndex: 1,
      placedAt: new Date().toISOString(),
    },
    {
      id: `${userId}-sticker-2`,
      stickerId: demoStickers[stickerIndices[1]].id,
      sticker: demoStickers[stickerIndices[1]],
      pageId: `${userId}-page-1`,
      x: 0.7,
      y: 0.55,
      rotation: -10,
      scale: 0.55,
      zIndex: 2,
      placedAt: new Date().toISOString(),
    },
    {
      id: `${userId}-sticker-3`,
      stickerId: demoStickers[stickerIndices[2]].id,
      sticker: demoStickers[stickerIndices[2]],
      pageId: `${userId}-page-2`,
      x: 0.4,
      y: 0.4,
      rotation: 0,
      scale: 0.6,
      zIndex: 1,
      placedAt: new Date().toISOString(),
    },
    {
      id: `${userId}-sticker-4`,
      stickerId: demoStickers[stickerIndices[3]].id,
      sticker: demoStickers[stickerIndices[3]],
      pageId: `${userId}-page-2`,
      x: 0.65,
      y: 0.6,
      rotation: 8,
      scale: 0.45,
      zIndex: 2,
      placedAt: new Date().toISOString(),
    },
    {
      id: `${userId}-sticker-5`,
      stickerId: demoStickers[stickerIndices[4]].id,
      sticker: demoStickers[stickerIndices[4]],
      pageId: `${userId}-page-3`,
      x: 0.5,
      y: 0.45,
      rotation: -5,
      scale: 0.58,
      zIndex: 1,
      placedAt: new Date().toISOString(),
    },
  ]
}

// Demo settings
const demoSettings: SettingsData = {
  notifications: {
    tradeRequests: true,
    friendRequests: true,
    newStickers: true,
    contests: true,
  },
  privacy: {
    publicProfile: true,
    showOnlineStatus: true,
    allowTradeRequests: true,
  },
  display: {
    language: 'ja',
    theme: 'light',
  },
}

// 架空のユーザーデータ
const demoPartnerUserData: TradeUser = {
  id: 'partner-sakura',
  name: 'さくら',
  avatarUrl: undefined,
  level: 12,
  bio: 'シール集め大好き！✨ もっちもが推しです💕',
  totalStickers: 156,
  totalTrades: 28,
}

// Demo book pages for trade session - 自分のシール帳（表紙・ページ・裏表紙を含む）
const demoMyTradePages: TradeBookPageFull[] = [
  {
    id: 'my-trade-cover',
    type: 'cover',
    pageNumber: 0,
    stickers: [],
  },
  {
    id: 'my-trade-page-1',
    type: 'page',
    pageNumber: 1,
    side: 'left',
    stickers: [
      {
        id: 'my-placed-1',
        stickerId: demoStickers[0].id,
        sticker: demoStickers[0],
        pageId: 'my-trade-page-1',
        x: 0.25,
        y: 0.3,
        rotation: 5,
        scale: 1,
        zIndex: 1,
        placedAt: new Date().toISOString(),
      },
      {
        id: 'my-placed-2',
        stickerId: demoStickers[15].id,
        sticker: demoStickers[15],
        pageId: 'my-trade-page-1',
        x: 0.7,
        y: 0.6,
        rotation: -10,
        scale: 1,
        zIndex: 2,
        placedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'my-trade-page-2',
    type: 'page',
    pageNumber: 2,
    side: 'right',
    stickers: [
      {
        id: 'my-placed-3',
        stickerId: demoStickers[30].id,
        sticker: demoStickers[30],
        pageId: 'my-trade-page-2',
        x: 0.5,
        y: 0.4,
        rotation: 0,
        scale: 1,
        zIndex: 1,
        placedAt: new Date().toISOString(),
      },
      {
        id: 'my-placed-4',
        stickerId: demoStickers[35].id,
        sticker: demoStickers[35],
        pageId: 'my-trade-page-2',
        x: 0.3,
        y: 0.7,
        rotation: 8,
        scale: 1,
        zIndex: 2,
        placedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'my-trade-page-3',
    type: 'page',
    pageNumber: 3,
    side: 'left',
    stickers: [
      {
        id: 'my-placed-5',
        stickerId: demoStickers[50].id,
        sticker: demoStickers[50],
        pageId: 'my-trade-page-3',
        x: 0.4,
        y: 0.35,
        rotation: -5,
        scale: 1,
        zIndex: 1,
        placedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'my-trade-back',
    type: 'back-cover',
    pageNumber: 4,
    stickers: [],
  },
]

// 相手（さくら）のシール帳データ
const demoPartnerTradePages: TradeBookPageFull[] = [
  {
    id: 'partner-trade-cover',
    type: 'cover',
    pageNumber: 0,
    stickers: [],
    // カバーデザインはTradeSessionFullのpartnerCoverDesignIdで指定
  },
  {
    id: 'partner-trade-page-1',
    type: 'page',
    pageNumber: 1,
    side: 'left',
    stickers: [
      {
        id: 'partner-placed-1',
        stickerId: demoStickers[45].id,
        sticker: demoStickers[45],
        pageId: 'partner-trade-page-1',
        x: 0.3,
        y: 0.3,
        rotation: 8,
        scale: 1,
        zIndex: 1,
        placedAt: new Date().toISOString(),
      },
      {
        id: 'partner-placed-2',
        stickerId: demoStickers[60].id,
        sticker: demoStickers[60],
        pageId: 'partner-trade-page-1',
        x: 0.7,
        y: 0.5,
        rotation: -5,
        scale: 1,
        zIndex: 2,
        placedAt: new Date().toISOString(),
      },
      {
        id: 'partner-placed-3',
        stickerId: demoStickers[10].id,
        sticker: demoStickers[10],
        pageId: 'partner-trade-page-1',
        x: 0.5,
        y: 0.75,
        rotation: 12,
        scale: 1,
        zIndex: 3,
        placedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'partner-trade-page-2',
    type: 'page',
    pageNumber: 2,
    side: 'right',
    stickers: [
      {
        id: 'partner-placed-4',
        stickerId: demoStickers[75].id,
        sticker: demoStickers[75],
        pageId: 'partner-trade-page-2',
        x: 0.45,
        y: 0.4,
        rotation: 0,
        scale: 1,
        zIndex: 1,
        placedAt: new Date().toISOString(),
      },
      {
        id: 'partner-placed-5',
        stickerId: demoStickers[80].id,
        sticker: demoStickers[80],
        pageId: 'partner-trade-page-2',
        x: 0.25,
        y: 0.65,
        rotation: -8,
        scale: 1,
        zIndex: 2,
        placedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'partner-trade-page-3',
    type: 'page',
    pageNumber: 3,
    side: 'left',
    stickers: [
      {
        id: 'partner-placed-6',
        stickerId: demoStickers[25].id,
        sticker: demoStickers[25],
        pageId: 'partner-trade-page-3',
        x: 0.5,
        y: 0.35,
        rotation: 5,
        scale: 1,
        zIndex: 1,
        placedAt: new Date().toISOString(),
      },
      {
        id: 'partner-placed-7',
        stickerId: demoStickers[55].id,
        sticker: demoStickers[55],
        pageId: 'partner-trade-page-3',
        x: 0.35,
        y: 0.7,
        rotation: -3,
        scale: 1,
        zIndex: 2,
        placedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'partner-trade-page-4',
    type: 'page',
    pageNumber: 4,
    side: 'right',
    stickers: [
      {
        id: 'partner-placed-8',
        stickerId: demoStickers[90].id,
        sticker: demoStickers[90],
        pageId: 'partner-trade-page-4',
        x: 0.6,
        y: 0.45,
        rotation: 10,
        scale: 1,
        zIndex: 1,
        placedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'partner-trade-back',
    type: 'back-cover',
    pageNumber: 5,
    stickers: [],
  },
]

// シール帳のサイズ定数（BookViewのデフォルトと一致させる）
const BOOK_WIDTH = 320
const BOOK_HEIGHT = 480

export default function Home() {
  // Auth state - 実際の認証ユーザーを使用
  const { user, userCode, isLoading: isAuthLoading, isAccountLinked, linkedProviders, linkGoogle, linkApple } = useAuth()

  // 認証ユーザーから現在のユーザー情報を導出
  const currentUser = useMemo(() => {
    if (!user) return null
    return {
      id: user.id, // Supabase UUID（データ読み込みに使用）
      supabaseId: user.id, // 互換性のため同じ値
      name: user.profile?.display_name || 'ゲスト',
      userCode: userCode || '',
      emoji: '🎫',
      color: '#A855F7',
    }
  }, [user, userCode])

  // Tab state
  const [activeTab, setActiveTab] = useState<TabId>('home')

  // Book state
  const bookRef = useRef<BookViewHandle>(null)
  const bookContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pages, setPages] = useState<BookPage[]>(initialDemoPages)
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>(demoPlacedStickers)
  const [selectedCharm, setSelectedCharm] = useState<CharmData>(CHARM_LIST[0])
  const [isSpreadView, setIsSpreadView] = useState(true)
  // coverDesignIdを使用（もっちもの表紙を使用）
  const [coverDesignId, setCoverDesignId] = useState<string>('cover-mochimo')

  // Sticker editing state
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null)
  const [editingSticker, setEditingSticker] = useState<PlacedSticker | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // ペリペリエフェクト用state
  const [showPeelEffect, setShowPeelEffect] = useState(false)
  const [peelEffectPosition, setPeelEffectPosition] = useState({ x: 0, y: 0 })
  const [peelEffectImageUrl, setPeelEffectImageUrl] = useState<string>()
  const [stickinessMessage, setStickinessMessage] = useState<string | null>(null)
  // シール貼り付けエフェクト用state
  const [showPlaceEffect, setShowPlaceEffect] = useState(false)
  const [placeEffectPosition, setPlaceEffectPosition] = useState({ x: 0, y: 0 })

  // デコ・ドロワー用state
  const [isDecoDrawerOpen, setIsDecoDrawerOpen] = useState(false)
  const [selectedDecoItem, setSelectedDecoItem] = useState<DecoItemData | null>(null)
  const [placedDecoItems, setPlacedDecoItems] = useState<PlacedDecoItem[]>([])
  const [editingDecoItem, setEditingDecoItem] = useState<PlacedDecoItem | null>(null)
  // 所持デコアイテム（デフォルトアイテムを含む）
  const ownedDecoItems = useMemo(() => getOwnedDecoItems([]), [])

  // レイヤー制御パネル用state
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(false)
  const [selectedLayerItemId, setSelectedLayerItemId] = useState<string | null>(null)

  // Modal states
  const [isPageEditModalOpen, setIsPageEditModalOpen] = useState(false)
  const [isStickerDetailModalOpen, setIsStickerDetailModalOpen] = useState(false)
  const [selectedCollectionSticker, setSelectedCollectionSticker] = useState<CollectionSticker | null>(null)
  const [isGachaResultModalOpen, setIsGachaResultModalOpen] = useState(false)
  const [gachaResults, setGachaResults] = useState<GachaResultSticker[]>([])
  const [lastGachaPull, setLastGachaPull] = useState<{ bannerId: string; count: number } | null>(null)
  const [continueConfirmDialog, setContinueConfirmDialog] = useState<{
    isOpen: boolean
    pullType: 'single' | 'multi' | null
    cost: number
    currency: 'ticket' | 'star' | 'gem'
  }>({ isOpen: false, pullType: null, cost: 0, currency: 'ticket' })
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState<{ type: ReportTargetType; id: string; userId: string; name: string } | null>(null)
  const [blockTarget, setBlockTarget] = useState<{ id: string; name: string } | null>(null)
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>(demoUserProfile)
  const [totalExp, setTotalExp] = useState(INITIAL_TOTAL_EXP)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; rewards: LevelUpReward[] } | null>(null)
  const [isThemeSelectOpen, setIsThemeSelectOpen] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false)
  const [isFollowListModalOpen, setIsFollowListModalOpen] = useState(false)
  const [followListInitialTab, setFollowListInitialTab] = useState<'followers' | 'following'>('followers')
  const [isOtherUserProfileOpen, setIsOtherUserProfileOpen] = useState(false)
  const [selectedOtherUser, setSelectedOtherUser] = useState<OtherUserProfile | null>(null)
  const [selectedUserStickerBook, setSelectedUserStickerBook] = useState<StickerBookPreview[]>([])
  const [selectedUserBookPages, setSelectedUserBookPages] = useState<BookPage[]>([])
  const [selectedUserBookStickers, setSelectedUserBookStickers] = useState<PlacedSticker[]>([])
  const [selectedUserCoverDesignId, setSelectedUserCoverDesignId] = useState<string>('cover-mochimo')

  // Trade state
  const [matchingStatus, setMatchingStatus] = useState<MatchingStatus>('idle')
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null)
  const [isTradeSessionOpen, setIsTradeSessionOpen] = useState(false)
  const [tradePartner, setTradePartner] = useState<TradePartner | null>(null)

  // ミステリーポスト state
  const [mysteryPostState, setMysteryPostState] = useState<MysteryPostState>({
    todayPosted: null,
    pendingStickers: [],
    receivedStickers: [], // Supabaseから取得
    nextDeliveryTime: getNextDeliveryTime(),
  })
  const [isPostStickerModalOpen, setIsPostStickerModalOpen] = useState(false)
  const [isReceivedStickerModalOpen, setIsReceivedStickerModalOpen] = useState(false)
  const [selectedReceivedSticker, setSelectedReceivedSticker] = useState<ReceivedSticker | null>(null)
  // トレード画面のサブタブ（交換/ミステリーポスト/スカウト切替）
  const [tradeSubTab, setTradeSubTab] = useState<'trade' | 'mystery' | 'scout'>('trade')

  // トレード・スカウトの状態 - Supabaseから取得
  const [tradeScoutState, setTradeScoutState] = useState<TradeScoutState>({
    ...initialTradeScoutState,
    // matches will be populated from Supabase
    matches: [],
  })
  const [isScoutWantListModalOpen, setIsScoutWantListModalOpen] = useState(false)
  const [isScoutOfferListModalOpen, setIsScoutOfferListModalOpen] = useState(false)
  const [isMatchDetailModalOpen, setIsMatchDetailModalOpen] = useState(false)
  const [selectedScoutMatch, setSelectedScoutMatch] = useState<ScoutMatch | null>(null)

  // 自分のシール帳をTrade用に変換（ホームで編集したシール帳をそのまま交換画面で使用）
  // シールとデコアイテムの両方を含める
  const myTradePages: TradeBookPageFull[] = useMemo(() => {
    return pages.map((page, index) => ({
      ...page,
      pageNumber: index,
      stickers: placedStickers.filter(s => s.pageId === page.id),
      decoItems: placedDecoItems.filter(d => d.pageId === page.id),
    }))
  }, [pages, placedStickers, placedDecoItems])

  // Monetization state (includes currency)
  const [userMonetization, setUserMonetization] = useState<UserMonetization>(demoUserMonetization)

  // Derive userCurrency from userMonetization for compatibility with GachaView
  const userCurrency: UserCurrency = useMemo(() => ({
    tickets: userMonetization.tickets,
    gems: userMonetization.gems,
    stars: userMonetization.stars,
  }), [userMonetization.tickets, userMonetization.gems, userMonetization.stars])

  // Shop modal states
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [isAdRewardModalOpen, setIsAdRewardModalOpen] = useState(false)
  const [isDailyBonusModalOpen, setIsDailyBonusModalOpen] = useState(false)
  const [insufficientFundsModal, setInsufficientFundsModal] = useState<{
    isOpen: boolean
    fundType: 'tickets' | 'stars'
    required: number
    current: number
  }>({ isOpen: false, fundType: 'tickets', required: 0, current: 0 })
  const [dailyBonusReceived, setDailyBonusReceived] = useState<{ tickets: number; stars: number } | null>(null)

  // Posts state - 初期化はuseMemoで（placedStickersに依存しないがデモ用）
  const [posts, setPosts] = useState<Post[]>(() => createDemoPosts([]))

  // Settings state
  const [settings, setSettings] = useState<SettingsData>(demoSettings)

  // ======================
  // 永続化システム（LocalStorage）
  // ======================
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [currentDataSource, setCurrentDataSource] = useState<'supabase' | 'localStorage'>('localStorage')
  const [adminMode, setAdminMode] = useState<AdminMode>('production')
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [collection, setCollection] = useState<SavedCollectionItem[]>([])
  // 注: currentTestUser は currentUser (認証ユーザー) に置き換えられました

  // Supabase交換システム（Supabase接続時のみ有効）
  const dataSource = getDataSource()
  const [supabaseTradeState, supabaseTradeActions] = useSupabaseTrade({
    currentUser: currentUser ? {
      id: currentUser.id,
      supabaseId: currentUser.supabaseId,
      name: currentUser.name,
      emoji: currentUser.emoji,
      color: currentUser.color,
    } : null,
    onTradeComplete: (trade) => {
      console.log('[Trade] Completed via Supabase:', trade)
      // コレクションをリロード
      if (currentUser) {
        loadCollectionFromSupabase(currentUser.id).then(newCollection => {
          setCollection(newCollection)
        })
      }
    },
    onError: (error) => {
      console.error('[Trade] Error:', error)
    }
  })

  // Supabase交換状態の変化を監視してUIを更新
  useEffect(() => {
    const trade = supabaseTradeState.currentTrade
    if (!trade || !currentUser) return

    console.log('[Trade] Supabase trade state changed:', trade.status)

    // 誰かが自分の交換に参加した場合（matching → negotiating）
    if (trade.status === 'negotiating' && matchingStatus === 'searching') {
      // 相手ユーザーを特定
      const isTradeCreator = trade.user1_id === currentUser.supabaseId
      const partnerId = isTradeCreator ? trade.user2_id : trade.user1_id
      if (!partnerId) return // パートナーIDがない場合は処理しない

      // パートナー情報をSupabaseから取得
      profileService.getProfile(partnerId).then(partnerProfile => {
        const partnerName = partnerProfile?.displayName || '交換相手'
        console.log('[Trade] Partner joined! Setting up trade session with:', partnerName)
        console.log('[Trade] I am trade creator:', isTradeCreator)

        if (isTradeCreator) {
          // 交換作成者の場合：既に参加済みなので、直接交換セッションを開く
          setTradePartner({
            id: trade.id,
            name: partnerName,
            avatarUrl: partnerProfile?.avatarUrl || undefined,
            level: 1,
          })
          setMatchingStatus('idle')
          setMatchedUser(null)
          setIsTradeSessionOpen(true)
        } else {
          // 参加者の場合：マッチ確認UIを表示（その後joinTradeを呼ぶ）
          setMatchingStatus('found')
          setMatchedUser({
            id: trade.id,
            name: partnerName,
            avatarUrl: partnerProfile?.avatarUrl || undefined,
            level: 1,
          })
        }
      })
    }
  }, [supabaseTradeState.currentTrade, matchingStatus, currentUser?.supabaseId])

  // 全シールIDのリスト（マスターデータ）
  const allStickerIds = useMemo(() => demoStickers.map(s => s.id), [])

  // コレクションをCollectionSticker形式に変換（UI用）
  // 配置済みシール数を引いた「残り枚数」を表示
  const collectionStickers: CollectionSticker[] = useMemo(() => {
    const collectionMap = new Map(collection.map(c => [c.stickerId, c]))
    // 配置済みシール数をカウント
    const placedCountMap = new Map<string, number>()
    placedStickers.forEach(p => {
      placedCountMap.set(p.stickerId, (placedCountMap.get(p.stickerId) || 0) + 1)
    })

    return demoStickers.map(s => {
      const saved = collectionMap.get(s.id)
      const totalQuantity = saved?.quantity || 0
      const placedCount = placedCountMap.get(s.id) || 0
      const remainingQuantity = Math.max(0, totalQuantity - placedCount)
      return {
        id: s.id,
        name: s.name,
        imageUrl: s.imageUrl,
        rarity: s.rarity as 1 | 2 | 3 | 4 | 5,
        type: s.type,
        series: s.series || 'ドリームコレクション',
        character: characters.find(c => s.id.startsWith(c.id))?.name || '',
        owned: remainingQuantity > 0,  // 残り枚数が1以上あれば所持
        quantity: remainingQuantity,  // 配置済みを引いた残り枚数
        rank: totalQuantity > 3 ? 3 : totalQuantity > 1 ? 2 : 1,  // ランクは累計で判定
        totalAcquired: saved?.totalAcquired || 0,
        firstAcquiredAt: saved?.firstAcquiredAt || undefined,
      }
    })
  }, [collection, placedStickers])

  // ダブりシール一覧を計算（quantityが2以上のシール）
  const duplicateStickers = useMemo(() => {
    return collectionStickers
      .filter(s => s.owned && s.quantity >= 2)
      .map(s => ({
        id: s.id,
        name: s.name,
        imageUrl: s.imageUrl || '',
        rarity: s.rarity,
        count: s.quantity - 1, // 手元に1枚残す
      }))
  }, [collectionStickers])

  // シール帳に配置可能なシール一覧（所持していて、まだ貼れる枚数が残っているもの）
  const placeableStickers = useMemo(() => {
    return demoStickers.filter(sticker => {
      const collectionItem = collection.find(c => c.stickerId === sticker.id)
      if (!collectionItem || collectionItem.quantity === 0) return false
      // 既に配置されている数をカウント
      const placedCount = placedStickers.filter(p => p.stickerId === sticker.id).length
      // まだ貼れる枚数が残っているか
      return collectionItem.quantity > placedCount
    })
  }, [collection, placedStickers])

  // 実際のデータから userStats を計算
  const userStats: UserStats = useMemo(() => {
    // コレクションからシール数を計算
    const totalStickers = collection.reduce((sum, item) => sum + item.quantity, 0)
    const uniqueStickers = collection.filter(item => item.quantity > 0).length

    // コンプリート数（キャラクターごとにすべてのシールを持っているか）
    // TODO: 実際のシリーズごとのコンプリート判定を実装
    const completedSeries = 0

    return {
      totalStickers,
      uniqueStickers,
      completedSeries,
      totalTrades: 0, // TODO: tradesテーブルから取得
      friendsCount: 0, // TODO: friendsテーブルから取得
      followersCount: 0, // TODO: followersテーブルから取得
      followingCount: 0, // TODO: followingテーブルから取得
      postsCount: posts.length,
      reactionsReceived: 0, // TODO: reactionsテーブルから取得
    }
  }, [collection, posts])

  // SavedUserDataを構築
  const buildSavedUserData = useCallback((): SavedUserData => ({
    version: 1,
    collection,
    monetization: userMonetization,
    placedStickers,
    placedDecoItems,
    pages,
    coverDesignId,
    profile: {
      name: userProfile.name,
      bio: userProfile.bio || '',
      totalExp,
    },
    settings: {
      soundEnabled: true, // SettingsDataにはsoundEnabledがないためデフォルト値
      notificationsEnabled: settings.notifications.tradeRequests || settings.notifications.friendRequests,
      language: settings.display.language,
    },
    stats: {
      totalGachaPulls: 0,
      totalTrades: 0,
      postsCount: posts.length,
    },
    lastSavedAt: new Date().toISOString(),
  }), [collection, userMonetization, placedStickers, placedDecoItems, pages, coverDesignId, userProfile, totalExp, settings, posts])

  // データを保存（自動保存）- 認証ユーザーに保存
  const saveData = useCallback(() => {
    if (!isDataLoaded || !currentUser) return // 初期化前または未認証は保存しない
    const data = buildSavedUserData()
    saveCurrentUserData(data)
    console.log('[Persistence] Data saved for user:', currentUser.id)
  }, [isDataLoaded, buildSavedUserData, currentUser])

  // 初回読み込み（認証完了を待ってからSupabase対応）
  useEffect(() => {
    // 認証中は待機
    if (isAuthLoading) {
      console.log('[Data] Waiting for authentication...')
      return
    }

    // 認証失敗時はローカルモードで動作
    if (!currentUser) {
      console.log('[Data] Authentication failed, loading local data only')
      const loadData = async () => {
        const mode = loadAdminMode()
        setAdminMode(mode)

        let userData = loadCurrentUserData()
        if (!userData) {
          console.log('[Data] No saved data, creating initial data')
          userData = createInitialUserData()
        }

        // ローカルデータを読み込み
        setCollection(userData.collection.map(item => ({
          stickerId: item.stickerId,
          quantity: item.quantity,
          totalAcquired: item.totalAcquired,
          firstAcquiredAt: item.firstAcquiredAt || new Date().toISOString(),
        })))
        setPlacedStickers(userData.placedStickers)
        setPlacedDecoItems(userData.placedDecoItems)
        setPages(userData.pages)
        setCoverDesignId(userData.coverDesignId)
        setUserMonetization(userData.monetization)
        setTotalExp(userData.profile.totalExp)
        setSettings(userData.settings)

        console.log('[Data] Local data loaded successfully (offline mode)')
        setIsDataLoaded(true)
      }
      loadData()
      return
    }

    const loadData = async () => {
      const mode = loadAdminMode()
      setAdminMode(mode)

      console.log('[Data] Loading data for authenticated user:', currentUser.id, currentUser.userCode)

      // データソースを判定
      const dataSource = getDataSource()
      setCurrentDataSource(dataSource)
      console.log('[Data] Data source:', dataSource)

      let userData = loadCurrentUserData()
      let supabaseAvatarUrl: string | null = null // Supabaseから読み込んだアバターURL

      // Supabaseモードの場合、コレクションをSupabaseから読み込み
      if (dataSource === 'supabase' && mode !== 'test') {
        console.log('[Supabase] Loading collection from Supabase for user:', currentUser.id)
        try {
          const supabaseCollection = await loadCollectionFromSupabase(currentUser.id)
          if (supabaseCollection.length > 0) {
            console.log('[Supabase] Loaded', supabaseCollection.length, 'stickers from Supabase')
            // Supabaseのコレクションをマージ
            if (!userData) {
              userData = createInitialUserDataForTestUser(currentUser.id)
            }
            userData.collection = supabaseCollection
          } else {
            console.log('[Supabase] No stickers found in Supabase, using localStorage data')
          }

          // シール帳データ（シール配置 + デコ配置）もSupabaseから読み込み
          console.log('[Supabase] Loading sticker book from Supabase for user:', currentUser.supabaseId)
          const stickerBook = await stickerBookService.getUserStickerBook(currentUser.supabaseId)
          if (stickerBook && stickerBook.pages.length > 0) {
            console.log('[Supabase] Loaded sticker book with', stickerBook.pages.length, 'pages')

            // Supabaseのページデータをローカル形式に変換
            const supabasePages: BookPage[] = stickerBook.pages.map(page => ({
              id: page.id,
              type: page.pageType as 'cover' | 'page' | 'back-cover' | 'inner-cover',
              side: page.side as 'left' | 'right' | undefined,
            }))

            // Supabaseのシール配置データを収集
            const supabasePlacedStickers: PlacedSticker[] = stickerBook.pages.flatMap(page => page.stickers)

            // Supabaseのデコ配置データを収集
            const supabasePlacedDecoItems: PlacedDecoItem[] = stickerBook.pages.flatMap(page => page.decoItems || [])

            console.log('[Supabase] Loaded', supabasePlacedStickers.length, 'placed stickers')
            console.log('[Supabase] Loaded', supabasePlacedDecoItems.length, 'placed deco items')

            // userDataを更新
            if (!userData) {
              userData = createInitialUserDataForTestUser(currentUser.id)
            }
            userData.pages = supabasePages
            userData.placedStickers = supabasePlacedStickers
            userData.placedDecoItems = supabasePlacedDecoItems
          } else {
            console.log('[Supabase] No sticker book found, using localStorage data')
          }

          // プロフィールもSupabaseから読み込み
          console.log('[Supabase] Loading profile from Supabase for user:', currentUser.supabaseId)
          const supabaseProfile = await profileService.getProfile(currentUser.supabaseId)
          if (supabaseProfile) {
            console.log('[Supabase] Loaded profile:', supabaseProfile.displayName, 'Exp:', supabaseProfile.totalExp, 'Avatar:', supabaseProfile.avatarUrl)
            if (!userData) {
              userData = createInitialUserDataForTestUser(currentUser.id)
            }
            // Supabaseプロフィールをローカル形式に反映
            userData.profile = {
              name: supabaseProfile.displayName || userData.profile.name,
              bio: supabaseProfile.bio || userData.profile.bio,
              totalExp: supabaseProfile.totalExp || userData.profile.totalExp,
            }
            // アバターURLも保持
            supabaseAvatarUrl = supabaseProfile.avatarUrl
          } else {
            console.log('[Supabase] No profile found, using localStorage data')
          }

          // ミステリーポストデータをSupabaseから読み込み
          console.log('[Supabase] Loading mystery post data for user:', currentUser.supabaseId)
          try {
            const [userPosts, receivedStickers, canPost] = await Promise.all([
              mysteryPostService.getUserPosts(currentUser.supabaseId),
              mysteryPostService.getReceivedStickers(currentUser.supabaseId),
              mysteryPostService.canPostToday(currentUser.supabaseId),
            ])

            if (userPosts.length > 0 || receivedStickers.length > 0) {
              console.log('[Supabase] Loaded mystery post data:', userPosts.length, 'posts,', receivedStickers.length, 'received')

              // 今日投函したシールを取得
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const todayPost = userPosts.find(p => new Date(p.postedAt) >= today)

              // pending状態のシールを取得
              const pendingPosts = userPosts.filter(p => p.status === 'pending')

              // 受け取ったシールをドメイン形式に変換
              const receivedStickersForState: ReceivedSticker[] = receivedStickers.map(r => ({
                id: r.postId,
                stickerId: r.stickerId,
                stickerName: r.stickerName,
                stickerImageUrl: r.stickerImageUrl,
                rarity: r.stickerRarity,
                message: (r.message as PresetMessage) || '大切にしてね！',
                fromUserName: r.senderName,
                receivedAt: r.deliveredAt,
                isOpened: true, // 配達済みなので開封済みとして表示
              }))

              // 状態を更新するデータを準備
              setMysteryPostState({
                todayPosted: todayPost ? {
                  id: todayPost.id,
                  stickerId: todayPost.userStickerId,
                  stickerName: todayPost.stickerName || '',
                  stickerImageUrl: todayPost.stickerImageUrl || '',
                  rarity: todayPost.stickerRarity || 1,
                  message: (todayPost.message as PresetMessage) || '大切にしてね！',
                  postedAt: todayPost.postedAt,
                  status: todayPost.status as 'pending' | 'matched' | 'delivered' | 'expired',
                } : null,
                pendingStickers: pendingPosts.map(p => ({
                  id: p.id,
                  stickerId: p.userStickerId,
                  stickerName: p.stickerName || '',
                  stickerImageUrl: p.stickerImageUrl || '',
                  rarity: p.stickerRarity || 1,
                  message: (p.message as PresetMessage) || '大切にしてね！',
                  postedAt: p.postedAt,
                  status: p.status as 'pending' | 'matched' | 'delivered' | 'expired',
                })),
                receivedStickers: receivedStickersForState,
                nextDeliveryTime: getNextDeliveryTime(),
              })
            }
          } catch (mysteryPostError) {
            console.error('[Supabase] Failed to load mystery post data:', mysteryPostError)
          }

          // スカウト設定をSupabaseから読み込み
          console.log('[Supabase] Loading scout settings for user:', currentUser.supabaseId)
          try {
            const [scoutSettings, scoutMatches] = await Promise.all([
              tradeScoutService.getSettings(currentUser.supabaseId),
              tradeScoutService.getMatches(currentUser.supabaseId),
            ])

            if (scoutSettings || scoutMatches.length > 0) {
              console.log('[Supabase] Loaded scout data:', scoutSettings ? 'settings found' : 'no settings', scoutMatches.length, 'matches')

              // スカウト設定をドメイン形式に変換
              const wantListForState: ScoutSticker[] = (scoutSettings?.wantList || []).map(w => ({
                stickerId: w.stickerId,
                stickerName: '', // 後で補完が必要
                stickerImageUrl: '',
                rarity: 1,
              }))

              const offerListForState: ScoutSticker[] = (scoutSettings?.offerList || []).map(o => ({
                stickerId: o.stickerId,
                stickerName: '',
                stickerImageUrl: '',
                rarity: 1,
              }))

              // マッチをドメイン形式に変換
              const matchesForState: ScoutMatch[] = scoutMatches.map(m => ({
                id: m.id,
                user: {
                  id: m.matchedUserId,
                  name: m.matchedUserName,
                  avatarUrl: '',
                  level: 1, // 後で補完が必要
                },
                myOffersTheyWant: [], // 詳細は後で取得
                theirOffersIWant: [],
                matchScore: m.matchScore,
                matchedAt: m.matchedAt,
                isRead: m.status !== 'found',
              }))

              setTradeScoutState({
                settings: {
                  wantList: wantListForState,
                  offerList: offerListForState,
                  isActive: scoutSettings?.isActive || false,
                  updatedAt: scoutSettings?.updatedAt || new Date().toISOString(),
                },
                matches: matchesForState,
                lastScoutedAt: null,
              })
            }
          } catch (scoutError) {
            console.error('[Supabase] Failed to load scout data:', scoutError)
          }
        } catch (error) {
          console.error('[Supabase] Failed to load from Supabase, falling back to localStorage:', error)
        }
      }

      // データがない場合は初期データを作成
      if (!userData) {
        console.log('[Persistence] No saved data for user:', currentUser.id, ', creating initial data')
        userData = createInitialUserDataForTestUser(currentUser.id)
        saveCurrentUserData(userData)
      }

      // テストモードの場合は全シール所持状態にする
      if (mode === 'test') {
        console.log('[Persistence] Test mode: using test data')
        userData = createTestModeData(allStickerIds)
      }

      // ステートを復元
      setCollection(userData.collection)
      setUserMonetization(userData.monetization)
      setPlacedStickers(userData.placedStickers)
      setPlacedDecoItems(userData.placedDecoItems)
      setPages(userData.pages)
      setCoverDesignId(userData.coverDesignId)
      setTotalExp(userData.profile.totalExp)
      setUserProfile(prev => ({
        ...prev,
        name: userData!.profile.name,
        bio: userData!.profile.bio,
        avatarUrl: supabaseAvatarUrl || prev.avatarUrl, // Supabaseからのアバター優先
        level: calculateLevel(userData!.profile.totalExp),
        exp: getCurrentLevelExp(userData!.profile.totalExp),
        expToNextLevel: getExpToNextLevel(userData!.profile.totalExp),
        title: getLevelTitle(calculateLevel(userData!.profile.totalExp)),
      }))

      setIsDataLoaded(true)
      console.log('[Data] Data loaded for user:', currentUser.id, ', collection:', userData.collection.length, 'stickers', '(source:', dataSource, ')')
    }

    loadData()
  }, [currentUser, isAuthLoading, allStickerIds])

  // タイムライン投稿をSupabaseから読み込む
  useEffect(() => {
    if (!isDataLoaded || !currentUser) return
    if (currentDataSource !== 'supabase') return

    const loadTimeline = async () => {
      console.log('[Timeline] Loading posts from Supabase for user:', currentUser.supabaseId)
      try {
        const supabasePosts = await timelineService.getPublicTimeline(currentUser.supabaseId)
        console.log('[Timeline] Loaded', supabasePosts.length, 'posts from Supabase')

        if (supabasePosts.length > 0) {
          console.log('[Timeline] First post author data:', supabasePosts[0].author)

          // 各投稿のpage_idからシール帳ページデータを取得
          const convertedPosts: Post[] = await Promise.all(supabasePosts.map(async (sp) => {
            // page_idがある場合はシール帳ページデータを取得
            let pageData: Post['pageData'] = undefined
            if (sp.page_id) {
              const pageResult = await stickerBookService.getPageById(sp.page_id)
              if (pageResult) {
                // SupabaseStickerBookPage型からPostPageData型に変換
                pageData = {
                  placedStickers: pageResult.stickers.map(s => ({
                    id: s.id,
                    stickerId: s.stickerId,
                    sticker: s.sticker,
                    pageId: s.pageId || pageResult.id,
                    x: s.x,
                    y: s.y,
                    rotation: s.rotation,
                    scale: s.scale,
                    zIndex: s.zIndex,
                    placedAt: s.placedAt || new Date().toISOString(),
                  })),
                  placedDecoItems: pageResult.decoItems?.map(d => ({
                    id: d.id,
                    decoItemId: d.decoItemId,
                    decoItem: d.decoItem,
                    pageId: d.pageId || pageResult.id,
                    x: d.x,
                    y: d.y,
                    rotation: d.rotation,
                    scale: d.scale,
                    width: d.width,
                    height: d.height,
                    zIndex: d.zIndex,
                    placedAt: d.placedAt || new Date().toISOString(),
                  })),
                }
                console.log('[Timeline] Page data loaded for post:', sp.id, 'stickers:', pageData.placedStickers.length, 'decos:', pageData.placedDecoItems?.length || 0)
              }
            }

            return {
              id: sp.id,
              userId: sp.user_id,
              // profilesテーブルのカラム名は display_name
              userName: sp.author?.display_name || sp.author?.username || 'Unknown',
              userAvatarUrl: sp.author?.avatar_url,
              pageData,
              caption: sp.caption || '',
              hashtags: sp.hashtags,
              reactions: sp.reactions?.map(r => ({
                type: r.type as ReactionType,
                count: r.count,
                isReacted: r.isReacted,
              })) || [{ type: 'heart' as ReactionType, count: 0, isReacted: false }],
              commentCount: 0, // PostWithDetailsにはcommentCountがないため固定値
              createdAt: sp.created_at,
              isFollowing: sp.isFollowing,
              visibility: sp.visibility,
            }
          })) as unknown as Post[]

          // デモ投稿とマージ（Supabase投稿を先頭に）
          setPosts(prev => {
            const demoIds = prev.map(p => p.id)
            const newPosts = convertedPosts.filter(p => !demoIds.includes(p.id))
            return [...newPosts, ...prev]
          })
        }
      } catch (error) {
        console.error('[Timeline] Failed to load posts:', error)
      }
    }

    loadTimeline()
  }, [isDataLoaded, currentDataSource, currentUser?.supabaseId])

  // データ変更時に自動保存（デバウンス）
  useEffect(() => {
    if (!isDataLoaded) return
    const timer = setTimeout(() => {
      saveData()
    }, 1000) // 1秒後に保存
    return () => clearTimeout(timer)
  }, [isDataLoaded, collection, userMonetization, placedStickers, placedDecoItems, pages, coverDesignId, totalExp, saveData])

  // 管理者モード切替
  const handleChangeAdminMode = useCallback((mode: AdminMode) => {
    saveAdminMode(mode)
    setAdminMode(mode)
    // ページを再読み込みしてデータを適用
    window.location.reload()
  }, [])

  // テストユーザー切り替え
  const handleSwitchUser = useCallback((userId: string) => {
    // 現在のデータを保存してからユーザーを切り替え
    const data = buildSavedUserData()
    saveCurrentUserData(data)

    // ユーザーを切り替え
    switchTestUser(userId)

    // ページを再読み込みして新しいユーザーのデータを適用
    window.location.reload()
  }, [buildSavedUserData])

  // 通貨付与（管理者用）
  const handleGrantCurrency = useCallback((type: 'tickets' | 'gems' | 'stars', amount: number) => {
    setUserMonetization(prev => ({
      ...prev,
      [type]: prev[type] + amount,
    }))
  }, [])

  // シール付与（管理者用）
  const handleGrantSticker = useCallback((stickerId: string, quantity: number) => {
    const newStickerIds = Array(quantity).fill(stickerId)
    const { collection: newCollection } = addStickersToCollection(collection, newStickerIds)
    setCollection(newCollection)
  }, [collection])

  // 全シール付与（管理者用）
  const handleGrantAllStickers = useCallback(() => {
    const { collection: newCollection } = addStickersToCollection(collection, allStickerIds)
    setCollection(newCollection)
  }, [collection, allStickerIds])

  // コレクションリセット（管理者用）
  const handleResetCollection = useCallback(() => {
    setCollection([])
    setPlacedStickers([])
  }, [])

  // 全データリセット（管理者用）
  const handleResetAllData = useCallback(() => {
    resetAllData()
    window.location.reload()
  }, [])

  // Handle page turn
  // 経験値獲得ハンドラー
  const gainExp = useCallback((action: ExpAction) => {
    const result = addExp(totalExp, action)
    setTotalExp(result.newTotalExp)

    // プロフィールを更新
    setUserProfile(prev => ({
      ...prev,
      level: result.newLevel,
      exp: getCurrentLevelExp(result.newTotalExp),
      expToNextLevel: getExpToNextLevel(result.newTotalExp),
      title: result.newTitle,
    }))

    // レベルアップした場合はモーダル表示
    if (result.leveledUp) {
      const rewards = getLevelUpRewards(result.newLevel)
      setLevelUpInfo({ level: result.newLevel, rewards })
      setIsLevelUpModalOpen(true)
    }

    // Supabaseモード時は経験値をSupabaseにも保存
    if (currentDataSource === 'supabase') {
      profileService.setExp(currentUser!.supabaseId, result.newTotalExp)
        .then(success => {
          if (success) {
            console.log('[Exp] Saved to Supabase:', result.newTotalExp)
          }
        })
        .catch(err => console.error('[Exp] Failed to save to Supabase:', err))
    }

    return result
  }, [totalExp, currentDataSource, currentUser?.supabaseId])

  const handlePageTurn = useCallback((pageIndex: number) => {
    setCurrentPage(pageIndex)
  }, [])

  // Handle sticker placement（ペタッエフェクト付き）
  const handlePlaceSticker = useCallback((pageId: string, x: number, y: number, rotation: number) => {
    if (!selectedSticker) return

    // 数量チェック：所持数を超えて配置できない
    const { canPlace, remainingCount } = canPlaceSticker(collection, selectedSticker.id, placedStickers)
    if (!canPlace) {
      console.warn(`Cannot place sticker: no remaining quantity for ${selectedSticker.id}`)
      setSelectedSticker(null)
      setIsDragging(false)
      return
    }

    const newPlacedSticker: PlacedSticker = {
      id: `placed-${Date.now()}`,
      stickerId: selectedSticker.id,
      sticker: selectedSticker,
      pageId,
      x,
      y,
      rotation,
      scale: 1,
      zIndex: placedStickers.length + 1,
      placedAt: new Date().toISOString(),
    }

    // ペタッエフェクトを発動
    // シールの位置を画面座標に変換
    if (bookContainerRef.current) {
      const containerRect = bookContainerRef.current.getBoundingClientRect()
      const actualBookWidth = isSpreadView ? BOOK_WIDTH * 2 : BOOK_WIDTH
      const horizontalOffset = (containerRect.width - actualBookWidth) / 2

      // 見開き時の位置計算
      let stickerScreenX: number
      const page = pages.find(p => p.id === pageId)
      if (isSpreadView && page?.side === 'right') {
        stickerScreenX = containerRect.left + horizontalOffset + BOOK_WIDTH + (x * BOOK_WIDTH)
      } else {
        stickerScreenX = containerRect.left + horizontalOffset + (x * BOOK_WIDTH)
      }
      const stickerScreenY = containerRect.top + 8 + (y * BOOK_HEIGHT)

      setPlaceEffectPosition({ x: stickerScreenX, y: stickerScreenY })
      setShowPlaceEffect(true)
    }

    setPlacedStickers(prev => [...prev, newPlacedSticker])
    setSelectedSticker(null)
    setIsDragging(false)

    // シールを貼ったら経験値獲得 (+5 EXP)
    gainExp('place_sticker')

    // Supabaseモードの場合、配置をSupabaseに同期
    if (currentDataSource === 'supabase') {
      (async () => {
        try {
          // user_sticker_idを取得
          const userStickerId = currentUser?.supabaseId ? await stickerBookService.getUserStickerId(
            currentUser.supabaseId,
            selectedSticker.id
          ) : null
          if (!userStickerId) {
            console.error('[Supabase] User sticker not found for:', selectedSticker.id)
            return
          }

          // Supabaseに配置を追加
          const placementId = await stickerBookService.addPlacement({
            pageId,
            userStickerId,
            x,
            y,
            rotation,
            scale: 1,
            zIndex: placedStickers.length + 1,
          })

          if (placementId) {
            // ローカルのplacedStickerのIDをSupabaseのIDに更新
            setPlacedStickers(prev => prev.map(s =>
              s.id === newPlacedSticker.id ? { ...s, id: placementId } : s
            ))
            console.log('[Supabase] Placement synced:', placementId)
          }
        } catch (error) {
          console.error('[Supabase] Failed to sync placement:', error)
        }
      })()
    }
  }, [selectedSticker, placedStickers, gainExp, isSpreadView, pages, collection, currentDataSource, currentUser])

  // 編集中シールのページサイド（見開き時に左右どちらか）
  const [editingStickerPageSide, setEditingStickerPageSide] = useState<'left' | 'right'>('left')

  // Handle sticker edit（ペリペリエフェクト付き）
  const handleEditSticker = useCallback((sticker: PlacedSticker) => {
    // シールがあるページのsideを判定
    const page = pages.find(p => p.id === sticker.pageId)
    setEditingStickerPageSide(page?.side || 'left')

    // ペリペリエフェクトを発動
    // シールの位置を画面座標に変換（おおよその位置）
    if (bookContainerRef.current) {
      const containerRect = bookContainerRef.current.getBoundingClientRect()
      const actualBookWidth = isSpreadView ? BOOK_WIDTH * 2 : BOOK_WIDTH
      const horizontalOffset = (containerRect.width - actualBookWidth) / 2

      let stickerScreenX: number
      if (isSpreadView && page?.side === 'right') {
        stickerScreenX = containerRect.left + horizontalOffset + BOOK_WIDTH + (sticker.x * BOOK_WIDTH)
      } else {
        stickerScreenX = containerRect.left + horizontalOffset + (sticker.x * BOOK_WIDTH)
      }
      const stickerScreenY = containerRect.top + 8 + (sticker.y * BOOK_HEIGHT)

      setPeelEffectPosition({ x: stickerScreenX, y: stickerScreenY })
      setPeelEffectImageUrl(sticker.sticker.imageUrl)
      setShowPeelEffect(true)
    }

    // 剥がし回数を記録して、粘着力メッセージを表示
    const peelCount = trackPeel(sticker.id)
    const message = getStickinessMessage(peelCount)
    if (message) {
      setStickinessMessage(message)
      // 3秒後にメッセージを消す
      setTimeout(() => setStickinessMessage(null), 3000)
    }

    setEditingSticker(sticker)
  }, [pages, isSpreadView])

  // Handle sticker update (位置のリアルタイム更新用 - 編集モードは継続)
  const handleEditingDrag = useCallback((x: number, y: number) => {
    if (!editingSticker) return
    setPlacedStickers(prev => prev.map(s =>
      s.id === editingSticker.id ? { ...s, x, y } : s
    ))
    setEditingSticker(prev => prev ? { ...prev, x, y } : null)
  }, [editingSticker])

  // Handle page side change during editing drag
  const handleEditingPageSideChange = useCallback((newSide: 'left' | 'right') => {
    if (!editingSticker) return
    setEditingStickerPageSide(newSide)

    // ページを跨いだ場合、pageIdを更新
    const currentPageData = pages[currentPage]
    let newPageId: string

    if (currentPageData?.side === 'left') {
      // 現在左ページを表示中: newSideがrightなら次のページに移動
      newPageId = newSide === 'right'
        ? (pages[currentPage + 1]?.id || currentPageData.id)
        : currentPageData.id
    } else {
      // 現在右ページを表示中: newSideがleftなら前のページに移動
      newPageId = newSide === 'left'
        ? (pages[currentPage - 1]?.id || currentPageData?.id || '')
        : (currentPageData?.id || '')
    }

    setPlacedStickers(prev => prev.map(s =>
      s.id === editingSticker.id ? { ...s, pageId: newPageId } : s
    ))
    setEditingSticker(prev => prev ? { ...prev, pageId: newPageId } : null)
  }, [editingSticker, currentPage, pages])

  // Handle sticker rotation (回転のみ更新 - 編集モード継続)
  const handleEditingRotate = useCallback((rotation: number) => {
    if (!editingSticker) return
    const updated = { ...editingSticker, rotation }
    setPlacedStickers(prev => prev.map(s => s.id === updated.id ? updated : s))
    setEditingSticker(updated)
  }, [editingSticker])

  // 編集中シールの重なり順情報を計算（デコアイテムも含めた統一レイヤー）
  const getLayerInfo = useCallback(() => {
    if (!editingSticker) return { layerPosition: 1, totalLayers: 1, isAtFront: true, isAtBack: true }

    // 同じページにあるシールとデコアイテムの両方を取得
    const samePageStickers = placedStickers.filter(s => s.pageId === editingSticker.pageId)
    const samePageDecoItems = placedDecoItems.filter(d => d.pageId === editingSticker.pageId)

    // 全アイテムをzIndex付きリストに変換
    const allItems = [
      ...samePageStickers.map(s => ({ id: s.id, zIndex: s.zIndex ?? 1 })),
      ...samePageDecoItems.map(d => ({ id: d.id, zIndex: d.zIndex ?? 1 })),
    ]

    const totalLayers = allItems.length

    if (totalLayers <= 1) {
      return { layerPosition: 1, totalLayers: 1, isAtFront: true, isAtBack: true }
    }

    // zIndexでソートして順位を取得
    const sortedByZIndex = [...allItems].sort((a, b) => a.zIndex - b.zIndex)
    const position = sortedByZIndex.findIndex(item => item.id === editingSticker.id) + 1
    const maxZIndex = Math.max(...allItems.map(item => item.zIndex))
    const minZIndex = Math.min(...allItems.map(item => item.zIndex))

    return {
      layerPosition: position,
      totalLayers,
      isAtFront: (editingSticker.zIndex ?? 1) >= maxZIndex,
      isAtBack: (editingSticker.zIndex ?? 1) <= minZIndex,
    }
  }, [editingSticker, placedStickers, placedDecoItems])

  // Handle bring to front (前面へ) - シールとデコアイテム両方を考慮
  const handleBringToFront = useCallback(() => {
    if (!editingSticker) return

    // 同じページのシールとデコアイテムの両方を取得
    const samePageStickers = placedStickers.filter(s => s.pageId === editingSticker.pageId)
    const samePageDecoItems = placedDecoItems.filter(d => d.pageId === editingSticker.pageId)

    // 全アイテムのzIndexを集める
    const allZIndexes = [
      ...samePageStickers.map(s => s.zIndex ?? 1),
      ...samePageDecoItems.map(d => d.zIndex ?? 1),
    ]
    const maxZIndex = Math.max(...allZIndexes)

    // 既に最前面なら何もしない
    if ((editingSticker.zIndex ?? 1) >= maxZIndex) return

    // 1つだけ上に移動（最前面にジャンプではなく）
    const allItems = [
      ...samePageStickers.map(s => ({ id: s.id, zIndex: s.zIndex ?? 1 })),
      ...samePageDecoItems.map(d => ({ id: d.id, zIndex: d.zIndex ?? 1 })),
    ].sort((a, b) => a.zIndex - b.zIndex)

    const currentIndex = allItems.findIndex(item => item.id === editingSticker.id)
    if (currentIndex >= allItems.length - 1) return // 既に最前面

    // 1つ上のアイテムのzIndex + 1を設定
    const newZIndex = allItems[currentIndex + 1].zIndex + 1
    const updated = { ...editingSticker, zIndex: newZIndex }
    setPlacedStickers(prev => prev.map(s => s.id === updated.id ? updated : s))
    setEditingSticker(updated)
  }, [editingSticker, placedStickers, placedDecoItems])

  // Handle send to back (後面へ) - シールとデコアイテム両方を考慮
  const handleSendToBack = useCallback(() => {
    if (!editingSticker) return

    // 同じページのシールとデコアイテムの両方を取得
    const samePageStickers = placedStickers.filter(s => s.pageId === editingSticker.pageId)
    const samePageDecoItems = placedDecoItems.filter(d => d.pageId === editingSticker.pageId)

    // 全アイテムのzIndexを集める
    const allZIndexes = [
      ...samePageStickers.map(s => s.zIndex ?? 1),
      ...samePageDecoItems.map(d => d.zIndex ?? 1),
    ]
    const minZIndex = Math.min(...allZIndexes)

    // 既に最後面なら何もしない
    if ((editingSticker.zIndex ?? 1) <= minZIndex) return

    // 1つだけ下に移動（最後面にジャンプではなく）
    const allItems = [
      ...samePageStickers.map(s => ({ id: s.id, zIndex: s.zIndex ?? 1 })),
      ...samePageDecoItems.map(d => ({ id: d.id, zIndex: d.zIndex ?? 1 })),
    ].sort((a, b) => a.zIndex - b.zIndex)

    const currentIndex = allItems.findIndex(item => item.id === editingSticker.id)
    if (currentIndex <= 0) return // 既に最後面

    // 1つ下のアイテムのzIndex - 1を設定
    const newZIndex = Math.max(0, allItems[currentIndex - 1].zIndex - 1)
    const updated = { ...editingSticker, zIndex: newZIndex }
    setPlacedStickers(prev => prev.map(s => s.id === updated.id ? updated : s))
    setEditingSticker(updated)
  }, [editingSticker, placedStickers, placedDecoItems])

  // Handle sticker update (完全な更新 - 編集モード終了)
  const handleUpdateSticker = useCallback((updated: PlacedSticker) => {
    setPlacedStickers(prev => prev.map(s => s.id === updated.id ? updated : s))
    setEditingSticker(null)

    // Supabaseモードの場合、配置をSupabaseに同期
    if (currentDataSource === 'supabase') {
      stickerBookService.updatePlacement(updated.id, {
        x: updated.x,
        y: updated.y,
        rotation: updated.rotation,
        scale: updated.scale,
        zIndex: updated.zIndex,
        pageId: updated.pageId,
      })
        .then(success => {
          if (success) {
            console.log('[Supabase] Placement updated:', updated.id)
          }
        })
        .catch(error => {
          console.error('[Supabase] Failed to update placement:', error)
        })
    }
  }, [currentDataSource])

  // Handle sticker delete
  const handleDeleteSticker = useCallback((stickerId: string) => {
    setPlacedStickers(prev => prev.filter(s => s.id !== stickerId))
    setEditingSticker(null)

    // Supabaseモードの場合、配置をSupabaseから削除
    if (currentDataSource === 'supabase') {
      stickerBookService.removePlacement(stickerId)
        .then(success => {
          if (success) {
            console.log('[Supabase] Placement deleted:', stickerId)
          }
        })
        .catch(error => {
          console.error('[Supabase] Failed to delete placement:', error)
        })
    }
  }, [currentDataSource])

  // ======================
  // デコアイテム関連ハンドラー
  // ======================

  // デコアイテム配置ハンドラー
  const handlePlaceDecoItem = useCallback(async (pageId: string, x: number, y: number, rotation: number) => {
    if (!selectedDecoItem) return

    // 現在のページにあるシールとデコアイテムの最大zIndexを取得
    const pageStickers = placedStickers.filter(s => s.pageId === pageId)
    const pageDecoItems = placedDecoItems.filter(d => d.pageId === pageId)
    const maxZIndex = Math.max(
      ...pageStickers.map(s => s.zIndex ?? 1),
      ...pageDecoItems.map(d => d.zIndex ?? 1),
      0
    )

    // 初期サイズ：baseWidth/baseHeightを使用（レースは横長、スタンプは正方形）
    const initialWidth = selectedDecoItem.baseWidth
    const initialHeight = selectedDecoItem.baseHeight
    const newZIndex = maxZIndex + 1
    const placedAt = new Date().toISOString()
    const actualRotation = selectedDecoItem.rotatable ? rotation : 0

    // Supabaseに保存を試みる
    let placementId = `deco-${Date.now()}`
    try {
      const supabaseId = await stickerBookService.addDecoPlacement({
        pageId,
        decoItemId: selectedDecoItem.id,
        x,
        y,
        rotation: actualRotation,
        width: initialWidth,
        height: initialHeight,
        zIndex: newZIndex,
      })
      if (supabaseId) {
        placementId = supabaseId
        console.log('[Deco] Saved to Supabase:', supabaseId)
      }
    } catch (err) {
      console.warn('[Deco] Failed to save to Supabase (table may not exist yet):', err)
    }

    const newDecoItem: PlacedDecoItem = {
      id: placementId,
      decoItemId: selectedDecoItem.id,
      decoItem: selectedDecoItem,
      pageId,
      x,
      y,
      rotation: actualRotation,
      scale: 1,
      width: initialWidth,
      height: initialHeight,
      zIndex: newZIndex,
      placedAt,
    }

    setPlacedDecoItems(prev => [...prev, newDecoItem])
    setSelectedDecoItem(null)

    // 配置後すぐに編集モードに入る
    const page = pages.find(p => p.id === pageId)
    setEditingDecoItemPageSide(page?.side || 'left')
    setEditingDecoItem(newDecoItem)

    // エフェクト発動（ペタッ音）
    if (bookContainerRef.current) {
      const containerRect = bookContainerRef.current.getBoundingClientRect()
      const actualBookWidth = isSpreadView ? BOOK_WIDTH * 2 : BOOK_WIDTH
      const horizontalOffset = (containerRect.width - actualBookWidth) / 2
      const page = pages.find(p => p.id === pageId)

      let screenX: number
      if (isSpreadView && page?.side === 'right') {
        screenX = containerRect.left + horizontalOffset + BOOK_WIDTH + (x * BOOK_WIDTH)
      } else {
        screenX = containerRect.left + horizontalOffset + (x * BOOK_WIDTH)
      }
      const screenY = containerRect.top + 8 + (y * BOOK_HEIGHT)

      setPlaceEffectPosition({ x: screenX, y: screenY })
      setShowPlaceEffect(true)
    }
  }, [selectedDecoItem, placedStickers, placedDecoItems, isSpreadView, pages])

  // デコアイテム削除ハンドラー
  const handleDeleteDecoItem = useCallback(async (decoItemId: string) => {
    // Supabaseから削除を試みる（UUIDの場合のみ）
    if (decoItemId && !decoItemId.startsWith('deco-')) {
      try {
        await stickerBookService.removeDecoPlacement(decoItemId)
        console.log('[Deco] Deleted from Supabase:', decoItemId)
      } catch (err) {
        console.warn('[Deco] Failed to delete from Supabase:', err)
      }
    }
    setPlacedDecoItems(prev => prev.filter(d => d.id !== decoItemId))
    setEditingDecoItem(null)
  }, [])

  // 編集中デコアイテムのページサイド（見開き時に左右どちらか）
  const [editingDecoItemPageSide, setEditingDecoItemPageSide] = useState<'left' | 'right'>('left')

  // デコアイテム編集開始ハンドラー（長押しで呼ばれる）
  const handleEditDecoItem = useCallback((decoItem: PlacedDecoItem) => {
    // デコアイテムがあるページのsideを判定
    const page = pages.find(p => p.id === decoItem.pageId)
    setEditingDecoItemPageSide(page?.side || 'left')
    setEditingDecoItem(decoItem)
  }, [pages])

  // デコアイテム位置更新ハンドラー（ドラッグ中）
  const handleEditingDecoDrag = useCallback((x: number, y: number) => {
    if (!editingDecoItem) return
    setPlacedDecoItems(prev => prev.map(d =>
      d.id === editingDecoItem.id ? { ...d, x, y } : d
    ))
    setEditingDecoItem(prev => prev ? { ...prev, x, y } : null)
  }, [editingDecoItem])

  // デコアイテムサイズ更新ハンドラー（リサイズ中）
  const handleEditingDecoResize = useCallback((width: number, height: number) => {
    if (!editingDecoItem) return
    setPlacedDecoItems(prev => prev.map(d =>
      d.id === editingDecoItem.id ? { ...d, width, height } : d
    ))
    setEditingDecoItem(prev => prev ? { ...prev, width, height } : null)
  }, [editingDecoItem])

  // デコアイテムページ移動ハンドラー（見開き時に左右を跨いだ場合）
  const handleEditingDecoPageSideChange = useCallback((newSide: 'left' | 'right') => {
    if (!editingDecoItem) return
    setEditingDecoItemPageSide(newSide)

    // ページを跨いだ場合、pageIdを更新
    const currentPageData = pages[currentPage]
    let newPageId: string

    if (currentPageData?.side === 'left') {
      newPageId = newSide === 'right'
        ? (pages[currentPage + 1]?.id || currentPageData.id)
        : currentPageData.id
    } else {
      newPageId = newSide === 'left'
        ? (pages[currentPage - 1]?.id || currentPageData?.id || '')
        : (currentPageData?.id || '')
    }

    setPlacedDecoItems(prev => prev.map(d =>
      d.id === editingDecoItem.id ? { ...d, pageId: newPageId } : d
    ))
    setEditingDecoItem(prev => prev ? { ...prev, pageId: newPageId } : null)
  }, [editingDecoItem, currentPage, pages])

  // デコアイテム回転更新ハンドラー（回転ハンドル操作中）
  const handleEditingDecoRotate = useCallback((rotation: number) => {
    if (!editingDecoItem) return
    setPlacedDecoItems(prev => prev.map(d =>
      d.id === editingDecoItem.id ? { ...d, rotation } : d
    ))
    setEditingDecoItem(prev => prev ? { ...prev, rotation } : null)
  }, [editingDecoItem])

  // デコアイテム更新ハンドラー（編集完了時にSupabaseに保存）
  const handleUpdateDecoItem = useCallback((updated: PlacedDecoItem) => {
    setPlacedDecoItems(prev => prev.map(d => d.id === updated.id ? updated : d))
    setEditingDecoItem(null)

    // Supabaseに同期（UUIDの場合のみ）
    if (updated.id && !updated.id.startsWith('deco-')) {
      stickerBookService.updateDecoPlacement(updated.id, {
        x: updated.x,
        y: updated.y,
        rotation: updated.rotation,
        width: updated.width,
        height: updated.height,
        zIndex: updated.zIndex,
        pageId: updated.pageId,
      })
        .then(success => {
          if (success) {
            console.log('[Deco] Updated in Supabase:', updated.id)
          }
        })
        .catch(error => {
          console.error('[Deco] Failed to update in Supabase:', error)
        })
    }
  }, [])

  // ======================
  // 統合レイヤー制御ハンドラー
  // ======================

  // 現在のページのレイヤーアイテム一覧を計算
  const currentPageLayerItems = useMemo((): LayerItem[] => {
    // 現在表示中のページIDを取得
    const currentPageData = pages[currentPage]
    if (!currentPageData) return []

    // 見開き表示の場合は両方のページを含める
    const pageIds = isSpreadView
      ? [currentPageData.id, pages[currentPage + 1]?.id].filter(Boolean)
      : [currentPageData.id]

    // シールをレイヤーアイテムに変換
    const stickerItems: LayerItem[] = placedStickers
      .filter(s => pageIds.includes(s.pageId))
      .map(s => ({
        id: s.id,
        type: 'sticker' as const,
        name: s.sticker.name,
        imageUrl: s.sticker.imageUrl,
        zIndex: s.zIndex ?? 1,
      }))

    // デコアイテムをレイヤーアイテムに変換
    const decoItems: LayerItem[] = placedDecoItems
      .filter(d => pageIds.includes(d.pageId))
      .map(d => ({
        id: d.id,
        type: 'deco' as const,
        name: d.decoItem.name,
        imageUrl: d.decoItem.imageUrl,
        zIndex: d.zIndex ?? 1,
      }))

    return [...stickerItems, ...decoItems]
  }, [pages, currentPage, isSpreadView, placedStickers, placedDecoItems])

  // レイヤー順変更ハンドラー（隣のアイテムとzIndexを入れ替える方式）
  const handleChangeLayerZIndex = useCallback((itemId: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    // 全アイテムの現在のzIndex一覧
    const allItems = currentPageLayerItems
    const currentItem = allItems.find(i => i.id === itemId)
    if (!currentItem) return

    const sortedItems = [...allItems].sort((a, b) => a.zIndex - b.zIndex)
    const currentIndex = sortedItems.findIndex(i => i.id === itemId)

    // アイテムのzIndexを更新するヘルパー関数
    const updateItemZIndex = (id: string, newZIndex: number) => {
      const isSticker = placedStickers.some(s => s.id === id)
      if (isSticker) {
        setPlacedStickers(prev => prev.map(s =>
          s.id === id ? { ...s, zIndex: newZIndex } : s
        ))
        if (editingSticker?.id === id) {
          setEditingSticker(prev => prev ? { ...prev, zIndex: newZIndex } : null)
        }
      } else {
        setPlacedDecoItems(prev => prev.map(d =>
          d.id === id ? { ...d, zIndex: newZIndex } : d
        ))
        if (editingDecoItem?.id === id) {
          setEditingDecoItem(prev => prev ? { ...prev, zIndex: newZIndex } : null)
        }
      }
    }

    switch (direction) {
      case 'top': {
        // 最前面へ: 全アイテムのzIndexを順に振り直し、対象を最大に
        const maxZIndex = Math.max(...allItems.map(i => i.zIndex))
        if (currentItem.zIndex >= maxZIndex) return // 既に最前面
        updateItemZIndex(itemId, maxZIndex + 1)
        break
      }
      case 'bottom': {
        // 最後面へ: 対象を最小に
        const minZIndex = Math.min(...allItems.map(i => i.zIndex))
        if (currentItem.zIndex <= minZIndex) return // 既に最後面
        updateItemZIndex(itemId, Math.max(0, minZIndex - 1))
        break
      }
      case 'up': {
        // 1つ前面へ: 隣のアイテムとzIndexを入れ替え
        if (currentIndex >= sortedItems.length - 1) return // 既に最前面
        const targetItem = sortedItems[currentIndex + 1]
        const currentZ = currentItem.zIndex
        const targetZ = targetItem.zIndex
        // zIndexが同じ場合は、currentを+1にして確実に前に出す
        if (currentZ === targetZ) {
          updateItemZIndex(itemId, targetZ + 1)
        } else {
          // zIndexを入れ替え
          updateItemZIndex(itemId, targetZ)
          updateItemZIndex(targetItem.id, currentZ)
        }
        break
      }
      case 'down': {
        // 1つ後面へ: 隣のアイテムとzIndexを入れ替え
        if (currentIndex <= 0) return // 既に最後面
        const targetItem = sortedItems[currentIndex - 1]
        const currentZ = currentItem.zIndex
        const targetZ = targetItem.zIndex
        // zIndexが同じ場合は、currentを-1にして確実に後ろに出す
        if (currentZ === targetZ) {
          updateItemZIndex(itemId, Math.max(0, targetZ - 1))
        } else {
          // zIndexを入れ替え
          updateItemZIndex(itemId, targetZ)
          updateItemZIndex(targetItem.id, currentZ)
        }
        break
      }
    }
  }, [placedStickers, placedDecoItems, currentPageLayerItems, editingSticker, editingDecoItem])

  // レイヤーパネルを開く時にzIndexを正規化（連番に振り直し）
  const handleOpenLayerPanel = useCallback(() => {
    // 現在のページのアイテムをzIndex順でソート
    const allItems = currentPageLayerItems
    if (allItems.length === 0) {
      setIsLayerPanelOpen(true)
      return
    }

    const sortedItems = [...allItems].sort((a, b) => a.zIndex - b.zIndex)

    // 連番に振り直し（0, 1, 2, 3, ...）
    sortedItems.forEach((item, index) => {
      const newZIndex = index + 1 // 1から開始
      if (item.zIndex !== newZIndex) {
        const isSticker = placedStickers.some(s => s.id === item.id)
        if (isSticker) {
          setPlacedStickers(prev => prev.map(s =>
            s.id === item.id ? { ...s, zIndex: newZIndex } : s
          ))
        } else {
          setPlacedDecoItems(prev => prev.map(d =>
            d.id === item.id ? { ...d, zIndex: newZIndex } : d
          ))
        }
      }
    })

    setIsLayerPanelOpen(true)
  }, [currentPageLayerItems, placedStickers])

  // Handle matching - Supabase連携対応
  const handleStartMatching = useCallback(async () => {
    if (dataSource === 'supabase') {
      // Supabase: 実際のマッチング
      setMatchingStatus('searching')
      console.log('[Trade] Starting Supabase matching for user:', currentUser?.name)

      // 1. まず待機中の交換を最新取得
      await supabaseTradeActions.refreshWaitingTrades()

      // 少し待ってから状態を確認（非同期更新のため）
      await new Promise(resolve => setTimeout(resolve, 500))

      // 2. 待機中の交換があるかチェック（直接DBから取得）
      if (!currentUser?.supabaseId) return
      const { tradeService } = await import('@/services/trades')
      const waitingTrades = await tradeService.findWaitingTrades(currentUser.supabaseId)
      console.log('[Trade] Found waiting trades:', waitingTrades.length)

      if (waitingTrades.length > 0) {
        // 相手の交換が見つかった！
        const waitingTrade = waitingTrades[0]
        // プロフィールサービスで相手の情報を取得
        const partnerProfile = await profileService.getProfile(waitingTrade.user1_id)
        const partnerName = partnerProfile?.displayName || '交換相手'
        console.log('[Trade] Found partner:', partnerName, 'Trade ID:', waitingTrade.id, 'Created:', waitingTrade.created_at)

        setMatchingStatus('found')
        setMatchedUser({
          id: waitingTrade.id, // 交換IDを使用
          name: partnerName,
          avatarUrl: partnerProfile?.avatarUrl || undefined,
          level: 1,
        })
        return
      }

      // 3. 見つからなかった場合、自分の交換を作成して待機
      console.log('[Trade] No waiting trades found, creating new trade...')
      await supabaseTradeActions.startMatching()
      // searching状態のまま待機（Realtimeで相手を待つ）

    } else {
      // ローカル: シミュレーション（Supabase未接続時のフォールバック）
      console.log('[Trade] Using local simulation (no Supabase)')
      setMatchingStatus('searching')
      setTimeout(() => {
        setMatchingStatus('found')
        setMatchedUser({
          id: 'matched-user-1',
          name: 'RandomPlayer',
          avatarUrl: undefined,
          level: 8,
        })
      }, 2000 + Math.random() * 1000)
    }
  }, [dataSource, supabaseTradeActions, currentUser])

  const handleCancelMatching = useCallback(async () => {
    if (dataSource === 'supabase') {
      await supabaseTradeActions.cancelMatching()
    }
    setMatchingStatus('idle')
    setMatchedUser(null)
  }, [dataSource, supabaseTradeActions])

  const handleAcceptMatch = useCallback(async () => {
    if (!matchedUser) return

    if (dataSource === 'supabase') {
      // Supabase: 実際に交換に参加
      console.log('[Trade] Accepting match, joining trade:', matchedUser.id)
      try {
        await supabaseTradeActions.joinTrade(matchedUser.id)

        // 相手ユーザー情報を設定
        setTradePartner({
          id: matchedUser.id,
          name: matchedUser.name,
          avatarUrl: matchedUser.avatarUrl,
          level: matchedUser.level ?? 1,
        })
        setMatchingStatus('idle')
        setIsTradeSessionOpen(true)
      } catch (e) {
        console.error('[Trade] Failed to join trade:', e)
        // エラーの場合は検索画面に戻す
        setMatchingStatus('searching')
        setMatchedUser(null)
      }
    } else {
      // ローカル: シミュレーション
      setTradePartner({
        id: matchedUser.id,
        name: matchedUser.name,
        avatarUrl: matchedUser.avatarUrl,
        level: matchedUser.level ?? 1,
      })
      setMatchingStatus('idle')
      setIsTradeSessionOpen(true)
    }
  }, [matchedUser, dataSource, supabaseTradeActions])

  // ミステリーポスト ハンドラー
  const handlePostSticker = useCallback(async (stickerId: string, message: PresetMessage) => {
    const sticker = collectionStickers.find(s => s.id === stickerId)
    if (!sticker) return

    const newPosted: PostedSticker = {
      id: `posted-${Date.now()}`,
      stickerId: sticker.id,
      stickerName: sticker.name,
      stickerImageUrl: sticker.imageUrl || '',
      rarity: sticker.rarity,
      message,
      postedAt: new Date().toISOString(),
      status: 'pending',
    }

    setMysteryPostState(prev => ({
      ...prev,
      todayPosted: newPosted,
      pendingStickers: [...prev.pendingStickers, newPosted],
      nextDeliveryTime: getNextDeliveryTime(),
    }))

    // Supabaseモードの場合、DBにも保存
    if (currentDataSource === 'supabase') {
      // stickerId を使って user_stickers テーブルから該当シールを探す必要がある
      // ここでは stickerId をそのまま渡す（サービス側で解決）
      if (!currentUser?.supabaseId) return
      mysteryPostService.postSticker(currentUser.supabaseId, stickerId, message)
        .then(async result => {
          if (result.success) {
            console.log('[MysteryPost] Posted to Supabase:', result.postId)
            // IDをSupabaseのIDに更新
            if (result.postId) {
              setMysteryPostState(prev => ({
                ...prev,
                todayPosted: prev.todayPosted ? { ...prev.todayPosted, id: result.postId! } : null,
                pendingStickers: prev.pendingStickers.map(p =>
                  p.id === newPosted.id ? { ...p, id: result.postId! } : p
                ),
              }))
            }

            // ポスト成功後、マッチングと配達を実行
            try {
              console.log('[MysteryPost] Running matching...')
              await mysteryPostService.runMatching()
              console.log('[MysteryPost] Running delivery...')
              await mysteryPostService.runDelivery()
              console.log('[MysteryPost] Matching and delivery completed')

              // 受信したシールを再取得して更新
              const receivedStickers = await mysteryPostService.getReceivedStickers(currentUser.supabaseId)
              setMysteryPostState(prev => ({
                ...prev,
                receivedStickers: receivedStickers.map(rs => ({
                  id: rs.id,
                  stickerId: rs.stickerId,
                  stickerName: rs.stickerName,
                  stickerImageUrl: rs.stickerImageUrl,
                  rarity: rs.rarity,
                  message: rs.message,
                  receivedAt: rs.receivedAt,
                  opened: rs.opened,
                })),
              }))
            } catch (error) {
              console.error('[MysteryPost] Failed to run matching/delivery:', error)
            }
          } else {
            console.error('[MysteryPost] Failed to post to Supabase:', result.error)
          }
        })
    }

    // 投函したら経験値獲得
    gainExp('place_sticker')
  }, [gainExp, currentDataSource, currentUser, collectionStickers])

  const handleOpenReceivedSticker = useCallback((sticker: ReceivedSticker) => {
    setSelectedReceivedSticker(sticker)
    setIsReceivedStickerModalOpen(true)
  }, [])

  const handleStickerOpened = useCallback((stickerId: string) => {
    setMysteryPostState(prev => ({
      ...prev,
      receivedStickers: prev.receivedStickers.map(s =>
        s.id === stickerId ? { ...s, isOpened: true } : s
      ),
    }))
    // 開封したら経験値獲得
    gainExp('place_sticker')
  }, [gainExp])

  const handleCancelPost = useCallback((postId: string) => {
    setMysteryPostState(prev => ({
      ...prev,
      pendingStickers: prev.pendingStickers.filter(s => s.id !== postId),
      todayPosted: prev.todayPosted?.id === postId ? null : prev.todayPosted,
    }))
  }, [])

  // Trade Scout handlers
  const handleToggleScoutActive = useCallback((active: boolean) => {
    setTradeScoutState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        isActive: active,
        updatedAt: new Date().toISOString(),
      },
    }))

    // Supabaseモードの場合、DBにも保存
    if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
      tradeScoutService.setActive(currentUser.supabaseId, active)
        .then(success => {
          if (success) {
            console.log('[TradeScout] Saved active state to Supabase:', active)
          } else {
            console.error('[TradeScout] Failed to save active state to Supabase')
          }
        })
    }
  }, [currentDataSource, currentUser])

  const handleSaveWantList = useCallback((stickers: ScoutSticker[]) => {
    setTradeScoutState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        wantList: stickers,
        updatedAt: new Date().toISOString(),
      },
    }))

    // Supabaseモードの場合、DBにも保存
    if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
      const wantListData = stickers.map(s => ({ stickerId: s.stickerId, priority: 1 }))
      tradeScoutService.updateWantList(currentUser.supabaseId, wantListData)
        .then(async success => {
          if (success) {
            console.log('[TradeScout] Saved want list to Supabase:', stickers.length, 'items')

            // リスト更新後、マッチング検索を実行
            try {
              console.log('[TradeScout] Running matching...')
              const matches = await tradeScoutService.findMatches(currentUser.supabaseId)
              console.log('[TradeScout] Found', matches.length, 'matches')

              // マッチ結果をstateに反映
              setTradeScoutState(prev => ({
                ...prev,
                matches: matches.map(m => ({
                  id: m.id,
                  user: {
                    id: m.matchedUserId,
                    name: m.matchedUserName,
                    avatarUrl: '',
                    level: 1,
                  },
                  myOffersTheyWant: m.offersMatched.map(sid => {
                    const sticker = demoStickers.find(s => s.id === sid)
                    return {
                      stickerId: sid,
                      stickerName: sticker?.name || 'Unknown',
                      stickerImageUrl: sticker?.imageUrl || '',
                      rarity: sticker?.rarity || 1,
                    }
                  }),
                  theirOffersIWant: m.wantsMatched.map(sid => {
                    const sticker = demoStickers.find(s => s.id === sid)
                    return {
                      stickerId: sid,
                      stickerName: sticker?.name || 'Unknown',
                      stickerImageUrl: sticker?.imageUrl || '',
                      rarity: sticker?.rarity || 1,
                    }
                  }),
                  matchScore: m.matchScore,
                  matchedAt: m.matchedAt,
                  isRead: m.status === 'viewed',
                })),
              }))
            } catch (error) {
              console.error('[TradeScout] Failed to find matches:', error)
            }
          } else {
            console.error('[TradeScout] Failed to save want list to Supabase')
          }
        })
    }
  }, [currentDataSource, currentUser])

  const handleSaveOfferList = useCallback((stickers: ScoutSticker[]) => {
    setTradeScoutState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        offerList: stickers,
        updatedAt: new Date().toISOString(),
      },
    }))

    // Supabaseモードの場合、DBにも保存
    if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
      const offerListData = stickers.map(s => ({ stickerId: s.stickerId }))
      tradeScoutService.updateOfferList(currentUser.supabaseId, offerListData)
        .then(async success => {
          if (success) {
            console.log('[TradeScout] Saved offer list to Supabase:', stickers.length, 'items')

            // リスト更新後、マッチング検索を実行
            try {
              console.log('[TradeScout] Running matching...')
              const matches = await tradeScoutService.findMatches(currentUser.supabaseId)
              console.log('[TradeScout] Found', matches.length, 'matches')

              // マッチ結果をstateに反映
              setTradeScoutState(prev => ({
                ...prev,
                matches: matches.map(m => ({
                  id: m.id,
                  user: {
                    id: m.matchedUserId,
                    name: m.matchedUserName,
                    avatarUrl: '',
                    level: 1,
                  },
                  myOffersTheyWant: m.offersMatched.map(sid => {
                    const sticker = demoStickers.find(s => s.id === sid)
                    return {
                      stickerId: sid,
                      stickerName: sticker?.name || 'Unknown',
                      stickerImageUrl: sticker?.imageUrl || '',
                      rarity: sticker?.rarity || 1,
                    }
                  }),
                  theirOffersIWant: m.wantsMatched.map(sid => {
                    const sticker = demoStickers.find(s => s.id === sid)
                    return {
                      stickerId: sid,
                      stickerName: sticker?.name || 'Unknown',
                      stickerImageUrl: sticker?.imageUrl || '',
                      rarity: sticker?.rarity || 1,
                    }
                  }),
                  matchScore: m.matchScore,
                  matchedAt: m.matchedAt,
                  isRead: m.status === 'viewed',
                })),
              }))
            } catch (error) {
              console.error('[TradeScout] Failed to find matches:', error)
            }
          } else {
            console.error('[TradeScout] Failed to save offer list to Supabase')
          }
        })
    }
  }, [currentDataSource, currentUser])

  const handleViewScoutMatch = useCallback((match: ScoutMatch) => {
    setSelectedScoutMatch(match)
    setIsMatchDetailModalOpen(true)
    // 既読にする
    setTradeScoutState(prev => ({
      ...prev,
      matches: prev.matches.map(m =>
        m.id === match.id ? { ...m, isRead: true } : m
      ),
    }))

    // Supabaseモードの場合、DBも更新
    if (currentDataSource === 'supabase' && !match.isRead) {
      tradeScoutService.updateMatchStatus(match.id, 'viewed')
        .then(success => {
          if (success) {
            console.log('[TradeScout] Match marked as viewed in Supabase:', match.id)
          }
        })
    }
  }, [currentDataSource])

  const handleStartTradeFromScout = useCallback((match: ScoutMatch) => {
    // マッチしたユーザーとトレードを開始
    setTradePartner({
      id: match.user.id,
      name: match.user.name,
      avatarUrl: match.user.avatarUrl,
      level: match.user.level,
    })
    setIsTradeSessionOpen(true)
    setIsMatchDetailModalOpen(false)

    // Supabaseモードの場合、マッチのステータスを更新
    if (currentDataSource === 'supabase') {
      tradeScoutService.updateMatchStatus(match.id, 'trade_started')
        .then(success => {
          if (success) {
            console.log('[TradeScout] Match marked as trade_started in Supabase:', match.id)
          }
        })
    }
  }, [currentDataSource])

  // Handle gacha
  // 重み付きランダム抽選関数
  const weightedRandomPull = useCallback(() => {
    // gachaWeight を使用して重み付きランダム抽選
    // gachaWeight が低いほどレア（★5 = 1, ★1 = 55）
    const totalWeight = demoStickers.reduce((sum, s) => sum + (s.gachaWeight || 1), 0)
    let random = Math.random() * totalWeight

    for (const sticker of demoStickers) {
      random -= (sticker.gachaWeight || 1)
      if (random <= 0) {
        return sticker
      }
    }
    // フォールバック
    return demoStickers[demoStickers.length - 1]
  }, [])

  const handlePullGacha = useCallback((bannerId: string, count: number) => {
    // 現在の所持状況を取得（isNew判定用）
    const collectionMap = new Map(collection.map(c => [c.stickerId, c]))

    const results: GachaResultSticker[] = []
    const pulledStickerIds: string[] = []

    for (let i = 0; i < count; i++) {
      // 重み付きランダム抽選を使用
      const randomSticker = weightedRandomPull()
      pulledStickerIds.push(randomSticker.id)

      // isNew: まだ1枚も持っていないシールの場合はtrue
      // ただし、今回のガチャで既に引いた場合は最初の1枚のみnew
      const existingInCollection = collectionMap.get(randomSticker.id)
      const alreadyPulledInThisGacha = pulledStickerIds.filter(id => id === randomSticker.id).length > 1
      const isNew = !existingInCollection && !alreadyPulledInThisGacha

      results.push({
        id: randomSticker.id,
        name: randomSticker.name,
        imageUrl: randomSticker.imageUrl,
        rarity: randomSticker.rarity as 1 | 2 | 3 | 4 | 5,
        type: randomSticker.type,
        isNew,
      })
    }

    setGachaResults(results)
    setLastGachaPull({ bannerId, count }) // 前回のガチャ設定を保存
    setIsGachaResultModalOpen(true)

    // コレクションにシールを追加（ローカル）
    const { collection: newCollection, newStickers } = addStickersToCollection(collection, pulledStickerIds)
    setCollection(newCollection)
    console.log('[Gacha] Added stickers to collection:', pulledStickerIds.length, 'total, new:', newStickers.length)

    // Supabaseにも保存（本番環境モード時）
    if (currentDataSource === 'supabase' && currentUser?.id) {
      console.log('[Gacha] Saving to Supabase for user:', currentUser.id)
      addStickersToSupabase(currentUser.id, pulledStickerIds).then(result => {
        console.log('[Gacha] Supabase save result:', result)
        if (!result.success) {
          console.error('[Gacha] Failed to save to Supabase')
        }
      }).catch(error => {
        console.error('[Gacha] Supabase save error:', error)
      })
    }

    // Deduct currency
    const banner = demoBanners.find(b => b.id === bannerId)
    if (banner) {
      const cost = count === 1 ? banner.costSingle : banner.costMulti
      if (banner.currency === 'ticket') {
        setUserMonetization(prev => ({ ...prev, tickets: Math.max(0, prev.tickets - cost) }))
      } else if (banner.currency === 'star') {
        setUserMonetization(prev => ({ ...prev, stars: Math.max(0, prev.stars - cost) }))
      } else if (banner.currency === 'gem') {
        setUserMonetization(prev => ({ ...prev, gems: Math.max(0, prev.gems - cost) }))
      }
    }

    // 経験値獲得（1回引く: +10 EXP, 10連: +100 EXP）
    gainExp(count === 1 ? 'gacha_single' : 'gacha_ten')
  }, [gainExp, collection, currentDataSource, currentUser])

  // Handle reactions
  const handleReaction = useCallback((postId: string, reactionType: ReactionType) => {
    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post
      const newReactions = post.reactions.map(r => {
        if (r.type === reactionType) {
          // Toggle reaction
          if (r.isReacted) {
            return { ...r, count: Math.max(0, r.count - 1), isReacted: false }
          } else {
            return { ...r, count: r.count + 1, isReacted: true }
          }
        }
        return r
      })
      return { ...post, reactions: newReactions }
    }))
  }, [])

  // Handle report
  const handleReport = useCallback((input: CreateReportInput) => {
    console.log('Report submitted:', input)
    setIsReportModalOpen(false)
    setReportTarget(null)
  }, [])

  // Handle block
  const handleBlock = useCallback((input: CreateBlockInput) => {
    console.log('Block submitted:', input)
    setIsBlockModalOpen(false)
    setBlockTarget(null)
  }, [])

  // ==================== Shop Handlers ====================
  // Open shop
  const handleOpenShop = useCallback(() => {
    setIsShopOpen(true)
  }, [])

  // Close shop
  const handleCloseShop = useCallback(() => {
    setIsShopOpen(false)
  }, [])

  // Handle insufficient funds - show modal with options
  const handleInsufficientFunds = useCallback((fundType: 'tickets' | 'stars', required: number, current: number) => {
    setInsufficientFundsModal({
      isOpen: true,
      fundType,
      required,
      current,
    })
  }, [])

  // Close insufficient funds modal
  const handleCloseInsufficientFunds = useCallback(() => {
    setInsufficientFundsModal(prev => ({ ...prev, isOpen: false }))
  }, [])

  // Watch ad for ticket
  const handleWatchAd = useCallback(() => {
    setUserMonetization(prev => {
      const result = watchAdForTicket(prev)
      return result ?? prev
    })
    setIsAdRewardModalOpen(false)
    handleCloseInsufficientFunds()
  }, [handleCloseInsufficientFunds])

  // Open ad reward modal
  const handleOpenAdReward = useCallback(() => {
    setIsAdRewardModalOpen(true)
    handleCloseInsufficientFunds()
  }, [handleCloseInsufficientFunds])

  // Purchase stars
  const handlePurchaseStars = useCallback((packId: string) => {
    setUserMonetization(prev => {
      const result = purchaseStars(prev, packId)
      return result ?? prev
    })
    handleCloseInsufficientFunds()
  }, [handleCloseInsufficientFunds])

  // Subscribe
  const handleSubscribe = useCallback((tier: SubscriptionTier) => {
    setUserMonetization(prev => ({
      ...prev,
      subscription: tier,
    }))
    handleCloseInsufficientFunds()
    setIsShopOpen(false)
  }, [handleCloseInsufficientFunds])

  // Open shop from insufficient funds modal
  const handleGoToShop = useCallback(() => {
    handleCloseInsufficientFunds()
    setIsShopOpen(true)
  }, [handleCloseInsufficientFunds])

  // Check and collect daily bonus on mount
  useEffect(() => {
    if (needsDailyReset(userMonetization.lastDailyReset)) {
      // Calculate bonus amounts
      const plan = userMonetization.subscription === 'none'
        ? { dailyBonusTickets: 0, skipAds: false, dailyStars: 0 }
        : { dailyBonusTickets: 2, skipAds: userMonetization.subscription !== 'light', dailyStars: userMonetization.subscription === 'light' ? 5 : userMonetization.subscription === 'plus' ? 15 : 30 }

      const baseTickets = 3 // DAILY_FREE_TICKETS
      const adSkipTickets = plan.skipAds ? 10 : 0 // MAX_AD_WATCHES_PER_DAY
      const totalTickets = baseTickets + plan.dailyBonusTickets + adSkipTickets
      const totalStars = plan.dailyStars

      // Apply daily reset and collect bonuses
      setUserMonetization(prev => {
        let state: UserMonetization = { ...prev, lastDailyReset: new Date().toISOString().split('T')[0], dailyTicketsCollected: false, dailyStarsCollected: false, completedMissions: [] as string[], adsWatchedToday: 0 }
        state = collectDailyTickets(state)
        state = collectDailyStars(state)
        return state
      })

      setDailyBonusReceived({
        tickets: totalTickets,
        stars: totalStars,
      })
      setIsDailyBonusModalOpen(true)
    }
  }, []) // Run only once on mount

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        // 現在のページが裏表紙かどうかを判定
        const isBackCover = pages[currentPage]?.type === 'back-cover'
        // シール操作中かどうか（貼り付け中または編集中）
        const isStickerOperating = (selectedSticker && isDragging) || editingSticker
        // デコ編集中かどうか
        const isDecoEditing = !!editingDecoItem
        // UIを隠すべきかどうか（モーダル表示中またはシール操作中またはデコ編集中またはレイヤーパネル表示中）
        const shouldHideUI = isPageEditModalOpen || isStickerOperating || isDecoEditing || isLayerPanelOpen

        return (
          <div className="flex flex-col h-full relative">
            {/* 横スクロール可能なコンテナ - 裏表紙の場合はスクロール無効 */}
            <div
              ref={scrollContainerRef}
              className={`flex-1 relative ${isBackCover ? 'overflow-hidden' : 'overflow-x-auto overflow-y-hidden'}`}
              style={{
                WebkitOverflowScrolling: isBackCover ? 'auto' : 'touch',
                scrollbarWidth: isBackCover ? 'none' : 'thin',
              }}
            >
              <div
                ref={bookContainerRef}
                className={`flex justify-center items-start pt-4 ${isBackCover ? 'w-full' : 'min-w-max'}`}
                style={{
                  // シール帳の左右に5pxのパディング
                  paddingLeft: '5px',
                  paddingRight: '5px',
                  // デコ選択中はカーソルを変更
                  cursor: selectedDecoItem ? 'copy' : 'default',
                }}
                onClick={(e) => {
                  // デコアイテムが選択されている場合、クリック位置に配置
                  if (!selectedDecoItem) return

                  const containerRect = bookContainerRef.current?.getBoundingClientRect()
                  if (!containerRect) return

                  // 本の実際の領域を計算
                  const actualBookWidth = isSpreadView ? BOOK_WIDTH * 2 : BOOK_WIDTH
                  const horizontalOffset = (containerRect.width - actualBookWidth) / 2
                  const topOffset = 16 // pt-4 = 16px

                  // クリック位置を本内の相対座標に変換
                  const clickX = e.clientX - containerRect.left - horizontalOffset
                  const clickY = e.clientY - containerRect.top - topOffset

                  // 本の範囲外なら無視
                  if (clickX < 0 || clickX > actualBookWidth || clickY < 0 || clickY > BOOK_HEIGHT) {
                    return
                  }

                  // 相対座標に変換 (0-1)
                  let relativeX: number
                  let pageId: string
                  const currentPageData = pages[currentPage]

                  if (isSpreadView && currentPageData?.type === 'page') {
                    // 見開きモードでクリック位置からページを判定
                    if (clickX >= BOOK_WIDTH) {
                      // 右ページ
                      relativeX = (clickX - BOOK_WIDTH) / BOOK_WIDTH
                      const rightPageIndex = currentPageData.side === 'left' ? currentPage + 1 : currentPage
                      pageId = pages[rightPageIndex]?.id || ''
                    } else {
                      // 左ページ
                      relativeX = clickX / BOOK_WIDTH
                      const leftPageIndex = currentPageData.side === 'left' ? currentPage : currentPage - 1
                      pageId = pages[leftPageIndex]?.id || ''
                    }
                  } else {
                    // 単ページモード
                    relativeX = clickX / actualBookWidth
                    pageId = currentPageData?.id || ''
                  }

                  const relativeY = clickY / BOOK_HEIGHT

                  // デコを配置
                  handlePlaceDecoItem(pageId, relativeX, relativeY, 0)
                  // ドロワーを閉じる
                  setIsDecoDrawerOpen(false)
                }}
              >
                <BookView
                  ref={bookRef}
                  pages={pages}
                  placedStickers={placedStickers}
                  placedDecoItems={placedDecoItems}
                  onPageChange={handlePageTurn}
                  onStickerLongPress={handleEditSticker}
                  onDecoItemLongPress={handleEditDecoItem}
                  coverDesignId={coverDesignId}
                  editingStickerId={editingSticker?.id}
                  editingDecoItemId={editingDecoItem?.id}
                  renderNavigation={false}
                />
              </div>
              {selectedSticker && isDragging && (
                <DraggableSticker
                  sticker={selectedSticker}
                  onPlace={(x, y, rotation) => {
                    // 見開きモードかつ表紙・裏表紙でない場合、左右ページを判定
                    const currentPageData = pages[currentPage]
                    const isOnCoverOrBack = currentPageData?.type === 'cover' || currentPageData?.type === 'back-cover'

                    if (isSpreadView && !isOnCoverOrBack) {
                      // 見開きモードでは、x座標が0.5未満なら左ページ、0.5以上なら右ページ
                      // 現在のページが左か右かを確認
                      const isCurrentPageLeft = currentPageData?.side === 'left'

                      // 左右のページインデックスを計算
                      let leftPageIndex: number
                      let rightPageIndex: number

                      if (isCurrentPageLeft) {
                        leftPageIndex = currentPage
                        rightPageIndex = currentPage + 1
                      } else {
                        leftPageIndex = currentPage - 1
                        rightPageIndex = currentPage
                      }

                      // ドロップ位置に基づいて配置先ページを決定
                      if (x >= 0.5) {
                        // 右ページに配置
                        const rightPageId = pages[rightPageIndex]?.id || currentPageData?.id || ''
                        // x座標を0-1に正規化（0.5-1 → 0-1）
                        const adjustedX = (x - 0.5) * 2
                        handlePlaceSticker(rightPageId, adjustedX, y, rotation)
                      } else {
                        // 左ページに配置
                        const leftPageId = pages[leftPageIndex]?.id || currentPageData?.id || ''
                        // x座標を0-1に正規化（0-0.5 → 0-1）
                        const adjustedX = x * 2
                        handlePlaceSticker(leftPageId, adjustedX, y, rotation)
                      }
                    } else {
                      // 単ページモードまたは表紙・裏表紙の場合はそのまま
                      const pageId = currentPageData?.id || ''
                      handlePlaceSticker(pageId, x, y, rotation)
                    }
                  }}
                  onCancel={() => {
                    setSelectedSticker(null)
                    setIsDragging(false)
                  }}
                  bookRef={bookContainerRef}
                  bookWidth={BOOK_WIDTH}
                  bookHeight={BOOK_HEIGHT}
                  isSpreadView={isSpreadView}
                  scrollContainerRef={scrollContainerRef}
                />
              )}
              {/* 編集中のシールをフローティング表示（ドラッグ対応） */}
              {editingSticker && (
                <FloatingEditSticker
                  key={`floating-edit-${editingSticker.id}`}
                  sticker={editingSticker}
                  bookContainerRef={bookContainerRef}
                  scrollContainerRef={scrollContainerRef}
                  pageWidth={BOOK_WIDTH}
                  pageHeight={BOOK_HEIGHT}
                  isSpreadView={isSpreadView}
                  pageSide={editingStickerPageSide}
                  onDrag={handleEditingDrag}
                  onPageSideChange={handleEditingPageSideChange}
                />
              )}
              {/* シール編集コントロール */}
              {editingSticker && (() => {
                const layerInfo = getLayerInfo()
                return (
                  <EditControls
                    sticker={editingSticker}
                    onRotate={handleEditingRotate}
                    onRemove={() => handleDeleteSticker(editingSticker.id)}
                    onClose={() => setEditingSticker(null)}
                    onBringToFront={handleBringToFront}
                    onSendToBack={handleSendToBack}
                    layerPosition={layerInfo.layerPosition}
                    totalLayers={layerInfo.totalLayers}
                    isAtFront={layerInfo.isAtFront}
                    isAtBack={layerInfo.isAtBack}
                  />
                )
              })()}
              {/* 編集中のデコアイテムをフローティング表示（リサイズハンドル付き） */}
              {editingDecoItem && (
                <FloatingEditDeco
                  key={`floating-edit-deco-${editingDecoItem.id}`}
                  decoItem={editingDecoItem}
                  bookContainerRef={bookContainerRef}
                  scrollContainerRef={scrollContainerRef}
                  pageWidth={BOOK_WIDTH}
                  pageHeight={BOOK_HEIGHT}
                  isSpreadView={isSpreadView}
                  pageSide={editingDecoItemPageSide}
                  onDrag={handleEditingDecoDrag}
                  onResize={handleEditingDecoResize}
                  onRotate={handleEditingDecoRotate}
                  onPageSideChange={handleEditingDecoPageSideChange}
                />
              )}
              {/* デコアイテム編集コントロール */}
              {editingDecoItem && (() => {
                // デコアイテムのレイヤー情報を計算
                const samePageStickers = placedStickers.filter(s => s.pageId === editingDecoItem.pageId)
                const samePageDecoItems = placedDecoItems.filter(d => d.pageId === editingDecoItem.pageId)
                const allItems = [
                  ...samePageStickers.map(s => ({ id: s.id, zIndex: s.zIndex ?? 1 })),
                  ...samePageDecoItems.map(d => ({ id: d.id, zIndex: d.zIndex ?? 1 })),
                ].sort((a, b) => a.zIndex - b.zIndex)
                const totalLayers = allItems.length
                const currentIndex = allItems.findIndex(item => item.id === editingDecoItem.id)
                const decoIsAtFront = currentIndex >= allItems.length - 1
                const decoIsAtBack = currentIndex <= 0

                const handleDecoBringToFront = () => {
                  if (decoIsAtFront || currentIndex >= allItems.length - 1) return
                  const newZIndex = allItems[currentIndex + 1].zIndex + 1
                  setPlacedDecoItems(prev => prev.map(d =>
                    d.id === editingDecoItem.id ? { ...d, zIndex: newZIndex } : d
                  ))
                  setEditingDecoItem(prev => prev ? { ...prev, zIndex: newZIndex } : null)
                }

                const handleDecoSendToBack = () => {
                  if (decoIsAtBack || currentIndex <= 0) return
                  const newZIndex = Math.max(0, allItems[currentIndex - 1].zIndex - 1)
                  setPlacedDecoItems(prev => prev.map(d =>
                    d.id === editingDecoItem.id ? { ...d, zIndex: newZIndex } : d
                  ))
                  setEditingDecoItem(prev => prev ? { ...prev, zIndex: newZIndex } : null)
                }

                return (
                  <div
                    className="fixed bottom-0 left-0 right-0 z-[200] flex justify-center px-4 pb-4"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <div
                      className="rounded-2xl p-4 w-full"
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(24px)',
                        boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2)',
                        maxWidth: '360px',
                      }}
                    >
                      {/* ヘッダー */}
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {/* デコプレビュー */}
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-pink-50 border border-pink-200">
                            {editingDecoItem.decoItem.imageUrl ? (
                              <img
                                src={editingDecoItem.decoItem.imageUrl}
                                alt={editingDecoItem.decoItem.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-xl">🎀</span>
                            )}
                          </div>
                          <h3
                            className="font-bold text-sm"
                            style={{
                              fontFamily: "'M PLUS Rounded 1c', sans-serif",
                              color: '#EC4899',
                            }}
                          >
                            ✏️ デコへんしゅう
                          </h3>
                        </div>
                        <button
                          onClick={() => setEditingDecoItem(null)}
                          className="w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-95 text-sm"
                          style={{
                            background: 'rgba(236, 72, 153, 0.15)',
                            color: '#EC4899',
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      {/* 回転 */}
                      <div className="mb-2">
                        <div className="flex items-center gap-2 justify-center">
                          <span className="text-xs text-pink-500">🔄</span>
                          <button
                            onClick={() => handleEditingDecoRotate((editingDecoItem.rotation ?? 0) - 15)}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all active:scale-95"
                            style={{
                              background: 'linear-gradient(135deg, #FBCFE8 0%, #F9A8D4 100%)',
                              color: '#BE185D',
                            }}
                          >
                            ↺
                          </button>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            value={editingDecoItem.rotation ?? 0}
                            onChange={(e) => handleEditingDecoRotate(Number(e.target.value))}
                            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                            style={{
                              background: 'linear-gradient(to right, #FBCFE8 0%, #EC4899 50%, #FBCFE8 100%)',
                            }}
                          />
                          <button
                            onClick={() => handleEditingDecoRotate((editingDecoItem.rotation ?? 0) + 15)}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all active:scale-95"
                            style={{
                              background: 'linear-gradient(135deg, #FBCFE8 0%, #F9A8D4 100%)',
                              color: '#BE185D',
                            }}
                          >
                            ↻
                          </button>
                          <span className="text-xs text-pink-500 w-10 text-center">{Math.round(editingDecoItem.rotation ?? 0)}°</span>
                        </div>
                      </div>

                      {/* 重なり順と削除 */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleDecoSendToBack}
                          disabled={decoIsAtBack || totalLayers <= 1}
                          className="flex-1 py-2 rounded-full flex items-center justify-center text-xs font-medium transition-all active:scale-95 disabled:opacity-40"
                          style={{
                            background: decoIsAtBack ? 'rgba(200, 200, 200, 0.5)' : 'linear-gradient(135deg, #FBCFE8 0%, #F9A8D4 100%)',
                            color: decoIsAtBack ? '#9CA3AF' : '#BE185D',
                            fontFamily: "'M PLUS Rounded 1c', sans-serif",
                          }}
                        >
                          ⬇️ した
                        </button>
                        <button
                          onClick={handleDecoBringToFront}
                          disabled={decoIsAtFront || totalLayers <= 1}
                          className="flex-1 py-2 rounded-full flex items-center justify-center text-xs font-medium transition-all active:scale-95 disabled:opacity-40"
                          style={{
                            background: decoIsAtFront ? 'rgba(200, 200, 200, 0.5)' : 'linear-gradient(135deg, #FBCFE8 0%, #F9A8D4 100%)',
                            color: decoIsAtFront ? '#9CA3AF' : '#BE185D',
                            fontFamily: "'M PLUS Rounded 1c', sans-serif",
                          }}
                        >
                          ⬆️ うえ
                        </button>
                        <button
                          onClick={() => handleDeleteDecoItem(editingDecoItem.id)}
                          className="py-2 px-3 rounded-full font-medium transition-all active:scale-95 text-xs"
                          style={{
                            fontFamily: "'M PLUS Rounded 1c', sans-serif",
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#EF4444',
                          }}
                        >
                          🗑️ はがす
                        </button>
                      </div>

                      {/* 決定ボタン */}
                      <button
                        onClick={() => handleUpdateDecoItem(editingDecoItem)}
                        className="w-full mt-3 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
                        style={{
                          fontFamily: "'M PLUS Rounded 1c', sans-serif",
                          background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                        }}
                      >
                        ✨ ここにはる
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
            {/* StickerTray - シール操作中は非表示 */}
            {!shouldHideUI && (
              <div className="flex-shrink-0">
                <StickerTray
                  stickers={placeableStickers}
                  onStickerSelect={(sticker) => {
                    // 表紙・裏表紙の場合は自動でページをめくる
                    const currentPageType = pages[currentPage]?.type
                    if (currentPageType === 'cover') {
                      bookRef.current?.flipNext()
                    } else if (currentPageType === 'back-cover') {
                      bookRef.current?.flipPrev()
                    }
                    setSelectedSticker(sticker)
                    setIsDragging(true)
                    // デコ選択を解除
                    setSelectedDecoItem(null)
                  }}
                />
              </div>
            )}
            {/* デコ・ドロワー - シール操作中は非表示 */}
            {!shouldHideUI && (
              <DecoDrawer
                availableItems={ownedDecoItems}
                selectedItem={selectedDecoItem}
                onSelectItem={(item) => {
                  // 表紙・裏表紙の場合は自動でページをめくる
                  if (item) {
                    const currentPageType = pages[currentPage]?.type
                    if (currentPageType === 'cover') {
                      bookRef.current?.flipNext()
                    } else if (currentPageType === 'back-cover') {
                      bookRef.current?.flipPrev()
                    }
                  }
                  setSelectedDecoItem(item)
                  // シール選択を解除
                  if (item) {
                    setSelectedSticker(null)
                    setIsDragging(false)
                  }
                }}
                isOpen={isDecoDrawerOpen}
                onToggle={() => setIsDecoDrawerOpen(prev => !prev)}
              />
            )}
            {/* Page toolbar - 画像ボタン (StickerTrayの上に固定配置) - シール操作中・モーダル表示中は非表示 */}
            {!shouldHideUI && (
            <div className="fixed bottom-[215px] left-0 right-0 z-[200] flex justify-center items-center gap-1 py-0 pointer-events-none">
              <div
                className="flex items-center gap-0.5 px-3 py-0 bg-white/80 backdrop-blur-md rounded-full shadow-lg pointer-events-auto"
                style={{ position: 'relative', left: '1px', top: '-1px' }}
              >
              {/* 左ページボタン */}
              <button
                onClick={() => bookRef.current?.flipPrev()}
                disabled={currentPage === 0}
                className="relative w-11 h-11 active:scale-95 transition-transform disabled:opacity-40"
                aria-label="前のページ"
              >
                <img
                  src="/images/Home_Button/Page_left.png"
                  alt=""
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </button>
              {/* ページ番号表示 */}
              <div className="relative w-24 h-12 flex items-center justify-center">
                <img
                  src="/images/Home_Button/Page_Number.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain"
                  draggable={false}
                />
                <span
                  className="relative z-10 text-base font-bold text-white"
                  style={{
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {(() => {
                    const currentPageData = pages[currentPage]
                    // 表紙の場合
                    if (currentPageData?.type === 'cover') {
                      return 'ひょうし'
                    }
                    // 裏表紙の場合
                    if (currentPageData?.type === 'back-cover') {
                      return 'うら'
                    }
                    // 通常ページの場合：表紙と裏表紙を除いたページ番号を計算
                    const regularPages = pages.filter(p => p.type === 'page')
                    const pageIndex = regularPages.findIndex(p => p.id === currentPageData?.id)
                    const totalRegularPages = regularPages.length
                    if (pageIndex >= 0) {
                      // 見開きモードの場合、左右のページ番号を表示
                      if (isSpreadView && currentPageData?.side === 'left') {
                        const rightPageNum = pageIndex + 2
                        if (rightPageNum <= totalRegularPages) {
                          return `${pageIndex + 1}-${rightPageNum}`
                        }
                      }
                      return `${pageIndex + 1}/${totalRegularPages}`
                    }
                    return ''
                  })()}
                </span>
              </div>
              {/* 右ページボタン */}
              <button
                onClick={() => bookRef.current?.flipNext()}
                disabled={currentPage >= pages.length - 1}
                className="relative w-11 h-11 active:scale-95 transition-transform disabled:opacity-40"
                aria-label="次のページ"
              >
                <img
                  src="/images/Home_Button/Page_rihgt.png"
                  alt=""
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </button>
              {/* ページメニューボタン */}
              <button
                onClick={() => setIsPageEditModalOpen(true)}
                className="relative w-12 h-12 active:scale-95 transition-transform ml-2"
                aria-label="ページメニュー"
              >
                <img
                  src="/images/Home_Button/Page_Menu.png"
                  alt=""
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </button>
              {/* 写真ボタン */}
              <button
                onClick={() => console.log('Take screenshot')}
                className="relative w-11 h-11 active:scale-95 transition-transform"
                aria-label="スクリーンショット"
              >
                <img
                  src="/images/Home_Button/Foto_Button.png"
                  alt=""
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </button>
              {/* レイヤーボタン（シールやデコの重なり順を調整） */}
              <button
                onClick={handleOpenLayerPanel}
                className="relative w-11 h-11 active:scale-95 transition-transform flex items-center justify-center
                  bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-md"
                aria-label="レイヤー"
                disabled={currentPageLayerItems.length === 0}
                style={{
                  opacity: currentPageLayerItems.length === 0 ? 0.5 : 1,
                }}
              >
                <span className="text-white text-lg">📚</span>
              </button>
              {/* デコボタン（デコ素材選択ドロワーを開く） */}
              <button
                onClick={() => setIsDecoDrawerOpen(prev => !prev)}
                className={`relative w-11 h-11 active:scale-95 transition-transform flex items-center justify-center
                  rounded-full shadow-md ${isDecoDrawerOpen
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 ring-2 ring-pink-300'
                    : 'bg-gradient-to-br from-pink-400 to-pink-500'}`}
                aria-label="デコ"
              >
                <span className="text-white text-lg">✨</span>
              </button>
              </div>
            </div>
            )}
          </div>
        )

      case 'collection':
        return (
          <CollectionView
            stickers={collectionStickers}
            onStickerClick={(sticker) => {
              setSelectedCollectionSticker(sticker)
              setIsStickerDetailModalOpen(true)
            }}
          />
        )

      case 'gacha':
        return (
          <GachaView
            banners={demoBanners}
            userCurrency={userCurrency}
            onPullSingle={(bannerId) => handlePullGacha(bannerId, 1)}
            onPullMulti={(bannerId) => handlePullGacha(bannerId, 10)}
            onOpenShop={handleOpenShop}
            onInsufficientFunds={handleInsufficientFunds}
          />
        )

      case 'trade':
        return (
          <div className="h-full flex flex-col">
            {/* サブタブセレクター */}
            <div
              className="flex shrink-0"
              style={{
                background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
              }}
            >
              <button
                onClick={() => setTradeSubTab('trade')}
                className={`flex-1 py-3 font-bold text-sm transition-all ${
                  tradeSubTab === 'trade'
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/60'
                }`}
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                🤝 こうかん
              </button>
              <button
                onClick={() => setTradeSubTab('mystery')}
                className={`flex-1 py-3 font-bold text-sm transition-all relative ${
                  tradeSubTab === 'mystery'
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/60'
                }`}
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                📮 ポスト
                {/* 未開封バッジ */}
                {mysteryPostState.receivedStickers.filter(s => !s.isOpened).length > 0 && (
                  <span className="absolute -top-1 right-2 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#EF4444' }}>
                    {mysteryPostState.receivedStickers.filter(s => !s.isOpened).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTradeSubTab('scout')}
                className={`flex-1 py-3 font-bold text-sm transition-all relative ${tradeSubTab === 'scout' ? 'text-white border-b-2 border-white' : 'text-white/60'}`}
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                🔍 スカウト
                {/* マッチングバッジ */}
                {tradeScoutState.matches.filter(m => !m.isRead).length > 0 && (
                  <span className="absolute -top-1 right-2 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#10B981' }}>
                    {tradeScoutState.matches.filter(m => !m.isRead).length}
                  </span>
                )}
              </button>
            </div>

            {/* コンテンツ */}
            <div className="flex-1 overflow-hidden">
              {tradeSubTab === 'trade' && (
                <TradeView
                  friends={demoFriends}
                  history={demoTradeHistory}
                  onStartMatching={handleStartMatching}
                  onTradeWithFriend={(friendId) => {
                    const friend = demoFriends.find(f => f.id === friendId)
                    if (friend) {
                      setTradePartner({
                        id: friend.id,
                        name: friend.name,
                        avatarUrl: friend.avatarUrl,
                        level: 1,
                      })
                      setIsTradeSessionOpen(true)
                    }
                  }}
                  onViewHistory={(historyId) => console.log('View history:', historyId)}
                />
              )}
              {tradeSubTab === 'mystery' && (
                <MysteryPostView
                  state={mysteryPostState}
                  onOpenPostModal={() => setIsPostStickerModalOpen(true)}
                  onOpenReceived={handleOpenReceivedSticker}
                  onCancelPost={handleCancelPost}
                />
              )}
              {tradeSubTab === 'scout' && (
                <TradeScoutView
                  state={tradeScoutState}
                  onOpenWantListEdit={() => setIsScoutWantListModalOpen(true)}
                  onOpenOfferListEdit={() => setIsScoutOfferListModalOpen(true)}
                  onToggleActive={handleToggleScoutActive}
                  onViewMatch={handleViewScoutMatch}
                  onStartTrade={handleStartTradeFromScout}
                />
              )}
            </div>
          </div>
        )

      case 'timeline':
        return (
          <TimelineView
            posts={posts}
            onReact={handleReaction}
            onComment={(postId) => {
              const post = posts.find(p => p.id === postId)
              if (post) {
                setSelectedPost(post)
                setIsCommentModalOpen(true)
              }
            }}
            onUserClick={(userId) => {
              // 投稿から対応するユーザー情報を取得
              const post = posts.find(p => p.userId === userId)

              // demoOtherUserProfilesにあればそれを使用、なければ投稿データから作成
              let userProfile = demoOtherUserProfiles[userId]
              if (!userProfile && post) {
                // 投稿データからプロフィールを動的に作成
                userProfile = {
                  id: userId,
                  name: post.userName,
                  avatarUrl: post.userAvatarUrl,
                  level: 10, // デフォルト値
                  bio: 'シール集め楽しんでます！',
                  isFollowing: post.isFollowing,
                  stats: {
                    totalStickers: 50,
                    uniqueStickers: 35,
                    completedSeries: 1,
                    followersCount: 42,
                    followingCount: 28,
                  },
                }
              }

              if (userProfile) {
                setSelectedOtherUser(userProfile)
                setSelectedUserStickerBook(getDemoStickerBookPreviews(userId))
                setSelectedUserBookPages(getDemoOtherUserBookPages(userId))
                setSelectedUserBookStickers(getDemoOtherUserStickers(userId))
                setIsOtherUserProfileOpen(true)
              }
            }}
            onFollow={(userId) => console.log('Follow:', userId)}
            onCreatePost={() => setIsCreatePostModalOpen(true)}
            onReport={(postId, userId, userName) => {
              setReportTarget({ type: 'post', id: postId, userId: userId, name: userName })
              setIsReportModalOpen(true)
            }}
          />
        )

      case 'profile':
        return (
          <ProfileView
            profile={userProfile}
            stats={userStats}
            achievements={demoAchievements}
            onEditProfile={() => setIsProfileEditOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onViewStickerBook={() => setActiveTab('home')}
            onViewAchievements={() => setIsAchievementsModalOpen(true)}
            onViewFriends={() => console.log('View friends')}
            onViewStats={() => setIsStatsModalOpen(true)}
            onViewFollowers={() => {
              setFollowListInitialTab('followers')
              setIsFollowListModalOpen(true)
            }}
            onViewFollowing={() => {
              setFollowListInitialTab('following')
              setIsFollowListModalOpen(true)
            }}
          />
        )

      default:
        return null
    }
  }

  // 編集中・交換中・マッチング中・モーダル表示中は下部タブバーを非表示にする
  const shouldHideTabBar =
    // 編集・交換・マッチング
    isGachaResultModalOpen ||
    editingSticker ||
    editingDecoItem ||
    isTradeSessionOpen ||
    matchingStatus !== 'idle' ||
    // 全画面表示
    isSettingsOpen ||
    isShopOpen ||
    isAuthOpen ||
    isAdminPanelOpen ||
    isOtherUserProfileOpen ||
    // モーダル
    isProfileEditOpen ||
    isCreatePostModalOpen ||
    isCommentModalOpen ||
    isStickerDetailModalOpen ||
    isReportModalOpen ||
    isBlockModalOpen ||
    isThemeSelectOpen ||
    isPostStickerModalOpen ||
    isReceivedStickerModalOpen ||
    isScoutWantListModalOpen ||
    isScoutOfferListModalOpen ||
    isMatchDetailModalOpen ||
    isStatsModalOpen ||
    isAchievementsModalOpen ||
    isFollowListModalOpen ||
    // ドロワー・パネル
    isDecoDrawerOpen ||
    isLayerPanelOpen ||
    isPageEditModalOpen
  // プロフィールタブは独自ヘッダーがあるのでTopBarを非表示
  const shouldHideTopBar = activeTab === 'profile'

  // 認証中はローディング画面を表示
  if (isAuthLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #FDF2F8 0%, #F5F3FF 100%)',
        }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎫</div>
          <p
            className="text-lg font-bold text-purple-700"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            読み込み中...
          </p>
        </div>
      </div>
    )
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showTabBar={!shouldHideTabBar}
      showTopBar={!shouldHideTopBar}
      currency={userCurrency}
      onOpenShop={handleOpenShop}
    >
      {renderTabContent()}

      {/* Modals */}
      {isPageEditModalOpen && (
        <PageEditModal
          isOpen={isPageEditModalOpen}
          pages={pages}
          placedStickers={placedStickers}
          currentCoverId={coverDesignId}
          availableCovers={defaultCoverDesigns}
          currentCharmId={selectedCharm.id}
          availableCharms={CHARM_LIST.map(c => ({
            id: c.id,
            name: c.name,
            emoji: c.emoji,
            isOwned: true,
          }))}
          onClose={() => setIsPageEditModalOpen(false)}
          onPagesChange={setPages}
          onCoverChange={(coverId) => setCoverDesignId(coverId)}
          onCharmChange={(charmId) => {
            const charm = CHARM_LIST.find(c => c.id === charmId)
            if (charm) setSelectedCharm(charm)
          }}
        />
      )}

      {isStickerDetailModalOpen && selectedCollectionSticker && (
        <StickerDetailModal
          sticker={selectedCollectionSticker}
          isOpen={isStickerDetailModalOpen}
          onClose={() => {
            setIsStickerDetailModalOpen(false)
            setSelectedCollectionSticker(null)
          }}
          onConvertToPoints={(sticker) => console.log('Convert:', sticker.id)}
        />
      )}

      {isGachaResultModalOpen && (
        <GachaResultModal
          isOpen={isGachaResultModalOpen}
          results={gachaResults}
          onClose={() => {
            setIsGachaResultModalOpen(false)
            setGachaResults([])
          }}
          onContinue={() => {
            // 確認ダイアログを開く
            if (lastGachaPull) {
              const banner = demoBanners.find(b => b.id === lastGachaPull.bannerId)
              if (banner) {
                const cost = lastGachaPull.count === 1 ? banner.costSingle : banner.costMulti
                setContinueConfirmDialog({
                  isOpen: true,
                  pullType: lastGachaPull.count === 1 ? 'single' : 'multi',
                  cost,
                  currency: banner.currency,
                })
              }
            }
          }}
        />
      )}

      {/* もう一回ガチャの確認ダイアログ */}
      <GachaConfirmDialog
        isOpen={continueConfirmDialog.isOpen}
        pullType={continueConfirmDialog.pullType}
        cost={continueConfirmDialog.cost}
        currency={continueConfirmDialog.currency}
        currentAmount={
          continueConfirmDialog.currency === 'ticket'
            ? userMonetization.tickets
            : userMonetization.stars
        }
        onConfirm={() => {
          // 残高確認
          const { cost, currency } = continueConfirmDialog
          const currentAmount = currency === 'ticket'
            ? userMonetization.tickets
            : currency === 'star'
              ? userMonetization.stars
              : 0

          if (currentAmount < cost) {
            // 残高不足 → InsufficientFundsModalを開く
            setContinueConfirmDialog(prev => ({ ...prev, isOpen: false }))
            const fundType = currency === 'ticket' ? 'tickets' : 'stars'
            handleInsufficientFunds(fundType as 'tickets' | 'stars', cost, currentAmount)
            return
          }

          // 確認ダイアログを閉じる
          setContinueConfirmDialog(prev => ({ ...prev, isOpen: false }))
          // ガチャ結果モーダルを閉じる
          setIsGachaResultModalOpen(false)
          setGachaResults([])
          // 少し遅延を入れてから再度ガチャを引く
          if (lastGachaPull) {
            setTimeout(() => {
              handlePullGacha(lastGachaPull.bannerId, lastGachaPull.count)
            }, 100)
          }
        }}
        onCancel={() => {
          setContinueConfirmDialog(prev => ({ ...prev, isOpen: false }))
        }}
      />

      {matchingStatus !== 'idle' && (
        <MatchingModal
          isOpen={true}
          status={matchingStatus}
          matchedUser={matchedUser ?? undefined}
          onCancel={handleCancelMatching}
          onStartTrade={handleAcceptMatch}
          onRetry={handleStartMatching}
        />
      )}

      {isTradeSessionOpen && tradePartner && currentUser && (
        <TradeSessionFull
          myUser={{
            id: currentUser.supabaseId, // Supabase UUIDを使用
            name: currentUser.name,
            avatarUrl: undefined,
            level: 5,
            bio: 'シール交換はじめました！',
            totalStickers: collection.length,
            totalTrades: 0,
          }}
          partnerUser={{
            id: tradePartner.id, // これはtrade.idなのでそのまま
            name: tradePartner.name,
            avatarUrl: tradePartner.avatarUrl,
            level: tradePartner.level,
            bio: '',
            totalStickers: 0,
            totalTrades: 0,
          }}
          myPages={myTradePages}
          myCoverDesignId={coverDesignId}
          partnerPages={
            supabaseTradeState.partnerStickerPages.length > 0
              ? supabaseTradeState.partnerStickerPages.map(page => ({
                  id: page.id,
                  type: page.pageType as 'cover' | 'page' | 'back-cover' | 'inner-cover',
                  pageNumber: page.pageNumber,
                  stickers: page.stickers,
                  decoItems: page.decoItems || [],
                }))
              : demoPartnerTradePages
          }
          partnerCoverDesignId="cover-mochimo"
          onTradeComplete={(myOffers, partnerOffers) => {
            console.log('Trade complete:', myOffers, partnerOffers)
            setIsTradeSessionOpen(false)
            setTradePartner(null)
            setMatchedUser(null)
            // Supabaseの交換もキャンセル
            supabaseTradeActions.cancelTrade()
          }}
          onCancel={() => {
            setIsTradeSessionOpen(false)
            setTradePartner(null)
            setMatchedUser(null)
            // Supabaseの交換もキャンセル
            supabaseTradeActions.cancelTrade()
          }}
          onFollowPartner={(partnerId) => {
            console.log('Follow partner:', partnerId)
          }}
          // Supabase連携用props
          supabaseMessages={supabaseTradeState.messages.map(m => ({
            id: m.id,
            stamp_id: m.stamp_id,
            user_id: m.user_id,
            created_at: m.created_at,
            message_type: (m as any).message_type,
            content: (m as any).content,
          }))}
          onSendStamp={supabaseTradeActions.sendStamp}
          onSendText={supabaseTradeActions.sendText}
          partnerReady={supabaseTradeState.partnerIsReady}
          onSetReady={supabaseTradeActions.setReady}
          // シール選択の同期用props
          supabaseMyItems={supabaseTradeState.myItems.map(item => ({
            id: item.id,
            user_id: item.user_id,
            user_sticker_id: item.user_sticker_id,
            sticker_id: item.sticker?.id,
          }))}
          supabasePartnerItems={supabaseTradeState.partnerItems.map(item => ({
            id: item.id,
            user_id: item.user_id,
            user_sticker_id: item.user_sticker_id,
            sticker_id: item.sticker?.id,
          }))}
          onSelectMySticker={supabaseTradeActions.addItem}
          onDeselectMySticker={supabaseTradeActions.removeItem}
          tradeCompleted={supabaseTradeState.isCompleted}
        />
      )}

      {isCreatePostModalOpen && (
        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          pages={pages.filter(p => p.type === 'page').map((p, index) => ({
            id: p.id,
            pageNumber: index + 1,
            // 各ページに貼られたシールとデコを渡す
            placedStickers: placedStickers.filter(s => s.pageId === p.id),
            placedDecoItems: placedDecoItems.filter(d => d.pageId === p.id),
          }))}
          onClose={() => setIsCreatePostModalOpen(false)}
          onSubmit={async (data) => {
            if (!currentUser?.supabaseId) return
            // Supabaseに投稿を保存
            const savedPost = await timelineService.createPost(currentUser.supabaseId, {
              pageId: data.pageId,
              caption: data.caption,
              hashtags: data.hashtags,
              visibility: data.visibility,
            })

            if (savedPost) {
              console.log('[Timeline] Post saved to Supabase:', savedPost.id)
              // 新しい投稿を作成（Supabaseから返されたIDを使用）
              const newPost: Post = {
                id: savedPost.id,
                userId: currentUser.supabaseId,
                userName: currentUser.name,
                userAvatarUrl: undefined,
                // pageData を使用してシール帳ページを表示
                pageData: data.pageData,
                caption: data.caption,
                hashtags: data.hashtags,
                reactions: [
                  { type: 'heart', count: 0, isReacted: false },
                ],
                commentCount: 0,
                createdAt: savedPost.created_at || new Date().toISOString(),
                isFollowing: true, // 自分の投稿
                visibility: data.visibility,
              }
              // 投稿を追加（先頭に）
              setPosts(prev => [newPost, ...prev])
            } else {
              console.error('[Timeline] Failed to save post to Supabase')
              // Supabase保存失敗時もローカルには表示（UX向上）
              const newPost: Post = {
                id: `post-${Date.now()}`,
                userId: currentUser.supabaseId,
                userName: currentUser.name,
                userAvatarUrl: undefined,
                pageData: data.pageData,
                caption: data.caption,
                hashtags: data.hashtags,
                reactions: [
                  { type: 'heart', count: 0, isReacted: false },
                ],
                commentCount: 0,
                createdAt: new Date().toISOString(),
                isFollowing: true,
                visibility: data.visibility,
              }
              setPosts(prev => [newPost, ...prev])
            }
            setIsCreatePostModalOpen(false)

            // 投稿したら経験値獲得 (+20 EXP)
            gainExp('post_create')
          }}
        />
      )}

      {isCommentModalOpen && selectedPost && (
        <CommentModal
          isOpen={isCommentModalOpen}
          postId={selectedPost.id}
          comments={[]}
          onClose={() => {
            setIsCommentModalOpen(false)
            setSelectedPost(null)
          }}
          onAddComment={(postId, content) => console.log('Comment on post:', postId, content)}
          onDeleteComment={(commentId) => console.log('Delete comment:', commentId)}
        />
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-white z-[100]">
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-purple-600 font-medium"
            >
              ← 戻る
            </button>
            <h1 className="font-bold text-purple-700">設定</h1>
            <div className="w-12" />
          </div>
          <div className="h-[calc(100%-60px)] overflow-auto pb-8">
            <SettingsView
              settings={settings}
              onSettingsChange={(newSettings) => setSettings(newSettings)}
              onLogout={() => {
                setIsSettingsOpen(false)
                setIsAuthOpen(true)
              }}
              onDeleteAccount={() => console.log('Delete account requested')}
              onContactSupport={() => console.log('Contact support')}
              onViewTerms={() => console.log('View terms')}
              onViewPrivacy={() => console.log('View privacy')}
              userName={user?.profile?.display_name || 'ゲスト'}
              userEmail={user?.email}
              userCode={userCode}
              isAccountLinked={isAccountLinked}
              linkedProviders={linkedProviders}
              onLinkGoogle={linkGoogle}
              onLinkApple={linkApple}
            />

            {/* 管理者パネルへのアクセスボタン（開発用） */}
            <div className="px-4 py-6 border-t border-gray-200 mt-4 mb-20">
              <button
                onClick={() => {
                  setIsSettingsOpen(false)
                  setIsAdminPanelOpen(true)
                }}
                className="w-full py-3 bg-gray-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                🔧 管理者パネル
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                開発・テスト用
              </p>
            </div>
          </div>
        </div>
      )}

      {isAuthOpen && (
        <div className="fixed inset-0 bg-white z-50">
          <AuthView
            onLogin={async (email, password) => {
              console.log('Login:', email)
              setIsAuthOpen(false)
            }}
            onSignup={async (email, password, name) => {
              console.log('Register:', email, name)
              setIsAuthOpen(false)
            }}
            onSocialLogin={async (provider) => {
              console.log('Social login:', provider)
              setIsAuthOpen(false)
            }}
            onSkip={() => setIsAuthOpen(false)}
          />
        </div>
      )}

      {isReportModalOpen && reportTarget && (
        <ReportModal
          isOpen={isReportModalOpen}
          targetType={reportTarget.type}
          targetId={reportTarget.id}
          targetUserId={reportTarget.userId}
          targetName={reportTarget.name}
          onClose={() => {
            setIsReportModalOpen(false)
            setReportTarget(null)
          }}
          onSubmit={handleReport}
        />
      )}

      {isBlockModalOpen && blockTarget && (
        <BlockModal
          isOpen={isBlockModalOpen}
          userId={blockTarget.id}
          userName={blockTarget.name}
          isBlocked={false}
          onClose={() => {
            setIsBlockModalOpen(false)
            setBlockTarget(null)
          }}
          onBlock={handleBlock}
          onUnblock={(userId) => console.log('Unblock:', userId)}
        />
      )}

      {isThemeSelectOpen && (
        <ThemeSelectModal
          isOpen={isThemeSelectOpen}
          currentThemeId="default"
          ownedThemeIds={['default', 'pastel']}
          userStarPoints={100}
          onClose={() => setIsThemeSelectOpen(false)}
          onSelectTheme={(themeId) => {
            console.log('Theme selected:', themeId)
            setIsThemeSelectOpen(false)
          }}
          onPurchaseTheme={(themeId) => {
            console.log('Theme purchased:', themeId)
          }}
        />
      )}

      {isTutorialOpen && (
        <TutorialOverlay
          steps={defaultTutorialSteps}
          onComplete={() => setIsTutorialOpen(false)}
          onSkip={() => setIsTutorialOpen(false)}
        />
      )}

      {/* プロフィール編集モーダル */}
      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
        profile={userProfile}
        onSave={async (updates) => {
          // ローカルstate更新
          setUserProfile(prev => ({
            ...prev,
            name: updates.name,
            bio: updates.bio,
            avatarUrl: updates.avatarUrl || prev.avatarUrl,
          }))
          setIsProfileEditOpen(false)

          // Supabaseモードの場合はSupabaseにも保存
          if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
            const success = await profileService.updateProfile(currentUser.supabaseId, {
              displayName: updates.name,
              bio: updates.bio,
              avatarUrl: updates.avatarUrl,
            })
            if (success) {
              console.log('[Profile] Saved to Supabase')
            } else {
              console.error('[Profile] Failed to save to Supabase')
            }
          }
        }}
      />

      {/* 統計詳細モーダル */}
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={userStats}
      />

      {/* 実績一覧モーダル */}
      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        achievements={demoAchievements}
      />

      {/* レベルアップモーダル */}
      <LevelUpModal
        isOpen={isLevelUpModalOpen}
        onClose={() => {
          setIsLevelUpModalOpen(false)
          setLevelUpInfo(null)
        }}
        newLevel={levelUpInfo?.level ?? 1}
        rewards={levelUpInfo?.rewards ?? []}
      />

      {/* フォロー・フォロワー一覧モーダル */}
      <FollowListModal
        isOpen={isFollowListModalOpen}
        onClose={() => setIsFollowListModalOpen(false)}
        initialTab={followListInitialTab}
        followers={demoFollowers}
        following={demoFollowing}
        onUserClick={(userId) => {
          // 他ユーザーのプロフィールを開く
          const userProfile = demoOtherUserProfiles[userId]
          if (userProfile) {
            setSelectedOtherUser(userProfile)
            setSelectedUserStickerBook(getDemoStickerBookPreviews(userId))
            setSelectedUserBookPages(getDemoOtherUserBookPages(userId))
            setSelectedUserBookStickers(getDemoOtherUserStickers(userId))
            setIsFollowListModalOpen(false)
            setIsOtherUserProfileOpen(true)
          }
        }}
        onFollowToggle={(userId, isFollowing) => {
          console.log('Follow toggle:', userId, isFollowing)
          // TODO: フォロー状態の更新
        }}
      />

      {/* 他ユーザープロフィールモーダル */}
      <OtherUserProfileModal
        isOpen={isOtherUserProfileOpen}
        onClose={() => {
          setIsOtherUserProfileOpen(false)
          setSelectedOtherUser(null)
        }}
        user={selectedOtherUser}
        stickerBookPages={selectedUserStickerBook}
        bookPages={selectedUserBookPages}
        bookStickers={selectedUserBookStickers}
        coverDesignId={selectedUserCoverDesignId}
        onFollowToggle={(userId, isFollowing) => {
          console.log('Follow toggle from profile:', userId, isFollowing)
          // フォロー状態を更新
          if (selectedOtherUser) {
            setSelectedOtherUser({
              ...selectedOtherUser,
              isFollowing,
            })
          }
        }}
        onViewStickerBook={(userId, pageId) => {
          console.log('View sticker book:', userId, pageId)
          // TODO: シール帳閲覧画面へ遷移
        }}
        onReport={(userId) => {
          console.log('Report user:', userId)
          // TODO: 通報モーダルを開く
        }}
        onBlock={(userId) => {
          console.log('Block user:', userId)
          // TODO: ブロック確認モーダルを開く
        }}
      />

      {/* ミステリーポスト: 投函モーダル */}
      <PostStickerModal
        isOpen={isPostStickerModalOpen}
        onClose={() => setIsPostStickerModalOpen(false)}
        duplicateStickers={duplicateStickers}
        onPost={handlePostSticker}
      />

      {/* ミステリーポスト: 開封モーダル */}
      <ReceivedStickerModal
        isOpen={isReceivedStickerModalOpen}
        onClose={() => {
          setIsReceivedStickerModalOpen(false)
          setSelectedReceivedSticker(null)
        }}
        sticker={selectedReceivedSticker}
        onOpened={handleStickerOpened}
      />

      {/* トレード・スカウト: ほしいシール編集モーダル */}
      <ScoutListEditModal
        isOpen={isScoutWantListModalOpen}
        onClose={() => setIsScoutWantListModalOpen(false)}
        listType="want"
        currentList={tradeScoutState.settings.wantList}
        availableStickers={collectionStickers.map(s => ({
          id: s.id,
          name: s.name,
          imageUrl: s.imageUrl || '',
          rarity: s.rarity,
          owned: s.owned,
          quantity: s.quantity,
        }))}
        onSave={handleSaveWantList}
      />

      {/* トレード・スカウト: だせるシール編集モーダル */}
      <ScoutListEditModal
        isOpen={isScoutOfferListModalOpen}
        onClose={() => setIsScoutOfferListModalOpen(false)}
        listType="offer"
        currentList={tradeScoutState.settings.offerList}
        availableStickers={collectionStickers.map(s => ({
          id: s.id,
          name: s.name,
          imageUrl: s.imageUrl || '',
          rarity: s.rarity,
          owned: s.owned,
          quantity: s.quantity,
        }))}
        onSave={handleSaveOfferList}
      />

      {/* トレード・スカウト: マッチング詳細モーダル */}
      <MatchDetailModal
        isOpen={isMatchDetailModalOpen}
        onClose={() => {
          setIsMatchDetailModalOpen(false)
          setSelectedScoutMatch(null)
        }}
        match={selectedScoutMatch}
        onStartTrade={handleStartTradeFromScout}
      />

      {/* ペリペリエフェクト（シール剥がし演出） */}
      <PeelEffect
        isActive={showPeelEffect}
        stickerImageUrl={peelEffectImageUrl}
        position={peelEffectPosition}
        size={80}
        onComplete={() => setShowPeelEffect(false)}
      />

      {/* ペタッエフェクト（シール貼り付け演出） */}
      <PlaceEffect
        isActive={showPlaceEffect}
        position={placeEffectPosition}
        size={80}
        onComplete={() => setShowPlaceEffect(false)}
      />

      {/* 粘着力メッセージ（小ネタトースト） */}
      {stickinessMessage && (
        <div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[200] animate-bounce"
          style={{
            animation: 'fadeInUp 0.3s ease-out, fadeOutUp 0.3s ease-in 2.5s forwards',
          }}
        >
          <div
            className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              color: '#92400E',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {stickinessMessage}
          </div>
        </div>
      )}

      {/* レイヤー制御パネル（シール・デコの重なり順調整） */}
      <LayerControlPanel
        items={currentPageLayerItems}
        selectedItemId={selectedLayerItemId}
        onSelectItem={(id) => setSelectedLayerItemId(id)}
        onChangeZIndex={handleChangeLayerZIndex}
        isOpen={isLayerPanelOpen}
        onClose={() => {
          setIsLayerPanelOpen(false)
          setSelectedLayerItemId(null)
        }}
      />

      {/* ==================== Shop Modals ==================== */}
      {/* ショップ画面モーダル */}
      {isShopOpen && (
        <div className="fixed inset-0 z-[100] bg-white">
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
              <button
                onClick={handleCloseShop}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="text-lg font-bold" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>ショップ</h1>
              <div className="w-10" />
            </div>
            <ShopView
              userMonetization={userMonetization}
              onPurchaseStars={handlePurchaseStars}
              onSubscribe={handleSubscribe}
              onWatchAd={handleOpenAdReward}
              onOpenSubscriptionModal={() => {}}
            />
          </div>
        </div>
      )}

      {/* 残高不足モーダル */}
      <InsufficientFundsModal
        isOpen={insufficientFundsModal.isOpen}
        fundType={insufficientFundsModal.fundType}
        required={insufficientFundsModal.required}
        current={insufficientFundsModal.current}
        userMonetization={userMonetization}
        onWatchAd={handleOpenAdReward}
        onBuyStars={handleGoToShop}
        onSubscribe={handleGoToShop}
        onClose={handleCloseInsufficientFunds}
      />

      {/* 広告視聴モーダル */}
      <AdRewardModal
        isOpen={isAdRewardModalOpen}
        adsWatchedToday={userMonetization.adsWatchedToday}
        onWatchAd={handleWatchAd}
        onClose={() => setIsAdRewardModalOpen(false)}
      />

      {/* デイリーボーナスモーダル */}
      {dailyBonusReceived && (
        <DailyBonusModal
          isOpen={isDailyBonusModalOpen}
          userMonetization={userMonetization}
          ticketsReceived={dailyBonusReceived.tickets}
          starsReceived={dailyBonusReceived.stars}
          onClose={() => {
            setIsDailyBonusModalOpen(false)
            setDailyBonusReceived(null)
          }}
        />
      )}

      {/* 管理者パネル */}
      {isAdminPanelOpen && currentUser && (
        <AdminView
          adminMode={adminMode}
          userData={buildSavedUserData()}
          allStickers={demoStickers}
          currentTestUser={{
            id: currentUser.id,
            supabaseId: currentUser.supabaseId,
            name: currentUser.name,
            emoji: currentUser.emoji,
            color: currentUser.color,
          }}
          onChangeMode={handleChangeAdminMode}
          onSwitchUser={handleSwitchUser}
          onGrantCurrency={handleGrantCurrency}
          onGrantSticker={handleGrantSticker}
          onGrantAllStickers={handleGrantAllStickers}
          onResetCollection={handleResetCollection}
          onResetAll={handleResetAllData}
          onClose={() => setIsAdminPanelOpen(false)}
        />
      )}
    </AppLayout>
  )
}
