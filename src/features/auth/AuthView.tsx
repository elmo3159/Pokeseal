'use client'

import React, { useState } from 'react'

export type AuthMode = 'login' | 'signup'

interface AuthViewProps {
  onLogin: (email: string, password: string) => Promise<void>
  onSignup: (email: string, password: string, name: string) => Promise<void>
  onSocialLogin?: (provider: 'google' | 'apple') => Promise<void>
  onSkip?: () => void
  isLoading?: boolean
  error?: string | null
}

// パスワード入力フィールド（表示切り替え付き）
const PasswordInput: React.FC<{
  value: string
  onChange: (value: string) => void
  placeholder?: string
}> = ({ value, onChange, placeholder = 'パスワード' }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full px-4 py-3 rounded-xl
          bg-white border-2 border-purple-200
          text-purple-700 placeholder-purple-300
          focus:border-purple-400 focus:outline-none
          transition-colors
        "
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400"
      >
        {showPassword ? '🙈' : '👁️'}
      </button>
    </div>
  )
}

// ソーシャルログインボタン
const SocialButton: React.FC<{
  provider: 'google' | 'apple'
  onClick: () => void
}> = ({ provider, onClick }) => {
  const config = {
    google: {
      icon: '🔵',
      label: 'Googleでログイン',
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      border: 'border border-gray-300',
    },
    apple: {
      icon: '🍎',
      label: 'Appleでログイン',
      bgColor: 'bg-black',
      textColor: 'text-white',
      border: '',
    },
  }

  const { icon, label, bgColor, textColor, border } = config[provider]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full py-3 rounded-xl font-medium
        flex items-center justify-center gap-2
        ${bgColor} ${textColor} ${border}
        hover:opacity-90 active:scale-[0.98]
        transition-all
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

// メインのAuthView
export const AuthView: React.FC<AuthViewProps> = ({
  onLogin,
  onSignup,
  onSocialLogin,
  onSkip,
  isLoading = false,
  error = null,
}) => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  // バリデーション
  const validate = (): boolean => {
    if (!email.includes('@')) {
      setLocalError('メールアドレスを正しく入力してね')
      return false
    }
    if (password.length < 6) {
      setLocalError('パスワードは6文字以上にしてね')
      return false
    }
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError('パスワードが一致しないよ')
        return false
      }
      if (name.length < 2) {
        setLocalError('名前は2文字以上にしてね')
        return false
      }
    }
    setLocalError(null)
    return true
  }

  // ログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onLogin(email, password)
  }

  // 新規登録処理
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    await onSignup(email, password, name)
  }

  // 表示するエラーメッセージ
  const displayError = localError || error

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-white flex flex-col">
      {/* ヘッダー */}
      <div className="pt-12 pb-6 text-center">
        <div className="text-6xl mb-4">📖✨</div>
        <h1 className="text-2xl font-bold text-purple-700">ポケシル</h1>
        <p className="text-sm text-purple-400 mt-1">ポケットシールちょう</p>
      </div>

      {/* タブ切り替え */}
      <div className="flex justify-center mb-6">
        <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm">
          <button
            onClick={() => setMode('login')}
            className={`
              px-6 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${mode === 'login'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-purple-600 hover:bg-purple-100'
              }
            `}
          >
            ログイン
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`
              px-6 py-2 rounded-full text-sm font-medium
              transition-all duration-200
              ${mode === 'signup'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-purple-600 hover:bg-purple-100'
              }
            `}
          >
            はじめる
          </button>
        </div>
      </div>

      {/* フォーム */}
      <div className="flex-1 px-6">
        <form
          onSubmit={mode === 'login' ? handleLogin : handleSignup}
          className="space-y-4"
        >
          {/* 名前（新規登録のみ） */}
          {mode === 'signup' && (
            <div>
              <label className="text-sm text-purple-600 mb-1 block">
                ニックネーム
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ニックネーム"
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-white border-2 border-purple-200
                  text-purple-700 placeholder-purple-300
                  focus:border-purple-400 focus:outline-none
                  transition-colors
                "
              />
            </div>
          )}

          {/* メールアドレス */}
          <div>
            <label className="text-sm text-purple-600 mb-1 block">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="
                w-full px-4 py-3 rounded-xl
                bg-white border-2 border-purple-200
                text-purple-700 placeholder-purple-300
                focus:border-purple-400 focus:outline-none
                transition-colors
              "
            />
          </div>

          {/* パスワード */}
          <div>
            <label className="text-sm text-purple-600 mb-1 block">
              パスワード
            </label>
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="6文字以上"
            />
          </div>

          {/* パスワード確認（新規登録のみ） */}
          {mode === 'signup' && (
            <div>
              <label className="text-sm text-purple-600 mb-1 block">
                パスワード（かくにん）
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="もう一度入力"
              />
            </div>
          )}

          {/* エラーメッセージ */}
          {displayError && (
            <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-xl">
              ⚠️ {displayError}
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-4 rounded-xl font-bold text-lg
              bg-gradient-to-r from-purple-500 to-pink-500
              text-white shadow-lg
              hover:shadow-xl active:scale-[0.98]
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                <span>ちょっとまってね...</span>
              </span>
            ) : mode === 'login' ? (
              'ログイン'
            ) : (
              'アカウントをつくる'
            )}
          </button>
        </form>

        {/* 区切り線 */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-purple-200" />
          <span className="text-sm text-purple-400">または</span>
          <div className="flex-1 h-px bg-purple-200" />
        </div>

        {/* ソーシャルログイン */}
        {onSocialLogin && (
          <div className="space-y-3">
            <SocialButton
              provider="google"
              onClick={() => onSocialLogin('google')}
            />
            <SocialButton
              provider="apple"
              onClick={() => onSocialLogin('apple')}
            />
          </div>
        )}

        {/* スキップボタン */}
        {onSkip && (
          <button
            onClick={onSkip}
            className="w-full mt-4 py-3 text-purple-400 hover:text-purple-600 transition-colors"
          >
            あとでログインする →
          </button>
        )}
      </div>

      {/* フッター */}
      <div className="py-4 text-center">
        <p className="text-xs text-purple-300">
          {mode === 'signup'
            ? '登録すると利用規約に同意したことになります'
            : 'パスワードを忘れた方はこちら'}
        </p>
      </div>
    </div>
  )
}

export default AuthView
