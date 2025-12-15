// レベルシステム定義
// 小学生向けにわかりやすい称号とレベルアップ体験を提供

// レベルごとの称号（かわいい名前）
export const LEVEL_TITLES: Record<number, string> = {
  1: 'シールあつめびと',
  2: 'シールなかま',
  3: 'シールたんけんか',
  4: 'シールコレクター',
  5: 'シールマイスター',
  6: 'シールともだち',
  7: 'シールはかせ',
  8: 'シールマスター',
  9: 'シールチャンピオン',
  10: 'シールスター',
  11: 'シールヒーロー',
  12: 'シールレジェンド',
  13: 'シールせんし',
  14: 'シールエース',
  15: 'シールキング',
  16: 'シールクイーン',
  17: 'シールせいじゃ',
  18: 'シールてんさい',
  19: 'シールかみさま',
  20: 'シールでんせつ',
}

// レベルごとの必要経験値（累積）
// レベルアップするごとに必要EXPが増加
export const LEVEL_EXP_REQUIREMENTS: number[] = [
  0,      // Level 1 (start)
  100,    // Level 2
  250,    // Level 3
  450,    // Level 4
  700,    // Level 5
  1000,   // Level 6
  1400,   // Level 7
  1900,   // Level 8
  2500,   // Level 9
  3200,   // Level 10
  4000,   // Level 11
  5000,   // Level 12
  6200,   // Level 13
  7600,   // Level 14
  9200,   // Level 15
  11000,  // Level 16
  13000,  // Level 17
  15500,  // Level 18
  18500,  // Level 19
  22000,  // Level 20 (max)
]

// 最大レベル
export const MAX_LEVEL = 20

// 経験値獲得アクション
export type ExpAction =
  | 'gacha_single'      // ガチャ1回引く
  | 'gacha_ten'         // ガチャ10連
  | 'place_sticker'     // シールを貼る
  | 'trade_complete'    // 交換成立
  | 'post_create'       // 投稿する
  | 'receive_like'      // いいねをもらう
  | 'daily_login'       // デイリーログイン
  | 'first_sticker'     // 初めてのシールをゲット

// アクションごとの獲得経験値
export const EXP_REWARDS: Record<ExpAction, number> = {
  gacha_single: 10,
  gacha_ten: 100,       // 10連は少しボーナス
  place_sticker: 2,     // 連続で稼げるので控えめに（5→2）
  trade_complete: 30,   // 連続交換対策で減少（50→30）
  post_create: 10,      // 連続投稿対策で減少（20→10）
  receive_like: 1,      // いいね稼ぎ対策（2→1）
  daily_login: 15,
  first_sticker: 25,    // 初ゲットボーナス
}

// 各アクションの1日あたりの上限回数（無制限は undefined）
// この回数を超えた場合、経験値は獲得できない
export const EXP_DAILY_LIMITS: Partial<Record<ExpAction, number>> = {
  place_sticker: 20,    // 1日20回まで（計40EXP）
  trade_complete: 10,   // 1日10回まで（計300EXP）
  post_create: 5,       // 1日5回まで（計50EXP）
  receive_like: 50,     // 1日50回まで（計50EXP）
  // gacha_single: 制限なし（通貨で制限）
  // gacha_ten: 制限なし（通貨で制限）
  // daily_login: 1日1回のみ（別途管理）
  // first_sticker: 初回のみ
}

// アクションの日本語名（UI表示用）
export const EXP_ACTION_NAMES: Record<ExpAction, string> = {
  gacha_single: 'ガチャを引いた',
  gacha_ten: '10連ガチャを引いた',
  place_sticker: 'シールを貼った',
  trade_complete: '交換成立',
  post_create: '投稿した',
  receive_like: 'いいねをもらった',
  daily_login: 'ログインボーナス',
  first_sticker: '新しいシールをゲット',
}

// 今日のアクション回数を追跡するための型
export interface DailyActionCounts {
  date: string // YYYY-MM-DD形式
  counts: Partial<Record<ExpAction, number>>
}

// 今日の日付をYYYY-MM-DD形式で取得
export function getTodayDateString(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// デイリー上限をチェック（上限に達していればtrue）
export function hasReachedDailyLimit(
  action: ExpAction,
  dailyCounts: DailyActionCounts
): boolean {
  const limit = EXP_DAILY_LIMITS[action]
  if (limit === undefined) return false // 制限なし

  // 日付が違う場合はリセットされているとみなす
  if (dailyCounts.date !== getTodayDateString()) return false

  const currentCount = dailyCounts.counts[action] || 0
  return currentCount >= limit
}

// 残りの獲得可能回数を取得
export function getRemainingDailyCount(
  action: ExpAction,
  dailyCounts: DailyActionCounts
): number | null {
  const limit = EXP_DAILY_LIMITS[action]
  if (limit === undefined) return null // 制限なし

  // 日付が違う場合は上限いっぱい残っている
  if (dailyCounts.date !== getTodayDateString()) return limit

  const currentCount = dailyCounts.counts[action] || 0
  return Math.max(0, limit - currentCount)
}

// デイリーカウントを初期化または更新
export function updateDailyCount(
  dailyCounts: DailyActionCounts,
  action: ExpAction
): DailyActionCounts {
  const today = getTodayDateString()

  // 日付が変わっていたらリセット
  if (dailyCounts.date !== today) {
    return {
      date: today,
      counts: { [action]: 1 },
    }
  }

  return {
    date: today,
    counts: {
      ...dailyCounts.counts,
      [action]: (dailyCounts.counts[action] || 0) + 1,
    },
  }
}

// 初期のデイリーカウント
export function createInitialDailyCounts(): DailyActionCounts {
  return {
    date: getTodayDateString(),
    counts: {},
  }
}

// 累積経験値からレベルを計算
export function calculateLevel(totalExp: number): number {
  for (let i = LEVEL_EXP_REQUIREMENTS.length - 1; i >= 0; i--) {
    if (totalExp >= LEVEL_EXP_REQUIREMENTS[i]) {
      return i + 1
    }
  }
  return 1
}

// 現在レベルでの経験値（レベル内の進捗）
export function getCurrentLevelExp(totalExp: number): number {
  const level = calculateLevel(totalExp)
  const levelStartExp = LEVEL_EXP_REQUIREMENTS[level - 1] || 0
  return totalExp - levelStartExp
}

// 次のレベルまでの必要経験値
export function getExpToNextLevel(totalExp: number): number {
  const level = calculateLevel(totalExp)
  if (level >= MAX_LEVEL) {
    return 0 // 最大レベル
  }
  const nextLevelExp = LEVEL_EXP_REQUIREMENTS[level]
  const currentLevelExp = LEVEL_EXP_REQUIREMENTS[level - 1] || 0
  return nextLevelExp - currentLevelExp
}

// レベルに対応する称号を取得
export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, MAX_LEVEL)] || 'シールあつめびと'
}

