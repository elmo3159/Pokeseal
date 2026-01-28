'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react'

// お問い合わせカテゴリ
export type ContactCategory = 'bug' | 'feature' | 'account' | 'other'

export interface ContactFormData {
  category: ContactCategory
  email: string
  message: string
}

interface ContactFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ContactFormData) => Promise<boolean>
  userEmail?: string // ログイン中のユーザーのメール（プリセット用）
  userCode?: string // ユーザーコード（表示用）
}

// カテゴリの選択肢
const CATEGORIES: { value: ContactCategory; label: string; emoji: string; description: string }[] = [
  { value: 'bug', label: 'バグ・不具合', emoji: '🐛', description: '動作がおかしい、エラーが出る' },
  { value: 'feature', label: '機能のリクエスト', emoji: '✨', description: 'こんな機能がほしい！' },
  { value: 'account', label: 'アカウント', emoji: '👤', description: 'ログイン、データ引き継ぎなど' },
  { value: 'other', label: 'その他', emoji: '💬', description: 'その他のご質問・ご意見' },
]

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userEmail = '',
  userCode,
}) => {
  const [category, setCategory] = useState<ContactCategory | null>(null)
  const [email, setEmail] = useState(userEmail)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // フォームリセット
  const resetForm = () => {
    setCategory(null)
    setEmail(userEmail)
    setMessage('')
    setSubmitStatus('idle')
    setErrorMessage('')
  }

  // モーダルを閉じる
  const handleClose = () => {
    if (!isSubmitting) {
      resetForm()
      onClose()
    }
  }

  // 送信処理
  const handleSubmit = async () => {
    if (!category || !message.trim()) return

    // メールアドレスの簡易バリデーション
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('メールアドレスの形式が正しくありません')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const success = await onSubmit({
        category,
        email: email.trim(),
        message: message.trim(),
      })

      if (success) {
        setSubmitStatus('success')
        // 3秒後に自動で閉じる
        setTimeout(() => {
          handleClose()
        }, 3000)
      } else {
        setSubmitStatus('error')
        setErrorMessage('送信に失敗しました。時間をおいて再度お試しください。')
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus('error')
      setErrorMessage('送信に失敗しました。時間をおいて再度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 送信可能かどうか
  const canSubmit = category && message.trim().length >= 10 && !isSubmitting

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* バックドロップ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-[1000]"
          />

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[1001] max-h-[90vh] bg-white rounded-t-3xl overflow-hidden flex flex-col"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            {/* ヘッダー */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">お問い合わせ</h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* コンテンツ */}
            <div className="flex-1 overflow-y-auto p-5">
              {submitStatus === 'success' ? (
                // 送信成功画面
                <div className="flex flex-col items-center justify-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4"
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">送信完了！</h3>
                  <p className="text-gray-500 text-center">
                    お問い合わせありがとうございます。<br />
                    内容を確認して対応いたします。
                  </p>
                  {email && (
                    <p className="text-sm text-gray-400 mt-4">
                      返信は {email} にお送りします
                    </p>
                  )}
                </div>
              ) : (
                // フォーム
                <div className="space-y-6">
                  {/* ユーザーコード表示 */}
                  {userCode && (
                    <div className="px-4 py-3 bg-purple-50 rounded-xl">
                      <p className="text-xs text-purple-500 mb-1">あなたのユーザーコード</p>
                      <p className="text-lg font-bold text-purple-600 tracking-wider">{userCode}</p>
                    </div>
                  )}

                  {/* カテゴリ選択 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      お問い合わせの種類 <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={`
                            p-4 rounded-xl border-2 text-left transition-all
                            ${category === cat.value
                              ? 'border-purple-400 bg-purple-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="text-2xl mb-1">{cat.emoji}</div>
                          <div className="text-sm font-medium text-gray-800">{cat.label}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{cat.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* メールアドレス */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      返信用メールアドレス
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      返信が必要な場合は入力してください
                    </p>
                  </div>

                  {/* メッセージ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      お問い合わせ内容 <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="できるだけ詳しく教えてください。&#10;&#10;例：&#10;・いつ起きたか&#10;・どんな操作をしたか&#10;・どうなったか"
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-colors resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-400">
                        10文字以上で入力してください
                      </p>
                      <p className={`text-xs ${message.length >= 10 ? 'text-green-500' : 'text-gray-400'}`}>
                        {message.length}文字
                      </p>
                    </div>
                  </div>

                  {/* エラーメッセージ */}
                  {errorMessage && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* フッター（送信ボタン） */}
            {submitStatus !== 'success' && (
              <div className="p-5 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`
                    w-full py-4 rounded-2xl font-bold text-lg
                    flex items-center justify-center gap-2
                    transition-all active:scale-95
                    ${canSubmit
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      送信中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      送信する
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  お問い合わせ内容は運営チームに送信されます
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ContactFormModal
