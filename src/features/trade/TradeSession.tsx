'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { UPGRADE_RANKS, RANK_NAMES, type UpgradeRank } from '@/constants/upgradeRanks'
import { RankStars } from '@/components/upgrade'

// 交換用シール情報
export interface TradeSticker {
  id: string
  name: string
  imageUrl?: string
  rarity: 1 | 2 | 3 | 4 | 5
  type: 'normal' | 'puffy' | 'sparkle'
  rate: number // シールのレート（価値）
  upgradeRank?: UpgradeRank // アップグレードランク
}

// 交換相手情報
export interface TradePartner {
  id: string
  name: string
  avatarUrl?: string
  level: number
}

// スタンプの種類
export type StampType = 'please' | 'thinking' | 'addMore' | 'ok' | 'thanks' | 'cute'

// スタンプ定義
const stamps: Record<StampType, { emoji: string; text: string }> = {
  please: { emoji: '🙏✨', text: 'おねがい！' },
  thinking: { emoji: '🤔💭', text: 'まよい中...' },
  addMore: { emoji: '➕🌟', text: 'もうちょっと' },
  ok: { emoji: '🎉🤝', text: 'OK！' },
  thanks: { emoji: '💕', text: 'ありがとう！' },
  cute: { emoji: '🩷', text: 'かわいい！' }
}

// 交換状態
export type TradeStatus = 'selecting' | 'waiting' | 'confirmed' | 'completed' | 'cancelled'

interface TradeSessionProps {
  partner: TradePartner
  myStickers: TradeSticker[]
  partnerStickers: TradeSticker[]
  onComplete: (givenIds: string[], receivedIds: string[]) => void
  onCancel: () => void
}

// レアリティ別の色
const rarityColors = {
  1: 'bg-gray-200 border-gray-300',
  2: 'bg-green-100 border-green-300',
  3: 'bg-blue-100 border-blue-300',
  4: 'bg-purple-100 border-purple-300',
  5: 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-400'
}

// ランクオーラスタイルを取得
const getRankAuraStyle = (rank: number | undefined): React.CSSProperties => {
  if (rank === undefined || rank === UPGRADE_RANKS.NORMAL) return {}

  if (rank === UPGRADE_RANKS.SILVER) {
    return {
      boxShadow: '0 0 8px 2px rgba(192, 192, 192, 0.6), inset 0 0 4px rgba(255, 255, 255, 0.3)',
    }
  }
  if (rank === UPGRADE_RANKS.GOLD) {
    return {
      boxShadow: '0 0 10px 3px rgba(255, 215, 0, 0.6), inset 0 0 6px rgba(255, 248, 220, 0.4)',
    }
  }
  if (rank === UPGRADE_RANKS.PRISM) {
    return {
      boxShadow: '0 0 12px 4px rgba(167, 139, 250, 0.7), 0 0 20px 6px rgba(236, 72, 153, 0.4)',
      animation: 'prism-pulse 2s ease-in-out infinite',
    }
  }
  return {}
}

// ランクバッジの色を取得
const getRankBadgeStyle = (rank: number | undefined): React.CSSProperties => {
  if (rank === undefined || rank === UPGRADE_RANKS.NORMAL) return { display: 'none' }

  if (rank === UPGRADE_RANKS.SILVER) {
    return {
      background: 'linear-gradient(135deg, #C0C0C0, #E8E8E8)',
      color: '#666',
    }
  }
  if (rank === UPGRADE_RANKS.GOLD) {
    return {
      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
      color: '#8B4513',
    }
  }
  if (rank === UPGRADE_RANKS.PRISM) {
    return {
      background: 'linear-gradient(90deg, #FF6B6B, #FFE66D, #4ECDC4, #A78BFA)',
      color: 'white',
      textShadow: '0 0 2px rgba(0,0,0,0.5)',
    }
  }
  return { display: 'none' }
}

