// 実績サービス - ユーザーのアクションに基づいて実績を計算
import { Achievement } from '@/features/profile/ProfileView'
import { getSupabase } from '@/services/supabase'

// 実績の定義
export interface AchievementDefinition {
  id: string
  name: string
  description: string
  icon: string
  category: 'collection' | 'book' | 'gacha' | 'timeline' | 'special'
  condition: (stats: AchievementStats) => boolean
}

// 実績計算に必要な統計情報
export interface AchievementStats {
  totalStickers: number        // 所持シール総数
  uniqueStickers: number       // ユニークシール数
  placedStickers: number       // 配置済みシール数
  gachaPulls: number          // ガチャを引いた回数
  postsCount: number          // 投稿数
  highestRarity: number       // 所持している最高レアリティ
  completedSeries: number     // コンプリートしたシリーズ数
  totalTrades: number         // 交換回数
  friendsCount: number        // フレンド数
  loginDays: number           // ログイン日数
}

// 実績定義リスト
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // === コレクション系 ===
  {
    id: 'collection-first',
    name: 'はじめてのシール',
    description: 'シールを1枚手に入れよう',
    icon: '🌟',
    category: 'collection',
    condition: (stats) => stats.totalStickers >= 1,
  },
  {
    id: 'collection-10',
    name: 'かけだしコレクター',
    description: 'シールを10枚あつめよう',
    icon: '📦',
    category: 'collection',
    condition: (stats) => stats.totalStickers >= 10,
  },
  {
    id: 'collection-50',
    name: 'シールコレクター',
    description: 'シールを50枚あつめよう',
    icon: '🎨',
    category: 'collection',
    condition: (stats) => stats.totalStickers >= 50,
  },
  {
    id: 'collection-100',
    name: 'シールマスター',
    description: 'シールを100枚あつめよう',
    icon: '👑',
    category: 'collection',
    condition: (stats) => stats.totalStickers >= 100,
  },
  {
    id: 'collection-rare',
    name: 'レアハンター',
    description: '★4以上のシールを手に入れよう',
    icon: '💎',
    category: 'collection',
    condition: (stats) => stats.highestRarity >= 4,
  },
  {
    id: 'collection-legend',
    name: 'レジェンドゲット',
    description: '★5シールを手に入れよう',
    icon: '🏆',
    category: 'collection',
    condition: (stats) => stats.highestRarity >= 5,
  },

  // === シール帳系 ===
  {
    id: 'book-first',
    name: 'はじめの一歩',
    description: 'シール帳にシールをはろう',
    icon: '📖',
    category: 'book',
    condition: (stats) => stats.placedStickers >= 1,
  },
  {
    id: 'book-10',
    name: 'デコレーター',
    description: 'シール帳に10枚はろう',
    icon: '✨',
    category: 'book',
    condition: (stats) => stats.placedStickers >= 10,
  },
  {
    id: 'book-30',
    name: 'アーティスト',
    description: 'シール帳に30枚はろう',
    icon: '🎭',
    category: 'book',
    condition: (stats) => stats.placedStickers >= 30,
  },

  // === ガチャ系 ===
  {
    id: 'gacha-first',
    name: 'はじめてのガチャ',
    description: 'ガチャを1回まわそう',
    icon: '🎰',
    category: 'gacha',
    condition: (stats) => stats.gachaPulls >= 1,
  },
  {
    id: 'gacha-10',
    name: 'ガチャ好き',
    description: 'ガチャを10回まわそう',
    icon: '🎲',
    category: 'gacha',
    condition: (stats) => stats.gachaPulls >= 10,
  },
  {
    id: 'gacha-50',
    name: 'ガチャマニア',
    description: 'ガチャを50回まわそう',
    icon: '🌈',
    category: 'gacha',
    condition: (stats) => stats.gachaPulls >= 50,
  },

  // === タイムライン系 ===
  {
    id: 'timeline-first',
    name: 'はじめての投稿',
    description: 'タイムラインに投稿しよう',
    icon: '📝',
    category: 'timeline',
    condition: (stats) => stats.postsCount >= 1,
  },
  {
    id: 'timeline-5',
    name: '発信者',
    description: '5回投稿しよう',
    icon: '📢',
    category: 'timeline',
    condition: (stats) => stats.postsCount >= 5,
  },

  // === スペシャル系 ===
  {
    id: 'special-login-7',
    name: '1週間ログイン',
    description: '7日間ログインしよう',
    icon: '📅',
    category: 'special',
    condition: (stats) => stats.loginDays >= 7,
  },
  {
    id: 'special-login-30',
    name: '1ヶ月ログイン',
    description: '30日間ログインしよう',
    icon: '🗓️',
    category: 'special',
    condition: (stats) => stats.loginDays >= 30,
  },
]

