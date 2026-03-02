// ordersService.ts
import { supabase } from "@/integrations/supabase/client";
import { OrderRow } from "@/types/statisticsTypes/ordersTableTypes";

export const ordersService = {
  async getAllOrders(): Promise<{ rows: OrderRow[]; count: number }> {
    const { data: ordersData, error: ordersErr, count } = await supabase
      .from("orders")
      .select(`
        id, 
        user_id, 
        order_personal_id, 
        status, 
        created_at, 
        is_cancelled, 
        is_rejected,
        order_items (
          id, 
          product_requests!product_request_id (status)
        ),
        quotes (
          id, 
          price_jpy, 
          status
        )
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(5000);

    if (ordersErr) {
      console.error("Error en Supabase orders:", ordersErr);
      throw ordersErr;
    }
    
    if (!ordersData || ordersData.length === 0) {
      return { rows: [], count: 0 };
    }

    const userIds = [...new Set(ordersData.map((o) => o.user_id))];
    const { data: profiles, error: profilesErr } = await supabase
      .from("profiles")
      .select("id, full_name, country, user_personal_id")
      .in("id", userIds);

    if (profilesErr) console.error("Error fetching profiles:", profilesErr);

    const profileMap = new Map(
      (profiles || []).map((p: any) => [
        p.id,
        {
          name: p.full_name || "—",
          aiyuId: p.user_personal_id || "—",
          country: p.country || "—",
        },
      ])
    );

    const built: OrderRow[] = ordersData.map((order: any) => {
      const profile = profileMap.get(order.user_id) || {
        name: "—",
        aiyuId: "—",
        country: "—",
      };

      const quotes = order.quotes || [];
      const totalAmount = quotes.reduce(
        (sum: number, q: any) => sum + (q.price_jpy || 0),
        0
      );

      return {
        id: order.id,
        user_id: order.user_id,
        order_personal_id: order.order_personal_id,
        status: order.status,
        created_at: order.created_at,
        is_cancelled: order.is_cancelled ?? false,
        is_rejected: order.is_rejected ?? false,
        clientName: profile.name,
        aiyuId: profile.aiyuId,
        country: profile.country,
        amount: totalAmount,
        itemsCount: (order.order_items || []).length,
        quoteStatus: this._calculateQuoteStatus(order),
      };
    });

    return { rows: built, count: count ?? built.length };
  },

  _calculateQuoteStatus(order: any): string {
    if (order.is_cancelled) return "Cancelled";
    if (order.is_rejected) return "Rejected";
    if (order.status === "shipped") return "Shipped";

    const prStatuses = (order.order_items || []).map(
      (item: any) => item.product_requests?.status || "requested"
    );

    if (prStatuses.length === 0) return "New";

    const allSame = prStatuses.every((s: string) => s === prStatuses[0]);

    if (allSame) {
      switch (prStatuses[0]) {
        case "shipping_paid": return "Ready to Ship";
        case "shipping_quoted": return "Awaiting Shipping Payment";
        case "received": return "Stored";
        case "purchased": return "Purchased";
        case "paid": return "Paid";
        case "quoted": return "Quoted";
        case "requested": return "New";
        default: return "New";
      }
    }

    const hasPurchased = prStatuses.includes("purchased");
    const hasPaid = prStatuses.includes("paid");
    const hasReceived = prStatuses.includes("received");

    if (hasPurchased && hasPaid) return "Partially Purchased";
    if (hasReceived && (hasPurchased || hasPaid)) return "Partial Processing";
    if (order.status === "awaiting_shipping_payment") return "Awaiting Shipping Payment";
    if (order.status === "weighing") return "Stored";
    if (order.status === "preparing") return "Preparing";

    return "New";
  }
};