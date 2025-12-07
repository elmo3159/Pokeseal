'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  UserStarPoints,
  initialUserStarPoints,
  calculateStickerPoints,
  createTransaction,
  ShopItem,
  INITIAL_SHOP_ITEMS,
} from '@/domain/starPoints'

// シールの最低限の情報
interface StickerForConversion {
  id: string
  name: string
  rarity: number
  type: 'normal' | 'puffy' | 'sparkle'
  rank: number
  quantity: number
}

// フックの戻り値の型
interface UseStarPointsReturn {
  // 状態
  points: UserStarPoints
  shopItems: ShopItem[]
  purchasedItems: string[]

  // アクション
  convertStickerToPoints: (sticker: StickerForConversion, count?: number) => ConversionResult
  purchaseItem: (itemId: string) => PurchaseResult
  addBonusPoints: (amount: number, description: string) => void

  // ユーティリティ
  canPurchase: (itemId: string) => boolean
  getPointsForSticker: (sticker: StickerForConversion) => number
  getConversionPreview: (sticker: StickerForConversion, count: number) => number
}

interface ConversionResult {
  success: boolean
  pointsEarned: number
  message: string
}

interface PurchaseResult {
  success: boolean
  item?: ShopItem
  message: string
}

// ローカルストレージのキー
const STORAGE_KEY = 'pokeseal_star_points'
const PURCHASED_KEY = 'pokeseal_purchased_items'

// ローカルストレージから読み込み
function loadFromStorage(): { points: UserStarPoints; purchased: string[] } {
  if (typeof window === 'undefined') {
    return { points: initialUserStarPoints, purchased: [] }
  }

  try {
    const savedPoints = localStorage.getItem(STORAGE_KEY)
    const savedPurchased = localStorage.getItem(PURCHASED_KEY)

    return {
      points: savedPoints ? JSON.parse(savedPoints) : initialUserStarPoints,
      purchased: savedPurchased ? JSON.parse(savedPurchased) : [],
    }
  } catch {
    return { points: initialUserStarPoints, purchased: [] }
  }
}

// ローカルストレージに保存
function saveToStorage(points: UserStarPoints, purchased: string[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(points))
    localStorage.setItem(PURCHASED_KEY, JSON.stringify(purchased))
  } catch {
    // ストレージエラーは無視
  }
}

