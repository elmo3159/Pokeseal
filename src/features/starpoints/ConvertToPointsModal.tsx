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
  <div style={{ display: 'flex', gap: '2px' }}>
    {Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          fontSize: '14px',
          color: i < rarity ? '#FBBF24' : '#D1D5DB',
        }}
      >
        ★
      </span>
    ))}
  </div>
)

// タイプ表示
const TypeBadge: React.FC<{ type: 'normal' | 'puffy' | 'sparkle' }> = ({ type }) => {
  const config = {
    normal: { label: 'ふつう', emoji: '📄', bg: '#F3F4F6' },
    puffy: { label: 'ぷっくり', emoji: '🫧', bg: '#DBEAFE' },
    sparkle: { label: 'キラキラ', emoji: '✨', bg: '#FEF3C7' },
  }
  const { label, emoji, bg } = config[type]

  return (
    <span style={{
      background: bg,
      paddingLeft: '8px',
      paddingRight: '8px',
      paddingTop: '2px',
      paddingBottom: '2px',
      borderRadius: '9999px',
      fontSize: '12px',
    }}>
      {emoji} {label}
    </span>
  )
}

// ランクバッジ
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  const colors = [
    '#D1D5DB',     // ランク1
    '#4ADE80',    // ランク2
    '#60A5FA',     // ランク3
    '#A78BFA',   // ランク4
    'linear-gradient(to right, #FBBF24, #FB923C)', // ランク5 (MAX)
  ]

  return (
    <span style={{
      background: colors[rank - 1] || colors[0],
      color: 'white',
      paddingLeft: '8px',
      paddingRight: '8px',
      paddingTop: '2px',
      paddingBottom: '2px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: 'bold',
    }}>
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
        background: 'rgba(0, 0, 0, 0.5)',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '384px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>✨</div>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6B21A8', marginBottom: '8px' }}>
            ポイントゲット！
          </h3>

          <div style={{
            background: 'linear-gradient(to right, #FEF3C7, #FFEDD5)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#CA8A04' }}>
              +{formatPoints(earnedPoints)}
            </p>
          </div>

          <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '16px' }}>
            {sticker.name}を{convertCount}まい<br />
            ポイントにかえたよ！
          </p>

          <button
            onClick={handleClose}
            style={{
              width: '100%',
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
              color: 'white',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            とじる
          </button>
        </div>
      </div>
    )
  }

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
      background: 'rgba(0, 0, 0, 0.5)',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        maxWidth: '384px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}>
        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6B21A8' }}>
            ⭐ ポイントにへんかん
          </h3>
          <button
            onClick={handleClose}
            style={{ color: '#9CA3AF', fontSize: '20px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* シール情報 */}
        <div style={{ background: '#F3E8FF', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* シール画像 */}
            <div style={{
              width: '80px',
              height: '80px',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
            }}>
              {sticker.imageUrl ? (
                <img
                  src={sticker.imageUrl}
                  alt={sticker.name}
                  style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontSize: '30px' }}>
                  {sticker.type === 'sparkle' ? '✨' : sticker.type === 'puffy' ? '🫧' : '⭐'}
                </span>
              )}
            </div>

            {/* シール詳細 */}
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', color: '#581C87' }}>{sticker.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                <RarityStars rarity={sticker.rarity} />
                <TypeBadge type={sticker.type} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <RankBadge rank={sticker.rank} />
                <span style={{ fontSize: '12px', color: '#6B7280' }}>
                  ×{sticker.quantity}まい
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ポイント単価表示 */}
        <div style={{ background: '#FEF9C3', borderRadius: '8px', padding: '12px', marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#A16207', marginBottom: '4px' }}>1まいあたり</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#CA8A04' }}>
            ⭐ {formatPoints(pointsPerSticker)}
          </p>
        </div>

        {/* 数量選択 */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#6B21A8', marginBottom: '8px' }}>なんまいかえる？</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <button
              onClick={handleDecrement}
              disabled={convertCount <= 1}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                fontSize: '24px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                background: convertCount <= 1 ? '#F3F4F6' : '#F3E8FF',
                color: convertCount <= 1 ? '#D1D5DB' : '#7C3AED',
                cursor: convertCount <= 1 ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              -
            </button>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#6B21A8' }}>{convertCount}</p>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>まい</p>
            </div>

            <button
              onClick={handleIncrement}
              disabled={convertCount >= sticker.quantity}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                fontSize: '24px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                background: convertCount >= sticker.quantity ? '#F3F4F6' : '#F3E8FF',
                color: convertCount >= sticker.quantity ? '#D1D5DB' : '#7C3AED',
                cursor: convertCount >= sticker.quantity ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              +
            </button>
          </div>

          {/* 全部ボタン */}
          {sticker.quantity > 1 && (
            <button
              onClick={handleMaxCount}
              style={{
                width: '100%',
                marginTop: '8px',
                paddingTop: '6px',
                paddingBottom: '6px',
                fontSize: '14px',
                color: '#7C3AED',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ぜんぶ ({sticker.quantity}まい)
            </button>
          )}
        </div>

        {/* 合計ポイント */}
        <div style={{
          background: 'linear-gradient(to right, #FEF3C7, #FFEDD5)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#6B21A8', fontWeight: 'bold' }}>もらえるポイント</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#CA8A04' }}>
              ⭐ {formatPoints(totalPoints)}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280', textAlign: 'right', marginTop: '4px' }}>
            へんかんご: {formatPoints(currentBalance + totalPoints)}
          </div>
        </div>

        {/* 注意書き */}
        <p style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center', marginBottom: '16px' }}>
          ⚠️ へんかんしたシールは なくなるよ<br />
          でもランクは さがらないから あんしんしてね！
        </p>

        {/* ボタン */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '12px',
              background: '#F3F4F6',
              color: '#4B5563',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            やめる
          </button>
          <button
            onClick={handleConvert}
            style={{
              flex: 1,
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(to right, #FBBF24, #FB923C)',
              color: 'white',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            へんかんする！
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConvertToPointsModal
