'use client'

import { useState, useCallback } from 'react'
import {
  TradeScoutState,
  ScoutSticker,
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
    <div className="h-full overflow-y-auto pb-24" style={{ background: 'linear-gradient(180deg, #F0FDF4 0%, #ECFDF5 50%, #F0FDFA 100%)' }}>
      {/* ヘッダー */}
      <div className="px-4 py-6 text-center" style={{ background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)' }}>
        <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif", textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          🔍 トレード・スカウト
        </h1>
        <p className="text-sm text-white/90" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
          ほしいシールをとうろくすると自動でさがすよ！
        </p>
      </div>

      {/* スカウト状態カード */}
      <div className="px-4 py-4">
        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)', border: '2px solid #A7F3D0' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${state.settings.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-sm font-bold text-emerald-700" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                {statusText}
              </span>
            </div>
            <button onClick={() => onToggleActive(!state.settings.isActive)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 ${state.settings.isActive ? 'bg-gray-200 text-gray-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'}`} style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
              {state.settings.isActive ? 'ていし' : 'スタート'}
            </button>
          </div>

          {/* 欲しいシールリスト */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-emerald-700" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                💚 ほしいシール ({state.settings.wantList.length}/{MAX_WANT_LIST})
              </span>
              <button onClick={onOpenWantListEdit} className="text-xs text-emerald-500 font-bold" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                へんしゅう
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {state.settings.wantList.length === 0 ? (
                <button onClick={onOpenWantListEdit} className="w-14 h-14 rounded-xl border-2 border-dashed border-emerald-300 flex items-center justify-center text-emerald-400 text-2xl hover:bg-emerald-50 transition-colors">
                  +
                </button>
              ) : (
                state.settings.wantList.map(sticker => (
                  <div key={sticker.stickerId} className="flex-shrink-0 w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden" style={{ border: '2px solid #A7F3D0' }}>
                    {sticker.stickerImageUrl ? (
                      <img src={sticker.stickerImageUrl} alt={sticker.stickerName} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">🏷️</span>
                    )}
                  </div>
                ))
              )}
              {state.settings.wantList.length > 0 && state.settings.wantList.length < MAX_WANT_LIST && (
                <button onClick={onOpenWantListEdit} className="flex-shrink-0 w-14 h-14 rounded-xl border-2 border-dashed border-emerald-300 flex items-center justify-center text-emerald-400 text-xl hover:bg-emerald-50 transition-colors">
                  +
                </button>
              )}
            </div>
          </div>

          {/* 出せるシールリスト */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-teal-700" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                🤝 だせるシール ({state.settings.offerList.length}/{MAX_OFFER_LIST})
              </span>
              <button onClick={onOpenOfferListEdit} className="text-xs text-teal-500 font-bold" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                へんしゅう
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {state.settings.offerList.length === 0 ? (
                <button onClick={onOpenOfferListEdit} className="w-14 h-14 rounded-xl border-2 border-dashed border-teal-300 flex items-center justify-center text-teal-400 text-2xl hover:bg-teal-50 transition-colors">
                  +
                </button>
              ) : (
                state.settings.offerList.map(sticker => (
                  <div key={sticker.stickerId} className="flex-shrink-0 w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center overflow-hidden" style={{ border: '2px solid #99F6E4' }}>
                    {sticker.stickerImageUrl ? (
                      <img src={sticker.stickerImageUrl} alt={sticker.stickerName} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl">🏷️</span>
                    )}
                  </div>
                ))
              )}
              {state.settings.offerList.length > 0 && state.settings.offerList.length < MAX_OFFER_LIST && (
                <button onClick={onOpenOfferListEdit} className="flex-shrink-0 w-14 h-14 rounded-xl border-2 border-dashed border-teal-300 flex items-center justify-center text-teal-400 text-xl hover:bg-teal-50 transition-colors">
                  +
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* マッチング結果 */}
      <div className="px-4 pb-6">
        <h3 className="text-base font-bold text-emerald-700 mb-3 flex items-center gap-2" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
          ✨ マッチング
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs text-white" style={{ background: '#10B981' }}>
              {unreadCount}けん
            </span>
          )}
        </h3>

        {state.matches.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px dashed #A7F3D0' }}>
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-emerald-600 font-bold mb-2" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
              まだマッチングがないよ
            </p>
            <p className="text-sm text-emerald-500" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
              シールをとうろくしてスカウト開始！
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.matches.map(match => (
              <div key={match.id} className={`rounded-xl p-4 transition-all ${match.isRead ? 'bg-white/70' : 'bg-gradient-to-br from-emerald-50 to-teal-50 ring-2 ring-emerald-300'}`} style={{ boxShadow: match.isRead ? '0 2px 8px rgba(0,0,0,0.05)' : '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
                {!match.isRead && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-emerald-500">
                      NEW
                    </span>
                  </div>
                )}

                {/* ユーザー情報 */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-xl">
                    😊
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-emerald-700 truncate" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                      {match.user.name}
                    </div>
                    <div className="text-xs text-emerald-500">
                      Lv.{match.user.level} • マッチ度 {match.matchScore}
                    </div>
                  </div>
                </div>

                {/* マッチ内容 */}
                <div className="flex gap-2 mb-3">
                  {match.theirOffersIWant.length > 0 && (
                    <div className="flex-1 p-2 rounded-lg bg-emerald-50">
                      <div className="text-[10px] text-emerald-600 mb-1" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                        もらえるかも
                      </div>
                      <div className="flex gap-1">
                        {match.theirOffersIWant.slice(0, 3).map(s => (
                          <div key={s.stickerId} className="w-8 h-8 rounded bg-white flex items-center justify-center overflow-hidden">
                            {s.stickerImageUrl ? (
                              <img src={s.stickerImageUrl} alt={s.stickerName} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-sm">🏷️</span>
                            )}
                          </div>
                        ))}
                        {match.theirOffersIWant.length > 3 && (
                          <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-[10px] text-emerald-600">
                            +{match.theirOffersIWant.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {match.myOffersTheyWant.length > 0 && (
                    <div className="flex-1 p-2 rounded-lg bg-teal-50">
                      <div className="text-[10px] text-teal-600 mb-1" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                        あげられるよ
                      </div>
                      <div className="flex gap-1">
                        {match.myOffersTheyWant.slice(0, 3).map(s => (
                          <div key={s.stickerId} className="w-8 h-8 rounded bg-white flex items-center justify-center overflow-hidden">
                            {s.stickerImageUrl ? (
                              <img src={s.stickerImageUrl} alt={s.stickerName} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-sm">🏷️</span>
                            )}
                          </div>
                        ))}
                        {match.myOffersTheyWant.length > 3 && (
                          <div className="w-8 h-8 rounded bg-teal-100 flex items-center justify-center text-[10px] text-teal-600">
                            +{match.myOffersTheyWant.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* アクションボタン */}
                <div className="flex gap-2">
                  <button onClick={() => onViewMatch(match)} className="flex-1 py-2 rounded-lg text-sm font-bold text-emerald-600 bg-emerald-100 transition-all active:scale-95" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                    くわしく見る
                  </button>
                  <button onClick={() => onStartTrade(match)} className="flex-1 py-2 rounded-lg text-sm font-bold text-white shadow-md transition-all active:scale-95" style={{ background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)', fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                    こうかんする
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 説明 */}
      <div className="px-4 pb-6">
        <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.7)', border: '1px dashed #A7F3D0' }}>
          <h4 className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-1" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
            📖 つかいかた
          </h4>
          <ul className="text-xs text-emerald-600 space-y-1" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
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
