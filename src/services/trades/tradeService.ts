// 交換サービス - Supabase Realtime連携
import { getSupabase } from '@/services/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { dailyMissionService } from '@/services/dailyMissions'
import { notificationService } from '@/services/notifications'

// 交換セッションの型
export interface Trade {
  id: string
  user1_id: string
  user2_id: string | null
  status: 'matching' | 'negotiating' | 'user1_ready' | 'user2_ready' | 'completed' | 'cancelled'
  completed_at: string | null
  created_at: string
  updated_at: string
}

// 交換アイテムの型
export interface TradeItem {
  id: string
  trade_id: string
  user_id: string
  user_sticker_id: string
  quantity: number
  created_at: string
  // JOINで取得する追加情報
  sticker?: {
    id: string
    name: string
    image_url: string
    rarity: number
    type: string
  }
}

// 交換メッセージの型
export interface TradeMessage {
  id: string
  trade_id: string
  user_id: string
  message_type: 'stamp' | 'text' | 'preset'
  stamp_id: string | null
  content?: string | null
  created_at: string
}

// 交換詳細（関連データ込み）
export interface TradeWithDetails extends Trade {
  user1: {
    id: string
    display_name: string
    avatar_url: string | null
    selected_frame_id: string | null  // キャラクター報酬で解放したフレーム
  } | null
  user2: {
    id: string
    display_name: string
    avatar_url: string | null
    selected_frame_id: string | null  // キャラクター報酬で解放したフレーム
  } | null
  items: TradeItem[]
}

