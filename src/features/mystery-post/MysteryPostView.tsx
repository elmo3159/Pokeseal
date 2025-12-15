'use client'

import { useState, useCallback } from 'react'
import {
  MysteryPostState,
  PostedSticker,
  ReceivedSticker,
  PRESET_MESSAGES,
  PresetMessage,
  canPostToday,
  formatTimeUntilDelivery,
  getNextDeliveryTime,
} from '@/domain/mysteryPost'

interface MysteryPostViewProps {
  /** ユーザーのミステリーポスト状態 */
  state: MysteryPostState
  /** 投函モーダルを開く */
  onOpenPostModal: () => void
  /** 届いたシールを開封 */
  onOpenReceived: (sticker: ReceivedSticker) => void
  /** 投函をキャンセル */
  onCancelPost: (postId: string) => void
}

/**
 * ミステリーポスト（闘鍋交換会）のメインビュー
 * ダブりシールを投函して、ランダムなシールをもらおう！
 */
export function MysteryPostView({
  state,
  onOpenPostModal,
  onOpenReceived,
  onCancelPost,
}: MysteryPostViewProps) {
  const canPost = canPostToday(state)
  const unopenedCount = state.receivedStickers.filter(s => !s.isOpened).length
  const nextDelivery = state.nextDeliveryTime || getNextDeliveryTime()

  return (
    <div
      className="h-full overflow-y-auto pb-24"
      style={{
        background: 'linear-gradient(180deg, #FFF5F8 0%, #F3E8FF 100%)',
      }}
    >
      {/* ヘッダー */}
      <div
        className="px-4 py-6 text-center"
        style={{
          background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
        }}
      >
        <h1
          className="text-2xl font-bold text-white mb-2"
          style={{
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          📮 ミステリーポスト
        </h1>
        <p
          className="text-sm text-white/90"
          style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
        >
          シールを投函すると、だれかのシールがとどくよ！
        </p>
      </div>

      {/* 投函ボタンエリア */}
      <div className="px-4 py-6">
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FDF2F8 100%)',
            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.15)',
            border: '2px solid #F9A8D4',
          }}
        >
          {canPost ? (
            <>
              <div className="text-6xl mb-4">📬</div>
              <h2
                className="text-lg font-bold text-purple-700 mb-2"
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                今日のシールをとうかんしよう！
              </h2>
              <p
                className="text-sm text-purple-500 mb-4"
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                ダブりシールを1まい投函できるよ
              </p>
              <button
                onClick={onOpenPostModal}
                className="px-8 py-3 rounded-full text-white font-bold text-lg transition-all duration-200 active:scale-95 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                }}
              >
                ✉️ とうかんする
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">📭</div>
              <h2
                className="text-lg font-bold text-purple-700 mb-2"
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                今日はもうとうかんしたよ！
              </h2>
              <p
                className="text-sm text-purple-500 mb-2"
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                つぎのとうかんは明日から
              </p>
              {state.todayPosted && (
                <div
                  className="mt-4 p-3 rounded-xl inline-flex items-center gap-3"
                  style={{ background: 'rgba(168, 85, 247, 0.1)' }}
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-200 flex items-center justify-center overflow-hidden">
                    {state.todayPosted.stickerImageUrl ? (
                      <img src={state.todayPosted.stickerImageUrl} alt={state.todayPosted.stickerName} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">🏷️</span>
                    )}
                  </div>
                  <div className="text-left">
                    <div
                      className="text-sm font-bold text-purple-700"
                      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                    >
                      {state.todayPosted.stickerName}
                    </div>
                    <div className="text-xs text-purple-500">
                      {'★'.repeat(state.todayPosted.rarity)}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 届いたシールエリア */}
      {state.receivedStickers.length > 0 && (
        <div className="px-4 pb-6">
          <h3
            className="text-base font-bold text-purple-700 mb-3 flex items-center gap-2"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            🎁 とどいたシール
            {unopenedCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs text-white"
                style={{ background: '#EC4899' }}
              >
                {unopenedCount}まい
              </span>
            )}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {state.receivedStickers.map(sticker => (
              <button
                key={sticker.id}
                onClick={() => onOpenReceived(sticker)}
                className={`
                  relative rounded-xl p-4 text-left
                  transition-all duration-200 active:scale-95
                  ${sticker.isOpened
                    ? 'bg-white/70'
                    : 'bg-gradient-to-br from-pink-100 to-purple-100 ring-2 ring-pink-300'
                  }
                `}
                style={{
                  boxShadow: sticker.isOpened
                    ? '0 2px 8px rgba(0,0,0,0.05)'
                    : '0 4px 15px rgba(236, 72, 153, 0.3)',
                }}
              >
                {!sticker.isOpened && (
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-lg animate-bounce"
                    style={{
                      background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
                    }}
                  >
                    ✨
                  </div>
                )}
                <div
                  className={`
                    w-full aspect-square rounded-lg mb-2 flex items-center justify-center overflow-hidden
                    ${sticker.isOpened ? 'bg-purple-100' : 'bg-white'}
                  `}
                >
                  {sticker.isOpened ? (
                    sticker.stickerImageUrl ? (
                      <img src={sticker.stickerImageUrl} alt={sticker.stickerName} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-3xl">🏷️</span>
                    )
                  ) : (
                    <span className="text-3xl">❓</span>
                  )}
                </div>
                <div
                  className="text-xs font-bold text-purple-700 truncate"
                  style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                >
                  {sticker.isOpened ? sticker.stickerName : '???'}
                </div>
                <div className="text-[10px] text-purple-500">
                  {sticker.isOpened
                    ? `${sticker.fromUserName}より`
                    : 'タップしてあける！'
                  }
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 投函中のシールエリア */}
      {state.pendingStickers.length > 0 && (
        <div className="px-4 pb-6">
          <h3
            className="text-base font-bold text-purple-700 mb-3 flex items-center gap-2"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            📤 とうかん中のシール
          </h3>
          <div className="space-y-2">
            {state.pendingStickers.map(sticker => (
              <div
                key={sticker.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/70"
                style={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center overflow-hidden">
                  {sticker.stickerImageUrl ? (
                    <img src={sticker.stickerImageUrl} alt={sticker.stickerName} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-2xl">🏷️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-bold text-purple-700 truncate"
                    style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                  >
                    {sticker.stickerName}
                  </div>
                  <div className="text-xs text-purple-500">
                    {'★'.repeat(sticker.rarity)} • マッチングちゅう...
                  </div>
                </div>
                <button
                  onClick={() => onCancelPost(sticker.id)}
                  className="text-xs text-pink-500 px-2 py-1 rounded-lg hover:bg-pink-50"
                >
                  キャンセル
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 次の配達時間 */}
      {(state.pendingStickers.length > 0 || state.todayPosted) && (
        <div className="px-4 pb-6">
          <div
            className="p-4 rounded-xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            }}
          >
            <div className="text-3xl mb-2">⏰</div>
            <div
              className="text-sm font-bold text-purple-700"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              つぎのおとどけまで
            </div>
            <div
              className="text-lg font-bold text-pink-500"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              {formatTimeUntilDelivery(nextDelivery)}
            </div>
          </div>
        </div>
      )}

      {/* ルール説明 */}
      <div className="px-4 pb-6">
        <div
          className="p-4 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.7)',
            border: '1px dashed #D8B4FE',
          }}
        >
          <h4
            className="text-sm font-bold text-purple-700 mb-2 flex items-center gap-1"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            📖 あそびかた
          </h4>
          <ul
            className="text-xs text-purple-600 space-y-1"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            <li>• 1日1まいシールをとうかんできるよ</li>
            <li>• おなじくらいのレア度のシールがとどくよ</li>
            <li>• だれからとどくかはヒミツ✨</li>
            <li>• メッセージもいっしょにとどくよ</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MysteryPostView
