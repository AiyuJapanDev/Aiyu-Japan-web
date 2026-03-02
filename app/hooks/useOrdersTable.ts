import { useState, useEffect, useMemo } from "react";
import { ordersService } from "../Services/ordersTableService";
import { OrderRow, StatusFilter, DateFilter } from "../types/statisticsTypes/ordersTableTypes";

let _ordersCache: { rows: OrderRow[]; totalCount: number } | null = null;

export function useOrdersTable(refreshSignal?: number) {
  const [loading, setLoading] = useState(!_ordersCache);
  const [rows, setRows] = useState<OrderRow[]>(_ordersCache?.rows ?? []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersService.getAllOrders();
      setRows(data.rows);
      _ordersCache = {
        rows: data.rows,
        totalCount: data.count
      };
    } catch (e) {
      console.error("Hook Error (fetchOrders):", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!_ordersCache) fetchOrders();
  }, []);

  useEffect(() => {
    if (refreshSignal && refreshSignal > 0) {
      _ordersCache = null;
      fetchOrders();
    }
  }, [refreshSignal]);

  const filteredOrders = useMemo(() => {
    let result = rows;

    if (statusFilter !== "all") {
      if (statusFilter === "cancelled") {
        result = result.filter((r) => r.is_cancelled);
      } else if (statusFilter === "rejected") {
        result = result.filter((r) => r.is_rejected);
      } else {
        const labelMap: Record<string, string[]> = {
          new: ["New"],
          quoted: ["Quoted"],
          paid: ["Paid"],
          purchased: ["Purchased", "Partially Purchased", "Partial Processing"],
          stored: ["Stored", "Preparing"],
          ready_to_ship: ["Ready to Ship", "Awaiting Shipping Payment"],
          shipped: ["Shipped"],
        };
        const allowed = labelMap[statusFilter] || [];
        result = result.filter(
          (r) => allowed.includes(r.quoteStatus) && !r.is_cancelled && !r.is_rejected
        );
      }
    }

    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter((r) => {
        const d = new Date(r.created_at);
        switch (dateFilter) {
          case "today": return d.toDateString() === now.toDateString();
          case "week": {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return d >= weekAgo;
          }
          case "month":
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          case "year":
            return d.getFullYear() === now.getFullYear();
          default: return true;
        }
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          (r.order_personal_id || "").toLowerCase().includes(q) ||
          r.clientName.toLowerCase().includes(q) ||
          r.aiyuId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }

    return result;
  }, [rows, statusFilter, dateFilter, search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, dateFilter, search]);

  return {
    loading,
    rows: filteredOrders,
    search,
    statusFilter,
    dateFilter,
    page,
    setSearch,
    setStatusFilter,
    setDateFilter,
    setPage,
    
    totalCount: filteredOrders.length,
    fetchOrders
  };
}