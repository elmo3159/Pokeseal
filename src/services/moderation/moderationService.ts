// モデレーション・管理サービス
// 通報、ブロック、管理者機能を提供

import { getSupabase } from '@/services/supabase'

// =============================================
// 型定義
// =============================================

export type ReportCategory = 'spam' | 'inappropriate' | 'harassment' | 'cheating' | 'impersonation' | 'other'
export type ReportStatus = 'pending' | 'reviewing' | 'reviewed' | 'resolved' | 'dismissed'
export type ReportPriority = 'low' | 'normal' | 'high' | 'urgent'
export type TargetType = 'user' | 'post' | 'trade' | 'comment'

export interface Report {
  id: string
  reporterId: string
  targetType: TargetType
  targetId: string
  category: ReportCategory
  description: string | null
  status: ReportStatus
  priority: ReportPriority
  adminId: string | null
  adminNotes: string | null
  actionTaken: string | null
  resolvedAt: string | null
  createdAt: string
  updatedAt: string
  // 関連データ
  reporter?: {
    id: string
    displayName: string
    avatarUrl: string | null
  }
  targetUser?: {
    id: string
    displayName: string
    avatarUrl: string | null
  }
}

export interface UserBlock {
  id: string
  blockerId: string
  blockedId: string
  reason: string | null
  createdAt: string
  // 関連データ
  blockedUser?: {
    id: string
    displayName: string
    avatarUrl: string | null
  }
}

export interface AdminUser {
  id: string
  userId: string | null
  email: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: string[]
  isActive: boolean
  createdAt: string
}

export interface AdminAction {
  id: string
  adminId: string
  actionType: string
  targetType: string
  targetId: string
  reason: string | null
  details: Record<string, unknown>
  createdAt: string
}

// カテゴリの日本語ラベル
export const REPORT_CATEGORY_LABELS: Record<ReportCategory, string> = {
  spam: 'スパム・宣伝',
  inappropriate: '不適切なコンテンツ',
  harassment: 'いやがらせ・いじめ',
  cheating: 'チート・不正行為',
  impersonation: 'なりすまし',
  other: 'その他',
}

// カテゴリの説明
export const REPORT_CATEGORY_DESCRIPTIONS: Record<ReportCategory, string> = {
  spam: '宣伝や迷惑行為',
  inappropriate: '子どもにふさわしくない内容',
  harassment: 'いやな言葉やいじめ',
  cheating: 'ズルをしている',
  impersonation: '他の人のふりをしている',
  other: 'その他の問題',
}

// =============================================
// 通報機能
// =============================================

