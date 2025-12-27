'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { asyncTradeService, TradeSession } from '@/services/asyncTrade'
import { UserIcon } from '@/components/icons/TradeIcons'

interface AsyncTradeListViewProps {
  userId: string
  onSelectSession: (sessionId: string) => void
  onInviteUser: () => void
}

// タブ種別
type TabType = 'active' | 'pending'

// 相対時間フォーマット
const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'たった今'
  if (diffMinutes < 60) return `${diffMinutes}分前`
  if (diffHours < 24) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 期限までの残り時間
const formatExpiresIn = (expiresAt: string): string => {
  const expires = new Date(expiresAt)
  const now = new Date()
  const diffMs = expires.getTime() - now.getTime()

  if (diffMs <= 0) return '期限切れ'

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays >= 1) return `あと${diffDays}日`
  if (diffHours >= 1) return `あと${diffHours}時間`
  return 'まもなく期限'
}

// セッションカード
const SessionCard: React.FC<{
  session: TradeSession
  userId: string
  isPending?: boolean
  onClick: () => void
}> = ({ session, userId, isPending, onClick }) => {
  const partner = session.partner
  const isRequester = session.requesterId === userId

  // 自分と相手の確認状態
  const myConfirmed = isRequester ? session.requesterConfirmed : session.responderConfirmed
  const partnerConfirmed = isRequester ? session.responderConfirmed : session.requesterConfirmed

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-[0.98]"
      style={{
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        background: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 2px 12px rgba(184, 149, 107, 0.15)',
        border: isPending ? '2px solid #FFB74D' : '2px solid #D4C4B0',
      }}
    >
      {/* アバター */}
      <div className="relative">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #E8D5C4 0%, #D4C4B0 100%)' }}
        >
          {partner?.avatarUrl ? (
            <img src={partner.avatarUrl} alt={partner.displayName || partner.username} className="w-full h-full object-cover" />
          ) : (
            <UserIcon size={28} color="#8B5A2B" />
          )}
        </div>
        {/* 未読バッジ */}
        {session.unreadCount && session.unreadCount > 0 && (
          <div
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: '#E74C3C' }}
          >
            {session.unreadCount > 9 ? '9+' : session.unreadCount}
          </div>
        )}
      </div>

      {/* 情報 */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center gap-2">
          <h4 className="font-bold truncate" style={{ color: '#8B5A2B' }}>
            {partner?.displayName || partner?.username || '???'}
          </h4>
          {isPending && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: '#FFF3E0', color: '#E65100' }}
            >
              NEW
            </span>
          )}
        </div>

        <p className="text-xs mt-0.5" style={{ color: '#A67C52' }}>
          {formatRelativeTime(session.updatedAt)}
        </p>

        {/* 確認状態（アクティブセッションのみ） */}
        {!isPending && session.status === 'active' && (
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: myConfirmed ? 'rgba(76, 175, 80, 0.15)' : 'rgba(158, 158, 158, 0.15)',
                color: myConfirmed ? '#2E7D32' : '#757575',
              }}
            >
              {myConfirmed ? '✓ 確認済み' : '未確認'}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: partnerConfirmed ? 'rgba(76, 175, 80, 0.15)' : 'rgba(158, 158, 158, 0.15)',
                color: partnerConfirmed ? '#2E7D32' : '#757575',
              }}
            >
              相手: {partnerConfirmed ? '✓' : '−'}
            </span>
          </div>
        )}
      </div>

      {/* 期限 */}
      <div className="text-right">
        <p className="text-xs" style={{ color: '#B8956B' }}>
          {formatExpiresIn(session.expiresAt)}
        </p>
        <span style={{ color: '#C4A484' }} className="text-lg">›</span>
      </div>
    </button>
  )
}

// 空の状態
const EmptyState: React.FC<{ type: TabType; onInvite: () => void }> = ({ type, onInvite }) => {
  return (
    <div
      className="text-center py-12 rounded-2xl"
      style={{
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        background: 'rgba(255, 255, 255, 0.9)',
        border: '2px solid #D4C4B0',
      }}
    >
      <div className="text-5xl mb-3">
        {type === 'active' ? '📭' : '📬'}
      </div>
      <h3 className="font-bold mb-1" style={{ color: '#8B5A2B' }}>
        {type === 'active' ? '進行中のこうかんがありません' : '招待がありません'}
      </h3>
      <p className="text-sm mb-4" style={{ color: '#A67C52' }}>
        {type === 'active'
          ? 'フレンドをこうかんにさそおう！'
          : 'フレンドからの招待を待っています'}
      </p>
      {type === 'active' && (
        <button
          onClick={onInvite}
          className="px-6 py-2 rounded-xl font-bold text-white transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
            boxShadow: '0 2px 8px rgba(184, 149, 107, 0.4)',
          }}
        >
          さそう
        </button>
      )}
    </div>
  )
}

// メインコンポーネント
export const AsyncTradeListView: React.FC<AsyncTradeListViewProps> = ({
  userId,
  onSelectSession,
  onInviteUser,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('active')
  const [activeSessions, setActiveSessions] = useState<TradeSession[]>([])
  const [pendingInvitations, setPendingInvitations] = useState<TradeSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // データ取得
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [sessions, invitations] = await Promise.all([
        asyncTradeService.getMySessions(userId),
        asyncTradeService.getPendingInvitations(userId),
      ])

      // activeSessions から pending（自分が送った招待待ち）を分離
      const active = sessions.filter(s => s.status === 'active')
      const sentPending = sessions.filter(s => s.status === 'pending' && s.requesterId === userId)

      setActiveSessions([...active, ...sentPending])
      setPendingInvitations(invitations)
    } catch (error) {
      console.error('[AsyncTradeList] Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const tabs: { id: TabType; label: string; count: number }[] = [
    { id: 'active', label: 'しんこう中', count: activeSessions.length },
    { id: 'pending', label: 'うけとり', count: pendingInvitations.length },
  ]

  const currentSessions = activeTab === 'active' ? activeSessions : pendingInvitations

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-bold" style={{ color: '#8B5A2B' }}>
          メッセージこうかん
        </h2>
        <button
          onClick={onInviteUser}
          className="px-4 py-2 rounded-xl font-bold text-sm text-white transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
            boxShadow: '0 2px 8px rgba(184, 149, 107, 0.4)',
          }}
        >
          ＋ さそう
        </button>
      </div>

      {/* タブ */}
      <div className="flex gap-1 mx-4 mb-4 p-1 rounded-2xl" style={{ background: 'rgba(212, 196, 176, 0.3)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2 px-3 rounded-xl font-bold text-sm transition-all relative"
            style={{
              background: activeTab === tab.id ? 'white' : 'transparent',
              color: activeTab === tab.id ? '#8B5A2B' : '#A67C52',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(184, 149, 107, 0.2)' : 'none',
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className="ml-1 px-1.5 py-0.5 rounded-full text-xs"
                style={{
                  background: activeTab === tab.id ? '#C4956A' : 'rgba(184, 149, 107, 0.3)',
                  color: activeTab === tab.id ? 'white' : '#8B5A2B',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* リスト */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading ? (
          // ローディング
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-20 rounded-2xl animate-pulse"
                style={{ background: 'rgba(212, 196, 176, 0.3)' }}
              />
            ))}
          </div>
        ) : currentSessions.length > 0 ? (
          <div className="space-y-3">
            {currentSessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                userId={userId}
                isPending={activeTab === 'pending'}
                onClick={() => onSelectSession(session.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState type={activeTab} onInvite={onInviteUser} />
        )}
      </div>
    </div>
  )
}

export default AsyncTradeListView
