'use client'

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import {
  HandshakeIcon,
  UserIcon,
  SparkleIcon,
} from '@/components/icons/TradeIcons'
import { Avatar } from '@/components/ui/Avatar'
import { AsyncTradeListView, AsyncTradeInviteModal } from '@/features/async-trade'
import { asyncTradeService, TradeSession, TradeRoomDetails, TradeMessage, TradeRequest, PresetMessageKey, TRADE_PRESET_MESSAGES } from '@/services/asyncTrade/asyncTradeService'
import { TradeSessionFull, TradeUser, TradeBookPageFull } from './TradeSessionFull'
import type { PlacedSticker } from '../sticker-book/StickerPlacement'
import { stickerBookService } from '@/services/stickerBook/stickerBookService'
import { profileService } from '@/services/profile/profileService'
import { getDefaultCoverDesignId } from '@/domain/theme'
import { getSupabase } from '@/services/supabase'
import { calculateLevel } from '@/domain/levelSystem'

// 交換モード
export type TradeMode = 'menu' | 'matching' | 'session'

// 交換タブ
export type TradeTab = 'realtime' | 'async'

// フレンド情報
export interface Friend {
  id: string
  name: string
  avatarUrl?: string
  frameId?: string | null  // キャラクター報酬で解放したフレーム
  isOnline: boolean
  lastActive?: string
}

// 交換履歴
export interface TradeHistory {
  id: string
  partnerName: string
  partnerAvatarUrl?: string
  givenStickers: { name: string; rarity: number }[]
  receivedStickers: { name: string; rarity: number }[]
  tradedAt: string | null
}

interface TradeViewProps {
  userId?: string
  friends: Friend[]
  history: TradeHistory[]
  onStartMatching: () => void
  onTradeWithFriend: (friendId: string) => void
  onViewHistory: (historyId: string) => void
  onTradeCompleted?: () => void
  // 非同期交換で TradeSessionFull に渡すデータ
  myUser?: TradeUser
  myPages?: TradeBookPageFull[]
  myCoverDesignId?: string
  // セッション状態変更コールバック（ヘッダー/フッター制御用）
  onAsyncSessionChange?: (inSession: boolean) => void
  // メッセージタブのバッジカウント
  asyncBadgeCount?: number
}

// マッチングボタン - 茶色・ベージュ系
const MatchingButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        relative w-full py-6 rounded-3xl
        text-white font-bold text-xl
        transition-all duration-300
        active:scale-95
        overflow-hidden
      "
      style={{
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 50%, #A67C52 100%)',
        boxShadow: '0 4px 20px rgba(184, 149, 107, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      {/* キラキラ背景 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />

      <div className="relative flex items-center justify-center gap-3">
        <span className="animate-bounce"><HandshakeIcon size={32} color="white" /></span>
        <div className="flex flex-col items-start">
          <span className="text-2xl">まっちんぐすたーと！</span>
          <span className="text-sm font-normal opacity-90">
            らんだむなともだちとこうかん
          </span>
        </div>
      </div>
    </button>
  )
}

// フレンドカード - 茶色・ベージュ系
const FriendCard: React.FC<{
  friend: Friend
  onTrade: () => void
}> = ({ friend, onTrade }) => {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-2xl transition-all"
      style={{
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 2px 8px rgba(184, 149, 107, 0.15)',
        border: '2px solid #D4C4B0',
      }}
    >
      {/* アバター */}
      <div className="relative">
        <Avatar
          src={friend.avatarUrl}
          alt={friend.name}
          size="md"
          frameId={friend.frameId}
        />
        {/* オンライン状態 */}
        <div className={`
          absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white
          ${friend.isOnline ? 'bg-green-400' : 'bg-gray-300'}
        `} />
      </div>

      {/* 情報 */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold truncate" style={{ color: '#8B5A2B' }}>{friend.name}</h4>
            <p className="text-xs" style={{ color: '#A67C52' }}>
              {friend.isOnline ? 'おんらいん' : friend.lastActive || 'おふらいん'}
            </p>
          </div>

      {/* 交換ボタン */}
      <button
        onClick={onTrade}
        disabled={!friend.isOnline}
        className="px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200"
        style={{
          background: friend.isOnline
            ? 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)'
            : '#E5E7EB',
          color: friend.isOnline ? 'white' : '#9CA3AF',
          boxShadow: friend.isOnline ? '0 2px 8px rgba(184, 149, 107, 0.4)' : 'none',
          cursor: friend.isOnline ? 'pointer' : 'not-allowed',
        }}
      >
        こうかん
      </button>
    </div>
  )
}

