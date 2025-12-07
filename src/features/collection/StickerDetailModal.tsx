'use client'

import React from 'react'
import type { CollectionSticker } from './CollectionView'
import { RankEffectOverlay } from '@/components'
import {
  RankLevel,
  calculateRank,
  getRankProgress,
  getNextRankRequirement,
  convertToStarPoints,
  rankNamesKids,
  getRankGradient
} from '@/domain/stickerRank'

interface StickerDetailModalProps {
  sticker: CollectionSticker | null
  isOpen: boolean
  onClose: () => void
  onConvertToPoints?: (sticker: CollectionSticker) => void
}

// レアリティの星表示
const RarityStars: React.FC<{ rarity: number; size?: 'sm' | 'md' | 'lg' }> = ({ rarity, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className="flex gap-0.5 justify-center">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`${sizeClasses[size]} ${i < rarity ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

// ランクメーター（新しいドメイン関数を使用）
const RankMeter: React.FC<{ totalAcquired: number }> = ({ totalAcquired }) => {
  const currentRank = calculateRank(totalAcquired) as RankLevel
  const isMax = currentRank >= 5
  const progress = getRankProgress(totalAcquired)
  const nextReq = getNextRankRequirement(currentRank, totalAcquired)
  const rankGradient = getRankGradient(currentRank)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-purple-700">ランク</span>
        <span
          className={`px-3 py-1 rounded-full font-bold text-sm bg-gradient-to-r ${rankGradient}`}
          style={{ color: currentRank >= 4 ? '#000' : '#fff' }}
        >
          {rankNamesKids[currentRank]}
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${rankGradient} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {!isMax && nextReq !== null && (
        <p className="text-xs text-purple-500 mt-1 text-center">
          つぎのランクまであと {nextReq} まい
        </p>
      )}
      {isMax && (
        <div className="text-center mt-1">
          <span className="text-xs text-pink-500 font-bold animate-pulse">
            🎉 ランクMAXたっせい！ 🎉
          </span>
        </div>
      )}
    </div>
  )
}

// シールタイプバッジ
const TypeBadge: React.FC<{ type: 'normal' | 'puffy' | 'sparkle' }> = ({ type }) => {
  const typeInfo = {
    normal: { label: 'ふつう', emoji: '📄', color: 'bg-gray-100 text-gray-700' },
    puffy: { label: 'ぷっくり', emoji: '🫧', color: 'bg-blue-100 text-blue-700' },
    sparkle: { label: 'キラキラ', emoji: '✨', color: 'bg-yellow-100 text-yellow-700' }
  }

  const info = typeInfo[type]

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${info.color}`}>
      <span>{info.emoji}</span>
      <span>{info.label}</span>
    </span>
  )
}

// シールプレビュー（ランクエフェクト対応）
const StickerPreview: React.FC<{ sticker: CollectionSticker }> = ({ sticker }) => {
  const { type, imageUrl, owned, totalAcquired } = sticker

  // ランクを計算
  const actualRank = (totalAcquired ? calculateRank(totalAcquired) : 1) as RankLevel

  // キラキラエフェクト用のクラス
  const sparkleClass = type === 'sparkle' ? 'animate-pulse' : ''
  // ぷっくりシール用のシャドウ
  const puffyStyle = type === 'puffy' ? { boxShadow: '0 8px 24px rgba(107, 63, 160, 0.3)' } : {}

  const previewContent = (
    <div
      className={`
        relative w-40 h-40 mx-auto rounded-2xl overflow-hidden
        ${owned ? 'bg-white' : 'bg-gray-200'}
        border-4 ${owned ? 'border-purple-300' : 'border-gray-300'}
      `}
      style={puffyStyle}
    >
      <div className={`
        w-full h-full flex items-center justify-center
        ${!owned ? 'opacity-30 grayscale' : ''}
        ${sparkleClass}
      `}>
        {imageUrl ? (
          <img src={imageUrl} alt={sticker.name} className="w-full h-full object-contain p-4" />
        ) : (
          <div className="text-7xl">
            {type === 'sparkle' ? '✨' : type === 'puffy' ? '🌟' : '⭐'}
          </div>
        )}
      </div>

      {/* 未所持オーバーレイ */}
      {!owned && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="text-5xl">❓</span>
        </div>
      )}

      {/* キラキラエフェクト */}
      {owned && type === 'sparkle' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/40 to-transparent animate-shine" />
        </div>
      )}
    </div>
  )

  // 所持している場合はランクエフェクトを適用
  if (owned && actualRank > 0) {
    return (
      <RankEffectOverlay rank={actualRank} size="lg" showBadge={false}>
        {previewContent}
      </RankEffectOverlay>
    )
  }

  return previewContent
}

