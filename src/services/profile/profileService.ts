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

  /**
   * 他ユーザーのプロフィール詳細を取得（フォロワー数等を含む）
   * 複数のクエリを並列実行して高速化
   */
  async getOtherUserProfile(userId: string, currentUserId?: string): Promise<OtherUserProfileData | null> {
    const supabase = getSupabase()
    const startTime = performance.now()

    // 全てのクエリを並列実行
    const [
      profileResult,
      followersResult,
      followingResult,
      followCheckResult,
      stickersResult,
    ] = await Promise.all([
      // プロフィール基本情報
      supabase.from('profiles').select('*').eq('id', userId).single(),
      // フォロワー数
      supabase.from('follows' as any).select('*', { count: 'exact', head: true }).eq('following_id', userId),
      // フォロー中数
      supabase.from('follows' as any).select('*', { count: 'exact', head: true }).eq('follower_id', userId),
      // 現在のユーザーがフォローしているかチェック
      currentUserId
        ? supabase.from('follows' as any).select('id').eq('follower_id', currentUserId).eq('following_id', userId).maybeSingle()
        : Promise.resolve({ data: null }),
      // 所持シール数（sticker_idでユニーク数も計算可能）
      supabase.from('user_stickers').select('sticker_id').eq('user_id', userId),
    ])

    const endTime = performance.now()
    console.log(`[ProfileService] getOtherUserProfile queries completed in ${(endTime - startTime).toFixed(0)}ms`)

    const { data: profile, error } = profileResult
    if (error || !profile) {
      console.error('[ProfileService] Get other user profile error:', error)
      return null
    }

    const followersCount = followersResult.count || 0
    const followingCount = followingResult.count || 0
    const isFollowing = !!followCheckResult.data

    // シール情報を処理
    const stickersData = stickersResult.data || []
    const totalStickers = stickersData.length
    const uniqueStickers = new Set(stickersData.map(s => s.sticker_id)).size

    const level = calculateLevel(profile.total_exp || 0)
    const title = getLevelTitle(level)

    return {
      id: profile.id,
      name: profile.display_name || profile.username || 'ゲスト',
      userCode: profile.user_code,
      avatarUrl: profile.avatar_url,
      level,
      title,
      bio: profile.bio || '',
      isFollowing,
      stats: {
        totalStickers: totalStickers || profile.total_stickers || 0,
        uniqueStickers,
        completedSeries: 0, // TODO: シリーズコンプリート計算
        followersCount,
        followingCount,
      },
    }
  },

  /**
   * ユーザーコード（6桁）で検索
   */
  async searchByUserCode(userCode: string): Promise<ProfileData | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_code', userCode)
      .single()

    if (error || !data) {
      console.log('[ProfileService] User not found by code:', userCode)
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
   * フォロー/アンフォロー
   */
  async toggleFollow(followerId: string, followingId: string): Promise<boolean> {
    const supabase = getSupabase()

    // 既存のフォロー関係をチェック
    const { data: existing } = await supabase
      .from('follows' as any)
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle()

    const existingFollow = existing as { id: string } | null

    if (existingFollow) {
      // アンフォロー
      const { error } = await supabase
        .from('follows' as any)
        .delete()
        .eq('id', existingFollow.id)

      if (error) {
        console.error('[ProfileService] Unfollow error:', error)
        return false
      }
      console.log('[ProfileService] Unfollowed:', followingId)
    } else {
      // フォロー
      const { error } = await supabase
        .from('follows' as any)
        .insert({
          follower_id: followerId,
          following_id: followingId,
        })

      if (error) {
        console.error('[ProfileService] Follow error:', error)
        return false
      }
      console.log('[ProfileService] Followed:', followingId)
    }

    return true
  },

  /**
   * フォロワー数とフォロー数を取得
   */
  async getFollowCounts(userId: string): Promise<{ followersCount: number; followingCount: number }> {
    const supabase = getSupabase()

    const [followersResult, followingResult] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
    ])

    return {
      followersCount: followersResult.count || 0,
      followingCount: followingResult.count || 0,
    }
  },

  /**
   * フォロー状態を確認（フォロー中/相互フォロー/未フォロー）
   */
  async getFollowStatus(currentUserId: string, targetUserId: string): Promise<'none' | 'following' | 'mutual'> {
    const supabase = getSupabase()

    const [iFollowThem, theyFollowMe] = await Promise.all([
      supabase.from('follows').select('id').eq('follower_id', currentUserId).eq('following_id', targetUserId).maybeSingle(),
      supabase.from('follows').select('id').eq('follower_id', targetUserId).eq('following_id', currentUserId).maybeSingle(),
    ])

    if (iFollowThem.data && theyFollowMe.data) {
      return 'mutual' // 相互フォロー（フレンド）
    } else if (iFollowThem.data) {
      return 'following' // フォロー中
    }
    return 'none' // 未フォロー
  },

  /**
   * 複数ユーザーのフォロー状態を一括取得
   */
  async getFollowStatusBatch(currentUserId: string, targetUserIds: string[]): Promise<Record<string, 'none' | 'following' | 'mutual'>> {
    if (targetUserIds.length === 0) return {}

    const supabase = getSupabase()

    const [iFollowThemResult, theyFollowMeResult] = await Promise.all([
      supabase.from('follows').select('following_id').eq('follower_id', currentUserId).in('following_id', targetUserIds),
      supabase.from('follows').select('follower_id').eq('following_id', currentUserId).in('follower_id', targetUserIds),
    ])

    const iFollowSet = new Set((iFollowThemResult.data || []).map(r => r.following_id))
    const theyFollowSet = new Set((theyFollowMeResult.data || []).map(r => r.follower_id))

    const result: Record<string, 'none' | 'following' | 'mutual'> = {}
    for (const userId of targetUserIds) {
      if (iFollowSet.has(userId) && theyFollowSet.has(userId)) {
        result[userId] = 'mutual'
      } else if (iFollowSet.has(userId)) {
        result[userId] = 'following'
      } else {
        result[userId] = 'none'
      }
    }

    return result
  },

  /**
   * フォロワー一覧を取得（プロフィール情報付き）
   */
  async getFollowers(userId: string, currentUserId?: string): Promise<FollowUserData[]> {
    const supabase = getSupabase()

    // フォロワーのユーザーID一覧を取得
    const { data: followsData, error: followsError } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('following_id', userId)

    if (followsError || !followsData || followsData.length === 0) {
      console.log('[ProfileService] No followers found or error:', followsError)
      return []
    }

    const followerIds = followsData.map(f => f.follower_id)

    // フォロワーのプロフィール情報を取得
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name, username, avatar_url, total_exp')
      .in('id', followerIds)

    if (profilesError || !profiles) {
      console.error('[ProfileService] Get follower profiles error:', profilesError)
      return []
    }

    // 現在のユーザーがフォローしているかチェック（バッチ）
    let followStatusMap: Record<string, 'none' | 'following' | 'mutual'> = {}
    if (currentUserId) {
      followStatusMap = await this.getFollowStatusBatch(currentUserId, followerIds)
    }

    return profiles.map(profile => {
      const level = calculateLevel(profile.total_exp || 0)
      return {
        id: profile.id,
        name: profile.display_name || profile.username || 'ゲスト',
        avatarUrl: profile.avatar_url,
        level,
        title: getLevelTitle(level),
        isFollowing: followStatusMap[profile.id] === 'following' || followStatusMap[profile.id] === 'mutual',
      }
    })
  },

  /**
   * フォロー中一覧を取得（プロフィール情報付き）
   */
  async getFollowing(userId: string, currentUserId?: string): Promise<FollowUserData[]> {
    const supabase = getSupabase()

    // フォロー中のユーザーID一覧を取得
    const { data: followsData, error: followsError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId)

    if (followsError || !followsData || followsData.length === 0) {
      console.log('[ProfileService] No following found or error:', followsError)
      return []
    }

    const followingIds = followsData.map(f => f.following_id)

    // フォロー中ユーザーのプロフィール情報を取得
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, display_name, username, avatar_url, total_exp')
      .in('id', followingIds)

    if (profilesError || !profiles) {
      console.error('[ProfileService] Get following profiles error:', profilesError)
      return []
    }

    // 現在のユーザーがフォローしているかチェック（バッチ）
    // 自分のフォロー一覧なので、全員フォロー中
    let followStatusMap: Record<string, 'none' | 'following' | 'mutual'> = {}
    if (currentUserId) {
      followStatusMap = await this.getFollowStatusBatch(currentUserId, followingIds)
    }

    return profiles.map(profile => {
      const level = calculateLevel(profile.total_exp || 0)
      // 自分のフォロー一覧の場合は全員フォロー中
      const isOwnList = userId === currentUserId
      return {
        id: profile.id,
        name: profile.display_name || profile.username || 'ゲスト',
        avatarUrl: profile.avatar_url,
        level,
        title: getLevelTitle(level),
        isFollowing: isOwnList ? true : (followStatusMap[profile.id] === 'following' || followStatusMap[profile.id] === 'mutual'),
      }
    })
  },
}

