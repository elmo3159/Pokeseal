/**
 * 課金システム ドメイン定義
 *
 * ポケシルの課金・サブスクリプション・通貨システムの型定義と定数
 */

// ======================
// サブスクリプション
// ======================

export type SubscriptionTier = 'none' | 'light' | 'plus' | 'deluxe'

export interface SubscriptionPlan {
  id: SubscriptionTier
  name: string
  price: number // 円
  dailyBonusTickets: number // 追加デイリーチケット
  dailyStars: number // 毎日配布されるどろっぷ
  skipAds: boolean // 広告スキップ可能か
  weeklyPremiumGacha: number // 週間無料プレミアムガチャ回数
  monthlyLimitedSticker: boolean // 月間限定シール配布
  unlockAllDeco: boolean // 全デコ解放
  exclusiveCovers: number // 限定カバー数
  badgeType: 'none' | 'star' | 'double-star' | 'rainbow'
  description: string
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  none: {
    id: 'none',
    name: 'なし',
    price: 0,
    dailyBonusTickets: 0,
    dailyStars: 0,
    skipAds: false,
    weeklyPremiumGacha: 0,
    monthlyLimitedSticker: false,
    unlockAllDeco: false,
    exclusiveCovers: 0,
    badgeType: 'none',
    description: '',
  },
  light: {
    id: 'light',
    name: 'ぽけしるパス',
    price: 480,
    dailyBonusTickets: 2,
    dailyStars: 50,
    skipAds: false,
    weeklyPremiumGacha: 0,
    monthlyLimitedSticker: false,
    unlockAllDeco: false,
    exclusiveCovers: 0,
    badgeType: 'star',
    description: 'まいにちガチャが2回ふえる！どろっぷも毎日もらえるよ',
  },
  plus: {
    id: 'plus',
    name: 'ぽけしるパスプラス',
    price: 980,
    dailyBonusTickets: 5,
    dailyStars: 100,
    skipAds: true,
    weeklyPremiumGacha: 1,
    monthlyLimitedSticker: false,
    unlockAllDeco: false,
    exclusiveCovers: 3,
    badgeType: 'double-star',
    description: '広告なしでたくさんガチャがひける！限定カバーも',
  },
  deluxe: {
    id: 'deluxe',
    name: 'ぽけしるパスデラックス',
    price: 1980,
    dailyBonusTickets: 10,
    dailyStars: 200,
    skipAds: true,
    weeklyPremiumGacha: 3,
    monthlyLimitedSticker: true,
    unlockAllDeco: true,
    exclusiveCovers: 99, // 全解放
    badgeType: 'rainbow',
    description: 'ぜんぶ入り！限定シールも毎月届くよ',
  },
}

// ======================
// どろっぷパック（プレミアム通貨）
// ======================

export interface StarPack {
  id: string
  name: string
  price: number // 円
  stars: number
  bonusPercent: number
  isPopular?: boolean
  isFirstPurchaseDouble?: boolean
}

export const STAR_PACKS: StarPack[] = [
  { id: 'pack-1', name: 'おためし', price: 120, stars: 120, bonusPercent: 0 },
  { id: 'pack-2', name: 'ちょっと', price: 370, stars: 400, bonusPercent: 8 },
  { id: 'pack-3', name: 'おこづかい', price: 730, stars: 850, bonusPercent: 16, isPopular: true },
  { id: 'pack-4', name: 'たっぷり', price: 1480, stars: 1800, bonusPercent: 22 },
  { id: 'pack-5', name: 'もりもり', price: 3680, stars: 4800, bonusPercent: 30 },
  { id: 'pack-6', name: 'スペシャル', price: 6100, stars: 8500, bonusPercent: 39 },
]

// ======================
// ガチャ
// ======================

export type GachaType = 'normal' | 'premium'

export interface GachaCost {
  type: GachaType
  singleTickets: number
  singleStars: number
  tenTickets: number
  tenStars: number
  tenBonus: string // 10連の特典説明
}

export const GACHA_COSTS: Record<GachaType, GachaCost> = {
  normal: {
    type: 'normal',
    singleTickets: 1,
    singleStars: 30,
    tenTickets: 10,
    tenStars: 270,
    tenBonus: '★3いじょう 1まいかくてい！',
  },
  premium: {
    type: 'premium',
    singleTickets: 0, // チケット使用不可
    singleStars: 50,
    tenTickets: 0,
    tenStars: 450,
    tenBonus: '★4いじょう 1まいかくてい！',
  },
}

