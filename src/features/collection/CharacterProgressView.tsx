'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  characterRewardService,
  type CharacterRewardStatus,
  type CharacterRewardWithStatus,
} from '@/services/characterRewards'
import {
  CHARACTER_THEME_COLORS,
  CHARACTER_REWARD_TYPES,
  type CharacterName,
  type CharacterRewardTier,
} from '@/constants/characterRewards'
import { CHARACTER_ICON_MAP } from '@/constants/characterStickerIcons'
import {
  CHARACTER_STICKER_IMAGES,
  CHARACTER_COVER_IMAGES,
  CHARACTER_FRAME_IMAGES,
} from '@/constants/characterRewardAssets'
import { useAuth } from '@/hooks'

// 報酬タイプの説明
const REWARD_TYPE_DESCRIPTIONS = {
  [CHARACTER_REWARD_TYPES.CHARACTER_ICON]: 'キャラアイコン',
  [CHARACTER_REWARD_TYPES.BOOK_COVER]: 'シール帳表紙',
  [CHARACTER_REWARD_TYPES.ICON_FRAME]: 'アイコンフレーム',
} as const

// 報酬アイコンコンポーネント
const RewardIcon: React.FC<{
  type: string
  claimed: boolean
  canClaim: boolean
}> = ({ type, claimed, canClaim }) => {
  const getIcon = () => {
    switch (type) {
      case CHARACTER_REWARD_TYPES.CHARACTER_ICON:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        )
      case CHARACTER_REWARD_TYPES.BOOK_COVER:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        )
      case CHARACTER_REWARD_TYPES.ICON_FRAME:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
            <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
          </svg>
        )
    }
  }

  return (
    <div
      className={`
        w-8 h-8 rounded-full flex items-center justify-center
        ${
          claimed
            ? 'bg-gray-200 text-gray-400'
            : canClaim
              ? 'bg-gradient-to-br from-yellow-300 to-orange-400 text-white animate-pulse shadow-lg'
              : 'bg-gray-100 text-gray-500'
        }
      `}
    >
      {getIcon()}
    </div>
  )
}

// 報酬カード
const RewardCard: React.FC<{
  reward: CharacterRewardWithStatus
  onClaim: () => void
  isLoading: boolean
  thumbnailUrl?: string
  onPreview?: () => void
}> = ({ reward, onClaim, isLoading, thumbnailUrl, onPreview }) => {
  const description = REWARD_TYPE_DESCRIPTIONS[reward.rewardType] || '報酬'

  return (
    <div
      className={`
      flex items-center gap-2 p-2 rounded-lg border
      ${
        reward.claimed
          ? 'bg-gray-50 border-gray-200'
          : reward.canClaim
            ? 'bg-yellow-50 border-yellow-300 shadow-md'
            : 'bg-white border-gray-200'
      }
    `}
      onClick={onPreview}
      style={{ cursor: onPreview ? 'pointer' : 'default' }}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt=""
            className="w-full h-full object-contain"
            draggable={false}
          />
        ) : (
          <RewardIcon
            type={reward.rewardType}
            claimed={reward.claimed}
            canClaim={reward.canClaim}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-700 truncate">
          Tier {reward.tier}: {description}
        </div>
        <div className="text-[10px] text-gray-500">
          {reward.currentProgress}/{reward.requiredCount}種
        </div>
      </div>

      {reward.claimed ? (
        <span className="text-xs text-gray-400 px-2">受取済</span>
      ) : reward.canClaim ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClaim()
          }}
          disabled={isLoading}
          className="px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 rounded-full shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
        >
          {isLoading ? '...' : '受取'}
        </button>
      ) : (
        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all"
            style={{
              width: `${Math.min((reward.currentProgress / reward.requiredCount) * 100, 100)}%`,
            }}
          />
        </div>
      )}
    </div>
  )
}

