'use client'

import {
  MysteryPostState,
  ReceivedSticker,
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
      className="h-full overflow-y-auto pb-24 px-4"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* ヘッダーカード */}
      <div
        className="rounded-2xl p-4 text-center mt-4 mb-4"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          border: '3px solid #B8956B',
          boxShadow: '0 0 10px 3px rgba(184, 149, 107, 0.3)',
        }}
      >
        <h1
          className="text-xl font-bold mb-1"
          style={{ color: '#8B5A2B' }}
        >
          📮 ミステリーポスト
        </h1>
        <p className="text-sm" style={{ color: '#A67C52' }}>
          シールを投函すると、だれかのシールがとどくよ！
        </p>
      </div>

      {/* 投函ボタンエリア */}
      <div className="pb-4">
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 15px rgba(184, 149, 107, 0.2)',
            border: '3px solid #D4C4B0',
          }}
        >
          {canPost ? (
            <>
              <div className="text-6xl mb-4">📬</div>
              <h2 className="text-lg font-bold mb-2" style={{ color: '#8B5A2B' }}>
                今日のシールをとうかんしよう！
              </h2>
              <p className="text-sm mb-4" style={{ color: '#A67C52' }}>
                ダブりシールを1まい投函できるよ
              </p>
              <button
                onClick={onOpenPostModal}
                className="px-8 py-3 rounded-full text-white font-bold text-lg transition-all duration-200 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
                  boxShadow: '0 4px 15px rgba(184, 149, 107, 0.4)',
                }}
              >
                ✉️ とうかんする
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-lg font-bold mb-2" style={{ color: '#8B5A2B' }}>
                今日はもうとうかんしたよ！
              </h2>
              <p className="text-sm mb-2" style={{ color: '#A67C52' }}>
                つぎのとうかんは明日から
              </p>
              {state.todayPosted && (
                <div
                  className="mt-4 p-3 rounded-xl inline-flex items-center gap-3"
                  style={{ background: 'rgba(184, 149, 107, 0.15)' }}
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{ background: '#E8D5C4' }}
                  >
                    {state.todayPosted.stickerImageUrl ? (
                      <img src={state.todayPosted.stickerImageUrl} alt={state.todayPosted.stickerName} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">🏷️</span>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold" style={{ color: '#8B5A2B' }}>
                      {state.todayPosted.stickerName}
                    </div>
                    <div className="text-xs" style={{ color: '#C4956A' }}>
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
        <div className="pb-4">
          <h3
            className="text-base font-bold mb-3 flex items-center gap-2"
            style={{ color: '#8B5A2B' }}
          >
            🎁 とどいたシール
            {unopenedCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs text-white"
                style={{ background: '#D4764A' }}
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
                className="relative rounded-xl p-4 text-left transition-all duration-200 active:scale-95"
                style={{
                  background: sticker.isOpened
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'linear-gradient(135deg, #FFF8F0 0%, #F5EDE6 100%)',
                  border: sticker.isOpened
                    ? '2px solid #E8D5C4'
                    : '2px solid #C4956A',
                  boxShadow: sticker.isOpened
                    ? '0 2px 8px rgba(184, 149, 107, 0.1)'
                    : '0 4px 15px rgba(196, 149, 106, 0.3)',
                }}
              >
                {!sticker.isOpened && (
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-lg animate-bounce"
                    style={{
                      background: 'linear-gradient(135deg, #D4A574 0%, #C4956A 100%)',
                    }}
                  >
                    ✨
                  </div>
                )}
                <div
                  className="w-full aspect-square rounded-lg mb-2 flex items-center justify-center overflow-hidden"
                  style={{
                    background: sticker.isOpened ? '#F5EDE6' : 'white',
                  }}
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
                <div className="text-xs font-bold truncate" style={{ color: '#8B5A2B' }}>
                  {sticker.isOpened ? sticker.stickerName : '???'}
                </div>
                <div className="text-[10px]" style={{ color: '#A67C52' }}>
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
        <div className="pb-4">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: '#8B5A2B' }}>
            📤 とうかん中のシール
          </h3>
          <div className="space-y-2">
            {state.pendingStickers.map(sticker => (
              <div
                key={sticker.id}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #E8D5C4',
                  boxShadow: '0 2px 8px rgba(184, 149, 107, 0.1)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden"
                  style={{ background: '#F5EDE6' }}
                >
                  {sticker.stickerImageUrl ? (
                    <img src={sticker.stickerImageUrl} alt={sticker.stickerName} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-2xl">🏷️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: '#8B5A2B' }}>
                    {sticker.stickerName}
                  </div>
                  <div className="text-xs" style={{ color: '#A67C52' }}>
                    {'★'.repeat(sticker.rarity)} • マッチングちゅう...
                  </div>
                </div>
                <button
                  onClick={() => onCancelPost(sticker.id)}
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{ color: '#D4764A', background: 'rgba(212, 118, 74, 0.1)' }}
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
        <div className="pb-4">
          <div
            className="p-4 rounded-xl text-center"
            style={{
              background: 'rgba(184, 149, 107, 0.1)',
              border: '2px solid #E8D5C4',
            }}
          >
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-sm font-bold" style={{ color: '#8B5A2B' }}>
              つぎのおとどけまで
            </div>
            <div className="text-lg font-bold" style={{ color: '#C4956A' }}>
              {formatTimeUntilDelivery(nextDelivery)}
            </div>
          </div>
        </div>
      )}

      {/* ルール説明 */}
      <div className="pb-6">
        <div
          className="p-4 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px dashed #D4C4B0',
          }}
        >
          <h4 className="text-sm font-bold mb-2 flex items-center gap-1" style={{ color: '#8B5A2B' }}>
            📖 あそびかた
          </h4>
          <ul className="text-xs space-y-1" style={{ color: '#A67C52' }}>
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
