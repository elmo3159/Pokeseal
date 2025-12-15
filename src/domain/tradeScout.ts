/**
 * トレード・スカウト（自動マッチング）のドメイン定義
 * ほしいシールと出せるシールを登録して、自動でマッチング！
 */

// スカウト登録するシールの情報
export interface ScoutSticker {
  stickerId: string
  stickerName: string
  stickerImageUrl: string
  rarity: number
}

// ユーザーのスカウト設定
export interface ScoutSettings {
  /** 欲しいシール（最大5枚） */
  wantList: ScoutSticker[]
  /** 出せるシール（最大5枚） */
  offerList: ScoutSticker[]
  /** スカウト有効フラグ */
  isActive: boolean
  /** 最終更新日時 */
  updatedAt: string
}

// マッチング候補のユーザー
export interface ScoutMatch {
  id: string
  /** マッチしたユーザー情報 */
  user: {
    id: string
    name: string
    avatarUrl: string
    level: number
  }
  /** 相手が欲しがっていて、自分が出せるシール */
  myOffersTheyWant: ScoutSticker[]
  /** 自分が欲しくて、相手が出せるシール */
  theirOffersIWant: ScoutSticker[]
  /** マッチングスコア（両方のマッチ数の合計） */
  matchScore: number
  /** マッチング検出日時 */
  matchedAt: string
  /** 既読フラグ */
  isRead: boolean
}

// スカウト状態
export interface TradeScoutState {
  settings: ScoutSettings
  matches: ScoutMatch[]
  /** 最後にスカウトを実行した日時 */
  lastScoutedAt: string | null
}

// 初期状態
export const initialScoutSettings: ScoutSettings = {
  wantList: [],
  offerList: [],
  isActive: false,
  updatedAt: new Date().toISOString(),
}

export const initialTradeScoutState: TradeScoutState = {
  settings: initialScoutSettings,
  matches: [],
  lastScoutedAt: null,
}

// 最大登録数
export const MAX_WANT_LIST = 5
export const MAX_OFFER_LIST = 5

/**
 * マッチングスコアを計算
 * @param match マッチング情報
 * @returns スコア（両方向のマッチが多いほど高い）
 */
export function calculateMatchScore(
  myOffersTheyWant: ScoutSticker[],
  theirOffersIWant: ScoutSticker[]
): number {
  // 両方向のマッチがある場合はボーナス
  const hasDoubleMatch = myOffersTheyWant.length > 0 && theirOffersIWant.length > 0
  const baseScore = myOffersTheyWant.length + theirOffersIWant.length
  return hasDoubleMatch ? baseScore * 2 : baseScore
}

/**
 * レアリティの日本語表記
 */
export function getRarityLabel(rarity: number): string {
  const labels: Record<number, string> = {
    1: 'ノーマル',
    2: 'レア',
    3: 'スーパーレア',
    4: 'ウルトラレア',
    5: 'レジェンド',
  }
  return labels[rarity] || 'ふつう'
}

/**
 * スカウト状態のテキスト
 */
export function getScoutStatusText(state: TradeScoutState): string {
  if (!state.settings.isActive) {
    return 'スカウトていし中'
  }
  if (state.settings.wantList.length === 0 && state.settings.offerList.length === 0) {
    return 'シールをとうろくしてね'
  }
  return 'スカウトちゅう✨'
}
