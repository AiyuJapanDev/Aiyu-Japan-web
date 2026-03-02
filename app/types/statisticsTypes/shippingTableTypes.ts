// shipping.types.ts

export interface ShippingRow {
  id: string;
  user_id: string;
  shipment_personal_id: string | null;
  status: string;
  destination: string;
  shipping_method: string;
  estimated_cost: number | null;
  actual_cost: number | null;
  items: any[];
  created_at: string;
  clientName: string;
  aiyuId: string;
}

export type StatusFilter = "all" | "pending" | "paid" | "sent" | "cancelled" | "rejected";

export type DateFilter = "all" | "today" | "week" | "month" | "year";

export interface ShippingCache {
  rows: ShippingRow[];
  lastPage: number;
}