'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react'
import { Sticker } from './StickerTray'

// 配置されたシール情報
export interface PlacedSticker {
  id: string
  stickerId: string
  sticker: Sticker
  pageId: string
  x: number // 0-1 (ページ内の相対位置)
  y: number // 0-1
  rotation: number // 回転角度（度）
  scale: number // スケール（1.0が標準）
  zIndex: number // 重なり順（大きいほど前面）
  placedAt: string
}

// 配置モードの状態
export type PlacementMode = 'view' | 'placing' | 'editing'

// コンテキストの型定義
interface StickerPlacementContextType {
  // 状態
  mode: PlacementMode
  selectedSticker: Sticker | null
  draggingSticker: PlacedSticker | null
  editingSticker: PlacedSticker | null
  placedStickers: PlacedSticker[]

  // アクション
  startPlacing: (sticker: Sticker) => void
  cancelPlacing: () => void
  placeSticker: (pageId: string, x: number, y: number) => void
  selectPlacedSticker: (sticker: PlacedSticker) => void
  startEditing: (sticker: PlacedSticker) => void
  updateStickerPosition: (id: string, x: number, y: number) => void
  updateStickerRotation: (id: string, rotation: number) => void
  updateStickerScale: (id: string, scale: number) => void
  removeSticker: (id: string) => void
  finishEditing: () => void
}

const StickerPlacementContext = createContext<StickerPlacementContextType | null>(null)

// カスタムフック
export const useStickerPlacement = () => {
  const context = useContext(StickerPlacementContext)
  if (!context) {
    throw new Error('useStickerPlacement must be used within StickerPlacementProvider')
  }
  return context
}

// Provider
interface StickerPlacementProviderProps {
  children: ReactNode
  initialStickers?: PlacedSticker[]
  onStickerPlaced?: (sticker: PlacedSticker) => void
  onStickerRemoved?: (stickerId: string) => void
  onStickerUpdated?: (sticker: PlacedSticker) => void
}

