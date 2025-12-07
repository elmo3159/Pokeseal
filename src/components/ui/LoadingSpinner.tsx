'use client'

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

// 全画面ローディング
export function FullScreenLoading({ text = 'よみこみちゅう...' }: { text?: string }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: 'rgba(255, 245, 248, 0.95)',
      }}
    >
      <LoadingSpinner size="lg" text={text} />
    </div>
  )
}
