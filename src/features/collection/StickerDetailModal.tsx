'use client'

import React from 'react'
import type { CollectionSticker } from './CollectionView'
import { RankStars } from '@/components/upgrade'
import { UPGRADE_RANKS, RANK_NAMES, UPGRADE_REQUIREMENTS } from '@/constants/upgradeRanks'
import type { UpgradeRank } from '@/constants/upgradeRanks'
import { calculateStickerPoints } from '@/domain/stickerRank'

interface StickerDetailModalProps {
  sticker: CollectionSticker | null
  isOpen: boolean
  onClose: () => void
  onUpgrade?: (sticker: CollectionSticker) => void
}

// アップグレード進捗表示
const UpgradeProgress: React.FC<{ quantity: number; currentUpgradeRank: UpgradeRank }> = ({ quantity, currentUpgradeRank }) => {
  // 次のランクへのアップグレード情報を取得
  const getNextUpgradeInfo = () => {
    if (currentUpgradeRank === UPGRADE_RANKS.PRISM) {
      return { canUpgrade: false, message: 'プリズムランク達成！', needed: 0, have: 0 }
    }

    // 次のランクを計算
    const nextRank = (currentUpgradeRank + 1) as 1 | 2 | 3

    // UPGRADE_REQUIREMENTSには1,2,3のみ存在（0=NORMALはアップグレード元なので含まれない）
    const requirement = UPGRADE_REQUIREMENTS[nextRank]

    if (!requirement) {
      return { canUpgrade: false, message: '', needed: 0, have: 0 }
    }

    // 現在のランクのシールの数をチェック
    // quantity は現在のランクのシールの数（ノーマルなら quantity がそのまま使える）
    const canUpgrade = quantity >= requirement.count
    const neededMore = Math.max(0, requirement.count - quantity)

    return {
      canUpgrade,
      message: canUpgrade
        ? `${RANK_NAMES[nextRank as UpgradeRank]}にアップグレード可能！`
        : `${RANK_NAMES[nextRank as UpgradeRank]}まであと ${neededMore} 枚`,
      needed: requirement.count,
      have: quantity
    }
  }

  const info = getNextUpgradeInfo()

  if (currentUpgradeRank === UPGRADE_RANKS.PRISM) {
    return (
      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #ff6b6b, #ffe66d, #4ecdc4, #a78bfa, #ff6b9d)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          ✨ プリズムランク達成！ ✨
        </span>
      </div>
    )
  }

  return (
    <div style={{ marginTop: '8px' }}>
      <p style={{
        fontSize: '12px',
        textAlign: 'center',
        color: info.canUpgrade ? '#22C55E' : '#8B5CF6',
        fontWeight: info.canUpgrade ? 'bold' : 'normal'
      }}>
        {info.message}
      </p>
    </div>
  )
}

// シールプレビュー（シンプル版 - バッジなし）
const StickerPreview: React.FC<{ sticker: CollectionSticker }> = ({ sticker }) => {
  const { type, imageUrl, owned, upgradeRank = 0 } = sticker

  // ぷっくりシール用のシャドウ
  const puffyShadow = type === 'puffy' ? '0 8px 24px rgba(107, 63, 160, 0.3)' : undefined

  // アップグレードランクに応じたボーダー色
  const getBorderColor = () => {
    switch (upgradeRank) {
      case UPGRADE_RANKS.SILVER:
        return '#C0C0C0'
      case UPGRADE_RANKS.GOLD:
        return '#FFD700'
      case UPGRADE_RANKS.PRISM:
        return '#A78BFA'
      default:
        return '#D8B4FE'
    }
  }

  return (
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
        border: owned ? `4px solid ${getBorderColor()}` : '4px solid #D1D5DB',
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
}

export const StickerDetailModal: React.FC<StickerDetailModalProps> = ({
  sticker,
  isOpen,
  onClose,
  onUpgrade
}) => {
  if (!isOpen || !sticker) return null

  const handleOpenUpgrade = () => {
    if (onUpgrade && sticker.owned) {
      onUpgrade(sticker)
    }
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
        <div style={{
          height: '96px',
          backgroundImage: 'url(/images/Header_UI.png)',
          backgroundSize: '100% auto',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }} />

        {/* コンテンツ */}
        <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px', marginTop: '-64px' }}>
          {/* シールプレビュー */}
          <StickerPreview sticker={sticker} />

          {/* シール名 */}
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', color: '#6B21A8', marginTop: '16px' }}>
            {sticker.owned ? sticker.name : '???'}
          </h2>

          {/* レアリティと種類 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            <RankStars
              baseRarity={sticker.rarity}
              upgradeRank={(sticker.upgradeRank ?? 0) as UpgradeRank}
              size="md"
              showAnimation={false}
            />
          </div>

          {/* レートポイント */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '16px',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            borderRadius: '20px',
            border: '2px solid #F59E0B',
            width: 'fit-content',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <span style={{ fontSize: '16px' }}>💰</span>
            <span style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#B45309',
            }}>
              {calculateStickerPoints(sticker.rarity, sticker.upgradeRank ?? 0)} pt
            </span>
            <span style={{ fontSize: '11px', color: '#92400E' }}>（こうかんレート）</span>
          </div>

          {sticker.owned ? (
            <>
              {/* 所持情報 */}
              <div style={{ background: '#FAF5FF', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#7C3AED' }}>もっている枚数</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#9333EA' }}>{sticker.quantity} 枚</span>
                </div>

                {/* アップグレード進捗表示 */}
                <UpgradeProgress
                  quantity={sticker.quantity}
                  currentUpgradeRank={(sticker.upgradeRank ?? 0) as UpgradeRank}
                />
              </div>

              {/* 初入手日 */}
              {sticker.firstAcquiredAt && (
                <p style={{ fontSize: '12px', textAlign: 'center', color: '#A78BFA', marginBottom: '16px' }}>
                  初ゲット: {new Date(sticker.firstAcquiredAt).toLocaleDateString('ja-JP')}
                </p>
              )}

              
              {/* アップグレードボタン */}
              {onUpgrade && (
                <div style={{ marginBottom: '12px' }}>
                  <button
                    onClick={handleOpenUpgrade}
                    style={{
                      width: '100%',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #8B5A3C 0%, #D4A574 50%, #8B5A3C 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(139, 90, 60, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: '2px solid #5C3D2E',
                      cursor: 'pointer',
                      fontSize: '16px',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#DAA520" strokeWidth="1"/>
                    </svg>
                    <span>アップグレード</span>
                  </button>
                  <p style={{ fontSize: '11px', textAlign: 'center', color: '#A67C52', marginTop: '6px' }}>
                    同じシールを合成してランクアップ！
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
