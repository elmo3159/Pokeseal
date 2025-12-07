'use client'

import React, { useState } from 'react'
import { CreateBlockInput, MAX_BLOCK_REASON_LENGTH } from '@/domain/safety'

interface BlockModalProps {
  isOpen: boolean
  userId: string
  userName: string
  isBlocked: boolean
  onClose: () => void
  onBlock: (input: CreateBlockInput) => void
  onUnblock: (userId: string) => void
}

export const BlockModal: React.FC<BlockModalProps> = ({
  isOpen,
  userId,
  userName,
  isBlocked,
  onClose,
  onBlock,
  onUnblock
}) => {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [action, setAction] = useState<'block' | 'unblock' | null>(null)

  if (!isOpen) return null

  const handleBlock = async () => {
    setIsSubmitting(true)
    try {
      await onBlock({
        blockedId: userId,
        reason: reason.trim() || undefined
      })
      setAction('block')
      setShowConfirm(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnblock = async () => {
    setIsSubmitting(true)
    try {
      await onUnblock(userId)
      setAction('unblock')
      setShowConfirm(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setReason('')
    setShowConfirm(false)
    setAction(null)
    onClose()
  }

  // 完了画面
  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-[scaleIn_0.2s_ease-out]">
          <div className="text-6xl mb-4">
            {action === 'block' ? '🚫' : '✅'}
          </div>
          <h2 className="text-xl font-bold text-purple-800 mb-2">
            {action === 'block' ? 'ブロックしました' : 'ブロックかいじょ'}
          </h2>
          <p className="text-sm text-purple-600 mb-6">
            {action === 'block' ? (
              <>
                {userName}さんからの<br />
                こうかん申し込みや投稿が<br />
                見えなくなります
              </>
            ) : (
              <>
                {userName}さんの<br />
                ブロックをかいじょしました
              </>
            )}
          </p>
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg"
          >
            とじる
          </button>
        </div>
      </div>
    )
  }

  // ブロック解除画面
  if (isBlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-[scaleIn_0.2s_ease-out]">
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-gray-400 to-gray-500 p-4">
            <h2 className="text-white font-bold text-lg text-center">
              🚫 ブロック中
            </h2>
          </div>

          {/* コンテンツ */}
          <div className="p-4">
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
              <p className="text-4xl mb-2">👤</p>
              <p className="font-bold text-purple-700">{userName}</p>
              <p className="text-xs text-gray-500 mt-1">
                この人をブロックしています
              </p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-yellow-700">
                <span className="font-bold">ブロックすると：</span><br />
                • こうかん申し込みがとどかない<br />
                • 投稿やコメントがみえない<br />
                • あなたの投稿も相手にみえない
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold"
              >
                とじる
              </button>
              <button
                onClick={handleUnblock}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-400 text-white font-bold shadow-lg"
              >
                {isSubmitting ? '...' : 'かいじょする'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ブロック確認画面
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4">
          <h2 className="text-white font-bold text-lg text-center">
            🚫 ブロックしますか？
          </h2>
        </div>

        {/* コンテンツ */}
        <div className="p-4">
          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
            <p className="text-4xl mb-2">👤</p>
            <p className="font-bold text-purple-700">{userName}</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-3 mb-4">
            <p className="text-xs text-yellow-700">
              <span className="font-bold">ブロックすると：</span><br />
              • こうかん申し込みがとどかない<br />
              • 投稿やコメントがみえない<br />
              • あなたの投稿も相手にみえない<br />
              • いつでもかいじょできます
            </p>
          </div>

          {/* 理由入力（任意） */}
          <p className="text-sm font-bold text-purple-700 mb-2">
            メモ（じぶんよう）
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, MAX_BLOCK_REASON_LENGTH))}
            placeholder="ブロックする理由をメモできます..."
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none text-sm"
            rows={2}
          />
          <p className="text-xs text-gray-400 text-right mt-1">
            {reason.length}/{MAX_BLOCK_REASON_LENGTH}
          </p>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold"
            >
              やめる
            </button>
            <button
              onClick={handleBlock}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold shadow-lg"
            >
              {isSubmitting ? '...' : 'ブロックする'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlockModal
