'use client'

import React, { memo, useState } from 'react'
import { SafetyMenu } from '@/features/safety'
import { PlacedSticker } from '@/features/sticker-book'
import { ImageEnlargeModal } from './ImageEnlargeModal'

// リアクションの種類（いいねのみに簡略化）
export type ReactionType = 'heart'

// リアクション情報
export interface Reaction {
  type: ReactionType
  count: number
  isReacted: boolean
}

// シール帳ページのデータ（投稿用）
export interface PostPageData {
  placedStickers: PlacedSticker[]
  backgroundColor?: string
}

// 投稿情報
export interface Post {
  id: string
  userId: string
  userName: string
  userAvatarUrl?: string
  pageImageUrl?: string
  // シール帳ページの実データ（画像の代わりに使用可能）
  pageData?: PostPageData
  caption: string
  hashtags: string[]
  reactions: Reaction[]
  commentCount: number
  createdAt: string
  isFollowing: boolean
  // 公開範囲
  visibility?: 'public' | 'friends'
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

// いいねボタン - iOS風
const LikeButton: React.FC<{
  reaction: Reaction
  onClick: () => void
}> = ({ reaction, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-4 py-2 rounded-full text-sm
        transition-all duration-200
        ${reaction.isReacted
          ? 'bg-pink-100/80 text-pink-600 shadow-[0_2px_8px_rgba(236,72,153,0.2)]'
          : 'bg-purple-50/60 text-purple-400 hover:bg-pink-50/80'
        }
        active:scale-95
      `}
    >
      <span className="text-base">{reaction.isReacted ? '❤️' : '🤍'}</span>
      <span className="font-bold">{reaction.count > 0 ? reaction.count : 'いいね'}</span>
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

// シール帳ページのプレビュー表示
const StickerPagePreview: React.FC<{
  pageData: PostPageData
  onClick: () => void
}> = ({ pageData, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-full aspect-[4/3] bg-white overflow-hidden group"
    >
      {/* グリッドライン */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => (
            <div
              key={`grid-${row}-${col}`}
              className="absolute w-[25%] h-[25%] border border-purple-300"
              style={{
                left: `${col * 25}%`,
                top: `${row * 25}%`,
              }}
            />
          ))
        )}
      </div>

      {/* シール - コンテナに対して相対サイズで表示 */}
      {pageData.placedStickers.map((sticker) => (
        <div
          key={sticker.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sticker.x * 100}%`,
            top: `${sticker.y * 100}%`,
            transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale || 1})`,
            // コンテナ幅に対する相対サイズ（18%）で表示
            // これにより、どのサイズのプレビューでも適切な比率を維持
            width: '18%',
            height: 'auto',
            aspectRatio: '1 / 1',
            zIndex: sticker.zIndex || 1,
          }}
        >
          <img
            src={sticker.sticker.imageUrl}
            alt={sticker.sticker.name}
            className="w-full h-full object-contain drop-shadow-md"
            draggable={false}
          />
        </div>
      ))}

      {/* ホバー時の拡大アイコン */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
          <span className="text-2xl">🔍</span>
        </div>
      </div>
    </button>
  )
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
  const [isEnlargeModalOpen, setIsEnlargeModalOpen] = useState(false)

  return (
    <>
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
              <div className="flex items-center gap-1.5">
                <p className="text-xs text-purple-400">{formatTime(post.createdAt)}</p>
                {post.visibility === 'friends' && (
                  <span className="text-xs bg-purple-100 text-purple-500 px-1.5 py-0.5 rounded-full">
                    👫 フレンド限定
                  </span>
                )}
              </div>
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

        {/* 画像 - タップで拡大 */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100">
          {post.pageData ? (
            // シール帳ページのデータがある場合
            <StickerPagePreview
              pageData={post.pageData}
              onClick={() => setIsEnlargeModalOpen(true)}
            />
          ) : post.pageImageUrl ? (
            // 画像URLがある場合
            <button
              onClick={() => setIsEnlargeModalOpen(true)}
              className="w-full h-full group"
            >
              <img
                src={post.pageImageUrl}
                alt="シール帳ページ"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {/* ホバー時の拡大アイコン */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                  <span className="text-2xl">🔍</span>
                </div>
              </div>
            </button>
          ) : (
            // どちらもない場合のプレースホルダー
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">📖</div>
                <p className="text-purple-400 text-sm">シール帳ページ</p>
              </div>
            </div>
          )}
        </div>

        {/* いいね・コメントバー */}
        <div className="flex items-center gap-3 p-3 border-b border-purple-100/30">
          {/* いいねボタン */}
          {post.reactions.find(r => r.type === 'heart') && (
            <LikeButton
              reaction={post.reactions.find(r => r.type === 'heart')!}
              onClick={() => onReact(post.id, 'heart')}
            />
          )}

          {/* コメントボタン */}
          <button
            onClick={() => onComment(post.id)}
            className="
              flex items-center gap-1.5 px-4 py-2 rounded-full text-sm
              bg-purple-50/60 text-purple-400 hover:bg-purple-100/70
              transition-all active:scale-95
            "
          >
            <span className="text-base">💬</span>
            <span className="font-bold">{post.commentCount > 0 ? post.commentCount : 'コメント'}</span>
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

      {/* 画像拡大モーダル */}
      <ImageEnlargeModal
        isOpen={isEnlargeModalOpen}
        onClose={() => setIsEnlargeModalOpen(false)}
        imageUrl={post.pageImageUrl}
        pageData={post.pageData}
        userName={post.userName}
        caption={post.caption}
      />
    </>
  )
})

PostCard.displayName = 'PostCard'

export default PostCard
