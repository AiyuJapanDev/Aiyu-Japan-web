import { useState, useEffect, useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import { fetchStatisticsData } from "@/Services/StatisticService";
import type {
  StatOrder,
  StatOrderItem,
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
} from "@/types/statisticsTypes/statistics";

export interface TopCountry {
  country: string;
  count: number;
}

export type DateRangeFilter = "30d" | "3m" | "1y" | "all" | "custom";



function isCurrentMonth(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function buildLast6MonthsKeys(): string[] {
  const keys: string[] = [];
  const startDate = new Date(2025, 8, 1); // Septiembre 2025 (inicio de operaciones)
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
}

function dateToKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}



/* ─── module-level cache (persists across tab switches, resets on F5) ─── */
import type { StatisticsRawData } from "@/types/statisticsTypes/statistics";
let _cache: StatisticsRawData | null = null;

/* ─── hook return type ─── */
export interface UseStatisticsReturn {
  loading: boolean;
  refetch: () => Promise<void>;

  /* KPI values */
  totalClients: number;
  totalOrders: number;
  itemsSold: number;
  totalShipments: number;
  repeatClients: number;
  boxShipments: number;

  /* Orders chart data */
  ordersByMonth: MonthlyData[];
  orderStatusData: StatusDistribution[];
  itemsByCountry: CountryData[];
  newUsersByMonth: MonthlyData[];

  /* Shipping chart data */
  shippingsByMonth: MonthlyData[];
  salesByMonth: MonthlyData[];
  shippingStatusData: StatusDistribution[];
  shippingMethodData: ShippingMethodData[];
  allDestinations: DestinationData[];
  weightByCountry: WeightByCountry[];

  /* Top countries data */
  topCountriesRegistered: TopCountry[];
  topCountriesOrders: TopCountry[];

  showMore: boolean;
  setShowMore: (showMore: boolean) => void;

  /* Filters */
  dateRange: DateRangeFilter;
  setDateRange: (d: DateRangeFilter) => void;
  customDateStart: Date | null;
  setCustomDateStart: (d: Date | null) => void;
  customDateEnd: Date | null;
  setCustomDateEnd: (d: Date | null) => void;
  countryFilter: string;
  setCountryFilter: (c: string) => void;
  availableCountries: string[];
}

export function useStatistics(): UseStatisticsReturn {
  const { t } = useApp();
  const [loading, setLoading] = useState(!_cache);
  const [orders, setOrders] = useState<StatOrder[]>(_cache?.orders ?? []);
  const [orderItems, setOrderItems] = useState<StatOrderItem[]>(_cache?.orderItems ?? []);
  const [users, setUsers] = useState<StatProfile[]>(_cache?.users ?? []);
  const [products, setProducts] = useState<StatProductRequest[]>(_cache?.products ?? []);
  const [shippings, setShippings] = useState<StatShippingQuote[]>(_cache?.shippings ?? []);
  const [creditLogs, setCreditLogs] = useState<StatCreditLog[]>(_cache?.creditLogs ?? []);
  const [orderQuotes, setOrderQuotes] = useState<StatQuote[]>(_cache?.orderQuotes ?? []);
  const [exactCounts, setExactCounts] = useState<ExactCounts>(
    _cache?.exactCounts ?? { orders: 0, users: 0, products: 0, shippings: 0, quotes: 0, boxShipments: 0 },
  );
  const [showMore, setShowMore] = useState(false);

  /* ── filter state ── */
  const [dateRange, setDateRange] = useState<DateRangeFilter>("all");
  const [customDateStart, setCustomDateStart] = useState<Date | null>(null);
  const [customDateEnd, setCustomDateEnd] = useState<Date | null>(null);
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
      setOrderItems(data.orderItems);
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
    if (dateRange === "custom") return null;
    if (dateRange === "all") return null;
    const now = new Date();
    if (dateRange === "30d") return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    if (dateRange === "3m") return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    /* 1y - desde el inicio del año actual */ return new Date(now.getFullYear(), 0, 1);
  }, [dateRange]);

  const afterCutoff = (dateStr: string) => {
    if (dateRange === "custom" && customDateStart && customDateEnd) {
      const d = new Date(dateStr);
      const start = new Date(customDateStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(customDateEnd);
      end.setHours(23, 59, 59, 999);
      return d >= start && d <= end;
    }
    return !dateCutoff || new Date(dateStr) >= dateCutoff;
  };

  const matchesCountry = (userId: string) =>
    countryFilter === "all" || userCountryMap[userId] === countryFilter;

  /* ── filtered raw arrays ── */
  const fOrders = useMemo(() => orders.filter((o) => afterCutoff(o.created_at) && matchesCountry(o.user_id)), [orders, dateCutoff, countryFilter, userCountryMap, customDateStart, customDateEnd]);
  const fProducts = useMemo(() => products.filter((p) => afterCutoff(p.created_at) && matchesCountry(p.user_id)), [products, dateCutoff, countryFilter, userCountryMap, customDateStart, customDateEnd]);
  const fShippings = useMemo(() => shippings.filter((s) => afterCutoff(s.created_at) && matchesCountry(s.user_id)), [shippings, dateCutoff, countryFilter, userCountryMap, customDateStart, customDateEnd]);
  const fQuotes = useMemo(() => orderQuotes.filter((q) => afterCutoff(q.created_at)), [orderQuotes, dateCutoff, customDateStart, customDateEnd]);
  const fUsers = useMemo(() => users.filter((u) => afterCutoff(u.created_at) && (countryFilter === "all" || u.country === countryFilter)), [users, dateCutoff, countryFilter, customDateStart, customDateEnd]);

  /* ── KPIs ── */
  const totalClients = countryFilter === "all" && dateRange === "all" ? exactCounts.users : fUsers.length;
  
  // Pedidos: count DISTINCT orders with paid/received/purchased products
  // SELECT count(DISTINCT o.id) FROM orders o
  // JOIN order_items oi ON o.id = oi.order_id
  // JOIN product_requests r ON oi.product_request_id = r.id
  // WHERE r.status IN ('paid', 'received', 'purchased')
  const totalOrders = useMemo(() => {
    // Create a map of product_request_id -> status for quick lookup
    const productStatusMap = new Map<string, string>();
    products.forEach(p => productStatusMap.set(p.id, p.status));
    
    // Get unique order IDs that have at least one paid/received/purchased product
    const validOrderIds = new Set<string>();
    orderItems.forEach(item => {
      const productStatus = productStatusMap.get(item.product_request_id);
      if (productStatus && ['paid', 'received', 'purchased'].includes(productStatus)) {
        validOrderIds.add(item.order_id);
      }
    });
    
    // Filter orders by valid IDs + date + country filters
    const filteredOrders = orders.filter(o => 
      validOrderIds.has(o.id) &&
      afterCutoff(o.created_at) &&
      matchesCountry(o.user_id)
    );
    
    return filteredOrders.length;
  }, [orders, orderItems, products, dateCutoff, countryFilter, userCountryMap, customDateStart, customDateEnd]);
  
  // Items vendidos: sum quantities from products in orders with paid/received/purchased status
  // SELECT sum(r.quantity) FROM orders o
  // JOIN order_items oi ON o.id = oi.order_id
  // JOIN product_requests r ON oi.product_request_id = r.id
  // WHERE r.status IN ('paid', 'received', 'purchased')
  const itemsSold = useMemo(() => {
    // Create a map of product_request_id -> product for quick lookup
    const productMap = new Map<string, StatProductRequest>();
    products.forEach(p => {
      if (['paid', 'received', 'purchased'].includes(p.status)) {
        productMap.set(p.id, p);
      }
    });
    
    // Get product_request_ids from order_items where order matches filters
    const validProductIds = new Set<string>();
    orderItems.forEach(item => {
      const order = orders.find(o => o.id === item.order_id);
      if (order && afterCutoff(order.created_at) && matchesCountry(order.user_id)) {
        const product = productMap.get(item.product_request_id);
        if (product) {
          validProductIds.add(product.id);
        }
      }
    });
    
    // Sum quantities of valid products
    let total = 0;
    validProductIds.forEach(productId => {
      const product = productMap.get(productId);
      if (product) {
        total += product.quantity;
      }
    });
    
    return total;
  }, [orders, orderItems, products, dateCutoff, countryFilter, userCountryMap, customDateStart, customDateEnd]);
  
  // Envíos: count only paid or sent shipments
  const totalShipments = useMemo(() => {
    return fShippings.filter((s) => s.status === "paid" || s.status === "sent").length;
  }, [fShippings]);
  
  // Clientes fieles: users with more than 2 paid orders
  // Only count orders with paid/received/purchased products
  const repeatClients = useMemo(() => {
    // Get valid order IDs (orders with paid/received/purchased products)
    const productStatusMap = new Map<string, string>();
    products.forEach(p => productStatusMap.set(p.id, p.status));
    
    const validOrderIds = new Set<string>();
    orderItems.forEach(item => {
      const productStatus = productStatusMap.get(item.product_request_id);
      if (productStatus && ['paid', 'received', 'purchased'].includes(productStatus)) {
        validOrderIds.add(item.order_id);
      }
    });
    
    // Count orders per user (only valid orders with filters)
    const counts: Record<string, number> = {};
    orders.forEach((o) => {
      if (validOrderIds.has(o.id) && afterCutoff(o.created_at) && matchesCountry(o.user_id)) {
        counts[o.user_id] = (counts[o.user_id] || 0) + 1;
      }
    });
    
    return Object.values(counts).filter((c) => c > 2).length;
  }, [orders, orderItems, products, dateCutoff, countryFilter, userCountryMap, customDateStart, customDateEnd]);
  
  // Casillero: count product requests where is_box = true
  const boxShipments = useMemo(() => {
    if (countryFilter === "all" && dateRange === "all") {
      return exactCounts.boxShipments;
    }
    
    // Filtrar directamente de products con is_box=true aplicando filtros de fecha y país
    return products.filter((p) => 
      p.is_box === true && 
      afterCutoff(p.created_at) && 
      matchesCountry(p.user_id)
    ).length;
  }, [products, countryFilter, dateRange, exactCounts, dateCutoff, userCountryMap, customDateStart, customDateEnd]);

  /* ── Orders chart data ── */
  const ordersByMonth = useMemo<MonthlyData[]>(() => {
    const keys = buildLast6MonthsKeys();
    const map: Record<string, { orders: number; items: number }> = {};
    keys.forEach((k) => { map[k] = { orders: 0, items: 0 }; });

    // Create maps for quick lookup
    const productStatusMap = new Map<string, string>();
    const productQuantityMap = new Map<string, number>();
    products.forEach(p => {
      productStatusMap.set(p.id, p.status);
      productQuantityMap.set(p.id, p.quantity);
    });

    // Count orders and items that have paid/received/purchased products
    const processedOrders = new Set<string>();
    const processedProducts = new Set<string>();

    orderItems.forEach(item => {
      const order = orders.find(o => o.id === item.order_id);
      const productStatus = productStatusMap.get(item.product_request_id);
      
      if (order && productStatus && ['paid', 'received', 'purchased'].includes(productStatus)) {
        // Apply filters
        if (afterCutoff(order.created_at) && matchesCountry(order.user_id)) {
          const k = dateToKey(order.created_at);
          
          if (map[k]) {
            // Count order only once per month
            const orderKey = `${order.id}-${k}`;
            if (!processedOrders.has(orderKey)) {
              map[k].orders++;
              processedOrders.add(orderKey);
            }
            
            // Sum items quantity (each product only once)
            const productKey = item.product_request_id;
            if (!processedProducts.has(productKey)) {
              const quantity = productQuantityMap.get(item.product_request_id) || 0;
              map[k].items += quantity;
              processedProducts.add(productKey);
            }
          }
        }
      }
    });

    return keys.map((k) => ({ month: getMonthLabel(new Date(k + "-01")), ...map[k] }));
  }, [orders, orderItems, products, dateCutoff, countryFilter, userCountryMap, t, customDateStart, customDateEnd]);

  const orderStatusData = useMemo<StatusDistribution[]>(() => {
    // Count product quantities by status from products linked to orders
    const productStatusMap = new Map<string, string>();
    const productUserMap = new Map<string, string>();
    const productQuantityMap = new Map<string, number>();
    products.forEach(p => {
      productStatusMap.set(p.id, p.status);
      productUserMap.set(p.id, p.user_id);
      productQuantityMap.set(p.id, p.quantity);
    });

    const counts: Record<string, number> = {};
    orderItems.forEach(item => {
      const order = orders.find(o => o.id === item.order_id);
      const productStatus = productStatusMap.get(item.product_request_id);
      const productUserId = productUserMap.get(item.product_request_id);
      const productQuantity = productQuantityMap.get(item.product_request_id) || 0;
      
      if (order && productStatus && productUserId && 
          afterCutoff(order.created_at) && matchesCountry(order.user_id)) {
        counts[productStatus] = (counts[productStatus] || 0) + productQuantity;
      }
    });

    return Object.entries(counts).map(([name, value]) => {
      let translatedName = name;
      if (name === "paid") translatedName = t("statusPaid");
      else if (name === "quoted") translatedName = t("statusQuoted");
      else if (name === "requested") translatedName = t("statusRequested");
      else if (name === "sent") translatedName = t("statusShipped");
      else if (name === "cancelled") translatedName = t("statusCancelled");
      else if (name === "rejected") translatedName = t("statusRejected");
      else if (name === "received") translatedName = "Received";
      else if (name === "purchased") translatedName = "Purchased";
      return { name: translatedName, value };
    });
  }, [orders, orderItems, products, dateCutoff, countryFilter, userCountryMap, t, customDateStart, customDateEnd]);

  const itemsByCountry = useMemo<CountryData[]>(() => {
    // Count quantities from paid/received/purchased products linked to orders
    const productMap = new Map<string, { quantity: number; userId: string; status: string }>();
    products.forEach(p => {
      if (['paid', 'received', 'purchased'].includes(p.status)) {
        productMap.set(p.id, { quantity: p.quantity, userId: p.user_id, status: p.status });
      }
    });

    const counts: Record<string, number> = {};
    const processedProducts = new Set<string>();

    orderItems.forEach(item => {
      const order = orders.find(o => o.id === item.order_id);
      const product = productMap.get(item.product_request_id);
      
      if (order && product && !processedProducts.has(item.product_request_id) &&
          afterCutoff(order.created_at) && matchesCountry(order.user_id)) {
        const country = userCountryMap[product.userId] || t("statsUnknown");
        counts[country] = (counts[country] || 0) + product.quantity;
        processedProducts.add(item.product_request_id);
      }
    });

    return Object.entries(counts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders, orderItems, products, dateCutoff, countryFilter, userCountryMap, t, customDateStart, customDateEnd]);

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

  const salesByMonth = useMemo<MonthlyData[]>(() => {
    const keys = buildLast6MonthsKeys();
    const map: Record<string, number> = {};
    keys.forEach((k) => { map[k] = 0; });

    // Sumar actual_cost de envíos enviados por mes
    fSentShippings.forEach((s) => {
      const k = dateToKey(s.created_at);
      if (map[k] !== undefined && s.actual_cost) {
        map[k] += s.actual_cost;
      }
    });

    return keys.map((k) => ({ 
      month: getMonthLabel(new Date(k + "-01")), 
      sales: Math.round(map[k]) 
    }));
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

  /* ─── Top 5 Countries Registered ─── */
  const topCountriesRegistered = useMemo<TopCountry[]>(() => {
    const countryCounts: Record<string, number> = {};
    fUsers.forEach((user) => {
      const country = user.country || t("statsUnknown");
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    return Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [fUsers, t]);

  /* ─── Top 5 Countries by Orders (using JOIN logic) ─── */
  const topCountriesOrders = useMemo<TopCountry[]>(() => {
    const countryCounts: Record<string, number> = {};
    const orderItemsMap = new Map<string, string>();
    const productStatusMap = new Map<string, string>();
    
    // Map order_items to orders
    orderItems.forEach(item => orderItemsMap.set(item.id, item.order_id));
    
    // Map products to their status
    products.forEach(p => productStatusMap.set(p.id, p.status));

    // Count orders per country using JOIN logic
    orders.forEach((order) => {
      if (!afterCutoff(order.created_at) || !matchesCountry(order.user_id)) return;
      
      const country = userCountryMap[order.user_id] || t("statsUnknown");
      const validItems = orderItems.filter(item => {
        if (item.order_id !== order.id) return false;
        const product = products.find(p => p.id === item.product_request_id);
        if (!product) return false;
        return ['paid', 'received', 'purchased'].includes(product.status);
      });

      if (validItems.length > 0) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
    });

    return Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders, orderItems, products, dateCutoff, countryFilter, userCountryMap, t, customDateStart, customDateEnd]);

  return {
    loading, refetch,
    totalClients, totalOrders, itemsSold, totalShipments, repeatClients, boxShipments,
    ordersByMonth, orderStatusData, itemsByCountry, newUsersByMonth,
    shippingsByMonth, salesByMonth, shippingStatusData, shippingMethodData, allDestinations, weightByCountry,
    topCountriesRegistered, topCountriesOrders,
    showMore, setShowMore,
    dateRange, setDateRange, customDateStart, setCustomDateStart, customDateEnd, setCustomDateEnd, countryFilter, setCountryFilter, availableCountries,
  };
}
