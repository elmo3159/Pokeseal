// シール帳サービス - Supabaseからシール帳データを取得
import { getSupabase } from '@/services/supabase'
import type { Sticker } from '@/features/sticker-book/StickerTray'
import type { PlacedSticker } from '@/features/sticker-book/StickerPlacement'

// シール帳ページの型（TradeBookPageFull互換）
export interface StickerBookPage {
  id: string
  pageNumber: number
  pageType: 'cover' | 'page' | 'back-cover'
  side?: 'left' | 'right'
  stickers: PlacedSticker[]
}

// シール帳の型
export interface StickerBook {
  id: string
  userId: string
  name: string
  themeId?: string
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
      .single()

    if (bookError || !book) {
      console.error('[StickerBookService] Book not found:', bookError)
      return null
    }

    // 2. シール帳のページを取得
    const { data: pages, error: pagesError } = await supabase
      .from('sticker_book_pages')
      .select('id, page_number, page_type, side')
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

    // 4. データを整形
    const pagesWithStickers: StickerBookPage[] = (pages as RawPage[]).map(page => {
      const pageStickers = (placements as unknown as RawPlacement[] || [])
        .filter(p => p.page_id === page.id)
        .map(placement => this.convertToPlacedSticker(placement, page.id))

      return {
        id: page.id,
        pageNumber: page.page_number,
        pageType: page.page_type as 'cover' | 'page' | 'back-cover',
        side: page.side as 'left' | 'right' | undefined,
        stickers: pageStickers,
      }
    })

    return {
      id: book.id,
      userId: book.user_id,
      name: book.name,
      themeId: book.theme_id || undefined,
      isPublic: book.is_public,
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

    const sticker: Sticker = {
      id: stickerData?.id || 'unknown',
      name: stickerData?.name || 'Unknown',
      imageUrl: stickerData?.image_url,
      rarity: stickerData?.rarity || 1,
      type: (stickerData?.type as 'normal' | 'puffy' | 'sparkle') || 'normal',
      series: stickerData?.series || undefined,
      baseRate: stickerData?.base_rate || undefined,
      gachaWeight: stickerData?.gacha_weight || undefined,
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
    }
  },

  /**
   * シール帳を作成（存在しない場合）
   */
  async createStickerBook(userId: string, name: string = 'マイシール帳'): Promise<StickerBook | null> {
    const supabase = getSupabase()

    // 既存のシール帳を確認
    const { data: existing } = await supabase
      .from('sticker_books')
      .select('id')
      .eq('user_id', userId)
      .single()

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

  // =============================================
  // シール配置のCRUD操作
  // =============================================

  /**
   * シールを配置する
   */
  async addPlacement(input: PlacementInput): Promise<string | null> {
    const supabase = getSupabase()

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

    console.log('[StickerBookService] Placement added:', data.id)
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

    console.log('[StickerBookService] Placement updated:', placementId)
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

    console.log('[StickerBookService] Placement removed:', placementId)
    return true
  },

  /**
   * ユーザーの所持シールIDを取得（sticker_idからuser_sticker_idを取得）
   */
  async getUserStickerId(userId: string, stickerId: string): Promise<string | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('user_stickers')
      .select('id')
      .eq('user_id', userId)
      .eq('sticker_id', stickerId)
      .single()

    if (error || !data) {
      console.error('[StickerBookService] User sticker not found:', error)
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
    const { data: book } = await supabase
      .from('sticker_books')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!book) {
      console.error('[StickerBookService] Book not found for page mapping')
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

    console.log('[StickerBookService] All placements cleared for user:', userId)
    return true
  },

  /**
   * 複数のシール配置を一括追加
   */
  async addPlacements(inputs: PlacementInput[]): Promise<string[]> {
    if (inputs.length === 0) return []

    const supabase = getSupabase()

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

    const ids = data.map(d => d.id)
    console.log('[StickerBookService] Batch placements added:', ids.length)
    return ids
  },
}

export default stickerBookService
