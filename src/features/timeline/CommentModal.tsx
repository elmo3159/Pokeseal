'use client'

import React, { useState, useRef, useEffect } from 'react'

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
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      {/* アバター */}
      <div className="flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-sm">
          {comment.userAvatarUrl ? (
            <img
              src={comment.userAvatarUrl}
              alt={comment.userName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            '👤'
          )}
        </div>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-purple-700 text-sm truncate">
            {comment.userName}
          </span>
          <span className="text-xs text-purple-300">
            {formatTime(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm text-purple-600 break-words">
          {comment.content}
        </p>
      </div>

      {/* 削除ボタン（自分のコメントのみ） */}
      {comment.isOwner && onDelete && (
        <button
          onClick={onDelete}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
        >
          <span className="text-xs">✕</span>
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
      className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium hover:bg-purple-100 transition-colors whitespace-nowrap"
    >
      {text}
    </button>
  )
}

// 定型文一覧
const quickReplies = [
  'かわいい！✨',
  'すごい！👏',
  'いいね！🩷',
  'うらやましい！',
  'まねしたい！',
  'センスいい！'
]

export const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  postId,
  comments,
  onClose,
  onAddComment,
  onDeleteComment
}) => {
  const [newComment, setNewComment] = useState('')
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

  // コメント送信
  const handleSubmit = () => {
    const trimmed = newComment.trim()
    if (trimmed) {
      onAddComment(postId, trimmed)
      setNewComment('')
    }
  }

  // 定型文選択
  const handleQuickReply = (text: string) => {
    setNewComment(text)
    inputRef.current?.focus()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* 背景オーバーレイ（上部タップで閉じる） */}
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダル本体（下からスライド） */}
      <div className="bg-white rounded-t-3xl shadow-2xl max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* ヘッダー */}
        <header className="flex items-center justify-center px-4 py-3 border-b border-gray-100 relative">
          {/* ドラッグハンドル */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full" />

          <h2 className="text-lg font-bold text-purple-700 mt-2">
            コメント
            {comments.length > 0 && (
              <span className="text-purple-400 font-normal ml-1">
                ({comments.length})
              </span>
            )}
          </h2>

          <button
            onClick={onClose}
            className="absolute right-4 top-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <span className="text-gray-400">✕</span>
          </button>
        </header>

        {/* コメントリスト */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-4"
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-purple-400 text-sm">
                まだコメントがありません
              </p>
              <p className="text-purple-300 text-xs mt-1">
                さいしょのコメントをしよう！
              </p>
            </div>
          )}
        </div>

        {/* 定型文 */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {quickReplies.map((reply, index) => (
              <QuickReply
                key={index}
                text={reply}
                onClick={() => handleQuickReply(reply)}
              />
            ))}
          </div>
        </div>

        {/* 入力欄 */}
        <div className="p-4 border-t border-gray-100 safe-area-bottom">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを入力..."
                className="w-full px-4 py-3 pr-12 border-2 border-purple-200 rounded-2xl text-sm
                         focus:border-purple-400 focus:outline-none resize-none"
                rows={1}
                maxLength={100}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                style={{
                  minHeight: '48px',
                  maxHeight: '120px'
                }}
              />
              <span className="absolute right-3 bottom-3 text-xs text-purple-300">
                {newComment.length}/100
              </span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!newComment.trim()}
              className="
                w-12 h-12 rounded-full flex items-center justify-center
                transition-all duration-200
                disabled:bg-gray-200 disabled:text-gray-400
                enabled:bg-gradient-to-r enabled:from-purple-500 enabled:to-pink-500
                enabled:text-white enabled:shadow-lg
                enabled:active:scale-95
              "
            >
              <span className="text-xl">↑</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentModal
