'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { filterContent, isKidSafe, getFilterReason, FilterResult } from '@/utils/contentFilter'

// コメント情報（ツリー対応）
export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatarUrl?: string
  content: string
  createdAt: string
  isOwner: boolean
  parentId?: string | null  // 返信先コメントID（nullはトップレベル）
  replyCount: number        // 返信数
  replies?: Comment[]       // 子コメント（フロントエンドで構築）
}

interface CommentModalProps {
  isOpen: boolean
  postId: string
  comments: Comment[]
  onClose: () => void
  onAddComment: (postId: string, content: string) => void
  onAddReply: (postId: string, content: string, parentId: string) => void  // 返信追加
  onDeleteComment: (commentId: string) => void
  onLoadReplies?: (commentId: string) => Promise<Comment[]>  // 返信を読み込み（オプション）
  onUserClick?: (userId: string) => void  // ユーザープロフィール表示
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

// コメントをツリー構造に変換
const buildCommentTree = (comments: Comment[]): Comment[] => {
  const commentMap = new Map<string, Comment>()
  const rootComments: Comment[] = []

  // まず全コメントをマップに登録
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  // 親子関係を構築
  comments.forEach(comment => {
    const node = commentMap.get(comment.id)!
    if (comment.parentId && commentMap.has(comment.parentId)) {
      // 親がある場合は親のrepliesに追加
      const parent = commentMap.get(comment.parentId)!
      parent.replies = parent.replies || []
      parent.replies.push(node)
    } else {
      // トップレベルコメント
      rootComments.push(node)
    }
  })

  // 各ツリーを時間順にソート
  const sortByTime = (a: Comment, b: Comment) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()

  const sortReplies = (comments: Comment[]) => {
    comments.sort(sortByTime)
    comments.forEach(c => {
      if (c.replies && c.replies.length > 0) {
        sortReplies(c.replies)
      }
    })
  }

  sortReplies(rootComments)
  return rootComments
}

// 再帰的なコメントツリーコンポーネント（Twitterスタイル：最大1段インデント）
const CommentTreeNode: React.FC<{
  comment: Comment
  depth: number
  isLastInThread?: boolean  // スレッド内の最後かどうか
  onDelete?: () => void
  onReply: (comment: Comment) => void
  onLoadReplies?: (commentId: string) => Promise<Comment[]>
  expandedReplies: Set<string>
  onToggleReplies: (commentId: string) => void
  loadedReplies: Map<string, Comment[]>
  setLoadedReplies: (map: Map<string, Comment[]>) => void
  onUserClick?: (userId: string) => void  // ユーザープロフィール表示
}> = ({
  comment,
  depth,
  isLastInThread = true,
  onDelete,
  onReply,
  onLoadReplies,
  expandedReplies,
  onToggleReplies,
  loadedReplies,
  setLoadedReplies,
  onUserClick,
}) => {
  const [loadingReplies, setLoadingReplies] = useState(false)

  // Twitterスタイル：返信は全て1段階のインデントのみ
  // ネストされているため、depth=1の場合のみインデントを追加
  // depth>=2は親のコンテナ内にいるので追加インデント不要
  const isReply = depth > 0
  const indent = depth === 1 ? 36 : 0  // 最初の返信レベルのみ36px、それ以降は0（累積でちょうど36pxになる）

  // 返信を読み込む
  const handleLoadReplies = async () => {
    if (!onLoadReplies || loadingReplies) return

    if (expandedReplies.has(comment.id)) {
      onToggleReplies(comment.id)
      return
    }

    setLoadingReplies(true)
    try {
      const replies = await onLoadReplies(comment.id)
      const newMap = new Map(loadedReplies)
      newMap.set(comment.id, replies)
      setLoadedReplies(newMap)
      onToggleReplies(comment.id)
    } catch (error) {
      console.error('Failed to load replies:', error)
    } finally {
      setLoadingReplies(false)
    }
  }

  // 表示する返信（ローカルのrepliesまたはロード済みの返信）
  const displayReplies = comment.replies && comment.replies.length > 0
    ? comment.replies
    : (expandedReplies.has(comment.id) ? loadedReplies.get(comment.id) || [] : [])

  const hasReplies = displayReplies && displayReplies.length > 0

  return (
    <div style={{ marginLeft: `${indent}px`, position: 'relative' }}>
      {/* 縦の接続ライン（返信がある場合、または返信の場合に表示） */}
      {isReply && (
        <div style={{
          position: 'absolute',
          left: '14px',  // アバターの中心
          top: '-8px',
          height: '20px',
          width: '2px',
          background: '#E9D5FF',
        }} />
      )}

      {/* 次のコメントへの接続ライン */}
      {isReply && !isLastInThread && (
        <div style={{
          position: 'absolute',
          left: '14px',
          top: '32px',
          bottom: '-8px',
          width: '2px',
          background: '#E9D5FF',
        }} />
      )}

      {/* 子コメントへの接続ライン（返信が子返信を持つ場合のみ、トップレベルには描画しない） */}
      {hasReplies && isReply && (
        <div style={{
          position: 'absolute',
          left: '14px',
          top: '40px',
          bottom: '0',
          width: '2px',
          background: '#E9D5FF',
        }} />
      )}

      {/* コメント本体 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        paddingTop: isReply ? '8px' : '12px',
        paddingBottom: '8px',
        borderBottom: !isReply && !hasReplies ? '1px solid #F3F4F6' : 'none',
        position: 'relative',
      }}>
        {/* アバター（タップでプロフィール表示） */}
        <div
          style={{ flexShrink: 0, position: 'relative', zIndex: 1, cursor: onUserClick ? 'pointer' : 'default' }}
          onClick={() => onUserClick?.(comment.userId)}
        >
          <div style={{
            width: isReply ? '28px' : '36px',
            height: isReply ? '28px' : '36px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom right, #C4B5FD, #F9A8D4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isReply ? '12px' : '14px',
          }}>
            {comment.userAvatarUrl ? (
              <img
                src={comment.userAvatarUrl}
                alt={comment.userName}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              '👤'
            )}
          </div>
        </div>

        {/* コンテンツ */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span
              style={{
                fontWeight: 'bold',
                color: '#7C3AED',
                fontSize: isReply ? '12px' : '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: onUserClick ? 'pointer' : 'default',
              }}
              onClick={() => onUserClick?.(comment.userId)}
            >
              {comment.userName}
            </span>
            <span style={{ fontSize: '11px', color: '#C4B5FD' }}>
              {formatTime(comment.createdAt)}
            </span>
          </div>
          <p style={{
            fontSize: isReply ? '13px' : '14px',
            color: '#7C3AED',
            wordBreak: 'break-word',
            lineHeight: '1.4',
          }}>
            {comment.content}
          </p>

          {/* アクションボタン */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
            {/* 返信ボタン */}
            <button
              onClick={() => onReply(comment)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#A78BFA',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <span>↩️</span>
              <span>返信</span>
            </button>

            {/* 返信表示/非表示ボタン */}
            {comment.replyCount > 0 && !comment.replies?.length && (
              <button
                onClick={handleLoadReplies}
                disabled={loadingReplies}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#8B5CF6',
                  cursor: loadingReplies ? 'wait' : 'pointer',
                  fontWeight: 500,
                }}
              >
                {loadingReplies ? (
                  <span>読み込み中...</span>
                ) : expandedReplies.has(comment.id) ? (
                  <>
                    <span>▼</span>
                    <span>返信を閉じる</span>
                  </>
                ) : (
                  <>
                    <span>▶</span>
                    <span>{comment.replyCount}件の返信を表示</span>
                  </>
                )}
              </button>
            )}

            {/* 削除ボタン（自分のコメントのみ） */}
            {comment.isOwner && onDelete && (
              <button
                onClick={onDelete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                }}
              >
                <span>🗑️</span>
                <span>削除</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 子コメント（再帰的にレンダリング） */}
      {hasReplies && (
        <div style={{ position: 'relative' }}>
          {displayReplies.map((reply, index) => (
            <CommentTreeNode
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              isLastInThread={index === displayReplies.length - 1}
              onDelete={reply.isOwner ? () => onDelete?.() : undefined}
              onReply={onReply}
              onLoadReplies={onLoadReplies}
              expandedReplies={expandedReplies}
              onToggleReplies={onToggleReplies}
              loadedReplies={loadedReplies}
              setLoadedReplies={setLoadedReplies}
              onUserClick={onUserClick}
            />
          ))}
        </div>
      )}

      {/* トップレベルコメントの区切り線（返信がある場合） */}
      {!isReply && hasReplies && (
        <div style={{
          marginTop: '8px',
          marginBottom: '4px',
          borderBottom: '1px solid #F3F4F6',
        }} />
      )}
    </div>
  )
}

// 定型文ボタン
const QuickReply: React.FC<{
  text: string
  onClick: () => void
}> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingTop: '6px',
        paddingBottom: '6px',
        background: '#FAF5FF',
        color: '#7C3AED',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
    >
      {text}
    </button>
  )
}

