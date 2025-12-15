'use client'

import { useState, useEffect, useCallback } from 'react'
import { ReceivedSticker } from '@/domain/mysteryPost'
import { playSound } from '@/utils/sound'

interface ReceivedStickerModalProps {
  isOpen: boolean
  onClose: () => void
  /** 開封するシール */
  sticker: ReceivedSticker | null
  /** 開封完了コールバック */
  onOpened: (stickerId: string) => void
}

/**
 * 届いたシール開封モーダル
 * ワクワク感のある演出で開封！
 */
export function ReceivedStickerModal({
  isOpen,
  onClose,
  sticker,
  onOpened,
}: ReceivedStickerModalProps) {
  const [phase, setPhase] = useState<'sealed' | 'opening' | 'revealed'>('sealed')

  // モーダルが開いたらリセット
  useEffect(() => {
    if (isOpen && sticker) {
      setPhase(sticker.isOpened ? 'revealed' : 'sealed')
    }
  }, [isOpen, sticker])

  // 開封アニメーション
  const handleOpen = useCallback(() => {
    if (phase !== 'sealed' || !sticker) return

    setPhase('opening')
    playSound('peel')

    // 開封アニメーション後に結果表示
    setTimeout(() => {
      setPhase('revealed')
      playSound('sparkle')
      onOpened(sticker.id)
    }, 1000)
  }, [phase, sticker, onOpened])

  if (!isOpen || !sticker) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.6)' }}
      onClick={phase === 'revealed' ? onClose : undefined}
    >
      <div
        className="w-[90%] max-w-[340px] rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FDF2F8 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 封をした状態 */}
        {phase === 'sealed' && (
          <div className="p-6 text-center">
            {/* 封筒アニメーション */}
            <div
              className="relative w-48 h-48 mx-auto mb-6"
              style={{
                animation: 'float 2s ease-in-out infinite',
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #F9A8D4 0%, #F472B6 100%)',
                  boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)',
                }}
              >
                <div className="text-8xl">✉️</div>
              </div>
              {/* キラキラエフェクト */}
              <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
              <div className="absolute -bottom-2 -left-2 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</div>
            </div>

            <h2
              className="text-xl font-bold text-purple-700 mb-2"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              ふしぎなおてがみがとどいたよ！
            </h2>
            <p
              className="text-sm text-purple-500 mb-6"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              タップしてあけてみよう✨
            </p>

            <button
              onClick={handleOpen}
              className="px-8 py-4 rounded-full text-white font-bold text-lg transition-all duration-200 active:scale-95 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            >
              🎁 あける！
            </button>
          </div>
        )}

        {/* 開封中アニメーション */}
        {phase === 'opening' && (
          <div className="p-6 text-center">
            <div
              className="w-48 h-48 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                animation: 'shake 0.5s ease-in-out',
              }}
            >
              <div
                className="text-8xl"
                style={{
                  animation: 'spin 0.5s ease-out',
                }}
              >
                🌟
              </div>
            </div>
            <h2
              className="text-xl font-bold text-yellow-600"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              ドキドキ...！
            </h2>
          </div>
        )}

        {/* 結果表示 */}
        {phase === 'revealed' && (
          <div className="p-6 text-center">
            {/* シール表示 */}
            <div
              className="w-32 h-32 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-white shadow-xl overflow-hidden"
              style={{
                animation: 'bounceIn 0.5s ease-out',
              }}
            >
              {sticker.stickerImageUrl ? (
                <img src={sticker.stickerImageUrl} alt={sticker.stickerName} className="w-full h-full object-contain" />
              ) : (
                <div className="text-7xl">🏷️</div>
              )}
            </div>

            {/* シール名 */}
            <h2
              className="text-xl font-bold text-purple-700 mb-1"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              {sticker.stickerName}
            </h2>
            <div className="text-lg text-yellow-500 mb-4">
              {'★'.repeat(sticker.rarity)}
            </div>

            {/* メッセージ */}
            <div
              className="inline-block px-6 py-3 rounded-2xl mb-4"
              style={{
                background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
                border: '2px solid #F9A8D4',
              }}
            >
              <p
                className="text-sm text-purple-600 mb-1"
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                {sticker.fromUserName}より
              </p>
              <p
                className="font-bold text-purple-700"
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                「{sticker.message}」
              </p>
            </div>

            {/* 閉じるボタン */}
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full font-bold text-white transition-all active:scale-95 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
              }}
            >
              やったー！ ✨
            </button>
          </div>
        )}
      </div>

      {/* CSS アニメーション */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg) scale(0.5); opacity: 0; }
          to { transform: rotate(360deg) scale(1); opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

export default ReceivedStickerModal
