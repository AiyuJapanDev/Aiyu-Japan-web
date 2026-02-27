import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Users, UserPlus, ShoppingCart, Package, Truck, Repeat, Calendar, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";

// Importa tus nuevos módulos
import { useStatistics } from "@/hooks/useStatistics";
import type { DateRangeFilter } from "@/hooks/useStatistics";
import OrdersListTable from "@/components/admin/OrdersListTable";
import ShippingListTable from "@/components/admin/ShippingListTable";
import { KPICard } from "./stats/KpiCard";
import { OrdersView } from "./stats/OrdersView";
import { ShippingView } from "./stats/ShippingView";

export default function AdminStatistics() {
  const [view, setView] = useState<"orders" | "shipping">("orders");
  const [refreshSignal, setRefreshSignal] = useState(0);
  const { t } = useApp();
  const { loading, refetch, dateRange, setDateRange, countryFilter, setCountryFilter, availableCountries, ...stats } = useStatistics();

  const handleRefresh = async () => {
    setRefreshSignal((s) => s + 1);
    await refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{t("statsTitle")}</h1>
          <p className="text-sm text-slate-400 font-medium">{t("statsSubtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl gap-2" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
            {t("statsRefresh")}
          </Button>
          <Select value={view} onValueChange={(v: any) => setView(v)}>
            <SelectTrigger className="w-[200px] rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="orders">{t("statsViewOrders")}</SelectItem>
              <SelectItem value="shipping">{t("statsViewShipping")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex-1 min-w-0">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {t("statsFilterDateRange")}
          </label>
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRangeFilter)}>
            <SelectTrigger className="rounded-xl border-blue-200 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">{t("statsFilterLast30")}</SelectItem>
              <SelectItem value="3m">{t("statsFilterLast3Months")}</SelectItem>
              <SelectItem value="1y">{t("statsFilterThisYear")}</SelectItem>
              <SelectItem value="all">{t("statsFilterAll")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-0">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1.5">
            <Globe className="w-3.5 h-3.5" />
            {t("statsFilterCountry")}
          </label>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="rounded-xl border-blue-200 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("statsFilterAllCountries")}</SelectItem>
              {availableCountries.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="default"
          className="rounded-xl h-10 px-6 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shrink-0"
          onClick={() => { /* filters are reactive, button is visual confirmation */ }}
        >
          {t("statsFilterApply")}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard icon={Users} iconBg="bg-blue-500" value={stats.totalClients} label={t("statsTotalClients")} subtitle={t("statsUsers")} />
        <KPICard icon={UserPlus} iconBg="bg-emerald-500" value={stats.newClients} label={t("statsNewClients")} subtitle={t("statsThisMonth")} />
        <KPICard icon={ShoppingCart} iconBg="bg-violet-500" value={stats.totalOrders} label={t("statsOrders")} subtitle={t("statsItems")} />
        <KPICard icon={Package} iconBg="bg-green-500" value={stats.itemsSold} label={t("statsItemsSold")} subtitle={t("statsPaid")} />
        <KPICard icon={Truck} iconBg="bg-orange-500" value={stats.totalShipments} label={t("statsShipments")} subtitle={t("statsShipments")} />
        <KPICard icon={Repeat} iconBg="bg-indigo-500" value={stats.repeatClients} label={t("statsRepeatClients")} subtitle={t("statsLoyal")} />
      </div>

      {view === "orders" ? (
        <OrdersView 
          ordersByMonth={stats.ordersByMonth}
          orderStatusData={stats.orderStatusData}
          newUsersByMonth={stats.newUsersByMonth}
          itemsByCountry={stats.itemsByCountry}
        />
      ) : (
        <ShippingView 
          shippingsByMonth={stats.shippingsByMonth}
          shippingStatusData={stats.shippingStatusData}
          shippingMethodData={stats.shippingMethodData}
          allDestinations={stats.allDestinations}
          weightByCountry={stats.weightByCountry}
        />
      )}

      {view === "orders" ? (
        <OrdersListTable refreshSignal={refreshSignal} />
      ) : (
        <ShippingListTable refreshSignal={refreshSignal} />
      )}
    </div>
  );
}