'use client'

import React, { useState, ReactNode } from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  Placement
} from '@floating-ui/react'

/**
 * Floating UI を使用したツールチップコンポーネント
 *
 * CSS Anchor Positioning API の代替として Floating UI を使用
 * - DOM構造に関係なく、任意の要素（アンカー）に吸着
 * - 自動的に画面端での位置調整
 * - 全ブラウザ対応
 *
 * 使用例:
 * <FloatingTooltip content="これはツールチップです">
 *   <button>ホバーしてね</button>
 * </FloatingTooltip>
 */

interface FloatingTooltipProps {
  children: ReactNode
  content: ReactNode
  placement?: Placement
  delay?: number
  offsetDistance?: number
  disabled?: boolean
  block?: boolean
}

export const FloatingTooltip: React.FC<FloatingTooltipProps> = ({
  children,
  content,
  placement = 'top',
  delay = 200,
  offsetDistance = 8,
  disabled = false,
  block = false
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    // whileElementsMounted で自動更新（アンカーが動いても追従）
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetDistance),
      flip({
        fallbackAxisSideDirection: 'start'
      }),
      shift({ padding: 8 })
    ]
  })

  const hover = useHover(context, {
    delay: { open: delay, close: 0 },
    enabled: !disabled
  })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role
  ])

  return (
    <>
      {/* アンカー要素（子要素） */}
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        style={{
          display: block ? 'block' : 'inline-block',
          width: block ? '100%' : 'auto',
        }}
      >
        {children}
      </span>

      {/* フローティング要素（ツールチップ） */}
      {isOpen && !disabled && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 1000,
              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
              maxWidth: '200px',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              pointerEvents: 'none'
            }}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  )
}

/**
 * フローティングバッジ - HPバーやステータス表示用
 * アンカー要素に追従するバッジ
 */
interface FloatingBadgeProps {
  children: ReactNode
  badge: ReactNode
  placement?: Placement
  offsetDistance?: number
  showBadge?: boolean
}

export const FloatingBadge: React.FC<FloatingBadgeProps> = ({
  children,
  badge,
  placement = 'top-end',
  offsetDistance = 0,
  showBadge = true
}) => {
  const { refs, floatingStyles } = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetDistance),
      shift({ padding: 4 })
    ]
  })

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* アンカー要素 */}
      <div ref={refs.setReference}>
        {children}
      </div>

      {/* フローティングバッジ */}
      {showBadge && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          {badge}
        </div>
      )}
    </div>
  )
}

/**
 * フローティングステータスバー - キャラクターに追従するHPバー等
 */
interface FloatingStatusBarProps {
  children: ReactNode
  value: number // 0-100
  maxValue?: number
  placement?: Placement
  color?: 'green' | 'red' | 'blue' | 'purple'
  label?: string
  showBar?: boolean
}

export const FloatingStatusBar: React.FC<FloatingStatusBarProps> = ({
  children,
  value,
  maxValue = 100,
  placement = 'top',
  color = 'green',
  label,
  showBar = true
}) => {
  const { refs, floatingStyles } = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      shift({ padding: 4 })
    ]
  })

  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100))

  const colorMap = {
    green: { bg: '#22C55E', bgLight: '#DCFCE7' },
    red: { bg: '#EF4444', bgLight: '#FEE2E2' },
    blue: { bg: '#3B82F6', bgLight: '#DBEAFE' },
    purple: { bg: '#8B5CF6', bgLight: '#EDE9FE' }
  }

  const colors = colorMap[color]

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* アンカー要素（キャラクターなど） */}
      <div ref={refs.setReference}>
        {children}
      </div>

      {/* フローティングステータスバー */}
      {showBar && (
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <div style={{
            background: 'white',
            borderRadius: '6px',
            padding: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: '60px'
          }}>
            {label && (
              <div style={{
                fontSize: '10px',
                color: '#6B7280',
                textAlign: 'center',
                marginBottom: '2px'
              }}>
                {label}
              </div>
            )}
            <div style={{
              height: '8px',
              background: colors.bgLight,
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${percentage}%`,
                height: '100%',
                background: colors.bg,
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{
              fontSize: '10px',
              color: '#374151',
              textAlign: 'center',
              marginTop: '2px',
              fontWeight: 'bold'
            }}>
              {value}/{maxValue}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FloatingTooltip