// フォローユーザーデータ型（一覧表示用）
export interface FollowUserData {
  id: string
  name: string
  avatarUrl: string | null
  level: number
  title: string
  isFollowing: boolean
}

// 他ユーザープロフィールデータ型
export interface OtherUserProfileData {
  id: string
  name: string
  userCode: string | null
  avatarUrl: string | null
  level: number
  title: string
  bio: string
  isFollowing: boolean
  stats: {
    totalStickers: number
    uniqueStickers: number
    completedSeries: number
    followersCount: number
    followingCount: number
  }
}

// ==============================================
// 通貨管理システム
// ローカル名: tickets/gems/stars ⇔ DB名: silchike/preshiru/drops
// ==============================================

export type CurrencyType = 'silchike' | 'preshiru' | 'drops'
export type LocalCurrencyType = 'tickets' | 'gems' | 'stars'

// ローカル名 → DB名 マッピング
export const CURRENCY_MAP: Record<LocalCurrencyType, CurrencyType> = {
  tickets: 'silchike',
  gems: 'preshiru',
  stars: 'drops',
}

// DB名 → ローカル名 マッピング
export const CURRENCY_REVERSE_MAP: Record<CurrencyType, LocalCurrencyType> = {
  silchike: 'tickets',
  preshiru: 'gems',
  drops: 'stars',
}

