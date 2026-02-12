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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      currency_rates: {
        Row: {
          currency_code: string
          id: string
          rate_to_jpy: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          currency_code: string
          id?: string
          rate_to_jpy: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          currency_code?: string
          id?: string
          rate_to_jpy?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          order_group_id: string | null
          personal_order_id: string | null
          personal_shipping_id: string | null
          read_at: string | null
          sent_at: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          order_group_id?: string | null
          personal_order_id?: string | null
          personal_shipping_id?: string | null
          read_at?: string | null
          sent_at?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          order_group_id?: string | null
          personal_order_id?: string | null
          personal_shipping_id?: string | null
          read_at?: string | null
          sent_at?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_request_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_request_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_request_id_fkey"
            columns: ["product_request_id"]
            isOneToOne: false
            referencedRelation: "product_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cancelled_at: string | null
          created_at: string
          id: string
          is_cancelled: boolean | null
          is_rejected: boolean | null
          is_resubmitted: boolean | null
          order_personal_id: string
          parent_order_id: string | null
          rejection_details: Json | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          id?: string
          is_cancelled?: boolean | null
          is_rejected?: boolean | null
          is_resubmitted?: boolean | null
          order_personal_id?: string
          parent_order_id?: string | null
          rejection_details?: Json | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          id?: string
          is_cancelled?: boolean | null
          is_rejected?: boolean | null
          is_resubmitted?: boolean | null
          order_personal_id?: string
          parent_order_id?: string | null
          rejection_details?: Json | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_parent_order_id_fkey"
            columns: ["parent_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_requests: {
        Row: {
          created_at: string
          has_purchase_issue: boolean | null
          has_shipping_issue: boolean | null
          height: number | null
          id: string
          invoice_id: string | null
          is_box: boolean | null
          item_name: string | null
          length: number | null
          local_tracking_number: string | null
          notes: string | null
          product_url: string
          purchase_issue_description: string | null
          quantity: number
          rejection_reason: string | null
          shipping_issue_description: string | null
          status: Database["public"]["Enums"]["product_request_status"]
          updated_at: string
          user_id: string
          weight: number | null
          width: number | null
        }
        Insert: {
          created_at?: string
          has_purchase_issue?: boolean | null
          has_shipping_issue?: boolean | null
          height?: number | null
          id?: string
          invoice_id?: string | null
          is_box?: boolean | null
          item_name?: string | null
          length?: number | null
          local_tracking_number?: string | null
          notes?: string | null
          product_url: string
          purchase_issue_description?: string | null
          quantity?: number
          rejection_reason?: string | null
          shipping_issue_description?: string | null
          status?: Database["public"]["Enums"]["product_request_status"]
          updated_at?: string
          user_id: string
          weight?: number | null
          width?: number | null
        }
        Update: {
          created_at?: string
          has_purchase_issue?: boolean | null
          has_shipping_issue?: boolean | null
          height?: number | null
          id?: string
          invoice_id?: string | null
          is_box?: boolean | null
          item_name?: string | null
          length?: number | null
          local_tracking_number?: string | null
          notes?: string | null
          product_url?: string
          purchase_issue_description?: string | null
          quantity?: number
          rejection_reason?: string | null
          shipping_issue_description?: string | null
          status?: Database["public"]["Enums"]["product_request_status"]
          updated_at?: string
          user_id?: string
          weight?: number | null
          width?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string
          address_notes: string | null
          city: string | null
          country: string
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone_number: string
          postal_code: string
          state: string | null
          tax_vat_Id: string | null
          updated_at: string
          user_personal_id: string
        }
        Insert: {
          address: string
          address_notes?: string | null
          city?: string | null
          country: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone_number: string
          postal_code: string
          state?: string | null
          tax_vat_Id?: string | null
          updated_at?: string
          user_personal_id?: string
        }
        Update: {
          address?: string
          address_notes?: string | null
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string
          postal_code?: string
          state?: string | null
          tax_vat_Id?: string | null
          updated_at?: string
          user_personal_id?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_jpy: number | null
          quote_url: string
          status: Database["public"]["Enums"]["quote_status"]
          type: Database["public"]["Enums"]["quote_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_jpy?: number | null
          quote_url: string
          status?: Database["public"]["Enums"]["quote_status"]
          type: Database["public"]["Enums"]["quote_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_jpy?: number | null
          quote_url?: string
          status?: Database["public"]["Enums"]["quote_status"]
          type?: Database["public"]["Enums"]["quote_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_quotes: {
        Row: {
          actual_cost: number | null
          created_at: string
          destination: string
          estimated_cost: number | null
          id: string
          items: Json
          quote_url: string | null
          rejection_details: Json | null
          rejection_reason: string | null
          shipment_personal_id: string
          shipping_address: Json
          shipping_method: string
          status: string
          total_weight: number
          tracking_url: string | null
          tracking_urls: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_cost?: number | null
          created_at?: string
          destination: string
          estimated_cost?: number | null
          id?: string
          items: Json
          quote_url?: string | null
          rejection_details?: Json | null
          rejection_reason?: string | null
          shipment_personal_id?: string
          shipping_address: Json
          shipping_method: string
          status?: string
          total_weight: number
          tracking_url?: string | null
          tracking_urls?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_cost?: number | null
          created_at?: string
          destination?: string
          estimated_cost?: number | null
          id?: string
          items?: Json
          quote_url?: string | null
          rejection_details?: Json | null
          rejection_reason?: string | null
          shipment_personal_id?: string
          shipping_address?: Json
          shipping_method?: string
          status?: string
          total_weight?: number
          tracking_url?: string | null
          tracking_urls?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_cancel_order: { Args: { p_order_id: string }; Returns: boolean }
      cancel_order: { Args: { p_order_id: string }; Returns: boolean }
      create_order_with_product_requests: {
        Args: { p_product_requests: Json; p_user_id: string }
        Returns: {
          order_id: string
          product_request_ids: string[]
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      notify_admins_about_order: {
        Args: { p_message: string; p_order_id: string; p_type: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user" | "moderator"
      order_status:
        | "preparing"
        | "weighing"
        | "awaiting_shipping_payment"
        | "shipped"
        | "cancelled"
      product_request_status:
        | "requested"
        | "quoted"
        | "paid"
        | "purchased"
        | "received"
        | "shipping_quoted"
        | "shipping_paid"
        | "shipped"
        | "rejected"
      quote_status: "pending" | "sent" | "paid"
      quote_type: "product" | "shipping"
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
    Enums: {
      app_role: ["admin", "user", "moderator"],
      order_status: [
        "preparing",
        "weighing",
        "awaiting_shipping_payment",
        "shipped",
        "cancelled",
      ],
      product_request_status: [
        "requested",
        "quoted",
        "paid",
        "purchased",
        "received",
        "shipping_quoted",
        "shipping_paid",
        "shipped",
        "rejected",
      ],
      quote_status: ["pending", "sent", "paid"],
      quote_type: ["product", "shipping"],
    },
  },
} as const