// 定型文一覧（安全なメッセージのみ）
const quickReplies = [
  'かわいい！✨',
  'すごい！👏',
  'いいね！🩷',
  'うらやましい！',
  'まねしたい！',
  'センスいい！',
  'さいこう！🌟',
  'すてき！💕',
]

// フィルター警告コンポーネント
const FilterWarning: React.FC<{
  filterResult: FilterResult
}> = ({ filterResult }) => {
  if (filterResult.isClean) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', background: '#FEFCE8', border: '1px solid #FEF08A', borderRadius: '8px', marginBottom: '8px' }}>
      <span style={{ color: '#CA8A04', fontSize: '14px' }}>⚠️</span>
      <p style={{ color: '#A16207', fontSize: '12px' }}>
        {getFilterReason(filterResult)}
      </p>
    </div>
  )
}

export const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  postId,
  comments,
  onClose,
  onAddComment,
  onAddReply,
  onDeleteComment,
  onLoadReplies,
  onUserClick,
}) => {
  const [newComment, setNewComment] = useState('')
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null)
  const [showFilterError, setShowFilterError] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)  // 返信先コメント
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())
  const [loadedReplies, setLoadedReplies] = useState<Map<string, Comment[]>>(new Map())
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // コメントをツリー構造に変換
  const commentTree = buildCommentTree(comments)

  // 総コメント数（返信含む）
  const totalCommentCount = comments.length

  // モーダル開いたときに入力欄にフォーカス
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // 新しいコメントが追加されたらスクロール
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [comments.length])

  // 入力内容が変わったらフィルターチェック
  useEffect(() => {
    if (newComment.trim()) {
      const result = filterContent(newComment)
      setFilterResult(result)
    } else {
      setFilterResult(null)
    }
    setShowFilterError(false)
  }, [newComment])

  // 返信対象の切り替え
  const handleToggleReplies = useCallback((commentId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev)
      if (next.has(commentId)) {
        next.delete(commentId)
      } else {
        next.add(commentId)
      }
      return next
    })
  }, [])

  // 返信ボタンを押したとき
  const handleReplyClick = useCallback((comment: Comment) => {
    setReplyingTo(comment)
    inputRef.current?.focus()
  }, [])

  // 返信をキャンセル
  const handleCancelReply = useCallback(() => {
    setReplyingTo(null)
  }, [])

  // コメント送信
  const handleSubmit = () => {
    const trimmed = newComment.trim()
    if (!trimmed) return

    // フィルターチェック
    const result = filterContent(trimmed)
    if (!result.isClean) {
      setShowFilterError(true)
      return
    }

    // 子ども向け追加チェック
    if (!isKidSafe(trimmed)) {
      setShowFilterError(true)
      setFilterResult({
        isClean: false,
        filteredText: trimmed,
        detectedIssues: ['個人情報の可能性']
      })
      return
    }

    if (replyingTo) {
      // 返信の場合
      onAddReply(postId, trimmed, replyingTo.id)
    } else {
      // トップレベルコメントの場合
      onAddComment(postId, trimmed)
    }

    setNewComment('')
    setFilterResult(null)
    setShowFilterError(false)
    setReplyingTo(null)
  }

  // 定型文選択
  const handleQuickReply = (text: string) => {
    setNewComment(text)
    inputRef.current?.focus()
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* 背景オーバーレイ（上部タップで閉じる） */}
      <div
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* モーダル本体（下からスライド） */}
      <div
        style={{ background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '10px',
          paddingBottom: '14px',
          position: 'relative',
          backgroundImage: 'url(/images/Header_UI.png)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          minHeight: '52px',
        }}>
          {/* ドラッグハンドル */}
          <div style={{ position: 'absolute', top: '4px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '4px', background: 'rgba(255, 255, 255, 0.6)', borderRadius: '9999px' }} />

          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            marginTop: '4px',
            textShadow: '0 1px 3px rgba(157, 76, 108, 0.6), 0 0 8px rgba(255, 255, 255, 0.3)',
          }}>
            💬 コメント
            {totalCommentCount > 0 && (
              <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'normal', marginLeft: '4px' }}>
                ({totalCommentCount})
              </span>
            )}
          </h2>

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '16px',
              top: '10px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <span style={{ color: '#9D4C6C', fontWeight: 'bold' }}>✕</span>
          </button>
        </header>

        {/* コメントリスト */}
        <div
          ref={listRef}
          style={{ flex: 1, overflowY: 'auto', paddingLeft: '16px', paddingRight: '16px' }}
        >
          {commentTree.length > 0 ? (
            commentTree.map(comment => (
              <CommentTreeNode
                key={comment.id}
                comment={comment}
                depth={0}
                onDelete={comment.isOwner ? () => onDeleteComment(comment.id) : undefined}
                onReply={handleReplyClick}
                onLoadReplies={onLoadReplies}
                expandedReplies={expandedReplies}
                onToggleReplies={handleToggleReplies}
                loadedReplies={loadedReplies}
                setLoadedReplies={setLoadedReplies}
                onUserClick={onUserClick}
              />
            ))
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '48px', paddingBottom: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💬</div>
              <p style={{ color: '#A78BFA', fontSize: '14px' }}>
                まだコメントがありません
              </p>
              <p style={{ color: '#C4B5FD', fontSize: '12px', marginTop: '4px' }}>
                さいしょのコメントをしよう！
              </p>
            </div>
          )}
        </div>

        {/* 定型文 */}
        <div style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', borderTop: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            {quickReplies.map((reply, index) => (
              <QuickReply
                key={index}
                text={reply}
                onClick={() => handleQuickReply(reply)}
              />
            ))}
          </div>
        </div>

        {/* フィルター警告 */}
        {showFilterError && filterResult && (
          <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
            <FilterWarning filterResult={filterResult} />
          </div>
        )}

        {/* 返信中インジケーター */}
        {replyingTo && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '8px',
            paddingBottom: '8px',
            background: '#FAF5FF',
            borderTop: '1px solid #E9D5FF',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#8B5CF6', fontSize: '14px' }}>↩️</span>
              <span style={{ color: '#7C3AED', fontSize: '13px' }}>
                <strong>{replyingTo.userName}</strong> に返信中
              </span>
            </div>
            <button
              onClick={handleCancelReply}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#A78BFA',
                cursor: 'pointer',
              }}
            >
              キャンセル
            </button>
          </div>
        )}

        {/* 入力欄 */}
        <div style={{ padding: '16px', borderTop: '1px solid #F3F4F6', background: 'white' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyingTo ? `${replyingTo.userName}に返信...` : 'コメントを入力...'}
                rows={1}
                maxLength={100}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                  if (e.key === 'Escape' && replyingTo) {
                    handleCancelReply()
                  }
                }}
                style={{
                  width: '100%',
                  paddingLeft: '16px',
                  paddingRight: '48px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: showFilterError && filterResult && !filterResult.isClean
                    ? '2px solid #FACC15'
                    : replyingTo
                      ? '2px solid #8B5CF6'
                      : '2px solid #E9D5FF',
                  borderRadius: '16px',
                  fontSize: '14px',
                  resize: 'none',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  background: showFilterError && filterResult && !filterResult.isClean ? '#FEFCE8' : 'white',
                  minHeight: '48px',
                  maxHeight: '120px',
                }}
              />
              <span style={{ position: 'absolute', right: '12px', bottom: '12px', fontSize: '12px', color: '#C4B5FD' }}>
                {newComment.length}/100
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!newComment.trim()}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                background: !newComment.trim() ? '#E5E7EB' : 'linear-gradient(to right, #8B5CF6, #EC4899)',
                color: !newComment.trim() ? '#9CA3AF' : 'white',
                boxShadow: !newComment.trim() ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: 'none',
                cursor: !newComment.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              <span style={{ fontSize: '20px' }}>↑</span>
            </button>
          </div>

          {/* 安全なコミュニケーションのヒント */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#C4B5FD', marginTop: '8px' }}>
            🛡️ やさしいことばでコメントしよう
          </p>
        </div>
      </div>
    </div>
  )
}

export default CommentModal
