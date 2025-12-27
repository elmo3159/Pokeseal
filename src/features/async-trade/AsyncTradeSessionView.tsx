'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  asyncTradeService,
  TradeRoomDetails,
  TradeMessage,
  TRADE_PRESET_MESSAGES,
  PresetMessageKey,
} from '@/services/asyncTrade'
import { UserIcon, CloseIcon } from '@/components/icons/TradeIcons'

interface AsyncTradeSessionViewProps {
  sessionId: string
  userId: string
  onClose: () => void
  onSelectSticker: (type: 'offer' | 'request') => void
  onTradeCompleted?: () => void
}

// 時刻フォーマット
const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

// ステータスバッジ
const StatusBadge: React.FC<{ confirmed: boolean; isMe: boolean }> = ({ confirmed, isMe }) => (
  <span
    className="px-2 py-0.5 rounded-full text-xs font-medium"
    style={{
      background: confirmed ? 'rgba(76, 175, 80, 0.15)' : 'rgba(158, 158, 158, 0.15)',
      color: confirmed ? '#2E7D32' : '#757575',
    }}
  >
    {isMe ? (confirmed ? '✓ 確認済み' : '未確認') : (confirmed ? '✓' : '待機中')}
  </span>
)

// シールカード
const StickerCard: React.FC<{
  sticker?: {
    id: string
    name: string
    imageUrl: string
    rarity: number
    upgradeRank?: number
  }
  onRemove?: () => void
  showRemove?: boolean
}> = ({ sticker, onRemove, showRemove }) => {
  if (!sticker) return null

  return (
    <div className="relative w-16 h-16">
      <div
        className="w-full h-full rounded-xl overflow-hidden border-2"
        style={{ borderColor: '#D4C4B0', background: 'rgba(255, 255, 255, 0.9)' }}
      >
        <img
          src={sticker.imageUrl}
          alt={sticker.name}
          className="w-full h-full object-cover"
        />
      </div>
      {/* レアリティ星 */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex">
        {Array.from({ length: sticker.rarity }).map((_, i) => (
          <span key={i} className="text-xs" style={{ color: '#FFD700' }}>★</span>
        ))}
      </div>
      {/* 削除ボタン */}
      {showRemove && onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: '#E74C3C' }}
        >
          <span className="text-white text-xs font-bold">×</span>
        </button>
      )}
    </div>
  )
}

// 追加ボタン
const AddStickerButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center transition-all active:scale-95"
    style={{ borderColor: '#C4A484', background: 'rgba(212, 196, 176, 0.2)' }}
  >
    <span className="text-2xl" style={{ color: '#C4A484' }}>+</span>
  </button>
)

// メッセージバブル
const MessageBubble: React.FC<{
  message: TradeMessage
  isMe: boolean
}> = ({ message, isMe }) => {
  // システムメッセージは中央に
  if (message.messageType === 'system') {
    return (
      <div className="flex justify-center my-2">
        <div
          className="px-3 py-1 rounded-full text-xs"
          style={{ background: 'rgba(158, 158, 158, 0.2)', color: '#757575' }}
        >
          {message.displayText}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className="max-w-[70%] px-3 py-2 rounded-2xl"
        style={{
          background: isMe
            ? 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)'
            : 'rgba(255, 255, 255, 0.95)',
          color: isMe ? 'white' : '#8B5A2B',
          boxShadow: '0 2px 8px rgba(184, 149, 107, 0.2)',
        }}
      >
        <div className="flex items-center gap-1">
          {message.emoji && <span>{message.emoji}</span>}
          <span className="text-sm">{message.displayText}</span>
        </div>
        <div
          className="text-xs mt-1 text-right"
          style={{ opacity: 0.7 }}
        >
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  )
}

// 定型メッセージボタン
const PresetMessageButton: React.FC<{
  presetKey: PresetMessageKey
  onClick: () => void
}> = ({ presetKey, onClick }) => {
  const preset = TRADE_PRESET_MESSAGES[presetKey]
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        color: '#8B5A2B',
        boxShadow: '0 2px 6px rgba(184, 149, 107, 0.2)',
        border: '1px solid #D4C4B0',
      }}
    >
      <span>{preset.emoji}</span>
      <span>{preset.text}</span>
    </button>
  )
}

