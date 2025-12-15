'use client'

import React, { createContext, useContext, ReactNode } from 'react'

/**
 * Container Query Units を使用したゲームコンテナ
 *
 * CSS Container Query Units (cqw, cqh) について:
 * - cqw: コンテナ幅の1%
 * - cqh: コンテナ高さの1% (container-type: size が必要)
 * - cqi: インラインサイズの1%
 * - cqb: ブロックサイズの1%
 * - cqmin: 幅または高さの小さい方の1%
 * - cqmax: 幅または高さの大きい方の1%
 *
 * 使用例:
 * <GameContainer>
 *   <div style={{ fontSize: '4cqw', padding: '2cqh 3cqw' }}>
 *     コンテナに対して相対的なサイズ
 *   </div>
 * </GameContainer>
 */

// Context for container query support detection
interface ContainerQueryContextValue {
  isSupported: boolean
  containerName: string
}

const ContainerQueryContext = createContext<ContainerQueryContextValue>({
  isSupported: true,
  containerName: 'game-root'
})

export const useContainerQuery = () => useContext(ContainerQueryContext)

interface GameContainerProps {
  children: ReactNode
  containerName?: string
  className?: string
  style?: React.CSSProperties
}

/**
 * ゲーム画面のルートコンテナ
 * container-type: size を設定し、子要素で cqw/cqh が使用可能
 */
export const GameContainer: React.FC<GameContainerProps> = ({
  children,
  containerName = 'game-root',
  className,
  style
}) => {
  // Check if container queries are supported
  const isSupported = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('container-type', 'size')

  return (
    <ContainerQueryContext.Provider value={{ isSupported, containerName }}>
      <div
        className={className}
        style={{
          // Container Query の設定
          containerType: 'size',
          containerName: containerName,
          // 基本レイアウト
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          ...style
        }}
      >
        {children}
      </div>
    </ContainerQueryContext.Provider>
  )
}

/**
 * サブコンテナ - 部分的にコンテナクエリを適用したい場合
 * inline-size のみ（高さは内容に依存）
 */
export const SubContainer: React.FC<GameContainerProps> = ({
  children,
  containerName = 'sub-container',
  className,
  style
}) => {
  return (
    <div
      className={className}
      style={{
        containerType: 'inline-size',
        containerName: containerName,
        width: '100%',
        position: 'relative',
        ...style
      }}
    >
      {children}
    </div>
  )
}

/**
 * Container Query Units のヘルパー関数
 * TypeScript でインラインスタイルを書く際に便利
 */
export const cq = {
  // Width-based units
  w: (value: number) => `${value}cqw`,
  h: (value: number) => `${value}cqh`,
  i: (value: number) => `${value}cqi`,
  b: (value: number) => `${value}cqb`,
  min: (value: number) => `${value}cqmin`,
  max: (value: number) => `${value}cqmax`,

  // Compound helpers
  size: (w: number, h?: number) => ({
    width: `${w}cqw`,
    height: `${h ?? w}cqh`
  }),

  padding: (top: number, right?: number, bottom?: number, left?: number) => {
    if (right === undefined) return `${top}cqw`
    if (bottom === undefined) return `${top}cqh ${right}cqw`
    if (left === undefined) return `${top}cqh ${right}cqw ${bottom}cqh`
    return `${top}cqh ${right}cqw ${bottom}cqh ${left}cqw`
  },

  margin: (top: number, right?: number, bottom?: number, left?: number) => {
    if (right === undefined) return `${top}cqw`
    if (bottom === undefined) return `${top}cqh ${right}cqw`
    if (left === undefined) return `${top}cqh ${right}cqw ${bottom}cqh`
    return `${top}cqh ${right}cqw ${bottom}cqh ${left}cqw`
  },

  fontSize: (value: number) => `${value}cqmin`,

  // Position helpers for absolute positioning within container
  position: (top: number, left: number) => ({
    position: 'absolute' as const,
    top: `${top}cqh`,
    left: `${left}cqw`
  }),

  positionCenter: () => ({
    position: 'absolute' as const,
    top: '50cqh',
    left: '50cqw',
    transform: 'translate(-50%, -50%)'
  }),

  // Border radius
  radius: (value: number) => `${value}cqmin`,

  // Gap
  gap: (value: number) => `${value}cqw`
}

export default GameContainer
