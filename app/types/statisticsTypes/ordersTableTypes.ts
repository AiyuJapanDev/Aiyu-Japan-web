export interface OrderRow {
  id: string;
  user_id: string;
  order_personal_id: string | null;
  status: string;
  created_at: string;
  is_cancelled: boolean;
  is_rejected: boolean;
  clientName: string;
  aiyuId: string;
  country: string;
  amount: number;
  itemsCount: number;
  quoteStatus: string;
}

export type StatusFilter = "all" | "new" | "quoted" | "paid" | "purchased" | "stored" | "ready_to_ship" | "shipped" | "cancelled" | "rejected";
export type DateFilter = "all" | "today" | "week" | "month" | "year";