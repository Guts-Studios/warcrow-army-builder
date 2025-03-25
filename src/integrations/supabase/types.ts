export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      army_lists: {
        Row: {
          created_at: string
          faction: string
          id: string
          name: string
          units: Json
          updated_at: string
          user_id: string | null
          wab_id: string | null
        }
        Insert: {
          created_at?: string
          faction: string
          id?: string
          name: string
          units: Json
          updated_at?: string
          user_id?: string | null
          wab_id?: string | null
        }
        Update: {
          created_at?: string
          faction?: string
          id?: string
          name?: string
          units?: Json
          updated_at?: string
          user_id?: string | null
          wab_id?: string | null
        }
        Relationships: []
      }
      friendships: {
        Row: {
          created_at: string | null
          id: string
          recipient_id: string
          sender_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipient_id: string
          sender_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipient_id?: string
          sender_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "friendships_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_history: {
        Row: {
          created_at: string | null
          id: string
          opponent_name: string | null
          played_at: string | null
          updated_at: string | null
          user_id: string | null
          won: boolean
        }
        Insert: {
          created_at?: string | null
          id?: string
          opponent_name?: string | null
          played_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          won: boolean
        }
        Update: {
          created_at?: string | null
          id?: string
          opponent_name?: string | null
          played_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          won?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          read: boolean | null
          recipient_id: string
          sender_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id: string
          sender_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          read?: boolean | null
          recipient_id?: string
          sender_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
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
          created_at: string
          favorite_faction: string | null
          games_lost: number | null
          games_won: number | null
          id: string
          location: string | null
          social_discord: string | null
          social_twitter: string | null
          tester: boolean
          updated_at: string
          username: string | null
          wab_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          favorite_faction?: string | null
          games_lost?: number | null
          games_won?: number | null
          id: string
          location?: string | null
          social_discord?: string | null
          social_twitter?: string | null
          tester?: boolean
          updated_at?: string
          username?: string | null
          wab_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          favorite_faction?: string | null
          games_lost?: number | null
          games_won?: number | null
          id?: string
          location?: string | null
          social_discord?: string | null
          social_twitter?: string | null
          tester?: boolean
          updated_at?: string
          username?: string | null
          wab_id?: string
        }
        Relationships: []
      }
      rules_chapters: {
        Row: {
          created_at: string
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_index: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      rules_sections: {
        Row: {
          chapter_id: string
          content: string
          created_at: string
          id: string
          mission_details: string | null
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          chapter_id: string
          content: string
          created_at?: string
          id?: string
          mission_details?: string | null
          order_index: number
          title: string
          updated_at?: string
        }
        Update: {
          chapter_id?: string
          content?: string
          created_at?: string
          id?: string
          mission_details?: string | null
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rules_sections_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "rules_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_wab_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_wap_id: {
        Args: Record<PropertyKey, never>
        Returns: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
