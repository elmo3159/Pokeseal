// キャラクター報酬サービス - キャラクター別コレクション報酬の管理
import { getSupabase } from '@/services/supabase/client'
import {
  CHARACTER_LIST,
  CHARACTER_REWARD_TYPES,
  CHARACTER_TIER_REQUIREMENTS,
  CHARACTER_REWARD_TIERS,
  getAchievedTiers,
  getProgressToNextTier,
  getCharacterId,
  type CharacterName,
  type CharacterRewardTier,
  type CharacterRewardType,
} from '@/constants/characterRewards'

// キャラクター進捗情報
export interface CharacterProgress {
  characterName: CharacterName
  totalCount: number       // キャラクターの全シール数
  collectedCount: number   // 図鑑に登録されているシール数（永続）
  completionRate: number   // 図鑑ベースの達成率
}

// 報酬の受取状態
export interface CharacterRewardWithStatus {
  id: string
  characterName: CharacterName
  tier: CharacterRewardTier
  rewardType: CharacterRewardType
  requiredCount: number
  canClaim: boolean        // 受取可能か
  claimed: boolean         // 受取済みか
  currentProgress: number  // 現在の進捗
}

// キャラクターごとの報酬状況
export interface CharacterRewardStatus {
  characterName: CharacterName
  progress: CharacterProgress
  rewards: CharacterRewardWithStatus[]
}

// 解放済みのキャラアイコン（シール画像使用可能）
export interface UnlockedCharacterIcon {
  characterName: CharacterName
  stickerIds: string[]     // このキャラの所持シールID一覧
  stickerImages: { id: string; imageUrl: string }[] // 画像URL付き
}

// 解放済みフレーム
export interface UnlockedFrame {
  characterName: CharacterName
  frameId: string
  frameImageUrl: string      // フレーム画像URL
  unlockedAt: string         // 解放日時
}

const CHARACTER_ICON_TTL_MS = 1000 * 60 * 10
let characterIconCache: Record<string, string> | null = null
let characterIconFetchedAt = 0
const CHARACTER_STATUS_TTL_MS = 1000 * 60 * 10
const characterStatusCacheByUser = new Map<string, { data: CharacterRewardStatus[]; fetchedAt: number }>()

