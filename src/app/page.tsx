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
  BookShareModal,
} from '@/features/sticker-book'
import {
  DecoItemData,
  PlacedDecoItem,
  DEFAULT_DECO_ITEMS,
  getOwnedDecoItems,
} from '@/domain/decoItems'
import { CoverDesign } from '@/domain/theme'
import { CollectionView, CollectionSticker, StickerDetailModal } from '@/features/collection'
import { UpgradeModal } from '@/components/upgrade'
import { GachaView, GachaBanner, UserCurrency, GachaResultModal, GachaResultSticker, GachaConfirmDialog, GachaRate } from '@/features/gacha'
import { TradeView, Friend, TradeHistory, MatchingModal, MatchingStatus, MatchedUser, TradeSession, TradeSticker, TradePartner, TradeSessionEnhanced, TradeBookPage, TradeSessionFull, TradeUser, TradeBookPageFull } from '@/features/trade'
import { TimelineView, Post, ReactionType, CreatePostModal, CommentModal, StickerBookPage, Comment, FollowStatus, FeedType } from '@/features/timeline'
import { timelineService } from '@/services/timeline/timelineService'
import { asyncTradeService } from '@/services/asyncTrade/asyncTradeService'
import { ProfileView, ProfileEditModal, LevelUpModal, StatsModal, AchievementsModal, FollowListModal, OtherUserProfileModal, DailyMissionsModal, CollectionRewardsModal, UserSearchModal, UserProfile, UserStats, Achievement, FollowUser, OtherUserProfile, StickerBookPreview } from '@/features/profile'
import { HomeView } from '@/features/home'
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
import { moderationService } from '@/services/moderation'
import { BlockedUsersModal } from '@/components/moderation'
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
  GACHA_COSTS,
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
  loadCurrencyFromSupabase,
  deductGachaCurrency,
  deductPremiumGachaCurrency,
  grantDailyBonusToSupabase,
} from '@/utils/supabaseSync'
import { useSupabaseTrade } from '@/hooks'
import { AdminView } from '@/features/admin'
import { stickerBookService, type StickerBookPage as SupabaseStickerBookPage } from '@/services/stickerBook'
import { profileService, statsService, type FollowUserData, type UserStatsFromDB } from '@/services/profile'
import { mysteryPostService } from '@/services/mysteryPost'
import { tradeScoutService } from '@/services/tradeScout'
import { calculateAchievements, type AchievementStats } from '@/services/achievements/achievementService'
import { notificationService } from '@/services/notifications'
import { STAR_BONUS } from '@/constants/upgradeRanks'
import {
  getInvitationStats,
  getInvitationList,
  claimInviterReward,
  claimInviteeReward,
  applyInvitationCode,
  shareInvitation,
  copyInvitationCode,
  InvitationStats,
  InvitationRecord,
} from '@/services/invitation/invitationService'
import {
  getReviewRewardStatus,
  claimReviewReward,
  detectPlatform,
  ReviewRewardStatus,
  Platform,
} from '@/services/reviewReward/reviewRewardService'
import ReviewPromptModal from '@/features/trade/ReviewPromptModal'

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
// DemoStickers loaded

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
    series: s.series || 'シールガチャ',
    character: characterName, // キャラクター名を追加
    owned,
    quantity,
    rank: quantity > 3 ? 3 : quantity > 1 ? 2 : 1,
    totalAcquired: owned ? Math.floor(Math.random() * 10) + quantity : 0,
  }
})

