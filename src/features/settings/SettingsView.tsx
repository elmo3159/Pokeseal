'use client'

import React, { useState } from 'react'
import {
  Bell,
  UserPlus,
  Sparkles,
  Trophy,
  Eye,
  Radio,
  HandshakeIcon,
  Palette,
  Globe,
  MessageCircle,
  FileText,
  Shield,
  LogOut,
  Trash2,
  ChevronRight,
  Check,
  Link2,
  CheckCircle,
  Copy,
  Ban,
  Settings2,
  Share2,
  Star,
  Gift,
  Users,
} from 'lucide-react'
import type { InvitationStats, InvitationRecord } from '@/services/invitation/invitationService'
import type { ReviewRewardStatus, Platform } from '@/services/reviewReward/reviewRewardService'

export interface SettingsData {
  notifications: {
    tradeRequests: boolean
    friendRequests: boolean
    newStickers: boolean
    contests: boolean
    dailyBonus: boolean
  }
  privacy: {
    publicProfile: boolean
    showOnlineStatus: boolean
    allowTradeRequests: boolean
  }
  display: {
    theme: 'light' | 'dark' | 'auto'
    language: 'ja' | 'en'
  }
}

interface SettingsViewProps {
  settings: SettingsData
  onSettingsChange: (settings: SettingsData) => void
  onLogout: () => void
  onDeleteAccount: () => void
  onContactSupport: () => void
  onViewTerms: () => void
  onViewPrivacy: () => void
  userName?: string
  userEmail?: string
  // アカウント連携用
  userCode?: string | null
  isAccountLinked?: boolean
  linkedProviders?: string[]
  onLinkGoogle?: () => Promise<boolean>
  onLinkApple?: () => Promise<boolean>
  // ユーザー検索
  onOpenSearch?: () => void
  // ブロック管理
  onOpenBlockedUsers?: () => void
  blockedUsersCount?: number
  // 管理者機能
  isAdmin?: boolean
  onOpenAdminDashboard?: () => void
  // 招待システム
  invitationStats?: InvitationStats | null
  invitationList?: InvitationRecord[]
  onShareInvitation?: () => void
  onCopyInvitationCode?: () => Promise<boolean>
  onClaimInviterReward?: (invitationId: string) => Promise<boolean>
  onApplyInvitationCode?: (code: string) => Promise<boolean>
  onClaimInviteeReward?: () => Promise<boolean>
  // レビュー報酬
  reviewRewardStatus?: ReviewRewardStatus | null
  currentPlatform?: Platform
  onClaimReviewReward?: (platform: Platform) => Promise<boolean>
}

// iOS風カスタムトグルスイッチ
const IOSToggle: React.FC<{
  checked: boolean
  onChange: (checked: boolean) => void
}> = ({ checked, onChange }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer
        rounded-full border-2 border-transparent
        transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2
        ${checked ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-200'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-[27px] w-[27px]
          transform rounded-full bg-white shadow-lg ring-0
          transition duration-200 ease-in-out
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  )
}

