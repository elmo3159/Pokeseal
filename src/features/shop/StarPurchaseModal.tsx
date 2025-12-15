'use client'

import React, { useState } from 'react'
import { StarPack, STAR_PACKS } from '@/domain/monetization'

interface StarPurchaseModalProps {
  isOpen: boolean
  selectedPack: StarPack | null
  isFirstPurchase: boolean
  onConfirm: () => void
  onClose: () => void
}

export function StarPurchaseModal({
  isOpen,
  selectedPack,
  isFirstPurchase,
  onConfirm,
  onClose,
}: StarPurchaseModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  if (!isOpen || !selectedPack) return null

  const actualStars = isFirstPurchase ? selectedPack.stars * 2 : selectedPack.stars

  const handleConfirm = () => {
    if (!isConfirming) {
      setIsConfirming(true)
      return
    }
    onConfirm()
    setIsConfirming(false)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[320px] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FDF4FF 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          className="px-4 py-4 text-center"
          style={{
            background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
          }}
        >
          <h2
            className="text-white font-bold text-lg"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            どろっぷをかう
          </h2>
        </div>

        {/* コンテンツ */}
        <div
          className="px-6 py-6 text-center"
          style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
        >
          {/* どろっぷアイコン */}
          <div className="text-5xl mb-4">
            {selectedPack.stars >= 4800 ? '★★★' :
             selectedPack.stars >= 1800 ? '★★' : '★'}
          </div>

          {/* パック名 */}
          <p className="text-gray-600 text-sm mb-2">{selectedPack.name}パック</p>

          {/* どろっぷ数 */}
          <div className="mb-4">
            <span className="text-4xl font-bold text-purple-600">
              {actualStars.toLocaleString()}
            </span>
            <span className="text-lg text-purple-400 ml-1">どろっぷ</span>
          </div>

          {/* 初回ボーナス表示 */}
          {isFirstPurchase && (
            <div
              className="mb-4 py-2 px-4 rounded-full inline-block"
              style={{
                background: 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)',
              }}
            >
              <span className="text-white font-bold text-sm">
                はじめてボーナス 2ばい！
              </span>
            </div>
          )}

          {/* ボーナス表示 */}
          {selectedPack.bonusPercent > 0 && !isFirstPurchase && (
            <p className="text-green-600 font-bold text-sm mb-4">
              +{selectedPack.bonusPercent}% おとく！
            </p>
          )}

          {/* 価格 */}
          <div
            className="py-3 rounded-xl mb-4"
            style={{
              background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
            }}
          >
            <span className="text-gray-500 text-sm">ねだん: </span>
            <span className="text-2xl font-bold text-purple-700">
              ¥{selectedPack.price.toLocaleString()}
            </span>
          </div>

          {/* 確認メッセージ */}
          {isConfirming && (
            <div className="mb-4 p-3 rounded-xl bg-yellow-50 border border-yellow-300">
              <p className="text-sm text-yellow-800 font-bold">
                ほんとうに かいますか？
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                おうちの人に かくにんしてね
              </p>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 active:scale-95 transition-all"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            やめる
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl font-bold text-white active:scale-95 transition-all"
            style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              background: isConfirming
                ? 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)'
                : 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            }}
          >
            {isConfirming ? 'かう！' : 'かう'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StarPurchaseModal
