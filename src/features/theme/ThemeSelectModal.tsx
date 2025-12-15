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
    <div style={{
      position: 'relative',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'all 0.2s',
      outline: isEquipped ? '4px solid #A78BFA' : 'none',
      opacity: !isOwned ? 0.8 : 1,
    }}>
      {/* 装着中バッジ */}
      {isEquipped && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 10,
          background: '#8B5CF6',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
          paddingLeft: '8px',
          paddingRight: '8px',
          paddingTop: '4px',
          paddingBottom: '4px',
          borderRadius: '9999px',
        }}>
          つかってる！
        </div>
      )}

      {/* 未所持マーク */}
      {!isOwned && (
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          zIndex: 10,
          background: '#6B7280',
          color: 'white',
          fontSize: '12px',
          paddingLeft: '8px',
          paddingRight: '8px',
          paddingTop: '4px',
          paddingBottom: '4px',
          borderRadius: '9999px',
        }}>
          🔒
        </div>
      )}

      {/* バインダープレビュー */}
      <div
        style={{
          ...binderStyle,
          height: '96px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '4px solid',
        }}
      >
        {/* ミニシール帳プレビュー */}
        <div
          style={{
            width: '64px',
            height: '80px',
            borderRadius: '4px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            border: '2px solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.page.backgroundColor,
            borderColor: theme.binder.color,
          }}
        >
          <span style={{ fontSize: '24px' }}>{theme.previewEmoji}</span>
        </div>
      </div>

      {/* テーマ情報 */}
      <div style={{ padding: '12px' }}>
        <h3 style={{
          fontWeight: 'bold',
          color: '#7C3AED',
          fontSize: '14px',
          marginBottom: '4px',
        }}>
          {theme.name}
        </h3>
        <p style={{
          fontSize: '12px',
          color: '#6B7280',
          marginBottom: '8px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {theme.description}
        </p>

        {/* 入手方法 */}
        <div style={{ marginBottom: '8px' }}>
          {theme.obtainMethod === 'starpoints' && theme.starPointCost ? (
            <span style={{
              fontSize: '12px',
              background: '#FEF9C3',
              color: '#A16207',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '9999px',
            }}>
              ⭐ {theme.starPointCost}ポイント
            </span>
          ) : theme.obtainMethod === 'achievement' ? (
            <span style={{
              fontSize: '12px',
              background: '#F3E8FF',
              color: '#7C3AED',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '9999px',
            }}>
              🏆 {theme.unlockCondition}
            </span>
          ) : theme.obtainMethod === 'event' ? (
            <span style={{
              fontSize: '12px',
              background: '#FCE7F3',
              color: '#BE185D',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '9999px',
            }}>
              🎉 {obtainMethodLabels[theme.obtainMethod]}
            </span>
          ) : theme.obtainMethod === 'gacha' ? (
            <span style={{
              fontSize: '12px',
              background: '#DBEAFE',
              color: '#1D4ED8',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '9999px',
            }}>
              🎲 {obtainMethodLabels[theme.obtainMethod]}
            </span>
          ) : (
            <span style={{
              fontSize: '12px',
              background: '#F3F4F6',
              color: '#4B5563',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '9999px',
            }}>
              ✨ {obtainMethodLabels[theme.obtainMethod]}
            </span>
          )}
        </div>

        {/* アクションボタン */}
        {isOwned ? (
          <button
            onClick={onSelect}
            disabled={isEquipped}
            style={{
              width: '100%',
              paddingTop: '8px',
              paddingBottom: '8px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              background: isEquipped ? '#F3F4F6' : 'linear-gradient(to right, #8B5CF6, #EC4899)',
              color: isEquipped ? '#9CA3AF' : 'white',
              cursor: isEquipped ? 'not-allowed' : 'pointer',
              border: 'none',
            }}
          >
            {isEquipped ? 'つかってる' : 'つかう'}
          </button>
        ) : theme.obtainMethod === 'starpoints' && theme.starPointCost ? (
          <button
            onClick={onPurchase}
            disabled={!canPurchase}
            style={{
              width: '100%',
              paddingTop: '8px',
              paddingBottom: '8px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              background: canPurchase ? 'linear-gradient(to right, #FBBF24, #FB923C)' : '#E5E7EB',
              color: canPurchase ? 'white' : '#9CA3AF',
              cursor: canPurchase ? 'pointer' : 'not-allowed',
              border: 'none',
            }}
          >
            {canPurchase ? '⭐ こうかんする' : 'ポイントがたりない'}
          </button>
        ) : (
          <div style={{
            width: '100%',
            paddingTop: '8px',
            paddingBottom: '8px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#9CA3AF',
          }}>
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
    <div style={{
      display: 'flex',
      gap: '4px',
      overflowX: 'auto',
      paddingBottom: '8px',
    }}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '6px',
            paddingBottom: '6px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            transition: 'all 0.2s',
            background: activeCategory === cat ? '#8B5CF6' : 'white',
            color: activeCategory === cat ? 'white' : '#7C3AED',
            border: 'none',
            cursor: 'pointer',
          }}
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }}>
      {/* オーバーレイ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(to bottom, #FAF5FF, #FDF2F8)',
        width: '100%',
        maxWidth: '512px',
        maxHeight: '85vh',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        overflow: 'hidden',
      }}>
        {/* ヘッダー */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '16px',
          paddingBottom: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>🎨 シール帳きせかえ</h2>
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* スターポイント表示 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '9999px',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '4px',
            paddingBottom: '4px',
            width: 'fit-content',
          }}>
            <span style={{ color: '#FDE047' }}>⭐</span>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{userStarPoints.toLocaleString()}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>ポイント</span>
          </div>
        </div>

        {/* カテゴリタブ */}
        <div style={{
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '12px',
          paddingBottom: '12px',
          background: 'rgba(255, 255, 255, 0.5)',
          borderBottom: '1px solid #F3E8FF',
        }}>
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* テーマ一覧 */}
        <div style={{ padding: '16px', overflowY: 'auto', maxHeight: 'calc(85vh - 180px)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}>
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
            <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
              <span style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}>🔍</span>
              <p style={{ color: '#A78BFA', fontSize: '14px' }}>このカテゴリにはテーマがありません</p>
            </div>
          )}
        </div>
      </div>

      {/* 購入確認モーダル */}
      {themeToConfirm && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.3)',
            }}
            onClick={() => setShowPurchaseConfirm(null)}
          />
          <div style={{
            position: 'relative',
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '24px',
            maxWidth: '320px',
            width: '100%',
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '60px', marginBottom: '12px', display: 'block' }}>{themeToConfirm.previewEmoji}</span>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#7C3AED',
                marginBottom: '8px',
              }}>
                {themeToConfirm.name}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#4B5563',
                marginBottom: '16px',
              }}>
                このテーマをこうかんしますか？
              </p>
              <div style={{
                background: '#FEF9C3',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '16px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}>
                  <span style={{ color: '#EAB308', fontSize: '24px' }}>⭐</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#A16207' }}>
                    {themeToConfirm.starPointCost?.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '14px', color: '#CA8A04' }}>ポイント</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowPurchaseConfirm(null)}
                  style={{
                    flex: 1,
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    borderRadius: '12px',
                    background: '#F3F4F6',
                    color: '#4B5563',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  やめる
                </button>
                <button
                  onClick={handlePurchaseConfirm}
                  style={{
                    flex: 1,
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    borderRadius: '12px',
                    background: 'linear-gradient(to right, #FBBF24, #FB923C)',
                    color: 'white',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                  }}
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
