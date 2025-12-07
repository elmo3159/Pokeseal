'use client'

import React, { useState, useCallback } from 'react'

// 投稿する対象のページ
export interface StickerBookPage {
  id: string
  pageNumber: number
  thumbnailUrl?: string
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
  }) => void
}

// ハッシュタグ候補
const suggestedHashtags = [
  'ポケシル', 'シール帳', 'コレクション', 'キラキラ',
  'かわいい', 'ゆめかわ', 'レトロ', '推し活',
  'デコ', 'シール交換', '新着シール', '今日の1枚'
]

// ページ選択カード
const PageSelectCard: React.FC<{
  page: StickerBookPage
  isSelected: boolean
  onClick: () => void
}> = ({ page, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative aspect-[3/4] rounded-xl overflow-hidden
        transition-all duration-200
        ${isSelected
          ? 'ring-4 ring-purple-500 ring-offset-2 scale-[1.02]'
          : 'hover:scale-[1.02] hover:shadow-lg'
        }
      `}
    >
      {page.thumbnailUrl ? (
        <img
          src={page.thumbnailUrl}
          alt={`ページ ${page.pageNumber}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center">
          <span className="text-4xl mb-1">📖</span>
          <span className="text-xs text-purple-400">ページ {page.pageNumber}</span>
        </div>
      )}

      {/* 選択マーク */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
      )}

      {/* ページ番号 */}
      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/50 rounded text-white text-xs">
        {page.pageNumber}
      </div>
    </button>
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
      className={`
        px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200
        ${isSelected
          ? 'bg-purple-500 text-white'
          : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
        }
      `}
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
  const [step, setStep] = useState<'select' | 'edit'>('select')
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'friends'>('public')

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
    if (selectedPageId) {
      onSubmit({
        pageId: selectedPageId,
        caption,
        hashtags: selectedTags,
        visibility
      })
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* モーダル本体 */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* ヘッダー */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          {step === 'edit' ? (
            <button
              onClick={handleBack}
              className="text-purple-600 font-medium"
            >
              ← もどる
            </button>
          ) : (
            <div className="w-16" />
          )}

          <h2 className="text-lg font-bold text-purple-700">
            {step === 'select' ? 'ページをえらぶ' : 'とうこうする'}
          </h2>

          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <span className="text-gray-400">✕</span>
          </button>
        </header>

        {/* コンテンツ */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {step === 'select' ? (
            // ページ選択ステップ
            <div>
              <p className="text-sm text-purple-400 mb-4 text-center">
                タイムラインに投稿したいページを選んでね！
              </p>

              {pages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {pages.map(page => (
                    <PageSelectCard
                      key={page.id}
                      page={page}
                      isSelected={selectedPageId === page.id}
                      onClick={() => handlePageSelect(page.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-purple-400 text-sm">
                    まだページがありません
                  </p>
                  <p className="text-purple-300 text-xs mt-1">
                    シールを貼ってから投稿しよう！
                  </p>
                </div>
              )}
            </div>
          ) : (
            // 編集ステップ
            <div className="space-y-6">
              {/* 選択したページのプレビュー */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                {pages.find(p => p.id === selectedPageId)?.thumbnailUrl ? (
                  <img
                    src={pages.find(p => p.id === selectedPageId)?.thumbnailUrl}
                    alt="投稿プレビュー"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl">📖</div>
                    <p className="text-purple-400 text-sm mt-2">プレビュー</p>
                  </div>
                )}
              </div>

              {/* キャプション入力 */}
              <div>
                <label className="text-sm font-bold text-purple-700 mb-2 block">
                  キャプション
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="このページのせつめいを書いてね！"
                  className="w-full p-3 border-2 border-purple-200 rounded-xl text-sm
                           focus:border-purple-400 focus:outline-none resize-none"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-purple-300 text-right mt-1">
                  {caption.length}/200
                </p>
              </div>

              {/* ハッシュタグ選択 */}
              <div>
                <label className="text-sm font-bold text-purple-700 mb-2 block">
                  ハッシュタグ
                </label>

                {/* 選択済みタグ */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {selectedTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-500 text-white rounded-full text-xs"
                      >
                        <span>#{tag}</span>
                        <span className="opacity-70">×</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 候補タグ */}
                <div className="flex flex-wrap gap-1.5 mb-3">
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="じぶんでタグを追加"
                    className="flex-1 px-3 py-2 border-2 border-purple-200 rounded-full text-sm
                             focus:border-purple-400 focus:outline-none"
                    maxLength={20}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                  />
                  <button
                    onClick={handleAddCustomTag}
                    disabled={!customTag.trim()}
                    className="px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    追加
                  </button>
                </div>
              </div>

              {/* 公開範囲 */}
              <div>
                <label className="text-sm font-bold text-purple-700 mb-2 block">
                  だれに見せる？
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setVisibility('public')}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                      transition-all duration-200 border-2
                      ${visibility === 'public'
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'bg-white text-purple-600 border-purple-200 hover:border-purple-400'
                      }
                    `}
                  >
                    <span className="text-lg">🌍</span>
                    <span className="font-medium">みんな</span>
                  </button>
                  <button
                    onClick={() => setVisibility('friends')}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                      transition-all duration-200 border-2
                      ${visibility === 'friends'
                        ? 'bg-purple-500 text-white border-purple-500'
                        : 'bg-white text-purple-600 border-purple-200 hover:border-purple-400'
                      }
                    `}
                  >
                    <span className="text-lg">👫</span>
                    <span className="font-medium">フレンドだけ</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <footer className="p-4 border-t border-gray-100">
          {step === 'select' ? (
            <button
              onClick={handleNext}
              disabled={!selectedPageId}
              className="
                w-full py-4 rounded-2xl font-bold text-lg
                transition-all duration-200
                disabled:bg-gray-200 disabled:text-gray-400
                enabled:bg-gradient-to-r enabled:from-purple-500 enabled:to-pink-500
                enabled:text-white enabled:shadow-lg
                enabled:hover:shadow-xl enabled:active:scale-[0.98]
              "
            >
              次へすすむ →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="
                w-full py-4 rounded-2xl font-bold text-lg
                bg-gradient-to-r from-purple-500 to-pink-500 text-white
                shadow-lg hover:shadow-xl
                transition-all duration-200 active:scale-[0.98]
              "
            >
              ✨ とうこうする ✨
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}

export default CreatePostModal
