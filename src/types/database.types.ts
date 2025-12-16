export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      deco_items: {
        Row: {
          base_height: number
          base_width: number
          created_at: string
          id: string
          image_url: string
          name: string
          obtain_method: string
          rarity: number
          rotatable: boolean
          type: string
          updated_at: string
        }
        Insert: {
          base_height?: number
          base_width?: number
          created_at?: string
          id: string
          image_url: string
          name: string
          obtain_method?: string
          rarity?: number
          rotatable?: boolean
          type: string
          updated_at?: string
        }
        Update: {
          base_height?: number
          base_width?: number
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          obtain_method?: string
          rarity?: number
          rotatable?: boolean
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      deco_placements: {
        Row: {
          created_at: string
          deco_item_id: string
          height: number
          id: string
          page_id: string
          position_x: number
          position_y: number
          rotation: number
          updated_at: string
          width: number
          z_index: number
        }
        Insert: {
          created_at?: string
          deco_item_id: string
          height?: number
          id?: string
          page_id: string
          position_x?: number
          position_y?: number
          rotation?: number
          updated_at?: string
          width?: number
          z_index?: number
        }
        Update: {
          created_at?: string
          deco_item_id?: string
          height?: number
          id?: string
          page_id?: string
          position_x?: number
          position_y?: number
          rotation?: number
          updated_at?: string
          width?: number
          z_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "deco_placements_deco_item_id_fkey"
            columns: ["deco_item_id"]
            isOneToOne: false
            referencedRelation: "deco_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deco_placements_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "sticker_book_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gacha_history: {
        Row: {
          created_at: string | null
          gacha_type: string
          id: string
          sticker_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          gacha_type: string
          id?: string
          sticker_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          gacha_type?: string
          id?: string
          sticker_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gacha_history_sticker_id_fkey"
            columns: ["sticker_id"]
            isOneToOne: false
            referencedRelation: "stickers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gacha_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mystery_posts: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          expires_at: string | null
          id: string
          matched_at: string | null
          matched_post_id: string | null
          message: string | null
          posted_at: string | null
          recipient_id: string | null
          sender_id: string
          status: string
          updated_at: string | null
          user_sticker_id: string
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          expires_at?: string | null
          id?: string
          matched_at?: string | null
          matched_post_id?: string | null
          message?: string | null
          posted_at?: string | null
          recipient_id?: string | null
          sender_id: string
          status?: string
          updated_at?: string | null
          user_sticker_id: string
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          expires_at?: string | null
          id?: string
          matched_at?: string | null
          matched_post_id?: string | null
          message?: string | null
          posted_at?: string | null
          recipient_id?: string | null
          sender_id?: string
          status?: string
          updated_at?: string | null
          user_sticker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mystery_posts_matched_post_id_fkey"
            columns: ["matched_post_id"]
            isOneToOne: false
            referencedRelation: "mystery_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mystery_posts_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mystery_posts_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mystery_posts_user_sticker_id_fkey"
            columns: ["user_sticker_id"]
            isOneToOne: false
            referencedRelation: "user_stickers"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          caption: string | null
          created_at: string | null
          hashtags: string[] | null
          id: string
          image_url: string | null
          like_count: number | null
          page_id: string | null
          updated_at: string | null
          user_id: string
          visibility: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          like_count?: number | null
          page_id?: string | null
          updated_at?: string | null
          user_id: string
          visibility?: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          like_count?: number | null
          page_id?: string | null
          updated_at?: string | null
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "sticker_book_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          selected_charm_id: string | null
          selected_theme_id: string | null
          star_points: number | null
          total_exp: number | null
          total_stickers: number | null
          total_trades: number | null
          tutorial_completed: boolean | null
          updated_at: string | null
          user_code: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          selected_charm_id?: string | null
          selected_theme_id?: string | null
          star_points?: number | null
          total_exp?: number | null
          total_stickers?: number | null
          total_trades?: number | null
          tutorial_completed?: boolean | null
          updated_at?: string | null
          user_code?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          selected_charm_id?: string | null
          selected_theme_id?: string | null
          star_points?: number | null
          total_exp?: number | null
          total_stickers?: number | null
          total_trades?: number | null
          tutorial_completed?: boolean | null
          updated_at?: string | null
          user_code?: string | null
          username?: string | null
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          reporter_id: string
          status: string
          target_id: string
          target_type: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          reporter_id: string
          status?: string
          target_id: string
          target_type: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          reporter_id?: string
          status?: string
          target_id?: string
          target_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sticker_book_pages: {
        Row: {
          book_id: string
          created_at: string | null
          id: string
          page_number: number
          page_type: string
          side: string | null
          spread_id: string | null
          theme_config: Json | null
          updated_at: string | null
        }
        Insert: {
          book_id: string
          created_at?: string | null
          id?: string
          page_number: number
          page_type: string
          side?: string | null
          spread_id?: string | null
          theme_config?: Json | null
          updated_at?: string | null
        }
        Update: {
          book_id?: string
          created_at?: string | null
          id?: string
          page_number?: number
          page_type?: string
          side?: string | null
          spread_id?: string | null
          theme_config?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sticker_book_pages_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "sticker_books"
            referencedColumns: ["id"]
          },
        ]
      }
      sticker_books: {
        Row: {
          created_at: string | null
          id: string
          is_public: boolean | null
          name: string
          theme_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          theme_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          theme_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sticker_books_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sticker_placements: {
        Row: {
          created_at: string | null
          id: string
          page_id: string
          position_x: number
          position_y: number
          rotation: number | null
          scale: number | null
          updated_at: string | null
          user_sticker_id: string
          z_index: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_id: string
          position_x: number
          position_y: number
          rotation?: number | null
          scale?: number | null
          updated_at?: string | null
          user_sticker_id: string
          z_index?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page_id?: string
          position_x?: number
          position_y?: number
          rotation?: number | null
          scale?: number | null
          updated_at?: string | null
          user_sticker_id?: string
          z_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sticker_placements_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "sticker_book_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sticker_placements_user_sticker_id_fkey"
            columns: ["user_sticker_id"]
            isOneToOne: false
            referencedRelation: "user_stickers"
            referencedColumns: ["id"]
          },
        ]
      }
      stickers: {
        Row: {
          base_rate: number | null
          created_at: string | null
          description: string | null
          gacha_weight: number | null
          id: string
          image_url: string
          is_limited: boolean | null
          name: string
          rarity: number
          series: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          base_rate?: number | null
          created_at?: string | null
          description?: string | null
          gacha_weight?: number | null
          id: string
          image_url: string
          is_limited?: boolean | null
          name: string
          rarity: number
          series?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          base_rate?: number | null
          created_at?: string | null
          description?: string | null
          gacha_weight?: number | null
          id?: string
          image_url?: string
          is_limited?: boolean | null
          name?: string
          rarity?: number
          series?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trade_items: {
        Row: {
          created_at: string | null
          id: string
          quantity: number | null
          trade_id: string
          user_id: string
          user_sticker_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          quantity?: number | null
          trade_id: string
          user_id: string
          user_sticker_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          quantity?: number | null
          trade_id?: string
          user_id?: string
          user_sticker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_items_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_items_user_sticker_id_fkey"
            columns: ["user_sticker_id"]
            isOneToOne: false
            referencedRelation: "user_stickers"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          message_type: string
          stamp_id: string | null
          trade_id: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          message_type?: string
          stamp_id?: string | null
          trade_id: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          message_type?: string
          stamp_id?: string | null
          trade_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_messages_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_scout_matches: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          match_details: Json | null
          match_score: number | null
          matched_at: string | null
          status: string | null
          trade_id: string | null
          updated_at: string | null
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          match_details?: Json | null
          match_score?: number | null
          matched_at?: string | null
          status?: string | null
          trade_id?: string | null
          updated_at?: string | null
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          match_details?: Json | null
          match_score?: number | null
          matched_at?: string | null
          status?: string | null
          trade_id?: string | null
          updated_at?: string | null
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_scout_matches_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "trades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_scout_matches_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_scout_matches_user2_id_fkey"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_scout_settings: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          notify_on_match: boolean | null
          offer_list: Json | null
          updated_at: string | null
          user_id: string
          want_list: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notify_on_match?: boolean | null
          offer_list?: Json | null
          updated_at?: string | null
          user_id: string
          want_list?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notify_on_match?: boolean | null
          offer_list?: Json | null
          updated_at?: string | null
          user_id?: string
          want_list?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_scout_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          status: string
          updated_at: string | null
          user1_id: string
          user2_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user1_id: string
          user2_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user1_id?: string
          user2_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_trades_user2"
            columns: ["user2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_user1_id_fkey"
            columns: ["user1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stickers: {
        Row: {
          created_at: string | null
          first_acquired_at: string | null
          id: string
          quantity: number | null
          rank: number | null
          sticker_id: string
          total_acquired: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          first_acquired_at?: string | null
          id?: string
          quantity?: number | null
          rank?: number | null
          sticker_id: string
          total_acquired?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          first_acquired_at?: string | null
          id?: string
          quantity?: number | null
          rank?: number | null
          sticker_id?: string
          total_acquired?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stickers_sticker_id_fkey"
            columns: ["sticker_id"]
            isOneToOne: false
            referencedRelation: "stickers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stickers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_my_old_trades: { Args: { p_user_id: string }; Returns: number }
      deliver_mystery_posts: { Args: never; Returns: number }
      execute_trade: { Args: { p_trade_id: string }; Returns: Json }
      find_scout_matches: {
        Args: { p_user_id: string }
        Returns: {
          match_score: number
          matched_user_id: string
          matched_user_name: string
          offers_matched: string[]
          wants_matched: string[]
        }[]
      }
      find_waiting_trades: {
        Args: { p_user_id: string }
        Returns: {
          completed_at: string | null
          created_at: string | null
          id: string
          status: string
          updated_at: string | null
          user1_id: string
          user2_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "trades"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      generate_unique_user_code: { Args: never; Returns: string }
      increment_trade_count: { Args: { p_user_id: string }; Returns: undefined }
      join_trade: {
        Args: { p_trade_id: string; p_user_id: string }
        Returns: Json
      }
      match_mystery_posts: { Args: never; Returns: number }
      search_user_by_code: {
        Args: { p_user_code: string }
        Returns: {
          avatar_url: string
          display_name: string
          id: string
          total_stickers: number
          total_trades: number
          user_code: string
        }[]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
