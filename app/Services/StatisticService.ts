import { supabase } from "@/integrations/supabase/client";
import type {
  StatOrder,
  StatProfile,
  StatProductRequest,
  StatShippingQuote,
  StatCreditLog,
  StatQuote,
  ExactCounts,
  StatisticsRawData,
} from "@/types/statistics";

const QUERY_LIMIT = 10000;

/**
 * Fetches all raw data needed for the statistics dashboard.
 * Uses { count: "exact" } for accurate server-side counts
 * that aren't capped by Supabase's row limit.
 */
export async function fetchStatisticsData(): Promise<StatisticsRawData> {
  const [r1, r2, r3, r4, r5, r6] = await Promise.all([
    supabase
      .from("orders")
      .select("id, user_id, status, created_at", { count: "exact" })
      .limit(QUERY_LIMIT),
    supabase
      .from("profiles")
      .select("id, created_at, full_name, country", { count: "exact" })
      .limit(QUERY_LIMIT),
    supabase
      .from("product_requests")
      .select("id, user_id, status, created_at, quantity", { count: "exact" })
      .limit(QUERY_LIMIT),
    supabase
      .from("shipping_quotes")
      .select(
        "id, user_id, status, created_at, shipping_method, destination, total_weight, estimated_cost, actual_cost",
        { count: "exact" }
      )
      .limit(QUERY_LIMIT),
    supabase
      .from("credit_logs" as any)
      .select("id, user_id, amount, reason, created_at", { count: "exact" })
      .limit(QUERY_LIMIT),
    supabase
      .from("quotes")
      .select("id, order_id, status, price_jpy, created_at", { count: "exact" })
      .limit(QUERY_LIMIT),
  ]);

  const exactCounts: ExactCounts = {
    orders: r1.count ?? r1.data?.length ?? 0,
    users: r2.count ?? r2.data?.length ?? 0,
    products: r3.count ?? r3.data?.length ?? 0,
    shippings: r4.count ?? r4.data?.length ?? 0,
    quotes: r6.count ?? r6.data?.length ?? 0,
  };

  return {
    orders: (r1.data as StatOrder[]) ?? [],
    users: (r2.data as StatProfile[]) ?? [],
    products: (r3.data as StatProductRequest[]) ?? [],
    shippings: (r4.data as unknown as StatShippingQuote[]) ?? [],
    creditLogs: (r5.data as unknown as StatCreditLog[]) ?? [],
    orderQuotes: (r6.data as unknown as StatQuote[]) ?? [],
    exactCounts,
  };
}