// 交換履歴カード - 茶色・ベージュ系
const HistoryCard: React.FC<{
  history: TradeHistory
  onClick: () => void
}> = ({ history, onClick }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'きょう'
    if (diffDays === 1) return 'きのう'
    if (diffDays < 7) return `${diffDays}日まえ`
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left"
      style={{
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        background: 'rgba(255, 255, 255, 0.85)',
        border: '1px solid #E8D5C4',
        boxShadow: '0 1px 4px rgba(184, 149, 107, 0.1)',
      }}
    >
      {/* パートナーアバター */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #F5EDE6 0%, #E8D5C4 100%)' }}
      >
        {history.partnerAvatarUrl ? (
          <img src={history.partnerAvatarUrl} alt={history.partnerName} className="w-full h-full rounded-full object-cover" />
        ) : (
          <UserIcon size={24} color="#A67C52" />
        )}
      </div>

      {/* 交換内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm truncate" style={{ color: '#8B5A2B' }}>
            {history.partnerName}
          </span>
          <span className="text-xs" style={{ color: '#A67C52' }}>
            {history.tradedAt ? formatDate(history.tradedAt) : '---'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: '#B8956B' }}>
          <span style={{ color: '#D4764A' }}>{history.givenStickers.length}枚</span>
          <span>↔</span>
          <span style={{ color: '#7DAF72' }}>{history.receivedStickers.length}枚</span>
        </div>
      </div>

      {/* 詳細矢印 */}
      <span style={{ color: '#C4A484' }} className="text-lg">›</span>
    </button>
  )
}

// セクションヘッダー - 茶色・ベージュ系
const SectionHeader: React.FC<{
  icon: React.ReactNode
  title: string
  action?: { label: string; onClick: () => void }
}> = ({ icon, title, action }) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="flex items-center">{icon}</span>
        <h3 className="font-bold" style={{ color: '#8B5A2B' }}>{title}</h3>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm hover:opacity-80"
          style={{ color: '#A67C52' }}
        >
          {action.label} ›
        </button>
      )}
    </div>
  )
}

