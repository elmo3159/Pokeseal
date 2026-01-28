'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getLevelTitle, LevelUpReward } from '@/domain/levelSystem'

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  newLevel: number
  rewards?: LevelUpReward[]
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newLevel,
  rewards = [],
}) => {
  const [showContent, setShowContent] = useState(false)
  const title = getLevelTitle(newLevel)

  useEffect(() => {
    if (isOpen) {
      // アニメーション開始を少し遅らせる
      const timer = setTimeout(() => setShowContent(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isOpen])

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
            zIndex: 5000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* キラキラエフェクト */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    fontSize: '24px',
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: Math.cos((i * 30 * Math.PI) / 180) * 120,
                    y: Math.sin((i * 30 * Math.PI) / 180) * 120,
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.3 + i * 0.05,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  {i % 3 === 0 ? '⭐' : i % 3 === 1 ? '✨' : '🌟'}
                </motion.div>
              ))}
            </motion.div>

            {/* メインカード */}
            <motion.div
              style={{
                position: 'relative',
                background: 'linear-gradient(to bottom right, #FEF9C3, #FCE7F3, #F3E8FF)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '4px solid #FDE047',
                minWidth: '280px',
                maxWidth: '320px',
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
              }}
            >
              {/* 王冠アイコン */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: '-34px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '72px',
                  height: '72px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <span
                  style={{
                    fontSize: '48px',
                    lineHeight: 1,
                    display: 'block',
                    textAlign: 'center',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                  }}
                >
                  👑
                </span>
              </motion.div>

              {/* LEVEL UP! テキスト */}
              <motion.div
                style={{ textAlign: 'center', marginBottom: '16px', marginTop: '16px' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', damping: 10 }}
              >
                <h2
                  style={{
                    fontSize: '30px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #FFD700 0%, #FF6B9D 50%, #A78BFA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  LEVEL UP!
                </h2>
              </motion.div>

              {/* レベル表示 */}
              {showContent && (
                <motion.div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    marginBottom: '16px',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      boxShadow: '0 4px 20px rgba(255, 215, 0, 0.5)',
                    }}
                  >
                    <span style={{
                      fontSize: '32px',
                      fontWeight: 800,
                      color: 'white',
                      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
                    }}>
                      {newLevel}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* 称号表示 */}
              {showContent && (
                <motion.div
                  style={{ textAlign: 'center', marginBottom: '16px' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p style={{ fontSize: '14px', color: '#A78BFA', marginBottom: '4px' }}>しょうごうをてにいれた！</p>
                  <div
                    style={{
                      display: 'inline-block',
                      paddingLeft: '24px',
                      paddingRight: '24px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      borderRadius: '9999px',
                      background: 'linear-gradient(135deg, #FF9ED2 0%, #FF6BAE 100%)',
                      boxShadow: '0 4px 12px rgba(255, 107, 174, 0.4)',
                    }}
                  >
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                      {title}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* ご褒美表示 */}
              {showContent && rewards.length > 0 && (
                <motion.div
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '16px',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <p style={{ fontSize: '12px', color: '#A78BFA', textAlign: 'center', marginBottom: '8px' }}>ごほうび</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                    {rewards.map((reward, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          paddingLeft: '12px',
                          paddingRight: '12px',
                          paddingTop: '4px',
                          paddingBottom: '4px',
                          background: 'white',
                          borderRadius: '9999px',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                          fontSize: '14px',
                        }}
                      >
                        <span>
                          {reward.type === 'gacha_ticket' ? '🎟️' :
                           reward.type === 'star_points' ? '⭐' :
                           reward.type === 'theme_unlock' ? '🎨' : '🏆'}
                        </span>
                        <span style={{ fontWeight: 'bold', color: '#7C3AED' }}>
                          {reward.name}
                          {reward.amount && ` x${reward.amount}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 閉じるボタン */}
              <motion.button
                onClick={onClose}
                style={{
                  width: '100%',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  borderRadius: '9999px',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  color: 'white',
                  background: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
                  boxShadow: '0 4px 12px rgba(167, 139, 250, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                やったー！
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LevelUpModal
