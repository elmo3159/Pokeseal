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

// =============================================
// シール交換ポイント計算システム
// =============================================
//
// ベースレアリティ × アップグレードランク でポイントを決定
//
// 設計思想:
// - 低レアでもアップグレードすれば価値が上がる
// - 段階的交換ルート: ★1 → Prism★1 → ★3 → Prism★3 → ★5
// - 交換アービトラージを防止（Prism★1 < ★4）
//
// アップグレードランク:
// - Normal (0): そのまま
// - Silver (1): 5枚消費、★+1
// - Gold (2): 10枚消費（累計）、★+3
// - Prism (3): 20枚消費（累計）、★+5

// ベースレアリティのポイント（後方互換性のため維持）
export const starPointsPerRarity: Record<number, number> = {
  1: 5,
  2: 15,
  3: 50,
  4: 150,
  5: 500,
}

// ベースレアリティ × アップグレードランク のポイントテーブル
// [baseRarity][upgradeRank] = points
export const STICKER_POINTS: Record<number, Record<number, number>> = {
  // ★1: 低レアだがアップグレードで価値上昇
  1: {
    0: 5,      // Normal
    1: 20,     // Silver (★2より少し上)
    2: 60,     // Gold (★3より少し上)
    3: 100,    // Prism (★3〜★4の間)
  },
  // ★2
  2: {
    0: 15,     // Normal
    1: 35,     // Silver
    2: 80,     // Gold
    3: 180,    // Prism
  },
  // ★3
  3: {
    0: 50,     // Normal
    1: 100,    // Silver
    2: 200,    // Gold
    3: 600,    // Prism (★5以上)
  },
  // ★4
  4: {
    0: 150,    // Normal
    1: 225,    // Silver
    2: 450,    // Gold
    3: 1200,   // Prism
  },
  // ★5: 最高レア
  5: {
    0: 500,    // Normal
    1: 750,    // Silver
    2: 1250,   // Gold
    3: 3000,   // Prism
  },
}

/**
 * シールのポイントを計算
 * @param baseRarity ベースレアリティ (1-5)
 * @param upgradeRank アップグレードランク (0:Normal, 1:Silver, 2:Gold, 3:Prism)
 */
export function calculateStickerPoints(baseRarity: number, upgradeRank: number = 0): number {
  const clampedRarity = Math.max(1, Math.min(5, baseRarity))
  const clampedRank = Math.max(0, Math.min(3, upgradeRank))
  return STICKER_POINTS[clampedRarity]?.[clampedRank] ?? starPointsPerRarity[clampedRarity] ?? 5
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
 * シールをスターポイントに変換（新方式）
 * @param baseRarity ベースレアリティ (1-5)
 * @param upgradeRank アップグレードランク (0:Normal, 1:Silver, 2:Gold, 3:Prism)
 * @param quantity 数量
 */
export function convertToStarPoints(baseRarity: number, upgradeRank: number, quantity: number = 1): number {
  return calculateStickerPoints(baseRarity, upgradeRank) * quantity
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
