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
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          reason: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          action_type: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          reason?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          action_type?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          reason?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_gifts: {
        Row: {
          admin_id: string | null
          created_at: string | null
          currency_amount: number | null
          currency_type: string | null
          gift_type: string
          id: string
          item_amount: number | null
          item_id: string | null
          reason: string
          sticker_id: string | null
          sticker_rank: number | null
          target_type: string
          target_user_id: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          currency_amount?: number | null
          currency_type?: string | null
          gift_type: string
          id?: string
          item_amount?: number | null
          item_id?: string | null
          reason: string
          sticker_id?: string | null
          sticker_rank?: number | null
          target_type: string
          target_user_id?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          currency_amount?: number | null
          currency_type?: string | null
          gift_type?: string
          id?: string
          item_amount?: number | null
          item_id?: string | null
          reason?: string
          sticker_id?: string | null
          sticker_rank?: number | null
          target_type?: string
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_gifts_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_gifts_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          permissions: Json | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcement_reads: {
        Row: {
          announcement_id: string
          id: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          announcement_id: string
          id?: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          announcement_id?: string
          id?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcement_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          action_label: string | null
          action_url: string | null
          admin_id: string | null
          announcement_type: string
          content: string
          created_at: string | null
          ends_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_pinned: boolean | null
          starts_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          admin_id?: string | null
          announcement_type?: string
          content: string
          created_at?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_pinned?: boolean | null
          starts_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          admin_id?: string | null
          announcement_type?: string
          content?: string
          created_at?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_pinned?: boolean | null
          starts_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      async_trade_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message_type: string
          sender_id: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string
          sender_id: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string
          sender_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "async_trade_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "async_trade_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "async_trade_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "async_trade_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "expired_async_trade_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      async_trade_offers: {
        Row: {
          created_at: string | null
          id: string
          session_id: string
          user_id: string
          user_sticker_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_id: string
          user_id: string
          user_sticker_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          session_id?: string
          user_id?: string
          user_sticker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "async_trade_offers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "async_trade_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "async_trade_offers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "expired_async_trade_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "async_trade_offers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "async_trade_offers_user_sticker_id_fkey"
            columns: ["user_sticker_id"]
            isOneToOne: false
            referencedRelation: "user_stickers"
            referencedColumns: ["id"]
          },
        ]
      }
      async_trade_requests: {
        Row: {
          created_at: string | null
          id: string
          requester_id: string
          session_id: string
          target_user_sticker_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          requester_id: string
          session_id: string
          target_user_sticker_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          requester_id?: string
          session_id?: string
          target_user_sticker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "async_trade_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "async_trade_requests_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "async_trade_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "async_trade_requests_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "expired_async_trade_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "async_trade_requests_target_user_sticker_id_fkey"
            columns: ["target_user_sticker_id"]
            isOneToOne: false
            referencedRelation: "user_stickers"
            referencedColumns: ["id"]
          },
        ]
      }
      async_trade_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          requester_confirmed: boolean | null
          requester_confirmed_at: string | null
          requester_id: string
          responder_confirmed: boolean | null
          responder_confirmed_at: string | null
          responder_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          requester_confirmed?: boolean | null
          requester_confirmed_at?: string | null
          requester_id: string
          responder_confirmed?: boolean | null
          responder_confirmed_at?: string | null
          responder_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          requester_confirmed?: boolean | null
          requester_confirmed_at?: string | null
          requester_id?: string
          responder_confirmed?: boolean | null
          responder_confirmed_at?: string | null
          responder_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "async_trade_sessions_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "async_trade_sessions_responder_id_fkey"
            columns: ["responder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      character_rewards: {
        Row: {
          character_name: string
          created_at: string | null
          id: string
          required_count: number
          reward_type: string
          tier: number
        }
        Insert: {
          character_name: string
          created_at?: string | null
          id: string
          required_count: number
          reward_type: string
          tier: number
        }
        Update: {
          character_name?: string
          created_at?: string | null
          id?: string
          required_count?: number
          reward_type?: string
          tier?: number
        }
        Relationships: []
      }
      collection_rewards: {
        Row: {
          badge_description: string
          badge_icon: string | null
          badge_title: string
          completion_percentage: number
          created_at: string | null
          id: string
          reward_amount: number
          reward_type: string
          sort_order: number
        }
        Insert: {
          badge_description: string
          badge_icon?: string | null
          badge_title: string
          completion_percentage: number
          created_at?: string | null
          id: string
          reward_amount: number
          reward_type: string
          sort_order: number
        }
        Update: {
          badge_description?: string
          badge_icon?: string | null
          badge_title?: string
          completion_percentage?: number
          created_at?: string | null
          id?: string
          reward_amount?: number
          reward_type?: string
          sort_order?: number
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          admin_notes: string | null
          app_version: string | null
          category: string
          created_at: string | null
          device_info: Json | null
          id: string
          message: string
          status: string | null
          subject: string | null
          updated_at: string | null
          user_code: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          app_version?: string | null
          category: string
          created_at?: string | null
          device_info?: Json | null
          id?: string
          message: string
          status?: string | null
          subject?: string | null
          updated_at?: string | null
          user_code?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          app_version?: string | null
          category?: string
          created_at?: string | null
          device_info?: Json | null
          id?: string
          message?: string
          status?: string | null
          subject?: string | null
          updated_at?: string | null
          user_code?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      daily_missions: {
        Row: {
          created_at: string | null
          description: string
          difficulty: string
          goal: number
          id: string
          is_active: boolean
          reward_amount: number
          reward_type: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          difficulty?: string
          goal: number
          id: string
          is_active?: boolean
          reward_amount: number
          reward_type: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          difficulty?: string
          goal?: number
          id?: string
          is_active?: boolean
          reward_amount?: number
          reward_type?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
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
      device_tokens: {
        Row: {
          created_at: string | null
          id: string
          platform: string
          token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform: string
          token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string
          token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      login_bonus_history: {
        Row: {
          claimed: boolean
          claimed_at: string | null
          consecutive_days: number
          created_at: string | null
          id: string
          login_date: string
          reward_amount: number
          reward_day: number
          reward_description: string | null
          reward_type: string
          user_id: string
        }
        Insert: {
          claimed?: boolean
          claimed_at?: string | null
          consecutive_days: number
          created_at?: string | null
          id?: string
          login_date?: string
          reward_amount: number
          reward_day: number
          reward_description?: string | null
          reward_type: string
          user_id: string
        }
        Update: {
          claimed?: boolean
          claimed_at?: string | null
          consecutive_days?: number
          created_at?: string | null
          id?: string
          login_date?: string
          reward_amount?: number
          reward_day?: number
          reward_description?: string | null
          reward_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "login_bonus_history_user_id_fkey"
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
      notification_settings: {
        Row: {
          contests: boolean | null
          created_at: string | null
          friend_requests: boolean | null
          id: string
          new_stickers: boolean | null
          trade_requests: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contests?: boolean | null
          created_at?: string | null
          friend_requests?: boolean | null
          id?: string
          new_stickers?: boolean | null
          trade_requests?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contests?: boolean | null
          created_at?: string | null
          friend_requests?: boolean | null
          id?: string
          new_stickers?: boolean | null
          trade_requests?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          data: Json | null
          id: string
          push_sent: boolean | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          data?: Json | null
          id?: string
          push_sent?: boolean | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          data?: Json | null
          id?: string
          push_sent?: boolean | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          post_id: string
          reply_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id: string
          reply_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id?: string
          reply_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          caption: string | null
          comment_count: number | null
          created_at: string | null
          hashtags: string[] | null
          id: string
          image_url: string | null
          like_count: number | null
          page_id: string | null
          page_snapshot: Json | null
          updated_at: string | null
          user_id: string
          visibility: string
        }
        Insert: {
          caption?: string | null
          comment_count?: number | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          like_count?: number | null
          page_id?: string | null
          page_snapshot?: Json | null
          updated_at?: string | null
          user_id: string
          visibility?: string
        }
        Update: {
          caption?: string | null
          comment_count?: number | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          like_count?: number | null
          page_id?: string | null
          page_snapshot?: Json | null
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
          drops: number | null
          exp_daily_counts: Json | null
          id: string
          is_suspended: boolean | null
          last_seen_at: string | null
          preshiru: number | null
          selected_charm_id: string | null
          selected_frame_id: string | null
          selected_theme_id: string | null
          silchike: number | null
          star_points: number | null
          suspended_until: string | null
          suspension_reason: string | null
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
          drops?: number | null
          exp_daily_counts?: Json | null
          id?: string
          is_suspended?: boolean | null
          last_seen_at?: string | null
          preshiru?: number | null
          selected_charm_id?: string | null
          selected_frame_id?: string | null
          selected_theme_id?: string | null
          silchike?: number | null
          star_points?: number | null
          suspended_until?: string | null
          suspension_reason?: string | null
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
          drops?: number | null
          exp_daily_counts?: Json | null
          id?: string
          is_suspended?: boolean | null
          last_seen_at?: string | null
          preshiru?: number | null
          selected_charm_id?: string | null
          selected_frame_id?: string | null
          selected_theme_id?: string | null
          silchike?: number | null
          star_points?: number | null
          suspended_until?: string | null
          suspension_reason?: string | null
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
          action_taken: string | null
          admin_id: string | null
          admin_notes: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          reporter_id: string
          resolved_at: string | null
          status: string
          target_id: string
          target_type: string
          updated_at: string | null
        }
        Insert: {
          action_taken?: string | null
          admin_id?: string | null
          admin_notes?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          reporter_id: string
          resolved_at?: string | null
          status?: string
          target_id: string
          target_type: string
          updated_at?: string | null
        }
        Update: {
          action_taken?: string | null
          admin_id?: string | null
          admin_notes?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          reporter_id?: string
          resolved_at?: string | null
          status?: string
          target_id?: string
          target_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      series_rewards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          required_count: number
          reward_amount: number | null
          reward_type: string
          reward_value: string | null
          series: string
          tier: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          required_count: number
          reward_amount?: number | null
          reward_type: string
          reward_value?: string | null
          series: string
          tier: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          required_count?: number
          reward_amount?: number | null
          reward_type?: string
          reward_value?: string | null
          series?: string
          tier?: number
        }
        Relationships: []
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
          cover_design_id: string | null
          created_at: string | null
          id: string
          is_public: boolean | null
          name: string
          theme_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_design_id?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          theme_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_design_id?: string | null
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
      sticker_collection: {
        Row: {
          created_at: string | null
          first_acquired_at: string | null
          id: string
          sticker_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          first_acquired_at?: string | null
          id?: string
          sticker_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          first_acquired_at?: string | null
          id?: string
          sticker_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sticker_collection_sticker_id_fkey"
            columns: ["sticker_id"]
            isOneToOne: false
            referencedRelation: "stickers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sticker_collection_user_id_fkey"
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
      sticker_upgrade_history: {
        Row: {
          consumed_quantity: number
          from_rank: number
          id: string
          sticker_id: string
          to_rank: number
          upgraded_at: string | null
          user_id: string
        }
        Insert: {
          consumed_quantity: number
          from_rank: number
          id?: string
          sticker_id: string
          to_rank: number
          upgraded_at?: string | null
          user_id: string
        }
        Update: {
          consumed_quantity?: number
          from_rank?: number
          id?: string
          sticker_id?: string
          to_rank?: number
          upgraded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sticker_upgrade_history_sticker_id_fkey"
            columns: ["sticker_id"]
            isOneToOne: false
            referencedRelation: "stickers"
            referencedColumns: ["id"]
          },
        ]
      }
      stickers: {
        Row: {
          base_rate: number | null
          character: string | null
          created_at: string | null
          description: string | null
          gacha_weight: number | null
          id: string
          image_url: string
          is_limited: boolean | null
          name: string
          rarity: number
          series: string | null
          sticker_type: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          base_rate?: number | null
          character?: string | null
          created_at?: string | null
          description?: string | null
          gacha_weight?: number | null
          id: string
          image_url: string
          is_limited?: boolean | null
          name: string
          rarity: number
          series?: string | null
          sticker_type?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          base_rate?: number | null
          character?: string | null
          created_at?: string | null
          description?: string | null
          gacha_weight?: number | null
          id?: string
          image_url?: string
          is_limited?: boolean | null
          name?: string
          rarity?: number
          series?: string | null
          sticker_type?: string | null
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
      user_achievements: {
        Row: {
          achievement_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string | null
          id: string
          reason: string | null
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_character_rewards: {
        Row: {
          character_name: string
          claimed_at: string | null
          id: string
          tier: number
          user_id: string
        }
        Insert: {
          character_name: string
          claimed_at?: string | null
          id?: string
          tier: number
          user_id: string
        }
        Update: {
          character_name?: string
          claimed_at?: string | null
          id?: string
          tier?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_character_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_collection_rewards: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          id: string
          reward_id: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          reward_id: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_collection_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "collection_rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_collection_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_daily_missions: {
        Row: {
          claimed: boolean
          completed_at: string | null
          created_at: string | null
          date: string
          id: string
          is_completed: boolean
          mission_id: string
          progress: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          claimed?: boolean
          completed_at?: string | null
          created_at?: string | null
          date?: string
          id?: string
          is_completed?: boolean
          mission_id: string
          progress?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          claimed?: boolean
          completed_at?: string | null
          created_at?: string | null
          date?: string
          id?: string
          is_completed?: boolean
          mission_id?: string
          progress?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_daily_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "daily_missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_daily_missions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitation_codes: {
        Row: {
          created_at: string | null
          id: string
          invitation_code: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invitation_code: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invitation_code?: string
          user_id?: string
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          created_at: string | null
          id: string
          invitation_code: string
          invitee_id: string
          invitee_reward_claimed: boolean | null
          inviter_id: string
          inviter_reward_claimed: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invitation_code: string
          invitee_id: string
          invitee_reward_claimed?: boolean | null
          inviter_id: string
          inviter_reward_claimed?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invitation_code?: string
          invitee_id?: string
          invitee_reward_claimed?: boolean | null
          inviter_id?: string
          inviter_reward_claimed?: boolean | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          badges: Json | null
          created_at: string | null
          exp: number
          level: number
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          badges?: Json | null
          created_at?: string | null
          exp?: number
          level?: number
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          badges?: Json | null
          created_at?: string | null
          exp?: number
          level?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_review_rewards: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          id: string
          platform: string
          reward_claimed: boolean | null
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          platform: string
          reward_claimed?: boolean | null
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          platform?: string
          reward_claimed?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_series_rewards: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          id: string
          reward_id: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          reward_id: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          id?: string
          reward_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_series_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "series_rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_series_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sticker_achievements: {
        Row: {
          created_at: string | null
          first_gold_at: string | null
          first_prism_at: string | null
          first_silver_at: string | null
          id: string
          max_upgrade_rank: number | null
          sticker_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          first_gold_at?: string | null
          first_prism_at?: string | null
          first_silver_at?: string | null
          id?: string
          max_upgrade_rank?: number | null
          sticker_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          first_gold_at?: string | null
          first_prism_at?: string | null
          first_silver_at?: string | null
          id?: string
          max_upgrade_rank?: number | null
          sticker_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sticker_achievements_sticker_id_fkey"
            columns: ["sticker_id"]
            isOneToOne: false
            referencedRelation: "stickers"
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
          upgrade_rank: number | null
          upgraded_at: string | null
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
          upgrade_rank?: number | null
          upgraded_at?: string | null
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
          upgrade_rank?: number | null
          upgraded_at?: string | null
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
      user_suspensions: {
        Row: {
          admin_id: string | null
          created_at: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          reason: string
          related_report_id: string | null
          starts_at: string | null
          suspension_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          reason: string
          related_report_id?: string | null
          starts_at?: string | null
          suspension_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          reason?: string
          related_report_id?: string | null
          starts_at?: string | null
          suspension_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_suspensions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_suspensions_related_report_id_fkey"
            columns: ["related_report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_suspensions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_unlocked_covers: {
        Row: {
          cover_id: string
          created_at: string | null
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          cover_id: string
          created_at?: string | null
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          cover_id?: string
          created_at?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_unlocked_covers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_unlocked_icons: {
        Row: {
          created_at: string | null
          icon_id: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          icon_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          icon_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_unlocked_icons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_unlocked_titles: {
        Row: {
          created_at: string | null
          id: string
          title_id: string
          title_name: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title_id: string
          title_name: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title_id?: string
          title_name?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_unlocked_titles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      expired_async_trade_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string | null
          requester_confirmed: boolean | null
          requester_confirmed_at: string | null
          requester_id: string | null
          responder_confirmed: boolean | null
          responder_confirmed_at: string | null
          responder_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string | null
          requester_confirmed?: boolean | null
          requester_confirmed_at?: string | null
          requester_id?: string | null
          responder_confirmed?: boolean | null
          responder_confirmed_at?: string | null
          responder_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string | null
          requester_confirmed?: boolean | null
          requester_confirmed_at?: string | null
          requester_id?: string | null
          responder_confirmed?: boolean | null
          responder_confirmed_at?: string | null
          responder_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "async_trade_sessions_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "async_trade_sessions_responder_id_fkey"
            columns: ["responder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_invitation_counts: {
        Row: {
          invitation_count: number | null
          inviter_id: string | null
          month: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_user_exp: {
        Args: {
          p_action_type?: string
          p_exp_amount: number
          p_user_id: string
        }
        Returns: Json
      }
      admin_grant_currency: {
        Args: {
          p_admin_id: string
          p_amount: number
          p_currency_type: string
          p_reason: string
          p_target_user_id: string
        }
        Returns: boolean
      }
      admin_grant_currency_to_all: {
        Args: {
          p_admin_id: string
          p_amount: number
          p_currency_type: string
          p_reason: string
        }
        Returns: number
      }
      admin_grant_sticker: {
        Args: {
          p_admin_id: string
          p_quantity?: number
          p_rank?: number
          p_reason?: string
          p_sticker_id: string
          p_target_user_id: string
        }
        Returns: boolean
      }
      apply_exp_action: {
        Args: { p_action_type: string; p_user_id: string }
        Returns: Json
      }
      apply_invitation: {
        Args: { p_invitation_code: string; p_invitee_id: string }
        Returns: Json
      }
      award_post_like_exp: {
        Args: { p_actor_id: string; p_post_id: string }
        Returns: Json
      }
      calculate_consecutive_days: {
        Args: { p_user_id: string }
        Returns: number
      }
      claim_collection_reward:
        | { Args: { p_reward_id: string; p_user_id: string }; Returns: Json }
        | { Args: { p_reward_id: string; p_user_id: string }; Returns: Json }
      claim_daily_mission_reward:
        | { Args: { p_mission_id: string; p_user_id: string }; Returns: Json }
        | { Args: { p_mission_id: string; p_user_id: string }; Returns: Json }
      claim_invitee_reward: { Args: { p_user_id: string }; Returns: Json }
      claim_inviter_reward: {
        Args: { p_invitation_id: string; p_user_id: string }
        Returns: Json
      }
      claim_review_reward: {
        Args: { p_platform: string; p_user_id: string }
        Returns: Json
      }
      cleanup_my_old_trades: { Args: { p_user_id: string }; Returns: number }
      complete_async_trade_session: {
        Args: { p_session_id: string }
        Returns: boolean
      }
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
      generate_invitation_code: { Args: never; Returns: string }
      generate_unique_user_code: { Args: never; Returns: string }
      get_collection_completion_rate: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_collection_rewards_status: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_invitation_list: { Args: { p_user_id: string }; Returns: Json }
      get_invitation_stats: { Args: { p_user_id: string }; Returns: Json }
      get_login_bonus_reward: {
        Args: { day: number }
        Returns: {
          reward_amount: number
          reward_description: string
          reward_type: string
        }[]
      }
      get_or_create_invitation_code: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_or_create_user_progress: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_review_reward_status: { Args: { p_user_id: string }; Returns: Json }
      get_today_missions: { Args: { p_user_id: string }; Returns: Json }
      get_unclaimed_collection_rewards: {
        Args: { p_user_id: string }
        Returns: {
          badge_description: string
          badge_icon: string
          badge_title: string
          completion_percentage: number
          current_completion: number
          reward_amount: number
          reward_id: string
          reward_type: string
        }[]
      }
      get_user_simple_stats: { Args: { p_user_id: string }; Returns: Json }
      get_user_stats: { Args: { p_user_id: string }; Returns: Json }
      increment_trade_count: { Args: { p_user_id: string }; Returns: undefined }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { check_user_id: string }; Returns: boolean }
      is_mutually_blocked: {
        Args: { user1_id: string; user2_id: string }
        Returns: boolean
      }
      is_user_blocked: {
        Args: { checker_id: string; target_id: string }
        Returns: boolean
      }
      is_user_suspended: { Args: { check_user_id: string }; Returns: boolean }
      join_trade: {
        Args: { p_trade_id: string; p_user_id: string }
        Returns: Json
      }
      match_mystery_posts: { Args: never; Returns: number }
      record_daily_login: { Args: { p_user_id: string }; Returns: Json }
      record_gacha_pull: {
        Args: { p_pull_count?: number; p_user_id: string }
        Returns: Json
      }
      record_reaction: { Args: { p_user_id: string }; Returns: Json }
      record_sticker_book_save: { Args: { p_user_id: string }; Returns: Json }
      record_timeline_post: { Args: { p_user_id: string }; Returns: Json }
      record_trade_complete: { Args: { p_user_id: string }; Returns: Json }
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
      update_daily_mission_progress: {
        Args: {
          p_increment?: number
          p_mission_type: string
          p_user_id: string
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
  public: {
    Enums: {},
  },
} as const

// Convenience type exports for commonly used tables
export type UserSticker = Tables<'user_stickers'>
export type Sticker = Tables<'stickers'>
export type Profile = Tables<'profiles'>
export type Trade = Tables<'trades'>
export type TradeItem = Tables<'trade_items'>
export type TradeMessage = Tables<'trade_messages'>
export type Post = Tables<'posts'>
export type Reaction = Tables<'reactions'>
