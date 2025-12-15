'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Achievement } from './ProfileView'
import {
  TrophyIcon,
  PaletteIcon,
  HandshakeIcon,
  UsersGroupIcon,
  StarIcon,
  TargetIcon,
  CelebrationIcon,
} from '@/components/icons/ProfileIcons'

interface AchievementsModalProps {
  isOpen: boolean
  onClose: () => void
  achievements: Achievement[]
}

// 実績カード
const AchievementCard: React.FC<{
  achievement: Achievement
  index: number
}> = ({ achievement, index }) => {
  const { name, icon, description, unlockedAt, isUnlocked } = achievement

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        position: 'relative',
        padding: '12px 16px',
        background: isUnlocked
          ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
          : 'rgba(200, 200, 200, 0.3)',
        borderRadius: '16px',
        boxShadow: isUnlocked ? '0 4px 12px rgba(124, 58, 237, 0.15)' : 'none',
        border: isUnlocked
          ? '2px solid rgba(167, 139, 250, 0.3)'
          : '2px solid rgba(200, 200, 200, 0.3)',
        overflow: 'hidden',
      }}
    >
      {/* 解放済みのキラキラエフェクト */}
      {isUnlocked && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60px',
            height: '60px',
            background: 'radial-gradient(circle at top right, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* アイコン */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isUnlocked
              ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
              : 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
            boxShadow: isUnlocked
              ? '0 4px 12px rgba(255, 215, 0, 0.4)'
              : '0 2px 8px rgba(0,0,0,0.1)',
            flexShrink: 0,
            filter: isUnlocked ? 'none' : 'grayscale(100%)',
          }}
        >
          <span
            style={{
              fontSize: '28px',
              filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(0.5)',
            }}
          >
            {isUnlocked ? icon : '🔒'}
          </span>
        </div>

        {/* 情報 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              fontSize: '15px',
              fontWeight: 'bold',
              color: isUnlocked ? '#4A2068' : '#9CA3AF',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              marginBottom: '2px',
            }}
          >
            {isUnlocked ? name : '???'}
          </h4>
          <p
            style={{
              fontSize: '12px',
              color: isUnlocked ? '#7A5090' : '#9CA3AF',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              lineHeight: 1.4,
            }}
          >
            {isUnlocked ? description : 'まだかいほうされていません'}
          </p>
          {isUnlocked && unlockedAt && (
            <p
              style={{
                fontSize: '10px',
                color: '#A78BFA',
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
                marginTop: '4px',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}><CelebrationIcon size={12} /></span> {new Date(unlockedAt).toLocaleDateString('ja-JP')} かいほう
            </p>
          )}
        </div>

        {/* 解放済みマーク */}
        {isUnlocked && (
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
              flexShrink: 0,
            }}
          >
            <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// カテゴリごとの実績リスト
const AchievementCategory: React.FC<{
  title: string
  icon: React.ReactNode
  achievements: Achievement[]
  startIndex: number
}> = ({ title, icon, achievements, startIndex }) => {
  const unlockedCount = achievements.filter(a => a.isUnlocked).length

  return (
    <div style={{ marginBottom: '20px' }}>
      {/* カテゴリヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          paddingLeft: '4px',
          paddingRight: '4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{icon}</span>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#4A2068',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            {title}
          </h3>
        </div>
        <span
          style={{
            fontSize: '12px',
            color: '#A78BFA',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          {unlockedCount} / {achievements.length}
        </span>
      </div>

      {/* 実績リスト */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {achievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            index={startIndex + index}
          />
        ))}
      </div>
    </div>
  )
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  achievements,
}) => {
  // 実績をカテゴリ別に分類
  const categorizedAchievements = useMemo(() => {
    // IDのプレフィックスでカテゴリを判定
    const collection = achievements.filter(a => a.id.startsWith('collection'))
    const trade = achievements.filter(a => a.id.startsWith('trade'))
    const social = achievements.filter(a => a.id.startsWith('social'))
    const others = achievements.filter(a =>
      !a.id.startsWith('collection') &&
      !a.id.startsWith('trade') &&
      !a.id.startsWith('social')
    )

    return { collection, trade, social, others }
  }, [achievements])

  const unlockedCount = achievements.filter(a => a.isUnlocked).length
  const totalCount = achievements.length
  const progressPercent = Math.round((unlockedCount / totalCount) * 100)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* バックドロップ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
            }}
          />

          {/* モーダルコンテナ（中央配置用） */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              pointerEvents: 'none',
              padding: '20px',
            }}
          >
            {/* モーダル */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                width: '100%',
                maxWidth: '400px',
                maxHeight: '85vh',
                background: 'linear-gradient(135deg, #FFF5F8 0%, #F3E8FF 100%)',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto',
              }}
            >
            {/* ヘッダー */}
            <div
              style={{
                padding: '20px 24px 16px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrophyIcon size={32} color="#FFFFFF" />
                <div>
                  <h2
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'white',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    じっせき
                  </h2>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    }}
                  >
                    たくさんあつめてチャレンジ！
                  </p>
                </div>
              </div>

              {/* 閉じるボタン */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: 'white', fontSize: '18px' }}>✕</span>
              </button>
            </div>

            {/* 進捗サマリー */}
            <div
              style={{
                padding: '16px 20px',
                background: 'rgba(255, 255, 255, 0.5)',
                borderBottom: '1px solid rgba(167, 139, 250, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '14px',
                    color: '#7A5090',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  }}
                >
                  かいほうずみ
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#4A2068',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  }}
                >
                  {unlockedCount} / {totalCount}
                </span>
              </div>
              <div
                style={{
                  height: '10px',
                  background: 'rgba(167, 139, 250, 0.2)',
                  borderRadius: '5px',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                    borderRadius: '5px',
                  }}
                />
              </div>
            </div>

            {/* コンテンツ */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
              }}
            >
              {/* コレクション系 */}
              {categorizedAchievements.collection.length > 0 && (
                <AchievementCategory
                  title="コレクション"
                  icon={<PaletteIcon size={20} />}
                  achievements={categorizedAchievements.collection}
                  startIndex={0}
                />
              )}

              {/* 交換系 */}
              {categorizedAchievements.trade.length > 0 && (
                <AchievementCategory
                  title="こうかん"
                  icon={<HandshakeIcon size={20} />}
                  achievements={categorizedAchievements.trade}
                  startIndex={categorizedAchievements.collection.length}
                />
              )}

              {/* ソーシャル系 */}
              {categorizedAchievements.social.length > 0 && (
                <AchievementCategory
                  title="なかま"
                  icon={<UsersGroupIcon size={20} />}
                  achievements={categorizedAchievements.social}
                  startIndex={categorizedAchievements.collection.length + categorizedAchievements.trade.length}
                />
              )}

              {/* その他 */}
              {categorizedAchievements.others.length > 0 && (
                <AchievementCategory
                  title="スペシャル"
                  icon={<StarIcon size={20} />}
                  achievements={categorizedAchievements.others}
                  startIndex={
                    categorizedAchievements.collection.length +
                    categorizedAchievements.trade.length +
                    categorizedAchievements.social.length
                  }
                />
              )}

              {/* 実績がない場合 */}
              {achievements.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}><TargetIcon size={48} /></div>
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#9B6FD0',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    }}
                  >
                    まだじっせきがありません
                  </p>
                </div>
              )}
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AchievementsModal
