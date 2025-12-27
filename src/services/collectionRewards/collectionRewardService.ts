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

export const collectionRewardService = {
  // 未受取の報酬を取得
  async getUnclaimedRewards(userId: string): Promise<UnclaimedReward[]> {
    const supabase = getSupabase()
    const { data, error } = await supabase.rpc('get_unclaimed_collection_rewards', {
      p_user_id: userId
    })

    if (error) {
      console.error('[CollectionReward] Failed to get unclaimed rewards:', error)
      return []
    }

    // RPC関数の戻り値をUnclaimedReward型にマッピング
    return (data || []).map((item, index) => ({
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
  },

  // 図鑑達成率を取得
  async getCompletionRate(userId: string): Promise<number> {
    const supabase = getSupabase()
    const { data } = await supabase.rpc('get_collection_completion_rate', {
      p_user_id: userId
    })
    return data || 0
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

    return !error
  },

  // 全報酬を取得
  async getAllRewards(): Promise<CollectionReward[]> {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('collection_rewards' as any)
      .select('*')
      .order('sort_order')

    if (error) {
      console.error('[CollectionReward] Failed to get all rewards:', error)
      return []
    }

    return (data as any) || []
  }
}

export default collectionRewardService
