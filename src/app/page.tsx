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
  PageEditModal,
  CHARM_LIST
} from '@/features/sticker-book'
import { CoverDesign } from '@/domain/theme'
import { CollectionView, CollectionSticker, StickerDetailModal } from '@/features/collection'
import { GachaView, GachaBanner, UserCurrency, GachaResultModal, GachaResultSticker } from '@/features/gacha'
import { TradeView, Friend, TradeHistory, MatchingModal, MatchingStatus, MatchedUser, TradeSession, TradeSticker, TradePartner, TradeSessionEnhanced, TradeBookPage, TradeSessionFull, TradeUser, TradeBookPageFull } from '@/features/trade'
import { TimelineView, Post, ReactionType, CreatePostModal, CommentModal, StickerBookPage, Comment } from '@/features/timeline'
import { ProfileView, UserProfile, UserStats, Achievement } from '@/features/profile'
import { TutorialOverlay, defaultTutorialSteps } from '@/features/tutorial'
import { SettingsView, SettingsData } from '@/features/settings'
import { AuthView } from '@/features/auth'
import { ReportModal, BlockModal } from '@/features/safety'
import { CreateReportInput, CreateBlockInput, ReportTargetType } from '@/domain/safety'
import { ThemeSelectModal } from '@/features/theme'
import { defaultCoverDesigns } from '@/domain/theme'

// キャラクター定義
const characters = [
  { id: 'mocchimo', name: 'もっちも', folder: 'もっちも', prefix: 'もっちも_' },
  { id: 'woolun', name: 'ウールン', folder: 'ウールン', prefix: 'ウールン_' },
  { id: 'kinobou', name: 'キノぼう', folder: 'キノぼう', prefix: 'キノぼう_' },
  { id: 'kokebo', name: 'コケボ', folder: 'コケボ', prefix: 'コケボ_' },
  { id: 'sanitan', name: 'サニたん', folder: 'サニたん', prefix: 'サニたん_' },
  { id: 'sutara', name: 'スタラ', folder: 'スタラ', prefix: 'スタラ_' },
  { id: 'chakkun', name: 'チャックン', folder: 'チャックン', prefix: 'チャックン_' },
  { id: 'dororu', name: 'ドロル', folder: 'ドロル', prefix: 'ドロル_' },
  { id: 'pofun', name: 'ポフン', folder: 'ポフン', prefix: 'sticker_' },
  { id: 'pori', name: 'ポリ', folder: 'ポリ', prefix: 'ポリ_' },
]

// シールのタイプとレアリティをランダムに設定する関数
const getStickerType = (index: number): 'normal' | 'puffy' | 'sparkle' => {
  if (index <= 5) return 'normal'
  if (index <= 10) return 'puffy'
  return 'sparkle'
}

const getStickerRarity = (index: number): number => {
  if (index <= 3) return 1
  if (index <= 6) return 2
  if (index <= 9) return 3
  if (index <= 12) return 4
  return 5
}

// 全150枚のシールデータを生成（日本語パスをエンコード）
const demoStickers: Sticker[] = characters.flatMap((char, charIndex) =>
  Array.from({ length: 15 }, (_, i) => ({
    id: `${char.id}-${i + 1}`,
    name: `${char.name} ${i + 1}`,
    imageUrl: `/stickers/${encodeURIComponent(char.folder)}/${encodeURIComponent(char.prefix + (i + 1))}.png`,
    rarity: getStickerRarity(i + 1),
    type: getStickerType(i + 1),
    series: char.name,
  }))
)

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

  return {
    id: s.id,
    name: s.name,
    imageUrl: s.imageUrl,
    rarity: s.rarity as 1 | 2 | 3 | 4 | 5,
    type: s.type,
    series: s.series || 'Dream Collection',
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
    name: 'Dream Collection',
    description: 'Sparkly stickers await!',
    type: 'normal',
    costSingle: 1,
    costMulti: 10,
    currency: 'ticket',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'banner-2',
    name: 'Premium Gacha',
    description: 'High rarity guaranteed!',
    type: 'premium',
    costSingle: 100,
    costMulti: 900,
    currency: 'gem',
  },
]

// Demo user currency
const demoUserCurrency: UserCurrency = {
  tickets: 5,
  stars: 100,
  gems: 500,
}

// Demo friends
const demoFriends: Friend[] = [
  { id: 'friend-1', name: 'Alice', isOnline: true, avatarUrl: undefined },
  { id: 'friend-2', name: 'Bob', isOnline: false, lastActive: '2 hours ago', avatarUrl: undefined },
  { id: 'friend-3', name: 'Charlie', isOnline: true, avatarUrl: undefined },
]

