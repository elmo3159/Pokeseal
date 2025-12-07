// タイムラインサービス - 投稿・リアクション管理
import { getSupabase } from '@/services/supabase'
import type { Post, Reaction, Profile } from '@/types/database'

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

    // フォロー中のユーザーID取得
    const { data: friendships } = await supabase
      .from('friendships')
      .select('friend_id')
      .eq('user_id', userId)
      .eq('status', 'accepted')

    const followingIds = friendships?.map((f: { friend_id: string }) => f.friend_id) || []

    if (followingIds.length === 0) {
      return []
    }

    // フォロー中ユーザーの投稿取得（friendsまたはpublic）
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*)
      `)
      .in('user_id', followingIds)
      .in('visibility', ['public', 'friends'])
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error || !posts) {
      console.error('Get following timeline error:', error)
      return []
    }

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
      // ログイン済みユーザー: publicとfriendsを表示（フレンドかどうかで変わる）
      const { data: friendship } = await supabase
        .from('friendships')
        .select('status')
        .eq('user_id', targetUserId)
        .eq('friend_id', viewerId)
        .eq('status', 'accepted')
        .single()

      if (friendship) {
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

    // フォロー状態確認
    let isFollowing = false
    if (viewerId && viewerId !== post.user_id) {
      const { data: friendship } = await supabase
        .from('friendships')
        .select('status')
        .eq('user_id', viewerId)
        .eq('friend_id', post.user_id)
        .single()

      isFollowing = friendship?.status === 'accepted' || friendship?.status === 'pending'
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
  }
}

export default timelineService