// タブボタン
const TabButton: React.FC<{
  label: string
  emoji: string
  isActive: boolean
  onClick: () => void
  badgeCount?: number
}> = ({ label, emoji, isActive, onClick, badgeCount }) => (
  <button
    onClick={onClick}
    className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all relative"
    style={{
      background: isActive ? 'white' : 'transparent',
      color: isActive ? '#8B5A2B' : '#A67C52',
      boxShadow: isActive ? '0 2px 10px rgba(184, 149, 107, 0.25)' : 'none',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }}
  >
    <span className="mr-1">{emoji}</span>
    {label}
    {badgeCount != null && badgeCount > 0 && (
      <span
        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-white font-bold"
        style={{ fontSize: '10px', background: '#E74C3C', lineHeight: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      >
        {badgeCount > 99 ? '99+' : badgeCount}
      </span>
    )}
  </button>
)

// Supabaseメッセージ型（TradeSessionFull互換）
interface SupabaseTradeMessage {
  id: string
  stamp_id: string | null
  user_id: string
  created_at: string
  message_type?: 'stamp' | 'text' | 'preset'
  content?: string | null
}

// Supabaseアイテム型（TradeSessionFull互換）
interface SupabaseTradeItem {
  id: string
  user_id: string
  user_sticker_id: string
  sticker_id?: string
}

// メインのTradeView
export const TradeView: React.FC<TradeViewProps> = ({
  userId,
  friends,
  history,
  onStartMatching,
  onTradeWithFriend,
  onViewHistory,
  onTradeCompleted,
  myUser,
  myPages,
  myCoverDesignId,
  onAsyncSessionChange,
  asyncBadgeCount,
}) => {
  const [activeTab, setActiveTab] = useState<TradeTab>('realtime')
  const [showAllFriends, setShowAllFriends] = useState(false)
  const [showAllHistory, setShowAllHistory] = useState(false)

  // 非同期交換の状態
  const [asyncSessionId, setAsyncSessionId] = useState<string | null>(null)
  const [showInviteModal, setShowInviteModal] = useState(false)

  // TradeSessionFull 用のデータ
  const [tradeRoom, setTradeRoom] = useState<TradeRoomDetails | null>(null)
  const [partnerUser, setPartnerUser] = useState<TradeUser | null>(null)
  const [partnerPages, setPartnerPages] = useState<TradeBookPageFull[]>([])
  const [partnerCoverDesignId, setPartnerCoverDesignId] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [myConfirmed, setMyConfirmed] = useState(false)
  const [partnerConfirmed, setPartnerConfirmed] = useState(false)
  const [tradeCompleted, setTradeCompleted] = useState(false)
  const [isFriend, setIsFriend] = useState(false) // 相互フォロー状態
  const [isFollowingPartner, setIsFollowingPartner] = useState(false)
  const tradeCompletedHandledRef = useRef(false)

  // セッション状態変更を親に通知
  useEffect(() => {
    onAsyncSessionChange?.(!!asyncSessionId)
  }, [asyncSessionId, onAsyncSessionChange])

  useEffect(() => {
    if (!tradeCompleted || tradeCompletedHandledRef.current) return
    tradeCompletedHandledRef.current = true
    onTradeCompleted?.()
  }, [tradeCompleted, onTradeCompleted])

  useEffect(() => {
    if (!tradeCompleted) {
      tradeCompletedHandledRef.current = false
    }
  }, [tradeCompleted])

  const onlineFriends = friends.filter(f => f.isOnline)
  const displayFriends = showAllFriends ? friends : friends.slice(0, 4)
  const displayHistory = showAllHistory ? history : history.slice(0, 3)

  // セッション選択時にデータを取得
  const loadTradeRoom = useCallback(async (sessionId: string) => {
    if (!userId) return

    setIsLoading(true)
    try {
      // 交換ルームの詳細を取得
      const room = await asyncTradeService.getTradeRoom(sessionId, userId)
      if (!room) {
        console.error('[TradeView] Failed to load trade room')
        setAsyncSessionId(null)
        return
      }

      setTradeRoom(room)
      setMyConfirmed(room.session.requesterId === userId ? room.session.requesterConfirmed : room.session.responderConfirmed)
      setPartnerConfirmed(room.session.requesterId === userId ? room.session.responderConfirmed : room.session.requesterConfirmed)
      setTradeCompleted(room.session.status === 'completed')

      // パートナー情報を設定
      if (room.session.partner) {
        const partnerId = room.session.partner.id

        // パートナーのプロフィールとフォロー状態と交換数を並列取得
        const [partnerProfile, followStatus, tradeCountResult] = await Promise.all([
          profileService.getProfile(partnerId),
          profileService.getFollowStatus(userId, partnerId),
          getSupabase().from('async_trade_sessions')
            .select('id', { count: 'exact', head: true })
            .or(`requester_id.eq.${partnerId},responder_id.eq.${partnerId}`)
            .eq('status', 'completed'),
        ])

        // フレンド状態（相互フォロー）を設定
        setIsFriend(followStatus === 'mutual')
        setIsFollowingPartner(followStatus === 'following' || followStatus === 'mutual')

        // パートナー情報を設定（プロフィールがあればそのデータを使用）
        const level = partnerProfile ? calculateLevel(partnerProfile.totalExp) : 1
        setPartnerUser({
          id: partnerId,
          name: partnerProfile?.displayName || room.session.partner.displayName || room.session.partner.username,
          avatarUrl: partnerProfile?.avatarUrl || room.session.partner.avatarUrl,
          level: level,
          bio: partnerProfile?.bio || '',
          totalStickers: partnerProfile?.totalStickers || 0,
          totalTrades: tradeCountResult?.count || partnerProfile?.totalTrades || 0,
          frameId: partnerProfile?.selectedFrameId || room.session.partner.selectedFrameId || null,
        })

        // パートナーのシール帳を取得
        const partnerBookData = await stickerBookService.getUserStickerBook(partnerId)
        if (partnerBookData) {
          const pPages: TradeBookPageFull[] = partnerBookData.pages.map(page => ({
            id: page.id,
            type: page.pageType as 'cover' | 'page' | 'back-cover' | 'inner-cover',
            pageNumber: page.pageNumber,
            stickers: page.stickers,
            decoItems: page.decoItems || [],
          }))
          setPartnerPages(pPages)
          // シール帳からシール数をカウントして更新
          const stickerCount = pPages.reduce((sum, p) => sum + (p.stickers?.length || 0), 0)
          if (stickerCount > 0) {
            setPartnerUser(prev => prev ? { ...prev, totalStickers: stickerCount } : prev)
          }
          // coverDesignIdがない場合はデフォルトのカバーデザインを使用
          setPartnerCoverDesignId(partnerBookData.coverDesignId || getDefaultCoverDesignId())
        } else {
          // シール帳がない場合もデフォルトカバーを使用
          setPartnerCoverDesignId(getDefaultCoverDesignId())
        }
      }
    } catch (error) {
      console.error('[TradeView] Error loading trade room:', error)
      setAsyncSessionId(null)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  // セッションIDが変わったらデータを取得
  useEffect(() => {
    if (asyncSessionId && userId) {
      loadTradeRoom(asyncSessionId)
    }
    // loadTradeRoomを依存配列から除外して不要な再実行を防ぐ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncSessionId, userId])

  // Supabase Realtimeサブスクリプション（リアルタイム同期）
  useEffect(() => {
    if (!asyncSessionId || !userId) return

    const supabase = getSupabase()
    const channelName = `trade-session-${asyncSessionId}`

    console.log('[TradeView] Setting up Realtime subscription for session:', asyncSessionId)

    const channel = supabase
      .channel(channelName)
      // リクエスト（欲しいシール）の変更を監視
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'async_trade_requests',
          filter: `session_id=eq.${asyncSessionId}`,
        },
        async (payload) => {
          console.log('[TradeView] Realtime request event:', payload.eventType, payload)

          // 自分のリクエストは楽観的更新済みなのでスキップ
          if ((payload.new as any)?.requester_id === userId) {
            console.log('[TradeView] Skipping own request update')
            return
          }

          // 相手のリクエスト更新: partnerRequestsを更新
          if (payload.eventType === 'INSERT') {
            // シール情報を取得するために再読み込み（相手のリクエストなので詳細が必要）
            const room = await asyncTradeService.getTradeRoom(asyncSessionId, userId)
            if (room) {
              setTradeRoom(prev => prev ? {
                ...prev,
                partnerRequests: room.partnerRequests,
              } : null)
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as any)?.id
            setTradeRoom(prev => prev ? {
              ...prev,
              partnerRequests: prev.partnerRequests.filter(r => r.id !== deletedId),
            } : null)
          }
        }
      )
      // メッセージの変更を監視
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'async_trade_messages',
          filter: `session_id=eq.${asyncSessionId}`,
        },
        async (payload) => {
          console.log('[TradeView] Realtime message event:', payload)

          // 自分のメッセージはスキップ
          if ((payload.new as any)?.sender_id === userId) {
            return
          }

          // 新しいメッセージを追加
          const newMsg = payload.new as any
          const displayInfo = newMsg.message_type === 'preset'
            ? TRADE_PRESET_MESSAGES[newMsg.content as PresetMessageKey]
            : null

          const tradeMessage: TradeMessage = {
            id: newMsg.id,
            sessionId: newMsg.session_id,
            senderId: newMsg.sender_id,
            messageType: newMsg.message_type,
            content: newMsg.content,
            isRead: newMsg.is_read,
            createdAt: newMsg.created_at,
            displayText: displayInfo?.text || newMsg.content,
            emoji: displayInfo?.emoji,
          }

          setTradeRoom(prev => prev ? {
            ...prev,
            messages: [...prev.messages, tradeMessage],
          } : null)
        }
      )
      // セッション状態の変更を監視（確認ステータス）
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'async_trade_sessions',
          filter: `id=eq.${asyncSessionId}`,
        },
        (payload) => {
          console.log('[TradeView] Realtime session event:', payload)

          const updated = payload.new as any
          const isRequester = updated.requester_id === userId

          // 相手の確認状態を更新
          if (isRequester) {
            setPartnerConfirmed(updated.responder_confirmed)
          } else {
            setPartnerConfirmed(updated.requester_confirmed)
          }

          // 交換完了チェック
          if (updated.status === 'completed') {
            setTradeCompleted(true)
          }
        }
      )
      .subscribe((status) => {
        console.log('[TradeView] Realtime subscription status:', status)
      })

    // クリーンアップ
    return () => {
      console.log('[TradeView] Unsubscribing from Realtime channel:', channelName)
      supabase.removeChannel(channel)
    }
  }, [asyncSessionId, userId])

  // 招待送信完了
  const handleInviteSent = useCallback((sessionId: string) => {
    setAsyncSessionId(sessionId)
  }, [])

  // セッション選択
  const handleSelectSession = useCallback((sessionId: string) => {
    setAsyncSessionId(sessionId)
  }, [])

  // セッション終了
  const handleCloseSession = useCallback(async () => {
    if (asyncSessionId && userId) {
      await asyncTradeService.cancelTrade(asyncSessionId, userId)
    }
    setAsyncSessionId(null)
    setTradeRoom(null)
    setPartnerUser(null)
    setPartnerPages([])
  }, [asyncSessionId, userId])

  // 戻るボタン（キャンセルせずに閉じる）
  const handleBack = useCallback(() => {
    setAsyncSessionId(null)
    setTradeRoom(null)
    setPartnerUser(null)
    setPartnerPages([])
  }, [])

  // 交換成立＆セッション終了
  // 完了画面の「とじる」ボタンから呼ばれる
  const handleTradeComplete = useCallback(() => {
    console.log('[TradeView] handleTradeComplete called - closing session')
    // セッション状態をリセットして交換リストに戻る
    setAsyncSessionId(null)
    setTradeRoom(null)
    setPartnerUser(null)
    setPartnerPages([])
    setMyConfirmed(false)
    setPartnerConfirmed(false)
    setTradeCompleted(false)
    setIsFriend(false)
  }, [])

  // スタンプ送信（楽観的更新）
  const handleSendStamp = useCallback(async (stampId: string) => {
    if (!asyncSessionId || !userId || !tradeRoom) return

    const presetInfo = TRADE_PRESET_MESSAGES[stampId as PresetMessageKey]

    // 楽観的にローカル状態を更新
    const tempMessage: TradeMessage = {
      id: `temp-${Date.now()}`,
      sessionId: asyncSessionId,
      senderId: userId,
      messageType: 'preset',
      content: stampId,
      isRead: false,
      createdAt: new Date().toISOString(),
      displayText: presetInfo?.text || stampId,
      emoji: presetInfo?.emoji,
    }

    setTradeRoom(prev => prev ? {
      ...prev,
      messages: [...prev.messages, tempMessage],
    } : null)

    // バックグラウンドでAPI呼び出し
    asyncTradeService.sendPresetMessage(asyncSessionId, userId, stampId as PresetMessageKey).catch(err => {
      console.error('[TradeView] Failed to send stamp:', err)
      // エラー時はロールバック
      setTradeRoom(prev => prev ? {
        ...prev,
        messages: prev.messages.filter(m => m.id !== tempMessage.id),
      } : null)
    })
  }, [asyncSessionId, userId, tradeRoom])

  // テキストメッセージ送信（楽観的更新）
  const handleSendText = useCallback(async (content: string) => {
    if (!asyncSessionId || !userId || !tradeRoom) return

    // 楽観的にローカル状態を更新
    const tempMessage: TradeMessage = {
      id: `temp-${Date.now()}`,
      sessionId: asyncSessionId,
      senderId: userId,
      messageType: 'preset', // テキストもpresetとして送信
      content: content,
      isRead: false,
      createdAt: new Date().toISOString(),
      displayText: content,
    }

    setTradeRoom(prev => prev ? {
      ...prev,
      messages: [...prev.messages, tempMessage],
    } : null)

    // バックグラウンドでAPI呼び出し
    asyncTradeService.sendMessage(asyncSessionId, userId, 'preset', content).catch(err => {
      console.error('[TradeView] Failed to send text:', err)
      // エラー時はロールバック
      setTradeRoom(prev => prev ? {
        ...prev,
        messages: prev.messages.filter(m => m.id !== tempMessage.id),
      } : null)
    })
  }, [asyncSessionId, userId, tradeRoom])

  // 相手のシール帳からシール選択（リクエスト追加）- 楽観的更新
  // 注意: この関数は相手のシール帳から「欲しいシール」を選択するときに呼ばれる
  const handleSelectMySticker = useCallback(async (userStickerId: string) => {
    if (!asyncSessionId || !userId || !tradeRoom) return

    // partnerPagesからシール情報を取得（相手のシール帳から選択しているため）
    let foundSticker: PlacedSticker | null = null
    for (const page of partnerPages) {
      const sticker = page.stickers.find(s => s.id === userStickerId || s.userStickerId === userStickerId)
      if (sticker) {
        foundSticker = sticker
        break
      }
    }

    if (!foundSticker) {
      console.warn('[TradeView] Sticker not found in partner pages for optimistic update:', userStickerId)
      // フォールバック: APIのみ呼び出し
      await asyncTradeService.addRequest(asyncSessionId, userId, userStickerId)
      return
    }

    // 楽観的にローカル状態を更新（myRequestsに追加）
    const tempRequest: TradeRequest = {
      id: `temp-${Date.now()}`,
      sessionId: asyncSessionId,
      requesterId: userId,
      targetUserStickerId: userStickerId,
      sticker: {
        id: foundSticker.stickerId,
        name: foundSticker.sticker.name,
        imageUrl: foundSticker.sticker.imageUrl || '',
        rarity: foundSticker.sticker.rarity || 1,
        upgradeRank: foundSticker.upgradeRank,
      },
      createdAt: new Date().toISOString(),
    }

    setTradeRoom(prev => prev ? {
      ...prev,
      myRequests: [...prev.myRequests, tempRequest],
    } : null)

    // バックグラウンドでAPIを呼び出し（結果は待たない）
    asyncTradeService.addRequest(asyncSessionId, userId, userStickerId).catch(err => {
      console.error('[TradeView] Failed to add request:', err)
      // エラー時はロールバック
      setTradeRoom(prev => prev ? {
        ...prev,
        myRequests: prev.myRequests.filter(r => r.id !== tempRequest.id),
      } : null)
    })
  }, [asyncSessionId, userId, tradeRoom, partnerPages])

  // シール選択解除（リクエスト削除）- 楽観的更新
  const handleDeselectMySticker = useCallback(async (itemId: string) => {
    if (!asyncSessionId || !userId || !tradeRoom) return

    // itemIdはrequest idなので、該当するrequestを探す
    const request = tradeRoom.myRequests.find(r => r.id === itemId)
    if (!request) return

    // 楽観的にローカル状態を更新
    setTradeRoom(prev => prev ? {
      ...prev,
      myRequests: prev.myRequests.filter(r => r.id !== itemId),
    } : null)

    // バックグラウンドでAPIを呼び出し（結果は待たない）
    asyncTradeService.removeRequest(asyncSessionId, userId, request.targetUserStickerId).catch(err => {
      console.error('[TradeView] Failed to remove request:', err)
      // エラー時はロールバック（リクエストを戻す）
      setTradeRoom(prev => prev ? {
        ...prev,
        myRequests: [...prev.myRequests, request],
      } : null)
    })
  }, [asyncSessionId, userId, tradeRoom])

  // 準備完了（OKボタン）
  const handleSetReady = useCallback(async () => {
    if (!asyncSessionId || !userId) return
    console.log('[TradeView] handleSetReady called')

    const result = await asyncTradeService.confirmTrade(asyncSessionId, userId)
    console.log('[TradeView] confirmTrade result:', result)

    if (result.confirmed) {
      setMyConfirmed(true)
    }
    if (result.completed) {
      // 交換完了 → 完了画面を表示するためにtradeCompletedをtrueに設定
      // handleTradeComplete()を呼ぶのは間違い - それはセッションを閉じてしまう
      console.log('[TradeView] Trade completed! Setting tradeCompleted to true')
      setTradeCompleted(true)
    }
    // loadTradeRoomは呼ばない（楽観的更新 + Realtimeで同期される）
  }, [asyncSessionId, userId])

  // メッセージをSupabaseTradeMessage形式に変換
  const supabaseMessages: SupabaseTradeMessage[] = useMemo(() => {
    if (!tradeRoom) return []
    return tradeRoom.messages.map(m => ({
      id: m.id,
      stamp_id: (m.messageType === 'preset' || m.messageType === 'stamp') ? m.content : null,
      user_id: m.senderId,
      created_at: m.createdAt,
      message_type: (m.messageType === 'sticker_added' || m.messageType === 'sticker_removed' || m.messageType === 'system')
        ? 'text' as const
        : m.messageType as 'stamp' | 'text' | 'preset',
      content: (m.messageType === 'preset' || m.messageType === 'stamp') ? m.content : (m.displayText || m.content || null),
    }))
  }, [tradeRoom])

  // 自分のリクエスト（欲しいシール）をSupabaseTradeItem形式に変換
  // myRequests = 相手のシール帳から選択した欲しいシール
  const supabaseMyItems: SupabaseTradeItem[] = useMemo(() => {
    if (!tradeRoom) return []
    return tradeRoom.myRequests.map(r => ({
      id: r.id,
      user_id: r.requesterId,
      user_sticker_id: r.targetUserStickerId,
      sticker_id: r.sticker?.id,
    }))
  }, [tradeRoom])

  // 相手のリクエスト（相手が欲しがっているシール）をSupabaseTradeItem形式に変換
  // partnerRequests = 相手が私のシール帳から選択した欲しいシール
  const supabasePartnerItems: SupabaseTradeItem[] = useMemo(() => {
    if (!tradeRoom) return []
    return tradeRoom.partnerRequests.map(r => ({
      id: r.id,
      user_id: r.requesterId,
      user_sticker_id: r.targetUserStickerId,
      sticker_id: r.sticker?.id,
    }))
  }, [tradeRoom])

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
      {/* タブ切り替え（セッション表示中は非表示） */}
      {!asyncSessionId && (
        <div
          className="flex gap-2 mx-4 mt-4 p-1.5 rounded-2xl"
          style={{ background: 'rgba(212, 196, 176, 0.3)' }}
        >
          <TabButton
            label="リアルタイム"
            emoji="⚡"
            isActive={activeTab === 'realtime'}
            onClick={() => setActiveTab('realtime')}
          />
          <TabButton
            label="メッセージ"
            emoji="💬"
            isActive={activeTab === 'async'}
            onClick={() => setActiveTab('async')}
            badgeCount={asyncBadgeCount}
          />
        </div>
      )}

      {/* コンテンツ */}
      <div className="flex-1 overflow-hidden">
        {asyncSessionId && userId && tradeRoom && partnerUser && myUser && myPages ? (
          // 非同期交換セッション画面（TradeSessionFullを使用）
          isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div
                className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: '#C4956A', borderTopColor: 'transparent' }}
              />
            </div>
          ) : (
            <TradeSessionFull
              myUser={myUser}
              partnerUser={partnerUser}
              myPages={myPages}
              partnerPages={partnerPages}
              myCoverDesignId={myCoverDesignId}
              partnerCoverDesignId={partnerCoverDesignId}
              onTradeComplete={(myOffers, partnerOffers) => {
                console.log('[AsyncTrade] Trade complete:', myOffers, partnerOffers)
                handleTradeComplete()
              }}
              onBack={handleBack}
              onEndNegotiation={handleCloseSession}
              onFollowPartner={(partnerId) => {
                console.log('[AsyncTrade] Follow partner:', partnerId)
              }}
              isFriend={isFriend}
              isFollowingPartner={isFollowingPartner}
              // Supabase連携用props
              supabaseMessages={supabaseMessages}
              onSendStamp={handleSendStamp}
              onSendText={handleSendText}
              partnerReady={partnerConfirmed}
              onSetReady={handleSetReady}
              // シール選択の同期用props
              supabaseMyItems={supabaseMyItems}
              supabasePartnerItems={supabasePartnerItems}
              onSelectMySticker={handleSelectMySticker}
              onDeselectMySticker={handleDeselectMySticker}
              tradeCompleted={tradeCompleted}
            />
          )
        ) : asyncSessionId && isLoading ? (
          // ローディング中
          <div className="flex items-center justify-center h-full">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: '#C4956A', borderTopColor: 'transparent' }}
            />
          </div>
        ) : activeTab === 'async' ? (
          // 非同期交換リスト
          userId ? (
            <AsyncTradeListView
              userId={userId}
              onSelectSession={handleSelectSession}
              onInviteUser={() => setShowInviteModal(true)}
              onAcceptInvitation={(sessionId) => handleSelectSession(sessionId)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p style={{ color: '#A67C52' }}>ログインしてください</p>
            </div>
          )
        ) : (
          // リアルタイム交換（従来のUI）
          <div className="overflow-y-auto pb-4 px-4 h-full">
            {/* マッチングセクション */}
            <section className="mb-6 mt-4">
              <SectionHeader icon={<SparkleIcon size={20} color="#D4A574" />} title="ランダムこうかん" />
              <MatchingButton onClick={onStartMatching} />
              <p className="text-xs text-center mt-2" style={{ color: '#A67C52' }}>
                おすと ともだちが みつかるよ
              </p>
            </section>

            {/* オンラインフレンド表示 */}
            {onlineFriends.length > 0 && (
              <div
                className="mb-4 px-3 py-2.5 rounded-2xl"
                style={{
                  background: 'rgba(125, 175, 114, 0.15)',
                  border: '1px solid rgba(125, 175, 114, 0.3)',
                }}
              >
                <p className="text-sm" style={{ color: '#5A8A4A' }}>
                  <span className="font-bold">{onlineFriends.length}人</span>のともだちがオンライン中！
                </p>
              </div>
            )}

            {/* フレンドセクション */}
            <section className="mb-6">
              <SectionHeader
                icon="👫"
                title="シールフレンド"
                action={
                  friends.length > 4
                    ? {
                        label: showAllFriends ? 'とじる' : 'すべてみる',
                        onClick: () => setShowAllFriends(!showAllFriends)
                      }
                    : undefined
                }
              />

              {friends.length > 0 ? (
                <div className="space-y-2">
                  {displayFriends.map(friend => (
                    <FriendCard
                      key={friend.id}
                      friend={friend}
                      onTrade={() => onTradeWithFriend(friend.id)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-8 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid #D4C4B0',
                    boxShadow: '0 2px 8px rgba(184, 149, 107, 0.1)',
                  }}
                >
                  <div className="text-4xl mb-2">👋</div>
          <p className="text-sm" style={{ color: '#8B5A2B' }}>
            まだともだちがいないよ
          </p>
          <p className="text-xs mt-1" style={{ color: '#A67C52' }}>
            まずは まっちんぐ してみよう
          </p>
          <button
            onClick={onStartMatching}
            className="mt-3 px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(184, 149, 107, 0.35)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            まっちんぐする
          </button>
        </div>
      )}
            </section>

            {/* 交換履歴セクション */}
            <section>
              <SectionHeader
                icon="📜"
                title="こうかんりれき"
                action={
                  history.length > 3
                    ? {
                        label: showAllHistory ? 'とじる' : 'すべてみる',
                        onClick: () => setShowAllHistory(!showAllHistory)
                      }
                    : undefined
                }
              />

              {history.length > 0 ? (
                <div className="space-y-2">
                  {displayHistory.map(item => (
                    <HistoryCard
                      key={item.id}
                      history={item}
                      onClick={() => onViewHistory(item.id)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-6 rounded-2xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid #D4C4B0',
                    boxShadow: '0 2px 8px rgba(184, 149, 107, 0.1)',
                  }}
                >
                  <div className="text-3xl mb-2">📭</div>
          <p className="text-sm" style={{ color: '#A67C52' }}>
            まだこうかんしていないよ
          </p>
          <button
            onClick={onStartMatching}
            className="mt-3 px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(184, 149, 107, 0.35)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            まっちんぐする
          </button>
        </div>
      )}
            </section>
          </div>
        )}
      </div>

      {/* モーダル類 */}
      {userId && (
        <AsyncTradeInviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          currentUserId={userId}
          onInviteSent={handleInviteSent}
        />
      )}
    </div>
  )
}

export default TradeView
