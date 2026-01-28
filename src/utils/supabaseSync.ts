/**
 * Supabase同期サービス
 *
 * 認証ユーザーとSupabaseを連携
 * - コレクションデータをSupabaseから読み込み
 * - ローカルフォーマットに変換
 * - 通貨データの同期
 */

import { stickerService } from '@/services/stickers/stickerService'
import { currencyService, type LocalCurrencyData } from '@/services/profile'
import { SavedCollectionItem } from './persistence'
import type { Sticker } from '@/types/database'

// Supabaseからコレクションデータを読み込み
// userId: Supabase認証ユーザーのUUID
export async function loadCollectionFromSupabase(userId: string): Promise<SavedCollectionItem[]> {
  if (!userId) {
    return []
  }

  try {
    const userStickers = await stickerService.getUserStickers(userId)

    // 各ランクを別エントリとして返す（集約しない）
    // これにより、ノーマル5枚、シルバー1枚のように別々に表示できる
    const collection: SavedCollectionItem[] = userStickers.map(us => {
      const upgradeRank = (us as { upgrade_rank?: number }).upgrade_rank ?? 0
      return {
        // 複合ID: stickerId:upgradeRank（同じシールでもランクごとに区別）
        stickerId: `${us.sticker_id}:${upgradeRank}`,
        quantity: us.quantity || 0,
        totalAcquired: us.total_acquired || 0,
        firstAcquiredAt: us.first_acquired_at || null,
        upgradeRank: upgradeRank,
      }
    })

    return collection
  } catch (error) {
    console.error('[SupabaseSync] Failed to load collection:', error)
    return []
  }
}

// 注: この関数は廃止予定。代わりに loadCollectionFromSupabase(userId) を直接使用してください
export async function loadCurrentUserCollectionFromSupabase(): Promise<SavedCollectionItem[]> {
  return []
}

// Supabaseから全シールマスターデータを読み込み
export async function loadAllStickersFromSupabase(): Promise<Sticker[]> {
  try {
    const stickers = await stickerService.getAllStickers()
    return stickers
  } catch (error) {
    console.error('[SupabaseSync] Failed to load stickers:', error)
    return []
  }
}

// Supabaseにシールを追加（ガチャ結果用）
// userId: Supabase認証ユーザーのUUID
export async function addStickerToSupabase(userId: string, stickerId: string): Promise<boolean> {
  if (!userId) {
    return false
  }

  try {
    const result = await stickerService.addStickerToUser(userId, stickerId)
    return result !== null
  } catch (error) {
    console.error('[SupabaseSync] Failed to add sticker:', error)
    return false
  }
}

// 複数シールを追加（ガチャ10連用）
// userId: Supabase認証ユーザーのUUID
export async function addStickersToSupabase(userId: string, stickerIds: string[]): Promise<{
  success: boolean
  addedCount: number
}> {
  if (!userId) {
    return { success: false, addedCount: 0 }
  }

  let addedCount = 0
  for (const stickerId of stickerIds) {
    const result = await stickerService.addStickerToUser(userId, stickerId)
    if (result) addedCount++
  }

  return { success: addedCount > 0, addedCount }
}

// コレクション統計を取得
// userId: Supabase認証ユーザーのUUID
export async function getCollectionStatsFromSupabase(userId: string): Promise<{
  totalStickers: number
  ownedStickers: number
  completionRate: number
  maxRankCount: number
} | null> {
  if (!userId) return null

  try {
    return await stickerService.getCollectionStats(userId)
  } catch (error) {
    console.error('[SupabaseSync] Failed to get stats:', error)
    return null
  }
}

// データソースタイプ
export type DataSource = 'supabase' | 'localStorage'

// 現在のデータソースを判定（環境変数で切り替え可能）
export function getDataSource(): DataSource {
  // 明示的にSupabaseを強制
  if (process.env.NEXT_PUBLIC_FORCE_SUPABASE === 'true') {
    return 'supabase'
  }

  // 環境変数があればSupabaseを使用
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && key && !url.includes('placeholder')) {
    return 'supabase'
  }

  return 'localStorage'
}

// =============================================
// 通貨同期システム
// =============================================

