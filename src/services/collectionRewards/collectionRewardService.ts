// 図鑑報酬サービス
import { getSupabase } from '@/services/supabase/client'

export interface CollectionReward {
  id: string
  completion_percentage: number
  reward_type: string
  reward_amount: number
  badge_title: string
  badge_description: string
  badge_icon: string | null
  sort_order: number
}

export interface UnclaimedReward extends CollectionReward {
  current_completion: number
}

const ALL_REWARDS_TTL_MS = 1000 * 60 * 10
const USER_CACHE_TTL_MS = 1000 * 60 * 10

let allRewardsCache: CollectionReward[] | null = null
let allRewardsFetchedAt = 0

const unclaimedCacheByUser = new Map<string, { data: UnclaimedReward[]; fetchedAt: number }>()
const completionRateCacheByUser = new Map<string, { data: number; fetchedAt: number }>()

export const collectionRewardService = {
  invalidateUser(userId: string) {
    unclaimedCacheByUser.delete(userId)
    completionRateCacheByUser.delete(userId)
  },
  getCachedSnapshot(userId: string): {
    rewards: CollectionReward[] | null
    unclaimed: UnclaimedReward[] | null
    completionRate: number | null
  } {
    const now = Date.now()
    const rewards = (allRewardsCache && now - allRewardsFetchedAt < ALL_REWARDS_TTL_MS)
      ? allRewardsCache
      : null
    const unclaimed = (() => {
      const cached = unclaimedCacheByUser.get(userId)
      if (!cached) return null
      return now - cached.fetchedAt < USER_CACHE_TTL_MS ? cached.data : null
    })()
    const completionRate = (() => {
      const cached = completionRateCacheByUser.get(userId)
      if (!cached) return null
      return now - cached.fetchedAt < USER_CACHE_TTL_MS ? cached.data : null
    })()

    return { rewards, unclaimed, completionRate }
  },

  async prefetch(userId: string): Promise<void> {
    await Promise.all([
      this.getAllRewards(),
      this.getUnclaimedRewards(userId),
      this.getCompletionRate(userId),
    ])
  },

  // 未受取の報酬を取得
  async getUnclaimedRewards(userId: string): Promise<UnclaimedReward[]> {
    const now = Date.now()
    const cached = unclaimedCacheByUser.get(userId)
    if (cached && now - cached.fetchedAt < USER_CACHE_TTL_MS) {
      return cached.data
    }

    const supabase = getSupabase()
    const { data, error } = await supabase.rpc('get_unclaimed_collection_rewards', {
      p_user_id: userId
    })

    if (error) {
      console.error('[CollectionReward] Failed to get unclaimed rewards:', error)
      return []
    }

    // RPC関数の戻り値をUnclaimedReward型にマッピング
    const mapped = (data || []).map((item, index) => ({
      id: item.reward_id,
      completion_percentage: item.completion_percentage,
      reward_type: item.reward_type,
      reward_amount: item.reward_amount,
      badge_title: item.badge_title,
      badge_description: item.badge_description,
      badge_icon: item.badge_icon,
      sort_order: index,
      current_completion: item.current_completion
    }))
    unclaimedCacheByUser.set(userId, { data: mapped, fetchedAt: now })
    return mapped
  },

  // 図鑑達成率を取得
  async getCompletionRate(userId: string): Promise<number> {
    const now = Date.now()
    const cached = completionRateCacheByUser.get(userId)
    if (cached && now - cached.fetchedAt < USER_CACHE_TTL_MS) {
      return cached.data
    }
    const supabase = getSupabase()
    const { data } = await supabase.rpc('get_collection_completion_rate', {
      p_user_id: userId
    })
    const rate = data || 0
    completionRateCacheByUser.set(userId, { data: rate, fetchedAt: now })
    return rate
  },

  // 報酬を受け取る
  async claimReward(userId: string, rewardId: string): Promise<boolean> {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('user_collection_rewards' as any)
      .insert({
        user_id: userId,
        reward_id: rewardId
      })

    if (!error) {
      this.invalidateUser(userId)
    }
    return !error
  },

  // 全報酬を取得
  async getAllRewards(): Promise<CollectionReward[]> {
    const now = Date.now()
    if (allRewardsCache && now - allRewardsFetchedAt < ALL_REWARDS_TTL_MS) {
      return allRewardsCache
    }
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('collection_rewards' as any)
      .select('*')
      .order('sort_order')

    if (error) {
      console.error('[CollectionReward] Failed to get all rewards:', error)
      return []
    }

    const rewards = (data as any) || []
    allRewardsCache = rewards
    allRewardsFetchedAt = now
    return rewards
  }
}

export default collectionRewardService
