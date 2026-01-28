'use client'

import React, { memo, lazy, Suspense } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import type { TradeBoardPost } from '@/domain/tradeBoard'

const TradeBoardBookViewer = lazy(() =>
  import('./TradeBoardBookViewer').then(m => ({ default: m.TradeBoardBookViewer }))
)

// 時間フォーマット
const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'たった今'
  if (diffMins < 60) return `${diffMins}分まえ`
  if (diffHours < 24) return `${diffHours}時間まえ`
  if (diffDays < 7) return `${diffDays}日まえ`
  return `${date.getMonth() + 1}/${date.getDate()}`
}

interface TradeBoardPostCardProps {
  post: TradeBoardPost
  onTap: (postId: string) => void
  onLike: (postId: string) => void
}

export const TradeBoardPostCard: React.FC<TradeBoardPostCardProps> = memo(({
  post,
  onTap,
  onLike,
}) => {
  const displayName = post.author?.display_name || post.author?.username || 'ゲスト'

  return (
    <div
      onClick={() => onTap(post.id)}
      className="w-full text-left cursor-pointer"
      style={{
        background: '#FFFFFF',
        border: '2px solid #D4C4B0',
        borderRadius: '20px',
        padding: '14px',
        boxShadow: '0 3px 12px rgba(184, 149, 107, 0.15)',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* ヘッダー: アバター + 名前 + 時間 */}
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar
          src={post.author?.avatar_url || undefined}
          frameId={post.author?.selected_frame_id || undefined}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div
            className="font-bold text-sm truncate"
            style={{ color: '#8B5A2B' }}
          >
            {displayName}
          </div>
          <div
            className="text-xs"
            style={{ color: '#C4A484' }}
          >
            {formatTime(post.createdAt)}
          </div>
        </div>
        {post.author?.level != null && (
          <div
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #C4956A, #A67C52)',
              color: '#FFF',
            }}
          >
            Lv.{post.author.level}
          </div>
        )}
      </div>

      {/* メッセージ */}
      {post.message && (
        <div
          className="text-sm mb-3 leading-relaxed"
          style={{
            color: '#6B4226',
            background: '#FFF8F0',
            borderRadius: '12px',
            padding: '8px 12px',
          }}
        >
          {post.message}
        </div>
      )}

      {/* ほしいシール一覧 */}
      <div className="mb-3">
        <div
          className="text-xs font-bold mb-1.5 flex items-center gap-1"
          style={{ color: '#A67C52' }}
        >
          <span style={{ fontSize: '14px' }}>&#x2B50;</span>
          ほしいシール
        </div>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(calc(50% - 4px), 1fr))' }}
        >
          {(post.wantedStickers || []).map((sticker) => (
            <div
              key={sticker.id}
              className="flex items-center gap-2 p-1.5 rounded-xl"
              style={{
                background: '#FFF0E8',
                border: '1.5px solid #E8D4C0',
              }}
            >
              <img
                src={sticker.image_url}
                alt={sticker.name}
                className="w-8 h-8 shrink-0 object-contain"
              />
              <span
                className="text-[10px] font-bold leading-tight flex-1 min-w-0"
                style={{ color: '#8B5A2B' }}
              >
                {sticker.name}
              </span>
            </div>
          ))}
          {/* wantedStickersが未ロードの場合、IDの数だけプレースホルダ */}
          {!post.wantedStickers && post.wantedStickerIds.length > 0 && (
            <div
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: '#F0E8E0', color: '#C4A484' }}
            >
              {post.wantedStickerIds.length}まいのシール
            </div>
          )}
        </div>
      </div>

      {/* シール帳プレビュー */}
      {post.bookSnapshot?.pages && post.bookSnapshot.pages.length > 0 && (
        <>
          <div
            className="mb-1 rounded-xl overflow-hidden flex justify-center"
            style={{
              background: '#FBF5EF',
              border: '1.5px solid #E8D4C0',
              padding: '4px',
            }}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center w-full" style={{ height: 225 }}>
                <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#D4C4B0', borderTopColor: 'transparent' }} />
              </div>
            }>
              <TradeBoardBookViewer
                snapshot={post.bookSnapshot}
                width={150}
                height={225}
                displayScale={150 / 320}
              />
            </Suspense>
          </div>
          <div
            className="text-center mb-3"
            style={{
              color: '#8B5A2B',
              fontSize: '12px',
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
          >
            {displayName}のシール帳
          </div>
        </>
      )}

      {/* フッター: いいね + コメント数 */}
      <div className="flex items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onLike(post.id)
          }}
          className="flex items-center gap-1.5 transition-all active:scale-95"
          style={{
            padding: '4px 12px',
            borderRadius: '9999px',
            background: post.isLiked
              ? 'rgba(212, 118, 74, 0.15)'
              : 'rgba(184, 149, 107, 0.1)',
          }}
        >
          <span style={{ fontSize: '14px' }}>
            {post.isLiked ? '\u2764\uFE0F' : '\u{1F90D}'}
          </span>
          <span
            className="text-xs font-bold"
            style={{ color: post.isLiked ? '#D4764A' : '#A67C52' }}
          >
            {post.likeCount > 0 ? post.likeCount : 'いいね'}
          </span>
        </button>
        <div
          className="flex items-center gap-1.5"
          style={{ color: '#A67C52' }}
        >
          <span style={{ fontSize: '14px' }}>&#x1F4AC;</span>
          <span className="text-xs font-bold">
            {post.commentCount > 0 ? post.commentCount : 'コメント'}
          </span>
        </div>
      </div>
    </div>
  )
})

TradeBoardPostCard.displayName = 'TradeBoardPostCard'
