'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HTMLFlipBook from 'react-pageflip'
import type { PlacedSticker } from '../sticker-book/StickerPlacement'
import type { BookPage, PageTheme } from '../sticker-book/BookView'

// ============================================
// 型定義
// ============================================

export interface TradeUser {
  id: string
  name: string
  avatarUrl?: string
  level: number
  bio?: string
  totalStickers?: number
  totalTrades?: number
}

export interface TradeSticker {
  id: string
  name: string
  imageUrl?: string
  rarity: 1 | 2 | 3 | 4 | 5
  type: 'normal' | 'puffy' | 'sparkle'
  rate: number
}

// TradeSessionFull用の拡張ページ型
export interface TradeBookPageFull extends BookPage {
  pageNumber?: number
  stickers: PlacedSticker[]
}

export type StampType = 'please' | 'thinking' | 'addMore' | 'ok' | 'thanks' | 'cute' | 'no' | 'wait'

interface TradeMessage {
  id: string
  type: 'stamp' | 'preset'
  content: string
  senderId: string
  timestamp: Date
}

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
  'もう少し足して？',
  'これでどう？',
  'いいね！',
  '他のある？',
  'ちょっと待って',
]

// レアリティカラー
const RARITY_COLORS: Record<number, string> = {
  1: 'from-gray-200 to-gray-300 border-gray-400',
  2: 'from-green-200 to-green-300 border-green-400',
  3: 'from-blue-200 to-blue-300 border-blue-400',
  4: 'from-purple-200 to-purple-300 border-purple-400',
  5: 'from-yellow-200 to-orange-300 border-yellow-500',
}

// ============================================
// Props
// ============================================
interface TradeSessionFullProps {
  myUser: TradeUser
  partnerUser: TradeUser
  myPages: TradeBookPageFull[]
  partnerPages: TradeBookPageFull[]
  onTradeComplete: (myOffers: string[], partnerOffers: string[]) => void
  onCancel: () => void
  onFollowPartner?: (partnerId: string) => void
}

// ============================================
// シールカード
// ============================================
const StickerCard: React.FC<{
  sticker: PlacedSticker
  selected?: boolean
  onSelect?: () => void
  disabled?: boolean
}> = ({ sticker, selected, onSelect, disabled }) => {
  const stickerData = sticker.sticker
  const imageUrl = stickerData.imageUrl
  const rarity = stickerData.rarity

  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.9 }}
      className={`
        w-14 h-14 rounded-xl border-2 overflow-hidden
        bg-gradient-to-br ${RARITY_COLORS[rarity] || RARITY_COLORS[1]}
        transition-all duration-200 relative flex-shrink-0
        ${selected ? 'ring-4 ring-pink-500 scale-110 z-10' : ''}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
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
        <div className="w-full h-full flex items-center justify-center text-2xl">
          ⭐
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-0.5">
        <span className="text-[8px] text-yellow-300 block text-center">
          {'★'.repeat(rarity)}
        </span>
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-0 right-0 w-5 h-5 bg-pink-500 rounded-bl-lg flex items-center justify-center shadow-md"
        >
          <span className="text-white text-xs font-bold">✓</span>
        </motion.div>
      )}
    </motion.button>
  )
}

// ============================================
// シール帳ページコンポーネント
// ============================================
const TradeBookPageComponent = React.forwardRef<
  HTMLDivElement,
  {
    page: TradeBookPageFull
    selectedStickers: string[]
    onStickerSelect: (stickerId: string) => void
    maxSelections: number
    disabled?: boolean
  }
>(({ page, selectedStickers, onStickerSelect, maxSelections, disabled }, ref) => {
  const canSelectMore = selectedStickers.length < maxSelections
  const stickers = page.stickers || []

  // ページテーマの背景
  const getPageBackground = (theme?: PageTheme) => {
    if (!theme) return 'bg-gradient-to-br from-pink-50 to-purple-50'
    return `bg-gradient-to-br ${theme.backgroundColor || 'from-pink-50 to-purple-50'}`
  }

  return (
    <div
      ref={ref}
      className={`w-full h-full ${getPageBackground(page.theme)} p-3 overflow-hidden`}
      style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)' }}
    >
      {page.type === 'cover' ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="text-4xl mb-2">📘</div>
          <p className="text-purple-700 font-bold text-sm">シール帳</p>
        </div>
      ) : page.type === 'back-cover' ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="text-2xl mb-2">📕</div>
          <p className="text-purple-500 text-xs">おわり</p>
        </div>
      ) : (
        <div className="w-full h-full relative">
          {/* ページ番号 */}
          <div className="absolute top-1 right-1 text-[10px] text-purple-400">
            {page.pageNumber}
          </div>
          {/* シール配置 */}
          {stickers.map((sticker) => {
            const isSelected = selectedStickers.includes(sticker.id)
            const size = 50 * sticker.scale
            return (
              <div
                key={sticker.id}
                className="absolute"
                style={{
                  left: `${sticker.x * 100}%`,
                  top: `${sticker.y * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                }}
              >
                <StickerCard
                  sticker={sticker}
                  selected={isSelected}
                  onSelect={() => onStickerSelect(sticker.id)}
                  disabled={disabled || (!isSelected && !canSelectMore)}
                />
              </div>
            )
          })}
          {stickers.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-purple-300 text-xs">
              シールがありません
            </div>
          )}
        </div>
      )}
    </div>
  )
})

TradeBookPageComponent.displayName = 'TradeBookPageComponent'

// ============================================
// シール帳ビューワー
// ============================================
const TradeBookViewer: React.FC<{
  pages: TradeBookPageFull[]
  userName: string
  isPartner: boolean
  selectedStickers: string[]
  onStickerSelect: (stickerId: string) => void
  maxSelections: number
}> = ({ pages, userName, isPartner, selectedStickers, onStickerSelect, maxSelections }) => {
  const bookRef = useRef<any>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const handleFlip = useCallback((e: any) => {
    setCurrentPage(e.data)
  }, [])

  // ページ幅・高さ (iPhone 12 最適化: 幅390px想定)
  const pageWidth = 150
  const pageHeight = 200

  return (
    <div className={`
      rounded-2xl p-2
      ${isPartner ? 'bg-purple-100/80' : 'bg-pink-100/80'}
      backdrop-blur-sm
    `}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{isPartner ? '👤' : '😊'}</span>
          <span className="text-xs font-bold text-purple-700">{userName}のシール帳</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
            disabled={currentPage === 0}
            className="w-7 h-7 rounded-full bg-white/80 text-purple-600 text-xs disabled:opacity-30 active:scale-95 transition-transform"
          >
            ◀
          </button>
          <span className="text-[10px] text-purple-500 min-w-[30px] text-center">
            {currentPage + 1}/{pages.length}
          </span>
          <button
            onClick={() => bookRef.current?.pageFlip()?.flipNext()}
            disabled={currentPage >= pages.length - 1}
            className="w-7 h-7 rounded-full bg-white/80 text-purple-600 text-xs disabled:opacity-30 active:scale-95 transition-transform"
          >
            ▶
          </button>
        </div>
      </div>

      {/* シール帳 */}
      <div className="flex justify-center">
        <div
          className="relative bg-white rounded-lg shadow-lg overflow-hidden"
          style={{ width: pageWidth * 2, height: pageHeight }}
        >
          <HTMLFlipBook
            ref={bookRef}
            width={pageWidth}
            height={pageHeight}
            size="fixed"
            minWidth={pageWidth}
            maxWidth={pageWidth}
            minHeight={pageHeight}
            maxHeight={pageHeight}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handleFlip}
            className="trade-book"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={400}
            usePortrait={false}
            startZIndex={0}
            autoSize={false}
            maxShadowOpacity={0.3}
            showPageCorners={true}
            disableFlipByClick={false}
            swipeDistance={30}
            clickEventForward={true}
            useMouseEvents={true}
          >
            {pages.map((page) => (
              <TradeBookPageComponent
                key={page.id}
                page={page}
                selectedStickers={selectedStickers}
                onStickerSelect={onStickerSelect}
                maxSelections={maxSelections}
                disabled={false}
              />
            ))}
          </HTMLFlipBook>
        </div>
      </div>

      {/* 選択数表示 */}
      <div className="mt-2 text-center">
        <span className={`text-xs font-medium ${isPartner ? 'text-purple-600' : 'text-pink-600'}`}>
          {isPartner ? '🎯 ほしいシール' : '🎁 あげるシール'}: {selectedStickers.length}/{maxSelections}
        </span>
      </div>
    </div>
  )
}

