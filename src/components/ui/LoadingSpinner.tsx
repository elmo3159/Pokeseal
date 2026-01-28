'use client'

import { useEffect, useState } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  text?: string
}

const sizeMap = {
  sm: { spinner: 24, text: '14px' },
  md: { spinner: 40, text: '16px' },
  lg: { spinner: 56, text: '18px' },
}

export function LoadingSpinner({
  size = 'md',
  color = 'var(--color-primary)',
  text,
}: LoadingSpinnerProps) {
  const { spinner, text: fontSize } = sizeMap[size]

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* カプセル風のスピナー */}
      <div
        className="relative animate-spin"
        style={{
          width: spinner,
          height: spinner,
        }}
      >
        <svg
          viewBox="0 0 50 50"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {/* 背景の円 */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="4"
            opacity="0.3"
          />
          {/* 回転する円 */}
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="80, 200"
            strokeDashoffset="0"
          />
        </svg>
        {/* キラキラ */}
        <span
          className="absolute -top-1 -right-1 text-sm animate-pulse"
          style={{ fontSize: spinner / 3 }}
        >
          ✨
        </span>
      </div>

      {text && (
        <p
          style={{
            fontSize,
            color: 'var(--color-text-secondary)',
            fontWeight: 500,
          }}
        >
          {text}
        </p>
      )}
    </div>
  )
}

// ロード画面用キャラクター画像
const LOADING_CHARACTERS = [
  '/stickers/トイラン/トイラン_1.png',
  '/stickers/メルト・ヴィヴィ/ボンドロ/メルト・ヴィヴィ_1.png',
  '/stickers/ルミナ・スターダスト/ルミナ・スターダスト_1.png',
  '/stickers/トイラン/トイラン_3.png',
  '/stickers/メルト・ヴィヴィ/ボンドロ/メルト・ヴィヴィ_5.png',
]

// キラキラ星コンポーネント
function Sparkle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `sparkle 2s ease-in-out ${delay}s infinite`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
          fill="url(#sparkleGradient)"
        />
        <defs>
          <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFF8DC" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// 浮遊キャラクターコンポーネント
function FloatingCharacter({
  src,
  delay,
  x,
  size,
  floatHeight
}: {
  src: string
  delay: number
  x: number
  size: number
  floatHeight: number
}) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        bottom: '30%',
        transform: 'translateX(-50%)',
        animation: `float ${3 + delay * 0.5}s ease-in-out ${delay}s infinite`,
        ['--float-height' as string]: `${floatHeight}px`,
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          filter: 'drop-shadow(0 4px 8px rgba(139, 92, 246, 0.3))',
        }}
      />
    </div>
  )
}

// アニメーションドット
function AnimatedDots() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return <span style={{ display: 'inline-block', width: '1.5em', textAlign: 'left' }}>{dots}</span>
}

// 全画面ローディング（かわいいバージョン）
export function FullScreenLoading({ text = 'よみこみちゅう' }: { text?: string }) {
  // ランダムなキラキラ位置を生成
  const sparkles = [
    { x: 10, y: 15, size: 16, delay: 0 },
    { x: 85, y: 20, size: 20, delay: 0.3 },
    { x: 25, y: 70, size: 14, delay: 0.6 },
    { x: 75, y: 65, size: 18, delay: 0.9 },
    { x: 50, y: 10, size: 12, delay: 1.2 },
    { x: 15, y: 45, size: 15, delay: 1.5 },
    { x: 90, y: 50, size: 13, delay: 1.8 },
    { x: 60, y: 80, size: 17, delay: 0.2 },
    { x: 35, y: 25, size: 11, delay: 0.7 },
    { x: 70, y: 35, size: 19, delay: 1.1 },
  ]

  // キャラクター配置
  const characters = [
    { src: LOADING_CHARACTERS[0], x: 20, size: 80, delay: 0, floatHeight: 20 },
    { src: LOADING_CHARACTERS[1], x: 50, size: 100, delay: 0.3, floatHeight: 25 },
    { src: LOADING_CHARACTERS[2], x: 80, size: 80, delay: 0.6, floatHeight: 18 },
  ]

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FFF0F5 0%, #F5E6FF 30%, #E8F4FF 60%, #FFF5F8 100%)',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* CSSアニメーション定義 */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(calc(-1 * var(--float-height, 20px)));
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(236, 72, 153, 0.6));
          }
        }

        @keyframes bounce-text {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes rainbow-border {
          0% {
            border-color: #FF9AAB;
          }
          25% {
            border-color: #B794F4;
          }
          50% {
            border-color: #90CDF4;
          }
          75% {
            border-color: #9AE6B4;
          }
          100% {
            border-color: #FF9AAB;
          }
        }
      `}</style>

      {/* 背景の装飾パターン */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.15) 0%, transparent 60%)`,
        }}
      />

      {/* キラキラ星たち */}
      {sparkles.map((sparkle, i) => (
        <Sparkle key={i} {...sparkle} />
      ))}

      {/* メインコンテンツエリア */}
      <div className="relative flex flex-col items-center justify-center" style={{ height: '60%' }}>
        {/* 浮遊キャラクターたち */}
        <div className="relative w-full" style={{ height: 200 }}>
          {characters.map((char, i) => (
            <FloatingCharacter key={i} {...char} />
          ))}
        </div>

        {/* ローディングインジケーター */}
        <div
          className="relative mt-8 flex flex-col items-center"
          style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
        >
          {/* かわいいプログレスバー */}
          <div
            className="relative overflow-hidden"
            style={{
              width: 200,
              height: 12,
              borderRadius: 20,
              background: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 2px 10px rgba(139, 92, 246, 0.2), inset 0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '2px solid #E9D5FF',
              animation: 'rainbow-border 3s linear infinite',
            }}
          >
            {/* アニメーションバー */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '30%',
                borderRadius: 20,
                background: 'linear-gradient(90deg, #F9A8D4, #C084FC, #818CF8, #F9A8D4)',
                backgroundSize: '200% 100%',
                animation: 'loading-bar 1.5s ease-in-out infinite',
              }}
            />
            <style>{`
              @keyframes loading-bar {
                0% {
                  left: -30%;
                  background-position: 0% 50%;
                }
                100% {
                  left: 100%;
                  background-position: 100% 50%;
                }
              }
            `}</style>
          </div>

          {/* テキスト */}
          <div
            className="mt-6 flex items-center gap-1"
            style={{
              color: '#7C3AED',
              fontSize: 18,
              fontWeight: 700,
              textShadow: '0 1px 2px rgba(139, 92, 246, 0.2)',
            }}
          >
            <span style={{ animation: 'bounce-text 1s ease-in-out infinite' }}>
              {text}
            </span>
            <AnimatedDots />
          </div>
        </div>
      </div>

      {/* 下部の装飾 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(249, 168, 212, 0.3), transparent)',
        }}
      />

      {/* ハートの装飾 */}
      <div className="absolute bottom-8 flex gap-2">
        {['#F9A8D4', '#C084FC', '#818CF8', '#C084FC', '#F9A8D4'].map((color, i) => (
          <span
            key={i}
            style={{
              color,
              fontSize: 16,
              opacity: 0.7,
              animation: `bounce-text ${0.8 + i * 0.1}s ease-in-out ${i * 0.1}s infinite`,
            }}
          >
            ♥
          </span>
        ))}
      </div>
    </div>
  )
}
