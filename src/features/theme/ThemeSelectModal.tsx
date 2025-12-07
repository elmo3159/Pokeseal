'use client'

import React, { useState } from 'react'
import {
  StickerBookTheme,
  ThemeCategory,
  defaultThemes,
  themeCategoryLabels,
  obtainMethodLabels
} from '@/domain/theme'

interface ThemeSelectModalProps {
  isOpen: boolean
  currentThemeId: string
  ownedThemeIds: string[]
  userStarPoints: number
  onClose: () => void
  onSelectTheme: (themeId: string) => void
  onPurchaseTheme: (themeId: string) => void
}

// テーマプレビューカード
const ThemeCard: React.FC<{
  theme: StickerBookTheme
  isOwned: boolean
  isEquipped: boolean
  canPurchase: boolean
  onSelect: () => void
  onPurchase: () => void
}> = ({ theme, isOwned, isEquipped, canPurchase, onSelect, onPurchase }) => {
  // バインダープレビュー用のスタイル
  const binderStyle: React.CSSProperties = {
    background: theme.binder.gradientFrom && theme.binder.gradientTo
      ? `linear-gradient(135deg, ${theme.binder.gradientFrom}, ${theme.binder.gradientTo})`
      : theme.binder.color,
    borderColor: theme.binder.borderColor || 'transparent'
  }

  return (
    <div className={`
      relative bg-white rounded-2xl shadow-md overflow-hidden
      transition-all duration-200 hover:shadow-lg
      ${isEquipped ? 'ring-4 ring-purple-400' : ''}
      ${!isOwned ? 'opacity-80' : ''}
    `}>
      {/* 装着中バッジ */}
      {isEquipped && (
        <div className="absolute top-2 right-2 z-10 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          つかってる！
        </div>
      )}

      {/* 未所持マーク */}
      {!isOwned && (
        <div className="absolute top-2 left-2 z-10 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
          🔒
        </div>
      )}

      {/* バインダープレビュー */}
      <div
        className="h-24 flex items-center justify-center border-b-4"
        style={binderStyle}
      >
        {/* ミニシール帳プレビュー */}
        <div
          className="w-16 h-20 rounded shadow-lg border-2 flex items-center justify-center"
          style={{
            backgroundColor: theme.page.backgroundColor,
            borderColor: theme.binder.color
          }}
        >
          <span className="text-2xl">{theme.previewEmoji}</span>
        </div>
      </div>

      {/* テーマ情報 */}
      <div className="p-3">
        <h3 className="font-bold text-purple-700 text-sm mb-1">
          {theme.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
          {theme.description}
        </p>

        {/* 入手方法 */}
        <div className="mb-2">
          {theme.obtainMethod === 'starpoints' && theme.starPointCost ? (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
              ⭐ {theme.starPointCost}ポイント
            </span>
          ) : theme.obtainMethod === 'achievement' ? (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
              🏆 {theme.unlockCondition}
            </span>
          ) : theme.obtainMethod === 'event' ? (
            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
              🎉 {obtainMethodLabels[theme.obtainMethod]}
            </span>
          ) : theme.obtainMethod === 'gacha' ? (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              🎲 {obtainMethodLabels[theme.obtainMethod]}
            </span>
          ) : (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              ✨ {obtainMethodLabels[theme.obtainMethod]}
            </span>
          )}
        </div>

        {/* アクションボタン */}
        {isOwned ? (
          <button
            onClick={onSelect}
            disabled={isEquipped}
            className={`
              w-full py-2 rounded-xl text-sm font-bold transition-all
              ${isEquipped
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white active:scale-95'
              }
            `}
          >
            {isEquipped ? 'つかってる' : 'つかう'}
          </button>
        ) : theme.obtainMethod === 'starpoints' && theme.starPointCost ? (
          <button
            onClick={onPurchase}
            disabled={!canPurchase}
            className={`
              w-full py-2 rounded-xl text-sm font-bold transition-all
              ${canPurchase
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {canPurchase ? '⭐ こうかんする' : 'ポイントがたりない'}
          </button>
        ) : (
          <div className="w-full py-2 text-center text-xs text-gray-400">
            {obtainMethodLabels[theme.obtainMethod]}
          </div>
        )}
      </div>
    </div>
  )
}

// カテゴリタブ
const CategoryTabs: React.FC<{
  activeCategory: ThemeCategory | 'all'
  onCategoryChange: (category: ThemeCategory | 'all') => void
}> = ({ activeCategory, onCategoryChange }) => {
  const categories: (ThemeCategory | 'all')[] = ['all', 'basic', 'cute', 'cool', 'retro', 'seasonal']

  return (
    <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
            transition-all duration-200
            ${activeCategory === cat
              ? 'bg-purple-500 text-white'
              : 'bg-white text-purple-600 hover:bg-purple-50'
            }
          `}
        >
          <span>{cat === 'all' ? '🎨' : themeCategoryLabels[cat].emoji}</span>
          <span>{cat === 'all' ? 'すべて' : themeCategoryLabels[cat].label}</span>
        </button>
      ))}
    </div>
  )
}

// メインのモーダル
export const ThemeSelectModal: React.FC<ThemeSelectModalProps> = ({
  isOpen,
  currentThemeId,
  ownedThemeIds,
  userStarPoints,
  onClose,
  onSelectTheme,
  onPurchaseTheme
}) => {
  const [activeCategory, setActiveCategory] = useState<ThemeCategory | 'all'>('all')
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState<string | null>(null)

  if (!isOpen) return null

  // カテゴリでフィルタリング
  const filteredThemes = activeCategory === 'all'
    ? defaultThemes
    : defaultThemes.filter(t => t.category === activeCategory)

  // 所持テーマを先に表示
  const sortedThemes = [...filteredThemes].sort((a, b) => {
    const aOwned = ownedThemeIds.includes(a.id)
    const bOwned = ownedThemeIds.includes(b.id)
    if (aOwned && !bOwned) return -1
    if (!aOwned && bOwned) return 1
    return 0
  })

  // 購入確認
  const themeToConfirm = showPurchaseConfirm
    ? defaultThemes.find(t => t.id === showPurchaseConfirm)
    : null

  const handlePurchaseConfirm = () => {
    if (showPurchaseConfirm) {
      onPurchaseTheme(showPurchaseConfirm)
      setShowPurchaseConfirm(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* モーダル本体 */}
      <div className="relative bg-gradient-to-b from-purple-50 to-pink-50 w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-lg">🎨 シール帳きせかえ</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* スターポイント表示 */}
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 w-fit">
            <span className="text-yellow-300">⭐</span>
            <span className="text-white font-bold text-sm">{userStarPoints.toLocaleString()}</span>
            <span className="text-white/80 text-xs">ポイント</span>
          </div>
        </div>

        {/* カテゴリタブ */}
        <div className="px-4 py-3 bg-white/50 border-b border-purple-100">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* テーマ一覧 */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 180px)' }}>
          <div className="grid grid-cols-2 gap-3">
            {sortedThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isOwned={ownedThemeIds.includes(theme.id)}
                isEquipped={theme.id === currentThemeId}
                canPurchase={
                  theme.obtainMethod === 'starpoints' &&
                  theme.starPointCost !== undefined &&
                  userStarPoints >= theme.starPointCost
                }
                onSelect={() => onSelectTheme(theme.id)}
                onPurchase={() => setShowPurchaseConfirm(theme.id)}
              />
            ))}
          </div>

          {sortedThemes.length === 0 && (
            <div className="text-center py-8">
              <span className="text-4xl mb-2 block">🔍</span>
              <p className="text-purple-400 text-sm">このカテゴリにはテーマがありません</p>
            </div>
          )}
        </div>
      </div>

      {/* 購入確認モーダル */}
      {themeToConfirm && (
        <div className="absolute inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowPurchaseConfirm(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 max-w-xs w-full animate-[scaleIn_0.2s_ease-out]">
            <div className="text-center">
              <span className="text-5xl mb-3 block">{themeToConfirm.previewEmoji}</span>
              <h3 className="text-lg font-bold text-purple-700 mb-2">
                {themeToConfirm.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                このテーマをこうかんしますか？
              </p>
              <div className="bg-yellow-50 rounded-xl p-3 mb-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="text-xl font-bold text-yellow-700">
                    {themeToConfirm.starPointCost?.toLocaleString()}
                  </span>
                  <span className="text-sm text-yellow-600">ポイント</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPurchaseConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold"
                >
                  やめる
                </button>
                <button
                  onClick={handlePurchaseConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold"
                >
                  こうかん！
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThemeSelectModal
