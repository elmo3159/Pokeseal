'use client'

/**
 * Dynamic Imports Utility
 *
 * バンドルサイズ最適化のための動的インポート設定
 * モーダルや重いコンポーネントを遅延読み込みする
 */

import dynamic from 'next/dynamic'

// ローディングコンポーネント
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
  </div>
)

const ModalLoading = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <LoadingSpinner />
  </div>
)

// ========================================
// モーダルコンポーネント（遅延読み込み）
// ========================================

export const LazyGachaResultModal = dynamic(
  () => import('@/features/gacha/GachaResultModalEnhanced').then(mod => ({ default: mod.GachaResultModalEnhanced })),
  { ssr: false, loading: ModalLoading }
)

export const LazyMatchingModal = dynamic(
  () => import('@/features/trade/MatchingModal').then(mod => ({ default: mod.MatchingModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyProfileEditModal = dynamic(
  () => import('@/features/profile/ProfileEditModal').then(mod => ({ default: mod.ProfileEditModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyLevelUpModal = dynamic(
  () => import('@/features/profile/LevelUpModal').then(mod => ({ default: mod.LevelUpModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyStatsModal = dynamic(
  () => import('@/features/profile/StatsModal').then(mod => ({ default: mod.StatsModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyAchievementsModal = dynamic(
  () => import('@/features/profile/AchievementsModal').then(mod => ({ default: mod.AchievementsModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyFollowListModal = dynamic(
  () => import('@/features/profile/FollowListModal').then(mod => ({ default: mod.FollowListModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyOtherUserProfileModal = dynamic(
  () => import('@/features/profile/OtherUserProfileModal').then(mod => ({ default: mod.OtherUserProfileModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyStickerDetailModal = dynamic(
  () => import('@/features/collection/StickerDetailModal').then(mod => ({ default: mod.StickerDetailModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyUpgradeModal = dynamic(
  () => import('@/components/upgrade/UpgradeModal').then(mod => ({ default: mod.UpgradeModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyPageEditModal = dynamic(
  () => import('@/features/sticker-book/PageEditModal').then(mod => ({ default: mod.PageEditModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyBookShareModal = dynamic(
  () => import('@/features/sticker-book/BookShareModal').then(mod => ({ default: mod.BookShareModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyThemeSelectModal = dynamic(
  () => import('@/features/theme/ThemeSelectModal').then(mod => ({ default: mod.ThemeSelectModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyReportModal = dynamic(
  () => import('@/features/safety/ReportModal').then(mod => ({ default: mod.ReportModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyBlockModal = dynamic(
  () => import('@/features/safety/BlockModal').then(mod => ({ default: mod.BlockModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyBlockedUsersModal = dynamic(
  () => import('@/components/moderation/BlockedUsersModal').then(mod => ({ default: mod.BlockedUsersModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazySubscriptionModal = dynamic(
  () => import('@/features/shop/SubscriptionModal').then(mod => ({ default: mod.SubscriptionModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyStarPurchaseModal = dynamic(
  () => import('@/features/shop/StarPurchaseModal').then(mod => ({ default: mod.StarPurchaseModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyAdRewardModal = dynamic(
  () => import('@/features/shop/AdRewardModal').then(mod => ({ default: mod.AdRewardModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyDailyBonusModal = dynamic(
  () => import('@/features/shop/DailyBonusModal').then(mod => ({ default: mod.DailyBonusModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyInsufficientFundsModal = dynamic(
  () => import('@/features/shop/InsufficientFundsModal').then(mod => ({ default: mod.InsufficientFundsModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyCreatePostModal = dynamic(
  () => import('@/features/timeline/CreatePostModal').then(mod => ({ default: mod.CreatePostModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyCommentModal = dynamic(
  () => import('@/features/timeline/CommentModal').then(mod => ({ default: mod.CommentModal })),
  { ssr: false, loading: ModalLoading }
)


export const LazyDailyMissionsModal = dynamic(
  () => import('@/features/profile/DailyMissionsModal').then(mod => ({ default: mod.DailyMissionsModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyCollectionRewardsModal = dynamic(
  () => import('@/features/profile/CollectionRewardsModal').then(mod => ({ default: mod.CollectionRewardsModal })),
  { ssr: false, loading: ModalLoading }
)

export const LazyUserSearchModal = dynamic(
  () => import('@/features/profile/UserSearchModal').then(mod => ({ default: mod.UserSearchModal })),
  { ssr: false, loading: ModalLoading }
)

// ========================================
// 重いビューコンポーネント（遅延読み込み）
// ========================================

export const LazyAdminView = dynamic(
  () => import('@/features/admin/AdminView').then(mod => ({ default: mod.AdminView })),
  { ssr: false, loading: LoadingSpinner }
)

export const LazyTradeSessionFull = dynamic(
  () => import('@/features/trade/TradeSessionFull').then(mod => ({ default: mod.TradeSessionFull })),
  { ssr: false, loading: LoadingSpinner }
)

export const LazyGachaView = dynamic(
  () => import('@/features/gacha/GachaViewEnhanced').then(mod => ({ default: mod.GachaViewEnhanced })),
  { ssr: false, loading: LoadingSpinner }
)

export const LazySettingsView = dynamic(
  () => import('@/features/settings/SettingsView').then(mod => ({ default: mod.SettingsView })),
  { ssr: false, loading: LoadingSpinner }
)

// ========================================
// エフェクトコンポーネント（遅延読み込み）
// ========================================

export const LazyTutorialOverlay = dynamic(
  () => import('@/features/tutorial/TutorialOverlay').then(mod => ({ default: mod.TutorialOverlay })),
  { ssr: false }
)

export const LazyPeelEffect = dynamic(
  () => import('@/features/sticker-book/PeelEffect').then(mod => ({ default: mod.PeelEffect })),
  { ssr: false }
)