// Demo gacha banners
const demoBanners: GachaBanner[] = [
  {
    id: 'banner-1',
    name: 'シールガチャ',
    description: 'キラキラシールをゲットしよう！',
    type: 'normal',
    costSingle: 1,
    costMulti: 10,
    currency: 'ticket',
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

// Demo settings
const demoSettings: SettingsData = {
  notifications: {
    tradeRequests: true,
    friendRequests: true,
    newStickers: true,
    contests: true,
    dailyBonus: true,
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

  // 通知サービス初期化（ログイン時）
  useEffect(() => {
    if (currentUser?.id) {
      notificationService.initialize(currentUser.id)
        .catch(err => console.error('[Notification] 初期化エラー:', err))
    }
    return () => {
      if (currentUser?.id) {
        notificationService.cleanup()
          .catch(err => console.error('[Notification] クリーンアップエラー:', err))
      }
    }
  }, [currentUser?.id])

  // モデレーション情報を取得（ブロック数、管理者チェック）
  useEffect(() => {
    const fetchModerationInfo = async () => {
      if (!currentUser?.id) {
        setBlockedUsersCount(0)
        setIsAdminUser(false)
        return
      }
      try {
        // ブロック中のユーザー数を取得
        const blockedIds = await moderationService.getBlockedUserIds(currentUser.id)
        setBlockedUsersCount(blockedIds.length)
        // 管理者かどうかチェック
        const isAdmin = await moderationService.isAdmin(currentUser.id)
        setIsAdminUser(isAdmin)
      } catch (err) {
        console.error('[Moderation] 情報取得エラー:', err)
      }
    }
    fetchModerationInfo()
  }, [currentUser?.id])

  // 招待・レビュー報酬情報を取得
  useEffect(() => {
    const fetchInvitationAndReviewInfo = async () => {
      if (!currentUser?.supabaseId) {
        setInvitationStats(null)
        setInvitationList([])
        setReviewRewardStatus(null)
        return
      }
      try {
        // 招待統計を取得
        const stats = await getInvitationStats(currentUser.supabaseId)
        setInvitationStats(stats)
        // 招待リストを取得
        const list = await getInvitationList(currentUser.supabaseId)
        setInvitationList(list)
        // レビュー報酬状態を取得
        const reviewStatus = await getReviewRewardStatus(currentUser.supabaseId)
        setReviewRewardStatus(reviewStatus)
      } catch (err) {
        console.error('[Invitation/Review] 情報取得エラー:', err)
      }
    }
    fetchInvitationAndReviewInfo()
  }, [currentUser?.supabaseId])

  // マスターシールデータ（Supabaseから取得、フォールバックとしてdemoStickers）
  const [masterStickers, setMasterStickers] = useState<Sticker[]>(demoStickers)
  const [isMasterStickersLoaded, setIsMasterStickersLoaded] = useState(false)

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
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [selectedUpgradeStickerId, setSelectedUpgradeStickerId] = useState<string | null>(null)
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
  const [isBlockedUsersModalOpen, setIsBlockedUsersModalOpen] = useState(false)
  const [blockedUsersCount, setBlockedUsersCount] = useState(0)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>(demoUserProfile)
  const [totalExp, setTotalExp] = useState(INITIAL_TOTAL_EXP)
  // totalExpの最新値をrefで保持（クロージャのstale値問題を回避）
  const totalExpRef = useRef(INITIAL_TOTAL_EXP)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; rewards: LevelUpReward[] } | null>(null)
  const [isThemeSelectOpen, setIsThemeSelectOpen] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false)
  const [isDailyMissionsModalOpen, setIsDailyMissionsModalOpen] = useState(false)
  const [isCollectionRewardsModalOpen, setIsCollectionRewardsModalOpen] = useState(false)
  const [isUserSearchModalOpen, setIsUserSearchModalOpen] = useState(false)
  const [isFollowListModalOpen, setIsFollowListModalOpen] = useState(false)
  const [followListInitialTab, setFollowListInitialTab] = useState<'followers' | 'following'>('followers')
  const [isOtherUserProfileOpen, setIsOtherUserProfileOpen] = useState(false)
  const [selectedOtherUser, setSelectedOtherUser] = useState<OtherUserProfile | null>(null)
  const [selectedUserStickerBook, setSelectedUserStickerBook] = useState<StickerBookPreview[]>([])
  const [selectedUserBookPages, setSelectedUserBookPages] = useState<BookPage[]>([])
  const [selectedUserBookStickers, setSelectedUserBookStickers] = useState<PlacedSticker[]>([])
  const [selectedUserBookDecoItems, setSelectedUserBookDecoItems] = useState<PlacedDecoItem[]>([])
  const [selectedUserCoverDesignId, setSelectedUserCoverDesignId] = useState<string>('cover-mochimo')

  // フォロワー/フォロー数
  const [followCounts, setFollowCounts] = useState<{ followersCount: number; followingCount: number }>({
    followersCount: 0,
    followingCount: 0,
  })
  // SupabaseからのDB統計情報
  const [dbStats, setDbStats] = useState<UserStatsFromDB | null>(null)
  // フォロワー/フォロー一覧
  const [followersList, setFollowersList] = useState<FollowUserData[]>([])
  const [followingList, setFollowingList] = useState<FollowUserData[]>([])
  const [isLoadingFollowList, setIsLoadingFollowList] = useState(false)

  // Trade state
  const [matchingStatus, setMatchingStatus] = useState<MatchingStatus>('idle')
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null)
  const [isTradeSessionOpen, setIsTradeSessionOpen] = useState(false)
  const [tradePartner, setTradePartner] = useState<TradePartner | null>(null)
  const [isAsyncTradeSessionOpen, setIsAsyncTradeSessionOpen] = useState(false)

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

  // Book share modal state
  const [isBookShareModalOpen, setIsBookShareModalOpen] = useState(false)
  const shareBookContainerRef = useRef<HTMLDivElement | null>(null)

  const [insufficientFundsModal, setInsufficientFundsModal] = useState<{
    isOpen: boolean
    fundType: 'tickets' | 'gems' | 'stars'
    required: number
    current: number
    canUseDropsInstead: boolean
    dropsRequired: number
    pendingGacha: { bannerId: string; count: number } | null
  }>({
    isOpen: false,
    fundType: 'tickets',
    required: 0,
    current: 0,
    canUseDropsInstead: false,
    dropsRequired: 0,
    pendingGacha: null,
  })
  const [dailyBonusReceived, setDailyBonusReceived] = useState<{ tickets: number; stars: number } | null>(null)

  // Posts state - 初期化はuseMemoで（placedStickersに依存しないがデモ用）
  const [posts, setPosts] = useState<Post[]>([])
  const [likedPosts, setLikedPosts] = useState<Post[]>([])
  const [followingPosts, setFollowingPosts] = useState<Post[]>([])
  const [activeTimelineTab, setActiveTimelineTab] = useState<FeedType>('latest')
  const [postComments, setPostComments] = useState<Comment[]>([])

  // ガチャ回数トラッキング（実績用）
  const [gachaPulls, setGachaPulls] = useState(0)

  // Settings state
  const [settings, setSettings] = useState<SettingsData>(demoSettings)

  // Invitation system state
  const [invitationStats, setInvitationStats] = useState<InvitationStats | null>(null)
  const [invitationList, setInvitationList] = useState<InvitationRecord[]>([])

  // Review reward state
  const [reviewRewardStatus, setReviewRewardStatus] = useState<ReviewRewardStatus | null>(null)
  const [isReviewPromptOpen, setIsReviewPromptOpen] = useState(false)

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

        // ミッション進捗を記録（交換完了）
        statsService.recordTradeComplete(currentUser.id).then(success => {
          if (success) {
            console.log('[Trade] Mission progress recorded for trade completion')
          }
        }).catch(error => {
          console.error('[Trade] Failed to record mission progress:', error)
        })
      }
      // レビュー報酬がまだ受け取れる場合はレビューポップアップを表示
      if (reviewRewardStatus && (reviewRewardStatus.canClaimIos || reviewRewardStatus.canClaimAndroid)) {
        // 少し遅延を入れて、交換完了のUIが表示された後に表示
        setTimeout(() => {
          setIsReviewPromptOpen(true)
        }, 1500)
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
  const allStickerIds = useMemo(() => masterStickers.map(s => s.id), [masterStickers])

  // コレクションをCollectionSticker形式に変換（UI用）
  // ランクごとに別エントリとして表示（ノーマル5枚、シルバー1枚は別々に表示）
  const collectionStickers: CollectionSticker[] = useMemo(() => {
    // マスターシールをIDでマップ化
    const masterStickerMap = new Map(masterStickers.map(s => [s.id, s]))

    // 配置済みシール数をカウント（複合ID対応）
    const placedCountMap = new Map<string, number>()
    placedStickers.forEach(p => {
      placedCountMap.set(p.stickerId, (placedCountMap.get(p.stickerId) || 0) + 1)
    })

    // 複合IDをパースする関数
    const parseCompositeId = (compositeId: string): { baseId: string; rank: number } => {
      const lastColonIndex = compositeId.lastIndexOf(':')
      if (lastColonIndex === -1) {
        // 旧形式（ランクなし）の場合
        return { baseId: compositeId, rank: 0 }
      }
      const baseId = compositeId.substring(0, lastColonIndex)
      const rank = parseInt(compositeId.substring(lastColonIndex + 1), 10) || 0
      return { baseId, rank }
    }

    // 所持しているシールのベースIDを収集
    const ownedBaseIds = new Set<string>()
    const results: CollectionSticker[] = []

    // 1. 所持シールをエントリ化（各ランクを別エントリとして）
    for (const saved of collection) {
      const { baseId, rank } = parseCompositeId(saved.stickerId)
      const masterSticker = masterStickerMap.get(baseId)

      if (!masterSticker) {
        console.warn(`[CollectionStickers] Master sticker not found for: ${baseId}`)
        continue
      }

      ownedBaseIds.add(baseId)

      // 配置済み数を計算（複合IDで検索）- 表示用（オプション）
      const placedCount = placedCountMap.get(saved.stickerId) || 0
      // 合計所持数（配置済み含む）と未配置数を分けて管理
      const totalQuantity = saved.quantity || 0
      const unplacedQuantity = Math.max(0, totalQuantity - placedCount)

      const characterName = masterSticker.name.split(' ')[0] || masterSticker.series || ''

      // 実効レアリティ = 基本レアリティ + アップグレードボーナス
      const starBonus = STAR_BONUS[rank as keyof typeof STAR_BONUS] || 0
      const effectiveRarity = masterSticker.rarity + starBonus

      results.push({
        id: saved.stickerId,  // 複合ID（stickerId:upgradeRank）
        name: masterSticker.name,
        imageUrl: masterSticker.imageUrl,
        rarity: masterSticker.rarity as 1 | 2 | 3 | 4 | 5,
        type: masterSticker.type,
        series: masterSticker.series || 'シールガチャ',
        character: characterName,
        owned: totalQuantity > 0,  // 合計で所持判定（配置済みも所持扱い）
        quantity: totalQuantity,   // 合計所持数を表示（配置済み含む）
        rank: saved.totalAcquired > 3 ? 3 : saved.totalAcquired > 1 ? 2 : 1,
        totalAcquired: saved.totalAcquired || 0,
        firstAcquiredAt: saved.firstAcquiredAt || undefined,
        upgradeRank: rank,  // パースしたランク
        effectiveRarity,  // フィルタリング用の実効レアリティ
      })
    }

    // 2. 未所持シールをエントリ化（ノーマルランクとして）
    for (const master of masterStickers) {
      if (!ownedBaseIds.has(master.id)) {
        const characterName = master.name.split(' ')[0] || master.series || ''
        results.push({
          id: `${master.id}:0`,  // 複合ID（未所持はノーマルランク）
          name: master.name,
          imageUrl: master.imageUrl,
          rarity: master.rarity as 1 | 2 | 3 | 4 | 5,
          type: master.type,
          series: master.series || 'シールガチャ',
          character: characterName,
          owned: false,
          quantity: 0,
          rank: 0,
          totalAcquired: 0,
          firstAcquiredAt: undefined,
          upgradeRank: 0,
          effectiveRarity: master.rarity,  // 未所持はノーマルなのでボーナスなし
        })
      }
    }

    // 3. ソート：シリーズ → キャラクター名 → ランク降順
    results.sort((a, b) => {
      // まずシリーズ名でソート
      const seriesCompare = (a.series || '').localeCompare(b.series || '', 'ja')
      if (seriesCompare !== 0) return seriesCompare
      // 次に名前でソート
      const nameCompare = a.name.localeCompare(b.name, 'ja')
      if (nameCompare !== 0) return nameCompare
      // 同じシールならランク降順（高ランクが先）
      return (b.upgradeRank || 0) - (a.upgradeRank || 0)
    })

    return results
  }, [collection, placedStickers, masterStickers])

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
  // テストモードの場合は全シールを無限に貼れるようにする
  // 各ランクごとに別エントリとして返す（upgradeRank付き）
  const placeableStickers = useMemo(() => {
    // テストモードでは全シールを配置可能にする（無限に貼れる、ノーマルランクとして）
    if (adminMode === 'test') {
      return masterStickers.map(s => ({ ...s, upgradeRank: 0 }))
    }

    // 複合IDをパースする関数
    const parseCompositeId = (compositeId: string): { baseId: string; rank: number } => {
      const lastColonIndex = compositeId.lastIndexOf(':')
      if (lastColonIndex === -1) {
        return { baseId: compositeId, rank: 0 }
      }
      const baseId = compositeId.substring(0, lastColonIndex)
      const rank = parseInt(compositeId.substring(lastColonIndex + 1), 10) || 0
      return { baseId, rank }
    }

    // 通常モードでは所持数に基づいてフィルタリング
    // 各ランクごとに別エントリとして返す
    const result: (typeof masterStickers[0] & { upgradeRank: number })[] = []

    for (const collectionItem of collection) {
      const { baseId, rank } = parseCompositeId(collectionItem.stickerId)
      const quantity = collectionItem.quantity || 0
      if (quantity === 0) continue

      // マスターデータからシール情報を取得
      const masterSticker = masterStickers.find(s => s.id === baseId)
      if (!masterSticker) continue

      // このランクで既に配置されている数をカウント
      // PlacedStickerのstickerIdは複合IDで保存される
      const compositeStickerId = `${baseId}:${rank}`
      const placedCount = placedStickers.filter(p => p.stickerId === compositeStickerId).length

      // まだ貼れる枚数が残っているか
      const remainingCount = quantity - placedCount
      if (remainingCount <= 0) continue

      // ランク付きのエントリを追加
      result.push({
        ...masterSticker,
        // IDをランク付きに変更（トレイで区別できるように）
        id: compositeStickerId,
        upgradeRank: rank,
      })
    }

    // ランク順（高い方が先）、同ランク内は名前順でソート
    result.sort((a, b) => {
      if (b.upgradeRank !== a.upgradeRank) {
        return b.upgradeRank - a.upgradeRank
      }
      return a.name.localeCompare(b.name, 'ja')
    })

    return result
  }, [collection, placedStickers, masterStickers, adminMode])

  // 実際のデータから userStats を計算
  const userStats: UserStats = useMemo(() => {
    // コレクションからシール数を計算
    const totalStickers = collection.reduce((sum, item) => sum + item.quantity, 0)
    const uniqueStickers = collection.filter(item => item.quantity > 0).length

    // コンプリート数はdbStatsから取得（Supabaseで計算済み）
    const completedSeries = dbStats?.completedSeries ?? 0

    return {
      totalStickers,
      uniqueStickers,
      completedSeries,
      totalTrades: dbStats?.totalTrades ?? 0,
      friendsCount: dbStats?.friendsCount ?? 0,
      followersCount: dbStats?.followersCount ?? followCounts.followersCount,
      followingCount: dbStats?.followingCount ?? followCounts.followingCount,
      postsCount: dbStats?.postsCount ?? posts.length,
      reactionsReceived: dbStats?.reactionsReceived ?? 0,
    }
  }, [collection, posts, followCounts, dbStats])

  // 実績を動的に計算
  const achievements = useMemo(() => {
    // コレクションから最高レアリティを取得
    const highestRarity = collection.reduce((max, item) => {
      if (item.quantity > 0) {
        const sticker = masterStickers.find(s => s.id === item.stickerId)
        if (sticker && sticker.rarity > max) {
          return sticker.rarity
        }
      }
      return max
    }, 0)

    const achievementStats: AchievementStats = {
      totalStickers: userStats.totalStickers,
      uniqueStickers: userStats.uniqueStickers,
      placedStickers: placedStickers.length,
      gachaPulls: dbStats?.gachaPulls ?? gachaPulls,
      postsCount: userStats.postsCount,
      highestRarity,
      completedSeries: userStats.completedSeries,
      totalTrades: userStats.totalTrades,
      friendsCount: userStats.friendsCount,
      loginDays: dbStats?.loginDays ?? 1,
    }

    return calculateAchievements(achievementStats)
  }, [collection, placedStickers, gachaPulls, posts, userStats, dbStats])

  // SavedUserData.settingsをSettingsDataに変換
  const convertToSettingsData = useCallback((savedSettings: SavedUserData['settings']): SettingsData => ({
    notifications: {
      tradeRequests: savedSettings.notificationsEnabled,
      friendRequests: savedSettings.notificationsEnabled,
      newStickers: savedSettings.notificationsEnabled,
      contests: savedSettings.notificationsEnabled,
      dailyBonus: savedSettings.notificationsEnabled,
    },
    privacy: {
      publicProfile: true,
      showOnlineStatus: true,
      allowTradeRequests: true,
    },
    display: {
      theme: 'light',
      language: (savedSettings.language === 'ja' || savedSettings.language === 'en') ? savedSettings.language : 'ja',
    },
  }), [])

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
    // Data saved
  }, [isDataLoaded, buildSavedUserData, currentUser])

  // 初回読み込み（認証完了を待ってからSupabase対応）
  useEffect(() => {
    // 認証中は待機
    if (isAuthLoading) {
      // Waiting for auth...
      return
    }

    // 認証失敗時はローカルモードで動作
    if (!currentUser) {
      // Auth failed, using local data
      const loadData = async () => {
        const mode = loadAdminMode()
        setAdminMode(mode)

        let userData = loadCurrentUserData()
        if (!userData) {
          // No saved data, creating initial
          userData = createInitialUserData()
        }

        // ローカルデータを読み込み
        setCollection(userData.collection.map(item => ({
          stickerId: item.stickerId,
          quantity: item.quantity,
          totalAcquired: item.totalAcquired,
          firstAcquiredAt: item.firstAcquiredAt || new Date().toISOString(),
          upgradeRank: item.upgradeRank ?? 0,  // アップグレードランクを含める
        })))
        setPlacedStickers(userData.placedStickers)
        setPlacedDecoItems(userData.placedDecoItems)
        setPages(userData.pages)
        setCoverDesignId(userData.coverDesignId)
        setUserMonetization(userData.monetization)
        setTotalExp(userData.profile.totalExp)
        totalExpRef.current = userData.profile.totalExp // refも更新
        setSettings(convertToSettingsData(userData.settings))

        // Local data loaded (offline mode)
        setIsDataLoaded(true)
      }
      loadData()
      return
    }

    const loadData = async () => {
      const mode = loadAdminMode()
      setAdminMode(mode)

      // Loading data for authenticated user

      // データソースを判定
      const dataSource = getDataSource()
      setCurrentDataSource(dataSource)

      let userData = loadCurrentUserData()
      let supabaseAvatarUrl: string | null = null // Supabaseから読み込んだアバターURL
      let loadedMasterStickers: Sticker[] = [] // ロードしたマスターシール（後でスカウト設定の補完に使用）

      // マスターシールデータは常にSupabaseから読み込む（テストモードでも全シールを使えるようにする）
      // 注意: React Strict Modeで2回実行される場合に備え、毎回ロードしてローカル変数に保持する
      if (dataSource === 'supabase') {
        try {
          const supabaseStickers = await loadAllStickersFromSupabase()
          if (supabaseStickers.length > 0) {
            // Supabaseの型をローカルのSticker型に変換
            const convertedStickers: Sticker[] = supabaseStickers.map(s => ({
              id: s.id,
              name: s.name,
              imageUrl: s.image_url,
              rarity: s.rarity as 1 | 2 | 3 | 4 | 5,
              type: (s.type as 'normal' | 'puffy' | 'sparkle') || 'normal',
              series: s.series || undefined,
              gachaWeight: s.gacha_weight || 1,
              baseRate: s.base_rate || 100,
            }))
            // 自然順ソート（#1, #2, ... #10 のように数値として正しくソート）
            const naturalSort = (a: Sticker, b: Sticker) => {
              // 名前から番号を抽出（「キャラ名 #1」または「キャラ名 1」形式に対応）
              const extractNumber = (name: string): { base: string; num: number } => {
                // #付きパターン: 「いちごにゃん #1」
                const hashMatch = name.match(/^(.+?)\s*#(\d+)$/)
                if (hashMatch) {
                  return { base: hashMatch[1].trim(), num: parseInt(hashMatch[2], 10) }
                }
                // スペース+数字パターン: 「ウールン 1」
                const spaceMatch = name.match(/^(.+?)\s+(\d+)$/)
                if (spaceMatch) {
                  return { base: spaceMatch[1].trim(), num: parseInt(spaceMatch[2], 10) }
                }
                return { base: name, num: 0 }
              }
              const aInfo = extractNumber(a.name)
              const bInfo = extractNumber(b.name)
              // まずキャラクター名でソート
              const baseCompare = aInfo.base.localeCompare(bInfo.base, 'ja')
              if (baseCompare !== 0) return baseCompare
              // 同じキャラクターなら番号でソート
              return aInfo.num - bInfo.num
            }
            const sortedStickers = [...convertedStickers].sort(naturalSort)
            // state更新（まだ読み込まれていない場合のみ、不要な再レンダリングを防ぐ）
            if (!isMasterStickersLoaded) {
              setMasterStickers(sortedStickers)
              setIsMasterStickersLoaded(true)
            }
            loadedMasterStickers = sortedStickers // スカウト設定の補完用に保持（毎回確実に設定）
          }
        } catch (error) {
          console.error('[Supabase] Failed to load master stickers:', error)
          // エラー時はstate変数にフォールバック
          loadedMasterStickers = masterStickers
        }
      } else {
        // 非Supabaseモードではstate変数を使用
        loadedMasterStickers = masterStickers
      }

      // Supabaseモードかつテストモードでない場合、コレクションをSupabaseから読み込み
      if (dataSource === 'supabase' && mode !== 'test') {
        try {
          const supabaseCollection = await loadCollectionFromSupabase(currentUser.id)
          if (supabaseCollection.length > 0) {
            // Supabaseのコレクションをマージ
            if (!userData) {
              userData = createInitialUserDataForTestUser(currentUser.id)
            }
            userData.collection = supabaseCollection
          }

          // シール帳データ（シール配置 + デコ配置）もSupabaseから読み込み
          const stickerBook = await stickerBookService.getUserStickerBook(currentUser.supabaseId)
          if (stickerBook && stickerBook.pages.length > 0) {

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

            // userDataを更新
            if (!userData) {
              userData = createInitialUserDataForTestUser(currentUser.id)
            }
            userData.pages = supabasePages
            userData.placedStickers = supabasePlacedStickers
            userData.placedDecoItems = supabasePlacedDecoItems
          }

          // プロフィールもSupabaseから読み込み
          const supabaseProfile = await profileService.getProfile(currentUser.supabaseId)
          if (supabaseProfile) {
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
          }

          // フォロワー/フォロー数を取得
          const followCountsData = await profileService.getFollowCounts(currentUser.supabaseId)
          setFollowCounts(followCountsData)

          // ユーザー統計をSupabaseから取得
          try {
            const userStatsData = await statsService.getUserStats(currentUser.supabaseId)
            if (userStatsData) {
              setDbStats(userStatsData)
            }
          } catch (statsError) {
            console.error('[Supabase] Failed to load user stats:', statsError)
          }

          // 通貨データをSupabaseから読み込み
          try {
            const supabaseCurrency = await loadCurrencyFromSupabase(currentUser.supabaseId)
            if (supabaseCurrency) {
              setUserMonetization(prev => ({
                ...prev,
                tickets: supabaseCurrency.tickets,
                gems: supabaseCurrency.gems,
                stars: supabaseCurrency.stars,
              }))
            }
          } catch (currencyError) {
            console.error('[Supabase] Failed to load currency:', currencyError)
          }

          // ミステリーポストデータをSupabaseから読み込み
          try {
            const [userPosts, receivedStickers, canPost] = await Promise.all([
              mysteryPostService.getUserPosts(currentUser.supabaseId),
              mysteryPostService.getReceivedStickers(currentUser.supabaseId),
              mysteryPostService.canPostToday(currentUser.supabaseId),
            ])

            if (userPosts.length > 0 || receivedStickers.length > 0) {

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

              // スカウト設定をドメイン形式に変換（loadedMasterStickersから詳細を補完）
              const wantListForState: ScoutSticker[] = (scoutSettings?.wantList || []).map(w => {
                const master = loadedMasterStickers.find(s => s.id === w.stickerId)
                return {
                  stickerId: w.stickerId,
                  stickerName: master?.name || '',
                  stickerImageUrl: master?.imageUrl || '',
                  rarity: master?.rarity || 1,
                }
              })

              const offerListForState: ScoutSticker[] = (scoutSettings?.offerList || []).map(o => {
                const master = loadedMasterStickers.find(s => s.id === o.stickerId)
                return {
                  stickerId: o.stickerId,
                  stickerName: master?.name || '',
                  stickerImageUrl: master?.imageUrl || '',
                  rarity: master?.rarity || 1,
                }
              })

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
      totalExpRef.current = userData.profile.totalExp // refも更新
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
      console.log('[Data] Data loaded for user:', currentUser.id, ', collection:', userData.collection.length, 'stickers, totalExp:', userData.profile.totalExp, '(source:', dataSource, ')')
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

          // 投稿者のユーザーIDを収集（自分以外）
          const otherUserIds = [...new Set(
            supabasePosts
              .map(p => p.user_id)
              .filter(id => id !== currentUser.supabaseId)
          )]

          // フォロー状態を一括取得
          const followStatuses = otherUserIds.length > 0
            ? await profileService.getFollowStatusBatch(currentUser.supabaseId, otherUserIds)
            : {}
          console.log('[Timeline] Loaded follow statuses for', Object.keys(followStatuses).length, 'users')

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
                    upgradeRank: s.upgradeRank,
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

            // DBの'like'をUIの'heart'に変換し、heartのみを抽出
            const likeReaction = sp.reactions?.find(r => r.type === 'like')
            const heartReaction: Post['reactions'][0] = {
              type: 'heart' as ReactionType,
              count: likeReaction?.count || sp.like_count || 0,
              isReacted: likeReaction?.isReacted || false,
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
              reactions: [heartReaction],
              commentCount: sp.comment_count || 0,
              createdAt: sp.created_at,
              isFollowing: sp.isFollowing,
              followStatus: followStatuses[sp.user_id] || 'none',
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
  const handleGrantSticker = useCallback(async (stickerId: string, quantity: number) => {
    const newStickerIds = Array(quantity).fill(stickerId)

    // Supabaseモードの場合はSupabaseにも保存
    if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
      console.log('[Admin] Adding stickers to Supabase:', stickerId, 'x', quantity)
      const result = await addStickersToSupabase(currentUser.supabaseId, newStickerIds)
      console.log('[Admin] Supabase result:', result)

      // Supabaseからコレクションを再読み込み
      if (result.success) {
        const supabaseCollection = await loadCollectionFromSupabase(currentUser.supabaseId)
        const localCollection: SavedCollectionItem[] = supabaseCollection.map(item => ({
          stickerId: item.stickerId,
          quantity: item.quantity || 0,
          totalAcquired: item.totalAcquired || 0,
          firstAcquiredAt: item.firstAcquiredAt || null,
          upgradeRank: item.upgradeRank ?? 0,
        }))
        setCollection(localCollection)
      }
    } else {
      // ローカルストレージモードの場合
      const { collection: newCollection } = addStickersToCollection(collection, newStickerIds)
      setCollection(newCollection)
    }
  }, [collection, currentDataSource, currentUser?.supabaseId])

  // 全シール付与（管理者用）
  const handleGrantAllStickers = useCallback(async () => {
    // Supabaseモードの場合はSupabaseにも保存
    if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
      console.log('[Admin] Adding all stickers to Supabase')
      const result = await addStickersToSupabase(currentUser.supabaseId, allStickerIds)
      console.log('[Admin] Supabase result:', result)

      // Supabaseからコレクションを再読み込み
      if (result.success) {
        const supabaseCollection = await loadCollectionFromSupabase(currentUser.supabaseId)
        const localCollection: SavedCollectionItem[] = supabaseCollection.map(item => ({
          stickerId: item.stickerId,
          quantity: item.quantity || 0,
          totalAcquired: item.totalAcquired || 0,
          firstAcquiredAt: item.firstAcquiredAt || null,
          upgradeRank: item.upgradeRank ?? 0,
        }))
        setCollection(localCollection)
      }
    } else {
      // ローカルストレージモードの場合
      const { collection: newCollection } = addStickersToCollection(collection, allStickerIds)
      setCollection(newCollection)
    }
  }, [collection, allStickerIds, currentDataSource, currentUser?.supabaseId])

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
  // 注: totalExpRefを使用してクロージャのstale値問題を回避
  const gainExp = useCallback((action: ExpAction) => {
    // refから最新の経験値を取得（クロージャの古い値を回避）
    const currentTotalExp = totalExpRef.current
    console.log('[Exp] gainExp called:', action, 'current totalExp:', currentTotalExp)

    const result = addExp(currentTotalExp, action)
    console.log('[Exp] addExp result:', result)

    // 状態とrefの両方を更新
    setTotalExp(result.newTotalExp)
    totalExpRef.current = result.newTotalExp

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
    if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
      profileService.setExp(currentUser.supabaseId, result.newTotalExp)
        .then(success => {
          if (success) {
            console.log('[Exp] Saved to Supabase:', result.newTotalExp)
          } else {
            console.error('[Exp] Failed to save to Supabase (returned false)')
          }
        })
        .catch(err => console.error('[Exp] Failed to save to Supabase:', err))
    }

    return result
  }, [currentDataSource, currentUser?.supabaseId])

  const handlePageTurn = useCallback((pageIndex: number) => {
    setCurrentPage(pageIndex)
  }, [])

  // UUID形式かどうかを判定
  const isUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(str)
  }

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
      stickerId: selectedSticker.id, // 複合ID（例: "sticker-1:1"）
      sticker: selectedSticker,
      pageId,
      x,
      y,
      rotation,
      scale: 1,
      zIndex: placedStickers.length + 1,
      placedAt: new Date().toISOString(),
      upgradeRank: selectedSticker.upgradeRank ?? 0, // アップグレードランクを記録
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

    // Supabaseモードかつテストモードでない場合、配置をSupabaseに同期
    // テストモードではユーザーが実際にシールを所持していないため、同期をスキップ
    if (currentDataSource === 'supabase' && adminMode !== 'test') {
      (async () => {
        try {
          // pageIdがUUID形式でない場合、Supabaseからシール帳を初期化
          if (!isUUID(pageId)) {
            console.warn('[Supabase] Invalid page ID format (not UUID):', pageId)
            console.log('[Supabase] Creating sticker book for user...')

            if (!currentUser?.supabaseId) {
              console.error('[Supabase] No supabase user ID')
              return
            }

            // シール帳を作成または取得
            const stickerBook = await stickerBookService.createStickerBook(currentUser.supabaseId)
            if (!stickerBook) {
              console.error('[Supabase] Failed to create sticker book')
              return
            }

            // ページデータを更新
            const supabasePages: BookPage[] = stickerBook.pages.map(page => ({
              id: page.id,
              type: page.pageType as 'cover' | 'page' | 'back-cover' | 'inner-cover',
              side: page.side as 'left' | 'right' | undefined,
            }))
            setPages(supabasePages)

            console.log('[Supabase] Sticker book initialized, please try placing the sticker again')
            return
          }

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

            // ミッション進捗を記録（シール帳保存）
            if (currentUser?.id) {
              statsService.recordStickerBookSave(currentUser.id).then(success => {
                if (success) {
                  console.log('[StickerBook] Mission progress recorded for sticker placement')
                }
              }).catch(error => {
                console.error('[StickerBook] Failed to record mission progress:', error)
              })
            }
          }
        } catch (error) {
          console.error('[Supabase] Failed to sync placement:', error)
        }
      })()
    }
  }, [selectedSticker, placedStickers, gainExp, isSpreadView, pages, collection, currentDataSource, currentUser, adminMode])

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
                  id: rs.postId,
                  stickerId: rs.stickerId,
                  stickerName: rs.stickerName,
                  stickerImageUrl: rs.stickerImageUrl,
                  rarity: rs.stickerRarity,
                  message: (rs.message as PresetMessage) || '大切にしてね！',
                  fromUserName: rs.senderName,
                  receivedAt: rs.deliveredAt,
                  isOpened: false, // デフォルトは未開封
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
                    const sticker = masterStickers.find(s => s.id === sid)
                    return {
                      stickerId: sid,
                      stickerName: sticker?.name || 'Unknown',
                      stickerImageUrl: sticker?.imageUrl || '',
                      rarity: sticker?.rarity || 1,
                    }
                  }),
                  theirOffersIWant: m.wantsMatched.map(sid => {
                    const sticker = masterStickers.find(s => s.id === sid)
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
  }, [currentDataSource, currentUser, masterStickers])

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
                    const sticker = masterStickers.find(s => s.id === sid)
                    return {
                      stickerId: sid,
                      stickerName: sticker?.name || 'Unknown',
                      stickerImageUrl: sticker?.imageUrl || '',
                      rarity: sticker?.rarity || 1,
                    }
                  }),
                  theirOffersIWant: m.wantsMatched.map(sid => {
                    const sticker = masterStickers.find(s => s.id === sid)
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
  }, [currentDataSource, currentUser, masterStickers])

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
    const totalWeight = masterStickers.reduce((sum, s) => sum + (s.gachaWeight || 1), 0)
    let random = Math.random() * totalWeight

    for (const sticker of masterStickers) {
      random -= (sticker.gachaWeight || 1)
      if (random <= 0) {
        return sticker
      }
    }
    // フォールバック
    return masterStickers[masterStickers.length - 1]
  }, [masterStickers])

  // ガチャ実行の内部処理（通貨チェック済み、どろっぷ使用フラグ付き）
  const executeGachaPull = useCallback(async (bannerId: string, count: number, useDrops: boolean = false) => {
    const banner = demoBanners.find(b => b.id === bannerId)
    if (!banner) return

    const cost = count === 1 ? banner.costSingle : banner.costMulti

    // Supabase同期の場合は先に通貨を消費
    if (currentDataSource === 'supabase' && currentUser?.id) {
      console.log('[Gacha] Deducting currency via Supabase, useDrops:', useDrops)

      // 通貨タイプに応じてコスト計算（どろっぷでの代替コスト）
      const dropCost = banner.currency === 'ticket'
        ? (count === 1 ? GACHA_COSTS.normal.singleStars : GACHA_COSTS.normal.tenStars)
        : (count === 1 ? GACHA_COSTS.premium.singleStars : GACHA_COSTS.premium.tenStars)

      let deductResult
      if (banner.currency === 'ticket') {
        deductResult = await deductGachaCurrency(currentUser.id, cost, dropCost, useDrops)
      } else if (banner.currency === 'gem') {
        deductResult = await deductPremiumGachaCurrency(currentUser.id, cost, dropCost, useDrops)
      } else {
        // star currency - どろっぷで直接消費
        deductResult = await deductGachaCurrency(currentUser.id, 0, cost, true)
      }

      if (!deductResult.success) {
        console.error('[Gacha] Failed to deduct currency from Supabase')
        // 通貨不足モーダルを表示
        if (deductResult.canUseDropsInstead) {
          setInsufficientFundsModal({
            isOpen: true,
            fundType: banner.currency === 'ticket' ? 'tickets' : banner.currency === 'gem' ? 'gems' : 'stars',
            required: cost,
            current: banner.currency === 'ticket' ? userMonetization.tickets : banner.currency === 'gem' ? userMonetization.gems : userMonetization.stars,
            canUseDropsInstead: true,
            dropsRequired: deductResult.dropsRequired,
            pendingGacha: { bannerId, count },
          })
        }
        return
      }

      // ローカル状態も更新
      if (deductResult.newBalance) {
        setUserMonetization(prev => ({
          ...prev,
          tickets: deductResult.newBalance!.tickets,
          gems: deductResult.newBalance!.gems,
          stars: deductResult.newBalance!.stars,
        }))
      }
    } else {
      // ローカルのみの場合は従来通り
      if (banner.currency === 'ticket') {
        setUserMonetization(prev => ({ ...prev, tickets: Math.max(0, prev.tickets - cost) }))
      } else if (banner.currency === 'star') {
        setUserMonetization(prev => ({ ...prev, stars: Math.max(0, prev.stars - cost) }))
      } else if (banner.currency === 'gem') {
        setUserMonetization(prev => ({ ...prev, gems: Math.max(0, prev.gems - cost) }))
      }
    }

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
    setGachaPulls(prev => prev + count) // ガチャ回数をトラッキング

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

      // ミッション進捗を記録（ガチャ回数）
      statsService.recordGachaPull(currentUser.id, count).then(success => {
        if (success) {
          console.log('[Gacha] Mission progress recorded for gacha pull')
        }
      }).catch(error => {
        console.error('[Gacha] Failed to record mission progress:', error)
      })
    }

    // 経験値獲得（1回引く: +10 EXP, 10連: +100 EXP）
    gainExp(count === 1 ? 'gacha_single' : 'gacha_ten')
  }, [gainExp, collection, currentDataSource, currentUser, userMonetization, weightedRandomPull])

  // ガチャを引く（通貨チェック付き）
  const handlePullGacha = useCallback((bannerId: string, count: number) => {
    const banner = demoBanners.find(b => b.id === bannerId)
    if (!banner) return

    const cost = count === 1 ? banner.costSingle : banner.costMulti

    // 通貨チェック
    let currentCurrency = 0
    let fundType: 'tickets' | 'gems' | 'stars' = 'tickets'
    let dropCost = 0

    if (banner.currency === 'ticket') {
      currentCurrency = userMonetization.tickets
      fundType = 'tickets'
      dropCost = count === 1 ? GACHA_COSTS.normal.singleStars : GACHA_COSTS.normal.tenStars
    } else if (banner.currency === 'gem') {
      currentCurrency = userMonetization.gems
      fundType = 'gems'
      dropCost = count === 1 ? GACHA_COSTS.premium.singleStars : GACHA_COSTS.premium.tenStars
    } else {
      currentCurrency = userMonetization.stars
      fundType = 'stars'
      dropCost = cost
    }

    // 通貨不足の場合
    if (currentCurrency < cost) {
      // どろっぷで代替可能かチェック
      const canUseDrops = fundType !== 'stars' && userMonetization.stars >= dropCost

      setInsufficientFundsModal({
        isOpen: true,
        fundType,
        required: cost,
        current: currentCurrency,
        canUseDropsInstead: canUseDrops,
        dropsRequired: dropCost,
        pendingGacha: { bannerId, count },
      })
      return
    }

    // 通貨が足りている場合は実行
    executeGachaPull(bannerId, count, false)
  }, [userMonetization, executeGachaPull])

  // Handle reactions
  const handleReaction = useCallback(async (postId: string, reactionType: ReactionType) => {
    if (!currentUser) return

    // 現在のリアクション状態を確認（リアクション追加か削除かを判定）
    const currentPost = posts.find(p => p.id === postId)
    const currentReaction = currentPost?.reactions.find(r => r.type === reactionType)
    const isAddingReaction = !currentReaction?.isReacted

    // UIを即座に更新（楽観的更新）
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

    // DBに保存（type変換: heart -> like）
    const dbType = reactionType === 'heart' ? 'like' : reactionType
    try {
      await timelineService.toggleReaction(postId, currentUser.id, dbType as 'like' | 'sparkle' | 'hot' | 'cute')

      // リアクション追加時のみミッション進捗を記録
      if (isAddingReaction) {
        statsService.recordReaction(currentUser.id).then(success => {
          if (success) {
            console.log('[Timeline] Mission progress recorded for reaction')
          }
        }).catch(error => {
          console.error('[Timeline] Failed to record mission progress:', error)
        })
      }
    } catch (error) {
      console.error('[Timeline] リアクション保存エラー:', error)
      // エラー時は元に戻す
      setPosts(prev => prev.map(post => {
        if (post.id !== postId) return post
        const newReactions = post.reactions.map(r => {
          if (r.type === reactionType) {
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
    }
  }, [currentUser, posts])

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
  const handleInsufficientFunds = useCallback((fundType: 'tickets' | 'gems' | 'stars', required: number, current: number) => {
    setInsufficientFundsModal({
      isOpen: true,
      fundType,
      required,
      current,
      canUseDropsInstead: false,
      dropsRequired: 0,
      pendingGacha: null,
    })
  }, [])

  // Close insufficient funds modal
  const handleCloseInsufficientFunds = useCallback(() => {
    setInsufficientFundsModal(prev => ({
      ...prev,
      isOpen: false,
      pendingGacha: null,
    }))
  }, [])

  // どろっぷでガチャを引く
  const handleUseDropsForGacha = useCallback(() => {
    const { pendingGacha } = insufficientFundsModal
    if (!pendingGacha) return

    // モーダルを閉じてから実行
    setInsufficientFundsModal(prev => ({
      ...prev,
      isOpen: false,
      pendingGacha: null,
    }))

    // どろっぷを使用してガチャを実行
    executeGachaPull(pendingGacha.bannerId, pendingGacha.count, true)
  }, [insufficientFundsModal, executeGachaPull])

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
    const processDailyBonus = async () => {
      if (!needsDailyReset(userMonetization.lastDailyReset)) return

      // Calculate bonus amounts
      const plan = userMonetization.subscription === 'none'
        ? { dailyBonusTickets: 0, skipAds: false, dailyStars: 0 }
        : { dailyBonusTickets: 2, skipAds: userMonetization.subscription !== 'light', dailyStars: userMonetization.subscription === 'light' ? 5 : userMonetization.subscription === 'plus' ? 15 : 30 }

      const baseTickets = 3 // DAILY_FREE_TICKETS
      const adSkipTickets = plan.skipAds ? 10 : 0 // MAX_AD_WATCHES_PER_DAY
      const totalTickets = baseTickets + plan.dailyBonusTickets + adSkipTickets
      const totalStars = plan.dailyStars

      // Supabase同期の場合はDBに付与
      if (currentDataSource === 'supabase' && currentUser?.id) {
        console.log('[DailyBonus] Granting to Supabase:', { totalTickets, totalStars })
        const result = await grantDailyBonusToSupabase(currentUser.id, totalTickets, totalStars)
        if (result.success && result.newBalance) {
          setUserMonetization(prev => ({
            ...prev,
            tickets: result.newBalance!.tickets,
            gems: result.newBalance!.gems,
            stars: result.newBalance!.stars,
            lastDailyReset: new Date().toISOString().split('T')[0],
            dailyTicketsCollected: true,
            dailyStarsCollected: true,
            completedMissions: [] as string[],
            adsWatchedToday: 0,
          }))

          // デイリーログインを記録（ミッション進捗も更新）
          statsService.recordDailyLogin(currentUser.id).then(result => {
            if (result.success) {
              console.log('[DailyBonus] Daily login recorded, streak:', result.loginStreak)
            }
          }).catch(error => {
            console.error('[DailyBonus] Failed to record daily login:', error)
          })
        } else {
          // フォールバック：ローカルのみ更新
          setUserMonetization(prev => {
            let state: UserMonetization = { ...prev, lastDailyReset: new Date().toISOString().split('T')[0], dailyTicketsCollected: false, dailyStarsCollected: false, completedMissions: [] as string[], adsWatchedToday: 0 }
            state = collectDailyTickets(state)
            state = collectDailyStars(state)
            return state
          })
        }
      } else {
        // ローカルのみの場合は従来通り
        setUserMonetization(prev => {
          let state: UserMonetization = { ...prev, lastDailyReset: new Date().toISOString().split('T')[0], dailyTicketsCollected: false, dailyStarsCollected: false, completedMissions: [] as string[], adsWatchedToday: 0 }
          state = collectDailyTickets(state)
          state = collectDailyStars(state)
          return state
        })
      }

      setDailyBonusReceived({
        tickets: totalTickets,
        stars: totalStars,
      })
      setIsDailyBonusModalOpen(true)
    }

    processDailyBonus()
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
        // UIを隠すべきかどうか（モーダル表示中またはシール操作中またはデコ編集中またはレイヤーパネル表示中またはショップ表示中）
        const shouldHideUI = isPageEditModalOpen || isStickerOperating || isDecoEditing || isLayerPanelOpen || isShopOpen

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
                  // シール帳の左に5pxのパディング（右は不要）
                  paddingLeft: '5px',
                  paddingRight: '0px',
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
                onClick={() => {
                  // BookViewからコンテナを取得してシェアモーダルを開く
                  const container = bookRef.current?.getBookContainer()
                  if (container) {
                    shareBookContainerRef.current = container
                  }
                  setIsBookShareModalOpen(true)
                }}
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
                className="relative w-11 h-11 active:scale-95 transition-transform"
                aria-label="レイヤー"
                disabled={currentPageLayerItems.length === 0}
                style={{
                  opacity: currentPageLayerItems.length === 0 ? 0.5 : 1,
                }}
              >
                <img
                  src="/images/Home_Button/kasanari_Button.png"
                  alt=""
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </button>
              {/* デコボタン（デコ素材選択ドロワーを開く） */}
              <button
                onClick={() => setIsDecoDrawerOpen(prev => !prev)}
                className={`relative w-11 h-11 active:scale-95 transition-transform ${isDecoDrawerOpen ? 'ring-2 ring-pink-300 rounded-xl' : ''}`}
                aria-label="デコ"
              >
                <img
                  src="/images/Home_Button/Deco_Button.png"
                  alt=""
                  className="w-full h-full object-contain"
                  draggable={false}
                />
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
            {/* サブタブセレクター - 茶色・ベージュ系 */}
            <div
              className="flex shrink-0"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderBottom: '3px solid #B8956B',
                boxShadow: '0 2px 8px rgba(184, 149, 107, 0.3)',
              }}
            >
              <button
                onClick={() => setTradeSubTab('trade')}
                className="flex-1 py-3 font-bold text-sm transition-all"
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  color: tradeSubTab === 'trade' ? '#8B5A2B' : '#C4A484',
                  borderBottom: tradeSubTab === 'trade' ? '3px solid #8B5A2B' : '3px solid transparent',
                  marginBottom: '-3px',
                }}
              >
                🤝 こうかん
              </button>
              <button
                onClick={() => setTradeSubTab('mystery')}
                className="flex-1 py-3 font-bold text-sm transition-all relative"
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  color: tradeSubTab === 'mystery' ? '#8B5A2B' : '#C4A484',
                  borderBottom: tradeSubTab === 'mystery' ? '3px solid #8B5A2B' : '3px solid transparent',
                  marginBottom: '-3px',
                }}
              >
                📮 ポスト
                {/* 未開封バッジ */}
                {mysteryPostState.receivedStickers.filter(s => !s.isOpened).length > 0 && (
                  <span className="absolute -top-1 right-2 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#D4764A' }}>
                    {mysteryPostState.receivedStickers.filter(s => !s.isOpened).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTradeSubTab('scout')}
                className="flex-1 py-3 font-bold text-sm transition-all relative"
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  color: tradeSubTab === 'scout' ? '#8B5A2B' : '#C4A484',
                  borderBottom: tradeSubTab === 'scout' ? '3px solid #8B5A2B' : '3px solid transparent',
                  marginBottom: '-3px',
                }}
              >
                🔍 スカウト
                {/* マッチングバッジ */}
                {tradeScoutState.matches.filter(m => !m.isRead).length > 0 && (
                  <span className="absolute -top-1 right-2 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#7DAF72' }}>
                    {tradeScoutState.matches.filter(m => !m.isRead).length}
                  </span>
                )}
              </button>
            </div>

            {/* コンテンツ */}
            <div className="flex-1 overflow-hidden">
              {tradeSubTab === 'trade' && (
                <TradeView
                  userId={currentUser?.supabaseId}
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
                  // 非同期交換で TradeSessionFull に渡すデータ
                  myUser={currentUser ? {
                    id: currentUser.supabaseId,
                    name: currentUser.name,
                    avatarUrl: undefined,
                    level: 5,
                    bio: 'シール交換はじめました！',
                    totalStickers: collection.length,
                    totalTrades: 0,
                  } : undefined}
                  myPages={myTradePages}
                  myCoverDesignId={coverDesignId}
                  onAsyncSessionChange={setIsAsyncTradeSessionOpen}
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
            posts={
              activeTimelineTab === 'liked' ? likedPosts :
              activeTimelineTab === 'following' ? followingPosts :
              posts
            }
            currentUserId={currentUser?.id}
            onReact={handleReaction}
            activeTab={activeTimelineTab}
            onTabChange={async (tab) => {
              setActiveTimelineTab(tab)
              // フォロー中タブの場合、フォロー中ユーザーの投稿を取得
              if (tab === 'following' && currentUser?.supabaseId) {
                console.log('[Timeline] Fetching following posts for user:', currentUser.supabaseId)
                try {
                  const followingData = await timelineService.getFollowingTimeline(currentUser.supabaseId)
                  console.log('[Timeline] Fetched', followingData.length, 'following posts')

                  // 投稿者のユーザーIDを収集
                  const otherUserIds = [...new Set(
                    followingData
                      .map(p => p.user_id)
                      .filter(id => id !== currentUser.supabaseId)
                  )]

                  // フォロー状態を一括取得
                  const followStatuses = otherUserIds.length > 0 && currentUser.supabaseId
                    ? await profileService.getFollowStatusBatch(currentUser.supabaseId, otherUserIds)
                    : {}

                  // Post形式に変換（シール帳ページデータも取得）
                  const formattedPosts: Post[] = await Promise.all(followingData.map(async (p) => {
                    let pageData: Post['pageData'] = undefined
                    if (p.page_id) {
                      const pageResult = await stickerBookService.getPageById(p.page_id)
                      if (pageResult) {
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
                            upgradeRank: s.upgradeRank,
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
                      }
                    }

                    return {
                      id: p.id,
                      userId: p.user_id,
                      userName: p.author?.display_name || p.author?.username || '名無し',
                      userAvatarUrl: p.author?.avatar_url || undefined,
                      pageImageUrl: p.image_url || undefined,
                      pageData,
                      caption: p.caption || '',
                      hashtags: p.hashtags || [],
                      reactions: [{
                        type: 'heart' as const,
                        count: p.like_count || 0,
                        isReacted: p.reactions?.find(r => r.type === 'like')?.isReacted || false
                      }],
                      commentCount: p.comment_count || 0,
                      createdAt: p.created_at || new Date().toISOString(),
                      isFollowing: true, // フォロー中タブなので常にtrue
                      followStatus: followStatuses[p.user_id] || 'following',
                      visibility: p.visibility as 'public' | 'friends',
                    }
                  }))
                  setFollowingPosts(formattedPosts)
                  console.log('[Timeline] Following posts set:', formattedPosts.length)
                } catch (error) {
                  console.error('[Timeline] フォロー中投稿取得エラー:', error)
                }
              }
              // いいねタブの場合、いいね済み投稿を取得
              if (tab === 'liked' && currentUser) {
                try {
                  const likedData = await timelineService.getLikedPosts(currentUser.id)

                  // 投稿者のユーザーIDを収集（自分以外）
                  const otherUserIds = [...new Set(
                    likedData
                      .map(p => p.user_id)
                      .filter(id => id !== currentUser.supabaseId)
                  )]

                  // フォロー状態を一括取得
                  const followStatuses = otherUserIds.length > 0 && currentUser.supabaseId
                    ? await profileService.getFollowStatusBatch(currentUser.supabaseId, otherUserIds)
                    : {}
                  console.log('[Timeline/Liked] Loaded follow statuses for', Object.keys(followStatuses).length, 'users')

                  // Post形式に変換（シール帳ページデータも取得）
                  const formattedPosts: Post[] = await Promise.all(likedData.map(async (p) => {
                    // page_idがある場合はシール帳ページデータを取得
                    let pageData: Post['pageData'] = undefined
                    if (p.page_id) {
                      const pageResult = await stickerBookService.getPageById(p.page_id)
                      if (pageResult) {
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
                            upgradeRank: s.upgradeRank,
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
                        console.log('[Timeline/Liked] Page data loaded for post:', p.id, 'stickers:', pageData.placedStickers.length)
                      }
                    }

                    return {
                      id: p.id,
                      userId: p.user_id,
                      userName: p.author?.display_name || p.author?.username || '名無し',
                      userAvatarUrl: p.author?.avatar_url || undefined,
                      pageImageUrl: p.image_url || undefined,
                      pageData,
                      caption: p.caption || '',
                      hashtags: p.hashtags || [],
                      reactions: [{
                        type: 'heart' as const,
                        count: p.like_count || 0,
                        isReacted: true // いいね済み投稿なので常にtrue
                      }],
                      commentCount: p.comment_count || 0,
                      createdAt: p.created_at || new Date().toISOString(),
                      isFollowing: p.isFollowing,
                      followStatus: followStatuses[p.user_id] || 'none',
                      visibility: p.visibility as 'public' | 'friends',
                    }
                  }))
                  setLikedPosts(formattedPosts)
                } catch (error) {
                  console.error('[Timeline] いいね済み投稿取得エラー:', error)
                }
              }
            }}
            onComment={async (postId) => {
              const allPosts = activeTimelineTab === 'liked' ? likedPosts :
                              activeTimelineTab === 'following' ? followingPosts :
                              posts
              const post = allPosts.find(p => p.id === postId)
              if (post) {
                setSelectedPost(post)
                // コメント取得
                try {
                  const comments = await timelineService.getComments(postId)
                  const formattedComments: Comment[] = comments.map(c => ({
                    id: c.id,
                    userId: c.user.id,
                    userName: c.user.display_name || c.user.username,
                    userAvatarUrl: c.user.avatar_url || undefined,
                    content: c.content,
                    createdAt: c.created_at,
                    isOwner: c.user.id === currentUser?.id,
                  }))
                  setPostComments(formattedComments)
                } catch (error) {
                  console.error('[Timeline] コメント取得エラー:', error)
                  setPostComments([])
                }
                setIsCommentModalOpen(true)
              }
            }}
            onUserClick={async (userId) => {
              // 実際のユーザープロフィールとシール帳データを取得
              try {
                console.log('[Timeline] ユーザープロフィール取得開始:', userId)

                // プロフィール取得
                const profileData = await profileService.getOtherUserProfile(userId, currentUser?.id)
                if (!profileData) {
                  console.error('[Timeline] プロフィール取得失敗:', userId)
                  return
                }

                // シール帳データ取得
                const stickerBook = await stickerBookService.getUserStickerBook(userId)

                // OtherUserProfile形式に変換
                const userProfile: OtherUserProfile = {
                  id: profileData.id,
                  name: profileData.name,
                  avatarUrl: profileData.avatarUrl || undefined,
                  level: profileData.level,
                  title: profileData.title,
                  bio: profileData.bio,
                  isFollowing: profileData.isFollowing,
                  stats: profileData.stats,
                }

                // シール帳ページとシールを整形（表紙も含める）
                const bookPages: BookPage[] = stickerBook?.pages
                  .map(p => ({
                    id: p.id,
                    pageNumber: p.pageNumber,
                    type: p.pageType,
                    side: p.side,
                  })) || []

                const bookStickers: PlacedSticker[] = stickerBook?.pages
                  .flatMap(p => p.stickers) || []

                const bookDecoItems: PlacedDecoItem[] = stickerBook?.pages
                  .flatMap(p => p.decoItems || []) || []

                // シール帳プレビュー
                const stickerBookPreviews: StickerBookPreview[] = stickerBook?.pages
                  .filter(p => p.pageType === 'page')
                  .map(p => ({
                    pageId: p.id,
                    pageNumber: p.pageNumber,
                    stickerCount: p.stickers.length,
                  })) || []

                setSelectedOtherUser(userProfile)
                setSelectedUserStickerBook(stickerBookPreviews)
                setSelectedUserBookPages(bookPages)
                setSelectedUserBookStickers(bookStickers)
                setSelectedUserBookDecoItems(bookDecoItems)
                setSelectedUserCoverDesignId(stickerBook?.themeId || 'cover-mochimo')
                setIsOtherUserProfileOpen(true)

                console.log('[Timeline] ユーザープロフィール表示:', userProfile.name)
              } catch (error) {
                console.error('[Timeline] ユーザープロフィール取得エラー:', error)
              }
            }}
            onFollow={async (userId) => {
              if (!currentUser) return
              try {
                // フォロー実行
                const success = await profileService.toggleFollow(currentUser.id, userId)
                if (success) {
                  // フォロー状態を取得して投稿を更新
                  const newStatus = await profileService.getFollowStatus(currentUser.id, userId)
                  setPosts(prev => prev.map(post =>
                    post.userId === userId
                      ? { ...post, followStatus: newStatus, isFollowing: newStatus !== 'none' }
                      : post
                  ))
                  // フォロー数を更新
                  const newCounts = await profileService.getFollowCounts(currentUser.id)
                  setFollowCounts(newCounts)
                  console.log('[Timeline] フォロー状態更新:', userId, newStatus)
                }
              } catch (error) {
                console.error('[Timeline] フォローエラー:', error)
              }
            }}
            onCreatePost={() => setIsCreatePostModalOpen(true)}
            onDelete={async (postId) => {
              // 投稿を削除
              if (!currentUser) return
              try {
                const success = await timelineService.deletePost(postId, currentUser.id)
                if (success) {
                  setPosts(prev => prev.filter(p => p.id !== postId))
                  console.log('[Timeline] 投稿を削除しました:', postId)
                }
              } catch (error) {
                console.error('[Timeline] 投稿削除エラー:', error)
              }
            }}
            onReport={(postId, userId, userName) => {
              setReportTarget({ type: 'post', id: postId, userId: userId, name: userName })
              setIsReportModalOpen(true)
            }}
            onBlock={(userId, userName) => {
              setBlockTarget({ id: userId, name: userName })
              setIsBlockModalOpen(true)
            }}
            blockedUserIds={[]}
            onOpenSearch={() => setIsUserSearchModalOpen(true)}
          />
        )

      case 'profile':
        return (
          <ProfileView
            profile={userProfile}
            stats={userStats}
            achievements={achievements}
            onEditProfile={() => setIsProfileEditOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onViewStickerBook={() => setActiveTab('home')}
            onViewAchievements={() => setIsAchievementsModalOpen(true)}
            onViewFriends={() => console.log('View friends')}
            onViewStats={() => setIsStatsModalOpen(true)}
            onViewFollowers={async () => {
              if (!currentUser) return
              setFollowListInitialTab('followers')
              setIsLoadingFollowList(true)
              setIsFollowListModalOpen(true)
              try {
                const [followers, following] = await Promise.all([
                  profileService.getFollowers(currentUser.id, currentUser.id),
                  profileService.getFollowing(currentUser.id, currentUser.id),
                ])
                setFollowersList(followers)
                setFollowingList(following)
              } catch (error) {
                console.error('[FollowList] Load error:', error)
              } finally {
                setIsLoadingFollowList(false)
              }
            }}
            onViewFollowing={async () => {
              if (!currentUser) return
              setFollowListInitialTab('following')
              setIsLoadingFollowList(true)
              setIsFollowListModalOpen(true)
              try {
                const [followers, following] = await Promise.all([
                  profileService.getFollowers(currentUser.id, currentUser.id),
                  profileService.getFollowing(currentUser.id, currentUser.id),
                ])
                setFollowersList(followers)
                setFollowingList(following)
              } catch (error) {
                console.error('[FollowList] Load error:', error)
              } finally {
                setIsLoadingFollowList(false)
              }
            }}
            onViewDailyMissions={() => setIsDailyMissionsModalOpen(true)}
            onViewCollection={() => setIsCollectionRewardsModalOpen(true)}
            onOpenSearch={() => setIsUserSearchModalOpen(true)}
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
    isAsyncTradeSessionOpen ||
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
    isDailyMissionsModalOpen ||
    isCollectionRewardsModalOpen ||
    isUserSearchModalOpen ||
    // ドロワー・パネル
    isDecoDrawerOpen ||
    isLayerPanelOpen ||
    isPageEditModalOpen
  // プロフィールタブは独自ヘッダーがあるのでTopBarを非表示
  // 交換セッション中もTopBarを非表示
  const shouldHideTopBar = activeTab === 'profile' || isTradeSessionOpen || isAsyncTradeSessionOpen

  // 認証中またはデータ読み込み中はローディング画面を表示
  if (isAuthLoading || !isDataLoaded) {
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
          onUpgrade={currentDataSource === 'supabase' ? (sticker) => {
            // 複合ID（stickerId:upgradeRank）からベースIDを抽出
            const lastColonIndex = sticker.id.lastIndexOf(':')
            const baseId = lastColonIndex !== -1 ? sticker.id.substring(0, lastColonIndex) : sticker.id
            setSelectedUpgradeStickerId(baseId)
            setIsUpgradeModalOpen(true)
          } : undefined}
        />
      )}

      {isUpgradeModalOpen && selectedUpgradeStickerId && currentUser?.supabaseId && currentDataSource === 'supabase' && (
        <UpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => {
            setIsUpgradeModalOpen(false)
            setSelectedUpgradeStickerId(null)
          }}
          stickerId={selectedUpgradeStickerId}
          userId={currentUser.supabaseId}
          onUpgradeComplete={async () => {
            // Supabaseからコレクションデータを再読み込み
            console.log('[Upgrade] Reloading collection from Supabase after upgrade')
            const supabaseCollection = await loadCollectionFromSupabase(currentUser.supabaseId)
            console.log('[Upgrade] Reloaded collection:', supabaseCollection.length, 'items')
            setCollection(supabaseCollection)
            // 詳細モーダルも閉じる
            setIsStickerDetailModalOpen(false)
            setSelectedCollectionSticker(null)
          }}
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
          onBack={() => {
            // 交渉を維持したまま画面を閉じる
            setIsTradeSessionOpen(false)
          }}
          onEndNegotiation={() => {
            // 交渉を完全に終了
            setIsTradeSessionOpen(false)
            setTradePartner(null)
            setMatchedUser(null)
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
                userAvatarUrl: userProfile.avatarUrl,
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

              // ミッション進捗を記録（投稿）
              statsService.recordTimelinePost(currentUser.supabaseId).then(success => {
                if (success) {
                  console.log('[Timeline] Mission progress recorded for post')
                }
              }).catch(error => {
                console.error('[Timeline] Failed to record mission progress:', error)
              })
            } else {
              console.error('[Timeline] Failed to save post to Supabase')
              // Supabase保存失敗時もローカルには表示（UX向上）
              const newPost: Post = {
                id: `post-${Date.now()}`,
                userId: currentUser.supabaseId,
                userName: currentUser.name,
                userAvatarUrl: userProfile.avatarUrl,
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
          comments={postComments}
          onClose={() => {
            setIsCommentModalOpen(false)
            setSelectedPost(null)
            setPostComments([])
          }}
          onAddComment={async (postId, content) => {
            if (!currentUser?.supabaseId) return
            try {
              const result = await timelineService.addComment(postId, currentUser.supabaseId, content)
              if (result) {
                // 新しいコメントをリストに追加
                const newComment: Comment = {
                  id: result.id,
                  userId: currentUser.supabaseId,
                  userName: currentUser.name,
                  userAvatarUrl: userProfile.avatarUrl,
                  content: result.content,
                  createdAt: result.created_at,
                  isOwner: true,
                }
                setPostComments(prev => [...prev, newComment])
                // 投稿のコメント数を更新
                setPosts(prev => prev.map(p =>
                  p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
                ))
                setLikedPosts(prev => prev.map(p =>
                  p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
                ))
              }
            } catch (error) {
              console.error('[Timeline] コメント追加エラー:', error)
            }
          }}
          onDeleteComment={async (commentId) => {
            if (!currentUser?.supabaseId) return
            try {
              const success = await timelineService.deleteComment(commentId, currentUser.supabaseId)
              if (success) {
                // コメントをリストから削除
                setPostComments(prev => prev.filter(c => c.id !== commentId))
                // 投稿のコメント数を更新
                if (selectedPost) {
                  setPosts(prev => prev.map(p =>
                    p.id === selectedPost.id ? { ...p, commentCount: Math.max(0, (p.commentCount || 0) - 1) } : p
                  ))
                  setLikedPosts(prev => prev.map(p =>
                    p.id === selectedPost.id ? { ...p, commentCount: Math.max(0, (p.commentCount || 0) - 1) } : p
                  ))
                }
              }
            } catch (error) {
              console.error('[Timeline] コメント削除エラー:', error)
            }
          }}
        />
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-white z-[100]">
          <div
            className="flex items-center justify-between px-4"
            style={{
              backgroundImage: 'url(/images/Header_UI.png)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
              minHeight: '52px',
              paddingTop: '8px',
              paddingBottom: '12px',
            }}
          >
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="px-3 py-1.5 rounded-full font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                color: '#9D4C6C',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              ← 戻る
            </button>
            <h1
              className="font-bold"
              style={{
                color: '#FFFFFF',
                textShadow: '0 1px 3px rgba(157, 76, 108, 0.6), 0 0 8px rgba(255, 255, 255, 0.3)',
              }}
            >
              ⚙️ 設定
            </h1>
            <div className="w-12" />
          </div>
          <div className="h-[calc(100%-60px)] overflow-auto pb-8">
            <SettingsView
              settings={settings}
              onSettingsChange={(newSettings) => {
                setSettings(newSettings)
                // 通知設定を同期
                notificationService.updateSettings(newSettings.notifications)
              }}
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
              onOpenSearch={() => setIsUserSearchModalOpen(true)}
              onOpenBlockedUsers={() => setIsBlockedUsersModalOpen(true)}
              blockedUsersCount={blockedUsersCount}
              isAdmin={isAdminUser}
              onOpenAdminDashboard={() => {
                setIsSettingsOpen(false)
                window.location.href = '/admin'
              }}
              // 招待システム
              invitationStats={invitationStats}
              invitationList={invitationList}
              onShareInvitation={async () => {
                if (invitationStats?.invitationCode && user?.profile?.display_name) {
                  await shareInvitation(invitationStats.invitationCode, user.profile.display_name)
                }
              }}
              onCopyInvitationCode={async () => {
                if (invitationStats?.invitationCode) {
                  return await copyInvitationCode(invitationStats.invitationCode)
                }
                return false
              }}
              onClaimInviterReward={async (invitationId) => {
                if (!currentUser?.supabaseId) return false
                const result = await claimInviterReward(currentUser.supabaseId, invitationId)
                if (result.success && result.rewards) {
                  // 通貨を更新
                  setUserMonetization(prev => ({
                    ...prev,
                    tickets: prev.tickets + result.rewards!.tickets,
                    gems: prev.gems + result.rewards!.gems,
                  }))
                  // 招待リストを更新
                  const newList = await getInvitationList(currentUser.supabaseId)
                  setInvitationList(newList)
                  const newStats = await getInvitationStats(currentUser.supabaseId)
                  setInvitationStats(newStats)
                }
                return result.success
              }}
              onApplyInvitationCode={async (code) => {
                if (!currentUser?.supabaseId) return false
                const result = await applyInvitationCode(currentUser.supabaseId, code)
                if (result.success) {
                  // 招待統計を更新
                  const newStats = await getInvitationStats(currentUser.supabaseId)
                  setInvitationStats(newStats)
                }
                return result.success
              }}
              onClaimInviteeReward={async () => {
                if (!currentUser?.supabaseId) return false
                const result = await claimInviteeReward(currentUser.supabaseId)
                if (result.success && result.rewards) {
                  // 通貨を更新
                  setUserMonetization(prev => ({
                    ...prev,
                    tickets: prev.tickets + result.rewards!.tickets,
                    gems: prev.gems + result.rewards!.gems,
                  }))
                  // 招待統計を更新
                  const newStats = await getInvitationStats(currentUser.supabaseId)
                  setInvitationStats(newStats)
                }
                return result.success
              }}
              // レビュー報酬
              reviewRewardStatus={reviewRewardStatus}
              currentPlatform={detectPlatform()}
              onClaimReviewReward={async (platform) => {
                if (!currentUser?.supabaseId) return false
                const result = await claimReviewReward(currentUser.supabaseId, platform)
                if (result.success && result.rewards) {
                  // 通貨を更新
                  setUserMonetization(prev => ({
                    ...prev,
                    tickets: prev.tickets + result.rewards!.tickets,
                  }))
                  // レビュー報酬状態を更新
                  const newStatus = await getReviewRewardStatus(currentUser.supabaseId)
                  setReviewRewardStatus(newStatus)
                }
                return result.success
              }}
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

      {/* ブロック中ユーザー一覧モーダル */}
      {isBlockedUsersModalOpen && currentUser?.id && (
        <BlockedUsersModal
          isOpen={isBlockedUsersModalOpen}
          onClose={() => {
            setIsBlockedUsersModalOpen(false)
            // ブロック解除後にカウントを更新
            moderationService.getBlockedUserIds(currentUser.id).then(ids => {
              setBlockedUsersCount(ids.length)
            })
          }}
          userId={currentUser.id}
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

      {/* レビュー報酬ポップアップ（交換成立後） */}
      <ReviewPromptModal
        isOpen={isReviewPromptOpen}
        onClose={() => setIsReviewPromptOpen(false)}
        onClaimReward={async (platform) => {
          if (!currentUser?.supabaseId) return false
          const result = await claimReviewReward(currentUser.supabaseId, platform)
          if (result.success && result.rewards) {
            // 通貨を更新
            setUserMonetization(prev => ({
              ...prev,
              tickets: prev.tickets + result.rewards!.tickets,
            }))
            // レビュー報酬状態を更新
            const newStatus = await getReviewRewardStatus(currentUser.supabaseId)
            setReviewRewardStatus(newStatus)
          }
          return result.success
        }}
        iosClaimed={reviewRewardStatus?.iosClaimed ?? false}
        androidClaimed={reviewRewardStatus?.androidClaimed ?? false}
      />

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
        achievements={achievements}
      />

      {/* デイリーミッションモーダル */}
      {currentUser && (
        <DailyMissionsModal
          isOpen={isDailyMissionsModalOpen}
          onClose={() => setIsDailyMissionsModalOpen(false)}
          userId={currentUser.id}
          onRewardClaimed={(mission) => {
            // 報酬タイプに応じて通貨・経験値を加算
            const rewardType = mission.mission.reward_type
            const rewardAmount = mission.mission.reward_amount

            if (rewardType === 'tickets') {
              setUserMonetization(prev => ({
                ...prev,
                tickets: prev.tickets + rewardAmount
              }))
            } else if (rewardType === 'gems') {
              setUserMonetization(prev => ({
                ...prev,
                gems: prev.gems + rewardAmount
              }))
            } else if (rewardType === 'stars') {
              setUserMonetization(prev => ({
                ...prev,
                stars: prev.stars + rewardAmount
              }))
            } else if (rewardType === 'exp') {
              // 経験値を加算
              setTotalExp(prev => {
                const newExp = prev + rewardAmount
                totalExpRef.current = newExp // refも更新
                return newExp
              })
            }
            console.log('[DailyMission] 報酬を受け取りました:', rewardType, rewardAmount)
          }}
        />
      )}

      {/* コレクション報酬モーダル */}
      {currentUser && (
        <CollectionRewardsModal
          isOpen={isCollectionRewardsModalOpen}
          onClose={() => setIsCollectionRewardsModalOpen(false)}
          userId={currentUser.id}
          onRewardClaimed={(reward) => {
            // 報酬タイプに応じて通貨を加算
            if (reward.reward_type === 'tickets') {
              setUserMonetization(prev => ({
                ...prev,
                tickets: prev.tickets + reward.reward_amount
              }))
            } else if (reward.reward_type === 'gems') {
              setUserMonetization(prev => ({
                ...prev,
                gems: prev.gems + reward.reward_amount
              }))
            } else if (reward.reward_type === 'gacha_ticket') {
              // ★5確定ガチャチケットはチケットとして加算
              setUserMonetization(prev => ({
                ...prev,
                tickets: prev.tickets + reward.reward_amount
              }))
            }
            console.log('[CollectionReward] 報酬を受け取りました:', reward.reward_type, reward.reward_amount)
          }}
        />
      )}

      {/* ユーザー検索モーダル */}
      <UserSearchModal
        isOpen={isUserSearchModalOpen}
        onClose={() => setIsUserSearchModalOpen(false)}
        currentUserId={currentUser?.id}
        onUserSelect={async (userId) => {
          // ユーザープロフィールを開く（TimelineViewと同じロジック）
          try {
            console.log('[UserSearch] ユーザープロフィール取得開始:', userId)

            // プロフィール取得
            const profileData = await profileService.getOtherUserProfile(userId, currentUser?.id)
            if (!profileData) {
              console.error('[UserSearch] プロフィール取得失敗:', userId)
              return
            }

            // シール帳データ取得
            const stickerBook = await stickerBookService.getUserStickerBook(userId)

            // OtherUserProfile形式に変換
            const userProfile: OtherUserProfile = {
              id: profileData.id,
              name: profileData.name,
              avatarUrl: profileData.avatarUrl || undefined,
              level: profileData.level,
              title: profileData.title,
              bio: profileData.bio,
              isFollowing: profileData.isFollowing,
              stats: profileData.stats,
            }

            // シール帳ページとシールを整形（表紙も含める）
            const bookPages: BookPage[] = stickerBook?.pages
              .map(p => ({
                id: p.id,
                pageNumber: p.pageNumber,
                type: p.pageType,
                side: p.side,
              })) || []

            const bookStickers: PlacedSticker[] = stickerBook?.pages
              .flatMap(p => p.stickers) || []

            const bookDecoItems: PlacedDecoItem[] = stickerBook?.pages
              .flatMap(p => p.decoItems || []) || []

            // シール帳プレビュー
            const stickerBookPreviews: StickerBookPreview[] = stickerBook?.pages
              .filter(p => p.pageType === 'page')
              .map(p => ({
                pageId: p.id,
                pageNumber: p.pageNumber,
                stickerCount: p.stickers.length,
              })) || []

            setSelectedOtherUser(userProfile)
            setSelectedUserStickerBook(stickerBookPreviews)
            setSelectedUserBookPages(bookPages)
            setSelectedUserBookStickers(bookStickers)
            setSelectedUserBookDecoItems(bookDecoItems)
            setSelectedUserCoverDesignId(stickerBook?.themeId || 'cover-mochimo')
            setIsUserSearchModalOpen(false)
            setIsOtherUserProfileOpen(true)

            console.log('[UserSearch] ユーザープロフィール表示:', userProfile.name)
          } catch (error) {
            console.error('[UserSearch] プロフィール取得エラー:', error)
          }
        }}
        onFollow={async (userId) => {
          if (!currentUser) return
          try {
            const success = await profileService.toggleFollow(currentUser.id, userId)
            if (success) {
              // フォロー数を更新
              const newCounts = await profileService.getFollowCounts(currentUser.id)
              setFollowCounts(newCounts)
              // タイムライン投稿のフォロー状態も更新
              const newStatus = await profileService.getFollowStatus(currentUser.id, userId)
              setPosts(prev => prev.map(post =>
                post.userId === userId
                  ? { ...post, followStatus: newStatus, isFollowing: newStatus !== 'none' }
                  : post
              ))
              console.log('[UserSearch] フォロー状態更新:', userId, newStatus)
            }
          } catch (error) {
            console.error('[UserSearch] フォロー切り替えエラー:', error)
          }
        }}
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
        followers={followersList.map(f => ({
          id: f.id,
          name: f.name,
          avatarUrl: f.avatarUrl ?? undefined,
          level: f.level,
          title: f.title,
          isFollowing: f.isFollowing,
        }))}
        following={followingList.map(f => ({
          id: f.id,
          name: f.name,
          avatarUrl: f.avatarUrl ?? undefined,
          level: f.level,
          title: f.title,
          isFollowing: f.isFollowing,
        }))}
        onUserClick={async (userId) => {
          // 他ユーザーのプロフィールを開く（Supabaseから取得）
          if (!currentUser) return
          try {
            const userProfile = await profileService.getOtherUserProfile(userId, currentUser.id)
            if (userProfile) {
              setSelectedOtherUser({
                id: userProfile.id,
                name: userProfile.name,
                avatarUrl: userProfile.avatarUrl || undefined,
                level: userProfile.level,
                title: userProfile.title,
                bio: userProfile.bio,
                isFollowing: userProfile.isFollowing,
                stats: userProfile.stats,
              })
              // シール帳データも取得
              const stickerBook = await stickerBookService.getUserStickerBook(userId)
              if (stickerBook) {
                // ページデータを変換
                setSelectedUserBookPages(stickerBook.pages.map(p => ({
                  id: p.id,
                  type: p.pageType,
                  side: p.side,
                })))
                // シールデータをフラット化（pageIdは既に含まれている）
                const allStickers: PlacedSticker[] = stickerBook.pages.flatMap(page => page.stickers)
                setSelectedUserBookStickers(allStickers)
                // デコアイテムもフラット化
                const allDecoItems: PlacedDecoItem[] = stickerBook.pages.flatMap(page => page.decoItems || [])
                setSelectedUserBookDecoItems(allDecoItems)
              } else {
                setSelectedUserBookPages([])
                setSelectedUserBookStickers([])
                setSelectedUserBookDecoItems([])
              }
              setIsFollowListModalOpen(false)
              setIsOtherUserProfileOpen(true)
            }
          } catch (error) {
            console.error('[FollowList] Load user profile error:', error)
          }
        }}
        onFollowToggle={async (userId, _isFollowing) => {
          if (!currentUser) return
          try {
            const success = await profileService.toggleFollow(currentUser.id, userId)
            if (success) {
              // フォロー数を更新
              const newCounts = await profileService.getFollowCounts(currentUser.id)
              setFollowCounts(newCounts)
              // フォロー一覧も更新
              const [followers, following] = await Promise.all([
                profileService.getFollowers(currentUser.id, currentUser.id),
                profileService.getFollowing(currentUser.id, currentUser.id),
              ])
              setFollowersList(followers)
              setFollowingList(following)
              console.log('[FollowList] フォロー状態更新:', userId)
            }
          } catch (error) {
            console.error('[FollowList] フォローエラー:', error)
          }
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
        bookDecoItems={selectedUserBookDecoItems}
        coverDesignId={selectedUserCoverDesignId}
        onFollowToggle={async (userId, _isFollowing) => {
          if (!currentUser) return
          try {
            const success = await profileService.toggleFollow(currentUser.id, userId)
            if (success) {
              // フォロー状態を取得して更新
              const newStatus = await profileService.getFollowStatus(currentUser.id, userId)
              if (selectedOtherUser) {
                setSelectedOtherUser({
                  ...selectedOtherUser,
                  isFollowing: newStatus !== 'none',
                })
              }
              // フォロー数を更新
              const newCounts = await profileService.getFollowCounts(currentUser.id)
              setFollowCounts(newCounts)
              // タイムライン投稿のフォロー状態も更新
              setPosts(prev => prev.map(post =>
                post.userId === userId
                  ? { ...post, followStatus: newStatus, isFollowing: newStatus !== 'none' }
                  : post
              ))
              console.log('[OtherUserProfile] フォロー状態更新:', userId, newStatus)
            }
          } catch (error) {
            console.error('[OtherUserProfile] フォローエラー:', error)
          }
        }}
        onViewStickerBook={(userId, pageId) => {
          console.log('View sticker book:', userId, pageId)
          // TODO: シール帳閲覧画面へ遷移
        }}
        onInviteToTrade={async (userId, userName) => {
          if (!currentUser) {
            console.log('[OtherUserProfile] ログインが必要です')
            return
          }

          try {
            console.log('[OtherUserProfile] 交換に誘う:', userId, userName)
            const session = await asyncTradeService.inviteToTrade(currentUser.supabaseId, userId)

            if (session) {
              console.log('[OtherUserProfile] 招待送信成功:', session.id)
              // モーダルを閉じて、交換タブに遷移
              setIsOtherUserProfileOpen(false)
              setSelectedOtherUser(null)
              setActiveTab('trade')
            } else {
              // 既に進行中のセッションがある場合
              console.log('[OtherUserProfile] 既に進行中の交換があります')
              setIsOtherUserProfileOpen(false)
              setSelectedOtherUser(null)
              setActiveTab('trade')
            }
          } catch (error) {
            console.error('[OtherUserProfile] 招待エラー:', error)
          }
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
            <div
              className="sticky top-0 z-10 px-4 flex items-center justify-between"
              style={{
                backgroundImage: 'url(/images/Header_UI.png)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                minHeight: '52px',
                paddingTop: '8px',
                paddingBottom: '12px',
              }}
            >
              <button
                onClick={handleCloseShop}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="#9D4C6C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1
                className="text-lg font-bold"
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  color: '#FFFFFF',
                  textShadow: '0 1px 3px rgba(157, 76, 108, 0.6), 0 0 8px rgba(255, 255, 255, 0.3)',
                }}
              >
                🛒 ショップ
              </h1>
              {/* 通貨表示 */}
              <div className="flex items-center gap-1">
                {/* シルチケ */}
                <div className="flex items-center gap-0.5 bg-white/30 rounded-full px-1.5 py-0.5">
                  <span className="text-xs">🎫</span>
                  <span className="text-white font-bold text-xs" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {userMonetization.tickets}
                  </span>
                </div>
                {/* プレシル */}
                <div className="flex items-center gap-0.5 bg-white/30 rounded-full px-1.5 py-0.5">
                  <span className="text-xs">💎</span>
                  <span className="text-white font-bold text-xs" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {userMonetization.gems}
                  </span>
                </div>
                {/* どろっぷ */}
                <div className="flex items-center gap-0.5 bg-white/30 rounded-full px-1.5 py-0.5">
                  <span className="text-xs">💧</span>
                  <span className="text-white font-bold text-xs" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                    {userMonetization.stars.toLocaleString()}
                  </span>
                </div>
              </div>
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
        canUseDropsInstead={insufficientFundsModal.canUseDropsInstead}
        dropsRequired={insufficientFundsModal.dropsRequired}
        onUseDrops={handleUseDropsForGacha}
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
          allStickers={masterStickers}
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

      {/* シール帳シェアモーダル */}
      <BookShareModal
        isOpen={isBookShareModalOpen}
        onClose={() => setIsBookShareModalOpen(false)}
        bookContainerRef={shareBookContainerRef}
      />
    </AppLayout>
  )
}
