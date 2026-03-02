import { useApp } from "@/contexts/AppContext";
import { useOrdersTable } from "@/hooks/useOrdersTable";
import { STATUS_BADGES, ITEMS_PER_PAGE } from "@/constants/ordersTableConstants";
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

interface OrdersListTableProps {
  refreshSignal?: number;
}

export default function OrdersListTable({ refreshSignal }: OrdersListTableProps) {
  const { t } = useApp();
  
  const {
    loading,
    rows: filtered,
    search, setSearch,
    statusFilter, setStatusFilter,
    dateFilter, setDateFilter,
    page, setPage,
    totalCount
  } = useOrdersTable(refreshSignal);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

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

      <div className="flex flex-col sm:flex-row gap-3 mb-5 mt-3">
        <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
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
            placeholder={t("statsSearchOrdersPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-blue-200"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t("statsOrderId")}</th>
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t("statsAiyuId")}</th>
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t("statsClientName")}</th>
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t("statsCountry")}</th>
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t("statsDate")}</th>
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t("statsStatus")}</th>
              <th className="text-right py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t("statsAmount")}</th>
              <th className="text-right py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t("statsItemsCount")}</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => {
              const badge = STATUS_BADGES[row.quoteStatus] || STATUS_BADGES["New"];
              const dateStr = new Date(row.created_at).toLocaleDateString(t("language") === "es" ? "es-ES" : "en-US", {
                month: "short", day: "numeric", year: "numeric",
              });
              return (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-700 uppercase">{row.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-3 px-3"><span className="text-blue-600 font-medium">#{row.aiyuId}</span></td>
                  <td className="py-3 px-3 text-slate-700">{row.clientName}</td>
                  <td className="py-3 px-3 text-slate-600">{row.country}</td>
                  <td className="py-3 px-3 text-slate-500 tabular-nums">{dateStr}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                      {t(badge.labelKey as any)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-700 tabular-nums">¥{row.amount.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right text-slate-600 tabular-nums">{row.itemsCount}</td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-slate-400 italic">
                  {t("statsNoOrdersFound")}
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
          {filtered.length.toLocaleString()} {t("statsOrdersUnit")}
        </p>

        <div className="flex items-center gap-1 order-1 sm:order-2">
          <Button
            variant="outline" size="sm" className="h-8 px-2 sm:px-3 text-[10px] sm:text-xs rounded-lg"
            disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
          >
            <span className="hidden sm:inline">{t("statsPrevious")}</span>
            <span className="sm:hidden">←</span>
          </Button>

          <div className="hidden sm:flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum = totalPages <= 5 || page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
              return (
                <Button
                  key={pageNum} variant={page === pageNum ? "default" : "outline"} size="sm"
                  className={`h-8 w-8 text-xs rounded-lg ${page === pageNum ? "bg-blue-500 text-white" : ""}`}
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
            variant="outline" size="sm" className="h-8 px-2 sm:px-3 text-[10px] sm:text-xs rounded-lg"
            disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
          >
            <span className="hidden sm:inline">{t("statsNext")}</span>
            <span className="sm:hidden">→</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}