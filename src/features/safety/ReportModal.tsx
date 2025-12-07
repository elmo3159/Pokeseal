'use client'

import React, { useState } from 'react'
import {
  ReportCategory,
  ReportTargetType,
  reportCategoryLabels,
  CreateReportInput,
  validateReport,
  MAX_REPORT_COMMENT_LENGTH
} from '@/domain/safety'

interface ReportModalProps {
  isOpen: boolean
  targetType: ReportTargetType
  targetId: string
  targetUserId: string
  targetName?: string
  onClose: () => void
  onSubmit: (input: CreateReportInput) => void
}

// 対象タイプの表示名
const targetTypeLabels: Record<ReportTargetType, string> = {
  user: 'ユーザー',
  post: '投稿',
  comment: 'コメント',
  trade: '交換'
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  targetType,
  targetId,
  targetUserId,
  targetName,
  onClose,
  onSubmit
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!selectedCategory) return

    const input: CreateReportInput = {
      targetType,
      targetId,
      targetUserId,
      category: selectedCategory,
      comment: comment.trim() || undefined
    }

    const validation = validateReport(input)
    if (!validation.isValid) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(input)
      setShowConfirm(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setSelectedCategory(null)
    setComment('')
    setShowConfirm(false)
    onClose()
  }

  // 完了画面
  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-[scaleIn_0.2s_ease-out]">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-purple-800 mb-2">
            ほうこくしました
          </h2>
          <p className="text-sm text-purple-600 mb-6">
            おしらせありがとう！<br />
            スタッフがかくにんします。
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* モーダル本体 */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-orange-400 to-red-400 p-4">
          <h2 className="text-white font-bold text-lg text-center">
            ⚠️ つうほうする
          </h2>
        </div>

        {/* コンテンツ */}
        <div className="p-4">
          {/* 対象表示 */}
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">つうほうするもの</p>
            <p className="text-sm font-bold text-purple-700">
              {targetTypeLabels[targetType]}: {targetName || targetId}
            </p>
          </div>

          {/* カテゴリ選択 */}
          <p className="text-sm font-bold text-purple-700 mb-2">
            どうしてつうほうしますか？
          </p>
          <div className="space-y-2 mb-4">
            {(Object.entries(reportCategoryLabels) as [ReportCategory, typeof reportCategoryLabels['spam']][]).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`
                  w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3
                  ${selectedCategory === key
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                  }
                `}
              >
                <span className="text-2xl">{value.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-purple-700 text-sm">{value.label}</p>
                  <p className="text-xs text-gray-500">{value.description}</p>
                </div>
                {selectedCategory === key && (
                  <span className="text-purple-500 text-xl">✓</span>
                )}
              </button>
            ))}
          </div>

          {/* コメント入力 */}
          <p className="text-sm font-bold text-purple-700 mb-2">
            くわしく教えてね（なくてもOK）
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, MAX_REPORT_COMMENT_LENGTH))}
            placeholder="なにがあったか書いてね..."
            className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none text-sm"
            rows={3}
          />
          <p className="text-xs text-gray-400 text-right mt-1">
            {comment.length}/{MAX_REPORT_COMMENT_LENGTH}
          </p>

          {/* ボタン */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold"
            >
              やめる
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedCategory || isSubmitting}
              className={`
                flex-1 py-3 rounded-xl font-bold shadow-lg
                ${selectedCategory && !isSubmitting
                  ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {isSubmitting ? 'おくり中...' : 'つうほうする'}
            </button>
          </div>

          {/* 注意事項 */}
          <p className="text-xs text-center text-gray-400 mt-4">
            うその通報はしないでね。<br />
            スタッフが確認してたいおうします。
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReportModal
