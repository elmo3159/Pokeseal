'use client'

import { useState, useCallback } from 'react'
import { PRESET_MESSAGES, PresetMessage } from '@/domain/mysteryPost'

interface StickerOption {
  id: string
  name: string
  imageUrl: string
  rarity: number
  count: number // ダブり数
}

interface PostStickerModalProps {
  isOpen: boolean
  onClose: () => void
  /** ダブりシール一覧 */
  duplicateStickers: StickerOption[]
  /** 投函実行 */
  onPost: (stickerId: string, message: PresetMessage) => void
}

/**
 * シール投函モーダル
 * ダブりシールを選んでメッセージを添えて投函
 */
export function PostStickerModal({
  isOpen,
  onClose,
  duplicateStickers,
  onPost,
}: PostStickerModalProps) {
  const [selectedSticker, setSelectedSticker] = useState<StickerOption | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<PresetMessage>(PRESET_MESSAGES[0])
  const [step, setStep] = useState<'select' | 'message' | 'confirm'>('select')

  // モーダルを閉じるときにリセット
  const handleClose = useCallback(() => {
    setSelectedSticker(null)
    setSelectedMessage(PRESET_MESSAGES[0])
    setStep('select')
    onClose()
  }, [onClose])

  // シール選択
  const handleSelectSticker = useCallback((sticker: StickerOption) => {
    setSelectedSticker(sticker)
    setStep('message')
  }, [])

  // メッセージ選択後、確認へ
  const handleSelectMessage = useCallback((message: PresetMessage) => {
    setSelectedMessage(message)
    setStep('confirm')
  }, [])

  // 投函実行
  const handlePost = useCallback(() => {
    if (selectedSticker) {
      onPost(selectedSticker.id, selectedMessage)
      handleClose()
    }
  }, [selectedSticker, selectedMessage, onPost, handleClose])

  // 戻る
  const handleBack = useCallback(() => {
    if (step === 'message') {
      setStep('select')
    } else if (step === 'confirm') {
      setStep('message')
    }
  }, [step])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F8 100%)',
          maxHeight: '85vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          className="px-4 py-4 flex items-center justify-between"
          style={{
            background: 'linear-gradient(90deg, #EC4899 0%, #A855F7 100%)',
          }}
        >
          {step !== 'select' && (
            <button
              onClick={handleBack}
              className="text-white font-bold text-sm"
            >
              ← もどる
            </button>
          )}
          <h2
            className={`text-lg font-bold text-white ${step === 'select' ? '' : 'flex-1 text-center'}`}
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            {step === 'select' && '✉️ シールをえらぼう'}
            {step === 'message' && '💬 メッセージをえらぼう'}
            {step === 'confirm' && '📮 とうかんかくにん'}
          </h2>
          <button
            onClick={handleClose}
            className="text-white text-2xl leading-none hover:opacity-70"
          >
            ×
          </button>
        </div>

        {/* ステップ1: シール選択 */}
        {step === 'select' && (
          <div className="p-4 overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {duplicateStickers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😢</div>
                <p
                  className="text-purple-600 font-bold"
                  style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                >
                  ダブりシールがないよ
                </p>
                <p
                  className="text-sm text-purple-400 mt-2"
                  style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                >
                  ガチャでシールをあつめよう！
                </p>
              </div>
            ) : (
              <>
                <p
                  className="text-sm text-purple-600 mb-4 text-center"
                  style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                >
                  とうかんするシールをえらんでね
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {duplicateStickers.map(sticker => (
                    <button
                      key={sticker.id}
                      onClick={() => handleSelectSticker(sticker)}
                      className="relative rounded-xl p-3 bg-white transition-all duration-200 active:scale-95 hover:ring-2 hover:ring-pink-300"
                      style={{
                        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                      }}
                    >
                      {/* ダブり数バッジ */}
                      <div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{
                          background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
                        }}
                      >
                        ×{sticker.count}
                      </div>
                      <div className="w-full aspect-square rounded-lg bg-purple-50 mb-2 flex items-center justify-center overflow-hidden">
                        {sticker.imageUrl ? (
                          <img src={sticker.imageUrl} alt={sticker.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-3xl">🏷️</span>
                        )}
                      </div>
                      <div
                        className="text-xs font-bold text-purple-700 truncate"
                        style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                      >
                        {sticker.name}
                      </div>
                      <div className="text-[10px] text-yellow-500">
                        {'★'.repeat(sticker.rarity)}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ステップ2: メッセージ選択 */}
        {step === 'message' && (
          <div className="p-4 overflow-y-auto" style={{ maxHeight: '60vh' }}>
            <p
              className="text-sm text-purple-600 mb-4 text-center"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              シールといっしょにおくるメッセージ💌
            </p>
            <div className="space-y-2">
              {PRESET_MESSAGES.map(message => (
                <button
                  key={message}
                  onClick={() => handleSelectMessage(message)}
                  className={`
                    w-full p-4 rounded-xl text-left transition-all duration-200
                    ${selectedMessage === message
                      ? 'bg-pink-100 ring-2 ring-pink-400'
                      : 'bg-white hover:bg-pink-50'
                    }
                  `}
                  style={{
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <span
                    className="font-bold text-purple-700"
                    style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                  >
                    「{message}」
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ステップ3: 確認 */}
        {step === 'confirm' && selectedSticker && (
          <div className="p-6">
            <div
              className="rounded-2xl p-6 text-center mb-6"
              style={{
                background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
                border: '2px dashed #F9A8D4',
              }}
            >
              {/* 封筒イラスト */}
              <div className="text-6xl mb-4">✉️</div>

              {/* シール情報 */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden">
                  {selectedSticker.imageUrl ? (
                    <img src={selectedSticker.imageUrl} alt={selectedSticker.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-3xl">🏷️</span>
                  )}
                </div>
                <div className="text-left">
                  <div
                    className="font-bold text-purple-700"
                    style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                  >
                    {selectedSticker.name}
                  </div>
                  <div className="text-sm text-yellow-500">
                    {'★'.repeat(selectedSticker.rarity)}
                  </div>
                </div>
              </div>

              {/* メッセージ */}
              <div
                className="inline-block px-4 py-2 rounded-full bg-white"
                style={{
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  color: '#7C3AED',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                💬 「{selectedMessage}」
              </div>
            </div>

            <p
              className="text-sm text-purple-500 text-center mb-6"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              このシールをとうかんする？<br />
              だれかにとどけられるよ！
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-full font-bold bg-gray-200 text-gray-600 transition-all active:scale-95"
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
              >
                やめる
              </button>
              <button
                onClick={handlePost}
                className="flex-1 py-3 rounded-full font-bold text-white transition-all active:scale-95 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                }}
              >
                📮 とうかんする！
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PostStickerModal