// ガチャ排出率
export interface GachaRates {
  star5: number
  star4: number
  star3: number
  star2: number
  star1: number
}

export const NORMAL_GACHA_RATES: GachaRates = {
  star5: 1.4,
  star4: 4.7,
  star3: 14.1,
  star2: 28.2,
  star1: 51.6,
}

export const PREMIUM_GACHA_RATES: GachaRates = {
  star5: 3.0,
  star4: 10.0,
  star3: 20.0,
  star2: 30.0,
  star1: 37.0,
}

// 天井
export const PITY_COUNT = 100 // 100連で★5確定

// ======================
// デイリーシステム
// ======================

export interface DailyMission {
  id: string
  title: string
  description: string
  reward: number // チケット枚数
  icon: string
}

export const DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'comment',
    title: 'コメントしよう',
    description: 'タイムラインにコメントする',
    reward: 1,
    icon: '/images/icons/mission_comment.png',
  },
  {
    id: 'place-sticker',
    title: 'シールをはろう',
    description: 'シールを1まいはる',
    reward: 1,
    icon: '/images/icons/mission_sticker.png',
  },
]

// デイリー配布
export const DAILY_FREE_TICKETS = 3 // 毎日もらえる無料チケット
export const MAX_AD_WATCHES_PER_DAY = 10 // 1日の最大広告視聴回数
export const TICKETS_PER_AD = 1 // 広告1回あたりのチケット

// ======================
// ユーザー課金状態
// ======================

export interface UserMonetization {
  // 通貨
  tickets: number  // シルチケ
  gems: number     // プレシル（プレミアムシルチケ）
  stars: number    // どろっぷ

  // サブスク
  subscription: SubscriptionTier
  subscriptionExpiresAt: string | null

  // デイリー状態（日付でリセット）
  lastDailyReset: string // ISO日付文字列
  dailyTicketsCollected: boolean
  dailyStarsCollected: boolean
  completedMissions: string[] // ミッションID配列
  adsWatchedToday: number

  // 統計
  totalStarsPurchased: number
  totalTicketsUsed: number
  isFirstPurchase: boolean

  // 天井カウント（バナーごと）
  pityCount: Record<string, number>
}

// 初期状態
export const DEFAULT_USER_MONETIZATION: UserMonetization = {
  tickets: 10,  // 初期シルチケ
  gems: 5,      // 初期プレシル
  stars: 100,   // 初期どろっぷ

  subscription: 'none',
  subscriptionExpiresAt: null,

  lastDailyReset: new Date().toISOString().split('T')[0],
  dailyTicketsCollected: false,
  dailyStarsCollected: false,
  completedMissions: [],
  adsWatchedToday: 0,

  totalStarsPurchased: 0,
  totalTicketsUsed: 0,
  isFirstPurchase: true,

  pityCount: {},
}

// ======================
// ヘルパー関数
// ======================

// デイリー配布時刻（日本時間 7:00）
export const DAILY_RESET_HOUR_JST = 7

/**
 * 日本時間での今日の日付を取得（7時基準）
 * 7時より前の場合は前日扱い
 */
export function getTodayDateJST(): string {
  const now = new Date()
  // JSTに変換 (UTC+9)
  const jstOffset = 9 * 60 * 60 * 1000
  const jstNow = new Date(now.getTime() + jstOffset)

  // 7時より前なら前日扱い
  if (jstNow.getUTCHours() < DAILY_RESET_HOUR_JST) {
    jstNow.setUTCDate(jstNow.getUTCDate() - 1)
  }

  return jstNow.toISOString().split('T')[0]
}

/**
 * デイリーリセットが必要かチェック（7時基準）
 */
export function needsDailyReset(lastReset: string): boolean {
  const today = getTodayDateJST()
  return lastReset !== today
}

/**
 * 次の7時までの時間（ミリ秒）を計算
 */
export function getMillisecondsUntilNext7AM(): number {
  const now = new Date()
  // JSTに変換
  const jstOffset = 9 * 60 * 60 * 1000
  const jstNow = new Date(now.getTime() + jstOffset)

  // 次の7時を計算
  const next7AM = new Date(jstNow)
  next7AM.setUTCHours(DAILY_RESET_HOUR_JST, 0, 0, 0)

  // 既に7時を過ぎていたら翌日の7時
  if (jstNow.getUTCHours() >= DAILY_RESET_HOUR_JST) {
    next7AM.setUTCDate(next7AM.getUTCDate() + 1)
  }

  // JSTからローカル時間に戻す
  const next7AMLocal = new Date(next7AM.getTime() - jstOffset)

  return next7AMLocal.getTime() - now.getTime()
}