// 通貨データ型
export interface CurrencyData {
  silchike: number
  preshiru: number
  drops: number
}

// ローカル形式の通貨データ
export interface LocalCurrencyData {
  tickets: number
  gems: number
  stars: number
}

export const currencyService = {
  /**
   * ユーザーの通貨を取得
   */
  async getCurrency(userId: string): Promise<CurrencyData | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('profiles')
      .select('silchike, preshiru, drops')
      .eq('id', userId)
      .single()

    if (error || !data) {
      console.error('[CurrencyService] Get currency error:', error)
      return null
    }

    return {
      silchike: data.silchike ?? 10,
      preshiru: data.preshiru ?? 0,
      drops: data.drops ?? 0,
    }
  },

  /**
   * ユーザーの通貨をローカル形式で取得
   */
  async getCurrencyLocal(userId: string): Promise<LocalCurrencyData | null> {
    const currency = await this.getCurrency(userId)
    if (!currency) return null

    return {
      tickets: currency.silchike,
      gems: currency.preshiru,
      stars: currency.drops,
    }
  },

  /**
   * 通貨を更新（絶対値で設定）
   */
  async setCurrency(userId: string, currency: Partial<CurrencyData>): Promise<boolean> {
    const supabase = getSupabase()

    const updateData: Record<string, number> = {}
    if (currency.silchike !== undefined) updateData.silchike = currency.silchike
    if (currency.preshiru !== undefined) updateData.preshiru = currency.preshiru
    if (currency.drops !== undefined) updateData.drops = currency.drops

    if (Object.keys(updateData).length === 0) return true

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)

    if (error) {
      console.error('[CurrencyService] Set currency error:', error)
      return false
    }

    console.log('[CurrencyService] Currency updated:', updateData)
    return true
  },

  /**
   * ローカル形式で通貨を更新
   */
  async setCurrencyLocal(userId: string, currency: Partial<LocalCurrencyData>): Promise<boolean> {
    const dbCurrency: Partial<CurrencyData> = {}
    if (currency.tickets !== undefined) dbCurrency.silchike = currency.tickets
    if (currency.gems !== undefined) dbCurrency.preshiru = currency.gems
    if (currency.stars !== undefined) dbCurrency.drops = currency.stars

    return this.setCurrency(userId, dbCurrency)
  },

  /**
   * 通貨を加算
   */
  async addCurrency(
    userId: string,
    currencyType: CurrencyType,
    amount: number
  ): Promise<{ success: boolean; newAmount: number }> {
    const supabase = getSupabase()

    // 現在値を取得
    const current = await this.getCurrency(userId)
    if (!current) {
      return { success: false, newAmount: 0 }
    }

    const newAmount = current[currencyType] + amount

    const { error } = await supabase
      .from('profiles')
      .update({ [currencyType]: newAmount })
      .eq('id', userId)

    if (error) {
      console.error('[CurrencyService] Add currency error:', error)
      return { success: false, newAmount: current[currencyType] }
    }

    console.log(`[CurrencyService] Added ${amount} ${currencyType}, new amount: ${newAmount}`)
    return { success: true, newAmount }
  },

  /**
   * ローカル名で通貨を加算
   */
  async addCurrencyLocal(
    userId: string,
    currencyType: LocalCurrencyType,
    amount: number
  ): Promise<{ success: boolean; newAmount: number }> {
    return this.addCurrency(userId, CURRENCY_MAP[currencyType], amount)
  },

  /**
   * 通貨を消費（減算）
   * 残高不足の場合は失敗
   */
  async deductCurrency(
    userId: string,
    currencyType: CurrencyType,
    amount: number
  ): Promise<{ success: boolean; newAmount: number; insufficientFunds: boolean }> {
    const supabase = getSupabase()

    // 現在値を取得
    const current = await this.getCurrency(userId)
    if (!current) {
      return { success: false, newAmount: 0, insufficientFunds: false }
    }

    const currentAmount = current[currencyType]
    if (currentAmount < amount) {
      console.log(`[CurrencyService] Insufficient ${currencyType}: have ${currentAmount}, need ${amount}`)
      return { success: false, newAmount: currentAmount, insufficientFunds: true }
    }

    const newAmount = currentAmount - amount

    const { error } = await supabase
      .from('profiles')
      .update({ [currencyType]: newAmount })
      .eq('id', userId)

    if (error) {
      console.error('[CurrencyService] Deduct currency error:', error)
      return { success: false, newAmount: currentAmount, insufficientFunds: false }
    }

    console.log(`[CurrencyService] Deducted ${amount} ${currencyType}, new amount: ${newAmount}`)
    return { success: true, newAmount, insufficientFunds: false }
  },

  /**
   * ローカル名で通貨を消費
   */
  async deductCurrencyLocal(
    userId: string,
    currencyType: LocalCurrencyType,
    amount: number
  ): Promise<{ success: boolean; newAmount: number; insufficientFunds: boolean }> {
    return this.deductCurrency(userId, CURRENCY_MAP[currencyType], amount)
  },

  /**
   * ガチャ用：チケットまたはどろっぷを消費
   * チケット不足の場合はどろっぷで代替可能か情報を返す
   */
  async deductForGacha(
    userId: string,
    ticketCost: number,
    dropCost: number,
    useDrops: boolean = false
  ): Promise<{
    success: boolean
    usedCurrency: 'tickets' | 'drops'
    amountUsed: number
    canUseDropsInstead: boolean
    dropsRequired: number
  }> {
    const current = await this.getCurrency(userId)
    if (!current) {
      return {
        success: false,
        usedCurrency: 'tickets',
        amountUsed: 0,
        canUseDropsInstead: false,
        dropsRequired: dropCost,
      }
    }

    // どろっぷを使用する場合
    if (useDrops) {
      const result = await this.deductCurrency(userId, 'drops', dropCost)
      return {
        success: result.success,
        usedCurrency: 'drops',
        amountUsed: dropCost,
        canUseDropsInstead: false,
        dropsRequired: 0,
      }
    }

    // チケットで支払う場合
    if (current.silchike >= ticketCost) {
      const result = await this.deductCurrency(userId, 'silchike', ticketCost)
      return {
        success: result.success,
        usedCurrency: 'tickets',
        amountUsed: ticketCost,
        canUseDropsInstead: false,
        dropsRequired: 0,
      }
    }

    // チケット不足 → どろっぷで代替可能か確認
    const canUseDrops = current.drops >= dropCost
    return {
      success: false,
      usedCurrency: 'tickets',
      amountUsed: 0,
      canUseDropsInstead: canUseDrops,
      dropsRequired: dropCost,
    }
  },

  /**
   * プレシル（gems）用：ガチャ消費
   */
  async deductGemsForGacha(
    userId: string,
    gemCost: number,
    dropCost: number,
    useDrops: boolean = false
  ): Promise<{
    success: boolean
    usedCurrency: 'gems' | 'drops'
    amountUsed: number
    canUseDropsInstead: boolean
    dropsRequired: number
  }> {
    const current = await this.getCurrency(userId)
    if (!current) {
      return {
        success: false,
        usedCurrency: 'gems',
        amountUsed: 0,
        canUseDropsInstead: false,
        dropsRequired: dropCost,
      }
    }

    // どろっぷを使用する場合
    if (useDrops) {
      const result = await this.deductCurrency(userId, 'drops', dropCost)
      return {
        success: result.success,
        usedCurrency: 'drops',
        amountUsed: dropCost,
        canUseDropsInstead: false,
        dropsRequired: 0,
      }
    }

    // プレシルで支払う場合
    if (current.preshiru >= gemCost) {
      const result = await this.deductCurrency(userId, 'preshiru', gemCost)
      return {
        success: result.success,
        usedCurrency: 'gems',
        amountUsed: gemCost,
        canUseDropsInstead: false,
        dropsRequired: 0,
      }
    }

    // プレシル不足 → どろっぷで代替可能か確認
    const canUseDrops = current.drops >= dropCost
    return {
      success: false,
      usedCurrency: 'gems',
      amountUsed: 0,
      canUseDropsInstead: canUseDrops,
      dropsRequired: dropCost,
    }
  },

  /**
   * デイリーボーナスの通貨を付与
   */
  async grantDailyBonus(
    userId: string,
    ticketAmount: number,
    dropAmount: number
  ): Promise<{ success: boolean; newTickets: number; newDrops: number }> {
    const current = await this.getCurrency(userId)
    if (!current) {
      return { success: false, newTickets: 0, newDrops: 0 }
    }

    const newTickets = current.silchike + ticketAmount
    const newDrops = current.drops + dropAmount

    const success = await this.setCurrency(userId, {
      silchike: newTickets,
      drops: newDrops,
    })

    if (success) {
      console.log(`[CurrencyService] Daily bonus granted: +${ticketAmount} tickets, +${dropAmount} drops`)
    }

    return { success, newTickets, newDrops }
  },
}

