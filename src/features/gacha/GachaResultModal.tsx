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
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
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
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div className={`w-full h-full rounded-full animate-burst opacity-50`} style={{ backgroundColor: color }} />
    <div className={`absolute w-3/4 h-3/4 rounded-full animate-burst opacity-30`} style={{ backgroundColor: color, animationDelay: '0.1s' }} />
    <div className={`absolute w-1/2 h-1/2 rounded-full animate-burst opacity-20`} style={{ backgroundColor: color, animationDelay: '0.2s' }} />
  </div>
)

// 光線エフェクトコンポーネント
const LightRays: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
    {Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        className="absolute w-1 h-64 bg-gradient-to-t from-transparent via-yellow-200 to-transparent opacity-60"
        style={{ transform: `rotate(${i * 30}deg)`, transformOrigin: 'center' }}
      />
    ))}
  </div>
)

// シングル結果表示 - モダンなカード風デザイン
const SingleResult: React.FC<{ sticker: GachaResultSticker; revealed: boolean; showEffects: boolean }> = ({ sticker, revealed, showEffects }) => {
  const burstColor = sticker.rarity === 5 ? '#FFD700' : sticker.rarity === 4 ? '#9B6FD0' : '#60A5FA'

  return (
    <div className={`
      relative w-full max-w-sm mx-auto flex flex-col items-center
      ${revealed ? 'animate-zoom-reveal' : 'scale-0 opacity-0'}
    `}>
      {/* バースト効果（レア以上） */}
      {showEffects && sticker.rarity >= 3 && (
        <BurstEffect color={burstColor} />
      )}

      {/* 光線効果（ウルトラレア） */}
      {showEffects && sticker.rarity === 5 && (
        <LightRays />
      )}

      {/* メインカード - グラスモーフィズム風 */}
      <div className="relative w-full">
        {/* 背景グロー */}
        <div className={`
          absolute inset-0 rounded-[32px] blur-2xl opacity-60
          bg-gradient-to-br ${rarityColors[sticker.rarity]}
          ${sticker.rarity === 5 ? 'animate-pulse' : ''}
        `} />

        {/* カード本体 */}
        <div className={`
          relative rounded-[32px] overflow-hidden
          bg-gradient-to-br ${rarityColors[sticker.rarity]}
          ${rarityEffects[sticker.rarity]}
          border-4 border-white/60
          shadow-[0_20px_60px_rgba(0,0,0,0.3)]
        `}>
          {/* 上部デコレーション */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/30 to-transparent" />

          {/* シール画像エリア */}
          <div className="relative w-full aspect-square flex items-center justify-center p-6">
            {sticker.imageUrl ? (
              <img
                src={sticker.imageUrl}
                alt={sticker.name}
                className={`w-full h-full object-contain ${sticker.rarity >= 4 ? 'drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]' : 'drop-shadow-lg'}`}
              />
            ) : (
              <div className={`text-8xl ${sticker.rarity >= 4 ? 'animate-bounce' : ''}`}>
                {sticker.type === 'sparkle' ? '✨' : sticker.type === 'puffy' ? '🌟' : '⭐'}
              </div>
            )}

            {/* キラキラエフェクト */}
            {sticker.rarity >= 4 && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-8 text-2xl animate-sparkle">✨</div>
                <div className="absolute top-12 right-6 text-xl animate-sparkle" style={{ animationDelay: '0.2s' }}>⭐</div>
                <div className="absolute bottom-8 left-4 text-lg animate-sparkle" style={{ animationDelay: '0.4s' }}>✨</div>
                <div className="absolute bottom-4 right-8 text-2xl animate-sparkle" style={{ animationDelay: '0.6s' }}>⭐</div>
                <div className="absolute top-1/2 left-2 text-xl animate-sparkle" style={{ animationDelay: '0.3s' }}>💫</div>
                <div className="absolute top-1/2 right-2 text-xl animate-sparkle" style={{ animationDelay: '0.5s' }}>💫</div>
              </div>
            )}

            {/* 光線エフェクト（高レア） */}
            {sticker.rarity === 5 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-200/20 to-transparent animate-shine" style={{ animationDelay: '0.5s' }} />
              </div>
            )}
          </div>

          {/* NEWバッジ */}
          {sticker.isNew && (
            <div className="absolute top-4 left-4 px-4 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-full animate-bounce shadow-lg flex items-center gap-1">
              <span>✨</span>
              <span>NEW!</span>
            </div>
          )}

          {/* 下部情報エリア - グラスモーフィズム */}
          <div className="relative px-6 py-5 bg-black/20 backdrop-blur-md">
            {/* シール名 - 横書き固定 */}
            <h3 className="text-2xl font-bold text-white text-center whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}>
              {sticker.name}
            </h3>

            {/* レアリティ星 */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`text-2xl transition-all duration-300 ${i < sticker.rarity ? 'text-yellow-300 drop-shadow-[0_0_12px_rgba(255,215,0,0.9)]' : 'text-white/20'}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  ★
                </span>
              ))}
            </div>

            {/* タイプバッジ */}
            <div className="flex justify-center mt-4">
              <span className={`
                inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold shadow-lg
                ${sticker.type === 'sparkle'
                  ? 'bg-gradient-to-r from-amber-300 to-orange-300 text-amber-900'
                  : sticker.type === 'puffy'
                  ? 'bg-gradient-to-r from-sky-300 to-violet-300 text-violet-900'
                  : 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-700'}
              `}>
                {sticker.type === 'sparkle' ? '✨ キラキラ' :
                 sticker.type === 'puffy' ? '🫧 ぷっくり' :
                 '📄 ふつう'}
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
    <div className="grid grid-cols-5 gap-2 w-full max-w-md mx-auto">
      {stickers.map((sticker, index) => (
        <div
          key={sticker.id}
          className={`
            relative aspect-square rounded-xl overflow-hidden
            transition-all duration-300
            ${index < revealedCount ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
            bg-gradient-to-br ${rarityColors[sticker.rarity]}
            ${rarityEffects[sticker.rarity]}
          `}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          {/* シール画像 */}
          <div className="w-full h-full flex items-center justify-center p-2">
            {sticker.imageUrl ? (
              <img src={sticker.imageUrl} alt={sticker.name} className="w-full h-full object-contain" />
            ) : (
              <div className="text-2xl">
                {sticker.type === 'sparkle' ? '✨' : sticker.type === 'puffy' ? '🌟' : '⭐'}
              </div>
            )}
          </div>

          {/* NEWバッジ */}
          {sticker.isNew && (
            <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              N
            </div>
          )}

          {/* レア度表示 */}
          <div className="absolute bottom-0.5 left-0 right-0 text-center">
            <span className="text-[8px] text-yellow-300 drop-shadow">
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* 背景 */}
      <div className={`
        absolute inset-0 transition-colors duration-1000
        ${phase === 'loading' ? 'bg-black' :
          hasUltraRare ? 'bg-gradient-to-b from-yellow-900/90 via-orange-900/90 to-pink-900/90' :
          hasRare ? 'bg-gradient-to-b from-purple-900/90 via-purple-800/90 to-pink-900/90' :
          'bg-gradient-to-b from-blue-900/90 via-purple-900/90 to-pink-900/90'}
      `} />

      {/* 紙吹雪エフェクト（結果表示時） */}
      {(phase === 'reveal' || phase === 'complete') && (
        <Confetti count={hasUltraRare ? 50 : hasRare ? 30 : 20} colors={confettiColors} />
      )}

      {/* コンテンツ */}
      <div className="relative w-full max-w-lg px-6 py-8 z-10">
        {/* ローディング */}
        {phase === 'loading' && (
          <div className="flex flex-col items-center justify-center">
            {/* カプセル落下アニメーション */}
            <div className="relative w-24 h-24 mb-8">
              <div className={`
                w-24 h-24 rounded-full
                ${hasUltraRare ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400' :
                  hasRare ? 'bg-gradient-to-br from-purple-400 to-pink-400' :
                  'bg-gradient-to-br from-blue-400 to-purple-400'}
                animate-bounce shadow-2xl
              `}>
                {/* カプセルの光沢 */}
                <div className="absolute top-2 left-2 w-4 h-4 bg-white/50 rounded-full" />
              </div>
              <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
              {/* キラキラ */}
              <div className="absolute -top-2 -right-2 text-xl animate-sparkle">✨</div>
              <div className="absolute -bottom-2 -left-2 text-xl animate-sparkle" style={{ animationDelay: '0.3s' }}>✨</div>
            </div>
            <p className="text-white text-xl font-bold animate-pulse">
              {isSingle ? '🎰 ガチャ中...' : '🎰 10連ガチャ中...'}
            </p>
            <p className="text-white/60 text-sm mt-2">ドキドキ...</p>
          </div>
        )}

        {/* 結果表示 */}
        {(phase === 'reveal' || phase === 'complete') && (
          <>
            {isSingle ? (
              <SingleResult sticker={results[0]} revealed={revealedCount > 0} showEffects={showEffects} />
            ) : (
              <>
                <h2 className="text-white text-xl font-bold text-center mb-6 drop-shadow-lg">
                  10連ガチャ結果
                </h2>
                <MultiResult stickers={results} revealedCount={revealedCount} />

                {/* サマリー */}
                {phase === 'complete' && (
                  <div className="mt-6 bg-white/20 backdrop-blur rounded-xl p-4">
                    <div className="grid grid-cols-3 gap-2 text-center text-white text-sm">
                      <div>
                        <span className="block text-2xl font-bold text-yellow-300">
                          {results.filter(s => s.rarity >= 4).length}
                        </span>
                        <span className="text-xs">レア以上</span>
                      </div>
                      <div>
                        <span className="block text-2xl font-bold text-red-400">
                          {results.filter(s => s.isNew).length}
                        </span>
                        <span className="text-xs">NEW</span>
                      </div>
                      <div>
                        <span className="block text-2xl font-bold text-green-400">
                          {results.filter(s => !s.isNew).length}
                        </span>
                        <span className="text-xs">ダブり</span>
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
          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-white/20 text-white font-bold backdrop-blur hover:bg-white/30 transition-colors"
            >
              とじる
            </button>
            <button
              onClick={onContinue}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
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
            className="absolute bottom-4 right-4 px-4 py-2 text-white/60 text-sm hover:text-white transition-colors"
          >
            スキップ ▶
          </button>
        )}
      </div>
    </div>
  )
}

export default GachaResultModal
