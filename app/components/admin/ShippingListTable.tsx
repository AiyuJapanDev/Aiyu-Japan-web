import { useApp } from "@/contexts/AppContext";
import { useShippingTable } from "@/hooks/useShippingTable";
import { STATUS_BADGES, ITEMS_PER_PAGE } from "@/constants/shippingTableConstants";
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
import { Search, Loader2, Download } from "lucide-react";
import { useMemo } from "react";

interface ShippingListTableProps {
  refreshSignal?: number;
}

export default function ShippingListTable({ refreshSignal }: ShippingListTableProps) {
  const { t } = useApp();
  
  const {
    loading,
    rows: filtered,
    totalCount,
    search, setSearch,
    statusFilter, setStatusFilter,
    dateFilter, setDateFilter,
    page, setPage
  } = useShippingTable(refreshSignal);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(() => {
    return filtered.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE,
    );
  }, [filtered, page]);

  const exportToCSV = () => {
    const headers = [
      t("statsShippingId"),
      t("statsAiyuId"),
      t("statsClientName"),
      t("statsCountry"),
      t("statsDate"),
      t("statsStatus"),
      t("statsAmount"),
      t("statsItemsCount")
    ];

    const csvRows = [
      headers.join(","),
      ...filtered.map(row => {
        const badge = STATUS_BADGES[row.status] || STATUS_BADGES["pending"];
        const dateStr = new Date(row.created_at).toLocaleDateString(t("language") === "es" ? "es-ES" : "en-US", {
          month: "short", day: "numeric", year: "numeric",
        });
        const amount = row.actual_cost ?? row.estimated_cost ?? 0;
        return [
          row.shipment_personal_id || row.id.slice(0, 8).toUpperCase(),
          row.aiyuId,
          `"${row.clientName}"`,
          row.destination,
          dateStr,
          t(badge.labelKey as any),
          amount,
          row.items?.length || 0
        ].join(",");
      })
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `shipments_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-bold text-slate-800">{t("statsShippingList")}</h3>
        <Button
          size="sm"
          onClick={exportToCSV}
          className="h-9 gap-2 drop-shadow-md border bg-white rounded-xl hover:bg-blue-50"
        >
          <Download className="w-4 h-4" color="black"/>
          <span className="hidden text-black sm:inline">Export CSV</span>
        </Button>
      </div>

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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t("statsShippingId")}</th>
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
              const badge = STATUS_BADGES[row.status] || STATUS_BADGES["pending"];
              const dateStr = new Date(row.created_at).toLocaleDateString(t("language") === "es" ? "es-ES" : "en-US", {
                month: "short", day: "numeric", year: "numeric",
              });
              const amount = row.actual_cost ?? row.estimated_cost ?? 0;
              
              return (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-700 uppercase">
                    {row.shipment_personal_id || row.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-blue-600 font-medium">#{row.aiyuId}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{row.clientName}</td>
                  <td className="py-3 px-3 text-slate-600">{row.destination}</td>
                  <td className="py-3 px-3 text-slate-500 tabular-nums">{dateStr}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
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
                <td colSpan={8} className="py-12 text-center text-sm text-slate-400 italic">
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
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
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