export const StickerPlacementProvider: React.FC<StickerPlacementProviderProps> = ({
  children,
  initialStickers = [],
  onStickerPlaced,
  onStickerRemoved,
  onStickerUpdated
}) => {
  const [mode, setMode] = useState<PlacementMode>('view')
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null)
  const [draggingSticker, setDraggingSticker] = useState<PlacedSticker | null>(null)
  const [editingSticker, setEditingSticker] = useState<PlacedSticker | null>(null)
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>(initialStickers)

  // 貼り付けモードを開始
  const startPlacing = useCallback((sticker: Sticker) => {
    setSelectedSticker(sticker)
    setMode('placing')
  }, [])

  // 貼り付けをキャンセル
  const cancelPlacing = useCallback(() => {
    setSelectedSticker(null)
    setMode('view')
  }, [])

  // シールを配置
  const placeSticker = useCallback((pageId: string, x: number, y: number) => {
    if (!selectedSticker) return

    const newPlacedSticker: PlacedSticker = {
      id: `placed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      stickerId: selectedSticker.id,
      sticker: selectedSticker,
      pageId,
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
      rotation: 0,
      scale: 1.0,
      zIndex: 1,
      placedAt: new Date().toISOString()
    }

    setPlacedStickers(prev => [...prev, newPlacedSticker])
    onStickerPlaced?.(newPlacedSticker)

    // 配置後は貼り付けモードを終了
    setSelectedSticker(null)
    setMode('view')
  }, [selectedSticker, onStickerPlaced])

  // 配置済みシールを選択
  const selectPlacedSticker = useCallback((sticker: PlacedSticker) => {
    setDraggingSticker(sticker)
  }, [])

  // 編集モードを開始
  const startEditing = useCallback((sticker: PlacedSticker) => {
    setEditingSticker(sticker)
    setMode('editing')
  }, [])

  // シール位置を更新
  const updateStickerPosition = useCallback((id: string, x: number, y: number) => {
    setPlacedStickers(prev => {
      const updated = prev.map(s => {
        if (s.id !== id) return s
        const newSticker = {
          ...s,
          x: Math.max(0, Math.min(1, x)),
          y: Math.max(0, Math.min(1, y))
        }
        onStickerUpdated?.(newSticker)
        return newSticker
      })
      return updated
    })
  }, [onStickerUpdated])

  // シール回転を更新
  const updateStickerRotation = useCallback((id: string, rotation: number) => {
    setPlacedStickers(prev => {
      const updated = prev.map(s => {
        if (s.id !== id) return s
        const newSticker = { ...s, rotation }
        onStickerUpdated?.(newSticker)
        return newSticker
      })
      return updated
    })
  }, [onStickerUpdated])

  // シールスケールを更新
  const updateStickerScale = useCallback((id: string, scale: number) => {
    setPlacedStickers(prev => {
      const updated = prev.map(s => {
        if (s.id !== id) return s
        const newSticker = { ...s, scale: Math.max(0.5, Math.min(2, scale)) }
        onStickerUpdated?.(newSticker)
        return newSticker
      })
      return updated
    })
  }, [onStickerUpdated])

  // シールを削除
  const removeSticker = useCallback((id: string) => {
    setPlacedStickers(prev => prev.filter(s => s.id !== id))
    onStickerRemoved?.(id)
    setEditingSticker(null)
    setMode('view')
  }, [onStickerRemoved])

  // 編集を終了
  const finishEditing = useCallback(() => {
    setEditingSticker(null)
    setDraggingSticker(null)
    setMode('view')
  }, [])

  const value: StickerPlacementContextType = {
    mode,
    selectedSticker,
    draggingSticker,
    editingSticker,
    placedStickers,
    startPlacing,
    cancelPlacing,
    placeSticker,
    selectPlacedSticker,
    startEditing,
    updateStickerPosition,
    updateStickerRotation,
    updateStickerScale,
    removeSticker,
    finishEditing
  }

  return (
    <StickerPlacementContext.Provider value={value}>
      {children}
    </StickerPlacementContext.Provider>
  )
}

// 配置済みシールのアイコンマッピング（フォールバック用）
const stickerIcons: Record<string, string> = {
  'sticker-1': '⭐',
  'sticker-2': '🐰',
  'sticker-3': '🎀',
  'sticker-4': '✨',
  'sticker-5': '🌸',
  'sticker-6': '🐱',
  'sticker-7': '🌈',
  'sticker-8': '🧸',
  'sticker-9': '⭐',
  'sticker-10': '🌙',
}

// シールのレアリティに応じたグロー効果のクラス
// 注意: drop-shadowはシールの透過形状に沿わないため削除
const getRarityGlow = (_rarity: number) => {
  // シールは元の形状のまま表示（四角いエフェクトを避けるため）
  return ''
}

// 配置シールコンポーネント
interface PlacedStickerViewProps {
  sticker: PlacedSticker
  containerWidth: number
  containerHeight: number
  isEditing?: boolean
  onTap?: () => void
  onLongPress?: () => void
  onDragStart?: () => void
  onDrag?: (x: number, y: number) => void
  onDragEnd?: () => void
}

export const PlacedStickerView: React.FC<PlacedStickerViewProps> = ({
  sticker,
  containerWidth,
  containerHeight,
  isEditing,
  onTap,
  onLongPress,
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const stickerRef = useRef<HTMLDivElement>(null)
  const containerRectRef = useRef<DOMRect | null>(null)

  const stickerSize = 60 * sticker.scale // 少し大きめに
  const x = sticker.x * containerWidth - stickerSize / 2
  const y = sticker.y * containerHeight - stickerSize / 2

  const icon = stickerIcons[sticker.stickerId] || '🌟'
  const imageUrl = sticker.sticker.imageUrl
  const rarityGlow = getRarityGlow(sticker.sticker.rarity)

  // シールタイプに応じたスタイル
  // 注意: ring効果はシールの透過形状に沿わず四角くなるため削除
  const getTypeStyle = () => {
    // シールは元の形状のまま表示（四角いエフェクトを避けるため）
    return ''
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    // すべてのイベント伝搬を確実に止める
    e.stopPropagation()
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()

    // 長押し検出開始（編集モードでない時のみ）
    if (!isEditing) {
      const timer = setTimeout(() => {
        onLongPress?.()
      }, 500)
      setLongPressTimer(timer)
    }

    // 編集モードの場合はドラッグ開始
    if (isEditing && stickerRef.current) {
      // ドラッグ開始時にコンテナの位置を保存（親の親がページコンテナ）
      const parent = stickerRef.current.parentElement
      if (parent) {
        containerRectRef.current = parent.getBoundingClientRect()
      }
      setIsDragging(true)
      onDragStart?.()
      stickerRef.current.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    // すべてのイベント伝搬を確実に止める
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    if (!isDragging || !isEditing) return

    // 長押しタイマーをキャンセル（ドラッグ中）
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    // 保存しておいたコンテナ位置を使用
    const rect = containerRectRef.current
    if (!rect) return

    // コンテナの幅と高さを使って相対座標を計算
    const newX = (e.clientX - rect.left) / rect.width
    const newY = (e.clientY - rect.top) / rect.height
    onDrag?.(newX, newY)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    // すべてのイベント伝搬を確実に止める
    e.stopPropagation()
    e.preventDefault()
    e.nativeEvent.stopImmediatePropagation()

    // 長押しタイマーをキャンセル
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    if (isDragging && stickerRef.current) {
      setIsDragging(false)
      stickerRef.current.releasePointerCapture(e.pointerId)
      containerRectRef.current = null
      onDragEnd?.()
    } else if (!isEditing) {
      // 編集モードでない時のみタップとして扱う
      onTap?.()
    }
  }

  return (
    <div
      ref={stickerRef}
      className={`
        absolute cursor-pointer select-none pointer-events-auto
        transition-transform duration-100
        ${isEditing ? 'ring-2 ring-purple-500 ring-opacity-75 rounded-lg' : ''}
        ${getTypeStyle()}
      `}
      style={{
        left: x,
        top: y,
        width: stickerSize,
        height: stickerSize,
        transform: `rotate(${sticker.rotation}deg) ${isDragging ? 'scale(1.1)' : ''}`,
        touchAction: 'none',
        zIndex: isDragging ? 100 : (sticker.zIndex ?? 1), // ドラッグ中は最前面、それ以外はzIndexに従う
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={sticker.sticker.name}
          className={`w-full h-full object-contain ${rarityGlow}`}
          draggable={false}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ fontSize: `${stickerSize * 0.6}px` }}
        >
          {icon}
        </div>
      )}
    </div>
  )
}

// 貼り付けプレビューオーバーレイ
interface PlacementPreviewProps {
  sticker: Sticker
  visible: boolean
}

export const PlacementPreview: React.FC<PlacementPreviewProps> = ({
  sticker,
  visible
}) => {
  if (!visible) return null

  const icon = stickerIcons[sticker.id] || '🌟'
  const imageUrl = sticker.imageUrl

  return (
    <div
      className="fixed pointer-events-none z-50 transition-opacity duration-200"
      style={{
        opacity: 0.7,
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={sticker.name}
          className="w-16 h-16 object-contain animate-bounce drop-shadow-lg"
        />
      ) : (
        <div className="text-5xl animate-bounce">
          {icon}
        </div>
      )}
      <div className="text-center text-xs text-purple-600 bg-white/80 rounded-full px-2 py-0.5 mt-1">
        タップして配置
      </div>
    </div>
  )
}

// 編集コントロールパネル（回転・重なり順）
interface EditControlsProps {
  sticker: PlacedSticker
  onRotate: (rotation: number) => void
  onScale?: (scale: number) => void // 後方互換性のため残すが使用しない
  onRemove: () => void
  onClose: () => void
  onBringToFront?: () => void // 前面へ
  onSendToBack?: () => void   // 後面へ
  // 重なり順の情報
  layerPosition?: number   // 現在の順位（1から始まる）
  totalLayers?: number     // 同じページ上のシール総数
  isAtFront?: boolean      // 最前面かどうか
  isAtBack?: boolean       // 最後面かどうか
}

export const EditControls: React.FC<EditControlsProps> = ({
  sticker,
  onRotate,
  onRemove,
  onClose,
  onBringToFront,
  onSendToBack,
  layerPosition,
  totalLayers,
  isAtFront,
  isAtBack,
}) => {
  // すべてのイベントが外部に伝播しないようにする
  // 注意: タッチイベントはpassiveなのでpreventDefaultは使わない（stopPropagationのみ）
  const stopEvent = (e: React.MouseEvent | React.PointerEvent | React.TouchEvent) => {
    e.stopPropagation()
    // マウス・ポインターイベントのみpreventDefault（タッチはpassiveで警告が出る）
    if (e.type !== 'touchstart' && e.type !== 'touchend' && e.type !== 'touchmove') {
      e.preventDefault()
    }
  }

  // 閉じるボタン用：遅延してクローズすることでイベント伝播を完全に防ぐ
  const handleClose = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    // 少し遅延させてからクローズ（イベントが完全に処理されるのを待つ）
    requestAnimationFrame(() => {
      onClose()
    })
  }

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-50"
      onClick={stopEvent}
      onPointerDown={stopEvent}
      onPointerMove={stopEvent}
      onPointerUp={stopEvent}
      onTouchStart={stopEvent}
      onTouchMove={stopEvent}
      onTouchEnd={stopEvent}
    >
      <div
        className="rounded-3xl p-5 mx-auto max-w-sm"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <h3
            className="font-bold"
            style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              color: '#7C3AED',
            }}
          >
            シールを編集
          </h3>
          <button
            onClick={handleClose}
            onPointerDown={stopEvent}
            onPointerUp={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: 'rgba(167, 139, 250, 0.15)',
              color: '#7C3AED',
            }}
          >
            ✕
          </button>
        </div>

        {/* 位置調整のヒント */}
        <div
          className="text-xs text-center mb-3 py-2 px-3 rounded-xl"
          style={{
            background: 'rgba(139, 92, 246, 0.08)',
            color: '#8B5CF6',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          👆 シールをドラッグして位置を調整できます
        </div>

        {/* 回転 */}
        <div className="mb-4">
          <label
            className="text-sm mb-2 block text-center"
            style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              color: '#8B5CF6',
            }}
          >
            かいてん: {sticker.rotation}°
          </label>
          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={() => onRotate(sticker.rotation - 15)}
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 100%)',
                color: '#7C3AED',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)',
              }}
            >
              ↺
            </button>
            <input
              type="range"
              min="-180"
              max="180"
              value={sticker.rotation}
              onChange={(e) => onRotate(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #C4B5FD 0%, #8B5CF6 50%, #C4B5FD 100%)',
              }}
            />
            <button
              onClick={() => onRotate(sticker.rotation + 15)}
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 100%)',
                color: '#7C3AED',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)',
              }}
            >
              ↻
            </button>
          </div>
        </div>

        {/* 重なり順（前面/後面） */}
        <div className="mb-4">
          <label
            className="text-sm mb-2 block text-center"
            style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              color: '#8B5CF6',
            }}
          >
            かさなり順
            {/* 現在の順位を表示 */}
            {layerPosition !== undefined && totalLayers !== undefined && totalLayers > 1 && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs"
                style={{
                  background: isAtFront ? 'rgba(34, 197, 94, 0.15)' : isAtBack ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                  color: isAtFront ? '#16A34A' : isAtBack ? '#DC2626' : '#7C3AED',
                }}
              >
                {isAtFront ? '✨ 最前面' : isAtBack ? '最後面' : `${layerPosition}番目 / ${totalLayers}枚`}
              </span>
            )}
            {totalLayers !== undefined && totalLayers <= 1 && (
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs"
                style={{
                  background: 'rgba(156, 163, 175, 0.15)',
                  color: '#6B7280',
                }}
              >
                シール1枚のみ
              </span>
            )}
          </label>
          <div className="flex items-center gap-3 justify-center">
            <button
              onClick={onSendToBack}
              disabled={isAtBack || (totalLayers !== undefined && totalLayers <= 1)}
              className="flex-1 py-2.5 rounded-full flex items-center justify-center text-sm font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              style={{
                background: isAtBack ? 'rgba(200, 200, 200, 0.5)' : 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 100%)',
                color: isAtBack ? '#9CA3AF' : '#7C3AED',
                boxShadow: isAtBack ? 'none' : '0 2px 8px rgba(139, 92, 246, 0.2)',
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
              }}
            >
              ⬇️ 後ろへ
            </button>
            <button
              onClick={onBringToFront}
              disabled={isAtFront || (totalLayers !== undefined && totalLayers <= 1)}
              className="flex-1 py-2.5 rounded-full flex items-center justify-center text-sm font-medium transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              style={{
                background: isAtFront ? 'rgba(200, 200, 200, 0.5)' : 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 100%)',
                color: isAtFront ? '#9CA3AF' : '#7C3AED',
                boxShadow: isAtFront ? 'none' : '0 2px 8px rgba(139, 92, 246, 0.2)',
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
              }}
            >
              ⬆️ 前へ
            </button>
          </div>
        </div>

        {/* 削除ボタン */}
        <button
          onClick={onRemove}
          className="w-full py-3 rounded-full font-medium transition-all active:scale-98"
          style={{
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
          }}
        >
          🗑️ シールをはがす
        </button>
      </div>
    </div>
  )
}

export default StickerPlacementProvider