export const moderationService = {
  /**
   * 通報を作成
   */
  async createReport(
    reporterId: string,
    targetType: TargetType,
    targetId: string,
    category: ReportCategory,
    description?: string
  ): Promise<Report | null> {
    const supabase = getSupabase()

    // 既に同じ通報が存在するかチェック
    const { data: existing } = await supabase
      .from('reports')
      .select('id')
      .eq('reporter_id', reporterId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .in('status', ['pending', 'reviewing'])
      .single()

    if (existing) {
      console.log('[Moderation] Report already exists:', existing.id)
      return null
    }

    const { data, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: reporterId,
        target_type: targetType,
        target_id: targetId,
        category,
        description: description || null,
        status: 'pending',
        priority: 'normal',
      })
      .select()
      .single()

    if (error) {
      console.error('[Moderation] Create report error:', error)
      return null
    }

    console.log('[Moderation] Report created:', data.id)
    return this.mapReport(data)
  },

  /**
   * 自分の通報履歴を取得
   */
  async getMyReports(userId: string): Promise<Report[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('reporter_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Moderation] Get my reports error:', error)
      return []
    }

    return data.map(r => this.mapReport(r))
  },

  // =============================================
  // ブロック機能
  // =============================================

  /**
   * ユーザーをブロック
   */
  async blockUser(blockerId: string, blockedId: string, reason?: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('user_blocks')
      .insert({
        blocker_id: blockerId,
        blocked_id: blockedId,
        reason: reason || null,
      })

    if (error) {
      // 既にブロック済みの場合は成功として扱う
      if (error.code === '23505') {
        console.log('[Moderation] User already blocked')
        return true
      }
      console.error('[Moderation] Block user error:', error)
      return false
    }

    console.log('[Moderation] User blocked:', blockedId)
    return true
  },

  /**
   * ブロックを解除
   */
  async unblockUser(blockerId: string, blockedId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('user_blocks')
      .delete()
      .eq('blocker_id', blockerId)
      .eq('blocked_id', blockedId)

    if (error) {
      console.error('[Moderation] Unblock user error:', error)
      return false
    }

    console.log('[Moderation] User unblocked:', blockedId)
    return true
  },

  /**
   * ブロックしているユーザー一覧を取得
   */
  async getBlockedUsers(userId: string): Promise<UserBlock[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('user_blocks')
      .select(`
        *,
        blocked:profiles!user_blocks_blocked_id_fkey(id, display_name, avatar_url)
      `)
      .eq('blocker_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Moderation] Get blocked users error:', error)
      return []
    }

    return data.map(b => this.mapUserBlock(b))
  },

  /**
   * 特定のユーザーをブロックしているかチェック
   */
  async isBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { data } = await supabase
      .rpc('is_user_blocked', { checker_id: blockerId, target_id: blockedId })

    return !!data
  },

  /**
   * 相互ブロックチェック（どちらかがブロックしていればtrue）
   */
  async isMutuallyBlocked(user1Id: string, user2Id: string): Promise<boolean> {
    const supabase = getSupabase()

    const { data } = await supabase
      .rpc('is_mutually_blocked', { user1_id: user1Id, user2_id: user2Id })

    return !!data
  },

  /**
   * ブロックしているユーザーIDリストを取得
   */
  async getBlockedUserIds(userId: string): Promise<string[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('user_blocks')
      .select('blocked_id')
      .eq('blocker_id', userId)

    if (error) {
      console.error('[Moderation] Get blocked user IDs error:', error)
      return []
    }

    return data.map(b => b.blocked_id)
  },

  /**
   * 自分をブロックしているユーザーIDリストを取得
   */
  async getBlockedByUserIds(userId: string): Promise<string[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('user_blocks')
      .select('blocker_id')
      .eq('blocked_id', userId)

    if (error) {
      console.error('[Moderation] Get blocked by user IDs error:', error)
      return []
    }

    return data.map(b => b.blocker_id)
  },

  // =============================================
  // 管理者機能
  // =============================================

  /**
   * 管理者かどうかチェック
   */
  async isAdmin(userId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { data } = await supabase
      .rpc('is_admin', { check_user_id: userId })

    return !!data
  },

  /**
   * 全通報を取得（管理者用）
   */
  async getAllReports(options?: {
    status?: ReportStatus
    priority?: ReportPriority
    limit?: number
    offset?: number
  }): Promise<Report[]> {
    const supabase = getSupabase()

    let query = supabase
      .from('reports')
      .select(`
        *,
        reporter:profiles!reports_reporter_id_fkey(id, display_name, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (options?.status) {
      query = query.eq('status', options.status)
    }
    if (options?.priority) {
      query = query.eq('priority', options.priority)
    }
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('[Moderation] Get all reports error:', error)
      return []
    }

    return data.map(r => this.mapReport(r))
  },

  /**
   * 通報のステータスを更新（管理者用）
   */
  async updateReportStatus(
    reportId: string,
    adminId: string,
    status: ReportStatus,
    notes?: string,
    actionTaken?: string
  ): Promise<boolean> {
    const supabase = getSupabase()

    const updateData: Record<string, unknown> = {
      status,
      admin_notes: notes,
      updated_at: new Date().toISOString(),
    }

    if (status === 'resolved' || status === 'dismissed') {
      updateData.resolved_at = new Date().toISOString()
      updateData.action_taken = actionTaken
    }

    const { error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', reportId)

    if (error) {
      console.error('[Moderation] Update report status error:', error)
      return false
    }

    // アクションログを記録
    await this.logAdminAction(
      adminId,
      status === 'resolved' ? 'report_resolved' : status === 'dismissed' ? 'report_dismissed' : 'report_reviewed',
      'report',
      reportId,
      notes
    )

    return true
  },

  /**
   * ユーザーを停止（管理者用）
   */
  async suspendUser(
    adminId: string,
    userId: string,
    suspensionType: 'warning' | 'temporary' | 'permanent',
    reason: string,
    durationDays?: number,
    relatedReportId?: string
  ): Promise<boolean> {
    const supabase = getSupabase()

    const endsAt = suspensionType === 'temporary' && durationDays
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
      : null

    // 停止レコードを作成
    const { error: suspensionError } = await supabase
      .from('user_suspensions')
      .insert({
        user_id: userId,
        suspension_type: suspensionType,
        reason,
        related_report_id: relatedReportId,
        ends_at: endsAt,
      })

    if (suspensionError) {
      console.error('[Moderation] Create suspension error:', suspensionError)
      return false
    }

    // プロフィールを更新
    if (suspensionType !== 'warning') {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_suspended: true,
          suspended_until: endsAt,
          suspension_reason: reason,
        })
        .eq('id', userId)

      if (profileError) {
        console.error('[Moderation] Update profile suspension error:', profileError)
        return false
      }
    }

    // アクションログを記録
    await this.logAdminAction(
      adminId,
      suspensionType === 'permanent' ? 'user_banned' : 'user_suspended',
      'user',
      userId,
      reason,
      { suspensionType, durationDays, relatedReportId }
    )

    return true
  },

  /**
   * ユーザーの停止を解除（管理者用）
   */
  async unsuspendUser(adminId: string, userId: string, reason: string): Promise<boolean> {
    const supabase = getSupabase()

    // 停止レコードを無効化
    const { error: suspensionError } = await supabase
      .from('user_suspensions')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_active', true)

    if (suspensionError) {
      console.error('[Moderation] Deactivate suspension error:', suspensionError)
    }

    // プロフィールを更新
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        is_suspended: false,
        suspended_until: null,
        suspension_reason: null,
      })
      .eq('id', userId)

    if (profileError) {
      console.error('[Moderation] Update profile unsuspension error:', profileError)
      return false
    }

    // アクションログを記録
    await this.logAdminAction(adminId, 'user_unbanned', 'user', userId, reason)

    return true
  },

  /**
   * 管理者アクションをログに記録
   */
  async logAdminAction(
    adminId: string,
    actionType: string,
    targetType: string,
    targetId: string,
    reason?: string,
    details?: Record<string, unknown>
  ): Promise<void> {
    const supabase = getSupabase()

    // admin_usersからadmin IDを取得
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', adminId)
      .single()

    if (!adminUser) {
      console.log('[Moderation] Admin user not found for logging:', adminId)
      return
    }

    await supabase
      .from('admin_actions')
      .insert({
        admin_id: adminUser.id,
        action_type: actionType,
        target_type: targetType,
        target_id: targetId,
        reason,
        details: (details || {}) as unknown as Record<string, never>,
      })
  },

  /**
   * 投稿を非表示にする（管理者用）
   */
  async hidePost(adminId: string, postId: string, reason: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('posts')
      .update({ visibility: 'private' })
      .eq('id', postId)

    if (error) {
      console.error('[Moderation] Hide post error:', error)
      return false
    }

    await this.logAdminAction(adminId, 'post_hidden', 'post', postId, reason)
    return true
  },

  /**
   * コメントを削除（管理者用）
   */
  async deleteComment(adminId: string, commentId: string, reason: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      console.error('[Moderation] Delete comment error:', error)
      return false
    }

    await this.logAdminAction(adminId, 'comment_deleted', 'comment', commentId, reason)
    return true
  },

  /**
   * 統計情報を取得（管理者用）
   */
  async getStats(): Promise<{
    totalReports: number
    pendingReports: number
    totalUsers: number
    suspendedUsers: number
    totalPosts: number
    reportsToday: number
  }> {
    const supabase = getSupabase()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [reportsResult, pendingResult, usersResult, suspendedResult, postsResult, todayReportsResult] = await Promise.all([
      supabase.from('reports').select('id', { count: 'exact', head: true }),
      supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_suspended', true),
      supabase.from('posts').select('id', { count: 'exact', head: true }),
      supabase.from('reports').select('id', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    ])

    return {
      totalReports: reportsResult.count || 0,
      pendingReports: pendingResult.count || 0,
      totalUsers: usersResult.count || 0,
      suspendedUsers: suspendedResult.count || 0,
      totalPosts: postsResult.count || 0,
      reportsToday: todayReportsResult.count || 0,
    }
  },

  // =============================================
  // 管理者ギフト機能
  // =============================================

  /**
   * ユーザーを検索
   */
  async searchUsers(query: string): Promise<{
    id: string
    displayName: string
    userCode: string
    avatarUrl: string | null
    silchike: number
    preshiru: number
    drops: number
    isSuspended: boolean
  }[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('profiles')
      .select('id, display_name, user_code, avatar_url, silchike, preshiru, drops, is_suspended')
      .or(`user_code.ilike.%${query}%,display_name.ilike.%${query}%`)
      .limit(20)

    if (error) {
      console.error('[Moderation] Search users error:', error)
      return []
    }

    return data.map(u => ({
      id: u.id,
      displayName: u.display_name || '名無し',
      userCode: u.user_code || '',
      avatarUrl: u.avatar_url,
      silchike: u.silchike || 0,
      preshiru: u.preshiru || 0,
      drops: u.drops || 0,
      isSuspended: u.is_suspended || false,
    }))
  },

  /**
   * ユーザー詳細を取得
   */
  async getUserDetail(userId: string): Promise<{
    id: string
    displayName: string
    userCode: string
    avatarUrl: string | null
    silchike: number
    preshiru: number
    drops: number
    isSuspended: boolean
    suspendedUntil: string | null
    suspensionReason: string | null
    totalStickers: number
    totalTrades: number
    createdAt: string
  } | null> {
    const supabase = getSupabase()

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      console.error('[Moderation] Get user detail error:', profileError)
      return null
    }

    // シール数を取得
    const { count: stickerCount } = await supabase
      .from('user_stickers')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)

    return {
      id: profile.id,
      displayName: profile.display_name || '名無し',
      userCode: profile.user_code || '',
      avatarUrl: profile.avatar_url,
      silchike: profile.silchike || 0,
      preshiru: profile.preshiru || 0,
      drops: profile.drops || 0,
      isSuspended: profile.is_suspended || false,
      suspendedUntil: profile.suspended_until,
      suspensionReason: profile.suspension_reason,
      totalStickers: stickerCount || 0,
      totalTrades: profile.total_trades || 0,
      createdAt: profile.created_at || new Date().toISOString(),
    }
  },

  /**
   * 通貨を付与
   */
  async grantCurrency(
    adminId: string,
    targetUserId: string,
    currencyType: 'silchike' | 'preshiru' | 'drop',
    amount: number,
    reason: string
  ): Promise<boolean> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .rpc('admin_grant_currency', {
        p_admin_id: adminId,
        p_target_user_id: targetUserId,
        p_currency_type: currencyType,
        p_amount: amount,
        p_reason: reason,
      })

    if (error) {
      console.error('[Moderation] Grant currency error:', error)
      return false
    }

    console.log('[Moderation] Currency granted:', { targetUserId, currencyType, amount })
    return !!data
  },

  /**
   * 全員に通貨を配布
   */
  async grantCurrencyToAll(
    adminId: string,
    currencyType: 'silchike' | 'preshiru' | 'drop',
    amount: number,
    reason: string
  ): Promise<number> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .rpc('admin_grant_currency_to_all', {
        p_admin_id: adminId,
        p_currency_type: currencyType,
        p_amount: amount,
        p_reason: reason,
      })

    if (error) {
      console.error('[Moderation] Grant currency to all error:', error)
      return 0
    }

    console.log('[Moderation] Currency granted to all:', { currencyType, amount, affectedCount: data })
    return data || 0
  },

  /**
   * シールを付与
   */
  async grantSticker(
    adminId: string,
    targetUserId: string,
    stickerId: string,
    rank: number = 0,
    quantity: number = 1,
    reason: string = '管理者付与'
  ): Promise<boolean> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .rpc('admin_grant_sticker', {
        p_admin_id: adminId,
        p_target_user_id: targetUserId,
        p_sticker_id: stickerId,
        p_rank: rank,
        p_quantity: quantity,
        p_reason: reason,
      })

    if (error) {
      console.error('[Moderation] Grant sticker error:', error)
      return false
    }

    console.log('[Moderation] Sticker granted:', { targetUserId, stickerId, quantity })
    return !!data
  },

  /**
   * お知らせを作成
   */
  async createAnnouncement(
    adminId: string,
    title: string,
    content: string,
    type: 'info' | 'update' | 'event' | 'maintenance' | 'urgent' = 'info',
    options?: {
      startsAt?: string
      endsAt?: string
      isPinned?: boolean
      imageUrl?: string
      actionUrl?: string
      actionLabel?: string
    }
  ): Promise<string | null> {
    const supabase = getSupabase()

    // admin_users IDを取得
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', adminId)
      .single()

    if (!adminUser) {
      console.error('[Moderation] Admin user not found')
      return null
    }

    const { data, error } = await supabase
      .from('announcements')
      .insert({
        admin_id: adminUser.id,
        title,
        content,
        announcement_type: type,
        starts_at: options?.startsAt || new Date().toISOString(),
        ends_at: options?.endsAt || null,
        is_pinned: options?.isPinned || false,
        image_url: options?.imageUrl || null,
        action_url: options?.actionUrl || null,
        action_label: options?.actionLabel || null,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[Moderation] Create announcement error:', error)
      return null
    }

    console.log('[Moderation] Announcement created:', data.id)
    return data.id
  },

  /**
   * お知らせ一覧を取得（管理者用）
   */
  async getAllAnnouncements(): Promise<{
    id: string
    title: string
    content: string
    type: string
    startsAt: string
    endsAt: string | null
    isActive: boolean
    isPinned: boolean
    createdAt: string
  }[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Moderation] Get announcements error:', error)
      return []
    }

    return data.map(a => ({
      id: a.id,
      title: a.title,
      content: a.content,
      type: a.announcement_type,
      startsAt: a.starts_at || new Date().toISOString(),
      endsAt: a.ends_at,
      isActive: a.is_active ?? true,
      isPinned: a.is_pinned ?? false,
      createdAt: a.created_at || new Date().toISOString(),
    }))
  },

  /**
   * お知らせを更新
   */
  async updateAnnouncement(
    announcementId: string,
    updates: {
      title?: string
      content?: string
      type?: string
      isActive?: boolean
      isPinned?: boolean
      endsAt?: string | null
    }
  ): Promise<boolean> {
    const supabase = getSupabase()

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.content !== undefined) updateData.content = updates.content
    if (updates.type !== undefined) updateData.announcement_type = updates.type
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive
    if (updates.isPinned !== undefined) updateData.is_pinned = updates.isPinned
    if (updates.endsAt !== undefined) updateData.ends_at = updates.endsAt

    const { error } = await supabase
      .from('announcements')
      .update(updateData)
      .eq('id', announcementId)

    if (error) {
      console.error('[Moderation] Update announcement error:', error)
      return false
    }

    return true
  },

  /**
   * ギフトログを取得
   */
  async getGiftLogs(limit: number = 50): Promise<{
    id: string
    giftType: string
    targetUserId: string | null
    targetType: string
    currencyType: string | null
    currencyAmount: number | null
    stickerId: string | null
    stickerRank: number | null
    quantity: number | null
    reason: string
    createdAt: string
    targetUser?: {
      displayName: string
      userCode: string
    }
  }[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('admin_gifts')
      .select(`
        *,
        target_user:profiles!admin_gifts_target_user_id_fkey(display_name, user_code)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('[Moderation] Get gift logs error:', error)
      return []
    }

    return data.map(g => ({
      id: g.id,
      giftType: g.gift_type,
      targetUserId: g.target_user_id,
      targetType: g.target_type,
      currencyType: g.currency_type,
      currencyAmount: g.currency_amount,
      stickerId: g.sticker_id,
      stickerRank: g.sticker_rank,
      quantity: g.item_amount,
      reason: g.reason,
      createdAt: g.created_at || new Date().toISOString(),
      targetUser: g.target_user ? {
        displayName: (g.target_user as { display_name: string }).display_name || '不明',
        userCode: (g.target_user as { user_code: string }).user_code || '',
      } : undefined,
    }))
  },

  /**
   * シール一覧を取得（付与用）
   */
  async getStickerList(): Promise<{
    id: string
    name: string
    rarity: number
    series: string | null
  }[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('stickers')
      .select('id, name, rarity, series')
      .order('series')
      .order('rarity', { ascending: false })

    if (error) {
      console.error('[Moderation] Get stickers error:', error)
      return []
    }

    return data.map(s => ({
      id: s.id,
      name: s.name,
      rarity: s.rarity,
      series: s.series,
    }))
  },

  // =============================================
  // マッピング関数
  // =============================================

  mapReport(data: Record<string, unknown>): Report {
    const reporter = data.reporter as Record<string, unknown> | null

    return {
      id: data.id as string,
      reporterId: data.reporter_id as string,
      targetType: data.target_type as TargetType,
      targetId: data.target_id as string,
      category: data.category as ReportCategory,
      description: data.description as string | null,
      status: data.status as ReportStatus,
      priority: (data.priority as ReportPriority) || 'normal',
      adminId: data.admin_id as string | null,
      adminNotes: data.admin_notes as string | null,
      actionTaken: data.action_taken as string | null,
      resolvedAt: data.resolved_at as string | null,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
      reporter: reporter ? {
        id: reporter.id as string,
        displayName: reporter.display_name as string,
        avatarUrl: reporter.avatar_url as string | null,
      } : undefined,
    }
  },

  mapUserBlock(data: Record<string, unknown>): UserBlock {
    const blocked = data.blocked as Record<string, unknown> | null

    return {
      id: data.id as string,
      blockerId: data.blocker_id as string,
      blockedId: data.blocked_id as string,
      reason: data.reason as string | null,
      createdAt: data.created_at as string,
      blockedUser: blocked ? {
        id: blocked.id as string,
        displayName: blocked.display_name as string,
        avatarUrl: blocked.avatar_url as string | null,
      } : undefined,
    }
  },
}

export default moderationService
