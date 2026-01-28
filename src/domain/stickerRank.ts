/**
 * シールランクアップシステム
 * 同じシールを集めるほどキラキラ豪華になる仕組み
 *
 * アップグレードランク（4ランク制）:
 * - NORMAL (0): そのまま
 * - SILVER (1): 5枚消費
 * - GOLD (2): 10枚消費（累計）
 * - PRISM (3): 20枚消費（累計）
 */

import { UPGRADE_RANKS, type UpgradeRank, RANK_NAMES, RANK_COLORS } from '@/constants/upgradeRanks'

// 互換性のためのre-export
export { UPGRADE_RANKS, RANK_NAMES, RANK_COLORS }
export type { UpgradeRank }

// ランク名（子ども向け）
export const rankNamesKids: Record<UpgradeRank, string> = {
  [UPGRADE_RANKS.NORMAL]: '★',
  [UPGRADE_RANKS.SILVER]: '★★',
  [UPGRADE_RANKS.GOLD]: '★★★',
  [UPGRADE_RANKS.PRISM]: '🌈MAX🌈'
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
 * シールをスターポイントに変換（新方式）
 * @param baseRarity ベースレアリティ (1-5)
 * @param upgradeRank アップグレードランク (0:Normal, 1:Silver, 2:Gold, 3:Prism)
 * @param quantity 数量
 */
export function convertToStarPoints(baseRarity: number, upgradeRank: number, quantity: number = 1): number {
  return calculateStickerPoints(baseRarity, upgradeRank) * quantity
}

// エフェクトの種類（4ランク制）
export type RankEffect =
  | 'none'           // NORMAL (0): エフェクトなし
  | 'glow'           // SILVER (1): 薄い光の縁取り
  | 'sparkle'        // GOLD (2): キラキラパーティクル + 虹ボーダー
  | 'prism'          // PRISM (3): プリズムオーラ（最高ランク）

/**
 * アップグレードランクに応じたエフェクトを取得
 */
export function getRankEffect(rank: UpgradeRank): RankEffect {
  switch (rank) {
    case UPGRADE_RANKS.NORMAL: return 'none'
    case UPGRADE_RANKS.SILVER: return 'glow'
    case UPGRADE_RANKS.GOLD: return 'sparkle'
    case UPGRADE_RANKS.PRISM: return 'prism'
    default: return 'none'
  }
}

/**
 * アップグレードランクに応じたカラーを取得
 */
export function getRankColor(rank: UpgradeRank): string {
  switch (rank) {
    case UPGRADE_RANKS.NORMAL: return '#FFD700' // ゴールド（通常の星色）
    case UPGRADE_RANKS.SILVER: return '#C0C0C0' // シルバー
    case UPGRADE_RANKS.GOLD: return '#FFD700' // ゴールド（より輝く）
    case UPGRADE_RANKS.PRISM: return '#FF69B4' // ピンク（プリズム）
    default: return '#FFD700'
  }
}

/**
 * アップグレードランクに応じたグラデーションを取得
 */
export function getRankGradient(rank: UpgradeRank): string {
  switch (rank) {
    case UPGRADE_RANKS.NORMAL: return 'from-yellow-400 to-amber-500'
    case UPGRADE_RANKS.SILVER: return 'from-slate-300 to-slate-400'
    case UPGRADE_RANKS.GOLD: return 'from-yellow-300 to-amber-400'
    case UPGRADE_RANKS.PRISM: return 'from-pink-400 via-purple-400 to-cyan-400'
    default: return 'from-yellow-400 to-amber-500'
  }
}