/**
 * デイリーリセットを実行（7時基準）
 */
export function performDailyReset(state: UserMonetization): UserMonetization {
  const today = getTodayDateJST()
  return {
    ...state,
    lastDailyReset: today,
    dailyTicketsCollected: false,
    dailyStarsCollected: false,
    completedMissions: [],
    adsWatchedToday: 0,
  }
}

/**
 * デイリーチケットを収集
 */
export function collectDailyTickets(state: UserMonetization): UserMonetization {
  if (state.dailyTicketsCollected) return state

  const plan = SUBSCRIPTION_PLANS[state.subscription]
  const totalTickets = DAILY_FREE_TICKETS + plan.dailyBonusTickets

  // パスプラス以上は広告スキップ分も自動付与
  const adSkipTickets = plan.skipAds ? MAX_AD_WATCHES_PER_DAY : 0

  return {
    ...state,
    tickets: state.tickets + totalTickets + adSkipTickets,
    dailyTicketsCollected: true,
  }
}

/**
 * デイリーどろっぷを収集
 */
export function collectDailyStars(state: UserMonetization): UserMonetization {
  if (state.dailyStarsCollected) return state
  if (state.subscription === 'none') return state

  const plan = SUBSCRIPTION_PLANS[state.subscription]

  return {
    ...state,
    stars: state.stars + plan.dailyStars,
    dailyStarsCollected: true,
  }
}

/**
 * 広告視聴でチケット獲得
 */
export function watchAdForTicket(state: UserMonetization): UserMonetization | null {
  // パスプラス以上は広告不要（既に付与済み）
  if (SUBSCRIPTION_PLANS[state.subscription].skipAds) return null

  // 上限チェック
  if (state.adsWatchedToday >= MAX_AD_WATCHES_PER_DAY) return null

  return {
    ...state,
    tickets: state.tickets + TICKETS_PER_AD,
    adsWatchedToday: state.adsWatchedToday + 1,
  }
}

/**
 * ミッションクリア
 */
export function completeMission(state: UserMonetization, missionId: string): UserMonetization | null {
  if (state.completedMissions.includes(missionId)) return null

  const mission = DAILY_MISSIONS.find(m => m.id === missionId)
  if (!mission) return null

  return {
    ...state,
    tickets: state.tickets + mission.reward,
    completedMissions: [...state.completedMissions, missionId],
  }
}

/**
 * ガチャを引く（チケット使用）
 */
export function useTicketsForGacha(state: UserMonetization, count: number): UserMonetization | null {
  if (state.tickets < count) return null

  return {
    ...state,
    tickets: state.tickets - count,
    totalTicketsUsed: state.totalTicketsUsed + count,
  }
}

/**
 * ガチャを引く（どろっぷ使用）
 */
export function useStarsForGacha(
  state: UserMonetization,
  gachaType: GachaType,
  isTenPull: boolean
): UserMonetization | null {
  const cost = GACHA_COSTS[gachaType]
  const stars = isTenPull ? cost.tenStars : cost.singleStars

  if (state.stars < stars) return null

  return {
    ...state,
    stars: state.stars - stars,
  }
}

/**
 * どろっぷを購入
 */
export function purchaseStars(state: UserMonetization, packId: string): UserMonetization | null {
  const pack = STAR_PACKS.find(p => p.id === packId)
  if (!pack) return null

  // 初回購入ボーナス（2倍）
  const starsToAdd = state.isFirstPurchase ? pack.stars * 2 : pack.stars

  return {
    ...state,
    stars: state.stars + starsToAdd,
    totalStarsPurchased: state.totalStarsPurchased + pack.stars,
    isFirstPurchase: false,
  }
}

/**
 * 広告の残り視聴可能回数
 */
export function getRemainingAdWatches(state: UserMonetization): number {
  if (SUBSCRIPTION_PLANS[state.subscription].skipAds) return 0
  return MAX_AD_WATCHES_PER_DAY - state.adsWatchedToday
}

/**
 * 今日の最大ガチャ回数を計算
 */
export function getMaxDailyGachaPulls(subscription: SubscriptionTier): number {
  const plan = SUBSCRIPTION_PLANS[subscription]
  const base = DAILY_FREE_TICKETS
  const missions = DAILY_MISSIONS.reduce((sum, m) => sum + m.reward, 0)
  const ads = plan.skipAds ? MAX_AD_WATCHES_PER_DAY : MAX_AD_WATCHES_PER_DAY
  const bonus = plan.dailyBonusTickets

  return base + missions + ads + bonus
}
