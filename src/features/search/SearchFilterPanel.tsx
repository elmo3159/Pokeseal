'use client'

import React, { useState } from 'react'
import {
  StickerSearchFilter,
  defaultSearchFilter
} from '@/domain/stickerTags'
import { ALL_STICKERS } from '@/data/stickerMasterData'
import { UPGRADE_RANKS, RANK_NAMES } from '@/constants/upgradeRanks'

/**
 * SearchFilterPanel - Container Query Units (cqw, cqh) を使用したレスポンシブ設計
 *
 * 親のコンテナに依存せず、自身でコンテナを定義して
 * 内部の要素を cqw/cqmin 単位で相対的にサイズ指定
 */

interface SearchFilterPanelProps {
  filter: StickerSearchFilter
  onFilterChange: (filter: StickerSearchFilter) => void
  showOwnedFilter?: boolean
  compact?: boolean
}

// キャラクター情報取得
interface CharacterInfo {
  name: string
  rarity: 1 | 2 | 3 | 4 | 5
  imageUrl: string
  stickerCount: number
}

function getAllCharacterInfos(): CharacterInfo[] {
  const charactersMap = new Map<string, CharacterInfo>()

  for (const sticker of ALL_STICKERS) {
    if (!charactersMap.has(sticker.character)) {
      charactersMap.set(sticker.character, {
        name: sticker.character,
        rarity: sticker.rarity,
        imageUrl: sticker.imageUrl,
        stickerCount: 1
      })
    } else {
      const existing = charactersMap.get(sticker.character)!
      existing.stickerCount++
    }
  }

  return Array.from(charactersMap.values()).sort((a, b) => b.rarity - a.rarity)
}

// ランク色取得
const getRankColor = (rank: number): { bg: string; text: string; border: string } => {
  switch (rank) {
    case UPGRADE_RANKS.SILVER:
      return { bg: 'rgba(192, 192, 192, 0.9)', text: '#5A5A5A', border: 'rgba(150, 150, 150, 0.5)' }
    case UPGRADE_RANKS.GOLD:
      return { bg: 'rgba(255, 215, 0, 0.9)', text: '#8B6914', border: 'rgba(200, 170, 0, 0.5)' }
    case UPGRADE_RANKS.PRISM:
      return { bg: 'linear-gradient(90deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6)', text: '#fff', border: 'rgba(255, 100, 200, 0.5)' }
    default:
      return { bg: 'rgba(139, 90, 60, 0.3)', text: '#5C3D2E', border: 'rgba(139, 90, 60, 0.3)' }
  }
}

// ランクボタン - Container Query対応
const UpgradeRankButton: React.FC<{
  rank: number
  isSelected: boolean
  onToggle: () => void
}> = ({ rank, isSelected, onToggle }) => {
  const colors = getRankColor(rank)
  const rankName = RANK_NAMES[rank as keyof typeof RANK_NAMES]

  return (
    <button
      onClick={onToggle}
      style={{
        minWidth: '18cqw',
        height: '10cqw',
        paddingLeft: '2cqw',
        paddingRight: '2cqw',
        borderRadius: '3cqw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '2.8cqw',
        transition: 'all 0.2s',
        background: isSelected ? colors.bg : 'rgba(255, 255, 255, 0.7)',
        color: isSelected ? colors.text : '#888',
        boxShadow: isSelected ? '0 0.5cqw 2cqw rgba(0, 0, 0, 0.15)' : 'none',
        border: isSelected ? `1px solid ${colors.border}` : '1px solid rgba(200, 200, 200, 0.3)',
        cursor: 'pointer',
      }}
    >
      {rankName}
    </button>
  )
}

// レア度ボタン - Container Query対応
const RarityButton: React.FC<{
  rarity: number
  isSelected: boolean
  onToggle: () => void
}> = ({ rarity, isSelected, onToggle }) => (
  <button
    onClick={onToggle}
    style={{
      minWidth: '14cqw',
      height: '10cqw',
      paddingLeft: '2cqw',
      paddingRight: '2cqw',
      borderRadius: '3cqw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '3cqw',
      transition: 'all 0.2s',
      background: isSelected
        ? 'linear-gradient(to right, rgba(251, 191, 36, 0.9), rgba(251, 146, 60, 0.9))'
        : 'rgba(255, 255, 255, 0.7)',
      color: isSelected ? 'white' : '#EAB308',
      boxShadow: isSelected ? '0 0.5cqw 2cqw rgba(251, 191, 36, 0.3)' : 'none',
      border: isSelected ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(234, 179, 8, 0.3)',
      cursor: 'pointer',
    }}
  >
    <span style={{ color: '#EAB308', marginRight: '0.5cqw' }}>★</span>
    <span style={{ color: isSelected ? 'white' : '#EAB308' }}>×{rarity}</span>
  </button>
)

