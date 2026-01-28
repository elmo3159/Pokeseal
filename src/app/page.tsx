'use client'

import { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react'
import { AppLayout, TabId } from '@/components'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'
import { FullScreenLoading } from '@/components/ui/LoadingSpinner'
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
import { CoverDesign, defaultCoverDesigns, defaultThemes, getDefaultThemeId, getThemeById } from '@/domain/theme'
import { CollectionView, CollectionSticker } from '@/features/collection'
import { GachaBanner, UserCurrency, GachaResultSticker, GachaConfirmDialog } from '@/features/gacha'
import { TradeView, Friend, TradeHistory, MatchingStatus, MatchedUser, TradePartner, TradeBookPageFull } from '@/features/trade'
import { TimelineView, Post, ReactionType, Comment, FollowStatus, FeedType } from '@/features/timeline'
import { timelineService, PageSnapshot } from '@/services/timeline/timelineService'
import { asyncTradeService } from '@/services/asyncTrade/asyncTradeService'
import { ProfileView, UserProfile, UserStats, Achievement, FollowUser, OtherUserProfile, StickerBookPreview } from '@/features/profile'
// 動的インポート（バンドルサイズ最適化）
import {
  LazyGachaResultModal,
  LazyMatchingModal,
  LazyProfileEditModal,
  LazyLevelUpModal,
  LazyStatsModal,
  LazyAchievementsModal,
  LazyFollowListModal,
  LazyOtherUserProfileModal,
  LazyStickerDetailModal,
  LazyUpgradeModal,
  LazyPageEditModal,
  LazyBookShareModal,
  LazyThemeSelectModal,
  LazyReportModal,
  LazyBlockModal,
  LazyBlockedUsersModal,
  LazyCreatePostModal,
  LazyCommentModal,
  LazyDailyMissionsModal,
  LazyCollectionRewardsModal,
  LazyUserSearchModal,
  LazySubscriptionModal,
  LazyStarPurchaseModal,
  LazyAdRewardModal,
  LazyDailyBonusModal,
  LazyInsufficientFundsModal,
  LazyAdminView,
  LazyTradeSessionFull,
  LazyGachaView,
  LazySettingsView,
} from '@/utils/dynamicImports'
import {
  calculateLevel,
  getCurrentLevelExp,
  getExpToNextLevel,
  getLevelTitle,
  addExpWithDailyLimit,
  createInitialDailyCounts,
  getLevelUpRewards,
  MAX_LEVEL,
  type ExpAction,
  type ExpGainResult,
  type LevelUpReward,
  type DailyActionCounts,
} from '@/domain/levelSystem'
import { TutorialOverlay, defaultTutorialSteps } from '@/features/tutorial'
import { SettingsData, ContactFormModal, ContactFormData } from '@/features/settings'
import { contactService } from '@/services/contact'
import { AuthView } from '@/features/auth'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/auth/authService'
import { CreateReportInput, CreateBlockInput, ReportTargetType } from '@/domain/safety'
import { moderationService } from '@/services/moderation'
import { collectionRewardService } from '@/services/collectionRewards'
import { characterRewardService } from '@/services/characterRewards'
// mystery-post and trade-scout removed - replaced by trade-board
import { TradeBoardView, TradeBoardCreateModal, TradeBoardPostDetail } from '@/features/trade-board'
import {
  ShopView,
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
  createTestModeData,
  loadAdminMode,
  saveAdminMode,
  addStickersToCollection,
  canPlaceSticker,
  resetAllData,
  switchTestUser,
  saveCurrentUserData,
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
import { stickerBookService, type StickerBookPage as SupabaseStickerBookPage } from '@/services/stickerBook'
import { profileService, statsService, type FollowUserData, type UserStatsFromDB } from '@/services/profile'
import { calculateAchievements, syncUserAchievements, type AchievementStats } from '@/services/achievements/achievementService'
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
import { getSupabase } from '@/services/supabase'

// ガチャバナー（固定マスター）
const gachaBanners: GachaBanner[] = [
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
    costSingle: 1,
    costMulti: 10,
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

// 設定初期値
const defaultSettings: SettingsData = {
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

// シール帳のサイズ定数（BookViewのデフォルトと一致させる）
const BOOK_WIDTH = 320
const BOOK_HEIGHT = 480

export default function Home() {
  // Auth state - 実際の認証ユーザーを使用
  const { user, userCode, isLoading: isAuthLoading, isAccountLinked, linkedProviders, linkGoogle, linkApple, refreshUser } = useAuth()

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

  // コレクション報酬の先読み（モーダル表示を速くする）
  useEffect(() => {
    if (!currentUser?.supabaseId) return
    collectionRewardService.prefetch(currentUser.supabaseId)
      .catch(err => console.error('[CollectionReward] Prefetch error:', err))
  }, [currentUser?.supabaseId])

  // キャラクター報酬の先読み（表示を速くする）+ 解放済み表紙の取得
  useEffect(() => {
    if (!currentUser?.id) return
    const warm = () => {
      characterRewardService.getAllCharacterRewardStatus(currentUser.id)
        .catch(err => console.error('[CharacterReward] Prefetch error:', err))
      characterRewardService.getUnlockedCoverCharacters(currentUser.id)
        .then(chars => setUnlockedCoverCharacters(chars))
        .catch(err => console.error('[CharacterReward] Cover fetch error:', err))
    }
    if (typeof (window as any).requestIdleCallback === 'function') {
      ;(window as any).requestIdleCallback(warm)
    } else {
      setTimeout(warm, 0)
    }
  }, [currentUser?.id])

  // モデレーション/統計の状態（useEffectで参照するため早めに宣言）
  const [blockedUsersCount, setBlockedUsersCount] = useState(0)
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([])
  const [isStatsUnavailable, setIsStatsUnavailable] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)

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

  // 通知タップ時の画面遷移
  useEffect(() => {
    notificationService.setOnNotificationTap((payload) => {
      switch (payload.type) {
        case 'trade_request':
        case 'trade_accepted':
        case 'trade_rejected':
          setActiveTab('trade')
          setTradeSubTab('trade')
          break
        case 'friend_request':
          setActiveTab('profile')
          setFollowListInitialTab('followers')
          setIsFollowListModalOpen(true)
          break
        case 'new_sticker':
          setActiveTab('collection')
          break
        case 'contest':
          setActiveTab('timeline')
          break
        case 'level_up':
          setActiveTab('profile')
          setIsStatsModalOpen(true)
          break
        case 'achievement':
          setActiveTab('profile')
          setIsAchievementsModalOpen(true)
          break
        case 'daily_bonus':
          setIsShopOpen(true)
          break
        default:
          break
      }
    })

    return () => {
      notificationService.setOnNotificationTap(undefined)
    }
  }, [])

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
        setBlockedUserIds(blockedIds)
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
  }, [currentUser?.supabaseId, blockedUserIds])

  // マスターシールデータ（Supabaseから取得）
  const [masterStickers, setMasterStickers] = useState<Sticker[]>([])
  const [isMasterStickersLoaded, setIsMasterStickersLoaded] = useState(false)

  // Tab state
  const [activeTab, setActiveTab] = useState<TabId>('home')

  // Book state
  const bookRef = useRef<BookViewHandle>(null)
  const bookContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pages, setPages] = useState<BookPage[]>([])
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([])
  const [selectedCharm, setSelectedCharm] = useState<CharmData>(CHARM_LIST[0])
  const [isSpreadView, setIsSpreadView] = useState(true)
  // coverDesignIdを使用（もっちもの表紙を使用）
  const [coverDesignId, setCoverDesignId] = useState<string>('cover-default')
  const [unlockedCoverCharacters, setUnlockedCoverCharacters] = useState<string[]>([])
  const [themeId, setThemeId] = useState<string>(getDefaultThemeId())

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
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState<{ type: ReportTargetType; id: string; userId: string; name: string } | null>(null)
  const [blockTarget, setBlockTarget] = useState<{ id: string; name: string } | null>(null)
  const [isBlockedUsersModalOpen, setIsBlockedUsersModalOpen] = useState(false)
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>(createUserProfile(INITIAL_TOTAL_EXP))
  const [totalExp, setTotalExp] = useState(INITIAL_TOTAL_EXP)
  const [expDailyCounts, setExpDailyCounts] = useState<DailyActionCounts>(createInitialDailyCounts())
  // totalExpの最新値をrefで保持（クロージャのstale値問題を回避）
  const totalExpRef = useRef(INITIAL_TOTAL_EXP)
  // デイリーボーナス処理済みフラグ（二重処理防止）
  const dailyBonusProcessedRef = useRef(false)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; rewards: LevelUpReward[] } | null>(null)
  const [isThemeSelectOpen, setIsThemeSelectOpen] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false)
  const currentTheme = useMemo(() => {
    return getThemeById(themeId) || getThemeById(getDefaultThemeId()) || defaultThemes[0]
  }, [themeId])
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
  const [selectedUserCoverDesignId, setSelectedUserCoverDesignId] = useState<string>('cover-default')

  // フォロワー/フォロー数
  const [followCounts, setFollowCounts] = useState<{ followersCount: number; followingCount: number }>({
    followersCount: 0,
    followingCount: 0,
  })
  // SupabaseからのDB統計情報
  const [dbStats, setDbStats] = useState<UserStatsFromDB | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const unlockedAchievementIds = useMemo(
    () => achievements.filter(a => a.isUnlocked).map(a => a.id),
    [achievements]
  )
  const allAchievementsUnlocked =
    achievements.length > 0 && unlockedAchievementIds.length === achievements.length
  const unlockedThemeIds = useMemo(() => {
    const unlockedSet = new Set(unlockedAchievementIds)
    const ids = new Set<string>()
    defaultThemes.forEach(theme => {
      if (theme.obtainMethod === 'default') {
        ids.add(theme.id)
        return
      }
      if (theme.obtainMethod === 'achievement') {
        if (theme.unlockAllAchievements) {
          if (allAchievementsUnlocked) ids.add(theme.id)
          return
        }
        if (theme.unlockAchievementId && unlockedSet.has(theme.unlockAchievementId)) {
          ids.add(theme.id)
        }
      }
    })
    return Array.from(ids)
  }, [unlockedAchievementIds, allAchievementsUnlocked])

  const ownedThemeIds = useMemo(() => {
    const ids = new Set(unlockedThemeIds)
    // いま使っているテーマは常に表示
    ids.add(themeId)
    return Array.from(ids)
  }, [unlockedThemeIds, themeId])

  // フォロワー/フォロー一覧
  const [followersList, setFollowersList] = useState<FollowUserData[]>([])
  const [followingList, setFollowingList] = useState<FollowUserData[]>([])
  const [isLoadingFollowList, setIsLoadingFollowList] = useState(false)
  // 交換用フレンド/履歴（Supabaseから取得）
  const [friends, setFriends] = useState<Friend[]>([])
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([])

  // Trade state
  const [matchingStatus, setMatchingStatus] = useState<MatchingStatus>('idle')
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null)
  const [isTradeSessionOpen, setIsTradeSessionOpen] = useState(false)
  const [tradePartner, setTradePartner] = useState<TradePartner | null>(null)
  const [isAsyncTradeSessionOpen, setIsAsyncTradeSessionOpen] = useState(false)
  const [tradeBadgeCount, setTradeBadgeCount] = useState(0)

  // トレード画面のサブタブ（交換/掲示板切替）
  const [tradeSubTab, setTradeSubTab] = useState<'trade' | 'board'>('trade')
  const [isTradeBoardCreateOpen, setIsTradeBoardCreateOpen] = useState(false)
  const [tradeBoardRefreshKey, setTradeBoardRefreshKey] = useState(0)
  const [tradeBoardDetailPostId, setTradeBoardDetailPostId] = useState<string | null>(null)

  // 交換バッジカウントのポーリング
  useEffect(() => {
    if (!currentUser?.supabaseId) return
    const fetchBadge = async () => {
      try {
        const count = await asyncTradeService.getTradeBadgeCount(currentUser.supabaseId)
        setTradeBadgeCount(count)
      } catch (e) {
        // ignore
      }
    }
    fetchBadge()
    const interval = setInterval(fetchBadge, 30000)
    return () => clearInterval(interval)
  }, [currentUser?.supabaseId])

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
  const [userMonetization, setUserMonetization] = useState<UserMonetization>(DEFAULT_USER_MONETIZATION)

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
  const getLocalFollowStatus = useCallback((targetUserId: string): 'none' | 'following' | 'mutual' | null => {
    const pickFromPosts = (list: Post[]) => list.find(post => post.userId === targetUserId)?.followStatus
    const statusFromPosts =
      pickFromPosts(posts) ||
      pickFromPosts(followingPosts) ||
      pickFromPosts(likedPosts)
    if (statusFromPosts) return statusFromPosts

    const isFollower = followersList.some(user => user.id === targetUserId)
    const isFollowing = followingList.some(user => user.id === targetUserId)
    if (isFollower && isFollowing) return 'mutual'
    if (isFollowing) return 'following'
    if (isFollower) return 'none'

    if (selectedOtherUser?.id === targetUserId) {
      const followsYou = isFollower
      if (selectedOtherUser.isFollowing && followsYou) return 'mutual'
      if (selectedOtherUser.isFollowing) return 'following'
    }

    return null
  }, [posts, followingPosts, likedPosts, followersList, followingList, selectedOtherUser])

  const applyFollowStatsDelta = useCallback((prevStatus: 'none' | 'following' | 'mutual', nextStatus: 'none' | 'following' | 'mutual') => {
    if (prevStatus === nextStatus) return
    const followingDelta =
      prevStatus === 'none' && nextStatus !== 'none' ? 1 :
      prevStatus !== 'none' && nextStatus === 'none' ? -1 : 0
    const friendsDelta =
      prevStatus !== 'mutual' && nextStatus === 'mutual' ? 1 :
      prevStatus === 'mutual' && nextStatus !== 'mutual' ? -1 : 0

    if (followingDelta !== 0) {
      setFollowCounts(prev => ({
        ...prev,
        followingCount: Math.max(0, prev.followingCount + followingDelta),
      }))
    }

    if (followingDelta !== 0 || friendsDelta !== 0) {
      setDbStats(prev => {
        if (!prev) return prev
        return {
          ...prev,
          followingCount: Math.max(0, prev.followingCount + followingDelta),
          friendsCount: Math.max(0, prev.friendsCount + friendsDelta),
        }
      })
    }
  }, [])

  // ガチャ回数トラッキング（実績用）
  const [gachaPulls, setGachaPulls] = useState(0)

  // Settings state
  const [settings, setSettings] = useState<SettingsData>(defaultSettings)

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
  const [dataLoadError, setDataLoadError] = useState<string | null>(null)
  const [currentDataSource, setCurrentDataSource] = useState<'supabase' | 'localStorage'>('supabase')
  const [adminMode, setAdminMode] = useState<AdminMode>('production')
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [collection, setCollection] = useState<SavedCollectionItem[]>([])

  useEffect(() => {
    if (!isDataLoaded) return
    const defaultThemeId = getDefaultThemeId()
    if (!themeId || themeId === defaultThemeId) return
    if (!unlockedThemeIds.includes(themeId)) {
      setThemeId(defaultThemeId)
      if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
        stickerBookService.updateBookTheme(currentUser.supabaseId, defaultThemeId)
      }
    }
  }, [isDataLoaded, themeId, unlockedThemeIds, currentDataSource, currentUser?.supabaseId])
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

    const parseStickerName = (name: string) => {
      const match = name.match(/^(.*?)(?:\s*#\s*(\d+))?\s*$/)
      const baseName = match?.[1]?.trim() || name
      const index = match?.[2] ? parseInt(match[2], 10) : null
      return { baseName, index }
    }

    // 3. ソート：シリーズ → キャラクター名 → シール番号 → ランク降順
    results.sort((a, b) => {
      // まずシリーズ名でソート
      const seriesCompare = (a.series || '').localeCompare(b.series || '', 'ja')
      if (seriesCompare !== 0) return seriesCompare
      // 次に名前でソート
      const characterCompare = (a.character || '').localeCompare(b.character || '', 'ja')
      if (characterCompare !== 0) return characterCompare

      const aParsed = parseStickerName(a.name)
      const bParsed = parseStickerName(b.name)
      const baseCompare = aParsed.baseName.localeCompare(bParsed.baseName, 'ja')
      if (baseCompare !== 0) return baseCompare

      if (aParsed.index !== null && bParsed.index !== null && aParsed.index !== bParsed.index) {
        return aParsed.index - bParsed.index
      }

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
    const totalAvailableStickers = masterStickers.length

    // コンプリート数はdbStatsから取得（Supabaseで計算済み）
    const completedSeries = dbStats?.completedSeries ?? 0

    return {
      totalStickers,
      uniqueStickers,
      totalAvailableStickers,
      completedSeries,
      totalTrades: dbStats?.successfulTrades ?? dbStats?.totalTrades ?? 0,
      friendsCount: dbStats?.friendsCount ?? 0,
      followersCount: dbStats?.followersCount ?? followCounts.followersCount,
      followingCount: dbStats?.followingCount ?? followCounts.followingCount,
      postsCount: dbStats?.postsCount ?? posts.length,
      reactionsReceived: dbStats?.reactionsReceived ?? 0,
      statsUnavailable: isStatsUnavailable,
    }
  }, [collection, masterStickers, posts, followCounts, dbStats, isStatsUnavailable])

  // 実績計算用の統計を用意
  const achievementStats = useMemo(() => {
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
    return achievementStats
  }, [collection, placedStickers, gachaPulls, posts, userStats, dbStats])

  // 実績を同期（Supabase優先、ローカルは計算のみ）
  useEffect(() => {
    let active = true
    const run = async () => {
      if (active) {
        setAchievements(calculateAchievements(achievementStats))
      }
      if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
        const result = await syncUserAchievements(currentUser.supabaseId, achievementStats)
        if (active) {
          setAchievements(result)
        }
        return
      }
      if (active) {
        setAchievements(calculateAchievements(achievementStats))
      }
    }

    run()
    return () => {
      active = false
    }
  }, [achievementStats, currentDataSource, currentUser?.supabaseId])

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
    version: 2,
    collection,
    monetization: userMonetization,
    placedStickers,
    placedDecoItems,
    pages,
    coverDesignId,
    themeId,
    profile: {
      name: userProfile.name,
      bio: userProfile.bio || '',
      totalExp,
      expDailyCounts,
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
  }), [collection, userMonetization, placedStickers, placedDecoItems, pages, coverDesignId, themeId, userProfile, totalExp, expDailyCounts, settings, posts])

  // データを保存（自動保存）- 認証ユーザーに保存
  const saveData = useCallback(() => {
    if (!isDataLoaded || !currentUser) return // 初期化前または未認証は保存しない
    if (currentDataSource === 'supabase') return
    const data = buildSavedUserData()
    saveCurrentUserData(data)
    // Data saved
  }, [isDataLoaded, buildSavedUserData, currentUser, currentDataSource])

  // 初回読み込み（認証完了を待ってからSupabase対応）
  useEffect(() => {
    // 認証中は待機
    if (isAuthLoading) {
      // Waiting for auth...
      return
    }

    // 認証失敗時はローカルへフォールバックせず、再試行を促す
    if (!currentUser) {
      setDataLoadError('ネットワークに接続できませんでした。通信状態を確認して再試行してください。')
      return
    }

    const loadData = async () => {
      setDataLoadError(null)
      const mode = loadAdminMode()
      setAdminMode(mode)

      // Loading data for authenticated user

      // データソースを判定
      const dataSource = getDataSource()
      setCurrentDataSource(dataSource)

      let userData: SavedUserData | null = null
      let supabaseAvatarUrl: string | null = null // Supabaseから読み込んだアバターURL
      let supabaseFrameId: string | null = null // Supabaseから読み込んだフレームID
      // loadedMasterStickers removed (scout feature deleted)

      // マスターシールデータは常にSupabaseから読み込む（テストモードでも全シールを使えるようにする）
      // 注意: React Strict Modeで2回実行される場合に備え、毎回ロードしてローカル変数に保持する
      if (dataSource === 'supabase') {
        try {
          const supabaseStickers = await loadAllStickersFromSupabase()
          if (supabaseStickers.length === 0) {
            setDataLoadError('シールのマスターデータが見つかりません。Supabaseのstickersテーブルを確認してください。')
            return
          }
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
            // loadedMasterStickers removed (scout feature deleted)
          }
        } catch (error) {
          console.error('[Supabase] Failed to load master stickers:', error)
          // エラー時はstate変数にフォールバック
          // loadedMasterStickers removed
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
          const stickerBook = await stickerBookService.createStickerBook(currentUser.supabaseId)
          if (stickerBook && stickerBook.pages.length > 0) {

            // Supabaseのページデータをローカル形式に変換
            const supabasePages: BookPage[] = stickerBook.pages.map(page => ({
              id: page.id,
              type: page.pageType as 'cover' | 'page' | 'back-cover' | 'inner-cover',
              side: page.side as 'left' | 'right' | undefined,
              theme: page.themeConfig as BookPage['theme'] ?? undefined,
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
            userData.coverDesignId = stickerBook.coverDesignId || userData.coverDesignId
            userData.themeId = stickerBook.themeId || userData.themeId
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
              expDailyCounts: supabaseProfile.expDailyCounts || userData.profile.expDailyCounts || createInitialDailyCounts(),
            }
            // アバターURLとフレームIDも保持
            supabaseAvatarUrl = supabaseProfile.avatarUrl
            supabaseFrameId = supabaseProfile.selectedFrameId || null
          }

          // フォロワー/フォロー数を取得
          const followCountsData = await profileService.getFollowCounts(currentUser.supabaseId)
          setFollowCounts(followCountsData)

          // ユーザー統計をSupabaseから取得
          try {
            const userStatsData = await statsService.getUserStats(currentUser.supabaseId)
            if (userStatsData) {
              setDbStats(userStatsData)
              setIsStatsUnavailable(false)
            } else {
              setIsStatsUnavailable(true)
            }
          } catch (statsError) {
            console.error('[Supabase] Failed to load user stats:', statsError)
            setIsStatsUnavailable(true)
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

          // ミステリーポスト・スカウトは削除済み（掲示板に置き換え）
        } catch (error) {
          console.error('[Supabase] Failed to load from Supabase:', error)
          setDataLoadError('データの読み込みに失敗しました。再試行してください。')
          return
        }
      }

      // データがない場合は初期データを作成
      if (!userData) {
        console.log('[Persistence] No saved data for user:', currentUser.id, ', creating initial data')
        userData = createInitialUserDataForTestUser(currentUser.id)
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
      const defaultThemeId = getDefaultThemeId()
      const normalizedThemeId = userData.themeId === 'theme-basic-pink'
        ? defaultThemeId
        : (userData.themeId || defaultThemeId)
      if (normalizedThemeId !== userData.themeId) {
        userData.themeId = normalizedThemeId
        if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
          await stickerBookService.updateBookTheme(currentUser.supabaseId, normalizedThemeId)
        }
      }
      setThemeId(normalizedThemeId)
      const profile = userData.profile
      setTotalExp(profile.totalExp)
      totalExpRef.current = profile.totalExp // refも更新
      setExpDailyCounts(profile.expDailyCounts ?? createInitialDailyCounts())
      setUserProfile(prev => ({
        ...prev,
        name: profile.name,
        bio: profile.bio,
        avatarUrl: supabaseAvatarUrl || prev.avatarUrl, // Supabaseからのアバター優先
        frameId: supabaseFrameId, // Supabaseから読み込んだフレームID
        level: calculateLevel(profile.totalExp),
        exp: getCurrentLevelExp(profile.totalExp),
        expToNextLevel: getExpToNextLevel(profile.totalExp),
        title: getLevelTitle(calculateLevel(profile.totalExp)),
      }))

      setIsDataLoaded(true)
      console.log('[Data] Data loaded for user:', currentUser.id, ', collection:', userData.collection.length, 'stickers, totalExp:', userData.profile.totalExp, '(source:', dataSource, ')')
    }

    loadData()
  }, [currentUser, isAuthLoading, allStickerIds])

  const handleRetryAuth = useCallback(async () => {
    setDataLoadError(null)
    try {
      const result = await authService.ensureAuthenticated()
      if (result) {
        await refreshUser()
        return
      }
    } catch (error) {
      console.error('[Auth] Retry failed:', error)
    }
    setDataLoadError('認証に失敗しました。通信状態を確認して再試行してください。')
  }, [refreshUser])

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

          // 各投稿のページデータを取得
          // page_snapshotがある場合はそれを優先使用（投稿時点の状態を表示）
          // ない場合は従来通りpage_idからリアルタイム取得（後方互換性）
          const convertedPosts: Post[] = await Promise.all(supabasePosts.map(async (sp) => {
            let pageData: Post['pageData'] = undefined

            // page_snapshotがある場合は投稿時点のスナップショットを使用
            // 注意: スナップショットはsnake_case (image_url) で保存、フロントはcamelCase (imageUrl) なので変換が必要
            const snapshot = (sp as unknown as { page_snapshot?: PageSnapshot | null }).page_snapshot
            if (snapshot) {
              // スナップショットからpageDataを構築（snake_case → camelCase変換）
              pageData = {
                placedStickers: snapshot.placedStickers?.map(s => ({
                  id: s.id,
                  stickerId: s.stickerId,
                  sticker: {
                    id: s.sticker.id,
                    name: s.sticker.name,
                    imageUrl: s.sticker.image_url,  // snake_case → camelCase
                    rarity: s.sticker.rarity || 1,
                    type: 'normal' as const,
                  },
                  pageId: sp.page_id || '',
                  x: s.x,
                  y: s.y,
                  rotation: s.rotation,
                  scale: s.scale,
                  zIndex: s.zIndex,
                  placedAt: new Date().toISOString(),
                  upgradeRank: s.upgradeRank,
                })) || [],
                placedDecoItems: snapshot.placedDecoItems?.map(d => ({
                  id: d.id,
                  decoItemId: d.decoItemId,
                  decoItem: {
                    id: d.decoItem.id,
                    name: d.decoItem.name,
                    imageUrl: d.decoItem.image_url,  // snake_case → camelCase
                    type: 'stamp' as const,  // default
                    baseWidth: d.width || 60,
                    baseHeight: d.height || 60,
                    rotatable: true,
                    rarity: 1 as const,
                    obtainMethod: 'default' as const,
                  },
                  pageId: sp.page_id || '',
                  x: d.x,
                  y: d.y,
                  rotation: d.rotation,
                  scale: d.scale,
                  width: d.width,
                  height: d.height,
                  zIndex: d.zIndex,
                  placedAt: new Date().toISOString(),
                })),
                backgroundColor: snapshot.backgroundColor,
                themeConfig: snapshot.themeConfig,
              }
              console.log('[Timeline] Using snapshot for post:', sp.id, 'stickers:', pageData.placedStickers.length)
            } else if (sp.page_id) {
              // スナップショットがない場合は従来通りリアルタイム取得（後方互換性）
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
                  themeConfig: pageResult.themeConfig,
                }
                console.log('[Timeline] Page data loaded from DB for post:', sp.id, 'stickers:', pageData.placedStickers.length, 'decos:', pageData.placedDecoItems?.length || 0)
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
              userFrameId: (sp.author as unknown as { selected_frame_id?: string })?.selected_frame_id || null,
              userLevel: calculateLevel(((sp.author as unknown as { total_exp?: number })?.total_exp) || 0),
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

          setPosts(convertedPosts)
        }
      } catch (error) {
        console.error('[Timeline] Failed to load posts:', error)
      }
    }

    loadTimeline()
  }, [isDataLoaded, currentDataSource, currentUser?.supabaseId])

  // フレンド一覧と交換履歴をSupabaseから読み込む
  useEffect(() => {
    if (!currentUser?.supabaseId || currentDataSource !== 'supabase') {
      setFriends([])
      setTradeHistory([])
      return
    }

    const loadFriendsAndHistory = async () => {
      try {
        const [followers, following] = await Promise.all([
          profileService.getFollowers(currentUser.supabaseId, currentUser.supabaseId),
          profileService.getFollowing(currentUser.supabaseId, currentUser.supabaseId),
        ])

        const followingIds = new Set(following.map(f => f.id))
        const mutuals = followers.filter(f => followingIds.has(f.id))

        setFriends(mutuals.map(f => ({
          id: f.id,
          name: f.name,
          avatarUrl: f.avatarUrl || undefined,
          frameId: f.frameId || null,
          isOnline: false,
        })))
      } catch (error) {
        console.error('[Trade] Failed to load friends:', error)
        setFriends([])
      }

      try {
        const supabase = getSupabase()
        const { data: trades, error } = await supabase
          .from('trades')
          .select('id,user1_id,user2_id,completed_at,created_at,status')
          .or(`user1_id.eq.${currentUser.supabaseId},user2_id.eq.${currentUser.supabaseId}`)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(20)

        if (error || !trades || trades.length === 0) {
          if (error) {
            console.error('[Trade] Failed to load trade history:', error)
          }
          setTradeHistory([])
          return
        }

        const tradeIds = trades.map(t => t.id)
        const partnerIds = trades
          .map(t => (t.user1_id === currentUser.supabaseId ? t.user2_id : t.user1_id))
          .filter(Boolean) as string[]

        const [partnersResult, itemsResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, display_name, avatar_url')
            .in('id', partnerIds),
          supabase
            .from('trade_items')
            .select(`
              trade_id,
              user_id,
              quantity,
              user_sticker:user_stickers(
                sticker:stickers(name, rarity)
              )
            `)
            .in('trade_id', tradeIds),
        ])

        const partners = new Map(
          (partnersResult.data || []).map(p => [p.id, p])
        )

        const itemsByTrade = new Map<string, { given: { name: string; rarity: number }[]; received: { name: string; rarity: number }[] }>()

        for (const item of itemsResult.data || []) {
          const tradeId = item.trade_id as string
          const quantity = (item as { quantity?: number }).quantity ?? 1
          const sticker = (item as { user_sticker?: { sticker?: { name?: string; rarity?: number } } }).user_sticker?.sticker
          if (!sticker?.name) continue

          const bucket = itemsByTrade.get(tradeId) || { given: [], received: [] }
          const target = item.user_id === currentUser.supabaseId ? bucket.given : bucket.received
          for (let i = 0; i < quantity; i++) {
            target.push({
              name: sticker.name,
              rarity: sticker.rarity ?? 1,
            })
          }
          itemsByTrade.set(tradeId, bucket)
        }

        const history = trades.map(t => {
          const partnerId = t.user1_id === currentUser.supabaseId ? t.user2_id : t.user1_id
          const partner = partnerId ? partners.get(partnerId) : null
          const items = itemsByTrade.get(t.id) || { given: [], received: [] }
          return {
            id: t.id,
            partnerName: partner?.display_name || '交換相手',
            partnerAvatarUrl: partner?.avatar_url || undefined,
            givenStickers: items.given,
            receivedStickers: items.received,
            tradedAt: t.completed_at || t.created_at,
          }
        })

        setTradeHistory(history)
      } catch (error) {
        console.error('[Trade] Failed to build trade history:', error)
        setTradeHistory([])
      }
    }

    loadFriendsAndHistory()
  }, [currentUser?.supabaseId, currentDataSource])

  // データ変更時に自動保存（デバウンス）
  useEffect(() => {
    if (!isDataLoaded) return
    const timer = setTimeout(() => {
      saveData()
    }, 1000) // 1秒後に保存
    return () => clearTimeout(timer)
  }, [isDataLoaded, collection, userMonetization, placedStickers, placedDecoItems, pages, coverDesignId, themeId, totalExp, saveData])

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
  // 経験値獲得ハンドラー（デイリー上限対応）
  // 注: totalExpRefを使用してクロージャのstale値問題を回避
  const gainExp = useCallback(async (action: ExpAction, options?: { suppressLevelUpModal?: boolean }) => {
    const currentTotalExp = totalExpRef.current
    const oldLevel = calculateLevel(currentTotalExp)
    console.log('[Exp] gainExp called:', action, 'current totalExp:', currentTotalExp)

    if (oldLevel >= MAX_LEVEL) {
      return {
        newTotalExp: currentTotalExp,
        newLevel: oldLevel,
        oldLevel,
        leveledUp: false,
        levelsGained: 0,
        newTitle: getLevelTitle(oldLevel),
        expGained: 0,
        dailyLimitReached: false,
        remainingToday: null,
      } as ExpGainResult
    }

    // Supabaseモードはサーバー側で日次上限も含めて更新
    if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
      const serverResult = await profileService.applyExpAction(currentUser.supabaseId, action)
      if (!serverResult || !serverResult.success) {
        console.error('[Exp] applyExpAction failed')
        return null
      }

      const newTotalExp = serverResult.totalExp ?? currentTotalExp
      const newLevel = calculateLevel(newTotalExp)

      setTotalExp(newTotalExp)
      totalExpRef.current = newTotalExp
      setExpDailyCounts(serverResult.dailyCounts || createInitialDailyCounts())

      setUserProfile(prev => ({
        ...prev,
        level: newLevel,
        exp: getCurrentLevelExp(newTotalExp),
        expToNextLevel: getExpToNextLevel(newTotalExp),
        title: getLevelTitle(newLevel),
      }))

      if (newLevel > oldLevel) {
        const rewards = getLevelUpRewards(newLevel)
        setLevelUpInfo({ level: newLevel, rewards })
        // suppressLevelUpModalがtrueの場合はモーダルを開かない（デイリーボーナス等から呼ばれた場合）
        if (!options?.suppressLevelUpModal) {
          setIsLevelUpModalOpen(true)
        }
      }

      return {
        newTotalExp,
        newLevel,
        oldLevel,
        leveledUp: newLevel > oldLevel,
        levelsGained: newLevel - oldLevel,
        newTitle: getLevelTitle(newLevel),
        expGained: serverResult.expGained,
        dailyLimitReached: serverResult.dailyLimitReached,
        remainingToday: null,
      } as ExpGainResult
    }

    // ローカルモードはクライアントで日次上限を処理
    const result = addExpWithDailyLimit(currentTotalExp, action, expDailyCounts)
    console.log('[Exp] addExpWithDailyLimit result:', result)

    setTotalExp(result.newTotalExp)
    totalExpRef.current = result.newTotalExp
    setExpDailyCounts(result.newDailyCounts)

    setUserProfile(prev => ({
      ...prev,
      level: result.newLevel,
      exp: getCurrentLevelExp(result.newTotalExp),
      expToNextLevel: getExpToNextLevel(result.newTotalExp),
      title: result.newTitle,
    }))

    if (result.leveledUp) {
      const rewards = getLevelUpRewards(result.newLevel)
      setLevelUpInfo({ level: result.newLevel, rewards })
      // suppressLevelUpModalがtrueの場合はモーダルを開かない（デイリーボーナス等から呼ばれた場合）
      if (!options?.suppressLevelUpModal) {
        setIsLevelUpModalOpen(true)
      }
    }

    return result
  }, [currentDataSource, currentUser?.supabaseId, expDailyCounts])

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
      const stickerScreenY = containerRect.top + 16 + (y * BOOK_HEIGHT)

      setPlaceEffectPosition({ x: stickerScreenX, y: stickerScreenY })
      setShowPlaceEffect(true)
    }

    setPlacedStickers(prev => [...prev, newPlacedSticker])
    setSelectedSticker(null)
    setIsDragging(false)

    // シールを貼ったら経験値獲得 (+5 EXP)
    void gainExp('place_sticker')

    // Supabaseモードかつテストモードでない場合、配置をSupabaseに同期
    // テストモードではユーザーが実際にシールを所持していないため、同期をスキップ
    if (currentDataSource === 'supabase' && adminMode !== 'test') {
      (async () => {
        try {
          // pageIdがUUID形式でない場合、Supabaseからシール帳を初期化して自動で貼りなおす
          let resolvedPageId = pageId
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
              theme: page.themeConfig as BookPage['theme'] ?? undefined,
            }))
            setPages(supabasePages)

            const localIndex = pages.findIndex(p => p.id === pageId)
            const targetIndex = localIndex >= 0 ? localIndex : currentPage
            resolvedPageId = stickerBook.pages[targetIndex]?.id || stickerBook.pages[0]?.id || pageId

            // ローカルの配置も新しいページIDに合わせる
            setPlacedStickers(prev => prev.map(s =>
              s.id === newPlacedSticker.id ? { ...s, pageId: resolvedPageId } : s
            ))
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
            pageId: resolvedPageId,
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
            setEditingSticker(prev => prev && prev.id === newPlacedSticker.id ? { ...prev, id: placementId } : prev)
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
  }, [selectedSticker, placedStickers, gainExp, isSpreadView, pages, currentPage, collection, currentDataSource, currentUser, adminMode])

  // 編集中シールのページサイド（見開き時に左右どちらか）
  const [editingStickerPageSide, setEditingStickerPageSide] = useState<'left' | 'right'>('left')

  // 操作中は背景のアニメだけ一時停止（見た目は維持、操作は軽く）
  useEffect(() => {
    if (typeof document === 'undefined') return
    const shouldPause = Boolean((selectedSticker && isDragging) || editingSticker || editingDecoItem)
    const className = 'drag-optimizing'
    if (shouldPause) {
      document.body.classList.add(className)
    } else {
      document.body.classList.remove(className)
    }
    return () => {
      document.body.classList.remove(className)
    }
  }, [selectedSticker, isDragging, editingSticker, editingDecoItem])

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
      const stickerScreenY = containerRect.top + 16 + (sticker.y * BOOK_HEIGHT)

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
    setEditingSticker(prev => prev ? { ...prev, x, y } : prev)
  }, [])

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

    setEditingSticker(prev => prev ? { ...prev, pageId: newPageId } : prev)
  }, [editingSticker, currentPage, pages])

  // Handle sticker rotation (回転のみ更新 - 編集モード継続)
  const handleEditingRotate = useCallback((rotation: number) => {
    setEditingSticker(prev => prev ? { ...prev, rotation } : prev)
  }, [])

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
    const clamped = (() => {
      const stickerSize = 60 * (updated.scale ?? 1)
      const halfW = stickerSize / 2 / BOOK_WIDTH
      const halfH = stickerSize / 2 / BOOK_HEIGHT
      const minX = Math.max(0, halfW)
      const maxX = Math.min(1, 1 - halfW)
      const minY = Math.max(0, halfH)
      const maxY = Math.min(1, 1 - halfH)
      return {
        ...updated,
        x: Math.max(minX, Math.min(maxX, updated.x)),
        y: Math.max(minY, Math.min(maxY, updated.y)),
      }
    })()

    setPlacedStickers(prev => prev.map(s => s.id === clamped.id ? clamped : s))
    setEditingSticker(null)

    // Supabaseモードの場合、配置をSupabaseに同期
    if (currentDataSource === 'supabase' && adminMode !== 'test' && isUUID(clamped.id)) {
      stickerBookService.updatePlacement(clamped.id, {
        x: clamped.x,
        y: clamped.y,
        rotation: clamped.rotation,
        scale: clamped.scale,
        zIndex: clamped.zIndex,
        pageId: clamped.pageId,
      })
        .then(success => {
          if (success) {
            console.log('[Supabase] Placement updated:', clamped.id)
          }
        })
        .catch(error => {
          console.error('[Supabase] Failed to update placement:', error)
        })
    }
  }, [currentDataSource, adminMode])

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
      const screenY = containerRect.top + 16 + (y * BOOK_HEIGHT)

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
    setEditingDecoItem(prev => prev ? { ...prev, x, y } : prev)
  }, [])

  // デコアイテムサイズ更新ハンドラー（リサイズ中）
  const handleEditingDecoResize = useCallback((width: number, height: number) => {
    setEditingDecoItem(prev => prev ? { ...prev, width, height } : prev)
  }, [])

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

    setEditingDecoItem(prev => prev ? { ...prev, pageId: newPageId } : prev)
  }, [editingDecoItem, currentPage, pages])

  // デコアイテム回転更新ハンドラー（回転ハンドル操作中）
  const handleEditingDecoRotate = useCallback((rotation: number) => {
    setEditingDecoItem(prev => prev ? { ...prev, rotation } : prev)
  }, [])

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
    const banner = gachaBanners.find(b => b.id === bannerId)
    if (!banner) return

    const cost = count === 1 ? banner.costSingle : banner.costMulti

    // Supabase同期の場合は先に通貨を消費（テストモードはスキップ）
    if (currentDataSource === 'supabase' && currentUser?.id && adminMode !== 'test') {
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
      const newBalance = deductResult.newBalance
      if (newBalance) {
        setUserMonetization(prev => ({
          ...prev,
          tickets: newBalance.tickets,
          gems: newBalance.gems,
          stars: newBalance.stars,
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
    const hadNoStickers = collection.length === 0
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

    // 初めてのシールをゲットした時のボーナス
    if (hadNoStickers && newStickers.length > 0) {
      void gainExp('first_sticker')
    }

    // 経験値獲得（1回引く: +10 EXP, 10連: +100 EXP）
    void gainExp(count === 1 ? 'gacha_single' : 'gacha_ten')
  }, [gainExp, collection, currentDataSource, currentUser, userMonetization, weightedRandomPull, adminMode])

  // ガチャを引く（通貨チェック付き）
  const handlePullGacha = useCallback((bannerId: string, count: number) => {
    const banner = gachaBanners.find(b => b.id === bannerId)
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

        // 投稿者に経験値を付与（いいね受け取り）
        const postAuthorId = currentPost?.userId
        if (dbType === 'like' && currentUser.supabaseId && postAuthorId && postAuthorId !== currentUser.supabaseId) {
          profileService.awardPostLikeExp(postId, currentUser.supabaseId).catch(error => {
            console.error('[Timeline] Failed to award like exp:', error)
          })
        }
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
  const handleReport = useCallback(async (input: CreateReportInput) => {
    if (!currentUser?.supabaseId) {
      setIsReportModalOpen(false)
      setReportTarget(null)
      return
    }
    try {
      await moderationService.createReport(
        currentUser.supabaseId,
        input.targetType,
        input.targetId,
        input.category,
        input.comment
      )
    } catch (error) {
      console.error('[Moderation] Report submit error:', error)
    } finally {
      setIsReportModalOpen(false)
      setReportTarget(null)
    }
  }, [currentUser?.supabaseId])

  // Handle block
  const handleBlock = useCallback(async (input: CreateBlockInput) => {
    if (!currentUser?.supabaseId) {
      setIsBlockModalOpen(false)
      setBlockTarget(null)
      return
    }
    try {
      const success = await moderationService.blockUser(currentUser.supabaseId, input.blockedId, input.reason)
      if (success) {
        setBlockedUserIds(prev => {
          if (prev.includes(input.blockedId)) return prev
          return [...prev, input.blockedId]
        })
        setBlockedUsersCount(prev => (blockedUserIds.includes(input.blockedId) ? prev : prev + 1))
      }
    } catch (error) {
      console.error('[Moderation] Block submit error:', error)
    } finally {
      setIsBlockModalOpen(false)
      setBlockTarget(null)
    }
  }, [currentUser?.supabaseId])

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

  // Check and collect daily bonus when user is authenticated
  useEffect(() => {
    // Supabaseモードでユーザーがまだ設定されていない場合は待機
    if (currentDataSource === 'supabase' && !currentUser?.id) {
      return
    }

    // 既に処理済みの場合はスキップ
    if (dailyBonusProcessedRef.current) {
      return
    }

    const processDailyBonus = async () => {
      // 処理開始前にフラグを立てる（二重実行防止）
      dailyBonusProcessedRef.current = true

      // Calculate bonus amounts
      const plan = userMonetization.subscription === 'none'
        ? { dailyBonusTickets: 0, skipAds: false, dailyStars: 0 }
        : { dailyBonusTickets: 2, skipAds: userMonetization.subscription !== 'light', dailyStars: userMonetization.subscription === 'light' ? 5 : userMonetization.subscription === 'plus' ? 15 : 30 }

      const baseTickets = 3 // DAILY_FREE_TICKETS
      const adSkipTickets = plan.skipAds ? 10 : 0 // MAX_AD_WATCHES_PER_DAY
      const totalTickets = baseTickets + plan.dailyBonusTickets + adSkipTickets
      const totalStars = plan.dailyStars

      // Supabase同期の場合はDBで重複チェック
      if (currentDataSource === 'supabase' && currentUser?.id) {
        // まずデイリーログインを記録して、既にログイン済みかを確認
        const loginResult = await statsService.recordDailyLogin(currentUser.id)
        console.log('[DailyBonus] recordDailyLogin result:', loginResult)

        if (loginResult.alreadyLoggedIn) {
          // 今日は既にログインボーナスを受け取っている
          console.log('[DailyBonus] Already logged in today, skipping bonus modal')
          return
        }

        console.log('[DailyBonus] Granting to Supabase:', { totalTickets, totalStars })
        const result = await grantDailyBonusToSupabase(currentUser.id, totalTickets, totalStars)
        const grantedBalance = result.newBalance
        if (result.success && grantedBalance) {
          setUserMonetization(prev => ({
            ...prev,
            tickets: grantedBalance.tickets,
            gems: grantedBalance.gems,
            stars: grantedBalance.stars,
            lastDailyReset: new Date().toISOString().split('T')[0],
            dailyTicketsCollected: true,
            dailyStarsCollected: true,
            completedMissions: [] as string[],
            adsWatchedToday: 0,
          }))

          console.log('[DailyBonus] Daily login recorded, streak:', loginResult.loginStreak)

          // デイリーログインEXP（レベルアップモーダルはデイリーボーナスモーダル閉じた後に表示）
          void gainExp('daily_login', { suppressLevelUpModal: true })
        } else {
          // フォールバック：ローカルのみ更新
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
      } else {
        // ローカルのみの場合は従来通り（localStorageベースのチェック）
        if (!needsDailyReset(userMonetization.lastDailyReset)) return

        setUserMonetization(prev => {
          let state: UserMonetization = { ...prev, lastDailyReset: new Date().toISOString().split('T')[0], dailyTicketsCollected: false, dailyStarsCollected: false, completedMissions: [] as string[], adsWatchedToday: 0 }
          state = collectDailyTickets(state)
          state = collectDailyStars(state)
          return state
        })
        // デイリーログインEXP（レベルアップモーダルはデイリーボーナスモーダル閉じた後に表示）
        void gainExp('daily_login', { suppressLevelUpModal: true })

        setDailyBonusReceived({
          tickets: totalTickets,
          stars: totalStars,
        })
        setIsDailyBonusModalOpen(true)
      }
    }

    processDailyBonus()
  }, [currentDataSource, currentUser?.id]) // Run when user is authenticated

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        // 現在のページが表紙/裏表紙かどうかを判定
        const currentPageData = pages[currentPage]
        const isBackCover = currentPageData?.type === 'back-cover'
        // シール選択中に表紙/裏表紙にいる場合は、ページがめくられるので見開き状態として扱う
        // これにより、flipNext()後もbounds計算が正しく行われる
        const isOnCoverOrBack = (currentPageData?.type === 'cover' || currentPageData?.type === 'back-cover') && !selectedSticker
        // シール操作中かどうか（貼り付け中または編集中）
        const isStickerOperating = !!(selectedSticker && isDragging) || !!editingSticker
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
                  bookTheme={currentTheme}
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
                    const actualIsOnCoverOrBack = currentPageData?.type === 'cover' || currentPageData?.type === 'back-cover'

                    // シール選択中は表紙/裏表紙からめくられているはずなので、見開き表示として扱う
                    // これにより、アニメーション完了前にドロップしても正しいページに配置される
                    const isOnCoverOrBack = actualIsOnCoverOrBack && !selectedSticker

                    // 表紙/裏表紙からシールを選択した場合、最初のコンテンツページに配置
                    let targetPageIndex = currentPage
                    if (actualIsOnCoverOrBack && selectedSticker) {
                      // 表紙からなら次のページ（通常page 1）、裏表紙からなら前のページ
                      if (currentPageData?.type === 'cover') {
                        targetPageIndex = 1 // 表紙の次のページ
                      } else if (currentPageData?.type === 'back-cover') {
                        targetPageIndex = pages.length - 2 // 裏表紙の前のページ
                      }
                    }
                    const targetPageData = pages[targetPageIndex]

                    if (isSpreadView && !isOnCoverOrBack) {
                      // 見開きモードでは、x座標が0.5未満なら左ページ、0.5以上なら右ページ
                      // 現在のページ（または表紙/裏表紙からめくった後のターゲットページ）が左か右かを確認
                      const isTargetPageLeft = targetPageData?.side === 'left'

                      // 左右のページインデックスを計算
                      let leftPageIndex: number
                      let rightPageIndex: number

                      if (isTargetPageLeft) {
                        leftPageIndex = targetPageIndex
                        rightPageIndex = targetPageIndex + 1
                      } else {
                        leftPageIndex = targetPageIndex - 1
                        rightPageIndex = targetPageIndex
                      }

                      // ドロップ位置に基づいて配置先ページを決定
                      if (x >= 0.5) {
                        // 右ページに配置
                        const rightPageId = pages[rightPageIndex]?.id || targetPageData?.id || ''
                        // x座標を0-1に正規化（0.5-1 → 0-1）
                        const adjustedX = (x - 0.5) * 2
                        handlePlaceSticker(rightPageId, adjustedX, y, rotation)
                      } else {
                        // 左ページに配置
                        const leftPageId = pages[leftPageIndex]?.id || targetPageData?.id || ''
                        // x座標を0-1に正規化（0-0.5 → 0-1）
                        const adjustedX = x * 2
                        handlePlaceSticker(leftPageId, adjustedX, y, rotation)
                      }
                    } else {
                      // 単ページモードまたは表紙・裏表紙の場合はそのまま
                      const pageId = targetPageData?.id || ''
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
                  isSinglePage={isOnCoverOrBack}
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
                    onClose={() => handleUpdateSticker(editingSticker)}
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
                      <div className="text-center text-[11px] mb-2" style={{ color: '#9CA3AF' }}>
                        {Math.round(editingDecoItem.width ?? editingDecoItem.decoItem.baseWidth ?? 60)} × {Math.round(editingDecoItem.height ?? editingDecoItem.decoItem.baseHeight ?? 60)}
                        ・ {Math.round(editingDecoItem.rotation ?? 0)}°
                      </div>
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
            {/* StickerTray - シール操作中は非表示（状態は維持） */}
            <div className="flex-shrink-0">
              <StickerTray
                stickers={placeableStickers}
                hidden={shouldHideUI}
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
                onGoGacha={() => setActiveTab('gacha')}
              />
            </div>
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
                {(() => {
                  const currentPageData = pages[currentPage]
                  let label = ''
                  // 表紙の場合
                  if (currentPageData?.type === 'cover') {
                    label = 'ひょうし'
                  } else if (currentPageData?.type === 'back-cover') {
                    // 裏表紙の場合
                    label = 'うら'
                  } else {
                    // 通常ページの場合：表紙と裏表紙を除いたページ番号を計算
                    const regularPages = pages.filter(p => p.type === 'page')
                    const pageIndex = regularPages.findIndex(p => p.id === currentPageData?.id)
                    const totalRegularPages = regularPages.length
                    if (pageIndex >= 0) {
                      // 見開きモードの場合、左右のページ番号を表示
                      if (isSpreadView && currentPageData?.side === 'left') {
                        const rightPageNum = pageIndex + 2
                        if (rightPageNum <= totalRegularPages) {
                          label = `${pageIndex + 1}-${rightPageNum}`
                        } else {
                          label = `${pageIndex + 1}/${totalRegularPages}`
                        }
                      } else {
                        label = `${pageIndex + 1}/${totalRegularPages}`
                      }
                    }
                  }

                  const isLong = label.length >= 4
                  return (
                    <span
                      className="relative z-10 font-bold text-white"
                      style={{
                        fontFamily: "'M PLUS Rounded 1c', sans-serif",
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        fontSize: isLong ? '12px' : '14px',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        transform: 'translateY(1px)',
                      }}
                    >
                      {label}
                    </span>
                  )
                })()}
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
            onGoGacha={() => setActiveTab('gacha')}
          />
        )

      case 'gacha':
        return (
          <LazyGachaView
            banners={gachaBanners}
            userCurrency={userCurrency}
            onPullSingle={(bannerId) => handlePullGacha(bannerId, 1)}
            onPullMulti={(bannerId) => handlePullGacha(bannerId, 10)}
            onOpenShop={handleOpenShop}
            onInsufficientFunds={handleInsufficientFunds}
            onWatchAd={handleOpenAdReward}
            remainingAdWatches={getRemainingAdWatches(userMonetization)}
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
                onClick={() => setTradeSubTab('board')}
                className="flex-1 py-3 font-bold text-sm transition-all"
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  color: tradeSubTab === 'board' ? '#8B5A2B' : '#C4A484',
                  borderBottom: tradeSubTab === 'board' ? '3px solid #8B5A2B' : '3px solid transparent',
                  marginBottom: '-3px',
                }}
              >
                📋 けいじばん
              </button>
            </div>

            {/* コンテンツ */}
            <div className="flex-1 overflow-hidden">
              {tradeSubTab === 'trade' && (
                <TradeView
                  userId={currentUser?.supabaseId}
                  friends={friends}
                  history={tradeHistory}
                  onStartMatching={handleStartMatching}
                  onTradeWithFriend={(friendId) => {
                    const friend = friends.find(f => f.id === friendId)
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
                  onTradeCompleted={() => void gainExp('trade_complete')}
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
                  asyncBadgeCount={tradeBadgeCount}
                />
              )}
              {tradeSubTab === 'board' && (
                tradeBoardDetailPostId ? (
                  <TradeBoardPostDetail
                    postId={tradeBoardDetailPostId}
                    userId={currentUser?.supabaseId}
                    onBack={() => setTradeBoardDetailPostId(null)}
                    onStartDirectTrade={async (partnerId) => {
                      if (!currentUser?.supabaseId) return
                      try {
                        const session = await asyncTradeService.inviteToTrade(currentUser.supabaseId, partnerId)
                        if (session) {
                          return { success: true, message: 'こうかんにさそいました！' }
                        } else {
                          return { success: true, message: 'すでにこうかん中です！' }
                        }
                      } catch (e) {
                        console.error('[TradeBoard] 交換招待エラー:', e)
                        return { success: false, message: 'エラーが発生しました' }
                      }
                    }}
                    onViewProfile={async (userId) => {
                      try {
                        const profileData = await profileService.getOtherUserProfile(userId, currentUser?.id)
                        if (!profileData) return
                        const stickerBook = await stickerBookService.getUserStickerBook(userId)
                        const otherProfile: OtherUserProfile = {
                          id: profileData.id,
                          name: profileData.name,
                          avatarUrl: profileData.avatarUrl || undefined,
                          frameId: profileData.frameId,
                          level: profileData.level,
                          title: profileData.title,
                          bio: profileData.bio,
                          isFollowing: profileData.isFollowing,
                          stats: profileData.stats,
                        }
                        const bookPages: BookPage[] = stickerBook?.pages.map(p => ({ id: p.id, pageNumber: p.pageNumber, type: p.pageType, side: p.side })) || []
                        const bookStickers: PlacedSticker[] = stickerBook?.pages.flatMap(p => p.stickers) || []
                        const bookDecoItems: PlacedDecoItem[] = stickerBook?.pages.flatMap(p => p.decoItems || []) || []
                        const stickerBookPreviews: StickerBookPreview[] = stickerBook?.pages
                          .filter(p => p.pageType === 'page')
                          .map(p => ({ pageId: p.id, pageNumber: p.pageNumber, stickerCount: p.stickers.length })) || []
                        setSelectedOtherUser(otherProfile)
                        setSelectedUserStickerBook(stickerBookPreviews)
                        setSelectedUserBookPages(bookPages)
                        setSelectedUserBookStickers(bookStickers)
                        setSelectedUserBookDecoItems(bookDecoItems)
                        setSelectedUserCoverDesignId(stickerBook?.coverDesignId || 'cover-default')
                        setIsOtherUserProfileOpen(true)
                      } catch (e) {
                        console.error('[TradeBoard] プロフィール取得エラー:', e)
                      }
                    }}
                  />
                ) : (
                  <TradeBoardView
                    key={tradeBoardRefreshKey}
                    userId={currentUser?.supabaseId}
                    onOpenCreate={() => setIsTradeBoardCreateOpen(true)}
                    onOpenDetail={(postId) => setTradeBoardDetailPostId(postId)}
                  />
                )
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

                  // Post形式に変換（page_snapshotを優先使用）
                  const formattedPosts: Post[] = await Promise.all(followingData.map(async (p) => {
                    let pageData: Post['pageData'] = undefined

                    // page_snapshotがある場合は投稿時点のスナップショットを使用
                    // 注意: スナップショットはsnake_case (image_url) で保存、フロントはcamelCase (imageUrl) なので変換が必要
                    const snapshot = (p as unknown as { page_snapshot?: PageSnapshot | null }).page_snapshot
                    if (snapshot) {
                      pageData = {
                        placedStickers: snapshot.placedStickers?.map(s => ({
                          id: s.id,
                          stickerId: s.stickerId,
                          sticker: {
                            id: s.sticker.id,
                            name: s.sticker.name,
                            imageUrl: s.sticker.image_url,  // snake_case → camelCase
                            rarity: s.sticker.rarity || 1,
                            type: 'normal' as const,
                          },
                          pageId: p.page_id || '',
                          x: s.x,
                          y: s.y,
                          rotation: s.rotation,
                          scale: s.scale,
                          zIndex: s.zIndex,
                          placedAt: new Date().toISOString(),
                          upgradeRank: s.upgradeRank,
                        })) || [],
                        placedDecoItems: snapshot.placedDecoItems?.map(d => ({
                          id: d.id,
                          decoItemId: d.decoItemId,
                          decoItem: {
                            id: d.decoItem.id,
                            name: d.decoItem.name,
                            imageUrl: d.decoItem.image_url,  // snake_case → camelCase
                            type: 'stamp' as const,  // default
                            baseWidth: d.width || 60,
                            baseHeight: d.height || 60,
                            rotatable: true,
                            rarity: 1 as const,
                            obtainMethod: 'default' as const,
                          },
                          pageId: p.page_id || '',
                          x: d.x,
                          y: d.y,
                          rotation: d.rotation,
                          scale: d.scale,
                          width: d.width,
                          height: d.height,
                          zIndex: d.zIndex,
                          placedAt: new Date().toISOString(),
                        })),
                        backgroundColor: snapshot.backgroundColor,
                      }
                    } else if (p.page_id) {
                      // スナップショットがない場合は従来通りリアルタイム取得
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
                      userFrameId: (p.author as unknown as { selected_frame_id?: string })?.selected_frame_id || null,
                      userLevel: calculateLevel(((p.author as unknown as { total_exp?: number })?.total_exp) || 0),
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

                  // Post形式に変換（page_snapshotを優先使用）
                  const formattedPosts: Post[] = await Promise.all(likedData.map(async (p) => {
                    let pageData: Post['pageData'] = undefined

                    // page_snapshotがある場合は投稿時点のスナップショットを使用
                    // 注意: スナップショットはsnake_case (image_url) で保存、フロントはcamelCase (imageUrl) なので変換が必要
                    const snapshot = (p as unknown as { page_snapshot?: PageSnapshot | null }).page_snapshot
                    if (snapshot) {
                      pageData = {
                        placedStickers: snapshot.placedStickers?.map(s => ({
                          id: s.id,
                          stickerId: s.stickerId,
                          sticker: {
                            id: s.sticker.id,
                            name: s.sticker.name,
                            imageUrl: s.sticker.image_url,  // snake_case → camelCase
                            rarity: s.sticker.rarity || 1,
                            type: 'normal' as const,
                          },
                          pageId: p.page_id || '',
                          x: s.x,
                          y: s.y,
                          rotation: s.rotation,
                          scale: s.scale,
                          zIndex: s.zIndex,
                          placedAt: new Date().toISOString(),
                          upgradeRank: s.upgradeRank,
                        })) || [],
                        placedDecoItems: snapshot.placedDecoItems?.map(d => ({
                          id: d.id,
                          decoItemId: d.decoItemId,
                          decoItem: {
                            id: d.decoItem.id,
                            name: d.decoItem.name,
                            imageUrl: d.decoItem.image_url,  // snake_case → camelCase
                            type: 'stamp' as const,  // default
                            baseWidth: d.width || 60,
                            baseHeight: d.height || 60,
                            rotatable: true,
                            rarity: 1 as const,
                            obtainMethod: 'default' as const,
                          },
                          pageId: p.page_id || '',
                          x: d.x,
                          y: d.y,
                          rotation: d.rotation,
                          scale: d.scale,
                          width: d.width,
                          height: d.height,
                          zIndex: d.zIndex,
                          placedAt: new Date().toISOString(),
                        })),
                        backgroundColor: snapshot.backgroundColor,
                      }
                      console.log('[Timeline/Liked] Using snapshot for post:', p.id)
                    } else if (p.page_id) {
                      // スナップショットがない場合は従来通りリアルタイム取得
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
                        console.log('[Timeline/Liked] Page data loaded from DB for post:', p.id)
                      }
                    }

                    return {
                      id: p.id,
                      userId: p.user_id,
                      userName: p.author?.display_name || p.author?.username || '名無し',
                      userAvatarUrl: p.author?.avatar_url || undefined,
                      userFrameId: (p.author as unknown as { selected_frame_id?: string })?.selected_frame_id || null,
                      userLevel: calculateLevel(((p.author as unknown as { total_exp?: number })?.total_exp) || 0),
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
                    parentId: c.parent_id,
                    replyCount: c.reply_count || 0,
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
                  frameId: profileData.frameId,  // キャラクター報酬フレーム
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
                setSelectedUserCoverDesignId(stickerBook?.coverDesignId || 'cover-default')
                setIsOtherUserProfileOpen(true)

                console.log('[Timeline] ユーザープロフィール表示:', userProfile.name)
              } catch (error) {
                console.error('[Timeline] ユーザープロフィール取得エラー:', error)
              }
            }}
            onFollow={async (userId) => {
              if (!currentUser) return
              try {
                const prevStatus = getLocalFollowStatus(userId)
                // フォロー実行
                const success = await profileService.toggleFollow(currentUser.id, userId)
                if (success) {
                  // フォロー状態を取得して投稿を更新
                  const newStatus = await profileService.getFollowStatus(currentUser.id, userId)
                  const resolvedPrev = prevStatus ?? (newStatus === 'none' ? 'following' : 'none')
                  applyFollowStatsDelta(resolvedPrev, newStatus)
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
            blockedUserIds={blockedUserIds}
            onOpenSearch={() => setIsUserSearchModalOpen(true)}
            onRefresh={async () => {
              // プルトゥリフレッシュ：現在のタブに応じてデータを再取得
              console.log('[Timeline] プルトゥリフレッシュ開始:', activeTimelineTab)
              try {
                if (activeTimelineTab === 'liked' && currentUser?.supabaseId) {
                  // いいねした投稿を再取得（PostWithDetails形式で返ってくる）
                  const likedPostsData = await timelineService.getLikedPosts(currentUser.supabaseId)
                  if (likedPostsData) {
                    const formatted: Post[] = await Promise.all(likedPostsData.map(async (p) => {
                      const followStatuses = currentUser.supabaseId && p.user_id !== currentUser.supabaseId
                        ? await profileService.getFollowStatusBatch(currentUser.supabaseId, [p.user_id])
                        : {}

                      const snapshot = (p as unknown as { page_snapshot?: PageSnapshot | null }).page_snapshot
                      let pageData: Post['pageData'] = undefined

                      if (snapshot) {
                        pageData = {
                          placedStickers: snapshot.placedStickers?.map(s => ({
                            id: s.id,
                            stickerId: s.stickerId,
                            sticker: {
                              id: s.sticker.id,
                              name: s.sticker.name,
                              imageUrl: s.sticker.image_url,
                              rarity: s.sticker.rarity || 1,
                              type: 'normal' as const,
                            },
                            pageId: p.page_id || '',
                            x: s.x,
                            y: s.y,
                            rotation: s.rotation,
                            scale: s.scale,
                            zIndex: s.zIndex,
                            placedAt: new Date().toISOString(),
                            upgradeRank: s.upgradeRank,
                          })) || [],
                          placedDecoItems: snapshot.placedDecoItems?.map(d => ({
                            id: d.id,
                            decoItemId: d.decoItemId,
                            decoItem: {
                              id: d.decoItem.id,
                              name: d.decoItem.name,
                              imageUrl: d.decoItem.image_url,
                              type: 'stamp' as const,
                              baseWidth: d.width || 60,
                              baseHeight: d.height || 60,
                              rotatable: true,
                              rarity: 1 as const,
                              obtainMethod: 'default' as const,
                            },
                            pageId: p.page_id || '',
                            x: d.x,
                            y: d.y,
                            rotation: d.rotation,
                            scale: d.scale,
                            width: d.width,
                            height: d.height,
                            zIndex: d.zIndex,
                            placedAt: new Date().toISOString(),
                          })) || [],
                          backgroundColor: snapshot.backgroundColor,
                        }
                      }

                      return {
                        id: p.id,
                        userId: p.user_id,
                        userName: p.author?.display_name || p.author?.username || 'ユーザー',
                        userAvatarUrl: p.author?.avatar_url || undefined,
                        userFrameId: (p.author as unknown as { selected_frame_id?: string })?.selected_frame_id || null,
                      userLevel: calculateLevel(((p.author as unknown as { total_exp?: number })?.total_exp) || 0),
                        pageId: p.page_id,
                        imageUrl: p.image_url || undefined,
                        caption: p.caption || '',
                        hashtags: p.hashtags || [],
                        createdAt: p.created_at || new Date().toISOString(),
                        reactions: [{
                          type: 'heart' as const,
                          count: p.like_count || 0,
                          isReacted: true
                        }],
                        commentCount: p.comment_count || 0,
                        isFollowing: p.isFollowing || followStatuses[p.user_id] === 'following',
                        pageData,
                      }
                    }))
                    setLikedPosts(formatted)
                  }
                } else if (activeTimelineTab === 'following' && currentUser?.supabaseId) {
                  // フォロー中タブの投稿を再取得
                  const followingData = await timelineService.getFollowingTimeline(currentUser.supabaseId)
                  const otherUserIds = [...new Set(followingData.map(p => p.user_id).filter(id => id !== currentUser.supabaseId))]
                  const followStatuses = otherUserIds.length > 0 && currentUser.supabaseId
                    ? await profileService.getFollowStatusBatch(currentUser.supabaseId, otherUserIds)
                    : {}

                  const formattedPosts: Post[] = await Promise.all(followingData.map(async (p) => {
                    const snapshot = (p as unknown as { page_snapshot?: PageSnapshot | null }).page_snapshot
                    let pageData: Post['pageData'] = undefined

                    if (snapshot) {
                      pageData = {
                        placedStickers: snapshot.placedStickers?.map(s => ({
                          id: s.id,
                          stickerId: s.stickerId,
                          sticker: {
                            id: s.sticker.id,
                            name: s.sticker.name,
                            imageUrl: s.sticker.image_url,
                            rarity: s.sticker.rarity || 1,
                            type: 'normal' as const,
                          },
                          pageId: p.page_id || '',
                          x: s.x,
                          y: s.y,
                          rotation: s.rotation,
                          scale: s.scale,
                          zIndex: s.zIndex,
                          placedAt: new Date().toISOString(),
                          upgradeRank: s.upgradeRank,
                        })) || [],
                        placedDecoItems: snapshot.placedDecoItems?.map(d => ({
                          id: d.id,
                          decoItemId: d.decoItemId,
                          decoItem: {
                            id: d.decoItem.id,
                            name: d.decoItem.name,
                            imageUrl: d.decoItem.image_url,
                            type: 'stamp' as const,
                            baseWidth: d.width || 60,
                            baseHeight: d.height || 60,
                            rotatable: true,
                            rarity: 1 as const,
                            obtainMethod: 'default' as const,
                          },
                          pageId: p.page_id || '',
                          x: d.x,
                          y: d.y,
                          rotation: d.rotation,
                          scale: d.scale,
                          width: d.width,
                          height: d.height,
                          zIndex: d.zIndex,
                          placedAt: new Date().toISOString(),
                        })) || [],
                        backgroundColor: snapshot.backgroundColor,
                      }
                    }

                    return {
                      id: p.id,
                      userId: p.user_id,
                      userName: p.author?.display_name || p.author?.username || 'ユーザー',
                      userAvatarUrl: p.author?.avatar_url || undefined,
                      userFrameId: (p.author as unknown as { selected_frame_id?: string })?.selected_frame_id || null,
                      userLevel: calculateLevel(((p.author as unknown as { total_exp?: number })?.total_exp) || 0),
                      pageId: p.page_id,
                      imageUrl: p.image_url || undefined,
                      caption: p.caption || '',
                      hashtags: p.hashtags || [],
                      createdAt: p.created_at || new Date().toISOString(),
                      reactions: (p.reactions || []).map(r => ({ type: 'heart' as const, count: r.count, isReacted: r.isReacted })),
                      commentCount: p.comment_count || 0,
                      isFollowing: p.isFollowing || followStatuses[p.user_id] === 'following',
                      pageData,
                    }
                  }))
                  setFollowingPosts(formattedPosts)
                } else {
                  // 最新タブ/にんきタブの投稿を再取得
                  const postsData = await timelineService.getPublicTimeline(currentUser?.supabaseId || null)
                  const otherUserIds = [...new Set(postsData.map(p => p.user_id).filter(id => id !== currentUser?.supabaseId))]
                  const followStatuses = otherUserIds.length > 0 && currentUser?.supabaseId
                    ? await profileService.getFollowStatusBatch(currentUser.supabaseId, otherUserIds)
                    : {}

                  const formattedPosts: Post[] = await Promise.all(postsData.map(async (p) => {
                    const snapshot = (p as unknown as { page_snapshot?: PageSnapshot | null }).page_snapshot
                    let pageData: Post['pageData'] = undefined

                    if (snapshot) {
                      pageData = {
                        placedStickers: snapshot.placedStickers?.map(s => ({
                          id: s.id,
                          stickerId: s.stickerId,
                          sticker: {
                            id: s.sticker.id,
                            name: s.sticker.name,
                            imageUrl: s.sticker.image_url,
                            rarity: s.sticker.rarity || 1,
                            type: 'normal' as const,
                          },
                          pageId: p.page_id || '',
                          x: s.x,
                          y: s.y,
                          rotation: s.rotation,
                          scale: s.scale,
                          zIndex: s.zIndex,
                          placedAt: new Date().toISOString(),
                          upgradeRank: s.upgradeRank,
                        })) || [],
                        placedDecoItems: snapshot.placedDecoItems?.map(d => ({
                          id: d.id,
                          decoItemId: d.decoItemId,
                          decoItem: {
                            id: d.decoItem.id,
                            name: d.decoItem.name,
                            imageUrl: d.decoItem.image_url,
                            type: 'stamp' as const,
                            baseWidth: d.width || 60,
                            baseHeight: d.height || 60,
                            rotatable: true,
                            rarity: 1 as const,
                            obtainMethod: 'default' as const,
                          },
                          pageId: p.page_id || '',
                          x: d.x,
                          y: d.y,
                          rotation: d.rotation,
                          scale: d.scale,
                          width: d.width,
                          height: d.height,
                          zIndex: d.zIndex,
                          placedAt: new Date().toISOString(),
                        })) || [],
                        backgroundColor: snapshot.backgroundColor,
                      }
                    }

                    return {
                      id: p.id,
                      userId: p.user_id,
                      userName: p.author?.display_name || p.author?.username || 'ユーザー',
                      userAvatarUrl: p.author?.avatar_url || undefined,
                      userFrameId: (p.author as unknown as { selected_frame_id?: string })?.selected_frame_id || null,
                      userLevel: calculateLevel(((p.author as unknown as { total_exp?: number })?.total_exp) || 0),
                      pageId: p.page_id,
                      imageUrl: p.image_url || undefined,
                      caption: p.caption || '',
                      hashtags: p.hashtags || [],
                      createdAt: p.created_at || new Date().toISOString(),
                      reactions: (p.reactions || []).map(r => ({ type: 'heart' as const, count: r.count, isReacted: r.isReacted })),
                      commentCount: p.comment_count || 0,
                      isFollowing: p.isFollowing || followStatuses[p.user_id] === 'following',
                      pageData,
                    }
                  }))
                  setPosts(formattedPosts)
                }
                console.log('[Timeline] プルトゥリフレッシュ完了')
              } catch (error) {
                console.error('[Timeline] プルトゥリフレッシュエラー:', error)
              }
            }}
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
    isTradeBoardCreateOpen ||
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
  // ガチャ演出中もTopBarを非表示
  const shouldHideTopBar = activeTab === 'profile' || isTradeSessionOpen || isAsyncTradeSessionOpen || isGachaResultModalOpen

  if (dataLoadError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{
          background: 'linear-gradient(180deg, #FDF2F8 0%, #F5F3FF 100%)',
        }}
      >
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <p
            className="text-base font-bold text-purple-700 mb-3"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            {dataLoadError}
          </p>
          <button
            onClick={handleRetryAuth}
            className="px-6 py-3 rounded-full font-bold text-white"
            style={{
              background: 'linear-gradient(90deg, #7C3AED 0%, #EC4899 100%)',
              boxShadow: '0 6px 16px rgba(124, 58, 237, 0.35)',
            }}
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  // 認証中またはデータ読み込み中はローディング画面を表示
  if (isAuthLoading || !isDataLoaded) {
    return <FullScreenLoading />
  }

  return (
    <AppLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showTabBar={!shouldHideTabBar}
      showTopBar={!shouldHideTopBar}
      currency={userCurrency}
      onOpenShop={handleOpenShop}
      tabBadgeCounts={tradeBadgeCount > 0 ? { trade: tradeBadgeCount } : undefined}
    >
      {renderTabContent()}

      {/* Modals */}
      {isPageEditModalOpen && (
        <LazyPageEditModal
          isOpen={isPageEditModalOpen}
          pages={pages}
          placedStickers={placedStickers}
          currentCoverId={coverDesignId}
          availableCovers={
            defaultCoverDesigns
              .map(c => ({
                ...c,
                isOwned: c.obtainMethod === 'default' || unlockedCoverCharacters.includes(c.name),
              }))
              .sort((a, b) => (a.isOwned === b.isOwned ? 0 : a.isOwned ? -1 : 1))
          }
          onClose={() => setIsPageEditModalOpen(false)}
          onPagesChange={(newPages) => {
            // テーマ変更をSupabaseに保存
            if (currentDataSource === 'supabase') {
              const prevPages = pages
              for (const newPage of newPages) {
                const oldPage = prevPages.find(p => p.id === newPage.id)
                const oldTheme = JSON.stringify(oldPage?.theme || null)
                const newTheme = JSON.stringify(newPage.theme || null)
                if (oldTheme !== newTheme) {
                  stickerBookService.updatePageThemeConfig(
                    newPage.id,
                    (newPage.theme as Record<string, unknown>) || null
                  )
                }
              }
            }
            setPages(newPages)
          }}
          onCoverChange={async (coverId) => {
            setCoverDesignId(coverId)
            if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
              await stickerBookService.updateCoverDesign(currentUser.supabaseId, coverId)
            }
          }}
        />
      )}

      {isStickerDetailModalOpen && selectedCollectionSticker && (
        <LazyStickerDetailModal
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
        <LazyUpgradeModal
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
        <LazyGachaResultModal
          isOpen={isGachaResultModalOpen}
          results={gachaResults}
          onClose={() => {
            setIsGachaResultModalOpen(false)
            setGachaResults([])
          }}
          onContinue={() => {
            // 確認ダイアログを開く
            if (lastGachaPull) {
              const banner = gachaBanners.find(b => b.id === lastGachaPull.bannerId)
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
        <LazyMatchingModal
          isOpen={true}
          status={matchingStatus}
          matchedUser={matchedUser ?? undefined}
          onCancel={handleCancelMatching}
          onStartTrade={handleAcceptMatch}
          onRetry={handleStartMatching}
        />
      )}

      {isTradeSessionOpen && tradePartner && currentUser && (
        <LazyTradeSessionFull
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
              : []
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
        <LazyCreatePostModal
          isOpen={isCreatePostModalOpen}
          pages={pages.filter(p => p.type === 'page').map((p, index) => ({
            id: p.id,
            pageNumber: index + 1,
            // 各ページに貼られたシールとデコを渡す
            placedStickers: placedStickers.filter(s => s.pageId === p.id),
            placedDecoItems: placedDecoItems.filter(d => d.pageId === p.id),
            themeConfig: p.theme ? (p.theme as Record<string, unknown>) : undefined,
          }))}
          onClose={() => setIsCreatePostModalOpen(false)}
          onSubmit={async (data) => {
            if (!currentUser?.supabaseId) return

            // pageDataからページスナップショットを作成（投稿時点の状態を保存）
            const pageSnapshot = data.pageData ? {
              placedStickers: data.pageData.placedStickers.map(s => ({
                id: s.id,
                stickerId: s.stickerId,
                sticker: {
                  id: s.sticker.id,
                  name: s.sticker.name,
                  image_url: s.sticker.imageUrl || '',  // camelCase → snake_case
                  rarity: s.sticker.rarity,
                  character: (s.sticker as unknown as { character?: string }).character,
                },
                x: s.x,
                y: s.y,
                rotation: s.rotation,
                scale: s.scale,
                zIndex: s.zIndex,
                upgradeRank: s.upgradeRank,
              })),
              placedDecoItems: data.pageData.placedDecoItems?.map(d => ({
                id: d.id,
                decoItemId: d.decoItemId,
                decoItem: {
                  id: d.decoItem.id,
                  name: d.decoItem.name,
                  image_url: d.decoItem.imageUrl || '',  // camelCase → snake_case
                },
                x: d.x,
                y: d.y,
                rotation: d.rotation,
                scale: d.scale,
                width: d.width,
                height: d.height,
                zIndex: d.zIndex,
              })),
              backgroundColor: data.pageData.backgroundColor,
              themeConfig: data.pageData.themeConfig,
            } : undefined

            // Supabaseに投稿を保存（スナップショット付き）
            const savedPost = await timelineService.createPost(currentUser.supabaseId, {
              pageId: data.pageId,
              caption: data.caption,
              hashtags: data.hashtags,
              visibility: data.visibility,
              pageSnapshot,  // 投稿時点のページ状態を保存
            })

            if (savedPost) {
              console.log('[Timeline] Post saved to Supabase:', savedPost.id)
              // 新しい投稿を作成（Supabaseから返されたIDを使用）
              const newPost: Post = {
                id: savedPost.id,
                userId: currentUser.supabaseId,
                userName: currentUser.name,
                userAvatarUrl: userProfile.avatarUrl,
                userFrameId: userProfile.frameId,
                userLevel: userProfile.level,
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
                userFrameId: userProfile.frameId,
                userLevel: userProfile.level,
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

            // 投稿したら経験値獲得
            void gainExp('post_create')
          }}
        />
      )}

      {isCommentModalOpen && selectedPost && (
        <LazyCommentModal
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
                  parentId: null,
                  replyCount: 0,
                }
                setPostComments(prev => [...prev, newComment])
                // 投稿のコメント数を更新
                setPosts(prev => prev.map(p =>
                  p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
                ))
                setLikedPosts(prev => prev.map(p =>
                  p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
                ))
                void gainExp('comment_create')
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
          onAddReply={async (postId, content, parentId) => {
            if (!currentUser?.supabaseId) return
            try {
              const result = await timelineService.addReply(postId, currentUser.supabaseId, content, parentId)
              if (result) {
                // 新しい返信をリストに追加
                const newReply: Comment = {
                  id: result.id,
                  userId: currentUser.supabaseId,
                  userName: currentUser.name,
                  userAvatarUrl: userProfile.avatarUrl,
                  content: result.content,
                  createdAt: result.created_at,
                  isOwner: true,
                  parentId: result.parent_id,
                  replyCount: 0,
                }
                setPostComments(prev => {
                  // 返信を追加
                  const updated = [...prev, newReply]
                  // 親コメントのreplyCountを更新
                  return updated.map(c =>
                    c.id === parentId ? { ...c, replyCount: c.replyCount + 1 } : c
                  )
                })
                // 投稿のコメント数を更新
                setPosts(prev => prev.map(p =>
                  p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
                ))
                setLikedPosts(prev => prev.map(p =>
                  p.id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p
                ))
                void gainExp('comment_create')
              }
            } catch (error) {
              console.error('[Timeline] 返信追加エラー:', error)
            }
          }}
          onUserClick={async (userId) => {
            // コメントのユーザープロフィールを表示
            try {
              console.log('[Comment] ユーザープロフィール取得開始:', userId)

              // プロフィール取得
              const profileData = await profileService.getOtherUserProfile(userId, currentUser?.id)
              if (!profileData) {
                console.error('[Comment] プロフィール取得失敗:', userId)
                return
              }

              // シール帳データ取得
              const stickerBook = await stickerBookService.getUserStickerBook(userId)

              // OtherUserProfile形式に変換
              const otherUserProfile: OtherUserProfile = {
                id: profileData.id,
                name: profileData.name,
                avatarUrl: profileData.avatarUrl || undefined,
                frameId: profileData.frameId,
                level: profileData.level,
                title: profileData.title,
                bio: profileData.bio,
                isFollowing: profileData.isFollowing,
                stats: profileData.stats,
              }

              // シール帳ページとシールを整形
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

              const stickerBookPreviews: StickerBookPreview[] = stickerBook?.pages
                .filter(p => p.pageType === 'page')
                .map(p => ({
                  pageId: p.id,
                  pageNumber: p.pageNumber,
                  stickerCount: p.stickers.length,
                })) || []

              setSelectedOtherUser(otherUserProfile)
              setSelectedUserStickerBook(stickerBookPreviews)
              setSelectedUserBookPages(bookPages)
              setSelectedUserBookStickers(bookStickers)
              setSelectedUserBookDecoItems(bookDecoItems)
              setSelectedUserCoverDesignId(stickerBook?.coverDesignId || 'cover-default')
              setIsOtherUserProfileOpen(true)

              console.log('[Comment] ユーザープロフィール表示:', otherUserProfile.name)
            } catch (error) {
              console.error('[Comment] ユーザープロフィール取得エラー:', error)
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
            <LazySettingsView
              settings={settings}
              onSettingsChange={(newSettings) => {
                setSettings(newSettings)
                // 通知設定を同期
                notificationService.updateSettings(newSettings.notifications)
              }}
              onLogout={async () => {
                setIsSettingsOpen(false)
                try {
                  await authService.signOut()
                  await authService.ensureAuthenticated()
                  await refreshUser()
                } catch (error) {
                  console.error('[Auth] Logout failed:', error)
                  setDataLoadError('認証の更新に失敗しました。再試行してください。')
                }
              }}
              onDeleteAccount={() => console.log('Delete account requested')}
              onContactSupport={() => setIsContactFormOpen(true)}
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
                const inviterRewards = result.rewards
                if (result.success && inviterRewards) {
                  // 通貨を更新
                  setUserMonetization(prev => ({
                    ...prev,
                    tickets: prev.tickets + inviterRewards.tickets,
                    gems: prev.gems + inviterRewards.gems,
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
                const inviteeRewards = result.rewards
                if (result.success && inviteeRewards) {
                  // 通貨を更新
                  setUserMonetization(prev => ({
                    ...prev,
                    tickets: prev.tickets + inviteeRewards.tickets,
                    gems: prev.gems + inviteeRewards.gems,
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
                const reviewRewards = result.rewards
                if (result.success && reviewRewards) {
                  // 通貨を更新
                  setUserMonetization(prev => ({
                    ...prev,
                    tickets: prev.tickets + reviewRewards.tickets,
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
        <LazyReportModal
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
        <LazyBlockModal
          isOpen={isBlockModalOpen}
          userId={blockTarget.id}
          userName={blockTarget.name}
          isBlocked={blockedUserIds.includes(blockTarget.id)}
          onClose={() => {
            setIsBlockModalOpen(false)
            setBlockTarget(null)
          }}
          onBlock={handleBlock}
          onUnblock={async (userId) => {
            if (!currentUser?.supabaseId) return
            const success = await moderationService.unblockUser(currentUser.supabaseId, userId)
            if (success) {
              setBlockedUserIds(prev => prev.filter(id => id !== userId))
              setBlockedUsersCount(prev => Math.max(0, prev - 1))
            }
          }}
        />
      )}

      {/* ブロック中ユーザー一覧モーダル */}
      {isBlockedUsersModalOpen && currentUser?.id && (
        <LazyBlockedUsersModal
          isOpen={isBlockedUsersModalOpen}
          onClose={() => {
            setIsBlockedUsersModalOpen(false)
            // ブロック解除後にカウントを更新
            moderationService.getBlockedUserIds(currentUser.id).then(ids => {
              setBlockedUsersCount(ids.length)
              setBlockedUserIds(ids)
            })
          }}
          userId={currentUser.id}
        />
      )}

      {/* お問い合わせフォームモーダル */}
      <ContactFormModal
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        onSubmit={async (data: ContactFormData) => {
          const result = await contactService.submitInquiry(
            data,
            currentUser?.supabaseId,
            userCode || undefined
          )
          return result.success
        }}
        userEmail={user?.email}
        userCode={userCode || undefined}
      />

      {isThemeSelectOpen && (
        <LazyThemeSelectModal
          isOpen={isThemeSelectOpen}
          currentThemeId={themeId}
          ownedThemeIds={ownedThemeIds}
          userStarPoints={userMonetization.stars}
          onClose={() => setIsThemeSelectOpen(false)}
          onSelectTheme={async (nextThemeId) => {
            setThemeId(nextThemeId)
            setIsThemeSelectOpen(false)
            if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
              await stickerBookService.updateBookTheme(currentUser.supabaseId, nextThemeId)
            }
          }}
          onPurchaseTheme={(nextThemeId) => {
            console.log('Theme purchased:', nextThemeId)
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
          const claimedRewards = result.rewards
          if (result.success && claimedRewards) {
            // 通貨を更新
            setUserMonetization(prev => ({
              ...prev,
              tickets: prev.tickets + claimedRewards.tickets,
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
      <LazyProfileEditModal
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
            frameId: updates.frameId !== undefined ? updates.frameId : prev.frameId,
          }))
          setIsProfileEditOpen(false)

          // Supabaseモードの場合はSupabaseにも保存
          if (currentDataSource === 'supabase' && currentUser?.supabaseId) {
            const success = await profileService.updateProfile(currentUser.supabaseId, {
              displayName: updates.name,
              bio: updates.bio,
              avatarUrl: updates.avatarUrl,
              selectedFrameId: updates.frameId,
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
      <LazyStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={userStats}
      />

      {/* 実績一覧モーダル */}
      <LazyAchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        achievements={achievements}
      />

      {/* デイリーミッションモーダル */}
      {currentUser && (
        <LazyDailyMissionsModal
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
        <LazyCollectionRewardsModal
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
      <LazyUserSearchModal
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
              frameId: profileData.frameId,  // キャラクター報酬フレーム
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
            setSelectedUserCoverDesignId(stickerBook?.coverDesignId || 'cover-default')
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
            const prevStatus = getLocalFollowStatus(userId)
            const success = await profileService.toggleFollow(currentUser.id, userId)
            if (success) {
              // フォロー数を更新
              // タイムライン投稿のフォロー状態も更新
              const newStatus = await profileService.getFollowStatus(currentUser.id, userId)
              const resolvedPrev = prevStatus ?? (newStatus === 'none' ? 'following' : 'none')
              applyFollowStatsDelta(resolvedPrev, newStatus)
              const newCounts = await profileService.getFollowCounts(currentUser.id)
              setFollowCounts(newCounts)
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
      <LazyLevelUpModal
        isOpen={isLevelUpModalOpen}
        onClose={() => {
          setIsLevelUpModalOpen(false)
          setLevelUpInfo(null)
        }}
        newLevel={levelUpInfo?.level ?? 1}
        rewards={levelUpInfo?.rewards ?? []}
      />

      {/* フォロー・フォロワー一覧モーダル */}
      <LazyFollowListModal
        isOpen={isFollowListModalOpen}
        onClose={() => setIsFollowListModalOpen(false)}
        initialTab={followListInitialTab}
        followers={followersList.map(f => ({
          id: f.id,
          name: f.name,
          avatarUrl: f.avatarUrl ?? undefined,
          frameId: f.frameId,
          level: f.level,
          title: f.title,
          isFollowing: f.isFollowing,
        }))}
        following={followingList.map(f => ({
          id: f.id,
          name: f.name,
          avatarUrl: f.avatarUrl ?? undefined,
          frameId: f.frameId,
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
                frameId: userProfile.frameId,  // キャラクター報酬フレーム
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
            const prevStatus = getLocalFollowStatus(userId)
            const success = await profileService.toggleFollow(currentUser.id, userId)
            if (success) {
              const newStatus = await profileService.getFollowStatus(currentUser.id, userId)
              const resolvedPrev = prevStatus ?? (newStatus === 'none' ? 'following' : 'none')
              applyFollowStatsDelta(resolvedPrev, newStatus)
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
      <LazyOtherUserProfileModal
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
            const prevStatus = getLocalFollowStatus(userId)
            const success = await profileService.toggleFollow(currentUser.id, userId)
            if (success) {
              // フォロー状態を取得して更新
              const newStatus = await profileService.getFollowStatus(currentUser.id, userId)
              const resolvedPrev = prevStatus ?? (newStatus === 'none' ? 'following' : 'none')
              applyFollowStatsDelta(resolvedPrev, newStatus)
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
          const name = selectedOtherUser?.name || 'ユーザー'
          setReportTarget({ type: 'user', id: userId, userId, name })
          setIsReportModalOpen(true)
        }}
        onBlock={(userId) => {
          const name = selectedOtherUser?.name || 'ユーザー'
          setBlockTarget({ id: userId, name })
          setIsBlockModalOpen(true)
        }}
      />

      {/* 交換掲示板: 投稿作成モーダル */}
      {currentUser?.supabaseId && (
        <TradeBoardCreateModal
          isOpen={isTradeBoardCreateOpen}
          onClose={() => setIsTradeBoardCreateOpen(false)}
          userId={currentUser.supabaseId}
          pages={pages}
          placedStickers={placedStickers}
          placedDecoItems={placedDecoItems}
          coverDesignId={coverDesignId}
          onCreated={() => setTradeBoardRefreshKey(k => k + 1)}
        />
      )}


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
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          {/* 固定ヘッダー */}
          <div
            className="flex-shrink-0"
            style={{
              backgroundImage: 'url(/images/Header_UI.png)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
              minHeight: '56px',
              paddingTop: '8px',
              paddingBottom: '10px',
            }}
          >
            {/* 上段: 戻るボタンとタイトル */}
            <div className="flex items-center justify-between px-4 mb-1">
              <button
                onClick={handleCloseShop}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="#9D4C6C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1
                className="text-lg font-bold"
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  color: '#FFFFFF',
                  textShadow: '0 2px 4px rgba(157, 76, 108, 0.7)',
                }}
              >
                ショップ
              </h1>
              <div className="w-8" />
            </div>

            {/* 下段: 通貨表示 */}
            <div className="flex items-center justify-center gap-2 px-4">
              {/* シルチケ */}
              <div
                className="flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,247,237,0.9) 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <CurrencyIcon type="ticket" size="sm" />
                <span className="font-bold text-sm text-amber-700">
                  {userMonetization.tickets}
                </span>
              </div>
              {/* プレシルチケ */}
              <div
                className="flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(243,232,255,0.9) 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <CurrencyIcon type="gem" size="sm" />
                <span className="font-bold text-sm text-purple-700">
                  {userMonetization.gems}
                </span>
              </div>
              {/* どろっぷ */}
              <div
                className="flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(233,213,255,0.9) 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <CurrencyIcon type="star" size="sm" />
                <span className="font-bold text-sm text-violet-700">
                  {userMonetization.stars.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* ShopView（flex-1で残りの高さを使用） */}
          <ShopView
            userMonetization={userMonetization}
            onPurchaseStars={handlePurchaseStars}
            onSubscribe={handleSubscribe}
            onWatchAd={handleOpenAdReward}
            onOpenSubscriptionModal={() => {}}
          />
        </div>
      )}

      {/* 残高不足モーダル */}
      <LazyInsufficientFundsModal
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
      <LazyAdRewardModal
        isOpen={isAdRewardModalOpen}
        adsWatchedToday={userMonetization.adsWatchedToday}
        onWatchAd={handleWatchAd}
        onClose={() => setIsAdRewardModalOpen(false)}
      />

      {/* デイリーボーナスモーダル */}
      {dailyBonusReceived && (
        <LazyDailyBonusModal
          isOpen={isDailyBonusModalOpen}
          userMonetization={userMonetization}
          ticketsReceived={dailyBonusReceived.tickets}
          starsReceived={dailyBonusReceived.stars}
          onClose={() => {
            setIsDailyBonusModalOpen(false)
            setDailyBonusReceived(null)
            // デイリーボーナスでレベルアップしていた場合、ここでモーダルを表示
            if (levelUpInfo) {
              setIsLevelUpModalOpen(true)
            }
          }}
        />
      )}

      {/* 管理者パネル */}
      {isAdminPanelOpen && currentUser && (
        <LazyAdminView
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
      <LazyBookShareModal
        isOpen={isBookShareModalOpen}
        onClose={() => setIsBookShareModalOpen(false)}
        bookContainerRef={shareBookContainerRef}
      />
    </AppLayout>
  )
}