export const StickerDetailModal: React.FC<StickerDetailModalProps> = ({
  sticker,
  isOpen,
  onClose,
  onConvertToPoints
}) => {
  if (!isOpen || !sticker) return null

  const handleOpenConvert = () => {
    if (onConvertToPoints && sticker.owned && sticker.quantity > 0) {
      onConvertToPoints(sticker)
    }
  }

  // スターポイント計算（レアリティに基づく - ドメイン関数を使用）
  const pointsPerSticker = convertToStarPoints(sticker.rarity as 1|2|3|4|5, 1)

  // 累計獲得数（totalAcquiredがない場合はquantityをフォールバック）
  const totalAcquired = sticker.totalAcquired || sticker.quantity || 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-[scaleIn_0.2s_ease-out]">
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <span className="text-gray-500 text-lg">✕</span>
        </button>

        {/* ヘッダー背景 */}
        <div className="h-24 bg-gradient-to-r from-purple-400 to-pink-400" />

        {/* コンテンツ */}
        <div className="px-6 pb-6 -mt-16">
          {/* シールプレビュー */}
          <StickerPreview sticker={sticker} />

          {/* シール名 */}
          <h2 className="text-xl font-bold text-center text-purple-800 mt-4">
            {sticker.owned ? sticker.name : '???'}
          </h2>

          {/* シリーズ */}
          <p className="text-sm text-center text-purple-500 mb-3">
            {sticker.series}
          </p>

          {/* レアリティと種類 */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <RarityStars rarity={sticker.rarity} />
            <TypeBadge type={sticker.type} />
          </div>

          {sticker.owned ? (
            <>
              {/* 所持情報 */}
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-purple-700">もっている枚数</span>
                  <span className="text-2xl font-bold text-purple-600">{sticker.quantity} 枚</span>
                </div>

                {/* ランクメーター */}
                <RankMeter totalAcquired={totalAcquired} />
              </div>

              {/* 初入手日 */}
              {sticker.firstAcquiredAt && (
                <p className="text-xs text-center text-purple-400 mb-4">
                  初ゲット: {new Date(sticker.firstAcquiredAt).toLocaleDateString('ja-JP')}
                </p>
              )}

              {/* スターポイント変換ボタン */}
              {sticker.quantity > 0 && onConvertToPoints && (
                <div className="border-t border-purple-100 pt-4">
                  <button
                    onClick={handleOpenConvert}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>⭐</span>
                    <span>ポイントにかえる</span>
                    <span className="text-xs opacity-80">（1枚 {pointsPerSticker} SP〜）</span>
                  </button>
                  <p className="text-xs text-center text-purple-400 mt-2">
                    ※ランクは下がりません
                  </p>
                </div>
              )}
            </>
          ) : (
            /* 未所持 */
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <span className="text-4xl mb-2 block">🔒</span>
              <p className="text-sm text-gray-500">
                このシールはまだもっていません
              </p>
              <p className="text-xs text-gray-400 mt-2">
                ガチャやこうかんでゲットしよう！
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StickerDetailModal
