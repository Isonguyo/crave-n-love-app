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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      catering_requests: {
        Row: {
          created_at: string
          customer_name: string
          email: string | null
          event_date: string
          extras: Json
          guests: number
          id: string
          menu_choices: string
          notes: string | null
          phone: string
          status: string
          venue_address: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          email?: string | null
          event_date: string
          extras?: Json
          guests: number
          id?: string
          menu_choices: string
          notes?: string | null
          phone: string
          status?: string
          venue_address: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          email?: string | null
          event_date?: string
          extras?: Json
          guests?: number
          id?: string
          menu_choices?: string
          notes?: string | null
          phone?: string
          status?: string
          venue_address?: string
        }
        Relationships: []
      }
      food_orders: {
        Row: {
          address: string
          created_at: string
          customer_name: string
          delivery_at: string | null
          id: string
          image_urls: Json
          items: Json
          notes: string | null
          phone: string
          status: string
          total: number
        }
        Insert: {
          address: string
          created_at?: string
          customer_name: string
          delivery_at?: string | null
          id?: string
          image_urls?: Json
          items?: Json
          notes?: string | null
          phone: string
          status?: string
          total?: number
        }
        Update: {
          address?: string
          created_at?: string
          customer_name?: string
          delivery_at?: string | null
          id?: string
          image_urls?: Json
          items?: Json
          notes?: string | null
          phone?: string
          status?: string
          total?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved: boolean
          avatar_color: string
          body: string
          created_at: string
          id: string
          name: string
          rating: number
        }
        Insert: {
          approved?: boolean
          avatar_color?: string
          body: string
          created_at?: string
          id?: string
          name: string
          rating: number
        }
        Update: {
          approved?: boolean
          avatar_color?: string
          body?: string
          created_at?: string
          id?: string
          name?: string
          rating?: number
        }
        Relationships: []
      }
      table_reservations: {
        Row: {
          created_at: string
          customer_name: string
          email: string | null
          guests: number
          id: string
          notes: string | null
          phone: string
          reservation_date: string
          reservation_time: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          email?: string | null
          guests: number
          id?: string
          notes?: string | null
          phone: string
          reservation_date: string
          reservation_time: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          email?: string | null
          guests?: number
          id?: string
          notes?: string | null
          phone?: string
          reservation_date?: string
          reservation_time?: string
          status?: string
        }
        Relationships: []
      }
      venue_requests: {
        Row: {
          created_at: string
          customer_name: string
          email: string | null
          event_date: string
          event_time: string | null
          event_type: string
          guests: number
          id: string
          notes: string | null
          phone: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          email?: string | null
          event_date: string
          event_time?: string | null
          event_type: string
          guests: number
          id?: string
          notes?: string | null
          phone: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          email?: string | null
          event_date?: string
          event_time?: string | null
          event_type?: string
          guests?: number
          id?: string
          notes?: string | null
          phone?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
