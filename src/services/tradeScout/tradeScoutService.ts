// トレードスカウトサービス - Supabaseで欲しいシール・出せるシール登録とマッチングを管理
import { getSupabase } from '@/services/supabase'


// スカウトシール（欲しい/出せる）
export interface ScoutStickerData {
  stickerId: string
  priority?: number // 欲しいシールの場合の優先度（1-5）
  userStickerId?: string // 出せるシールの場合のuser_stickers.id
}

// スカウト設定
export interface ScoutSettings {
  wantList: ScoutStickerData[]
  offerList: ScoutStickerData[]
  isActive: boolean
  notifyOnMatch: boolean
  updatedAt: string
}

// マッチ結果
export interface ScoutMatchData {
  id: string
  matchedUserId: string
  matchedUserName: string
  matchScore: number
  wantsMatched: string[] // マッチした欲しいシールID
  offersMatched: string[] // マッチした出せるシールID
  status: 'found' | 'notified' | 'viewed' | 'trade_started' | 'expired'
  tradeId: string | null
  matchedAt: string
  expiresAt: string
}

export const tradeScoutService = {
  /**
   * スカウト設定を取得
   */
  async getSettings(userId: string): Promise<ScoutSettings | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trade_scout_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // 設定がない場合はnullを返す（エラーではない）
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('[TradeScout] Get settings error:', error)
      return null
    }

    return {
      wantList: (data.want_list || []) as unknown as ScoutStickerData[],
      offerList: (data.offer_list || []) as unknown as ScoutStickerData[],
      isActive: data.is_active ?? false,
      notifyOnMatch: data.notify_on_match ?? true,
      updatedAt: data.updated_at || new Date().toISOString(),
    }
  },

  /**
   * スカウト設定を保存（upsert）
   */
  async saveSettings(userId: string, settings: Partial<ScoutSettings>): Promise<boolean> {
    const supabase = getSupabase()

    const updateData: Record<string, unknown> = {}
    if (settings.wantList !== undefined) updateData.want_list = settings.wantList
    if (settings.offerList !== undefined) updateData.offer_list = settings.offerList
    if (settings.isActive !== undefined) updateData.is_active = settings.isActive
    if (settings.notifyOnMatch !== undefined) updateData.notify_on_match = settings.notifyOnMatch

    const { error } = await supabase
      .from('trade_scout_settings')
      .upsert({
        user_id: userId,
        ...updateData,
      }, {
        onConflict: 'user_id',
      })

    if (error) {
      console.error('[TradeScout] Save settings error:', error)
      return false
    }

    console.log('[TradeScout] Settings saved for user:', userId)
    return true
  },

  /**
   * 欲しいシールリストを更新
   */
  async updateWantList(userId: string, wantList: ScoutStickerData[]): Promise<boolean> {
    return this.saveSettings(userId, { wantList })
  },

  /**
   * 出せるシールリストを更新
   */
  async updateOfferList(userId: string, offerList: ScoutStickerData[]): Promise<boolean> {
    return this.saveSettings(userId, { offerList })
  },

  /**
   * スカウト有効/無効を切り替え
   */
  async setActive(userId: string, isActive: boolean): Promise<boolean> {
    return this.saveSettings(userId, { isActive })
  },

  /**
   * マッチング検索を実行
   */
  async findMatches(userId: string): Promise<ScoutMatchData[]> {
    const supabase = getSupabase()

    // PostgreSQL関数を呼び出し
    const { data, error } = await supabase.rpc('find_scout_matches', {
      p_user_id: userId,
    })

    if (error) {
      console.error('[TradeScout] Find matches error:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // マッチ結果をDBに保存
    const matches: ScoutMatchData[] = []
    for (const match of data) {
      // 既存のマッチがあるか確認
      const { data: existing } = await supabase
        .from('trade_scout_matches')
        .select('id')
        .eq('user1_id', userId)
        .eq('user2_id', match.matched_user_id)
        .single()

      if (existing) {
        // 既存のマッチを更新
        await supabase
          .from('trade_scout_matches')
          .update({
            match_score: match.match_score,
            match_details: {
              wants_matched: match.wants_matched,
              offers_matched: match.offers_matched,
            },
          })
          .eq('id', existing.id)

        matches.push({
          id: existing.id,
          matchedUserId: match.matched_user_id,
          matchedUserName: match.matched_user_name || 'Unknown',
          matchScore: match.match_score,
          wantsMatched: match.wants_matched || [],
          offersMatched: match.offers_matched || [],
          status: 'found',
          tradeId: null,
          matchedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
      } else {
        // 新規マッチを作成
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        const { data: newMatch, error: insertError } = await supabase
          .from('trade_scout_matches')
          .insert({
            user1_id: userId,
            user2_id: match.matched_user_id,
            match_score: match.match_score,
            match_details: {
              wants_matched: match.wants_matched,
              offers_matched: match.offers_matched,
            },
            expires_at: expiresAt.toISOString(),
          })
          .select('id')
          .single()

        if (!insertError && newMatch) {
          matches.push({
            id: newMatch.id,
            matchedUserId: match.matched_user_id,
            matchedUserName: match.matched_user_name || 'Unknown',
            matchScore: match.match_score,
            wantsMatched: match.wants_matched || [],
            offersMatched: match.offers_matched || [],
            status: 'found',
            tradeId: null,
            matchedAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
          })
        }
      }
    }

    console.log('[TradeScout] Found', matches.length, 'matches')
    return matches
  },

  /**
   * ユーザーのマッチ一覧を取得
   */
  async getMatches(userId: string): Promise<ScoutMatchData[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trade_scout_matches')
      .select(`
        id,
        user2_id,
        match_score,
        match_details,
        status,
        trade_id,
        matched_at,
        expires_at,
        matched_user:profiles!trade_scout_matches_user2_id_fkey(
          display_name
        )
      `)
      .eq('user1_id', userId)
      .neq('status', 'expired')
      .order('match_score', { ascending: false })

    if (error || !data) {
      console.error('[TradeScout] Get matches error:', error)
      return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((match: any) => ({
      id: match.id,
      matchedUserId: match.user2_id,
      matchedUserName: match.matched_user?.display_name || 'Unknown',
      matchScore: match.match_score,
      wantsMatched: match.match_details?.wants_matched || [],
      offersMatched: match.match_details?.offers_matched || [],
      status: match.status,
      tradeId: match.trade_id,
      matchedAt: match.matched_at,
      expiresAt: match.expires_at,
    }))
  },

  /**
   * マッチのステータスを更新
   */
  async updateMatchStatus(matchId: string, status: ScoutMatchData['status']): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('trade_scout_matches')
      .update({ status })
      .eq('id', matchId)

    if (error) {
      console.error('[TradeScout] Update match status error:', error)
      return false
    }

    return true
  },

  /**
   * マッチから交換を開始
   */
  async startTradeFromMatch(matchId: string, tradeId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('trade_scout_matches')
      .update({
        status: 'trade_started',
        trade_id: tradeId,
      })
      .eq('id', matchId)

    if (error) {
      console.error('[TradeScout] Start trade from match error:', error)
      return false
    }

    return true
  },
}

export default tradeScoutService
