'use client'

import { useCallback } from 'react'
import { ScoutMatch, getRarityLabel } from '@/domain/tradeScout'

interface MatchDetailModalProps {
  isOpen: boolean
  onClose: () => void
  match: ScoutMatch | null
  onStartTrade: (match: ScoutMatch) => void
}

/**
 * マッチング詳細モーダル
 * マッチした相手の詳細を表示
 */
export function MatchDetailModal({
  isOpen,
  onClose,
  match,
  onStartTrade,
}: MatchDetailModalProps) {
  const handleStartTrade = useCallback(() => {
    if (match) {
      onStartTrade(match)
      onClose()
    }
  }, [match, onStartTrade, onClose])

  if (!isOpen || !match) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.6)' }} onClick={onClose}>
      <div className="w-[90%] max-w-[380px] rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FDF4 100%)' }} onClick={(e) => e.stopPropagation()}>
        {/* ヘッダー */}
        <div className="px-6 py-5 text-center" style={{ background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)' }}>
          <div className="text-5xl mb-2">🎯</div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif", textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            マッチング成功！
          </h2>
        </div>

        <div className="p-6">
          {/* ユーザー情報 */}
          <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-emerald-50">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-3xl shadow-lg">
              😊
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-700" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                {match.user.name}
              </div>
              <div className="text-sm text-emerald-500">
                Lv.{match.user.level}
              </div>
            </div>
          </div>

          {/* もらえるシール */}
          {match.theirOffersIWant.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-emerald-700 mb-2 flex items-center gap-1" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                💚 もらえるかも！
              </h3>
              <div className="space-y-2">
                {match.theirOffersIWant.map(sticker => (
                  <div key={sticker.stickerId} className="flex items-center gap-3 p-3 rounded-xl bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center overflow-hidden">
                      {sticker.stickerImageUrl ? (
                        <img src={sticker.stickerImageUrl} alt={sticker.stickerName} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-2xl">🏷️</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-emerald-700 truncate" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                        {sticker.stickerName}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-yellow-500">
                          {'★'.repeat(sticker.rarity)}
                        </span>
                        <span className="text-[10px] text-emerald-500">
                          {getRarityLabel(sticker.rarity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* あげられるシール */}
          {match.myOffersTheyWant.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-teal-700 mb-2 flex items-center gap-1" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                🤝 あげられるよ
              </h3>
              <div className="space-y-2">
                {match.myOffersTheyWant.map(sticker => (
                  <div key={sticker.stickerId} className="flex items-center gap-3 p-3 rounded-xl bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center overflow-hidden">
                      {sticker.stickerImageUrl ? (
                        <img src={sticker.stickerImageUrl} alt={sticker.stickerName} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-2xl">🏷️</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-teal-700 truncate" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
                        {sticker.stickerName}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-yellow-500">
                          {'★'.repeat(sticker.rarity)}
                        </span>
                        <span className="text-[10px] text-teal-500">
                          {getRarityLabel(sticker.rarity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 rounded-full font-bold bg-gray-200 text-gray-600 transition-all active:scale-95" style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
              あとで
            </button>
            <button onClick={handleStartTrade} className="flex-1 py-3 rounded-full font-bold text-white transition-all active:scale-95 shadow-lg" style={{ background: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)', fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
              こうかんする！
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchDetailModal
