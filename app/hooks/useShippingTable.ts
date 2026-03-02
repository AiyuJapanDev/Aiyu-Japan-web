import { useState, useEffect, useMemo, useRef } from "react";
import { shippingTableService } from "@/Services/shippingTableService";
import { ShippingRow, StatusFilter, DateFilter } from "@/types/statisticsTypes/shippingTableTypes";

const CACHE_KEY = "shipping_list_cache";

export function useShippingTable(refreshSignal?: number) {
  const getSaved = () => {
    if (typeof window === "undefined") return null;
    const s = localStorage.getItem(CACHE_KEY);
    return s ? JSON.parse(s) : null;
  };

  const initial = getSaved();
  const [loading, setLoading] = useState(!initial);
  const [rows, setRows] = useState<ShippingRow[]>(initial?.rows ?? []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [page, setPage] = useState(initial?.lastPage ?? 1);
  const isFirstRender = useRef(true);

  const fetchShippings = async () => {
    setLoading(true);
    try {
      const data = await shippingTableService.getAllShippings();
      setRows(data.rows);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ 
        rows: data.rows, 
        lastPage: page 
      }));
    } catch (e) {
      console.error("Error en fetchShippings:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const curr = getSaved() || {};
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...curr, lastPage: page }));
  }, [page]);

  useEffect(() => {
    if (rows.length === 0 || (refreshSignal && refreshSignal > 0)) {
      fetchShippings();
    }
  }, [refreshSignal]);

  const filtered = useMemo(() => {
    let result = rows;

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
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
          r.id.toLowerCase().includes(q) ||
          (r.shipment_personal_id || "").toLowerCase().includes(q) ||
          r.clientName.toLowerCase().includes(q) ||
          r.aiyuId.toLowerCase().includes(q)
      );
    }

    return result;
  }, [rows, statusFilter, dateFilter, search]);

  // 4. Resetear página al filtrar (Protegido por useRef)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (rows.length > 0) {
      setPage(1);
    }
  }, [statusFilter, dateFilter, search]);

  return { 
    loading, 
    rows: filtered, 
    totalCount: filtered.length,
    search, setSearch, 
    statusFilter, setStatusFilter, 
    dateFilter, setDateFilter, 
    page, setPage,
    fetchShippings 
  };
}