// Realtime コールバック型
export type TradeUpdateCallback = (trade: Trade) => void
export type TradeItemUpdateCallback = (item: TradeItem, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
export type TradeMessageCallback = (message: TradeMessage) => void

export const tradeService = {
  // ============================================
  // 交換セッション操作
  // ============================================

  // 新規交換セッションを作成（マッチング待機）
  async createTrade(userId: string): Promise<Trade | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trades')
      .insert({
        user1_id: userId,
        user2_id: null as unknown as string, // マッチング待機中はnull
        status: 'matching'
      })
      .select()
      .single()

    if (error) {
      console.error('[TradeService] Create trade error:', error)
      return null
    }

    return data as Trade
  },

  // 直接交換（掲示板から特定ユーザーと交換を開始）
  async createDirectTrade(userId: string, partnerId: string): Promise<Trade | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trades')
      .insert({
        user1_id: userId,
        user2_id: partnerId,
        status: 'negotiating',
      })
      .select()
      .single()

    if (error) {
      console.error('[TradeService] Create direct trade error:', error)
      return null
    }

    // 相手に通知
    try {
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single()
      const myName = myProfile?.display_name || 'だれか'
      await notificationService.sendTradeRequestNotification(partnerId, myName, data.id)
    } catch {
      // 通知失敗は無視
    }

    return data as Trade
  },

  // 古いマッチング交換をクリーンアップ（10分以上経過）
  async cleanupOldMatchingTrades(): Promise<number> {
    const supabase = getSupabase()
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('trades')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('status', 'matching')
      .lt('created_at', tenMinutesAgo)
      .select('id')

    if (error) {
      console.error('[TradeService] Cleanup old trades error:', error)
      return 0
    }

    return data?.length || 0
  },

  // マッチング待機中の交換を検索（最近10分以内のみ）
  async findWaitingTrades(userId: string): Promise<Trade[]> {
    // 空のuserIdの場合は即座に空配列を返す（UUID parse errorを防ぐ）
    if (!userId || userId.trim() === '') {
      return []
    }

    const supabase = getSupabase()

    // まず古い交換をクリーンアップ
    await this.cleanupOldMatchingTrades()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('find_waiting_trades', { p_user_id: userId })

    if (error) {
      // RPC関数が存在しない場合は無視（正常なケース）
      return []
    }

    // クライアント側でも10分以内でフィルタリング
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    const recentTrades = (data || []).filter((trade: Trade) =>
      trade.created_at > tenMinutesAgo
    )

    return recentTrades
  },

  // 交換に参加
  async joinTrade(tradeId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabase()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('join_trade', { p_trade_id: tradeId, p_user_id: userId })

    if (error) {
      console.error('[TradeService] Join trade error:', error)
      return { success: false, error: error.message }
    }

    const result = data as { success: boolean; error?: string }

    // 参加成功時、交換を作成したユーザーに通知
    if (result.success) {
      try {
        // 交換情報を取得して通知
        const trade = await this.getTrade(tradeId)
        if (trade && trade.user1_id !== userId) {
          // 参加者の名前を取得
          const { data: joinerProfile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', userId)
            .single()

          const joinerName = joinerProfile?.display_name || 'だれか'

          // user1に通知（交換作成者）
          await notificationService.sendTradeRequestNotification(
            trade.user1_id,
            joinerName,
            tradeId
          )
        }
      } catch {
        // 通知送信失敗は無視（交換自体は成功している）
      }
    }

    return result
  },

  // 交換セッションを取得
  async getTrade(tradeId: string): Promise<TradeWithDetails | null> {
    const supabase = getSupabase()

    // 交換セッションを取得
    const { data: trade, error } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .single()

    if (error || !trade) {
      console.error('[TradeService] Get trade error:', error)
      return null
    }

    // ユーザー情報を個別に取得
    // Note: selected_frame_idはマイグレーション038で追加、型定義は将来再生成予定
    let user1 = null
    let user2 = null

    if (trade.user1_id) {
      const { data: u1 } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', trade.user1_id)
        .single()
      user1 = u1 ? {
        id: u1.id,
        display_name: u1.display_name,
        avatar_url: u1.avatar_url,
        selected_frame_id: (u1 as any).selected_frame_id || null,
      } : null
    }

    if (trade.user2_id) {
      const { data: u2 } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', trade.user2_id)
        .single()
      user2 = u2 ? {
        id: u2.id,
        display_name: u2.display_name,
        avatar_url: u2.avatar_url,
        selected_frame_id: (u2 as any).selected_frame_id || null,
      } : null
    }

    // アイテムも取得
    const { data: items } = await supabase
      .from('trade_items')
      .select('*')
      .eq('trade_id', tradeId)

    return {
      ...trade,
      user1,
      user2,
      items: (items || []) as TradeItem[]
    } as TradeWithDetails
  },

  // 自分の交換セッション一覧を取得
  async getMyTrades(userId: string, includeCompleted = false): Promise<Trade[]> {
    const supabase = getSupabase()

    let query = supabase
      .from('trades')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (!includeCompleted) {
      query = query.not('status', 'in', '("completed","cancelled")')
    }

    const { data, error } = await query

    if (error) {
      console.error('[TradeService] Get my trades error:', error)
      return []
    }

    return (data || []) as Trade[]
  },

  // 交換ステータスを更新
  async updateTradeStatus(tradeId: string, status: Trade['status']): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('trades')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', tradeId)

    if (error) {
      console.error('[TradeService] Update trade status error:', error)
      return false
    }

    return true
  },

  // 交換をキャンセル
  async cancelTrade(tradeId: string): Promise<boolean> {
    return this.updateTradeStatus(tradeId, 'cancelled')
  },

  // 交換準備完了
  async setReady(tradeId: string, userId: string, isUser1: boolean): Promise<boolean> {
    const supabase = getSupabase()

    // 現在のステータスを確認
    const { data: trade } = await supabase
      .from('trades')
      .select('status')
      .eq('id', tradeId)
      .single()

    if (!trade) return false

    let newStatus: Trade['status']

    if (isUser1) {
      // User1がReady
      newStatus = trade.status === 'user2_ready' ? 'completed' : 'user1_ready'
    } else {
      // User2がReady
      newStatus = trade.status === 'user1_ready' ? 'completed' : 'user2_ready'
    }

    // 両方Readyなら交換実行
    if (newStatus === 'completed') {
      return this.executeTrade(tradeId)
    }

    return this.updateTradeStatus(tradeId, newStatus)
  },

  // 交換を実行（原子的処理）
  async executeTrade(tradeId: string): Promise<boolean> {
    const supabase = getSupabase()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('execute_trade', { p_trade_id: tradeId })

    if (error) {
      console.error('[TradeService] Execute trade error:', error)
      return false
    }

    const success = data?.success ?? false

    // 交換成功時、両方のユーザーに通知
    if (success) {
      try {
        const trade = await this.getTrade(tradeId)
        if (trade && trade.user1 && trade.user2 && trade.user2_id) {
          // User1に通知
          await notificationService.sendTradeAcceptedNotification(
            trade.user1_id,
            trade.user2.display_name || 'だれか',
            tradeId
          )
          // User2に通知
          await notificationService.sendTradeAcceptedNotification(
            trade.user2_id,
            trade.user1.display_name || 'だれか',
            tradeId
          )
        }
      } catch {
        // 通知送信失敗は無視（交換自体は成功している）
      }
    }

    return success
  },

  // ============================================
  // 交換アイテム操作
  // ============================================

  // アイテムを追加
  async addItem(tradeId: string, userId: string, userStickerId: string, quantity = 1): Promise<TradeItem | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trade_items')
      .insert({
        trade_id: tradeId,
        user_id: userId,
        user_sticker_id: userStickerId,
        quantity
      })
      .select(`
        *,
        user_sticker:user_stickers(
          sticker:stickers(id, name, image_url, rarity, type)
        )
      `)
      .single()

    if (error) {
      console.error('[TradeService] Add item error:', error)
      return null
    }

    // デイリーミッション進捗を更新（新規アイテム追加時）
    await dailyMissionService.updateProgress(userId, 'trade', 1)

    return {
      ...data,
      quantity: data.quantity || 1,
      created_at: data.created_at || new Date().toISOString(),
      sticker: (data as any).user_sticker?.sticker
    } as TradeItem
  },

  // アイテムを削除
  async removeItem(itemId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('trade_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.error('[TradeService] Remove item error:', error)
      return false
    }

    return true
  },

  // 交換のアイテム一覧を取得
  async getTradeItems(tradeId: string): Promise<TradeItem[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trade_items')
      .select(`
        *,
        user_sticker:user_stickers(
          sticker:stickers(id, name, image_url, rarity, type)
        )
      `)
      .eq('trade_id', tradeId)

    if (error) {
      console.error('[TradeService] Get trade items error:', error)
      return []
    }

    return (data || []).map((item: any) => ({
      ...item,
      sticker: item.user_sticker?.sticker
    }))
  },

  // ============================================
  // メッセージ操作
  // ============================================

  // スタンプを送信
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
      console.error('[TradeService] Send stamp error:', error)
      return null
    }

    return data as TradeMessage
  },

  // テキストメッセージを送信
  async sendText(tradeId: string, userId: string, content: string): Promise<TradeMessage | null> {
    const supabase = getSupabase()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase
      .from('trade_messages') as any)
      .insert({
        trade_id: tradeId,
        user_id: userId,
        message_type: 'text',
        content: content
      })
      .select()
      .single()

    if (error) {
      console.error('[TradeService] Send text error:', error)
      return null
    }

    return data
  },

  // メッセージ一覧を取得
  async getMessages(tradeId: string): Promise<TradeMessage[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trade_messages')
      .select('*')
      .eq('trade_id', tradeId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[TradeService] Get messages error:', error)
      return []
    }

    return (data || []) as TradeMessage[]
  },

  // ============================================
  // Realtime 購読
  // ============================================

  // 交換セッションの変更を購読
  subscribeToTrade(
    tradeId: string,
    onTradeUpdate: TradeUpdateCallback,
    onItemUpdate?: TradeItemUpdateCallback,
    onMessage?: TradeMessageCallback
  ): RealtimeChannel {
    const supabase = getSupabase()

    const channel = supabase
      .channel(`trade:${tradeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trades',
          filter: `id=eq.${tradeId}`
        },
        (payload) => {
          if (payload.new) {
            onTradeUpdate(payload.new as Trade)
          }
        }
      )

    if (onItemUpdate) {
      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trade_items',
          filter: `trade_id=eq.${tradeId}`
        },
        (payload) => {
          const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
          const item = (eventType === 'DELETE' ? payload.old : payload.new) as TradeItem
          onItemUpdate(item, eventType)
        }
      )
    }

    if (onMessage) {
      channel.on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trade_messages',
          filter: `trade_id=eq.${tradeId}`
        },
        (payload) => {
          if (payload.new) {
            onMessage(payload.new as TradeMessage)
          }
        }
      )
    }

    channel.subscribe()
    return channel
  },

  // マッチング待機を購読（新しい待機者を検出）
  subscribeToMatching(
    userId: string,
    onNewTrade: (trade: Trade) => void
  ): RealtimeChannel {
    const supabase = getSupabase()

    const channel = supabase
      .channel('matching')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trades',
          filter: `status=eq.matching`
        },
        (payload) => {
          const trade = payload.new as Trade
          // 自分の交換は無視
          if (trade.user1_id !== userId) {
            onNewTrade(trade)
          }
        }
      )
      .subscribe()

    return channel
  },

  // 購読解除
  unsubscribe(channel: RealtimeChannel): void {
    const supabase = getSupabase()
    supabase.removeChannel(channel)
  }
}

export default tradeService
