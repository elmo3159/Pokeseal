// シール帳サービス - Supabaseからシール帳データを取得
import { getSupabase } from '@/services/supabase'
import { dailyMissionService } from '@/services/dailyMissions'
import { getDefaultCoverDesignId, getDefaultThemeId } from '@/domain/theme'
import type { Sticker } from '@/features/sticker-book/StickerTray'
import type { PlacedSticker } from '@/features/sticker-book/StickerPlacement'
import type { PlacedDecoItem, DecoItemData, DecoItemType } from '@/domain/decoItems'

// シール帳ページの型（TradeBookPageFull互換）
export interface StickerBookPage {
  id: string
  pageNumber: number
  pageType: 'cover' | 'page' | 'back-cover'
  side?: 'left' | 'right'
  themeConfig?: Record<string, unknown> | null
  stickers: PlacedSticker[]
  decoItems?: PlacedDecoItem[]
}

// シール帳の型
export interface StickerBook {
  id: string
  userId: string
  name: string
  themeId?: string
  coverDesignId?: string
  isPublic: boolean
  pages: StickerBookPage[]
}

// Supabaseから取得した生データの型
interface RawPlacement {
  id: string
  page_id: string
  position_x: number
  position_y: number
  rotation: number
  scale: number
  z_index: number
  created_at: string
  user_sticker: {
    id: string
    sticker_id: string
    upgrade_rank: number  // アップグレードランク
    sticker: {
      id: string
      name: string
      image_url: string
      rarity: number
      type: string
      series: string | null
      base_rate: number | null
      gacha_weight: number | null
    }
  }
}

interface RawPage {
  id: string
  page_number: number
  page_type: string
  side: string | null
  theme_config: Record<string, unknown> | null
}

// デコ配置の生データ型
interface RawDecoPlacement {
  id: string
  page_id: string
  position_x: number
  position_y: number
  rotation: number
  width: number
  height: number
  z_index: number
  created_at: string
  deco_item: {
    id: string
    name: string
    type: string
    image_url: string
    base_width: number
    base_height: number
    rotatable: boolean
    rarity: number
    obtain_method: string
  }
}

// デコ配置の入力型
export interface DecoPlacementInput {
  pageId: string
  decoItemId: string
  x: number
  y: number
  rotation: number
  width: number
  height: number
  zIndex: number
}

// デコ配置の更新型
export interface DecoPlacementUpdate {
  x?: number
  y?: number
  rotation?: number
  width?: number
  height?: number
  zIndex?: number
  pageId?: string
}

// シール配置の入力型
export interface PlacementInput {
  pageId: string
  userStickerId: string  // user_stickers.id
  x: number
  y: number
  rotation: number
  scale: number
  zIndex: number
}

// シール配置の更新型
export interface PlacementUpdate {
  x?: number
  y?: number
  rotation?: number
  scale?: number
  zIndex?: number
  pageId?: string  // ページ移動時
}

