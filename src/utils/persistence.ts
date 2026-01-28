/**
 * ローカルストレージ永続化システム
 *
 * 端末ごとにユーザーデータを保存・読み込み
 */

import { UserMonetization, DEFAULT_USER_MONETIZATION } from '@/domain/monetization'
import { PlacedSticker, BookPage } from '@/features/sticker-book'
import { PlacedDecoItem } from '@/domain/decoItems'
import { createInitialDailyCounts, type DailyActionCounts } from '@/domain/levelSystem'

// ストレージキー
const STORAGE_KEYS = {
  USER_DATA: 'pokeseal_user_data',
  ADMIN_MODE: 'pokeseal_admin_mode',
  VERSION: 'pokeseal_data_version',
  CURRENT_TEST_USER: 'pokeseal_current_test_user',
  TEST_USERS: 'pokeseal_test_users',
} as const

// テストユーザー定義
export interface TestUser {
  id: string
  supabaseId: string  // Supabase上のUUID
  name: string
  emoji: string
  color: string
}

// 利用可能なテストユーザー（固定）
// supabaseIdはSupabase profilesテーブルのidと一致
export const TEST_USERS: TestUser[] = [
  { id: 'test-user-a', supabaseId: '11111111-1111-1111-1111-111111111111', name: 'テストユーザーA', emoji: '🐱', color: '#F472B6' },
  { id: 'test-user-b', supabaseId: '22222222-2222-2222-2222-222222222222', name: 'テストユーザーB', emoji: '🐶', color: '#60A5FA' },
  { id: 'test-user-c', supabaseId: '33333333-3333-3333-3333-333333333333', name: 'テストユーザーC', emoji: '🐰', color: '#4ADE80' },
]

// データバージョン（マイグレーション用）
const CURRENT_DATA_VERSION = 3

// 管理者モード
export type AdminMode = 'production' | 'test'

// コレクションアイテム（永続化用）
export interface SavedCollectionItem {
  stickerId: string
  quantity: number
  totalAcquired: number
  firstAcquiredAt: string | null
  upgradeRank?: number  // アップグレードランク: 0=ノーマル, 1=シルバー, 2=ゴールド, 3=プリズム
}

// 保存するユーザーデータの型
export interface SavedUserData {
  version: number

  // コレクション（シールごとの所持数）
  collection: SavedCollectionItem[]

  // 課金・通貨
  monetization: UserMonetization

  // シール帳
  placedStickers: PlacedSticker[]
  placedDecoItems: PlacedDecoItem[]
  pages: BookPage[]
  coverDesignId: string
  themeId: string

  // プロフィール
  profile: {
    name: string
    bio: string
    totalExp: number
    expDailyCounts: DailyActionCounts
  }

  // 設定
  settings: {
    soundEnabled: boolean
    notificationsEnabled: boolean
    language: string
  }

  // 統計
  stats: {
    totalGachaPulls: number
    totalTrades: number
    postsCount: number
  }

  // 最終保存日時
  lastSavedAt: string
}

// 初期データ（新規ユーザー用 - シール0枚からスタート）
export function createInitialUserData(): SavedUserData {
  return {
    version: CURRENT_DATA_VERSION,
    collection: [], // 空のコレクション（シール0枚）
    monetization: DEFAULT_USER_MONETIZATION,
    placedStickers: [],
    placedDecoItems: [],
    pages: [
      { id: 'cover', type: 'cover', side: 'right' },
      { id: 'page-1', type: 'page', side: 'left' },
      { id: 'page-2', type: 'page', side: 'right' },
      { id: 'page-3', type: 'page', side: 'left' },
      { id: 'page-4', type: 'page', side: 'right' },
      { id: 'back', type: 'back-cover', side: 'left' },
    ],
    coverDesignId: 'cover-default',
    themeId: 'theme-basic-white',
    profile: {
      name: 'ゲスト',
      bio: '',
      totalExp: 0, // レベル1からスタート
      expDailyCounts: createInitialDailyCounts(),
    },
    settings: {
      soundEnabled: true,
      notificationsEnabled: true,
      language: 'ja',
    },
    stats: {
      totalGachaPulls: 0,
      totalTrades: 0,
      postsCount: 0,
    },
    lastSavedAt: new Date().toISOString(),
  }
}

