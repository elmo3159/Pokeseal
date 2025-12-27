'use client'

import React, { useState, useRef, useEffect } from 'react'
import { filterContent, isKidSafe, getFilterReason, FilterResult } from '@/utils/contentFilter'

// コメント情報
export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatarUrl?: string
  content: string
  createdAt: string
  isOwner: boolean
}

interface CommentModalProps {
  isOpen: boolean
  postId: string
  comments: Comment[]
  onClose: () => void
  onAddComment: (postId: string, content: string) => void
  onDeleteComment: (commentId: string) => void
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

// コメントカード
const CommentCard: React.FC<{
  comment: Comment
  onDelete?: () => void
}> = ({ comment, onDelete }) => {
  return (
    <div style={{ display: 'flex', gap: '12px', paddingTop: '12px', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
      {/* アバター */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #C4B5FD, #F9A8D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 'bold', color: '#7C3AED', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {comment.userName}
          </span>
          <span style={{ fontSize: '12px', color: '#C4B5FD' }}>
            {formatTime(comment.createdAt)}
          </span>
        </div>
        <p style={{ fontSize: '14px', color: '#7C3AED', wordBreak: 'break-word' }}>
          {comment.content}
        </p>
      </div>

      {/* 削除ボタン（自分のコメントのみ） */}
      {comment.isOwner && onDelete && (
        <button
          onClick={onDelete}
          style={{ flexShrink: 0, width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF', transition: 'color 0.2s' }}
        >
          <span style={{ fontSize: '12px' }}>✕</span>
        </button>
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
  onDeleteComment
}) => {
  const [newComment, setNewComment] = useState('')
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null)
  const [showFilterError, setShowFilterError] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

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

    onAddComment(postId, trimmed)
    setNewComment('')
    setFilterResult(null)
    setShowFilterError(false)
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
            {comments.length > 0 && (
              <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 'normal', marginLeft: '4px' }}>
                ({comments.length})
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
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onDelete={comment.isOwner ? () => onDeleteComment(comment.id) : undefined}
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

        {/* 入力欄 */}
        <div style={{ padding: '16px', borderTop: '1px solid #F3F4F6', background: 'white' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <textarea
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを入力..."
                rows={1}
                maxLength={100}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                style={{
                  width: '100%',
                  paddingLeft: '16px',
                  paddingRight: '48px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: showFilterError && filterResult && !filterResult.isClean ? '2px solid #FACC15' : '2px solid #E9D5FF',
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
