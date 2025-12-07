'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PlacedSticker } from '../sticker-book/StickerPlacement'
import type { BookPage } from '../sticker-book/BookView'

// ============================================
// 型定義
// ============================================

// シール情報
export interface TradeSticker {
  id: string
  name: string
  imageUrl?: string
  rarity: 1 | 2 | 3 | 4 | 5
  type: 'normal' | 'puffy' | 'sparkle'
  rate: number
}

// ユーザー情報
export interface TradeUser {
  id: string
  name: string
  avatarUrl?: string
  level: number
}

// シール帳のページデータ
export interface TradeBookPage {
  id: string
  pageNumber: number
  stickers: PlacedSticker[]
}

// メッセージ種別
export type MessageType = 'stamp' | 'preset' | 'chat'

// メッセージ
export interface TradeMessage {
  id: string
  type: MessageType
  content: string
  senderId: string
  timestamp: Date
}

// スタンプ種別
export type StampType = 'please' | 'thinking' | 'addMore' | 'ok' | 'thanks' | 'cute' | 'no' | 'wait'

// スタンプ定義
const STAMPS: Record<StampType, { emoji: string; text: string }> = {
  please: { emoji: '🙏✨', text: 'おねがい！' },
  thinking: { emoji: '🤔💭', text: 'まよい中...' },
  addMore: { emoji: '➕🌟', text: 'もうちょっと' },
  ok: { emoji: '🎉🤝', text: 'OK！' },
  thanks: { emoji: '💕', text: 'ありがとう！' },
  cute: { emoji: '🩷', text: 'かわいい！' },
  no: { emoji: '😢💔', text: 'ごめんね...' },
  wait: { emoji: '⏳', text: 'ちょっとまって' },
}

// 定型文
const PRESET_MESSAGES = [
  'このシールほしい！',
  'もう少し足してくれる？',
  'これでどう？',
  'いいね！交換しよう！',
  '他のシールある？',
  'ちょっと考えさせて',
]

// ============================================
// Props
// ============================================
interface TradeSessionEnhancedProps {
  // ユーザー情報
  myUser: TradeUser
  partnerUser: TradeUser
  // シール帳データ
  myPages: TradeBookPage[]
  partnerPages: TradeBookPage[]
  // 所持シール一覧（ページに貼っていないものも含む）
  myStickers: TradeSticker[]
  partnerStickers: TradeSticker[]
  // コールバック
  onTradeComplete: (myOffers: string[], partnerOffers: string[]) => void
  onCancel: () => void
}

// ============================================
// レアリティカラー
// ============================================
const RARITY_COLORS: Record<number, string> = {
  1: 'from-gray-200 to-gray-300 border-gray-400',
  2: 'from-green-200 to-green-300 border-green-400',
  3: 'from-blue-200 to-blue-300 border-blue-400',
  4: 'from-purple-200 to-purple-300 border-purple-400',
  5: 'from-yellow-200 to-orange-300 border-yellow-500',
}

// ============================================
// ミニシールカード
// ============================================
const MiniStickerCard: React.FC<{
  sticker: PlacedSticker | TradeSticker
  selected?: boolean
  onSelect?: () => void
  size?: 'xs' | 'sm' | 'md'
  disabled?: boolean
}> = ({ sticker, selected, onSelect, size = 'sm', disabled }) => {
  const sizeClasses = {
    xs: 'w-10 h-10',
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
  }

  // PlacedStickerとTradeStickerの両方に対応
  const stickerData = 'sticker' in sticker ? sticker.sticker : sticker
  const imageUrl = stickerData.imageUrl
  const rarity = stickerData.rarity

  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={`
        ${sizeClasses[size]} rounded-xl border-2 overflow-hidden
        bg-gradient-to-br ${RARITY_COLORS[rarity] || RARITY_COLORS[1]}
        transition-all duration-200 relative flex-shrink-0
        ${selected ? 'ring-3 ring-pink-500 ring-offset-1 scale-105' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
      `}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={stickerData.name}
          className="w-full h-full object-contain p-0.5"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-lg">
          ⭐
        </div>
      )}
      {/* レア度 */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-center">
        <span className="text-[6px] text-yellow-300">
          {'★'.repeat(rarity)}
        </span>
      </div>
      {/* 選択マーク */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-0 right-0 w-4 h-4 bg-pink-500 rounded-bl-lg flex items-center justify-center"
        >
          <span className="text-white text-[8px]">✓</span>
        </motion.div>
      )}
    </motion.button>
  )
}

