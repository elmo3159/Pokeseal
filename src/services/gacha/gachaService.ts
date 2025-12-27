// ガチャサービス - シールガチャの排出ロジック
import { getSupabase } from '@/services/supabase'
import { stickerService, type UserStickerWithDetails } from '@/services/stickers'
import { dailyMissionService } from '@/services/dailyMissions'
import type { Sticker } from '@/types/database'

export type GachaType = 'normal' | 'premium' | 'event' | 'collab'

export interface GachaResult {
  sticker: Sticker
  userSticker: UserStickerWithDetails
  isNew: boolean // 初ゲットかどうか
  rankUp: boolean // ランクアップしたかどうか
  previousRank: number
  newRank: number
}

export interface GachaPool {
  type: GachaType
  stickers: Sticker[]
  totalWeight: number
}

export const gachaService = {
  // ガチャプール取得
  async getGachaPool(type: GachaType): Promise<GachaPool | null> {
    const supabase = getSupabase()

    let query = supabase
      .from('stickers')
      .select('*')
      .gt('gacha_weight', 0)

    // ガチャタイプによるフィルタ
    if (type === 'normal') {
      query = query.eq('is_limited', false)
    } else if (type === 'premium') {
      // プレミアムは全シール対象だがレア度高めを優遇（重みはマスターデータ側で調整）
    } else if (type === 'event' || type === 'collab') {
      query = query.eq('is_limited', true)
    }

    const { data, error } = await query

    if (error || !data) {
      console.error('Get gacha pool error:', error)
      return null
    }

    const totalWeight = data.reduce((sum: number, s: Sticker) => sum + (s.gacha_weight || 0), 0)

    return {
      type,
      stickers: data,
      totalWeight
    }
  },

  // ガチャを引く（単発）
  async pull(userId: string, type: GachaType): Promise<GachaResult | null> {
    const pool = await this.getGachaPool(type)
    if (!pool || pool.stickers.length === 0) {
      console.error('Empty gacha pool')
      return null
    }

    // 重み付き抽選
    const selectedSticker = weightedRandom(pool.stickers, pool.totalWeight)
    if (!selectedSticker) {
      console.error('Failed to select sticker')
      return null
    }

    // 既存のシール情報を取得（初ゲット判定用）
    const supabase = getSupabase()
    const { data: existing } = await supabase
      .from('user_stickers')
      .select('rank')
      .eq('user_id', userId)
      .eq('sticker_id', selectedSticker.id)
      .single()

    const isNew = !existing
    const previousRank = existing?.rank || 0

    // シールを付与
    const userSticker = await stickerService.addStickerToUser(userId, selectedSticker.id)
    if (!userSticker) {
      console.error('Failed to add sticker to user')
      return null
    }

    // ガチャ履歴を記録
    await supabase.from('gacha_history').insert({
      user_id: userId,
      gacha_type: type,
      sticker_id: selectedSticker.id
    })

    // デイリーミッション進捗を更新
    await dailyMissionService.updateProgress(userId, 'gacha', 1)

    return {
      sticker: selectedSticker,
      userSticker,
      isNew,
      rankUp: (userSticker.rank || 0) > previousRank,
      previousRank,
      newRank: userSticker.rank || 0
    }
  },

  // ガチャを引く（10連）
  async pullMultiple(userId: string, type: GachaType, count: number = 10): Promise<GachaResult[]> {
    const results: GachaResult[] = []

    for (let i = 0; i < count; i++) {
      const result = await this.pull(userId, type)
      if (result) {
        results.push(result)
      }
    }

    return results
  },

  // チュートリアル用ガチャ（必ず良いシールが出る）
  async pullTutorial(userId: string): Promise<GachaResult | null> {
    const supabase = getSupabase()

    // レア度3以上のシールを優先的に選ぶ
    const { data: stickers } = await supabase
      .from('stickers')
      .select('*')
      .gte('rarity', 3)
      .eq('is_limited', false)
      .limit(10)

    if (!stickers || stickers.length === 0) {
      // フォールバック: 通常ガチャ
      return this.pull(userId, 'normal')
    }

    // ランダムに1つ選択
    const selectedSticker = stickers[Math.floor(Math.random() * stickers.length)]

    // シールを付与
    const userSticker = await stickerService.addStickerToUser(userId, selectedSticker.id)
    if (!userSticker) {
      return null
    }

    // デイリーミッション進捗を更新
    await dailyMissionService.updateProgress(userId, 'gacha', 1)

    return {
      sticker: selectedSticker,
      userSticker,
      isNew: true,
      rankUp: false,
      previousRank: 0,
      newRank: 1
    }
  },

  // ガチャ履歴取得
  async getHistory(userId: string, limit: number = 50): Promise<{
    id: string
    gacha_type: GachaType
    sticker: Sticker
    created_at: string
  }[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('gacha_history')
      .select(`
        id,
        gacha_type,
        sticker:stickers(*),
        created_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Get gacha history error:', error)
      return []
    }

    return (data || []).map((item: { id: string; gacha_type: string; sticker: unknown; created_at: string | null }) => ({
      id: item.id,
      gacha_type: item.gacha_type as GachaType,
      sticker: item.sticker as Sticker,
      created_at: item.created_at || new Date().toISOString()
    }))
  },

  // 排出確率表示用
  async getRates(type: GachaType): Promise<{
    rarity: number
    rate: number
    count: number
  }[]> {
    const pool = await this.getGachaPool(type)
    if (!pool) return []

    const rarityGroups = new Map<number, { weight: number; count: number }>()

    for (const sticker of pool.stickers) {
      const existing = rarityGroups.get(sticker.rarity) || { weight: 0, count: 0 }
      rarityGroups.set(sticker.rarity, {
        weight: existing.weight + (sticker.gacha_weight || 0),
        count: existing.count + 1
      })
    }

    return Array.from(rarityGroups.entries())
      .map(([rarity, data]) => ({
        rarity,
        rate: Math.round((data.weight / pool.totalWeight) * 10000) / 100, // パーセント表示
        count: data.count
      }))
      .sort((a, b) => b.rarity - a.rarity)
  }
}

// 重み付きランダム選択
function weightedRandom(stickers: Sticker[], totalWeight: number): Sticker | null {
  if (stickers.length === 0) return null

  let random = Math.random() * totalWeight

  for (const sticker of stickers) {
    random -= (sticker.gacha_weight || 0)
    if (random <= 0) {
      return sticker
    }
  }

  // フォールバック
  return stickers[stickers.length - 1]
}

export default gachaService