// テストモード用データ（全シール1枚ずつ所持、通貨大量）
export function createTestModeData(allStickerIds: string[]): SavedUserData {
  const testCollection: SavedCollectionItem[] = allStickerIds.map(stickerId => ({
    stickerId,
    quantity: 1,
    totalAcquired: 1,
    firstAcquiredAt: new Date().toISOString(),
  }))

  return {
    version: CURRENT_DATA_VERSION,
    collection: testCollection,
    monetization: {
      tickets: 9999,
      gems: 9999,
      stars: 99999,
      subscription: 'deluxe',
      subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastDailyReset: new Date().toISOString().split('T')[0],
      dailyTicketsCollected: false,
      dailyStarsCollected: false,
      completedMissions: [],
      adsWatchedToday: 0,
      totalStarsPurchased: 0,
      totalTicketsUsed: 0,
      isFirstPurchase: true,
      pityCount: {},
    },
    placedStickers: [],
    placedDecoItems: [],
    pages: [
      { id: 'cover', type: 'cover', side: 'right' },
      { id: 'page-1', type: 'page', side: 'left' },
      { id: 'page-2', type: 'page', side: 'right' },
      { id: 'page-3', type: 'page', side: 'left' },
      { id: 'page-4', type: 'page', side: 'right' },
      { id: 'back', type: 'back-cover', side: 'left' },
    ],
    coverDesignId: 'cover-default',
    themeId: 'theme-basic-white',
    profile: {
      name: '管理者テスト',
      bio: 'テストモードで実行中',
      totalExp: 10000, // 高レベル
      expDailyCounts: createInitialDailyCounts(),
    },
    settings: {
      soundEnabled: true,
      notificationsEnabled: true,
      language: 'ja',
    },
    stats: {
      totalGachaPulls: 100,
      totalTrades: 50,
      postsCount: 10,
    },
    lastSavedAt: new Date().toISOString(),
  }
}

// ローカルストレージに保存
export function saveUserData(data: SavedUserData): boolean {
  try {
    const dataToSave = {
      ...data,
      lastSavedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(dataToSave))
    return true
  } catch (error) {
    console.error('[Persistence] Failed to save user data:', error)
    return false
  }
}

// ローカルストレージから読み込み
export function loadUserData(): SavedUserData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    if (!stored) return null

    const data = JSON.parse(stored) as SavedUserData

    // バージョンチェック（将来のマイグレーション用）
    if (data.version !== CURRENT_DATA_VERSION) {
      console.log('[Persistence] Data version mismatch, migrating...')
      return migrateData(data)
    }

    return data
  } catch (error) {
    console.error('[Persistence] Failed to load user data:', error)
    return null
  }
}

// データマイグレーション（将来用）
function migrateData(oldData: SavedUserData): SavedUserData {
  // 現在はバージョン1のみなのでそのまま返す
  const normalizedThemeId = oldData.themeId === 'theme-basic-pink'
    ? 'theme-basic-white'
    : oldData.themeId

  return {
    ...oldData,
    themeId: normalizedThemeId || 'theme-basic-white',
    profile: {
      ...oldData.profile,
      expDailyCounts: oldData.profile.expDailyCounts || createInitialDailyCounts(),
    },
    version: CURRENT_DATA_VERSION,
  }
}

// 管理者モードを保存
export function saveAdminMode(mode: AdminMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ADMIN_MODE, mode)
  } catch (error) {
    console.error('[Persistence] Failed to save admin mode:', error)
  }
}

// 管理者モードを読み込み
export function loadAdminMode(): AdminMode {
  try {
    const mode = localStorage.getItem(STORAGE_KEYS.ADMIN_MODE)
    return (mode === 'test' ? 'test' : 'production') as AdminMode
  } catch {
    return 'production'
  }
}

// 全データをリセット
export function resetAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    localStorage.removeItem(STORAGE_KEYS.ADMIN_MODE)
  } catch (error) {
    console.error('[Persistence] Failed to reset data:', error)
  }
}

// デバッグ用: データをエクスポート
export function exportData(): string | null {
  try {
    const data = loadUserData()
    if (!data) return null
    return JSON.stringify(data, null, 2)
  } catch {
    return null
  }
}

// デバッグ用: データをインポート
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as SavedUserData
    return saveUserData(data)
  } catch (error) {
    console.error('[Persistence] Failed to import data:', error)
    return false
  }
}

