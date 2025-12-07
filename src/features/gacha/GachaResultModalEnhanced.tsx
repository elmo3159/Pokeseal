'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Container, ISourceOptions } from '@tsparticles/engine'

// 獲得シール情報
export interface GachaResultSticker {
  id: string
  name: string
  imageUrl?: string
  rarity: 1 | 2 | 3 | 4 | 5
  type: 'normal' | 'puffy' | 'sparkle'
  isNew: boolean
}

interface GachaResultModalProps {
  isOpen: boolean
  results: GachaResultSticker[]
  onClose: () => void
  onContinue: () => void
}

// レアリティ別の背景色
const rarityColors = {
  1: { from: '#9CA3AF', via: '#8B929C', to: '#6B7280', glow: 'rgba(156, 163, 175, 0.5)' },
  2: { from: '#4ADE80', via: '#36D36E', to: '#22C55E', glow: 'rgba(74, 222, 128, 0.5)' },
  3: { from: '#60A5FA', via: '#4D94F8', to: '#3B82F6', glow: 'rgba(96, 165, 250, 0.5)' },
  4: { from: '#C084FC', via: '#B26CF9', to: '#A855F7', glow: 'rgba(192, 132, 252, 0.6)' },
  5: { from: '#FBBF24', via: '#F97316', to: '#EC4899', glow: 'rgba(251, 191, 36, 0.7)' },
}

// 結果表示のタイミング（秒）
const RESULT_SHOW_TIME = 6.03

// パーティクル設定
const getParticlesConfig = (rarity: number, hasUltraRare: boolean): ISourceOptions => ({
  fullScreen: { enable: false },
  fpsLimit: 60,
  particles: {
    number: {
      value: hasUltraRare ? 100 : rarity >= 4 ? 60 : 40,
    },
    color: {
      value: hasUltraRare
        ? ['#FFD700', '#FFA500', '#FF69B4', '#FFFFFF', '#FFE4B5', '#FF1493']
        : rarity >= 4
          ? ['#9B6FD0', '#FFB6C1', '#87CEEB', '#FFFFFF', '#DDA0DD', '#E6E6FA']
          : ['#FFB6C1', '#87CEEB', '#98FB98', '#FFFFFF', '#DDA0DD'],
    },
    shape: {
      type: ['circle', 'star', 'polygon'],
      options: {
        polygon: { sides: 6 },
      },
    },
    opacity: {
      value: { min: 0.5, max: 1 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    size: {
      value: { min: 3, max: hasUltraRare ? 12 : 8 },
    },
    move: {
      enable: true,
      speed: hasUltraRare ? 8 : 5,
      direction: 'none' as const,
      random: true,
      straight: false,
      outModes: {
        default: 'out' as const,
      },
    },
    rotate: {
      value: { min: 0, max: 360 },
      animation: {
        enable: true,
        speed: 10,
      },
    },
  },
  emitters: {
    position: { x: 50, y: 0 },
    rate: {
      delay: 0.1,
      quantity: hasUltraRare ? 8 : 4,
    },
    size: {
      width: 100,
      height: 0,
    },
  },
})

// キラキラエフェクト
const Sparkles: React.FC<{ count?: number }> = ({ count = 20 }) => {
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1 + Math.random() * 1,
        size: 10 + Math.random() * 20,
      })),
    [count]
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            fontSize: `${sparkle.size}px`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  )
}

// 光線バーストエフェクト
const LightBurst: React.FC<{ color: string; delay?: number }> = ({ color, delay = 0 }) => (
  <motion.div
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: [0, 2, 3], opacity: [0, 0.8, 0] }}
    transition={{ duration: 1.2, delay, ease: 'easeOut' }}
  >
    <div
      className="w-full h-full rounded-full"
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
  </motion.div>
)

