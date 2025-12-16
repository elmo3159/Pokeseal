// ミステリーポストサービス - Supabaseでシール投函・受け取りを管理
import { getSupabase } from '@/services/supabase'
import { MYSTERY_POST_RULES } from '@/domain/mysteryPost'


// ミステリーポストの状態
export type MysteryPostStatus = 'pending' | 'matched' | 'delivered' | 'expired'

// ミステリーポストデータ
export interface MysteryPostData {
  id: string
  senderId: string
  userStickerId: string
  message: string | null
  status: MysteryPostStatus
  recipientId: string | null
  matchedPostId: string | null
  postedAt: string
  matchedAt: string | null
  deliveredAt: string | null
  expiresAt: string
  // 関連データ
  stickerName?: string
  stickerImageUrl?: string
  stickerRarity?: number
}

// 投函結果
export interface PostStickerResult {
  success: boolean
  postId?: string
  error?: string
}

// 受け取りシール
export interface ReceivedStickerData {
  postId: string
  stickerId: string
  stickerName: string
  stickerImageUrl: string
  stickerRarity: number
  senderName: string
  message: string | null
  deliveredAt: string
}

export const mysteryPostService = {
  /**
   * シールを投函する
   */
  async postSticker(
    userId: string,
    userStickerId: string,
    message?: string
  ): Promise<PostStickerResult> {
    const supabase = getSupabase()

    // 今日の投函数を確認
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: todayPosts, error: countError } = await supabase
      .from('mystery_posts')
      .select('id')
      .eq('sender_id', userId)
      .gte('posted_at', today.toISOString())

    if (countError) {
      console.error('[MysteryPost] Count error:', countError)
      return { success: false, error: '投函数の確認に失敗しました' }
    }

    if (todayPosts && todayPosts.length >= MYSTERY_POST_RULES.maxPostsPerDay) {
      return { success: false, error: '今日の投函上限に達しました' }
    }

    // 投函を作成
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + MYSTERY_POST_RULES.expirationDays)

    const { data: post, error: insertError } = await supabase
      .from('mystery_posts')
      .insert({
        sender_id: userId,
        user_sticker_id: userStickerId,
        message: message || null,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
      })
      .select('id')
      .single()

    if (insertError || !post) {
      console.error('[MysteryPost] Insert error:', insertError)
      return { success: false, error: '投函に失敗しました' }
    }

    console.log('[MysteryPost] Posted:', post.id)
    return { success: true, postId: post.id }
  },

  /**
   * ユーザーの投函履歴を取得
   */
  async getUserPosts(userId: string): Promise<MysteryPostData[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('mystery_posts')
      .select(`
        id,
        sender_id,
        user_sticker_id,
        message,
        status,
        recipient_id,
        matched_post_id,
        posted_at,
        matched_at,
        delivered_at,
        expires_at,
        user_sticker:user_stickers(
          sticker:stickers(
            id,
            name,
            image_url,
            rarity
          )
        )
      `)
      .eq('sender_id', userId)
      .order('posted_at', { ascending: false })

    if (error || !data) {
      console.error('[MysteryPost] Get posts error:', error)
      return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((post: any) => ({
      id: post.id,
      senderId: post.sender_id,
      userStickerId: post.user_sticker_id,
      message: post.message,
      status: post.status,
      recipientId: post.recipient_id,
      matchedPostId: post.matched_post_id,
      postedAt: post.posted_at,
      matchedAt: post.matched_at,
      deliveredAt: post.delivered_at,
      expiresAt: post.expires_at,
      stickerName: post.user_sticker?.sticker?.name,
      stickerImageUrl: post.user_sticker?.sticker?.image_url,
      stickerRarity: post.user_sticker?.sticker?.rarity,
    }))
  },

  /**
   * ユーザーが受け取ったシールを取得（配達済み）
   */
  async getReceivedStickers(userId: string): Promise<ReceivedStickerData[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('mystery_posts')
      .select(`
        id,
        message,
        delivered_at,
        sender:profiles!mystery_posts_sender_id_fkey(
          display_name
        ),
        user_sticker:user_stickers(
          sticker:stickers(
            id,
            name,
            image_url,
            rarity
          )
        )
      `)
      .eq('recipient_id', userId)
      .eq('status', 'delivered')
      .order('delivered_at', { ascending: false })

    if (error || !data) {
      console.error('[MysteryPost] Get received error:', error)
      return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((post: any) => ({
      postId: post.id,
      stickerId: post.user_sticker?.sticker?.id,
      stickerName: post.user_sticker?.sticker?.name || 'Unknown',
      stickerImageUrl: post.user_sticker?.sticker?.image_url || '',
      stickerRarity: post.user_sticker?.sticker?.rarity || 1,
      senderName: post.sender?.display_name || '匿名さん',
      message: post.message,
      deliveredAt: post.delivered_at,
    }))
  },

  /**
   * 今日投函可能か確認
   */
  async canPostToday(userId: string): Promise<boolean> {
    const supabase = getSupabase()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('mystery_posts')
      .select('id')
      .eq('sender_id', userId)
      .gte('posted_at', today.toISOString())

    if (error) {
      console.error('[MysteryPost] Check post error:', error)
      return false
    }

    return !data || data.length < MYSTERY_POST_RULES.maxPostsPerDay
  },

  /**
   * ペンディング中の投稿数を取得
   */
  async getPendingCount(userId: string): Promise<number> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('mystery_posts')
      .select('id')
      .eq('sender_id', userId)
      .eq('status', 'pending')

    if (error || !data) {
      return 0
    }

    return data.length
  },

  /**
   * 未読の受け取りシール数を取得
   */
  async getUnreadReceivedCount(userId: string): Promise<number> {
    const supabase = getSupabase()

    // 今日配達されたもの
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('mystery_posts')
      .select('id')
      .eq('recipient_id', userId)
      .eq('status', 'delivered')
      .gte('delivered_at', today.toISOString())

    if (error || !data) {
      return 0
    }

    return data.length
  },

  /**
   * マッチング実行（サーバーサイドで定期実行想定）
   */
  async runMatching(): Promise<number> {
    const supabase = getSupabase()

    // PostgreSQL関数を呼び出し
    const { data, error } = await supabase.rpc('match_mystery_posts')

    if (error) {
      console.error('[MysteryPost] Matching error:', error)
      return 0
    }

    console.log('[MysteryPost] Matched:', data, 'posts')
    return data || 0
  },

  /**
   * 配達実行（サーバーサイドで定期実行想定）
   */
  async runDelivery(): Promise<number> {
    const supabase = getSupabase()

    // PostgreSQL関数を呼び出し
    const { data, error } = await supabase.rpc('deliver_mystery_posts')

    if (error) {
      console.error('[MysteryPost] Delivery error:', error)
      return 0
    }

    console.log('[MysteryPost] Delivered:', data, 'posts')
    return data || 0
  },
}

export default mysteryPostService