// シールカードコンポーネント
const StickerCard: React.FC<{
  sticker: TradeSticker
  selected?: boolean
  offered?: boolean
  onSelect?: () => void
  size?: 'sm' | 'md'
  disabled?: boolean
}> = ({ sticker, selected, offered, onSelect, size = 'md', disabled }) => {
  const sizeClasses = size === 'sm' ? 'w-14 h-14' : 'w-16 h-16'
  const upgradeRank = sticker.upgradeRank ?? UPGRADE_RANKS.NORMAL

  return (
    <button
      onClick={onSelect}
      disabled={disabled || offered}
      className={`
        ${sizeClasses} rounded-xl border-2 overflow-hidden
        transition-all duration-200 relative
        ${rarityColors[sticker.rarity]}
        ${selected ? 'ring-4 ring-pink-400 scale-105' : ''}
        ${offered ? 'opacity-50' : ''}
        ${disabled ? 'cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
      `}
      style={getRankAuraStyle(upgradeRank)}
    >
      {sticker.imageUrl ? (
        <img
          src={sticker.imageUrl}
          alt={sticker.name}
          className="w-full h-full object-contain p-1"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-2xl">
          {sticker.type === 'sparkle' ? '✨' : sticker.type === 'puffy' ? '🌟' : '⭐'}
        </div>
      )}
      {/* レア度表示 - SVGベースのRankStars */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-black/20 py-0.5">
        <RankStars
          baseRarity={sticker.rarity}
          upgradeRank={(sticker.upgradeRank ?? 0) as UpgradeRank}
          size="sm"
          showAnimation={false}
        />
      </div>
      {/* ランクバッジ */}
      {upgradeRank > UPGRADE_RANKS.NORMAL && (
        <div
          className="absolute top-0 left-0 px-1 text-[7px] font-bold rounded-br-lg"
          style={getRankBadgeStyle(upgradeRank)}
        >
          {RANK_NAMES[upgradeRank]?.charAt(0)}
        </div>
      )}
      {/* 選択マーク */}
      {selected && (
        <div className="absolute top-0 right-0 w-5 h-5 bg-pink-500 rounded-bl-lg flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </button>
  )
}

// オファーエリアのシール表示
const OfferSlot: React.FC<{
  sticker?: TradeSticker
  onRemove?: () => void
  isMyOffer: boolean
}> = ({ sticker, onRemove, isMyOffer }) => {
  if (!sticker) {
    return (
      <div className="w-14 h-14 rounded-xl border-2 border-dashed border-purple-300 bg-white/50 flex items-center justify-center">
        <span className="text-purple-300 text-xl">?</span>
      </div>
    )
  }

  const upgradeRank = sticker.upgradeRank ?? UPGRADE_RANKS.NORMAL

  return (
    <div className="relative">
      <div
        className={`w-14 h-14 rounded-xl border-2 overflow-hidden ${rarityColors[sticker.rarity]}`}
        style={getRankAuraStyle(upgradeRank)}
      >
        {sticker.imageUrl ? (
          <img src={sticker.imageUrl} alt={sticker.name} className="w-full h-full object-contain p-1" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {sticker.type === 'sparkle' ? '✨' : '⭐'}
          </div>
        )}
        {/* ランクバッジ */}
        {upgradeRank > UPGRADE_RANKS.NORMAL && (
          <div
            className="absolute top-0 left-0 px-1 text-[7px] font-bold rounded-br-lg"
            style={getRankBadgeStyle(upgradeRank)}
          >
            {RANK_NAMES[upgradeRank]?.charAt(0)}
          </div>
        )}
      </div>
      {isMyOffer && onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center shadow-md"
        >
          ×
        </button>
      )}
    </div>
  )
}

// レート表示バー
const RateDisplay: React.FC<{
  myRate: number
  partnerRate: number
}> = ({ myRate, partnerRate }) => {
  const diff = partnerRate - myRate
  const isBalanced = Math.abs(diff) <= 10
  const isFavorable = diff > 10
  const isUnfavorable = diff < -10

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white/80 rounded-full shadow-sm">
      <div className="text-center">
        <p className="text-[10px] text-purple-400">わたす</p>
        <p className="font-bold text-purple-700">{myRate}</p>
      </div>

      <div className={`
        px-3 py-1 rounded-full text-xs font-bold
        ${isBalanced ? 'bg-green-100 text-green-700' :
          isFavorable ? 'bg-blue-100 text-blue-700' :
          'bg-orange-100 text-orange-700'}
      `}>
        {isBalanced ? '⚖️ バランス◎' :
         isFavorable ? '🎉 おとく！' :
         '⚠️ ちょっとそん'}
      </div>

      <div className="text-center">
        <p className="text-[10px] text-purple-400">もらう</p>
        <p className="font-bold text-purple-700">{partnerRate}</p>
      </div>
    </div>
  )
}

// スタンプボタン
const StampButton: React.FC<{
  type: StampType
  onSend: () => void
}> = ({ type, onSend }) => {
  const stamp = stamps[type]

  return (
    <button
      onClick={onSend}
      className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg bg-white/80 hover:bg-white active:scale-95 transition-all"
    >
      <span className="text-xl">{stamp.emoji}</span>
      <span className="text-[10px] text-purple-600 whitespace-nowrap">{stamp.text}</span>
    </button>
  )
}

// スタンプ表示（受信したスタンプ）
const StampDisplay: React.FC<{
  type: StampType
  fromPartner: boolean
}> = ({ type, fromPartner }) => {
  const stamp = stamps[type]

  return (
    <div className={`
      animate-bounce-in px-4 py-2 rounded-2xl shadow-lg
      ${fromPartner ? 'bg-purple-100' : 'bg-pink-100'}
    `}>
      <p className="text-2xl text-center">{stamp.emoji}</p>
      <p className="text-xs text-center text-purple-700 mt-1">{stamp.text}</p>
    </div>
  )
}

// メインの交換セッションコンポーネント
export const TradeSession: React.FC<TradeSessionProps> = ({
  partner,
  myStickers,
  partnerStickers,
  onComplete,
  onCancel
}) => {
  const [myOffers, setMyOffers] = useState<string[]>([])
  const [partnerOffers, setPartnerOffers] = useState<string[]>([])
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)
  const [myConfirmed, setMyConfirmed] = useState(false)
  const [partnerConfirmed, setPartnerConfirmed] = useState(false)
  const [activeStamp, setActiveStamp] = useState<{ type: StampType; fromPartner: boolean } | null>(null)
  const [status, setStatus] = useState<TradeStatus>('selecting')

  // 自分のオファーレート計算
  const myOfferRate = myOffers.reduce((sum, id) => {
    const sticker = myStickers.find(s => s.id === id)
    return sum + (sticker?.rate || 0)
  }, 0)

  // 相手のオファーレート計算
  const partnerOfferRate = partnerOffers.reduce((sum, id) => {
    const sticker = partnerStickers.find(s => s.id === id)
    return sum + (sticker?.rate || 0)
  }, 0)

  // シールを選択してオファーに追加
  const handleSelectMySticker = useCallback((stickerId: string) => {
    if (myOffers.includes(stickerId)) {
      setMyOffers(prev => prev.filter(id => id !== stickerId))
    } else if (myOffers.length < 5) {
      setMyOffers(prev => [...prev, stickerId])
    }
    setMyConfirmed(false)
  }, [myOffers])

  // 相手のシールを選択（欲しいシールをリクエスト）
  const handleSelectPartnerSticker = useCallback((stickerId: string) => {
    // デモ用：相手側は自動的にオファーに追加されるシミュレーション
    if (partnerOffers.includes(stickerId)) {
      setPartnerOffers(prev => prev.filter(id => id !== stickerId))
    } else if (partnerOffers.length < 5) {
      setPartnerOffers(prev => [...prev, stickerId])
    }
    setPartnerConfirmed(false)
  }, [partnerOffers])

  // オファーからシールを削除
  const handleRemoveFromOffer = useCallback((stickerId: string, isMyOffer: boolean) => {
    if (isMyOffer) {
      setMyOffers(prev => prev.filter(id => id !== stickerId))
      setMyConfirmed(false)
    } else {
      setPartnerOffers(prev => prev.filter(id => id !== stickerId))
      setPartnerConfirmed(false)
    }
  }, [])

  // 確認ボタン
  const handleConfirm = useCallback(() => {
    if (myOffers.length === 0 || partnerOffers.length === 0) return
    setMyConfirmed(true)

    // デモ用：相手も少し遅れて確認
    setTimeout(() => {
      setPartnerConfirmed(true)
    }, 1500)
  }, [myOffers.length, partnerOffers.length])

  // スタンプ送信
  const handleSendStamp = useCallback((type: StampType) => {
    setActiveStamp({ type, fromPartner: false })
    setTimeout(() => setActiveStamp(null), 2000)
  }, [])

  // 両者確認で交換完了
  useEffect(() => {
    if (myConfirmed && partnerConfirmed) {
      setStatus('completed')
      setTimeout(() => {
        onComplete(myOffers, partnerOffers)
      }, 2000)
    }
  }, [myConfirmed, partnerConfirmed, myOffers, partnerOffers, onComplete])

  // デモ用：相手のスタンプをランダムに受信
  useEffect(() => {
    const stampInterval = setInterval(() => {
      if (Math.random() > 0.7 && !activeStamp) {
        const stampTypes: StampType[] = ['please', 'thinking', 'cute', 'ok']
        const randomStamp = stampTypes[Math.floor(Math.random() * stampTypes.length)]
        setActiveStamp({ type: randomStamp, fromPartner: true })
        setTimeout(() => setActiveStamp(null), 2000)
      }
    }, 5000)

    return () => clearInterval(stampInterval)
  }, [activeStamp])

  if (status === 'completed') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-purple-900/90 to-pink-900/90 flex items-center justify-center">
        <div className="text-center animate-zoom-reveal">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">こうかんせいりつ！</h2>
          <p className="text-white/80">
            {partner.name}とシールをこうかんしたよ！
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        @keyframes prism-pulse {
          0%, 100% {
            box-shadow: 0 0 12px 4px rgba(167, 139, 250, 0.7), 0 0 20px 6px rgba(236, 72, 153, 0.4);
          }
          33% {
            box-shadow: 0 0 12px 4px rgba(255, 107, 107, 0.7), 0 0 20px 6px rgba(255, 230, 109, 0.4);
          }
          66% {
            box-shadow: 0 0 12px 4px rgba(78, 205, 196, 0.7), 0 0 20px 6px rgba(167, 139, 250, 0.4);
          }
        }
      `}</style>
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-purple-100 to-pink-100 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={onCancel}
          className="text-purple-600 font-medium"
        >
          ← やめる
        </button>
        <h1 className="text-purple-700 font-bold">シールこうかん</h1>
        <div className="w-12" />
      </div>

      {/* 相手のエリア（上部） */}
      <div className="flex-shrink-0 p-3 bg-purple-50/50">
        {/* 相手の情報 */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-lg">
            👤
          </div>
          <div>
            <p className="font-bold text-purple-700 text-sm">{partner.name}</p>
            <p className="text-[10px] text-purple-400">Lv.{partner.level}</p>
          </div>
          {partnerConfirmed && (
            <span className="ml-auto px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
              OK！
            </span>
          )}
        </div>

        {/* 相手のシールリスト */}
        <div className="bg-white/60 rounded-xl p-2 max-h-24 overflow-x-auto">
          <div className="flex gap-2">
            {partnerStickers.map(sticker => (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                size="sm"
                selected={partnerOffers.includes(sticker.id)}
                onSelect={() => handleSelectPartnerSticker(sticker.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 交換エリア（中央） */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
        {/* レート表示 */}
        <RateDisplay myRate={myOfferRate} partnerRate={partnerOfferRate} />

        {/* オファーエリア */}
        <div className="flex items-center justify-center gap-4 my-4">
          {/* 相手のオファー */}
          <div className="bg-purple-100 rounded-2xl p-3">
            <p className="text-[10px] text-purple-500 text-center mb-2">もらう</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {partnerOffers.length > 0 ? (
                partnerOffers.map(id => {
                  const sticker = partnerStickers.find(s => s.id === id)
                  return sticker ? (
                    <OfferSlot
                      key={id}
                      sticker={sticker}
                      isMyOffer={false}
                      onRemove={() => handleRemoveFromOffer(id, false)}
                    />
                  ) : null
                })
              ) : (
                <OfferSlot isMyOffer={false} />
              )}
            </div>
          </div>

          {/* 交換アイコン */}
          <div className="text-3xl animate-pulse">⇄</div>

          {/* 自分のオファー */}
          <div className="bg-pink-100 rounded-2xl p-3">
            <p className="text-[10px] text-pink-500 text-center mb-2">わたす</p>
            <div className="flex gap-2 flex-wrap justify-center">
              {myOffers.length > 0 ? (
                myOffers.map(id => {
                  const sticker = myStickers.find(s => s.id === id)
                  return sticker ? (
                    <OfferSlot
                      key={id}
                      sticker={sticker}
                      isMyOffer={true}
                      onRemove={() => handleRemoveFromOffer(id, true)}
                    />
                  ) : null
                })
              ) : (
                <OfferSlot isMyOffer={true} />
              )}
            </div>
          </div>
        </div>

        {/* スタンプ表示 */}
        {activeStamp && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <StampDisplay type={activeStamp.type} fromPartner={activeStamp.fromPartner} />
          </div>
        )}

        {/* スタンプボタン */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(Object.keys(stamps) as StampType[]).map(type => (
            <StampButton key={type} type={type} onSend={() => handleSendStamp(type)} />
          ))}
        </div>
      </div>

      {/* 自分のエリア（下部） */}
      <div className="flex-shrink-0 p-3 bg-pink-50/50">
        {/* 自分のシールリスト */}
        <div className="bg-white/60 rounded-xl p-2 max-h-28 overflow-x-auto mb-3">
          <div className="flex gap-2">
            {myStickers.map(sticker => (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                size="sm"
                selected={myOffers.includes(sticker.id)}
                onSelect={() => handleSelectMySticker(sticker.id)}
              />
            ))}
          </div>
        </div>

        {/* 確認ボタン */}
        <button
          onClick={handleConfirm}
          disabled={myOffers.length === 0 || partnerOffers.length === 0 || myConfirmed}
          className={`
            w-full py-4 rounded-2xl font-bold text-lg
            transition-all duration-200
            ${myConfirmed
              ? 'bg-green-500 text-white'
              : myOffers.length === 0 || partnerOffers.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl active:scale-95'}
          `}
        >
          {myConfirmed ? '✓ まっています...' : '🤝 こうかんOK！'}
        </button>
      </div>
      </div>
    </>
  )
}

export default TradeSession