// コレクションにシールを追加（ガチャ結果用）
export function addStickersToCollection(
  currentCollection: SavedCollectionItem[],
  newStickerIds: string[]
): {
  collection: SavedCollectionItem[]
  newStickers: string[]  // 初めて入手したシールID
  duplicateStickers: string[] // 既に持っていたシールID
} {
  // コレクションが複合ID形式（stickerId:rank）かどうかを判定
  const hasCompositeIds = currentCollection.some(item => item.stickerId.includes(':') || typeof item.upgradeRank === 'number')

  const parseCompositeId = (compositeId: string): { baseId: string; rank: number } => {
    const lastColonIndex = compositeId.lastIndexOf(':')
    if (lastColonIndex === -1) {
      return { baseId: compositeId, rank: 0 }
    }
    const potentialRank = compositeId.substring(lastColonIndex + 1)
    const parsedRank = parseInt(potentialRank, 10)
    if (!isNaN(parsedRank) && potentialRank === String(parsedRank)) {
      return { baseId: compositeId.substring(0, lastColonIndex), rank: parsedRank }
    }
    return { baseId: compositeId, rank: 0 }
  }

  const normalizeStickerId = (stickerId: string): { normalizedId: string; rank: number } => {
    const { baseId, rank } = parseCompositeId(stickerId)
    if (hasCompositeIds) {
      return { normalizedId: `${baseId}:${rank}`, rank }
    }
    return { normalizedId: baseId, rank }
  }

  const collectionMap = new Map<string, SavedCollectionItem>()
  currentCollection.forEach(item => {
    const { normalizedId, rank } = normalizeStickerId(item.stickerId)
    const existing = collectionMap.get(normalizedId)
    if (existing) {
      existing.quantity += item.quantity || 0
      existing.totalAcquired += item.totalAcquired || 0
      if (!existing.firstAcquiredAt && item.firstAcquiredAt) {
        existing.firstAcquiredAt = item.firstAcquiredAt
      }
      return
    }
    collectionMap.set(normalizedId, {
      ...item,
      stickerId: normalizedId,
      upgradeRank: item.upgradeRank ?? rank,
      firstAcquiredAt: item.firstAcquiredAt ?? null,
      quantity: item.quantity ?? 0,
      totalAcquired: item.totalAcquired ?? 0,
    })
  })

  const newStickers: string[] = []
  const duplicateStickers: string[] = []
  const now = new Date().toISOString()

  newStickerIds.forEach(stickerId => {
    const { normalizedId, rank } = normalizeStickerId(stickerId)
    const existing = collectionMap.get(normalizedId)
    if (existing) {
      // 既存シール: 枚数を増やす
      existing.quantity += 1
      existing.totalAcquired += 1
      duplicateStickers.push(normalizedId)
    } else {
      // 新規シール
      collectionMap.set(normalizedId, {
        stickerId: normalizedId,
        quantity: 1,
        totalAcquired: 1,
        firstAcquiredAt: now,
        upgradeRank: hasCompositeIds ? rank : undefined,
      })
      newStickers.push(normalizedId)
    }
  })

  return {
    collection: Array.from(collectionMap.values()),
    newStickers,
    duplicateStickers,
  }
}

// シール配置時の所持チェック
export function canPlaceSticker(
  collection: SavedCollectionItem[],
  stickerId: string,
  currentPlacements: PlacedSticker[]
): { canPlace: boolean; remainingCount: number } {
  const parseCompositeId = (compositeId: string): { baseId: string; rank: number } => {
    const lastColonIndex = compositeId.lastIndexOf(':')
    if (lastColonIndex === -1) {
      return { baseId: compositeId, rank: 0 }
    }
    const potentialRank = compositeId.substring(lastColonIndex + 1)
    const parsedRank = parseInt(potentialRank, 10)
    if (!isNaN(parsedRank) && potentialRank === String(parsedRank)) {
      return { baseId: compositeId.substring(0, lastColonIndex), rank: parsedRank }
    }
    return { baseId: compositeId, rank: 0 }
  }

  const { baseId } = parseCompositeId(stickerId)
  const fallbackCompositeId = `${baseId}:0`

  const item =
    collection.find(c => c.stickerId === stickerId) ||
    collection.find(c => c.stickerId === baseId) ||
    collection.find(c => c.stickerId === fallbackCompositeId)
  if (!item) {
    return { canPlace: false, remainingCount: 0 }
  }

  // 既に配置されている数をカウント
  const usesComposite = item.stickerId.includes(':')
  const placedCount = usesComposite
    ? currentPlacements.filter(p => p.stickerId === item.stickerId).length
    : currentPlacements.filter(p => parseCompositeId(p.stickerId).baseId === baseId).length
  const remainingCount = item.quantity - placedCount

  return {
    canPlace: remainingCount > 0,
    remainingCount,
  }
}

