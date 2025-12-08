'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
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

export type StampType =
  | 'please' | 'thinking' | 'addMore' | 'ok'
  | 'thanks' | 'cute' | 'no' | 'wait'
  | 'this' | 'rare' | 'instead' | 'great'

interface TradeMessage {
  id: string
  type: 'stamp' | 'preset'
  content: string
  senderId: string
  timestamp: Date
}

// 交換用スタンプ（子ども向けシール交換に最適化）
const STAMPS: Record<StampType, { emoji: string; label: string }> = {
  please: { emoji: '🙏✨', label: 'おねがい！' },
  thinking: { emoji: '🤔💭', label: 'うーん...' },
  addMore: { emoji: '➕🌟', label: 'もっと！' },
  ok: { emoji: '🎉🤝', label: 'いいよ！' },
  thanks: { emoji: '💕', label: 'ありがとう！' },
  cute: { emoji: '🩷', label: 'かわいい～' },
  no: { emoji: '😢', label: 'ムリ...' },
  wait: { emoji: '⏳', label: 'まってね' },
  this: { emoji: '👀✨', label: 'これ！' },
  rare: { emoji: '🌟🌟🌟', label: 'レア！' },
  instead: { emoji: '🔄', label: 'かわりに？' },
  great: { emoji: '👍', label: 'オッケー！' },
}

// 交換用定型文
const PRESET_MESSAGES = [
  'このシールほしい！',
  'かわいい！',
  'もうちょっと足して？',
  'これでどう？',
  'レア見せて！',
  'ありがとう！',
  '他にある？',
  'これと交換しよう！',
  '考え中...',
  'いいね！',
]

// レアリティカラー
const RARITY_COLORS: Record<number, string> = {
  1: 'from-gray-100 to-gray-200 border-gray-300',
  2: 'from-green-100 to-green-200 border-green-300',
  3: 'from-blue-100 to-blue-200 border-blue-300',
  4: 'from-purple-100 to-purple-200 border-purple-300',
  5: 'from-yellow-100 to-orange-200 border-yellow-400',
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
// LINE風チャットメッセージバブル
// ============================================
const ChatBubble: React.FC<{
  message: TradeMessage
  isMe: boolean
  partnerName: string
}> = ({ message, isMe, partnerName }) => {
  const content = message.type === 'stamp'
    ? STAMPS[message.content as StampType]?.emoji || message.content
    : message.content

  const isStamp = message.type === 'stamp'

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
      {!isMe && (
        <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center mr-1 flex-shrink-0 text-[10px]">
          👤
        </div>
      )}
      <div
        className={`
          ${isStamp ? 'text-2xl px-2 py-1' : 'text-xs px-3 py-1.5'}
          rounded-2xl max-w-[70%] break-words
          ${isMe
            ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-br-sm'
            : 'bg-white text-purple-800 rounded-bl-sm shadow-sm border border-purple-100'}
        `}
      >
        {content}
        {isStamp && message.type === 'stamp' && (
          <span className="text-[10px] block text-center opacity-70">
            {STAMPS[message.content as StampType]?.label}
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================
// LINE風チャットエリア
// ============================================
const ChatArea: React.FC<{
  messages: TradeMessage[]
  myUserId: string
  partnerName: string
}> = ({ messages, myUserId, partnerName }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={scrollRef}
      className="h-24 overflow-y-auto px-2 py-2 bg-gradient-to-b from-purple-50/80 to-pink-50/80 rounded-xl"
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-purple-300 text-xs">
          スタンプでやりとりしよう！💬
        </div>
      ) : (
        messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isMe={msg.senderId === myUserId}
            partnerName={partnerName}
          />
        ))
      )}
    </div>
  )
}

// ============================================
// スタンプ・定型文パネル
// ============================================
const MessagePanel: React.FC<{
  onSendStamp: (type: StampType) => void
  onSendPreset: (text: string) => void
}> = ({ onSendStamp, onSendPreset }) => {
  const [activeTab, setActiveTab] = useState<'stamps' | 'presets'>('stamps')

  return (
    <div className="bg-white/95 rounded-xl border border-purple-100 overflow-hidden">
      {/* タブ切り替え */}
      <div className="flex border-b border-purple-100">
        <button
          onClick={() => setActiveTab('stamps')}
          className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
            activeTab === 'stamps'
              ? 'bg-purple-100 text-purple-700'
              : 'text-purple-400'
          }`}
        >
          😊 スタンプ
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
            activeTab === 'presets'
              ? 'bg-purple-100 text-purple-700'
              : 'text-purple-400'
          }`}
        >
          💬 定型文
        </button>
      </div>

      {/* コンテンツ */}
      <div className="p-2 max-h-20 overflow-y-auto">
        {activeTab === 'stamps' ? (
          <div className="grid grid-cols-6 gap-1">
            {(Object.keys(STAMPS) as StampType[]).map((type) => (
              <motion.button
                key={type}
                whileTap={{ scale: 0.85 }}
                onClick={() => onSendStamp(type)}
                className="w-10 h-10 rounded-lg bg-purple-50 hover:bg-purple-100 flex flex-col items-center justify-center transition-colors"
              >
                <span className="text-lg leading-none">{STAMPS[type].emoji}</span>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {PRESET_MESSAGES.map((text, i) => (
              <button
                key={i}
                onClick={() => onSendPreset(text)}
                className="px-2 py-1 rounded-full bg-purple-50 border border-purple-200 text-[10px] text-purple-600 active:bg-purple-100 whitespace-nowrap"
              >
                {text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// 希望シール枠（コンパクト版）
// ============================================
const CompactWishlist: React.FC<{
  myWants: PlacedSticker[]
  partnerWants: PlacedSticker[]
  onRemoveMyWant: (id: string) => void
  myConfirmed: boolean
  partnerConfirmed: boolean
  canConfirm: boolean
  onConfirm: () => void
}> = ({ myWants, partnerWants, onRemoveMyWant, myConfirmed, partnerConfirmed, canConfirm, onConfirm }) => {
  const myRate = myWants.reduce((sum, s) => sum + s.sticker.rarity * 10, 0)
  const partnerRate = partnerWants.reduce((sum, s) => sum + s.sticker.rarity * 10, 0)
  const isBalanced = Math.abs(myRate - partnerRate) <= 20

  return (
    <div className="bg-white/95 rounded-xl p-2 shadow-sm border border-purple-100">
      <div className="flex gap-2 items-stretch">
        {/* 希望シール（もらう） */}
        <div className="flex-1 bg-purple-50/80 rounded-lg p-1.5 min-h-[52px]">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] text-purple-500">👤→わたし</span>
            <span className="text-[10px] font-bold text-purple-600">{myRate}pt</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {myWants.length > 0 ? (
              myWants.slice(0, 3).map((s) => (
                <div key={s.id} className="relative group">
                  <div className="w-8 h-8 rounded-md overflow-hidden border border-purple-300 bg-white">
                    {s.sticker.imageUrl ? (
                      <img src={s.sticker.imageUrl} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-sm flex items-center justify-center h-full">⭐</span>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveMyWant(s.id)}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <span className="text-[9px] text-purple-300">タップで選択</span>
            )}
            {myWants.length > 3 && (
              <span className="text-[10px] text-purple-400 self-center">+{myWants.length - 3}</span>
            )}
          </div>
        </div>

        {/* 交換アイコン */}
        <div className="flex items-center">
          <div className={`text-lg ${isBalanced ? 'text-green-500' : 'text-orange-400'}`}>
            ⇄
          </div>
        </div>

        {/* 提供シール（あげる） */}
        <div className="flex-1 bg-pink-50/80 rounded-lg p-1.5 min-h-[52px]">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] text-pink-500">わたし→👤</span>
            <span className="text-[10px] font-bold text-pink-600">{partnerRate}pt</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {partnerWants.length > 0 ? (
              partnerWants.slice(0, 3).map((s) => (
                <div key={s.id} className="w-8 h-8 rounded-md overflow-hidden border border-pink-300 bg-white">
                  {s.sticker.imageUrl ? (
                    <img src={s.sticker.imageUrl} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-sm flex items-center justify-center h-full">⭐</span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-[9px] text-pink-300">相手が選択中</span>
            )}
            {partnerWants.length > 3 && (
              <span className="text-[10px] text-pink-400 self-center">+{partnerWants.length - 3}</span>
            )}
          </div>
        </div>

        {/* 交換OKボタン */}
        <motion.button
          onClick={onConfirm}
          disabled={!canConfirm || myConfirmed}
          whileTap={canConfirm && !myConfirmed ? { scale: 0.95 } : {}}
          className={`
            w-16 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all
            ${myConfirmed
              ? 'bg-green-500 text-white'
              : !canConfirm
                ? 'bg-gray-200 text-gray-400'
                : 'bg-gradient-to-b from-pink-400 to-purple-500 text-white shadow-lg'}
          `}
        >
          {myConfirmed ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-lg"
              >
                ⏳
              </motion.span>
              <span className="text-[8px]">まち中</span>
            </>
          ) : (
            <>
              <span className="text-lg">🤝</span>
              <span>OK!</span>
            </>
          )}
        </motion.button>
      </div>

      {/* ステータス表示 */}
      <div className="flex justify-center gap-3 mt-1.5">
        <div className={`flex items-center gap-1 text-[10px] ${myConfirmed ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{myConfirmed ? '✓' : '○'}</span>
          <span>わたし</span>
        </div>
        <div className={`flex items-center gap-1 text-[10px] ${partnerConfirmed ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{partnerConfirmed ? '✓' : '○'}</span>
          <span>相手</span>
        </div>
        {!isBalanced && (
          <span className="text-[10px] text-orange-500">⚠️ レート差あり</span>
        )}
      </div>
    </div>
  )
}

// ============================================
// シール帳ページコンポーネント（修正版）
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

  // ページ背景
  const getPageBackground = (theme?: PageTheme) => {
    if (!theme) return 'bg-gradient-to-br from-pink-50 to-purple-50'
    return `bg-gradient-to-br ${theme.backgroundColor || 'from-pink-50 to-purple-50'}`
  }

  // シールのタップハンドラ
  const handleStickerTap = useCallback((e: React.MouseEvent | React.TouchEvent, stickerId: string) => {
    e.stopPropagation()
    e.preventDefault()
    onStickerSelect(stickerId)
  }, [onStickerSelect])

  return (
    <div
      ref={ref}
      className={`w-full h-full ${getPageBackground(page.theme)} overflow-hidden relative`}
      style={{
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.03)',
      }}
    >
      {page.type === 'cover' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
          <div className="text-3xl mb-1">📘</div>
          <p className="text-white font-bold text-xs drop-shadow">シール帳</p>
        </div>
      ) : page.type === 'back-cover' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-300 to-pink-300">
          <div className="text-2xl mb-1">📕</div>
          <p className="text-white/80 text-[10px]">おわり</p>
        </div>
      ) : (
        <div className="w-full h-full p-2 relative">
          {/* ページ番号 */}
          {page.pageNumber && (
            <div className="absolute top-1 right-1 text-[8px] text-purple-300 bg-white/50 px-1 rounded">
              {page.pageNumber}
            </div>
          )}

          {/* シール配置 - 位置を正確に計算 */}
          {stickers.map((sticker) => {
            const isSelected = selectedStickers.includes(sticker.id)
            const size = Math.min(40, 36 * sticker.scale)
            const rarity = sticker.sticker.rarity

            return (
              <div
                key={sticker.id}
                className="absolute"
                style={{
                  left: `calc(${sticker.x * 100}% - ${size/2}px)`,
                  top: `calc(${sticker.y * 100}% - ${size/2}px)`,
                  width: size,
                  height: size,
                  transform: `rotate(${sticker.rotation}deg)`,
                  zIndex: isSelected ? 10 : 1,
                }}
              >
                <button
                  onClick={(e) => handleStickerTap(e, sticker.id)}
                  onTouchEnd={(e) => handleStickerTap(e, sticker.id)}
                  disabled={disabled || (!isSelected && !canSelectMore)}
                  className={`
                    w-full h-full rounded-lg border-2 overflow-hidden
                    bg-gradient-to-br ${RARITY_COLORS[rarity] || RARITY_COLORS[1]}
                    transition-all duration-150 relative
                    ${isSelected ? 'ring-2 ring-pink-500 ring-offset-1 scale-110' : ''}
                    ${disabled || (!isSelected && !canSelectMore) ? 'opacity-50' : 'active:scale-95'}
                  `}
                  style={{ touchAction: 'manipulation' }}
                >
                  {sticker.sticker.imageUrl ? (
                    <img
                      src={sticker.sticker.imageUrl}
                      alt={sticker.sticker.name}
                      className="w-full h-full object-contain p-0.5"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">
                      ⭐
                    </div>
                  )}
                  {/* レア度表示 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/30 py-px">
                    <span className="text-[6px] text-yellow-300 block text-center">
                      {'★'.repeat(rarity)}
                    </span>
                  </div>
                  {/* 選択マーク */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-pink-500 rounded-bl-lg flex items-center justify-center">
                      <span className="text-white text-[8px] font-bold">✓</span>
                    </div>
                  )}
                </button>
              </div>
            )
          })}

          {stickers.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-purple-200 text-[10px]">
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
// シール帳ビューワー（改良版）
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
  const containerRef = useRef<HTMLDivElement>(null)

  const handleFlip = useCallback((e: any) => {
    setCurrentPage(e.data)
  }, [])

  // ページめくりボタン
  const goToPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev()
  }, [])

  const goToNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext()
  }, [])

  // iPhone 12最適化サイズ (390px幅想定)
  const pageWidth = 140
  const pageHeight = 180

  return (
    <div className={`
      rounded-xl p-2
      ${isPartner ? 'bg-purple-100/90' : 'bg-pink-100/90'}
    `}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-1 px-1">
        <div className="flex items-center gap-1">
          <span className="text-sm">{isPartner ? '👤' : '😊'}</span>
          <span className="text-[10px] font-bold text-purple-700">{userName}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrev}
            disabled={currentPage === 0}
            className="w-6 h-6 rounded-full bg-white/80 text-purple-600 text-[10px] disabled:opacity-30 active:scale-95 transition-transform shadow-sm"
          >
            ◀
          </button>
          <span className="text-[9px] text-purple-500 min-w-[28px] text-center">
            {currentPage + 1}/{pages.length}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage >= pages.length - 1}
            className="w-6 h-6 rounded-full bg-white/80 text-purple-600 text-[10px] disabled:opacity-30 active:scale-95 transition-transform shadow-sm"
          >
            ▶
          </button>
        </div>
      </div>

      {/* シール帳 */}
      <div
        ref={containerRef}
        className="flex justify-center"
        style={{ touchAction: 'pan-y' }}
      >
        <div
          className="relative bg-white rounded-lg shadow-md overflow-hidden"
          style={{
            width: pageWidth * 2,
            height: pageHeight,
          }}
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
            mobileScrollSupport={false}
            onFlip={handleFlip}
            className="trade-book"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={300}
            usePortrait={false}
            startZIndex={0}
            autoSize={false}
            maxShadowOpacity={0.2}
            showPageCorners={true}
            disableFlipByClick={false}
            swipeDistance={20}
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

      {/* 選択数 */}
      <div className="mt-1 text-center">
        <span className={`text-[10px] font-medium ${isPartner ? 'text-purple-600' : 'text-pink-600'}`}>
          {isPartner ? '🎯 ほしい' : '🎁 あげる'}: {selectedStickers.length}/{maxSelections}
        </span>
      </div>
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
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl"
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
            {['✨', '⭐', '💫', '🌟'][i % 4]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-full max-w-xs"
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
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 mb-4">
          <p className="text-white/80 text-xs text-center mb-2">もらったシール</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {receivedStickers.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 + i * 0.1 }}
                className="w-12 h-12 rounded-lg bg-white/30 overflow-hidden border-2 border-white/50"
              >
                {s.sticker.imageUrl ? (
                  <img src={s.sticker.imageUrl} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-2xl flex items-center justify-center h-full">⭐</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 相手プロフィール */}
        <div className="bg-white rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl border-2 border-purple-300">
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
            <p className="text-xs text-purple-600 mb-3 bg-purple-50 rounded-lg p-2">
              {partner.bio}
            </p>
          )}

          <div className="flex gap-2 text-center mb-3">
            <div className="flex-1 bg-purple-50 rounded-lg py-2">
              <p className="text-lg font-bold text-purple-700">{partner.totalStickers || 0}</p>
              <p className="text-[9px] text-purple-500">シール</p>
            </div>
            <div className="flex-1 bg-pink-50 rounded-lg py-2">
              <p className="text-lg font-bold text-pink-700">{partner.totalTrades || 0}</p>
              <p className="text-[9px] text-pink-500">交換</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onFollow}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all
                ${isFollowing
                  ? 'bg-gray-200 text-gray-600'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'}`}
            >
              {isFollowing ? 'フォロー中' : '🤝 フォローする'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-gray-100 text-gray-600"
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

  const myWants = useMemo(() =>
    myWantIds.map((id) => getStickerFromPages(partnerPages, id)).filter(Boolean) as PlacedSticker[],
    [myWantIds, partnerPages, getStickerFromPages]
  )

  const myOffers = useMemo(() =>
    myOfferIds.map((id) => getStickerFromPages(myPages, id)).filter(Boolean) as PlacedSticker[],
    [myOfferIds, myPages, getStickerFromPages]
  )

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
        id: `msg-${Date.now()}-${Math.random()}`,
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
      if (Math.random() > 0.65 && messages.length < 20) {
        const types: StampType[] = ['please', 'thinking', 'cute', 'ok', 'this', 'great']
        addMessage('stamp', types[Math.floor(Math.random() * types.length)], partnerUser.id)
      }
    }, 3500)
    return () => clearInterval(interval)
  }, [addMessage, partnerUser.id, messages.length])

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

  const canConfirm = myWantIds.length > 0 && myOfferIds.length > 0

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-b from-purple-100 via-pink-50 to-purple-100 flex flex-col"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* ヘッダー（コンパクト） */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm px-3 py-1.5 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="text-purple-600 text-xs font-medium px-2 py-1"
        >
          ✕ やめる
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
            {partnerUser.avatarUrl ? (
              <img src={partnerUser.avatarUrl} className="w-full h-full" />
            ) : (
              <span className="text-xs">👤</span>
            )}
          </div>
          <span className="text-purple-700 font-bold text-sm">{partnerUser.name}</span>
          {partnerConfirmed && (
            <span className="px-1.5 py-0.5 bg-green-500 text-white text-[8px] rounded-full font-bold">
              OK!
            </span>
          )}
        </div>
        <div className="w-16" />
      </div>

      {/* メインコンテンツ（スクロール可能） */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {/* 希望シール枠 + 交換OKボタン */}
        <CompactWishlist
          myWants={myWants}
          partnerWants={myOffers}
          onRemoveMyWant={(id) => setMyWantIds((prev) => prev.filter((i) => i !== id))}
          myConfirmed={myConfirmed}
          partnerConfirmed={partnerConfirmed}
          canConfirm={canConfirm}
          onConfirm={handleConfirm}
        />

        {/* LINE風チャットエリア */}
        <ChatArea
          messages={messages}
          myUserId={myUser.id}
          partnerName={partnerUser.name}
        />

        {/* スタンプ・定型文パネル */}
        <MessagePanel
          onSendStamp={handleSendStamp}
          onSendPreset={handleSendPreset}
        />

        {/* タブ切り替え */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('partner')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'partner'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-white/80 text-purple-600'
            }`}
          >
            👤 {partnerUser.name}のシール帳
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'my'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white/80 text-pink-600'
            }`}
          >
            😊 わたしのシール帳
          </button>
        </div>

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

        {/* 下部余白 */}
        <div className="h-4" />
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
