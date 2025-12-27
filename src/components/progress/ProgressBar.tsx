'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  level: number
  currentExp: number
  expForNextLevel: number
  title?: string
  className?: string
  showTitle?: boolean
  size?: 'small' | 'medium' | 'large'
}

/**
 * 経験値バーコンポーネント
 * パステルピンク基調、茶色のアクセントで可愛いデザイン
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  level,
  currentExp,
  expForNextLevel,
  title,
  className = '',
  showTitle = true,
  size = 'medium'
}) => {
  const [progress, setProgress] = useState(0)

  // 進捗率を計算（0-100）
  const progressPercentage = expForNextLevel > 0
    ? Math.min(100, (currentExp / expForNextLevel) * 100)
    : 100

  // アニメーション用に進捗を徐々に更新
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progressPercentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [progressPercentage])

  // サイズに応じた高さ（バー部分のみ）
  const heights = {
    small: '16px',
    medium: '20px',
    large: '28px'
  }

  const fontSize = {
    small: { level: '14px', exp: '10px', title: '10px' },
    medium: { level: '18px', exp: '12px', title: '12px' },
    large: { level: '24px', exp: '14px', title: '14px' }
  }

  return (
    <div
      className={className}
      style={{
        width: '100%',
        fontFamily: "'M PLUS Rounded 1c', sans-serif"
      }}
    >
      {/* レベルと称号 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px',
        paddingLeft: '4px',
        paddingRight: '4px'
      }}>
        {/* レベル表示 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFB6D9 0%, #FF8DC7 100%)',
            borderRadius: '50%',
            width: size === 'small' ? '32px' : size === 'medium' ? '40px' : '48px',
            height: size === 'small' ? '32px' : size === 'medium' ? '40px' : '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(255, 141, 199, 0.3)',
            border: '2px solid white'
          }}>
            <span style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: fontSize[size].level,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              Lv{level}
            </span>
          </div>

          {/* 称号 */}
          {showTitle && title && (
            <div style={{
              background: 'linear-gradient(135deg, #FFF5F8 0%, #FFE5EF 100%)',
              paddingLeft: '12px',
              paddingRight: '12px',
              paddingTop: '4px',
              paddingBottom: '4px',
              borderRadius: '12px',
              border: '1px solid #FFB6D9',
              boxShadow: '0 1px 4px rgba(255, 182, 217, 0.2)'
            }}>
              <span style={{
                color: '#8B5A3C',
                fontSize: fontSize[size].title,
                fontWeight: 'bold'
              }}>
                {title}
              </span>
            </div>
          )}
        </div>

        {/* 経験値数値 */}
        <div style={{
          fontSize: fontSize[size].exp,
          color: '#A0826D',
          fontWeight: 'bold'
        }}>
          {currentExp} / {expForNextLevel}
        </div>
      </div>

      {/* 経験値バー */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: heights[size],
        background: 'linear-gradient(to bottom, #FFF5F8, #FFE5EF)',
        borderRadius: '999px',
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '2px solid #FFB6D9'
      }}>
        {/* プログレスバー（アニメーション付き） */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #FFB6D9 0%, #FF8DC7 50%, #FFB6D9 100%)',
            backgroundSize: '200% 100%',
            borderRadius: '999px',
            boxShadow: '0 2px 8px rgba(255, 141, 199, 0.4)'
          }}
        >
          {/* キラキラエフェクト */}
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '200% 0%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              borderRadius: '999px'
            }}
          />
        </motion.div>

        {/* 進捗テキスト（バーの上に重ねる） */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}>
          <span style={{
            color: progress > 50 ? 'white' : '#8B5A3C',
            fontWeight: 'bold',
            fontSize: fontSize[size].exp,
            textShadow: progress > 50 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
            transition: 'color 0.3s, text-shadow 0.3s'
          }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* レベルアップまでの経験値 */}
      <div style={{
        marginTop: '4px',
        textAlign: 'center',
        fontSize: fontSize[size].exp,
        color: '#C4A791'
      }}>
        レベルアップまであと {expForNextLevel - currentExp} EXP
      </div>
    </div>
  )
}

export default ProgressBar
