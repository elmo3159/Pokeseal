'use client'

import React, { memo, useState } from 'react'
import { SafetyMenu } from '@/features/safety'
import { PlacedSticker } from '@/features/sticker-book'
import { PlacedDecoItem } from '@/domain/decoItems'
import { ImageEnlargeModal } from './ImageEnlargeModal'
import { StickerAura } from '@/components/upgrade'
import { UPGRADE_RANKS, type UpgradeRank } from '@/constants/upgradeRanks'
import { Avatar } from '@/components/ui/Avatar'
import { getPatternStyle, getDecorationEmoji } from '@/features/sticker-book/BookView'
import type { PageTheme } from '@/features/sticker-book/BookView'

// リアクションの種類（いいねのみに簡略化）
export type ReactionType = 'heart'

// リアクション情報
export interface Reaction {
  type: ReactionType
  count: number
  isReacted: boolean
}

// シール帳ページのデータ（投稿用）
export interface PostPageData {
  placedStickers: PlacedSticker[]
  placedDecoItems?: PlacedDecoItem[]
  backgroundColor?: string
  themeConfig?: Record<string, unknown> | null
}

// フォロー状態
export type FollowStatus = 'none' | 'following' | 'mutual'

// 投稿情報
export interface Post {
  id: string
  userId: string
  userName: string
  userAvatarUrl?: string
  userLevel?: number
  userFrameId?: string | null  // キャラクター報酬で解放したフレーム
  pageImageUrl?: string
  // シール帳ページの実データ（画像の代わりに使用可能）
  pageData?: PostPageData
  caption: string
  hashtags: string[]
  reactions: Reaction[]
  commentCount: number
  createdAt: string
  isFollowing: boolean // 後方互換性のため残す
  followStatus?: FollowStatus // 新しいフォロー状態（none/following/mutual）
  // 公開範囲
  visibility?: 'public' | 'friends'
}

interface PostCardProps {
  post: Post
  currentUserId?: string
  onReact: (postId: string, reactionType: ReactionType) => void
  onComment: (postId: string) => void
  onUserClick: (userId: string) => void
  onFollow: (userId: string) => void
  onDelete?: (postId: string) => void
  onReport?: (postId: string, userId: string, userName: string) => void
  onBlock?: (userId: string, userName: string) => void
  isBlocked?: boolean
}

// いいねボタン - 茶色・ベージュ系
const LikeButton: React.FC<{
  reaction: Reaction
  onClick: () => void
}> = ({ reaction, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: '9999px',
        fontSize: '14px',
        transition: 'all 0.2s ease',
        background: reaction.isReacted
          ? 'rgba(212, 118, 74, 0.15)'
          : 'rgba(184, 149, 107, 0.1)',
        color: reaction.isReacted ? '#D4764A' : '#A67C52',
        boxShadow: reaction.isReacted
          ? '0 2px 8px rgba(212, 118, 74, 0.2)'
          : 'none',
      }}
      className="active:scale-95"
    >
      <span style={{ fontSize: '16px' }}>{reaction.isReacted ? '❤️' : '🤍'}</span>
      <span style={{ fontWeight: 'bold' }}>{reaction.count > 0 ? reaction.count : 'いいね'}</span>
    </button>
  )
}

// 時間フォーマット
const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'たった今'
  if (diffMins < 60) return `${diffMins}分前`
  if (diffHours < 24) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// シール帳ページのプレビュー表示
