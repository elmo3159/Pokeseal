// リアルタイムサービス - Supabase Realtimeを使用した更新通知
import { getSupabase } from '@/services/supabase'
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Trade, TradeItem, TradeMessage, Post, Reaction } from '@/types/database'

// コールバック型定義
type TradeCallback = (trade: Trade) => void
type TradeItemCallback = (item: TradeItem, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
type TradeMessageCallback = (message: TradeMessage) => void
type PostCallback = (post: Post) => void
type ReactionCallback = (reaction: Reaction, eventType: 'INSERT' | 'DELETE') => void

// チャンネル管理
const activeChannels = new Map<string, RealtimeChannel>()

export const realtimeService = {
  // 交換セッションの購読
  subscribeToTrade(
    tradeId: string,
    callbacks: {
      onTradeUpdate?: TradeCallback
      onItemChange?: TradeItemCallback
      onMessage?: TradeMessageCallback
    }
  ): () => void {
    const supabase = getSupabase()
    const channelName = `trade:${tradeId}`

    // 既存のチャンネルがあれば解除
    if (activeChannels.has(channelName)) {
      activeChannels.get(channelName)?.unsubscribe()
    }

    const channel = supabase
      .channel(channelName)
      // 交換セッション状態の変更
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trades',
          filter: `id=eq.${tradeId}`
        },
        (payload: RealtimePostgresChangesPayload<Trade>) => {
          if (callbacks.onTradeUpdate && payload.new) {
            callbacks.onTradeUpdate(payload.new as Trade)
          }
        }
      )
      // 交換アイテムの変更
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trade_items',
          filter: `trade_id=eq.${tradeId}`
        },
        (payload: RealtimePostgresChangesPayload<TradeItem>) => {
          if (callbacks.onItemChange) {
            const item = (payload.new || payload.old) as TradeItem
            callbacks.onItemChange(item, payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE')
          }
        }
      )
      // スタンプメッセージ
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trade_messages',
          filter: `trade_id=eq.${tradeId}`
        },
        (payload: RealtimePostgresChangesPayload<TradeMessage>) => {
          if (callbacks.onMessage && payload.new) {
            callbacks.onMessage(payload.new as TradeMessage)
          }
        }
      )
      .subscribe()

    activeChannels.set(channelName, channel)

    // クリーンアップ関数を返す
    return () => {
      channel.unsubscribe()
      activeChannels.delete(channelName)
    }
  },

  // マッチング待機の購読
  subscribeToMatching(
    userId: string,
    onMatch: (trade: Trade) => void
  ): () => void {
    const supabase = getSupabase()
    const channelName = `matching:${userId}`

    if (activeChannels.has(channelName)) {
      activeChannels.get(channelName)?.unsubscribe()
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trades',
          filter: `user1_id=eq.${userId}`
        },
        (payload: RealtimePostgresChangesPayload<Trade>) => {
          const trade = payload.new as Trade
          if (trade && trade.status === 'negotiating' && trade.user2_id) {
            onMatch(trade)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'trades',
          filter: `user2_id=eq.${userId}`
        },
        (payload: RealtimePostgresChangesPayload<Trade>) => {
          const trade = payload.new as Trade
          if (trade && trade.status === 'negotiating') {
            onMatch(trade)
          }
        }
      )
      .subscribe()

    activeChannels.set(channelName, channel)

    return () => {
      channel.unsubscribe()
      activeChannels.delete(channelName)
    }
  },

  // タイムラインの購読（新規投稿通知）
  subscribeToTimeline(
    callbacks: {
      onNewPost?: PostCallback
      onReaction?: ReactionCallback
    }
  ): () => void {
    const supabase = getSupabase()
    const channelName = 'timeline:public'

    if (activeChannels.has(channelName)) {
      activeChannels.get(channelName)?.unsubscribe()
    }

    const channel = supabase
      .channel(channelName)
      // 新規投稿
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        (payload: RealtimePostgresChangesPayload<Post>) => {
          if (callbacks.onNewPost && payload.new) {
            const post = payload.new as Post
            // 公開投稿のみ通知
            if (post.visibility === 'public') {
              callbacks.onNewPost(post)
            }
          }
        }
      )
      .subscribe()

    activeChannels.set(channelName, channel)

    return () => {
      channel.unsubscribe()
      activeChannels.delete(channelName)
    }
  },

  // 特定の投稿のリアクション購読
  subscribeToPostReactions(
    postId: string,
    onReaction: ReactionCallback
  ): () => void {
    const supabase = getSupabase()
    const channelName = `post:${postId}`

    if (activeChannels.has(channelName)) {
      activeChannels.get(channelName)?.unsubscribe()
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reactions',
          filter: `post_id=eq.${postId}`
        },
        (payload: RealtimePostgresChangesPayload<Reaction>) => {
          const reaction = (payload.new || payload.old) as Reaction
          if (reaction) {
            onReaction(reaction, payload.eventType as 'INSERT' | 'DELETE')
          }
        }
      )
      .subscribe()

    activeChannels.set(channelName, channel)

    return () => {
      channel.unsubscribe()
      activeChannels.delete(channelName)
    }
  },

  // フレンドの活動購読
  subscribeToFriendActivity(
    userId: string,
    friendIds: string[],
    callbacks: {
      onFriendPost?: (post: Post, friendId: string) => void
      onFriendAchievement?: (friendId: string, achievement: string) => void
    }
  ): () => void {
    const supabase = getSupabase()
    const channelName = `friends:${userId}`

    if (activeChannels.has(channelName)) {
      activeChannels.get(channelName)?.unsubscribe()
    }

    if (friendIds.length === 0) {
      return () => {}
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        (payload: RealtimePostgresChangesPayload<Post>) => {
          const post = payload.new as Post
          if (post && friendIds.includes(post.user_id) && callbacks.onFriendPost) {
            callbacks.onFriendPost(post, post.user_id)
          }
        }
      )
      .subscribe()

    activeChannels.set(channelName, channel)

    return () => {
      channel.unsubscribe()
      activeChannels.delete(channelName)
    }
  },

  // すべてのチャンネルを解除
  unsubscribeAll(): void {
    for (const [name, channel] of activeChannels) {
      channel.unsubscribe()
      activeChannels.delete(name)
    }
  },

  // アクティブなチャンネル数を取得
  getActiveChannelCount(): number {
    return activeChannels.size
  }
}

export default realtimeService
