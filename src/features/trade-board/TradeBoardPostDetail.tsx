'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { tradeBoardService } from '@/services/tradeBoard/tradeBoardService'
import { TradeBoardBookViewer } from './TradeBoardBookViewer'
import { Avatar } from '@/components/ui/Avatar'
import type { TradeBoardPost, TradeBoardComment } from '@/domain/tradeBoard'
import { TRADE_BOARD_RULES } from '@/domain/tradeBoard'

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

// スレッドコメントコンポーネント
type TradeInviteResult = { success: boolean; message: string } | void

const CommentThread: React.FC<{
  comment: TradeBoardComment
  userId?: string
  postUserId: string
  onDeleteComment: (id: string) => void
  onReplyAdded: (parentId: string, reply: TradeBoardComment) => void
  onStartDirectTrade?: (partnerId: string) => Promise<TradeInviteResult>
  onViewProfile?: (userId: string) => void
  postId: string
}> = ({ comment, userId, postUserId, onDeleteComment, onReplyAdded, onStartDirectTrade, onViewProfile, postId }) => {
  const [replies, setReplies] = useState<TradeBoardComment[]>([])
  const [expanded, setExpanded] = useState(false)
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyOpen, setReplyOpen] = useState(false)
  const [submittingReply, setSubmittingReply] = useState(false)
  const [localReplyCount, setLocalReplyCount] = useState(comment.replyCount)
  const [tradeConfirmTarget, setTradeConfirmTarget] = useState<{ id: string; name: string } | null>(null)
  const [inviteResult, setInviteResult] = useState<string | null>(null)
  const [inviting, setInviting] = useState(false)

  const commentAuthor = comment.author?.display_name || comment.author?.username || 'ゲスト'
  const isCommentOwner = userId === comment.userId
  const isPostOwner = userId === postUserId
  const canTrade = userId && !isCommentOwner && onStartDirectTrade

  const handleToggleReplies = useCallback(async () => {
    if (expanded) {
      setExpanded(false)
      return
    }
    setLoadingReplies(true)
    const r = await tradeBoardService.getReplies(comment.id)
    setReplies(r)
    setLocalReplyCount(r.length)
    setExpanded(true)
    setLoadingReplies(false)
  }, [expanded, comment.id])

  // 返信がある場合は自動展開
  useEffect(() => {
    if (comment.replyCount > 0) {
      const loadReplies = async () => {
        setLoadingReplies(true)
        const r = await tradeBoardService.getReplies(comment.id)
        setReplies(r)
        setLocalReplyCount(r.length)
        setExpanded(true)
        setLoadingReplies(false)
      }
      loadReplies()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment.id, comment.replyCount])

  const handleAddReply = useCallback(async () => {
    if (!userId || !replyText.trim()) return
    setSubmittingReply(true)
    const reply = await tradeBoardService.addComment(postId, userId, replyText.trim(), undefined, comment.id)
    if (reply) {
      setReplies(prev => [...prev, reply])
      setReplyText('')
      setLocalReplyCount(prev => prev + 1)
      setExpanded(true)
      onReplyAdded(comment.id, reply)
    }
    setSubmittingReply(false)
  }, [userId, replyText, postId, comment.id, onReplyAdded])

  const handleDeleteReply = useCallback(async (replyId: string) => {
    if (!userId) return
    const ok = await tradeBoardService.deleteComment(replyId, userId)
    if (ok) {
      setReplies(prev => prev.filter(r => r.id !== replyId))
      setLocalReplyCount(prev => Math.max(0, prev - 1))
    }
  }, [userId])

  const atMax = localReplyCount >= TRADE_BOARD_RULES.maxRepliesPerThread

  return (
    <div>
      {/* 親コメント */}
      <div
        className="rounded-xl p-3"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E8D4C0',
        }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <button onClick={() => onViewProfile?.(comment.userId)} className="flex items-center gap-2 min-w-0">
            <Avatar
              src={comment.author?.avatar_url || undefined}
              frameId={comment.author?.selected_frame_id || undefined}
              size="xs"
            />
            <span className="text-xs font-bold" style={{ color: '#8B5A2B' }}>{commentAuthor}</span>
            {comment.author?.level != null && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#F0E6D8', color: '#A67C52' }}>
                Lv.{comment.author.level}
              </span>
            )}
          </button>
          <span className="text-xs" style={{ color: '#C4A484' }}>{formatTime(comment.createdAt)}</span>
          {isCommentOwner && (
            <button
              onClick={() => onDeleteComment(comment.id)}
              className="ml-auto text-xs"
              style={{ color: '#D4764A' }}
            >
              ✕
            </button>
          )}
        </div>
        <div className="text-sm" style={{ color: '#6B4226' }}>{comment.content}</div>
        {comment.offerSticker && (
          <div className="mt-2 flex items-center gap-2 px-2 py-1 rounded-lg" style={{ background: '#FFF0E8' }}>
            <img
              src={comment.offerSticker.image_url}
              alt={comment.offerSticker.name}
              className="w-8 h-8 object-contain"
            />
            <span className="text-xs font-bold" style={{ color: '#8B5A2B' }}>
              {comment.offerSticker.name}をこうかんに出すよ！
            </span>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex items-center gap-3 mt-2">
          {userId && (
            <button
              onClick={() => { setReplyOpen(!replyOpen); if (!expanded && localReplyCount > 0) handleToggleReplies() }}
              className="text-xs font-bold"
              style={{ color: '#A67C52' }}
            >
              返信
            </button>
          )}
          {localReplyCount > 0 && (
            <button
              onClick={handleToggleReplies}
              className="text-xs font-bold"
              style={{ color: '#A67C52' }}
            >
              {loadingReplies ? '...' : expanded ? '返信をとじる' : `返信をみる (${localReplyCount})`}
            </button>
          )}
          {canTrade && (
            <button
              onClick={() => setTradeConfirmTarget({ id: comment.userId, name: commentAuthor })}
              className="ml-auto text-xs font-bold px-3 py-1 rounded-full transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #C4956A, #A67C52)',
                color: '#FFF',
              }}
            >
              こうかんにさそう
            </button>
          )}
        </div>
      </div>

      {/* 返信一覧 */}
      {expanded && replies.length > 0 && (
        <div
          className="ml-4 mt-1 space-y-1.5"
          style={{ borderLeft: '2px solid #E8D4C0', paddingLeft: '12px' }}
        >
          {replies.map(reply => {
            const replyAuthor = reply.author?.display_name || reply.author?.username || 'ゲスト'
            const isReplyOwner = userId === reply.userId
            const isReplyFromPostOwner = reply.userId === postUserId
            const canTradeReply = userId && userId !== reply.userId && onStartDirectTrade
            return (
              <div
                key={reply.id}
                className="rounded-lg p-2.5"
                style={{
                  background: isReplyFromPostOwner ? '#FFF8F0' : '#FFFFFF',
                  border: '1px solid #E8D4C0',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <button onClick={() => onViewProfile?.(reply.userId)} className="flex items-center gap-1.5 min-w-0">
                    <Avatar
                      src={reply.author?.avatar_url || undefined}
                      frameId={reply.author?.selected_frame_id || undefined}
                      size="xs"
                    />
                    <span className="text-[11px] font-bold" style={{ color: '#8B5A2B' }}>
                      {replyAuthor}
                    </span>
                    {reply.author?.level != null && (
                      <span className="text-[9px] font-bold px-1 py-0.5 rounded-full" style={{ background: '#F0E6D8', color: '#A67C52' }}>
                        Lv.{reply.author.level}
                      </span>
                    )}
                    {isReplyFromPostOwner && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: '#FFE8D0', color: '#D4764A' }}>
                        投稿主
                      </span>
                    )}
                  </button>
                  <span className="text-[10px]" style={{ color: '#C4A484' }}>{formatTime(reply.createdAt)}</span>
                  {isReplyOwner && (
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      className="ml-auto text-[10px]"
                      style={{ color: '#D4764A' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="text-xs" style={{ color: '#6B4226' }}>{reply.content}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  {userId && !atMax && (
                    <button
                      onClick={() => { setReplyOpen(true); setReplyText(`@${replyAuthor} `) }}
                      className="text-[10px] font-bold"
                      style={{ color: '#A67C52' }}
                    >
                      返信
                    </button>
                  )}
                  {canTradeReply && (
                    <button
                      onClick={() => setTradeConfirmTarget({ id: reply.userId, name: replyAuthor })}
                      className="ml-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all active:scale-95 whitespace-nowrap"
                      style={{
                        background: 'linear-gradient(135deg, #C4956A, #A67C52)',
                        color: '#FFF',
                      }}
                    >
                      こうかんにさそう
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 返信入力欄 */}
      {replyOpen && userId && (
        <div className="ml-4 mt-1.5" style={{ paddingLeft: '12px' }}>
          {atMax ? (
            <div className="text-xs py-2" style={{ color: '#C4A484' }}>
              これいじょう返信できません
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pr-2">
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value.slice(0, TRADE_BOARD_RULES.maxCommentLength))}
                placeholder="返信を入力..."
                className="flex-1 min-w-0 px-2.5 py-2 rounded-lg text-xs outline-none"
                style={{
                  background: '#FFF8F0',
                  border: '1.5px solid #E8D4C0',
                  color: '#8B5A2B',
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                }}
              />
              <button
                onClick={handleAddReply}
                disabled={!replyText.trim() || submittingReply}
                className="px-2.5 py-2 rounded-lg font-bold text-xs transition-all active:scale-95 whitespace-nowrap flex-shrink-0"
                style={{
                  background: replyText.trim()
                    ? 'linear-gradient(135deg, #C4956A, #A67C52)'
                    : '#D4C4B0',
                  color: '#FFF',
                  opacity: replyText.trim() ? 1 : 0.6,
                }}
              >
                おくる
              </button>
            </div>
          )}
        </div>
      )}

      {/* 交換招待確認ダイアログ */}
      {tradeConfirmTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={() => { if (!inviting) { setTradeConfirmTarget(null); setInviteResult(null) } }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative rounded-2xl p-5 mx-6 w-full max-w-sm"
            style={{ background: '#FFF5F8', fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            onClick={e => e.stopPropagation()}
          >
            {inviteResult ? (
              <>
                <div className="text-center mb-4">
                  <div style={{ fontSize: '40px' }} className="mb-2">{'\u2709\uFE0F'}</div>
                  <div className="text-base font-bold" style={{ color: '#8B5A2B' }}>
                    {inviteResult}
                  </div>
                </div>
                <button
                  onClick={() => { setTradeConfirmTarget(null); setInviteResult(null) }}
                  className="w-full py-2.5 rounded-xl font-bold text-sm whitespace-nowrap"
                  style={{ background: '#E8D4C0', color: '#8B5A2B' }}
                >
                  とじる
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-4">
                  <div className="text-base font-bold mb-2" style={{ color: '#8B5A2B' }}>
                    {tradeConfirmTarget.name}さんを
                  </div>
                  <div className="text-base font-bold" style={{ color: '#8B5A2B' }}>
                    こうかんにさそう？
                  </div>
                  <div className="text-xs mt-2" style={{ color: '#A67C52' }}>
                    メッセージで交換をすすめられるよ
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTradeConfirmTarget(null)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap"
                    style={{ background: '#E8D4C0', color: '#8B5A2B' }}
                  >
                    やめる
                  </button>
                  <button
                    disabled={inviting}
                    onClick={async () => {
                      setInviting(true)
                      const result = await onStartDirectTrade?.(tradeConfirmTarget.id)
                      setInviting(false)
                      if (result) {
                        setInviteResult(result.message)
                      } else {
                        setTradeConfirmTarget(null)
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 whitespace-nowrap"
                    style={{
                      background: inviting ? '#D4C4B0' : 'linear-gradient(135deg, #C4956A, #A67C52)',
                      color: '#FFF',
                      opacity: inviting ? 0.7 : 1,
                    }}
                  >
                    {inviting ? 'さそいちゅう...' : 'さそう！'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface TradeBoardPostDetailProps {
  postId: string
  userId?: string
  onBack: () => void
  onStartDirectTrade?: (partnerId: string) => Promise<TradeInviteResult>
  onViewProfile?: (userId: string) => void
}

export const TradeBoardPostDetail: React.FC<TradeBoardPostDetailProps> = ({
  postId,
  userId,
  onBack,
  onStartDirectTrade,
  onViewProfile,
}) => {
  const [post, setPost] = useState<TradeBoardPost | null>(null)
  const [comments, setComments] = useState<TradeBoardComment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [p, c] = await Promise.all([
        tradeBoardService.getPostById(postId, userId),
        tradeBoardService.getComments(postId),
      ])
      setPost(p)
      setComments(c)
      setLoading(false)
    }
    load()
  }, [postId, userId])

  const handleLike = useCallback(async () => {
    if (!userId || !post) return
    const isNowLiked = await tradeBoardService.toggleLike(postId, userId)
    setPost(prev => prev ? {
      ...prev,
      isLiked: isNowLiked,
      likeCount: prev.likeCount + (isNowLiked ? 1 : -1),
    } : null)
  }, [userId, post, postId])

  const handleAddComment = useCallback(async () => {
    if (!userId || !commentText.trim()) return
    setSubmitting(true)
    const comment = await tradeBoardService.addComment(postId, userId, commentText.trim())
    if (comment) {
      setComments(prev => [...prev, comment])
      setCommentText('')
      setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null)
    }
    setSubmitting(false)
  }, [userId, commentText, postId])

  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (!userId) return
    const ok = await tradeBoardService.deleteComment(commentId, userId)
    if (ok) {
      setComments(prev => prev.filter(c => c.id !== commentId))
      setPost(prev => prev ? { ...prev, commentCount: Math.max(0, prev.commentCount - 1) } : null)
    }
  }, [userId])

  const handleReplyAdded = useCallback((_parentId: string, _reply: TradeBoardComment) => {
    setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null)
  }, [])

  const handleCancel = useCallback(async () => {
    if (!userId || !post) return
    const ok = await tradeBoardService.cancelPost(postId, userId)
    if (ok) onBack()
  }, [userId, post, postId, onBack])

  if (loading) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: '#D4C4B0', borderTopColor: 'transparent' }} />
          <span className="text-sm font-bold" style={{ color: '#C4A484' }}>よみこみちゅう...</span>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div
        className="h-full flex flex-col items-center justify-center gap-3"
        style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
      >
        <span style={{ fontSize: '48px' }}>&#x1F614;</span>
        <span className="text-sm font-bold" style={{ color: '#A67C52' }}>投稿がみつからないよ</span>
        <button onClick={onBack} className="text-sm font-bold px-4 py-2 rounded-full" style={{ background: '#E8D4C0', color: '#8B5A2B' }}>もどる</button>
      </div>
    )
  }

  const isOwner = userId === post.userId
  const displayName = post.author?.display_name || post.author?.username || 'ゲスト'

  return (
    <div
      className="h-full flex flex-col"
      style={{
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        background: '#FFF5F8',
      }}
    >
      {/* ヘッダー */}
      <div
        className="shrink-0 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'linear-gradient(135deg, #FFF5F0, #FFF0E8)',
          borderBottom: '2px solid #E8D4C0',
        }}
      >
        <button
          onClick={onBack}
          className="text-sm font-bold"
          style={{ color: '#A67C52' }}
        >
          &#x2190; もどる
        </button>
        <div className="flex-1 text-center text-sm font-bold" style={{ color: '#8B5A2B' }}>
          投稿のしょうさい
        </div>
        <div className="w-12" />
      </div>

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 space-y-4">
          {/* 投稿者情報 */}
          <div className="flex items-center gap-3">
            <button onClick={() => onViewProfile?.(post.userId)} className="flex items-center gap-3 min-w-0">
              <Avatar
                src={post.author?.avatar_url || undefined}
                frameId={post.author?.selected_frame_id || undefined}
                size="sm"
              />
              <div className="text-left">
                <div className="font-bold text-sm" style={{ color: '#8B5A2B' }}>{displayName}</div>
                <div className="text-xs" style={{ color: '#C4A484' }}>
                  {formatTime(post.createdAt)}
                  {post.author?.level != null && ` ・ Lv.${post.author.level}`}
                </div>
              </div>
            </button>
            <div className="flex-1" />
            {isOwner && (
              <button
                onClick={handleCancel}
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{ background: '#FFE8E0', color: '#D4764A' }}
              >
                とりけす
              </button>
            )}
          </div>

          {/* メッセージ */}
          {post.message && (
            <div
              className="text-sm leading-relaxed"
              style={{
                color: '#6B4226',
                background: '#FFF8F0',
                borderRadius: '16px',
                padding: '12px 16px',
                border: '1.5px solid #E8D4C0',
              }}
            >
              {post.message}
            </div>
          )}

          {/* ほしいシール */}
          <div>
            <div className="text-xs font-bold mb-2 flex items-center gap-1" style={{ color: '#A67C52' }}>
              <span style={{ fontSize: '14px' }}>&#x2B50;</span>
              ほしいシール
            </div>
            <div className="flex gap-2 flex-wrap">
              {(post.wantedStickers || []).map(sticker => (
                <div
                  key={sticker.id}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl"
                  style={{
                    background: '#FFF0E8',
                    border: '1.5px solid #E8D4C0',
                    minWidth: '72px',
                  }}
                >
                  <img
                    src={sticker.image_url}
                    alt={sticker.name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-[10px] font-bold text-center" style={{ color: '#8B5A2B' }}>
                    {sticker.name}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: sticker.rarity }).map((_, i) => (
                      <span key={i} style={{ fontSize: '8px', color: '#FFB800' }}>&#x2B50;</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* シール帳ビューア */}
          {post.bookSnapshot?.pages && post.bookSnapshot.pages.length > 0 && (
            <div>
              <div className="text-xs font-bold mb-2 flex items-center gap-1" style={{ color: '#A67C52' }}>
                <span style={{ fontSize: '14px' }}>&#x1F4D6;</span>
                シール帳
              </div>
              <div
                className="rounded-2xl overflow-hidden flex justify-center"
                style={{
                  background: '#FBF5EF',
                  border: '2px solid #E8D4C0',
                  padding: '12px',
                }}
              >
                <TradeBoardBookViewer
                  snapshot={post.bookSnapshot}
                  width={150}
                  height={225}
                  displayScale={150 / 320}
                />
              </div>
              <div
                className="text-center mt-2"
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
            </div>
          )}

          {/* いいね */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 transition-all active:scale-95"
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                background: post.isLiked ? 'rgba(212, 118, 74, 0.15)' : 'rgba(184, 149, 107, 0.1)',
              }}
            >
              <span style={{ fontSize: '16px' }}>{post.isLiked ? '\u2764\uFE0F' : '\u{1F90D}'}</span>
              <span className="text-sm font-bold" style={{ color: post.isLiked ? '#D4764A' : '#A67C52' }}>
                {post.likeCount > 0 ? post.likeCount : 'いいね'}
              </span>
            </button>
          </div>

          {/* コメントセクション */}
          <div>
            <div className="text-xs font-bold mb-3 flex items-center gap-1" style={{ color: '#A67C52' }}>
              <span style={{ fontSize: '14px' }}>&#x1F4AC;</span>
              コメント ({post.commentCount})
            </div>

            {comments.length === 0 ? (
              <div className="text-center py-6">
                <span className="text-xs" style={{ color: '#C4A484' }}>まだコメントがないよ</span>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map(comment => (
                  <CommentThread
                    key={comment.id}
                    comment={comment}
                    userId={userId}
                    postUserId={post.userId}
                    onDeleteComment={handleDeleteComment}
                    onReplyAdded={handleReplyAdded}
                    onStartDirectTrade={onStartDirectTrade}
                    onViewProfile={onViewProfile}
                    postId={postId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* コメント入力 */}
      {userId && (
        <div
          className="shrink-0 px-3 py-3 flex items-center gap-2"
          style={{
            background: '#FFFFFF',
            borderTop: '2px solid #E8D4C0',
          }}
        >
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value.slice(0, TRADE_BOARD_RULES.maxCommentLength))}
            placeholder="コメントを入力..."
            className="flex-1 min-w-0 px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: '#FFF8F0',
              border: '2px solid #E8D4C0',
              color: '#8B5A2B',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={!commentText.trim() || submitting}
            className="px-3 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 whitespace-nowrap flex-shrink-0"
            style={{
              background: commentText.trim()
                ? 'linear-gradient(135deg, #C4956A, #A67C52)'
                : '#D4C4B0',
              color: '#FFF',
              opacity: commentText.trim() ? 1 : 0.6,
            }}
          >
            おくる
          </button>
        </div>
      )}
    </div>
  )
}
