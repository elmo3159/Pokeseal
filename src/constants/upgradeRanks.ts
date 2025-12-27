// シールアップグレードランク定数
// ダブりシールを集めてアップグレードするシステム

export const UPGRADE_RANKS = {
  NORMAL: 0,
  SILVER: 1,
  GOLD: 2,
  PRISM: 3,
} as const

export type UpgradeRank = typeof UPGRADE_RANKS[keyof typeof UPGRADE_RANKS]

// アップグレード条件
export const UPGRADE_REQUIREMENTS = {
  [UPGRADE_RANKS.SILVER]: { fromRank: UPGRADE_RANKS.NORMAL, count: 5 },
  [UPGRADE_RANKS.GOLD]: { fromRank: UPGRADE_RANKS.SILVER, count: 2 },
  [UPGRADE_RANKS.PRISM]: { fromRank: UPGRADE_RANKS.GOLD, count: 2 },
} as const

// ランクごとの星ボーナス（累計）
export const STAR_BONUS = {
  [UPGRADE_RANKS.NORMAL]: 0,
  [UPGRADE_RANKS.SILVER]: 1,
  [UPGRADE_RANKS.GOLD]: 3,
  [UPGRADE_RANKS.PRISM]: 5,
} as const

// ランク名
export const RANK_NAMES = {
  [UPGRADE_RANKS.NORMAL]: 'ノーマル',
  [UPGRADE_RANKS.SILVER]: 'シルバー',
  [UPGRADE_RANKS.GOLD]: 'ゴールド',
  [UPGRADE_RANKS.PRISM]: 'プリズム',
} as const

// ランクの色設定（CSS用）
export const RANK_COLORS = {
  [UPGRADE_RANKS.NORMAL]: {
    primary: '#FFD700',
    secondary: '#FFA500',
    glow: 'rgba(255, 215, 0, 0)',
  },
  [UPGRADE_RANKS.SILVER]: {
    primary: '#C0C0C0',
    secondary: '#E8E8E8',
    glow: 'rgba(192, 192, 192, 0.8)',
  },
  [UPGRADE_RANKS.GOLD]: {
    primary: '#FFD700',
    secondary: '#FFF8DC',
    glow: 'rgba(255, 215, 0, 0.9)',
  },
  [UPGRADE_RANKS.PRISM]: {
    primary: 'rainbow',
    secondary: 'rainbow',
    glow: 'rgba(255, 0, 255, 0.8)',
  },
} as const

// 名前装飾のマーク（絵文字ではなくCSS装飾で表現）
export const RANK_MARK_COUNT = {
  [UPGRADE_RANKS.NORMAL]: 0,
  [UPGRADE_RANKS.SILVER]: 1,
  [UPGRADE_RANKS.GOLD]: 2,
  [UPGRADE_RANKS.PRISM]: 3,
} as const

// ランクに応じた短いサフィックス（名前の後に付ける）
// ソシャゲ風レア度表記で直感的にわかりやすく
export const RANK_SUFFIX = {
  [UPGRADE_RANKS.NORMAL]: '',       // ノーマル: なし
  [UPGRADE_RANKS.SILVER]: ' SR',    // シルバー: Super Rare
  [UPGRADE_RANKS.GOLD]: ' SSR',     // ゴールド: Super Super Rare
  [UPGRADE_RANKS.PRISM]: ' UR',     // プリズム: Ultra Rare
} as const

// 名前にランクサフィックスを付加
export function formatNameWithRank(name: string, upgradeRank: UpgradeRank): string {
  const suffix = RANK_SUFFIX[upgradeRank] || ''
  return `${name}${suffix}`
}

// 次のランクを取得
export function getNextRank(currentRank: UpgradeRank): UpgradeRank | null {
  switch (currentRank) {
    case UPGRADE_RANKS.NORMAL:
      return UPGRADE_RANKS.SILVER
    case UPGRADE_RANKS.SILVER:
      return UPGRADE_RANKS.GOLD
    case UPGRADE_RANKS.GOLD:
      return UPGRADE_RANKS.PRISM
    case UPGRADE_RANKS.PRISM:
      return null // 最高ランク
    default:
      return null
  }
}

// アップグレードに必要な枚数を計算
export function getUpgradeRequirement(targetRank: UpgradeRank): { fromRank: UpgradeRank; count: number } | null {
  const requirement = UPGRADE_REQUIREMENTS[targetRank as keyof typeof UPGRADE_REQUIREMENTS]
  return requirement || null
}

// 指定ランクまでに必要な累計枚数
export function getTotalRequiredCount(targetRank: UpgradeRank): number {
  switch (targetRank) {
    case UPGRADE_RANKS.NORMAL:
      return 1
    case UPGRADE_RANKS.SILVER:
      return 5  // ノーマル5枚
    case UPGRADE_RANKS.GOLD:
      return 10 // シルバー2枚 = ノーマル10枚
    case UPGRADE_RANKS.PRISM:
      return 20 // ゴールド2枚 = シルバー4枚 = ノーマル20枚
    default:
      return 1
  }
}

// ランクが最高か判定
export function isMaxRank(rank: UpgradeRank): boolean {
  return rank === UPGRADE_RANKS.PRISM
}

// ランクを比較
export function compareRanks(a: UpgradeRank, b: UpgradeRank): number {
  return a - b
}