// ============================================
// 希望シール枠
// ============================================
const WishlistSlots: React.FC<{
  myWants: PlacedSticker[]
  partnerWants: PlacedSticker[]
  onRemoveMyWant: (id: string) => void
}> = ({ myWants, partnerWants, onRemoveMyWant }) => {
  const myRate = myWants.reduce((sum, s) => sum + s.sticker.rarity * 10, 0)
  const partnerRate = partnerWants.reduce((sum, s) => sum + s.sticker.rarity * 10, 0)
  const isBalanced = Math.abs(myRate - partnerRate) <= 20

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-purple-100">
      {/* レートバー */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="text-center">
          <p className="text-[10px] text-purple-400">もらう</p>
          <p className="text-lg font-bold text-purple-600">{myRate}</p>
        </div>
        <div className={`
          px-3 py-1 rounded-full text-xs font-bold
          ${isBalanced ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}
        `}>
          {isBalanced ? '⚖️ OK' : '⚠️ 差あり'}
        </div>
        <div className="text-center">
          <p className="text-[10px] text-pink-400">あげる</p>
          <p className="text-lg font-bold text-pink-600">{partnerRate}</p>
        </div>
      </div>

      {/* スロット */}
      <div className="flex gap-2">
        {/* 自分がほしいシール（相手から） */}
        <div className="flex-1 bg-purple-50 rounded-xl p-2 min-h-[70px]">
          <p className="text-[10px] text-purple-500 text-center mb-1">👤→わたし</p>
          <div className="flex gap-1 flex-wrap justify-center">
            {myWants.length > 0 ? (
              myWants.map((s) => (
                <div key={s.id} className="relative">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-purple-300 bg-white">
                    {s.sticker.imageUrl ? (
                      <img src={s.sticker.imageUrl} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl flex items-center justify-center h-full">⭐</span>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveMyWant(s.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center"
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

        <div className="text-2xl self-center">⇄</div>

        {/* 相手がほしいシール（自分から） */}
        <div className="flex-1 bg-pink-50 rounded-xl p-2 min-h-[70px]">
          <p className="text-[10px] text-pink-500 text-center mb-1">わたし→👤</p>
          <div className="flex gap-1 flex-wrap justify-center">
            {partnerWants.length > 0 ? (
              partnerWants.map((s) => (
                <div key={s.id} className="relative">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-pink-300 bg-white">
                    {s.sticker.imageUrl ? (
                      <img src={s.sticker.imageUrl} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl flex items-center justify-center h-full">⭐</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <span className="text-[10px] text-pink-300">相手が選択中</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// スタンプ・定型文パネル
// ============================================
const CommunicationPanel: React.FC<{
  messages: TradeMessage[]
  myUserId: string
  onSendStamp: (type: StampType) => void
  onSendPreset: (text: string) => void
}> = ({ messages, myUserId, onSendStamp, onSendPreset }) => {
  const [showPresets, setShowPresets] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
      {/* メッセージ表示 */}
      <div className="h-16 overflow-y-auto px-2 py-1 bg-gradient-to-b from-purple-50/50 to-white">
        {messages.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {messages.slice(-6).map((msg) => {
              const isMe = msg.senderId === myUserId
              return (
                <motion.div
                  key={msg.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    px-2 py-1 rounded-full text-xs
                    ${isMe ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'}
                  `}
                >
                  {msg.type === 'stamp'
                    ? STAMPS[msg.content as StampType]?.emoji
                    : msg.content}
                </motion.div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-purple-300 text-xs">
            スタンプでやりとりしよう！
          </div>
        )}
      </div>

      {/* スタンプボタン */}
      <div className="flex gap-1 p-2 overflow-x-auto border-t border-purple-100/50">
        {(Object.keys(STAMPS) as StampType[]).map((type) => (
          <motion.button
            key={type}
            whileTap={{ scale: 0.85 }}
            onClick={() => onSendStamp(type)}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-xl transition-colors"
          >
            {STAMPS[type].emoji}
          </motion.button>
        ))}
        <button
          onClick={() => setShowPresets(!showPresets)}
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors
            ${showPresets ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-600'}`}
        >
          💬
        </button>
      </div>

      {/* 定型文 */}
      <AnimatePresence>
        {showPresets && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
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
                  className="px-2 py-1 rounded-full bg-white border border-purple-200 text-[11px] text-purple-600 active:bg-purple-100"
                >
                  {text}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================
// 交換成立後プロフィール画面
// ============================================
const PostTradeProfileScreen: React.FC<{
  partner: TradeUser
  receivedStickers: PlacedSticker[]
  onFollow: () => void
  onClose: () => void
  isFollowing: boolean
}> = ({ partner, receivedStickers, onFollow, onClose, isFollowing }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-purple-900/95 to-pink-900/95 flex flex-col items-center justify-center p-4"
    >
      {/* キラキラエフェクト */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
          >
            {['✨', '⭐', '💫'][i % 3]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* 成功メッセージ */}
        <div className="text-center mb-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="text-5xl mb-2"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-bold text-white">こうかんせいりつ！</h2>
        </div>

        {/* もらったシール */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4">
          <p className="text-white/80 text-sm text-center mb-2">もらったシール</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {receivedStickers.map((s) => (
              <motion.div
                key={s.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="w-14 h-14 rounded-xl bg-white/30 overflow-hidden"
              >
                {s.sticker.imageUrl ? (
                  <img src={s.sticker.imageUrl} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-3xl flex items-center justify-center h-full">⭐</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 相手プロフィール */}
        <div className="bg-white rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-2xl border-2 border-purple-300">
              {partner.avatarUrl ? (
                <img src={partner.avatarUrl} className="w-full h-full rounded-full" />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <p className="font-bold text-purple-800">{partner.name}</p>
              <p className="text-xs text-purple-500">Lv.{partner.level}</p>
            </div>
          </div>

          {partner.bio && (
            <p className="text-sm text-purple-600 mb-3 bg-purple-50 rounded-lg p-2">
              {partner.bio}
            </p>
          )}

          <div className="flex gap-2 text-center mb-4">
            <div className="flex-1 bg-purple-50 rounded-lg py-2">
              <p className="text-lg font-bold text-purple-700">{partner.totalStickers || 0}</p>
              <p className="text-[10px] text-purple-500">シール</p>
            </div>
            <div className="flex-1 bg-pink-50 rounded-lg py-2">
              <p className="text-lg font-bold text-pink-700">{partner.totalTrades || 0}</p>
              <p className="text-[10px] text-pink-500">交換</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onFollow}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all
                ${isFollowing
                  ? 'bg-gray-200 text-gray-600'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'}`}
            >
              {isFollowing ? 'フォロー中' : '🤝 フォローする'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-600"
            >
              とじる
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// メインコンポーネント
// ============================================
export const TradeSessionFull: React.FC<TradeSessionFullProps> = ({
  myUser,
  partnerUser,
  myPages,
  partnerPages,
  onTradeComplete,
  onCancel,
  onFollowPartner,
}) => {
  // タブ切り替え（相手の帳/自分の帳）
  const [activeTab, setActiveTab] = useState<'partner' | 'my'>('partner')

  // 選択状態
  const [myWantIds, setMyWantIds] = useState<string[]>([]) // 相手からほしい
  const [myOfferIds, setMyOfferIds] = useState<string[]>([]) // 自分があげる

  // 交渉状態
  const [messages, setMessages] = useState<TradeMessage[]>([])
  const [myConfirmed, setMyConfirmed] = useState(false)
  const [partnerConfirmed, setPartnerConfirmed] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const MAX_SELECTIONS = 5

  // シールを取得
  const getStickerFromPages = useCallback((pages: TradeBookPageFull[], id: string): PlacedSticker | undefined => {
    for (const page of pages) {
      const found = page.stickers.find((s) => s.id === id)
      if (found) return found
    }
    return undefined
  }, [])

  const myWants = myWantIds.map((id) => getStickerFromPages(partnerPages, id)).filter(Boolean) as PlacedSticker[]
  const myOffers = myOfferIds.map((id) => getStickerFromPages(myPages, id)).filter(Boolean) as PlacedSticker[]

  // 選択ハンドラ
  const handleSelectPartnerSticker = useCallback((stickerId: string) => {
    setMyWantIds((prev) => {
      if (prev.includes(stickerId)) {
        return prev.filter((id) => id !== stickerId)
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
    setMyOfferIds((prev) => {
      if (prev.includes(stickerId)) {
        return prev.filter((id) => id !== stickerId)
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
  const addMessage = useCallback((type: 'stamp' | 'preset', content: string, senderId: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        type,
        content,
        senderId,
        timestamp: new Date(),
      },
    ])
  }, [])

  const handleSendStamp = useCallback(
    (type: StampType) => addMessage('stamp', type, myUser.id),
    [addMessage, myUser.id]
  )

  const handleSendPreset = useCallback(
    (text: string) => addMessage('preset', text, myUser.id),
    [addMessage, myUser.id]
  )

  // 交換OK
  const handleConfirm = useCallback(() => {
    if (myWantIds.length === 0 || myOfferIds.length === 0) return
    setMyConfirmed(true)

    // デモ: 相手も少し遅れてOK
    setTimeout(() => {
      setPartnerConfirmed(true)
    }, 1500 + Math.random() * 1000)
  }, [myWantIds.length, myOfferIds.length])

  // 両者OK → 成立
  useEffect(() => {
    if (myConfirmed && partnerConfirmed) {
      setTimeout(() => {
        setShowComplete(true)
      }, 500)
    }
  }, [myConfirmed, partnerConfirmed])

  // デモ: 相手のスタンプをランダム送信
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6 && messages.length < 15) {
        const types: StampType[] = ['please', 'thinking', 'cute', 'ok']
        addMessage('stamp', types[Math.floor(Math.random() * types.length)], partnerUser.id)
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [addMessage, partnerUser.id, messages.length])

  // デモ: 相手が自分のシールをほしがる（ランダム）
  useEffect(() => {
    const timeout = setTimeout(() => {
      // 相手がランダムにシールを選ぶ（デモ用）
      const allMyStickers = myPages.flatMap((p) => p.stickers)
      if (allMyStickers.length > 0 && myOfferIds.length === 0) {
        const randomCount = Math.min(2, allMyStickers.length)
        const selected = allMyStickers.slice(0, randomCount).map((s) => s.id)
        // 相手の選択として表示（実際はサーバーから来る）
      }
    }, 3000)
    return () => clearTimeout(timeout)
  }, [myPages, myOfferIds.length])

  // フォロー処理
  const handleFollow = useCallback(() => {
    setIsFollowing(true)
    onFollowPartner?.(partnerUser.id)
  }, [onFollowPartner, partnerUser.id])

  // 完了して閉じる
  const handleClose = useCallback(() => {
    onTradeComplete(myOfferIds, myWantIds)
  }, [onTradeComplete, myOfferIds, myWantIds])

  // 成立画面
  if (showComplete) {
    return (
      <PostTradeProfileScreen
        partner={partnerUser}
        receivedStickers={myWants}
        onFollow={handleFollow}
        onClose={handleClose}
        isFollowing={isFollowing}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-b from-purple-100 via-pink-50 to-purple-100 flex flex-col"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* ヘッダー */}
      <div className="flex-shrink-0 bg-white/90 backdrop-blur-sm px-3 py-2 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="text-purple-600 text-sm font-medium"
        >
          ✕ やめる
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
            {partnerUser.avatarUrl ? (
              <img src={partnerUser.avatarUrl} className="w-full h-full rounded-full" />
            ) : (
              <span className="text-sm">👤</span>
            )}
          </div>
          <span className="text-purple-700 font-bold text-sm">{partnerUser.name}</span>
          {partnerConfirmed && (
            <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] rounded-full font-bold">
              OK!
            </span>
          )}
        </div>
        <div className="w-14" />
      </div>

      {/* タブ切り替え */}
      <div className="flex-shrink-0 flex gap-2 px-3 py-2 bg-white/50">
        <button
          onClick={() => setActiveTab('partner')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'partner'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-white/80 text-purple-600'
          }`}
        >
          👤 {partnerUser.name}の帳
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'my'
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-white/80 text-pink-600'
          }`}
        >
          😊 わたしの帳
        </button>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 pb-28">
        {/* シール帳（タブで切り替え） */}
        <AnimatePresence mode="wait">
          {activeTab === 'partner' ? (
            <motion.div
              key="partner"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <TradeBookViewer
                pages={partnerPages}
                userName={partnerUser.name}
                isPartner={true}
                selectedStickers={myWantIds}
                onStickerSelect={handleSelectPartnerSticker}
                maxSelections={MAX_SELECTIONS}
              />
            </motion.div>
          ) : (
            <motion.div
              key="my"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TradeBookViewer
                pages={myPages}
                userName="わたし"
                isPartner={false}
                selectedStickers={myOfferIds}
                onStickerSelect={handleSelectMySticker}
                maxSelections={MAX_SELECTIONS}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 希望シール枠 */}
        <WishlistSlots
          myWants={myWants}
          partnerWants={myOffers}
          onRemoveMyWant={(id) => setMyWantIds((prev) => prev.filter((i) => i !== id))}
        />

        {/* スタンプ・定型文 */}
        <CommunicationPanel
          messages={messages}
          myUserId={myUser.id}
          onSendStamp={handleSendStamp}
          onSendPreset={handleSendPreset}
        />
      </div>

      {/* 固定フッター: 交換OKボタン */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-sm border-t border-purple-100 shadow-lg">
        <motion.button
          onClick={handleConfirm}
          disabled={myWantIds.length === 0 || myOfferIds.length === 0 || myConfirmed}
          whileTap={myConfirmed ? {} : { scale: 0.98 }}
          className={`
            w-full py-4 rounded-2xl font-bold text-lg transition-all
            ${myConfirmed
              ? 'bg-green-500 text-white'
              : myWantIds.length === 0 || myOfferIds.length === 0
                ? 'bg-gray-200 text-gray-400'
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white shadow-lg'}
          `}
        >
          {myConfirmed ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                ⏳
              </motion.span>
              相手のOKまち...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              🤝 こうかんOK！
            </span>
          )}
        </motion.button>
      </div>

      {/* キャンセル確認 */}
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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-4 max-w-xs w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-purple-700 text-center mb-2">
                こうかんをやめる？
              </h3>
              <p className="text-sm text-purple-500 text-center mb-4">
                まだせいりつしていません
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium"
                >
                  つづける
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium"
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

export default TradeSessionFull
