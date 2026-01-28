/**
 * Supabase交換システム用カスタムフック
 *
 * - 交換セッションの作成・参加
 * - Realtimeでの状態監視
 * - アイテムの追加・削除
 * - 交換の確定・キャンセル
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { tradeService, Trade, TradeItem, TradeMessage, TradeWithDetails } from '@/services/trades'
import { stickerBookService, StickerBookPage } from '@/services/stickerBook'
import { TEST_USERS, TestUser } from '@/utils/persistence'
import type { RealtimeChannel } from '@supabase/supabase-js'

// フック用の型定義
export interface UseSupabaseTradeOptions {
  currentUser: TestUser | null  // 認証完了前はnull
  onTradeComplete?: (trade: Trade) => void
  onError?: (error: string) => void
}

export interface SupabaseTradeState {
  // 交換セッション
  currentTrade: TradeWithDetails | null
  isMatching: boolean
  isInSession: boolean
  isCompleted: boolean  // 交換が完了したか

  // 待機中の交換一覧
  waitingTrades: Trade[]

  // アイテム（自分・相手）
  myItems: TradeItem[]
  partnerItems: TradeItem[]

  // メッセージ
  messages: TradeMessage[]

  // パートナーのシール帳ページ（Supabaseから取得）
  partnerStickerPages: StickerBookPage[]

  // 状態
  isReady: boolean
  partnerIsReady: boolean
  isLoading: boolean
  error: string | null
}

export interface SupabaseTradeActions {
  // マッチング
  startMatching: () => Promise<void>
  cancelMatching: () => Promise<void>
  joinTrade: (tradeId: string) => Promise<void>
  startDirectTrade: (partnerId: string) => Promise<void>

  // アイテム操作
  addItem: (userStickerId: string, quantity?: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>

  // 交換操作
  setReady: () => Promise<void>
  cancelReady: () => Promise<void>
  confirmTrade: () => Promise<void>
  cancelTrade: () => Promise<void>

  // メッセージ
  sendStamp: (stampId: string) => Promise<void>
  sendText: (content: string) => Promise<void>

  // ユーティリティ
  refreshWaitingTrades: () => Promise<void>
  clearError: () => void
}

export function useSupabaseTrade(
  options: UseSupabaseTradeOptions
): [SupabaseTradeState, SupabaseTradeActions] {
  const { currentUser, onTradeComplete, onError } = options

  // 状態
  const [currentTrade, setCurrentTrade] = useState<TradeWithDetails | null>(null)
  const [waitingTrades, setWaitingTrades] = useState<Trade[]>([])
  const [myItems, setMyItems] = useState<TradeItem[]>([])
  const [partnerItems, setPartnerItems] = useState<TradeItem[]>([])
  const [messages, setMessages] = useState<TradeMessage[]>([])
  const [partnerStickerPages, setPartnerStickerPages] = useState<StickerBookPage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Realtimeチャンネル
  const tradeChannelRef = useRef<RealtimeChannel | null>(null)
  const matchingChannelRef = useRef<RealtimeChannel | null>(null)

  // Supabase UUID（認証完了前は空文字）
  const supabaseUserId = currentUser?.supabaseId || ''

  // 計算されたプロパティ
  const isMatching = currentTrade?.status === 'matching'
  const isInSession = currentTrade !== null && currentTrade.status !== 'matching' && currentTrade.status !== 'completed' && currentTrade.status !== 'cancelled'
  const isCompleted = currentTrade?.status === 'completed'
  const isUser1 = currentTrade?.user1_id === supabaseUserId
  const isReady = currentTrade?.status === (isUser1 ? 'user1_ready' : 'user2_ready') ||
                  currentTrade?.status === 'user1_ready' || currentTrade?.status === 'user2_ready' ||
                  currentTrade?.status === 'completed'
  // パートナーがOKを押したか（completedの場合は両者がOKなのでtrue）
  const partnerIsReady = currentTrade?.status === (isUser1 ? 'user2_ready' : 'user1_ready') ||
                         currentTrade?.status === 'completed'

  // エラーハンドリング
  const handleError = useCallback((msg: string) => {
    setError(msg)
    onError?.(msg)
  }, [onError])

  // Realtime購読のクリーンアップ
  const cleanupSubscriptions = useCallback(() => {
    if (tradeChannelRef.current) {
      tradeService.unsubscribe(tradeChannelRef.current)
      tradeChannelRef.current = null
    }
    if (matchingChannelRef.current) {
      tradeService.unsubscribe(matchingChannelRef.current)
      matchingChannelRef.current = null
    }
  }, [])

  // 交換セッションの購読開始
  const subscribeToTrade = useCallback((tradeId: string) => {
    // 既存の購読をクリア
    if (tradeChannelRef.current) {
      tradeService.unsubscribe(tradeChannelRef.current)
    }

    tradeChannelRef.current = tradeService.subscribeToTrade(
      tradeId,
      // Trade更新
      async (trade) => {
        console.log('[useSupabaseTrade] Trade updated:', trade.status)

        if (trade.status === 'completed') {
          // 詳細を再取得して完了状態を反映（nullにしない！完了画面表示に必要）
          const details = await tradeService.getTrade(tradeId)
          if (details) {
            setCurrentTrade(details)
          }
          onTradeComplete?.(trade)
          // Note: currentTradeはnullにしない。完了画面閉じる時にcancelTradeで明示的にクリアされる
          cleanupSubscriptions()
        } else if (trade.status === 'cancelled') {
          setCurrentTrade(null)
          cleanupSubscriptions()
        } else {
          // 詳細を再取得
          const details = await tradeService.getTrade(tradeId)
          if (details) {
            setCurrentTrade(details)
          }
        }
      },
      // Item更新
      (item, eventType) => {
        console.log('[useSupabaseTrade] Item update:', eventType, item)
        if (eventType === 'INSERT') {
          if (item.user_id === supabaseUserId) {
            // 自分のアイテム: 重複チェック（IDとuser_sticker_id両方でチェック）
            setMyItems(prev => {
              if (prev.some(i => i.id === item.id || i.user_sticker_id === item.user_sticker_id)) {
                console.log('[useSupabaseTrade] Skipping duplicate my item:', item.id, 'user_sticker_id:', item.user_sticker_id)
                return prev
              }
              return [...prev, item]
            })
          } else {
            // 相手のアイテム: 重複チェック（IDとuser_sticker_id両方でチェック）
            setPartnerItems(prev => {
              if (prev.some(i => i.id === item.id || i.user_sticker_id === item.user_sticker_id)) {
                console.log('[useSupabaseTrade] Skipping duplicate partner item:', item.id, 'user_sticker_id:', item.user_sticker_id)
                return prev
              }
              return [...prev, item]
            })
          }
        } else if (eventType === 'DELETE') {
          if (item.user_id === supabaseUserId) {
            setMyItems(prev => prev.filter(i => i.id !== item.id))
          } else {
            setPartnerItems(prev => prev.filter(i => i.id !== item.id))
          }
        }
      },
      // Message
      (message) => {
        console.log('[useSupabaseTrade] New message:', message)
        setMessages(prev => [...prev, message])
      }
    )
  }, [supabaseUserId, onTradeComplete, cleanupSubscriptions])

  // ============================================
  // アクション
  // ============================================

  // マッチング開始
  const startMatching = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const trade = await tradeService.createTrade(supabaseUserId)
      if (!trade) {
        throw new Error('交換セッションの作成に失敗しました')
      }

      const details = await tradeService.getTrade(trade.id)
      setCurrentTrade(details)
      subscribeToTrade(trade.id)
    } catch (e) {
      handleError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [supabaseUserId, subscribeToTrade, handleError])

  // 直接交換（掲示板から特定ユーザーと）
  const startDirectTrade = useCallback(async (partnerId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const trade = await tradeService.createDirectTrade(supabaseUserId, partnerId)
      if (!trade) {
        throw new Error('交換セッションの作成に失敗しました')
      }

      const details = await tradeService.getTrade(trade.id)
      setCurrentTrade(details)
      subscribeToTrade(trade.id)
    } catch (e) {
      handleError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [supabaseUserId, subscribeToTrade, handleError])

  // マッチングキャンセル
  const cancelMatching = useCallback(async () => {
    if (!currentTrade) return

    setIsLoading(true)
    try {
      await tradeService.cancelTrade(currentTrade.id)
      setCurrentTrade(null)
      cleanupSubscriptions()
    } catch (e) {
      handleError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [currentTrade, cleanupSubscriptions, handleError])

  // 交換に参加
  const joinTrade = useCallback(async (tradeId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await tradeService.joinTrade(tradeId, supabaseUserId)
      if (!result.success) {
        throw new Error(result.error || '参加に失敗しました')
      }

      const details = await tradeService.getTrade(tradeId)
      setCurrentTrade(details)
      subscribeToTrade(tradeId)

      // アイテムとメッセージを取得
      if (details) {
        const items = details.items || []
        setMyItems(items.filter(i => i.user_id === supabaseUserId))
        setPartnerItems(items.filter(i => i.user_id !== supabaseUserId))
      }
      const msgs = await tradeService.getMessages(tradeId)
      setMessages(msgs)
    } catch (e) {
      handleError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [supabaseUserId, subscribeToTrade, handleError])

  // アイテム追加
  const addItem = useCallback(async (userStickerId: string, quantity = 1) => {
    if (!currentTrade) return

    // 既に同じシールが選択されていないかチェック（重複防止）
    if (myItems.some(i => i.user_sticker_id === userStickerId)) {
      console.log('[useSupabaseTrade] Item already selected, skipping:', userStickerId)
      return
    }

    try {
      const item = await tradeService.addItem(
        currentTrade.id,
        supabaseUserId,
        userStickerId,
        quantity
      )
      if (item) {
        // 重複チェック（リアルタイム更新で既に追加されている可能性）
        setMyItems(prev => {
          if (prev.some(i => i.user_sticker_id === userStickerId)) {
            return prev
          }
          return [...prev, item]
        })
      }
    } catch (e) {
      handleError((e as Error).message)
    }
  }, [currentTrade, supabaseUserId, myItems, handleError])

  // アイテム削除
  const removeItem = useCallback(async (itemId: string) => {
    try {
      const success = await tradeService.removeItem(itemId)
      if (success) {
        setMyItems(prev => prev.filter(i => i.id !== itemId))
      }
    } catch (e) {
      handleError((e as Error).message)
    }
  }, [handleError])

  // 準備完了
  const setReady = useCallback(async () => {
    if (!currentTrade) return

    try {
      await tradeService.setReady(currentTrade.id, supabaseUserId, isUser1)
    } catch (e) {
      handleError((e as Error).message)
    }
  }, [currentTrade, supabaseUserId, isUser1, handleError])

  // 準備キャンセル
  const cancelReady = useCallback(async () => {
    if (!currentTrade) return

    try {
      await tradeService.updateTradeStatus(currentTrade.id, 'negotiating')
    } catch (e) {
      handleError((e as Error).message)
    }
  }, [currentTrade, handleError])

  // 交換確定
  const confirmTrade = useCallback(async () => {
    if (!currentTrade) return

    setIsLoading(true)
    try {
      const success = await tradeService.executeTrade(currentTrade.id)
      if (!success) {
        throw new Error('交換の実行に失敗しました')
      }
    } catch (e) {
      handleError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [currentTrade, handleError])

  // 交換キャンセル（または完了後のクリーンアップ）
  const cancelTrade = useCallback(async () => {
    if (!currentTrade) return

    setIsLoading(true)
    try {
      // 既に完了済みの場合はサーバーにキャンセルを送らない（ローカル状態のクリアのみ）
      if (currentTrade.status !== 'completed') {
        await tradeService.cancelTrade(currentTrade.id)
      }
      setCurrentTrade(null)
      setMyItems([])
      setPartnerItems([])
      setMessages([])
      cleanupSubscriptions()
    } catch (e) {
      handleError((e as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [currentTrade, cleanupSubscriptions, handleError])

  // スタンプ送信
  const sendStamp = useCallback(async (stampId: string) => {
    if (!currentTrade) return

    try {
      await tradeService.sendStamp(currentTrade.id, supabaseUserId, stampId)
    } catch (e) {
      handleError((e as Error).message)
    }
  }, [currentTrade, supabaseUserId, handleError])

  // テキストメッセージ送信
  const sendText = useCallback(async (content: string) => {
    if (!currentTrade) return

    try {
      await tradeService.sendText(currentTrade.id, supabaseUserId, content)
    } catch (e) {
      handleError((e as Error).message)
    }
  }, [currentTrade, supabaseUserId, handleError])

  // 待機中の交換を更新
  const refreshWaitingTrades = useCallback(async () => {
    try {
      const trades = await tradeService.findWaitingTrades(supabaseUserId)
      setWaitingTrades(trades)
    } catch (e) {
      console.error('[useSupabaseTrade] Failed to refresh waiting trades:', e)
    }
  }, [supabaseUserId])

  // エラークリア
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // クリーンアップ
  useEffect(() => {
    return () => {
      cleanupSubscriptions()
    }
  }, [cleanupSubscriptions])

  // マッチング購読（待機中の新規交換を検出）
  useEffect(() => {
    if (matchingChannelRef.current) {
      tradeService.unsubscribe(matchingChannelRef.current)
    }

    matchingChannelRef.current = tradeService.subscribeToMatching(
      supabaseUserId,
      (trade) => {
        console.log('[useSupabaseTrade] New matching trade available:', trade)
        setWaitingTrades(prev => [trade, ...prev])
      }
    )

    // 初回読み込み
    refreshWaitingTrades()

    return () => {
      if (matchingChannelRef.current) {
        tradeService.unsubscribe(matchingChannelRef.current)
        matchingChannelRef.current = null
      }
    }
  }, [supabaseUserId, refreshWaitingTrades])

  // ポーリング: Realtimeのフォールバック
  // マッチング待機中に定期的にDBをチェック
  useEffect(() => {
    if (!currentTrade || currentTrade.status !== 'matching') {
      return
    }

    console.log('[useSupabaseTrade] Starting polling for trade:', currentTrade.id)

    const pollInterval = setInterval(async () => {
      console.log('[useSupabaseTrade] Polling trade status...')
      const details = await tradeService.getTrade(currentTrade.id)

      if (details && details.status !== 'matching') {
        console.log('[useSupabaseTrade] Poll detected status change:', details.status)
        setCurrentTrade(details)

        // アイテムも更新
        if (details.items) {
          const my = details.items.filter(i => i.user_id === supabaseUserId)
          const partner = details.items.filter(i => i.user_id !== supabaseUserId)
          setMyItems(my)
          setPartnerItems(partner)
        }
      }
    }, 3000) // 3秒ごとにポーリング

    return () => {
      console.log('[useSupabaseTrade] Stopping polling')
      clearInterval(pollInterval)
    }
  }, [currentTrade?.id, currentTrade?.status, supabaseUserId])

  // パートナーのシール帳を取得
  // 交換セッションが開始されたら（negotiating以降）パートナーのシール帳を取得
  useEffect(() => {
    if (!currentTrade) {
      setPartnerStickerPages([])
      return
    }

    // マッチング中は相手がいないのでスキップ
    if (currentTrade.status === 'matching') return

    // パートナーのIDを取得
    const partnerId = currentTrade.user1_id === supabaseUserId
      ? currentTrade.user2_id
      : currentTrade.user1_id

    if (!partnerId) {
      console.log('[useSupabaseTrade] Partner ID not available')
      return
    }

    // パートナーのシール帳を取得（全ページ：表紙・裏表紙含む）
    const fetchPartnerStickerBook = async () => {
      console.log('[useSupabaseTrade] Fetching partner sticker book for:', partnerId)

      try {
        const book = await stickerBookService.getUserStickerBook(partnerId)
        if (book) {
          console.log('[useSupabaseTrade] Partner sticker pages loaded:', book.pages.length)
          setPartnerStickerPages(book.pages)
        } else {
          console.log('[useSupabaseTrade] Partner sticker book not found')
          setPartnerStickerPages([])
        }
      } catch (e) {
        console.error('[useSupabaseTrade] Failed to fetch partner sticker book:', e)
        setPartnerStickerPages([])
      }
    }

    fetchPartnerStickerBook()
  }, [currentTrade?.id, currentTrade?.status, currentTrade?.user1_id, currentTrade?.user2_id, supabaseUserId])

  // 状態
  const state: SupabaseTradeState = {
    currentTrade,
    isMatching,
    isInSession,
    isCompleted,
    waitingTrades,
    myItems,
    partnerItems,
    messages,
    partnerStickerPages,
    isReady,
    partnerIsReady,
    isLoading,
    error
  }

  // アクション
  const actions: SupabaseTradeActions = {
    startMatching,
    cancelMatching,
    joinTrade,
    startDirectTrade,
    addItem,
    removeItem,
    setReady,
    cancelReady,
    confirmTrade,
    cancelTrade,
    sendStamp,
    sendText,
    refreshWaitingTrades,
    clearError
  }

  return [state, actions]
}

export default useSupabaseTrade
