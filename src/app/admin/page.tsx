'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  moderationService,
  type Report,
  type ReportStatus,
  REPORT_CATEGORY_LABELS,
} from '@/services/moderation'
import { authService } from '@/services/auth/authService'

type TabType = 'dashboard' | 'reports' | 'users' | 'gifts' | 'announcements' | 'activity'
type CurrencyType = 'silchike' | 'preshiru' | 'drop'

interface Stats {
  totalReports: number
  pendingReports: number
  totalUsers: number
  suspendedUsers: number
  totalPosts: number
  reportsToday: number
}

interface UserSearchResult {
  id: string
  displayName: string
  userCode: string
  avatarUrl: string | null
  silchike: number
  preshiru: number
  drops: number
  isSuspended: boolean
}

interface UserDetail {
  id: string
  displayName: string
  userCode: string
  avatarUrl: string | null
  silchike: number
  preshiru: number
  drops: number
  isSuspended: boolean
  suspendedUntil: string | null
  suspensionReason: string | null
  totalStickers: number
  totalTrades: number
  createdAt: string
}

interface GiftLog {
  id: string
  giftType: string
  targetUserId: string | null
  targetType: string
  currencyType: string | null
  currencyAmount: number | null
  stickerId: string | null
  stickerRank: number | null
  quantity: number | null
  reason: string
  createdAt: string
  targetUser?: {
    displayName: string
    userCode: string
  }
}

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  startsAt: string
  endsAt: string | null
  isActive: boolean
  isPinned: boolean
  createdAt: string
}

interface StickerOption {
  id: string
  name: string
  rarity: number
  series: string | null
}

const CURRENCY_INFO = {
  silchike: { name: 'シルチケ', icon: '🎫', color: '#8B5CF6' },
  preshiru: { name: 'プレシル', icon: '💎', color: '#EC4899' },
  drop: { name: 'どろっぷ', icon: '💧', color: '#3B82F6' },
}

