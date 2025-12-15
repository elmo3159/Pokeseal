'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react'
import { Sticker } from './StickerTray'

// 配置されたシール情報
export interface PlacedSticker {
  id: string              // sticker_placements.id（配置の編集・削除に使用）
  userStickerId?: string  // user_stickers.id（交換時に使用）
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

  // 閉じるボタン用
  const handleClose = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onClose()
  }

  return (
    <>
      {/* 背景オーバーレイ - タップで閉じる */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        onTouchEnd={(e) => {
          e.preventDefault()
          onClose()
        }}
        style={{ background: 'transparent' }}
      />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4"
        onClick={stopEvent}
        onPointerDown={stopEvent}
        onPointerMove={stopEvent}
        onPointerUp={stopEvent}
        onTouchStart={stopEvent}
        onTouchMove={stopEvent}
        onTouchEnd={stopEvent}
      >
        <div
          className="rounded-2xl p-4 w-full"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
            maxWidth: '360px',
          }}
        >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {/* シールプレビュー */}
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-purple-50 border border-purple-200">
              {sticker.sticker.imageUrl ? (
                <img
                  src={sticker.sticker.imageUrl}
                  alt={sticker.sticker.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xl">🌟</span>
              )}
            </div>
            <h3
              className="font-bold text-sm"
              style={{
                fontFamily: "'M PLUS Rounded 1c', sans-serif",
                color: '#7C3AED',
              }}
            >
              ✏️ シールへんしゅう
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setTimeout(() => onClose(), 50)
            }}
            onPointerDown={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
            onPointerUp={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
            onTouchStart={(e) => {
              e.stopPropagation()
            }}
            onTouchEnd={(e) => {
              e.stopPropagation()
              setTimeout(() => onClose(), 50)
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-95 text-sm"
            style={{
              background: 'rgba(167, 139, 250, 0.15)',
              color: '#7C3AED',
            }}
          >
            ✕
          </button>
        </div>

        {/* 回転 - コンパクト */}
        <div className="mb-2">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-xs text-purple-500">🔄</span>
            <button
              onClick={() => onRotate(sticker.rotation - 15)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 100%)',
                color: '#7C3AED',
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
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #C4B5FD 0%, #8B5CF6 50%, #C4B5FD 100%)',
              }}
            />
            <button
              onClick={() => onRotate(sticker.rotation + 15)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 100%)',
                color: '#7C3AED',
              }}
            >
              ↻
            </button>
            <span className="text-xs text-purple-500 w-10 text-center">{sticker.rotation}°</span>
          </div>
        </div>

        {/* 重なり順と削除 - 横並び */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSendToBack}
            disabled={isAtBack || (totalLayers !== undefined && totalLayers <= 1)}
            className="flex-1 py-2 rounded-full flex items-center justify-center text-xs font-medium transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: isAtBack ? 'rgba(200, 200, 200, 0.5)' : 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 100%)',
              color: isAtBack ? '#9CA3AF' : '#7C3AED',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            ⬇️ した
          </button>
          <button
            onClick={onBringToFront}
            disabled={isAtFront || (totalLayers !== undefined && totalLayers <= 1)}
            className="flex-1 py-2 rounded-full flex items-center justify-center text-xs font-medium transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: isAtFront ? 'rgba(200, 200, 200, 0.5)' : 'linear-gradient(135deg, #E9D5FF 0%, #DDD6FE 100%)',
              color: isAtFront ? '#9CA3AF' : '#7C3AED',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            ⬆️ うえ
          </button>
          <button
            onClick={onRemove}
            className="py-2 px-3 rounded-full font-medium transition-all active:scale-95 text-xs"
            style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
            }}
          >
            🗑️ はがす
          </button>
        </div>

        {/* 決定ボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            // 少し遅延させてから閉じる（下のレイヤーへのイベント伝播を防ぐ）
            setTimeout(() => onClose(), 50)
          }}
          onPointerDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onPointerUp={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
          }}
          onTouchEnd={(e) => {
            e.stopPropagation()
            // 少し遅延させてから閉じる（下のレイヤーへのイベント伝播を防ぐ）
            setTimeout(() => onClose(), 50)
          }}
          className="w-full mt-3 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
          style={{
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
            background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
          }}
        >
          ✨ ここにはる
        </button>
      </div>
      </div>
    </>
  )
}

export default StickerPlacementProvider
