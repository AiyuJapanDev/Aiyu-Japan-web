export type ProductRequestStatus = 'requested' | 'quoted' | 'paid' | 'purchased' | 'received' | 'shipping_quoted' | 'shipping_paid' | 'shipped' | 'rejected';
export type QuoteType = 'product' | 'shipping';
export type QuoteStatus = 'pending' | 'sent' | 'paid';
export type OrderStatus = 'preparing' | 'weighing' | 'awaiting_shipping_payment' | 'shipped';

export interface ProductRequest {
  id: string;
  user_id: string;
  product_url: string;
  item_name?: string;
  quantity?: number;
  notes?: string;
  status: ProductRequestStatus;
  rejection_reason?: string;
  has_purchase_issue?: boolean;
  purchase_issue_description?: string;
  has_shipping_issue?: boolean;
  shipping_issue_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Quote {
  id: string;
  type: QuoteType;
  product_request_id?: string;
  order_id?: string;
  price_jpy: number;
  status: QuoteStatus;
  quote_url: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  quote_id: string;
  paypal_invoice_id?: string;
  amount_paid: number;
  paid_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  tracking_number?: string;
  shipped_at?: string;
  created_at: string;
  updated_at: string;
  order_personal_id?: string;
  rejection_details?: {
    rejection_reason: string;
    rejected_at: string;
    product_issues: Array<{
      product_id: string;
      product_url: string;
      item_name?: string;
      quantity?: number;
      has_issue: boolean;
      issue_description?: string;
    }>;
  };
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_request_id: string;
  created_at: string;
}