// シール帳サービス - シール帳とページの管理
import { getSupabase } from '@/services/supabase'
import type { StickerBook, StickerBookPage, StickerPlacement } from '@/types/database'

// ページとシール配置を含む型
export interface PageWithPlacements extends StickerBookPage {
  placements: StickerPlacement[]
}

// シール帳とページを含む型
export interface BookWithPages extends StickerBook {
  pages: PageWithPlacements[]
}

export const stickerBookService = {
  // ユーザーのシール帳一覧取得
  async getUserBooks(userId: string): Promise<StickerBook[]> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('sticker_books')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get user books error:', error)
      return []
    }

    return data || []
  },

  // シール帳詳細取得（ページと配置含む）
  async getBookWithPages(bookId: string): Promise<BookWithPages | null> {
    const supabase = getSupabase()

    // シール帳取得
    const { data: book, error: bookError } = await supabase
      .from('sticker_books')
      .select('*')
      .eq('id', bookId)
      .single()

    if (bookError || !book) {
      console.error('Get book error:', bookError)
      return null
    }

    // ページ取得
    const { data: pages, error: pagesError } = await supabase
      .from('sticker_book_pages')
      .select('*')
      .eq('book_id', bookId)
      .order('page_number')

    if (pagesError) {
      console.error('Get pages error:', pagesError)
      return { ...book, pages: [] }
    }

    // 各ページのシール配置を取得
    const pageIds = pages.map((p: StickerBookPage) => p.id)
    const { data: placements } = await supabase
      .from('sticker_placements')
      .select('*')
      .in('page_id', pageIds)

    // ページと配置を結合
    const pagesWithPlacements: PageWithPlacements[] = pages.map((page: StickerBookPage) => ({
      ...page,
      placements: (placements || []).filter((p: StickerPlacement) => p.page_id === page.id)
    }))

    return {
      ...book,
      pages: pagesWithPlacements
    }
  },

  // 新規シール帳作成
  async createBook(userId: string, name: string, themeId?: string): Promise<StickerBook | null> {
    const supabase = getSupabase()

    // シール帳作成
    const { data: book, error: bookError } = await supabase
      .from('sticker_books')
      .insert({
        user_id: userId,
        name,
        theme_id: themeId || null,
        is_public: false
      })
      .select()
      .single()

    if (bookError || !book) {
      console.error('Create book error:', bookError)
      return null
    }

    // デフォルトページ作成（表紙、見開き4ページ、裏表紙）
    const defaultPages = [
      { book_id: book.id, page_number: 0, page_type: 'cover' as const },
      { book_id: book.id, page_number: 1, page_type: 'page' as const, side: 'left' as const, spread_id: 'spread-1' },
      { book_id: book.id, page_number: 2, page_type: 'page' as const, side: 'right' as const, spread_id: 'spread-1' },
      { book_id: book.id, page_number: 3, page_type: 'page' as const, side: 'left' as const, spread_id: 'spread-2' },
      { book_id: book.id, page_number: 4, page_type: 'page' as const, side: 'right' as const, spread_id: 'spread-2' },
      { book_id: book.id, page_number: 5, page_type: 'back-cover' as const }
    ]

    await supabase.from('sticker_book_pages').insert(defaultPages)

    return book
  },

  // ページ追加（見開き単位で追加）
  async addSpread(bookId: string): Promise<StickerBookPage[] | null> {
    const supabase = getSupabase()

    // 現在の最大ページ番号取得
    const { data: existingPages } = await supabase
      .from('sticker_book_pages')
      .select('page_number')
      .eq('book_id', bookId)
      .order('page_number', { ascending: false })
      .limit(1)

    const lastPageNumber = existingPages?.[0]?.page_number || 0
    const spreadId = `spread-${Date.now()}`

    const newPages = [
      {
        book_id: bookId,
        page_number: lastPageNumber,
        page_type: 'page' as const,
        side: 'left' as const,
        spread_id: spreadId
      },
      {
        book_id: bookId,
        page_number: lastPageNumber + 1,
        page_type: 'page' as const,
        side: 'right' as const,
        spread_id: spreadId
      }
    ]

    // 裏表紙の番号を更新
    await supabase
      .from('sticker_book_pages')
      .update({ page_number: lastPageNumber + 2 })
      .eq('book_id', bookId)
      .eq('page_type', 'back-cover')

    const { data, error } = await supabase
      .from('sticker_book_pages')
      .insert(newPages)
      .select()

    if (error) {
      console.error('Add spread error:', error)
      return null
    }

    return data
  },

  // シール配置
  async placeSticker(
    pageId: string,
    userStickerId: string,
    position: { x: number; y: number },
    rotation: number = 0,
    scale: number = 1
  ): Promise<StickerPlacement | null> {
    const supabase = getSupabase()

    // 現在のz-index最大値取得
    const { data: existingPlacements } = await supabase
      .from('sticker_placements')
      .select('z_index')
      .eq('page_id', pageId)
      .order('z_index', { ascending: false })
      .limit(1)

    const maxZIndex = existingPlacements?.[0]?.z_index || 0

    const { data, error } = await supabase
      .from('sticker_placements')
      .insert({
        page_id: pageId,
        user_sticker_id: userStickerId,
        position_x: position.x,
        position_y: position.y,
        rotation,
        scale,
        z_index: maxZIndex + 1
      })
      .select()
      .single()

    if (error) {
      console.error('Place sticker error:', error)
      return null
    }

    return data
  },

  // シール位置更新
  async updatePlacement(
    placementId: string,
    updates: {
      position_x?: number
      position_y?: number
      rotation?: number
      scale?: number
      z_index?: number
    }
  ): Promise<StickerPlacement | null> {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('sticker_placements')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', placementId)
      .select()
      .single()

    if (error) {
      console.error('Update placement error:', error)
      return null
    }

    return data
  },

  // シール削除（ページから剥がす）
  async removePlacement(placementId: string): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('sticker_placements')
      .delete()
      .eq('id', placementId)

    if (error) {
      console.error('Remove placement error:', error)
      return false
    }

    return true
  },

  // シール帳の公開設定変更
  async updateBookVisibility(bookId: string, isPublic: boolean): Promise<boolean> {
    const supabase = getSupabase()

    const { error } = await supabase
      .from('sticker_books')
      .update({
        is_public: isPublic,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookId)

    if (error) {
      console.error('Update visibility error:', error)
      return false
    }

    return true
  },

  // シール帳削除
  async deleteBook(bookId: string): Promise<boolean> {
    const supabase = getSupabase()

    // 関連データは CASCADE で自動削除される想定
    const { error } = await supabase
      .from('sticker_books')
      .delete()
      .eq('id', bookId)

    if (error) {
      console.error('Delete book error:', error)
      return false
    }

    return true
  }
}

export default stickerBookService