// BookViewと同じ表示になるように、固定ベースサイズ（18.75%）× scaleで計算
const StickerPagePreview: React.FC<{
  pageData: PostPageData
  onClick: () => void
}> = ({ pageData, onClick }) => {
  // BookViewのページ幅320pxに対する60pxシールの比率 = 18.75%
  const BASE_STICKER_PERCENT = 18.75

  // テーマ設定を取得
  const theme = pageData.themeConfig as PageTheme | null | undefined
  const bgColor = theme?.backgroundColor || '#FEFBFF'
  const bgGradientTo = theme?.backgroundGradientTo || '#FFFFFF'
  const pattern = theme?.pattern || 'dots'
  const patternColor = theme?.patternColor || 'rgba(167, 139, 250, 0.3)'
  const patternOpacity = theme?.patternOpacity ?? 0.15
  const decoration = theme?.decoration || 'none'
  const decorationEmoji = getDecorationEmoji(decoration)
  const patternStyle = getPatternStyle(pattern, patternColor)

  return (
    <button
      onClick={onClick}
      className="relative w-full aspect-[2/3] overflow-hidden group"
      style={{
        background: `linear-gradient(180deg, ${bgColor} 0%, ${bgGradientTo} 100%)`,
      }}
    >
      {/* パターン背景 */}
      <div
        className="absolute inset-4 pointer-events-none"
        style={{ ...patternStyle, opacity: patternOpacity, zIndex: 2 }}
      />

      {/* フレーム装飾 */}
      {theme?.frameColor && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: '6px',
            borderRadius: '22px',
            border: `4px solid ${theme.frameColor}`,
            boxShadow: theme.frameGlowColor
              ? `0 0 20px ${theme.frameGlowColor}, 0 0 40px ${theme.frameGlowColor}40, inset 0 0 12px ${theme.frameGlowColor}`
              : 'none',
            zIndex: 6,
          }}
        />
      )}

      {/* コーナー装飾（絵文字） */}
      {decorationEmoji && (
        <>
          <div className="absolute opacity-60 drop-shadow-lg" style={{ top: 12, left: 12, fontSize: 24, zIndex: 7 }}>{decorationEmoji}</div>
          <div className="absolute opacity-60 drop-shadow-lg" style={{ top: 12, right: 12, fontSize: 24, transform: 'scaleX(-1)', zIndex: 7 }}>{decorationEmoji}</div>
          <div className="absolute opacity-60 drop-shadow-lg" style={{ bottom: 32, left: 12, fontSize: 24, transform: 'scaleY(-1)', zIndex: 7 }}>{decorationEmoji}</div>
          <div className="absolute opacity-60 drop-shadow-lg" style={{ bottom: 32, right: 12, fontSize: 24, transform: 'scale(-1)', zIndex: 7 }}>{decorationEmoji}</div>
        </>
      )}

      {/* コーナー装飾（画像） */}
      {decoration === 'image' && theme?.cornerImage && (
        <>
          <img src={theme.cornerImage} alt="" className="absolute object-contain drop-shadow-lg" style={{ opacity: 0.9, top: 8, left: 8, width: 48, height: 48, zIndex: 7 }} />
          <img src={theme.cornerImage} alt="" className="absolute object-contain drop-shadow-lg" style={{ opacity: 0.9, top: 8, right: 8, width: 48, height: 48, transform: 'scaleX(-1)', zIndex: 7 }} />
          <img src={theme.cornerImage} alt="" className="absolute object-contain drop-shadow-lg" style={{ opacity: 0.9, bottom: 8, left: 8, width: 48, height: 48, transform: 'scaleY(-1)', zIndex: 7 }} />
          <img src={theme.cornerImage} alt="" className="absolute object-contain drop-shadow-lg" style={{ opacity: 0.9, bottom: 8, right: 8, width: 48, height: 48, transform: 'scale(-1)', zIndex: 7 }} />
        </>
      )}

      {/* シール配置 - BookViewと同じ構造 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 40,
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          overflow: 'visible',
        }}
      >
        {pageData.placedStickers.map((sticker) => {
          // BookViewと同じ計算: ベースサイズ × scale
          const stickerWidthPercent = BASE_STICKER_PERCENT * (sticker.scale || 1)
          const upgradeRank = (sticker.upgradeRank ?? UPGRADE_RANKS.NORMAL) as UpgradeRank
          return (
            <div
              key={sticker.id}
              className="absolute select-none"
              style={{
                left: `${sticker.x * 100}%`,
                top: `${sticker.y * 100}%`,
                width: `${stickerWidthPercent}%`,
                height: 'auto',
                aspectRatio: '1 / 1',
                transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
                zIndex: 40 + (sticker.zIndex || 1),
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                overflow: 'visible',
              }}
            >
              <StickerAura upgradeRank={upgradeRank} style={{ width: '100%', height: '100%' }}>
                <img
                  src={sticker.sticker.imageUrl}
                  alt={sticker.sticker.name}
                  className="w-full h-full object-contain drop-shadow-md"
                  draggable={false}
                />
              </StickerAura>
            </div>
          )
        })}
      </div>

      {/* デコアイテム配置 - BookViewのPageDecosと同じ構造 */}
      {pageData.placedDecoItems && pageData.placedDecoItems.length > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 50,
            backfaceVisibility: 'hidden',
          }}
        >
          {pageData.placedDecoItems.map((deco) => {
            // デコのサイズ計算: 元のピクセルサイズを比率に変換
            // BookViewでは deco.width ?? deco.decoItem.baseWidth ?? 60
            const decoWidthPx = deco.width ?? deco.decoItem.baseWidth ?? 60
            const decoHeightPx = deco.height ?? deco.decoItem.baseHeight ?? 60
            // 320px基準での比率に変換
            const decoWidthPercent = (decoWidthPx / 320) * 100
            const decoHeightPercent = (decoHeightPx / 480) * 100

            return (
              <div
                key={deco.id}
                className="absolute select-none"
                style={{
                  left: `${deco.x * 100}%`,
                  top: `${deco.y * 100}%`,
                  width: `${decoWidthPercent}%`,
                  height: `${decoHeightPercent}%`,
                  transform: `translate(-50%, -50%) rotate(${deco.rotation}deg)`,
                  zIndex: 50 + (deco.zIndex ?? 1),
                }}
              >
                <img
                  src={deco.decoItem.imageUrl}
                  alt={deco.decoItem.name}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* ホバー時の拡大アイコン */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center" style={{ zIndex: 100 }}>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
          <span className="text-2xl">🔍</span>
        </div>
      </div>
    </button>
  )
}

// メインのPostCard
export const PostCard: React.FC<PostCardProps> = memo(({
  post,
  currentUserId,
  onReact,
  onComment,
  onUserClick,
  onFollow,
  onDelete,
  onReport,
  onBlock,
  isBlocked = false
}) => {
  const [isEnlargeModalOpen, setIsEnlargeModalOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // 自分の投稿かどうか
  const isOwnPost = currentUserId === post.userId

  return (
    <>
      <article
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 2px 8px rgba(184, 149, 107, 0.15)',
          border: '2px solid #D4C4B0',
        }}
      >
        {/* ヘッダー */}
        <header className="relative z-20 flex items-center justify-between p-4">
          <button
            onClick={() => onUserClick(post.userId)}
            className="flex items-center gap-3"
          >
            {/* アバター */}
            <Avatar
              src={post.userAvatarUrl}
              alt={post.userName}
              size="sm"
              frameId={post.userFrameId}
            />

            {/* ユーザー名と時間 */}
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm" style={{ color: '#8B5A2B' }}>{post.userName}</h4>
                {post.userLevel != null && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#F0E6D8', color: '#A67C52' }}>
                    Lv.{post.userLevel}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs" style={{ color: '#A67C52' }}>{formatTime(post.createdAt)}</p>
                {post.visibility === 'friends' && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(184, 149, 107, 0.15)', color: '#8B5A2B' }}
                  >
                    👫 フレンド限定
                  </span>
                )}
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {/* 自分の投稿: 削除ボタン / 他人の投稿: フォロー状態表示 */}
            {isOwnPost ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="
                  px-3 py-1.5 rounded-full text-sm font-bold
                  bg-red-100/90 backdrop-blur-sm text-red-500
                  hover:bg-red-200 transition-all
                  active:scale-95
                  shadow-[0_2px_8px_rgba(239,68,68,0.2)]
                  border border-red-200/50
                "
              >
                🗑️ 削除
              </button>
            ) : (
              // フォロー状態に応じた表示
              (() => {
                const status = post.followStatus || (post.isFollowing ? 'following' : 'none')

                if (status === 'mutual') {
                  // 相互フォロー（フレンド）
                  return (
                    <span
                      className="px-3 py-1.5 rounded-full text-sm font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(184, 149, 107, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      🤝 フレンド
                    </span>
                  )
                } else if (status === 'following') {
                  // フォロー中
                  return (
                    <span
                      className="px-3 py-1.5 rounded-full text-sm font-bold"
                      style={{
                        background: 'rgba(184, 149, 107, 0.15)',
                        color: '#8B5A2B',
                        boxShadow: '0 2px 8px rgba(184, 149, 107, 0.15)',
                        border: '1px solid #D4C4B0',
                      }}
                    >
                      ✓ フォロー中
                    </span>
                  )
                } else {
                  // 未フォロー
                  return (
                    <button
                      onClick={() => onFollow(post.userId)}
                      className="px-3 py-1.5 rounded-full text-sm font-bold transition-all active:scale-95"
                      style={{
                        background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
                        color: 'white',
                        boxShadow: '0 2px 8px rgba(184, 149, 107, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      フォロー
                    </button>
                  )
                }
              })()
            )}

            {/* セーフティメニュー（通報・ブロック）- 他人の投稿のみ */}
            {!isOwnPost && onReport && onBlock && (
              <SafetyMenu
                userName={post.userName}
                isBlocked={isBlocked}
                onReport={() => onReport(post.id, post.userId, post.userName)}
                onBlock={() => onBlock(post.userId, post.userName)}
              />
            )}
          </div>
        </header>

        {/* 画像 - タップで拡大 */}
        <div
          className="relative z-0 aspect-[4/3]"
          style={{ background: 'linear-gradient(135deg, #F5EDE6 0%, #E8D5C4 100%)' }}
        >
          {post.pageData ? (
            // シール帳ページのデータがある場合
            <StickerPagePreview
              pageData={post.pageData}
              onClick={() => setIsEnlargeModalOpen(true)}
            />
          ) : post.pageImageUrl ? (
            // 画像URLがある場合
            <button
              onClick={() => setIsEnlargeModalOpen(true)}
              className="w-full h-full group"
            >
              <img
                src={post.pageImageUrl}
                alt="シール帳ページ"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              {/* ホバー時の拡大アイコン */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                  <span className="text-2xl">🔍</span>
                </div>
              </div>
            </button>
          ) : (
            // どちらもない場合のプレースホルダー
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">📖</div>
                <p className="text-sm" style={{ color: '#A67C52' }}>シール帳ページ</p>
              </div>
            </div>
          )}
        </div>

        {/* いいね・コメントバー */}
        <div
          className="flex items-center gap-3 p-3"
          style={{ borderBottom: '1px solid #E8D5C4' }}
        >
          {/* いいねボタン - 常に表示（heartリアクションがない場合はデフォルト値を使用） */}
          <LikeButton
            reaction={post.reactions.find(r => r.type === 'heart') || { type: 'heart', count: 0, isReacted: false }}
            onClick={() => onReact(post.id, 'heart')}
          />

          {/* コメントボタン */}
          <button
            onClick={() => onComment(post.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all active:scale-95"
            style={{
              background: 'rgba(184, 149, 107, 0.1)',
              color: '#A67C52',
            }}
          >
            <span className="text-base">💬</span>
            <span className="font-bold">{post.commentCount > 0 ? post.commentCount : 'コメント'}</span>
          </button>
        </div>

        {/* キャプションとハッシュタグ */}
        <div className="p-4">
          {post.caption && (
            <p className="text-sm mb-2" style={{ color: '#8B5A2B' }}>{post.caption}</p>
          )}

          {post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ color: '#A67C52', background: 'rgba(184, 149, 107, 0.15)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* 画像拡大モーダル */}
      <ImageEnlargeModal
        isOpen={isEnlargeModalOpen}
        onClose={() => setIsEnlargeModalOpen(false)}
        imageUrl={post.pageImageUrl}
        pageData={post.pageData}
        userName={post.userName}
        caption={post.caption}
      />

      {/* 削除確認ダイアログ */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-[300px] w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🗑️</div>
              <h3 className="text-lg font-bold text-[#8B5A3C] mb-2">
                投稿を削除しますか？
              </h3>
              <p className="text-sm text-[#A0826D]">
                この操作は取り消せません
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  if (onDelete) {
                    onDelete(post.id)
                  }
                  setShowDeleteConfirm(false)
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors shadow-[0_2px_8px_rgba(239,68,68,0.3)]"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

PostCard.displayName = 'PostCard'

export default PostCard
