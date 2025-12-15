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
  const sizes = {
    sm: '14px',
    md: '20px',
    lg: '24px'
  }

  return (
    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: sizes[size],
            color: i < rarity ? '#FBBF24' : '#D1D5DB',
          }}
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

  // グラデーント文字列をCSSに変換
  const gradientMap: Record<string, string> = {
    'from-gray-400 to-gray-500': 'linear-gradient(to right, #9CA3AF, #6B7280)',
    'from-green-400 to-green-500': 'linear-gradient(to right, #4ADE80, #22C55E)',
    'from-blue-400 to-blue-500': 'linear-gradient(to right, #60A5FA, #3B82F6)',
    'from-purple-400 to-purple-500': 'linear-gradient(to right, #C084FC, #A855F7)',
    'from-yellow-400 via-orange-400 to-pink-400': 'linear-gradient(to right, #FBBF24, #FB923C, #F472B6)',
  }
  const bgGradient = gradientMap[rankGradient] || 'linear-gradient(to right, #9CA3AF, #6B7280)'

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#7C3AED' }}>ランク</span>
        <span
          style={{
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '4px',
            paddingBottom: '4px',
            borderRadius: '9999px',
            fontWeight: 'bold',
            fontSize: '14px',
            background: bgGradient,
            color: currentRank >= 4 ? '#000' : '#fff',
          }}
        >
          {rankNamesKids[currentRank]}
        </span>
      </div>
      <div style={{ height: '12px', background: '#E5E7EB', borderRadius: '9999px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: '9999px',
            background: bgGradient,
            transition: 'all 0.5s',
            width: `${progress}%`,
          }}
        />
      </div>
      {!isMax && nextReq !== null && (
        <p style={{ fontSize: '12px', color: '#8B5CF6', marginTop: '4px', textAlign: 'center' }}>
          つぎのランクまであと {nextReq} まい
        </p>
      )}
      {isMax && (
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '12px', color: '#EC4899', fontWeight: 'bold' }}>
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
    normal: { label: 'ふつう', emoji: '📄', bg: '#F3F4F6', color: '#374151' },
    puffy: { label: 'ぷっくり', emoji: '🫧', bg: '#DBEAFE', color: '#1D4ED8' },
    sparkle: { label: 'キラキラ', emoji: '✨', bg: '#FEF9C3', color: '#A16207' }
  }

  const info = typeInfo[type]

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      paddingLeft: '12px',
      paddingRight: '12px',
      paddingTop: '4px',
      paddingBottom: '4px',
      borderRadius: '9999px',
      fontSize: '14px',
      fontWeight: 500,
      background: info.bg,
      color: info.color,
    }}>
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

  // ぷっくりシール用のシャドウ
  const puffyShadow = type === 'puffy' ? '0 8px 24px rgba(107, 63, 160, 0.3)' : undefined

  const previewContent = (
    <div
      style={{
        position: 'relative',
        width: '160px',
        height: '160px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: '16px',
        overflow: 'hidden',
        background: owned ? '#FFFFFF' : '#E5E7EB',
        border: owned ? '4px solid #D8B4FE' : '4px solid #D1D5DB',
        boxShadow: puffyShadow,
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: !owned ? 0.3 : 1,
        filter: !owned ? 'grayscale(100%)' : 'none',
      }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={sticker.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }}
          />
        ) : (
          <div style={{ fontSize: '70px' }}>
            {type === 'sparkle' ? '✨' : type === 'puffy' ? '🌟' : '⭐'}
          </div>
        )}
      </div>

      {/* 未所持オーバーレイ */}
      {!owned && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.2)',
        }}>
          <span style={{ fontSize: '48px' }}>❓</span>
        </div>
      )}

      {/* キラキラエフェクト */}
      {owned && type === 'sparkle' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom right, transparent, rgba(255, 255, 255, 0.4), transparent)',
          }} />
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }}>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* モーダル本体 */}
      <div style={{
        position: 'relative',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        width: '100%',
        maxWidth: '384px',
        overflow: 'hidden',
      }}>
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: '#F3F4F6',
            border: 'none',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'background 0.2s',
          }}
        >
          <span style={{ color: '#6B7280', fontSize: '18px' }}>✕</span>
        </button>

        {/* ヘッダー背景 */}
        <div style={{ height: '96px', background: 'linear-gradient(to right, #C084FC, #F472B6)' }} />

        {/* コンテンツ */}
        <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px', marginTop: '-64px' }}>
          {/* シールプレビュー */}
          <StickerPreview sticker={sticker} />

          {/* シール名 */}
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', color: '#6B21A8', marginTop: '16px' }}>
            {sticker.owned ? sticker.name : '???'}
          </h2>

          {/* シリーズ */}
          <p style={{ fontSize: '14px', textAlign: 'center', color: '#8B5CF6', marginBottom: '12px' }}>
            {sticker.series}
          </p>

          {/* レアリティと種類 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <RarityStars rarity={sticker.rarity} />
            <TypeBadge type={sticker.type} />
          </div>

          {sticker.owned ? (
            <>
              {/* 所持情報 */}
              <div style={{ background: '#FAF5FF', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#7C3AED' }}>もっている枚数</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#9333EA' }}>{sticker.quantity} 枚</span>
                </div>

                {/* ランクメーター */}
                <RankMeter totalAcquired={totalAcquired} />
              </div>

              {/* 初入手日 */}
              {sticker.firstAcquiredAt && (
                <p style={{ fontSize: '12px', textAlign: 'center', color: '#A78BFA', marginBottom: '16px' }}>
                  初ゲット: {new Date(sticker.firstAcquiredAt).toLocaleDateString('ja-JP')}
                </p>
              )}

              {/* スターポイント変換ボタン */}
              {sticker.quantity > 0 && onConvertToPoints && (
                <div style={{ borderTop: '1px solid #E9D5FF', paddingTop: '16px' }}>
                  <button
                    onClick={handleOpenConvert}
                    style={{
                      width: '100%',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      borderRadius: '12px',
                      background: 'linear-gradient(to right, #FBBF24, #FB923C)',
                      color: 'white',
                      fontWeight: 'bold',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span>⭐</span>
                    <span>ポイントにかえる</span>
                    <span style={{ fontSize: '12px', opacity: 0.8 }}>（1枚 {pointsPerSticker} SP〜）</span>
                  </button>
                  <p style={{ fontSize: '12px', textAlign: 'center', color: '#A78BFA', marginTop: '8px' }}>
                    ※ランクは下がりません
                  </p>
                </div>
              )}
            </>
          ) : (
            /* 未所持 */
            <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
              <span style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}>🔒</span>
              <p style={{ fontSize: '14px', color: '#6B7280' }}>
                このシールはまだもっていません
              </p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>
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
