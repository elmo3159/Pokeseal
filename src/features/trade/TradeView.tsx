'use client'

import React, { useState } from 'react'
import {
  HandshakeIcon,
  UserIcon,
  SparkleIcon,
} from '@/components/icons/TradeIcons'

// 交換モード
export type TradeMode = 'menu' | 'matching' | 'session'

// フレンド情報
export interface Friend {
  id: string
  name: string
  avatarUrl?: string
  isOnline: boolean
  lastActive?: string
}

// 交換履歴
export interface TradeHistory {
  id: string
  partnerName: string
  partnerAvatarUrl?: string
  givenStickers: { name: string; rarity: number }[]
  receivedStickers: { name: string; rarity: number }[]
  tradedAt: string
}

interface TradeViewProps {
  friends: Friend[]
  history: TradeHistory[]
  onStartMatching: () => void
  onTradeWithFriend: (friendId: string) => void
  onViewHistory: (historyId: string) => void
}

// マッチングボタン - iOS風
const MatchingButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        relative w-full py-6 rounded-3xl
        bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-purple-500/90
        backdrop-blur-md
        text-white font-bold text-xl
        shadow-[0_4px_20px_rgba(139,92,246,0.4)]
        hover:shadow-[0_6px_24px_rgba(139,92,246,0.5)]
        transition-all duration-300
        active:scale-95
        overflow-hidden
        border border-white/20
      "
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* キラキラ背景 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />

      <div className="relative flex items-center justify-center gap-3">
        <span className="animate-bounce"><HandshakeIcon size={32} color="white" /></span>
        <div className="flex flex-col items-start">
          <span className="text-2xl">マッチングスタート！</span>
          <span className="text-sm font-normal opacity-80">
            ランダムなともだちとこうかん
          </span>
        </div>
      </div>
    </button>
  )
}

// フレンドカード - iOS風
const FriendCard: React.FC<{
  friend: Friend
  onTrade: () => void
}> = ({ friend, onTrade }) => {
  return (
    <div
      className="
        flex items-center gap-3 p-3
        bg-white/70 backdrop-blur-md rounded-2xl
        shadow-[0_2px_8px_rgba(139,92,246,0.1)]
        border border-white/50
        hover:bg-white/90 transition-all
      "
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* アバター */}
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-300/80 to-pink-300/80 flex items-center justify-center">
          {friend.avatarUrl ? (
            <img src={friend.avatarUrl} alt={friend.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <UserIcon size={28} color="#A855F7" />
          )}
        </div>
        {/* オンライン状態 */}
        <div className={`
          absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white
          ${friend.isOnline ? 'bg-green-400' : 'bg-gray-300'}
        `} />
      </div>

      {/* 情報 */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-purple-700 truncate">{friend.name}</h4>
        <p className="text-xs text-purple-400">
          {friend.isOnline ? 'オンライン' : friend.lastActive || 'オフライン'}
        </p>
      </div>

      {/* 交換ボタン */}
      <button
        onClick={onTrade}
        disabled={!friend.isOnline}
        className={`
          px-4 py-2 rounded-xl font-bold text-sm
          transition-all duration-200
          ${friend.isOnline
            ? 'bg-purple-500/90 backdrop-blur-sm text-white hover:bg-purple-600 active:scale-95 shadow-[0_2px_8px_rgba(139,92,246,0.3)]'
            : 'bg-gray-200/70 text-gray-400 cursor-not-allowed'}
        `}
      >
        こうかん
      </button>
    </div>
  )
}

// 交換履歴カード - iOS風
const HistoryCard: React.FC<{
  history: TradeHistory
  onClick: () => void
}> = ({ history, onClick }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'きょう'
    if (diffDays === 1) return 'きのう'
    if (diffDays < 7) return `${diffDays}日まえ`
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  return (
    <button
      onClick={onClick}
      className="
        w-full flex items-center gap-3 p-3
        bg-white/60 backdrop-blur-sm rounded-2xl
        border border-white/50
        shadow-[0_1px_4px_rgba(139,92,246,0.06)]
        hover:bg-white/80 transition-colors text-left
      "
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* パートナーアバター */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200/80 to-pink-200/80 flex items-center justify-center">
        {history.partnerAvatarUrl ? (
          <img src={history.partnerAvatarUrl} alt={history.partnerName} className="w-full h-full rounded-full object-cover" />
        ) : (
          <UserIcon size={24} color="#A855F7" />
        )}
      </div>

      {/* 交換内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-purple-700 text-sm truncate">
            {history.partnerName}
          </span>
          <span className="text-xs text-purple-400">
            {formatDate(history.tradedAt)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-purple-500 mt-0.5">
          <span className="text-pink-500">{history.givenStickers.length}枚</span>
          <span>↔</span>
          <span className="text-green-500">{history.receivedStickers.length}枚</span>
        </div>
      </div>

      {/* 詳細矢印 */}
      <span className="text-purple-300 text-lg">›</span>
    </button>
  )
}

// セクションヘッダー
const SectionHeader: React.FC<{
  icon: React.ReactNode
  title: string
  action?: { label: string; onClick: () => void }
}> = ({ icon, title, action }) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="flex items-center">{icon}</span>
        <h3 className="font-bold text-purple-700">{title}</h3>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm text-purple-500 hover:text-purple-700"
        >
          {action.label} ›
        </button>
      )}
    </div>
  )
}

