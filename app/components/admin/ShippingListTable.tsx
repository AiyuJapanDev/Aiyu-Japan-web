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
import { Search, Loader2 } from "lucide-react";

interface ShippingRow {
  id: string;
  user_id: string;
  shipment_personal_id: string | null;
  status: string;
  destination: string;
  shipping_method: string;
  estimated_cost: number | null;
  actual_cost: number | null;
  items: any[];
  created_at: string;
  clientName: string;
  aiyuId: string;
}

type StatusFilter = "all" | "pending" | "paid" | "sent" | "cancelled" | "rejected";
type DateFilter = "all" | "today" | "week" | "month" | "year";

const STATUS_BADGES: Record<string, { bg: string; text: string; labelKey: string }> = {
  pending:   { bg: "bg-amber-100",   text: "text-amber-600",   labelKey: "statsStatusPending" },
  paid:      { bg: "bg-emerald-100", text: "text-emerald-600", labelKey: "statusPaid" },
  sent:      { bg: "bg-cyan-100",    text: "text-cyan-600",    labelKey: "statusShipped" },
  cancelled: { bg: "bg-gray-100",    text: "text-gray-500",    labelKey: "statusCancelled" },
  rejected:  { bg: "bg-red-100",     text: "text-red-600",     labelKey: "statusRejected" },
};

const ITEMS_PER_PAGE = 7;

let _shippingCache: { rows: ShippingRow[]; totalCount: number } | null = null;

interface ShippingListTableProps {
  refreshSignal?: number;
}

export default function ShippingListTable({ refreshSignal }: ShippingListTableProps) {
  const { t } = useApp();
  const [loading, setLoading] = useState(!_shippingCache);
  const [rows, setRows] = useState<ShippingRow[]>(_shippingCache?.rows ?? []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(_shippingCache?.totalCount ?? 0);

  useEffect(() => {
    if (!_shippingCache) fetchShippings();
  }, []);

  useEffect(() => {
    if (refreshSignal && refreshSignal > 0) {
      _shippingCache = null;
      fetchShippings();
    }
  }, [refreshSignal]);

  const fetchShippings = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from("shipping_quotes")
        .select(
          "id, user_id, shipment_personal_id, status, destination, shipping_method, estimated_cost, actual_cost, items, created_at",
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .limit(5000);

      if (error) throw error;
      setTotalCount(count ?? data?.length ?? 0);

      if (!data || data.length === 0) {
        setRows([]);
        setLoading(false);
        return;
      }

      const userIds = [...new Set(data.map((s: any) => s.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, user_personal_id" as any)
        .in("id", userIds);

      const profileMap = new Map(
        (profiles || []).map((p: any) => [
          p.id,
          {
            name: p.full_name || "—",
            aiyuId: p.user_personal_id || "—",
          },
        ]),
      );

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

      setRows(built);
      _shippingCache = { rows: built, totalCount: count ?? built.length };
    } catch (e) {
      console.error("Error fetching shipping quotes:", e);
    } finally {
      setLoading(false);
    }
  };

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
          case "today":
            return d.toDateString() === now.toDateString();
          case "week": {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return d >= weekAgo;
          }
          case "month":
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          case "year":
            return d.getFullYear() === now.getFullYear();
          default:
            return true;
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
          r.aiyuId.toLowerCase().includes(q),
      );
    }

    return result;
  }, [rows, statusFilter, dateFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

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
      <h3 className="text-lg font-bold text-slate-800 mb-1">{t("statsShippingList")}</h3>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 mt-3">
        <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
          <SelectTrigger className="flex-1 rounded-xl border-blue-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("statsAllStatuses")}</SelectItem>
            <SelectItem value="pending">{t("statusStepRequestSubmitted")}</SelectItem>
            <SelectItem value="paid">{t("statusPaid")}</SelectItem>
            <SelectItem value="sent">{t("statusShipped")}</SelectItem>
            <SelectItem value="cancelled">{t("statusCancelled")}</SelectItem>
            <SelectItem value="rejected">{t("statusRejected")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
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
            placeholder={t("statsSearchShippingPlaceholder")}
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
                {t("statsShippingId")}
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
              const badge = STATUS_BADGES[row.status] || STATUS_BADGES["pending"];
              const dateStr = new Date(row.created_at).toLocaleDateString(t("language") === "es" ? "es-ES" : "en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const amount = row.actual_cost ?? row.estimated_cost ?? 0;
              return (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3 px-3 font-medium text-slate-700 uppercase">
                    {row.shipment_personal_id || row.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-blue-600 font-medium">
                      #{row.aiyuId}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{row.clientName}</td>
                  <td className="py-3 px-3 text-slate-600">{row.destination}</td>
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
                    ¥{amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600 tabular-nums">
                    {row.items?.length || 0}
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
                  {t("statsNoShippingsFound")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <p className="text-[10px] sm:text-xs text-blue-500 font-medium order-2 sm:order-1">
          {t("statsShowing")} {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-
          {Math.min(page * ITEMS_PER_PAGE, filtered.length)} {t("statsOf")}{" "}
          {filtered.length.toLocaleString()} {t("statsShipmentsUnit")}
        </p>

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
