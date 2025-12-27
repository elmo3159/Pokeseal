/**
 * レビュー報酬サービス
 * - App Store / Google Play のレビュー報酬管理
 * - プラットフォーム判定
 * - ストアへの誘導
 */

import { getSupabase } from '@/services/supabase/client'

// Supabaseクライアントを取得
const getClient = () => getSupabase()

// =====================================================
// 型定義
// =====================================================

export type Platform = 'ios' | 'android' | 'web'

export interface ReviewRewardStatus {
  iosClaimed: boolean
  androidClaimed: boolean
  canClaimIos: boolean
  canClaimAndroid: boolean
}

export interface ClaimReviewRewardResult {
  success: boolean
  error?: string
  rewards?: {
    tickets: number
  }
}

// =====================================================
// 報酬設定（定数）
// =====================================================

export const REVIEW_REWARD = {
  tickets: 5,
} as const

// ストアURL（実際のアプリIDに置き換える）
export const STORE_URLS = {
  ios: 'https://apps.apple.com/app/idXXXXXXXXXX', // 実際のApp Store ID
  android: 'https://play.google.com/store/apps/details?id=com.pokeseal.app', // 実際のパッケージ名
} as const

// =====================================================
// プラットフォーム判定
// =====================================================

/**
 * 現在のプラットフォームを判定
 */
export function detectPlatform(): Platform {
  if (typeof window === 'undefined') return 'web'

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

  // iOS判定
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios'
  }

  // Android判定
  if (/android/i.test(userAgent)) {
    return 'android'
  }

  return 'web'
}

/**
 * Capacitorが使用可能かどうか
 */
export function isCapacitorAvailable(): boolean {
  return typeof (window as any).Capacitor !== 'undefined'
}

/**
 * ネイティブアプリとして実行中かどうか
 */
export function isNativeApp(): boolean {
  if (!isCapacitorAvailable()) return false
  const Capacitor = (window as any).Capacitor
  return Capacitor.isNativePlatform?.() ?? false
}

// =====================================================
// サービス関数
// =====================================================

/**
 * レビュー報酬のステータスを取得
 */
export async function getReviewRewardStatus(userId: string): Promise<ReviewRewardStatus | null> {
  try {
    const { data, error } = await getClient().rpc('get_review_reward_status', {
      p_user_id: userId,
    })

    if (error || !data) {
      console.error('[ReviewRewardService] Error getting status:', error)
      return null
    }

    const result = data as any
    return {
      iosClaimed: result.ios_claimed,
      androidClaimed: result.android_claimed,
      canClaimIos: result.can_claim_ios,
      canClaimAndroid: result.can_claim_android,
    }
  } catch (err) {
    console.error('[ReviewRewardService] Exception getting status:', err)
    return null
  }
}

/**
 * レビュー報酬を受け取る
 */
export async function claimReviewReward(
  userId: string,
  platform: Platform
): Promise<ClaimReviewRewardResult> {
  try {
    const { data, error } = await getClient().rpc('claim_review_reward', {
      p_user_id: userId,
      p_platform: platform,
    })

    if (error || !data) {
      console.error('[ReviewRewardService] Error claiming reward:', error)
      return { success: false, error: 'database_error' }
    }

    const result = data as any
    if (!result.success) {
      return { success: false, error: result.error }
    }

    return {
      success: true,
      rewards: {
        tickets: result.rewards.tickets,
      },
    }
  } catch (err) {
    console.error('[ReviewRewardService] Exception claiming reward:', err)
    return { success: false, error: 'unknown_error' }
  }
}

/**
 * ストアのレビューページを開く
 */
export async function openStoreReview(platform?: Platform): Promise<boolean> {
  const targetPlatform = platform || detectPlatform()

  if (targetPlatform === 'web') {
    console.warn('[ReviewRewardService] Cannot open store review on web')
    return false
  }

  const storeUrl = STORE_URLS[targetPlatform]

  // Capacitorが使用可能な場合はネイティブブラウザを使用
  // 注: Capacitorモジュールは後で追加予定。現時点ではwindow.openにフォールバック
  if (isCapacitorAvailable() && isNativeApp()) {
    try {
      // @capacitor/browser が利用可能かチェック
      const Capacitor = (window as any).Capacitor
      if (Capacitor?.Plugins?.Browser) {
        await Capacitor.Plugins.Browser.open({ url: storeUrl })
        return true
      }
    } catch (err) {
      console.error('[ReviewRewardService] Error opening store with Capacitor:', err)
    }
  }

  // Web/フォールバック：新しいタブで開く
  window.open(storeUrl, '_blank')
  return true
}

/**
 * In-App Review APIを使用（iOS/Android）
 * 注: この機能はCapacitorプラグインが必要（後で追加予定）
 */
export async function requestInAppReview(): Promise<boolean> {
  if (!isCapacitorAvailable() || !isNativeApp()) {
    console.warn('[ReviewRewardService] In-App Review not available')
    return false
  }

  try {
    // @capawesome/capacitor-app-review プラグインを使用（後で追加予定）
    const Capacitor = (window as any).Capacitor
    if (Capacitor?.Plugins?.AppReview) {
      await Capacitor.Plugins.AppReview.requestReview()
      return true
    }
    console.warn('[ReviewRewardService] AppReview plugin not available')
    return false
  } catch (err) {
    console.error('[ReviewRewardService] Error requesting in-app review:', err)
    return false
  }
}

/**
 * レビュー誘導の表示条件をチェック
 * - 取引完了後
 * - まだレビュー報酬を受け取っていない
 */
export function shouldShowReviewPrompt(
  status: ReviewRewardStatus | null,
  platform: Platform
): boolean {
  if (!status) return false

  if (platform === 'ios') {
    return status.canClaimIos
  }
  if (platform === 'android') {
    return status.canClaimAndroid
  }
  // webの場合はどちらかが未取得なら表示
  return status.canClaimIos || status.canClaimAndroid
}

/**
 * レビュー報酬のフローを実行
 * 1. ストアを開く
 * 2. 戻ってきたら報酬を付与
 */
export async function executeReviewRewardFlow(
  userId: string,
  platform: Platform
): Promise<ClaimReviewRewardResult> {
  // まずストアを開く
  const storeOpened = await openStoreReview(platform)

  if (!storeOpened) {
    return { success: false, error: 'failed_to_open_store' }
  }

  // 注: 実際にはユーザーがストアでレビューを書いたかどうかは確認できない
  // そのためストアを開いた時点で報酬を付与する（信頼ベース）
  // これはほとんどのアプリで採用されている方式

  // 少し遅延を入れて、ユーザーがストアを見る時間を確保
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 報酬を付与
  return claimReviewReward(userId, platform)
}