// Supabaseから通貨を読み込み
// userId: Supabase認証ユーザーのUUID
export async function loadCurrencyFromSupabase(userId: string): Promise<LocalCurrencyData | null> {
  if (!userId) {
    return null
  }

  try {
    return await currencyService.getCurrencyLocal(userId)
  } catch (error) {
    console.error('[SupabaseSync] Failed to load currency:', error)
    return null
  }
}

// Supabaseに通貨を保存
// userId: Supabase認証ユーザーのUUID
export async function saveCurrencyToSupabase(
  userId: string,
  currency: Partial<LocalCurrencyData>
): Promise<boolean> {
  if (!userId) {
    return false
  }

  try {
    return await currencyService.setCurrencyLocal(userId, currency)
  } catch (error) {
    console.error('[SupabaseSync] Failed to save currency:', error)
    return false
  }
}

// ガチャ消費時の通貨同期
// チケット不足時はどろっぷで代替可能か確認
export async function deductGachaCurrency(
  userId: string,
  ticketCost: number,
  dropCost: number,
  useDrops: boolean = false
): Promise<{
  success: boolean
  usedCurrency: 'tickets' | 'drops'
  amountUsed: number
  canUseDropsInstead: boolean
  dropsRequired: number
  newBalance: LocalCurrencyData | null
}> {
  if (!userId) {
    return {
      success: false,
      usedCurrency: 'tickets',
      amountUsed: 0,
      canUseDropsInstead: false,
      dropsRequired: dropCost,
      newBalance: null,
    }
  }

  try {
    const result = await currencyService.deductForGacha(userId, ticketCost, dropCost, useDrops)

    // 新しい残高を取得
    let newBalance: LocalCurrencyData | null = null
    if (result.success) {
      newBalance = await currencyService.getCurrencyLocal(userId)
    }

    return {
      ...result,
      newBalance,
    }
  } catch (error) {
    console.error('[SupabaseSync] Failed to deduct gacha currency:', error)
    return {
      success: false,
      usedCurrency: 'tickets',
      amountUsed: 0,
      canUseDropsInstead: false,
      dropsRequired: dropCost,
      newBalance: null,
    }
  }
}

// プレミアムガチャ用の通貨消費
export async function deductPremiumGachaCurrency(
  userId: string,
  gemCost: number,
  dropCost: number,
  useDrops: boolean = false
): Promise<{
  success: boolean
  usedCurrency: 'gems' | 'drops'
  amountUsed: number
  canUseDropsInstead: boolean
  dropsRequired: number
  newBalance: LocalCurrencyData | null
}> {
  if (!userId) {
    return {
      success: false,
      usedCurrency: 'gems',
      amountUsed: 0,
      canUseDropsInstead: false,
      dropsRequired: dropCost,
      newBalance: null,
    }
  }

  try {
    const result = await currencyService.deductGemsForGacha(userId, gemCost, dropCost, useDrops)

    // 新しい残高を取得
    let newBalance: LocalCurrencyData | null = null
    if (result.success) {
      newBalance = await currencyService.getCurrencyLocal(userId)
    }

    return {
      ...result,
      newBalance,
    }
  } catch (error) {
    console.error('[SupabaseSync] Failed to deduct premium gacha currency:', error)
    return {
      success: false,
      usedCurrency: 'gems',
      amountUsed: 0,
      canUseDropsInstead: false,
      dropsRequired: dropCost,
      newBalance: null,
    }
  }
}

// デイリーボーナス付与
export async function grantDailyBonusToSupabase(
  userId: string,
  ticketAmount: number,
  dropAmount: number
): Promise<{
  success: boolean
  newBalance: LocalCurrencyData | null
}> {
  if (!userId) {
    return { success: false, newBalance: null }
  }

  try {
    const result = await currencyService.grantDailyBonus(userId, ticketAmount, dropAmount)

    if (result.success) {
      const newBalance = await currencyService.getCurrencyLocal(userId)
      return { success: true, newBalance }
    }

    return { success: false, newBalance: null }
  } catch (error) {
    console.error('[SupabaseSync] Failed to grant daily bonus:', error)
    return { success: false, newBalance: null }
  }
}