// 経験値を追加した結果を計算
export interface ExpGainResult {
  newTotalExp: number
  newLevel: number
  oldLevel: number
  leveledUp: boolean
  levelsGained: number
  newTitle: string
  expGained: number
  // デイリー上限関連
  dailyLimitReached: boolean     // 上限に達したか
  remainingToday: number | null  // 今日の残り回数（制限なしの場合はnull）
}

// 基本版（デイリー上限チェックなし - 互換性のため残す）
export function addExp(currentTotalExp: number, action: ExpAction): ExpGainResult {
  const oldLevel = calculateLevel(currentTotalExp)
  const expGained = EXP_REWARDS[action]
  const newTotalExp = currentTotalExp + expGained
  const newLevel = calculateLevel(newTotalExp)

  return {
    newTotalExp,
    newLevel,
    oldLevel,
    leveledUp: newLevel > oldLevel,
    levelsGained: newLevel - oldLevel,
    newTitle: getLevelTitle(newLevel),
    expGained,
    dailyLimitReached: false,
    remainingToday: null,
  }
}

// デイリー上限チェック付き版
export interface AddExpWithLimitResult extends ExpGainResult {
  newDailyCounts: DailyActionCounts
}

export function addExpWithDailyLimit(
  currentTotalExp: number,
  action: ExpAction,
  dailyCounts: DailyActionCounts
): AddExpWithLimitResult {
  const oldLevel = calculateLevel(currentTotalExp)

  // デイリー上限チェック
  if (hasReachedDailyLimit(action, dailyCounts)) {
    return {
      newTotalExp: currentTotalExp,
      newLevel: oldLevel,
      oldLevel,
      leveledUp: false,
      levelsGained: 0,
      newTitle: getLevelTitle(oldLevel),
      expGained: 0, // 上限到達で経験値なし
      dailyLimitReached: true,
      remainingToday: 0,
      newDailyCounts: dailyCounts,
    }
  }

  // 経験値を加算
  const expGained = EXP_REWARDS[action]
  const newTotalExp = currentTotalExp + expGained
  const newLevel = calculateLevel(newTotalExp)

  // デイリーカウントを更新
  const newDailyCounts = updateDailyCount(dailyCounts, action)
  const remaining = getRemainingDailyCount(action, newDailyCounts)

  return {
    newTotalExp,
    newLevel,
    oldLevel,
    leveledUp: newLevel > oldLevel,
    levelsGained: newLevel - oldLevel,
    newTitle: getLevelTitle(newLevel),
    expGained,
    dailyLimitReached: remaining === 0,
    remainingToday: remaining,
    newDailyCounts,
  }
}

// レベルアップ時のご褒美（将来用）
export interface LevelUpReward {
  type: 'gacha_ticket' | 'star_points' | 'theme_unlock' | 'title_unlock'
  amount?: number
  itemId?: string
  name: string
}

export function getLevelUpRewards(level: number): LevelUpReward[] {
  const rewards: LevelUpReward[] = []

  // 全レベルで称号を獲得
  rewards.push({
    type: 'title_unlock',
    itemId: `title-${level}`,
    name: getLevelTitle(level),
  })

  // レベル5ごとにシルチケ
  if (level % 5 === 0) {
    rewards.push({
      type: 'gacha_ticket',
      amount: 1,
      name: 'シルチケ',
    })
  }

  // レベル10ごとにテーマ解放（将来用）
  if (level % 10 === 0) {
    rewards.push({
      type: 'theme_unlock',
      itemId: `theme-level-${level}`,
      name: 'スペシャルテーマ',
    })
  }

  return rewards
}

// 次のレベルまでの進捗率（0-100）
export function getLevelProgress(totalExp: number): number {
  const level = calculateLevel(totalExp)
  if (level >= MAX_LEVEL) {
    return 100
  }
  const currentLevelExp = getCurrentLevelExp(totalExp)
  const expNeeded = getExpToNextLevel(totalExp)
  if (expNeeded === 0) return 100
  return Math.round((currentLevelExp / expNeeded) * 100)
}

export default {
  calculateLevel,
  getCurrentLevelExp,
  getExpToNextLevel,
  getLevelTitle,
  addExp,
  addExpWithDailyLimit,
  getLevelUpRewards,
  getLevelProgress,
  hasReachedDailyLimit,
  getRemainingDailyCount,
  updateDailyCount,
  createInitialDailyCounts,
  getTodayDateString,
  MAX_LEVEL,
  EXP_REWARDS,
  EXP_DAILY_LIMITS,
  EXP_ACTION_NAMES,
}
