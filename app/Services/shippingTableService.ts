import { supabase } from "@/integrations/supabase/client";
import { ShippingRow } from "@/types/statisticsTypes/shippingTableTypes";

export const shippingTableService = {
  async getAllShippings(): Promise<{ rows: ShippingRow[]; count: number }> {
    const { data, error, count } = await supabase
      .from("shipping_quotes")
      .select("id, user_id, shipment_personal_id, status, destination, shipping_method, estimated_cost, actual_cost, items, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) throw error;
    if (!data || data.length === 0) return { rows: [], count: 0 };

    const userIds = [...new Set(data.map((s) => s.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, user_personal_id")
      .in("id", userIds);

    const profileMap = new Map((profiles || []).map((p: any) => [
      p.id, { name: p.full_name || "—", aiyuId: p.user_personal_id || "—" }
    ]));

    const built: ShippingRow[] = data.map((sq: any) => {
      const profile = profileMap.get(sq.user_id) || { name: "—", aiyuId: "—" };
      return {
        id: sq.id,
        user_id: sq.user_id,
        shipment_personal_id: sq.shipment_personal_id,
        status: sq.status || "pending",
        destination: sq.destination || "—",
        shipping_method: sq.shipping_method || "—",
        estimated_cost: sq.estimated_cost,
        actual_cost: sq.actual_cost,
        items: sq.items || [],
        created_at: sq.created_at,
        clientName: profile.name,
        aiyuId: profile.aiyuId,
      };
    });

    return { rows: built, count: count ?? built.length };
  }
};