const ANNOUNCEMENT_TYPES = {
  info: { name: 'お知らせ', icon: '📢', color: '#3B82F6' },
  update: { name: 'アップデート', icon: '🆕', color: '#10B981' },
  event: { name: 'イベント', icon: '🎉', color: '#F59E0B' },
  maintenance: { name: 'メンテナンス', icon: '🔧', color: '#6B7280' },
  urgent: { name: '緊急', icon: '🚨', color: '#EF4444' },
}

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [stats, setStats] = useState<Stats | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [isLoadingReports, setIsLoadingReports] = useState(true)
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('pending')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // ユーザー検索関連
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [userSearchResults, setUserSearchResults] = useState<UserSearchResult[]>([])
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // ギフト配布関連
  const [giftCurrencyType, setGiftCurrencyType] = useState<CurrencyType>('silchike')
  const [giftAmount, setGiftAmount] = useState(10)
  const [giftReason, setGiftReason] = useState('')
  const [isGrantingGift, setIsGrantingGift] = useState(false)
  const [giftTargetType, setGiftTargetType] = useState<'single' | 'all'>('single')

  // シール付与関連
  const [stickerList, setStickerList] = useState<StickerOption[]>([])
  const [selectedStickerId, setSelectedStickerId] = useState('')
  const [stickerQuantity, setStickerQuantity] = useState(1)
  const [stickerRank, setStickerRank] = useState(0)
  const [stickerReason, setStickerReason] = useState('')
  const [isGrantingSticker, setIsGrantingSticker] = useState(false)

  // お知らせ関連
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('')
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('')
  const [newAnnouncementType, setNewAnnouncementType] = useState<keyof typeof ANNOUNCEMENT_TYPES>('info')
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false)

  // アクティビティログ
  const [giftLogs, setGiftLogs] = useState<GiftLog[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  // 成功メッセージ
  const [successMessage, setSuccessMessage] = useState('')

  // 管理者チェック
  useEffect(() => {
    const checkAdmin = async () => {
      const user = await authService.getCurrentUser()
      if (!user) {
        router.push('/')
        return
      }
      setCurrentUserId(user.id)
      const admin = await moderationService.isAdmin(user.id)
      setIsAdmin(admin)
      if (!admin) {
        router.push('/')
      }
    }
    checkAdmin()
  }, [router])

  // 統計情報を取得
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true)
    const data = await moderationService.getStats()
    setStats(data)
    setIsLoadingStats(false)
  }, [])

  // 通報を取得
  const fetchReports = useCallback(async () => {
    setIsLoadingReports(true)
    const data = await moderationService.getAllReports({
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit: 50,
    })
    setReports(data)
    setIsLoadingReports(false)
  }, [statusFilter])

  // シール一覧を取得
  const fetchStickers = useCallback(async () => {
    const data = await moderationService.getStickerList()
    setStickerList(data)
    if (data.length > 0) {
      setSelectedStickerId(data[0].id)
    }
  }, [])

  // お知らせを取得
  const fetchAnnouncements = useCallback(async () => {
    const data = await moderationService.getAllAnnouncements()
    setAnnouncements(data)
  }, [])

  // ギフトログを取得
  const fetchGiftLogs = useCallback(async () => {
    setIsLoadingLogs(true)
    const data = await moderationService.getGiftLogs(100)
    setGiftLogs(data)
    setIsLoadingLogs(false)
  }, [])

  useEffect(() => {
    if (isAdmin) {
      fetchStats()
      fetchReports()
      fetchStickers()
      fetchAnnouncements()
      fetchGiftLogs()
    }
  }, [isAdmin, fetchStats, fetchReports, fetchStickers, fetchAnnouncements, fetchGiftLogs])

  // ユーザー検索
  const handleUserSearch = async () => {
    if (!userSearchQuery.trim()) return
    setIsSearching(true)
    const results = await moderationService.searchUsers(userSearchQuery)
    setUserSearchResults(results)
    setIsSearching(false)
  }

  // ユーザー詳細を取得
  const handleSelectUser = async (userId: string) => {
    const detail = await moderationService.getUserDetail(userId)
    setSelectedUser(detail)
  }

  // 通貨を付与
  const handleGrantCurrency = async () => {
    if (!currentUserId || !giftReason.trim()) return

    setIsGrantingGift(true)

    if (giftTargetType === 'all') {
      const count = await moderationService.grantCurrencyToAll(
        currentUserId,
        giftCurrencyType,
        giftAmount,
        giftReason
      )
      if (count > 0) {
        showSuccess(`${count}人のユーザーに${CURRENCY_INFO[giftCurrencyType].name}を${giftAmount}枚配布しました`)
        fetchGiftLogs()
      }
    } else if (selectedUser) {
      const success = await moderationService.grantCurrency(
        currentUserId,
        selectedUser.id,
        giftCurrencyType,
        giftAmount,
        giftReason
      )
      if (success) {
        showSuccess(`${selectedUser.displayName}に${CURRENCY_INFO[giftCurrencyType].name}を${giftAmount}枚付与しました`)
        handleSelectUser(selectedUser.id) // 更新
        fetchGiftLogs()
      }
    }

    setIsGrantingGift(false)
    setGiftReason('')
  }

  // シールを付与
  const handleGrantSticker = async () => {
    if (!currentUserId || !selectedUser || !selectedStickerId) return

    setIsGrantingSticker(true)

    const success = await moderationService.grantSticker(
      currentUserId,
      selectedUser.id,
      selectedStickerId,
      stickerRank,
      stickerQuantity,
      stickerReason || '管理者付与'
    )

    if (success) {
      const sticker = stickerList.find(s => s.id === selectedStickerId)
      showSuccess(`${selectedUser.displayName}に「${sticker?.name}」を${stickerQuantity}枚付与しました`)
      handleSelectUser(selectedUser.id) // 更新
      fetchGiftLogs()
    }

    setIsGrantingSticker(false)
    setStickerReason('')
  }

  // お知らせを作成
  const handleCreateAnnouncement = async () => {
    if (!currentUserId || !newAnnouncementTitle.trim() || !newAnnouncementContent.trim()) return

    setIsCreatingAnnouncement(true)

    const id = await moderationService.createAnnouncement(
      currentUserId,
      newAnnouncementTitle,
      newAnnouncementContent,
      newAnnouncementType
    )

    if (id) {
      showSuccess('お知らせを作成しました')
      fetchAnnouncements()
      setNewAnnouncementTitle('')
      setNewAnnouncementContent('')
    }

    setIsCreatingAnnouncement(false)
  }

  // お知らせの状態を切り替え
  const handleToggleAnnouncement = async (id: string, isActive: boolean) => {
    await moderationService.updateAnnouncement(id, { isActive: !isActive })
    fetchAnnouncements()
  }

  // 通報ステータス更新
  const handleUpdateStatus = async (
    reportId: string,
    status: ReportStatus,
    notes?: string,
    actionTaken?: string
  ) => {
    if (!currentUserId) return

    const success = await moderationService.updateReportStatus(
      reportId,
      currentUserId,
      status,
      notes,
      actionTaken
    )

    if (success) {
      fetchReports()
      fetchStats()
      setSelectedReport(null)
    }
  }

  // 成功メッセージを表示
  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">🔐</div>
          <p>権限を確認中...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
      {/* 成功メッセージ */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg animate-bounce">
          ✅ {successMessage}
        </div>
      )}

      {/* ヘッダー */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-lg font-bold text-white">管理者ダッシュボード</h1>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            ← アプリに戻る
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'dashboard' as TabType, icon: '📊', label: 'ダッシュボード' },
            { id: 'reports' as TabType, icon: '🚨', label: '通報' },
            { id: 'users' as TabType, icon: '👥', label: 'ユーザー' },
            { id: 'gifts' as TabType, icon: '🎁', label: 'ギフト配布' },
            { id: 'announcements' as TabType, icon: '📢', label: 'お知らせ' },
            { id: 'activity' as TabType, icon: '📜', label: 'ログ' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'}
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'reports' && stats && stats.pendingReports > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {stats.pendingReports}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="p-4 pb-20">
        {/* ダッシュボード */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">📊 概要</h2>
            {isLoadingStats ? (
              <div className="text-white/60">読み込み中...</div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard icon="🚨" label="未対応の通報" value={stats.pendingReports} color="#EF4444" />
                <StatCard icon="📩" label="今日の通報" value={stats.reportsToday} color="#F59E0B" />
                <StatCard icon="📊" label="総通報数" value={stats.totalReports} color="#8B5CF6" />
                <StatCard icon="👥" label="総ユーザー数" value={stats.totalUsers} color="#3B82F6" />
                <StatCard icon="🚫" label="停止中" value={stats.suspendedUsers} color="#DC2626" />
                <StatCard icon="📝" label="総投稿数" value={stats.totalPosts} color="#10B981" />
              </div>
            ) : null}
          </div>
        )}

        {/* 通報管理 */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">🚨 通報管理</h2>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as ReportStatus | 'all')}
                className="px-3 py-2 rounded-lg bg-white/10 text-white border-none text-sm"
              >
                <option value="all">すべて</option>
                <option value="pending">未対応</option>
                <option value="reviewing">確認中</option>
                <option value="resolved">解決済み</option>
                <option value="dismissed">却下</option>
              </select>
            </div>

            {isLoadingReports ? (
              <div className="text-white/60">読み込み中...</div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✨</div>
                <p className="text-white/60">通報はありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map(report => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onClick={() => setSelectedReport(report)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ユーザー管理 */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">👥 ユーザー管理</h2>

            {/* 検索バー */}
            <div className="flex gap-2">
              <input
                type="text"
                value={userSearchQuery}
                onChange={e => setUserSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUserSearch()}
                placeholder="ユーザーコードまたは名前で検索..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/40 border-none"
              />
              <button
                onClick={handleUserSearch}
                disabled={isSearching}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
              >
                {isSearching ? '...' : '検索'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 検索結果 */}
              <div className="space-y-3">
                <h3 className="text-white/80 font-medium">検索結果</h3>
                {userSearchResults.length === 0 ? (
                  <div className="text-center py-8 bg-white/5 rounded-xl">
                    <p className="text-white/40">ユーザーを検索してください</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {userSearchResults.map(user => (
                      <button
                        key={user.id}
                        onClick={() => handleSelectUser(user.id)}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          selectedUser?.id === user.id
                            ? 'bg-purple-500/30 ring-2 ring-purple-500'
                            : 'bg-white/10 hover:bg-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-lg">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : '👤'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium truncate">{user.displayName}</div>
                            <div className="text-white/50 text-sm">#{user.userCode}</div>
                          </div>
                          {user.isSuspended && (
                            <span className="px-2 py-1 bg-red-500/30 text-red-300 text-xs rounded">停止中</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ユーザー詳細 */}
              <div className="space-y-3">
                <h3 className="text-white/80 font-medium">ユーザー詳細</h3>
                {selectedUser ? (
                  <div className="bg-white/10 rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                        {selectedUser.avatarUrl ? (
                          <img src={selectedUser.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : '👤'}
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">{selectedUser.displayName}</div>
                        <div className="text-white/50">#{selectedUser.userCode}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl">🎫</div>
                        <div className="text-white font-bold">{selectedUser.silchike}</div>
                        <div className="text-white/40 text-xs">シルチケ</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl">💎</div>
                        <div className="text-white font-bold">{selectedUser.preshiru}</div>
                        <div className="text-white/40 text-xs">プレシル</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-2xl">💧</div>
                        <div className="text-white font-bold">{selectedUser.drops}</div>
                        <div className="text-white/40 text-xs">どろっぷ</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white/5 rounded-lg p-3">
                        <span className="text-white/40">シール数:</span>
                        <span className="text-white ml-2">{selectedUser.totalStickers}枚</span>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <span className="text-white/40">交換数:</span>
                        <span className="text-white ml-2">{selectedUser.totalTrades}回</span>
                      </div>
                    </div>

                    {selectedUser.isSuspended && (
                      <div className="bg-red-500/20 rounded-lg p-3 text-red-300 text-sm">
                        ⚠️ このユーザーは停止中です
                        {selectedUser.suspensionReason && (
                          <div className="mt-1 text-red-200/70">理由: {selectedUser.suspensionReason}</div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white/5 rounded-xl">
                    <p className="text-white/40">ユーザーを選択してください</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ギフト配布 */}
        {activeTab === 'gifts' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">🎁 ギフト配布</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 通貨配布 */}
              <div className="bg-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span>💰</span> 通貨を配布
                </h3>

                {/* 配布タイプ選択 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setGiftTargetType('single')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      giftTargetType === 'single'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    👤 個別配布
                  </button>
                  <button
                    onClick={() => setGiftTargetType('all')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      giftTargetType === 'all'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    👥 全員配布
                  </button>
                </div>

                {giftTargetType === 'single' && !selectedUser && (
                  <div className="bg-yellow-500/20 rounded-lg p-3 text-yellow-200 text-sm">
                    ⚠️ 「ユーザー」タブでユーザーを検索・選択してください
                  </div>
                )}

                {giftTargetType === 'single' && selectedUser && (
                  <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                    <span className="text-white/60 text-sm">配布先:</span>
                    <span className="text-white font-medium">{selectedUser.displayName}</span>
                    <span className="text-white/40 text-sm">#{selectedUser.userCode}</span>
                  </div>
                )}

                {/* 通貨タイプ選択 */}
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(CURRENCY_INFO) as CurrencyType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => setGiftCurrencyType(type)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        giftCurrencyType === type
                          ? 'ring-2 ring-white bg-white/20'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-2xl">{CURRENCY_INFO[type].icon}</div>
                      <div className="text-white text-sm mt-1">{CURRENCY_INFO[type].name}</div>
                    </button>
                  ))}
                </div>

                {/* 数量 */}
                <div>
                  <label className="text-white/60 text-sm">配布数</label>
                  <input
                    type="number"
                    value={giftAmount}
                    onChange={e => setGiftAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 text-white text-lg font-bold"
                  />
                </div>

                {/* 理由 */}
                <div>
                  <label className="text-white/60 text-sm">配布理由（必須）</label>
                  <input
                    type="text"
                    value={giftReason}
                    onChange={e => setGiftReason(e.target.value)}
                    placeholder="例: イベント報酬、お詫び配布など"
                    className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 text-white"
                  />
                </div>

                <button
                  onClick={handleGrantCurrency}
                  disabled={isGrantingGift || !giftReason.trim() || (giftTargetType === 'single' && !selectedUser)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGrantingGift ? '配布中...' : giftTargetType === 'all' ? '🎁 全員に配布する' : '🎁 配布する'}
                </button>
              </div>

              {/* シール付与 */}
              <div className="bg-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <span>🎨</span> シールを付与
                </h3>

                {!selectedUser ? (
                  <div className="bg-yellow-500/20 rounded-lg p-3 text-yellow-200 text-sm">
                    ⚠️ 「ユーザー」タブでユーザーを検索・選択してください
                  </div>
                ) : (
                  <>
                    <div className="bg-white/5 rounded-lg p-3 flex items-center gap-3">
                      <span className="text-white/60 text-sm">付与先:</span>
                      <span className="text-white font-medium">{selectedUser.displayName}</span>
                    </div>

                    {/* シール選択 */}
                    <div>
                      <label className="text-white/60 text-sm">シール</label>
                      <select
                        value={selectedStickerId}
                        onChange={e => setSelectedStickerId(e.target.value)}
                        className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 text-white"
                      >
                        {stickerList.map(s => (
                          <option key={s.id} value={s.id} style={{ background: '#1f2937' }}>
                            {'★'.repeat(s.rarity)} {s.name}{s.series ? ` (${s.series})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* ランク選択 */}
                    <div>
                      <label className="text-white/60 text-sm">ランク</label>
                      <div className="grid grid-cols-4 gap-2 mt-1">
                        {['ノーマル', 'シルバー', 'ゴールド', 'プリズム'].map((name, i) => (
                          <button
                            key={i}
                            onClick={() => setStickerRank(i)}
                            className={`py-2 rounded-lg text-xs font-medium transition-all ${
                              stickerRank === i
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/10 text-white/60'
                            }`}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 数量 */}
                    <div>
                      <label className="text-white/60 text-sm">枚数</label>
                      <input
                        type="number"
                        value={stickerQuantity}
                        onChange={e => setStickerQuantity(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                        className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 text-white"
                      />
                    </div>

                    {/* 理由 */}
                    <div>
                      <label className="text-white/60 text-sm">付与理由</label>
                      <input
                        type="text"
                        value={stickerReason}
                        onChange={e => setStickerReason(e.target.value)}
                        placeholder="例: イベント報酬など"
                        className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 text-white"
                      />
                    </div>

                    <button
                      onClick={handleGrantSticker}
                      disabled={isGrantingSticker || !selectedStickerId}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold disabled:opacity-50"
                    >
                      {isGrantingSticker ? '付与中...' : '🎨 シールを付与する'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* お知らせ */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">📢 お知らせ管理</h2>

            {/* 新規作成 */}
            <div className="bg-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="text-white font-bold">新しいお知らせを作成</h3>

              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(ANNOUNCEMENT_TYPES) as (keyof typeof ANNOUNCEMENT_TYPES)[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setNewAnnouncementType(type)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      newAnnouncementType === type
                        ? 'ring-2 ring-white bg-white/20'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-xl">{ANNOUNCEMENT_TYPES[type].icon}</div>
                    <div className="text-white text-xs mt-1">{ANNOUNCEMENT_TYPES[type].name}</div>
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={newAnnouncementTitle}
                onChange={e => setNewAnnouncementTitle(e.target.value)}
                placeholder="タイトル"
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white"
              />

              <textarea
                value={newAnnouncementContent}
                onChange={e => setNewAnnouncementContent(e.target.value)}
                placeholder="本文..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white resize-none"
              />

              <button
                onClick={handleCreateAnnouncement}
                disabled={isCreatingAnnouncement || !newAnnouncementTitle.trim() || !newAnnouncementContent.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold disabled:opacity-50"
              >
                {isCreatingAnnouncement ? '作成中...' : '📢 お知らせを作成'}
              </button>
            </div>

            {/* お知らせ一覧 */}
            <div className="space-y-3">
              <h3 className="text-white/80 font-medium">お知らせ一覧</h3>
              {announcements.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-xl text-white/40">
                  お知らせはありません
                </div>
              ) : (
                announcements.map(a => (
                  <div key={a.id} className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span>{ANNOUNCEMENT_TYPES[a.type as keyof typeof ANNOUNCEMENT_TYPES]?.icon || '📢'}</span>
                          <span className="text-white font-bold truncate">{a.title}</span>
                          {a.isPinned && <span className="text-yellow-400">📌</span>}
                        </div>
                        <p className="text-white/60 text-sm mt-1 line-clamp-2">{a.content}</p>
                        <div className="text-white/40 text-xs mt-2">{formatDate(a.createdAt)}</div>
                      </div>
                      <button
                        onClick={() => handleToggleAnnouncement(a.id, a.isActive)}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          a.isActive
                            ? 'bg-green-500/30 text-green-300'
                            : 'bg-red-500/30 text-red-300'
                        }`}
                      >
                        {a.isActive ? '公開中' : '非公開'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* アクティビティログ */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">📜 アクティビティログ</h2>

            {isLoadingLogs ? (
              <div className="text-white/60">読み込み中...</div>
            ) : giftLogs.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-xl">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-white/40">まだログがありません</p>
              </div>
            ) : (
              <div className="space-y-2">
                {giftLogs.map(log => (
                  <div key={log.id} className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {log.giftType === 'currency' ? CURRENCY_INFO[log.currencyType as CurrencyType]?.icon || '💰' : '🎨'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white">
                          {log.giftType === 'currency' ? (
                            <>
                              <span className="font-bold">{CURRENCY_INFO[log.currencyType as CurrencyType]?.name}</span>
                              <span> × {log.currencyAmount}</span>
                            </>
                          ) : (
                            <>
                              <span className="font-bold">シール</span>
                              <span> × {log.quantity}</span>
                            </>
                          )}
                          <span className="text-white/60 mx-2">→</span>
                          {log.targetType === 'all' ? (
                            <span className="text-purple-300">全ユーザー</span>
                          ) : (
                            <span>{log.targetUser?.displayName || '不明'}</span>
                          )}
                        </div>
                        <div className="text-white/40 text-sm">{log.reason}</div>
                      </div>
                      <div className="text-white/40 text-xs">{formatDate(log.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* 通報詳細モーダル */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  )
}

// 統計カード
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-white/60 text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value.toLocaleString()}</div>
    </div>
  )
}

// 通報カード
function ReportCard({ report, onClick }: { report: Report; onClick: () => void }) {
  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'pending': return { bg: 'bg-yellow-500/30', text: 'text-yellow-300' }
      case 'reviewing': return { bg: 'bg-blue-500/30', text: 'text-blue-300' }
      case 'resolved': return { bg: 'bg-green-500/30', text: 'text-green-300' }
      case 'dismissed': return { bg: 'bg-gray-500/30', text: 'text-gray-300' }
      default: return { bg: 'bg-gray-500/30', text: 'text-gray-300' }
    }
  }

  const getStatusLabel = (status: ReportStatus) => {
    switch (status) {
      case 'pending': return '未対応'
      case 'reviewing': return '確認中'
      case 'resolved': return '解決済み'
      case 'dismissed': return '却下'
      default: return status
    }
  }

  const colors = getStatusColor(report.status)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  return (
    <button onClick={onClick} className="w-full bg-white/10 rounded-xl p-4 text-left hover:bg-white/15 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
            {getStatusLabel(report.status)}
          </span>
          <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white">
            {REPORT_CATEGORY_LABELS[report.category]}
          </span>
        </div>
        <span className="text-white/40 text-xs">{formatDate(report.createdAt)}</span>
      </div>
      <div className="text-white text-sm mb-1">
        <strong>{report.targetType === 'user' ? 'ユーザー' : report.targetType}</strong>への通報
      </div>
      {report.description && (
        <p className="text-white/60 text-sm truncate">{report.description}</p>
      )}
      <div className="text-white/40 text-xs mt-2">
        通報者: {report.reporter?.displayName || '不明'}
      </div>
    </button>
  )
}

// 通報詳細モーダル
function ReportDetailModal({
  report,
  onClose,
  onUpdateStatus,
}: {
  report: Report
  onClose: () => void
  onUpdateStatus: (reportId: string, status: ReportStatus, notes?: string, actionTaken?: string) => void
}) {
  const [notes, setNotes] = useState(report.adminNotes || '')
  const [actionTaken, setActionTaken] = useState(report.actionTaken || '')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAction = async (status: ReportStatus) => {
    setIsProcessing(true)
    await onUpdateStatus(report.id, status, notes, actionTaken)
    setIsProcessing(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gray-900 p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-white font-bold">通報詳細</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/40 text-xs mb-1">カテゴリ</div>
              <div className="text-white">{REPORT_CATEGORY_LABELS[report.category]}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/40 text-xs mb-1">通報対象</div>
              <div className="text-white">{report.targetType === 'user' ? 'ユーザー' : report.targetType}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/40 text-xs mb-1">通報者</div>
              <div className="text-white">{report.reporter?.displayName || '不明'}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/40 text-xs mb-1">通報日時</div>
              <div className="text-white">{formatDate(report.createdAt)}</div>
            </div>
          </div>

          {report.description && (
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/40 text-xs mb-1">詳細</div>
              <div className="text-white">{report.description}</div>
            </div>
          )}

          <div>
            <label className="text-white/40 text-xs">管理者メモ</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="内部メモ..."
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 text-white resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="text-white/40 text-xs">対応内容</label>
            <textarea
              value={actionTaken}
              onChange={e => setActionTaken(e.target.value)}
              placeholder="実施した対応..."
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white/10 text-white resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            {report.status === 'pending' && (
              <button
                onClick={() => handleAction('reviewing')}
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold disabled:opacity-50"
              >
                確認中にする
              </button>
            )}
            <button
              onClick={() => handleAction('resolved')}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-green-500 text-white font-bold disabled:opacity-50"
            >
              解決済みにする
            </button>
            <button
              onClick={() => handleAction('dismissed')}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-white/10 text-white font-bold disabled:opacity-50"
            >
              却下する
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