// 実績を計算する
export function calculateAchievements(stats: AchievementStats): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map(def => {
    const isUnlocked = def.condition(stats)
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      isUnlocked,
      unlockedAt: isUnlocked ? new Date().toISOString() : undefined,
      category: def.category,
    }
  })
}

export interface UserAchievementRecord {
  achievement_id: string
  unlocked_at: string
}

export async function fetchUserAchievementMap(userId: string): Promise<Map<string, string>> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', userId)

  if (error) {
    console.error('[AchievementService] Fetch user achievements error:', error)
    return new Map()
  }

  const map = new Map<string, string>()
  for (const row of (data as UserAchievementRecord[] | null) || []) {
    if (row.achievement_id) {
      map.set(row.achievement_id, row.unlocked_at)
    }
  }
  return map
}

export function buildAchievementList(stats: AchievementStats, unlockedMap?: Map<string, string>): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map(def => {
    const shouldUnlock = def.condition(stats)
    const unlockedAt = unlockedMap?.get(def.id)
    const isUnlocked = Boolean(unlockedAt) || shouldUnlock
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      isUnlocked,
      unlockedAt: unlockedAt || (shouldUnlock ? new Date().toISOString() : undefined),
      category: def.category,
    }
  })
}

export async function syncUserAchievements(
  userId: string,
  stats: AchievementStats
): Promise<Achievement[]> {
  const supabase = getSupabase()
  const unlockedIds = ACHIEVEMENT_DEFINITIONS
    .filter(def => def.condition(stats))
    .map(def => def.id)

  if (unlockedIds.length > 0) {
    const { error } = await supabase
      .from('user_achievements')
      .upsert(
        unlockedIds.map(id => ({
          user_id: userId,
          achievement_id: id,
        })),
        { onConflict: 'user_id,achievement_id', ignoreDuplicates: true }
      )

    if (error) {
      console.error('[AchievementService] Upsert achievements error:', error)
      return buildAchievementList(stats)
    }
  }

  const unlockedMap = await fetchUserAchievementMap(userId)
  return buildAchievementList(stats, unlockedMap)
}

// カテゴリ別に実績を取得
export function getAchievementsByCategory(achievements: Achievement[]): Record<string, Achievement[]> {
  const result: Record<string, Achievement[]> = {
    collection: [],
    book: [],
    gacha: [],
    timeline: [],
    special: [],
  }

  achievements.forEach(achievement => {
    const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === achievement.id)
    if (def) {
      result[def.category].push(achievement)
    }
  })

  return result
}

// 達成済み実績数を取得
export function getUnlockedCount(achievements: Achievement[]): number {
  return achievements.filter(a => a.isUnlocked).length
}

// 達成率を取得（パーセント）
export function getCompletionRate(achievements: Achievement[]): number {
  if (achievements.length === 0) return 0
  return Math.round((getUnlockedCount(achievements) / achievements.length) * 100)
}

export default {
  calculateAchievements,
  buildAchievementList,
  syncUserAchievements,
  fetchUserAchievementMap,
  getAchievementsByCategory,
  getUnlockedCount,
  getCompletionRate,
  ACHIEVEMENT_DEFINITIONS,
}
