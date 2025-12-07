'use client'

import React from 'react'
import { formatPointsKids } from '@/domain/starPoints'

interface PointsDisplayProps {
  balance: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showLabel?: boolean
  onClick?: () => void
}

export const PointsDisplay: React.FC<PointsDisplayProps> = ({
  balance,
  size = 'md',
  showLabel = true,
  onClick,
}) => {
  const sizeClasses = {
    xs: 'text-xs px-2 py-0.5 gap-1',
    sm: 'text-sm px-2 py-1 gap-1',
    md: 'text-base px-3 py-1.5 gap-1.5',
    lg: 'text-lg px-4 py-2 gap-1.5',
  }

  const iconSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center
        bg-gradient-to-r from-yellow-400 to-orange-400
        text-white font-bold rounded-full
        shadow-sm hover:shadow-md
        transition-all duration-200
        hover:scale-105 active:scale-95
        ${sizeClasses[size]}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      <span className={`${iconSizes[size]}`}>⭐</span>
      <span>{formatPointsKids(balance)}</span>
      {showLabel && size !== 'xs' && <span className="text-xs opacity-80">ポイント</span>}
    </button>
  )
}

// アニメーション付きポイント変動表示
interface PointsChangeAnimationProps {
  amount: number
  onComplete?: () => void
}

export const PointsChangeAnimation: React.FC<PointsChangeAnimationProps> = ({
  amount,
  onComplete,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  const isPositive = amount > 0

  return (
    <div
      className={`
        fixed top-20 left-1/2 -translate-x-1/2
        animate-bounce-in
        px-6 py-3 rounded-2xl
        font-bold text-xl
        shadow-2xl
        ${isPositive
          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
          : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
        }
      `}
    >
      <span className="mr-2">{isPositive ? '✨' : '💫'}</span>
      {isPositive ? '+' : ''}{amount.toLocaleString()} SP
    </div>
  )
}

export default PointsDisplay
