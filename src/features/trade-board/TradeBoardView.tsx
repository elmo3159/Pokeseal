'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { tradeBoardService } from '@/services/tradeBoard/tradeBoardService'
import { TradeBoardPostCard } from './TradeBoardPostCard'
import type { TradeBoardPost } from '@/domain/tradeBoard'

interface TradeBoardViewProps {
  userId?: string
  onOpenCreate: () => void
  onOpenDetail: (postId: string) => void
}

export const TradeBoardView: React.FC<TradeBoardViewProps> = ({
  userId,
  onOpenCreate,
  onOpenDetail,
}) => {
  const [posts, setPosts] = useState<TradeBoardPost[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const LIMIT = 20

  const loadPosts = useCallback(async (reset = false) => {
    if (!reset && !hasMore) return
    const isInitial = reset
    if (isInitial) setLoading(true)
    else setLoadingMore(true)

    const offset = isInitial ? 0 : posts.length
    const result = await tradeBoardService.getPosts(LIMIT, offset, userId)

    if (isInitial) {
      setPosts(result)
    } else {
      setPosts(prev => [...prev, ...result])
    }
    setHasMore(result.length >= LIMIT)
    setLoading(false)
    setLoadingMore(false)
  }, [hasMore, posts.length, userId])

  useEffect(() => {
    loadPosts(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleLike = useCallback(async (postId: string) => {
    if (!userId) return
    const isNowLiked = await tradeBoardService.toggleLike(postId, userId)
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return {
        ...p,
        isLiked: isNowLiked,
        likeCount: p.likeCount + (isNowLiked ? 1 : -1),
      }
    }))
  }, [userId])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 200 && !loadingMore && hasMore) {
      loadPosts(false)
    }
  }, [loadPosts, loadingMore, hasMore])

  return (
    <div
      className="h-full flex flex-col"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* ヘッダー */}
      <div
        className="shrink-0 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, #FFF5F0, #FFF0E8)',
          borderBottom: '2px solid #E8D4C0',
        }}
      >
        <div>
          <h2
            className="text-base font-bold"
            style={{ color: '#8B5A2B' }}
          >
            こうかん掲示板
          </h2>
          <p
            className="text-xs"
            style={{ color: '#C4A484' }}
          >
            シールをこうかんしよう！
          </p>
        </div>
      </div>

      {/* 投稿一覧 */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
        style={{ background: '#FFF5F8' }}
        onScroll={handleScroll}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div
              className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: '#D4C4B0', borderTopColor: 'transparent' }}
            />
            <span className="text-sm font-bold" style={{ color: '#C4A484' }}>
              よみこみちゅう...
            </span>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span style={{ fontSize: '48px' }}>&#x1F4CB;</span>
            <span
              className="text-sm font-bold"
              style={{ color: '#A67C52' }}
            >
              まだ投稿がないよ
            </span>
            <span
              className="text-xs"
              style={{ color: '#C4A484' }}
            >
              さいしょの投稿をしてみよう！
            </span>
          </div>
        ) : (
          <>
            {posts.map(post => (
              <TradeBoardPostCard
                key={post.id}
                post={post}
                onTap={onOpenDetail}
                onLike={handleLike}
              />
            ))}
            {loadingMore && (
              <div className="flex justify-center py-4">
                <div
                  className="w-6 h-6 rounded-full border-3 border-t-transparent animate-spin"
                  style={{ borderColor: '#D4C4B0', borderTopColor: 'transparent' }}
                />
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <div
                className="text-center text-xs py-4 font-bold"
                style={{ color: '#C4A484' }}
              >
                ぜんぶ読んだよ！
              </div>
            )}
          </>
        )}
      </div>

      {/* フローティング投稿ボタン */}
      {userId && (
        <button
          onClick={onOpenCreate}
          className="fixed z-30 flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
          style={{
            bottom: '110px',
            right: '16px',
            background: 'linear-gradient(135deg, #C4956A, #A67C52)',
            color: '#FFF',
            borderRadius: '9999px',
            padding: '12px 20px',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 4px 16px rgba(166, 124, 82, 0.4)',
          }}
        >
          <span style={{ fontSize: '16px' }}>&#x270F;&#xFE0F;</span>
          投稿する
        </button>
      )}
    </div>
  )
}
