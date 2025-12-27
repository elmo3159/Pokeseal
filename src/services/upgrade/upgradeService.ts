// シールアップグレードサービス
import { getSupabase } from '@/services/supabase'
import {
  UPGRADE_RANKS,
  UPGRADE_REQUIREMENTS,
  getNextRank,
  isMaxRank,
  type UpgradeRank,
} from '@/constants/upgradeRanks'

// 型定義
export interface UserStickerWithRank {
  id: string
  user_id: string
  sticker_id: string
  quantity: number
  upgrade_rank: UpgradeRank
  upgraded_at: string | null
  created_at: string
  updated_at: string
}

export interface UpgradeResult {
  success: boolean
  message: string
  newSticker?: UserStickerWithRank
  consumedCount?: number
}

export interface StickerAchievement {
  id: string
  user_id: string
  sticker_id: string
  max_upgrade_rank: UpgradeRank
  first_silver_at: string | null
  first_gold_at: string | null
  first_prism_at: string | null
}

export const upgradeService = {
  /**
   * 指定シールの各ランク別所持数を取得
   */
  async getStickersByRank(
    userId: string,
    stickerId: string
  ): Promise<Map<UpgradeRank, { count: number; userStickerId: string | null }>> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('user_stickers')
      .select('id, quantity, upgrade_rank')
      .eq('user_id', userId)
      .eq('sticker_id', stickerId)

    if (error) {
      console.error('Get stickers by rank error:', error)
      return new Map()
    }

    const result = new Map<UpgradeRank, { count: number; userStickerId: string | null }>()

    // 全ランクを初期化
    for (const rank of Object.values(UPGRADE_RANKS)) {
      result.set(rank, { count: 0, userStickerId: null })
    }

    // データを設定
    for (const item of data || []) {
      result.set(item.upgrade_rank as UpgradeRank, {
        count: item.quantity || 0,
        userStickerId: item.id,
      })
    }

    return result
  },

  /**
   * アップグレード可能か判定
   */
  canUpgrade(
    rankCounts: Map<UpgradeRank, { count: number; userStickerId: string | null }>,
    targetRank: UpgradeRank
  ): { canUpgrade: boolean; reason?: string } {
    const requirement = UPGRADE_REQUIREMENTS[targetRank as keyof typeof UPGRADE_REQUIREMENTS]

    if (!requirement) {
      return { canUpgrade: false, reason: '無効なランクです' }
    }

    const sourceRankData = rankCounts.get(requirement.fromRank)
    const sourceCount = sourceRankData?.count || 0

    if (sourceCount < requirement.count) {
      return {
        canUpgrade: false,
        reason: `${requirement.count}枚必要です（現在${sourceCount}枚）`,
      }
    }

    return { canUpgrade: true }
  },

  /**
   * アップグレードを実行
   */
  async executeUpgrade(
    userId: string,
    stickerId: string,
    targetRank: UpgradeRank
  ): Promise<UpgradeResult> {
    const supabase = getSupabase()

    // アップグレード条件を取得
    const requirement = UPGRADE_REQUIREMENTS[targetRank as keyof typeof UPGRADE_REQUIREMENTS]
    if (!requirement) {
      return { success: false, message: '無効なアップグレード先です' }
    }

    // 現在の所持状況を取得
    const rankCounts = await this.getStickersByRank(userId, stickerId)

    // アップグレード可能か確認
    const { canUpgrade, reason } = this.canUpgrade(rankCounts, targetRank)
    if (!canUpgrade) {
      return { success: false, message: reason || 'アップグレードできません' }
    }

    const sourceRankData = rankCounts.get(requirement.fromRank)!
    const targetRankData = rankCounts.get(targetRank)

    try {
      // トランザクション的に処理
      // 1. 素材シールの数量を減らす
      const newSourceQuantity = sourceRankData.count - requirement.count

      if (newSourceQuantity <= 0) {
        // 数量が0になったらレコードを削除
        await supabase
          .from('user_stickers')
          .delete()
          .eq('id', sourceRankData.userStickerId!)
      } else {
        // 数量を減らす
        await supabase
          .from('user_stickers')
          .update({
            quantity: newSourceQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', sourceRankData.userStickerId!)
      }

      // 2. アップグレード先シールを追加/更新
      let newSticker: UserStickerWithRank | undefined

      if (targetRankData?.userStickerId) {
        // 既存のランクシールがある場合は数量を増やす
        const { data, error } = await supabase
          .from('user_stickers')
          .update({
            quantity: (targetRankData.count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetRankData.userStickerId)
          .select('*')
          .single()

        if (error) throw error
        newSticker = data as UserStickerWithRank
      } else {
        // 新規作成
        const { data, error } = await supabase
          .from('user_stickers')
          .insert({
            user_id: userId,
            sticker_id: stickerId,
            quantity: 1,
            upgrade_rank: targetRank,
            upgraded_at: new Date().toISOString(),
            first_acquired_at: new Date().toISOString(),
          })
          .select('*')
          .single()

        if (error) throw error
        newSticker = data as UserStickerWithRank
      }

      // 3. アップグレード履歴を記録
      await supabase
        .from('sticker_upgrade_history')
        .insert({
          user_id: userId,
          sticker_id: stickerId,
          from_rank: requirement.fromRank,
          to_rank: targetRank,
          consumed_quantity: requirement.count,
        })

      // 4. achievementsを更新
      await this.updateAchievement(userId, stickerId, targetRank)

      return {
        success: true,
        message: 'アップグレード成功！',
        newSticker,
        consumedCount: requirement.count,
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      return { success: false, message: 'アップグレードに失敗しました' }
    }
  },

  /**
   * achievementsを更新
   */
  async updateAchievement(
    userId: string,
    stickerId: string,
    newRank: UpgradeRank
  ): Promise<void> {
    const supabase = getSupabase()

    // 既存のachievementを取得
    const { data: existing } = await supabase
      .from('user_sticker_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('sticker_id', stickerId)
      .single()

    const now = new Date().toISOString()

    if (existing) {
      // 更新
      const updates: Record<string, unknown> = {
        updated_at: now,
      }

      // 最高ランクを更新
      if (newRank > (existing.max_upgrade_rank ?? 0)) {
        updates.max_upgrade_rank = newRank
      }

      // 初到達日時を記録
      if (newRank === UPGRADE_RANKS.SILVER && !existing.first_silver_at) {
        updates.first_silver_at = now
      }
      if (newRank === UPGRADE_RANKS.GOLD && !existing.first_gold_at) {
        updates.first_gold_at = now
      }
      if (newRank === UPGRADE_RANKS.PRISM && !existing.first_prism_at) {
        updates.first_prism_at = now
      }

      await supabase
        .from('user_sticker_achievements')
        .update(updates)
        .eq('id', existing.id)
    } else {
      // 新規作成
      const insert: {
        user_id: string
        sticker_id: string
        max_upgrade_rank: number
        first_silver_at?: string
        first_gold_at?: string
        first_prism_at?: string
      } = {
        user_id: userId,
        sticker_id: stickerId,
        max_upgrade_rank: newRank,
      }

      if (newRank >= UPGRADE_RANKS.SILVER) insert.first_silver_at = now
      if (newRank >= UPGRADE_RANKS.GOLD) insert.first_gold_at = now
      if (newRank >= UPGRADE_RANKS.PRISM) insert.first_prism_at = now

      await supabase
        .from('user_sticker_achievements')
        .insert(insert)
    }
  },

  /**
   * ユーザーのachievements一覧を取得
   */
  async getUserAchievements(userId: string): Promise<StickerAchievement[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('user_sticker_achievements')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Get achievements error:', error)
      return []
    }

    return data as StickerAchievement[]
  },

  /**
   * プリズムランク達成数を取得
   */
  async getPrismCount(userId: string): Promise<number> {
    const supabase = getSupabase()

    const { count, error } = await supabase
      .from('user_sticker_achievements')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('max_upgrade_rank', UPGRADE_RANKS.PRISM)

    if (error) {
      console.error('Get prism count error:', error)
      return 0
    }

    return count || 0
  },

  /**
   * ランク別達成数を取得（図鑑進捗表示用）
   */
  async getRankProgressCounts(
    userId: string,
    totalStickerTypes: number
  ): Promise<{
    silver: number
    gold: number
    prism: number
    total: number
  }> {
    const supabase = getSupabase()

    // 各ランク以上の達成数をカウント
    const [silverResult, goldResult, prismResult] = await Promise.all([
      supabase
        .from('user_sticker_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('max_upgrade_rank', UPGRADE_RANKS.SILVER),
      supabase
        .from('user_sticker_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('max_upgrade_rank', UPGRADE_RANKS.GOLD),
      supabase
        .from('user_sticker_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('max_upgrade_rank', UPGRADE_RANKS.PRISM),
    ])

    if (silverResult.error) {
      console.error('Get silver count error:', silverResult.error)
    }
    if (goldResult.error) {
      console.error('Get gold count error:', goldResult.error)
    }
    if (prismResult.error) {
      console.error('Get prism count error:', prismResult.error)
    }

    return {
      silver: silverResult.count || 0,
      gold: goldResult.count || 0,
      prism: prismResult.count || 0,
      total: totalStickerTypes,
    }
  },

  /**
   * アップグレード履歴を取得
   */
  async getUpgradeHistory(
    userId: string,
    limit: number = 50
  ): Promise<Array<{
    id: string
    sticker_id: string
    from_rank: number
    to_rank: number
    consumed_quantity: number
    upgraded_at: string | null
  }>> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('sticker_upgrade_history')
      .select('*')
      .eq('user_id', userId)
      .order('upgraded_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Get upgrade history error:', error)
      return []
    }

    return data || []
  },

  /**
   * 指定シールの次にアップグレード可能なランクを取得
   */
  async getAvailableUpgrades(
    userId: string,
    stickerId: string
  ): Promise<Array<{
    targetRank: UpgradeRank
    fromRank: UpgradeRank
    requiredCount: number
    currentCount: number
    canUpgrade: boolean
  }>> {
    const rankCounts = await this.getStickersByRank(userId, stickerId)
    const results: Array<{
      targetRank: UpgradeRank
      fromRank: UpgradeRank
      requiredCount: number
      currentCount: number
      canUpgrade: boolean
    }> = []

    // 各ランクへのアップグレード可能性をチェック
    for (const [targetRank, requirement] of Object.entries(UPGRADE_REQUIREMENTS)) {
      const targetRankNum = parseInt(targetRank) as UpgradeRank
      const sourceRankData = rankCounts.get(requirement.fromRank)
      const currentCount = sourceRankData?.count || 0

      results.push({
        targetRank: targetRankNum,
        fromRank: requirement.fromRank,
        requiredCount: requirement.count,
        currentCount,
        canUpgrade: currentCount >= requirement.count,
      })
    }

    return results
  },
}

export default upgradeService
