'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PlacedSticker } from '@/features/sticker-book'
import { PlacedDecoItem } from '@/domain/decoItems'
import { PostPageData } from './PostCard'
import { StickerAura } from '@/components/upgrade'
import { UPGRADE_RANKS, type UpgradeRank } from '@/constants/upgradeRanks'

// 投稿する対象のページ
export interface StickerBookPage {
  id: string
  pageNumber: number
  thumbnailUrl?: string
  // 実際の配置シールデータ
  placedStickers?: PlacedSticker[]
  // 実際の配置デコアイテムデータ
  placedDecoItems?: PlacedDecoItem[]
}

interface CreatePostModalProps {
  isOpen: boolean
  pages: StickerBookPage[]
  onClose: () => void
  onSubmit: (data: {
    pageId: string
    caption: string
    hashtags: string[]
    visibility: 'public' | 'friends'
    // 投稿用のページデータ
    pageData?: PostPageData
  }) => void
}

// ハッシュタグ候補
const suggestedHashtags = [
  'ポケシル', 'シール帳', 'コレクション', 'キラキラ',
  'かわいい', 'ゆめかわ', 'レトロ', '推し活',
  'デコ', 'シール交換', '新着シール', '今日の1枚'
]

// シール帳ページのミニプレビュー（シール込み）
// ホームタブと同じ見た目を縮小表示
const PagePreviewMini: React.FC<{
  page: StickerBookPage
  isSelected: boolean
  onClick: () => void
}> = ({ page, isSelected, onClick }) => {
  // ホームと同じ60px基準のシールを、プレビューサイズに合わせてスケール
  const previewScale = 0.35 // ミニプレビュー用のスケール係数

  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.2s',
        background: 'white',
        boxShadow: isSelected ? '0 0 0 4px #B8956B, 0 0 0 6px white' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        border: isSelected ? 'none' : '2px solid #E8D5C4',
        aspectRatio: '3/4',
        minHeight: '100px',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      {/* グリッド線 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, pointerEvents: 'none' }}>
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 3 }).map((_, col) => (
            <div
              key={`grid-${row}-${col}`}
              style={{
                position: 'absolute',
                width: '33.33%',
                height: '25%',
                border: '1px solid #C4A484',
                left: `${col * 33.33}%`,
                top: `${row * 25}%`,
              }}
            />
          ))
        )}
      </div>

      {/* シールを表示 - ホームと同じ60px基準、縮小表示 */}
      {page.placedStickers && page.placedStickers.length > 0 && (
        page.placedStickers.map((sticker) => {
          const stickerSize = 60 * (sticker.scale || 1) * previewScale
          const upgradeRank = (sticker.upgradeRank ?? UPGRADE_RANKS.NORMAL) as UpgradeRank
          return (
            <div
              key={sticker.id}
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                left: `${sticker.x * 100}%`,
                top: `${sticker.y * 100}%`,
                transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                width: `${stickerSize}px`,
                height: `${stickerSize}px`,
                zIndex: 40 + (sticker.zIndex || 1),
                overflow: 'visible',
              }}
            >
              <StickerAura upgradeRank={upgradeRank} style={{ width: '100%', height: '100%' }}>
                <img
                  src={sticker.sticker.imageUrl}
                  alt={sticker.sticker.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
                  draggable={false}
                />
              </StickerAura>
            </div>
          )
        })
      )}

      {/* デコアイテムを表示 */}
      {page.placedDecoItems && page.placedDecoItems.length > 0 && (
        page.placedDecoItems.map((deco) => {
          const decoWidth = (deco.width ?? deco.decoItem.baseWidth ?? 60) * previewScale
          const decoHeight = (deco.height ?? deco.decoItem.baseHeight ?? 60) * previewScale
          return (
            <div
              key={deco.id}
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                left: `${deco.x * 100}%`,
                top: `${deco.y * 100}%`,
                transform: `translate(-50%, -50%) rotate(${deco.rotation}deg)`,
                width: `${decoWidth}px`,
                height: `${decoHeight}px`,
                zIndex: 50 + (deco.zIndex ?? 1),
              }}
            >
              <img
                src={deco.decoItem.imageUrl}
                alt={deco.decoItem.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                draggable={false}
              />
            </div>
          )
        })
      )}

      {/* サムネイルまたはプレースホルダー */}
      {(!page.placedStickers || page.placedStickers.length === 0) && (!page.placedDecoItems || page.placedDecoItems.length === 0) && (
        page.thumbnailUrl ? (
          <img
            src={page.thumbnailUrl}
            alt={`ページ ${page.pageNumber}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom right, #FDF8F5, #F5EDE6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px', marginBottom: '4px' }}>📖</span>
            <span style={{ fontSize: '10px', color: '#A67C52' }}>空のページ</span>
          </div>
        )
      )}

      {/* 選択マーク */}
      {isSelected && (
        <div style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', background: '#B8956B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
        </div>
      )}

      {/* ページ番号 */}
      <div style={{ position: 'absolute', bottom: '2px', left: '2px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '2px', paddingBottom: '2px', background: 'rgba(139, 90, 43, 0.8)', borderRadius: '4px', color: 'white', fontSize: '10px' }}>
        {page.pageNumber}
      </div>

      {/* シール数バッジ */}
      {page.placedStickers && page.placedStickers.length > 0 && (
        <div style={{ position: 'absolute', top: '4px', left: '4px', paddingLeft: '6px', paddingRight: '6px', paddingTop: '2px', paddingBottom: '2px', background: '#C4956A', borderRadius: '9999px', color: 'white', fontSize: '10px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          {page.placedStickers.length}枚
        </div>
      )}
    </button>
  )
}

// シール帳ページのプレビュー（大きめ）
// ホームタブと同じ見た目で表示
const PagePreviewLarge: React.FC<{
  page: StickerBookPage
}> = ({ page }) => {
  // ホームと同じ60px基準のシールサイズ
  const baseStickerSize = 60

  return (
    <div style={{ aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden', background: 'white', border: '2px solid #D4C4B0', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)' }}>
      {/* グリッド線 */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, pointerEvents: 'none' }}>
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 4 }).map((_, col) => (
              <div
                key={`grid-${row}-${col}`}
                style={{
                  position: 'absolute',
                  width: '25%',
                  height: '25%',
                  border: '1px solid #C4A484',
                  left: `${col * 25}%`,
                  top: `${row * 25}%`,
                }}
              />
            ))
          )}
        </div>

        {/* シールを表示 - ホームと同じ60px基準 */}
        {page.placedStickers && page.placedStickers.length > 0 && (
          page.placedStickers.map((sticker) => {
            const stickerSize = baseStickerSize * (sticker.scale || 1)
            const upgradeRank = (sticker.upgradeRank ?? UPGRADE_RANKS.NORMAL) as UpgradeRank
            return (
              <div
                key={sticker.id}
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  left: `${sticker.x * 100}%`,
                  top: `${sticker.y * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                  width: `${stickerSize}px`,
                  height: `${stickerSize}px`,
                  zIndex: 40 + (sticker.zIndex || 1),
                  overflow: 'visible',
                }}
              >
                <StickerAura upgradeRank={upgradeRank} style={{ width: '100%', height: '100%' }}>
                  <img
                    src={sticker.sticker.imageUrl}
                    alt={sticker.sticker.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.07)) drop-shadow(0 2px 2px rgba(0,0,0,0.06))' }}
                    draggable={false}
                  />
                </StickerAura>
              </div>
            )
          })
        )}

        {/* デコアイテムを表示 */}
        {page.placedDecoItems && page.placedDecoItems.length > 0 && (
          page.placedDecoItems.map((deco) => {
            const decoWidth = deco.width ?? deco.decoItem.baseWidth ?? 60
            const decoHeight = deco.height ?? deco.decoItem.baseHeight ?? 60
            return (
              <div
                key={deco.id}
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  left: `${deco.x * 100}%`,
                  top: `${deco.y * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${deco.rotation}deg)`,
                  width: `${decoWidth}px`,
                  height: `${decoHeight}px`,
                  zIndex: 50 + (deco.zIndex ?? 1),
                }}
              >
                <img
                  src={deco.decoItem.imageUrl}
                  alt={deco.decoItem.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  draggable={false}
                />
              </div>
            )
          })
        )}

        {/* サムネイルまたはプレースホルダー */}
        {(!page.placedStickers || page.placedStickers.length === 0) && (!page.placedDecoItems || page.placedDecoItems.length === 0) && (
          page.thumbnailUrl ? (
            <img
              src={page.thumbnailUrl}
              alt="投稿プレビュー"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #FDF8F5, #F5EDE6)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>📖</div>
                <p style={{ color: '#A67C52', fontSize: '14px' }}>シールを貼ってね！</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

// ハッシュタグチップ
const HashtagChip: React.FC<{
  tag: string
  isSelected: boolean
  onClick: () => void
}> = ({ tag, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingTop: '6px',
        paddingBottom: '6px',
        borderRadius: '9999px',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.2s',
        background: isSelected ? '#B8956B' : 'rgba(184, 149, 107, 0.15)',
        color: isSelected ? 'white' : '#8B5A2B',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      #{tag}
    </button>
  )
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  pages,
  onClose,
  onSubmit
}) => {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<'select' | 'edit'>('select')
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'friends'>('public')

  // クライアントサイドでマウント
  useEffect(() => {
    setMounted(true)
  }, [])

  // モーダルが開いたときにスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // 選択中のページを取得
  const selectedPage = pages.find(p => p.id === selectedPageId)

  // シールがあるページのみをフィルタリング
  const pagesWithStickers = pages.filter(p => p.placedStickers && p.placedStickers.length > 0)
  const emptyPages = pages.filter(p => !p.placedStickers || p.placedStickers.length === 0)

  // リセット
  const handleClose = useCallback(() => {
    setStep('select')
    setSelectedPageId(null)
    setCaption('')
    setSelectedTags([])
    setCustomTag('')
    setVisibility('public')
    onClose()
  }, [onClose])

  // ページ選択
  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId)
  }

  // 次へ
  const handleNext = () => {
    if (selectedPageId) {
      setStep('edit')
    }
  }

  // 戻る
  const handleBack = () => {
    setStep('select')
  }

  // ハッシュタグ選択
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // カスタムタグ追加
  const handleAddCustomTag = () => {
    const trimmed = customTag.trim()
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags(prev => [...prev, trimmed])
      setCustomTag('')
    }
  }

  // 投稿
  const handleSubmit = () => {
    if (selectedPageId && selectedPage) {
      // シールまたはデコがあればページデータを含める
      const hasContent = (selectedPage.placedStickers?.length ?? 0) > 0 || (selectedPage.placedDecoItems?.length ?? 0) > 0
      onSubmit({
        pageId: selectedPageId,
        caption,
        hashtags: selectedTags,
        visibility,
        pageData: hasContent ? {
          placedStickers: selectedPage.placedStickers || [],
          placedDecoItems: selectedPage.placedDecoItems,
        } : undefined,
      })
      handleClose()
    }
  }

  if (!mounted || !isOpen) return null

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100000, // ImageEnlargeModalより高く設定
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* 背景オーバーレイ - 完全にクリックをブロック */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={handleClose}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      />

      {/* モーダル本体 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '448px',
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '10px',
          paddingBottom: '14px',
          backgroundImage: 'url(/images/Header_UI.png)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          minHeight: '52px',
        }}>
          {step === 'edit' ? (
            <button
              onClick={handleBack}
              style={{
                color: '#FFFFFF',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.3)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                padding: '4px 10px',
                borderRadius: '12px',
                textShadow: '0 1px 2px rgba(157, 76, 108, 0.5)',
              }}
            >
              ← もどる
            </button>
          ) : (
            <div style={{ width: '64px' }} />
          )}

          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            textShadow: '0 1px 3px rgba(157, 76, 108, 0.6), 0 0 8px rgba(255, 255, 255, 0.3)',
          }}>
            {step === 'select' ? '📖 ページをえらぶ' : '✏️ とうこうする'}
          </h2>

          <button
            onClick={handleClose}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <span style={{ color: '#9D4C6C', fontWeight: 'bold' }}>✕</span>
          </button>
        </header>

        {/* コンテンツ */}
        <div style={{ padding: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
          {step === 'select' ? (
            // ページ選択ステップ
            <div>
              <p style={{ fontSize: '14px', color: '#A67C52', marginBottom: '16px', textAlign: 'center' }}>
                タイムラインに投稿したいページを選んでね！
              </p>

              {/* シールがあるページを優先表示 */}
              {pagesWithStickers.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#8B5A2B', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>✨</span>
                    <span>シールが貼られたページ</span>
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {pagesWithStickers.map(page => (
                      <PagePreviewMini
                        key={page.id}
                        page={page}
                        isSelected={selectedPageId === page.id}
                        onClick={() => handlePageSelect(page.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 空のページ */}
              {emptyPages.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#A67C52', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>📄</span>
                    <span>空のページ</span>
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', opacity: 0.6 }}>
                    {emptyPages.map(page => (
                      <PagePreviewMini
                        key={page.id}
                        page={page}
                        isSelected={selectedPageId === page.id}
                        onClick={() => handlePageSelect(page.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {pages.length === 0 && (
                <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '32px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                  <p style={{ color: '#8B5A2B', fontSize: '14px' }}>
                    まだページがありません
                  </p>
                  <p style={{ color: '#A67C52', fontSize: '12px', marginTop: '4px' }}>
                    シールを貼ってから投稿しよう！
                  </p>
                </div>
              )}
            </div>
          ) : (
            // 編集ステップ
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* 選択したページのプレビュー */}
              {selectedPage && (
                <PagePreviewLarge page={selectedPage} />
              )}

              {/* キャプション入力 */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#8B5A2B', marginBottom: '8px', display: 'block' }}>
                  💬 キャプション
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="このページのせつめいを書いてね！"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #D4C4B0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    resize: 'none',
                    outline: 'none',
                  }}
                  rows={3}
                  maxLength={200}
                />
                <p style={{ fontSize: '12px', color: '#A67C52', textAlign: 'right', marginTop: '4px' }}>
                  {caption.length}/200
                </p>
              </div>

              {/* ハッシュタグ選択 */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#8B5A2B', marginBottom: '8px', display: 'block' }}>
                  🏷️ ハッシュタグ
                </label>

                {/* 選択済みタグ */}
                {selectedTags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {selectedTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          paddingLeft: '8px',
                          paddingRight: '8px',
                          paddingTop: '4px',
                          paddingBottom: '4px',
                          background: '#B8956B',
                          color: 'white',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <span>#{tag}</span>
                        <span style={{ opacity: 0.7 }}>×</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 候補タグ */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {suggestedHashtags
                    .filter(tag => !selectedTags.includes(tag))
                    .slice(0, 6)
                    .map(tag => (
                      <HashtagChip
                        key={tag}
                        tag={tag}
                        isSelected={false}
                        onClick={() => handleTagToggle(tag)}
                      />
                    ))}
                </div>

                {/* カスタムタグ入力 */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="じぶんでタグを追加"
                    style={{
                      flex: 1,
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      border: '2px solid #D4C4B0',
                      borderRadius: '9999px',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    maxLength={20}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                  />
                  <button
                    onClick={handleAddCustomTag}
                    disabled={!customTag.trim()}
                    style={{
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      background: 'rgba(184, 149, 107, 0.15)',
                      color: '#8B5A2B',
                      borderRadius: '9999px',
                      fontSize: '14px',
                      fontWeight: 500,
                      border: 'none',
                      cursor: customTag.trim() ? 'pointer' : 'not-allowed',
                      opacity: customTag.trim() ? 1 : 0.5,
                    }}
                  >
                    追加
                  </button>
                </div>
              </div>

              {/* 公開範囲 */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#8B5A2B', marginBottom: '8px', display: 'block' }}>
                  👀 だれに見せる？
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setVisibility('public')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      borderRadius: '12px',
                      transition: 'all 0.2s',
                      background: visibility === 'public' ? '#B8956B' : 'white',
                      color: visibility === 'public' ? 'white' : '#8B5A2B',
                      border: visibility === 'public' ? '2px solid #B8956B' : '2px solid #D4C4B0',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>🌍</span>
                    <span style={{ fontWeight: 500 }}>みんな</span>
                  </button>
                  <button
                    onClick={() => setVisibility('friends')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      borderRadius: '12px',
                      transition: 'all 0.2s',
                      background: visibility === 'friends' ? '#B8956B' : 'white',
                      color: visibility === 'friends' ? 'white' : '#8B5A2B',
                      border: visibility === 'friends' ? '2px solid #B8956B' : '2px solid #D4C4B0',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>👫</span>
                    <span style={{ fontWeight: 500 }}>フレンドだけ</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <footer style={{
          padding: '16px',
          borderTop: '2px solid #D4C4B0',
          background: 'linear-gradient(to right, #FDF8F5, #F5EDE6)',
        }}>
          {step === 'select' ? (
            <button
              onClick={handleNext}
              disabled={!selectedPageId}
              style={{
                width: '100%',
                paddingTop: '16px',
                paddingBottom: '16px',
                borderRadius: '16px',
                fontWeight: 'bold',
                fontSize: '18px',
                transition: 'all 0.2s',
                background: selectedPageId ? 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)' : '#E5E7EB',
                color: selectedPageId ? 'white' : '#9CA3AF',
                boxShadow: selectedPageId ? '0 4px 15px rgba(184, 149, 107, 0.4)' : 'none',
                border: 'none',
                cursor: selectedPageId ? 'pointer' : 'not-allowed',
              }}
            >
              次へすすむ →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                width: '100%',
                paddingTop: '16px',
                paddingBottom: '16px',
                borderRadius: '16px',
                fontWeight: 'bold',
                fontSize: '18px',
                background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(184, 149, 107, 0.4)',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ✨ とうこうする ✨
            </button>
          )}
        </footer>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default CreatePostModal
