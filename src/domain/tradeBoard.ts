// シール交換掲示板 - 型定義

export interface TradeBoardPost {
  id: string
  userId: string
  wantedStickerIds: string[]
  message: string | null
  bookSnapshot: BookSnapshot
  status: 'active' | 'completed' | 'cancelled'
  likeCount: number
  commentCount: number
  createdAt: string
  // 関連データ（enriched）
  author?: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
    level: number
    selected_frame_id: string | null
  }
  wantedStickers?: Array<{
    id: string
    name: string
    image_url: string
    rarity: number
    character?: string
    series?: string
  }>
  isLiked?: boolean
}

export interface BookSnapshot {
  pages: BookSnapshotPage[]
  coverDesignId: string
  themeId?: string
  capturedAt: string
}

export interface BookSnapshotPage {
  pageId: string
  pageNumber: number
  pageType?: 'cover' | 'page' | 'back-cover' | 'inner-cover'
  side?: 'left' | 'right'
  themeConfig?: Record<string, unknown> | null
  placedStickers: BookSnapshotSticker[]
  placedDecoItems?: BookSnapshotDecoItem[]
  backgroundColor?: string
}

export interface BookSnapshotSticker {
  id: string
  stickerId: string
  sticker: {
    id: string
    name: string
    image_url: string
    rarity: number
    character?: string
  }
  x: number
  y: number
  rotation: number
  scale: number
  zIndex: number
  upgradeRank?: number
}

export interface BookSnapshotDecoItem {
  id: string
  decoItemId: string
  decoItem: {
    id: string
    name: string
    image_url: string
  }
  x: number
  y: number
  rotation: number
  scale: number
  width: number
  height: number
  zIndex: number
}

export interface TradeBoardComment {
  id: string
  postId: string
  userId: string
  content: string
  offerStickerId: string | null
  replyCount: number
  parentId: string | null
  createdAt: string
  // 関連データ
  author?: {
    id: string
    username: string
    display_name: string | null
    avatar_url: string | null
    level: number
    selected_frame_id: string | null
  }
  offerSticker?: {
    id: string
    name: string
    image_url: string
    rarity: number
  }
  replies?: TradeBoardComment[]
}

export const TRADE_BOARD_RULES = {
  maxWantedStickers: 6,
  maxMessageLength: 100,
  maxCommentLength: 100,
  maxRepliesPerThread: 10,
} as const
