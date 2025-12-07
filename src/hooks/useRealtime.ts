'use client'

import { useEffect, useRef, useCallback } from 'react'
import { realtimeService } from '@/services/realtime'
import type { Trade, TradeItem, TradeMessage, Post, Reaction } from '@/types/database'

// 交換セッション用フック
export function useTradeRealtime(
  tradeId: string | null,
  callbacks: {
    onTradeUpdate?: (trade: Trade) => void
    onItemChange?: (item: TradeItem, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void
    onMessage?: (message: TradeMessage) => void
  }
) {
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!tradeId) return

    // 既存の購読を解除
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
    }

    // 新しい購読を開始
    unsubscribeRef.current = realtimeService.subscribeToTrade(tradeId, callbacks)

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [tradeId, callbacks.onTradeUpdate, callbacks.onItemChange, callbacks.onMessage])
}

// マッチング待機用フック
export function useMatchingRealtime(
  userId: string | null,
  isMatching: boolean,
  onMatch: (trade: Trade) => void
) {
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!userId || !isMatching) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
      return
    }

    unsubscribeRef.current = realtimeService.subscribeToMatching(userId, onMatch)

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [userId, isMatching, onMatch])
}

// タイムライン用フック
export function useTimelineRealtime(
  enabled: boolean,
  callbacks: {
    onNewPost?: (post: Post) => void
    onReaction?: (reaction: Reaction, eventType: 'INSERT' | 'DELETE') => void
  }
) {
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!enabled) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
      return
    }

    unsubscribeRef.current = realtimeService.subscribeToTimeline(callbacks)

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [enabled, callbacks.onNewPost, callbacks.onReaction])
}

// 投稿のリアクション購読用フック
export function usePostReactionsRealtime(
  postId: string | null,
  onReaction: (reaction: Reaction, eventType: 'INSERT' | 'DELETE') => void
) {
  const unsubscribeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!postId) return

    unsubscribeRef.current = realtimeService.subscribeToPostReactions(postId, onReaction)

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [postId, onReaction])
}

// すべてのリアルタイム購読を解除するフック
export function useRealtimeCleanup() {
  useEffect(() => {
    return () => {
      realtimeService.unsubscribeAll()
    }
  }, [])
}

export default {
  useTradeRealtime,
  useMatchingRealtime,
  useTimelineRealtime,
  usePostReactionsRealtime,
  useRealtimeCleanup
}
