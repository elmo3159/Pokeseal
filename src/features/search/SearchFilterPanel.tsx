'use client'

import React, { useState } from 'react'
import {
  StickerSearchFilter,
  ThemeTag,
  allThemeTags,
  allSeries,
  defaultSearchFilter
} from '@/domain/stickerTags'

interface SearchFilterPanelProps {
  filter: StickerSearchFilter
  onFilterChange: (filter: StickerSearchFilter) => void
  showOwnedFilter?: boolean
  compact?: boolean
}

// レア度ボタン
const RarityButton: React.FC<{
  rarity: number
  isSelected: boolean
  onToggle: () => void
}> = ({ rarity, isSelected, onToggle }) => (
  <button
    onClick={onToggle}
    className={`
      w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all active:scale-95
      ${isSelected
        ? 'bg-gradient-to-r from-yellow-400/90 to-orange-400/90 text-white shadow-[0_2px_8px_rgba(251,191,36,0.3)] border border-white/20'
        : 'bg-white/70 backdrop-blur-sm text-yellow-500 border border-yellow-200/50'
      }
    `}
  >
    {'★'.repeat(rarity)}
  </button>
)

// タグチップ
const TagChip: React.FC<{
  tag: typeof allThemeTags[0]
  isSelected: boolean
  onToggle: () => void
}> = ({ tag, isSelected, onToggle }) => (
  <button
    onClick={onToggle}
    className={`
      px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95
      ${isSelected ? 'shadow-[0_2px_8px_rgba(139,92,246,0.2)] border border-white/30' : 'backdrop-blur-sm'}
    `}
    style={{
      backgroundColor: isSelected ? tag.color : 'rgba(245, 245, 245, 0.7)',
      color: isSelected ? tag.textColor : '#888888',
    }}
  >
    {tag.emoji} {tag.label}
  </button>
)

