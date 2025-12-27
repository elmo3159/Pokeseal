'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { dailyMissionService } from '@/services/dailyMissions'
import type { UserDailyMission } from '@/services/dailyMissions/dailyMissionService'

interface DailyMissionPanelProps {
  userId: string
  onRewardClaimed?: (mission: UserDailyMission) => void
  className?: string
  compact?: boolean
}

/**
 * デイリーミッション一覧パネル
 * パステルピンク基調、茶色のアクセント
 */
export const DailyMissionPanel: React.FC<DailyMissionPanelProps> = ({
  userId,
  onRewardClaimed,
  className = '',
  compact = false
}) => {
  const [missions, setMissions] = useState<UserDailyMission[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)

  // ミッション一覧を取得
  const loadMissions = async () => {
    setLoading(true)
    const data = await dailyMissionService.getTodayMissions(userId)
    setMissions(data)
    setLoading(false)
  }

  useEffect(() => {
    if (userId) {
      loadMissions()
    }
  }, [userId])

  // 報酬を受け取る
  const handleClaimReward = async (mission: UserDailyMission) => {
    if (claimingId || !mission.is_completed || mission.claimed) return

    setClaimingId(mission.id)

    const success = await dailyMissionService.claimReward(userId, mission.mission_id)

    if (success) {
      // ミッション一覧を更新
      await loadMissions()

      // コールバックを呼ぶ
      if (onRewardClaimed) {
        onRewardClaimed(mission)
      }
    }

    setClaimingId(null)
  }

  // ミッションアイコンを取得
  const getMissionIcon = (missionId: string): string => {
    if (missionId.includes('gacha')) return '🎰'
    if (missionId.includes('sticker')) return '✨'
    if (missionId.includes('post')) return '📝'
    if (missionId.includes('like')) return '❤️'
    if (missionId.includes('trade')) return '🤝'
    if (missionId.includes('login')) return '🎁'
    return '⭐'
  }

  // 報酬アイコンを取得
  const getRewardIcon = (rewardType: string): string => {
    if (rewardType === 'tickets') return '🎟️'
    if (rewardType === 'stars') return '⭐'
    if (rewardType === 'gems') return '💎'
    if (rewardType === 'exp') return '✨'
    return '🎁'
  }

  // 進捗率を計算
  const getProgressPercent = (mission: UserDailyMission): number => {
    return Math.min(100, (mission.progress / mission.mission.goal) * 100)
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
        background: 'linear-gradient(135deg, #FFB6D9 0%, #FF8DC7 100%)',
        padding: compact ? '12px 16px' : '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: compact ? '20px' : '24px' }}>📋</span>
          <h3 style={{
            margin: 0,
            color: 'white',
            fontSize: compact ? '16px' : '18px',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            デイリーミッション
          </h3>
        </div>

        {/* 未受取数バッジ */}
        {missions.filter(m => m.is_completed && !m.claimed).length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              background: '#FFD700',
              color: '#8B5A3C',
              borderRadius: '12px',
              padding: '4px 12px',
              fontSize: compact ? '12px' : '14px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {missions.filter(m => m.is_completed && !m.claimed).length}件達成！
          </motion.div>
        )}
      </div>

      {/* ミッション一覧 */}
      <div style={{
        padding: compact ? '12px' : '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? '8px' : '12px'
      }}>
        <AnimatePresence>
          {missions.map((mission, index) => {
            const progress = getProgressPercent(mission)
            const isCompleted = mission.is_completed
            const isClaimed = mission.claimed

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: isClaimed
                    ? 'linear-gradient(to right, #E5E7EB, #F3F4F6)'
                    : 'white',
                  borderRadius: '12px',
                  padding: compact ? '12px' : '16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  border: isCompleted && !isClaimed
                    ? '2px solid #FFD700'
                    : '1px solid #FFE5EF',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* 完了マーク */}
                {isClaimed && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: '#10B981',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
                  </div>
                )}

                {/* ミッション情報 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: compact ? '8px' : '12px',
                  marginBottom: '8px'
                }}>
                  {/* アイコン */}
                  <div style={{
                    fontSize: compact ? '24px' : '32px',
                    flexShrink: 0,
                    opacity: isClaimed ? 0.5 : 1
                  }}>
                    {getMissionIcon(mission.mission_id)}
                  </div>

                  {/* タイトルと進捗 */}
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      margin: 0,
                      marginBottom: '4px',
                      color: isClaimed ? '#9CA3AF' : '#8B5A3C',
                      fontSize: compact ? '14px' : '16px',
                      fontWeight: 'bold'
                    }}>
                      {mission.mission.title}
                    </h4>

                    {/* 進捗 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <div style={{
                        flex: 1,
                        height: '8px',
                        background: '#F3F4F6',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                          style={{
                            height: '100%',
                            background: isClaimed
                              ? 'linear-gradient(90deg, #9CA3AF, #D1D5DB)'
                              : isCompleted
                              ? 'linear-gradient(90deg, #FFD700, #FFA500)'
                              : 'linear-gradient(90deg, #FFB6D9, #FF8DC7)',
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                      <span style={{
                        color: isClaimed ? '#9CA3AF' : '#A0826D',
                        fontSize: compact ? '12px' : '14px',
                        fontWeight: 'bold',
                        minWidth: '50px',
                        textAlign: 'right'
                      }}>
                        {mission.progress} / {mission.mission.goal}
                      </span>
                    </div>

                    {/* 報酬 */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: compact ? '12px' : '14px',
                      color: isClaimed ? '#9CA3AF' : '#C4A791'
                    }}>
                      <span>{getRewardIcon(mission.mission.reward_type)}</span>
                      <span>{mission.mission.reward_type === 'exp' ? `EXP +${mission.mission.reward_amount}` : `${mission.mission.reward_amount}個`}</span>
                    </div>
                  </div>
                </div>

                {/* 受け取りボタン */}
                {isCompleted && !isClaimed && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClaimReward(mission)}
                    disabled={claimingId === mission.id}
                    style={{
                      width: '100%',
                      padding: compact ? '8px' : '12px',
                      marginTop: '8px',
                      background: claimingId === mission.id
                        ? 'linear-gradient(135deg, #D1D5DB, #E5E7EB)'
                        : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: compact ? '14px' : '16px',
                      fontWeight: 'bold',
                      cursor: claimingId === mission.id ? 'not-allowed' : 'pointer',
                      boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif"
                    }}
                  >
                    {claimingId === mission.id ? '受け取り中...' : '🎁 報酬を受け取る'}
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {missions.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '32px',
            color: '#C4A791',
            fontSize: '14px'
          }}>
            ミッションがありません
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyMissionPanel
