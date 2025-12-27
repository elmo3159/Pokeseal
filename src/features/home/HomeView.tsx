'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ProgressBar } from '@/components/progress/ProgressBar'
import { DailyMissionPanel } from '@/components/missions/DailyMissionPanel'
import { CollectionRewardPanel } from '@/components/collectionRewards/CollectionRewardPanel'
import { LoginBonusModal } from '@/components/loginBonus/LoginBonusModal'
import { progressService } from '@/services/progress'
import { dailyMissionService } from '@/services/dailyMissions'
import { loginBonusService } from '@/services/loginBonus'
import type { UserProgress } from '@/services/progress/progressService'
import type { UserDailyMission } from '@/services/dailyMissions/dailyMissionService'
import type { LoginBonus } from '@/services/loginBonus/loginBonusService'
import type { CollectionReward } from '@/services/collectionRewards/collectionRewardService'

interface HomeViewProps {
  userId: string
}

/**
 * ホーム画面ビュー
 * Phase 1 機能の統合表示:
 * - レベル・経験値システム
 * - デイリーミッション
 * - ログインボーナス
 * - 図鑑達成報酬
 */
export const HomeView: React.FC<HomeViewProps> = ({ userId }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [unclaimedMissionsCount, setUnclaimedMissionsCount] = useState(0)
  const [showLoginBonus, setShowLoginBonus] = useState(false)
  const [loading, setLoading] = useState(true)

  // データを取得
  useEffect(() => {
    if (userId) {
      loadData()
      checkLoginBonus()
    }
  }, [userId])

  const loadData = async () => {
    setLoading(true)

    const [progressData, unclaimedCount] = await Promise.all([
      progressService.getOrCreateProgress(userId),
      dailyMissionService.getUnclaimedCount(userId)
    ])

    setProgress(progressData)
    setUnclaimedMissionsCount(unclaimedCount)
    setLoading(false)
  }

  // ログインボーナスをチェック（未受取の場合はモーダル表示）
  const checkLoginBonus = async () => {
    const bonus = await loginBonusService.getTodayBonus(userId)
    if (bonus && !bonus.claimed) {
      setShowLoginBonus(true)
    }
  }

  // ミッション報酬受け取り時
  const handleMissionRewardClaimed = async (mission: UserDailyMission) => {
    // 経験値を追加
    if (mission.mission.reward_type === 'exp') {
      await progressService.addExp(userId, mission.mission.reward_amount)
      await loadData()
    }

    // 未受取数を更新
    const count = await dailyMissionService.getUnclaimedCount(userId)
    setUnclaimedMissionsCount(count)
  }

  // 図鑑報酬受け取り時
  const handleCollectionRewardClaimed = async (reward: CollectionReward) => {
    // データを再読み込み
    await loadData()
  }

  // ログインボーナス受け取り時
  const handleBonusClaimed = async (bonus: LoginBonus) => {
    // データを再読み込み
    await loadData()
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        color: '#C4A791'
      }}>
        読み込み中...
      </div>
    )
  }

  if (!progress) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        color: '#C4A791'
      }}>
        データの取得に失敗しました
      </div>
    )
  }

  const expForNextLevel = progressService.getExpForNextLevel(progress.level)

  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '16px',
      fontFamily: "'M PLUS Rounded 1c', sans-serif"
    }}>
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: '24px',
          textAlign: 'center'
        }}
      >
        <h1 style={{
          margin: 0,
          marginBottom: '8px',
          color: '#8B5A3C',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          ホーム
        </h1>
        <p style={{
          margin: 0,
          color: '#C4A791',
          fontSize: '14px'
        }}>
          毎日ログインして、ミッションをクリアしよう！
        </p>
      </motion.div>

      {/* 経験値バー */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: '24px' }}
      >
        <ProgressBar
          level={progress.level}
          currentExp={progress.exp}
          expForNextLevel={expForNextLevel}
          title={progress.title}
          showTitle={true}
          size="large"
        />
      </motion.div>

      {/* 通知バッジエリア */}
      {unclaimedMissionsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
          }}
        >
          <span style={{ fontSize: '24px' }}>🎁</span>
          <div style={{ flex: 1 }}>
            <span style={{
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              {unclaimedMissionsCount}件の報酬が受け取れます！
            </span>
          </div>
        </motion.div>
      )}

      {/* デイリーミッションパネル */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginBottom: '24px' }}
      >
        <DailyMissionPanel
          userId={userId}
          onRewardClaimed={handleMissionRewardClaimed}
        />
      </motion.div>

      {/* 図鑑報酬パネル */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ marginBottom: '24px' }}
      >
        <CollectionRewardPanel
          userId={userId}
          onRewardClaimed={handleCollectionRewardClaimed}
        />
      </motion.div>

      {/* ログインボーナスモーダル */}
      <LoginBonusModal
        isOpen={showLoginBonus}
        onClose={() => setShowLoginBonus(false)}
        userId={userId}
        onBonusClaimed={handleBonusClaimed}
      />

      {/* フッターメッセージ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          textAlign: 'center',
          padding: '24px',
          color: '#C4A791',
          fontSize: '13px',
          lineHeight: '1.6'
        }}
      >
        <p style={{ margin: 0, marginBottom: '8px' }}>
          💡 毎日ログインしてボーナスをゲットしよう！
        </p>
        <p style={{ margin: 0 }}>
          ✨ ミッションをクリアしてレベルアップ！
        </p>
      </motion.div>
    </div>
  )
}

export default HomeView
