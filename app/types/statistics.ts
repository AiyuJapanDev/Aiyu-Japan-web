/* ─── Statistics module types ─── */

export interface StatOrder {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
}

export interface StatProfile {
  id: string;
  created_at: string;
  full_name: string;
  country: string;
}

export interface StatProductRequest {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  quantity: number;
}

export interface StatShippingQuote {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  shipping_method: string;
  destination: string;
  total_weight: number;
  estimated_cost: number | null;
  actual_cost: number | null;
}

export interface StatQuote {
  id: string;
  order_id: string;
  status: string;
  price_jpy: number | null;
  created_at: string;
}

export interface StatCreditLog {
  id: number;
  user_id: string;
  amount: number;
  reason: string;
  created_at: string;
}

export interface ExactCounts {
  orders: number;
  users: number;
  products: number;
  shippings: number;
  quotes: number;
}

export interface StatisticsRawData {
  orders: StatOrder[];
  users: StatProfile[];
  products: StatProductRequest[];
  shippings: StatShippingQuote[];
  creditLogs: StatCreditLog[];
  orderQuotes: StatQuote[];
  exactCounts: ExactCounts;
}

/* ─── Chart data shapes ─── */

export interface MonthlyData {
  month: string;
  [key: string]: string | number;
}

export interface StatusDistribution {
  name: string;
  value: number;
}

export interface CountryData {
  country: string;
  count: number;
}

export interface WeightByCountry {
  country: string;
  weight: number;
}

export interface DestinationData {
  destination: string;
  count: number;
}

export interface ShippingMethodData {
  method: string;
  count: number;
}
