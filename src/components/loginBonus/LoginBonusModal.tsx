'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loginBonusService } from '@/services/loginBonus'
import type { LoginBonus } from '@/services/loginBonus/loginBonusService'

interface LoginBonusModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onBonusClaimed?: (bonus: LoginBonus) => void
}

// 7日間の報酬定義（UI表示用）
const BONUS_SCHEDULE = [
  { day: 1, icon: '🎟️', reward: 'シルチケ ×2', color: '#FFB6D9' },
  { day: 2, icon: '🎟️', reward: 'シルチケ ×3', color: '#FFB6D9' },
  { day: 3, icon: '💎', reward: 'プレシル ×1', color: '#A78BFA' },
  { day: 4, icon: '🎟️', reward: 'シルチケ ×5', color: '#FFB6D9' },
  { day: 5, icon: '🎨', reward: 'デコアイテム', color: '#FFA500' },
  { day: 6, icon: '🎟️', reward: 'シルチケ ×10', color: '#FFB6D9' },
  { day: 7, icon: '⭐', reward: '★4確定チケット', color: '#FFD700' }
]

/**
 * ログインボーナスモーダル
 * 7日間連続ログインボーナスシステム
 */
export const LoginBonusModal: React.FC<LoginBonusModalProps> = ({
  isOpen,
  onClose,
  userId,
  onBonusClaimed
}) => {
  const [bonus, setBonus] = useState<LoginBonus | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // ボーナス情報を取得
  useEffect(() => {
    if (isOpen && userId) {
      loadBonus()
    }
  }, [isOpen, userId])

  const loadBonus = async () => {
    setLoading(true)
    const data = await loginBonusService.getTodayBonus(userId)
    setBonus(data)
    setLoading(false)

    // 未受取の場合はお祝いアニメーションを表示
    if (data && !data.claimed) {
      setShowCelebration(true)
    }
  }

  // ボーナスを受け取る
  const handleClaimBonus = async () => {
    if (!bonus || bonus.claimed || claiming) return

    setClaiming(true)
    const success = await loginBonusService.claimBonus(userId)

    if (success) {
      // 更新されたボーナス情報を取得
      await loadBonus()

      // コールバックを呼ぶ
      if (onBonusClaimed && bonus) {
        onBonusClaimed({ ...bonus, claimed: true, claimed_at: new Date().toISOString() })
      }
    }

    setClaiming(false)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            fontFamily: "'M PLUS Rounded 1c', sans-serif"
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
              position: 'relative',
              background: 'linear-gradient(to bottom, #FFF5F8, #FFE5EF)',
              borderRadius: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '3px solid #FFB6D9'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* キラキラエフェクト */}
            {showCelebration && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none',
                  overflow: 'hidden',
                  borderRadius: '24px'
                }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: 'absolute',
                      fontSize: '20px',
                      left: `${Math.random() * 100}%`,
                      top: '-20px'
                    }}
                    initial={{ y: 0, opacity: 1, rotate: 0 }}
                    animate={{
                      y: 600,
                      opacity: 0,
                      rotate: 360
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: i * 0.1,
                      ease: 'easeOut'
                    }}
                  >
                    {i % 4 === 0 ? '⭐' : i % 4 === 1 ? '✨' : i % 4 === 2 ? '🌟' : '💫'}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ヘッダー */}
            <div style={{
              background: 'linear-gradient(135deg, #FFB6D9 0%, #FF8DC7 100%)',
              padding: '20px',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              textAlign: 'center'
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎁</div>
                <h2 style={{
                  margin: 0,
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  ログインボーナス
                </h2>
                {bonus && (
                  <p style={{
                    margin: '8px 0 0 0',
                    color: 'white',
                    fontSize: '14px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}>
                    連続 {bonus.consecutive_days} 日目！
                  </p>
                )}
              </motion.div>
            </div>

            {/* ボディ */}
            <div style={{ padding: '20px' }}>
              {loading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '32px',
                  color: '#C4A791'
                }}>
                  読み込み中...
                </div>
              ) : bonus ? (
                <>
                  {/* 7日間カレンダー */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '8px',
                    marginBottom: '24px'
                  }}>
                    {BONUS_SCHEDULE.map((schedule, index) => {
                      const isToday = bonus.reward_day === schedule.day
                      const isPast = bonus.reward_day > schedule.day
                      const isClaimed = isPast || (isToday && bonus.claimed)

                      return (
                        <motion.div
                          key={schedule.day}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          style={{
                            position: 'relative',
                            background: isToday
                              ? `linear-gradient(135deg, ${schedule.color}, ${schedule.color}dd)`
                              : isClaimed
                              ? 'linear-gradient(135deg, #D1D5DB, #E5E7EB)'
                              : 'white',
                            borderRadius: '12px',
                            padding: '12px 8px',
                            textAlign: 'center',
                            boxShadow: isToday
                              ? `0 4px 12px ${schedule.color}88`
                              : '0 2px 4px rgba(0,0,0,0.1)',
                            border: isToday
                              ? '3px solid #FFD700'
                              : isClaimed
                              ? '2px solid #D1D5DB'
                              : '2px solid #FFE5EF',
                            transform: isToday ? 'scale(1.05)' : 'scale(1)'
                          }}
                        >
                          {/* 完了チェック */}
                          {isClaimed && (
                            <div style={{
                              position: 'absolute',
                              top: '-4px',
                              right: '-4px',
                              background: '#10B981',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid white'
                            }}>
                              <span style={{ color: 'white', fontSize: '10px' }}>✓</span>
                            </div>
                          )}

                          {/* 日数 */}
                          <div style={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: isToday ? 'white' : isClaimed ? '#9CA3AF' : '#8B5A3C',
                            marginBottom: '4px'
                          }}>
                            {schedule.day}日
                          </div>

                          {/* アイコン */}
                          <div style={{
                            fontSize: '24px',
                            marginBottom: '4px',
                            opacity: isClaimed && !isToday ? 0.5 : 1
                          }}>
                            {schedule.icon}
                          </div>

                          {/* 報酬 */}
                          <div style={{
                            fontSize: '10px',
                            color: isToday ? 'white' : isClaimed ? '#9CA3AF' : '#A0826D',
                            fontWeight: 'bold',
                            lineHeight: '1.2'
                          }}>
                            {schedule.reward.split(' ').map((word, i) => (
                              <div key={i}>{word}</div>
                            ))}
                          </div>

                          {/* 今日のマーク */}
                          {isToday && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              style={{
                                position: 'absolute',
                                top: '-8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '16px'
                              }}
                            >
                              👑
                            </motion.div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* 今日の報酬詳細 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      border: '2px solid #FFE5EF'
                    }}
                  >
                    <div style={{
                      textAlign: 'center',
                      marginBottom: '16px'
                    }}>
                      <p style={{
                        margin: 0,
                        marginBottom: '8px',
                        color: '#A0826D',
                        fontSize: '14px'
                      }}>
                        今日のボーナス
                      </p>
                      <div style={{
                        fontSize: '48px',
                        marginBottom: '8px'
                      }}>
                        {BONUS_SCHEDULE[bonus.reward_day - 1]?.icon}
                      </div>
                      <h3 style={{
                        margin: 0,
                        color: '#8B5A3C',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>
                        {bonus.reward_description}
                      </h3>
                    </div>

                    {/* 受け取りボタン */}
                    {!bonus.claimed ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClaimBonus}
                        disabled={claiming}
                        style={{
                          width: '100%',
                          padding: '16px',
                          background: claiming
                            ? 'linear-gradient(135deg, #D1D5DB, #E5E7EB)'
                            : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '18px',
                          fontWeight: 'bold',
                          cursor: claiming ? 'not-allowed' : 'pointer',
                          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
                          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          fontFamily: "'M PLUS Rounded 1c', sans-serif"
                        }}
                      >
                        {claiming ? '受け取り中...' : '🎁 ボーナスを受け取る！'}
                      </motion.button>
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                      }}>
                        ✓ 受け取り済み
                      </div>
                    )}
                  </motion.div>

                  {/* メッセージ */}
                  <p style={{
                    textAlign: 'center',
                    margin: 0,
                    marginBottom: '16px',
                    color: '#C4A791',
                    fontSize: '13px',
                    lineHeight: '1.6'
                  }}>
                    {bonus.consecutive_days === 7
                      ? '🎉 7日間連続ログイン達成！明日からまた1日目からスタートするよ！'
                      : '毎日ログインして豪華なボーナスをゲットしよう！'}
                  </p>
                </>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '32px',
                  color: '#C4A791'
                }}>
                  ボーナス情報が取得できませんでした
                </div>
              )}

              {/* 閉じるボタン */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(167, 139, 250, 0.4)',
                  fontFamily: "'M PLUS Rounded 1c', sans-serif"
                }}
              >
                とじる
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoginBonusModal
