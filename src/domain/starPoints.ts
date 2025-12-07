// スターポイントシステムのドメイン定義

// ポイントの変換レート（シールレア度ごと）
export const STAR_POINT_RATES: Record<number, number> = {
  1: 10,   // ★1 シール → 10ポイント
  2: 25,   // ★2 シール → 25ポイント
  3: 50,   // ★3 シール → 50ポイント
  4: 100,  // ★4 シール → 100ポイント
  5: 250,  // ★5 シール → 250ポイント
}

// シールタイプボーナス（キラキラやぷっくりはボーナス）
export const TYPE_BONUS: Record<string, number> = {
  normal: 1.0,    // ふつうシール: ボーナスなし
  puffy: 1.2,     // ぷっくりシール: 20%ボーナス
  sparkle: 1.5,   // キラキラシール: 50%ボーナス
}

// ランクボーナス（高ランクシールはボーナス）
export const RANK_BONUS: Record<number, number> = {
  1: 1.0,   // ランク1: ボーナスなし
  2: 1.1,   // ランク2: 10%ボーナス
  3: 1.2,   // ランク3: 20%ボーナス
  4: 1.3,   // ランク4: 30%ボーナス
  5: 1.5,   // ランク5 (MAX): 50%ボーナス
}

// シールをポイントに変換した際に得られるポイントを計算
export function calculateStickerPoints(
  rarity: number,
  type: 'normal' | 'puffy' | 'sparkle',
  rank: number
): number {
  const basePoints = STAR_POINT_RATES[rarity] || 10
  const typeBonus = TYPE_BONUS[type] || 1.0
  const rankBonus = RANK_BONUS[rank] || 1.0

  return Math.floor(basePoints * typeBonus * rankBonus)
}

// ショップアイテムの種類
export type ShopItemType =
  | 'theme'         // シール帳テーマ
  | 'gacha_ticket'  // ガチャチケット
  | 'icon'          // プロフィールアイコン
  | 'title'         // 称号
  | 'charm'         // チャーム

// ショップアイテム定義
export interface ShopItem {
  id: string
  type: ShopItemType
  name: string
  description: string
  cost: number
  imageUrl?: string
  emoji?: string
  // テーマの場合のID
  themeId?: string
  // 称号の場合のテキスト
  titleText?: string
  // 限定かどうか
  isLimited?: boolean
  // 在庫数（nullなら無制限）
  stock?: number | null
}

// 初期ショップアイテム
export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  // ガチャチケット
  {
    id: 'gacha_ticket_1',
    type: 'gacha_ticket',
    name: 'ノーマルガチャチケット',
    description: 'ノーマルガチャが1回引けるよ！',
    cost: 100,
    emoji: '🎫',
  },
  {
    id: 'gacha_ticket_5',
    type: 'gacha_ticket',
    name: 'ノーマルガチャ5連チケット',
    description: 'ノーマルガチャが5回引けるよ！おトク！',
    cost: 450,
    emoji: '🎟️',
  },
  {
    id: 'premium_ticket_1',
    type: 'gacha_ticket',
    name: 'プレミアムガチャチケット',
    description: 'プレミアムガチャが1回引けるよ！レアシールが出やすい！',
    cost: 500,
    emoji: '✨🎫',
    isLimited: true,
  },
  // テーマ
  {
    id: 'theme_pastel',
    type: 'theme',
    name: 'パステルドリーム',
    description: 'やさしいパステルカラーのテーマ',
    cost: 300,
    themeId: 'pastel-dream',
    emoji: '🌸',
  },
  {
    id: 'theme_neon',
    type: 'theme',
    name: 'ネオンナイト',
    description: 'キラキラ光るネオンカラーのテーマ',
    cost: 500,
    themeId: 'neon-night',
    emoji: '💜',
  },
  {
    id: 'theme_retro',
    type: 'theme',
    name: 'レトロポップ',
    description: 'なつかしい雰囲気のレトロテーマ',
    cost: 400,
    themeId: 'retro-pop',
    emoji: '📺',
  },
  // 称号
  {
    id: 'title_collector',
    type: 'title',
    name: '【しゅうしゅうか】',
    description: 'シールをたくさん集めた証！',
    cost: 200,
    titleText: 'しゅうしゅうか',
    emoji: '🏆',
  },
  {
    id: 'title_star_hunter',
    type: 'title',
    name: '【スターハンター】',
    description: 'スターポイントをいっぱい使った証！',
    cost: 1000,
    titleText: 'スターハンター',
    emoji: '⭐',
    isLimited: true,
  },
  // チャーム
  {
    id: 'charm_rainbow',
    type: 'charm',
    name: 'にじいろチャーム',
    description: 'シール帳につけられる虹色のチャーム',
    cost: 350,
    emoji: '🌈',
  },
  {
    id: 'charm_heart',
    type: 'charm',
    name: 'ハートチャーム',
    description: 'かわいいハートのチャーム',
    cost: 250,
    emoji: '💕',
  },
]

// ポイント履歴の種類
export type PointTransactionType =
  | 'convert'    // シールからポイントに変換
  | 'purchase'   // ショップで購入
  | 'reward'     // 報酬獲得
  | 'bonus'      // ボーナス

// ポイント履歴
export interface PointTransaction {
  id: string
  type: PointTransactionType
  amount: number // プラスなら獲得、マイナスなら消費
  description: string
  createdAt: string
  // シール変換の場合
  stickerId?: string
  stickerName?: string
  // ショップ購入の場合
  shopItemId?: string
}

// ユーザーのポイント状態
export interface UserStarPoints {
  balance: number
  totalEarned: number
  totalSpent: number
  transactions: PointTransaction[]
}

// 初期状態
export const initialUserStarPoints: UserStarPoints = {
  balance: 0,
  totalEarned: 0,
  totalSpent: 0,
  transactions: [],
}

// トランザクションを作成
export function createTransaction(
  type: PointTransactionType,
  amount: number,
  description: string,
  extras?: Partial<PointTransaction>
): PointTransaction {
  return {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    amount,
    description,
    createdAt: new Date().toISOString(),
    ...extras,
  }
}

// ポイントをフォーマット（例：1,234 SP）
export function formatPoints(points: number): string {
  return `${points.toLocaleString()} SP`
}

// 子ども向けのポイント表示
export function formatPointsKids(points: number): string {
  if (points >= 10000) {
    return `${Math.floor(points / 1000)}k+ SP`
  }
  return `${points.toLocaleString()} SP`
}