// ============================================
// ミニブックビューワー（相手/自分のシール帳を閲覧）
// ============================================
const MiniBookViewer: React.FC<{
  pages: TradeBookPage[]
  title: string
  isPartner: boolean
  selectedStickers: string[]
  onStickerSelect: (stickerId: string) => void
  maxSelections: number
}> = ({ pages, title, isPartner, selectedStickers, onStickerSelect, maxSelections }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const currentPageData = pages[currentPage]
  const stickers = currentPageData?.stickers || []

  const canSelectMore = selectedStickers.length < maxSelections

  return (
    <div className={`
      rounded-2xl p-2
      ${isPartner ? 'bg-purple-50/80' : 'bg-pink-50/80'}
      backdrop-blur-sm border border-white/50
    `}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{isPartner ? '👤' : '😊'}</span>
          <span className="text-xs font-bold text-purple-700">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="w-6 h-6 rounded-full bg-white/80 text-purple-600 text-xs disabled:opacity-30"
          >
            ←
          </button>
          <span className="text-[10px] text-purple-500 min-w-[40px] text-center">
            {currentPage + 1}/{pages.length || 1}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
            disabled={currentPage >= pages.length - 1}
            className="w-6 h-6 rounded-full bg-white/80 text-purple-600 text-xs disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>

      {/* シール表示エリア */}
      <div
        ref={scrollRef}
        className="bg-white/60 rounded-xl p-2 min-h-[80px] overflow-x-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {stickers.length > 0 ? (
          <div className="flex gap-1.5 flex-wrap">
            {stickers.map((sticker) => {
              const isSelected = selectedStickers.includes(sticker.id)
              return (
                <MiniStickerCard
                  key={sticker.id}
                  sticker={sticker}
                  selected={isSelected}
                  onSelect={() => onStickerSelect(sticker.id)}
                  size="sm"
                  disabled={!isSelected && !canSelectMore}
                />
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-16 text-purple-300 text-xs">
            このページにシールはありません
          </div>
        )}
      </div>

      {/* 選択数表示 */}
      <div className="mt-1.5 text-center">
        <span className={`text-[10px] ${isPartner ? 'text-purple-500' : 'text-pink-500'}`}>
          {isPartner ? 'ほしいシール' : 'あげるシール'}: {selectedStickers.length}/{maxSelections}
        </span>
      </div>
    </div>
  )
}

// ============================================
// 交換スロット表示
// ============================================
const TradeSlots: React.FC<{
  myOffers: TradeSticker[]
  partnerOffers: TradeSticker[]
  onRemoveMyOffer: (id: string) => void
  onRemovePartnerOffer: (id: string) => void
}> = ({ myOffers, partnerOffers, onRemoveMyOffer, onRemovePartnerOffer }) => {
  // レート計算
  const myRate = myOffers.reduce((sum, s) => sum + s.rate, 0)
  const partnerRate = partnerOffers.reduce((sum, s) => sum + s.rate, 0)
  const diff = partnerRate - myRate
  const isBalanced = Math.abs(diff) <= 10
  const isFavorable = diff > 10

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 border border-white/50 shadow-sm">
      {/* レートバー */}
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="text-center">
          <p className="text-[8px] text-pink-400">あげる</p>
          <p className="text-sm font-bold text-pink-600">{myRate}</p>
        </div>

        <div className={`
          px-2 py-0.5 rounded-full text-[10px] font-bold
          ${isBalanced ? 'bg-green-100 text-green-700' :
            isFavorable ? 'bg-blue-100 text-blue-700' :
            'bg-orange-100 text-orange-700'}
        `}>
          {isBalanced ? '⚖️ ばっちり' :
           isFavorable ? '🎉 おとく！' :
           '⚠️ ちょっとそん'}
        </div>

        <div className="text-center">
          <p className="text-[8px] text-purple-400">もらう</p>
          <p className="text-sm font-bold text-purple-600">{partnerRate}</p>
        </div>
      </div>

      {/* スロット表示 */}
      <div className="flex items-center gap-2">
        {/* 相手からもらうシール */}
        <div className="flex-1 bg-purple-50 rounded-xl p-2 min-h-[60px]">
          <div className="flex gap-1 flex-wrap justify-center">
            {partnerOffers.length > 0 ? (
              partnerOffers.map(sticker => (
                <div key={sticker.id} className="relative">
                  <MiniStickerCard sticker={sticker} size="xs" />
                  <button
                    onClick={() => onRemovePartnerOffer(sticker.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center shadow"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <span className="text-[10px] text-purple-300">タップで選択</span>
            )}
          </div>
        </div>

        {/* 交換アイコン */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl"
        >
          ⇄
        </motion.div>

        {/* 自分があげるシール */}
        <div className="flex-1 bg-pink-50 rounded-xl p-2 min-h-[60px]">
          <div className="flex gap-1 flex-wrap justify-center">
            {myOffers.length > 0 ? (
              myOffers.map(sticker => (
                <div key={sticker.id} className="relative">
                  <MiniStickerCard sticker={sticker} size="xs" />
                  <button
                    onClick={() => onRemoveMyOffer(sticker.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center shadow"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <span className="text-[10px] text-pink-300">タップで選択</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// チャット・スタンプパネル
// ============================================
const ChatPanel: React.FC<{
  messages: TradeMessage[]
  myUserId: string
  onSendStamp: (type: StampType) => void
  onSendPreset: (text: string) => void
  onSendChat: (text: string) => void
}> = ({ messages, myUserId, onSendStamp, onSendPreset, onSendChat }) => {
  const [chatInput, setChatInput] = useState('')
  const [showPresets, setShowPresets] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 新しいメッセージでスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendChat = () => {
    if (chatInput.trim()) {
      onSendChat(chatInput.trim())
      setChatInput('')
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm overflow-hidden">
      {/* メッセージ表示エリア */}
      <div className="h-24 overflow-y-auto p-2 bg-gradient-to-b from-purple-50/50 to-white/50">
        {messages.length > 0 ? (
          <div className="space-y-1.5">
            {messages.map((msg) => {
              const isMe = msg.senderId === myUserId
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[80%] px-2.5 py-1.5 rounded-2xl text-xs
                    ${isMe
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-br-sm'
                      : 'bg-white border border-purple-100 text-purple-700 rounded-bl-sm'}
                  `}>
                    {msg.type === 'stamp' ? (
                      <span className="text-lg">{STAMPS[msg.content as StampType]?.emoji || msg.content}</span>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-purple-300 text-xs">
            スタンプやメッセージでやりとりしよう！
          </div>
        )}
      </div>

      {/* スタンプボタン */}
      <div className="flex gap-1 p-2 overflow-x-auto border-t border-purple-100/50 bg-white/50">
        {(Object.keys(STAMPS) as StampType[]).map((type) => (
          <motion.button
            key={type}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSendStamp(type)}
            className="flex-shrink-0 flex flex-col items-center px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <span className="text-base">{STAMPS[type].emoji}</span>
            <span className="text-[8px] text-purple-500 whitespace-nowrap">{STAMPS[type].text}</span>
          </motion.button>
        ))}
      </div>

      {/* 定型文パネル */}
      <AnimatePresence>
        {showPresets && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-purple-100/50"
          >
            <div className="flex flex-wrap gap-1 p-2 bg-purple-50/50">
              {PRESET_MESSAGES.map((text, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSendPreset(text)
                    setShowPresets(false)
                  }}
                  className="px-2 py-1 rounded-full bg-white border border-purple-200 text-[10px] text-purple-600 hover:bg-purple-100 transition-colors"
                >
                  {text}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 入力エリア */}
      <div className="flex gap-1.5 p-2 border-t border-purple-100/50 bg-white/50">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm
            ${showPresets ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600'}
          `}
        >
          💬
        </button>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
          placeholder="メッセージを入力..."
          className="flex-1 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs text-purple-700 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSendChat}
          disabled={!chatInput.trim()}
          className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center disabled:opacity-50"
        >
          ➤
        </motion.button>
      </div>
    </div>
  )
}

// ============================================
// 交換成立画面
// ============================================
const TradeCompleteScreen: React.FC<{
  partnerName: string
  receivedStickers: TradeSticker[]
}> = ({ partnerName, receivedStickers }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-purple-900/95 to-pink-900/95 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="text-center"
      >
        {/* キラキラ */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            >
              {['✨', '⭐', '💫', '🌟'][i % 4]}
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-2">
          こうかんせいりつ！
        </h2>

        <p className="text-white/80 mb-6">
          {partnerName}とシールをこうかんしたよ！
        </p>

        {/* 獲得シール表示 */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <p className="text-white/80 text-sm mb-2">もらったシール</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {receivedStickers.map(sticker => (
              <motion.div
                key={sticker.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                <MiniStickerCard sticker={sticker} size="md" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// メインコンポーネント
// ============================================
export const TradeSessionEnhanced: React.FC<TradeSessionEnhancedProps> = ({
  myUser,
  partnerUser,
  myPages,
  partnerPages,
  myStickers,
  partnerStickers,
  onTradeComplete,
  onCancel,
}) => {
  // 状態管理
  const [myWants, setMyWants] = useState<string[]>([]) // 相手からほしいシールID
  const [myOffers, setMyOffers] = useState<string[]>([]) // 自分があげるシールID
  const [messages, setMessages] = useState<TradeMessage[]>([])
  const [myConfirmed, setMyConfirmed] = useState(false)
  const [partnerConfirmed, setPartnerConfirmed] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const MAX_SELECTIONS = 5

  // シール情報の取得
  const getPartnerStickerById = useCallback((id: string): TradeSticker | undefined => {
    // ページ内のシールから探す
    for (const page of partnerPages) {
      const found = page.stickers.find(s => s.id === id)
      if (found) {
        return {
          id: found.id,
          name: found.sticker.name,
          imageUrl: found.sticker.imageUrl,
          rarity: found.sticker.rarity as 1|2|3|4|5,
          type: found.sticker.type as 'normal'|'puffy'|'sparkle',
          rate: found.sticker.rarity * 10,
        }
      }
    }
    return partnerStickers.find(s => s.id === id)
  }, [partnerPages, partnerStickers])

  const getMyStickerById = useCallback((id: string): TradeSticker | undefined => {
    for (const page of myPages) {
      const found = page.stickers.find(s => s.id === id)
      if (found) {
        return {
          id: found.id,
          name: found.sticker.name,
          imageUrl: found.sticker.imageUrl,
          rarity: found.sticker.rarity as 1|2|3|4|5,
          type: found.sticker.type as 'normal'|'puffy'|'sparkle',
          rate: found.sticker.rarity * 10,
        }
      }
    }
    return myStickers.find(s => s.id === id)
  }, [myPages, myStickers])

  // シール選択ハンドラ
  const handleSelectPartnerSticker = useCallback((stickerId: string) => {
    setMyWants(prev => {
      if (prev.includes(stickerId)) {
        return prev.filter(id => id !== stickerId)
      }
      if (prev.length < MAX_SELECTIONS) {
        return [...prev, stickerId]
      }
      return prev
    })
    setMyConfirmed(false)
    setPartnerConfirmed(false)
  }, [])

  const handleSelectMySticker = useCallback((stickerId: string) => {
    setMyOffers(prev => {
      if (prev.includes(stickerId)) {
        return prev.filter(id => id !== stickerId)
      }
      if (prev.length < MAX_SELECTIONS) {
        return [...prev, stickerId]
      }
      return prev
    })
    setMyConfirmed(false)
    setPartnerConfirmed(false)
  }, [])

  // メッセージ送信
  const addMessage = useCallback((type: MessageType, content: string, senderId: string) => {
    const newMsg: TradeMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      senderId,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMsg])
  }, [])

  const handleSendStamp = useCallback((type: StampType) => {
    addMessage('stamp', type, myUser.id)
  }, [addMessage, myUser.id])

  const handleSendPreset = useCallback((text: string) => {
    addMessage('preset', text, myUser.id)
  }, [addMessage, myUser.id])

  const handleSendChat = useCallback((text: string) => {
    addMessage('chat', text, myUser.id)
  }, [addMessage, myUser.id])

  // 交換OK処理
  const handleConfirm = useCallback(() => {
    if (myWants.length === 0 || myOffers.length === 0) return
    setMyConfirmed(true)

    // デモ用：相手も少し遅れて確認
    setTimeout(() => {
      setPartnerConfirmed(true)
    }, 1500 + Math.random() * 1000)
  }, [myWants.length, myOffers.length])

  // 両者確認で交換成立
  useEffect(() => {
    if (myConfirmed && partnerConfirmed) {
      setIsCompleted(true)
      setTimeout(() => {
        onTradeComplete(myOffers, myWants)
      }, 3000)
    }
  }, [myConfirmed, partnerConfirmed, myOffers, myWants, onTradeComplete])

  // デモ用：相手のスタンプをランダムに受信
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && messages.length < 20) {
        const stampTypes: StampType[] = ['please', 'thinking', 'cute', 'ok', 'thanks']
        const randomStamp = stampTypes[Math.floor(Math.random() * stampTypes.length)]
        addMessage('stamp', randomStamp, partnerUser.id)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [addMessage, partnerUser.id, messages.length])

  // 選択されたシールの情報を取得
  const myOfferStickers = myOffers.map(getMyStickerById).filter(Boolean) as TradeSticker[]
  const partnerOfferStickers = myWants.map(getPartnerStickerById).filter(Boolean) as TradeSticker[]

  // 交換成立画面
  if (isCompleted) {
    return (
      <TradeCompleteScreen
        partnerName={partnerUser.name}
        receivedStickers={partnerOfferStickers}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-b from-purple-100 via-pink-50 to-purple-100 flex flex-col overflow-hidden"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* ヘッダー */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm px-3 py-2 flex items-center justify-between shadow-sm border-b border-purple-100/50">
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="text-purple-600 text-sm font-medium"
        >
          ← やめる
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-sm">
            👤
          </div>
          <span className="text-purple-700 font-bold text-sm">{partnerUser.name}</span>
          {partnerConfirmed && (
            <span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] rounded-full">
              OK!
            </span>
          )}
        </div>
        <div className="w-12" />
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 pb-24">
        {/* 相手のシール帳 */}
        <MiniBookViewer
          pages={partnerPages}
          title={`${partnerUser.name}のシール帳`}
          isPartner={true}
          selectedStickers={myWants}
          onStickerSelect={handleSelectPartnerSticker}
          maxSelections={MAX_SELECTIONS}
        />

        {/* 交換スロット */}
        <TradeSlots
          myOffers={myOfferStickers}
          partnerOffers={partnerOfferStickers}
          onRemoveMyOffer={(id) => setMyOffers(prev => prev.filter(i => i !== id))}
          onRemovePartnerOffer={(id) => setMyWants(prev => prev.filter(i => i !== id))}
        />

        {/* 自分のシール帳 */}
        <MiniBookViewer
          pages={myPages}
          title="わたしのシール帳"
          isPartner={false}
          selectedStickers={myOffers}
          onStickerSelect={handleSelectMySticker}
          maxSelections={MAX_SELECTIONS}
        />

        {/* チャットパネル */}
        <ChatPanel
          messages={messages}
          myUserId={myUser.id}
          onSendStamp={handleSendStamp}
          onSendPreset={handleSendPreset}
          onSendChat={handleSendChat}
        />
      </div>

      {/* 下部固定ボタン */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-sm border-t border-purple-100/50 shadow-lg">
        <motion.button
          onClick={handleConfirm}
          disabled={myWants.length === 0 || myOffers.length === 0 || myConfirmed}
          whileTap={myConfirmed ? {} : { scale: 0.98 }}
          className={`
            w-full py-4 rounded-2xl font-bold text-lg
            transition-all duration-300
            ${myConfirmed
              ? 'bg-green-500 text-white'
              : myWants.length === 0 || myOffers.length === 0
                ? 'bg-gray-200 text-gray-400'
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white shadow-lg'}
          `}
          style={{
            boxShadow: myConfirmed || myWants.length === 0 || myOffers.length === 0
              ? 'none'
              : '0 4px 20px rgba(139, 92, 246, 0.4)',
          }}
        >
          {myConfirmed ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                ⏳
              </motion.span>
              あいてのOKまち...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              🤝 こうかんOK！
            </span>
          )}
        </motion.button>
      </div>

      {/* キャンセル確認モーダル */}
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowCancelConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-4 max-w-xs w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-purple-700 text-center mb-2">
                こうかんをやめる？
              </h3>
              <p className="text-sm text-purple-500 text-center mb-4">
                まだせいりつしていません。<br/>
                ほんとうにやめますか？
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 font-medium"
                >
                  つづける
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium"
                >
                  やめる
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TradeSessionEnhanced
