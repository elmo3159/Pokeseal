/**
 * Supabase同期サービス
 *
 * 認証ユーザーとSupabaseを連携
 * - コレクションデータをSupabaseから読み込み
 * - ローカルフォーマットに変換
 */

import { stickerService } from '@/services/stickers/stickerService'
import { SavedCollectionItem } from './persistence'
import type { Sticker } from '@/types/database'

// Supabaseからコレクションデータを読み込み
// userId: Supabase認証ユーザーのUUID
export async function loadCollectionFromSupabase(userId: string): Promise<SavedCollectionItem[]> {
  if (!userId) {
    console.error('[SupabaseSync] No user ID provided')
    return []
  }

  console.log(`[SupabaseSync] Loading collection for user: ${userId}`)

  try {
    const userStickers = await stickerService.getUserStickers(userId)

    // UserStickerWithDetails → SavedCollectionItem に変換
    const collection: SavedCollectionItem[] = userStickers.map(us => ({
      stickerId: us.sticker_id,
      quantity: us.quantity || 0,
      totalAcquired: us.total_acquired || 0,
      firstAcquiredAt: us.first_acquired_at || null,
    }))

    console.log(`[SupabaseSync] Loaded ${collection.length} stickers for user`)
    return collection
  } catch (error) {
    console.error('[SupabaseSync] Failed to load collection:', error)
    return []
  }
}

// 注: この関数は廃止予定。代わりに loadCollectionFromSupabase(userId) を直接使用してください
export async function loadCurrentUserCollectionFromSupabase(): Promise<SavedCollectionItem[]> {
  console.warn('[SupabaseSync] loadCurrentUserCollectionFromSupabase is deprecated. Use loadCollectionFromSupabase(userId) instead.')
  return []
}

// Supabaseから全シールマスターデータを読み込み
export async function loadAllStickersFromSupabase(): Promise<Sticker[]> {
  console.log('[SupabaseSync] Loading all stickers from Supabase...')

  try {
    const stickers = await stickerService.getAllStickers()
    console.log(`[SupabaseSync] Loaded ${stickers.length} stickers`)
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
    console.error('[SupabaseSync] No user ID provided')
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
  // 環境変数があればSupabaseを使用
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && key && !url.includes('placeholder')) {
    return 'supabase'
  }

  return 'localStorage'
}