// ============================================
// テストユーザーシステム
// ============================================

// ユーザーID別のストレージキーを生成
function getUserDataKey(userId: string): string {
  return `${STORAGE_KEYS.USER_DATA}_${userId}`
}

// 現在のテストユーザーIDを取得
export function getCurrentTestUserId(): string {
  try {
    const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_TEST_USER)
    // デフォルトはテストユーザーA
    return userId || TEST_USERS[0].id
  } catch {
    return TEST_USERS[0].id
  }
}

// 現在のテストユーザーを取得
export function getCurrentTestUser(): TestUser {
  const userId = getCurrentTestUserId()
  return TEST_USERS.find(u => u.id === userId) || TEST_USERS[0]
}

// テストユーザーを切り替え
export function switchTestUser(userId: string): void {
  try {
    const user = TEST_USERS.find(u => u.id === userId)
    if (!user) {
      console.error('[Persistence] Invalid test user ID:', userId)
      return
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_TEST_USER, userId)
    console.log(`[Persistence] Switched to test user: ${user.name}`)
  } catch (error) {
    console.error('[Persistence] Failed to switch test user:', error)
  }
}

// ユーザー別にデータを保存
export function saveUserDataForUser(userId: string, data: SavedUserData): boolean {
  try {
    const dataToSave = {
      ...data,
      lastSavedAt: new Date().toISOString(),
    }
    localStorage.setItem(getUserDataKey(userId), JSON.stringify(dataToSave))
    return true
  } catch (error) {
    console.error('[Persistence] Failed to save user data for', userId, error)
    return false
  }
}

// ユーザー別にデータを読み込み
export function loadUserDataForUser(userId: string): SavedUserData | null {
  try {
    const stored = localStorage.getItem(getUserDataKey(userId))
    if (!stored) return null

    const data = JSON.parse(stored) as SavedUserData

    // バージョンチェック
    if (data.version !== CURRENT_DATA_VERSION) {
      console.log('[Persistence] Data version mismatch, migrating...')
      return migrateData(data)
    }

    return data
  } catch (error) {
    console.error('[Persistence] Failed to load user data for', userId, error)
    return null
  }
}

// 現在のテストユーザーのデータを保存
export function saveCurrentUserData(data: SavedUserData): boolean {
  const userId = getCurrentTestUserId()
  return saveUserDataForUser(userId, data)
}

// 現在のテストユーザーのデータを読み込み
export function loadCurrentUserData(): SavedUserData | null {
  const userId = getCurrentTestUserId()
  return loadUserDataForUser(userId)
}

// テストユーザーの初期データを作成（ユーザーごとに名前を設定）
export function createInitialUserDataForTestUser(userId: string): SavedUserData {
  const user = TEST_USERS.find(u => u.id === userId)
  const baseName = user?.name || 'シールだいすき'

  return {
    ...createInitialUserData(),
    profile: {
      name: baseName,
      bio: '',
      totalExp: 0,
      expDailyCounts: createInitialDailyCounts(),
    },
  }
}

// 特定のテストユーザーのデータをリセット
export function resetTestUserData(userId: string): void {
  try {
    localStorage.removeItem(getUserDataKey(userId))
    console.log(`[Persistence] Reset data for user: ${userId}`)
  } catch (error) {
    console.error('[Persistence] Failed to reset user data:', error)
  }
}

// 全テストユーザーのデータをリセット
export function resetAllTestUsersData(): void {
  try {
    TEST_USERS.forEach(user => {
      localStorage.removeItem(getUserDataKey(user.id))
    })
    localStorage.removeItem(STORAGE_KEYS.CURRENT_TEST_USER)
    console.log('[Persistence] Reset all test users data')
  } catch (error) {
    console.error('[Persistence] Failed to reset all test users:', error)
  }
}
