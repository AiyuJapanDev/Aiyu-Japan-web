import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StatusFlow } from "@/components/ui/status-flow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
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
import {
  ChevronDown,
  ChevronUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Link,
  DollarSign,
  ShoppingCart,
  Home,
  AlertTriangle,
  Edit,
  Truck,
  PackageCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Filter,
} from "lucide-react";

interface OrderWithDetails {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  order_personal_id?: string;
  is_rejected?: boolean;
  is_cancelled?: boolean;
  cancelled_at?: string;
  rejection_reason?: string;
  rejection_details?: {
    rejection_reason: string;
    rejected_at: string;
    product_issues: Array<{
      product_id: string;
      product_url: string;
      item_name?: string;
      quantity?: number;
      has_issue: boolean;
      issue_description?: string;
    }>;
  };
  quotes?: Array<{
    id: string;
    type: string;
    price_jpy: number;
    status: string;
    quote_url: string;
  }>;
  order_items?: Array<{
    product_request: {
      id: string;
      product_url: string;
      item_name?: string;
      quantity?: number;
      notes?: string;
      status: string;
      rejection_reason?: string;
      has_purchase_issue?: boolean;
      purchase_issue_description?: string;
    };
  }>;
}

export const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openOrders, setOpenOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [hideRejected, setHideRejected] = useState(false);
  const [showCancelled, setShowCancelled] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useApp();
  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset to page 1 when filter or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, itemsPerPage, hideRejected, showCancelled]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Handle deep linking to specific order
  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId && orders.length > 0) {
      // Open the order
      setOpenOrders(new Set([orderId]));
      // Scroll to it
      setTimeout(() => {
        const element = document.getElementById(`order-${orderId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [searchParams, orders]);

  const fetchOrders = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          quotes (*),
          order_items (
            product_request:product_requests (*)
          )
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Show all orders that don't have shipping quotes
      const filteredOrders =
        data?.filter((order) => {
          const hasShippingQuote =
            order.quotes?.some((q: any) => q.type === "shipping") ?? false;
          return !hasShippingQuote;
        }) || [];

      setOrders(filteredOrders as any);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId: string) => {
    const newOpenOrders = new Set(openOrders);
    if (newOpenOrders.has(orderId)) {
      newOpenOrders.delete(orderId);
    } else {
      newOpenOrders.add(orderId);
    }
    setOpenOrders(newOpenOrders);
  };

  const getPurchaseProgress = (order: OrderWithDetails) => {
    const statuses =
      order.order_items?.map((item) => item.product_request.status) ?? [];
    const purchasedCount = statuses.filter((s) => s === "purchased").length;
    const receivedCount = statuses.filter((s) => s === "received").length;
    const totalCount = statuses.length;

    return {
      somePurchased:
        purchasedCount > 0 &&
        purchasedCount < totalCount &&
        receivedCount === 0,
      allPurchased:
        purchasedCount === totalCount && totalCount > 0 && receivedCount === 0,
      someReceived: receivedCount > 0 && receivedCount < totalCount,
      allReceived: receivedCount === totalCount && totalCount > 0,
      purchasedCount,
      receivedCount,
      totalCount,
    };
  };

  const getOrderStatus = (order: OrderWithDetails): string => {
    if (order.is_cancelled) return "cancelled";
    if (order.is_rejected) return "rejected";

    const productStatuses =
      order.order_items?.map((item) => item.product_request.status) ?? [];
    const progress = getPurchaseProgress(order);

    // Check if all items are at warehouse
    if (progress.allReceived) {
      return "all_received";
    }

    // Check if some items are purchased and some at warehouse (in transit)
    if (
      progress.allPurchased ||
      (progress.purchasedCount > 0 && progress.receivedCount > 0)
    ) {
      return "in_transit";
    }

    // Check purchase status
    if (progress.somePurchased) return "some_purchased";

    const productQuote = order.quotes?.find((q) => q.type === "product");
    if (productQuote) {
      return productQuote.status === "paid" ? "paid" : "quoted";
    }

    return "requested";
  };

  const getStatusSteps = (status: string, order: OrderWithDetails) => {
    type StepStatus = "completed" | "current" | "rejected" | "upcoming";
    const progress = getPurchaseProgress(order);

    // Determine dynamic labels for purchase and transit steps
    const purchaseLabel =
      progress.allPurchased ||
      status === "in_transit" ||
      status === "all_received"
        ? t("statusStepItemsPurchased")
        : t("statusStepItemsBeingPurchased");

    const steps = [
      {
        label: t("statusStepRequestSubmitted"),
        status: "upcoming",
        icon: <Clock className="h-4 w-4" />,
      },
      {
        label: t("statusStepPaymentConfirmed"),
        status: "upcoming",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      {
        label: purchaseLabel,
        status: "upcoming",
        icon: <ShoppingCart className="h-4 w-4" />,
      },
      {
        label: t("statusStepItemsOnTheWay"),
        status: "upcoming",
        icon: <Truck className="h-4 w-4" />,
      },
      {
        label: t("statusStepAllAtWarehouse"),
        status: "upcoming",
        icon: <Home className="h-4 w-4" />,
      },
    ];

    const statusMap: Record<string, number> = {
      requested: 0,
      quoted: 0,
      paid: 1,
      some_purchased: 2,
      all_purchased: 2,
      in_transit: 3,
      received: 4,
      all_received: 4,
    };

    const currentIndex = statusMap[status] ?? -1;
    if (status === "rejected") {
      return [
        {
          label: t("statusStepRequestSubmitted"),
          status: "completed" as StepStatus,
          icon: <Clock className="h-4 w-4" />,
        },
        {
          label: t("statusRejected"),
          status: "rejected" as StepStatus,
          icon: <XCircle className="h-4 w-4" />,
        },
      ];
    }

    if (status === "cancelled") {
      return [
        {
          label: t("statusStepRequestSubmitted"),
          status: "completed" as StepStatus,
          icon: <Clock className="h-4 w-4" />,
        },
        {
          label: t("statusCancelled"),
          status: "rejected" as StepStatus,
          icon: <XCircle className="h-4 w-4" />,
        },
      ];
    }

    return steps.map((step, index) => {
      // Step 0: Request Submitted is always completed
      if (index === 0) return { ...step, status: "completed" as StepStatus };

      // Step 1: Payment Confirmed
      if (index === 1) {
        if (["requested", "quoted"].includes(status)) {
          return { ...step, status: "current" as StepStatus };
        }
        if (
          [
            "paid",
            "some_purchased",
            "all_purchased",
            "in_transit",
            "all_received",
          ].includes(status)
        ) {
          return { ...step, status: "completed" as StepStatus };
        }
      }

      // Step 2: Items being purchased
      if (index === 2) {
        if (status === "paid") {
          return { ...step, status: "current" as StepStatus }; // 🟢 highlight when paid
        }
        if (
          [
            "some_purchased",
            "all_purchased",
            "in_transit",
            "all_received",
          ].includes(status)
        ) {
          return { ...step, status: "completed" as StepStatus }; // ✅ mark completed after purchase
        }
      }

      // Step 3: Item(s) on the way to warehouse
      if (index === 3) {
        if (["some_purchased", "in_transit"].includes(status)) {
          // Highlight this step for both partial purchases and transit
          return { ...step, status: "current" as StepStatus };
        }
        if (["all_received"].includes(status)) {
          // Once all items are received, mark it as completed
          return { ...step, status: "completed" as StepStatus };
        }
      }

      // Step 4: All at warehouse
      if (index === 4 && ["all_received"].includes(status)) {
        return { ...step, status: "completed" as StepStatus };
      }

      return { ...step, status: "upcoming" as StepStatus };
    });
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      requested: "bg-capybara-yellow text-red-500",
      quoted: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      some_purchased: "bg-purple-100 text-purple-800",
      all_purchased: "bg-green-100 text-green-800",
      in_transit: "bg-blue-100 text-blue-800",
      all_received: "bg-indigo-100 text-indigo-800",
      purchased: "bg-purple-100 text-purple-800",
      rejected: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };
  const getStatusTooltip = (status: string): string => {
    const tooltips: Record<string, string> = {
      requested: t("requested"),
      quoted: t("quoted"),
      paid: t("paid"),
      purchased: t("purchased"),
      all_received: t("all_received"),
      partial_received: t("partial_received"),
      rejected: t("rejected"),
      cancelled: t("cancelled"),
    };

    return tooltips[status] || "Status information unavailable.";
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactElement> = {
      requested: <Clock className="h-4 w-4" />,
      quoted: <DollarSign className="h-4 w-4" />,
      paid: <CheckCircle className="h-4 w-4" />,
      some_purchased: <ShoppingCart className="h-4 w-4" />,
      all_purchased: <PackageCheck className="h-4 w-4" />,
      in_transit: <Truck className="h-4 w-4" />,
      all_received: <Home className="h-4 w-4" />,
      purchased: <PackageCheck className="h-4 w-4" />,
      received: <Home className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
    };
    return icons[status] || <Package className="h-4 w-4" />;
  };

  const getProductStatusBadge = (status: string) => {
    const statusDisplay = status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    let badgeClasses = "";
    let icon = null;

    switch (status) {
      case "requested":
        badgeClasses = "bg-gray-100 text-gray-800 border-gray-300";
        icon = <Clock className="h-3 w-3 mr-1" />;
        break;
      case "quoted":
        badgeClasses = "bg-yellow-100 text-yellow-800 border-yellow-300";
        icon = <DollarSign className="h-3 w-3 mr-1" />;
        break;
      case "paid":
        badgeClasses = "bg-blue-100 text-blue-800 border-blue-300";
        icon = <CheckCircle className="h-3 w-3 mr-1" />;
        break;
      case "purchased":
        badgeClasses = "bg-green-100 text-green-800 border-green-300";
        icon = <PackageCheck className="h-3 w-3 mr-1" />;
        break;
      case "received":
        badgeClasses = "bg-indigo-100 text-indigo-800 border-indigo-300";
        icon = <Home className="h-3 w-3 mr-1" />;
        break;
      case "shipping_quoted":
        badgeClasses = "bg-purple-100 text-purple-800 border-purple-300";
        icon = <DollarSign className="h-3 w-3 mr-1" />;
        break;
      case "shipping_paid":
        badgeClasses = "bg-teal-100 text-teal-800 border-teal-300";
        icon = <CheckCircle className="h-3 w-3 mr-1" />;
        break;
      case "shipped":
        badgeClasses = "bg-emerald-100 text-emerald-800 border-emerald-300";
        icon = <Truck className="h-3 w-3 mr-1" />;
        break;
      case "rejected":
        badgeClasses = "bg-red-100 text-red-800 border-red-300";
        icon = <XCircle className="h-3 w-3 mr-1" />;
        break;
      case "cancelled":
        badgeClasses = "bg-gray-100 text-gray-800 border-gray-300";
        icon = <XCircle className="h-3 w-3 mr-1" />;
        break;
      default:
        badgeClasses = "bg-gray-100 text-gray-800 border-gray-300";
        icon = <Clock className="h-3 w-3 mr-1" />;
    }

    return (
      <Badge
        variant="outline"
        className={`text-xs flex items-center gap-1 ${badgeClasses}`}
      >
        {icon}
        {statusDisplay}
      </Badge>
    );
  };

  const handlePayment = (quoteUrl: string) => {
    window.open(quoteUrl, "_blank");
  };

  const handleGoToStorage = () => {
    const dashboardPath = window.location.pathname.includes("admin")
      ? "/admin-dashboard"
      : "/user-dashboard";
    navigate(`${dashboardPath}?tab=storage`);
  };

  const handleEditOrder = (orderId: string) => {
    navigate(`/edit-order/${orderId}`);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
      toast.success(t("ordersUpdatedSuccess"));
    } catch (error) {
      toast.error(t("ordersUpdateError"));
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setIsCancelling(true);
    try {
      const { error } = await supabase.rpc("cancel_order", {
        p_order_id: orderId,
      });
      if (error) throw error;

      toast.success(t("orderCancelledSuccess"));
      await fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(t("orderCancelError"));
    } finally {
      setIsCancelling(false);
      setCancelOrderId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t("loadingOrders")}</div>;
  }

  // Filter orders by status and rejected
  let filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => getOrderStatus(order) === statusFilter);

  // Hide rejected orders if checkbox is checked
  if (hideRejected) {
    filteredOrders = filteredOrders.filter((order) => !order.is_rejected);
  }

  // Filter out cancelled orders unless showCancelled is true
  if (!showCancelled) {
    filteredOrders = filteredOrders.filter((order) => !order.is_cancelled);
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t("noActiveOrders")}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("noActiveOrdersDescription")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t("currentOrders")}</h2>
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="mb-4 gap-2"
        >
          <Filter className="h-4 w-4" />
          {t("filterOrders")}
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
                <div
                  className="
        flex flex-wrap items-center justify-between gap-3
        md:justify-start
      "
                >
                  {/* --- Status + Show per page side by side --- */}
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
                        <SelectTrigger className="w-[190px]">
                          <SelectValue placeholder={t("allStatuses")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {t("allStatuses")}
                          </SelectItem>
                          <SelectItem value="requested">
                            {t("statusRequested")}
                          </SelectItem>
                          <SelectItem value="quoted">
                            {t("statusAwaitingPayment")}
                          </SelectItem>
                          <SelectItem value="paid">
                            {t("statusPaid")}
                          </SelectItem>
                          <SelectItem value="some_purchased">
                            {t("statusSomePurchased")}
                          </SelectItem>
                          <SelectItem value="all_purchased">
                            {t("statusAllPurchased")}
                          </SelectItem>
                          <SelectItem value="in_transit">
                            {t("statusInTransit")}
                          </SelectItem>
                          <SelectItem value="all_received">
                            {t("statusAllAtWarehouse")}
                          </SelectItem>
                          <SelectItem value="rejected">
                            {t("statusRejected")}
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
                        <SelectTrigger className="w-[90px]">
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

                  {/* --- Right side controls --- */}
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
                        {t("hideRejected")}
                      </label>
                    </div>

                    {/* Show Cancelled */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="show-cancelled"
                        checked={showCancelled}
                        onCheckedChange={(checked) =>
                          setShowCancelled(checked === true)
                        }
                      />
                      <label
                        htmlFor="show-cancelled"
                        className="text-sm font-medium cursor-pointer whitespace-nowrap"
                      >
                        {t("showCancelled")}
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
                {filteredOrders.length > 0 && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    {t("showingOrders")} {startIndex + 1}-
                    {Math.min(endIndex, filteredOrders.length)} {t("ofOrders")}{" "}
                    {filteredOrders.length} {t("ordersText")}
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {filteredOrders.length > 0 && totalPages > 1 && (
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t("previous")}
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
                    ),
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
                  {t("next")}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {paginatedOrders.map((order) => {
          const status = getOrderStatus(order);
          const statusSteps = getStatusSteps(status, order);
          const productQuote = order.quotes?.find((q) => q.type === "product");
          const isOpen = openOrders.has(order.id);

          const statusTextMap: Record<string, string> = {
            requested: t("statusRequested"),
            quoted: t("statusAwaitingPayment"),
            paid: t("statusPaid"),
            some_purchased: t("statusSomePurchased"),
            all_purchased: t("statusAllPurchased"),
            in_transit: t("statusInTransit"),
            all_received: t("statusAllAtWarehouse"),
            rejected: t("statusRejected"),
            cancelled: t("statusCancelled"),
          };

          // fallback if the status isn't mapped
          const statusText =
            statusTextMap[status] ||
            (status
              ? status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())
              : "");

          return (
            <Collapsible key={order.id} open={isOpen}>
              <Card id={`order-${order.id}`}>
                <CardHeader
                  onClick={() => toggleOrder(order.id)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors border-2 border-r-yellow-400"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CardTitle className="text-lg">
                        {t("orderNumber")}
                        {order.order_personal_id || order.id.slice(0, 8)}
                      </CardTitle>

                      <Tooltip>
                        <span className="cursor-default">
                          <TooltipTrigger asChild>
                            <span>
                              <span
                                className={`${getStatusColor(status)} px-2 py-1 text-xs rounded-md inline-flex items-center gap-1`}
                              >
                                {getStatusIcon(status)}
                                <span className="ml-1">{statusText}</span>
                              </span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            alignOffset={40}
                            className="right-80 z-60 text-grey-700 border border-capybara-orange shadow-lg"
                          >
                            <p>{getStatusTooltip(status)}</p>
                          </TooltipContent>
                        </span>
                      </Tooltip>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOrder(order.id)}
                      >
                        {isOpen ? <ChevronUp /> : <ChevronDown />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("createdOn")}{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>

                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                  <CardContent className="space-y-4">
                    <StatusFlow steps={statusSteps} />

                    {/* Delivery time message */}
                    {["some_purchased", "all_purchased", "in_transit"].includes(
                      status,
                    ) && (
                      <div className="mt-3 mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          ℹ️ {t("normalDeliveryInfo")}
                        </p>
                      </div>
                    )}
                    {["paid"].includes(status) && (
                      <div className="mt-3 mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          ✅ {t("paymentReceivedInfo")}
                        </p>
                      </div>
                    )}
                    {order.is_rejected && !order.is_cancelled && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-red-900">
                              {t("orderRejected")}
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                              {order.rejection_details?.rejection_reason ||
                                order.rejection_reason}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
                              onClick={() => handleEditOrder(order.id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {t("editOrder")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {status === "requested" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-yellow-800">
                          {t("productsInOrderWarning")}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">
                        {t("productsInOrder")}:
                      </h4>
                      {order.rejection_details
                        ? // Rejected orders: render from rejection_details snapshot
                          order.rejection_details.product_issues?.map(
                            (issue: any, index: number) => (
                              <div
                                key={issue.product_id}
                                className="flex items-start justify-between p-3 bg-secondary rounded-lg"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">
                                      {index + 1}){" "}
                                      {issue.item_name || "Unnamed Product"}
                                    </p>
                                  </div>
                                  <a
                                    href={issue.product_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline truncate block max-w-md"
                                  >
                                    {issue.product_url}
                                  </a>
                                  <div className="flex items-center gap-4 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                      Qty: {issue.quantity || 1}
                                    </span>
                                  </div>
                                  {issue.has_issue &&
                                    issue.issue_description && (
                                      <div className="flex items-center gap-1 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                                        <AlertCircle className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                                        <span className="text-xs text-yellow-700">
                                          {t("issuePrefix")}{" "}
                                          {issue.issue_description}
                                        </span>
                                      </div>
                                    )}
                                </div>
                              </div>
                            ),
                          )
                        : // Active orders: render from order_items
                          // Active orders: render from order_items
                          order.order_items?.map((item, index: number) => (
                            <div
                              key={item.product_request.id}
                              className="flex flex-wrap items-start justify-between p-3 bg-secondary rounded-lg overflow-hidden"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-medium text-sm truncate">
                                    {index + 1}){" "}
                                    {item.product_request.item_name ||
                                      "Unnamed Product"}
                                  </p>
                                  {item.product_request.status ===
                                    "received" && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-indigo-100 text-indigo-800 border-indigo-200"
                                    >
                                      <Home className="h-3 w-3 mr-1" />
                                      In Storage
                                    </Badge>
                                  )}
                                </div>

                                <div className="max-w-[280px] truncate">
                                  <a
                                    href={item.product_request.product_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs"
                                    title={item.product_request.product_url}
                                  >
                                    <Link className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">
                                      {item.product_request.product_url}
                                    </span>
                                  </a>
                                </div>

                                <div className="flex items-center gap-4 mt-1 flex-wrap text-xs text-muted-foreground">
                                  <span>
                                    Qty: {item.product_request.quantity || 1}
                                  </span>
                                  {item.product_request.notes && (
                                    <span>
                                      Note: {item.product_request.notes}
                                    </span>
                                  )}
                                </div>

                                {item.product_request.has_purchase_issue &&
                                  item.product_request
                                    .purchase_issue_description && (
                                    <div className="flex items-center gap-1 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                                      <AlertCircle className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                                      <span className="text-xs text-yellow-700">
                                        Issue:{" "}
                                        {
                                          item.product_request
                                            .purchase_issue_description
                                        }
                                      </span>
                                    </div>
                                  )}
                              </div>

                              {!order.is_rejected && (
                                <div className="flex-shrink-0 ml-3 self-start">
                                  {getProductStatusBadge(
                                    order.is_cancelled
                                      ? "cancelled"
                                      : item.product_request.status,
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                    </div>

                    {!order.is_cancelled &&
                      (status === "all_received" ||
                        (status === "in_transit" &&
                          order.order_items?.some(
                            (item) =>
                              item.product_request.status === "received",
                          ))) && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Home className="h-5 w-5 text-indigo-600" />
                              <div>
                                <p className="font-medium text-indigo-900">
                                  {status === "all_received"
                                    ? "All items at warehouse"
                                    : "Items on the way to warehouse"}
                                </p>
                                <p className="text-sm text-indigo-700">
                                  {status === "all_received"
                                    ? "View and manage your items in storage"
                                    : order.order_items?.some(
                                          (item) =>
                                            item.product_request.status ===
                                            "received",
                                        )
                                      ? "Some items may already be available in storage"
                                      : "Items will be available in storage once received"}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleGoToStorage}
                              className="border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                            >
                              {t("goToStorage")}
                            </Button>
                          </div>
                        </div>
                      )}

                    {productQuote &&
                      productQuote.status !== "paid" &&
                      !order.is_cancelled && (
                        <div className="bg-primary/5 rounded-lg p-4">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-medium mb-2">
                                {t("quoteIssued")}
                              </p>

                              <div className="flex items-start text-xs text-muted-foreground text-left pt-1">
                                <AlertTriangle className="h-3 w-3 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-muted-foreground">
                                  {t("paymentConfirmationNotice1")}
                                  <br />
                                  {t("paymentConfirmationNotice2")}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                              <Button
                                onClick={() =>
                                  handlePayment(productQuote.quote_url)
                                }
                                className="w-full bg-primary hover:bg-primary/90 sm:w-auto"
                              >
                                <span className="truncate font-bold">
                                  {t("payNow")}
                                </span>
                              </Button>

                              <section className="flex w-full gap-2 sm:w-auto sm:gap-4">
                                <Button
                                  variant="outline"
                                  onClick={() => handleEditOrder(order.id)}
                                  className="flex-1 min-w-0 px-2 text-xs sm:text-sm sm:w-auto sm:flex-none"
                                >
                                  <Edit className="h-4 w-4 mr-1 flex-shrink-0 sm:mr-2" />
                                  <span className="truncate">
                                    {t("editOrder")}
                                  </span>
                                </Button>

                                <Button
                                  variant="outline"
                                  onClick={() => setCancelOrderId(order.id)}
                                  className="flex-1 min-w-0 px-2 text-xs text-destructive border-destructive hover:bg-destructive/10 sm:text-sm sm:w-auto sm:flex-none"
                                >
                                  <span className="truncate">
                                    {t("cancelOrder")}
                                  </span>
                                </Button>
                              </section>
                            </div>
                          </div>
                        </div>
                      )}

                    {order.quotes && order.quotes.length > 0 && (
                      <div className="mt-4 p-4 border border-green-500 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-800 rounded-xl">
                        <p className="text-sm font-bold text-green-900 dark:text-blue-100 mb-2">
                          {t("quoteInformation") || "Quote Information"}
                        </p>

                        <div className="space-y-2">
                          {order.quotes.map((quote) => {
                            const formattedStatus =
                              quote.status.charAt(0).toUpperCase() +
                              quote.status.slice(1);

                            let shortUrl = quote.quote_url;
                            try {
                              const parsed = new URL(quote.quote_url);
                              const domain = parsed.hostname.replace(
                                /^www\./,
                                "",
                              );
                              const path =
                                parsed.pathname + parsed.search + parsed.hash;
                              shortUrl = `${domain}${path.length > 20 ? path.slice(0, 20) + "..." : path}`;
                            } catch {
                              shortUrl =
                                quote.quote_url.length > 25
                                  ? quote.quote_url.slice(0, 25) + "..."
                                  : quote.quote_url;
                            }

                            const quoteTypeText =
                              quote.type === "product"
                                ? t("productQuote") || "Product Quote"
                                : quote.type === "shipping"
                                  ? t("shippingQuote") || "Shipping Quote"
                                  : quote.type;

                            return (
                              <div
                                key={quote.id}
                                className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-blue-100 dark:border-blue-900"
                              >
                                <div className="flex flex-col gap-2 text-sm">
                                  <p className="text-green-800 font-semibold">
                                    {quoteTypeText}
                                  </p>
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-1">
                                    <p className="text-green-600">
                                      {t("infoPaidOrder")} - {t("status")}:{" "}
                                    </p>
                                    <p className="text-green-600 dark:text-blue-100 font-medium flex-shrink-0">
                                      {formattedStatus}
                                    </p>
                                  </div>

                                  <a
                                    href={quote.quote_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline break-all sm:break-normal min-w-0"
                                    title={quote.quote_url}
                                  >
                                    <Link className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span className="truncate sm:inline">
                                      {shortUrl}
                                    </span>
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}

        {/* Cancel Order Confirmation Dialog */}
        <AlertDialog
          open={!!cancelOrderId}
          onOpenChange={(open) => !open && setCancelOrderId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("confirmCancelOrder")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("cancelOrderWarning")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isCancelling}>
                {t("keepOrder")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  cancelOrderId && handleCancelOrder(cancelOrderId)
                }
                disabled={isCancelling}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isCancelling ? t("cancelling") : t("confirmCancel")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};
