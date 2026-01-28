'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collectionRewardService } from '@/services/collectionRewards'
import type { CollectionReward, UnclaimedReward } from '@/services/collectionRewards/collectionRewardService'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'

interface CollectionRewardPanelProps {
  userId: string
  onRewardClaimed?: (reward: CollectionReward) => void
  className?: string
  compact?: boolean
}

/**
 * 図鑑達成報酬パネル
 * 達成率に応じたマイルストーン報酬を表示
 */
export const CollectionRewardPanel: React.FC<CollectionRewardPanelProps> = ({
  userId,
  onRewardClaimed,
  className = '',
  compact = false
}) => {
  const [rewards, setRewards] = useState<CollectionReward[]>([])
  const [unclaimedRewards, setUnclaimedRewards] = useState<UnclaimedReward[]>([])
  const [completionRate, setCompletionRate] = useState(0)
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)

  // データを取得
  const loadData = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
    }

    const [allRewards, unclaimed, rate] = await Promise.all([
      collectionRewardService.getAllRewards(),
      collectionRewardService.getUnclaimedRewards(userId),
      collectionRewardService.getCompletionRate(userId)
    ])

    setRewards(allRewards)
    setUnclaimedRewards(unclaimed)
    setCompletionRate(rate)
    setLoading(false)
  }

  useEffect(() => {
    if (userId) {
      const cached = collectionRewardService.getCachedSnapshot(userId)
      if (cached.rewards) setRewards(cached.rewards)
      if (cached.unclaimed) setUnclaimedRewards(cached.unclaimed)
      if (cached.completionRate !== null) setCompletionRate(cached.completionRate)

      const hasCached = Boolean(cached.rewards || cached.unclaimed || cached.completionRate !== null)
      if (hasCached) {
        setLoading(false)
      }
      loadData(!hasCached)
    }
  }, [userId])

  // 報酬を受け取る
  const handleClaimReward = async (reward: UnclaimedReward) => {
    if (claimingId) return

    setClaimingId(reward.id)

    const success = await collectionRewardService.claimReward(userId, reward.id)

    if (success) {
      // データを再取得
      await loadData()

      // コールバックを呼ぶ
      if (onRewardClaimed) {
        onRewardClaimed(reward)
      }
    }

    setClaimingId(null)
  }

  // 報酬ステータスを取得
  const getRewardStatus = (reward: CollectionReward): 'locked' | 'available' | 'claimed' => {
    const unclaimed = unclaimedRewards.find(u => u.id === reward.id)

    if (unclaimed) {
      return 'available'
    }

    if (completionRate >= reward.completion_percentage) {
      return 'claimed'
    }

    return 'locked'
  }

  // 報酬アイコンを取得
  const getRewardIcon = (rewardType: string): React.ReactNode => {
    if (rewardType === 'tickets') return <CurrencyIcon type="ticket" size="lg" />
    if (rewardType === 'gems') return <CurrencyIcon type="gem" size="lg" />
    if (rewardType === 'gacha_ticket') return <span style={{ fontSize: '32px' }}>⭐</span>
    if (rewardType === 'theme') return <span style={{ fontSize: '32px' }}>🎨</span>
    if (rewardType === 'badge') return <span style={{ fontSize: '32px' }}>🏆</span>
    return <span style={{ fontSize: '32px' }}>🎁</span>
  }

  if (loading) {
    return (
      <div className={className} style={{
        padding: compact ? '16px' : '24px',
        background: 'linear-gradient(to bottom, #FFF5F8, #FFE5EF)',
        borderRadius: '16px',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        <div style={{ color: '#C4A791', fontSize: '14px' }}>読み込み中...</div>
      </div>
    )
  }

  return (
    <div className={className} style={{
      background: 'linear-gradient(to bottom, #FFF5F8, #FFE5EF)',
      borderRadius: '16px',
      border: '2px solid #FFB6D9',
      overflow: 'hidden',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
      boxShadow: '0 4px 12px rgba(255, 182, 217, 0.3)'
    }}>
      {/* ヘッダー */}
      <div style={{
        background: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
        padding: compact ? '12px 16px' : '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: compact ? '20px' : '24px' }}>📚</span>
          <h3 style={{
            margin: 0,
            color: 'white',
            fontSize: compact ? '16px' : '18px',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            コレクション報酬
          </h3>
        </div>

        {/* 達成率表示 */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          padding: '4px 12px',
          backdropFilter: 'blur(10px)'
        }}>
          <span style={{
            color: 'white',
            fontSize: compact ? '12px' : '14px',
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
            {completionRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 進捗バー */}
      <div style={{
        padding: compact ? '12px 16px' : '16px 20px',
        background: 'white'
      }}>
        <div style={{
          position: 'relative',
          height: compact ? '12px' : '16px',
          background: 'linear-gradient(to right, #F3F4F6, #E5E7EB)',
          borderRadius: '999px',
          overflow: 'visible'
        }}>
          {/* プログレスバー */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, #A78BFA 0%, #EC4899 50%, #F97316 100%)',
              borderRadius: '999px',
              boxShadow: '0 2px 8px rgba(167, 139, 250, 0.4)'
            }}
          />

          {/* マイルストーンマーカー */}
          {rewards.map((reward) => {
            const status = getRewardStatus(reward)
            const position = reward.completion_percentage

            return (
              <motion.div
                key={reward.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  position: 'absolute',
                  left: `${position}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: compact ? '20px' : '24px',
                  height: compact ? '20px' : '24px',
                  borderRadius: '50%',
                  background: status === 'claimed'
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : status === 'available'
                    ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                    : 'linear-gradient(135deg, #D1D5DB, #9CA3AF)',
                  border: '2px solid white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: compact ? '10px' : '12px',
                  zIndex: 2
                }}
                title={`${position}%: ${reward.badge_title}`}
              >
                {status === 'claimed' ? '✓' : status === 'available' ? '!' : '🔒'}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 報酬一覧 */}
      <div style={{
        padding: compact ? '12px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? '8px' : '12px'
      }}>
        <AnimatePresence>
          {rewards.map((reward, index) => {
            const status = getRewardStatus(reward)
            const unclaimed = unclaimedRewards.find(u => u.id === reward.id)

            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: status === 'claimed'
                    ? 'linear-gradient(to right, #E5E7EB, #F3F4F6)'
                    : status === 'available'
                    ? 'white'
                    : 'linear-gradient(to right, #F9FAFB, #F3F4F6)',
                  borderRadius: '12px',
                  padding: compact ? '12px' : '16px',
                  boxShadow: status === 'available'
                    ? '0 4px 12px rgba(255, 215, 0, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  border: status === 'available'
                    ? '2px solid #FFD700'
                    : status === 'claimed'
                    ? '2px solid #10B981'
                    : '2px solid #E5E7EB',
                  position: 'relative',
                  opacity: status === 'locked' ? 0.6 : 1
                }}
              >
                {/* ステータスバッジ */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: status === 'claimed'
                    ? '#10B981'
                    : status === 'available'
                    ? '#FFD700'
                    : '#9CA3AF',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: compact ? '10px' : '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {status === 'claimed' ? '✓ 受取済' : status === 'available' ? '達成！' : '🔒'}
                </div>

                {/* 達成率 */}
                <div style={{
                  display: 'inline-block',
                  background: status === 'claimed'
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : status === 'available'
                    ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                    : 'linear-gradient(135deg, #D1D5DB, #9CA3AF)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: compact ? '12px' : '14px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {reward.completion_percentage}%達成
                </div>

                {/* バッジとタイトル */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: compact ? '8px' : '12px',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    fontSize: compact ? '24px' : '32px',
                    opacity: status === 'locked' ? 0.3 : 1
                  }}>
                    {reward.badge_icon || '🏆'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      margin: 0,
                      marginBottom: '4px',
                      color: status === 'locked' ? '#9CA3AF' : '#8B5A3C',
                      fontSize: compact ? '14px' : '16px',
                      fontWeight: 'bold'
                    }}>
                      {reward.badge_title}
                    </h4>
                    <p style={{
                      margin: 0,
                      color: status === 'locked' ? '#C4C4C4' : '#C4A791',
                      fontSize: compact ? '12px' : '13px',
                      lineHeight: '1.4'
                    }}>
                      {reward.badge_description}
                    </p>
                  </div>
                </div>

                {/* 報酬内容 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  background: status === 'locked'
                    ? 'rgba(0, 0, 0, 0.05)'
                    : 'rgba(167, 139, 250, 0.1)',
                  borderRadius: '8px',
                  marginBottom: status === 'available' ? '12px' : 0
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {getRewardIcon(reward.reward_type)}
                  </div>
                  <span style={{
                    flex: 1,
                    color: status === 'locked' ? '#9CA3AF' : '#8B5A3C',
                    fontSize: compact ? '12px' : '14px',
                    fontWeight: 'bold'
                  }}>
                    {reward.reward_type === 'tickets' && `シルチケ ×${reward.reward_amount}`}
                    {reward.reward_type === 'gems' && `プレシルチケ ×${reward.reward_amount}`}
                    {reward.reward_type === 'gacha_ticket' && '★5確定ガチャチケット'}
                    {reward.reward_type === 'theme' && '限定カバーデザイン'}
                    {reward.reward_type === 'badge' && `バッジ: ${reward.badge_title}`}
                  </span>

                  {/* 現在の達成率 */}
                  {status === 'locked' && unclaimed && (
                    <span style={{
                      color: '#A0826D',
                      fontSize: compact ? '11px' : '12px'
                    }}>
                      あと{(reward.completion_percentage - unclaimed.current_completion).toFixed(1)}%
                    </span>
                  )}
                </div>

                {/* 受け取りボタン */}
                {status === 'available' && unclaimed && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClaimReward(unclaimed)}
                    disabled={claimingId === reward.id}
                    style={{
                      width: '100%',
                      padding: compact ? '8px' : '12px',
                      background: claimingId === reward.id
                        ? 'linear-gradient(135deg, #D1D5DB, #E5E7EB)'
                        : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: compact ? '14px' : '16px',
                      fontWeight: 'bold',
                      cursor: claimingId === reward.id ? 'not-allowed' : 'pointer',
                      boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif"
                    }}
                  >
                    {claimingId === reward.id ? '受け取り中...' : '🎁 報酬を受け取る'}
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {rewards.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            color: '#C4A791',
            fontSize: '14px'
          }}>
            報酬がありません
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionRewardPanel
