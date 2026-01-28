import { getSupabase } from '@/services/supabase/client'
import type { TradeBoardPost, TradeBoardComment, BookSnapshot } from '@/domain/tradeBoard'
import { calculateLevel } from '@/domain/levelSystem'

interface CreatePostData {
  wantedStickerIds: string[]
  message?: string
  bookSnapshot: BookSnapshot
}

class TradeBoardService {
  // 投稿一覧取得
  async getPosts(limit = 20, offset = 0, viewerId?: string): Promise<TradeBoardPost[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trade_board_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, display_name, avatar_url, total_exp, selected_frame_id
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error || !data) return []

    const posts = data.map((row: Record<string, unknown>) => this.mapPost(row))

    // いいね状態を取得
    if (viewerId && posts.length > 0) {
      const postIds = posts.map(p => p.id)
      const { data: likes } = await supabase
        .from('trade_board_likes')
        .select('post_id')
        .eq('user_id', viewerId)
        .in('post_id', postIds)

      const likedSet = new Set((likes || []).map((l: Record<string, unknown>) => l.post_id as string))
      posts.forEach(p => { p.isLiked = likedSet.has(p.id) })
    }

    // ほしいシール情報を取得
    await this.enrichWantedStickers(posts)

    return posts
  }

  // 投稿詳細取得
  async getPostById(postId: string, viewerId?: string): Promise<TradeBoardPost | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trade_board_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, display_name, avatar_url, total_exp, selected_frame_id
        )
      `)
      .eq('id', postId)
      .single()

    if (error || !data) return null

    const post = this.mapPost(data)

    if (viewerId) {
      const { data: like } = await supabase
        .from('trade_board_likes')
        .select('post_id')
        .eq('post_id', postId)
        .eq('user_id', viewerId)
        .maybeSingle()

      post.isLiked = !!like
    }

    await this.enrichWantedStickers([post])

    return post
  }

  // 投稿作成
  async createPost(userId: string, data: CreatePostData): Promise<TradeBoardPost | null> {
    const supabase = getSupabase()

    const { data: inserted, error: insertError } = await supabase
      .from('trade_board_posts')
      .insert({
        user_id: userId,
        wanted_sticker_ids: data.wantedStickerIds,
        message: data.message || null,
        book_snapshot: data.bookSnapshot as unknown as Record<string, unknown>,
      })
      .select('id')
      .single()

    if (insertError || !inserted) {
      console.error('投稿作成エラー:', insertError)
      return null
    }

    const { data: row, error } = await supabase
      .from('trade_board_posts')
      .select(`
        *,
        profiles:user_id (
          id, username, display_name, avatar_url, total_exp, selected_frame_id
        )
      `)
      .eq('id', inserted.id)
      .single()

    if (error || !row) {
      console.error('投稿作成エラー:', error)
      return null
    }

    const post = this.mapPost(row)
    await this.enrichWantedStickers([post])
    return post
  }

  // 投稿キャンセル
  async cancelPost(postId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('trade_board_posts')
      .update({ status: 'cancelled' })
      .eq('id', postId)
      .eq('user_id', userId)

    return !error
  }

  // 投稿完了（交換成立）
  async completePost(postId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('trade_board_posts')
      .update({ status: 'completed' })
      .eq('id', postId)
      .eq('user_id', userId)

    return !error
  }

  // コメント取得
  async getComments(postId: string): Promise<TradeBoardComment[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trade_board_comments')
      .select(`
        *,
        profiles:user_id (
          id, username, display_name, avatar_url, selected_frame_id, total_exp
        )
      `)
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: true })

    if (error || !data) return []

    const comments = data.map((row: Record<string, unknown>) => this.mapComment(row))
    await this.enrichOfferStickers(comments)
    return comments
  }

  // コメント追加
  async addComment(
    postId: string,
    userId: string,
    content: string,
    offerStickerId?: string,
    parentId?: string
  ): Promise<TradeBoardComment | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trade_board_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content,
        offer_sticker_id: offerStickerId || null,
        parent_id: parentId || null,
      })
      .select(`
        *,
        profiles:user_id (
          id, username, display_name, avatar_url, selected_frame_id, total_exp
        )
      `)
      .single()

    if (error || !data) return null

    const comment = this.mapComment(data)
    await this.enrichOfferStickers([comment])
    return comment
  }

  // 返信取得
  async getReplies(parentId: string): Promise<TradeBoardComment[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('trade_board_comments')
      .select(`
        *,
        profiles:user_id (
          id, username, display_name, avatar_url, selected_frame_id, total_exp
        )
      `)
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true })

    if (error || !data) return []

    const replies = data.map((row: Record<string, unknown>) => this.mapComment(row))
    await this.enrichOfferStickers(replies)
    return replies
  }

  // コメント削除
  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('trade_board_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId)

    return !error
  }

  // いいねトグル
  async toggleLike(postId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { data: existing } = await supabase
      .from('trade_board_likes')
      .select('post_id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('trade_board_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
      return false
    } else {
      await supabase
        .from('trade_board_likes')
        .insert({ post_id: postId, user_id: userId })
      return true
    }
  }

  // ほしいシール情報をenrich
  private async enrichWantedStickers(posts: TradeBoardPost[]): Promise<void> {
    const allIds = [...new Set(posts.flatMap(p => p.wantedStickerIds))]
    if (allIds.length === 0) return

    const supabase = getSupabase()
    const { data } = await supabase
      .from('stickers')
      .select('id, name, image_url, rarity, character, series')
      .in('id', allIds)

    if (!data) return

    const stickerMap = new Map(data.map((s: Record<string, unknown>) => [s.id as string, s]))
    posts.forEach(post => {
      post.wantedStickers = post.wantedStickerIds
        .map(id => stickerMap.get(id))
        .filter(Boolean) as TradeBoardPost['wantedStickers']
    })
  }

  // 提案シール情報をenrich
  private async enrichOfferStickers(comments: TradeBoardComment[]): Promise<void> {
    const offerIds = comments
      .map(c => c.offerStickerId)
      .filter((id): id is string => !!id)

    if (offerIds.length === 0) return

    const supabase = getSupabase()
    const { data } = await supabase
      .from('stickers')
      .select('id, name, image_url, rarity')
      .in('id', [...new Set(offerIds)])

    if (!data) return

    const stickerMap = new Map(data.map((s: Record<string, unknown>) => [s.id as string, s]))
    comments.forEach(c => {
      if (c.offerStickerId) {
        c.offerSticker = stickerMap.get(c.offerStickerId) as TradeBoardComment['offerSticker']
      }
    })
  }

  // DB行 → TradeBoardPost マッピング
  private mapPost(row: Record<string, unknown>): TradeBoardPost {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      wantedStickerIds: row.wanted_sticker_ids as string[],
      message: row.message as string | null,
      bookSnapshot: row.book_snapshot as unknown as BookSnapshot,
      status: row.status as TradeBoardPost['status'],
      likeCount: row.like_count as number,
      commentCount: row.comment_count as number,
      createdAt: row.created_at as string,
      author: this.mapAuthor(row.profiles as Record<string, unknown> | null),
    }
  }

  // DB行 → TradeBoardComment マッピング
  private mapComment(row: Record<string, unknown>): TradeBoardComment {
    return {
      id: row.id as string,
      postId: row.post_id as string,
      userId: row.user_id as string,
      content: row.content as string,
      offerStickerId: row.offer_sticker_id as string | null,
      replyCount: row.reply_count as number,
      parentId: row.parent_id as string | null,
      createdAt: row.created_at as string,
      author: this.mapAuthor(row.profiles as Record<string, unknown> | null),
    }
  }

  private mapAuthor(profile: Record<string, unknown> | null): TradeBoardPost['author'] {
    if (!profile) return undefined
    return {
      id: profile.id as string,
      username: profile.username as string,
      display_name: profile.display_name as string | null,
      avatar_url: profile.avatar_url as string | null,
      level: calculateLevel((profile.total_exp as number) || 0),
      selected_frame_id: profile.selected_frame_id as string | null,
    }
  }
}

export const tradeBoardService = new TradeBoardService()
