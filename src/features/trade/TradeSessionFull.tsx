'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import type { PlacedSticker } from '../sticker-book/StickerPlacement'
import type { BookPage, PageTheme } from '../sticker-book/BookView'
import { getCoverDesignById, type CoverDesign } from '@/domain/theme'

// react-pageflip用のスタイルをインポート
import '../sticker-book/book.css'

// Dynamic import for SSR compatibility (BookViewと同じパターン)
const HTMLFlipBook = dynamic(() => import('react-pageflip').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-purple-400 text-xs">
      読み込み中...
    </div>
  )
})

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
  type: 'stamp' | 'preset' | 'text'
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
  myCoverDesignId?: string     // 自分のシール帳のカバーデザインID
  partnerCoverDesignId?: string // 相手のシール帳のカバーデザインID
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
  const isStamp = message.type === 'stamp'
  const content = isStamp
    ? STAMPS[message.content as StampType]?.emoji || message.content
    : message.content

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
          rounded-2xl max-w-[80%] break-words
          ${isMe
            ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-br-sm'
            : 'bg-white text-purple-800 rounded-bl-sm shadow-sm border border-purple-100'}
        `}
      >
        {content}
        {isStamp && (
          <span className="text-[10px] block text-center opacity-70">
            {STAMPS[message.content as StampType]?.label}
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================
// LINE風チャットエリア（拡大版）
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
      className="h-32 overflow-y-auto px-3 py-2 bg-gradient-to-b from-purple-50/90 to-pink-50/90 rounded-xl border border-purple-100"
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-purple-300 text-sm">
          💬 スタンプでやりとりしよう！
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
// LINE風チャットエリア（拡張可能版 - 残りスペースを埋める）
// ============================================
const ChatAreaExpanded: React.FC<{
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
      className="h-full overflow-y-auto px-3 py-2 bg-gradient-to-b from-purple-50/95 to-pink-50/95 rounded-xl border border-purple-100 shadow-inner"
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-purple-300">
          <span className="text-2xl mb-2">💬</span>
          <span className="text-sm">スタンプでやりとりしよう！</span>
        </div>
      ) : (
        <div className="space-y-1">
          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isMe={msg.senderId === myUserId}
              partnerName={partnerName}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// スタンプ・定型文・テキスト入力パネル（5秒クールダウン付き）
// ============================================
const MessagePanel: React.FC<{
  onSendStamp: (type: StampType) => void
  onSendPreset: (text: string) => void
  onSendText: (text: string) => void
  cooldownRemaining: number
}> = ({ onSendStamp, onSendPreset, onSendText, cooldownRemaining }) => {
  const [activeTab, setActiveTab] = useState<'stamps' | 'presets'>('stamps')
  const [textInput, setTextInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const isCooldown = cooldownRemaining > 0

  const handleSendText = () => {
    if (textInput.trim() && !isCooldown) {
      onSendText(textInput.trim())
      setTextInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendText()
    }
  }

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

      {/* スタンプ・定型文コンテンツ */}
      <div className="p-2 max-h-20 overflow-y-auto">
        {activeTab === 'stamps' ? (
          <div className="grid grid-cols-6 gap-1">
            {(Object.keys(STAMPS) as StampType[]).map((type) => (
              <motion.button
                key={type}
                whileTap={!isCooldown ? { scale: 0.85 } : {}}
                onClick={() => !isCooldown && onSendStamp(type)}
                disabled={isCooldown}
                className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center transition-colors ${
                  isCooldown
                    ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                    : 'bg-purple-50 hover:bg-purple-100'
                }`}
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
                onClick={() => !isCooldown && onSendPreset(text)}
                disabled={isCooldown}
                className={`px-2 py-1 rounded-full border text-[10px] whitespace-nowrap ${
                  isCooldown
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-50 border-purple-200 text-purple-600 active:bg-purple-100'
                }`}
              >
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* LINE風テキスト入力 */}
      <div className="px-2 pb-2 pt-1 border-t border-purple-100">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value.slice(0, 50))}
              onKeyDown={handleKeyDown}
              placeholder={isCooldown ? `${cooldownRemaining}秒後に送信可能` : 'メッセージを入力...'}
              disabled={isCooldown}
              maxLength={50}
              className={`w-full px-3 py-2 rounded-full text-xs border transition-all ${
                isCooldown
                  ? 'bg-gray-100 border-gray-200 text-gray-400'
                  : 'bg-purple-50 border-purple-200 text-purple-800 focus:border-purple-400 focus:ring-1 focus:ring-purple-200'
              }`}
            />
            {textInput.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-purple-400">
                {textInput.length}/50
              </span>
            )}
          </div>
          <motion.button
            whileTap={!isCooldown && textInput.trim() ? { scale: 0.9 } : {}}
            onClick={handleSendText}
            disabled={isCooldown || !textInput.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              isCooldown || !textInput.trim()
                ? 'bg-gray-200 text-gray-400'
                : 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-md'
            }`}
          >
            {isCooldown ? (
              <span className="text-xs font-bold">{cooldownRemaining}</span>
            ) : (
              <span className="text-lg">↑</span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 希望シール枠（全シール表示・レート警告付き）
// ============================================
const CompactWishlist: React.FC<{
  myWants: PlacedSticker[]
  partnerWants: PlacedSticker[]
  onRemoveMyWant: (id: string) => void
  onRemovePartnerWant: (id: string) => void
  myConfirmed: boolean
  partnerConfirmed: boolean
  canConfirm: boolean
  onConfirm: () => void
}> = ({ myWants, partnerWants, onRemoveMyWant, onRemovePartnerWant, myConfirmed, partnerConfirmed, canConfirm, onConfirm }) => {
  // レート計算（★の数 × 10pt）
  const myRate = myWants.reduce((sum, s) => sum + s.sticker.rarity * 10, 0)
  const partnerRate = partnerWants.reduce((sum, s) => sum + s.sticker.rarity * 10, 0)
  const rateDiff = partnerRate - myRate
  const isBalanced = Math.abs(rateDiff) <= 20
  const isLosingTrade = rateDiff > 20 // 自分が損する交換

  // 高レートシール（★4以上）があるかチェック
  const hasHighRarityOffer = partnerWants.some(s => s.sticker.rarity >= 4)

  return (
    <div className={`rounded-xl p-2 shadow-sm border ${
      isLosingTrade ? 'bg-red-50/95 border-red-200' : 'bg-white/95 border-purple-100'
    }`}>
      {/* 警告バナー（損する交換の場合） */}
      {isLosingTrade && (
        <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg mb-2 flex items-center justify-center gap-1">
          <span>⚠️</span>
          <span>あなたが {rateDiff}pt 多く渡す交換です！</span>
        </div>
      )}

      <div className="flex gap-2 items-stretch">
        {/* 希望シール（もらう） - 相手のシールをタップで追加 */}
        <div className="flex-1 bg-purple-50/80 rounded-lg p-1.5 min-h-[52px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-purple-500">👤→わたし</span>
            <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1 rounded">+{myRate}pt</span>
          </div>
          <div className="flex gap-1 flex-wrap max-h-[72px] overflow-y-auto">
            {myWants.length > 0 ? (
              myWants.map((s) => (
                <div key={s.id} className="relative group">
                  <div className={`w-8 h-8 rounded-md overflow-hidden border-2 bg-white ${
                    s.sticker.rarity >= 4 ? 'border-yellow-400' : 'border-purple-300'
                  }`}>
                    {s.sticker.imageUrl ? (
                      <img src={s.sticker.imageUrl} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs flex items-center justify-center h-full">⭐</span>
                    )}
                  </div>
                  <button
                    onClick={() => onRemoveMyWant(s.id)}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[7px] flex items-center justify-center shadow-sm"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <span className="text-[9px] text-purple-300">相手のシールをタップ</span>
            )}
          </div>
        </div>

        {/* 交換アイコン */}
        <div className="flex flex-col items-center justify-center">
          <div className={`text-xl ${isBalanced ? 'text-green-500' : isLosingTrade ? 'text-red-500' : 'text-orange-400'}`}>
            ⇄
          </div>
          {!isBalanced && (
            <span className={`text-[8px] font-bold ${isLosingTrade ? 'text-red-500' : 'text-orange-500'}`}>
              {isLosingTrade ? '損!' : '得!'}
            </span>
          )}
        </div>

        {/* 提供シール（あげる） - 相手が欲しがっている私のシール */}
        <div className={`flex-1 rounded-lg p-1.5 min-h-[52px] ${
          hasHighRarityOffer ? 'bg-red-100/80 border border-red-300' : 'bg-pink-50/80'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-pink-500">わたし→👤</span>
            <span className={`text-[10px] font-bold px-1 rounded ${
              partnerRate > myRate ? 'text-red-600 bg-red-100' : 'text-pink-600 bg-pink-100'
            }`}>-{partnerRate}pt</span>
          </div>
          <div className="flex gap-1 flex-wrap max-h-[72px] overflow-y-auto">
            {partnerWants.length > 0 ? (
              partnerWants.map((s) => (
                <div key={s.id} className="relative group">
                  <div className={`w-8 h-8 rounded-md overflow-hidden border-2 bg-white ${
                    s.sticker.rarity >= 4 ? 'border-red-400 ring-1 ring-red-300' : 'border-pink-300'
                  }`}>
                    {s.sticker.imageUrl ? (
                      <img src={s.sticker.imageUrl} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs flex items-center justify-center h-full">⭐</span>
                    )}
                  </div>
                  {/* 高レアシール警告マーク */}
                  {s.sticker.rarity >= 4 && (
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full text-white text-[6px] flex items-center justify-center shadow-sm animate-pulse">
                      !
                    </div>
                  )}
                  <button
                    onClick={() => onRemovePartnerWant(s.id)}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gray-500 rounded-full text-white text-[7px] flex items-center justify-center shadow-sm"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <span className="text-[9px] text-pink-300">相手が選択中</span>
            )}
          </div>
        </div>

        {/* 交換OKボタン */}
        <motion.button
          onClick={onConfirm}
          disabled={!canConfirm || myConfirmed}
          whileTap={canConfirm && !myConfirmed ? { scale: 0.95 } : {}}
          className={`
            w-14 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all
            ${myConfirmed
              ? 'bg-green-500 text-white'
              : !canConfirm
                ? 'bg-gray-200 text-gray-400'
                : isLosingTrade
                  ? 'bg-gradient-to-b from-orange-400 to-red-500 text-white shadow-lg'
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
      <div className="flex justify-center items-center gap-2 mt-1.5">
        <div className={`flex items-center gap-1 text-[10px] ${myConfirmed ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{myConfirmed ? '✓' : '○'}</span>
          <span>わたし</span>
        </div>
        <div className={`flex items-center gap-1 text-[10px] ${partnerConfirmed ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{partnerConfirmed ? '✓' : '○'}</span>
          <span>相手</span>
        </div>
      </div>

      {/* 高レアシール警告 */}
      {hasHighRarityOffer && !myConfirmed && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 bg-yellow-100 border border-yellow-400 rounded-lg px-2 py-1 text-[10px] text-yellow-800 text-center"
        >
          ⚠️ <strong>★4以上のレアシール</strong>をあげようとしています。本当に交換しますか？
        </motion.div>
      )}
    </div>
  )
}

// ============================================
// シール帳ページコンポーネント（修正版 - シール位置修正）
// ============================================
const TradeBookPageComponent = React.forwardRef<
  HTMLDivElement,
  {
    page: TradeBookPageFull
    selectedStickers: string[]
    onStickerSelect: (stickerId: string) => void
    maxSelections: number
    disabled?: boolean
    coverDesign?: CoverDesign  // カバーデザイン
  }
>(({ page, selectedStickers, onStickerSelect, maxSelections, disabled, coverDesign }, ref) => {
  const canSelectMore = selectedStickers.length < maxSelections
  const stickers = page.stickers || []

  // ページ背景（ユーザーテーマを反映）
  const getPageBackground = (theme?: PageTheme) => {
    if (!theme?.backgroundColor) return 'from-pink-50 to-purple-50'
    return theme.backgroundColor
  }

  // 表紙背景（ユーザーテーマを反映）
  const getCoverBackground = (theme?: PageTheme) => {
    if (theme?.backgroundColor) {
      return `bg-gradient-to-br ${theme.backgroundColor}`
    }
    return 'bg-gradient-to-br from-purple-400 to-pink-400'
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
      className="w-full h-full overflow-hidden relative"
      style={{
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.03)',
      }}
    >
      {page.type === 'cover' ? (
        // 表紙 - カバーデザイン画像を使用
        coverDesign?.coverImage ? (
          <div className="w-full h-full relative overflow-hidden rounded-r-lg">
            <img
              src={coverDesign.coverImage}
              alt="表紙"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          // カバーデザインがない場合のデフォルト表紙
          <div className={`w-full h-full flex flex-col items-center justify-center ${getCoverBackground(page.theme)}`}>
            {page.theme?.pattern && (
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: page.theme.pattern }}
              />
            )}
            <div className="text-4xl mb-2 drop-shadow-lg">📘</div>
            <p className="text-white font-bold text-sm drop-shadow-lg">シール帳</p>
          </div>
        )
      ) : page.type === 'back-cover' ? (
        // 裏表紙 - カバーデザイン画像を使用
        coverDesign?.backCoverImage ? (
          <div className="w-full h-full relative overflow-hidden rounded-l-lg">
            <img
              src={coverDesign.backCoverImage}
              alt="裏表紙"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          // カバーデザインがない場合のデフォルト裏表紙
          <div className={`w-full h-full flex flex-col items-center justify-center ${getCoverBackground(page.theme)} opacity-90`}>
            <div className="text-3xl mb-2">📕</div>
            <p className="text-white/80 text-xs">おわり</p>
          </div>
        )
      ) : (
        // 通常ページ - シール配置エリアは padding なしで全面使用
        <div className={`w-full h-full relative bg-gradient-to-br ${getPageBackground(page.theme)}`}>
          {/* ページ背景パターン */}
          {page.theme?.pattern && (
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: page.theme.pattern }}
            />
          )}

          {/* ページ番号 */}
          {page.pageNumber && (
            <div className="absolute top-1 right-1 text-[8px] text-purple-400 bg-white/70 px-1.5 py-0.5 rounded z-20">
              {page.pageNumber}
            </div>
          )}

          {/* シール配置エリア - 100%の領域を使用 */}
          <div className="absolute inset-0">
            {stickers.map((sticker) => {
              const isSelected = selectedStickers.includes(sticker.id)
              // シールサイズを大きくして見やすく
              const size = Math.min(52, 48 * sticker.scale)
              const rarity = sticker.sticker.rarity

              return (
                <div
                  key={sticker.id}
                  className="absolute"
                  style={{
                    // シールの中心を基準に配置（padding なしの全領域に対して）
                    left: `${sticker.x * 100}%`,
                    top: `${sticker.y * 100}%`,
                    width: size,
                    height: size,
                    transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
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
                      <div className="w-full h-full flex items-center justify-center text-xl">
                        ⭐
                      </div>
                    )}
                    {/* レア度表示 */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 py-0.5">
                      <span className="text-[7px] text-yellow-300 block text-center font-bold">
                        {'★'.repeat(rarity)}
                      </span>
                    </div>
                    {/* 選択マーク */}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-5 h-5 bg-pink-500 rounded-bl-lg flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">✓</span>
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

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
// 拡大表示用クリーンページコンポーネント（ホームタブと同じ表示）
// ============================================
const CleanPageComponent = React.forwardRef<
  HTMLDivElement,
  {
    page: TradeBookPageFull
    coverDesign?: CoverDesign
    pageWidth: number
    pageHeight: number
  }
>(({ page, coverDesign, pageWidth, pageHeight }, ref) => {
  const stickers = page.stickers || []

  // ページ背景（ユーザーテーマを反映）
  const getPageBackground = (theme?: PageTheme) => {
    if (!theme?.backgroundColor) return 'from-pink-50 to-purple-50'
    return theme.backgroundColor
  }

  // 表紙背景（ユーザーテーマを反映）
  const getCoverBackground = (theme?: PageTheme) => {
    if (theme?.backgroundColor) {
      return `bg-gradient-to-br ${theme.backgroundColor}`
    }
    return 'bg-gradient-to-br from-purple-400 to-pink-400'
  }

  return (
    <div
      ref={ref}
      className="overflow-hidden relative"
      style={{
        width: pageWidth,
        height: pageHeight,
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.03)',
      }}
    >
      {page.type === 'cover' ? (
        // 表紙 - カバーデザイン画像を使用
        coverDesign?.coverImage ? (
          <div
            className="relative overflow-hidden rounded-r-lg"
            style={{ width: pageWidth, height: pageHeight }}
          >
            <img
              src={coverDesign.coverImage}
              alt="表紙"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          // カバーデザインがない場合のデフォルト表紙
          <div
            className={`flex flex-col items-center justify-center ${getCoverBackground(page.theme)}`}
            style={{ width: pageWidth, height: pageHeight }}
          >
            {page.theme?.pattern && (
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: page.theme.pattern }}
              />
            )}
            <div className="text-4xl mb-2 drop-shadow-lg">📘</div>
            <p className="text-white font-bold text-sm drop-shadow-lg">シール帳</p>
          </div>
        )
      ) : page.type === 'back-cover' ? (
        // 裏表紙 - カバーデザイン画像を使用
        coverDesign?.backCoverImage ? (
          <div
            className="relative overflow-hidden rounded-l-lg"
            style={{ width: pageWidth, height: pageHeight }}
          >
            <img
              src={coverDesign.backCoverImage}
              alt="裏表紙"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          // カバーデザインがない場合のデフォルト裏表紙
          <div
            className={`flex flex-col items-center justify-center ${getCoverBackground(page.theme)} opacity-90`}
            style={{ width: pageWidth, height: pageHeight }}
          >
            <div className="text-3xl mb-2">📕</div>
            <p className="text-white/80 text-xs">おわり</p>
          </div>
        )
      ) : (
        // 通常ページ - ホームタブと同じクリーン表示
        <div
          className={`relative bg-gradient-to-br ${getPageBackground(page.theme)}`}
          style={{ width: pageWidth, height: pageHeight }}
        >
          {/* ページ背景パターン */}
          {page.theme?.pattern && (
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: page.theme.pattern }}
            />
          )}

          {/* ページ番号 */}
          {page.pageNumber && (
            <div className="absolute top-1 right-1 text-[8px] text-purple-400 bg-white/70 px-1.5 py-0.5 rounded z-20">
              {page.pageNumber}
            </div>
          )}

          {/* シール配置 - ホームタブと同じスタイル（選択UIなし） */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 40 }}>
            {stickers.map((sticker) => {
              // ホームタブと同じサイズ計算: 60 * scale
              const stickerSize = 60 * sticker.scale
              const x = sticker.x * 100
              const y = sticker.y * 100

              return (
                <div
                  key={sticker.id}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${stickerSize}px`,
                    height: `${stickerSize}px`,
                    zIndex: sticker.zIndex ?? 0,
                    transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                  }}
                >
                  {sticker.sticker.imageUrl ? (
                    <img
                      src={sticker.sticker.imageUrl}
                      alt={sticker.sticker.name}
                      className="w-full h-full object-contain drop-shadow-md"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      ⭐
                    </div>
                  )}
                </div>
              )
            })}
          </div>

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

CleanPageComponent.displayName = 'CleanPageComponent'

// ============================================
// 選択可能なページコンポーネント（グロー効果付き）
// ============================================
const SelectablePageComponent = React.forwardRef<
  HTMLDivElement,
  {
    page: TradeBookPageFull
    coverDesign?: CoverDesign
    pageWidth: number
    pageHeight: number
    selectedStickers: string[]
    onStickerSelect: (stickerId: string) => void
  }
>(({ page, coverDesign, pageWidth, pageHeight, selectedStickers, onStickerSelect }, ref) => {
  const stickers = page.stickers || []

  // ページ背景（ユーザーテーマを反映）
  const getPageBackground = (theme?: PageTheme) => {
    if (!theme?.backgroundColor) return 'from-pink-50 to-purple-50'
    return theme.backgroundColor
  }

  // 表紙背景（ユーザーテーマを反映）
  const getCoverBackground = (theme?: PageTheme) => {
    if (theme?.backgroundColor) {
      return `bg-gradient-to-br ${theme.backgroundColor}`
    }
    return 'bg-gradient-to-br from-purple-400 to-pink-400'
  }

  return (
    <div
      ref={ref}
      className="overflow-hidden relative"
      style={{
        width: pageWidth,
        height: pageHeight,
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.03)',
      }}
    >
      {page.type === 'cover' ? (
        // 表紙
        coverDesign?.coverImage ? (
          <div
            className="relative overflow-hidden rounded-r-lg"
            style={{ width: pageWidth, height: pageHeight }}
          >
            <img
              src={coverDesign.coverImage}
              alt="表紙"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center ${getCoverBackground(page.theme)}`}
            style={{ width: pageWidth, height: pageHeight }}
          >
            {page.theme?.pattern && (
              <div
                className="absolute inset-0 opacity-20"
                style={{ backgroundImage: page.theme.pattern }}
              />
            )}
            <div className="text-4xl mb-2 drop-shadow-lg">📘</div>
            <p className="text-white font-bold text-sm drop-shadow-lg">シール帳</p>
          </div>
        )
      ) : page.type === 'back-cover' ? (
        // 裏表紙
        coverDesign?.backCoverImage ? (
          <div
            className="relative overflow-hidden rounded-l-lg"
            style={{ width: pageWidth, height: pageHeight }}
          >
            <img
              src={coverDesign.backCoverImage}
              alt="裏表紙"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center ${getCoverBackground(page.theme)} opacity-90`}
            style={{ width: pageWidth, height: pageHeight }}
          >
            <div className="text-3xl mb-2">📕</div>
            <p className="text-white/80 text-xs">おわり</p>
          </div>
        )
      ) : (
        // 通常ページ - 選択可能なシール表示
        <div
          className={`relative bg-gradient-to-br ${getPageBackground(page.theme)}`}
          style={{ width: pageWidth, height: pageHeight }}
        >
          {/* ページ背景パターン */}
          {page.theme?.pattern && (
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: page.theme.pattern }}
            />
          )}

          {/* ページ番号 */}
          {page.pageNumber && (
            <div className="absolute top-1 right-1 text-[8px] text-purple-400 bg-white/70 px-1.5 py-0.5 rounded z-20">
              {page.pageNumber}
            </div>
          )}

          {/* シール配置 - タップ可能 */}
          <div className="absolute inset-0" style={{ zIndex: 40 }}>
            {stickers.map((sticker) => {
              const stickerSize = 60 * sticker.scale
              const x = sticker.x * 100
              const y = sticker.y * 100
              const isSelected = selectedStickers.includes(sticker.id)

              return (
                <button
                  key={sticker.id}
                  className="absolute p-0 border-0 bg-transparent cursor-pointer"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${stickerSize}px`,
                    height: `${stickerSize}px`,
                    zIndex: sticker.zIndex ?? 0,
                    transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onStickerSelect(sticker.id)
                  }}
                >
                  {sticker.sticker.imageUrl ? (
                    <img
                      src={sticker.sticker.imageUrl}
                      alt={sticker.sticker.name}
                      className="w-full h-full object-contain"
                      draggable={false}
                      style={{
                        filter: isSelected
                          ? 'drop-shadow(0 0 4px #ff69b4) drop-shadow(0 0 8px #ff1493) drop-shadow(0 0 12px #ff69b4)'
                          : 'drop-shadow(2px 2px 3px rgba(0,0,0,0.2))',
                        transition: 'filter 0.2s ease-out',
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-2xl"
                      style={{
                        filter: isSelected
                          ? 'drop-shadow(0 0 4px #ff69b4) drop-shadow(0 0 8px #ff1493)'
                          : 'none',
                      }}
                    >
                      ⭐
                    </div>
                  )}
                  {/* 選択時のチェックマーク */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

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

SelectablePageComponent.displayName = 'SelectablePageComponent'

// ============================================
// 拡大表示モーダル（シール選択可能・スワイプ対応）
// ============================================
const EnlargedBookModal: React.FC<{
  pages: TradeBookPageFull[]
  userName: string
  coverDesignId?: string
  selectedStickers: string[]
  onStickerSelect: (stickerId: string) => void
  maxSelections: number
  onClose: () => void
}> = ({ pages, userName, coverDesignId, selectedStickers, onStickerSelect, maxSelections, onClose }) => {
  const bookRef = useRef<any>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isDraggingSwipe, setIsDraggingSwipe] = useState(false)
  const [swipeStartX, setSwipeStartX] = useState(0)

  // カバーデザインを取得
  const coverDesign = coverDesignId ? getCoverDesignById(coverDesignId) : undefined

  const handleFlip = useCallback((e: any) => {
    setCurrentPage(e.data)
  }, [])

  // 少し大きめサイズ（横スクロールで対応）
  const pageWidth = 280
  const pageHeight = 420

  // 表紙・裏表紙表示中かどうか（単ページ表示）
  const isOnCover = currentPage === 0
  const isOnBackCover = currentPage === pages.length - 1
  const isSinglePageView = isOnCover || isOnBackCover

  // ページめくりボタン
  const goToPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev()
  }, [])

  const goToNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext()
  }, [])

  // スワイプゾーン用のハンドラー
  const handleSwipeStart = useCallback((clientX: number) => {
    setIsDraggingSwipe(true)
    setSwipeStartX(clientX)
  }, [])

  const handleSwipeEnd = useCallback((clientX: number) => {
    if (!isDraggingSwipe) return
    setIsDraggingSwipe(false)

    const diffX = clientX - swipeStartX
    const threshold = 50

    if (diffX < -threshold) {
      goToNext()
    } else if (diffX > threshold) {
      goToPrev()
    }
  }, [isDraggingSwipe, swipeStartX, goToPrev, goToNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="flex flex-col items-center w-full"
        style={{ maxWidth: pageWidth * 2 + 32 }} // 見開き幅 + パディング
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー - 固定幅で位置を安定させる（画面に収まるよう調整） */}
        <div
          className="flex items-center justify-between mb-3 px-2"
          style={{ width: '100%', maxWidth: pageWidth * 2 }} // 見開き幅を最大に、画面に収まるよう調整
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            <span className="text-white font-bold text-sm">{userName}のシール帳</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 text-white text-lg flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 選択数表示 */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="px-3 py-1 bg-pink-500/90 text-white text-xs font-bold rounded-full shadow-lg">
            🎯 ほしい: {selectedStickers.length}/{maxSelections}
          </span>
        </div>

        {/* 横スクロールコンテナ - 画面幅を超える場合はスクロールで対応 */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden rounded-lg"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            touchAction: 'pan-x',
          }}
        >
          {/* 内部ラッパー - min-w-max で縮小を防ぎ、スクロール可能にする */}
          <div
            className="min-w-max flex justify-center"
            style={{
              paddingLeft: '16px',
              paddingRight: '16px',
              touchAction: 'pan-x',
            }}
          >
            {/* シール帳 - 固定サイズで配置 */}
            <div
              className="book-container enlarged-book-modal rounded-lg shadow-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50"
              style={{
                // 表紙・裏表紙時は1ページ幅、見開き時は2ページ幅
                width: isSinglePageView ? pageWidth : pageWidth * 2,
                // 明示的な高さ（スワイプゾーン分を追加）
                height: pageHeight + 50,
                transition: 'width 0.3s ease-out',
                position: 'relative',
                flexShrink: 0,
              }}
            >
            {/* 内部コンテナ - 表紙表示時は右にシフトして表紙を中央に見せる */}
            <div
              style={{
                transform: isOnCover ? `translateX(-${pageWidth}px)` : 'translateX(0)',
                transition: 'transform 0.3s ease-out',
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
                maxWidth={pageWidth * 2}
                minHeight={pageHeight}
                maxHeight={pageHeight}
                showCover={true}
                mobileScrollSupport={false}
                onFlip={handleFlip}
                className="book-flip-container"
                startPage={0}
                drawShadow={true}
                flippingTime={400}
                usePortrait={false}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.3}
                showPageCorners={true}
                disableFlipByClick={true}
                swipeDistance={9999}
                clickEventForward={false}
                useMouseEvents={false}
                style={{}}
              >
                {pages.map((page) => (
                  <SelectablePageComponent
                    key={page.id}
                    page={page}
                    coverDesign={coverDesign}
                    pageWidth={pageWidth}
                    pageHeight={pageHeight}
                    selectedStickers={selectedStickers}
                    onStickerSelect={onStickerSelect}
                  />
                ))}
              </HTMLFlipBook>
            </div>

            {/* スワイプゾーン - ページめくり専用エリア */}
            <div
              className="swipe-zone absolute left-0 right-0 bottom-0 bg-gradient-to-t from-purple-200/50 to-transparent flex items-center justify-center"
              style={{
                height: 50,
                cursor: isDraggingSwipe ? 'grabbing' : 'grab',
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                handleSwipeStart(e.touches[0].clientX)
              }}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => {
                e.stopPropagation()
                handleSwipeEnd(e.changedTouches[0].clientX)
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                handleSwipeStart(e.clientX)
              }}
              onMouseUp={(e) => {
                e.stopPropagation()
                handleSwipeEnd(e.clientX)
              }}
              onMouseLeave={() => setIsDraggingSwipe(false)}
            >
              <div className="flex items-center gap-2 text-purple-600/70 text-xs font-medium">
                <span>◀</span>
                <span>← スワイプでページめくり →</span>
                <span>▶</span>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* ページナビゲーション */}
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={goToPrev}
            disabled={currentPage === 0}
            className="w-10 h-10 rounded-full bg-white/90 text-purple-600 disabled:opacity-30 active:scale-95 transition-transform shadow-md font-bold text-lg"
          >
            ◀
          </button>
          <span className="text-white font-medium min-w-[60px] text-center">
            {currentPage === 0 ? '表紙' : currentPage === pages.length - 1 ? '裏表紙' : `${currentPage}/${pages.length - 2}`}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage >= pages.length - 1}
            className="w-10 h-10 rounded-full bg-white/90 text-purple-600 disabled:opacity-30 active:scale-95 transition-transform shadow-md font-bold text-lg"
          >
            ▶
          </button>
        </div>

        {/* 説明テキスト */}
        <p className="text-white/60 text-xs mt-3">シールをタップで選択 • 横スクロールで全体を見る • 下のエリアでページめくり</p>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// 自分のシール帳用拡大モーダル（相手が選択中のシールを光らせる）
// ============================================
const MyBookEnlargedModal: React.FC<{
  pages: TradeBookPageFull[]
  coverDesignId?: string
  selectedStickers: string[]  // 自分が選択中（あげるシール）
  partnerSelectedStickers: string[]  // 相手が選択中（相手が欲しがっているシール）
  onStickerSelect: (stickerId: string) => void
  maxSelections: number
  onClose: () => void
}> = ({ pages, coverDesignId, selectedStickers, partnerSelectedStickers, onStickerSelect, maxSelections, onClose }) => {
  const bookRef = useRef<any>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isDraggingSwipe, setIsDraggingSwipe] = useState(false)
  const [swipeStartX, setSwipeStartX] = useState(0)

  // カバーデザインを取得
  const coverDesign = coverDesignId ? getCoverDesignById(coverDesignId) : undefined

  const handleFlip = useCallback((e: any) => {
    setCurrentPage(e.data)
  }, [])

  const pageWidth = 280
  const pageHeight = 420

  const isOnCover = currentPage === 0
  const isOnBackCover = currentPage === pages.length - 1
  const isSinglePageView = isOnCover || isOnBackCover

  const goToPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev()
  }, [])

  const goToNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext()
  }, [])

  // スワイプゾーンでのページめくり処理
  const handleSwipeStart = useCallback((clientX: number) => {
    setIsDraggingSwipe(true)
    setSwipeStartX(clientX)
  }, [])

  const handleSwipeEnd = useCallback((clientX: number) => {
    if (!isDraggingSwipe) return
    const diff = clientX - swipeStartX
    const threshold = 50
    if (diff > threshold) {
      goToPrev()
    } else if (diff < -threshold) {
      goToNext()
    }
    setIsDraggingSwipe(false)
  }, [isDraggingSwipe, swipeStartX, goToPrev, goToNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 flex flex-col items-center justify-start pt-8 pb-4 px-2"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="flex flex-col items-center w-full max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          className="flex items-center justify-between mb-2 px-2 w-full"
          style={{ maxWidth: 400 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">😊</span>
            <span className="text-white font-bold text-sm">わたしのシール帳</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 text-white text-lg flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 選択数表示 */}
        <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
          <span className="px-3 py-1 bg-pink-500/90 text-white text-xs font-bold rounded-full shadow-lg">
            🎁 あげる: {selectedStickers.length}/{maxSelections}
          </span>
          {partnerSelectedStickers.length > 0 && (
            <span className="px-3 py-1 bg-purple-500/90 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
              👤 相手がほしいシール: {partnerSelectedStickers.length}個
            </span>
          )}
        </div>

        {/* 横スクロール可能なシール帳エリア */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden rounded-lg"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            touchAction: 'pan-x',
          }}
        >
          {/* 内部ラッパー - min-w-max で縮小を防ぎ、スクロール可能にする */}
          <div
            className="min-w-max flex justify-center"
            style={{
              paddingLeft: '16px',
              paddingRight: '16px',
              touchAction: 'pan-x',
            }}
          >
            {/* シール帳コンテナ（固定幅で中央配置） */}
            <div
              className="book-container enlarged-book-modal rounded-lg shadow-2xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50"
              style={{
                width: isSinglePageView ? pageWidth : pageWidth * 2,
                height: pageHeight,
                overflow: 'visible',
                transition: 'width 0.3s ease-out',
                position: 'relative',
                flexShrink: 0,
              }}
            >
            <div
              style={{
                transform: isOnCover ? `translateX(-${pageWidth}px)` : 'translateX(0)',
                transition: 'transform 0.3s ease-out',
                width: pageWidth * 2,
                height: pageHeight - 50, // スワイプゾーン分の高さを確保
              }}
            >
              <HTMLFlipBook
                ref={bookRef}
                width={pageWidth}
                height={pageHeight - 50}
                size="fixed"
                minWidth={pageWidth}
                maxWidth={pageWidth * 2}
                minHeight={pageHeight - 50}
                maxHeight={pageHeight - 50}
                showCover={true}
                mobileScrollSupport={false}
                onFlip={handleFlip}
                className="book-flip-container"
                startPage={0}
                drawShadow={true}
                flippingTime={400}
                usePortrait={false}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.3}
                showPageCorners={true}
                disableFlipByClick={true}
                swipeDistance={9999}
                clickEventForward={false}
                useMouseEvents={false}
                style={{}}
              >
                {pages.map((page) => (
                  <MyBookSelectablePage
                    key={page.id}
                    page={page}
                    coverDesign={coverDesign}
                    pageWidth={pageWidth}
                    pageHeight={pageHeight - 50}
                    selectedStickers={selectedStickers}
                    partnerSelectedStickers={partnerSelectedStickers}
                    onStickerSelect={onStickerSelect}
                  />
                ))}
              </HTMLFlipBook>
            </div>

            {/* スワイプゾーン - ページめくり専用エリア */}
            <div
              className="swipe-zone absolute left-0 right-0 bottom-0 bg-gradient-to-t from-purple-300/50 to-transparent"
              style={{ height: 50 }}
              onTouchStart={(e) => handleSwipeStart(e.touches[0].clientX)}
              onTouchEnd={(e) => handleSwipeEnd(e.changedTouches[0].clientX)}
              onMouseDown={(e) => handleSwipeStart(e.clientX)}
              onMouseUp={(e) => handleSwipeEnd(e.clientX)}
              onMouseLeave={() => setIsDraggingSwipe(false)}
            >
              <div className="flex items-center justify-center h-full gap-2">
                <span className="text-purple-700/60 text-xs">◀</span>
                <span className="text-purple-700/70 text-xs font-medium">← スワイプでページめくり →</span>
                <span className="text-purple-700/60 text-xs">▶</span>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* ページナビゲーション */}
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={goToPrev}
            disabled={currentPage === 0}
            className="w-10 h-10 rounded-full bg-white/90 text-purple-600 disabled:opacity-30 active:scale-95 transition-transform shadow-md font-bold text-lg"
          >
            ◀
          </button>
          <span className="text-white font-medium min-w-[60px] text-center">
            {currentPage === 0 ? '表紙' : currentPage === pages.length - 1 ? '裏表紙' : `${currentPage}/${pages.length - 2}`}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage >= pages.length - 1}
            className="w-10 h-10 rounded-full bg-white/90 text-purple-600 disabled:opacity-30 active:scale-95 transition-transform shadow-md font-bold text-lg"
          >
            ▶
          </button>
        </div>

        <p className="text-white/60 text-xs mt-2">
          💜光っているシール = 相手がほしがっているシール
        </p>
        <p className="text-white/40 text-[10px] mt-1">
          ↕️ 上側を横スクロールで全体表示 ↔️ 下側スワイプでページめくり
        </p>
      </motion.div>
    </motion.div>
  )
}

// ============================================
// 自分のシール帳用ページ（相手が選択中のシールを光らせる）
// ============================================
const MyBookSelectablePage = React.forwardRef<
  HTMLDivElement,
  {
    page: TradeBookPageFull
    coverDesign?: CoverDesign
    pageWidth: number
    pageHeight: number
    selectedStickers: string[]
    partnerSelectedStickers: string[]
    onStickerSelect: (stickerId: string) => void
  }
>(({ page, coverDesign, pageWidth, pageHeight, selectedStickers, partnerSelectedStickers, onStickerSelect }, ref) => {
  const stickers = page.stickers || []

  const getPageBackground = (theme?: PageTheme) => {
    if (!theme?.backgroundColor) return 'from-pink-50 to-purple-50'
    return theme.backgroundColor
  }

  const getCoverBackground = (theme?: PageTheme) => {
    if (theme?.backgroundColor) {
      return `bg-gradient-to-br ${theme.backgroundColor}`
    }
    return 'bg-gradient-to-br from-purple-400 to-pink-400'
  }

  return (
    <div
      ref={ref}
      className="overflow-hidden relative"
      style={{
        width: pageWidth,
        height: pageHeight,
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.03)',
      }}
    >
      {page.type === 'cover' ? (
        coverDesign?.coverImage ? (
          <div
            className="relative overflow-hidden rounded-r-lg"
            style={{ width: pageWidth, height: pageHeight }}
          >
            <img
              src={coverDesign.coverImage}
              alt="表紙"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center ${getCoverBackground(page.theme)}`}
            style={{ width: pageWidth, height: pageHeight }}
          >
            <div className="text-4xl mb-2 drop-shadow-lg">📘</div>
            <p className="text-white font-bold text-sm drop-shadow-lg">シール帳</p>
          </div>
        )
      ) : page.type === 'back-cover' ? (
        coverDesign?.backCoverImage ? (
          <div
            className="relative overflow-hidden rounded-l-lg"
            style={{ width: pageWidth, height: pageHeight }}
          >
            <img
              src={coverDesign.backCoverImage}
              alt="裏表紙"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center ${getCoverBackground(page.theme)} opacity-90`}
            style={{ width: pageWidth, height: pageHeight }}
          >
            <div className="text-3xl mb-2">📕</div>
            <p className="text-white/80 text-xs">おわり</p>
          </div>
        )
      ) : (
        <div
          className={`relative bg-gradient-to-br ${getPageBackground(page.theme)}`}
          style={{ width: pageWidth, height: pageHeight }}
        >
          {page.theme?.pattern && (
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: page.theme.pattern }}
            />
          )}

          {page.pageNumber && (
            <div className="absolute top-1 right-1 text-[8px] text-purple-400 bg-white/70 px-1.5 py-0.5 rounded z-20">
              {page.pageNumber}
            </div>
          )}

          {/* シール配置 */}
          <div className="absolute inset-0" style={{ zIndex: 40 }}>
            {stickers.map((sticker) => {
              const stickerSize = 60 * sticker.scale
              const x = sticker.x * 100
              const y = sticker.y * 100
              const isSelected = selectedStickers.includes(sticker.id)
              const isWantedByPartner = partnerSelectedStickers.includes(sticker.id)

              return (
                <button
                  key={sticker.id}
                  className="absolute p-0 border-0 bg-transparent cursor-pointer"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: `${stickerSize}px`,
                    height: `${stickerSize}px`,
                    zIndex: sticker.zIndex ?? 0,
                    transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onStickerSelect(sticker.id)
                  }}
                >
                  {sticker.sticker.imageUrl ? (
                    <img
                      src={sticker.sticker.imageUrl}
                      alt={sticker.sticker.name}
                      className={`w-full h-full object-contain ${isWantedByPartner ? 'animate-pulse' : ''}`}
                      draggable={false}
                      style={{
                        filter: isWantedByPartner
                          ? 'drop-shadow(0 0 6px #a855f7) drop-shadow(0 0 12px #9333ea) drop-shadow(0 0 18px #a855f7)'
                          : isSelected
                            ? 'drop-shadow(0 0 4px #ff69b4) drop-shadow(0 0 8px #ff1493)'
                            : 'drop-shadow(2px 2px 3px rgba(0,0,0,0.2))',
                        transition: 'filter 0.2s ease-out',
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-2xl"
                      style={{
                        filter: isWantedByPartner
                          ? 'drop-shadow(0 0 6px #a855f7) drop-shadow(0 0 12px #9333ea)'
                          : isSelected
                            ? 'drop-shadow(0 0 4px #ff69b4)'
                            : 'none',
                      }}
                    >
                      ⭐
                    </div>
                  )}
                  {/* 相手が欲しがっているマーク */}
                  {isWantedByPartner && (
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <span className="text-white text-xs">👤</span>
                    </div>
                  )}
                  {/* 自分が選択中のマーク */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

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

MyBookSelectablePage.displayName = 'MyBookSelectablePage'

// ============================================
// シール帳ビューワー（位置修正版）
// ============================================
const TradeBookViewer: React.FC<{
  pages: TradeBookPageFull[]
  userName: string
  isPartner: boolean
  selectedStickers: string[]
  onStickerSelect: (stickerId: string) => void
  maxSelections: number
  coverDesignId?: string  // カバーデザインID
  onEnlarge?: () => void  // 拡大ボタンのコールバック
}> = ({ pages, userName, isPartner, selectedStickers, onStickerSelect, maxSelections, coverDesignId, onEnlarge }) => {
  const bookRef = useRef<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // カバーデザインを取得
  const coverDesign = coverDesignId ? getCoverDesignById(coverDesignId) : undefined

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

  // シール帳サイズ (iPhone 12: 390px幅想定)
  const pageWidth = 160
  const pageHeight = 200

  // 表紙・裏表紙表示中かどうか（単ページ表示）
  const isSinglePageView = currentPage === 0 || currentPage === pages.length - 1

  return (
    <div className={`
      rounded-xl p-2
      ${isPartner ? 'bg-purple-100/90' : 'bg-pink-100/90'}
    `}>
      {/* ヘッダー（コンパクト） */}
      <div className="flex items-center justify-between mb-1.5 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{isPartner ? '👤' : '😊'}</span>
          <span className="text-xs font-bold text-purple-700">{userName}</span>
          {/* 拡大ボタン（相手のシール帳のみ表示） */}
          {isPartner && onEnlarge && (
            <button
              onClick={onEnlarge}
              className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center shadow-sm active:scale-95 transition-transform ml-1"
              title="拡大表示"
            >
              🔍
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={goToPrev}
            disabled={currentPage === 0}
            className="w-7 h-7 rounded-full bg-white/90 text-purple-600 text-xs disabled:opacity-30 active:scale-95 transition-transform shadow-sm font-bold"
          >
            ◀
          </button>
          <span className="text-xs text-purple-500 min-w-[32px] text-center font-medium">
            {currentPage === 0 ? '表紙' : currentPage === pages.length - 1 ? '裏' : `${currentPage}/${pages.length - 2}`}
          </span>
          <button
            onClick={goToNext}
            disabled={currentPage >= pages.length - 1}
            className="w-7 h-7 rounded-full bg-white/90 text-purple-600 text-xs disabled:opacity-30 active:scale-95 transition-transform shadow-sm font-bold"
          >
            ▶
          </button>
        </div>
      </div>

      {/* シール帳 - 中央配置 */}
      <div
        ref={containerRef}
        className="flex justify-center items-center"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <div
          className="trade-book-container relative rounded-lg shadow-lg overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50"
          style={{
            width: pageWidth * 2,
            height: pageHeight,
          }}
        >
          {/* HTMLFlipBookラッパー - BookViewと同じパターン */}
          <div
            style={{
              width: '100%',
              height: '100%',
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
            flippingTime={400}
            usePortrait={false}
            startZIndex={0}
            autoSize={false}
            maxShadowOpacity={0.3}
            showPageCorners={true}
            disableFlipByClick={false}
            swipeDistance={10}
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
                coverDesign={coverDesign}
              />
            ))}
          </HTMLFlipBook>
          </div>
        </div>
      </div>

      {/* 選択数（大きめ） */}
      <div className="mt-1.5 text-center">
        <span className={`text-xs font-bold ${isPartner ? 'text-purple-600' : 'text-pink-600'}`}>
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
  // クライアントサイドでのみレンダリング（SSR対応）
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 完全にインラインスタイルのみを使用（Tailwindクラスを排除）
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 999999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    background: 'linear-gradient(to bottom, rgba(88, 28, 135, 0.95), rgba(157, 23, 77, 0.95))',
    boxSizing: 'border-box',
    margin: 0,
    overflow: 'hidden',
  }

  const cardContainerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '320px',
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }

  const content = (
    <div id="post-trade-profile-screen" style={overlayStyle}>
      {/* キラキラエフェクト */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{ position: 'absolute', fontSize: '20px' }}
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
        style={cardContainerStyle}
      >
        {/* 成功メッセージ */}
        <div style={{ textAlign: 'center', marginBottom: '16px', width: '100%' }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: 3 }}
            style={{ fontSize: '48px', marginBottom: '8px' }}
          >
            🎉
          </motion.div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>こうかんせいりつ！</h2>
        </div>

        {/* もらったシール */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(4px)',
          borderRadius: '16px',
          padding: '12px',
          marginBottom: '16px',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', textAlign: 'center', marginBottom: '8px', margin: '0 0 8px 0' }}>もらったシール</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {receivedStickers.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 + i * 0.1 }}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.5)',
                }}
              >
                {s.sticker.imageUrl ? (
                  <img src={s.sticker.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>⭐</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 相手プロフィール */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#f3e8ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              border: '2px solid #d8b4fe',
              overflow: 'hidden',
            }}>
              {partner.avatarUrl ? (
                <img src={partner.avatarUrl} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: '#6b21a8', margin: 0 }}>{partner.name}</p>
              <p style={{ fontSize: '12px', color: '#a855f7', margin: 0 }}>Lv.{partner.level}</p>
            </div>
          </div>

          {partner.bio && (
            <p style={{ fontSize: '12px', color: '#7c3aed', marginBottom: '12px', backgroundColor: '#faf5ff', borderRadius: '8px', padding: '8px', margin: '0 0 12px 0' }}>
              {partner.bio}
            </p>
          )}

          <div style={{ display: 'flex', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
            <div style={{ flex: 1, backgroundColor: '#faf5ff', borderRadius: '8px', padding: '8px 0' }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#7c3aed', margin: 0 }}>{partner.totalStickers || 0}</p>
              <p style={{ fontSize: '9px', color: '#a855f7', margin: 0 }}>シール</p>
            </div>
            <div style={{ flex: 1, backgroundColor: '#fdf2f8', borderRadius: '8px', padding: '8px 0' }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#db2777', margin: 0 }}>{partner.totalTrades || 0}</p>
              <p style={{ fontSize: '9px', color: '#ec4899', margin: 0 }}>交換</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onFollow}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                ...(isFollowing
                  ? { backgroundColor: '#e5e7eb', color: '#4b5563' }
                  : { background: 'linear-gradient(to right, #a855f7, #ec4899)', color: 'white', boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)' }
                ),
              }}
            >
              {isFollowing ? 'フォロー中' : '🤝 フォローする'}
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              とじる
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )

  // マウント後にポータルでdocument.bodyに直接レンダリング
  if (!mounted) {
    return null
  }

  return createPortal(content, document.body)
}

// ============================================
// メインコンポーネント
// ============================================
export const TradeSessionFull: React.FC<TradeSessionFullProps> = ({
  myUser,
  partnerUser,
  myPages,
  partnerPages,
  myCoverDesignId,
  partnerCoverDesignId,
  onTradeComplete,
  onCancel,
  onFollowPartner,
}) => {
  // 選択状態
  const [myWantIds, setMyWantIds] = useState<string[]>([]) // 相手からほしい
  const [myOfferIds, setMyOfferIds] = useState<string[]>([]) // 自分があげる
  const [partnerWantFromMeIds, setPartnerWantFromMeIds] = useState<string[]>([]) // 相手が自分のシールから欲しがっているもの（デモ用）

  // 交渉状態
  const [messages, setMessages] = useState<TradeMessage[]>([])
  const [myConfirmed, setMyConfirmed] = useState(false)
  const [partnerConfirmed, setPartnerConfirmed] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showEnlargedBook, setShowEnlargedBook] = useState(false)  // 相手のシール帳拡大表示
  const [showMyEnlargedBook, setShowMyEnlargedBook] = useState(false)  // 自分のシール帳拡大表示
  const [cooldownRemaining, setCooldownRemaining] = useState(0)  // メッセージクールダウン（秒）

  const MAX_SELECTIONS = 5
  const COOLDOWN_SECONDS = 5

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

  // メッセージ送信（クールダウン開始）
  const addMessage = useCallback((type: 'stamp' | 'preset' | 'text', content: string, senderId: string) => {
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
    // 自分のメッセージの場合クールダウン開始
    if (senderId === myUser.id) {
      setCooldownRemaining(COOLDOWN_SECONDS)
    }
  }, [myUser.id])

  // クールダウンタイマー
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setTimeout(() => {
        setCooldownRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldownRemaining])

  const handleSendStamp = useCallback(
    (type: StampType) => addMessage('stamp', type, myUser.id),
    [addMessage, myUser.id]
  )

  const handleSendPreset = useCallback(
    (text: string) => addMessage('preset', text, myUser.id),
    [addMessage, myUser.id]
  )

  const handleSendText = useCallback(
    (text: string) => addMessage('text', text, myUser.id),
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

  // デモ: 相手が自分のシールをランダムに欲しがるシミュレーション
  useEffect(() => {
    // 初期化時に自分のシールからランダムに2〜3個を相手の欲しいものとして設定
    const allMyStickers: string[] = []
    myPages.forEach((page) => {
      page.stickers.forEach((s) => {
        allMyStickers.push(s.id)
      })
    })
    if (allMyStickers.length > 0) {
      const shuffled = [...allMyStickers].sort(() => Math.random() - 0.5)
      const count = Math.min(2 + Math.floor(Math.random() * 2), shuffled.length) // 2〜3個
      setPartnerWantFromMeIds(shuffled.slice(0, count))
    }
  }, [myPages])

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
      className="fixed inset-0 bg-gradient-to-b from-purple-100 via-pink-50 to-purple-100 flex flex-col"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif", zIndex: 9999 }}
    >
      {/* ヘッダー */}
      <div
        className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-500 px-3 flex items-center shadow-md"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top, 12px))', paddingBottom: '12px' }}
      >
        {/* 左側: 交換終了ボタン */}
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="flex items-center gap-1 text-white/90 text-xs font-medium px-2 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
        >
          <span>✕</span>
          <span>終了</span>
        </button>

        {/* 中央: 相手のプロフィール */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center overflow-hidden border-2 border-white/50">
            {partnerUser.avatarUrl ? (
              <img src={partnerUser.avatarUrl} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm">👤</span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-bold text-sm">{partnerUser.name}</span>
              {partnerConfirmed && (
                <span className="px-1.5 py-0.5 bg-green-400 text-white text-[8px] rounded-full font-bold animate-pulse shadow-sm">
                  OK!
                </span>
              )}
            </div>
            <span className="text-white/80 text-[10px]">Lv.{partnerUser.level}</span>
          </div>
        </div>

        {/* 右側: スペーサー（左ボタンとのバランス用） */}
        <div className="w-12" />
      </div>

      {/* メインコンテンツ - flex-1で残り領域を埋め、justify-endで下寄せ */}
      <div className="flex-1 overflow-y-auto px-2 py-1.5 flex flex-col">
        {/* 上部スペーサー（コンテンツを下寄せするため） */}
        <div className="flex-shrink-0 min-h-0" />

        {/* 希望シール枠 + 交換OKボタン */}
        <div className="flex-shrink-0 mb-1.5">
          <CompactWishlist
            myWants={myWants}
            partnerWants={myOffers}
            onRemoveMyWant={(id) => setMyWantIds((prev) => prev.filter((i) => i !== id))}
            onRemovePartnerWant={(id) => setMyOfferIds((prev) => prev.filter((i) => i !== id))}
            myConfirmed={myConfirmed}
            partnerConfirmed={partnerConfirmed}
            canConfirm={canConfirm}
            onConfirm={handleConfirm}
          />
        </div>

        {/* LINE風チャットエリア（flex-1で残りスペースを使う） */}
        <div className="flex-1 min-h-[100px] mb-1.5">
          <div className="h-full">
            <ChatAreaExpanded
              messages={messages}
              myUserId={myUser.id}
              partnerName={partnerUser.name}
            />
          </div>
        </div>

        {/* スタンプ・定型文・テキスト入力パネル（クールダウン付き） */}
        <div className="flex-shrink-0 mb-1.5">
          <MessagePanel
            onSendStamp={handleSendStamp}
            onSendPreset={handleSendPreset}
            onSendText={handleSendText}
            cooldownRemaining={cooldownRemaining}
          />
        </div>

        {/* シール帳を開くボタン（横並び） */}
        <div className="flex-shrink-0 flex gap-2 mb-1.5">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEnlargedBook(true)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-lg">📖</span>
            <span>{partnerUser.name}のシール帳</span>
            {myWantIds.length > 0 && (
              <span className="px-1.5 py-0.5 bg-white/30 rounded-full text-xs">
                {myWantIds.length}
              </span>
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMyEnlargedBook(true)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-lg">📕</span>
            <span>わたしのシール帳</span>
            {myOfferIds.length > 0 && (
              <span className="px-1.5 py-0.5 bg-white/30 rounded-full text-xs">
                {myOfferIds.length}
              </span>
            )}
          </motion.button>
        </div>

        {/* Safe area bottom padding */}
        <div className="flex-shrink-0 h-2 safe-area-bottom" />
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

      {/* 相手のシール帳 拡大表示モーダル */}
      <AnimatePresence>
        {showEnlargedBook && (
          <EnlargedBookModal
            pages={partnerPages}
            userName={partnerUser.name}
            coverDesignId={partnerCoverDesignId}
            selectedStickers={myWantIds}
            onStickerSelect={handleSelectPartnerSticker}
            maxSelections={MAX_SELECTIONS}
            onClose={() => setShowEnlargedBook(false)}
          />
        )}
      </AnimatePresence>

      {/* 自分のシール帳 拡大表示モーダル（相手が欲しがっているシールが光る） */}
      <AnimatePresence>
        {showMyEnlargedBook && (
          <MyBookEnlargedModal
            pages={myPages}
            coverDesignId={myCoverDesignId}
            selectedStickers={myOfferIds}
            partnerSelectedStickers={partnerWantFromMeIds}
            onStickerSelect={handleSelectMySticker}
            maxSelections={MAX_SELECTIONS}
            onClose={() => setShowMyEnlargedBook(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default TradeSessionFull