// ==============================================
// ユーザー統計取得（Supabase RPC）
// ==============================================

export interface UserStatsFromDB {
  totalTrades: number
  successfulTrades: number
  friendsCount: number
  followersCount: number
  followingCount: number
  reactionsReceived: number
  postsCount: number
  loginDays: number
  completedSeries: number
  totalStickers: number
  uniqueStickers: number
  prismStickers: number
  gachaPulls: number
  mysteryPostsSent: number
  mysteryPostsReceived: number
}

export const statsService = {
  /**
   * ユーザーの統計情報をSupabaseから取得
   */
  async getUserStats(userId: string): Promise<UserStatsFromDB | null> {
    // 空のuserIdの場合は即座にnullを返す
    if (!userId || userId.trim() === '') {
      return null
    }

    const supabase = getSupabase()

    try {
      const { data, error } = await supabase.rpc('get_user_stats', {
        p_user_id: userId,
      })

      if (error) {
        // RPC関数が未実装の場合やカラム不足はサイレントに処理
        return null
      }

      if (!data) {
        return null
      }

      const result = data as Record<string, unknown>
      return {
        totalTrades: (result.total_trades as number) || 0,
        successfulTrades: (result.successful_trades as number) || 0,
        friendsCount: (result.friends_count as number) || 0,
        followersCount: (result.followers_count as number) || 0,
        followingCount: (result.following_count as number) || 0,
        reactionsReceived: (result.reactions_received as number) || 0,
        postsCount: (result.posts_count as number) || 0,
        loginDays: (result.login_days as number) || 1,
        completedSeries: (result.completed_series as number) || 0,
        totalStickers: (result.total_stickers as number) || 0,
        uniqueStickers: (result.unique_stickers as number) || 0,
        prismStickers: (result.prism_stickers as number) || 0,
        gachaPulls: (result.gacha_pulls as number) || 0,
        mysteryPostsSent: (result.mystery_posts_sent as number) || 0,
        mysteryPostsReceived: (result.mystery_posts_received as number) || 0,
      }
    } catch (err) {
      console.error('[StatsService] Exception getting user stats:', err)
      return null
    }
  },

  /**
   * デイリーミッション進捗を更新
   */
  async updateMissionProgress(
    userId: string,
    missionType: string,
    increment: number = 1
  ): Promise<boolean> {
    const supabase = getSupabase()

    try {
      const { error } = await supabase.rpc('update_daily_mission_progress', {
        p_user_id: userId,
        p_mission_type: missionType,
        p_increment: increment,
      })

      if (error) {
        console.error('[StatsService] Update mission progress error:', error)
        return false
      }

      console.log(`[StatsService] Mission progress updated: ${missionType} +${increment}`)
      return true
    } catch (err) {
      console.error('[StatsService] Exception updating mission progress:', err)
      return false
    }
  },

  /**
   * ガチャ回数を記録（ミッション進捗も更新）
   */
  async recordGachaPull(userId: string, pullCount: number = 1): Promise<boolean> {
    const supabase = getSupabase()

    try {
      const { error } = await supabase.rpc('record_gacha_pull', {
        p_user_id: userId,
        p_pull_count: pullCount,
      })

      if (error) {
        console.error('[StatsService] Record gacha pull error:', error)
        return false
      }

      console.log(`[StatsService] Gacha pull recorded: ${pullCount}`)
      return true
    } catch (err) {
      console.error('[StatsService] Exception recording gacha pull:', err)
      return false
    }
  },

  /**
   * タイムライン投稿を記録（ミッション進捗更新）
   */
  async recordTimelinePost(userId: string): Promise<boolean> {
    const supabase = getSupabase()

    try {
      const { error } = await supabase.rpc('record_timeline_post', {
        p_user_id: userId,
      })

      if (error) {
        console.error('[StatsService] Record timeline post error:', error)
        return false
      }

      console.log('[StatsService] Timeline post recorded')
      return true
    } catch (err) {
      console.error('[StatsService] Exception recording timeline post:', err)
      return false
    }
  },

  /**
   * いいねを記録（ミッション進捗更新）
   */
  async recordReaction(userId: string): Promise<boolean> {
    const supabase = getSupabase()

    try {
      const { error } = await supabase.rpc('record_reaction', {
        p_user_id: userId,
      })

      if (error) {
        console.error('[StatsService] Record reaction error:', error)
        return false
      }

      console.log('[StatsService] Reaction recorded')
      return true
    } catch (err) {
      console.error('[StatsService] Exception recording reaction:', err)
      return false
    }
  },

  /**
   * シール帳保存を記録（ミッション進捗更新）
   */
  async recordStickerBookSave(userId: string): Promise<boolean> {
    const supabase = getSupabase()

    try {
      const { error } = await supabase.rpc('record_sticker_book_save', {
        p_user_id: userId,
      })

      if (error) {
        console.error('[StatsService] Record sticker book save error:', error)
        return false
      }

      console.log('[StatsService] Sticker book save recorded')
      return true
    } catch (err) {
      console.error('[StatsService] Exception recording sticker book save:', err)
      return false
    }
  },

  /**
   * 交換完了を記録（ミッション進捗更新）
   */
  async recordTradeComplete(userId: string): Promise<boolean> {
    const supabase = getSupabase()

    try {
      const { error } = await supabase.rpc('record_trade_complete', {
        p_user_id: userId,
      })

      if (error) {
        console.error('[StatsService] Record trade complete error:', error)
        return false
      }

      console.log('[StatsService] Trade complete recorded')
      return true
    } catch (err) {
      console.error('[StatsService] Exception recording trade complete:', err)
      return false
    }
  },

  /**
   * デイリーログインを記録
   */
  async recordDailyLogin(userId: string): Promise<{ success: boolean; loginStreak: number; alreadyLoggedIn: boolean }> {
    const supabase = getSupabase()

    try {
      const { data, error } = await supabase.rpc('record_daily_login', {
        p_user_id: userId,
      })

      if (error) {
        console.error('[StatsService] Record daily login error:', error)
        return { success: false, loginStreak: 0, alreadyLoggedIn: false }
      }

      const result = data as Record<string, unknown>
      return {
        success: (result.success as boolean) || false,
        loginStreak: (result.login_streak as number) || 0,
        alreadyLoggedIn: (result.already_logged_in as boolean) || false,
      }
    } catch (err) {
      console.error('[StatsService] Exception recording daily login:', err)
      return { success: false, loginStreak: 0, alreadyLoggedIn: false }
    }
  },

  /**
   * 経験値を追加（Supabase経由）
   */
  async addExp(
    userId: string,
    expAmount: number,
    actionType: string = 'other'
  ): Promise<{ success: boolean; levelUp: boolean; oldLevel: number; newLevel: number } | null> {
    const supabase = getSupabase()

    try {
      const { data, error } = await supabase.rpc('add_user_exp', {
        p_user_id: userId,
        p_exp_amount: expAmount,
        p_action_type: actionType,
      })

      if (error) {
        console.error('[StatsService] Add exp error:', error)
        return null
      }

      const result = data as Record<string, unknown>
      return {
        success: (result.success as boolean) || false,
        levelUp: (result.level_up as boolean) || false,
        oldLevel: (result.old_level as number) || 1,
        newLevel: (result.new_level as number) || 1,
      }
    } catch (err) {
      console.error('[StatsService] Exception adding exp:', err)
      return null
    }
  },
}

export default profileService
