// Supabaseデータベース型定義
// CLAUDE.md仕様に基づくテーブル設計

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ユーザープロフィール
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          star_points: number
          total_stickers: number
          total_trades: number
          selected_charm_id: string | null
          selected_theme_id: string | null
          tutorial_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          star_points?: number
          total_stickers?: number
          total_trades?: number
          selected_charm_id?: string | null
          selected_theme_id?: string | null
          tutorial_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          star_points?: number
          total_stickers?: number
          total_trades?: number
          selected_charm_id?: string | null
          selected_theme_id?: string | null
          tutorial_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // シール帳
      sticker_books: {
        Row: {
          id: string
          user_id: string
          name: string
          theme_id: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          theme_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          theme_id?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // シール帳ページ
      sticker_book_pages: {
        Row: {
          id: string
          book_id: string
          page_number: number
          page_type: 'cover' | 'page' | 'back-cover'
          side: 'left' | 'right' | null
          spread_id: string | null
          theme_config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          page_number: number
          page_type: 'cover' | 'page' | 'back-cover'
          side?: 'left' | 'right' | null
          spread_id?: string | null
          theme_config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          page_number?: number
          page_type?: 'cover' | 'page' | 'back-cover'
          side?: 'left' | 'right' | null
          spread_id?: string | null
          theme_config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // シール（マスターデータ）
      stickers: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string
          rarity: number
          type: 'normal' | 'puffy' | 'sparkle'
          series: string | null
          base_rate: number
          gacha_weight: number
          is_limited: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url: string
          rarity: number
          type: 'normal' | 'puffy' | 'sparkle'
          series?: string | null
          base_rate?: number
          gacha_weight?: number
          is_limited?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string
          rarity?: number
          type?: 'normal' | 'puffy' | 'sparkle'
          series?: string | null
          base_rate?: number
          gacha_weight?: number
          is_limited?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // ユーザー所持シール
      user_stickers: {
        Row: {
          id: string
          user_id: string
          sticker_id: string
          quantity: number
          total_acquired: number
          rank: number
          first_acquired_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          sticker_id: string
          quantity?: number
          total_acquired?: number
          rank?: number
          first_acquired_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          sticker_id?: string
          quantity?: number
          total_acquired?: number
          rank?: number
          first_acquired_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // シール配置情報
      sticker_placements: {
        Row: {
          id: string
          page_id: string
          user_sticker_id: string
          position_x: number
          position_y: number
          rotation: number
          scale: number
          z_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          user_sticker_id: string
          position_x: number
          position_y: number
          rotation?: number
          scale?: number
          z_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          user_sticker_id?: string
          position_x?: number
          position_y?: number
          rotation?: number
          scale?: number
          z_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // 交換セッション
      trades: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          status: 'matching' | 'negotiating' | 'user1_ready' | 'user2_ready' | 'completed' | 'cancelled'
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          status?: 'matching' | 'negotiating' | 'user1_ready' | 'user2_ready' | 'completed' | 'cancelled'
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          status?: 'matching' | 'negotiating' | 'user1_ready' | 'user2_ready' | 'completed' | 'cancelled'
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // 交換アイテム
      trade_items: {
        Row: {
          id: string
          trade_id: string
          user_id: string
          user_sticker_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          trade_id: string
          user_id: string
          user_sticker_id: string
          quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          trade_id?: string
          user_id?: string
          user_sticker_id?: string
          quantity?: number
          created_at?: string
        }
        Relationships: []
      }

      // 交換メッセージ（スタンプ）
      trade_messages: {
        Row: {
          id: string
          trade_id: string
          user_id: string
          message_type: 'stamp'
          stamp_id: string
          created_at: string
        }
        Insert: {
          id?: string
          trade_id: string
          user_id: string
          message_type: 'stamp'
          stamp_id: string
          created_at?: string
        }
        Update: {
          id?: string
          trade_id?: string
          user_id?: string
          message_type?: 'stamp'
          stamp_id?: string
          created_at?: string
        }
        Relationships: []
      }

      // フレンド関係
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          status: 'pending' | 'accepted' | 'blocked'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          status?: 'pending' | 'accepted' | 'blocked'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          status?: 'pending' | 'accepted' | 'blocked'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // 投稿
      posts: {
        Row: {
          id: string
          user_id: string
          page_id: string | null
          image_url: string | null
          caption: string | null
          hashtags: string[]
          visibility: 'public' | 'friends' | 'private'
          like_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          page_id?: string | null
          image_url?: string | null
          caption?: string | null
          hashtags?: string[]
          visibility?: 'public' | 'friends' | 'private'
          like_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          page_id?: string | null
          image_url?: string | null
          caption?: string | null
          hashtags?: string[]
          visibility?: 'public' | 'friends' | 'private'
          like_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // リアクション
      reactions: {
        Row: {
          id: string
          post_id: string
          user_id: string
          type: 'like' | 'sparkle' | 'hot' | 'cute'
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          type: 'like' | 'sparkle' | 'hot' | 'cute'
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          type?: 'like' | 'sparkle' | 'hot' | 'cute'
          created_at?: string
        }
        Relationships: []
      }

      // チャーム（マスターデータ）
      charms: {
        Row: {
          id: string
          name: string
          emoji: string
          color: string
          unlock_condition: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          emoji: string
          color: string
          unlock_condition?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          emoji?: string
          color?: string
          unlock_condition?: string | null
          created_at?: string
        }
        Relationships: []
      }

      // ユーザー所持チャーム
      user_charms: {
        Row: {
          id: string
          user_id: string
          charm_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          charm_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          charm_id?: string
          unlocked_at?: string
        }
        Relationships: []
      }

      // シール帳テーマ（マスターデータ）
      themes: {
        Row: {
          id: string
          name: string
          description: string | null
          cover_config: Json
          page_config: Json
          unlock_condition: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          cover_config: Json
          page_config: Json
          unlock_condition?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          cover_config?: Json
          page_config?: Json
          unlock_condition?: string | null
          created_at?: string
        }
        Relationships: []
      }

      // ユーザー所持テーマ
      user_themes: {
        Row: {
          id: string
          user_id: string
          theme_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme_id?: string
          unlocked_at?: string
        }
        Relationships: []
      }

      // ガチャ履歴
      gacha_history: {
        Row: {
          id: string
          user_id: string
          gacha_type: 'normal' | 'premium' | 'event' | 'collab'
          sticker_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          gacha_type: 'normal' | 'premium' | 'event' | 'collab'
          sticker_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          gacha_type?: 'normal' | 'premium' | 'event' | 'collab'
          sticker_id?: string
          created_at?: string
        }
        Relationships: []
      }

      // 通報
      reports: {
        Row: {
          id: string
          reporter_id: string
          target_type: 'user' | 'post' | 'trade'
          target_id: string
          category: 'spam' | 'inappropriate' | 'other'
          description: string | null
          status: 'pending' | 'reviewed' | 'resolved'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          target_type: 'user' | 'post' | 'trade'
          target_id: string
          category: 'spam' | 'inappropriate' | 'other'
          description?: string | null
          status?: 'pending' | 'reviewed' | 'resolved'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          target_type?: 'user' | 'post' | 'trade'
          target_id?: string
          category?: 'spam' | 'inappropriate' | 'other'
          description?: string | null
          status?: 'pending' | 'reviewed' | 'resolved'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_trade_count: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// 便利な型エイリアス
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Profile = Tables<'profiles'>
export type StickerBook = Tables<'sticker_books'>
export type StickerBookPage = Tables<'sticker_book_pages'>
export type Sticker = Tables<'stickers'>
export type UserSticker = Tables<'user_stickers'>
export type StickerPlacement = Tables<'sticker_placements'>
export type Trade = Tables<'trades'>
export type TradeItem = Tables<'trade_items'>
export type TradeMessage = Tables<'trade_messages'>
export type Friendship = Tables<'friendships'>
export type Post = Tables<'posts'>
export type Reaction = Tables<'reactions'>
export type Charm = Tables<'charms'>
export type UserCharm = Tables<'user_charms'>
export type Theme = Tables<'themes'>
export type UserTheme = Tables<'user_themes'>
export type GachaHistory = Tables<'gacha_history'>
export type Report = Tables<'reports'>
