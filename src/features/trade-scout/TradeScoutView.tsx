'use client'

import {
  TradeScoutState,
  ScoutMatch,
  MAX_WANT_LIST,
  MAX_OFFER_LIST,
  getScoutStatusText,
} from '@/domain/tradeScout'

interface TradeScoutViewProps {
  state: TradeScoutState
  onOpenWantListEdit: () => void
  onOpenOfferListEdit: () => void
  onToggleActive: (active: boolean) => void
  onViewMatch: (match: ScoutMatch) => void
  onStartTrade: (match: ScoutMatch) => void
}

/**
 * トレード・スカウトのメインビュー
 * 欲しいシールと出せるシールを登録して自動マッチング！
 */
export function TradeScoutView({
  state,
  onOpenWantListEdit,
  onOpenOfferListEdit,
  onToggleActive,
  onViewMatch,
  onStartTrade,
}: TradeScoutViewProps) {
  const unreadCount = state.matches.filter(m => !m.isRead).length
  const statusText = getScoutStatusText(state)

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
        <h1 className="text-xl font-bold mb-1" style={{ color: '#8B5A2B' }}>
          🔍 トレード・スカウト
        </h1>
        <p className="text-sm" style={{ color: '#A67C52' }}>
          ほしいシールをとうろくすると自動でさがすよ！
        </p>
      </div>

      {/* スカウト状態カード */}
      <div className="pb-4">
        <div
          className="rounded-2xl p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 15px rgba(184, 149, 107, 0.2)',
            border: '3px solid #D4C4B0',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: state.settings.isActive ? '#7DAF72' : '#D1D5DB',
                  animation: state.settings.isActive ? 'pulse 2s infinite' : 'none',
                }}
              />
              <span className="text-sm font-bold" style={{ color: '#8B5A2B' }}>
                {statusText}
              </span>
            </div>
            <button
              onClick={() => onToggleActive(!state.settings.isActive)}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
              style={{
                background: state.settings.isActive
                  ? '#E5E7EB'
                  : 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
                color: state.settings.isActive ? '#6B7280' : 'white',
                boxShadow: state.settings.isActive ? 'none' : '0 4px 15px rgba(184, 149, 107, 0.4)',
              }}
            >
              {state.settings.isActive ? 'ていし' : 'スタート'}
            </button>
          </div>

          {/* 欲しいシールリスト */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold" style={{ color: '#8B5A2B' }}>
                💚 ほしいシール ({state.settings.wantList.length}/{MAX_WANT_LIST})
              </span>
              <button
                onClick={onOpenWantListEdit}
                className="text-xs font-bold"
                style={{ color: '#A67C52' }}
              >
                へんしゅう
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {state.settings.wantList.length === 0 ? (
                <button
                  onClick={onOpenWantListEdit}
                  className="w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center text-2xl transition-colors"
                  style={{ borderColor: '#C4A484', color: '#C4A484' }}
                >
                  +
                </button>
              ) : (
                state.settings.wantList.map(sticker => (
                  <div
                    key={sticker.stickerId}
                    className="flex-shrink-0 w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden"
                    style={{ border: '2px solid #D4C4B0' }}
                  >
                    {sticker.stickerImageUrl ? (
                      <img src={sticker.stickerImageUrl} alt={sticker.stickerName} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">🏷️</span>
                    )}
                  </div>
                ))
              )}
              {state.settings.wantList.length > 0 && state.settings.wantList.length < MAX_WANT_LIST && (
                <button
                  onClick={onOpenWantListEdit}
                  className="flex-shrink-0 w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center text-xl transition-colors"
                  style={{ borderColor: '#C4A484', color: '#C4A484' }}
                >
                  +
                </button>
              )}
            </div>
          </div>

          {/* 出せるシールリスト */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold" style={{ color: '#A67C52' }}>
                🤝 だせるシール ({state.settings.offerList.length}/{MAX_OFFER_LIST})
              </span>
              <button
                onClick={onOpenOfferListEdit}
                className="text-xs font-bold"
                style={{ color: '#B8956B' }}
              >
                へんしゅう
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {state.settings.offerList.length === 0 ? (
                <button
                  onClick={onOpenOfferListEdit}
                  className="w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center text-2xl transition-colors"
                  style={{ borderColor: '#D4C4B0', color: '#D4C4B0' }}
                >
                  +
                </button>
              ) : (
                state.settings.offerList.map(sticker => (
                  <div
                    key={sticker.stickerId}
                    className="flex-shrink-0 w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden"
                    style={{ border: '2px solid #E8D5C4' }}
                  >
                    {sticker.stickerImageUrl ? (
                      <img src={sticker.stickerImageUrl} alt={sticker.stickerName} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">🏷️</span>
                    )}
                  </div>
                ))
              )}
              {state.settings.offerList.length > 0 && state.settings.offerList.length < MAX_OFFER_LIST && (
                <button
                  onClick={onOpenOfferListEdit}
                  className="flex-shrink-0 w-14 h-14 rounded-xl border-2 border-dashed flex items-center justify-center text-xl transition-colors"
                  style={{ borderColor: '#D4C4B0', color: '#D4C4B0' }}
                >
                  +
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* マッチング結果 */}
      <div className="pb-4">
        <h3
          className="text-base font-bold mb-3 flex items-center gap-2"
          style={{ color: '#8B5A2B' }}
        >
          ✨ マッチング
          {unreadCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs text-white"
              style={{ background: '#7DAF72' }}
            >
              {unreadCount}けん
            </span>
          )}
        </h3>

        {state.matches.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '2px dashed #D4C4B0',
            }}
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-bold mb-2" style={{ color: '#8B5A2B' }}>
              まだマッチングがないよ
            </p>
            <p className="text-sm" style={{ color: '#A67C52' }}>
              シールをとうろくしてスカウト開始！
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.matches.map(match => (
              <div
                key={match.id}
                className="rounded-xl p-4 transition-all"
                style={{
                  background: match.isRead
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'linear-gradient(135deg, #FFF8F0 0%, #F5EDE6 100%)',
                  border: match.isRead ? '2px solid #E8D5C4' : '2px solid #C4956A',
                  boxShadow: match.isRead
                    ? '0 2px 8px rgba(184, 149, 107, 0.1)'
                    : '0 4px 15px rgba(196, 149, 106, 0.3)',
                }}
              >
                {!match.isRead && (
                  <div className="flex items-center gap-1 mb-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ background: '#C4956A' }}
                    >
                      NEW
                    </span>
                  </div>
                )}

                {/* ユーザー情報 */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{ background: 'linear-gradient(135deg, #E8D5C4 0%, #D4C4B0 100%)' }}
                  >
                    😊
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate" style={{ color: '#8B5A2B' }}>
                      {match.user.name}
                    </div>
                    <div className="text-xs" style={{ color: '#A67C52' }}>
                      Lv.{match.user.level} • マッチ度 {match.matchScore}
                    </div>
                  </div>
                </div>

                {/* マッチ内容 */}
                <div className="flex gap-2 mb-3">
                  {match.theirOffersIWant.length > 0 && (
                    <div
                      className="flex-1 p-2 rounded-lg"
                      style={{ background: 'rgba(125, 175, 114, 0.15)' }}
                    >
                      <div className="text-[10px] mb-1" style={{ color: '#5A8A4A' }}>
                        もらえるかも
                      </div>
                      <div className="flex gap-1">
                        {match.theirOffersIWant.slice(0, 3).map(s => (
                          <div
                            key={s.stickerId}
                            className="w-8 h-8 rounded bg-white flex items-center justify-center overflow-hidden"
                          >
                            {s.stickerImageUrl ? (
                              <img src={s.stickerImageUrl} alt={s.stickerName} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-sm">🏷️</span>
                            )}
                          </div>
                        ))}
                        {match.theirOffersIWant.length > 3 && (
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center text-[10px]"
                            style={{ background: 'rgba(125, 175, 114, 0.2)', color: '#5A8A4A' }}
                          >
                            +{match.theirOffersIWant.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {match.myOffersTheyWant.length > 0 && (
                    <div
                      className="flex-1 p-2 rounded-lg"
                      style={{ background: 'rgba(184, 149, 107, 0.15)' }}
                    >
                      <div className="text-[10px] mb-1" style={{ color: '#8B5A2B' }}>
                        あげられるよ
                      </div>
                      <div className="flex gap-1">
                        {match.myOffersTheyWant.slice(0, 3).map(s => (
                          <div
                            key={s.stickerId}
                            className="w-8 h-8 rounded bg-white flex items-center justify-center overflow-hidden"
                          >
                            {s.stickerImageUrl ? (
                              <img src={s.stickerImageUrl} alt={s.stickerName} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-sm">🏷️</span>
                            )}
                          </div>
                        ))}
                        {match.myOffersTheyWant.length > 3 && (
                          <div
                            className="w-8 h-8 rounded flex items-center justify-center text-[10px]"
                            style={{ background: 'rgba(184, 149, 107, 0.2)', color: '#8B5A2B' }}
                          >
                            +{match.myOffersTheyWant.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* アクションボタン */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewMatch(match)}
                    className="flex-1 py-2 rounded-lg text-sm font-bold transition-all active:scale-95"
                    style={{ color: '#8B5A2B', background: 'rgba(184, 149, 107, 0.15)' }}
                  >
                    くわしく見る
                  </button>
                  <button
                    onClick={() => onStartTrade(match)}
                    className="flex-1 py-2 rounded-lg text-sm font-bold text-white shadow-md transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)' }}
                  >
                    こうかんする
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 説明 */}
      <div className="pb-6">
        <div
          className="p-4 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px dashed #D4C4B0',
          }}
        >
          <h4 className="text-sm font-bold mb-2 flex items-center gap-1" style={{ color: '#8B5A2B' }}>
            📖 つかいかた
          </h4>
          <ul className="text-xs space-y-1" style={{ color: '#A67C52' }}>
            <li>• ほしいシールを5まいまでとうろく</li>
            <li>• だせるシールを5まいまでとうろく</li>
            <li>• スカウトをオンにするとさがし始めるよ</li>
            <li>• マッチしたらすぐにこうかんできる！</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TradeScoutView
