'use client'

import React, { useState, useEffect, useMemo } from 'react'

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
  1: 'from-gray-400 to-gray-500',
  2: 'from-green-400 to-green-500',
  3: 'from-blue-400 to-blue-500',
  4: 'from-purple-400 to-purple-500',
  5: 'from-yellow-400 via-orange-400 to-pink-400'
}

// レアリティ別のエフェクト
const rarityEffects = {
  1: '',
  2: 'shadow-lg',
  3: 'shadow-xl animate-pulse',
  4: 'shadow-2xl animate-heartbeat',
  5: 'shadow-2xl animate-heartbeat'
}

// 紙吹雪コンポーネント
const Confetti: React.FC<{ count: number; colors: string[] }> = ({ count, colors }) => {
  const confettiPieces = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      size: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? 'circle' : 'square'
    }))
  }, [count, colors])

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="animate-confetti"
          style={{
            position: 'absolute',
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: piece.shape === 'circle' ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  )
}

// バースト効果コンポーネント
const BurstEffect: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
    <div className="animate-burst" style={{ width: '100%', height: '100%', borderRadius: '9999px', opacity: 0.5, backgroundColor: color }} />
    <div className="animate-burst" style={{ position: 'absolute', width: '75%', height: '75%', borderRadius: '9999px', opacity: 0.3, backgroundColor: color, animationDelay: '0.1s' }} />
    <div className="animate-burst" style={{ position: 'absolute', width: '50%', height: '50%', borderRadius: '9999px', opacity: 0.2, backgroundColor: color, animationDelay: '0.2s' }} />
  </div>
)

// 光線エフェクトコンポーネント
const LightRays: React.FC = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', overflow: 'hidden' }}>
    {Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          width: '4px',
          height: '256px',
          background: 'linear-gradient(to top, transparent, rgba(254, 240, 138, 0.6), transparent)',
          opacity: 0.6,
          transform: `rotate(${i * 30}deg)`,
          transformOrigin: 'center',
        }}
      />
    ))}
  </div>
)

// レアリティ別の背景グラデーション（インライン用）
const rarityGradients: Record<number, string> = {
  1: 'linear-gradient(to bottom right, #9CA3AF, #6B7280)',
  2: 'linear-gradient(to bottom right, #4ADE80, #22C55E)',
  3: 'linear-gradient(to bottom right, #60A5FA, #3B82F6)',
  4: 'linear-gradient(to bottom right, #A78BFA, #8B5CF6)',
  5: 'linear-gradient(to bottom right, #FACC15, #F97316, #EC4899)',
}

// シングル結果表示 - モダンなカード風デザイン
const SingleResult: React.FC<{ sticker: GachaResultSticker; revealed: boolean; showEffects: boolean }> = ({ sticker, revealed, showEffects }) => {
  const burstColor = sticker.rarity === 5 ? '#FFD700' : sticker.rarity === 4 ? '#9B6FD0' : '#60A5FA'

  const typeBadgeStyle = sticker.type === 'sparkle'
    ? { background: 'linear-gradient(to right, #FCD34D, #FB923C)', color: '#78350F' }
    : sticker.type === 'puffy'
    ? { background: 'linear-gradient(to right, #7DD3FC, #C4B5FD)', color: '#5B21B6' }
    : { background: 'linear-gradient(to right, #E2E8F0, #CBD5E1)', color: '#334155' }

  return (
    <div
      className={revealed ? 'animate-zoom-reveal' : ''}
      style={{
        position: 'relative',
        width: '288px',
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: revealed ? undefined : 'scale(0)',
        opacity: revealed ? 1 : 0,
      }}
    >
      {/* バースト効果（レア以上） */}
      {showEffects && sticker.rarity >= 3 && (
        <BurstEffect color={burstColor} />
      )}

      {/* 光線効果（ウルトラレア） */}
      {showEffects && sticker.rarity === 5 && (
        <LightRays />
      )}

      {/* メインカード - グラスモーフィズム風 */}
      <div style={{ position: 'relative', width: '100%' }}>
        {/* 背景グロー */}
        <div
          className={sticker.rarity === 5 ? 'animate-pulse' : ''}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '32px',
            filter: 'blur(24px)',
            opacity: 0.6,
            background: rarityGradients[sticker.rarity],
          }}
        />

        {/* カード本体 */}
        <div
          style={{
            position: 'relative',
            borderRadius: '32px',
            overflow: 'hidden',
            background: rarityGradients[sticker.rarity],
            border: '4px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* 上部デコレーション */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '64px', background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent)' }} />

          {/* シール画像エリア */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            {sticker.imageUrl ? (
              <img
                src={sticker.imageUrl}
                alt={sticker.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: sticker.rarity >= 4 ? 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.9))' : 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
                }}
              />
            ) : (
              <div className={sticker.rarity >= 4 ? 'animate-bounce' : ''} style={{ fontSize: '96px', color: '#FFD700', textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}>
                ★
              </div>
            )}

            {/* キラキラエフェクト - CSSベースのスパークル */}
            {sticker.rarity >= 4 && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                <div className="animate-sparkle" style={{ position: 'absolute', top: '16px', left: '32px', width: '12px', height: '12px', background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)', borderRadius: '50%', boxShadow: '0 0 8px #FFD700' }} />
                <div className="animate-sparkle" style={{ position: 'absolute', top: '48px', right: '24px', width: '10px', height: '10px', background: 'radial-gradient(circle, #FFF 0%, transparent 70%)', borderRadius: '50%', boxShadow: '0 0 6px #FFF', animationDelay: '0.2s' }} />
                <div className="animate-sparkle" style={{ position: 'absolute', bottom: '32px', left: '16px', width: '8px', height: '8px', background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)', borderRadius: '50%', boxShadow: '0 0 6px #FFD700', animationDelay: '0.4s' }} />
                <div className="animate-sparkle" style={{ position: 'absolute', bottom: '16px', right: '32px', width: '12px', height: '12px', background: 'radial-gradient(circle, #FFF 0%, transparent 70%)', borderRadius: '50%', boxShadow: '0 0 8px #FFF', animationDelay: '0.6s' }} />
                <div className="animate-sparkle" style={{ position: 'absolute', top: '50%', left: '8px', width: '10px', height: '10px', background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)', borderRadius: '50%', boxShadow: '0 0 6px #FFD700', animationDelay: '0.3s' }} />
                <div className="animate-sparkle" style={{ position: 'absolute', top: '50%', right: '8px', width: '10px', height: '10px', background: 'radial-gradient(circle, #FFF 0%, transparent 70%)', borderRadius: '50%', boxShadow: '0 0 6px #FFF', animationDelay: '0.5s' }} />
              </div>
            )}

            {/* 光線エフェクト（高レア） */}
            {sticker.rarity === 5 && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div className="animate-shine" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent)' }} />
                <div className="animate-shine" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent, rgba(254, 240, 138, 0.2), transparent)', animationDelay: '0.5s' }} />
              </div>
            )}
          </div>

          {/* NEWバッジ */}
          {sticker.isNew && (
            <div
              className="animate-bounce"
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                paddingLeft: '16px',
                paddingRight: '16px',
                paddingTop: '6px',
                paddingBottom: '6px',
                background: 'linear-gradient(to right, #F43F5E, #EC4899)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '9999px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: '10px' }}>★</span>
              <span>NEW!</span>
            </div>
          )}

          {/* 下部情報エリア - グラスモーフィズム */}
          <div style={{ position: 'relative', paddingLeft: '24px', paddingRight: '24px', paddingTop: '20px', paddingBottom: '20px', background: 'rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(12px)' }}>
            {/* シール名 - 横書き固定 */}
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}>
              {sticker.name}
            </h3>

            {/* レアリティ星 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '24px',
                    transition: 'all 0.3s',
                    color: i < sticker.rarity ? '#FDE047' : 'rgba(255, 255, 255, 0.2)',
                    textShadow: i < sticker.rarity ? '0 0 12px rgba(255, 215, 0, 0.9)' : 'none',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            {/* タイプバッジ */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                paddingLeft: '20px',
                paddingRight: '20px',
                paddingTop: '8px',
                paddingBottom: '8px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                ...typeBadgeStyle,
              }}>
                {sticker.type === 'sparkle' ? 'キラキラ' :
                 sticker.type === 'puffy' ? 'ぷっくり' :
                 'ふつう'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// マルチ結果表示
const MultiResult: React.FC<{ stickers: GachaResultSticker[]; revealedCount: number }> = ({ stickers, revealedCount }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '8px',
      width: '100%',
      maxWidth: '448px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      {stickers.map((sticker, index) => (
        <div
          key={sticker.id}
          className={sticker.rarity >= 3 ? 'animate-pulse' : ''}
          style={{
            position: 'relative',
            aspectRatio: '1',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s',
            transitionDelay: `${index * 100}ms`,
            transform: index < revealedCount ? 'scale(1)' : 'scale(0.5)',
            opacity: index < revealedCount ? 1 : 0,
            background: rarityGradients[sticker.rarity],
            boxShadow: sticker.rarity >= 4 ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : sticker.rarity >= 3 ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* シール画像 */}
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
            {sticker.imageUrl ? (
              <img src={sticker.imageUrl} alt={sticker.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <div style={{ fontSize: '24px', color: '#FFD700', textShadow: '0 0 8px rgba(255, 215, 0, 0.8)' }}>
                ★
              </div>
            )}
          </div>

          {/* NEWバッジ */}
          {sticker.isNew && (
            <div style={{
              position: 'absolute',
              top: '2px',
              left: '2px',
              width: '16px',
              height: '16px',
              background: '#EF4444',
              color: 'white',
              fontSize: '8px',
              fontWeight: 'bold',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              N
            </div>
          )}

          {/* レア度表示 */}
          <div style={{ position: 'absolute', bottom: '2px', left: 0, right: 0, textAlign: 'center' }}>
            <span style={{ fontSize: '8px', color: '#FDE047', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
              {'★'.repeat(sticker.rarity)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// 演出フェーズ
type AnimationPhase = 'loading' | 'reveal' | 'complete'

export const GachaResultModal: React.FC<GachaResultModalProps> = ({
  isOpen,
  results,
  onClose,
  onContinue
}) => {
  const [phase, setPhase] = useState<AnimationPhase>('loading')
  const [revealedCount, setRevealedCount] = useState(0)
  const [showEffects, setShowEffects] = useState(false)

  const isSingle = results.length === 1
  const hasRare = results.some(s => s.rarity >= 4)
  const hasUltraRare = results.some(s => s.rarity === 5)

  // 紙吹雪の色（レアリティに応じて変化）
  const confettiColors = useMemo(() => {
    if (hasUltraRare) return ['#FFD700', '#FFA500', '#FF69B4', '#FFFFFF', '#FFE4B5']
    if (hasRare) return ['#9B6FD0', '#FFB6C1', '#87CEEB', '#FFFFFF', '#DDA0DD']
    return ['#FFB6C1', '#87CEEB', '#98FB98', '#FFFFFF', '#DDA0DD']
  }, [hasRare, hasUltraRare])

  useEffect(() => {
    if (!isOpen) {
      setPhase('loading')
      setRevealedCount(0)
      setShowEffects(false)
      return
    }

    // ローディング演出
    const loadingTimer = setTimeout(() => {
      setPhase('reveal')
      setShowEffects(true)
    }, 1500)

    return () => clearTimeout(loadingTimer)
  }, [isOpen])

  useEffect(() => {
    if (phase !== 'reveal') return

    if (isSingle) {
      // シングルは即座に表示
      setRevealedCount(1)
      setTimeout(() => setPhase('complete'), 800)
    } else {
      // マルチは順番に表示
      const interval = setInterval(() => {
        setRevealedCount(prev => {
          if (prev >= results.length) {
            clearInterval(interval)
            setTimeout(() => setPhase('complete'), 300)
            return prev
          }
          return prev + 1
        })
      }, 150)

      return () => clearInterval(interval)
    }
  }, [phase, isSingle, results.length])

  if (!isOpen) return null

  const bgStyle = phase === 'loading' ? 'black' :
    hasUltraRare ? 'linear-gradient(to bottom, rgba(113, 63, 18, 0.9), rgba(124, 45, 18, 0.9), rgba(131, 24, 67, 0.9))' :
    hasRare ? 'linear-gradient(to bottom, rgba(88, 28, 135, 0.9), rgba(107, 33, 168, 0.9), rgba(131, 24, 67, 0.9))' :
    'linear-gradient(to bottom, rgba(30, 58, 138, 0.9), rgba(88, 28, 135, 0.9), rgba(131, 24, 67, 0.9))'

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* 背景 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: bgStyle,
          transition: 'background 1s',
        }}
      />

      {/* 紙吹雪エフェクト（結果表示時） */}
      {(phase === 'reveal' || phase === 'complete') && (
        <Confetti count={hasUltraRare ? 50 : hasRare ? 30 : 20} colors={confettiColors} />
      )}

      {/* コンテンツ */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '512px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '32px',
          paddingBottom: '32px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* ローディング */}
        {phase === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* カプセル落下アニメーション */}
            <div style={{ position: 'relative', width: '96px', height: '96px', marginBottom: '32px' }}>
              <div
                className="animate-bounce"
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '9999px',
                  background: hasUltraRare
                    ? 'linear-gradient(to bottom right, #FACC15, #FB923C, #EC4899)'
                    : hasRare
                    ? 'linear-gradient(to bottom right, #A78BFA, #EC4899)'
                    : 'linear-gradient(to bottom right, #60A5FA, #A78BFA)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
              >
                {/* カプセルの光沢 */}
                <div style={{ position: 'absolute', top: '8px', left: '8px', width: '16px', height: '16px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '9999px' }} />
              </div>
              <div className="animate-ping" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.3)' }} />
              {/* キラキラ - CSSベース */}
              <div className="animate-sparkle" style={{ position: 'absolute', top: '-8px', right: '-8px', width: '12px', height: '12px', background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)', borderRadius: '50%', boxShadow: '0 0 8px #FFD700' }} />
              <div className="animate-sparkle" style={{ position: 'absolute', bottom: '-8px', left: '-8px', width: '12px', height: '12px', background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)', borderRadius: '50%', boxShadow: '0 0 8px #FFD700', animationDelay: '0.3s' }} />
            </div>
            <p className="animate-pulse" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
              {isSingle ? 'ガチャ中...' : '10連ガチャ中...'}
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginTop: '8px' }}>ドキドキ...</p>
          </div>
        )}

        {/* 結果表示 */}
        {(phase === 'reveal' || phase === 'complete') && (
          <>
            {isSingle ? (
              <SingleResult sticker={results[0]} revealed={revealedCount > 0} showEffects={showEffects} />
            ) : (
              <>
                <h2 style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '24px',
                  textShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}>
                  10連ガチャ結果
                </h2>
                <MultiResult stickers={results} revealedCount={revealedCount} />

                {/* サマリー */}
                {phase === 'complete' && (
                  <div style={{
                    marginTop: '24px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      textAlign: 'center',
                      color: 'white',
                      fontSize: '14px',
                    }}>
                      <div>
                        <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#FDE047' }}>
                          {results.filter(s => s.rarity >= 4).length}
                        </span>
                        <span style={{ fontSize: '12px' }}>レア以上</span>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#F87171' }}>
                          {results.filter(s => s.isNew).length}
                        </span>
                        <span style={{ fontSize: '12px' }}>NEW</span>
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '24px', fontWeight: 'bold', color: '#4ADE80' }}>
                          {results.filter(s => !s.isNew).length}
                        </span>
                        <span style={{ fontSize: '12px' }}>ダブり</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ボタン */}
        {phase === 'complete' && (
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '32px',
            width: '100%',
            maxWidth: '320px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                paddingTop: '12px',
                paddingBottom: '12px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 'bold',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.2s',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              とじる
            </button>
            <button
              onClick={onContinue}
              style={{
                flex: 1,
                paddingTop: '12px',
                paddingBottom: '12px',
                paddingLeft: '16px',
                paddingRight: '16px',
                borderRadius: '12px',
                background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              もう一回！
            </button>
          </div>
        )}

        {/* スキップボタン（演出中） */}
        {phase !== 'complete' && (
          <button
            onClick={() => {
              setRevealedCount(results.length)
              setPhase('complete')
            }}
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '8px',
              paddingBottom: '8px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              transition: 'color 0.2s',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            スキップ ▶
          </button>
        )}
      </div>
    </div>
  )
}

export default GachaResultModal