// 巨大シール表示カード（1枚表示用）- 超派手版
const BigStickerCard: React.FC<{
  sticker: GachaResultSticker
  index: number
  total: number
}> = ({ sticker, index }) => {
  const colors = rarityColors[sticker.rarity]

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ scale: 0, opacity: 0, y: 100, rotateY: 180 }}
      animate={{ scale: 1, opacity: 1, y: 0, rotateY: 0 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        type: 'spring',
        stiffness: 150,
        damping: 15,
      }}
    >
      {/* 巨大な背景グロー - より大きく明るく */}
      <motion.div
        className="absolute -inset-20 rounded-full blur-3xl"
        style={{
          background:
            sticker.rarity === 5
              ? `linear-gradient(135deg, ${colors.from}, ${colors.via}, ${colors.to})`
              : `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
        }}
        animate={{
          opacity: [0.5, 0.9, 0.5],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* 追加のキラキラリング */}
      {sticker.rarity >= 4 && (
        <motion.div
          className="absolute -inset-16 rounded-full border-4 border-white/30"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 10, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}
        />
      )}

      {/* 巨大シールカード */}
      <motion.div
        className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-[2rem] overflow-hidden"
        style={{
          background:
            sticker.rarity === 5
              ? `linear-gradient(135deg, ${colors.from}, ${colors.via}, ${colors.to})`
              : `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
          boxShadow: `0 30px 80px ${colors.glow}, 0 0 150px ${colors.glow}`,
        }}
        animate={{
          y: [0, -10, 0],
          rotateY: [0, 5, -5, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* 光沢 */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/50 to-transparent" />

        {/* シール画像 - より大きく */}
        <div className="relative w-full h-full flex items-center justify-center p-6">
          {sticker.imageUrl ? (
            <motion.img
              src={sticker.imageUrl}
              alt={sticker.name}
              className="w-full h-full object-contain"
              initial={{ scale: 0, rotate: -360 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.8, type: 'spring' }}
              style={{
                filter:
                  sticker.rarity >= 4
                    ? 'drop-shadow(0 0 50px rgba(255,255,255,1))'
                    : 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
              }}
            />
          ) : (
            <motion.div
              className="text-9xl"
              initial={{ scale: 0, rotate: -360 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.8, type: 'spring' }}
            >
              {sticker.type === 'sparkle' ? '✨' : sticker.type === 'puffy' ? '🌟' : '⭐'}
            </motion.div>
          )}
        </div>

        {/* 大きなNEWバッジ */}
        {sticker.isNew && (
          <motion.div
            className="absolute top-4 left-4 px-5 py-2 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white text-lg font-extrabold rounded-2xl shadow-2xl"
            initial={{ scale: 0, x: -50, rotate: -20 }}
            animate={{ scale: 1, x: 0, rotate: 0 }}
            transition={{ delay: index * 0.15 + 0.5, type: 'spring', stiffness: 200 }}
            style={{ boxShadow: '0 4px 20px rgba(244, 63, 94, 0.6)' }}
          >
            ✨ NEW ✨
          </motion.div>
        )}

        {/* 虹色シャイン演出（高レア） */}
        {sticker.rarity >= 4 && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                backgroundSize: '200% 200%',
              }}
              animate={{ backgroundPosition: ['200% 200%', '-100% -100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}

        {/* 最高レア用 虹色ボーダーアニメーション */}
        {sticker.rarity === 5 && (
          <motion.div
            className="absolute inset-0 rounded-[2rem] pointer-events-none"
            style={{
              border: '4px solid transparent',
              background: 'linear-gradient(90deg, #FF6B6B, #FFE66D, #4ECDC4, #A855F7, #FF6B6B) border-box',
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </motion.div>

      {/* シール名 - より大きく */}
      <motion.h3
        className="mt-6 text-3xl sm:text-4xl font-extrabold text-white text-center"
        initial={{ opacity: 0, y: 30, scale: 0.5 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: index * 0.15 + 0.4, type: 'spring' }}
        style={{
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
          textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.3)',
        }}
      >
        {sticker.name}
      </motion.h3>

      {/* 大きなレアリティ星 */}
      <motion.div
        className="flex items-center justify-center gap-2 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.15 + 0.5 }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <motion.span
            key={i}
            className={`text-3xl sm:text-4xl ${i < sticker.rarity ? 'text-yellow-300' : 'text-white/20'}`}
            initial={{ scale: 0, rotate: -180, y: 50 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            transition={{ delay: index * 0.15 + 0.6 + i * 0.08, type: 'spring', stiffness: 300 }}
            style={{
              filter: i < sticker.rarity ? 'drop-shadow(0 0 15px rgba(255,215,0,1))' : 'none',
            }}
          >
            ★
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}

// マルチ結果のミニカード - 大きく派手版
const MiniResultCard: React.FC<{
  sticker: GachaResultSticker
  index: number
}> = ({ sticker, index }) => {
  const colors = rarityColors[sticker.rarity]

  return (
    <motion.div
      className="relative aspect-square rounded-2xl overflow-hidden"
      initial={{ scale: 0, opacity: 0, rotateY: 180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        type: 'spring',
        stiffness: 200,
      }}
      style={{
        background:
          sticker.rarity === 5
            ? `linear-gradient(135deg, ${colors.from}, ${colors.via}, ${colors.to})`
            : `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
        boxShadow: `0 8px 30px ${colors.glow}, 0 0 40px ${colors.glow}`,
      }}
    >
      {/* 光沢オーバーレイ */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

      {/* シール画像 - より大きく */}
      <div className="w-full h-full flex items-center justify-center p-3">
        {sticker.imageUrl ? (
          <motion.img
            src={sticker.imageUrl}
            alt={sticker.name}
            className="w-full h-full object-contain"
            animate={sticker.rarity >= 4 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              filter: sticker.rarity >= 4 ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none',
            }}
          />
        ) : (
          <motion.div
            className="text-3xl sm:text-4xl"
            animate={sticker.rarity >= 4 ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {sticker.type === 'sparkle' ? '✨' : sticker.type === 'puffy' ? '🌟' : '⭐'}
          </motion.div>
        )}
      </div>

      {/* 大きなNEWバッジ */}
      {sticker.isNew && (
        <motion.div
          className="absolute top-1 left-1 w-7 h-7 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.08 + 0.3, type: 'spring', stiffness: 300 }}
          style={{ boxShadow: '0 2px 10px rgba(244, 63, 94, 0.6)' }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            N
          </motion.span>
        </motion.div>
      )}

      {/* 大きなレア度表示 */}
      <div className="absolute bottom-1 left-0 right-0 text-center">
        <motion.span
          className="text-sm text-yellow-300 font-bold"
          style={{ textShadow: '0 0 10px rgba(255,215,0,0.8)' }}
          animate={sticker.rarity >= 4 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {'★'.repeat(sticker.rarity)}
        </motion.span>
      </div>

      {/* 高レア演出 - より派手に */}
      {sticker.rarity >= 4 && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
              backgroundSize: '200% 200%',
            }}
            animate={{ backgroundPosition: ['200% 200%', '-100% -100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}

      {/* 5星用 レインボーボーダー */}
      {sticker.rarity === 5 && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: '3px solid transparent',
            background: 'linear-gradient(90deg, #FF6B6B, #FFE66D, #4ECDC4, #A855F7, #FF6B6B) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}

// メインモーダルコンポーネント
export const GachaResultModalEnhanced: React.FC<GachaResultModalProps> = ({
  isOpen,
  results,
  onClose,
  onContinue,
}) => {
  const [phase, setPhase] = useState<'video' | 'result' | 'complete'>('video')
  const [particlesInit, setParticlesInit] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const isSingle = results.length === 1
  const hasRare = results.some((s) => s.rarity >= 4)
  const hasUltraRare = results.some((s) => s.rarity === 5)
  const maxRarity = Math.max(...results.map((s) => s.rarity))

  // パーティクルエンジン初期化
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setParticlesInit(true)
    })
  }, [])

  // モーダル開閉時のリセット
  useEffect(() => {
    if (!isOpen) {
      setPhase('video')
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.pause()
      }
      return
    }

    // モーダルが開いたら動画再生開始
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(console.error)
    }
  }, [isOpen])

  // 動画の時間監視
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && phase === 'video') {
      if (videoRef.current.currentTime >= RESULT_SHOW_TIME) {
        setPhase('result')
        // 結果表示後、少し待ってからcomplete
        setTimeout(() => {
          setPhase('complete')
        }, isSingle ? 1500 : 2000)
      }
    }
  }, [phase, isSingle])

  // 動画終了時
  const handleVideoEnded = useCallback(() => {
    if (phase === 'video') {
      setPhase('result')
      setTimeout(() => {
        setPhase('complete')
      }, isSingle ? 1500 : 2000)
    }
  }, [phase, isSingle])

  // スキップ
  const handleSkip = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setPhase('complete')
  }, [])

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // パーティクル読み込み完了
  }, [])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 動画背景 */}
        <video
          ref={videoRef}
          src="/videos/Gacha.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          style={{
            opacity: phase === 'video' ? 1 : 0.3,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* 暗いオーバーレイ（結果表示時） */}
        <AnimatePresence>
          {(phase === 'result' || phase === 'complete') && (
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* パーティクル（結果表示時） */}
        {particlesInit && (phase === 'result' || phase === 'complete') && (
          <Particles
            id="gacha-particles"
            particlesLoaded={particlesLoaded}
            options={getParticlesConfig(maxRarity, hasUltraRare)}
            className="absolute inset-0"
          />
        )}

        {/* 高レア演出 */}
        {(phase === 'result' || phase === 'complete') && (
          <>
            {hasUltraRare && (
              <>
                <LightBurst color="#FFD700" delay={0} />
                <LightBurst color="#FF69B4" delay={0.2} />
                <Sparkles count={30} />
              </>
            )}
            {hasRare && !hasUltraRare && (
              <>
                <LightBurst color="#A855F7" delay={0} />
                <Sparkles count={15} />
              </>
            )}
          </>
        )}

        {/* コンテンツ */}
        <div className="relative w-full max-w-lg px-4 py-6 z-10">
          <AnimatePresence mode="wait">
            {/* 結果表示 */}
            {(phase === 'result' || phase === 'complete') && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                {/* タイトル */}
                <motion.h2
                  className="text-white text-2xl sm:text-3xl font-bold text-center mb-6 drop-shadow-lg"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
                >
                  {isSingle ? '🎰 ゲット！' : '🎰 10連ガチャ結果'}
                </motion.h2>

                {isSingle ? (
                  /* シングル：大きく1枚表示 */
                  <BigStickerCard sticker={results[0]} index={0} total={1} />
                ) : (
                  /* マルチ：グリッド表示 */
                  <>
                    <div className="grid grid-cols-5 gap-2 w-full max-w-md mx-auto">
                      {results.map((sticker, index) => (
                        <MiniResultCard key={sticker.id} sticker={sticker} index={index} />
                      ))}
                    </div>

                    {/* サマリー - 大きく派手版 */}
                    {phase === 'complete' && (
                      <motion.div
                        className="mt-8 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/30 w-full max-w-md"
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        style={{
                          boxShadow: '0 10px 40px rgba(0,0,0,0.3), 0 0 60px rgba(168,85,247,0.2)',
                        }}
                      >
                        <div className="grid grid-cols-3 gap-4 text-center text-white">
                          <motion.div
                            className="flex flex-col items-center"
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                          >
                            <motion.span
                              className="block text-4xl sm:text-5xl font-extrabold text-yellow-300"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              style={{ textShadow: '0 0 20px rgba(255,215,0,0.8)' }}
                            >
                              {results.filter((s) => s.rarity >= 4).length}
                            </motion.span>
                            <span className="text-sm sm:text-base text-white/80 font-bold mt-1">✨レア以上</span>
                          </motion.div>
                          <motion.div
                            className="flex flex-col items-center"
                            initial={{ scale: 0, rotate: 20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                          >
                            <motion.span
                              className="block text-4xl sm:text-5xl font-extrabold text-rose-400"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                              style={{ textShadow: '0 0 20px rgba(244,63,94,0.8)' }}
                            >
                              {results.filter((s) => s.isNew).length}
                            </motion.span>
                            <span className="text-sm sm:text-base text-white/80 font-bold mt-1">🆕 NEW</span>
                          </motion.div>
                          <motion.div
                            className="flex flex-col items-center"
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                          >
                            <motion.span
                              className="block text-4xl sm:text-5xl font-extrabold text-emerald-400"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                              style={{ textShadow: '0 0 20px rgba(52,211,153,0.8)' }}
                            >
                              {results.filter((s) => !s.isNew).length}
                            </motion.span>
                            <span className="text-sm sm:text-base text-white/80 font-bold mt-1">📦 ダブり</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ボタン - 大きく派手版 */}
          <AnimatePresence>
            {phase === 'complete' && (
              <motion.div
                className="flex gap-5 mt-10"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <motion.button
                  onClick={onClose}
                  className="flex-1 py-5 px-6 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg text-white text-lg sm:text-xl font-bold border-2 border-white/30"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  }}
                >
                  <motion.span
                    className="flex items-center justify-center gap-2"
                  >
                    🚪 とじる
                  </motion.span>
                </motion.button>
                <motion.button
                  onClick={onContinue}
                  className="flex-1 py-5 px-6 rounded-3xl text-white text-lg sm:text-xl font-bold relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #F97316 100%)',
                    boxShadow: '0 8px 40px rgba(168,85,247,0.5), 0 0 60px rgba(236,72,153,0.3)',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  }}
                >
                  {/* キラキラオーバーレイ */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                      backgroundSize: '200% 200%',
                    }}
                    animate={{ backgroundPosition: ['200% 200%', '-100% -100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.span
                    className="relative z-10 flex items-center justify-center gap-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🎰 もう一回！ ✨
                  </motion.span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* スキップボタン（動画再生中のみ） */}
          <AnimatePresence>
            {phase === 'video' && (
              <motion.button
                onClick={handleSkip}
                className="absolute bottom-4 right-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-xl text-white/80 text-sm hover:text-white hover:bg-black/70 transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.05 }}
              >
                スキップ ▶
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default GachaResultModalEnhanced
