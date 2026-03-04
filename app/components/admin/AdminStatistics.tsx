import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Loader2, RefreshCw, Users, ShoppingCart, 
  Package, Truck, Repeat, Calendar, Globe, Box
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";

// Módulos de estadísticas
import { useStatistics } from "@/hooks/useStatistics";
import type { DateRangeFilter } from "@/hooks/useStatistics";
import { KPICard } from "./stats/KpiCard";
import { OrdersView } from "./stats/OrdersView";
import { ShippingView } from "./stats/ShippingView";
import { DynamicMainChart } from "./stats/DynamicMainChart";
import { MasterDateFilter } from "./MasterDateFilter";

export default function AdminStatistics() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const { t } = useApp();
  const { 
    loading, 
    refetch, 
    dateRange, 
    setDateRange, 
    countryFilter, 
    setCountryFilter, 
    availableCountries,
    customDateStart,
    setCustomDateStart,
    customDateEnd,
    setCustomDateEnd,
    ...stats 
  } = useStatistics();

  const handleRefresh = async () => {
    setRefreshSignal((s) => s + 1);
    await refetch();
  };

  const handleCustomDateChange = (start: Date | null, end: Date | null) => {
    setCustomDateStart(start);
    setCustomDateEnd(end);
    if (start && end) {
      setDateRange("custom");
    } else {
      setDateRange("all");
    }
  };

  // Preparar datos para DynamicMainChart
  // Generar meses desde septiembre 2025 (inicio de operaciones) hasta hoy
  const buildMonthsSinceSeptember2025 = (): string[] => {
    const keys: string[] = [];
    const startDate = new Date(2025, 8, 1); // Septiembre 2025 (mes 8 en JS)
    const currentDate = new Date();
    
    // Normalizar a primer día del mes para comparación correcta
    const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const current = new Date(startMonth);
    while (current <= currentMonth) {
      keys.push(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`);
      current.setMonth(current.getMonth() + 1);
    }
    
    return keys;
  };

  const monthKeys12 = buildMonthsSinceSeptember2025();

  // Construir datos para DynamicMainChart
  // Los datos de ordersByMonth y shippingsByMonth ya vienen ordenados cronológicamente
  const dynamicChartData = monthKeys12.map((monthKey, index) => {
    const orderMonthData = stats.ordersByMonth[index];
    const shippingMonthData = stats.shippingsByMonth[index];
    const salesMonthData = stats.salesByMonth[index];
    
    const ordersCount = (orderMonthData?.orders as number) || 0;
    const itemsCount = (orderMonthData?.items as number) || 0;
    const shippingsCount = (shippingMonthData?.shipments as number) || 0;
    const salesAmount = (salesMonthData?.sales as number) || 0;
    
    return {
      date: `${monthKey}-01`, // Fecha ISO: "2025-09-01"
      sales: salesAmount,
      orders: ordersCount,
      items: itemsCount,
      shippings: shippingsCount,
    };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{t("statsTitle")}</h1>
          <p className="text-sm text-slate-400 font-medium">{t("statsSubtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl gap-2 h-10 border-slate-200" 
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden xs:inline">{t("statsRefresh")}</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm items-end">
        {/* Date Filter Column */}
        <div className="md:col-span-5 lg:col-span-4 space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 ml-1">
            <Calendar className="w-3.5 h-3.5" />
            {t("statsFilterDateRange")}
          </label>
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRangeFilter)}>
            <SelectTrigger className="rounded-xl border-blue-100 h-10 bg-slate-50/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">{t("statsFilterLast30")}</SelectItem>
              <SelectItem value="3m">{t("statsFilterLast3Months")}</SelectItem>
              <SelectItem value="1y">{t("statsFilterThisYear")}</SelectItem>
              <SelectItem value="all">{t("statsFilterAll")}</SelectItem>
              <SelectItem value="custom">{t("statsFilterCustom")}</SelectItem>
            </SelectContent>
          </Select>
          {dateRange === "custom" && (
            <div className="mt-2">
              <MasterDateFilter onDateRangeChange={handleCustomDateChange} />
            </div>
          )}
        </div>

        {/* Country Filter Column */}
        <div className="md:col-span-4 lg:col-span-5 space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 ml-1">
            <Globe className="w-3.5 h-3.5" />
            {t("statsFilterCountry")}
          </label>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="rounded-xl border-blue-100 h-10 bg-slate-50/30">
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

        {/* Apply Button Column */}
        <div className="md:col-span-3 lg:col-span-3">
          <Button
            variant="default"
            className="w-full rounded-xl h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all"
            onClick={() => {}}
          >
            {t("statsFilterApply")}
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard icon={Users} iconBg="bg-blue-500" value={stats.totalClients} label={t("statsTotalClients")} subtitle={t("statsUsers")} />
        <KPICard icon={ShoppingCart} iconBg="bg-violet-500" value={stats.totalOrders} label={t("statsOrders")} subtitle={t("statsItems")} />
        <KPICard icon={Package} iconBg="bg-green-500" value={stats.itemsSold} label={t("statsItemsSold")} subtitle={t("statsTotal")} />
        <KPICard icon={Truck} iconBg="bg-orange-500" value={stats.totalShipments} label={t("statsShipments")} subtitle={t("statsShipments")} />
        <KPICard icon={Repeat} iconBg="bg-indigo-500" value={stats.repeatClients} label={t("statsRepeatClients")} subtitle={t("statsLoyal")} />
        <KPICard icon={Box} iconBg="bg-amber-500" value={stats.boxShipments} label={t("statsBoxShipments")} subtitle={t("statsCasillero")} />
      </div>

      {/* Dynamic Main Chart - Hero Section */}
      <DynamicMainChart data={dynamicChartData} />

      {/* Main Views */}
      <div className="space-y-8">
        {/* Orders Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">{t("statsViewOrders")}</h2>
          <OrdersView 
            ordersByMonth={stats.ordersByMonth}
            orderStatusData={stats.orderStatusData}
            newUsersByMonth={stats.newUsersByMonth}
            itemsByCountry={stats.itemsByCountry}
            topCountriesRegistered={stats.topCountriesRegistered}
            topCountriesOrders={stats.topCountriesOrders}
            refreshSignal={refreshSignal}
          />
        </div>

        {/* Shipping Section */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">{t("statsViewShipping")}</h2>
          <ShippingView 
            shippingsByMonth={stats.shippingsByMonth}
            shippingStatusData={stats.shippingStatusData}
            shippingMethodData={stats.shippingMethodData}
            allDestinations={stats.allDestinations}
            weightByCountry={stats.weightByCountry}
            refreshSignal={refreshSignal}
          />
        </div>
      </div>
    </div>
  );
}