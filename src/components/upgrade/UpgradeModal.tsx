'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UPGRADE_RANKS,
  RANK_NAMES,
  UPGRADE_REQUIREMENTS,
  STAR_BONUS,
  type UpgradeRank,
} from '@/constants/upgradeRanks'
import { upgradeService } from '@/services/upgrade'
import { RankStars } from './RankStars'
import { RankName } from './RankName'
import { StickerAura } from './StickerAura'
import { ALL_STICKERS } from '@/data/stickerMasterData'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  stickerId: string
  userId: string
  onUpgradeComplete?: () => void
}

interface UpgradeOption {
  targetRank: UpgradeRank
  fromRank: UpgradeRank
  requiredCount: number
  currentCount: number
  canUpgrade: boolean
}

type ModalState = 'viewing' | 'upgrading' | 'success'

/**
 * シールアップグレードモーダル
 * ダブりシールを合成してランクアップ
 */
export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  stickerId,
  userId,
  onUpgradeComplete,
}) => {
  const [upgradeOptions, setUpgradeOptions] = useState<UpgradeOption[]>([])
  const [rankCounts, setRankCounts] = useState<Map<UpgradeRank, { count: number; userStickerId: string | null }>>(new Map())
  const [loading, setLoading] = useState(false)
  const [modalState, setModalState] = useState<ModalState>('viewing')
  const [upgradedRank, setUpgradedRank] = useState<UpgradeRank | null>(null)
  const [selectedTab, setSelectedTab] = useState<UpgradeRank>(UPGRADE_RANKS.SILVER)

  // シールのマスターデータを取得
  const stickerData = ALL_STICKERS.find((s) => s.id === stickerId)

  // アップグレード可能状況を読み込み
  const loadUpgradeOptions = useCallback(async () => {
    if (!userId || !stickerId) return
    setLoading(true)
    try {
      const [options, counts] = await Promise.all([
        upgradeService.getAvailableUpgrades(userId, stickerId),
        upgradeService.getStickersByRank(userId, stickerId),
      ])
      setUpgradeOptions(options)
      setRankCounts(counts)
    } catch (error) {
      console.error('Failed to load upgrade options:', error)
    } finally {
      setLoading(false)
    }
  }, [userId, stickerId])

  useEffect(() => {
    if (isOpen) {
      loadUpgradeOptions()
      setModalState('viewing')
      setUpgradedRank(null)
    }
  }, [isOpen, loadUpgradeOptions])

  // アップグレード実行
  const handleUpgrade = async (targetRank: UpgradeRank) => {
    if (!userId || !stickerId) return
    setModalState('upgrading')

    try {
      const result = await upgradeService.executeUpgrade(userId, stickerId, targetRank)
      if (result.success) {
        setUpgradedRank(targetRank)
        setModalState('success')
        await loadUpgradeOptions() // データ更新
        onUpgradeComplete?.()
      } else {
        alert(result.message)
        setModalState('viewing')
      }
    } catch (error) {
      console.error('Upgrade failed:', error)
      setModalState('viewing')
    }
  }

  // 所持数を取得
  const getCountForRank = (rank: UpgradeRank): number => {
    return rankCounts.get(rank)?.count || 0
  }

  // ランクカラー取得
  const getRankGradient = (rank: UpgradeRank): string => {
    switch (rank) {
      case UPGRADE_RANKS.SILVER:
        return 'linear-gradient(135deg, #8B8B8B 0%, #C0C0C0 30%, #E8E8E8 50%, #C0C0C0 70%, #8B8B8B 100%)'
      case UPGRADE_RANKS.GOLD:
        return 'linear-gradient(135deg, #B8860B 0%, #FFD700 30%, #FFF8DC 50%, #FFD700 70%, #B8860B 100%)'
      case UPGRADE_RANKS.PRISM:
        return 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)'
      default:
        return 'linear-gradient(135deg, #8B5A3C, #A67C52)'
    }
  }

  if (!isOpen || !stickerData) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-[90%] max-w-[360px] rounded-3xl bg-gradient-to-b from-amber-50 to-orange-100 p-4 shadow-2xl"
          style={{ border: '4px solid #8B5A3C' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <div className="mb-4 text-center">
            <h2
              className="text-xl font-bold"
              style={{
                color: '#5C3D2E',
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
              }}
            >
              アップグレード
            </h2>
            <p className="text-sm text-amber-700">シールを合成してランクアップ！</p>
          </div>

          {/* シール表示エリア */}
          <div className="mb-4 flex justify-center">
            <StickerAura
              upgradeRank={upgradedRank ?? UPGRADE_RANKS.NORMAL}
              className="relative"
            >
              <motion.div
                animate={
                  modalState === 'success'
                    ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.6 }}
              >
                <img
                  src={stickerData.imageUrl}
                  alt={stickerData.name}
                  className="h-24 w-24 object-contain"
                  style={{
                    filter: modalState === 'upgrading' ? 'brightness(1.5)' : undefined,
                  }}
                />
              </motion.div>
            </StickerAura>
          </div>

          {/* シール名とレアリティ */}
          <div className="mb-4 text-center">
            <RankName
              name={stickerData.name}
              upgradeRank={upgradedRank ?? UPGRADE_RANKS.NORMAL}
              size="lg"
            />
            <div className="mt-2 flex justify-center">
              <RankStars
                baseRarity={stickerData.rarity}
                upgradeRank={upgradedRank ?? UPGRADE_RANKS.NORMAL}
                size="md"
              />
            </div>
          </div>

          {/* 成功メッセージ */}
          {modalState === 'success' && upgradedRank !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl bg-gradient-to-r from-yellow-200 to-orange-200 p-3 text-center"
              style={{ border: '2px solid #FFD700' }}
            >
              <p className="font-bold text-amber-800">
                🎉 {RANK_NAMES[upgradedRank]}にアップグレード！
              </p>
              <p className="text-sm text-amber-600">
                星が+{STAR_BONUS[upgradedRank]}個になりました
              </p>
            </motion.div>
          )}

          {/* 所持状況 */}
          <div className="mb-4 rounded-xl bg-white/60 p-3">
            <h3 className="mb-2 text-center text-sm font-bold text-amber-800">
              所持シール
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {Object.values(UPGRADE_RANKS).map((rank) => (
                <div
                  key={rank}
                  className="rounded-lg p-2 text-center"
                  style={{
                    background:
                      rank === UPGRADE_RANKS.NORMAL
                        ? 'rgba(139, 90, 60, 0.1)'
                        : rank === UPGRADE_RANKS.SILVER
                        ? 'rgba(192, 192, 192, 0.2)'
                        : rank === UPGRADE_RANKS.GOLD
                        ? 'rgba(255, 215, 0, 0.2)'
                        : 'rgba(255, 0, 255, 0.1)',
                  }}
                >
                  <div
                    className="text-xs font-bold"
                    style={{
                      background: getRankGradient(rank),
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: rank === UPGRADE_RANKS.NORMAL ? '#5C3D2E' : 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {RANK_NAMES[rank]}
                  </div>
                  <div className="text-lg font-bold text-amber-900">
                    {getCountForRank(rank)}枚
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* アップグレードタブ */}
          {modalState === 'viewing' && (
            <>
              <div className="mb-2 flex justify-center gap-1">
                {[UPGRADE_RANKS.SILVER, UPGRADE_RANKS.GOLD, UPGRADE_RANKS.PRISM].map(
                  (rank) => (
                    <button
                      key={rank}
                      onClick={() => setSelectedTab(rank)}
                      className={`rounded-t-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        selectedTab === rank
                          ? 'bg-white/80 shadow-sm'
                          : 'bg-white/30 opacity-60'
                      }`}
                      style={{
                        background:
                          selectedTab === rank
                            ? getRankGradient(rank)
                            : undefined,
                        WebkitBackgroundClip: selectedTab === rank ? 'text' : undefined,
                        WebkitTextFillColor:
                          selectedTab === rank ? 'transparent' : '#5C3D2E',
                        backgroundClip: selectedTab === rank ? 'text' : undefined,
                      }}
                    >
                      {RANK_NAMES[rank]}
                    </button>
                  )
                )}
              </div>

              {/* 選択されたアップグレードオプション */}
              {upgradeOptions
                .filter((opt) => opt.targetRank === selectedTab)
                .map((option) => {
                  const requirement = UPGRADE_REQUIREMENTS[
                    option.targetRank as keyof typeof UPGRADE_REQUIREMENTS
                  ]
                  const fromRankName = RANK_NAMES[option.fromRank]
                  const toRankName = RANK_NAMES[option.targetRank]
                  const progressPercent = Math.min(
                    100,
                    (option.currentCount / option.requiredCount) * 100
                  )

                  return (
                    <motion.div
                      key={option.targetRank}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl bg-white/80 p-4"
                      style={{
                        border: `2px solid ${
                          option.canUpgrade ? '#FFD700' : '#ccc'
                        }`,
                      }}
                    >
                      {/* アップグレードフロー */}
                      <div className="mb-3 flex items-center justify-center gap-2">
                        <span
                          className="rounded-lg px-2 py-1 text-sm font-bold"
                          style={{
                            background: getRankGradient(option.fromRank),
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor:
                              option.fromRank === UPGRADE_RANKS.NORMAL
                                ? '#5C3D2E'
                                : 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {fromRankName}×{option.requiredCount}
                        </span>
                        <span className="text-2xl">→</span>
                        <span
                          className="rounded-lg px-2 py-1 text-sm font-bold"
                          style={{
                            background: getRankGradient(option.targetRank),
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {toRankName}×1
                        </span>
                      </div>

                      {/* プログレスバー */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-amber-700">
                          <span>{fromRankName}シール</span>
                          <span>
                            {option.currentCount}/{option.requiredCount}
                          </span>
                        </div>
                        <div className="mt-1 h-3 overflow-hidden rounded-full bg-gray-200">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: getRankGradient(option.targetRank),
                              width: `${progressPercent}%`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* 星増加表示 */}
                      <div className="mb-3 text-center text-sm">
                        <span className="text-amber-600">星が</span>
                        <span className="mx-1 font-bold text-amber-800">
                          +{STAR_BONUS[option.targetRank] - STAR_BONUS[option.fromRank]}
                        </span>
                        <span className="text-amber-600">増える！</span>
                      </div>

                      {/* アップグレードボタン */}
                      <button
                        onClick={() => handleUpgrade(option.targetRank)}
                        disabled={!option.canUpgrade || loading}
                        className={`w-full rounded-xl py-3 font-bold text-white transition-all ${
                          option.canUpgrade
                            ? 'bg-gradient-to-r from-orange-400 to-amber-500 shadow-lg hover:shadow-xl active:scale-95'
                            : 'bg-gray-300 text-gray-500'
                        }`}
                        style={{
                          fontFamily: "'M PLUS Rounded 1c', sans-serif",
                        }}
                      >
                        {option.canUpgrade ? 'アップグレードする！' : 'シールが足りません'}
                      </button>
                    </motion.div>
                  )
                })}
            </>
          )}

          {/* アップグレード中アニメーション */}
          {modalState === 'upgrading' && (
            <motion.div
              className="flex flex-col items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-12 w-12 rounded-full border-4 border-amber-500"
                style={{ borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <p className="mt-4 font-bold text-amber-700">アップグレード中...</p>
            </motion.div>
          )}

          {/* 成功後の閉じるボタン */}
          {modalState === 'success' && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onClose}
              className="w-full rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 py-3 font-bold text-white shadow-lg"
              style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            >
              閉じる
            </motion.button>
          )}

          {/* 閉じるボタン（通常時） */}
          {modalState === 'viewing' && (
            <button
              onClick={onClose}
              className="mt-3 w-full rounded-xl bg-gray-200 py-2 text-sm font-bold text-gray-600 transition-all hover:bg-gray-300"
            >
              戻る
            </button>
          )}

          {/* 閉じるXボタン */}
          <button
            onClick={onClose}
            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-transform hover:scale-110"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UpgradeModal
