/**
 * ミステリーポスト（闇鍋交換会）のドメイン型定義
 * ダブりシールを投函すると、翌日ランダムなシールが届くブラインドトレード機能
 */

// 投函状態
export type PostStatus = 'pending' | 'matched' | 'delivered' | 'expired'

// 定型メッセージ（小学生向けにかわいく）
export const PRESET_MESSAGES = [
  '大切にしてね！',
  'このシール、すきだった！',
  'キミのもとへ旅立つよ♪',
  'いいことあるかも？',
  'じつはレアかも！？',
  'たからものだったよ',
  'なかよくしてあげて！',
  'きっと気に入るよ！',
  'ふしぎなえにし…✨',
  'このこをよろしくね',
] as const

export type PresetMessage = typeof PRESET_MESSAGES[number]

// 投函するシール情報
export interface PostedSticker {
  id: string
  stickerId: string
  stickerName: string
  stickerImageUrl: string
  rarity: number
  message: PresetMessage
  postedAt: string // ISO日時
  status: PostStatus
}

// 届いたシール情報
export interface ReceivedSticker {
  id: string
  stickerId: string
  stickerName: string
  stickerImageUrl: string
  rarity: number
  message: PresetMessage
  fromUserName: string // 送り主の名前（匿名化）
  receivedAt: string // ISO日時
  isOpened: boolean // 開封済みか
}

// ユーザーのミステリーポスト状態
export interface MysteryPostState {
  // 今日投函したシール（1日1枚制限）
  todayPosted: PostedSticker | null
  // 投函中（マッチング待ち）のシール
  pendingStickers: PostedSticker[]
  // 届いたシール（未開封含む）
  receivedStickers: ReceivedSticker[]
  // 次に届く予定時刻（翌日6:00など）
  nextDeliveryTime: string | null
}

// ミステリーポストのルール
export const MYSTERY_POST_RULES = {
  // 1日に投函できる数
  maxPostsPerDay: 1,
  // マッチングのレアリティ許容範囲（±1★までマッチ）
  rarityTolerance: 1,
  // 配達時間（毎日この時間に届く）
  deliveryHour: 6,
  // 投函期限（この日数以内にマッチしなければ返却）
  expirationDays: 7,
}

// 匿名化された送り主名を生成
export function generateAnonymousName(): string {
  const adjectives = [
    'ふしぎな', 'ひみつの', 'とおくの', 'やさしい',
    'げんきな', 'おしゃれな', 'キラキラ', 'ワクワク',
  ]
  const nouns = [
    'たびびと', 'ともだち', 'コレクター', 'シールずき',
    'なかま', 'ぼうけんしゃ', 'おともだち', 'シールマスター',
  ]
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adj}${noun}`
}

// レアリティがマッチするかチェック
export function isRarityMatch(rarity1: number, rarity2: number): boolean {
  return Math.abs(rarity1 - rarity2) <= MYSTERY_POST_RULES.rarityTolerance
}

// 投函可能かどうかをチェック
export function canPostToday(state: MysteryPostState): boolean {
  return state.todayPosted === null
}

// 次の配達時間を計算
export function getNextDeliveryTime(): string {
  const now = new Date()
  const delivery = new Date(now)

  // 今日の配達時間を過ぎていたら明日
  if (now.getHours() >= MYSTERY_POST_RULES.deliveryHour) {
    delivery.setDate(delivery.getDate() + 1)
  }

  delivery.setHours(MYSTERY_POST_RULES.deliveryHour, 0, 0, 0)
  return delivery.toISOString()
}

// 残り時間をフォーマット（小学生向け）
export function formatTimeUntilDelivery(deliveryTime: string): string {
  const now = new Date()
  const delivery = new Date(deliveryTime)
  const diffMs = delivery.getTime() - now.getTime()

  if (diffMs <= 0) return 'もうすぐとどくよ！'

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (hours >= 24) {
    const days = Math.floor(hours / 24)
    return `あと${days}日くらい`
  }
  if (hours > 0) {
    return `あと${hours}時間${minutes}分`
  }
  return `あと${minutes}分`
}