// メインのTradeView
export const TradeView: React.FC<TradeViewProps> = ({
  friends,
  history,
  onStartMatching,
  onTradeWithFriend,
  onViewHistory
}) => {
  const [showAllFriends, setShowAllFriends] = useState(false)
  const [showAllHistory, setShowAllHistory] = useState(false)

  const onlineFriends = friends.filter(f => f.isOnline)
  const displayFriends = showAllFriends ? friends : friends.slice(0, 4)
  const displayHistory = showAllHistory ? history : history.slice(0, 3)

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
      {/* マッチングセクション */}
      <section className="mb-6">
        <SectionHeader icon={<SparkleIcon size={20} color="#FBBF24" />} title="ランダムこうかん" />
        <MatchingButton onClick={onStartMatching} />
        <p className="text-xs text-center text-purple-400 mt-2">
          ボタンをおすと、せかいのだれかとマッチング！
        </p>
      </section>

      {/* オンラインフレンド表示 - iOS風 */}
      {onlineFriends.length > 0 && (
        <div className="mb-4 px-3 py-2.5 bg-green-100/70 backdrop-blur-sm rounded-2xl border border-green-200/50">
          <p className="text-sm text-green-700">
            <span className="font-bold">{onlineFriends.length}人</span>のともだちがオンライン中！
          </p>
        </div>
      )}

      {/* フレンドセクション */}
      <section className="mb-6">
        <SectionHeader
          icon="👫"
          title="シールフレンド"
          action={
            friends.length > 4
              ? {
                  label: showAllFriends ? 'とじる' : 'すべてみる',
                  onClick: () => setShowAllFriends(!showAllFriends)
                }
              : undefined
          }
        />

        {friends.length > 0 ? (
          <div className="space-y-2">
            {displayFriends.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onTrade={() => onTradeWithFriend(friend.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-[0_2px_8px_rgba(139,92,246,0.06)]">
            <div className="text-4xl mb-2">👋</div>
            <p className="text-purple-500 text-sm">
              まだフレンドがいません
            </p>
            <p className="text-purple-400 text-xs mt-1">
              マッチングでともだちをつくろう！
            </p>
          </div>
        )}
      </section>

      {/* 交換履歴セクション */}
      <section>
        <SectionHeader
          icon="📜"
          title="こうかんりれき"
          action={
            history.length > 3
              ? {
                  label: showAllHistory ? 'とじる' : 'すべてみる',
                  onClick: () => setShowAllHistory(!showAllHistory)
                }
              : undefined
          }
        />

        {history.length > 0 ? (
          <div className="space-y-2">
            {displayHistory.map(item => (
              <HistoryCard
                key={item.id}
                history={item}
                onClick={() => onViewHistory(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-[0_2px_8px_rgba(139,92,246,0.06)]">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-purple-400 text-sm">
              まだこうかんしていません
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default TradeView
