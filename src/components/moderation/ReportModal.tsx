'use client'

import React, { useState } from 'react'
import {
  moderationService,
  REPORT_CATEGORY_LABELS,
  REPORT_CATEGORY_DESCRIPTIONS,
  type ReportCategory,
  type TargetType,
} from '@/services/moderation'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  targetType: TargetType
  targetId: string
  targetName?: string // 通報対象の表示名（ユーザー名や投稿タイトルなど）
  reporterId: string
  onReportSubmitted?: () => void
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
  reporterId,
  onReportSubmitted,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const targetTypeLabel = {
    user: 'ユーザー',
    post: '投稿',
    trade: '交換',
    comment: 'コメント',
  }[targetType]

  const handleSubmit = async () => {
    if (!selectedCategory) return

    setIsSubmitting(true)

    const result = await moderationService.createReport(
      reporterId,
      targetType,
      targetId,
      selectedCategory,
      description.trim() || undefined
    )

    setIsSubmitting(false)

    if (result) {
      setSubmitted(true)
      onReportSubmitted?.()
    } else {
      // 既に通報済みの場合も成功として扱う
      setSubmitted(true)
    }
  }

  const handleClose = () => {
    setSelectedCategory(null)
    setDescription('')
    setSubmitted(false)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* オーバーレイ */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* モーダル */}
      <div
        style={{
          position: 'relative',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid #F3E8FF',
            background: 'linear-gradient(to right, #FEE2E2, #FCE7F3)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#DC2626', margin: 0 }}>
              {submitted ? '通報完了' : '通報する'}
            </h2>
            <button
              onClick={handleClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#FEE2E2',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: '#DC2626',
              }}
            >
              ✕
            </button>
          </div>
          {!submitted && (
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>
              {targetTypeLabel}
              {targetName && <span style={{ color: '#6B7280', fontWeight: 500 }}>「{targetName}」</span>}
              を通報します
            </p>
          )}
        </div>

        {/* コンテンツ */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📩</div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>
                通報を受け付けました
              </h3>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>
                ご報告ありがとうございます。<br />
                運営チームが内容を確認し、<br />
                必要に応じて対応いたします。
              </p>
              <button
                onClick={handleClose}
                style={{
                  marginTop: '24px',
                  padding: '12px 32px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
                  color: 'white',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                とじる
              </button>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '12px' }}>
                どんな問題がありますか？
              </p>

              {/* カテゴリ選択 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {(Object.keys(REPORT_CATEGORY_LABELS) as ReportCategory[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: selectedCategory === category ? '2px solid #DC2626' : '2px solid #E5E7EB',
                      background: selectedCategory === category ? '#FEF2F2' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>
                      {REPORT_CATEGORY_LABELS[category]}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                      {REPORT_CATEGORY_DESCRIPTIONS[category]}
                    </div>
                  </button>
                ))}
              </div>

              {/* 詳細入力 */}
              {selectedCategory && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', display: 'block', marginBottom: '8px' }}>
                    くわしく教えてね（任意）
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="どんなことがあったか教えてください..."
                    maxLength={500}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '2px solid #E5E7EB',
                      fontSize: '14px',
                      resize: 'none',
                      minHeight: '80px',
                      fontFamily: 'inherit',
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'right', marginTop: '4px' }}>
                    {description.length}/500
                  </div>
                </div>
              )}

              {/* 送信ボタン */}
              <button
                onClick={handleSubmit}
                disabled={!selectedCategory || isSubmitting}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: selectedCategory
                    ? 'linear-gradient(135deg, #DC2626, #EF4444)'
                    : '#E5E7EB',
                  color: selectedCategory ? 'white' : '#9CA3AF',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: selectedCategory ? 'pointer' : 'not-allowed',
                  fontSize: '15px',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? '送信中...' : '通報する'}
              </button>

              <p style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center', marginTop: '12px' }}>
                虚偽の通報は禁止されています
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportModal
