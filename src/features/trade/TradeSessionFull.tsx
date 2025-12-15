'use client'

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import type { PlacedSticker } from '../sticker-book/StickerPlacement'
import type { BookPage, PageTheme } from '../sticker-book/BookView'
import { getCoverDesignById, type CoverDesign } from '@/domain/theme'
import { filterContent, isKidSafe, getFilterReason, FilterResult } from '@/utils/contentFilter'
import {
  UserIcon,
  StarIcon,
  SparkleIcon,
  CelebrationIcon,
  ChatIcon,
  GiftIcon,
  TargetIcon,
  WarningIcon,
  SmileIcon,
  SearchIcon,
  BookOpenPurpleIcon,
  BookOpenPinkIcon,
  StickerBookIcon,
  ArrowBothIcon,
  HandshakeIcon,
} from '@/components/icons/TradeIcons'

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

// 交換用スタンプ（子ども向けシール交換に最適化）- 絵文字は最大2個
const STAMPS: Record<StampType, { emoji: string; label: string }> = {
  please: { emoji: '🙏✨', label: 'おねがい！' },
  thinking: { emoji: '🤔💭', label: 'うーん...' },
  addMore: { emoji: '➕🌟', label: 'もっと！' },
  ok: { emoji: '🎉🤝', label: 'いいよ！' },
  thanks: { emoji: '💕', label: 'ありがとう！' },
  cute: { emoji: '🩷', label: 'かわいい～' },
  no: { emoji: '😢💦', label: 'ムリ...' },
  wait: { emoji: '⏳', label: 'まってね' },
  this: { emoji: '👀✨', label: 'これ！' },
  rare: { emoji: '🌟✨', label: 'レア！' },
  instead: { emoji: '🔄', label: 'かわりに？' },
  great: { emoji: '👍✨', label: 'オッケー！' },
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
// Supabaseから受け取るメッセージの型
interface SupabaseTradeMessage {
  id: string
  stamp_id: string | null
  user_id: string
  created_at: string
  message_type?: 'stamp' | 'text' | 'preset'
  content?: string | null
}

// Supabaseから受け取るシール選択の型
interface SupabaseTradeItem {
  id: string
  user_id: string
  user_sticker_id: string
  sticker_id?: string
}

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
  // Supabase連携用
  supabaseMessages?: SupabaseTradeMessage[]
  onSendStamp?: (stampId: string) => Promise<void>
  onSendText?: (content: string) => Promise<void>
  partnerReady?: boolean
  onSetReady?: () => Promise<void>
  tradeCompleted?: boolean     // Supabase経由で交換が完了したか
  // シール選択の同期用
  supabaseMyItems?: SupabaseTradeItem[]      // 自分が選択したシール（相手に渡すシール）
  supabasePartnerItems?: SupabaseTradeItem[] // 相手が選択したシール（自分が受け取るシール）
  onSelectMySticker?: (userStickerId: string) => Promise<void>
  onDeselectMySticker?: (itemId: string) => Promise<void>
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
        <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center mr-1 flex-shrink-0">
          <UserIcon size={16} color="#A855F7" />
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
        <div className="h-full flex items-center justify-center text-purple-300 text-sm gap-2">
          <ChatIcon size={20} color="#D8B4FE" />
          <span>スタンプでやりとりしよう！</span>
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
          <span className="mb-2"><ChatIcon size={32} color="#D8B4FE" /></span>
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
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null)
  const [showFilterWarning, setShowFilterWarning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isCooldown = cooldownRemaining > 0

  // テキスト入力時にフィルターチェック
  useEffect(() => {
    if (textInput.trim()) {
      const result = filterContent(textInput)
      setFilterResult(result)
    } else {
      setFilterResult(null)
    }
    setShowFilterWarning(false)
  }, [textInput])

  const handleSendText = () => {
    if (textInput.trim() && !isCooldown) {
      // フィルターチェック
      const result = filterContent(textInput.trim())
      if (!result.isClean) {
        setShowFilterWarning(true)
        return
      }
      // 子ども向け追加チェック
      if (!isKidSafe(textInput.trim())) {
        setShowFilterWarning(true)
        setFilterResult({
          isClean: false,
          filteredText: textInput.trim(),
          detectedIssues: ['個人情報の可能性']
        })
        return
      }
      onSendText(textInput.trim())
      setTextInput('')
      setShowFilterWarning(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendText()
    }
  }

  return (
    <div className="relative">
      {/* 毛糸フレーム背景画像 - サイズ確保用（非表示） */}
      <img
        src={activeTab === 'stamps'
          ? '/images/koukan_ui/Purple_tab.png'
          : '/images/koukan_ui/Yellow_tab.png'
        }
        alt=""
        className="w-full h-auto invisible"
        draggable={false}
        aria-hidden="true"
      />

      {/* フレーム画像オーバーレイ（テキスト入力の上に表示） */}
      <img
        src={activeTab === 'stamps'
          ? '/images/koukan_ui/Purple_tab.png'
          : '/images/koukan_ui/Yellow_tab.png'
        }
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none"
        draggable={false}
        style={{ zIndex: 10 }}
      />

      {/* 上部エリア: タブ + スタンプ/定型文グリッド（フレームの上に表示） */}
      <div className="absolute flex flex-col" style={{ zIndex: 15, pointerEvents: 'none', top: 0, left: 0, right: 0, bottom: '80px' }}>
        <div className="h-full flex flex-col">
          {/* タブ切り替えエリア（画像のタブ位置に合わせて配置） */}
          <div className="flex pt-0.5 pl-3">
            <button
              onClick={() => setActiveTab('stamps')}
              className={`px-3 py-0.5 text-[13px] font-black transition-colors ${
                activeTab === 'stamps'
                  ? 'text-purple-700'
                  : 'text-purple-400'
              }`}
              style={{
                position: 'relative',
                left: '50px',
                top: '24px',
                color: 'rgb(194, 103, 0)',
                pointerEvents: 'auto',
                textShadow: '-1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff, 0 -1.5px 0 #fff, 0 1.5px 0 #fff, -1.5px 0 0 #fff, 1.5px 0 0 #fff',
              }}
            >
              スタンプ
            </button>
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-0.5 text-[13px] font-black transition-colors ${
                activeTab === 'presets'
                  ? 'text-yellow-700'
                  : 'text-yellow-500'
              }`}
              style={{
                position: 'relative',
                left: '160px',
                top: '23px',
                color: 'rgb(193, 103, 1)',
                pointerEvents: 'auto',
                textShadow: '-1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff, 0 -1.5px 0 #fff, 0 1.5px 0 #fff, -1.5px 0 0 #fff, 1.5px 0 0 #fff',
              }}
            >
              定型文
            </button>
          </div>

          {/* スタンプ・定型文コンテンツ - 枠内に収めてスクロール可能 */}
          <div
            className="overflow-y-scroll overflow-x-hidden"
            style={{
              pointerEvents: 'auto',
              position: 'absolute',
              left: '32px',
              top: '50px',
              width: '300px',
              height: '72px',
              padding: '2px 4px',
              scrollbarWidth: 'thin',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
              overscrollBehavior: 'contain',
            }}
          >
            {activeTab === 'stamps' ? (
              <div
                className="grid grid-cols-4 gap-1"
                style={{ pointerEvents: 'auto', width: '100%' }}
              >
                {(Object.keys(STAMPS) as StampType[]).map((type) => (
                  <motion.button
                    key={type}
                    whileTap={!isCooldown ? { scale: 0.85 } : {}}
                    onClick={() => !isCooldown && onSendStamp(type)}
                    disabled={isCooldown}
                    className={`h-7 px-1 rounded-md flex items-center justify-center transition-all ${
                      isCooldown
                        ? 'bg-white/40 opacity-50 cursor-not-allowed'
                        : 'bg-white/90 active:bg-white shadow-sm border border-purple-200'
                    }`}
                    style={{ pointerEvents: 'auto', minWidth: 0 }}
                  >
                    <span className="text-sm leading-none whitespace-nowrap">{STAMPS[type].emoji}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div
                className="flex flex-wrap gap-1 content-start"
                style={{ pointerEvents: 'auto', width: '100%' }}
              >
                {PRESET_MESSAGES.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => !isCooldown && onSendPreset(text)}
                    disabled={isCooldown}
                    className={`px-1.5 py-0.5 rounded-full border text-[8px] font-medium whitespace-nowrap transition-all ${
                      isCooldown
                        ? 'bg-white/40 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white/90 border-yellow-400 text-yellow-800 active:bg-yellow-50'
                    }`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 下部エリア: テキスト入力（フレームの後ろに表示） */}
      <div
        className="absolute overflow-hidden"
        style={{
          zIndex: 5,
          height: '62px',
          bottom: '-2px',
          left: '14px',
          right: '90px',
        }}
      >
        {/* フィルター警告 */}
        {showFilterWarning && filterResult && !filterResult.isClean && (
          <div className="absolute -top-6 left-0 right-0 px-2 py-0.5 bg-yellow-100/95 rounded" style={{ zIndex: 20 }}>
            <p className="text-[8px] text-yellow-700 flex items-center gap-1">
              <WarningIcon size={12} color="#B45309" />
              <span>{getFilterReason(filterResult)}</span>
            </p>
          </div>
        )}

        {/* テキスト入力 */}
        <div className="h-full flex items-center">
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value.slice(0, 50))}
                onKeyDown={handleKeyDown}
                placeholder={isCooldown ? `${cooldownRemaining}秒後` : 'メッセージを入力...'}
                disabled={isCooldown}
                maxLength={50}
                className={`w-full px-3 py-1 rounded-full text-[11px] border transition-all ${
                  isCooldown
                    ? 'bg-gray-100 border-gray-200 text-gray-400'
                    : showFilterWarning && filterResult && !filterResult.isClean
                      ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                      : 'bg-white border-pink-300 text-purple-800 focus:border-purple-400'
                }`}
                style={{ marginLeft: '40px' }}
              />
              {textInput.length > 0 && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-purple-400">
                  {textInput.length}/50
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 送信ボタン（フレームの前に表示） */}
      <motion.button
        whileTap={!isCooldown && textInput.trim() ? { scale: 0.9 } : {}}
        onClick={handleSendText}
        disabled={isCooldown || !textInput.trim()}
        className={`absolute w-7 h-7 rounded-full flex items-center justify-center transition-all shadow ${
          isCooldown || !textInput.trim()
            ? 'bg-gray-200 text-gray-400'
            : 'bg-gradient-to-r from-pink-400 to-purple-500 text-white'
        }`}
        style={{
          zIndex: 15,
          bottom: '18px',
          right: '60px',
        }}
      >
        {isCooldown ? (
          <span className="text-[8px] font-bold">{cooldownRemaining}</span>
        ) : (
          <span className="text-sm">↑</span>
        )}
      </motion.button>
    </div>
  )
}

// ============================================
// 希望シール枠（全シール表示・レート警告付き）- 毛糸フレームUI
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
    <div className="relative">
      {/* 毛糸フレーム背景 */}
      <div className="relative">
        <img
          src="/images/koukan_ui/Koukan_UI.png"
          alt=""
          className="w-full h-auto"
          draggable={false}
        />

        {/* フレーム内のコンテンツ - 左にラベル+pt、右にシール3x2グリッド */}
        <div className="absolute inset-0 flex items-center" style={{ padding: '1px 4px 1px 18px' }}>
          <div className="flex-1 flex items-center gap-1">
            {/* 希望シール（もらう）- 左にラベル、右にシール3x2グリッド */}
            <div className="flex-1 flex items-start gap-1 min-w-0">
              {/* ラベル部分（縦並び） */}
              <div className="flex flex-col items-center flex-shrink-0 pt-1" style={{ minWidth: '30px' }}>
                <span className="text-[9px] text-purple-700 font-bold leading-tight">もらう</span>
                <span className={`text-[11px] font-bold leading-tight ${
                  myRate > 0 ? 'text-green-600' : 'text-gray-400'
                }`}>+{myRate}</span>
              </div>
              {/* シール部分（3x2グリッド） */}
              <div className="grid grid-cols-3 gap-0.5 flex-1">
                {myWants.length > 0 ? (
                  myWants.slice(0, 6).map((s) => (
                    <div key={s.id} className="relative flex flex-col items-center">
                      <div className={`w-6 h-6 rounded overflow-hidden border-2 bg-white shadow-sm ${
                        s.sticker.rarity >= 4 ? 'border-yellow-400' : 'border-purple-300'
                      }`}>
                        {s.sticker.imageUrl && (
                          <img src={s.sticker.imageUrl} className="w-full h-full object-contain" />
                        )}
                      </div>
                      <span className="text-[8px] text-yellow-500 leading-none mt-0.5">
                        {'★'.repeat(Math.min(s.sticker.rarity, 5))}
                      </span>
                      <button
                        onClick={() => onRemoveMyWant(s.id)}
                        className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full text-white text-[6px] flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-[8px] text-purple-400 col-span-3">タップでえらぶ</span>
                )}
              </div>
            </div>

            {/* 交換アイコン */}
            <div className="flex-shrink-0 px-0.5">
              <span className={`text-base ${isBalanced ? 'text-purple-500' : isLosingTrade ? 'text-red-500' : 'text-orange-400'}`}>
                ⇄
              </span>
            </div>

            {/* 提供シール（あげる）- 左にラベル、右にシール3x2グリッド */}
            <div className="flex-1 flex items-start gap-1 min-w-0">
              {/* ラベル部分（縦並び） */}
              <div className="flex flex-col items-center flex-shrink-0 pt-1" style={{ minWidth: '30px' }}>
                <span className="text-[9px] text-pink-700 font-bold leading-tight">あげる</span>
                <span className={`text-[11px] font-bold leading-tight ${
                  partnerRate > myRate ? 'text-red-600' : 'text-pink-600'
                }`}>-{partnerRate}</span>
              </div>
              {/* シール部分（3x2グリッド） */}
              <div className="grid grid-cols-3 gap-0.5 flex-1">
                {partnerWants.length > 0 ? (
                  partnerWants.slice(0, 6).map((s) => (
                    <div key={s.id} className="relative flex flex-col items-center">
                      <div className={`w-6 h-6 rounded overflow-hidden border-2 bg-white shadow-sm ${
                        s.sticker.rarity >= 4 ? 'border-red-400' : 'border-pink-300'
                      }`}>
                        {s.sticker.imageUrl && (
                          <img src={s.sticker.imageUrl} className="w-full h-full object-contain" />
                        )}
                      </div>
                      <span className="text-[8px] text-yellow-500 leading-none mt-0.5">
                        {'★'.repeat(Math.min(s.sticker.rarity, 5))}
                      </span>
                      <button
                        onClick={() => onRemovePartnerWant(s.id)}
                        className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gray-500 rounded-full text-white text-[6px] flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-[8px] text-pink-400 col-span-3">あいてがえらぶ</span>
                )}
              </div>
            </div>
          </div>

          {/* ステータス＋OKボタン */}
          <div className="flex flex-col items-center ml-1">
            {/* ステータス表示 */}
            <div className="flex flex-col items-center gap-0 mb-0.5">
              <span className={`text-[9px] font-bold ${myConfirmed ? 'text-green-600' : 'text-gray-400'}`}>
                {myConfirmed ? '●' : '○'}じぶん
              </span>
              <span className={`text-[9px] font-bold ${partnerConfirmed ? 'text-green-600' : 'text-gray-400'}`}>
                {partnerConfirmed ? '●' : '○'}あいて
              </span>
            </div>

            {/* 毛糸ハートOKボタン - 大きめサイズ */}
            <motion.button
              onClick={onConfirm}
              disabled={!canConfirm || myConfirmed}
              whileTap={canConfirm && !myConfirmed ? { scale: 0.9 } : {}}
              className={`relative w-14 h-14 ${
                !canConfirm || myConfirmed ? 'opacity-40 grayscale' : ''
              }`}
            >
              <img
                src="/images/koukan_ui/OK_Button.png"
                alt="OK"
                className="w-full h-full object-contain drop-shadow-md"
                draggable={false}
              />
              {myConfirmed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-white text-sm drop-shadow-md"
                  >
                    ⏳
                  </motion.span>
                </div>
              )}
              {!myConfirmed && canConfirm && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-lg">
                  OK!
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* 警告バナー（損する交換の場合） */}
      {isLosingTrade && (
        <div className="bg-red-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg mt-1 flex items-center justify-center gap-1">
          <WarningIcon size={14} color="#FFF" />
          <span>あなたが {rateDiff}pt 多く渡す交換です！</span>
        </div>
      )}

      {/* 高レアシール警告 */}
      {hasHighRarityOffer && !myConfirmed && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 bg-yellow-100/90 border border-yellow-400 rounded-lg px-2 py-0.5 text-[9px] text-yellow-800 text-center flex items-center justify-center gap-1"
        >
          <WarningIcon size={12} color="#CA8A04" />
          <span><strong>★4以上のレアシール</strong>をあげようとしています</span>
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
            <div className="mb-2 drop-shadow-lg"><BookOpenPurpleIcon size={40} /></div>
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
            <div className="mb-2"><BookOpenPinkIcon size={32} /></div>
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
              // ホームと同じ60pxベースサイズを使用
              const size = 60 * sticker.scale
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
                      <div className="w-full h-full flex items-center justify-center">
                        <StarIcon size={20} color="#FBBF24" />
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
            <div className="mb-2 drop-shadow-lg"><BookOpenPurpleIcon size={40} /></div>
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
            <div className="mb-2"><BookOpenPinkIcon size={32} /></div>
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
                    <div className="w-full h-full flex items-center justify-center">
                      <StarIcon size={24} color="#FBBF24" />
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
            <div className="mb-2 drop-shadow-lg"><BookOpenPurpleIcon size={40} /></div>
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
            <div className="mb-2"><BookOpenPinkIcon size={32} /></div>
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
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        filter: isSelected
                          ? 'drop-shadow(0 0 4px #ff69b4) drop-shadow(0 0 8px #ff1493)'
                          : 'none',
                      }}
                    >
                      <StarIcon size={24} color="#FBBF24" />
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

  // 端検出スワイプ用のstate/ref
  const startX = useRef(0)
  const wasAtLeftEdge = useRef(false)
  const wasAtRightEdge = useRef(false)

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

  const SWIPE_THRESHOLD = pageWidth * 0.25

  // ページめくりボタン
  const goToPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev()
  }, [])

  const goToNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext()
  }, [])

  // 端検出ヘルパー
  const isAtLeftEdge = useCallback((container: HTMLElement) => {
    return container.scrollLeft <= 1
  }, [])

  const isAtRightEdge = useCallback((container: HTMLElement) => {
    return container.scrollLeft + container.clientWidth >= container.scrollWidth - 1
  }, [])

  // スワイプ開始
  const handleDragStart = useCallback((clientX: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    startX.current = clientX
    wasAtLeftEdge.current = isAtLeftEdge(container)
    wasAtRightEdge.current = isAtRightEdge(container)
  }, [isAtLeftEdge, isAtRightEdge])

  // スワイプ終了
  const handleDragEnd = useCallback((clientX: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const swipeDistance = startX.current - clientX
    const currentAtLeftEdge = isAtLeftEdge(container)
    const currentAtRightEdge = isAtRightEdge(container)

    // 左端にいて、右へスワイプ → 前のページ
    if (wasAtLeftEdge.current && currentAtLeftEdge && swipeDistance < -SWIPE_THRESHOLD) {
      goToPrev()
      return
    }

    // 右端にいて、左へスワイプ → 次のページ
    if (wasAtRightEdge.current && currentAtRightEdge && swipeDistance > SWIPE_THRESHOLD) {
      goToNext()
      return
    }
  }, [isAtLeftEdge, isAtRightEdge, goToPrev, goToNext, SWIPE_THRESHOLD])


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: pageWidth * 2 + 32,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー - 固定幅で位置を安定させる（画面に収まるよう調整） */}
        <div
          className="flex items-center justify-between mb-3 px-2"
          style={{ width: '100%', maxWidth: pageWidth * 2 }} // 見開き幅を最大に、画面に収まるよう調整
        >
          <div className="flex items-center gap-2">
            <UserIcon size={20} color="#FFFFFF" />
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
          <span className="px-3 py-1 bg-pink-500/90 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
            <TargetIcon size={14} color="#FFFFFF" />
            <span>ほしい: {selectedStickers.length}/{maxSelections}</span>
          </span>
        </div>

        {/* 横スクロールコンテナ - 端でスワイプするとページめくり */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden rounded-lg"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            touchAction: 'pan-x',
            overscrollBehaviorX: 'none',
          }}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseUp={(e) => handleDragEnd(e.clientX)}
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
                height: pageHeight,
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
        <p className="text-white/60 text-xs mt-3">シールをタップで選択 • 横スクロール＋端でページめくり</p>
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

  // 端検出スワイプ用のstate/ref
  const startX = useRef(0)
  const wasAtLeftEdge = useRef(false)
  const wasAtRightEdge = useRef(false)

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

  const SWIPE_THRESHOLD = pageWidth * 0.25

  const goToPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev()
  }, [])

  const goToNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext()
  }, [])

  // 端検出ヘルパー
  const isAtLeftEdge = useCallback((container: HTMLElement) => {
    return container.scrollLeft <= 1
  }, [])

  const isAtRightEdge = useCallback((container: HTMLElement) => {
    return container.scrollLeft + container.clientWidth >= container.scrollWidth - 1
  }, [])

  // スワイプ開始
  const handleDragStart = useCallback((clientX: number) => {
    const container = scrollContainerRef.current
    if (!container) return
    startX.current = clientX
    wasAtLeftEdge.current = isAtLeftEdge(container)
    wasAtRightEdge.current = isAtRightEdge(container)
  }, [isAtLeftEdge, isAtRightEdge])

  // スワイプ終了
  const handleDragEnd = useCallback((clientX: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const swipeDistance = startX.current - clientX
    const currentAtLeftEdge = isAtLeftEdge(container)
    const currentAtRightEdge = isAtRightEdge(container)

    // 左端にいて、右へスワイプ → 前のページ
    if (wasAtLeftEdge.current && currentAtLeftEdge && swipeDistance < -SWIPE_THRESHOLD) {
      goToPrev()
      return
    }

    // 右端にいて、左へスワイプ → 次のページ
    if (wasAtRightEdge.current && currentAtRightEdge && swipeDistance > SWIPE_THRESHOLD) {
      goToNext()
      return
    }
  }, [isAtLeftEdge, isAtRightEdge, goToPrev, goToNext, SWIPE_THRESHOLD])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '32px',
        paddingBottom: '16px',
        paddingLeft: '8px',
        paddingRight: '8px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100%',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            paddingLeft: '8px',
            paddingRight: '8px',
            width: '100%',
            maxWidth: 400,
          }}
        >
          <div className="flex items-center gap-2">
            <SmileIcon size={20} color="#FBBF24" />
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
          <span className="px-3 py-1 bg-pink-500/90 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
            <GiftIcon size={14} color="#FFFFFF" />
            <span>あげる: {selectedStickers.length}/{maxSelections}</span>
          </span>
          {partnerSelectedStickers.length > 0 && (
            <span className="px-3 py-1 bg-purple-500/90 text-white text-xs font-bold rounded-full shadow-lg animate-pulse flex items-center gap-1">
              <UserIcon size={14} color="#FFFFFF" />
              <span>相手がほしいシール: {partnerSelectedStickers.length}個</span>
            </span>
          )}
        </div>

        {/* 横スクロールコンテナ - 端でスワイプするとページめくり */}
        <div
          ref={scrollContainerRef}
          className="w-full overflow-x-auto overflow-y-hidden rounded-lg"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
            touchAction: 'pan-x',
            overscrollBehaviorX: 'none',
          }}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseUp={(e) => handleDragEnd(e.clientX)}
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
                  <MyBookSelectablePage
                    key={page.id}
                    page={page}
                    coverDesign={coverDesign}
                    pageWidth={pageWidth}
                    pageHeight={pageHeight}
                    selectedStickers={selectedStickers}
                    partnerSelectedStickers={partnerSelectedStickers}
                    onStickerSelect={onStickerSelect}
                  />
                ))}
              </HTMLFlipBook>
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
          横スクロール＋端でページめくり
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
            <div className="mb-2 drop-shadow-lg"><BookOpenPurpleIcon size={40} /></div>
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
            <div className="mb-2"><BookOpenPinkIcon size={32} /></div>
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
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        filter: isWantedByPartner
                          ? 'drop-shadow(0 0 6px #a855f7) drop-shadow(0 0 12px #9333ea)'
                          : isSelected
                            ? 'drop-shadow(0 0 4px #ff69b4)'
                            : 'none',
                      }}
                    >
                      <StarIcon size={28} color="#FBBF24" />
                    </div>
                  )}
                  {/* 相手が欲しがっているマーク */}
                  {isWantedByPartner && (
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <UserIcon size={14} color="#FFFFFF" />
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
          {isPartner ? <UserIcon size={18} color="#A855F7" /> : <SmileIcon size={18} color="#FBBF24" />}
          <span className="text-xs font-bold text-purple-700">{userName}</span>
          {/* 拡大ボタン（相手のシール帳のみ表示） */}
          {isPartner && onEnlarge && (
            <button
              onClick={onEnlarge}
              className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center shadow-sm active:scale-95 transition-transform ml-1"
              title="拡大表示"
            >
              <SearchIcon size={14} color="#FFFFFF" />
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
        className="flex justify-center items-center overflow-x-auto"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <div
          className="trade-book-container relative rounded-lg shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 flex-shrink-0"
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
        <span className={`text-xs font-bold flex items-center justify-center gap-1 ${isPartner ? 'text-purple-600' : 'text-pink-600'}`}>
          {isPartner ? <TargetIcon size={14} color="#9333EA" /> : <GiftIcon size={14} color="#DB2777" />}
          <span>{isPartner ? 'ほしい' : 'あげる'}: {selectedStickers.length}/{maxSelections}</span>
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
            {[<SparkleIcon key="sp" size={20} color="#FBBF24" />, <StarIcon key="st" size={20} color="#FBBF24" />, <SparkleIcon key="sp2" size={18} color="#F9A8D4" />, <StarIcon key="st2" size={18} color="#F9A8D4" />][i % 4]}
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
            style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}
          >
            <CelebrationIcon size={48} />
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
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><StarIcon size={24} color="#FBBF24" /></span>
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
              border: '2px solid #d8b4fe',
              overflow: 'hidden',
            }}>
              {partner.avatarUrl ? (
                <img src={partner.avatarUrl} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                <UserIcon size={28} color="#A855F7" />
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
              {isFollowing ? 'フォロー中' : <><HandshakeIcon size={16} color="white" /> フォローする</>}
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
  // Supabase連携用
  supabaseMessages,
  onSendStamp,
  onSendText,
  partnerReady,
  onSetReady,
  // シール選択の同期用
  supabaseMyItems,
  supabasePartnerItems,
  onSelectMySticker,
  onDeselectMySticker,
  tradeCompleted,
}) => {
  // 選択状態
  const [myWantIds, setMyWantIds] = useState<string[]>([]) // 相手からほしい
  const [myOfferIds, setMyOfferIds] = useState<string[]>([]) // 自分があげる
  const [partnerWantFromMeIds, setPartnerWantFromMeIds] = useState<string[]>([]) // 相手が自分のシールから欲しがっているもの（デモ用）

  // 交渉状態
  const [messages, setMessages] = useState<TradeMessage[]>([])
  const [myConfirmed, setMyConfirmed] = useState(false)
  // partnerConfirmedはpropsから受け取る（Supabase連携時）またはローカルstate
  const [localPartnerConfirmed, setLocalPartnerConfirmed] = useState(false)
  const partnerConfirmed = partnerReady ?? localPartnerConfirmed
  const [showComplete, setShowComplete] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showEnlargedBook, setShowEnlargedBook] = useState(false)  // 相手のシール帳拡大表示
  const [showMyEnlargedBook, setShowMyEnlargedBook] = useState(false)  // 自分のシール帳拡大表示
  const [cooldownRemaining, setCooldownRemaining] = useState(0)  // メッセージクールダウン（秒）

  // Supabase交換完了時の受け取りシールを保持するref
  const completedWantsRef = useRef<string[]>([])
  const completedOffersRef = useRef<string[]>([])
  const completedWantStickersRef = useRef<PlacedSticker[]>([]) // 実際のシールオブジェクト
  const hasHandledCompletionRef = useRef(false)

  // Supabase経由で交換が完了した時の処理
  useEffect(() => {
    if (tradeCompleted && !hasHandledCompletionRef.current && !showComplete) {
      console.log('[TradeSession] Trade completed via Supabase, showing complete screen')
      console.log('[TradeSession] Preserving myWantIds:', myWantIds)
      console.log('[TradeSession] Preserving myOfferIds:', myOfferIds)
      // 現在の選択状態を保存（sync effectでクリアされる前に）
      completedWantsRef.current = [...myWantIds]
      completedOffersRef.current = [...myOfferIds]
      // 実際のシールオブジェクトも保存（ページが更新されても表示できるように）
      const wantStickers = myWantIds
        .map((id) => {
          for (const page of partnerPages) {
            const found = page.stickers.find((s) => s.id === id)
            if (found) return found
          }
          return null
        })
        .filter((s): s is PlacedSticker => s !== null)
      completedWantStickersRef.current = wantStickers
      console.log('[TradeSession] Preserved stickers:', wantStickers.length)
      hasHandledCompletionRef.current = true
      setShowComplete(true)
    }
  }, [tradeCompleted, showComplete, myWantIds, myOfferIds, partnerPages])

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

  // 選択ハンドラ - 相手のシール帳から欲しいものを選択
  // Supabaseに同期してリアルタイムで相手側にも表示される
  const handleSelectPartnerSticker = useCallback(async (stickerId: string) => {
    // stickerId は placement.id (sticker_placements.id)
    // Supabase連携には userStickerId (user_stickers.id) が必要
    const placedSticker = getStickerFromPages(partnerPages, stickerId)
    const userStickerId = placedSticker?.userStickerId

    if (!userStickerId) {
      console.error('[TradeSession] userStickerId not found for sticker:', stickerId)
      // UI上の選択は許可（デモモード対応）
    }

    const isCurrentlySelected = myWantIds.includes(stickerId)

    if (isCurrentlySelected) {
      // 選択解除
      setMyWantIds((prev) => prev.filter((id) => id !== stickerId))

      // Supabase連携: アイテムを削除
      if (onDeselectMySticker && supabaseMyItems && userStickerId) {
        const item = supabaseMyItems.find(i => i.user_sticker_id === userStickerId)
        if (item) {
          try {
            await onDeselectMySticker(item.id)
          } catch (e) {
            console.error('[TradeSession] Failed to deselect partner sticker:', e)
          }
        }
      }
    } else {
      // 新規選択
      if (myWantIds.length < MAX_SELECTIONS) {
        setMyWantIds((prev) => [...prev, stickerId])

        // Supabase連携: アイテムを追加（userStickerId を使用）
        if (onSelectMySticker && userStickerId) {
          try {
            await onSelectMySticker(userStickerId)
          } catch (e) {
            console.error('[TradeSession] Failed to select partner sticker:', e)
          }
        }
      }
    }

    setMyConfirmed(false)
    setLocalPartnerConfirmed(false)
  }, [myWantIds, partnerPages, getStickerFromPages, onSelectMySticker, onDeselectMySticker, supabaseMyItems])

  // 自分のシール帳からの選択は無効化
  // 相手が自分の帳面から選ぶ（partnerWantFromMeIdsで表示）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelectMySticker = useCallback((_stickerId: string) => {
    // 閲覧専用: 自分のシール帳からは選択できない
    // 相手が選んでくれたシールが partnerWantFromMeIds に表示される
    console.log('[TradeSession] Own book is view-only. Partner selects from your book.')
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
    async (type: StampType) => {
      // Supabase連携がある場合はSupabaseに送信
      if (onSendStamp) {
        try {
          await onSendStamp(type)
          // UIは即座に更新（Supabaseからのリアルタイム通知でも更新される）
          addMessage('stamp', type, myUser.id)
        } catch (e) {
          console.error('[TradeSession] Failed to send stamp:', e)
        }
      } else {
        // デモモード（Supabase連携なし）
        addMessage('stamp', type, myUser.id)
      }
    },
    [addMessage, myUser.id, onSendStamp]
  )

  const handleSendPreset = useCallback(
    async (text: string) => {
      // Supabase連携がある場合はSupabaseに送信
      if (onSendText) {
        try {
          await onSendText(text)
          addMessage('preset', text, myUser.id)
        } catch (e) {
          console.error('[TradeSession] Failed to send preset:', e)
        }
      } else {
        addMessage('preset', text, myUser.id)
      }
    },
    [addMessage, myUser.id, onSendText]
  )

  const handleSendText = useCallback(
    async (text: string) => {
      // Supabase連携がある場合はSupabaseに送信
      if (onSendText) {
        try {
          await onSendText(text)
          addMessage('text', text, myUser.id)
        } catch (e) {
          console.error('[TradeSession] Failed to send text:', e)
        }
      } else {
        addMessage('text', text, myUser.id)
      }
    },
    [addMessage, myUser.id, onSendText]
  )

  // 交換OK
  const handleConfirm = useCallback(async () => {
    if (myWantIds.length === 0 || myOfferIds.length === 0) return
    setMyConfirmed(true)

    // Supabase連携がある場合はSupabaseにReady状態を送信
    if (onSetReady) {
      try {
        await onSetReady()
      } catch (e) {
        console.error('[TradeSession] Failed to set ready:', e)
      }
    } else {
      // デモモード（Supabase連携なし）: 相手も少し遅れてOK
      setTimeout(() => {
        setLocalPartnerConfirmed(true)
      }, 1500 + Math.random() * 1000)
    }
  }, [myWantIds.length, myOfferIds.length, onSetReady])

  // 両者OK → 成立
  useEffect(() => {
    if (myConfirmed && partnerConfirmed && !hasHandledCompletionRef.current) {
      console.log('[TradeSession] Both confirmed, preserving stickers before complete')
      // 完了画面表示前にシールデータを保存（syncでクリアされる前に）
      completedWantsRef.current = [...myWantIds]
      completedOffersRef.current = [...myOfferIds]
      const wantStickers = myWantIds
        .map((id) => {
          for (const page of partnerPages) {
            const found = page.stickers.find((s) => s.id === id)
            if (found) return found
          }
          return null
        })
        .filter((s): s is PlacedSticker => s !== null)
      completedWantStickersRef.current = wantStickers
      hasHandledCompletionRef.current = true
      console.log('[TradeSession] Preserved wants:', myWantIds.length, 'stickers:', wantStickers.length)

      setTimeout(() => {
        setShowComplete(true)
      }, 500)
    }
  }, [myConfirmed, partnerConfirmed, myWantIds, myOfferIds, partnerPages])

  // Supabaseメッセージを監視して表示
  useEffect(() => {
    if (!supabaseMessages || supabaseMessages.length === 0) return

    // 新しいメッセージを処理
    supabaseMessages.forEach((msg) => {
      // 既に表示済みのメッセージは無視
      const exists = messages.some((m) => m.id === msg.id)
      if (exists) return

      // 相手からのメッセージのみ追加（自分のメッセージは送信時に追加済み）
      if (msg.user_id !== myUser.id) {
        // メッセージタイプを判定
        const msgType = msg.message_type || 'stamp'
        const content = msgType === 'stamp' ? msg.stamp_id : msg.content

        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            type: msgType as 'stamp' | 'text' | 'preset',
            content: content || '',
            senderId: msg.user_id,
            timestamp: new Date(msg.created_at),
          },
        ])
      }
    })
  }, [supabaseMessages, messages, myUser.id])

  // userStickerId から placement.id を検索するヘルパー関数
  const findPlacementIdByUserStickerId = useCallback((pages: TradeBookPageFull[], userStickerId: string): string | null => {
    for (const page of pages) {
      const found = page.stickers.find((s) => s.userStickerId === userStickerId)
      if (found) return found.id
    }
    return null
  }, [])

  // Supabase自分のアイテムを監視（自分が相手の帳面から選んだシール = myWantIds）
  useEffect(() => {
    if (!supabaseMyItems) return

    // 交換完了後・完了画面表示中は同期しない（表示に影響するため）
    if (tradeCompleted || hasHandledCompletionRef.current || showComplete) {
      console.log('[TradeSession] Trade completed or showing complete, skipping myWantIds sync')
      return
    }

    // SupabaseのアイテムIDリスト（user_stickers.id）を placement.id に変換
    // 重複を除去（同じuser_sticker_idが複数回登録される場合があるため）
    const uniqueUserStickerIds = [...new Set(supabaseMyItems.map(item => item.user_sticker_id))]
    const placementIds = uniqueUserStickerIds
      .map(userStickerId => findPlacementIdByUserStickerId(partnerPages, userStickerId))
      .filter((id): id is string => id !== null)

    // ローカル状態と異なる場合のみ更新（無限ループ防止）
    const localIds = [...myWantIds].sort()
    const remoteIds = [...placementIds].sort()
    if (JSON.stringify(localIds) !== JSON.stringify(remoteIds)) {
      // 重要: 既にアイテムがある状態から空になる場合は、交換完了のタイミングの可能性が高い
      // tradeCompleted propの更新が遅延しているケースに対応するため、クリアをスキップ
      if (myWantIds.length > 0 && placementIds.length === 0) {
        console.log('[TradeSession] Skipping clear of myWantIds - likely trade completing (timing protection)')
        return
      }
      console.log('[TradeSession] Syncing my wants from Supabase:', placementIds)
      setMyWantIds(placementIds)
    }
  }, [supabaseMyItems, partnerPages, findPlacementIdByUserStickerId, tradeCompleted, showComplete]) // myWantIdsを依存配列に含めない（無限ループ防止）

  // Supabaseパートナーアイテムを監視（相手が自分の帳面から選んだシール = partnerWantFromMeIds & myOfferIds）
  useEffect(() => {
    if (!supabasePartnerItems) return

    // 交換完了後・完了画面表示中は同期しない（表示に影響するため）
    if (tradeCompleted || hasHandledCompletionRef.current || showComplete) {
      console.log('[TradeSession] Trade completed or showing complete, skipping myOfferIds sync')
      return
    }

    // パートナーが選択したシールのID（user_stickers.id）を placement.id に変換
    // 重複を除去（同じuser_sticker_idが複数回登録される場合があるため）
    const uniqueUserStickerIds = [...new Set(supabasePartnerItems.map(item => item.user_sticker_id))]
    const placementIds = uniqueUserStickerIds
      .map(userStickerId => findPlacementIdByUserStickerId(myPages, userStickerId))
      .filter((id): id is string => id !== null)

    // 重要: 既にアイテムがある状態から空になる場合は、交換完了のタイミングの可能性が高い
    // tradeCompleted propの更新が遅延しているケースに対応するため、クリアをスキップ
    if (myOfferIds.length > 0 && placementIds.length === 0) {
      console.log('[TradeSession] Skipping clear of myOfferIds - likely trade completing (timing protection)')
      return
    }

    console.log('[TradeSession] Partner wants from me:', placementIds)
    console.log('[TradeSession] Partner requests count:', placementIds.length)

    // 相手が自分の帳面から選んだシール = 自分があげるシール
    setPartnerWantFromMeIds(placementIds)
    setMyOfferIds(placementIds)
  }, [supabasePartnerItems, myPages, findPlacementIdByUserStickerId, tradeCompleted, showComplete])

  // デモモード（Supabase連携なし）: 相手のスタンプをランダム送信
  useEffect(() => {
    // Supabase連携がある場合はデモを無効化
    if (onSendStamp) return

    const interval = setInterval(() => {
      if (Math.random() > 0.65 && messages.length < 20) {
        const types: StampType[] = ['please', 'thinking', 'cute', 'ok', 'this', 'great']
        addMessage('stamp', types[Math.floor(Math.random() * types.length)], partnerUser.id)
      }
    }, 3500)
    return () => clearInterval(interval)
  }, [addMessage, partnerUser.id, messages.length, onSendStamp])

  // デモ: 相手が自分のシールをランダムに欲しがるシミュレーション
  // Supabase連携時は無効化（supabasePartnerItemsから実際のデータを取得するため）
  useEffect(() => {
    // Supabase連携がある場合はデモを無効化
    if (onSelectMySticker) return

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
  }, [myPages, onSelectMySticker])

  // フォロー処理
  const handleFollow = useCallback(() => {
    setIsFollowing(true)
    onFollowPartner?.(partnerUser.id)
  }, [onFollowPartner, partnerUser.id])

  // 完了して閉じる
  const handleClose = useCallback(() => {
    // Supabase経由の完了時は保存したIDを使用
    const offerIds = completedOffersRef.current.length > 0
      ? completedOffersRef.current
      : myOfferIds
    const wantIds = completedWantsRef.current.length > 0
      ? completedWantsRef.current
      : myWantIds
    onTradeComplete(offerIds, wantIds)
  }, [onTradeComplete, myOfferIds, myWantIds])

  // 成立画面
  if (showComplete) {
    // Supabase経由の完了時は保存したシールを使用（ページ更新後も正しく表示）
    const displayStickers = completedWantStickersRef.current.length > 0
      ? completedWantStickersRef.current
      : myWants
    console.log('[TradeSession] Complete screen - displayStickers:', displayStickers.length)
    return (
      <PostTradeProfileScreen
        partner={partnerUser}
        receivedStickers={displayStickers}
        onFollow={handleFollow}
        onClose={handleClose}
        isFollowing={isFollowing}
      />
    )
  }

  const canConfirm = myWantIds.length > 0 && myOfferIds.length > 0

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, #F3E8FF, #FDF2F8, #F3E8FF)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        zIndex: 9999,
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          flexShrink: 0,
          background: 'linear-gradient(to right, #9333EA, #EC4899)',
          paddingLeft: '12px',
          paddingRight: '12px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          paddingTop: 'max(12px, env(safe-area-inset-top, 12px))',
          paddingBottom: '12px',
        }}
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
              <UserIcon size={20} color="white" />
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
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingLeft: '8px',
          paddingRight: '8px',
          paddingTop: '6px',
          paddingBottom: '6px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 上部スペーサー（コンテンツを下寄せするため） */}
        <div style={{ flexShrink: 0, minHeight: 0 }} />

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
            <BookOpenPurpleIcon size={20} />
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
            <BookOpenPinkIcon size={20} />
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
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 60,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setShowCancelConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '16px',
                maxWidth: '320px',
                width: '100%',
              }}
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
