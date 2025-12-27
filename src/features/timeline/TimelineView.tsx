'use client'

import React, { useState } from 'react'
import { PostCard, Post, ReactionType } from './PostCard'

// フィードタイプ
export type FeedType = 'latest' | 'following' | 'popular' | 'liked'

interface TimelineViewProps {
  posts: Post[]
  currentUserId?: string
  onReact: (postId: string, reactionType: ReactionType) => void
  onComment: (postId: string) => void
  onUserClick: (userId: string) => void
  onFollow: (userId: string) => void
  onCreatePost: () => void
  onDelete?: (postId: string) => void
  onReport?: (postId: string, userId: string, userName: string) => void
  onBlock?: (userId: string, userName: string) => void
  blockedUserIds?: string[]
  onOpenSearch?: () => void
  activeTab?: FeedType
  onTabChange?: (tab: FeedType) => void
}

// フィードタブ - 茶色・ベージュ系
const FeedTabs: React.FC<{
  activeTab: FeedType
  onTabChange: (tab: FeedType) => void
}> = ({ activeTab, onTabChange }) => {
  const tabs: { id: FeedType; label: string; icon: string }[] = [
    { id: 'latest', label: 'さいしん', icon: '🕐' },
    { id: 'following', label: 'フォロー中', icon: '👫' },
    { id: 'popular', label: 'にんき', icon: '🔥' },
    { id: 'liked', label: 'いいね', icon: '❤️' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        gap: '1px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: '14px',
        padding: '2px',
        boxShadow: '0 2px 8px rgba(184, 149, 107, 0.15)',
        border: '2px solid #D4C4B0',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        flex: '1 1 auto',
        minWidth: 0,
        maxWidth: 'calc(100% - 52px)',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            padding: '6px 6px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            flex: '1 1 auto',
            minWidth: 0,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: activeTab === tab.id ? 'white' : 'transparent',
            color: activeTab === tab.id ? '#8B5A2B' : '#C4A484',
            boxShadow: activeTab === tab.id ? '0 2px 8px rgba(184, 149, 107, 0.2)' : 'none',
          }}
        >
          <span style={{ fontSize: '10px' }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

// 投稿作成ボタン - 茶色・ベージュ系FAB
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
        background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
        color: 'white',
        fontSize: '24px',
        boxShadow: '0 4px 16px rgba(184, 149, 107, 0.5)',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
      }}
    >
      ✏️
    </button>
  )
}

// 空の状態表示 - 茶色・ベージュ系
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
    },
    liked: {
      icon: '❤️',
      title: 'いいねした投稿がありません',
      description: 'すきな投稿にいいねしよう！'
    }
  }

  const { icon, title, description } = messages[feedType]

  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 mx-4 rounded-2xl"
      style={{
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        background: 'rgba(255, 255, 255, 0.9)',
        border: '2px solid #D4C4B0',
        boxShadow: '0 2px 8px rgba(184, 149, 107, 0.1)',
      }}
    >
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2" style={{ color: '#8B5A2B' }}>{title}</h3>
      <p className="text-sm text-center" style={{ color: '#A67C52' }}>{description}</p>
    </div>
  )
}

// ローディングスケルトン - 茶色・ベージュ系
const PostSkeleton: React.FC = () => {
  return (
    <div
      className="rounded-2xl overflow-hidden mb-4 animate-pulse"
      style={{
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        background: 'rgba(255, 255, 255, 0.9)',
        border: '2px solid #E8D5C4',
        boxShadow: '0 2px 8px rgba(184, 149, 107, 0.1)',
      }}
    >
      {/* ヘッダー */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full" style={{ background: '#E8D5C4' }} />
        <div className="flex-1">
          <div className="h-4 w-24 rounded-full mb-1" style={{ background: '#E8D5C4' }} />
          <div className="h-3 w-16 rounded-full" style={{ background: '#F5EDE6' }} />
        </div>
      </div>

      {/* 画像 */}
      <div className="aspect-[4/3]" style={{ background: 'linear-gradient(135deg, #F5EDE6 0%, #E8D5C4 100%)' }} />

      {/* リアクションバー */}
      <div className="flex gap-2 p-3" style={{ borderBottom: '1px solid #E8D5C4' }}>
        <div className="h-8 w-16 rounded-xl" style={{ background: '#F5EDE6' }} />
        <div className="h-8 w-16 rounded-xl" style={{ background: '#F5EDE6' }} />
        <div className="h-8 w-16 rounded-xl" style={{ background: '#F5EDE6' }} />
      </div>

      {/* キャプション */}
      <div className="p-4">
        <div className="h-4 w-full rounded-full mb-2" style={{ background: '#F5EDE6' }} />
        <div className="h-4 w-3/4 rounded-full" style={{ background: '#F5EDE6' }} />
      </div>
    </div>
  )
}

// メインのTimelineView
export const TimelineView: React.FC<TimelineViewProps> = ({
  posts,
  currentUserId,
  onReact,
  onComment,
  onUserClick,
  onFollow,
  onCreatePost,
  onDelete,
  onReport,
  onBlock,
  blockedUserIds = [],
  onOpenSearch,
  activeTab: externalActiveTab,
  onTabChange: externalOnTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<FeedType>('latest')
  const [isLoading, setIsLoading] = useState(false)

  // 外部制御または内部状態を使用
  const activeTab = externalActiveTab ?? internalActiveTab

  // フィードタイプに応じて投稿をフィルタリング（ブロックユーザーは除外）
  // likedタブの場合は親から渡されたpostsをそのまま使用
  const filteredPosts = posts.filter(post => {
    // ブロックしたユーザーの投稿は表示しない
    if (blockedUserIds.includes(post.userId)) {
      return false
    }

    // likedタブの場合は親が既にフィルタリングしているのでそのまま表示
    if (activeTab === 'liked') {
      return true
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
    if (externalOnTabChange) {
      externalOnTabChange(tab)
    } else {
      setInternalActiveTab(tab)
    }
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
      {/* タブ & 検索ボタン */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginBottom: '16px', paddingLeft: '8px', paddingRight: '8px' }}>
        <FeedTabs activeTab={activeTab} onTabChange={handleTabChange} />
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #D4A574 0%, #C4956A 100%)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 2px 8px rgba(184, 149, 107, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
            title="おともだちを さがす"
          >
            🔍
          </button>
        )}
      </div>

      {/* フィード */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px', paddingLeft: '16px', paddingRight: '16px' }}>
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
              currentUserId={currentUserId}
              onReact={onReact}
              onComment={onComment}
              onUserClick={onUserClick}
              onFollow={onFollow}
              onDelete={onDelete}
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
