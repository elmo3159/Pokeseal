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

// 結果表示のタイミング（動画終了の何秒前に表示するか）
const RESULT_BEFORE_END = 3.0

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
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          style={{
            position: 'absolute',
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
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: [0, 2, 3], opacity: [0, 0.8, 0] }}
    transition={{ duration: 1.2, delay, ease: 'easeOut' }}
  >
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
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
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
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
        style={{
          position: 'absolute',
          top: '-80px',
          left: '-80px',
          right: '-80px',
          bottom: '-80px',
          borderRadius: '50%',
          filter: 'blur(48px)',
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
          style={{
            position: 'absolute',
            top: '-64px',
            left: '-64px',
            right: '-64px',
            bottom: '-64px',
            borderRadius: '50%',
            border: '4px solid rgba(255, 255, 255, 0.3)',
          }}
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 10, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}
        />
      )}

      {/* 巨大シールカード */}
      <motion.div
        style={{
          position: 'relative',
          width: '224px',
          height: '224px',
          borderRadius: '32px',
          overflow: 'hidden',
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
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '33%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)' }} />

        {/* シール画像 - より大きく */}
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          {sticker.imageUrl ? (
            <motion.img
              src={sticker.imageUrl}
              alt={sticker.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter:
                  sticker.rarity >= 4
                    ? 'drop-shadow(0 0 50px rgba(255,255,255,1))'
                    : 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
              }}
              initial={{ scale: 0, rotate: -360 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.8, type: 'spring' }}
            />
          ) : (
            <motion.div
              style={{ fontSize: '128px' }}
              initial={{ scale: 0, rotate: -360 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.8, type: 'spring' }}
            >
              ⭐
            </motion.div>
          )}
        </div>

        {/* 大きなNEWバッジ */}
        {sticker.isNew && (
          <motion.div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              paddingLeft: '20px',
              paddingRight: '20px',
              paddingTop: '8px',
              paddingBottom: '8px',
              background: 'linear-gradient(to right, #F43F5E, #EC4899, #EF4444)',
              color: 'white',
              fontSize: '18px',
              fontWeight: 800,
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(244, 63, 94, 0.6), 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            initial={{ scale: 0, x: -50, rotate: -20 }}
            animate={{ scale: 1, x: 0, rotate: 0 }}
            transition={{ delay: index * 0.15 + 0.5, type: 'spring', stiffness: 200 }}
          >
            ✨ NEW ✨
          </motion.div>
        )}

        {/* 虹色シャイン演出（高レア） */}
        {sticker.rarity >= 4 && (
          <motion.div
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
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
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '32px',
              pointerEvents: 'none',
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
        style={{
          marginTop: '24px',
          fontSize: '30px',
          fontWeight: 800,
          color: 'white',
          textAlign: 'center',
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
          textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.3)',
        }}
        initial={{ opacity: 0, y: 30, scale: 0.5 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: index * 0.15 + 0.4, type: 'spring' }}
      >
        {sticker.name}
      </motion.h3>

      {/* 大きなレアリティ星 */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.15 + 0.5 }}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <motion.span
            key={i}
            style={{
              fontSize: '30px',
              color: i < sticker.rarity ? '#FDE047' : 'rgba(255, 255, 255, 0.2)',
              filter: i < sticker.rarity ? 'drop-shadow(0 0 15px rgba(255,215,0,1))' : 'none',
            }}
            initial={{ scale: 0, rotate: -180, y: 50 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            transition={{ delay: index * 0.15 + 0.6 + i * 0.08, type: 'spring', stiffness: 300 }}
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
  onTap?: () => void
}> = ({ sticker, index, onTap }) => {
  const colors = rarityColors[sticker.rarity]

  return (
    <motion.div
      style={{
        position: 'relative',
        aspectRatio: '1 / 1',
        minWidth: '60px',
        minHeight: '60px',
        borderRadius: '12px',
        overflow: 'hidden',
        background:
          sticker.rarity === 5
            ? `linear-gradient(135deg, ${colors.from}, ${colors.via}, ${colors.to})`
            : `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
        boxShadow: `0 4px 15px ${colors.glow}, 0 0 20px ${colors.glow}`,
        cursor: 'pointer',
      }}
      initial={{ scale: 0, opacity: 0, rotateY: 180 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      whileTap={{ scale: 0.95 }}
      onClick={onTap}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        type: 'spring',
        stiffness: 200,
      }}
    >
      {/* 光沢オーバーレイ */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '33%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
        pointerEvents: 'none',
      }} />

      {/* シール画像 - より大きく */}
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
        {sticker.imageUrl ? (
          <motion.img
            src={sticker.imageUrl}
            alt={sticker.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: sticker.rarity >= 4 ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none',
            }}
            animate={sticker.rarity >= 4 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        ) : (
          <motion.div
            style={{ fontSize: '24px' }}
            animate={sticker.rarity >= 4 ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ⭐
          </motion.div>
        )}
      </div>

      {/* 大きなNEWバッジ */}
      {sticker.isNew && (
        <motion.div
          style={{
            position: 'absolute',
            top: '4px',
            left: '4px',
            width: '28px',
            height: '28px',
            background: 'linear-gradient(to right, #F43F5E, #EC4899, #EF4444)',
            color: 'white',
            fontSize: '10px',
            fontWeight: 800,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(244, 63, 94, 0.6), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.08 + 0.3, type: 'spring', stiffness: 300 }}
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
      <div style={{ position: 'absolute', bottom: '4px', left: 0, right: 0, textAlign: 'center' }}>
        <motion.span
          style={{
            fontSize: '14px',
            color: '#FDE047',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(255,215,0,0.8)',
          }}
          animate={sticker.rarity >= 4 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {'★'.repeat(sticker.rarity)}
        </motion.span>
      </div>

      {/* 高レア演出 - より派手に */}
      {sticker.rarity >= 4 && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
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
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '16px',
            pointerEvents: 'none',
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

// シール詳細オーバーレイ
const StickerDetailOverlay: React.FC<{
  sticker: GachaResultSticker
  onClose: () => void
}> = ({ sticker, onClose }) => {
  const colors = rarityColors[sticker.rarity]

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px',
          maxWidth: '320px',
          width: '90%',
        }}
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 背景グロー */}
        <motion.div
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            filter: 'blur(60px)',
            background: sticker.rarity === 5
              ? `linear-gradient(135deg, ${colors.from}, ${colors.via}, ${colors.to})`
              : `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
            opacity: 0.6,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* シールカード */}
        <motion.div
          style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            borderRadius: '24px',
            overflow: 'hidden',
            background: sticker.rarity === 5
              ? `linear-gradient(135deg, ${colors.from}, ${colors.via}, ${colors.to})`
              : `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
            boxShadow: `0 20px 60px ${colors.glow}, 0 0 100px ${colors.glow}`,
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* 光沢 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
            pointerEvents: 'none',
          }} />

          {/* シール画像 */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}>
            {sticker.imageUrl ? (
              <img
                src={sticker.imageUrl}
                alt={sticker.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: sticker.rarity >= 4 ? 'drop-shadow(0 0 20px rgba(255,255,255,0.8))' : 'none',
                }}
              />
            ) : (
              <span style={{ fontSize: '80px' }}>⭐</span>
            )}
          </div>

          {/* NEWバッジ */}
          {sticker.isNew && (
            <motion.div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '6px 14px',
                background: 'linear-gradient(to right, #F43F5E, #EC4899)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 800,
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(244, 63, 94, 0.5)',
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ✨ NEW
            </motion.div>
          )}

          {/* キラキラエフェクト（高レア） */}
          {sticker.rarity >= 4 && (
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                backgroundSize: '200% 200%',
              }}
              animate={{ backgroundPosition: ['200% 200%', '-100% -100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </motion.div>

        {/* シール名 */}
        <motion.h2
          style={{
            marginTop: '24px',
            fontSize: '28px',
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {sticker.name}
        </motion.h2>

        {/* レアリティ星 */}
        <motion.div
          style={{
            display: 'flex',
            gap: '6px',
            marginTop: '12px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <motion.span
              key={i}
              style={{
                fontSize: '24px',
                color: i < sticker.rarity ? '#FDE047' : 'rgba(255, 255, 255, 0.2)',
                filter: i < sticker.rarity ? 'drop-shadow(0 0 10px rgba(255,215,0,0.8))' : 'none',
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
            >
              ★
            </motion.span>
          ))}
        </motion.div>

        {/* 閉じるヒント */}
        <motion.p
          style={{
            marginTop: '24px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '14px',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            cursor: 'pointer',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={(event) => {
            event.stopPropagation()
            onClose()
          }}
        >
          タップして閉じる
        </motion.p>
      </motion.div>
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
  const [selectedSticker, setSelectedSticker] = useState<GachaResultSticker | null>(null)
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

  // 動画の時間監視 - 動画終了0.5秒前に結果を表示
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && phase === 'video') {
      const { currentTime, duration } = videoRef.current
      // 動画の長さが取得できたら、終了0.5秒前に結果を表示
      if (duration && currentTime >= duration - RESULT_BEFORE_END) {
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
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 動画背景 */}
        <video
          ref={videoRef}
          src="/videos/Gacha.mp4"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: phase === 'video' ? 1 : 0.3,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* 暗いオーバーレイ（結果表示時） */}
        <AnimatePresence>
          {(phase === 'result' || phase === 'complete') && (
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.6)',
              }}
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
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
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

        {/* スキップボタン（動画再生中のみ）- モーダル直下に配置 */}
        <AnimatePresence>
          {phase === 'video' && (
            <motion.button
              onClick={handleSkip}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              style={{
                position: 'fixed',
                bottom: '100px',
                right: '20px',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '12px',
                paddingBottom: '12px',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                border: '2px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
                zIndex: 100,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              スキップ ▶▶
            </motion.button>
          )}
        </AnimatePresence>

        {/* コンテンツ */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            {/* 結果表示 */}
            {(phase === 'result' || phase === 'complete') && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                {/* タイトル */}
                <motion.h2
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '24px',
                    filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.3))',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  }}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isSingle ? '🎰 ゲット！' : '🎰 10連ガチャ結果'}
                </motion.h2>

                {isSingle ? (
                  /* シングル：大きく1枚表示 */
                  <BigStickerCard sticker={results[0]} index={0} total={1} />
                ) : (
                  /* マルチ：グリッド表示 - 5x2で大きめに */
                  <>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, minmax(56px, 1fr))',
                      gap: '8px',
                      width: '100%',
                      maxWidth: '340px',
                      justifyContent: 'center',
                    }}>
                      {results.map((sticker, index) => (
                        <MiniResultCard
                          key={`result-${index}`}
                          sticker={sticker}
                          index={index}
                          onTap={() => setSelectedSticker(sticker)}
                        />
                      ))}
                    </div>

                    {/* サマリー - 大きく派手版 */}
                    {phase === 'complete' && (
                      <motion.div
                        style={{
                          marginTop: '32px',
                          background: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                          backdropFilter: 'blur(12px)',
                          borderRadius: '24px',
                          padding: '24px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          width: '100%',
                          maxWidth: '448px',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.3), 0 0 60px rgba(168,85,247,0.2)',
                        }}
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center', color: 'white' }}>
                          <motion.div
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                          >
                            <motion.span
                              style={{
                                display: 'block',
                                fontSize: '36px',
                                fontWeight: 800,
                                color: '#FDE047',
                                textShadow: '0 0 20px rgba(255,215,0,0.8)',
                              }}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              {results.filter((s) => s.rarity >= 4).length}
                            </motion.span>
                            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', marginTop: '4px' }}>✨レア以上</span>
                          </motion.div>
                          <motion.div
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            initial={{ scale: 0, rotate: 20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                          >
                            <motion.span
                              style={{
                                display: 'block',
                                fontSize: '36px',
                                fontWeight: 800,
                                color: '#FB7185',
                                textShadow: '0 0 20px rgba(244,63,94,0.8)',
                              }}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                            >
                              {results.filter((s) => s.isNew).length}
                            </motion.span>
                            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', marginTop: '4px' }}>🆕 NEW</span>
                          </motion.div>
                          <motion.div
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                          >
                            <motion.span
                              style={{
                                display: 'block',
                                fontSize: '36px',
                                fontWeight: 800,
                                color: '#34D399',
                                textShadow: '0 0 20px rgba(52,211,153,0.8)',
                              }}
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                            >
                              {results.filter((s) => !s.isNew).length}
                            </motion.span>
                            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', marginTop: '4px' }}>📦 ダブり</span>
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
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                  marginTop: '40px',
                  width: '100%',
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    borderRadius: '24px',
                    background: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                    backdropFilter: 'blur(12px)',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    border: '2px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    cursor: 'pointer',
                  }}
                >
                  <motion.span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    🚪 とじる
                  </motion.span>
                </motion.button>
                <motion.button
                  onClick={onContinue}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    borderRadius: '24px',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #F97316 100%)',
                    boxShadow: '0 8px 40px rgba(168,85,247,0.5), 0 0 60px rgba(236,72,153,0.3)',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {/* キラキラオーバーレイ */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      pointerEvents: 'none',
                      background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                      backgroundSize: '200% 200%',
                    }}
                    animate={{ backgroundPosition: ['200% 200%', '-100% -100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.span
                    style={{
                      position: 'relative',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🎰 もう一回！ ✨
                  </motion.span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
        </div>

        {/* シール詳細オーバーレイ */}
        <AnimatePresence>
          {selectedSticker && (
            <StickerDetailOverlay
              sticker={selectedSticker}
              onClose={() => setSelectedSticker(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export default GachaResultModalEnhanced