export function useStarPoints(): UseStarPointsReturn {
  // 初期状態をローカルストレージから読み込み
  const [initialized, setInitialized] = useState(false)
  const [points, setPoints] = useState<UserStarPoints>(initialUserStarPoints)
  const [purchasedItems, setPurchasedItems] = useState<string[]>([])

  // 初回マウント時にストレージから読み込み
  if (!initialized && typeof window !== 'undefined') {
    const saved = loadFromStorage()
    setPoints(saved.points)
    setPurchasedItems(saved.purchased)
    setInitialized(true)
  }

  // ショップアイテム（購入済みを除外）
  const shopItems = useMemo(() => {
    return INITIAL_SHOP_ITEMS.filter(item => {
      // テーマ・称号・チャームは一度購入したら非表示
      if (['theme', 'title', 'charm'].includes(item.type)) {
        return !purchasedItems.includes(item.id)
      }
      // ガチャチケットは何度でも購入可能
      return true
    })
  }, [purchasedItems])

  // シールをポイントに変換した際のポイント計算
  const getPointsForSticker = useCallback((sticker: StickerForConversion): number => {
    return calculateStickerPoints(sticker.rarity, sticker.type, sticker.rank)
  }, [])

  // 変換プレビュー
  const getConversionPreview = useCallback((sticker: StickerForConversion, count: number): number => {
    const pointsPerSticker = getPointsForSticker(sticker)
    return pointsPerSticker * count
  }, [getPointsForSticker])

  // シールをポイントに変換
  const convertStickerToPoints = useCallback((
    sticker: StickerForConversion,
    count: number = 1
  ): ConversionResult => {
    // バリデーション
    if (count < 1) {
      return { success: false, pointsEarned: 0, message: '変換する数が不正です' }
    }
    if (count > sticker.quantity) {
      return { success: false, pointsEarned: 0, message: 'シールの数が足りません' }
    }

    // ポイント計算
    const pointsPerSticker = getPointsForSticker(sticker)
    const totalPoints = pointsPerSticker * count

    // トランザクション作成
    const transaction = createTransaction(
      'convert',
      totalPoints,
      `${sticker.name} ×${count} → ${totalPoints} SP`,
      { stickerId: sticker.id, stickerName: sticker.name }
    )

    // 状態更新
    const newPoints: UserStarPoints = {
      balance: points.balance + totalPoints,
      totalEarned: points.totalEarned + totalPoints,
      totalSpent: points.totalSpent,
      transactions: [transaction, ...points.transactions].slice(0, 100), // 最新100件のみ保持
    }

    setPoints(newPoints)
    saveToStorage(newPoints, purchasedItems)

    return {
      success: true,
      pointsEarned: totalPoints,
      message: `${sticker.name}を${count}まいポイントにかえたよ！ +${totalPoints} SP`,
    }
  }, [points, purchasedItems, getPointsForSticker])

  // アイテム購入可否チェック
  const canPurchase = useCallback((itemId: string): boolean => {
    const item = INITIAL_SHOP_ITEMS.find(i => i.id === itemId)
    if (!item) return false

    // ポイント不足
    if (points.balance < item.cost) return false

    // 一度しか買えないアイテムの場合
    if (['theme', 'title', 'charm'].includes(item.type)) {
      if (purchasedItems.includes(item.id)) return false
    }

    return true
  }, [points.balance, purchasedItems])

  // アイテム購入
  const purchaseItem = useCallback((itemId: string): PurchaseResult => {
    const item = INITIAL_SHOP_ITEMS.find(i => i.id === itemId)

    if (!item) {
      return { success: false, message: 'アイテムが見つかりません' }
    }

    if (points.balance < item.cost) {
      return { success: false, message: 'ポイントが足りないよ...' }
    }

    // 一度しか買えないアイテムの場合
    if (['theme', 'title', 'charm'].includes(item.type) && purchasedItems.includes(item.id)) {
      return { success: false, message: 'このアイテムはもう持っているよ！' }
    }

    // トランザクション作成
    const transaction = createTransaction(
      'purchase',
      -item.cost,
      `${item.name}を購入`,
      { shopItemId: item.id }
    )

    // 状態更新
    const newPoints: UserStarPoints = {
      balance: points.balance - item.cost,
      totalEarned: points.totalEarned,
      totalSpent: points.totalSpent + item.cost,
      transactions: [transaction, ...points.transactions].slice(0, 100),
    }

    // 購入済みリスト更新（テーマ・称号・チャームの場合）
    let newPurchased = purchasedItems
    if (['theme', 'title', 'charm'].includes(item.type)) {
      newPurchased = [...purchasedItems, item.id]
      setPurchasedItems(newPurchased)
    }

    setPoints(newPoints)
    saveToStorage(newPoints, newPurchased)

    return {
      success: true,
      item,
      message: `${item.name}をゲットしたよ！`,
    }
  }, [points, purchasedItems])

  // ボーナスポイント追加
  const addBonusPoints = useCallback((amount: number, description: string) => {
    if (amount <= 0) return

    const transaction = createTransaction('bonus', amount, description)

    const newPoints: UserStarPoints = {
      balance: points.balance + amount,
      totalEarned: points.totalEarned + amount,
      totalSpent: points.totalSpent,
      transactions: [transaction, ...points.transactions].slice(0, 100),
    }

    setPoints(newPoints)
    saveToStorage(newPoints, purchasedItems)
  }, [points, purchasedItems])

  return {
    points,
    shopItems,
    purchasedItems,
    convertStickerToPoints,
    purchaseItem,
    addBonusPoints,
    canPurchase,
    getPointsForSticker,
    getConversionPreview,
  }
}

export default useStarPoints
