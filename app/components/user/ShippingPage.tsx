import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StatusFlow } from "@/components/ui/status-flow";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Truck,
  Package,
  CheckCircle,
  MapPin,
  FileText,
  CreditCard,
  DollarSign,
  Clock,
  Link,
  AlertTriangle,
  AlertCircle,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/contexts/AppContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ShippingQuoteItem {
  order_item_id?: string;
  product_url?: string;
  item_name?: string;
  quantity?: number;
  weight?: number;
  has_shipping_issue?: boolean;
  shipping_issue_description?: string;
  is_box?: boolean | null;
  local_tracking_number?: string | null;
}

interface TrackingUrlEntry {
  item_id: string;
  tracking_url: string;
  box_description: string;
}

interface ShippingQuote {
  id: string;
  user_id: string;
  total_weight: number;
  estimated_cost?: number;
  actual_cost?: number;
  shipping_address: any;
  items: ShippingQuoteItem[];
  created_at: string;
  updated_at: string;
  destination: string;
  status: string;
  shipping_method: string;
  shipment_personal_id?: string;
  quote_url?: string;
  tracking_url?: string;
  tracking_urls?: TrackingUrlEntry[];
  rejection_reason?: string;
  rejection_details?: any;
}

interface OrderWithDetails {
  id: string;
  user_id: string;
  status: string;
  tracking_number?: string;
  shipped_at?: string;
  created_at: string;
  updated_at: string;
  order_items?: Array<{
    product_request: {
      id: string;
      product_url: string;
      item_name?: string;
      quantity?: number;
      status: string;
    };
  }>;
}

export const ShippingPage = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [shippingQuotes, setShippingQuotes] = useState<ShippingQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchParams] = useSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [hideRejected, setHideRejected] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cancelShipmentId, setCancelShipmentId] = useState<string | null>(null);
  const [isCancellingShipment, setIsCancellingShipment] = useState(false);
  const { t } = useApp();

  // Separate quotes by status
  const pendingQuotes = shippingQuotes.filter(
    (quote) => quote.status === "pending"
  );
  const processedQuotes = shippingQuotes.filter(
    (quote) => quote.status !== "pending"
  );
  // ✅ Helper for consistent short link display
  const formatShortUrl = (url: string): string => {
    try {
      const parsed = new URL(url);
      const domain = parsed.hostname.replace(/^www\./, "");
      const path = parsed.pathname + parsed.search + parsed.hash;
      const shortenedPath = path.length > 40 ? path.slice(0, 40) + "..." : path;
      return `${domain}${shortenedPath}`;
    } catch {
      return url; // fallback for invalid URLs
    }
  };

  // ✅ Reusable link component
  const ShortUrl: React.FC<{ url: string }> = ({ url }) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={url}
      className="ml-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline break-all"
    >
      <Link className="h-3 w-3 flex-shrink-0" />
      {formatShortUrl(url)}
    </a>
  );

  // ✅ Component to display tracking number or URL based on item type
  const ItemIdentifier: React.FC<{
    item: {
      product_url?: string;
      is_box?: boolean | null;
      local_tracking_number?: string | null;
    };
  }> = ({ item }) => {
    if (item.is_box && item.local_tracking_number) {
      return (
        <div className="ml-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Package className="h-3 w-3 flex-shrink-0" />
          <span className="font-medium">Local Tracking #:</span>
          <span>{item.local_tracking_number}</span>
        </div>
      );
    }

    if (item.product_url) {
      return <ShortUrl url={item.product_url} />;
    }

    return null;
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription for shipping_quotes updates
    const setupSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel("shipping-updates")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "shipping_quotes",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            // Refetch data when shipping quotes are updated
            fetchData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupSubscription();

    return () => {
      cleanup.then((fn) => fn?.());
    };
  }, []);

  // Handle deep linking to specific shipment
  useEffect(() => {
    const shipmentId = searchParams.get("shipmentId");
    if (shipmentId && shippingQuotes.length > 0) {
      // Open the shipment
      setOpenItems(new Set([`quote-${shipmentId}`]));
      // Scroll to it
      setTimeout(() => {
        const element = document.getElementById(`shipment-${shipmentId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [searchParams, shippingQuotes]);

  // Reset to page 1 when filter or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, itemsPerPage, hideRejected]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch shipping quotes with product request details
      const { data: quotesData, error: quotesError } = await supabase
        .from("shipping_quotes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (quotesError) throw quotesError;

      // For each quote, enrich items with product request data
      const enrichedQuotes = await Promise.all(
        (quotesData || []).map(async (quote) => {
          console.log("=== PROCESSING QUOTE ===", quote.shipment_personal_id);
          console.log(
            "Quote items BEFORE enrichment:",
            JSON.stringify(quote.items, null, 2)
          );

          const enrichedItems = await Promise.all(
            (quote.items as any[]).map(async (item: any, index: number) => {
              console.log(`\n--- Processing item ${index} ---`);
              console.log("Original item:", JSON.stringify(item, null, 2));

              if (item.order_item_id) {
                // First try: query product_requests directly (for items stored as product_request_id)
                const { data: productRequestData, error: prError } =
                  await supabase
                    .from("product_requests")
                    .select(
                      "product_url, item_name, quantity, weight, has_shipping_issue, shipping_issue_description, is_box, local_tracking_number"
                    )
                    .eq("id", item.order_item_id)
                    .maybeSingle();

                console.log(
                  `Query product_requests with id: ${item.order_item_id}`
                );
                console.log("Result:", productRequestData);
                console.log("Error:", prError);

                if (productRequestData) {
                  const enrichedItem = {
                    ...item,
                    ...productRequestData,
                    item_name: productRequestData.item_name || item.item_name,
                  };
                  console.log(
                    "✅ Enriched item (direct):",
                    JSON.stringify(enrichedItem, null, 2)
                  );
                  return enrichedItem;
                }

                // Second try: order_item_id might be an order_items.id
                const { data: orderItemData, error: oiError } = await supabase
                  .from("order_items")
                  .select("product_request_id")
                  .eq("id", item.order_item_id)
                  .maybeSingle();

                console.log(`Query order_items with id: ${item.order_item_id}`);
                console.log("Result:", orderItemData);
                console.log("Error:", oiError);

                if (orderItemData?.product_request_id) {
                  const { data: productRequestData2 } = await supabase
                    .from("product_requests")
                    .select(
                      "product_url, item_name, quantity, weight, has_shipping_issue, shipping_issue_description, is_box, local_tracking_number"
                    )
                    .eq("id", orderItemData.product_request_id)
                    .maybeSingle();

                  console.log(
                    "Product request via junction:",
                    productRequestData2
                  );

                  if (productRequestData2) {
                    const enrichedItem = {
                      ...item,
                      ...productRequestData2,
                      item_name:
                        productRequestData2.item_name || item.item_name,
                    };
                    console.log(
                      "✅ Enriched item (via junction):",
                      JSON.stringify(enrichedItem, null, 2)
                    );
                    return enrichedItem;
                  }
                }
              }
              console.log("❌ No enrichment, returning original");
              return item;
            })
          );

          console.log(
            "Quote items AFTER enrichment:",
            JSON.stringify(enrichedItems, null, 2)
          );

          return {
            ...quote,
            items: enrichedItems,
            tracking_urls:
              (quote.tracking_urls as unknown as TrackingUrlEntry[] | null) ||
              undefined,
          };
        })
      );

      setShippingQuotes(enrichedQuotes);

      // Fetch shipped orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            product_request:product_requests (*)
          )
        `
        )
        .eq("user_id", user.id)
        .eq("status", "shipped")
        .order("updated_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);
    } catch (error) {
      console.error(t("shippingDataLoadError"), error);
      toast.error(t("shippingDataLoadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchData();
      toast.success(t("shippingDataUpdated"));
    } catch (error) {
      toast.error(t("shippingDataUpdateError"));
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancelShipment = async () => {
    if (!cancelShipmentId) return;

    setIsCancellingShipment(true);
    try {
      const { error } = await supabase
        .from("shipping_quotes")
        .update({ status: "cancelled" })
        .eq("id", cancelShipmentId);

      if (error) throw error;

      toast.success(t("shipmentCancelledSuccess"));
      await fetchData();
    } catch (error) {
      console.error("Error cancelling shipment:", error);
      toast.error(t("shipmentCancelError"));
    } finally {
      setIsCancellingShipment(false);
      setCancelShipmentId(null);
    }
  };

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const getShippingQuoteSteps = (status: string) => {
    type StepStatus = "completed" | "current" | "upcoming" | "rejected";

    // For rejected shipments, show simplified flow
    if (status === "rejected") {
      return [
        {
          label: t("requestSubmittedStatus"),
          status: "completed" as StepStatus,
          icon: <Package className="h-4 w-4" />,
        },
        {
          label: t("statusRejectedBadge"),
          status: "rejected" as StepStatus,
          icon: <AlertCircle className="h-4 w-4" />,
        },
      ];
    }

    // For cancelled shipments, show simplified flow
    if (status === "cancelled") {
      return [
        {
          label: t("requestSubmittedStatus"),
          status: "completed" as StepStatus,
          icon: <Package className="h-4 w-4" />,
        },
        {
          label: t("statusCancelled"),
          status: "rejected" as StepStatus,
          icon: <X className="h-4 w-4" />,
        },
      ];
    }

    const steps = [
      {
        label: t("requestSubmittedStatus"),
        status: "upcoming" as StepStatus,
        icon: <Package className="h-4 w-4" />,
      },
      {
        label: t("awaitingPaymentStatus"),
        status: "upcoming" as StepStatus,
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        label: t("paymentReceivedStatus"),
        status: "upcoming" as StepStatus,
        icon: <DollarSign className="h-4 w-4" />,
      },
      {
        label: t("itemsShipped"),
        status: "upcoming" as StepStatus,
        icon: <Truck className="h-4 w-4" />,
      },
    ];

    // Update step statuses based on current status
    if (status === "pending") {
      steps[0].status = "current";
    } else if (status === "quoted") {
      steps[0].status = "completed";
      steps[1].status = "current";
    } else if (status === "paid") {
      steps[0].status = "completed";
      steps[1].status = "completed";
      steps[2].status = "completed";
      steps[3].status = "current";
    } else if (status === "shipped" || status === "sent") {
      // Handle both 'shipped' and 'sent' statuses
      steps.forEach((step) => (step.status = "completed"));
    }

    return steps;
  };

  const getShippingSteps = () => {
    type StepStatus = "completed" | "current" | "upcoming";
    return [
      {
        label: "Processing",
        status: "completed" as StepStatus,
        icon: <Clock className="h-4 w-4" />,
      },
      {
        label: "Shipped",
        status: "current" as StepStatus,
        icon: <Truck className="h-4 w-4" />,
      },
      {
        label: "In Transit",
        status: "upcoming" as StepStatus,
        icon: <Package className="h-4 w-4" />,
      },
      {
        label: "Delivered",
        status: "upcoming" as StepStatus,
        icon: <CheckCircle className="h-4 w-4" />,
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">{t("loadingShipments")}</div>
    );
  }

  if (shippingQuotes.length === 0 && orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t("noShipmentsYet")}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("noShipmentsDescription")}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Combine all shipments for filtering and pagination
  const allShipments = [
    ...pendingQuotes.map((q) => ({ ...q, type: "pending_quote" as const })),
    ...processedQuotes.map((q) => ({ ...q, type: "processed_quote" as const })),
    ...orders.map((o) => ({ ...o, type: "shipped_order" as const })),
  ];

  // Filter by status
  let filteredShipments = allShipments;

  if (statusFilter === "awaiting_quote") {
    filteredShipments = allShipments.filter((s) => s.type === "pending_quote");
  } else if (statusFilter === "quoted") {
    filteredShipments = allShipments.filter(
      (s) => s.type === "processed_quote" && s.status === "quoted"
    );
  } else if (statusFilter === "paid") {
    filteredShipments = allShipments.filter(
      (s) => s.type === "processed_quote" && s.status === "paid"
    );
  } else if (statusFilter === "shipped") {
    filteredShipments = allShipments.filter(
      (s) =>
        (s.type === "processed_quote" &&
          (s.status === "shipped" || s.status === "sent")) ||
        s.type === "shipped_order"
    );
  } else if (statusFilter === "rejected") {
    filteredShipments = allShipments.filter(
      (s) => s.type === "processed_quote" && s.status === "rejected"
    );
  } else if (statusFilter === "cancelled") {
    filteredShipments = allShipments.filter(
      (s) => s.type === "processed_quote" && s.status === "cancelled"
    );
  }

  // Hide rejected and cancelled shipments if checkbox is checked
  if (hideRejected) {
    filteredShipments = filteredShipments.filter(
      (s) =>
        !(
          s.type === "processed_quote" &&
          (s.status === "rejected" || s.status === "cancelled")
        )
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedShipments = filteredShipments.slice(startIndex, endIndex);

  // Separate paginated shipments back into their types
  const paginatedPendingQuotes = paginatedShipments.filter(
    (s) => s.type === "pending_quote"
  ) as (ShippingQuote & { type: "pending_quote" })[];
  const paginatedProcessedQuotes = paginatedShipments.filter(
    (s) => s.type === "processed_quote"
  ) as (ShippingQuote & { type: "processed_quote" })[];
  const paginatedShippedOrders = paginatedShipments.filter(
    (s) => s.type === "shipped_order"
  ) as (OrderWithDetails & { type: "shipped_order" })[];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">{t("shippingTitle")}</h2>

      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="mb-4 gap-2"
      >
        <Filter className="h-4 w-4" />
        {t("filterShipments")}
        {isFilterOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {/* Collapsible Filters */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <Card className="bg-muted/30 mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                {/* --- Left group: Status + Show per page --- */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {t("statusFilter")}
                    </span>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[160px] sm:w-[190px]">
                        <SelectValue placeholder={t("selectStatus")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("allStatuses")}</SelectItem>
                        <SelectItem value="awaiting_quote">
                          {t("statusAwaitingQuote")}
                        </SelectItem>
                        <SelectItem value="quoted">
                          {t("statusQuoted")}
                        </SelectItem>
                        <SelectItem value="paid">
                          {t("statusPaymentReceived")}
                        </SelectItem>
                        <SelectItem value="shipped">
                          {t("statusShippedBadge")}
                        </SelectItem>
                        <SelectItem value="rejected">
                          {t("statusRejectedBadge")}
                        </SelectItem>
                        <SelectItem value="cancelled">
                          {t("statusCancelled")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Show Per Page */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {t("showPerPage")}
                    </span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(val) => setItemsPerPage(Number(val))}
                    >
                      <SelectTrigger className="w-[70px] sm:w-[90px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                      {t("perPage")}
                    </span>
                  </div>
                </div>

                {/* --- Right group: Hide Rejected + Update --- */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Hide Rejected */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="hide-rejected"
                      checked={hideRejected}
                      onCheckedChange={(checked) =>
                        setHideRejected(checked === true)
                      }
                    />
                    <label
                      htmlFor="hide-rejected"
                      className="text-sm font-medium cursor-pointer whitespace-nowrap"
                    >
                      {t("hideRejectedCancelled")}
                    </label>
                  </div>

                  {/* Refresh Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="gap-2"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                    />
                    {refreshing ? t("refreshing") : t("update")}
                  </Button>
                </div>
              </div>

              {/* Showing count text */}
              {filteredShipments.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  {t("showingShipments")} {startIndex + 1}-
                  {Math.min(endIndex, filteredShipments.length)}{" "}
                  {t("ofShipments")} {filteredShipments.length}{" "}
                  {t("shipmentsText")}
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Empty State for Filtered Shipments */}
      {filteredShipments.length === 0 &&
        (shippingQuotes.length > 0 || orders.length > 0) && (
          <Card>
            <CardContent className="p-8 text-center">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {t("noShipmentsWithFilter")}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t("noShipmentsWithFilter")}
              </p>
            </CardContent>
          </Card>
        )}

      {/* Shipping Requests Awaiting Quote */}
      {paginatedPendingQuotes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            {t("shippingRequestsAwaitingQuote")}
            <Badge
              variant="outline"
              className="border-yellow-500 text-yellow-700"
            >
              {pendingQuotes.length}
            </Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("awaitingQuoteDescription")}
          </p>
          {paginatedPendingQuotes.map((quote) => {
            const isOpen = openItems.has(`quote-${quote.id}`);
            const totalItems = quote.items.reduce(
              (sum, item) => sum + (item.quantity || 1),
              0
            );

            return (
              <Collapsible key={quote.id} open={isOpen}>
                <Card id={`shipment-${quote.id}`} className="border-primary/20">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => toggleItem(`quote-${quote.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          {t("shipmentNumber")}
                          {quote.shipment_personal_id || quote.id.slice(0, 8)}
                        </CardTitle>
                        <Badge
                          className={
                            quote.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : quote.status === "quoted"
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : quote.status === "paid"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : quote.status === "rejected"
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : quote.status === "cancelled"
                                      ? "bg-gray-100 text-gray-800 border-gray-200"
                                      : "bg-purple-100 text-purple-800 border-purple-200"
                          }
                        >
                          {quote.status === "pending" &&
                            t("statusAwaitingQuoteBadge")}
                          {quote.status === "quoted" &&
                            t("statusAwaitingPaymentBadge")}
                          {quote.status === "paid" &&
                            t("statusPaymentReceivedBadge")}
                          {(quote.status === "shipped" ||
                            quote.status === "sent") &&
                            t("statusShippedBadge")}
                          {quote.status === "rejected" &&
                            t("statusRejectedBadge")}
                          {quote.status === "cancelled" && t("statusCancelled")}
                        </Badge>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleItem(`quote-${quote.id}`)}
                        >
                          {isOpen ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("requestedOn")}{" "}
                      {new Date(quote.created_at).toLocaleDateString()} •
                      {totalItems} {totalItems === 1 ? "item" : "items"} •
                      {quote.total_weight}g •{quote.destination} •
                      {quote.shipping_method}
                    </p>
                  </CardHeader>

                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <CardContent className="space-y-4">
                      {/* Status Flow */}
                      <StatusFlow steps={getShippingQuoteSteps(quote.status)} />

                      {/* Rejection Reason */}
                      {quote.status === "rejected" &&
                        quote.rejection_reason && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{t("rejectionReasonTitle")}</AlertTitle>
                            <AlertDescription>
                              {quote.rejection_reason}
                            </AlertDescription>
                          </Alert>
                        )}

                      {/* Quote URL if available */}
                      {quote.quote_url && quote.status === "quoted" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <p className="text-sm font-medium text-blue-900">
                                {t("paymentLinkAvailable")}
                              </p>
                              <p className="text-xs text-blue-700 mt-1">
                                {t("clickToPay")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500 text-blue-700 hover:bg-blue-50"
                                onClick={() =>
                                  window.open(quote.quote_url, "_blank")
                                }
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                {t("payNow")}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-700 hover:bg-red-50"
                                onClick={() => setCancelShipmentId(quote.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                {t("cancelShipment")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quote URL after payment confirmed */}
                      {quote.quote_url &&
                        (quote.status === "paid" ||
                          quote.status === "shipped" ||
                          quote.status === "sent") && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-900">
                                  {t("paymentConfirmed")}
                                </p>
                                <p className="text-xs text-green-700 mt-1">
                                  {t("shippingPaymentReceived")}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500 text-green-700 hover:bg-green-50"
                                onClick={() =>
                                  window.open(quote.quote_url, "_blank")
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {t("viewInvoice")}
                              </Button>
                            </div>
                          </div>
                        )}

                      {/* Tracking - Show based on whether we have box items or single package */}
                      {(quote.status === "shipped" ||
                        quote.status === "sent") &&
                        (() => {
                          const boxItems = quote.items.filter(
                            (item) => item.is_box === true
                          );
                          console.log("Box Items:", boxItems);

                          if (boxItems.length > 0) {
                            // Multiple boxes - show individual tracking buttons
                            return (
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="mb-3">
                                  <p className="text-sm font-medium text-purple-900">
                                    Track Your Boxes
                                  </p>
                                  <p className="text-xs text-purple-700 mt-1">
                                    Each box can be tracked individually
                                  </p>
                                </div>
                                <div className="space-y-3">
                                  {boxItems.map((boxItem, index) => {
                                    console.log(
                                      "Individual Box Item:",
                                      boxItem
                                    );
                                    // Find matching tracking URL from tracking_urls array
                                    const trackingEntry =
                                      quote.tracking_urls?.find(
                                        (entry) =>
                                          entry.item_id ===
                                          boxItem.order_item_id
                                      );

                                    return (
                                      <div
                                        key={boxItem.order_item_id || index}
                                        className="flex items-center justify-between p-3 bg-white rounded border border-purple-200"
                                      >
                                        <div className="flex items-center gap-2">
                                          <Package className="h-4 w-4 text-purple-700" />
                                          <div>
                                            <p className="text-sm font-medium text-purple-900">
                                              {boxItem.item_name ||
                                                `Box ${index + 1}`}
                                            </p>
                                            {boxItem.local_tracking_number && (
                                              <p className="text-xs text-purple-600">
                                                Tracking:{" "}
                                                {boxItem.local_tracking_number}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        {trackingEntry?.tracking_url && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-purple-500 text-purple-700 hover:bg-purple-50"
                                            onClick={() =>
                                              window.open(
                                                trackingEntry.tracking_url,
                                                "_blank"
                                              )
                                            }
                                          >
                                            <Truck className="h-4 w-4 mr-1" />
                                            {t("trackPackage")}
                                          </Button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          } else if (quote.tracking_url) {
                            // Single package - show original single button
                            return (
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-purple-900">
                                      {t("shipmentTracking")}
                                    </p>
                                    <p className="text-xs text-purple-700 mt-1">
                                      {t("shipmentTrackingInfo")}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-purple-500 text-purple-700 hover:bg-purple-50"
                                    onClick={() =>
                                      window.open(quote.tracking_url, "_blank")
                                    }
                                  >
                                    <Truck className="h-4 w-4 mr-1" />
                                    {t("trackPackage")}
                                  </Button>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}

                      {/* Costs */}
                      {(quote.estimated_cost || quote.actual_cost) && (
                        <div className="bg-primary/5 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {quote.estimated_cost && (
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  {t("estimatedCost")}
                                </p>
                                <p className="text-lg font-semibold">
                                  ¥{quote.estimated_cost.toLocaleString()}
                                </p>
                              </div>
                            )}
                            {quote.actual_cost && (
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  {t("finalQuote")}
                                </p>
                                <p className="text-lg font-semibold text-primary">
                                  ¥{quote.actual_cost.toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">
                          {t("itemsInShipment")}
                        </h4>
                        {quote.status === "rejected" &&
                        quote.rejection_details?.product_issues
                          ? // For rejected shipments, show historical snapshot from rejection_details
                            quote.rejection_details.product_issues.map(
                              (issue: any, index: number) => {
                                const hasIssue = issue.has_issue;

                                return (
                                  <div
                                    key={index}
                                    className={`flex items-center justify-between p-2 rounded ${
                                      hasIssue
                                        ? "bg-destructive/10 border border-destructive/30"
                                        : "bg-secondary/30"
                                    }`}
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-start gap-2">
                                        {hasIssue && (
                                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                        )}
                                        <div className="flex-1">
                                          <p
                                            className={`text-sm font-medium ${hasIssue ? "text-destructive" : ""}`}
                                          >
                                            {issue.item_name ||
                                              "Unnamed Product"}
                                          </p>

                                          <ItemIdentifier item={issue} />

                                          {hasIssue &&
                                            issue.issue_description && (
                                              <p className="text-xs text-destructive/80 mt-1">
                                                {t("issuePrefix")}{" "}
                                                {issue.issue_description}
                                              </p>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-sm text-muted-foreground">
                                        Qty: {issue.quantity || 1}
                                      </span>
                                      {issue.weight && (
                                        <span className="text-xs text-muted-foreground block">
                                          {issue.weight}g
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )
                          : // For non-rejected shipments, show current live data
                            quote.items.map(
                              (item: ShippingQuoteItem, index: number) => {
                                const hasIssue =
                                  item.has_shipping_issue &&
                                  quote.status === "rejected";

                                return (
                                  <div
                                    key={index}
                                    className={`flex items-center justify-between p-2 rounded ${
                                      hasIssue
                                        ? "bg-destructive/10 border border-destructive/30"
                                        : "bg-secondary/30"
                                    }`}
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-start gap-2">
                                        {hasIssue && (
                                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                        )}
                                        <div className="flex-1">
                                          <p
                                            className={`text-sm font-medium ${hasIssue ? "text-destructive" : ""}`}
                                          >
                                            {item.item_name ||
                                              "Unnamed Product"}
                                          </p>
                                          <ItemIdentifier item={item} />

                                          {hasIssue &&
                                            item.shipping_issue_description && (
                                              <p className="text-xs text-destructive/80 mt-1">
                                                {t("issuePrefix")}{" "}
                                                {
                                                  item.shipping_issue_description
                                                }
                                              </p>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-sm text-muted-foreground">
                                        Qty: {item.quantity || 1}
                                      </span>
                                      {item.weight && (
                                        <span className="text-xs text-muted-foreground block">
                                          {item.weight}g
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                      </div>

                      {quote.shipping_address && (
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-sm mb-2">
                            {t("shippingAddressLabel")}
                          </h4>
                          <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
                            <p>
                              <span className="font-medium">
                                {t("addressName")}
                              </span>{" "}
                              {quote.shipping_address.full_name}
                            </p>
                            <p>
                              <span className="font-medium">
                                {t("addressPhone")}
                              </span>{" "}
                              {quote.shipping_address.phone_number}
                            </p>
                            <p>
                              <span className="font-medium">
                                {t("address")}
                              </span>{" "}
                              {quote.shipping_address.address}
                            </p>
                            {quote.shipping_address.address_notes && (
                              <p>
                                <span className="font-medium">
                                  {t("addressNotes")}
                                </span>{" "}
                                {quote.shipping_address.address_notes}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">
                                {t("cityState")}
                              </span>{" "}
                              {quote.shipping_address.city || "-"},{" "}
                              {quote.shipping_address.state || "-"}
                            </p>
                            <p>
                              <span className="font-medium">
                                {t("postalCode")}
                              </span>{" "}
                              {quote.shipping_address.postal_code}
                            </p>
                            <p>
                              <span className="font-medium">
                                {t("country")}
                              </span>{" "}
                              {quote.shipping_address.country}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      )}

      {/* Shipments Section (Processed Quotes) */}
      {paginatedProcessedQuotes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("shipmentsTitle")}
            <Badge variant="outline">{processedQuotes.length}</Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("shipmentsDescription")}
          </p>
          {paginatedProcessedQuotes.map((quote) => {
            const isOpen = openItems.has(`quote-${quote.id}`);
            const totalItems = quote.items.reduce(
              (sum, item) => sum + (item.quantity || 1),
              0
            );

            return (
              <Collapsible key={quote.id} open={isOpen}>
                <Card className="border-primary/20">
                  <CardHeader
                    onClick={() => toggleItem(`quote-${quote.id}`)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors border-b border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          {t("shipmentNumber")}
                          {quote.shipment_personal_id || quote.id.slice(0, 8)}
                        </CardTitle>
                        <Badge
                          className={
                            quote.status === "quoted"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : quote.status === "paid"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : quote.status === "rejected"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : quote.status === "cancelled"
                                    ? "bg-gray-100 text-gray-800 border-gray-200"
                                    : "bg-purple-100 text-purple-800 border-purple-200"
                          }
                        >
                          {quote.status === "quoted" &&
                            t("statusAwaitingPaymentBadge")}
                          {quote.status === "paid" &&
                            t("statusPaymentReceivedBadge")}
                          {(quote.status === "shipped" ||
                            quote.status === "sent") &&
                            t("statusShippedBadge")}
                          {quote.status === "rejected" &&
                            t("statusRejectedBadge")}
                          {quote.status === "cancelled" && t("statusCancelled")}
                        </Badge>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleItem(`quote-${quote.id}`)}
                        >
                          {isOpen ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("requestedOn")}{" "}
                      {new Date(quote.created_at).toLocaleDateString()} •
                      {totalItems} {totalItems === 1 ? "item" : "items"} •
                      {quote.total_weight}g •{quote.destination} •
                      {quote.shipping_method}
                    </p>
                  </CardHeader>

                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <CardContent className="space-y-4">
                      {/* Status Flow */}
                      <StatusFlow steps={getShippingQuoteSteps(quote.status)} />

                      {/* Rejection Reason */}
                      {quote.status === "rejected" &&
                        quote.rejection_reason && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{t("rejectionReasonTitle")}</AlertTitle>
                            <AlertDescription>
                              {quote.rejection_reason}
                            </AlertDescription>
                          </Alert>
                        )}

                      {/* Quote URL if available */}
                      {quote.quote_url && quote.status === "quoted" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <p className="text-sm font-medium text-blue-900">
                                {t("paymentLinkAvailable")}
                              </p>
                              <p className="text-xs text-blue-700 mt-1">
                                {t("clickToPay")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500 text-blue-700 hover:bg-blue-50"
                                onClick={() =>
                                  window.open(quote.quote_url, "_blank")
                                }
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                {t("payNow")}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-700 hover:bg-red-50"
                                onClick={() => setCancelShipmentId(quote.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                {t("cancelShipment")}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quote URL after payment confirmed */}
                      {quote.quote_url &&
                        (quote.status === "paid" ||
                          quote.status === "shipped" ||
                          quote.status === "sent") && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-900">
                                  {t("paymentConfirmed")}
                                </p>
                                <p className="text-xs text-green-700 mt-1">
                                  {t("shippingPaymentReceived")}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-500 text-green-700 hover:bg-green-50"
                                onClick={() =>
                                  window.open(quote.quote_url, "_blank")
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                {t("viewInvoice")}
                              </Button>
                            </div>
                          </div>
                        )}

                      {/* Tracking URLs when shipped */}
                      {(quote.status === "shipped" ||
                        quote.status === "sent") && (
                        <>
                          {quote.tracking_urls &&
                          quote.tracking_urls.length > 0 ? (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                              <p className="text-sm font-medium text-purple-900">
                                {t("shipmentTracking")}
                              </p>
                              {quote.tracking_urls.map((entry, index) => (
                                <div
                                  key={entry.item_id}
                                  className="flex items-center justify-between gap-2 py-2 border-t first:border-t-0"
                                >
                                  <div className="flex items-start gap-2 flex-1">
                                    <Package className="h-4 w-4 text-purple-700 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <p className="text-sm text-purple-900">
                                        {quote.items.find(
                                          (item) =>
                                            item.order_item_id === entry.item_id
                                        )?.item_name || "Package"}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-purple-500 text-purple-700 hover:bg-purple-50 flex-shrink-0"
                                    onClick={() =>
                                      window.open(entry.tracking_url, "_blank")
                                    }
                                  >
                                    <Truck className="h-4 w-4 mr-1" />
                                    {t("trackPackage")}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : quote.tracking_url ? (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-purple-900">
                                    {t("shipmentTracking")}
                                  </p>
                                  <p className="text-xs text-purple-700 mt-1">
                                    {t("shipmentTrackingInfo")}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-purple-500 text-purple-700 hover:bg-purple-50"
                                  onClick={() =>
                                    window.open(quote.tracking_url, "_blank")
                                  }
                                >
                                  <Truck className="h-4 w-4 mr-1" />
                                  {t("trackPackage")}
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </>
                      )}

                      {/* Costs */}
                      {(quote.estimated_cost || quote.actual_cost) && (
                        <div className="bg-primary/5 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4">
                            {quote.estimated_cost && (
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  {t("estimatedCost")}
                                </p>
                                <p className="text-lg font-semibold">
                                  ¥{quote.estimated_cost.toLocaleString()}
                                </p>
                              </div>
                            )}
                            {quote.actual_cost && (
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  {t("finalQuote")}
                                </p>
                                <p className="text-lg font-semibold text-primary">
                                  ¥{quote.actual_cost.toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">{t("items")}</h4>
                        {quote.status === "rejected" &&
                        quote.rejection_details?.product_issues
                          ? // For rejected shipments, show historical snapshot from rejection_details
                            quote.rejection_details.product_issues.map(
                              (issue: any, index: number) => {
                                const hasIssue = issue.has_issue;

                                return (
                                  <div
                                    key={index}
                                    className={`flex items-start justify-between py-2 border-b last:border-0 ${
                                      hasIssue
                                        ? "bg-red-50 -mx-2 px-2 rounded"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-start gap-2">
                                        {hasIssue && (
                                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                        )}
                                        <div className="flex-1">
                                          <p
                                            className={`text-sm font-medium ${hasIssue ? "text-destructive" : ""}`}
                                          >
                                            {issue.item_name ||
                                              "Unnamed Product"}
                                          </p>
                                          <ItemIdentifier item={issue} />

                                          {hasIssue &&
                                            issue.issue_description && (
                                              <p className="text-xs text-destructive/80 mt-1">
                                                {t("issuePrefix")}{" "}
                                                {issue.issue_description}
                                              </p>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-sm text-muted-foreground">
                                        Qty: {issue.quantity || 1}
                                      </span>
                                      {issue.weight && (
                                        <span className="text-xs text-muted-foreground block">
                                          {issue.weight}g
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              }
                            )
                          : // For non-rejected shipments, show current live data
                            quote.items.map((item, index) => {
                              const hasIssue = item.has_shipping_issue;

                              return (
                                <div
                                  key={index}
                                  className={`flex items-start justify-between py-2 border-b last:border-0 ${
                                    hasIssue
                                      ? "bg-red-50 -mx-2 px-2 rounded"
                                      : ""
                                  }`}
                                >
                                  <div className="flex-1">
                                    <div className="flex items-start gap-2">
                                      {hasIssue && (
                                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                      )}
                                      <div className="flex-1">
                                        <p
                                          className={`text-sm font-medium ${hasIssue ? "text-destructive" : ""}`}
                                        >
                                          {item.item_name || "Unnamed Product"}
                                        </p>
                                        <ItemIdentifier item={item} />

                                        {hasIssue &&
                                          item.shipping_issue_description && (
                                            <p className="text-xs text-destructive/80 mt-1">
                                              {t("issuePrefix")}{" "}
                                              {item.shipping_issue_description}
                                            </p>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm text-muted-foreground">
                                      Qty: {item.quantity || 1}
                                    </span>
                                    {item.weight && (
                                      <span className="text-xs text-muted-foreground block">
                                        {item.weight}g
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                      </div>

                      {quote.shipping_address && (
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-sm mb-2">
                            {t("shippingAddressLabel")}
                          </h4>
                          <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1">
                            <p>
                              <span className="font-medium">
                                {t("addressName")}
                              </span>{" "}
                              {quote.shipping_address.full_name}
                            </p>
                            <p>
                              <span className="font-medium">
                                {t("addressPhone")}
                              </span>{" "}
                              {quote.shipping_address.phone_number}
                            </p>
                            <p>
                              <span className="font-medium">
                                {t("address")}
                              </span>{" "}
                              {quote.shipping_address.address}
                            </p>
                            {quote.shipping_address.address_notes && (
                              <p>
                                <span className="font-medium">
                                  {t("addressNotes")}
                                </span>{" "}
                                {quote.shipping_address.address_notes}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">
                                {t("cityState")}
                              </span>{" "}
                              {quote.shipping_address.city || "-"},{" "}
                              {quote.shipping_address.state || "-"}
                            </p>
                            <p>
                              <span className="font-medium">
                                {t("postalCode")}
                              </span>{" "}
                              {quote.shipping_address.postal_code}
                            </p>
                            <p>
                              <span className="font-medium">
                                {t("country")}
                              </span>{" "}
                              {quote.shipping_address.country}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      )}

      {/* Shipped Orders Section */}
      {paginatedShippedOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipped Orders
          </h3>
          {paginatedShippedOrders.map((order) => {
            const isOpen = openItems.has(`order-${order.id}`);
            const totalItems =
              order.order_items?.reduce(
                (sum, item) => sum + (item.product_request.quantity || 1),
                0
              ) || 0;

            return (
              <Collapsible key={order.id} open={isOpen}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <CardTitle className="text-lg">
                          Order #{order.id.slice(0, 8)}
                        </CardTitle>
                        <Badge className="bg-blue-100 text-blue-800">
                          <Truck className="h-4 w-4 mr-1" />
                          Shipped
                        </Badge>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleItem(`order-${order.id}`)}
                        >
                          {isOpen ? <ChevronUp /> : <ChevronDown />}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Shipped on{" "}
                      {order.shipped_at
                        ? new Date(order.shipped_at).toLocaleDateString()
                        : "N/A"}{" "}
                      • {totalItems} {totalItems === 1 ? "item" : "items"}
                    </p>
                  </CardHeader>

                  <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <CardContent className="space-y-4">
                      <StatusFlow steps={getShippingSteps()} />

                      {order.tracking_number && (
                        <div className="bg-primary/5 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Tracking Number</p>
                              <p className="text-lg font-mono">
                                {order.tracking_number}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <MapPin className="h-4 w-4 mr-2" />
                              Track Package
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">
                          Items in this shipment:
                        </h4>
                        {order.order_items?.map((item) => (
                          <div
                            key={item.product_request.id}
                            className="flex items-center justify-between p-2 bg-secondary/30 rounded"
                          >
                            <p className="text-sm">
                              {item.product_request.item_name ||
                                "Unnamed Product"}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              Qty: {item.product_request.quantity || 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredShipments.length > 0 && totalPages > 1 && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Shipment Confirmation Dialog */}
      <AlertDialog
        open={!!cancelShipmentId}
        onOpenChange={(open) => !open && setCancelShipmentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmCancelShipment")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("cancelShipmentWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancellingShipment}>
              {t("keepShipment")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCancelShipment();
              }}
              disabled={isCancellingShipment}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancellingShipment ? t("cancelling") : t("cancelShipment")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
