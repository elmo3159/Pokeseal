// タイムラインサービス - 投稿・リアクション管理
import { getSupabase } from '@/services/supabase'
import type { Post, Reaction, Profile } from '@/types/database'
import { dailyMissionService } from '@/services/dailyMissions'

export type ReactionType = Reaction['type']
export type Visibility = Post['visibility']

// 投稿と関連情報
export interface PostWithDetails extends Post {
  author: Profile
  reactions: {
    type: ReactionType
    count: number
    isReacted: boolean
  }[]
  isFollowing: boolean
}

// 投稿作成データ
export interface CreatePostData {
  pageId?: string
  imageUrl?: string
  caption?: string
  hashtags?: string[]
  visibility?: Visibility
}

export const timelineService = {
  // タイムライン取得（公開投稿）
  async getPublicTimeline(
    userId: string | null,
    limit: number = 20,
    offset: number = 0
  ): Promise<PostWithDetails[]> {
    const supabase = getSupabase()

    // 公開投稿取得
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*)
      `)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error || !posts) {
      console.error('Get timeline error:', error)
      return []
    }

    // リアクション情報とフォロー状態を取得
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.all(posts.map((post: any) => this.enrichPost(post as Post & { author: Profile }, userId)))
  },

  // フォロー中のユーザーの投稿取得
  async getFollowingTimeline(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PostWithDetails[]> {
    const supabase = getSupabase()

    // フォロー中のユーザーID取得（followsテーブルを使用）
    const { data: follows, error: followsError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId)

    if (followsError) {
      console.error('Get following users error:', followsError)
      return []
    }

    const followingIds = follows?.map((f: { following_id: string }) => f.following_id) || []
    console.log('[Timeline] Following IDs for user', userId, ':', followingIds)

    if (followingIds.length === 0) {
      console.log('[Timeline] No following users found')
      return []
    }

    // フォロー中ユーザーの投稿取得（publicを表示）
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*)
      `)
      .in('user_id', followingIds)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error || !posts) {
      console.error('Get following timeline error:', error)
      return []
    }

    console.log('[Timeline] Found', posts.length, 'posts from following users')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.all(posts.map((post: any) => this.enrichPost(post as Post & { author: Profile }, userId)))
  },

  // ユーザーの投稿取得
  async getUserPosts(
    targetUserId: string,
    viewerId: string | null,
    limit: number = 20
  ): Promise<PostWithDetails[]> {
    const supabase = getSupabase()

    let query = supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*)
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
      .limit(limit)

    // 閲覧者に応じてvisibilityフィルタ
    if (viewerId === targetUserId) {
      // 自分の投稿はすべて表示
    } else if (viewerId) {
      // ログイン済みユーザー: フォロー関係をチェック（followsテーブルを使用）
      // 相互フォローの場合、friends投稿も表示
      const { data: mutualFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', viewerId)
        .eq('following_id', targetUserId)
        .single()

      if (mutualFollow) {
        query = query.in('visibility', ['public', 'friends'])
      } else {
        query = query.eq('visibility', 'public')
      }
    } else {
      // 未ログイン: publicのみ
      query = query.eq('visibility', 'public')
    }

    const { data: posts, error } = await query

    if (error || !posts) {
      console.error('Get user posts error:', error)
      return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.all(posts.map((post: any) => this.enrichPost(post as Post & { author: Profile }, viewerId)))
  },

  // 投稿を詳細情報で補完
  async enrichPost(
    post: Post & { author: Profile },
    viewerId: string | null
  ): Promise<PostWithDetails> {
    const supabase = getSupabase()

    // リアクション集計
    const { data: reactions } = await supabase
      .from('reactions')
      .select('type, user_id')
      .eq('post_id', post.id)

    const reactionCounts = new Map<ReactionType, { count: number; isReacted: boolean }>()
    const types: ReactionType[] = ['like', 'sparkle', 'hot', 'cute']

    for (const type of types) {
      reactionCounts.set(type, { count: 0, isReacted: false })
    }

    for (const reaction of reactions || []) {
      const current = reactionCounts.get(reaction.type) || { count: 0, isReacted: false }
      reactionCounts.set(reaction.type, {
        count: current.count + 1,
        isReacted: current.isReacted || reaction.user_id === viewerId
      })
    }

    // フォロー状態確認（followsテーブルを使用）
    let isFollowing = false
    if (viewerId && viewerId !== post.user_id) {
      const { data: followRecord } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', viewerId)
        .eq('following_id', post.user_id)
        .single()

      isFollowing = !!followRecord
    }

    return {
      ...post,
      author: post.author,
      reactions: types.map(type => ({
        type,
        ...reactionCounts.get(type)!
      })),
      isFollowing
    }
  },

  // 投稿作成
  async createPost(userId: string, data: CreatePostData): Promise<Post | null> {
    const supabase = getSupabase()

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        page_id: data.pageId || null,
        image_url: data.imageUrl || null,
        caption: data.caption || null,
        hashtags: data.hashtags || [],
        visibility: data.visibility || 'public'
      })
      .select()
      .single()

    if (error) {
      console.error('Create post error:', error)
      return null
    }

    return post
  },

  // 投稿削除
  async deletePost(postId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId)

    return !error
  },

  // リアクション追加/削除（トグル）
  async toggleReaction(
    postId: string,
    userId: string,
    type: ReactionType
  ): Promise<{ added: boolean } | null> {
    const supabase = getSupabase()

    // 既存のリアクション確認
    const { data: existing } = await supabase
      .from('reactions')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .eq('type', type)
      .single()

    if (existing) {
      // 削除
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('id', existing.id)

      if (error) {
        console.error('Remove reaction error:', error)
        return null
      }

      return { added: false }
    } else {
      // 追加
      const { error } = await supabase
        .from('reactions')
        .insert({
          post_id: postId,
          user_id: userId,
          type
        })

      if (error) {
        console.error('Add reaction error:', error)
        return null
      }

      // デイリーミッション進捗を更新（いいね追加時のみ）
      if (type === 'like') {
        await dailyMissionService.updateProgress(userId, 'like', 1)
      }

      return { added: true }
    }
  },

  // ハッシュタグ検索
  async searchByHashtag(
    hashtag: string,
    userId: string | null,
    limit: number = 20
  ): Promise<PostWithDetails[]> {
    const supabase = getSupabase()

    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*)
      `)
      .contains('hashtags', [hashtag])
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !posts) {
      console.error('Search by hashtag error:', error)
      return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.all(posts.map((post: any) => this.enrichPost(post as Post & { author: Profile }, userId)))
  },

  // 人気の投稿取得
  async getPopularPosts(
    userId: string | null,
    limit: number = 10
  ): Promise<PostWithDetails[]> {
    const supabase = getSupabase()

    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*)
      `)
      .eq('visibility', 'public')
      .order('like_count', { ascending: false })
      .limit(limit)

    if (error || !posts) {
      console.error('Get popular posts error:', error)
      return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.all(posts.map((post: any) => this.enrichPost(post as Post & { author: Profile }, userId)))
  },

  // いいねした投稿を取得
  async getLikedPosts(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<PostWithDetails[]> {
    const supabase = getSupabase()

    // ユーザーがいいねしたpost_idを取得
    const { data: likedReactions, error: reactionsError } = await supabase
      .from('reactions')
      .select('post_id')
      .eq('user_id', userId)
      .eq('type', 'like')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (reactionsError || !likedReactions || likedReactions.length === 0) {
      return []
    }

    const postIds = likedReactions.map((r: { post_id: string }) => r.post_id)

    // 投稿詳細を取得
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*)
      `)
      .in('id', postIds)
      .eq('visibility', 'public')

    if (error || !posts) {
      console.error('Get liked posts error:', error)
      return []
    }

    // いいねした順序を維持
    const postsMap = new Map(posts.map((p: Post & { author: Profile }) => [p.id, p]))
    const orderedPosts = postIds
      .map((id: string) => postsMap.get(id))
      .filter((p): p is Post & { author: Profile } => p !== undefined)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Promise.all(orderedPosts.map((post: any) => this.enrichPost(post as Post & { author: Profile }, userId)))
  },

  // コメント追加
  async addComment(
    postId: string,
    userId: string,
    content: string
  ): Promise<{ id: string; content: string; created_at: string } | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content
      })
      .select('id, content, created_at')
      .single()

    if (error) {
      console.error('Add comment error:', error)
      return null
    }

    // デイリーミッション進捗を更新
    await dailyMissionService.updateProgress(userId, 'comment', 1)

    return {
      id: data.id,
      content: data.content,
      created_at: data.created_at || new Date().toISOString()
    }
  },

  // コメント一覧取得
  async getComments(
    postId: string,
    limit: number = 50
  ): Promise<{
    id: string
    content: string
    created_at: string
    user: { id: string; username: string; display_name: string | null; avatar_url: string | null }
  }[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        id,
        content,
        created_at,
        user:profiles(id, username, display_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error || !data) {
      console.error('Get comments error:', error)
      return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((c: any) => ({
      id: c.id,
      content: c.content,
      created_at: c.created_at,
      user: c.user
    }))
  },

  // コメント削除
  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('post_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId)

    return !error
  },

  // 投稿のいいね数・コメント数を取得
  async getPostCounts(postId: string): Promise<{ likeCount: number; commentCount: number }> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('posts')
      .select('like_count, comment_count')
      .eq('id', postId)
      .single()

    if (error || !data) {
      return { likeCount: 0, commentCount: 0 }
    }

    return {
      likeCount: data.like_count || 0,
      commentCount: data.comment_count || 0
    }
  }
}

export default timelineService
