'use client'

import React, { useState } from 'react'
import { PostCard, Post, ReactionType } from './PostCard'

// フィードタイプ
export type FeedType = 'latest' | 'following' | 'popular'

interface TimelineViewProps {
  posts: Post[]
  onReact: (postId: string, reactionType: ReactionType) => void
  onComment: (postId: string) => void
  onUserClick: (userId: string) => void
  onFollow: (userId: string) => void
  onCreatePost: () => void
  onReport?: (postId: string, userId: string, userName: string) => void
  onBlock?: (userId: string, userName: string) => void
  blockedUserIds?: string[]
}

// フィードタブ - iOS風セグメントコントロール
const FeedTabs: React.FC<{
  activeTab: FeedType
  onTabChange: (tab: FeedType) => void
}> = ({ activeTab, onTabChange }) => {
  const tabs: { id: FeedType; label: string; icon: string }[] = [
    { id: 'latest', label: 'さいしん', icon: '🕐' },
    { id: 'following', label: 'フォロー中', icon: '👫' },
    { id: 'popular', label: 'にんき', icon: '🔥' },
  ]

  return (
    <div
      className="flex gap-1 bg-white/50 backdrop-blur-md rounded-2xl p-1 shadow-[0_2px_8px_rgba(139,92,246,0.08)] border border-white/50"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-200
            ${activeTab === tab.id
              ? 'bg-white text-purple-600 shadow-[0_2px_8px_rgba(139,92,246,0.15)]'
              : 'text-purple-400 hover:text-purple-600'
            }
          `}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

// 投稿作成ボタン - iOS風FAB
const CreatePostButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '96px',
        right: '16px',
        zIndex: 40,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(to right, rgba(168, 85, 247, 0.9), rgba(236, 72, 153, 0.9))',
        backdropFilter: 'blur(4px)',
        color: 'white',
        fontSize: '24px',
        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        cursor: 'pointer',
      }}
    >
      ✏️
    </button>
  )
}

// 空の状態表示 - iOS風
const EmptyFeed: React.FC<{ feedType: FeedType }> = ({ feedType }) => {
  const messages = {
    latest: {
      icon: '📭',
      title: 'まだ投稿がありません',
      description: 'あなたがさいしょの投稿者になろう！'
    },
    following: {
      icon: '👋',
      title: 'フォロー中の投稿がありません',
      description: 'すきなユーザーをフォローしよう！'
    },
    popular: {
      icon: '🌟',
      title: 'にんきの投稿がありません',
      description: 'みんなの投稿にリアクションしよう！'
    }
  }

  const { icon, title, description } = messages[feedType]

  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 mx-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-[0_2px_8px_rgba(139,92,246,0.06)]"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-purple-700 mb-2">{title}</h3>
      <p className="text-sm text-purple-400 text-center">{description}</p>
    </div>
  )
}

// ローディングスケルトン - iOS風
const PostSkeleton: React.FC = () => {
  return (
    <div
      className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_2px_8px_rgba(139,92,246,0.1)] border border-white/50 overflow-hidden mb-4 animate-pulse"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* ヘッダー */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-purple-200/50" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-purple-200/50 rounded-full mb-1" />
          <div className="h-3 w-16 bg-purple-100/50 rounded-full" />
        </div>
      </div>

      {/* 画像 */}
      <div className="aspect-[4/3] bg-gradient-to-br from-purple-100/40 to-pink-100/40" />

      {/* リアクションバー */}
      <div className="flex gap-2 p-3 border-b border-purple-100/30">
        <div className="h-8 w-16 bg-purple-100/50 rounded-xl" />
        <div className="h-8 w-16 bg-purple-100/50 rounded-xl" />
        <div className="h-8 w-16 bg-purple-100/50 rounded-xl" />
      </div>

      {/* キャプション */}
      <div className="p-4">
        <div className="h-4 w-full bg-purple-100/50 rounded-full mb-2" />
        <div className="h-4 w-3/4 bg-purple-100/50 rounded-full" />
      </div>
    </div>
  )
}

// メインのTimelineView
export const TimelineView: React.FC<TimelineViewProps> = ({
  posts,
  onReact,
  onComment,
  onUserClick,
  onFollow,
  onCreatePost,
  onReport,
  onBlock,
  blockedUserIds = []
}) => {
  const [activeTab, setActiveTab] = useState<FeedType>('latest')
  const [isLoading, setIsLoading] = useState(false)

  // フィードタイプに応じて投稿をフィルタリング（ブロックユーザーは除外）
  const filteredPosts = posts.filter(post => {
    // ブロックしたユーザーの投稿は表示しない
    if (blockedUserIds.includes(post.userId)) {
      return false
    }

    switch (activeTab) {
      case 'following':
        return post.isFollowing
      case 'popular': {
        const totalReactions = post.reactions.reduce((sum, r) => sum + r.count, 0)
        return totalReactions >= 5 // 5リアクション以上を人気投稿とする
      }
      default:
        return true
    }
  })

  // タブ変更時の処理
  const handleTabChange = (tab: FeedType) => {
    setIsLoading(true)
    setActiveTab(tab)
    // デモ用：少し遅延を入れる
    setTimeout(() => setIsLoading(false), 300)
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* タブ */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <FeedTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* フィード */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
        {isLoading ? (
          // ローディング
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : filteredPosts.length > 0 ? (
          // 投稿一覧
          filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onReact={onReact}
              onComment={onComment}
              onUserClick={onUserClick}
              onFollow={onFollow}
              onReport={onReport}
              onBlock={onBlock}
              isBlocked={blockedUserIds.includes(post.userId)}
            />
          ))
        ) : (
          // 空の状態
          <EmptyFeed feedType={activeTab} />
        )}
      </div>

      {/* 投稿作成ボタン */}
      <CreatePostButton onClick={onCreatePost} />
    </div>
  )
}

export default TimelineView
