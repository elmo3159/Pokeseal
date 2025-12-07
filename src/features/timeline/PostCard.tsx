'use client'

import React, { memo } from 'react'
import { SafetyMenu } from '@/features/safety'

// リアクションの種類
export type ReactionType = 'heart' | 'sparkle' | 'fire' | 'cute'

// リアクション情報
export interface Reaction {
  type: ReactionType
  count: number
  isReacted: boolean
}

// 投稿情報
export interface Post {
  id: string
  userId: string
  userName: string
  userAvatarUrl?: string
  pageImageUrl?: string
  caption: string
  hashtags: string[]
  reactions: Reaction[]
  commentCount: number
  createdAt: string
  isFollowing: boolean
}

interface PostCardProps {
  post: Post
  onReact: (postId: string, reactionType: ReactionType) => void
  onComment: (postId: string) => void
  onUserClick: (userId: string) => void
  onFollow: (userId: string) => void
  onReport?: (postId: string, userId: string, userName: string) => void
  onBlock?: (userId: string, userName: string) => void
  isBlocked?: boolean
}

// リアクションボタン - iOS風
const ReactionButton: React.FC<{
  reaction: Reaction
  onClick: () => void
}> = ({ reaction, onClick }) => {
  const icons = {
    heart: '❤️',
    sparkle: '✨',
    fire: '🔥',
    cute: '🩷'
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm
        transition-all duration-200
        ${reaction.isReacted
          ? 'bg-pink-100/80 text-pink-600 shadow-[0_1px_4px_rgba(236,72,153,0.15)]'
          : 'bg-purple-50/60 text-purple-400 hover:bg-pink-50/80'
        }
        active:scale-95
      `}
    >
      <span>{icons[reaction.type]}</span>
      <span className="font-medium">{reaction.count > 0 ? reaction.count : ''}</span>
    </button>
  )
}

// 時間フォーマット
const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'たった今'
  if (diffMins < 60) return `${diffMins}分前`
  if (diffHours < 24) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// メインのPostCard
export const PostCard: React.FC<PostCardProps> = memo(({
  post,
  onReact,
  onComment,
  onUserClick,
  onFollow,
  onReport,
  onBlock,
  isBlocked = false
}) => {
  return (
    <article
      className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_2px_8px_rgba(139,92,246,0.1)] border border-white/50 overflow-hidden mb-4"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* ヘッダー */}
      <header className="flex items-center justify-between p-4">
        <button
          onClick={() => onUserClick(post.userId)}
          className="flex items-center gap-3"
        >
          {/* アバター */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-lg">
            {post.userAvatarUrl ? (
              <img src={post.userAvatarUrl} alt={post.userName} loading="lazy" className="w-full h-full rounded-full object-cover" />
            ) : (
              '👤'
            )}
          </div>

          {/* ユーザー名と時間 */}
          <div className="text-left">
            <h4 className="font-bold text-purple-700 text-sm">{post.userName}</h4>
            <p className="text-xs text-purple-400">{formatTime(post.createdAt)}</p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {/* フォローボタン */}
          {!post.isFollowing && (
            <button
              onClick={() => onFollow(post.userId)}
              className="
                px-3 py-1.5 rounded-full text-sm font-bold
                bg-purple-500/90 backdrop-blur-sm text-white
                hover:bg-purple-600 transition-all
                active:scale-95
                shadow-[0_2px_8px_rgba(139,92,246,0.3)]
                border border-white/20
              "
            >
              フォロー
            </button>
          )}

          {/* セーフティメニュー（通報・ブロック） */}
          {onReport && onBlock && (
            <SafetyMenu
              userName={post.userName}
              isBlocked={isBlocked}
              onReport={() => onReport(post.id, post.userId, post.userName)}
              onBlock={() => onBlock(post.userId, post.userName)}
            />
          )}
        </div>
      </header>

      {/* 画像 */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100">
        {post.pageImageUrl ? (
          <img
            src={post.pageImageUrl}
            alt="シール帳ページ"
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">📖</div>
              <p className="text-purple-400 text-sm">シール帳ページ</p>
            </div>
          </div>
        )}
      </div>

      {/* リアクションバー */}
      <div className="flex items-center gap-2 p-3 border-b border-purple-100/30">
        {post.reactions.map((reaction) => (
          <ReactionButton
            key={reaction.type}
            reaction={reaction}
            onClick={() => onReact(post.id, reaction.type)}
          />
        ))}

        {/* コメントボタン */}
        <button
          onClick={() => onComment(post.id)}
          className="
            flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm
            bg-purple-50/60 text-purple-400 hover:bg-purple-100/70
            transition-all active:scale-95 ml-auto
          "
        >
          <span>💬</span>
          <span className="font-medium">{post.commentCount > 0 ? post.commentCount : ''}</span>
        </button>
      </div>

      {/* キャプションとハッシュタグ */}
      <div className="p-4">
        {post.caption && (
          <p className="text-purple-700 text-sm mb-2">{post.caption}</p>
        )}

        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.hashtags.map((tag, index) => (
              <span
                key={index}
                className="text-xs text-purple-500 bg-purple-100/60 backdrop-blur-sm px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
})

export default PostCard