// iOS風リストアイテム（トグル付き）
const SettingsToggleItem: React.FC<{
  icon: React.ReactNode
  iconBg: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  isFirst?: boolean
  isLast?: boolean
}> = ({ icon, iconBg, label, description, checked, onChange, isFirst, isLast }) => {
  return (
    <div
      className={`
        flex items-center gap-4 px-4 bg-white
        ${isFirst ? 'rounded-t-2xl pt-3' : 'pt-3'}
        ${isLast ? 'rounded-b-2xl pb-3' : 'pb-3'}
      `}
    >
      {/* iOS風アイコン */}
      <div
        className={`
          w-[30px] h-[30px] rounded-lg flex items-center justify-center
          ${iconBg}
        `}
      >
        {icon}
      </div>

      {/* ラベルと説明 */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[17px] text-gray-900"
          style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
        >
          {label}
        </p>
        {description && (
          <p
            className="text-[13px] text-gray-500 truncate"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            {description}
          </p>
        )}
      </div>

      {/* トグルスイッチ */}
      <IOSToggle checked={checked} onChange={onChange} />

      {/* iOS風セパレーター（アイコンの右から開始） */}
      {!isLast && (
        <div
          className="absolute left-[62px] right-0 bottom-0 h-[0.5px] bg-gray-200"
          style={{ marginLeft: '62px' }}
        />
      )}
    </div>
  )
}

// iOS風セレクトアイテム
const SettingsSelectItem: React.FC<{
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  isFirst?: boolean
  isLast?: boolean
}> = ({ icon, iconBg, label, value, options, onChange, isFirst, isLast }) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center gap-4 px-4 bg-white
          active:bg-gray-50 transition-colors
          ${isFirst ? 'rounded-t-2xl pt-3' : 'pt-3'}
          ${isLast && !isOpen ? 'rounded-b-2xl pb-3' : 'pb-3'}
        `}
      >
        {/* iOS風アイコン */}
        <div
          className={`
            w-[30px] h-[30px] rounded-lg flex items-center justify-center
            ${iconBg}
          `}
        >
          {icon}
        </div>

        {/* ラベル */}
        <span
          className="flex-1 text-left text-[17px] text-gray-900"
          style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
        >
          {label}
        </span>

        {/* 選択値とシェブロン */}
        <span
          className="text-[17px] text-gray-400"
          style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
        >
          {selectedOption?.label}
        </span>
        <ChevronRight
          className={`w-5 h-5 text-gray-300 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className={`bg-white ${isLast ? 'rounded-b-2xl' : ''}`}>
          {options.map((option, idx) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`
                w-full flex items-center justify-between px-4 py-3
                active:bg-gray-50 transition-colors
                ${idx === options.length - 1 && isLast ? 'rounded-b-2xl' : ''}
              `}
              style={{ paddingLeft: '62px' }}
            >
              <span
                className="text-[17px] text-purple-600"
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                {option.label}
              </span>
              {option.value === value && (
                <Check className="w-5 h-5 text-purple-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// iOS風ナビゲーションアイテム
const SettingsNavItem: React.FC<{
  icon: React.ReactNode
  iconBg: string
  label: string
  onClick: () => void
  isFirst?: boolean
  isLast?: boolean
  danger?: boolean
}> = ({ icon, iconBg, label, onClick, isFirst, isLast, danger = false }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-4 bg-white
        active:bg-gray-50 transition-colors
        ${isFirst ? 'rounded-t-2xl pt-3' : 'pt-3'}
        ${isLast ? 'rounded-b-2xl pb-3' : 'pb-3'}
      `}
    >
      {/* iOS風アイコン */}
      <div
        className={`
          w-[30px] h-[30px] rounded-lg flex items-center justify-center
          ${iconBg}
        `}
      >
        {icon}
      </div>

      {/* ラベル */}
      <span
        className={`flex-1 text-left text-[17px] ${danger ? 'text-red-500' : 'text-gray-900'}`}
        style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
      >
        {label}
      </span>

      {/* シェブロン */}
      <ChevronRight className={`w-5 h-5 ${danger ? 'text-red-300' : 'text-gray-300'}`} />
    </button>
  )
}

// セクションヘッダー - iOS風の小さな見出し
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h3
    className="text-[13px] font-medium text-gray-500 uppercase tracking-wide px-8 mb-2"
    style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
  >
    {title}
  </h3>
)

// セクションフッター - iOS風の説明テキスト
const SectionFooter: React.FC<{ text: string }> = ({ text }) => (
  <p
    className="text-[13px] text-gray-400 px-8 mt-2"
    style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
  >
    {text}
  </p>
)

// カードラッパー - iOS風の白いカード
const SettingsCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mx-4 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(139,92,246,0.08)] overflow-hidden">
    {children}
  </div>
)

// メインのSettingsView
export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSettingsChange,
  onLogout,
  onDeleteAccount,
  onContactSupport,
  onViewTerms,
  onViewPrivacy,
  userName,
  userEmail,
  userCode,
  isAccountLinked = false,
  linkedProviders = [],
  onLinkGoogle,
  onLinkApple,
  onOpenSearch,
  onOpenBlockedUsers,
  blockedUsersCount = 0,
  isAdmin = false,
  onOpenAdminDashboard,
  // 招待システム
  invitationStats,
  invitationList = [],
  onShareInvitation,
  onCopyInvitationCode,
  onClaimInviterReward,
  onApplyInvitationCode,
  onClaimInviteeReward,
  // レビュー報酬
  reviewRewardStatus,
  currentPlatform = 'web',
  onClaimReviewReward,
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false)
  const [isLinkingApple, setIsLinkingApple] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedInviteCode, setCopiedInviteCode] = useState(false)
  const [showInviteCodeInput, setShowInviteCodeInput] = useState(false)
  const [inviteCodeInput, setInviteCodeInput] = useState('')
  const [isApplyingCode, setIsApplyingCode] = useState(false)
  const [isClaimingReview, setIsClaimingReview] = useState(false)
  const [claimingInvitationId, setClaimingInvitationId] = useState<string | null>(null)

  // ユーザーコードをコピー
  const handleCopyCode = async () => {
    if (userCode) {
      try {
        await navigator.clipboard.writeText(userCode)
        setCopiedCode(true)
        setTimeout(() => setCopiedCode(false), 2000)
      } catch {
        console.error('Failed to copy user code')
      }
    }
  }

  // Google連携
  const handleLinkGoogle = async () => {
    if (!onLinkGoogle || isLinkingGoogle) return
    setIsLinkingGoogle(true)
    try {
      await onLinkGoogle()
    } finally {
      setIsLinkingGoogle(false)
    }
  }

  // Apple連携
  const handleLinkApple = async () => {
    if (!onLinkApple || isLinkingApple) return
    setIsLinkingApple(true)
    try {
      await onLinkApple()
    } finally {
      setIsLinkingApple(false)
    }
  }

  // プロバイダーが連携済みかチェック
  const isGoogleLinked = linkedProviders.includes('google')
  const isAppleLinked = linkedProviders.includes('apple')

  // 通知設定の更新
  const updateNotification = (key: keyof SettingsData['notifications'], value: boolean) => {
    onSettingsChange({
      ...settings,
      notifications: { ...settings.notifications, [key]: value },
    })
  }

  // プライバシー設定の更新
  const updatePrivacy = (key: keyof SettingsData['privacy'], value: boolean) => {
    onSettingsChange({
      ...settings,
      privacy: { ...settings.privacy, [key]: value },
    })
  }

  // 表示設定の更新
  const updateDisplay = (key: keyof SettingsData['display'], value: string) => {
    onSettingsChange({
      ...settings,
      display: { ...settings.display, [key]: value },
    })
  }

  // 招待コードをコピー
  const handleCopyInviteCode = async () => {
    if (onCopyInvitationCode) {
      const success = await onCopyInvitationCode()
      if (success) {
        setCopiedInviteCode(true)
        setTimeout(() => setCopiedInviteCode(false), 2000)
      }
    }
  }

  // 招待コードを適用
  const handleApplyInviteCode = async () => {
    if (!onApplyInvitationCode || !inviteCodeInput.trim() || isApplyingCode) return
    setIsApplyingCode(true)
    try {
      const success = await onApplyInvitationCode(inviteCodeInput.trim())
      if (success) {
        setShowInviteCodeInput(false)
        setInviteCodeInput('')
      }
    } finally {
      setIsApplyingCode(false)
    }
  }

  // 招待報酬を受け取る
  const handleClaimInviterReward = async (invitationId: string) => {
    if (!onClaimInviterReward || claimingInvitationId) return
    setClaimingInvitationId(invitationId)
    try {
      await onClaimInviterReward(invitationId)
    } finally {
      setClaimingInvitationId(null)
    }
  }

  // レビュー報酬を受け取る
  const handleClaimReviewReward = async (platform: Platform) => {
    if (!onClaimReviewReward || isClaimingReview) return
    setIsClaimingReview(true)
    try {
      await onClaimReviewReward(platform)
    } finally {
      setIsClaimingReview(false)
    }
  }

  return (
    <div
      className="min-h-screen pb-32 overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #FDF2F8 0%, #F5F3FF 50%, #FDF2F8 100%)',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      <div className="py-6 space-y-6">
        {/* ユーザーコード表示カード */}
        {userCode && (
          <div className="mx-4 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(139,92,246,0.08)] p-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
                🎫
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-gray-500 mb-1">あなたのユーザーコード</p>
                <p className="text-[28px] font-bold text-purple-600 tracking-wider">{userCode}</p>
              </div>
              <button
                onClick={handleCopyCode}
                className={`
                  px-4 py-2 rounded-full text-[15px] font-medium
                  transition-all active:scale-95
                  ${copiedCode
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 hover:from-purple-200 hover:to-pink-200'
                  }
                `}
              >
                {copiedCode ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    コピー済み
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy className="w-4 h-4" />
                    コピー
                  </span>
                )}
              </button>
            </div>
            <p className="text-[12px] text-gray-400 mt-3 text-center">
              このコードを友だちに教えて交換しよう！
            </p>
          </div>
        )}

        {/* ユーザー検索セクション */}
        {onOpenSearch && (
          <div className="mx-4 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(236,72,153,0.12)] overflow-hidden">
            <button
              onClick={onOpenSearch}
              className="w-full p-4 flex items-center gap-4 active:bg-pink-50 transition-colors"
            >
              {/* 検索アイコン */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background: 'linear-gradient(135deg, #FFE4F0 0%, #FFB6D9 100%)',
                  boxShadow: '0 4px 12px rgba(255, 182, 217, 0.4)',
                }}
              >
                🔍
              </div>

              {/* テキスト */}
              <div className="flex-1 text-left">
                <p className="text-[17px] font-bold text-gray-900" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                  おともだちを さがす
                </p>
                <p className="text-[13px] text-pink-400" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                  6桁のコードで検索できるよ
                </p>
              </div>

              {/* 矢印 */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #FFB6D9 0%, #FF8DC7 100%)',
                }}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </div>
            </button>
          </div>
        )}

        {/* ========== 招待セクション ========== */}
        {invitationStats && (
          <section>
            <SectionHeader title="おともだちをしょうたい" />
            <div className="mx-4 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(139,92,246,0.12)] overflow-hidden">
              {/* 招待コード表示 */}
              <div className="p-4 border-b border-gray-100">
                <div className="text-center mb-3">
                  <p className="text-[15px] text-gray-700 mb-1">
                    おともだちに教えてあげてね<span className="text-lg">🥰</span>
                  </p>
                  <p className="text-[28px] font-bold text-purple-600 tracking-[0.2em]">
                    {invitationStats.invitationCode}
                  </p>
                </div>

                {/* ボタン群 */}
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyInviteCode}
                    className={`
                      flex-1 py-2.5 rounded-xl text-[14px] font-bold
                      flex items-center justify-center gap-1.5
                      transition-all active:scale-95
                      ${copiedInviteCode
                        ? 'bg-green-100 text-green-600'
                        : 'bg-purple-100 text-purple-600'
                      }
                    `}
                  >
                    {copiedInviteCode ? (
                      <><CheckCircle className="w-4 h-4" /> コピーしたよ！</>
                    ) : (
                      <><Copy className="w-4 h-4" /> コピー</>
                    )}
                  </button>
                  {onShareInvitation && (
                    <button
                      onClick={onShareInvitation}
                      className="flex-1 py-2.5 rounded-xl text-[14px] font-bold
                        bg-gradient-to-r from-purple-500 to-pink-500 text-white
                        flex items-center justify-center gap-1.5
                        transition-all active:scale-95 shadow-md"
                    >
                      <Share2 className="w-4 h-4" /> シェアする
                    </button>
                  )}
                </div>
              </div>

              {/* 招待特典説明 */}
              <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50">
                <p className="text-[13px] font-bold text-purple-700 mb-2">🎁 ふたりともおとく！</p>
                <div className="flex gap-4 text-[12px]">
                  <div className="flex-1">
                    <p className="text-gray-500 mb-1">あなたがもらえる</p>
                    <p className="font-bold text-purple-600">🎫×10 💎×1</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 mb-1">おともだちがもらえる</p>
                    <p className="font-bold text-pink-600">🎫×15 💎×1</p>
                  </div>
                </div>
              </div>

              {/* 招待状況 */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-500">今月の招待</span>
                  <span className="text-[14px] font-bold text-purple-600">
                    {invitationStats.monthlyInvites} / {invitationStats.monthlyLimit}人
                  </span>
                </div>
                {invitationStats.unclaimedRewards > 0 && (
                  <div className="mt-2 px-3 py-2 bg-yellow-50 rounded-lg flex items-center gap-2">
                    <Gift className="w-4 h-4 text-yellow-600" />
                    <span className="text-[13px] text-yellow-700 font-medium">
                      {invitationStats.unclaimedRewards}件の報酬が受け取れます
                    </span>
                  </div>
                )}
              </div>

              {/* 招待された側の報酬受け取り */}
              {invitationStats.wasInvited && !invitationStats.inviteeRewardClaimed && (
                <div className="px-4 py-3 border-t border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                  <p className="text-[14px] text-green-700 mb-2">
                    🎉 招待してもらったね！<br/>
                    <span className="text-[13px]">ウェルカムプレゼントを受け取ってね💝</span>
                  </p>
                  <button
                    onClick={async () => {
                      const success = await onClaimInviteeReward?.()
                      if (success) {
                        // 成功フィードバックは親コンポーネントで処理
                      }
                    }}
                    className="w-full py-2.5 rounded-xl text-[14px] font-bold
                      bg-gradient-to-r from-green-500 to-emerald-500 text-white
                      flex items-center justify-center gap-1.5
                      transition-all active:scale-95 shadow-md"
                  >
                    <Gift className="w-4 h-4" /> プレゼントを受け取る 🎫×15 💎×1
                  </button>
                </div>
              )}

              {/* 招待コード入力 */}
              {!invitationStats.wasInvited && (
                <div className="px-4 py-3 border-t border-gray-100">
                  {!showInviteCodeInput ? (
                    <button
                      onClick={() => setShowInviteCodeInput(true)}
                      className="w-full py-2.5 rounded-xl text-[14px] font-medium
                        bg-gray-100 text-gray-600
                        flex items-center justify-center gap-1.5
                        transition-all active:scale-95"
                    >
                      招待コードを入力する
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={inviteCodeInput}
                        onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                        placeholder="招待コードを入力"
                        maxLength={8}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-200
                          text-center text-[18px] font-bold tracking-[0.2em]
                          focus:outline-none focus:border-purple-400"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowInviteCodeInput(false)
                            setInviteCodeInput('')
                          }}
                          className="flex-1 py-2 rounded-xl text-[14px] font-medium
                            bg-gray-100 text-gray-600 active:scale-95 transition-all"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={handleApplyInviteCode}
                          disabled={!inviteCodeInput.trim() || isApplyingCode}
                          className="flex-1 py-2 rounded-xl text-[14px] font-bold
                            bg-gradient-to-r from-purple-500 to-pink-500 text-white
                            disabled:opacity-50 active:scale-95 transition-all"
                        >
                          {isApplyingCode ? '確認中...' : '適用する'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 招待リスト（未受け取り報酬がある場合のみ表示） */}
              {invitationList.filter(i => !i.rewardClaimed).length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <p className="text-[13px] text-gray-500 mb-2">報酬を受け取る</p>
                  <div className="space-y-2">
                    {invitationList.filter(i => !i.rewardClaimed).map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-2 bg-purple-50 rounded-xl"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-sm">
                            👤
                          </div>
                          <span className="text-[14px] font-medium text-purple-700">
                            {invitation.inviteeName || 'ユーザー'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleClaimInviterReward(invitation.id)}
                          disabled={claimingInvitationId === invitation.id}
                          className="px-3 py-1.5 rounded-lg text-[12px] font-bold
                            bg-gradient-to-r from-purple-500 to-pink-500 text-white
                            disabled:opacity-50 active:scale-95 transition-all"
                        >
                          {claimingInvitationId === invitation.id ? '...' : '受け取る'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <SectionFooter text="おともだちと一緒にポケシルを楽しもう！招待するとおたがいにプレゼントがもらえるよ🎁" />
          </section>
        )}

        {/* ========== レビュー報酬セクション ========== */}
        {reviewRewardStatus && (currentPlatform === 'ios' || currentPlatform === 'android' ||
          reviewRewardStatus.canClaimIos || reviewRewardStatus.canClaimAndroid) && (
          <section>
            <SectionHeader title="アプリをおうえん" />
            <div className="mx-4 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(251,191,36,0.15)] overflow-hidden">
              {/* レビュー報酬説明 */}
              <div className="p-4">
                <div className="text-center mb-4">
                  <p className="text-[17px] font-bold text-gray-800 mb-1">
                    ポケシルを楽しんでくれてありがとう！
                  </p>
                  <p className="text-[15px] text-gray-600">
                    レビューで応援してくれたら<br/>
                    すっごくうれしいな<span className="text-lg">🥺💓</span>
                  </p>
                </div>

                {/* 報酬表示 */}
                <div className="mb-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[14px] text-gray-600">お礼に…</span>
                    <span className="text-[16px] font-bold text-purple-600">
                      🎫シルチケ×5
                    </span>
                    <span className="text-[14px] text-gray-600">プレゼントするね！</span>
                  </div>
                </div>

                {/* ストアボタン */}
                <div className="space-y-2">
                  {/* iOS App Store */}
                  {(currentPlatform === 'ios' || currentPlatform === 'web') && (
                    <button
                      onClick={() => handleClaimReviewReward('ios')}
                      disabled={!reviewRewardStatus.canClaimIos || isClaimingReview}
                      className={`
                        w-full py-3 rounded-xl text-[15px] font-bold
                        flex items-center justify-center gap-2
                        transition-all active:scale-95
                        ${reviewRewardStatus.canClaimIos
                          ? 'bg-black text-white shadow-md'
                          : 'bg-gray-100 text-gray-400'
                        }
                      `}
                    >
                      {/* Appleアイコン */}
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                      {reviewRewardStatus.canClaimIos
                        ? (isClaimingReview ? '開いてるよ...' : 'App Store で応援する')
                        : '応援ありがとう！✨'
                      }
                    </button>
                  )}

                  {/* Google Play */}
                  {(currentPlatform === 'android' || currentPlatform === 'web') && (
                    <button
                      onClick={() => handleClaimReviewReward('android')}
                      disabled={!reviewRewardStatus.canClaimAndroid || isClaimingReview}
                      className={`
                        w-full py-3 rounded-xl text-[15px] font-bold
                        flex items-center justify-center gap-2
                        transition-all active:scale-95
                        ${reviewRewardStatus.canClaimAndroid
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-400'
                        }
                      `}
                    >
                      {/* Google Playアイコン */}
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z"/>
                      </svg>
                      {reviewRewardStatus.canClaimAndroid
                        ? (isClaimingReview ? '開いてるよ...' : 'Google Play で応援する')
                        : '応援ありがとう！✨'
                      }
                    </button>
                  )}
                </div>
              </div>

              {/* 注意書き */}
              <div className="px-4 py-2 bg-gray-50 text-center">
                <p className="text-[11px] text-gray-400">
                  ※ストアを開くとお礼がもらえるよ
                </p>
              </div>
            </div>
            <SectionFooter text="みんなの声がポケシルをもっと楽しくするよ！いつもありがとう💜" />
          </section>
        )}

        {/* アカウント連携セクション */}
        <section>
          <SectionHeader title="データのバックアップ" />
          <SettingsCard>
            {/* 連携ステータス */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {isAccountLinked ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-green-600">データは安全です</p>
                      <p className="text-[12px] text-gray-400">機種変更してもデータを引き継げます</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-[15px] font-medium text-orange-600">バックアップ未設定</p>
                      <p className="text-[12px] text-gray-400">連携するとデータを守れます</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Google連携ボタン */}
            <button
              onClick={handleLinkGoogle}
              disabled={isGoogleLinked || isLinkingGoogle}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5
                transition-colors
                ${isGoogleLinked ? 'bg-gray-50' : 'active:bg-gray-50'}
              `}
            >
              {/* Googleアイコン */}
              <div className="w-[30px] h-[30px] rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>

              {/* ラベル */}
              <span
                className={`flex-1 text-left text-[17px] ${isGoogleLinked ? 'text-gray-400' : 'text-gray-900'}`}
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                {isLinkingGoogle ? '連携中...' : isGoogleLinked ? 'Google連携済み' : 'Googleで連携'}
              </span>

              {/* ステータス */}
              {isGoogleLinked ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-300" />
              )}
            </button>

            {/* Apple連携ボタン */}
            <button
              onClick={handleLinkApple}
              disabled={isAppleLinked || isLinkingApple}
              className={`
                w-full flex items-center gap-4 px-4 py-3.5 rounded-b-2xl
                transition-colors
                ${isAppleLinked ? 'bg-gray-50' : 'active:bg-gray-50'}
              `}
            >
              {/* Appleアイコン */}
              <div className="w-[30px] h-[30px] rounded-lg bg-black flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </div>

              {/* ラベル */}
              <span
                className={`flex-1 text-left text-[17px] ${isAppleLinked ? 'text-gray-400' : 'text-gray-900'}`}
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                {isLinkingApple ? '連携中...' : isAppleLinked ? 'Apple連携済み' : 'Appleで連携'}
              </span>

              {/* ステータス */}
              {isAppleLinked ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </SettingsCard>
          <SectionFooter text="アカウントを連携すると、機種変更しても今のシールやフレンドを引き継げます。" />
        </section>

        {/* アカウント情報カード */}
        {(userName || userEmail) && (
          <div className="mx-4 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(139,92,246,0.08)] p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-300 via-pink-300 to-purple-400 flex items-center justify-center text-3xl shadow-lg">
                👤
              </div>
              <div className="flex-1 min-w-0">
                {userName && (
                  <p className="text-[20px] font-bold text-gray-900 truncate">{userName}</p>
                )}
                {userEmail && (
                  <p className="text-[15px] text-gray-500 truncate">{userEmail}</p>
                )}
              </div>
              <button className="px-4 py-2 rounded-full text-[15px] font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 hover:from-purple-200 hover:to-pink-200 active:scale-95 transition-all">
                編集
              </button>
            </div>
          </div>
        )}

        {/* 通知設定 */}
        <section>
          <SectionHeader title="つうち" />
          <SettingsCard>
            <SettingsToggleItem
              icon={<HandshakeIcon className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-orange-400 to-orange-500"
              label="交換リクエスト"
              description="交換の申し込みがあったとき"
              checked={settings.notifications.tradeRequests}
              onChange={(v) => updateNotification('tradeRequests', v)}
              isFirst
            />
            <SettingsToggleItem
              icon={<UserPlus className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-blue-400 to-blue-500"
              label="フレンドリクエスト"
              description="フレンド申請があったとき"
              checked={settings.notifications.friendRequests}
              onChange={(v) => updateNotification('friendRequests', v)}
            />
            <SettingsToggleItem
              icon={<Sparkles className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-pink-400 to-pink-500"
              label="新しいシール"
              description="新シールが追加されたとき"
              checked={settings.notifications.newStickers}
              onChange={(v) => updateNotification('newStickers', v)}
            />
            <SettingsToggleItem
              icon={<Trophy className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-yellow-400 to-yellow-500"
              label="コンテスト"
              description="コンテストの開始・終了"
              checked={settings.notifications.contests}
              onChange={(v) => updateNotification('contests', v)}
            />
            <SettingsToggleItem
              icon={<Bell className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-green-400 to-green-500"
              label="デイリーボーナス"
              description="毎日7時のシルチケ配布"
              checked={settings.notifications.dailyBonus}
              onChange={(v) => updateNotification('dailyBonus', v)}
              isLast
            />
          </SettingsCard>
        </section>

        {/* プライバシー設定 */}
        <section>
          <SectionHeader title="プライバシー" />
          <SettingsCard>
            <SettingsToggleItem
              icon={<Eye className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-purple-400 to-purple-500"
              label="プロフィール公開"
              description="他のユーザーからプロフィールが見える"
              checked={settings.privacy.publicProfile}
              onChange={(v) => updatePrivacy('publicProfile', v)}
              isFirst
            />
            <SettingsToggleItem
              icon={<Radio className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-green-400 to-green-500"
              label="オンライン状態を表示"
              description="他のユーザーにオンライン状態を見せる"
              checked={settings.privacy.showOnlineStatus}
              onChange={(v) => updatePrivacy('showOnlineStatus', v)}
            />
            <SettingsToggleItem
              icon={<HandshakeIcon className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-teal-400 to-teal-500"
              label="交換リクエストを許可"
              description="フレンド以外からの交換申請を受け付ける"
              checked={settings.privacy.allowTradeRequests}
              onChange={(v) => updatePrivacy('allowTradeRequests', v)}
              isLast
            />
          </SettingsCard>
          <SectionFooter text="プライバシー設定を変更すると、他のユーザーからの見え方が変わります。" />
        </section>

        {/* ブロック管理 */}
        {onOpenBlockedUsers && (
          <section>
            <SectionHeader title="ブロック" />
            <SettingsCard>
              <button
                onClick={onOpenBlockedUsers}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl active:bg-gray-50 transition-colors"
              >
                <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
                  <Ban className="w-4 h-4 text-white" />
                </div>
                <span
                  className="flex-1 text-left text-[17px] text-gray-900"
                  style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                >
                  ブロック中のユーザー
                </span>
                {blockedUsersCount > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-[13px] font-medium">
                    {blockedUsersCount}人
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            </SettingsCard>
            <SectionFooter text="ブロックしたユーザーの投稿や交換リクエストは表示されません。" />
          </section>
        )}

        {/* 管理者機能（管理者のみ表示） */}
        {isAdmin && onOpenAdminDashboard && (
          <section>
            <SectionHeader title="管理者" />
            <SettingsCard>
              <button
                onClick={onOpenAdminDashboard}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl active:bg-gray-50 transition-colors"
              >
                <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                  <Settings2 className="w-4 h-4 text-white" />
                </div>
                <span
                  className="flex-1 text-left text-[17px] text-gray-900 font-medium"
                  style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                >
                  管理者ダッシュボード
                </span>
                <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-600 text-[12px] font-bold">
                  ADMIN
                </span>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            </SettingsCard>
          </section>
        )}

        {/* 表示設定 */}
        <section>
          <SectionHeader title="がめん" />
          <SettingsCard>
            <SettingsSelectItem
              icon={<Palette className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-indigo-400 to-indigo-500"
              label="テーマ"
              value={settings.display.theme}
              options={[
                { value: 'light', label: 'ライト' },
                { value: 'dark', label: 'ダーク' },
                { value: 'auto', label: '自動' },
              ]}
              onChange={(v) => updateDisplay('theme', v)}
              isFirst
            />
            <SettingsSelectItem
              icon={<Globe className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-cyan-400 to-cyan-500"
              label="言語"
              value={settings.display.language}
              options={[
                { value: 'ja', label: '日本語' },
                { value: 'en', label: 'English' },
              ]}
              onChange={(v) => updateDisplay('language', v)}
              isLast
            />
          </SettingsCard>
        </section>

        {/* サポート */}
        <section>
          <SectionHeader title="サポート" />
          <SettingsCard>
            <SettingsNavItem
              icon={<MessageCircle className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-emerald-400 to-emerald-500"
              label="お問い合わせ"
              onClick={onContactSupport}
              isFirst
            />
            <SettingsNavItem
              icon={<FileText className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-gray-400 to-gray-500"
              label="利用規約"
              onClick={onViewTerms}
            />
            <SettingsNavItem
              icon={<Shield className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-blue-400 to-blue-500"
              label="プライバシーポリシー"
              onClick={onViewPrivacy}
              isLast
            />
          </SettingsCard>
        </section>

        {/* アカウント操作 */}
        <section>
          <SectionHeader title="アカウント" />
          <SettingsCard>
            <SettingsNavItem
              icon={<LogOut className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-orange-400 to-orange-500"
              label="ログアウト"
              onClick={() => setShowLogoutConfirm(true)}
              isFirst
            />
            <SettingsNavItem
              icon={<Trash2 className="w-4 h-4 text-white" />}
              iconBg="bg-gradient-to-br from-red-400 to-red-500"
              label="アカウントを削除"
              onClick={() => setShowDeleteConfirm(true)}
              danger
              isLast
            />
          </SettingsCard>
        </section>

        {/* バージョン情報 */}
        <div className="text-center py-6">
          <p className="text-[13px] text-gray-400">ポケシル v1.0.0</p>
          <p className="text-[11px] text-gray-300 mt-1">Made with 💜 in Japan</p>
        </div>
      </div>

      {/* ログアウト確認モーダル */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                <LogOut className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">ログアウトする？</h3>
              <p className="text-[15px] text-gray-500">またいつでも戻ってきてね！</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-medium text-[17px] hover:bg-gray-200 active:scale-95 transition-all"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false)
                  onLogout()
                }}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-[17px] hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all shadow-md"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}

      {/* アカウント削除確認モーダル */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-2">本当に削除する？</h3>
              <p className="text-[15px] text-gray-500">
                シールやフレンドのデータはすべて消えてしまいます。この操作は取り消せません。
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-medium text-[17px] hover:bg-gray-200 active:scale-95 transition-all"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  onDeleteAccount()
                }}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-[17px] hover:from-red-600 hover:to-red-700 active:scale-95 transition-all shadow-md"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsView
