'use client'

import React, { useState } from 'react'

export interface TutorialStep {
  id: string
  title: string
  description: string
  icon: string
  highlight?: 'book' | 'sticker' | 'gacha' | 'trade' | 'none'
}

interface TutorialOverlayProps {
  steps: TutorialStep[]
  onComplete: () => void
  onSkip: () => void
}

// デフォルトのチュートリアルステップ
export const defaultTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'ようこそ ポケシル へ！',
    description: 'かわいいシールをあつめて、じぶんだけのシールちょうをつくろう！',
    icon: '📖✨',
    highlight: 'none',
  },
  {
    id: 'book',
    title: 'シールちょう',
    description: '左右にスワイプしてページをめくれるよ！すきなシールをはって、デコレーションしよう',
    icon: '📚',
    highlight: 'book',
  },
  {
    id: 'sticker',
    title: 'シールをはる',
    description: '下のトレイからシールをえらんで、ページをタップすると貼れるよ！',
    icon: '⭐',
    highlight: 'sticker',
  },
  {
    id: 'gacha',
    title: 'ガチャでゲット',
    description: 'ガチャを引いて新しいシールをゲットしよう！レアなシールもあるよ✨',
    icon: '🎰',
    highlight: 'gacha',
  },
  {
    id: 'trade',
    title: 'シール交換',
    description: 'ともだちや知らない人とシールを交換できるよ！レアなシールをゲットするチャンス！',
    icon: '🤝',
    highlight: 'trade',
  },
  {
    id: 'ready',
    title: 'じゅんびかんりょう！',
    description: 'それでは、シールあつめをたのしんでね！',
    icon: '🎉',
    highlight: 'none',
  },
]

// ステップインジケーター
const StepIndicator: React.FC<{
  total: number
  current: number
}> = ({ total, current }) => {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`
            w-2.5 h-2.5 rounded-full transition-all duration-300
            ${i === current
              ? 'bg-purple-500 w-6'
              : i < current
                ? 'bg-purple-300'
                : 'bg-purple-100'
            }
          `}
        />
      ))}
    </div>
  )
}

// キャラクターガイド（ナビゲーター）
const GuideCharacter: React.FC<{
  emotion: 'happy' | 'excited' | 'thinking'
}> = ({ emotion }) => {
  const emojis = {
    happy: '😊',
    excited: '🤩',
    thinking: '🤔',
  }

  return (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-4xl shadow-lg">
          {emojis[emotion]}
        </div>
        {/* スピーチバブルの尾 */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
      </div>
    </div>
  )
}

// メインのTutorialOverlay
export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  steps,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  // 次のステップへ
  const handleNext = () => {
    if (isAnimating) return

    if (isLastStep) {
      onComplete()
    } else {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
        setIsAnimating(false)
      }, 200)
    }
  }

  // 前のステップへ
  const handlePrev = () => {
    if (isAnimating || isFirstStep) return

    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1)
      setIsAnimating(false)
    }, 200)
  }

  // キャラクターの表情を決定
  const getEmotion = (): 'happy' | 'excited' | 'thinking' => {
    if (isLastStep) return 'excited'
    if (step.highlight === 'gacha' || step.highlight === 'trade') return 'thinking'
    return 'happy'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* ハイライトエリア（将来的に特定の要素をハイライトする用） */}
      {step.highlight !== 'none' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* ここにハイライト表示を実装可能 */}
        </div>
      )}

      {/* メインカード */}
      <div
        className={`
          relative z-10 w-full max-w-md mx-4 mb-8
          transition-all duration-200
          ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
        `}
      >
        {/* キャラクターガイド */}
        <GuideCharacter emotion={getEmotion()} />

        <div className="bg-white rounded-3xl p-6 pt-12 shadow-2xl">
          {/* ステップインジケーター */}
          <StepIndicator total={steps.length} current={currentStep} />

          {/* アイコン */}
          <div className="text-center mb-4">
            <span className="text-6xl">{step.icon}</span>
          </div>

          {/* テキスト */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-purple-700 mb-2">
              {step.title}
            </h3>
            <p className="text-purple-500 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* ボタン */}
          <div className="flex gap-3">
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                className="
                  flex-1 py-3 rounded-xl
                  bg-gray-100 text-gray-600 font-medium
                  hover:bg-gray-200 active:scale-[0.98]
                  transition-all
                "
              >
                もどる
              </button>
            )}

            <button
              onClick={handleNext}
              className={`
                flex-1 py-3 rounded-xl font-bold
                bg-gradient-to-r from-purple-500 to-pink-500
                text-white shadow-lg
                hover:shadow-xl active:scale-[0.98]
                transition-all
                ${isFirstStep ? 'flex-[2]' : ''}
              `}
            >
              {isLastStep ? 'はじめる！' : 'つぎへ'}
            </button>
          </div>

          {/* スキップボタン */}
          {!isLastStep && (
            <button
              onClick={onSkip}
              className="w-full mt-3 py-2 text-purple-400 text-sm hover:text-purple-600 transition-colors"
            >
              スキップ →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TutorialOverlay