// メインコンポーネント
export const AsyncTradeSessionView: React.FC<AsyncTradeSessionViewProps> = ({
  sessionId,
  userId,
  onClose,
  onSelectSticker,
  onTradeCompleted,
}) => {
  const [tradeRoom, setTradeRoom] = useState<TradeRoomDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirming, setIsConfirming] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // データ取得
  const fetchData = useCallback(async () => {
    try {
      const data = await asyncTradeService.getTradeRoom(sessionId, userId)
      setTradeRoom(data)
    } catch (error) {
      console.error('[AsyncTradeSession] Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [sessionId, userId])

  useEffect(() => {
    fetchData()
    // ポーリング（5秒ごと）
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  // メッセージスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [tradeRoom?.messages])

  // オファー削除
  const handleRemoveOffer = async (userStickerId: string) => {
    await asyncTradeService.removeOffer(sessionId, userId, userStickerId)
    fetchData()
  }

  // 定型メッセージ送信
  const handleSendPreset = async (presetKey: PresetMessageKey) => {
    await asyncTradeService.sendPresetMessage(sessionId, userId, presetKey)
    setShowPresets(false)
    fetchData()
  }

  // 確認
  const handleConfirm = async () => {
    if (isConfirming) return
    setIsConfirming(true)

    try {
      const result = await asyncTradeService.confirmTrade(sessionId, userId)
      if (result.completed) {
        onTradeCompleted?.()
      }
      fetchData()
    } catch (error) {
      console.error('[AsyncTradeSession] Confirm error:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  // 確認取り消し
  const handleUnconfirm = async () => {
    await asyncTradeService.unconfirmTrade(sessionId, userId)
    fetchData()
  }

  // キャンセル
  const handleCancel = async () => {
    if (window.confirm('この交換をキャンセルしますか？')) {
      await asyncTradeService.cancelTrade(sessionId, userId)
      onClose()
    }
  }

  if (isLoading || !tradeRoom) {
    return (
      <div
        className="flex flex-col h-full items-center justify-center"
        style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
      >
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#C4956A', borderTopColor: 'transparent' }} />
        <p className="mt-3 text-sm" style={{ color: '#A67C52' }}>読み込み中...</p>
      </div>
    )
  }

  const { session, myOffers, partnerOffers, messages, isPartnerOnline } = tradeRoom
  const isRequester = session.requesterId === userId
  const myConfirmed = isRequester ? session.requesterConfirmed : session.responderConfirmed
  const partnerConfirmed = isRequester ? session.responderConfirmed : session.requesterConfirmed
  const canConfirm = myOffers.length > 0 && partnerOffers.length > 0

  // pending状態の場合は招待待ち画面
  if (session.status === 'pending') {
    const isPendingForMe = !isRequester // 自分が招待された側
    return (
      <div
        className="flex flex-col h-full"
        style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
      >
        {/* ヘッダー */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: '#D4C4B0' }}
        >
          <button onClick={onClose} className="p-2 -ml-2">
            <CloseIcon size={20} color="#8B5A2B" />
          </button>
          <h2 className="font-bold" style={{ color: '#8B5A2B' }}>こうかんの招待</h2>
          <div className="w-8" />
        </div>

        {/* コンテンツ */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {/* パートナーアバター */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden mb-4"
            style={{ background: 'linear-gradient(135deg, #E8D5C4 0%, #D4C4B0 100%)' }}
          >
            {session.partner?.avatarUrl ? (
              <img src={session.partner.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={40} color="#8B5A2B" />
            )}
          </div>

          <h3 className="text-lg font-bold mb-2" style={{ color: '#8B5A2B' }}>
            {session.partner?.displayName || session.partner?.username}
          </h3>

          {isPendingForMe ? (
            <>
              <p className="text-sm text-center mb-6" style={{ color: '#A67C52' }}>
                からこうかんの招待がきています！
              </p>

              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    await asyncTradeService.declineInvitation(sessionId, userId)
                    onClose()
                  }}
                  className="px-6 py-2 rounded-xl font-bold transition-all active:scale-95"
                  style={{
                    background: 'rgba(212, 196, 176, 0.5)',
                    color: '#8B5A2B',
                  }}
                >
                  ことわる
                </button>
                <button
                  onClick={async () => {
                    await asyncTradeService.acceptInvitation(sessionId, userId)
                    fetchData()
                  }}
                  className="px-6 py-2 rounded-xl font-bold text-white transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
                    boxShadow: '0 2px 8px rgba(184, 149, 107, 0.4)',
                  }}
                >
                  うけとる！
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-center" style={{ color: '#A67C52' }}>
              招待のへんじをまっています...
            </p>
          )}
        </div>
      </div>
    )
  }

  // completed状態
  if (session.status === 'completed') {
    return (
      <div
        className="flex flex-col h-full items-center justify-center p-6"
        style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
      >
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#8B5A2B' }}>
          こうかんせいりつ！
        </h2>
        <p className="text-sm text-center mb-6" style={{ color: '#A67C52' }}>
          {session.partner?.displayName || session.partner?.username} との交換が成立しました！
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-xl font-bold text-white transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
            boxShadow: '0 2px 8px rgba(184, 149, 107, 0.4)',
          }}
        >
          とじる
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
      {/* ヘッダー */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: '#D4C4B0' }}
      >
        <button onClick={onClose} className="p-2 -ml-2">
          <CloseIcon size={20} color="#8B5A2B" />
        </button>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #E8D5C4 0%, #D4C4B0 100%)' }}
            >
              {session.partner?.avatarUrl ? (
                <img src={session.partner.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={16} color="#8B5A2B" />
              )}
            </div>
            {isPartnerOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
            )}
          </div>
          <span className="font-bold" style={{ color: '#8B5A2B' }}>
            {session.partner?.displayName || session.partner?.username}
          </span>
        </div>
        <button
          onClick={handleCancel}
          className="text-xs px-2 py-1 rounded"
          style={{ color: '#E74C3C' }}
        >
          キャンセル
        </button>
      </div>

      {/* 交換エリア */}
      <div className="flex-shrink-0 p-4 border-b" style={{ borderColor: '#D4C4B0', background: 'rgba(248, 244, 240, 0.5)' }}>
        {/* 相手のオファー */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: '#8B5A2B' }}>
                {session.partner?.displayName || session.partner?.username} のシール
              </span>
              <StatusBadge confirmed={partnerConfirmed} isMe={false} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {partnerOffers.map(offer => (
              <StickerCard key={offer.id} sticker={offer.sticker} />
            ))}
            {partnerOffers.length === 0 && (
              <p className="text-xs" style={{ color: '#A67C52' }}>
                まだシールがありません
              </p>
            )}
          </div>
        </div>

        {/* 区切り線 */}
        <div className="flex items-center gap-2 my-3">
          <div className="flex-1 h-px" style={{ background: '#D4C4B0' }} />
          <span className="text-xl">↕️</span>
          <div className="flex-1 h-px" style={{ background: '#D4C4B0' }} />
        </div>

        {/* 自分のオファー */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold" style={{ color: '#8B5A2B' }}>
                あなたのシール
              </span>
              <StatusBadge confirmed={myConfirmed} isMe={true} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {myOffers.map(offer => (
              <StickerCard
                key={offer.id}
                sticker={offer.sticker}
                showRemove={!myConfirmed}
                onRemove={() => handleRemoveOffer(offer.userStickerId)}
              />
            ))}
            {!myConfirmed && <AddStickerButton onClick={() => onSelectSticker('offer')} />}
          </div>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === userId} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="flex-shrink-0 p-4 border-t" style={{ borderColor: '#D4C4B0', background: 'rgba(248, 244, 240, 0.5)' }}>
        {/* 定型メッセージパネル */}
        {showPresets && (
          <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b" style={{ borderColor: '#D4C4B0' }}>
            {(Object.keys(TRADE_PRESET_MESSAGES) as PresetMessageKey[]).map(key => (
              <PresetMessageButton
                key={key}
                presetKey={key}
                onClick={() => handleSendPreset(key)}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* メッセージボタン */}
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
            style={{
              background: showPresets ? '#C4956A' : 'rgba(212, 196, 176, 0.5)',
              color: showPresets ? 'white' : '#8B5A2B',
            }}
          >
            💬
          </button>

          {/* 確認/取り消しボタン */}
          {myConfirmed ? (
            <button
              onClick={handleUnconfirm}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: 'rgba(212, 196, 176, 0.5)',
                color: '#8B5A2B',
              }}
            >
              確認をとりけす
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={!canConfirm || isConfirming}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all active:scale-95 disabled:opacity-50"
              style={{
                background: canConfirm
                  ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                  : 'rgba(158, 158, 158, 0.5)',
                boxShadow: canConfirm ? '0 2px 8px rgba(76, 175, 80, 0.4)' : 'none',
              }}
            >
              {isConfirming ? '...' : partnerConfirmed ? 'これでOK！（成立）' : 'これでOK！'}
            </button>
          )}
        </div>

        {/* ヒント */}
        {!myConfirmed && !canConfirm && (
          <p className="text-xs text-center mt-2" style={{ color: '#A67C52' }}>
            お互いにシールを出すと「これでOK！」が押せます
          </p>
        )}
        {partnerConfirmed && !myConfirmed && (
          <p className="text-xs text-center mt-2" style={{ color: '#2E7D32' }}>
            相手は確認済みです！あなたも確認すると交換が成立します
          </p>
        )}
      </div>
    </div>
  )
}

export default AsyncTradeSessionView