// キャラクターカード
const CharacterCard: React.FC<{
  status: CharacterRewardStatus
  onClaim: (characterName: CharacterName, tier: CharacterRewardTier) => Promise<void>
  claimingKey: string | null
  iconUrl?: string
  stickerImages: string[]
  coverImages: string[]
  frameImages: string[]
  onPreview: (title: string, images: string[], rewardType: string) => void
}> = ({ status, onClaim, claimingKey, iconUrl, stickerImages, coverImages, frameImages, onPreview }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const colors = CHARACTER_THEME_COLORS[status.characterName] || {
    primary: '#6B3FA0',
    secondary: '#FFF5F8',
    accent: '#9333EA',
  }

  const hasClaimable = status.rewards.some(r => r.canClaim)
  const completedTiers = status.rewards.filter(r => r.claimed).length
  const totalTiers = status.rewards.length

  return (
    <div
      className="rounded-xl overflow-hidden shadow-sm border border-gray-100"
      style={{ backgroundColor: colors.secondary }}
    >
      {/* ヘッダー */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center gap-3"
      >
        {/* キャラクターアイコン */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-md overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
        >
          {iconUrl ? (
            <img
              src={iconUrl}
              alt={status.characterName}
              className="w-full h-full object-contain"
              draggable={false}
            />
          ) : (
            status.characterName.charAt(0)
          )}
        </div>

        {/* キャラクター情報 */}
        <div className="flex-1 text-left">
          <div className="font-bold text-sm text-gray-800">{status.characterName}</div>
          <div className="text-xs text-gray-500">
            {status.progress.collectedCount}/{status.progress.totalCount}種 収集
          </div>
        </div>

        {/* 進捗 */}
        <div className="flex items-center gap-2">
          {hasClaimable && (
            <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-red-500 rounded-full animate-bounce">
              NEW
            </span>
          )}
          <div className="text-right">
            <div className="text-xs font-bold" style={{ color: colors.primary }}>
              {completedTiers}/{totalTiers}
            </div>
          </div>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* 進捗バー */}
      <div className="px-3 pb-2">
        <div className="h-2 bg-white/50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${status.progress.completionRate}%`,
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
            }}
          />
        </div>
      </div>

      {/* 展開時の報酬一覧 */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-2">
          {status.rewards.map(reward => {
            const previewImages = reward.rewardType === CHARACTER_REWARD_TYPES.CHARACTER_ICON
              ? stickerImages
              : reward.rewardType === CHARACTER_REWARD_TYPES.BOOK_COVER
                ? coverImages
                : reward.rewardType === CHARACTER_REWARD_TYPES.ICON_FRAME
                  ? frameImages
                  : []
            const previewTitle = reward.rewardType === CHARACTER_REWARD_TYPES.CHARACTER_ICON
              ? `${status.characterName} キャラアイコン`
              : reward.rewardType === CHARACTER_REWARD_TYPES.BOOK_COVER
                ? `${status.characterName} シール帳表紙`
                : reward.rewardType === CHARACTER_REWARD_TYPES.ICON_FRAME
                  ? `${status.characterName} アイコンフレーム`
                  : status.characterName
            const thumbnailUrl = previewImages[0]

            return (
            <RewardCard
              key={reward.id}
              reward={reward}
              onClaim={() => onClaim(status.characterName, reward.tier)}
              isLoading={claimingKey === `${status.characterName}_${reward.tier}`}
              thumbnailUrl={thumbnailUrl}
              onPreview={
                previewImages.length > 0
                  ? () => onPreview(previewTitle, previewImages, reward.rewardType)
                  : undefined
              }
            />
            )
          })}
        </div>
      )}
    </div>
  )
}