// シールタイプボタン
const TypeButton: React.FC<{
  type: 'normal' | 'puffy' | 'sparkle'
  label: string
  emoji: string
  isSelected: boolean
  onToggle: () => void
}> = ({ label, emoji, isSelected, onToggle }) => (
  <button
    onClick={onToggle}
    className={`
      flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all active:scale-95
      ${isSelected
        ? 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white shadow-[0_2px_8px_rgba(139,92,246,0.3)] border border-white/20'
        : 'bg-white/70 backdrop-blur-sm text-purple-500 border border-purple-200/50'
      }
    `}
  >
    {emoji} {label}
  </button>
)

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  filter,
  onFilterChange,
  showOwnedFilter = false,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // フィルター更新ヘルパー
  const updateFilter = (updates: Partial<StickerSearchFilter>) => {
    onFilterChange({ ...filter, ...updates })
  }

  // レア度トグル
  const toggleRarity = (rarity: number) => {
    const newRarities = filter.rarities.includes(rarity)
      ? filter.rarities.filter(r => r !== rarity)
      : [...filter.rarities, rarity]
    updateFilter({ rarities: newRarities })
  }

  // タグトグル
  const toggleTag = (tag: ThemeTag) => {
    const newTags = filter.tags.includes(tag)
      ? filter.tags.filter(t => t !== tag)
      : [...filter.tags, tag]
    updateFilter({ tags: newTags })
  }

  // タイプトグル
  const toggleType = (type: 'normal' | 'puffy' | 'sparkle') => {
    const newTypes = filter.types.includes(type)
      ? filter.types.filter(t => t !== type)
      : [...filter.types, type]
    updateFilter({ types: newTypes })
  }

  // フィルターをリセット
  const resetFilters = () => {
    onFilterChange({ ...defaultSearchFilter })
  }

  // アクティブなフィルター数をカウント
  const activeFilterCount =
    (filter.query ? 1 : 0) +
    (filter.series ? 1 : 0) +
    filter.rarities.length +
    filter.tags.length +
    filter.types.length +
    (filter.ownedOnly ? 1 : 0)

  return (
    <div
      className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_2px_8px_rgba(139,92,246,0.1)] border border-white/50 overflow-hidden"
      style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
    >
      {/* 検索バー（常に表示） */}
      <div className="p-3 flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={filter.query}
            onChange={(e) => updateFilter({ query: e.target.value })}
            placeholder="🔍 シールをさがす..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-purple-50/70 backdrop-blur-sm text-purple-700 placeholder-purple-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 border border-purple-100/50"
          />
          {filter.query && (
            <button
              onClick={() => updateFilter({ query: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-500 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            px-3 py-2.5 rounded-xl font-bold text-sm transition-all relative active:scale-95
            ${isExpanded
              ? 'bg-purple-500/90 backdrop-blur-sm text-white shadow-[0_2px_8px_rgba(139,92,246,0.3)] border border-white/20'
              : 'bg-purple-100/70 backdrop-blur-sm text-purple-600 border border-purple-200/50'
            }
          `}
        >
          🎛️ {compact ? '' : 'しぼりこみ'}
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-[0_2px_4px_rgba(236,72,153,0.3)]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* 展開時のフィルターオプション */}
      {isExpanded && (
        <div className="px-3 pb-4 space-y-4 border-t border-purple-100/30 pt-3">
          {/* シリーズ選択 */}
          <div>
            <h4 className="text-xs font-bold text-purple-600 mb-2">📚 シリーズ</h4>
            <select
              value={filter.series || ''}
              onChange={(e) => updateFilter({ series: e.target.value || null })}
              className="w-full px-3 py-2 rounded-xl bg-purple-50/70 backdrop-blur-sm text-purple-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 border border-purple-100/50"
            >
              <option value="">すべてのシリーズ</option>
              {allSeries.map(series => (
                <option key={series} value={series}>{series}</option>
              ))}
            </select>
          </div>

          {/* レア度 */}
          <div>
            <h4 className="text-xs font-bold text-purple-600 mb-2">⭐ レア度</h4>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5].map(rarity => (
                <RarityButton
                  key={rarity}
                  rarity={rarity}
                  isSelected={filter.rarities.includes(rarity)}
                  onToggle={() => toggleRarity(rarity)}
                />
              ))}
            </div>
          </div>

          {/* シールタイプ */}
          <div>
            <h4 className="text-xs font-bold text-purple-600 mb-2">✨ タイプ</h4>
            <div className="flex gap-2">
              <TypeButton
                type="normal"
                label="ふつう"
                emoji="📄"
                isSelected={filter.types.includes('normal')}
                onToggle={() => toggleType('normal')}
              />
              <TypeButton
                type="puffy"
                label="ぷくぷく"
                emoji="🫧"
                isSelected={filter.types.includes('puffy')}
                onToggle={() => toggleType('puffy')}
              />
              <TypeButton
                type="sparkle"
                label="キラキラ"
                emoji="✨"
                isSelected={filter.types.includes('sparkle')}
                onToggle={() => toggleType('sparkle')}
              />
            </div>
          </div>

          {/* テーマタグ */}
          <div>
            <h4 className="text-xs font-bold text-purple-600 mb-2">🏷️ タグ</h4>
            <div className="flex gap-2 flex-wrap">
              {allThemeTags.map(tag => (
                <TagChip
                  key={tag.id}
                  tag={tag}
                  isSelected={filter.tags.includes(tag.id)}
                  onToggle={() => toggleTag(tag.id)}
                />
              ))}
            </div>
          </div>

          {/* 所持のみ表示 */}
          {showOwnedFilter && (
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.ownedOnly}
                  onChange={(e) => updateFilter({ ownedOnly: e.target.checked })}
                  className="w-5 h-5 rounded accent-purple-500"
                />
                <span className="text-sm text-purple-700 font-medium">
                  もってるシールだけ表示
                </span>
              </label>
            </div>
          )}

          {/* リセットボタン */}
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="w-full py-2 rounded-xl bg-gray-100/70 backdrop-blur-sm text-gray-600 text-sm font-bold hover:bg-gray-200/80 transition-all active:scale-95 border border-gray-200/50"
            >
              🔄 フィルターをリセット
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchFilterPanel
