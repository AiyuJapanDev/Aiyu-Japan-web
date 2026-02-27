import { useState, useEffect, useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

/* ─── types ─── */
interface OrderRow {
  id: string;
  user_id: string;
  order_personal_id: string | null;
  status: string;
  created_at: string;
  is_cancelled: boolean;
  is_rejected: boolean;
  /* joined */
  clientName: string;
  aiyuId: string;
  country: string;
  amount: number;
  itemsCount: number;
  quoteStatus: string;
}

type StatusFilter = "all" | "new" | "quoted" | "paid" | "purchased" | "stored" | "ready_to_ship" | "shipped" | "cancelled" | "rejected";
type DateFilter = "all" | "today" | "week" | "month" | "year";

const STATUS_BADGES: Record<string, { bg: string; text: string; labelKey: string }> = {
  "New": { bg: "bg-amber-100", text: "text-red-500", labelKey: "statusRequested" },
  "Quoted": { bg: "bg-yellow-100", text: "text-yellow-600", labelKey: "statusQuoted" },
  "Paid": { bg: "bg-emerald-100", text: "text-emerald-600", labelKey: "statusPaid" },
  "Purchased": { bg: "bg-orange-100", text: "text-orange-600", labelKey: "statusAllPurchased" },
  "Partially Purchased": { bg: "bg-orange-100", text: "text-orange-600", labelKey: "statusSomePurchased" },
  "Partial Processing": { bg: "bg-indigo-100", text: "text-indigo-600", labelKey: "statusSomePurchased" },
  "Preparing": { bg: "bg-purple-100", text: "text-purple-600", labelKey: "inTransit" },
  "Stored": { bg: "bg-sky-100", text: "text-sky-600", labelKey: "inStorage" },
  "Awaiting Shipping Payment": { bg: "bg-amber-100", text: "text-amber-600", labelKey: "statsStatusAwaitingShipping" },
  "Ready to Ship": { bg: "bg-teal-100", text: "text-teal-600", labelKey: "statusAllAtWarehouse" },
  "Shipped": { bg: "bg-cyan-100", text: "text-cyan-600", labelKey: "statusShipped" },
  "Rejected": { bg: "bg-red-100", text: "text-red-600", labelKey: "statusRejected" },
  "Cancelled": { bg: "bg-gray-100", text: "text-gray-500", labelKey: "statusCancelled" },
};

const ITEMS_PER_PAGE = 7;

/* ─── module-level cache (persists across tab switches, resets on F5) ─── */
let _ordersCache: { rows: OrderRow[]; totalCount: number } | null = null;

interface OrdersListTableProps {
  refreshSignal?: number;
}

export default function OrdersListTable({ refreshSignal }: OrdersListTableProps) {
  const { t } = useApp();
  const [loading, setLoading] = useState(!_ordersCache);
  const [rows, setRows] = useState<OrderRow[]>(_ordersCache?.rows ?? []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(_ordersCache?.totalCount ?? 0);

  useEffect(() => {
    if (!_ordersCache) fetchOrders();
  }, []);

  // Re-fetch when parent signals a refresh
  useEffect(() => {
    if (refreshSignal && refreshSignal > 0) {
      _ordersCache = null;
      fetchOrders();
    }
  }, [refreshSignal]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // 1) Fetch orders with order_items count and quotes
      const { data: ordersData, error: ordersErr, count } = await supabase
        .from("orders")
        .select(
          `
          id, user_id, order_personal_id, status, created_at, is_cancelled, is_rejected,
          order_items (id, product_requests!product_request_id (status)),
          quotes (id, price_jpy, status)
        `,
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .limit(5000);

      if (ordersErr) throw ordersErr;
      setTotalCount(count ?? ordersData?.length ?? 0);

      if (!ordersData || ordersData.length === 0) {
        setRows([]);
        setLoading(false);
        return;
      }

      // 2) Fetch profiles for user info
      const userIds = [...new Set(ordersData.map((o) => o.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, country, user_personal_id" as any)
        .in("id", userIds);

      const profileMap = new Map(
        (profiles || []).map((p: any) => [
          p.id,
          {
            name: p.full_name || "—",
            aiyuId: p.user_personal_id || "—",
            country: p.country || "—",
          },
        ]),
      );

      // 3) Build rows
      const built: OrderRow[] = ordersData.map((order: any) => {
        const profile = profileMap.get(order.user_id) || {
          name: "—",
          aiyuId: "—",
          country: "—",
        };

        const quotes = order.quotes || [];
        const totalAmount = quotes.reduce(
          (sum: number, q: any) => sum + (q.price_jpy || 0),
          0,
        );

        // Determine effective status (mirrors getOrderStatus from ProductRequestsManagement)
        let quoteStatus = "New";
        if (order.is_cancelled) {
          quoteStatus = "Cancelled";
        } else if (order.is_rejected) {
          quoteStatus = "Rejected";
        } else if (order.status === "shipped") {
          quoteStatus = "Shipped";
        } else {
          const prStatuses = (order.order_items || []).map(
            (item: any) => item.product_requests?.status || "requested",
          );
          const allSame = prStatuses.length > 0 && prStatuses.every((s: string) => s === prStatuses[0]);

          if (allSame && prStatuses[0]) {
            switch (prStatuses[0]) {
              case "shipping_paid": quoteStatus = "Ready to Ship"; break;
              case "shipping_quoted": quoteStatus = "Awaiting Shipping Payment"; break;
              case "received": quoteStatus = "Stored"; break;
              case "purchased": quoteStatus = "Purchased"; break;
              case "paid": quoteStatus = "Paid"; break;
              case "quoted": quoteStatus = "Quoted"; break;
              case "requested": quoteStatus = "New"; break;
            }
          } else {
            const hasPurchased = prStatuses.includes("purchased");
            const hasPaid = prStatuses.includes("paid");
            const hasReceived = prStatuses.includes("received");

            if (hasPurchased && hasPaid) quoteStatus = "Partially Purchased";
            else if (hasReceived && (hasPurchased || hasPaid)) quoteStatus = "Partial Processing";
            else if (order.status === "awaiting_shipping_payment") quoteStatus = "Awaiting Shipping Payment";
            else if (order.status === "weighing") quoteStatus = "Stored";
            else if (order.status === "preparing") quoteStatus = "Preparing";
            else quoteStatus = "New";
          }
        }

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
          quoteStatus,
        };
      });

      setRows(built);
      _ordersCache = { rows: built, totalCount: count ?? built.length };
    } catch (e) {
      console.error("Error fetching orders:", e);
    } finally {
      setLoading(false);
    }
  };

  /* ── filtering ── */
  const filtered = useMemo(() => {
    let result = rows;

    // Status filter
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
          (r) => allowed.includes(r.quoteStatus) && !r.is_cancelled && !r.is_rejected,
        );
      }
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter((r) => {
        const d = new Date(r.created_at);
        switch (dateFilter) {
          case "today":
            return d.toDateString() === now.toDateString();
          case "week": {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return d >= weekAgo;
          }
          case "month":
            return (
              d.getMonth() === now.getMonth() &&
              d.getFullYear() === now.getFullYear()
            );
          case "year":
            return d.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          (r.order_personal_id || "").toLowerCase().includes(q) ||
          r.clientName.toLowerCase().includes(q) ||
          r.aiyuId.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }

    return result;
  }, [rows, statusFilter, dateFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, dateFilter, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-1">{t("statsOrderList")}</h3>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 mt-3">
        <Select
          value={statusFilter}
          onValueChange={(v: any) => setStatusFilter(v)}
        >
          <SelectTrigger className="flex-1 rounded-xl border-blue-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("statsAllStatuses")}</SelectItem>
            <SelectItem value="new">{t("statusStepRequestSubmitted")}</SelectItem>
            <SelectItem value="quoted">{t("statusQuoted")}</SelectItem>
            <SelectItem value="paid">{t("statusPaid")}</SelectItem>
            <SelectItem value="purchased">{t("statusAllPurchased")}</SelectItem>
            <SelectItem value="stored">{t("inStorage")}</SelectItem>
            <SelectItem value="cancelled">{t("statusCancelled")}</SelectItem>
            <SelectItem value="rejected">{t("statusRejected")}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={dateFilter}
          onValueChange={(v: any) => setDateFilter(v)}
        >
          <SelectTrigger className="flex-1 rounded-xl border-blue-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("statsDateAll")}</SelectItem>
            <SelectItem value="today">{t("statsToday")}</SelectItem>
            <SelectItem value="week">{t("statsLast7Days")}</SelectItem>
            <SelectItem value="month">{t("statsThisMonthFilter")}</SelectItem>
            <SelectItem value="year">{t("statsThisYear")}</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={t("statsSearchOrdersPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-blue-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("statsOrderId")}
              </th>
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("statsAiyuId")}
              </th>
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("statsClientName")}
              </th>
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("statsCountry")}
              </th>
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("statsDate")}
              </th>
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("statsStatus")}
              </th>
              <th className="text-right py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("statsAmount")}
              </th>
              <th className="text-right py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t("statsItemsCount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => {
              const badge = STATUS_BADGES[row.quoteStatus] || STATUS_BADGES["New"];
              const dateStr = new Date(row.created_at).toLocaleDateString(t("language") === "es" ? "es-ES" : "en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3 px-3 font-medium text-slate-700 uppercase">
                    {row.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-blue-600 font-medium">
                      #{row.aiyuId}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{row.clientName}</td>
                  <td className="py-3 px-3 text-slate-600">{row.country}</td>
                  <td className="py-3 px-3 text-slate-500 tabular-nums">
                    {dateStr}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}
                    >
                      {t(badge.labelKey as any)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-700 tabular-nums">
                    ¥{row.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600 tabular-nums">
                    {row.itemsCount}
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-12 text-center text-sm text-slate-400 italic"
                >
                  {t("statsNoOrdersFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: count + pagination */}
{/* Footer: count + pagination */}
<div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
  {/* Texto informativo: centrado en móvil, izquierda en desktop */}
  <p className="text-[10px] sm:text-xs text-blue-500 font-medium order-2 sm:order-1">
    {t("statsShowing")} {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-
    {Math.min(page * ITEMS_PER_PAGE, filtered.length)} {t("statsOf")}{" "}
    {filtered.length.toLocaleString()} {t("statsOrdersUnit")}
  </p>

  {/* Controles de paginación: orden 1 en móvil para estar arriba */}
  <div className="flex items-center gap-1 order-1 sm:order-2">
    <Button
      variant="outline"
      size="sm"
      className="h-8 px-2 sm:px-3 text-[10px] sm:text-xs rounded-lg"
      disabled={page <= 1}
      onClick={() => setPage((p) => p - 1)}
    >
      <span className="hidden sm:inline">{t("statsPrevious")}</span>
      <span className="sm:hidden">←</span>
    </Button>

    <div className="hidden sm:flex items-center gap-1">
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
        let pageNum: number;
        if (totalPages <= 5) pageNum = i + 1;
        else if (page <= 3) pageNum = i + 1;
        else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
        else pageNum = page - 2 + i;

        return (
          <Button
            key={pageNum}
            variant={page === pageNum ? "default" : "outline"}
            size="sm"
            className={`h-8 w-8 text-xs rounded-lg ${
              page === pageNum ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setPage(pageNum)}
          >
            {pageNum}
          </Button>
        );
      })}
    </div>

    <div className="sm:hidden flex items-center px-3 h-8 text-[10px] font-bold text-slate-600 bg-slate-50 rounded-lg border">
      Page {page} / {totalPages}
    </div>

    <Button
      variant="outline"
      size="sm"
      className="h-8 px-2 sm:px-3 text-[10px] sm:text-xs rounded-lg"
      disabled={page >= totalPages}
      onClick={() => setPage((p) => p + 1)}
    >
      <span className="hidden sm:inline">{t("statsNext")}</span>
      <span className="sm:hidden">→</span>
    </Button>
  </div>
</div>
    </Card>
  );
}
