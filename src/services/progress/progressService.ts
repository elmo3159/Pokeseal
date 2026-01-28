// プログレスサービス - レベル・経験値・称号システム
import { getSupabase } from '@/services/supabase/client'

export interface UserProgress {
  user_id: string
  level: number
  exp: number
  title: string
  badges: Badge[]
  created_at: string
  updated_at: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned_at: string
}

export interface LevelUpResult {
  leveled_up: boolean
  old_level: number
  new_level: number
  new_title?: string
  rewards: Reward[]
}

// 既存のLevelUpReward型と互換性を持たせる
export interface Reward {
  type: 'gacha_ticket' | 'star_points' | 'theme_unlock' | 'title_unlock'
  amount?: number
  itemId?: string
  name: string
}

// レベルアップに必要な経験値を計算
function getExpForLevel(level: number): number {
  // レベル1→2: 100 exp
  // レベル2→3: 150 exp
  // レベル3→4: 225 exp
  // 指数関数的に増加（レベル * 50 * 1.5^(レベル-1)）
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

// レベルごとの称号マップ（既存システムと統合）
const LEVEL_TITLES: Record<number, string> = {
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
  25: 'シールエンペラー',
  30: 'シールひめ',
  40: 'シールまじん',
  50: 'シールかいおう',
  75: 'シールだいまおう',
  100: 'シールぜんのうしん',
  150: 'シールそうぞうしゅ',
  200: 'シールうちゅうおう'
}

// レベルに応じた称号を取得
function getTitleForLevel(level: number): string {
  // 完全一致の称号があればそれを返す
  if (LEVEL_TITLES[level]) {
    return LEVEL_TITLES[level]
  }

  // なければ、最も近い下の称号を返す
  const levels = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a)
  for (const l of levels) {
    if (level >= l) {
      return LEVEL_TITLES[l]
    }
  }

  return 'シールあつめびと'
}

// レベルアップ報酬を取得（既存のLevelUpReward型と互換）
function getLevelUpRewards(level: number): Reward[] {
  const rewards: Reward[] = []

  // 全レベルで称号を獲得
  rewards.push({
    type: 'title_unlock',
    itemId: `title-${level}`,
    name: getTitleForLevel(level),
  })

  // 5レベルごとにシルチケ（スターポイントとして表現）
  if (level % 5 === 0) {
    rewards.push({
      type: 'star_points',
      amount: 10,
      name: 'シルチケ×10'
    })
  }

  // 10レベルごとにプレシルチケ
  if (level % 10 === 0) {
    rewards.push({
      type: 'star_points',
      amount: 50,
      name: 'プレシルチケ×3'
    })
  }

  // 25レベルごとにガチャチケット
  if (level % 25 === 0) {
    rewards.push({
      type: 'gacha_ticket',
      amount: 1,
      name: '★4確定ガチャチケット'
    })
  }

  // 50レベルごとに限定テーマ
  if (level % 50 === 0) {
    rewards.push({
      type: 'theme_unlock',
      itemId: `theme-level-${level}`,
      name: '限定カバーデザイン'
    })
  }

  return rewards
}

export const progressService = {
  // ユーザー進捗を取得（なければ作成）
  async getOrCreateProgress(userId: string): Promise<UserProgress | null> {
    const supabase = getSupabase()

    // 既存の進捗を取得
    const { data: existing, error: fetchError } = await supabase
      .from('user_progress' as any)
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existing) {
      return existing as unknown as UserProgress
    }

    // なければ新規作成
    const { data: created, error: createError } = await supabase
      .from('user_progress' as any)
      .insert({
        user_id: userId,
        level: 1,
        exp: 0,
        title: '初心者コレクター',
        badges: []
      })
      .select()
      .single()

    if (createError) {
      console.error('[Progress] Failed to create progress:', createError)
      return null
    }

    return created as unknown as UserProgress
  },

  // 経験値を追加（レベルアップチェック付き）
  async addExp(userId: string, expAmount: number): Promise<LevelUpResult | null> {
    const supabase = getSupabase()

    // 現在の進捗を取得
    const progress = await this.getOrCreateProgress(userId)
    if (!progress) return null

    const oldLevel = progress.level
    let currentLevel = progress.level
    let currentExp = progress.exp + expAmount
    const leveledUpLevels: number[] = []

    // レベルアップ判定（複数レベル一気に上がることもある）
    while (true) {
      const requiredExp = getExpForLevel(currentLevel)
      if (currentExp >= requiredExp) {
        currentExp -= requiredExp
        currentLevel += 1
        leveledUpLevels.push(currentLevel)
      } else {
        break
      }
    }

    // 新しい称号を取得
    const newTitle = getTitleForLevel(currentLevel)
    const titleChanged = newTitle !== progress.title

    // 進捗を更新
    const { error: updateError } = await supabase
      .from('user_progress' as any)
      .update({
        level: currentLevel,
        exp: currentExp,
        title: newTitle
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('[Progress] Failed to update progress:', updateError)
      return null
    }

    // レベルアップ報酬を集計
    const allRewards: Reward[] = []
    for (const level of leveledUpLevels) {
      const rewards = getLevelUpRewards(level)
      allRewards.push(...rewards)
    }

    return {
      leveled_up: leveledUpLevels.length > 0,
      old_level: oldLevel,
      new_level: currentLevel,
      new_title: titleChanged ? newTitle : undefined,
      rewards: allRewards
    }
  },

  // バッジを追加
  async addBadge(userId: string, badge: Badge): Promise<boolean> {
    const supabase = getSupabase()

    const progress = await this.getOrCreateProgress(userId)
    if (!progress) return false

    // 既に持っているバッジか確認
    const hasBadge = progress.badges.some((b: Badge) => b.id === badge.id)
    if (hasBadge) return false

    // バッジを追加
    const updatedBadges = [...progress.badges, badge]

    const { error } = await supabase
      .from('user_progress' as any)
      .update({ badges: updatedBadges })
      .eq('user_id', userId)

    if (error) {
      console.error('[Progress] Failed to add badge:', error)
      return false
    }

    return true
  },

  // レベルに必要な経験値を取得
  getExpForNextLevel(level: number): number {
    return getExpForLevel(level)
  },

  // 全ユーザーのランキングを取得（レベル順）
  async getLeaderboard(limit: number = 100): Promise<UserProgress[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('user_progress' as any)
      .select('*')
      .order('level', { ascending: false })
      .order('exp', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[Progress] Failed to get leaderboard:', error)
      return []
    }

    return (data as unknown as UserProgress[]) || []
  }
}

export default progressService
