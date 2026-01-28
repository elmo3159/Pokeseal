// 非同期交換サービス
import { getSupabase } from '@/services/supabase'
import { calculateLevel } from '@/domain/levelSystem'

// 交換セッションのステータス
export type TradeSessionStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'declined' | 'expired'

// 定型メッセージ（TradeSessionFullのSTAMPSと同じキーを使用）
export const TRADE_PRESET_MESSAGES = {
  please: { text: 'おねがい！', emoji: '🙏✨' },
  thinking: { text: 'うーん...', emoji: '🤔💭' },
  addMore: { text: 'もっと！', emoji: '➕🌟' },
  ok: { text: 'いいよ！', emoji: '🎉🤝' },
  thanks: { text: 'ありがとう！', emoji: '💕' },
  cute: { text: 'かわいい～', emoji: '🩷' },
  no: { text: 'ムリ...', emoji: '😢💦' },
  wait: { text: 'まってね', emoji: '⏳' },
  this: { text: 'これ！', emoji: '👀✨' },
  rare: { text: 'レア！', emoji: '🌟✨' },
  instead: { text: 'かわりに？', emoji: '🔄' },
  great: { text: 'オッケー！', emoji: '👍✨' },
} as const

export type PresetMessageKey = keyof typeof TRADE_PRESET_MESSAGES

// システムメッセージ
export const SYSTEM_MESSAGES = {
  sticker_unavailable_offer: 'オファーしていたシールが使えなくなりました',
  sticker_unavailable_request: 'リクエストしていたシールが使えなくなりました',
  trade_completed: '交換が成立しました！🎉',
  session_expired: 'この交換は期限切れになりました',
  confirmed: 'こうかん OK！',
  unconfirmed: 'やっぱり やめる！',
} as const

// 交換セッション
export interface TradeSession {
  id: string
  requesterId: string
  responderId: string
  status: TradeSessionStatus
  requesterConfirmed: boolean
  responderConfirmed: boolean
  requesterConfirmedAt?: string
  responderConfirmedAt?: string
  completedAt?: string
  expiresAt: string
  createdAt: string
  updatedAt: string
  // 追加情報
  partner?: {
    id: string
    username: string
    displayName?: string
    avatarUrl?: string
    level?: number
    selectedFrameId?: string | null
  }
  unreadCount?: number
}

// 交換オファー（出すシール）
export interface TradeOffer {
  id: string
  sessionId: string
  userId: string
  userStickerId: string
  sticker?: {
    id: string
    name: string
    imageUrl: string
    rarity: number
    upgradeRank?: number
  }
  createdAt: string
}

// 交換リクエスト（欲しいシール）
export interface TradeRequest {
  id: string
  sessionId: string
  requesterId: string
  targetUserStickerId: string
  sticker?: {
    id: string
    name: string
    imageUrl: string
    rarity: number
    upgradeRank?: number
  }
  createdAt: string
}

// 交換メッセージ
export interface TradeMessage {
  id: string
  sessionId: string
  senderId: string
  messageType: 'preset' | 'sticker_added' | 'sticker_removed' | 'system'
  content: string
  isRead: boolean
  createdAt: string
  // 展開後の内容
  displayText?: string
  emoji?: string
}

// 交換ルームの詳細情報
export interface TradeRoomDetails {
  session: TradeSession
  myOffers: TradeOffer[]
  partnerOffers: TradeOffer[]
  myRequests: TradeRequest[]
  partnerRequests: TradeRequest[]
  messages: TradeMessage[]
  isPartnerOnline: boolean
  partnerLastSeen?: string
}

