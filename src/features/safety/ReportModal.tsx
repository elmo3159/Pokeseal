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
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }} onClick={handleClose} />
        <div style={{
          position: 'relative',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '384px',
          overflow: 'hidden',
          padding: '24px',
          textAlign: 'center',
          animation: 'scaleIn 0.2s ease-out',
        }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6B21A8', marginBottom: '8px' }}>
            ほうこくしました
          </h2>
          <p style={{ fontSize: '14px', color: '#9333EA', marginBottom: '24px' }}>
            おしらせありがとう！<br />
            スタッフがかくにんします。
          </p>
          <button
            onClick={handleClose}
            style={{
              width: '100%',
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            とじる
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }}>
      {/* オーバーレイ */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }} onClick={handleClose} />

      {/* モーダル本体 */}
      <div style={{
        position: 'relative',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '384px',
        overflow: 'hidden',
        animation: 'scaleIn 0.2s ease-out',
      }}>
        {/* ヘッダー */}
        <div style={{ background: 'linear-gradient(to right, #FB923C, #EF4444)', padding: '16px' }}>
          <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>
            ⚠️ つうほうする
          </h2>
        </div>

        {/* コンテンツ */}
        <div style={{ padding: '16px' }}>
          {/* 対象表示 */}
          <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>つうほうするもの</p>
            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#6B21A8' }}>
              {targetTypeLabels[targetType]}: {targetName || targetId}
            </p>
          </div>

          {/* カテゴリ選択 */}
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#6B21A8', marginBottom: '8px' }}>
            どうしてつうほうしますか？
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {(Object.entries(reportCategoryLabels) as [ReportCategory, typeof reportCategoryLabels['spam']][]).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: selectedCategory === key ? '2px solid #8B5CF6' : '2px solid #E5E7EB',
                  background: selectedCategory === key ? '#F3E8FF' : 'white',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '24px' }}>{value.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 'bold', color: '#6B21A8', fontSize: '14px' }}>{value.label}</p>
                  <p style={{ fontSize: '12px', color: '#6B7280' }}>{value.description}</p>
                </div>
                {selectedCategory === key && (
                  <span style={{ color: '#8B5CF6', fontSize: '20px' }}>✓</span>
                )}
              </button>
            ))}
          </div>

          {/* コメント入力 */}
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#6B21A8', marginBottom: '8px' }}>
            くわしく教えてね（なくてもOK）
          </p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, MAX_REPORT_COMMENT_LENGTH))}
            placeholder="なにがあったか書いてね..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '2px solid #E5E7EB',
              resize: 'none',
              fontSize: '14px',
              outline: 'none',
            }}
            rows={3}
          />
          <p style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'right', marginTop: '4px' }}>
            {comment.length}/{MAX_REPORT_COMMENT_LENGTH}
          </p>

          {/* ボタン */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button
              onClick={handleClose}
              style={{
                flex: 1,
                paddingTop: '12px',
                paddingBottom: '12px',
                borderRadius: '12px',
                background: '#F3F4F6',
                color: '#4B5563',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              やめる
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedCategory || isSubmitting}
              style={{
                flex: 1,
                paddingTop: '12px',
                paddingBottom: '12px',
                borderRadius: '12px',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                background: selectedCategory && !isSubmitting
                  ? 'linear-gradient(to right, #FB923C, #EF4444)'
                  : '#E5E7EB',
                color: selectedCategory && !isSubmitting ? 'white' : '#9CA3AF',
                cursor: selectedCategory && !isSubmitting ? 'pointer' : 'not-allowed',
                border: 'none',
              }}
            >
              {isSubmitting ? 'おくり中...' : 'つうほうする'}
            </button>
          </div>

          {/* 注意事項 */}
          <p style={{ fontSize: '12px', textAlign: 'center', color: '#9CA3AF', marginTop: '16px' }}>
            うその通報はしないでね。<br />
            スタッフが確認してたいおうします。
          </p>
        </div>
      </div>
    </div>
  )
}

export default ReportModal
