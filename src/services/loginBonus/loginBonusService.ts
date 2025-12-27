// ログインボーナスサービス
import { getSupabase } from '@/services/supabase/client'

export interface LoginBonus {
  id: string
  user_id: string
  login_date: string
  consecutive_days: number
  reward_day: number
  reward_type: string
  reward_amount: number
  reward_description: string | null
  claimed: boolean
  claimed_at: string | null
}

export const loginBonusService = {
  // 今日のログインボーナスを取得（なければ作成）
  async getTodayBonus(userId: string): Promise<LoginBonus | null> {
    const supabase = getSupabase()
    const today = new Date().toISOString().split('T')[0]

    // 既存のボーナスを確認
    const { data: existing } = await supabase
      .from('login_bonus_history' as any)
      .select('*')
      .eq('user_id', userId)
      .eq('login_date', today)
      .single()

    if (existing) {
      return existing as unknown as LoginBonus
    }

    // 連続日数を計算
    const { data: consecutiveDays } = await (supabase.rpc as any)(
      'calculate_consecutive_days',
      { p_user_id: userId }
    )

    if (consecutiveDays === null) return null

    const rewardDay = consecutiveDays
    const { data: rewardInfo } = await (supabase.rpc as any)('get_login_bonus_reward', {
      day: rewardDay
    })

    if (!rewardInfo || rewardInfo.length === 0) return null

    const reward = rewardInfo[0]

    // 新しいボーナスを作成（重複を無視）
    const { error } = await supabase
      .from('login_bonus_history' as any)
      .upsert({
        user_id: userId,
        login_date: today,
        consecutive_days: consecutiveDays,
        reward_day: rewardDay,
        reward_type: reward.reward_type,
        reward_amount: reward.reward_amount,
        reward_description: reward.reward_description,
        claimed: false
      }, {
        onConflict: 'user_id,login_date',
        ignoreDuplicates: true
      })

    if (error && error.code !== '23505') {
      console.error('[LoginBonus] Failed to create bonus:', error)
      return null
    }

    // 再度取得して返す
    const { data: refreshed } = await supabase
      .from('login_bonus_history' as any)
      .select('*')
      .eq('user_id', userId)
      .eq('login_date', today)
      .single()

    return refreshed as unknown as LoginBonus
  },

  // ボーナスを受け取る
  async claimBonus(userId: string): Promise<boolean> {
    const supabase = getSupabase()
    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase
      .from('login_bonus_history' as any)
      .update({
        claimed: true,
        claimed_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('login_date', today)
      .eq('claimed', false)

    return !error
  },

  // 連続ログイン日数を取得
  async getConsecutiveDays(userId: string): Promise<number> {
    const supabase = getSupabase()
    const { data } = await (supabase.rpc as any)('calculate_consecutive_days', {
      p_user_id: userId
    })
    return data || 1
  }
}

export default loginBonusService
