'use client'

import React, { useState, useMemo } from 'react'
import { formatPoints, calculateStickerPoints } from '@/domain/starPoints'

// シールの情報（変換に必要な最小限）
interface StickerForConvert {
  id: string
  name: string
  imageUrl?: string
  rarity: number
  type: 'normal' | 'puffy' | 'sparkle'
  rank: number
  quantity: number
}

interface ConvertToPointsModalProps {
  isOpen: boolean
  onClose: () => void
  sticker: StickerForConvert | null
  currentBalance: number
  onConvert: (sticker: StickerForConvert, count: number) => { success: boolean; pointsEarned: number; message: string }
}

// レアリティの星表示
const RarityStars: React.FC<{ rarity: number }> = ({ rarity }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rarity ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))}
  </div>
)

// タイプ表示
const TypeBadge: React.FC<{ type: 'normal' | 'puffy' | 'sparkle' }> = ({ type }) => {
  const config = {
    normal: { label: 'ふつう', emoji: '📄', bg: 'bg-gray-100' },
    puffy: { label: 'ぷっくり', emoji: '🫧', bg: 'bg-blue-100' },
    sparkle: { label: 'キラキラ', emoji: '✨', bg: 'bg-yellow-100' },
  }
  const { label, emoji, bg } = config[type]

  return (
    <span className={`${bg} px-2 py-0.5 rounded-full text-xs`}>
      {emoji} {label}
    </span>
  )
}

// ランクバッジ
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  const colors = [
    'bg-gray-300',     // ランク1
    'bg-green-400',    // ランク2
    'bg-blue-400',     // ランク3
    'bg-purple-400',   // ランク4
    'bg-gradient-to-r from-yellow-400 to-orange-400', // ランク5 (MAX)
  ]

  return (
    <span className={`${colors[rank - 1] || colors[0]} text-white px-2 py-0.5 rounded-full text-xs font-bold`}>
      {rank === 5 ? 'MAX' : `Rank ${rank}`}
    </span>
  )
}

export const ConvertToPointsModal: React.FC<ConvertToPointsModalProps> = ({
  isOpen,
  onClose,
  sticker,
  currentBalance,
  onConvert,
}) => {
  const [convertCount, setConvertCount] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)

  // ポイント計算
  const pointsPerSticker = useMemo(() => {
    if (!sticker) return 0
    return calculateStickerPoints(sticker.rarity, sticker.type, sticker.rank)
  }, [sticker])

  const totalPoints = pointsPerSticker * convertCount

  // カウンター操作
  const handleIncrement = () => {
    if (sticker && convertCount < sticker.quantity) {
      setConvertCount(prev => prev + 1)
    }
  }

  const handleDecrement = () => {
    if (convertCount > 1) {
      setConvertCount(prev => prev - 1)
    }
  }

  const handleMaxCount = () => {
    if (sticker) {
      setConvertCount(sticker.quantity)
    }
  }

  // 変換実行
  const handleConvert = () => {
    if (!sticker) return

    const result = onConvert(sticker, convertCount)
    if (result.success) {
      setEarnedPoints(result.pointsEarned)
      setShowSuccess(true)
    }
  }

  // 閉じる処理
  const handleClose = () => {
    setConvertCount(1)
    setShowSuccess(false)
    setEarnedPoints(0)
    onClose()
  }

  if (!isOpen || !sticker) return null

  // 成功画面
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-xl font-bold text-purple-700 mb-2">
            ポイントゲット！
          </h3>

          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-4">
            <p className="text-3xl font-bold text-yellow-600">
              +{formatPoints(earnedPoints)}
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {sticker.name}を{convertCount}まい<br />
            ポイントにかえたよ！
          </p>

          <button
            onClick={handleClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
          >
            とじる
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-purple-700">
            ⭐ ポイントにへんかん
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* シール情報 */}
        <div className="bg-purple-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            {/* シール画像 */}
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-inner">
              {sticker.imageUrl ? (
                <img
                  src={sticker.imageUrl}
                  alt={sticker.name}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <span className="text-3xl">
                  {sticker.type === 'sparkle' ? '✨' : sticker.type === 'puffy' ? '🫧' : '⭐'}
                </span>
              )}
            </div>

            {/* シール詳細 */}
            <div className="flex-1">
              <p className="font-bold text-purple-800">{sticker.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <RarityStars rarity={sticker.rarity} />
                <TypeBadge type={sticker.type} />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <RankBadge rank={sticker.rank} />
                <span className="text-xs text-gray-500">
                  ×{sticker.quantity}まい
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ポイント単価表示 */}
        <div className="bg-yellow-50 rounded-lg p-3 mb-4 text-center">
          <p className="text-xs text-yellow-700 mb-1">1まいあたり</p>
          <p className="text-xl font-bold text-yellow-600">
            ⭐ {formatPoints(pointsPerSticker)}
          </p>
        </div>

        {/* 数量選択 */}
        <div className="mb-4">
          <p className="text-sm font-bold text-purple-700 mb-2">なんまいかえる？</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleDecrement}
              disabled={convertCount <= 1}
              className={`w-12 h-12 rounded-xl text-2xl font-bold transition-all
                ${convertCount <= 1
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }
              `}
            >
              -
            </button>

            <div className="text-center">
              <p className="text-4xl font-bold text-purple-700">{convertCount}</p>
              <p className="text-xs text-gray-500">まい</p>
            </div>

            <button
              onClick={handleIncrement}
              disabled={convertCount >= sticker.quantity}
              className={`w-12 h-12 rounded-xl text-2xl font-bold transition-all
                ${convertCount >= sticker.quantity
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }
              `}
            >
              +
            </button>
          </div>

          {/* 全部ボタン */}
          {sticker.quantity > 1 && (
            <button
              onClick={handleMaxCount}
              className="w-full mt-2 py-1.5 text-sm text-purple-600 hover:text-purple-800"
            >
              ぜんぶ ({sticker.quantity}まい)
            </button>
          )}
        </div>

        {/* 合計ポイント */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-purple-700 font-bold">もらえるポイント</span>
            <span className="text-2xl font-bold text-yellow-600">
              ⭐ {formatPoints(totalPoints)}
            </span>
          </div>
          <div className="text-xs text-gray-500 text-right mt-1">
            へんかんご: {formatPoints(currentBalance + totalPoints)}
          </div>
        </div>

        {/* 注意書き */}
        <p className="text-xs text-gray-500 text-center mb-4">
          ⚠️ へんかんしたシールは なくなるよ<br />
          でもランクは さがらないから あんしんしてね！
        </p>

        {/* ボタン */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold transition-all hover:bg-gray-200"
          >
            やめる
          </button>
          <button
            onClick={handleConvert}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold transition-all hover:shadow-lg"
          >
            へんかんする！
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConvertToPointsModal
