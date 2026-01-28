// シールサービス - シール関連のデータ操作
import { getSupabase } from '@/services/supabase'
import type { Sticker, UserSticker } from '@/types/database'
// Note: シール図鑑はuser_stickersテーブルで管理するため、seriesRewardServiceは不要

// ユーザーシールとマスターデータを結合した型
export interface UserStickerWithDetails extends UserSticker {
  sticker: Sticker
}

// ランクアップ閾値
const RANK_THRESHOLDS = [1, 3, 6, 10, 15] // R1, R2, R3, R4, MAX

export const stickerService = {
  // 全シール（マスターデータ）取得
  async getAllStickers(): Promise<Sticker[]> {
    const supabase = getSupabase()

    // Supabaseのデフォルト制限は1000件なので、ページネーションで全件取得
    const allStickers: Sticker[] = []
    const pageSize = 1000
    let offset = 0
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase
        .from('stickers')
        .select('*')
        .range(offset, offset + pageSize - 1)
        .order('id')

      if (error) {
        console.error('Get all stickers error:', error)
        break
      }

      if (data && data.length > 0) {
        allStickers.push(...data)
        offset += data.length
        hasMore = data.length === pageSize
      } else {
        hasMore = false
      }
    }

    if (allStickers.length === 0) {
      return []
    }

    const data = allStickers

    // 自然順ソート（キャラクター名 + 番号順）
    const sortedData = [...(data || [])].sort((a, b) => {
      // 名前から番号を抽出（「キャラ名 #1」または「キャラ名 1」形式に対応）
      const extractNumber = (name: string): { base: string; num: number } => {
        // #付きパターン: 「いちごにゃん #1」
        const hashMatch = name.match(/^(.+?)\s*#(\d+)$/)
        if (hashMatch) {
          return { base: hashMatch[1].trim(), num: parseInt(hashMatch[2], 10) }
        }
        // スペース+数字パターン: 「ウールン 1」
        const spaceMatch = name.match(/^(.+?)\s+(\d+)$/)
        if (spaceMatch) {
          return { base: spaceMatch[1].trim(), num: parseInt(spaceMatch[2], 10) }
        }
        return { base: name, num: 0 }
      }
      const aInfo = extractNumber(a.name)
      const bInfo = extractNumber(b.name)
      // まずキャラクター名でソート
      const baseCompare = aInfo.base.localeCompare(bInfo.base, 'ja')
      if (baseCompare !== 0) return baseCompare
      // 同じキャラクターなら番号でソート
      return aInfo.num - bInfo.num
    })

    return sortedData
  },

  // シリーズ一覧取得
  async getSeries(): Promise<string[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('stickers')
      .select('series')
      .not('series', 'is', null)

    if (error) {
      console.error('Get series error:', error)
      return []
    }

    const uniqueSeries = [...new Set(data.map((d: { series: string | null }) => d.series).filter(Boolean))] as string[]
    return uniqueSeries.sort()
  },

  // ユーザーの所持シール取得
  async getUserStickers(userId: string): Promise<UserStickerWithDetails[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('user_stickers')
      .select(`
        *,
        sticker:stickers(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get user stickers error:', error)
      return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data || []).map((item: any) => ({
      ...item,
      sticker: item.sticker as Sticker
    })) as UserStickerWithDetails[]
  },

  // シールをユーザーに付与（ガチャ結果など）
  // 新しく取得したシールは常にノーマルランク(upgrade_rank=0)として追加
  async addStickerToUser(userId: string, stickerId: string): Promise<UserStickerWithDetails | null> {
    const supabase = getSupabase()

    // 既存のノーマルランク(upgrade_rank=0)のシールを確認
    // シルバー以上のランクのシールには追加しない
    const { data: existing } = await supabase
      .from('user_stickers')
      .select('*')
      .eq('user_id', userId)
      .eq('sticker_id', stickerId)
      .eq('upgrade_rank', 0)  // ノーマルランクのみ
      .single()

    if (existing) {
      // 既存ノーマルシールの数量と累計を増加
      const newTotalAcquired = (existing.total_acquired || 0) + 1
      const newRank = calculateRank(newTotalAcquired)

      const { data: updated, error } = await supabase
        .from('user_stickers')
        .update({
          quantity: (existing.quantity || 0) + 1,
          total_acquired: newTotalAcquired,
          rank: newRank,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select(`
          *,
          sticker:stickers(*)
        `)
        .single()

      if (error) {
        console.error('Update user sticker error:', error)
        return null
      }

      return {
        ...updated,
        sticker: updated.sticker as unknown as Sticker
      }
    } else {
      // 新規ノーマルシール追加（upgrade_rank=0）
      const { data: created, error } = await supabase
        .from('user_stickers')
        .insert({
          user_id: userId,
          sticker_id: stickerId,
          quantity: 1,
          total_acquired: 1,
          rank: 1,
          upgrade_rank: 0,  // 明示的にノーマルランクを指定
          first_acquired_at: new Date().toISOString()
        })
        .select(`
          *,
          sticker:stickers(*)
        `)
        .single()

      if (error) {
        console.error('Create user sticker error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          full: JSON.stringify(error, null, 2)
        })
        return null
      }

      // Note: 図鑑記録はuser_stickersテーブルで自動的に管理される
      // characterRewardServiceはuser_stickersを参照してキャラクター別進捗を計算

      return {
        ...created,
        sticker: created.sticker as unknown as Sticker
      }
    }
  },

  // シールをスターポイントに変換
  async convertToStarPoints(userId: string, userStickerId: string, quantity: number = 1): Promise<number> {
    const supabase = getSupabase()

    // シール情報取得
    const { data: userSticker } = await supabase
      .from('user_stickers')
      .select(`
        *,
        sticker:stickers(*)
      `)
      .eq('id', userStickerId)
      .eq('user_id', userId)
      .single()

    if (!userSticker || (userSticker.quantity || 0) < quantity) {
      return 0
    }

    const sticker = userSticker.sticker as unknown as Sticker
    const pointsPerSticker = Math.ceil((sticker.base_rate || 0) * sticker.rarity)
    const totalPoints = pointsPerSticker * quantity

    // トランザクション的に処理
    // 1. シール数量を減らす
    const newQuantity = (userSticker.quantity || 0) - quantity
    if (newQuantity <= 0) {
      await supabase
        .from('user_stickers')
        .delete()
        .eq('id', userStickerId)
    } else {
      await supabase
        .from('user_stickers')
        .update({
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', userStickerId)
    }

    // 2. スターポイントを加算
    const { data: profile } = await supabase
      .from('profiles')
      .select('star_points')
      .eq('id', userId)
      .single()

    if (profile) {
      await supabase
        .from('profiles')
        .update({
          star_points: (profile.star_points || 0) + totalPoints,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
    }

    return totalPoints
  },

  // コレクション統計取得
  async getCollectionStats(userId: string): Promise<{
    totalStickers: number
    ownedStickers: number
    completionRate: number
    maxRankCount: number
  }> {
    const supabase = getSupabase()

    // 全シール数
    const { count: totalStickers } = await supabase
      .from('stickers')
      .select('*', { count: 'exact', head: true })

    // 所持シール数
    const { data: userStickers } = await supabase
      .from('user_stickers')
      .select('rank')
      .eq('user_id', userId)

    const ownedStickers = userStickers?.length || 0
    const maxRankCount = userStickers?.filter((s: { rank: number | null }) => (s.rank || 0) >= 5).length || 0
    const completionRate = totalStickers ? Math.round((ownedStickers / totalStickers) * 100) : 0

    return {
      totalStickers: totalStickers || 0,
      ownedStickers,
      completionRate,
      maxRankCount
    }
  }
}

// ランク計算
function calculateRank(totalAcquired: number): number {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalAcquired >= RANK_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

export default stickerService
