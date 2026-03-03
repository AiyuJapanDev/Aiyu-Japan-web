import { supabase } from "@/integrations/supabase/client";
import type {
  StatOrder,
  StatOrderItem,
  StatProfile,
  StatProductRequest,
  StatShippingQuote,
  StatCreditLog,
  StatQuote,
  ExactCounts,
  StatisticsRawData,
} from "@/types/statisticsTypes/statistics";

/**
 * Fetches all raw data needed for the statistics dashboard with pagination.
 * Uses pagination to ensure ALL data is retrieved.
 * Uses { count: "exact" } for accurate server-side counts.
 */
export async function fetchStatisticsData(): Promise<StatisticsRawData> {
  const PAGE_SIZE = 1000;

  // Helper to fetch all pages
  async function fetchAllPages<T>(
    queryBuilder: () => ReturnType<typeof supabase.from>,
    selectFields: string
  ): Promise<T[]> {
    let allData: T[] = [];
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await queryBuilder()
        .select(selectFields)
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching data:", error);
        break;
      }

      if (data && data.length > 0) {
        allData = allData.concat(data as T[]);
        hasMore = data.length === PAGE_SIZE;
        page++;
      } else {
        hasMore = false;
      }
    }

    return allData;
  }

  // Fetch exact counts
  const [countR1, countR2, countR3, countR4, countR6, countR7] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("product_requests").select("id", { count: "exact", head: true }),
    supabase.from("shipping_quotes").select("id", { count: "exact", head: true }),
    supabase.from("quotes").select("id", { count: "exact", head: true }),
    supabase.from("product_requests").select("id", { count: "exact", head: true }).eq("is_box", true),
  ]);

  const exactCounts: ExactCounts = {
    orders: countR1.count ?? 0,
    users: countR2.count ?? 0,
    products: countR3.count ?? 0,
    shippings: countR4.count ?? 0,
    quotes: countR6.count ?? 0,
    boxShipments: countR7.count ?? 0,
  };

  // Fetch all data with pagination
  const [orders, orderItems, users, products, shippings, creditLogs, orderQuotes] = await Promise.all([
    fetchAllPages<StatOrder>(
      () => supabase.from("orders"),
      "id, user_id, status, created_at"
    ),
    fetchAllPages<StatOrderItem>(
      () => supabase.from("order_items"),
      "id, order_id, product_request_id, created_at"
    ),
    fetchAllPages<StatProfile>(
      () => supabase.from("profiles"),
      "id, created_at, full_name, country"
    ),
    fetchAllPages<StatProductRequest>(
      () => supabase.from("product_requests"),
      "id, user_id, status, created_at, quantity, is_box"
    ),
    fetchAllPages<StatShippingQuote>(
      () => supabase.from("shipping_quotes"),
      "id, user_id, status, created_at, shipping_method, destination, total_weight, estimated_cost, actual_cost"
    ),
    fetchAllPages<StatCreditLog>(
      () => supabase.from("credit_logs" as never),
      "id, user_id, amount, reason, created_at"
    ),
    fetchAllPages<StatQuote>(
      () => supabase.from("quotes"),
      "id, order_id, status, price_jpy, created_at"
    ),
  ]);

  console.log("📊 Datos cargados:", {
    orders: orders.length,
    orderItems: orderItems.length,
    users: users.length,
    products: products.length,
    productsWithBox: products.filter(p => p.is_box === true).length,
    shippings: shippings.length,
    quotes: orderQuotes.length
  });

  return {
    orders,
    orderItems,
    users,
    products,
    shippings,
    creditLogs,
    orderQuotes,
    exactCounts,
  };
}
