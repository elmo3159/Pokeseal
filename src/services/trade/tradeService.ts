// 交換サービス - マッチング・交換セッション管理
import { getSupabase } from '@/services/supabase'
import type { Trade, TradeItem, TradeMessage, Profile } from '@/types/database'
import type { UserStickerWithDetails } from '@/services/stickers'

export type TradeStatus = Trade['status']

// 交換相手情報
export interface TradePartner {
  id: string
  profile: Profile
  stickers: UserStickerWithDetails[]
}

// 交換セッション詳細
export interface TradeSession extends Trade {
  partner: TradePartner
  myItems: TradeItem[]
  partnerItems: TradeItem[]
  messages: TradeMessage[]
}

// マッチング待機ユーザー
interface MatchingQueueEntry {
  userId: string
  joinedAt: string
}

export const tradeService = {
  // マッチング開始
  async startMatching(userId: string): Promise<Trade | null> {
    const supabase = getSupabase()

    // 既存の待機中セッションを確認
    const { data: existingTrade } = await supabase
      .from('trades')
      .select('*')
      .eq('status', 'matching')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .single()

    if (existingTrade) {
      return existingTrade
    }

    // 待機中の他ユーザーを探す
    const { data: waitingTrades } = await supabase
      .from('trades')
      .select('*')
      .eq('status', 'matching')
      .neq('user1_id', userId)
      .is('user2_id', null)
      .order('created_at')
      .limit(1)

    if (waitingTrades && waitingTrades.length > 0) {
      // マッチング成立
      const matchedTrade = waitingTrades[0]
      const { data: updatedTrade, error } = await supabase
        .from('trades')
        .update({
          user2_id: userId,
          status: 'negotiating',
          updated_at: new Date().toISOString()
        })
        .eq('id', matchedTrade.id)
        .select()
        .single()

      if (error) {
        console.error('Match update error:', error)
        return null
      }

      return updatedTrade
    }

    // 待機中のトレードがない場合、新規作成して待機
    const { data: newTrade, error } = await supabase
      .from('trades')
      .insert({
        user1_id: userId,
        user2_id: userId, // 一時的に自分を設定（後で更新）
        status: 'matching'
      })
      .select()
      .single()

    if (error) {
      console.error('Create trade error:', error)
      return null
    }

    // user2_idを空文字列に更新（マッチング待機中の表現）
    await supabase
      .from('trades')
      .update({ user2_id: '' })
      .eq('id', newTrade.id)

    return { ...newTrade, user2_id: '' }
  },

  // マッチングキャンセル
  async cancelMatching(tradeId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('trades')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', tradeId)
      .eq('status', 'matching')

    return !error
  },

  // 交換セッション取得
  async getTradeSession(tradeId: string, userId: string): Promise<TradeSession | null> {
    const supabase = getSupabase()

    // 交換セッション取得
    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .single()

    if (tradeError || !trade) {
      console.error('Get trade error:', tradeError)
      return null
    }

    // 相手のIDを特定
    const partnerId = trade.user1_id === userId ? trade.user2_id : trade.user1_id

    if (!partnerId) {
      console.error('Partner ID not found')
      return null
    }

    // 相手のプロフィール取得
    const { data: partnerProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', partnerId)
      .single()

    if (!partnerProfile) {
      console.error('Partner profile not found')
      return null
    }

    // 相手のシール取得
    const { data: partnerStickers } = await supabase
      .from('user_stickers')
      .select(`
        *,
        sticker:stickers(*)
      `)
      .eq('user_id', partnerId)
      .gt('quantity', 0)

    // 交換アイテム取得
    const { data: tradeItems } = await supabase
      .from('trade_items')
      .select('*')
      .eq('trade_id', tradeId)

    // メッセージ取得
    const { data: messages } = await supabase
      .from('trade_messages')
      .select('*')
      .eq('trade_id', tradeId)
      .order('created_at')

    return {
      ...trade,
      partner: {
        id: partnerId,
        profile: partnerProfile,
        stickers: (partnerStickers || []).map((s: { sticker: unknown } & Record<string, unknown>) => ({
          ...s,
          sticker: s.sticker
        })) as UserStickerWithDetails[]
      },
      myItems: (tradeItems || []).filter((i: TradeItem) => i.user_id === userId),
      partnerItems: (tradeItems || []).filter((i: TradeItem) => i.user_id === partnerId),
      messages: messages || []
    }
  },

  // 交換アイテム追加
  async addTradeItem(
    tradeId: string,
    userId: string,
    userStickerId: string,
    quantity: number = 1
  ): Promise<TradeItem | null> {
    const supabase = getSupabase()

    // 既存のアイテム確認
    const { data: existing } = await supabase
      .from('trade_items')
      .select('*')
      .eq('trade_id', tradeId)
      .eq('user_id', userId)
      .eq('user_sticker_id', userStickerId)
      .single()

    if (existing) {
      // 数量更新
      const { data, error } = await supabase
        .from('trade_items')
        .update({ quantity: (existing.quantity || 0) + quantity })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Update trade item error:', error)
        return null
      }

      return data
    }

    // 新規追加
    const { data, error } = await supabase
      .from('trade_items')
      .insert({
        trade_id: tradeId,
        user_id: userId,
        user_sticker_id: userStickerId,
        quantity
      })
      .select()
      .single()

    if (error) {
      console.error('Add trade item error:', error)
      return null
    }

    return data
  },

  // 交換アイテム削除
  async removeTradeItem(tradeItemId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('trade_items')
      .delete()
      .eq('id', tradeItemId)

    return !error
  },

  // スタンプ送信
  async sendStamp(tradeId: string, userId: string, stampId: string): Promise<TradeMessage | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trade_messages')
      .insert({
        trade_id: tradeId,
        user_id: userId,
        message_type: 'stamp',
        stamp_id: stampId
      })
      .select()
      .single()

    if (error) {
      console.error('Send stamp error:', error)
      return null
    }

    return data
  },

  // 交換OK（準備完了）
  async setReady(tradeId: string, userId: string): Promise<Trade | null> {
    const supabase = getSupabase()

    // 現在の状態取得
    const { data: trade } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .single()

    if (!trade) return null

    let newStatus: TradeStatus = trade.status

    if (trade.user1_id === userId) {
      newStatus = trade.status === 'user2_ready' ? 'completed' : 'user1_ready'
    } else {
      newStatus = trade.status === 'user1_ready' ? 'completed' : 'user2_ready'
    }

    const updates: Partial<Trade> = {
      status: newStatus,
      updated_at: new Date().toISOString()
    }

    if (newStatus === 'completed') {
      updates.completed_at = new Date().toISOString()
      // 交換実行
      await this.executeTrade(tradeId)
    }

    const { data: updatedTrade, error } = await supabase
      .from('trades')
      .update(updates)
      .eq('id', tradeId)
      .select()
      .single()

    if (error) {
      console.error('Set ready error:', error)
      return null
    }

    return updatedTrade
  },

  // 交換実行（シールの所有権移転）
  async executeTrade(tradeId: string): Promise<boolean> {
    const supabase = getSupabase()

    // 交換アイテム取得
    const { data: items } = await supabase
      .from('trade_items')
      .select(`
        *,
        user_sticker:user_stickers(*)
      `)
      .eq('trade_id', tradeId)

    if (!items || items.length === 0) {
      return true // アイテムがない場合も成功扱い
    }

    // 交換セッション取得
    const { data: trade } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .single()

    if (!trade) return false

    // 各アイテムの所有権を移転
    for (const item of items) {
      const newOwnerId = item.user_id === trade.user1_id ? trade.user2_id : trade.user1_id
      if (!newOwnerId) continue

      // 元の所有者のシール数量を減らす
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userSticker = (item as any).user_sticker as { id: string; quantity: number; sticker_id: string } | null
      if (userSticker) {
        const newQuantity = userSticker.quantity - (item.quantity || 0)
        if (newQuantity <= 0) {
          await supabase
            .from('user_stickers')
            .delete()
            .eq('id', userSticker.id)
        } else {
          await supabase
            .from('user_stickers')
            .update({ quantity: newQuantity })
            .eq('id', userSticker.id)
        }

        // 新しい所有者にシールを追加
        const { data: existingNew } = await supabase
          .from('user_stickers')
          .select('*')
          .eq('user_id', newOwnerId)
          .eq('sticker_id', userSticker.sticker_id)
          .single()

        if (existingNew) {
          await supabase
            .from('user_stickers')
            .update({
              quantity: (existingNew.quantity || 0) + (item.quantity || 0),
              total_acquired: (existingNew.total_acquired || 0) + (item.quantity || 0)
            })
            .eq('id', existingNew.id)
        } else {
          await supabase
            .from('user_stickers')
            .insert({
              user_id: newOwnerId,
              sticker_id: userSticker.sticker_id,
              quantity: item.quantity || 1,
              total_acquired: item.quantity || 1,
              rank: 1
            })
        }
      }
    }

    // 両ユーザーの交換回数をインクリメント
    await supabase.rpc('increment_trade_count', { p_user_id: trade.user1_id })
    if (trade.user2_id) {
      await supabase.rpc('increment_trade_count', { p_user_id: trade.user2_id })
    }

    return true
  },

  // 交換キャンセル
  async cancelTrade(tradeId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('trades')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', tradeId)

    return !error
  },

  // 交換履歴取得
  async getTradeHistory(userId: string, limit: number = 20): Promise<Trade[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Get trade history error:', error)
      return []
    }

    return data || []
  }
}

export default tradeService
