// Supabaseデータベース型定義
// 自動生成されたdatabase.types.tsをラップし、便利な型エイリアスを提供

// 自動生成ファイルから基本型をエクスポート
export type { Database, Json, Tables, TablesInsert, TablesUpdate } from './database.types'
import type { Database } from './database.types'

// 便利な型エイリアス
type PublicTables = Database['public']['Tables']

export type Profile = PublicTables['profiles']['Row']
export type StickerBook = PublicTables['sticker_books']['Row']
export type StickerBookPage = PublicTables['sticker_book_pages']['Row']
export type Sticker = PublicTables['stickers']['Row']
export type UserSticker = PublicTables['user_stickers']['Row']
export type StickerPlacement = PublicTables['sticker_placements']['Row']
export type Trade = PublicTables['trades']['Row']
export type TradeItem = PublicTables['trade_items']['Row']
export type TradeMessage = PublicTables['trade_messages']['Row']
export type Friendship = PublicTables['friendships']['Row']
export type Post = PublicTables['posts']['Row']
export type Reaction = PublicTables['reactions']['Row']
export type GachaHistory = PublicTables['gacha_history']['Row']
export type Report = PublicTables['reports']['Row']

// 新しいテーブル
export type MysteryPost = PublicTables['mystery_posts']['Row']
export type TradeScoutSettings = PublicTables['trade_scout_settings']['Row']
export type TradeScoutMatch = PublicTables['trade_scout_matches']['Row']

// デコアイテム
export type DecoItem = PublicTables['deco_items']['Row']
export type DecoPlacement = PublicTables['deco_placements']['Row']

// Insert/Update型
export type ProfileInsert = PublicTables['profiles']['Insert']
export type ProfileUpdate = PublicTables['profiles']['Update']
export type StickerPlacementInsert = PublicTables['sticker_placements']['Insert']
export type StickerPlacementUpdate = PublicTables['sticker_placements']['Update']
export type TradeInsert = PublicTables['trades']['Insert']
export type TradeUpdate = PublicTables['trades']['Update']
