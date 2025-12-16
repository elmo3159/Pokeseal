// プロフィールサービス - Supabaseでプロフィール・経験値を管理
import { getSupabase } from '@/services/supabase'
import { calculateLevel, getLevelTitle } from '@/domain/levelSystem'


// プロフィールデータ型
export interface ProfileData {
  id: string
  username: string | null // 匿名ユーザーはnull
  userCode: string | null // 6桁ユーザーコード
  displayName: string
  avatarUrl: string | null
  bio: string | null
  totalExp: number
  starPoints: number
  totalStickers: number
  totalTrades: number
  tutorialCompleted: boolean
}

// プロフィール更新データ
export interface ProfileUpdateData {
  displayName?: string
  avatarUrl?: string | null
  bio?: string | null
}

// 経験値追加結果
export interface AddExpResult {
  newTotalExp: number
  oldLevel: number
  newLevel: number
  leveledUp: boolean
}

export const profileService = {
  /**
   * ユーザーのプロフィールを取得
   */
  async getProfile(userId: string): Promise<ProfileData | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) {
      console.error('[ProfileService] Get profile error:', error)
      return null
    }

    return {
      id: data.id,
      username: data.username,
      userCode: data.user_code,
      displayName: data.display_name || data.username || 'ゲスト',
      avatarUrl: data.avatar_url,
      bio: data.bio,
      totalExp: data.total_exp || 0,
      starPoints: data.star_points || 0,
      totalStickers: data.total_stickers || 0,
      totalTrades: data.total_trades || 0,
      tutorialCompleted: data.tutorial_completed || false,
    }
  },

  /**
   * プロフィールを更新
   */
  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<boolean> {
    const supabase = getSupabase()

    const updateData: Record<string, unknown> = {}
    if (updates.displayName !== undefined) updateData.display_name = updates.displayName
    if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl
    if (updates.bio !== undefined) updateData.bio = updates.bio

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)

    if (error) {
      console.error('[ProfileService] Update profile error:', error)
      return false
    }

    console.log('[ProfileService] Profile updated:', userId)
    return true
  },

  /**
   * 経験値を追加してレベルアップを処理
   */
  async addExp(userId: string, expAmount: number): Promise<AddExpResult | null> {
    const supabase = getSupabase()

    // 現在の経験値を取得
    const { data: profile, error: getError } = await supabase
      .from('profiles')
      .select('total_exp')
      .eq('id', userId)
      .single()

    if (getError || !profile) {
      console.error('[ProfileService] Get exp error:', getError)
      return null
    }

    const currentExp = profile.total_exp || 0
    const newTotalExp = currentExp + expAmount
    const oldLevel = calculateLevel(currentExp)
    const newLevel = calculateLevel(newTotalExp)

    // 経験値を更新
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ total_exp: newTotalExp })
      .eq('id', userId)

    if (updateError) {
      console.error('[ProfileService] Update exp error:', updateError)
      return null
    }

    console.log('[ProfileService] Exp added:', expAmount, 'New total:', newTotalExp, 'Level:', newLevel)

    return {
      newTotalExp,
      oldLevel,
      newLevel,
      leveledUp: newLevel > oldLevel,
    }
  },

  /**
   * 経験値を直接設定（データ移行・リセット用）
   */
  async setExp(userId: string, totalExp: number): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('profiles')
      .update({ total_exp: totalExp })
      .eq('id', userId)

    if (error) {
      console.error('[ProfileService] Set exp error:', error)
      return false
    }

    console.log('[ProfileService] Exp set to:', totalExp)
    return true
  },

  /**
   * 交換回数をインクリメント
   */
  async incrementTradeCount(userId: string): Promise<boolean> {
    const supabase = getSupabase()

    // まず現在の値を取得
    const { data: profile, error: getError } = await supabase
      .from('profiles')
      .select('total_trades')
      .eq('id', userId)
      .single()

    if (getError || !profile) {
      console.error('[ProfileService] Get trade count error:', getError)
      return false
    }

    // インクリメント
    const { error } = await supabase
      .from('profiles')
      .update({ total_trades: (profile.total_trades || 0) + 1 })
      .eq('id', userId)

    if (error) {
      console.error('[ProfileService] Increment trade count error:', error)
      return false
    }

    return true
  },

  /**
   * シール総数を更新
   */
  async updateStickerCount(userId: string, count: number): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('profiles')
      .update({ total_stickers: count })
      .eq('id', userId)

    if (error) {
      console.error('[ProfileService] Update sticker count error:', error)
      return false
    }

    return true
  },

  /**
   * チュートリアル完了フラグを更新
   */
  async setTutorialCompleted(userId: string, completed: boolean): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('profiles')
      .update({ tutorial_completed: completed })
      .eq('id', userId)

    if (error) {
      console.error('[ProfileService] Set tutorial completed error:', error)
      return false
    }

    return true
  },

  /**
   * プロフィールの存在確認・なければ作成
   * @param username オプショナル（匿名ユーザーはnull可）
   */
  async ensureProfile(userId: string, username?: string | null): Promise<ProfileData | null> {
    const supabase = getSupabase()

    // 既存プロフィールを確認
    const existing = await this.getProfile(userId)
    if (existing) {
      return existing
    }

    // 新規作成（user_codeはトリガーで自動生成）
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: username || null,
        display_name: username || 'ゲスト',
        total_exp: 0,
        star_points: 0,
        total_stickers: 0,
        total_trades: 0,
        tutorial_completed: false,
      })
      .select()
      .single()

    if (error || !data) {
      console.error('[ProfileService] Create profile error:', error)
      return null
    }

    return this.getProfile(userId)
  },
}

export default profileService