export const stickerBookService = {
  /**
   * ユーザーのシール帳データを取得（ページとシール配置を含む）
   */
  async getUserStickerBook(userId: string): Promise<StickerBook | null> {
    const supabase = getSupabase()

    // 1. ユーザーのシール帳を取得
    const { data: book, error: bookError } = await supabase
      .from('sticker_books')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (bookError) {
      console.error('[StickerBookService] Book fetch error:', bookError)
      return null
    }

    if (!book) {
      // 新規ユーザーの場合はシール帳がないのは正常
      return null
    }

    // 2. シール帳のページを取得
    const { data: pages, error: pagesError } = await supabase
      .from('sticker_book_pages')
      .select('id, page_number, page_type, side, theme_config')
      .eq('book_id', book.id)
      .order('page_number', { ascending: true })

    if (pagesError || !pages) {
      console.error('[StickerBookService] Pages not found:', pagesError)
      return null
    }

    // 3. 各ページのシール配置を取得
    const pageIds = pages.map(p => p.id)

    const { data: placements, error: placementsError } = await supabase
      .from('sticker_placements')
      .select(`
        id,
        page_id,
        position_x,
        position_y,
        rotation,
        scale,
        z_index,
        created_at,
        user_sticker:user_stickers(
          id,
          sticker_id,
          upgrade_rank,
          sticker:stickers(
            id,
            name,
            image_url,
            rarity,
            type,
            series,
            base_rate,
            gacha_weight
          )
        )
      `)
      .in('page_id', pageIds)

    if (placementsError) {
      console.error('[StickerBookService] Placements error:', placementsError)
      return null
    }

    // 4. 各ページのデコ配置を取得
    let decoPlacements: RawDecoPlacement[] = []
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: decoData, error: decoError } = await (supabase as any)
        .from('deco_placements')
        .select(`
          id,
          page_id,
          position_x,
          position_y,
          rotation,
          width,
          height,
          z_index,
          created_at,
          deco_item:deco_items(
            id,
            name,
            type,
            image_url,
            base_width,
            base_height,
            rotatable,
            rarity,
            obtain_method
          )
        `)
        .in('page_id', pageIds)

      if (!decoError) {
        decoPlacements = (decoData as unknown as RawDecoPlacement[]) || []
      }
    } catch {
      // deco_placements テーブルが存在しない場合はスキップ
    }

    // 5. データを整形
    const pagesWithStickers: StickerBookPage[] = (pages as RawPage[]).map(page => {
      const pageStickers = (placements as unknown as RawPlacement[] || [])
        .filter(p => p.page_id === page.id)
        .map(placement => this.convertToPlacedSticker(placement, page.id))

      const pageDecos = decoPlacements
        .filter(d => d.page_id === page.id)
        .map(deco => this.convertToPlacedDecoItem(deco, page.id))

      return {
        id: page.id,
        pageNumber: page.page_number,
        pageType: page.page_type as 'cover' | 'page' | 'back-cover',
        side: page.side as 'left' | 'right' | undefined,
        themeConfig: page.theme_config,
        stickers: pageStickers,
        decoItems: pageDecos.length > 0 ? pageDecos : undefined,
      }
    })

    return {
      id: book.id,
      userId: book.user_id,
      name: book.name,
      themeId: book.theme_id || undefined,
      coverDesignId: book.cover_design_id || undefined,
      isPublic: book.is_public ?? false,
      pages: pagesWithStickers,
    }
  },

  /**
   * ユーザーのシール帳ページ一覧を取得（交換画面用）
   * pageTypeが'page'のもののみ返す
   */
  async getUserTradablePages(userId: string): Promise<StickerBookPage[]> {
    const book = await this.getUserStickerBook(userId)
    if (!book) return []

    // 交換可能なページのみフィルタ（coverとback-coverは除外）
    return book.pages.filter(page => page.pageType === 'page')
  },

  /**
   * Supabaseの配置データをPlacedSticker型に変換
   */
  convertToPlacedSticker(placement: RawPlacement, pageId: string): PlacedSticker {
    const userSticker = placement.user_sticker
    const stickerData = userSticker?.sticker
    const upgradeRank = userSticker?.upgrade_rank ?? 0  // アップグレードランクを取得

    const sticker: Sticker = {
      id: stickerData?.id || 'unknown',
      name: stickerData?.name || 'Unknown',
      imageUrl: stickerData?.image_url,
      rarity: stickerData?.rarity || 1,
      type: (stickerData?.type as 'normal' | 'puffy' | 'sparkle') || 'normal',
      series: stickerData?.series || undefined,
      baseRate: stickerData?.base_rate || undefined,
      gachaWeight: stickerData?.gacha_weight || undefined,
      upgradeRank,  // Stickerオブジェクトにも含める
    }

    return {
      id: placement.id,                    // sticker_placements.id（配置の編集・削除用）
      userStickerId: userSticker?.id,      // user_stickers.id（交換用）
      stickerId: sticker.id,
      sticker,
      pageId,
      x: Number(placement.position_x),
      y: Number(placement.position_y),
      rotation: Number(placement.rotation),
      scale: Number(placement.scale),
      zIndex: placement.z_index,
      placedAt: placement.created_at,
      upgradeRank,  // PlacedStickerにも含める
    }
  },

  /**
   * Supabaseのデコ配置データをPlacedDecoItem型に変換
   */
  convertToPlacedDecoItem(placement: RawDecoPlacement, pageId: string): PlacedDecoItem {
    const decoData = placement.deco_item

    const decoItem: DecoItemData = {
      id: decoData?.id || 'unknown',
      name: decoData?.name || 'Unknown',
      type: (decoData?.type as DecoItemType) || 'stamp',
      imageUrl: decoData?.image_url || '',
      baseWidth: decoData?.base_width || 50,
      baseHeight: decoData?.base_height || 50,
      rotatable: decoData?.rotatable ?? true,
      rarity: (decoData?.rarity || 1) as 1 | 2 | 3 | 4 | 5,
      obtainMethod: (decoData?.obtain_method as 'default' | 'gacha' | 'event' | 'purchase') || 'default',
    }

    return {
      id: placement.id,
      decoItemId: decoItem.id,
      decoItem,
      pageId,
      x: Number(placement.position_x),
      y: Number(placement.position_y),
      rotation: Number(placement.rotation),
      scale: 1, // 後方互換用
      width: Number(placement.width),
      height: Number(placement.height),
      zIndex: placement.z_index,
      placedAt: placement.created_at,
    }
  },

  /**
   * シール帳を作成（存在しない場合）
   */
  async createStickerBook(userId: string, name: string = 'マイシール帳'): Promise<StickerBook | null> {
    const supabase = getSupabase()

    // 既存のシール帳を確認
    const { data: existing, error: existingError } = await supabase
      .from('sticker_books')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (existingError) {
      console.error('[StickerBookService] Existing book check error:', existingError)
      return null
    }

    if (existing) {
      return this.getUserStickerBook(userId)
    }

    // 新規作成
    const { data: book, error: bookError } = await supabase
      .from('sticker_books')
      .insert({
        user_id: userId,
        name,
        is_public: true,
        theme_id: getDefaultThemeId(),
        cover_design_id: getDefaultCoverDesignId(),
      })
      .select()
      .single()

    if (bookError || !book) {
      console.error('[StickerBookService] Create book error:', bookError)
      return null
    }

    // デフォルトページを作成（表紙 + 8ページ + 裏表紙）
    const pagesToCreate: Array<{
      book_id: string
      page_number: number
      page_type: 'cover' | 'page' | 'back-cover'
      side?: 'left' | 'right'
    }> = [
      { book_id: book.id, page_number: 0, page_type: 'cover' },
      { book_id: book.id, page_number: 1, page_type: 'page', side: 'left' },
      { book_id: book.id, page_number: 2, page_type: 'page', side: 'right' },
      { book_id: book.id, page_number: 3, page_type: 'page', side: 'left' },
      { book_id: book.id, page_number: 4, page_type: 'page', side: 'right' },
      { book_id: book.id, page_number: 5, page_type: 'page', side: 'left' },
      { book_id: book.id, page_number: 6, page_type: 'page', side: 'right' },
      { book_id: book.id, page_number: 7, page_type: 'page', side: 'left' },
      { book_id: book.id, page_number: 8, page_type: 'page', side: 'right' },
      { book_id: book.id, page_number: 9, page_type: 'back-cover' },
    ]

    const { error: pagesError } = await supabase
      .from('sticker_book_pages')
      .insert(pagesToCreate)

    if (pagesError) {
      console.error('[StickerBookService] Create pages error:', pagesError)
    }

    return this.getUserStickerBook(userId)
  },

  /**
   * シール帳のテーマを更新する
   */
  async updateBookTheme(userId: string, themeId: string): Promise<boolean> {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('sticker_books')
      .update({ theme_id: themeId, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    if (error) {
      console.error('[StickerBookService] Update theme error:', error)
      return false
    }
    return true
  },

  /**
   * シール帳の表紙デザインを更新する
   */
  async updateCoverDesign(userId: string, coverDesignId: string): Promise<boolean> {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('sticker_books')
      .update({ cover_design_id: coverDesignId, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    if (error) {
      console.error('[StickerBookService] Update cover design error:', error)
      return false
    }
    return true
  },

  /**
   * ページのテーマ設定を更新する
   */
  async updatePageThemeConfig(pageId: string, themeConfig: Record<string, unknown> | null): Promise<boolean> {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('sticker_book_pages')
      .update({ theme_config: themeConfig, updated_at: new Date().toISOString() })
      .eq('id', pageId)

    if (error) {
      console.error('[StickerBookService] Update page theme error:', error)
      return false
    }
    return true
  },

  // =============================================
  // シール配置のCRUD操作
  // =============================================

  /**
   * シールを配置する
   */
  async addPlacement(input: PlacementInput): Promise<string | null> {
    const supabase = getSupabase()

    // user_stickersからuserIdを取得
    const { data: userSticker } = await supabase
      .from('user_stickers')
      .select('user_id')
      .eq('id', input.userStickerId)
      .single()

    const { data, error } = await supabase
      .from('sticker_placements')
      .insert({
        page_id: input.pageId,
        user_sticker_id: input.userStickerId,
        position_x: input.x,
        position_y: input.y,
        rotation: input.rotation,
        scale: input.scale,
        z_index: input.zIndex,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[StickerBookService] Add placement error:', error)
      return null
    }

    // デイリーミッション進捗を更新
    if (userSticker?.user_id) {
      await dailyMissionService.updateProgress(userSticker.user_id, 'place_sticker', 1)
    }

    return data.id
  },

  /**
   * シール配置を更新する
   */
  async updatePlacement(placementId: string, update: PlacementUpdate): Promise<boolean> {
    const supabase = getSupabase()

    const updateData: Record<string, unknown> = {}
    if (update.x !== undefined) updateData.position_x = update.x
    if (update.y !== undefined) updateData.position_y = update.y
    if (update.rotation !== undefined) updateData.rotation = update.rotation
    if (update.scale !== undefined) updateData.scale = update.scale
    if (update.zIndex !== undefined) updateData.z_index = update.zIndex
    if (update.pageId !== undefined) updateData.page_id = update.pageId

    const { error } = await supabase
      .from('sticker_placements')
      .update(updateData)
      .eq('id', placementId)

    if (error) {
      console.error('[StickerBookService] Update placement error:', error)
      return false
    }

    return true
  },

  /**
   * シール配置を削除する
   */
  async removePlacement(placementId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('sticker_placements')
      .delete()
      .eq('id', placementId)

    if (error) {
      console.error('[StickerBookService] Remove placement error:', error)
      return false
    }

    return true
  },

  /**
   * ユーザーの所持シールIDを取得（sticker_idからuser_sticker_idを取得）
   * 複合ID（baseId:upgradeRank形式）もサポート
   */
  async getUserStickerId(userId: string, stickerId: string): Promise<string | null> {
    const supabase = getSupabase()

    // 複合IDをパース（例: "いちごにゃん-bondro-1:1" → baseId: "いちごにゃん-bondro-1", upgradeRank: 1）
    const parseCompositeId = (compositeId: string): { baseId: string; upgradeRank: number } => {
      const lastColonIndex = compositeId.lastIndexOf(':')
      if (lastColonIndex === -1) {
        return { baseId: compositeId, upgradeRank: 0 }
      }
      const potentialRank = compositeId.substring(lastColonIndex + 1)
      const rank = parseInt(potentialRank, 10)
      // 数値として解析できる場合のみ複合IDとして扱う
      if (!isNaN(rank) && potentialRank === String(rank)) {
        return {
          baseId: compositeId.substring(0, lastColonIndex),
          upgradeRank: rank
        }
      }
      return { baseId: compositeId, upgradeRank: 0 }
    }

    const { baseId, upgradeRank } = parseCompositeId(stickerId)

    const { data, error } = await supabase
      .from('user_stickers')
      .select('id')
      .eq('user_id', userId)
      .eq('sticker_id', baseId)
      .eq('upgrade_rank', upgradeRank)
      .maybeSingle()

    if (error || !data) {
      // テストモードなどでユーザーがシールを所持していない場合は正常なケース
      return null
    }

    return data.id
  },

  /**
   * シール帳のページIDマッピングを取得（ローカルページID → SupabaseページID）
   * デモページIDをSupabaseのUUIDに変換するために使用
   */
  async getPageIdMapping(userId: string): Promise<Map<number, string>> {
    const supabase = getSupabase()

    // シール帳を取得
    const { data: book, error: bookError } = await supabase
      .from('sticker_books')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (bookError) {
      console.error('[StickerBookService] Page mapping book fetch error:', bookError)
      return new Map()
    }

    if (!book) {
      // 新規ユーザーの場合はシール帳がないのは正常
      return new Map()
    }

    // ページを取得
    const { data: pages } = await supabase
      .from('sticker_book_pages')
      .select('id, page_number')
      .eq('book_id', book.id)
      .order('page_number', { ascending: true })

    if (!pages) {
      return new Map()
    }

    // page_number → id のマップを作成
    const mapping = new Map<number, string>()
    pages.forEach(page => {
      mapping.set(page.page_number, page.id)
    })

    return mapping
  },

  /**
   * 全シール配置を一括削除（ユーザーのシール帳）
   */
  async clearAllPlacements(userId: string): Promise<boolean> {
    const supabase = getSupabase()

    // シール帳を取得
    const { data: book } = await supabase
      .from('sticker_books')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!book) {
      return false
    }

    // ページIDを取得
    const { data: pages } = await supabase
      .from('sticker_book_pages')
      .select('id')
      .eq('book_id', book.id)

    if (!pages || pages.length === 0) {
      return true // ページがなければ成功扱い
    }

    const pageIds = pages.map(p => p.id)

    // 配置を削除
    const { error } = await supabase
      .from('sticker_placements')
      .delete()
      .in('page_id', pageIds)

    if (error) {
      console.error('[StickerBookService] Clear placements error:', error)
      return false
    }

    return true
  },

  /**
   * 複数のシール配置を一括追加
   */
  async addPlacements(inputs: PlacementInput[]): Promise<string[]> {
    if (inputs.length === 0) return []

    const supabase = getSupabase()

    // 最初のuser_stickerからuserIdを取得（一括配置は同じユーザー）
    let userId: string | null = null
    if (inputs.length > 0) {
      const { data: userSticker } = await supabase
        .from('user_stickers')
        .select('user_id')
        .eq('id', inputs[0].userStickerId)
        .single()

      userId = userSticker?.user_id || null
    }

    const insertData = inputs.map(input => ({
      page_id: input.pageId,
      user_sticker_id: input.userStickerId,
      position_x: input.x,
      position_y: input.y,
      rotation: input.rotation,
      scale: input.scale,
      z_index: input.zIndex,
    }))

    const { data, error } = await supabase
      .from('sticker_placements')
      .insert(insertData)
      .select('id')

    if (error) {
      console.error('[StickerBookService] Batch add placements error:', error)
      return []
    }

    // デイリーミッション進捗を更新（配置した数だけ）
    if (userId && data.length > 0) {
      await dailyMissionService.updateProgress(userId, 'place_sticker', data.length)
    }

    return data.map(d => d.id)
  },

  // =============================================
  // デコ配置のCRUD操作
  // =============================================

  /**
   * デコを配置する
   */
  async addDecoPlacement(input: DecoPlacementInput): Promise<string | null> {
    const supabase = getSupabase()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('deco_placements')
      .insert({
        page_id: input.pageId,
        deco_item_id: input.decoItemId,
        position_x: input.x,
        position_y: input.y,
        rotation: input.rotation,
        width: input.width,
        height: input.height,
        z_index: input.zIndex,
      })
      .select('id')
      .single()

    if (error) {
      console.error('[StickerBookService] Add deco placement error:', error)
      return null
    }

    return data.id
  },

  /**
   * デコ配置を更新する
   */
  async updateDecoPlacement(placementId: string, update: DecoPlacementUpdate): Promise<boolean> {
    const supabase = getSupabase()

    const updateData: Record<string, unknown> = {}
    if (update.x !== undefined) updateData.position_x = update.x
    if (update.y !== undefined) updateData.position_y = update.y
    if (update.rotation !== undefined) updateData.rotation = update.rotation
    if (update.width !== undefined) updateData.width = update.width
    if (update.height !== undefined) updateData.height = update.height
    if (update.zIndex !== undefined) updateData.z_index = update.zIndex
    if (update.pageId !== undefined) updateData.page_id = update.pageId

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('deco_placements')
      .update(updateData)
      .eq('id', placementId)

    if (error) {
      console.error('[StickerBookService] Update deco placement error:', error)
      return false
    }

    return true
  },

  /**
   * デコ配置を削除する
   */
  async removeDecoPlacement(placementId: string): Promise<boolean> {
    const supabase = getSupabase()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('deco_placements')
      .delete()
      .eq('id', placementId)

    if (error) {
      console.error('[StickerBookService] Remove deco placement error:', error)
      return false
    }

    return true
  },

  /**
   * 複数のデコ配置を一括追加
   */
  async addDecosPlacements(inputs: DecoPlacementInput[]): Promise<string[]> {
    if (inputs.length === 0) return []

    const supabase = getSupabase()

    const insertData = inputs.map(input => ({
      page_id: input.pageId,
      deco_item_id: input.decoItemId,
      position_x: input.x,
      position_y: input.y,
      rotation: input.rotation,
      width: input.width,
      height: input.height,
      z_index: input.zIndex,
    }))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('deco_placements')
      .insert(insertData)
      .select('id')

    if (error) {
      console.error('[StickerBookService] Batch add deco placements error:', error)
      return []
    }

    return data.map((d: { id: string }) => d.id)
  },

  /**
   * 特定のページIDからシール帳ページデータを取得（タイムライン表示用）
   */
  async getPageById(pageId: string): Promise<StickerBookPage | null> {
    const supabase = getSupabase()

    // ページ情報を取得
    const { data: page, error: pageError } = await supabase
      .from('sticker_book_pages')
      .select('id, page_number, page_type, side, theme_config')
      .eq('id', pageId)
      .single()

    if (pageError || !page) {
      console.error('[StickerBookService] Page not found:', pageError)
      return null
    }

    // シール配置を取得
    const { data: placements, error: placementsError } = await supabase
      .from('sticker_placements')
      .select(`
        id,
        page_id,
        position_x,
        position_y,
        rotation,
        scale,
        z_index,
        created_at,
        user_sticker:user_stickers(
          id,
          sticker_id,
          upgrade_rank,
          sticker:stickers(
            id,
            name,
            image_url,
            rarity,
            type,
            series,
            base_rate,
            gacha_weight
          )
        )
      `)
      .eq('page_id', pageId)

    if (placementsError) {
      console.error('[StickerBookService] Get page placements error:', placementsError)
      return null
    }

    // デコ配置を取得
    let decoPlacements: RawDecoPlacement[] = []
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: decoData, error: decoError } = await (supabase as any)
        .from('deco_placements')
        .select(`
          id,
          page_id,
          position_x,
          position_y,
          rotation,
          width,
          height,
          z_index,
          created_at,
          deco_item:deco_items(
            id,
            name,
            type,
            image_url,
            base_width,
            base_height,
            rotatable,
            rarity,
            obtain_method
          )
        `)
        .eq('page_id', pageId)

      if (!decoError && decoData) {
        decoPlacements = decoData as unknown as RawDecoPlacement[]
      }
    } catch {
      // deco_placements テーブルが存在しない場合はスキップ
    }

    // データを整形
    const pageStickers = (placements as unknown as RawPlacement[] || [])
      .map(placement => this.convertToPlacedSticker(placement, pageId))

    const pageDecos = decoPlacements
      .map(deco => this.convertToPlacedDecoItem(deco, pageId))

    return {
      id: page.id,
      pageNumber: page.page_number,
      pageType: page.page_type as 'cover' | 'page' | 'back-cover',
      side: page.side as 'left' | 'right' | undefined,
      themeConfig: (page as RawPage).theme_config,
      stickers: pageStickers,
      decoItems: pageDecos.length > 0 ? pageDecos : undefined,
    }
  },

  /**
   * 全デコ配置を一括削除（ユーザーのシール帳）
   */
  async clearAllDecoPlacements(userId: string): Promise<boolean> {
    const supabase = getSupabase()

    // シール帳を取得
    const { data: book } = await supabase
      .from('sticker_books')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!book) {
      return false
    }

    // ページIDを取得
    const { data: pages } = await supabase
      .from('sticker_book_pages')
      .select('id')
      .eq('book_id', book.id)

    if (!pages || pages.length === 0) {
      return true
    }

    const pageIds = pages.map(p => p.id)

    // デコ配置を削除
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('deco_placements')
      .delete()
      .in('page_id', pageIds)

    if (error) {
      console.error('[StickerBookService] Clear deco placements error:', error)
      return false
    }

    return true
  },
}

export default stickerBookService