export const characterRewardService = {
  invalidateUser(userId: string) {
    characterStatusCacheByUser.delete(userId)
  },
  getCachedStatus(userId: string): CharacterRewardStatus[] | null {
    const cached = characterStatusCacheByUser.get(userId)
    if (!cached) return null
    if (Date.now() - cached.fetchedAt > CHARACTER_STATUS_TTL_MS) return null
    return cached.data
  },
  // キャラクターごとの代表シール画像を取得（キャラ名→画像URL）
  async getCharacterIconMap(): Promise<Record<string, string>> {
    const now = Date.now()
    if (characterIconCache && now - characterIconFetchedAt < CHARACTER_ICON_TTL_MS) {
      return characterIconCache
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('stickers')
      .select('character, image_url')
      .not('character', 'is', null)
      .not('image_url', 'is', null) as { data: { character: string | null; image_url: string | null }[] | null; error: unknown }

    if (error) {
      console.error('[CharacterReward] Failed to load character icon map:', error)
      return characterIconCache || {}
    }

    const map: Record<string, string> = {}
    for (const row of data || []) {
      const character = row.character
      const imageUrl = row.image_url
      if (!character || !imageUrl) continue
      if (!map[character]) {
        map[character] = imageUrl
      }
    }

    characterIconCache = map
    characterIconFetchedAt = now
    return map
  },
  // キャラクター別の進捗を取得
  async getCharacterProgress(userId: string): Promise<CharacterProgress[]> {
    const supabase = getSupabase()

    // キャラクターごとのシール総数を取得
    // Note: characterカラムはマイグレーション038で追加予定
    const { data: stickerCounts } = await supabase
      .from('stickers')
      .select('character') as { data: { character: string | null }[] | null }

    const characterTotals: Record<string, number> = {}
    for (const s of stickerCounts || []) {
      if (s.character) {
        characterTotals[s.character] = (characterTotals[s.character] || 0) + 1
      }
    }

    // ユーザーの所持シールから図鑑登録数を計算
    // Note: 将来的には永続的な図鑑テーブル(sticker_collection)を追加予定
    const { data: userStickers } = await supabase
      .from('user_stickers')
      .select(`
        sticker_id,
        sticker:stickers(id, character)
      `)
      .eq('user_id', userId)

    // キャラクターごとのユニークシール数をカウント
    const collectedByCharacter: Record<string, Set<string>> = {}
    for (const us of userStickers || []) {
      const sticker = us.sticker as unknown as { id: string; character: string | null } | null
      const character = sticker?.character
      if (character && sticker?.id) {
        if (!collectedByCharacter[character]) {
          collectedByCharacter[character] = new Set()
        }
        collectedByCharacter[character].add(sticker.id)
      }
    }

    // 各キャラクターの進捗を計算
    const progress: CharacterProgress[] = []
    for (const characterName of CHARACTER_LIST) {
      const total = characterTotals[characterName] || 0
      const collected = collectedByCharacter[characterName]?.size || 0

      progress.push({
        characterName,
        totalCount: total,
        collectedCount: collected,
        completionRate: total > 0 ? Math.round((collected / total) * 100) : 0,
      })
    }

    return progress
  },

  // キャラクターの報酬一覧を取得（受取状態付き）
  async getCharacterRewards(userId: string, characterName: CharacterName): Promise<CharacterRewardWithStatus[]> {
    const supabase = getSupabase()

    // キャラクターの報酬マスター取得
    // Note: character_rewardsテーブルはマイグレーション038で追加予定
    const { data: rewards } = await supabase
      .from('character_rewards' as any)
      .select('*')
      .eq('character_name', characterName)
      .order('tier') as { data: { id: string; character_name: string; tier: number; required_count: number; reward_type: string }[] | null }

    if (!rewards || rewards.length === 0) {
      return []
    }

    // ユーザーの受取済み報酬
    const { data: claimed } = await supabase
      .from('user_character_rewards' as any)
      .select('character_name, tier')
      .eq('user_id', userId)
      .eq('character_name', characterName) as { data: { character_name: string; tier: number }[] | null }

    const claimedTiers = new Set((claimed || []).map(c => c.tier))

    // ユーザーの所持シールからユニークシール数を取得
    const { data: userStickers } = await supabase
      .from('user_stickers')
      .select(`
        sticker_id,
        sticker:stickers(id, character)
      `)
      .eq('user_id', userId)

    const uniqueStickerIds = new Set<string>()
    for (const us of userStickers || []) {
      const sticker = us.sticker as unknown as { id: string; character: string | null } | null
      if (sticker?.character === characterName && sticker?.id) {
        uniqueStickerIds.add(sticker.id)
      }
    }
    const collectedCount = uniqueStickerIds.size

    // 報酬ごとの状態を計算
    return rewards.map(reward => ({
      id: reward.id,
      characterName: reward.character_name as CharacterName,
      tier: reward.tier as CharacterRewardTier,
      rewardType: reward.reward_type as CharacterRewardType,
      requiredCount: reward.required_count,
      currentProgress: collectedCount,
      canClaim: collectedCount >= reward.required_count && !claimedTiers.has(reward.tier),
      claimed: claimedTiers.has(reward.tier),
    }))
  },

  // 全キャラクターの報酬状況を取得
  async getAllCharacterRewardStatus(userId: string): Promise<CharacterRewardStatus[]> {
    const now = Date.now()
    const cached = characterStatusCacheByUser.get(userId)
    if (cached && now - cached.fetchedAt < CHARACTER_STATUS_TTL_MS) {
      return cached.data
    }

    const supabase = getSupabase()

    const [
      stickerCountsRes,
      userStickersRes,
      rewardsRes,
      claimedRes,
    ] = await Promise.all([
      supabase.from('stickers').select('character').then(res => res as { data: { character: string | null }[] | null }),
      supabase.from('user_stickers').select(`
        sticker_id,
        sticker:stickers(id, character)
      `).eq('user_id', userId),
      supabase.from('character_rewards' as any).select('*').order('tier').then(res => res as { data: { id: string; character_name: string; tier: number; required_count: number; reward_type: string }[] | null }),
      supabase.from('user_character_rewards' as any).select('character_name, tier').eq('user_id', userId).then(res => res as { data: { character_name: string; tier: number }[] | null }),
    ])

    const characterTotals: Record<string, number> = {}
    for (const s of stickerCountsRes.data || []) {
      if (s.character) {
        characterTotals[s.character] = (characterTotals[s.character] || 0) + 1
      }
    }

    const collectedByCharacter: Record<string, Set<string>> = {}
    for (const us of (userStickersRes.data as any) || []) {
      const sticker = us.sticker as unknown as { id: string; character: string | null } | null
      const character = sticker?.character
      if (character && sticker?.id) {
        if (!collectedByCharacter[character]) {
          collectedByCharacter[character] = new Set()
        }
        collectedByCharacter[character].add(sticker.id)
      }
    }

    const progress: CharacterProgress[] = []
    for (const characterName of CHARACTER_LIST) {
      const total = characterTotals[characterName] || 0
      const collected = collectedByCharacter[characterName]?.size || 0
      progress.push({
        characterName,
        totalCount: total,
        collectedCount: collected,
        completionRate: total > 0 ? Math.round((collected / total) * 100) : 0,
      })
    }

    const rewardsByCharacter = new Map<string, { id: string; character_name: string; tier: number; required_count: number; reward_type: string }[]>()
    for (const reward of rewardsRes.data || []) {
      const list = rewardsByCharacter.get(reward.character_name) || []
      list.push(reward)
      rewardsByCharacter.set(reward.character_name, list)
    }

    const claimedByCharacter = new Map<string, Set<number>>()
    for (const claimed of claimedRes.data || []) {
      const set = claimedByCharacter.get(claimed.character_name) || new Set<number>()
      set.add(claimed.tier)
      claimedByCharacter.set(claimed.character_name, set)
    }

    const results: CharacterRewardStatus[] = []
    for (const p of progress) {
      const rewards = (rewardsByCharacter.get(p.characterName) || []).map(reward => {
        const claimedTiers = claimedByCharacter.get(reward.character_name) || new Set<number>()
        return {
          id: reward.id,
          characterName: reward.character_name as CharacterName,
          tier: reward.tier as CharacterRewardTier,
          rewardType: reward.reward_type as CharacterRewardType,
          requiredCount: reward.required_count,
          currentProgress: p.collectedCount,
          canClaim: p.collectedCount >= reward.required_count && !claimedTiers.has(reward.tier),
          claimed: claimedTiers.has(reward.tier),
        }
      })
      results.push({
        characterName: p.characterName,
        progress: p,
        rewards,
      })
    }

    characterStatusCacheByUser.set(userId, { data: results, fetchedAt: now })
    return results
  },

  // 報酬を受け取る
  async claimReward(userId: string, characterName: CharacterName, tier: CharacterRewardTier): Promise<{
    success: boolean
    rewardType?: CharacterRewardType
    error?: string
  }> {
    const supabase = getSupabase()

    // 既に受取済みかチェック
    // Note: user_character_rewardsテーブルはマイグレーション038で追加
    const { data: existing } = await supabase
      .from('user_character_rewards' as any)
      .select('id')
      .eq('user_id', userId)
      .eq('character_name', characterName)
      .eq('tier', tier)
      .single()

    if (existing) {
      return { success: false, error: '既に受け取り済みです' }
    }

    // 受取条件を満たしているかチェック
    const { data: userStickers } = await supabase
      .from('user_stickers')
      .select(`
        sticker_id,
        sticker:stickers(id, character)
      `)
      .eq('user_id', userId)

    const uniqueStickerIds = new Set<string>()
    for (const us of userStickers || []) {
      const sticker = us.sticker as unknown as { id: string; character: string | null } | null
      if (sticker?.character === characterName && sticker?.id) {
        uniqueStickerIds.add(sticker.id)
      }
    }
    const collectedCount = uniqueStickerIds.size

    const requiredCount = CHARACTER_TIER_REQUIREMENTS[tier]
    if (collectedCount < requiredCount) {
      return { success: false, error: '条件を満たしていません' }
    }

    // 受取記録を保存
    const { error } = await supabase
      .from('user_character_rewards' as any)
      .insert({
        user_id: userId,
        character_name: characterName,
        tier,
      })

    if (error) {
      console.error('[CharacterReward] Failed to record claim:', error)
      return { success: false, error: '受取記録の保存に失敗しました' }
    }
    this.invalidateUser(userId)

    // 報酬タイプを取得
    const rewardType = tier === CHARACTER_REWARD_TIERS.TIER_1
      ? CHARACTER_REWARD_TYPES.CHARACTER_ICON
      : tier === CHARACTER_REWARD_TIERS.TIER_2
        ? CHARACTER_REWARD_TYPES.BOOK_COVER
        : CHARACTER_REWARD_TYPES.ICON_FRAME

    return { success: true, rewardType }
  },

  // 解放済みキャラアイコン一覧を取得（Tier1達成キャラのシール画像が使用可能）
  async getUnlockedCharacterIcons(userId: string): Promise<UnlockedCharacterIcon[]> {
    const supabase = getSupabase()

    // Tier1達成済みキャラクターを取得
    const { data: tier1Claimed } = await supabase
      .from('user_character_rewards' as any)
      .select('character_name')
      .eq('user_id', userId)
      .eq('tier', CHARACTER_REWARD_TIERS.TIER_1) as { data: { character_name: string }[] | null }

    if (!tier1Claimed || tier1Claimed.length === 0) {
      return []
    }

    const unlockedCharacters = tier1Claimed.map(r => r.character_name)

    // 各キャラクターの所持シールを取得
    const results: UnlockedCharacterIcon[] = []

    for (const characterName of unlockedCharacters) {
      // そのキャラクターの所持シール一覧
      const { data: userStickers } = await supabase
        .from('user_stickers')
        .select(`
          sticker_id,
          sticker:stickers(id, image_url, character)
        `)
        .eq('user_id', userId)

      const stickerIds: string[] = []
      const stickerImages: { id: string; imageUrl: string }[] = []

      for (const us of userStickers || []) {
        const sticker = us.sticker as unknown as { id: string; image_url: string; character: string }
        if (sticker?.character === characterName) {
          if (!stickerIds.includes(sticker.id)) {
            stickerIds.push(sticker.id)
            stickerImages.push({
              id: sticker.id,
              imageUrl: sticker.image_url,
            })
          }
        }
      }

      if (stickerIds.length > 0) {
        results.push({
          characterName: characterName as CharacterName,
          stickerIds,
          stickerImages,
        })
      }
    }

    return results
  },

  // 解放済み表紙一覧を取得（Tier2達成キャラ名の配列）
  async getUnlockedCoverCharacters(userId: string): Promise<string[]> {
    const supabase = getSupabase()

    const { data: tier2Claimed } = await supabase
      .from('user_character_rewards' as any)
      .select('character_name')
      .eq('user_id', userId)
      .eq('tier', CHARACTER_REWARD_TIERS.TIER_2) as { data: { character_name: string }[] | null }

    if (!tier2Claimed || tier2Claimed.length === 0) {
      return []
    }

    return tier2Claimed.map(r => r.character_name)
  },

  // 解放済みフレーム一覧を取得（Tier3達成キャラ）
  async getUnlockedFrames(userId: string): Promise<UnlockedFrame[]> {
    const supabase = getSupabase()

    // Tier3達成済みキャラクターを取得
    const { data: tier3Claimed } = await supabase
      .from('user_character_rewards' as any)
      .select('character_name, claimed_at, created_at')
      .eq('user_id', userId)
      .eq('tier', CHARACTER_REWARD_TIERS.TIER_3) as { data: { character_name: string; claimed_at?: string | null; created_at?: string | null }[] | null }

    if (!tier3Claimed || tier3Claimed.length === 0) {
      return []
    }

    return tier3Claimed.map(r => {
      const charName = r.character_name as CharacterName
      const charId = getCharacterId(charName)
      return {
        characterName: charName,
        frameId: `frame_${charId}`,
        frameImageUrl: `/icon_frame/${charId}.png`,
        unlockedAt: (r as { claimed_at?: string | null; created_at?: string | null }).claimed_at
          || (r as { created_at?: string | null }).created_at
          || new Date().toISOString(),
      }
    })
  },

  // ユーザーの選択中フレームを取得
  async getSelectedFrame(userId: string): Promise<string | null> {
    const supabase = getSupabase()

    // Note: selected_frame_idカラムはマイグレーション038で追加
    const { data } = await supabase
      .from('profiles')
      .select('selected_frame_id')
      .eq('id', userId)
      .single() as { data: { selected_frame_id: string | null } | null }

    return data?.selected_frame_id || null
  },

  // フレームを設定
  async setSelectedFrame(userId: string, frameId: string | null): Promise<boolean> {
    const supabase = getSupabase()

    // frameIdがnullでない場合、解放済みか確認
    if (frameId) {
      const unlockedFrames = await this.getUnlockedFrames(userId)
      const isUnlocked = unlockedFrames.some(f => f.frameId === frameId)
      if (!isUnlocked) {
        console.error('[CharacterReward] Frame not unlocked:', frameId)
        return false
      }
    }

    // Note: selected_frame_idカラムはマイグレーション038で追加
    const { error } = await supabase
      .from('profiles')
      .update({ selected_frame_id: frameId } as any)
      .eq('id', userId)

    if (error) {
      console.error('[CharacterReward] Failed to set frame:', error)
      return false
    }

    return true
  },

  // 未受取の報酬数を取得（バッジ表示用）
  async getUnclaimedRewardsCount(userId: string): Promise<number> {
    const statuses = await this.getAllCharacterRewardStatus(userId)

    let count = 0
    for (const status of statuses) {
      for (const reward of status.rewards) {
        if (reward.canClaim) {
          count++
        }
      }
    }

    return count
  },

  // 特定キャラクターの次のティアまでの進捗情報を取得
  async getCharacterProgressDetail(userId: string, characterName: CharacterName): Promise<{
    progress: CharacterProgress
    nextTierInfo: ReturnType<typeof getProgressToNextTier>
    achievedTiers: CharacterRewardTier[]
  }> {
    const supabase = getSupabase()

    // シール総数
    const { data: stickers } = await supabase
      .from('stickers')
      .select('id')
      .eq('character', characterName)

    const totalCount = stickers?.length || 0

    // 所持シールからユニークシール数を計算
    const { data: userStickers } = await supabase
      .from('user_stickers')
      .select(`
        sticker_id,
        sticker:stickers(id, character)
      `)
      .eq('user_id', userId)

    const uniqueStickerIds = new Set<string>()
    for (const us of userStickers || []) {
      const sticker = us.sticker as unknown as { id: string; character: string | null } | null
      if (sticker?.character === characterName && sticker?.id) {
        uniqueStickerIds.add(sticker.id)
      }
    }
    const collectedCount = uniqueStickerIds.size

    const progress: CharacterProgress = {
      characterName,
      totalCount,
      collectedCount,
      completionRate: totalCount > 0 ? Math.round((collectedCount / totalCount) * 100) : 0,
    }

    return {
      progress,
      nextTierInfo: getProgressToNextTier(collectedCount),
      achievedTiers: getAchievedTiers(collectedCount),
    }
  },
}

export default characterRewardService