// キャラクター選択モーダル - Container Query対応
const CharacterSelectModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  selectedCharacter: string | null
  onSelect: (character: string | null) => void
}> = ({ isOpen, onClose, selectedCharacter, onSelect }) => {
  const characters = getAllCharacterInfos()

  if (!isOpen) return null

  const handleSelect = (character: string | null) => {
    onSelect(character)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* 背景オーバーレイ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div
        style={{
          position: 'relative',
          marginTop: 'auto',
          background: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, #FAF5FF, #FCE7F3)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#7C3AED' }}>
            🎨 キャラクターでしぼりこみ
          </h3>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
            }}
          >
            ✕
          </button>
        </div>

        {/* キャラクターリスト */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px',
          }}
        >
          {/* すべてのキャラクター（リセット） */}
          <button
            onClick={() => handleSelect(null)}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderRadius: '16px',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '4px',
              background: selectedCharacter === null
                ? 'linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))'
                : 'transparent',
              transition: 'background 0.2s',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: 'linear-gradient(to bottom right, #E9D5FF, #FBCFE8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              🌟
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#7C3AED' }}>
                すべてのキャラクター
              </p>
              <p style={{ fontSize: '12px', color: '#A78BFA' }}>
                {ALL_STICKERS.length}まいのシール
              </p>
            </div>
            {selectedCharacter === null && (
              <span style={{ fontSize: '20px', color: '#8B5CF6' }}>✓</span>
            )}
          </button>

          {/* キャラクター一覧 */}
          {characters.map((character) => {
            const isSelected = selectedCharacter === character.name
            return (
              <button
                key={character.name}
                onClick={() => handleSelect(character.name)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: '4px',
                  background: isSelected
                    ? 'linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))'
                    : 'transparent',
                  transition: 'background 0.2s',
                }}
              >
                {/* キャラクター画像 */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={character.imageUrl}
                    alt={character.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>

                {/* キャラクター情報 */}
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#7C3AED' }}>
                      {character.name}
                    </p>
                    <span style={{ fontSize: '12px', color: '#EAB308' }}>
                      {'★'.repeat(character.rarity)}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#A78BFA' }}>
                    {character.stickerCount}まいのシール
                  </p>
                </div>

                {/* 選択チェック */}
                {isSelected && (
                  <span style={{ fontSize: '20px', color: '#8B5CF6' }}>✓</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  filter,
  onFilterChange,
  showOwnedFilter = false,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false)

  const updateFilter = (updates: Partial<StickerSearchFilter>) => {
    onFilterChange({ ...filter, ...updates })
  }

  const toggleRarity = (rarity: number) => {
    const newRarities = filter.rarities.includes(rarity)
      ? filter.rarities.filter(r => r !== rarity)
      : [...filter.rarities, rarity]
    updateFilter({ rarities: newRarities })
  }

  const toggleUpgradeRank = (rank: number) => {
    const newRanks = filter.upgradeRanks.includes(rank)
      ? filter.upgradeRanks.filter(r => r !== rank)
      : [...filter.upgradeRanks, rank]
    updateFilter({ upgradeRanks: newRanks })
  }

  const handleCharacterSelect = (character: string | null) => {
    updateFilter({ series: character })
  }

  const resetFilters = () => {
    onFilterChange({ ...defaultSearchFilter })
  }

  const activeFilterCount =
    (filter.query ? 1 : 0) +
    (filter.series ? 1 : 0) +
    filter.rarities.length +
    filter.upgradeRanks.length +
    (filter.ownedOnly ? 1 : 0)

  const selectedCharacterName = filter.series || 'すべて'

  return (
    <>
      <div
        style={{
          // Container Query 設定
          containerType: 'inline-size',
          containerName: 'search-filter',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          borderRadius: '4cqw',
          boxShadow: '0 0.5cqw 2cqw rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          overflow: 'hidden',
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
        }}
      >
        {/* 検索バー */}
        <div style={{
          padding: '3cqw',
          display: 'flex',
          alignItems: 'center',
          gap: '2cqw'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              value={filter.query}
              onChange={(e) => updateFilter({ query: e.target.value })}
              placeholder="🔍 シールをさがす..."
              style={{
                width: '100%',
                paddingLeft: '4cqw',
                paddingRight: '10cqw',
                paddingTop: '2.5cqw',
                paddingBottom: '2.5cqw',
                borderRadius: '3cqw',
                background: 'rgba(245, 243, 255, 0.7)',
                color: '#7C3AED',
                fontSize: '3.5cqw',
                border: '1px solid rgba(196, 181, 253, 0.3)',
                outline: 'none',
              }}
            />
            {filter.query && (
              <button
                onClick={() => updateFilter({ query: '' })}
                style={{
                  position: 'absolute',
                  right: '3cqw',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#C4B5FD',
                  cursor: 'pointer',
                  fontSize: '4cqw',
                }}
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              paddingLeft: '3cqw',
              paddingRight: '3cqw',
              paddingTop: '2.5cqw',
              paddingBottom: '2.5cqw',
              borderRadius: '3cqw',
              fontWeight: 'bold',
              fontSize: '3.5cqw',
              transition: 'all 0.2s',
              position: 'relative',
              background: isExpanded
                ? 'rgba(139, 92, 246, 0.9)'
                : 'rgba(233, 213, 255, 0.7)',
              color: isExpanded ? 'white' : '#7C3AED',
              boxShadow: isExpanded ? '0 0.5cqw 2cqw rgba(139, 92, 246, 0.3)' : 'none',
              border: isExpanded
                ? '1px solid rgba(255, 255, 255, 0.2)'
                : '1px solid rgba(196, 181, 253, 0.3)',
              cursor: 'pointer',
            }}
          >
            🎛️ {compact ? '' : 'しぼりこみ'}
            {activeFilterCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-1cqw',
                  right: '-1cqw',
                  width: '5cqw',
                  height: '5cqw',
                  background: '#EC4899',
                  color: 'white',
                  fontSize: '3cqw',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0.5cqw 1cqw rgba(236, 72, 153, 0.3)',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* 展開時のフィルターオプション */}
        {isExpanded && (
          <div
            style={{
              paddingLeft: '3cqw',
              paddingRight: '3cqw',
              paddingBottom: '4cqw',
              borderTop: '1px solid rgba(196, 181, 253, 0.2)',
              paddingTop: '3cqw',
            }}
          >
            {/* キャラクター選択 */}
            <div style={{ marginBottom: '4cqw' }}>
              <h4 style={{
                fontSize: '3cqw',
                fontWeight: 'bold',
                color: '#7C3AED',
                marginBottom: '2cqw'
              }}>
                🎨 キャラクター
              </h4>
              <button
                onClick={() => setIsCharacterModalOpen(true)}
                style={{
                  width: '100%',
                  padding: '3cqw 4cqw',
                  borderRadius: '3cqw',
                  background: 'rgba(245, 243, 255, 0.7)',
                  color: '#7C3AED',
                  fontSize: '3.5cqw',
                  border: '1px solid rgba(196, 181, 253, 0.3)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{selectedCharacterName}</span>
                <span style={{ color: '#A78BFA' }}>▼</span>
              </button>
            </div>

            {/* レア度 */}
            <div style={{ marginBottom: '4cqw' }}>
              <h4 style={{
                fontSize: '3cqw',
                fontWeight: 'bold',
                color: '#7C3AED',
                marginBottom: '2cqw'
              }}>
                ⭐ レア度
              </h4>
              <div style={{ display: 'flex', gap: '2cqw', flexWrap: 'wrap' }}>
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

            {/* アップグレードランク */}
            <div style={{ marginBottom: '4cqw' }}>
              <h4 style={{
                fontSize: '3cqw',
                fontWeight: 'bold',
                color: '#7C3AED',
                marginBottom: '2cqw'
              }}>
                💎 ランク
              </h4>
              <div style={{ display: 'flex', gap: '2cqw', flexWrap: 'wrap' }}>
                {[UPGRADE_RANKS.NORMAL, UPGRADE_RANKS.SILVER, UPGRADE_RANKS.GOLD, UPGRADE_RANKS.PRISM].map(rank => (
                  <UpgradeRankButton
                    key={rank}
                    rank={rank}
                    isSelected={filter.upgradeRanks.includes(rank)}
                    onToggle={() => toggleUpgradeRank(rank)}
                  />
                ))}
              </div>
            </div>

            {/* 所持のみ表示 */}
            {showOwnedFilter && (
              <div style={{ marginBottom: '4cqw' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3cqw',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={filter.ownedOnly}
                    onChange={(e) => updateFilter({ ownedOnly: e.target.checked })}
                    style={{
                      width: '5cqw',
                      height: '5cqw',
                      borderRadius: '1cqw',
                      accentColor: '#8B5CF6',
                    }}
                  />
                  <span style={{
                    fontSize: '3.5cqw',
                    color: '#7C3AED',
                    fontWeight: 500
                  }}>
                    もってるシールだけ表示
                  </span>
                </label>
              </div>
            )}

            {/* リセットボタン */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                style={{
                  width: '100%',
                  padding: '2.5cqw',
                  borderRadius: '3cqw',
                  background: 'rgba(243, 244, 246, 0.7)',
                  color: '#6B7280',
                  fontSize: '3.5cqw',
                  fontWeight: 'bold',
                  border: '1px solid rgba(209, 213, 219, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                🔄 フィルターをリセット
              </button>
            )}
          </div>
        )}
      </div>

      {/* キャラクター選択モーダル */}
      <CharacterSelectModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        selectedCharacter={filter.series}
        onSelect={handleCharacterSelect}
      />
    </>
  )
}

export default SearchFilterPanel
