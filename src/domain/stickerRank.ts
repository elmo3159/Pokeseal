/**
 * シールランクアップシステム
 * 同じシールを集めるほどキラキラ豪華になる仕組み
 */

// ランクレベル（1-5、MAXは5）
export type RankLevel = 1 | 2 | 3 | 4 | 5

// ランク名
export const rankNames: Record<RankLevel, string> = {
  1: 'ノーマル',
  2: 'ブロンズ',
  3: 'シルバー',
  4: 'ゴールド',
  5: 'レジェンド'
}

// ランク名（子ども向け）
export const rankNamesKids: Record<RankLevel, string> = {
  1: '★',
  2: '★★',
  3: '★★★',
  4: '★★★★',
  5: '🌟MAX🌟'
}

// ランクアップに必要な累計獲得数
export const rankThresholds: Record<RankLevel, number> = {
  1: 1,   // 初めて入手
  2: 3,   // 合計3枚
  3: 6,   // 合計6枚
  4: 10,  // 合計10枚
  5: 15   // 合計15枚（MAX）
}

// ランクごとのレートボーナス（%）
export const rankRateBonus: Record<RankLevel, number> = {
  1: 0,    // ボーナスなし
  2: 10,   // +10%
  3: 25,   // +25%
  4: 50,   // +50%
  5: 100   // +100%（2倍）
}

// スターポイント変換レート（レアリティ別）
export const starPointsPerRarity: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 5,    // ★1 = 5ポイント
  2: 15,   // ★2 = 15ポイント
  3: 50,   // ★3 = 50ポイント
  4: 150,  // ★4 = 150ポイント
  5: 500   // ★5 = 500ポイント
}

/**
 * 累計獲得数からランクを計算
 */
export function calculateRank(totalAcquired: number): RankLevel {
  if (totalAcquired >= rankThresholds[5]) return 5
  if (totalAcquired >= rankThresholds[4]) return 4
  if (totalAcquired >= rankThresholds[3]) return 3
  if (totalAcquired >= rankThresholds[2]) return 2
  return 1
}

/**
 * 次のランクまでに必要な枚数を計算
 */
export function getNextRankRequirement(currentRank: RankLevel, totalAcquired: number): number | null {
  if (currentRank >= 5) return null // MAXの場合はnull

  const nextRank = (currentRank + 1) as RankLevel
  return rankThresholds[nextRank] - totalAcquired
}

/**
 * 次のランクまでの進捗率を計算（0-100%）
 */
export function getRankProgress(totalAcquired: number): number {
  const currentRank = calculateRank(totalAcquired)
  if (currentRank >= 5) return 100

  const nextRank = (currentRank + 1) as RankLevel
  const currentThreshold = rankThresholds[currentRank]
  const nextThreshold = rankThresholds[nextRank]

  const progress = (totalAcquired - currentThreshold) / (nextThreshold - currentThreshold)
  return Math.min(100, Math.max(0, progress * 100))
}

/**
 * ランクボーナスを加算したレートを計算
 */
export function calculateRateWithBonus(baseRate: number, rank: RankLevel): number {
  const bonus = rankRateBonus[rank]
  return Math.floor(baseRate * (1 + bonus / 100))
}

/**
 * シールをスターポイントに変換
 */
export function convertToStarPoints(rarity: 1 | 2 | 3 | 4 | 5, quantity: number): number {
  return starPointsPerRarity[rarity] * quantity
}

/**
 * ランクがMAXかどうか
 */
export function isMaxRank(rank: RankLevel): boolean {
  return rank === 5
}

// エフェクトの種類
export type RankEffect =
  | 'none'           // ランク1
  | 'glow'           // ランク2: 薄い光の縁取り
  | 'sparkle'        // ランク3: キラキラパーティクル
  | 'rainbow'        // ランク4: 虹色グラデーション
  | 'legendary'      // ランク5: レジェンドオーラ

/**
 * ランクに応じたエフェクトを取得
 */
export function getRankEffect(rank: RankLevel): RankEffect {
  switch (rank) {
    case 1: return 'none'
    case 2: return 'glow'
    case 3: return 'sparkle'
    case 4: return 'rainbow'
    case 5: return 'legendary'
    default: return 'none'
  }
}

/**
 * ランクに応じたカラーを取得
 */
export function getRankColor(rank: RankLevel): string {
  switch (rank) {
    case 1: return '#9CA3AF' // グレー
    case 2: return '#CD7F32' // ブロンズ
    case 3: return '#C0C0C0' // シルバー
    case 4: return '#FFD700' // ゴールド
    case 5: return '#FF69B4' // ピンク（レジェンド）
    default: return '#9CA3AF'
  }
}

/**
 * ランクに応じたグラデーションを取得
 */
export function getRankGradient(rank: RankLevel): string {
  switch (rank) {
    case 1: return 'from-gray-300 to-gray-400'
    case 2: return 'from-amber-600 to-amber-700'
    case 3: return 'from-slate-300 to-slate-400'
    case 4: return 'from-yellow-400 to-amber-500'
    case 5: return 'from-pink-400 via-purple-400 to-cyan-400'
    default: return 'from-gray-300 to-gray-400'
  }
}
