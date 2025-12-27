// デイリーミッションサービス
import { getSupabase } from '@/services/supabase/client'
import { progressService } from '@/services/progress'

// ローカル日付を YYYY-MM-DD 形式で取得（UTCではなくユーザーのタイムゾーン）
function getLocalDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export interface DailyMission {
  id: string
  title: string
  description: string
  type: string
  goal: number
  reward_type: string
  reward_amount: number
  difficulty: string
  is_active: boolean
}

export interface UserDailyMission {
  id: string
  user_id: string
  mission_id: string
  date: string
  progress: number
  is_completed: boolean
  completed_at: string | null
  claimed: boolean
  mission: DailyMission
}

export const dailyMissionService = {
  // 今日のミッション一覧を取得（なければ作成）
  async getTodayMissions(userId: string): Promise<UserDailyMission[]> {
    const supabase = getSupabase()
    const today = getLocalDateString()

    // 既存のミッションを取得
    const { data: existing } = await supabase
      .from('user_daily_missions' as any)
      .select(`
        *,
        mission:daily_missions(*)
      `)
      .eq('user_id', userId)
      .eq('date', today)

    if (existing && existing.length > 0) {
      return existing as unknown as UserDailyMission[]
    }

    // なければ今日のミッションを作成
    const { data: missions } = await supabase
      .from('daily_missions' as any)
      .select('*')
      .eq('is_active', true)

    if (!missions || missions.length === 0) return []

    // ユーザーミッションを作成
    const userMissions = (missions as unknown as DailyMission[]).map(m => ({
      user_id: userId,
      mission_id: m.id,
      date: today,
      progress: 0,
      is_completed: false,
      claimed: false
    }))

    const { error } = await supabase
      .from('user_daily_missions' as any)
      .upsert(userMissions, {
        onConflict: 'user_id,mission_id,date',
        ignoreDuplicates: true
      })

    if (error && error.code !== '23505') {
      console.error('[DailyMission] Failed to create missions:', error)
      return []
    }

    // 再度取得して返す
    const { data: refreshed } = await supabase
      .from('user_daily_missions' as any)
      .select(`
        *,
        mission:daily_missions(*)
      `)
      .eq('user_id', userId)
      .eq('date', today)

    return (refreshed as unknown as UserDailyMission[]) || []
  },

  // ミッション進捗を更新
  async updateProgress(
    userId: string,
    missionType: string,
    amount: number = 1
  ): Promise<boolean> {
    const supabase = getSupabase()
    const today = getLocalDateString()

    console.log('[DailyMission] updateProgress called:', { userId, missionType, amount, today })

    // まず今日のミッションを取得（なければ自動作成される）
    let missions = await this.getTodayMissions(userId)

    // ミッションがまだない場合は再度取得を試みる
    if (!missions || missions.length === 0) {
      console.log('[DailyMission] No missions found, retrying getTodayMissions...')
      missions = await this.getTodayMissions(userId)
    }

    if (!missions || missions.length === 0) {
      console.log('[DailyMission] Still no missions after retry')
      return false
    }

    // 対象のミッションを見つける
    const targetMission = missions.find(
      m => m.mission.type === missionType && !m.is_completed
    )

    if (!targetMission) {
      console.log('[DailyMission] Target mission not found or already completed:', missionType)
      return false
    }

    console.log('[DailyMission] Found target mission:', { id: targetMission.id, progress: targetMission.progress })

    const newProgress = targetMission.progress + amount
    const goal = targetMission.mission.goal
    const isCompleted = newProgress >= goal

    // 進捗を更新
    const updateData: { progress: number; is_completed?: boolean; completed_at?: string } = {
      progress: Math.min(newProgress, goal)
    }

    if (isCompleted && !targetMission.is_completed) {
      updateData.is_completed = true
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('user_daily_missions' as any)
      .update(updateData)
      .eq('id', targetMission.id)

    if (error) {
      console.error('[DailyMission] Failed to update progress:', error)
      return false
    }

    console.log('[DailyMission] Progress updated successfully:', { newProgress: updateData.progress, isCompleted })
    return true
  },

  // 報酬を受け取る
  async claimReward(userId: string, missionId: string): Promise<boolean> {
    const supabase = getSupabase()
    const today = getLocalDateString()

    // ミッションを取得
    const { data: mission } = await supabase
      .from('user_daily_missions' as any)
      .select(`
        *,
        mission:daily_missions(*)
      `)
      .eq('user_id', userId)
      .eq('mission_id', missionId)
      .eq('date', today)
      .single()

    const typedMission = mission as unknown as UserDailyMission
    if (!typedMission || !typedMission.is_completed || typedMission.claimed) {
      return false
    }

    // 報酬を受け取ったことを記録
    const { error: updateError } = await supabase
      .from('user_daily_missions' as any)
      .update({ claimed: true })
      .eq('id', typedMission.id)

    if (updateError) return false

    // 経験値報酬の場合はprogressServiceで追加
    if (typedMission.mission.reward_type === 'exp') {
      await progressService.addExp(userId, typedMission.mission.reward_amount)
    }

    return true
  },

  // 完了済み未受取ミッションの数を取得
  async getUnclaimedCount(userId: string): Promise<number> {
    const missions = await this.getTodayMissions(userId)
    return missions.filter(m => m.is_completed && !m.claimed).length
  }
}

export default dailyMissionService