// Demo trade history
const demoTradeHistory: TradeHistory[] = [
  {
    id: 'trade-1',
    partnerName: 'Alice',
    givenStickers: [{ name: 'Star', rarity: 3 }],
    receivedStickers: [{ name: 'Heart', rarity: 3 }],
    tradedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Demo posts for timeline
const demoPosts: Post[] = [
  {
    id: 'post-1',
    userId: 'user-1',
    userName: 'Alice',
    userAvatarUrl: undefined,
    pageImageUrl: '/images/demo-page.png',
    caption: 'My favorite page!',
    hashtags: ['kawaii', 'sparkle'],
    reactions: [
      { type: 'heart', count: 5, isReacted: false },
      { type: 'sparkle', count: 3, isReacted: true },
      { type: 'fire', count: 1, isReacted: false },
      { type: 'cute', count: 2, isReacted: false },
    ],
    commentCount: 2,
    createdAt: new Date().toISOString(),
    isFollowing: false,
  },
]

// Demo user profile
const demoUserProfile: UserProfile = {
  id: 'user-me',
  name: 'Sticker Fan',
  avatarUrl: undefined,
  title: 'Beginner Collector',
  level: 5,
  exp: 350,
  expToNextLevel: 500,
  bio: 'I love stickers!',
  createdAt: new Date().toISOString(),
}

// Demo user stats
const demoUserStats: UserStats = {
  totalStickers: 42,
  uniqueStickers: 35,
  completedSeries: 2,
  totalTrades: 12,
  friendsCount: 8,
  postsCount: 5,
  reactionsReceived: 24,
}

// Demo achievements
const demoAchievements: Achievement[] = [
  { id: 'ach-1', name: 'First Steps', description: 'Place your first sticker', icon: '⭐', isUnlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'ach-2', name: 'Collector', description: 'Collect 10 stickers', icon: '📦', isUnlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'ach-3', name: 'Trader', description: 'Complete 5 trades', icon: '🤝', isUnlocked: false },
]

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

  // Modal states
  const [isPageEditModalOpen, setIsPageEditModalOpen] = useState(false)
  const [isStickerDetailModalOpen, setIsStickerDetailModalOpen] = useState(false)
  const [selectedCollectionSticker, setSelectedCollectionSticker] = useState<CollectionSticker | null>(null)
  const [isGachaResultModalOpen, setIsGachaResultModalOpen] = useState(false)
  const [gachaResults, setGachaResults] = useState<GachaResultSticker[]>([])
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState<{ type: ReportTargetType; id: string; userId: string; name: string } | null>(null)
  const [blockTarget, setBlockTarget] = useState<{ id: string; name: string } | null>(null)
  const [isThemeSelectOpen, setIsThemeSelectOpen] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)

  // Trade state
  const [matchingStatus, setMatchingStatus] = useState<MatchingStatus>('idle')
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null)
  const [isTradeSessionOpen, setIsTradeSessionOpen] = useState(false)
  const [tradePartner, setTradePartner] = useState<TradePartner | null>(null)

  // 自分のシール帳をTrade用に変換（ホームで編集したシール帳をそのまま交換画面で使用）
  const myTradePages: TradeBookPageFull[] = useMemo(() => {
    return pages.map((page, index) => ({
      ...page,
      pageNumber: index,
      stickers: placedStickers.filter(s => s.pageId === page.id),
    }))
  }, [pages, placedStickers])

  // Currency state
  const [userCurrency, setUserCurrency] = useState<UserCurrency>(demoUserCurrency)

  // Posts state
  const [posts, setPosts] = useState<Post[]>(demoPosts)

  // Settings state
  const [settings, setSettings] = useState<SettingsData>(demoSettings)

  // Handle page turn
  const handlePageTurn = useCallback((pageIndex: number) => {
    setCurrentPage(pageIndex)
  }, [])

  // Handle sticker placement
  const handlePlaceSticker = useCallback((pageId: string, x: number, y: number, rotation: number) => {
    if (!selectedSticker) return

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

    setPlacedStickers(prev => [...prev, newPlacedSticker])
    setSelectedSticker(null)
    setIsDragging(false)
  }, [selectedSticker, placedStickers])

  // 編集中シールのページサイド（見開き時に左右どちらか）
  const [editingStickerPageSide, setEditingStickerPageSide] = useState<'left' | 'right'>('left')

  // Handle sticker edit
  const handleEditSticker = useCallback((sticker: PlacedSticker) => {
    // シールがあるページのsideを判定
    const page = pages.find(p => p.id === sticker.pageId)
    setEditingStickerPageSide(page?.side || 'left')
    setEditingSticker(sticker)
  }, [pages])

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

  // 編集中シールの重なり順情報を計算
  const getLayerInfo = useCallback(() => {
    if (!editingSticker) return { layerPosition: 1, totalLayers: 1, isAtFront: true, isAtBack: true }

    // 同じページにあるシールだけをフィルタ
    const samePageStickers = placedStickers.filter(s => s.pageId === editingSticker.pageId)
    const totalLayers = samePageStickers.length

    if (totalLayers <= 1) {
      return { layerPosition: 1, totalLayers: 1, isAtFront: true, isAtBack: true }
    }

    // zIndexでソートして順位を取得
    const sortedByZIndex = [...samePageStickers].sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1))
    const position = sortedByZIndex.findIndex(s => s.id === editingSticker.id) + 1
    const maxZIndex = Math.max(...samePageStickers.map(s => s.zIndex ?? 1))
    const minZIndex = Math.min(...samePageStickers.map(s => s.zIndex ?? 1))

    return {
      layerPosition: position,
      totalLayers,
      isAtFront: (editingSticker.zIndex ?? 1) >= maxZIndex,
      isAtBack: (editingSticker.zIndex ?? 1) <= minZIndex,
    }
  }, [editingSticker, placedStickers])

  // Handle bring to front (前面へ)
  const handleBringToFront = useCallback(() => {
    if (!editingSticker) return

    // 同じページのシールの最大zIndexを取得
    const samePageStickers = placedStickers.filter(s => s.pageId === editingSticker.pageId)
    const maxZIndex = Math.max(...samePageStickers.map(s => s.zIndex ?? 1))

    // 既に最前面なら何もしない
    if ((editingSticker.zIndex ?? 1) >= maxZIndex) return

    const newZIndex = maxZIndex + 1
    const updated = { ...editingSticker, zIndex: newZIndex }
    setPlacedStickers(prev => prev.map(s => s.id === updated.id ? updated : s))
    setEditingSticker(updated)
  }, [editingSticker, placedStickers])

  // Handle send to back (後面へ)
  const handleSendToBack = useCallback(() => {
    if (!editingSticker) return

    // 同じページのシールの最小zIndexを取得
    const samePageStickers = placedStickers.filter(s => s.pageId === editingSticker.pageId)
    const minZIndex = Math.min(...samePageStickers.map(s => s.zIndex ?? 1))

    // 既に最後面なら何もしない
    if ((editingSticker.zIndex ?? 1) <= minZIndex) return

    const newZIndex = Math.max(0, minZIndex - 1)
    const updated = { ...editingSticker, zIndex: newZIndex }
    setPlacedStickers(prev => prev.map(s => s.id === updated.id ? updated : s))
    setEditingSticker(updated)
  }, [editingSticker, placedStickers])

  // Handle sticker update (完全な更新 - 編集モード終了)
  const handleUpdateSticker = useCallback((updated: PlacedSticker) => {
    setPlacedStickers(prev => prev.map(s => s.id === updated.id ? updated : s))
    setEditingSticker(null)
  }, [])

  // Handle sticker delete
  const handleDeleteSticker = useCallback((stickerId: string) => {
    setPlacedStickers(prev => prev.filter(s => s.id !== stickerId))
    setEditingSticker(null)
  }, [])

  // Handle matching
  const handleStartMatching = useCallback(() => {
    setMatchingStatus('searching')
    // Simulate finding a match after 2-3 seconds
    setTimeout(() => {
      setMatchingStatus('found')
      setMatchedUser({
        id: 'matched-user-1',
        name: 'RandomPlayer',
        avatarUrl: undefined,
        level: 8,
      })
    }, 2000 + Math.random() * 1000)
  }, [])

  const handleCancelMatching = useCallback(() => {
    setMatchingStatus('idle')
    setMatchedUser(null)
  }, [])

  const handleAcceptMatch = useCallback(() => {
    if (!matchedUser) return
    setMatchingStatus('idle')
    setTradePartner({
      id: matchedUser.id,
      name: matchedUser.name,
      avatarUrl: matchedUser.avatarUrl,
      level: matchedUser.level ?? 1,
    })
    setIsTradeSessionOpen(true)
  }, [matchedUser])

  // Handle gacha
  const handlePullGacha = useCallback((bannerId: string, count: number) => {
    const results: GachaResultSticker[] = []
    for (let i = 0; i < count; i++) {
      const randomSticker = demoStickers[Math.floor(Math.random() * demoStickers.length)]
      results.push({
        id: randomSticker.id,
        name: randomSticker.name,
        imageUrl: randomSticker.imageUrl,
        rarity: randomSticker.rarity as 1 | 2 | 3 | 4 | 5,
        type: randomSticker.type,
        isNew: Math.random() > 0.5,
      })
    }
    setGachaResults(results)
    setIsGachaResultModalOpen(true)

    // Deduct currency
    const banner = demoBanners.find(b => b.id === bannerId)
    if (banner) {
      const cost = count === 1 ? banner.costSingle : banner.costMulti
      if (banner.currency === 'ticket') {
        setUserCurrency(prev => ({ ...prev, tickets: Math.max(0, prev.tickets - cost) }))
      } else if (banner.currency === 'gem') {
        setUserCurrency(prev => ({ ...prev, gems: Math.max(0, prev.gems - cost) }))
      } else if (banner.currency === 'star') {
        setUserCurrency(prev => ({ ...prev, stars: Math.max(0, prev.stars - cost) }))
      }
    }
  }, [])

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

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        // 現在のページが裏表紙かどうかを判定
        const isBackCover = pages[currentPage]?.type === 'back-cover'
        // シール操作中かどうか（貼り付け中または編集中）
        const isStickerOperating = (selectedSticker && isDragging) || editingSticker
        // UIを隠すべきかどうか（モーダル表示中またはシール操作中）
        const shouldHideUI = isPageEditModalOpen || isStickerOperating

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
                }}
              >
                <BookView
                  ref={bookRef}
                  pages={pages}
                  placedStickers={placedStickers}
                  onPageChange={handlePageTurn}
                  onStickerLongPress={handleEditSticker}
                  coverDesignId={coverDesignId}
                  editingStickerId={editingSticker?.id}
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
              {/* 編集中のシールをフローティング表示（自動スクロール対応） */}
              {editingSticker && (
                <FloatingEditSticker
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
            </div>
            {/* StickerTray - シール操作中は非表示 */}
            {!shouldHideUI && (
              <div className="flex-shrink-0">
                <StickerTray
                  stickers={demoStickers}
                  onStickerSelect={(sticker) => {
                    setSelectedSticker(sticker)
                    setIsDragging(true)
                  }}
                />
              </div>
            )}
            {/* Page toolbar - 画像ボタン (StickerTrayの上に固定配置) - シール操作中・モーダル表示中は非表示 */}
            {!shouldHideUI && (
            <div className="fixed bottom-[230px] left-0 right-0 z-[200] flex justify-center items-center gap-2 py-0 pointer-events-none">
              <div className="flex items-center gap-2 px-4 py-0 bg-white/80 backdrop-blur-md rounded-full shadow-lg pointer-events-auto">
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
              <div className="relative w-28 h-14 flex items-center justify-center">
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
              </div>
            </div>
            )}
          </div>
        )

      case 'collection':
        return (
          <CollectionView
            stickers={demoCollectionStickers}
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
          />
        )

      case 'trade':
        return (
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
            onUserClick={(userId) => console.log('User click:', userId)}
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
            profile={demoUserProfile}
            stats={demoUserStats}
            achievements={demoAchievements}
            onEditProfile={() => console.log('Edit profile')}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onViewStickerBook={() => setActiveTab('home')}
            onViewAchievements={() => console.log('View achievements')}
            onViewFriends={() => console.log('View friends')}
          />
        )

      default:
        return null
    }
  }

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
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
            setIsGachaResultModalOpen(false)
            setGachaResults([])
          }}
        />
      )}

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

      {isTradeSessionOpen && tradePartner && (
        <TradeSessionFull
          myUser={{
            id: 'my-user',
            name: 'プレイヤー',
            avatarUrl: undefined,
            level: 5,
            bio: 'シール交換はじめました！',
            totalStickers: 42,
            totalTrades: 3,
          }}
          partnerUser={demoPartnerUserData}
          myPages={myTradePages}
          myCoverDesignId={coverDesignId}
          partnerPages={demoPartnerTradePages}
          partnerCoverDesignId="cover-mochimo"
          onTradeComplete={(myOffers, partnerOffers) => {
            console.log('Trade complete:', myOffers, partnerOffers)
            setIsTradeSessionOpen(false)
            setTradePartner(null)
            setMatchedUser(null)
          }}
          onCancel={() => {
            setIsTradeSessionOpen(false)
            setTradePartner(null)
            setMatchedUser(null)
          }}
          onFollowPartner={(partnerId) => {
            console.log('Follow partner:', partnerId)
          }}
        />
      )}

      {isCreatePostModalOpen && (
        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          pages={pages.filter(p => p.type === 'page').map((p, index) => ({
            id: p.id,
            pageNumber: index + 1,
            thumbnailUrl: '/images/demo-page.png',
          }))}
          onClose={() => setIsCreatePostModalOpen(false)}
          onSubmit={(data) => {
            console.log('Post created:', data)
            setIsCreatePostModalOpen(false)
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
        <div className="fixed inset-0 bg-white z-50">
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
          <div className="h-[calc(100%-60px)] overflow-auto">
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
              userName="プレイヤー"
              userEmail="player@example.com"
            />
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
    </AppLayout>
  )
}