export const asyncTradeService = {
  // =============================================
  // セッション管理
  // =============================================

  /**
   * 交換に招待する
   */
  async inviteToTrade(requesterId: string, responderId: string): Promise<TradeSession | null> {
    const supabase = getSupabase()

    // 既存のアクティブなセッションがあるかチェック
    const { data: existing } = await supabase
      .from('async_trade_sessions')
      .select('id')
      .or(`and(requester_id.eq.${requesterId},responder_id.eq.${responderId}),and(requester_id.eq.${responderId},responder_id.eq.${requesterId})`)
      .in('status', ['pending', 'active'])
      .single()

    if (existing) {
      console.log('[AsyncTrade] Active session already exists:', existing.id)
      return null
    }

    const { data, error } = await supabase
      .from('async_trade_sessions')
      .insert({
        requester_id: requesterId,
        responder_id: responderId,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('[AsyncTrade] Create session error:', error)
      return null
    }

    return this.mapSession(data)
  },

  /**
   * 交換招待を承諾する
   */
  async acceptInvitation(sessionId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('async_trade_sessions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .eq('responder_id', userId)
      .eq('status', 'pending')

    if (error) {
      console.error('[AsyncTrade] Accept invitation error:', error)
      return false
    }

    // システムメッセージを追加
    await this.sendSystemMessage(sessionId, userId, '交換を開始しました！')

    return true
  },

  /**
   * 交換招待を拒否する
   */
  async declineInvitation(sessionId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('async_trade_sessions')
      .update({
        status: 'declined',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .eq('responder_id', userId)
      .eq('status', 'pending')

    return !error
  },

  /**
   * 交換をキャンセルする
   */
  async cancelTrade(sessionId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('async_trade_sessions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .or(`requester_id.eq.${userId},responder_id.eq.${userId}`)
      .in('status', ['pending', 'active'])

    return !error
  },

  /**
   * 自分の交換セッション一覧を取得
   */
  async getMySessions(userId: string): Promise<TradeSession[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('async_trade_sessions')
      .select(`
        *,
        requester:profiles!async_trade_sessions_requester_id_fkey(id, username, display_name, avatar_url, total_exp, selected_frame_id),
        responder:profiles!async_trade_sessions_responder_id_fkey(id, username, display_name, avatar_url, total_exp, selected_frame_id)
      `)
      .or(`requester_id.eq.${userId},responder_id.eq.${userId}`)
      .in('status', ['pending', 'active'])
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('[AsyncTrade] Get sessions error:', error)
      return []
    }

    return data.map((s: Record<string, unknown>) => {
      const session = this.mapSession(s)
      // パートナー情報を設定
      const isRequester = s.requester_id === userId
      const partnerData = isRequester ? s.responder : s.requester
      if (partnerData && typeof partnerData === 'object') {
        const p = partnerData as Record<string, unknown>
        session.partner = {
          id: p.id as string,
          username: p.username as string,
          displayName: p.display_name as string | undefined,
          avatarUrl: p.avatar_url as string | undefined,
          level: calculateLevel((p.total_exp as number) || 0),
          selectedFrameId: p.selected_frame_id as string | null,
        }
      }
      return session
    })
  },

  /**
   * 受信した招待一覧を取得
   */
  async getPendingInvitations(userId: string): Promise<TradeSession[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('async_trade_sessions')
      .select(`
        *,
        requester:profiles!async_trade_sessions_requester_id_fkey(id, username, display_name, avatar_url, total_exp, selected_frame_id)
      `)
      .eq('responder_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[AsyncTrade] Get invitations error:', error)
      return []
    }

    return data.map((s: Record<string, unknown>) => {
      const session = this.mapSession(s)
      const requesterData = s.requester
      if (requesterData && typeof requesterData === 'object') {
        const r = requesterData as Record<string, unknown>
        session.partner = {
          id: r.id as string,
          username: r.username as string,
          displayName: r.display_name as string | undefined,
          avatarUrl: r.avatar_url as string | undefined,
          level: calculateLevel((r.total_exp as number) || 0),
          selectedFrameId: r.selected_frame_id as string | null,
        }
      }
      return session
    })
  },

  // =============================================
  // 交換ルーム
  // =============================================

  /**
   * 交換ルームの詳細を取得
   */
  async getTradeRoom(sessionId: string, userId: string): Promise<TradeRoomDetails | null> {
    const supabase = getSupabase()

    // セッション情報
    const { data: sessionData, error: sessionError } = await supabase
      .from('async_trade_sessions')
      .select(`
        *,
        requester:profiles!async_trade_sessions_requester_id_fkey(id, username, display_name, avatar_url, total_exp, selected_frame_id, last_seen_at),
        responder:profiles!async_trade_sessions_responder_id_fkey(id, username, display_name, avatar_url, total_exp, selected_frame_id, last_seen_at)
      `)
      .eq('id', sessionId)
      .or(`requester_id.eq.${userId},responder_id.eq.${userId}`)
      .single()

    if (sessionError || !sessionData) {
      console.error('[AsyncTrade] Get trade room error:', sessionError)
      return null
    }

    const session = this.mapSession(sessionData)
    const isRequester = sessionData.requester_id === userId
    const partnerId = isRequester ? sessionData.responder_id : sessionData.requester_id
    const partnerData = isRequester ? sessionData.responder : sessionData.requester

    if (partnerData && typeof partnerData === 'object') {
      const p = partnerData as Record<string, unknown>
      session.partner = {
        id: p.id as string,
        username: p.username as string,
        displayName: p.display_name as string | undefined,
        avatarUrl: p.avatar_url as string | undefined,
        level: calculateLevel((p.total_exp as number) || 0),
        selectedFrameId: p.selected_frame_id as string | null,
      }
    }

    // オファー取得
    const { data: offers } = await supabase
      .from('async_trade_offers')
      .select(`
        *,
        user_sticker:user_stickers(
          id,
          upgrade_rank,
          sticker:stickers(id, name, image_url, rarity)
        )
      `)
      .eq('session_id', sessionId)

    const myOffers: TradeOffer[] = []
    const partnerOffers: TradeOffer[] = []

    for (const offer of offers || []) {
      const mapped = this.mapOffer(offer)
      if (offer.user_id === userId) {
        myOffers.push(mapped)
      } else {
        partnerOffers.push(mapped)
      }
    }

    // リクエスト取得
    const { data: requests } = await supabase
      .from('async_trade_requests')
      .select(`
        *,
        user_sticker:user_stickers(
          id,
          upgrade_rank,
          sticker:stickers(id, name, image_url, rarity)
        )
      `)
      .eq('session_id', sessionId)

    const myRequests: TradeRequest[] = []
    const partnerRequests: TradeRequest[] = []

    for (const request of requests || []) {
      const mapped = this.mapRequest(request)
      if (request.requester_id === userId) {
        myRequests.push(mapped)
      } else {
        partnerRequests.push(mapped)
      }
    }

    // メッセージ取得
    const { data: messages } = await supabase
      .from('async_trade_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(100)

    const mappedMessages = (messages || []).map((m: Record<string, unknown>) => this.mapMessage(m))

    // 未読メッセージを既読にする
    await supabase
      .from('async_trade_messages')
      .update({ is_read: true })
      .eq('session_id', sessionId)
      .neq('sender_id', userId)
      .eq('is_read', false)

    // パートナーのオンライン状態（5分以内なら online）
    let isPartnerOnline = false
    let partnerLastSeen: string | undefined

    if (partnerData && typeof partnerData === 'object') {
      const p = partnerData as Record<string, unknown>
      if (p.last_seen_at) {
        const lastSeen = new Date(p.last_seen_at as string)
        const now = new Date()
        const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60)
        isPartnerOnline = diffMinutes < 5
        partnerLastSeen = p.last_seen_at as string
      }
    }

    return {
      session,
      myOffers,
      partnerOffers,
      myRequests,
      partnerRequests,
      messages: mappedMessages,
      isPartnerOnline,
      partnerLastSeen,
    }
  },

  // =============================================
  // オファー・リクエスト操作
  // =============================================

  /**
   * シールをオファーに追加（自分が出すシール）
   */
  async addOffer(sessionId: string, userId: string, userStickerId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('async_trade_offers')
      .insert({
        session_id: sessionId,
        user_id: userId,
        user_sticker_id: userStickerId,
      })

    if (error) {
      console.error('[AsyncTrade] Add offer error:', error)
      return false
    }

    // 確認状態をリセット
    await this.resetConfirmations(sessionId)

    // メッセージ追加
    await this.sendMessage(sessionId, userId, 'sticker_added', 'シールを追加しました')

    return true
  },

  /**
   * オファーからシールを削除
   */
  async removeOffer(sessionId: string, userId: string, userStickerId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('async_trade_offers')
      .delete()
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .eq('user_sticker_id', userStickerId)

    if (error) {
      console.error('[AsyncTrade] Remove offer error:', error)
      return false
    }

    // 確認状態をリセット
    await this.resetConfirmations(sessionId)

    return true
  },

  /**
   * シールをリクエストに追加（相手から欲しいシール）
   */
  async addRequest(sessionId: string, requesterId: string, targetUserStickerId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('async_trade_requests')
      .insert({
        session_id: sessionId,
        requester_id: requesterId,
        target_user_sticker_id: targetUserStickerId,
      })

    if (error) {
      console.error('[AsyncTrade] Add request error:', error)
      return false
    }

    // 確認状態をリセット
    await this.resetConfirmations(sessionId)

    return true
  },

  /**
   * リクエストからシールを削除
   */
  async removeRequest(sessionId: string, requesterId: string, targetUserStickerId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('async_trade_requests')
      .delete()
      .eq('session_id', sessionId)
      .eq('requester_id', requesterId)
      .eq('target_user_sticker_id', targetUserStickerId)

    if (error) {
      console.error('[AsyncTrade] Remove request error:', error)
      return false
    }

    // 確認状態をリセット
    await this.resetConfirmations(sessionId)

    return true
  },

  // =============================================
  // 確認・成立
  // =============================================

  /**
   * 交換内容を確認する（OKボタン）
   */
  async confirmTrade(sessionId: string, userId: string): Promise<{ confirmed: boolean; completed: boolean }> {
    const supabase = getSupabase()

    // セッション情報を取得
    const { data: session } = await supabase
      .from('async_trade_sessions')
      .select('requester_id, responder_id, requester_confirmed, responder_confirmed')
      .eq('id', sessionId)
      .eq('status', 'active')
      .single()

    if (!session) {
      console.log('[AsyncTrade] confirmTrade: Session not found or not active')
      return { confirmed: false, completed: false }
    }

    const isRequester = session.requester_id === userId
    const updateField = isRequester ? 'requester_confirmed' : 'responder_confirmed'
    const updateTimeField = isRequester ? 'requester_confirmed_at' : 'responder_confirmed_at'

    console.log('[AsyncTrade] confirmTrade: Updating confirmation', {
      sessionId,
      userId,
      isRequester,
      updateField,
    })

    // 確認を更新
    const { error: updateError } = await supabase
      .from('async_trade_sessions')
      .update({
        [updateField]: true,
        [updateTimeField]: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)

    if (updateError) {
      console.error('[AsyncTrade] Confirm trade error:', updateError)
      return { confirmed: false, completed: false }
    }

    // メッセージ追加
    await this.sendMessage(sessionId, userId, 'system', SYSTEM_MESSAGES.confirmed)

    // 更新後のセッション状態を再取得して、両者の確認状態を確認
    const { data: updatedSession } = await supabase
      .from('async_trade_sessions')
      .select('requester_confirmed, responder_confirmed, status')
      .eq('id', sessionId)
      .single()

    console.log('[AsyncTrade] confirmTrade: Updated session state', {
      sessionId,
      requesterConfirmed: updatedSession?.requester_confirmed,
      responderConfirmed: updatedSession?.responder_confirmed,
      status: updatedSession?.status,
    })

    // 両者が確認済みかつアクティブなら交換成立を試みる
    if (updatedSession?.requester_confirmed && updatedSession?.responder_confirmed && updatedSession?.status === 'active') {
      console.log('[AsyncTrade] confirmTrade: Both confirmed, calling complete RPC...')

      const { data: completed, error: rpcError } = await supabase
        .rpc('complete_async_trade_session', { p_session_id: sessionId })

      if (rpcError) {
        console.error('[AsyncTrade] complete_async_trade_session RPC error:', rpcError)
        return { confirmed: true, completed: false }
      }

      console.log('[AsyncTrade] confirmTrade: RPC result', { completed })
      return { confirmed: true, completed: !!completed }
    }

    console.log('[AsyncTrade] confirmTrade: Waiting for other user to confirm')
    return { confirmed: true, completed: false }
  },

  /**
   * 確認を取り消す
   */
  async unconfirmTrade(sessionId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase()

    // セッション情報を取得
    const { data: session } = await supabase
      .from('async_trade_sessions')
      .select('requester_id')
      .eq('id', sessionId)
      .eq('status', 'active')
      .single()

    if (!session) return false

    const isRequester = session.requester_id === userId
    const updateField = isRequester ? 'requester_confirmed' : 'responder_confirmed'
    const updateTimeField = isRequester ? 'requester_confirmed_at' : 'responder_confirmed_at'

    const { error } = await supabase
      .from('async_trade_sessions')
      .update({
        [updateField]: false,
        [updateTimeField]: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)

    if (error) return false

    await this.sendMessage(sessionId, userId, 'system', SYSTEM_MESSAGES.unconfirmed)

    return true
  },

  /**
   * 確認状態をリセット（シール変更時）
   */
  async resetConfirmations(sessionId: string): Promise<void> {
    const supabase = getSupabase()

    await supabase
      .from('async_trade_sessions')
      .update({
        requester_confirmed: false,
        responder_confirmed: false,
        requester_confirmed_at: null,
        responder_confirmed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .or('requester_confirmed.eq.true,responder_confirmed.eq.true')
  },

  // =============================================
  // メッセージ
  // =============================================

  /**
   * 定型メッセージを送信
   */
  async sendPresetMessage(sessionId: string, senderId: string, presetKey: PresetMessageKey): Promise<boolean> {
    return this.sendMessage(sessionId, senderId, 'preset', presetKey)
  },

  /**
   * メッセージを送信
   */
  async sendMessage(
    sessionId: string,
    senderId: string,
    messageType: 'preset' | 'sticker_added' | 'sticker_removed' | 'system',
    content: string
  ): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('async_trade_messages')
      .insert({
        session_id: sessionId,
        sender_id: senderId,
        message_type: messageType,
        content,
      })

    return !error
  },

  /**
   * システムメッセージを送信
   */
  async sendSystemMessage(sessionId: string, senderId: string, content: string): Promise<boolean> {
    return this.sendMessage(sessionId, senderId, 'system', content)
  },

  /**
   * 未読メッセージ数を取得
   */
  async getUnreadCount(sessionId: string, userId: string): Promise<number> {
    const supabase = getSupabase()

    const { count } = await supabase
      .from('async_trade_messages')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId)
      .neq('sender_id', userId)
      .eq('is_read', false)

    return count || 0
  },

  // =============================================
  // バッジカウント
  // =============================================

  /**
   * 交換タブのバッジカウントを取得（pending招待数 + 未読メッセージ数）
   */
  async getTradeBadgeCount(userId: string): Promise<number> {
    const supabase = getSupabase()

    // pending招待数
    const { count: pendingCount } = await supabase
      .from('async_trade_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('responder_id', userId)
      .eq('status', 'pending')

    // active sessionの未読メッセージ数
    const { data: activeSessions } = await supabase
      .from('async_trade_sessions')
      .select('id')
      .or(`requester_id.eq.${userId},responder_id.eq.${userId}`)
      .eq('status', 'active')

    let unreadCount = 0
    if (activeSessions && activeSessions.length > 0) {
      const sessionIds = activeSessions.map(s => s.id)
      const { count } = await supabase
        .from('async_trade_messages')
        .select('*', { count: 'exact', head: true })
        .in('session_id', sessionIds)
        .neq('sender_id', userId)
        .eq('is_read', false)
      unreadCount = count || 0
    }

    return (pendingCount || 0) + unreadCount
  },

  // =============================================
  // ヘルパー
  // =============================================

  mapSession(data: Record<string, unknown>): TradeSession {
    return {
      id: data.id as string,
      requesterId: data.requester_id as string,
      responderId: data.responder_id as string,
      status: data.status as TradeSessionStatus,
      requesterConfirmed: data.requester_confirmed as boolean,
      responderConfirmed: data.responder_confirmed as boolean,
      requesterConfirmedAt: data.requester_confirmed_at as string | undefined,
      responderConfirmedAt: data.responder_confirmed_at as string | undefined,
      completedAt: data.completed_at as string | undefined,
      expiresAt: data.expires_at as string,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    }
  },

  mapOffer(data: Record<string, unknown>): TradeOffer {
    const userSticker = data.user_sticker as Record<string, unknown> | null
    const stickerData = userSticker?.sticker as Record<string, unknown> | null

    return {
      id: data.id as string,
      sessionId: data.session_id as string,
      userId: data.user_id as string,
      userStickerId: data.user_sticker_id as string,
      sticker: stickerData ? {
        id: stickerData.id as string,
        name: stickerData.name as string,
        imageUrl: stickerData.image_url as string,
        rarity: stickerData.rarity as number,
        upgradeRank: userSticker?.upgrade_rank as number | undefined,
      } : undefined,
      createdAt: data.created_at as string,
    }
  },

  mapRequest(data: Record<string, unknown>): TradeRequest {
    const userSticker = data.user_sticker as Record<string, unknown> | null
    const stickerData = userSticker?.sticker as Record<string, unknown> | null

    return {
      id: data.id as string,
      sessionId: data.session_id as string,
      requesterId: data.requester_id as string,
      targetUserStickerId: data.target_user_sticker_id as string,
      sticker: stickerData ? {
        id: stickerData.id as string,
        name: stickerData.name as string,
        imageUrl: stickerData.image_url as string,
        rarity: stickerData.rarity as number,
        upgradeRank: userSticker?.upgrade_rank as number | undefined,
      } : undefined,
      createdAt: data.created_at as string,
    }
  },

  mapMessage(data: Record<string, unknown>): TradeMessage {
    const messageType = data.message_type as string
    const content = data.content as string

    let displayText = content
    let emoji: string | undefined

    if (messageType === 'preset' && content in TRADE_PRESET_MESSAGES) {
      const preset = TRADE_PRESET_MESSAGES[content as PresetMessageKey]
      displayText = preset.text
      emoji = preset.emoji
    } else if (messageType === 'system' && content in SYSTEM_MESSAGES) {
      displayText = SYSTEM_MESSAGES[content as keyof typeof SYSTEM_MESSAGES]
    }

    return {
      id: data.id as string,
      sessionId: data.session_id as string,
      senderId: data.sender_id as string,
      messageType: messageType as TradeMessage['messageType'],
      content,
      isRead: data.is_read as boolean,
      createdAt: data.created_at as string,
      displayText,
      emoji,
    }
  },
}

export default asyncTradeService