// メインコンポーネント
export const CharacterProgressView: React.FC = () => {
  const { user } = useAuth()
  const [statuses, setStatuses] = useState<CharacterRewardStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [claimingKey, setClaimingKey] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [preview, setPreview] = useState<{
    title: string
    images: string[]
    layout?: 'cover' | 'frame'
  } | null>(null)
  const resolveCharacterIcon = useCallback((name: string) => {
    if (CHARACTER_ICON_MAP[name]) return CHARACTER_ICON_MAP[name]
    const normalized = name.replace(/[・\s]/g, '')
    if (CHARACTER_ICON_MAP[normalized]) return CHARACTER_ICON_MAP[normalized]
    const key = Object.keys(CHARACTER_ICON_MAP).find(
      k => k.replace(/[・\s]/g, '') === normalized
    )
    return key ? CHARACTER_ICON_MAP[key] : undefined
  }, [])
  const resolveAssetList = useCallback((map: Record<string, string[]>, name: string) => {
    if (map[name]) return map[name]
    const normalized = name.replace(/[・\s]/g, '')
    if (map[normalized]) return map[normalized]
    const key = Object.keys(map).find(k => k.replace(/[・\s]/g, '') === normalized)
    return key ? map[key] : []
  }, [])
  const buildCoverPreview = useCallback((images: string[]) => {
    if (images.length === 0) return []
    const isCoverImage = (image: string) => /\/cover\.[^/]+$/i.test(image)
    const isBackImage = (image: string) => /\/back\.[^/]+$/i.test(image)
    const cover = images.find(isCoverImage)
    const back = images.find(isBackImage)
    const unique = new Set<string>()
    const ordered = [cover, back]
      .filter(Boolean)
      .filter((image) => {
        if (unique.has(image!)) return false
        unique.add(image!)
        return true
      }) as string[]
    if (ordered.length >= 2) return ordered
    if (ordered.length === 1) {
      const base = ordered[0]
      const fallback = isBackImage(base)
        ? base.replace(/\/back(\.[^/]+)$/i, '/cover$1')
        : isCoverImage(base)
          ? base.replace(/\/cover(\.[^/]+)$/i, '/back$1')
          : null
      if (fallback && !unique.has(fallback)) ordered.push(fallback)
      return ordered.slice(0, 2)
    }
    return Array.from(new Set(images)).slice(0, 2)
  }, [])

  // データ読み込み
  const loadData = useCallback(async () => {
    if (!user) return

    try {
      const data = await characterRewardService.getAllCharacterRewardStatus(user.id)
      // 進捗があるキャラクターを上位に、未受取報酬があるものを最上位に
      const sorted = [...data].sort((a, b) => {
        const aHasClaimable = a.rewards.some(r => r.canClaim) ? 1 : 0
        const bHasClaimable = b.rewards.some(r => r.canClaim) ? 1 : 0
        if (aHasClaimable !== bHasClaimable) return bHasClaimable - aHasClaimable

        // 進捗率で比較
        return b.progress.completionRate - a.progress.completionRate
      })
      setStatuses(sorted)
    } catch (error) {
      console.error('Failed to load character progress:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    const cached = characterRewardService.getCachedStatus(user.id)
    if (cached) {
      setStatuses(cached)
      setIsLoading(false)
      loadData()
      return
    }
    loadData()
  }, [loadData])

  // 報酬受取
  const handleClaim = async (characterName: CharacterName, tier: CharacterRewardTier) => {
    if (!user || claimingKey) return

    const key = `${characterName}_${tier}`
    setClaimingKey(key)
    setMessage(null)

    try {
      const result = await characterRewardService.claimReward(user.id, characterName, tier)

      if (result.success) {
        const rewardName = REWARD_TYPE_DESCRIPTIONS[result.rewardType!] || '報酬'
        setMessage({ type: 'success', text: `${rewardName}を受け取りました！` })
        // データを再読み込み
        await loadData()
      } else {
        setMessage({ type: 'error', text: result.error || '受取に失敗しました' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '通信エラーが発生しました' })
    } finally {
      setClaimingKey(null)
    }
  }

  // 総合統計
  const totalStats = statuses.reduce(
    (acc, s) => ({
      collected: acc.collected + s.progress.collectedCount,
      total: acc.total + s.progress.totalCount,
      claimable: acc.claimable + s.rewards.filter(r => r.canClaim).length,
    }),
    { collected: 0, total: 0, claimable: 0 }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pb-20">
      {/* ヘッダー統計 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl mb-4 shadow-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">
            {totalStats.collected}/{totalStats.total}
          </div>
          <div className="text-sm opacity-90">キャラクター別 図鑑進捗</div>
        </div>

        {totalStats.claimable > 0 && (
          <div className="mt-3 text-center">
            <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium">
              {totalStats.claimable}件の報酬が受取可能
            </span>
          </div>
        )}
      </div>

      {/* メッセージ */}
      {message && (
        <div
          className={`
          mb-4 p-3 rounded-lg text-sm font-medium text-center
          ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
        `}
        >
          {message.text}
        </div>
      )}

      {/* キャラクター一覧 */}
      <div className="space-y-3">
        {statuses.map(status => {
          const stickerImages = resolveAssetList(CHARACTER_STICKER_IMAGES, status.characterName)
          const coverImages = buildCoverPreview(
            resolveAssetList(CHARACTER_COVER_IMAGES, status.characterName)
          )
          const frameImages = resolveAssetList(CHARACTER_FRAME_IMAGES, status.characterName)
          const iconUrl = stickerImages[0] || resolveCharacterIcon(status.characterName)

          return (
            <CharacterCard
              key={status.characterName}
              status={status}
              onClaim={handleClaim}
              claimingKey={claimingKey}
              iconUrl={iconUrl}
              stickerImages={stickerImages}
              coverImages={coverImages}
              frameImages={frameImages}
              onPreview={(title, images, rewardType) =>
                setPreview({
                  title,
                  images,
                  layout:
                    rewardType === CHARACTER_REWARD_TYPES.BOOK_COVER
                      ? 'cover'
                      : rewardType === CHARACTER_REWARD_TYPES.ICON_FRAME
                        ? 'frame'
                        : undefined,
                })
              }
            />
          )
        })}
      </div>

      {/* キャラクターが0件の場合 */}
      {statuses.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          <p>キャラクターデータを読み込み中...</p>
        </div>
      )}

      {preview && (
        <div
          className="fixed inset-0 z-[120000] bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="w-full sm:max-w-md max-h-[85vh] bg-white rounded-t-xl sm:rounded-xl shadow-xl flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            {/* 固定ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
              <div className="text-sm font-bold text-gray-800">{preview.title}</div>
              <button
                onClick={() => setPreview(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            {/* スクロール可能なコンテンツ */}
            <div className="flex-1 overflow-y-auto p-4">
            {preview.images.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-8">準備中だよ</div>
            ) : preview.layout === 'cover' ? (
              <div className="flex items-start justify-center gap-4">
                {preview.images.slice(0, 2).map((src, index) => {
                  const isCover = /\/cover\.[^/]+$/i.test(src)
                  const isBack = /\/back\.[^/]+$/i.test(src)
                  const label = isCover ? '表紙' : isBack ? '裏表紙' : '表紙'
                  return (
                    <div key={`${src}_${index}`} className="flex flex-col items-center gap-1">
                      <div className="w-28 h-[150px] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                        <img
                          src={src}
                          alt={label}
                          className="max-w-full max-h-full object-contain"
                          draggable={false}
                        />
                      </div>
                      <div className="text-[11px] text-gray-500">{label}</div>
                    </div>
                  )
                })}
              </div>
            ) : preview.layout === 'frame' ? (
              <div className="flex flex-wrap items-center justify-center gap-4">
                {preview.images.map((src, index) => (
                  <div
                    key={`${src}_${index}`}
                    className="w-40 h-40 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-3"
                  >
                    <img
                      src={src}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {preview.images.map((src, index) => (
                  <div
                    key={`${src}_${index}`}
                    className="h-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-1"
                  >
                    <img
                      src={src}
                      alt=""
                      className="max-w-full max-h-full object-contain"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CharacterProgressView
