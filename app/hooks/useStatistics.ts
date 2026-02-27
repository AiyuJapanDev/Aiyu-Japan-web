import { useState, useEffect, useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import { fetchStatisticsData } from "@/Services/StatisticService";
import type {
  StatOrder,
  StatProfile,
  StatProductRequest,
  StatShippingQuote,
  StatCreditLog,
  StatQuote,
  ExactCounts,
  MonthlyData,
  StatusDistribution,
  CountryData,
  WeightByCountry,
  DestinationData,
  ShippingMethodData,
} from "@/types/statistics";

export type DateRangeFilter = "30d" | "3m" | "1y" | "all";



function isCurrentMonth(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function buildLast6MonthsKeys(): string[] {
  const keys: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return keys;
}

function dateToKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}



/* ─── module-level cache (persists across tab switches, resets on F5) ─── */
import type { StatisticsRawData } from "@/types/statistics";
let _cache: StatisticsRawData | null = null;

/* ─── hook return type ─── */
export interface UseStatisticsReturn {
  loading: boolean;
  refetch: () => Promise<void>;

  /* KPI values */
  totalClients: number;
  newClients: number;
  totalOrders: number;
  itemsSold: number;
  totalShipments: number;
  repeatClients: number;

  /* Orders chart data */
  ordersByMonth: MonthlyData[];
  orderStatusData: StatusDistribution[];
  itemsByCountry: CountryData[];
  newUsersByMonth: MonthlyData[];

  /* Shipping chart data */
  shippingsByMonth: MonthlyData[];
  shippingStatusData: StatusDistribution[];
  shippingMethodData: ShippingMethodData[];
  allDestinations: DestinationData[];
  weightByCountry: WeightByCountry[];

  showMore: boolean;
  setShowMore: (showMore: boolean) => void;

  /* Filters */
  dateRange: DateRangeFilter;
  setDateRange: (d: DateRangeFilter) => void;
  countryFilter: string;
  setCountryFilter: (c: string) => void;
  availableCountries: string[];
}

export function useStatistics(): UseStatisticsReturn {
  const { t } = useApp();
  const [loading, setLoading] = useState(!_cache);
  const [orders, setOrders] = useState<StatOrder[]>(_cache?.orders ?? []);
  const [users, setUsers] = useState<StatProfile[]>(_cache?.users ?? []);
  const [products, setProducts] = useState<StatProductRequest[]>(_cache?.products ?? []);
  const [shippings, setShippings] = useState<StatShippingQuote[]>(_cache?.shippings ?? []);
  const [creditLogs, setCreditLogs] = useState<StatCreditLog[]>(_cache?.creditLogs ?? []);
  const [orderQuotes, setOrderQuotes] = useState<StatQuote[]>(_cache?.orderQuotes ?? []);
  const [exactCounts, setExactCounts] = useState<ExactCounts>(
    _cache?.exactCounts ?? { orders: 0, users: 0, products: 0, shippings: 0, quotes: 0 },
  );
  const [showMore, setShowMore] = useState(false);

  /* ── filter state ── */
  const [dateRange, setDateRange] = useState<DateRangeFilter>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");

  /* ── helpers inside hook to access 't' ── */
  const getMonthLabel = (date: Date) => {
    const m = date.getUTCMonth();
    return t(`month${m}` as any);
  };

  const buildUserCountryMap = (profiles: StatProfile[]) => {
    const map: Record<string, string> = {};
    profiles.forEach((u) => {
      map[u.id] = u.country || t("statsUnknown");
    });
    return map;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchStatisticsData();
      _cache = data;
      setOrders(data.orders);
      setUsers(data.users);
      setProducts(data.products);
      setShippings(data.shippings);
      setCreditLogs(data.creditLogs);
      setOrderQuotes(data.orderQuotes);
      setExactCounts(data.exactCounts);
    } catch (e) {
      console.error("Error loading stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!_cache) loadData();
  }, []);

  const refetch = async () => {
    _cache = null;
    await loadData();
  };

  /* ── build country map & list ── */
  const userCountryMap = useMemo(() => buildUserCountryMap(users), [users, t]);

  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => { if (u.country) set.add(u.country); });
    return Array.from(set).sort();
  }, [users]);

  /* ── date cutoff helper ── */
  const dateCutoff = useMemo(() => {
    if (dateRange === "all") return null;
    const now = new Date();
    if (dateRange === "30d") return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    if (dateRange === "3m") return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    /* 1y */ return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  }, [dateRange]);

  const afterCutoff = (dateStr: string) => !dateCutoff || new Date(dateStr) >= dateCutoff;
  const matchesCountry = (userId: string) =>
    countryFilter === "all" || userCountryMap[userId] === countryFilter;

  /* ── filtered raw arrays ── */
  const fOrders = useMemo(() => orders.filter((o) => afterCutoff(o.created_at) && matchesCountry(o.user_id)), [orders, dateCutoff, countryFilter, userCountryMap]);
  const fProducts = useMemo(() => products.filter((p) => afterCutoff(p.created_at) && matchesCountry(p.user_id)), [products, dateCutoff, countryFilter, userCountryMap]);
  const fShippings = useMemo(() => shippings.filter((s) => afterCutoff(s.created_at) && matchesCountry(s.user_id)), [shippings, dateCutoff, countryFilter, userCountryMap]);
  const fQuotes = useMemo(() => orderQuotes.filter((q) => afterCutoff(q.created_at)), [orderQuotes, dateCutoff]);
  const fUsers = useMemo(() => users.filter((u) => afterCutoff(u.created_at) && (countryFilter === "all" || u.country === countryFilter)), [users, dateCutoff, countryFilter]);

  /* ── KPIs ── */
  const totalClients = countryFilter === "all" && dateRange === "all" ? exactCounts.users : fUsers.length;
  const newClients = fUsers.filter((u) => isCurrentMonth(u.created_at)).length;
  const totalOrders = countryFilter === "all" && dateRange === "all" ? exactCounts.orders : fOrders.length;
  const itemsSold = fQuotes.filter((q) => q.status === "paid").length;
  const totalShipments = countryFilter === "all" && dateRange === "all" ? exactCounts.shippings : fShippings.length;

  const repeatClients = useMemo(() => {
    const counts: Record<string, number> = {};
    fOrders.forEach((o) => { counts[o.user_id] = (counts[o.user_id] || 0) + 1; });
    return Object.values(counts).filter((c) => c >= 2).length;
  }, [fOrders]);

  /* ── Orders chart data ── */
  const ordersByMonth = useMemo<MonthlyData[]>(() => {
    const keys = buildLast6MonthsKeys();
    const map: Record<string, { orders: number; items: number }> = {};
    keys.forEach((k) => { map[k] = { orders: 0, items: 0 }; });

    fOrders.forEach((o) => {
      const k = dateToKey(o.created_at);
      if (map[k]) map[k].orders++;
    });
    fProducts.forEach((p) => {
      const k = dateToKey(p.created_at);
      if (map[k]) map[k].items += p.quantity;
    });

    return keys.map((k) => ({ month: getMonthLabel(new Date(k + "-01")), ...map[k] }));
  }, [fOrders, fProducts, t]);

  const orderStatusData = useMemo<StatusDistribution[]>(() => {
    const counts: Record<string, number> = {};
    fQuotes.forEach((q) => { counts[q.status] = (counts[q.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => {
      let translatedName = name;
      if (name === "paid") translatedName = t("statusPaid");
      else if (name === "quoted") translatedName = t("statusQuoted");
      else if (name === "requested") translatedName = t("statusRequested");
      else if (name === "sent") translatedName = t("statusShipped");
      else if (name === "cancelled") translatedName = t("statusCancelled");
      else if (name === "rejected") translatedName = t("statusRejected");
      return { name: translatedName, value };
    });
  }, [fQuotes, t]);

  const itemsByCountry = useMemo<CountryData[]>(() => {
    const counts: Record<string, number> = {};
    fProducts.forEach((p) => {
      const country = userCountryMap[p.user_id] || t("statsUnknown");
      counts[country] = (counts[country] || 0) + p.quantity;
    });
    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [fProducts, userCountryMap]);

  const newUsersByMonth = useMemo<MonthlyData[]>(() => {
    const keys = buildLast6MonthsKeys();
    const map: Record<string, number> = {};
    keys.forEach((k) => { map[k] = 0; });

    fUsers.forEach((u) => {
      const k = dateToKey(u.created_at);
      if (map[k] !== undefined) map[k]++;
    });

    return keys.map((k) => ({ month: getMonthLabel(new Date(k + "-01")), users: map[k] }));
  }, [fUsers, t]);

  /* ── Shipping chart data ── */
  const fSentShippings = useMemo(
    () => fShippings.filter((s) => s.status === "sent"),
    [fShippings],
  );

  const shippingsByMonth = useMemo<MonthlyData[]>(() => {
    const keys = buildLast6MonthsKeys();
    const map: Record<string, { shipments: number; weight: number }> = {};
    keys.forEach((k) => { map[k] = { shipments: 0, weight: 0 }; });

    fSentShippings.forEach((s) => {
      const k = dateToKey(s.created_at);
      if (map[k]) {
        map[k].shipments++;
        map[k].weight += Math.round((s.total_weight || 0) / 1000);
      }
    });

    return keys.map((k) => ({ month: getMonthLabel(new Date(k + "-01")), ...map[k] }));
  }, [fSentShippings, t]);

  const shippingStatusData = useMemo<StatusDistribution[]>(() => {
    const counts: Record<string, number> = {};
    fShippings.forEach((s) => { counts[s.status] = (counts[s.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => {
      let translatedName = name;
      if (name === "paid") translatedName = t("statusPaid");
      else if (name === "sent") translatedName = t("statusShipped");
      else if (name === "pending") translatedName = t("statusStepRequestSubmitted");
      else if (name === "cancelled") translatedName = t("statusCancelled");
      else if (name === "rejected") translatedName = t("statusRejected");
      return { name: translatedName, value };
    });
  }, [fShippings, t]);

  const shippingMethodData = useMemo<ShippingMethodData[]>(() => {
    const counts: Record<string, number> = {};
    fSentShippings.forEach((s) => {
      counts[s.shipping_method] = (counts[s.shipping_method] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([method, count]) => ({ method, count }))
      .sort((a, b) => b.count - a.count);
  }, [fSentShippings]);

  const allDestinations = useMemo<DestinationData[]>(() => {
    const counts: Record<string, number> = {};
    fSentShippings.forEach((s) => {
      counts[s.destination] = (counts[s.destination] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([destination, count]) => ({ destination, count }))
      .sort((a, b) => b.count - a.count);
  }, [fSentShippings]);

  const weightByCountry = useMemo<WeightByCountry[]>(() => {
    const totals: Record<string, number> = {};
    fSentShippings.forEach((s) => {
      const country = userCountryMap[s.user_id] || t("statsUnknown");
      totals[country] = (totals[country] || 0) + (s.total_weight || 0);
    });
    return Object.entries(totals)
      .map(([country, weight]) => ({ country, weight: Math.round(weight / 1000) }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);
  }, [fSentShippings, userCountryMap]);

  return {
    loading, refetch,
    totalClients, newClients, totalOrders, itemsSold, totalShipments, repeatClients,
    ordersByMonth, orderStatusData, itemsByCountry, newUsersByMonth,
    shippingsByMonth, shippingStatusData, shippingMethodData, allDestinations, weightByCountry, showMore, setShowMore,
    dateRange, setDateRange, countryFilter, setCountryFilter, availableCountries,
  };
}
