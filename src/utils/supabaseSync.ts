/**
 * Supabase同期サービス
 *
 * テストユーザーシステムとSupabaseを連携
 * - コレクションデータをSupabaseから読み込み
 * - ローカルフォーマットに変換
 */

import { stickerService, UserStickerWithDetails } from '@/services/stickers/stickerService'
import { TEST_USERS, SavedCollectionItem, getCurrentTestUser } from './persistence'
import type { Sticker } from '@/types/database'

// Supabaseからコレクションデータを読み込み
export async function loadCollectionFromSupabase(testUserId: string): Promise<SavedCollectionItem[]> {
  const testUser = TEST_USERS.find(u => u.id === testUserId)
  if (!testUser) {
    console.error('[SupabaseSync] Invalid test user ID:', testUserId)
    return []
  }

  console.log(`[SupabaseSync] Loading collection for ${testUser.name} (${testUser.supabaseId})`)

  try {
    const userStickers = await stickerService.getUserStickers(testUser.supabaseId)

    // UserStickerWithDetails → SavedCollectionItem に変換
    const collection: SavedCollectionItem[] = userStickers.map(us => ({
      stickerId: us.sticker_id,
      quantity: us.quantity,
      totalAcquired: us.total_acquired,
      firstAcquiredAt: us.first_acquired_at || null,
    }))

    console.log(`[SupabaseSync] Loaded ${collection.length} stickers for ${testUser.name}`)
    return collection
  } catch (error) {
    console.error('[SupabaseSync] Failed to load collection:', error)
    return []
  }
}

// 現在のテストユーザーのコレクションを読み込み
export async function loadCurrentUserCollectionFromSupabase(): Promise<SavedCollectionItem[]> {
  const currentUser = getCurrentTestUser()
  return loadCollectionFromSupabase(currentUser.id)
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
export async function addStickerToSupabase(testUserId: string, stickerId: string): Promise<boolean> {
  const testUser = TEST_USERS.find(u => u.id === testUserId)
  if (!testUser) {
    console.error('[SupabaseSync] Invalid test user ID:', testUserId)
    return false
  }

  try {
    const result = await stickerService.addStickerToUser(testUser.supabaseId, stickerId)
    return result !== null
  } catch (error) {
    console.error('[SupabaseSync] Failed to add sticker:', error)
    return false
  }
}

// 複数シールを追加（ガチャ10連用）
export async function addStickersToSupabase(testUserId: string, stickerIds: string[]): Promise<{
  success: boolean
  addedCount: number
}> {
  const testUser = TEST_USERS.find(u => u.id === testUserId)
  if (!testUser) {
    return { success: false, addedCount: 0 }
  }

  let addedCount = 0
  for (const stickerId of stickerIds) {
    const result = await stickerService.addStickerToUser(testUser.supabaseId, stickerId)
    if (result) addedCount++
  }

  return { success: addedCount > 0, addedCount }
}

// コレクション統計を取得
export async function getCollectionStatsFromSupabase(testUserId: string): Promise<{
  totalStickers: number
  ownedStickers: number
  completionRate: number
  maxRankCount: number
} | null> {
  const testUser = TEST_USERS.find(u => u.id === testUserId)
  if (!testUser) return null

  try {
    return await stickerService.getCollectionStats(testUser.supabaseId)
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
