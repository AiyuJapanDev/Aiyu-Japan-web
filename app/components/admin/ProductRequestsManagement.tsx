import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Link,
  DollarSign,
  X,
  Search,
  Ship,
  CreditCard,
  Check,
  Flag,
  ShoppingCart,
  Home,
  RefreshCw,
  PackageCheck,
  Copy,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ProductRequest, Order, Quote } from "@/types/orders";
import type { Database } from "@/integrations/supabase/types";
import { StatusFlow } from "@/components/ui/status-flow";
import { createNotification } from "@/lib/notificationUtils";

type ProductRequestStatus = Database["public"]["Enums"]["product_request_status"];

interface ProductRequestWithIssue extends ProductRequest {
  has_purchase_issue?: boolean;
  purchase_issue_description?: string | null;
}

interface OrderWithDetails extends Order {
  is_rejected?: boolean;
  rejection_reason?: string | null;
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
  } | null;
  profiles?: {
    full_name: string | null;
    email: string | null;
    user_personal_id?: string | null;
  } | null;
  quotes?: Quote[];
  items: ProductRequestWithIssue[];
}

interface ProductRequestsManagementProps {
  orderId?: string | null;
}

export function ProductRequestsManagement({ orderId }: ProductRequestsManagementProps) {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openOrders, setOpenOrders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [hideRejected, setHideRejected] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Order-level actions
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [quotePrice, setQuotePrice] = useState("");
  const [quoteInvoiceUrl, setQuoteInvoiceUrl] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [productIssues, setProductIssues] = useState<Map<string, { hasIssue: boolean; description: string }>>(
    new Map(),
  );
  const [showShippingDialog, setShowShippingDialog] = useState(false);
  const [shippingPrice, setShippingPrice] = useState("");
  const [shippingInvoiceUrl, setShippingInvoiceUrl] = useState("");
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [hideRejected, itemsPerPage]);

  // Auto-open and scroll to order when orderId is provided
  useEffect(() => {
    if (orderId && orders.length > 0) {
      setOpenOrders(prev => new Set(prev).add(orderId));
      setTimeout(() => {
        const element = document.getElementById(`order-${orderId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [orderId, orders.length]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, itemsPerPage, hideRejected, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Build query for orders
      let ordersQuery = supabase.from("orders").select(
        `
          *,
          order_items (
            product_request_id
          ),
          quotes (*)
        `,
      );

      // Apply hide rejected filter
      if (hideRejected) {
        ordersQuery = ordersQuery.eq("is_rejected", false);
      }

      // Fetch all orders (filtering and pagination will be done client-side)
      const { data: ordersData, error: ordersError } = await ordersQuery
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Get all product request IDs
      const allProductRequestIds = new Set<string>();
      (ordersData || []).forEach((order) => {
        order.order_items.forEach((item: any) => {
          allProductRequestIds.add(item.product_request_id);
        });
      });

      // Fetch all product requests
      const { data: allRequests, error: requestsError } = await supabase
        .from("product_requests")
        .select("*")
        .in("id", Array.from(allProductRequestIds));

      if (requestsError) throw requestsError;

      // Create a map for quick lookup
      const requestsMap = new Map<string, ProductRequestWithIssue>();
      (allRequests || []).forEach((request) => {
        requestsMap.set(request.id, request);
      });

      // Fetch user profiles and combine data
      // Get all unique user IDs
      const userIds = [...new Set((ordersData || []).map(o => o.user_id))];

      // Fetch all profiles in one query
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email, user_personal_id")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Build a quick lookup map
      const profileMap = new Map((profiles || []).map(p => [p.id, p]));

      // Combine order data with product requests and profiles
      const ordersWithDetails = (ordersData || []).map(order => {
        let items: ProductRequestWithIssue[];

        if (order.is_rejected && order.rejection_details && typeof order.rejection_details === "object") {
          const rejectionDetails = order.rejection_details as any;
          if (rejectionDetails.product_issues && Array.isArray(rejectionDetails.product_issues)) {
            items = rejectionDetails.product_issues.map((issue: any) => ({
              id: issue.product_id,
              user_id: order.user_id,
              product_url: issue.product_url,
              item_name: issue.item_name,
              quantity: issue.quantity || 1,
              status: "rejected" as ProductRequestStatus,
              has_purchase_issue: issue.has_issue,
              purchase_issue_description: issue.issue_description,
              created_at: order.created_at,
              updated_at: order.updated_at,
            })) as ProductRequestWithIssue[];
          } else {
            items = [];
          }
        } else {
          // For active orders, use fetched product_requests
          items = order.order_items
            .map((item: any) => requestsMap.get(item.product_request_id))
            .filter(Boolean) as ProductRequestWithIssue[];
        }

        return {
          ...order,
          profiles: profileMap.get(order.user_id) || null,
          items,
        };
      });

      setOrders(ordersWithDetails.map(order => ({
        ...order,
        rejection_details: order.rejection_details as any,
      })));


      setOrders(ordersWithDetails.map((order) => ({
        ...order,
        rejection_details: order.rejection_details as any,
      })));
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
      sonnerToast.success("Orders updated successfully");
    } catch (error) {
      sonnerToast.error("Failed to refresh orders");
    } finally {
      setRefreshing(false);
    }
  };

  const toggleOrder = (orderId: string) => {
    setOpenOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const createOrderQuote = async () => {
    if (!selectedOrder || !quoteInvoiceUrl) return;

    try {
      const { error: quoteError } = await supabase.from("quotes").insert({
        type: "product",
        order_id: selectedOrder.id,
        price_jpy: null, // no price included
        status: "sent",
        quote_url: quoteInvoiceUrl,
      });

      if (quoteError) throw quoteError;

      const productIds = selectedOrder.items.map((item) => item.id);
      const { error: updateError } = await supabase
        .from("product_requests")
        .update({ status: "quoted" as ProductRequestStatus })
        .in("id", productIds);

      if (updateError) throw updateError;

      await createNotification(
        selectedOrder.user_id,
        "quote_received",
        `Your product quote for Order #${selectedOrder.order_personal_id} is ready. Please review and complete payment.`,
        selectedOrder.order_personal_id,
        null,
        selectedOrder.id
      );

      toast({
        title: "Quote Created",
        description: "Order quote has been sent to the customer",
      });

      setSelectedOrder(null);
      setQuoteInvoiceUrl("");
      setProductIssues(new Map());
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create quote",
        variant: "destructive",
      });
    }
  };


  const rejectOrder = async () => {
    if (!selectedOrder || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create rejection details snapshot with product issues
      const productIssuesArray = selectedOrder.items.map((item) => ({
        product_id: item.id,
        product_url: item.product_url,
        item_name: item.item_name,
        quantity: item.quantity,
        has_issue: productIssues.get(item.id)?.hasIssue || false,
        issue_description: productIssues.get(item.id)?.description || null,
      }));

      const rejectionDetails = {
        rejection_reason: rejectionReason.trim(),
        rejected_at: new Date().toISOString(),
        product_issues: productIssuesArray,
      };

      // Update order as rejected with snapshot
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          is_rejected: true,
          rejection_reason: rejectionReason.trim(),
          rejection_details: rejectionDetails,
        })
        .eq("id", selectedOrder.id);

      if (orderError) throw orderError;

      // Update all product requests to rejected
      const productIds = selectedOrder.items.map((item) => item.id);
      const { error: productsError } = await supabase
        .from("product_requests")
        .update({
          status: "rejected" as ProductRequestStatus,
          rejection_reason: rejectionReason.trim(),
        })
        .in("id", productIds);

      if (productsError) throw productsError;

      // Save product issues if any
      for (const [productId, issue] of productIssues.entries()) {
        if (issue.hasIssue) {
          await supabase
            .from("product_requests")
            .update({
              has_purchase_issue: true,
              purchase_issue_description: issue.description,
            })
            .eq("id", productId);
        }
      }

      // Send notification to user
      await createNotification(
        selectedOrder.user_id,
        "order_rejected",
        `Your Order #${selectedOrder.order_personal_id} has been rejected. Reason: ${rejectionReason.substring(0, 100)}${rejectionReason.length > 100 ? "..." : ""}`,
        selectedOrder.order_personal_id,
        null,
        selectedOrder.id
      );

      toast({
        title: "Order Rejected",
        description: "Order has been rejected and customer will be notified",
      });

      setSelectedOrder(null);
      setRejectionReason("");
      setProductIssues(new Map());
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject order",
        variant: "destructive",
      });
    }
  };

  const updateProductIssue = (productId: string, hasIssue: boolean, description: string) => {
    setProductIssues((prev) => {
      const newMap = new Map(prev);
      newMap.set(productId, { hasIssue, description });
      return newMap;
    });
  };

  const confirmProductPayment = async (order: OrderWithDetails) => {
    try {
      // Find the sent quote
      const sentQuote = order.quotes?.find((q) => q.status === "sent" && q.type === "product");
      if (!sentQuote) {
        toast({
          title: "Error",
          description: "No pending quote found for this order",
          variant: "destructive",
        });
        return;
      }

      // Update quote status to paid
      const { error: quoteError } = await supabase
        .from("quotes")
        .update({ status: "paid" as Database["public"]["Enums"]["quote_status"] })
        .eq("id", sentQuote.id);

      if (quoteError) throw quoteError;

      // Update all product requests to 'paid' status
      const productIds = order.items.map((item) => item.id);
      const { error: productsError } = await supabase
        .from("product_requests")
        .update({ status: "paid" as ProductRequestStatus })
        .in("id", productIds);

      if (productsError) throw productsError;

      // Send notification to user
      await createNotification(
        order.user_id,
        "payment_confirmed",
        `Your payment for Order #${order.order_personal_id} has been confirmed! We will now purchase your items.`,
        order.order_personal_id,
        null,
        order.id
      );

      toast({
        title: "Payment Confirmed",
        description: "Payment has been confirmed and products status updated",
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to confirm payment",
        variant: "destructive",
      });
    }
  };
  const markProductsAsReceived = async (order: OrderWithDetails, weights: Map<string, number>) => {
    try {
      const purchasedItems = order.items.filter((item) => item.status === "purchased");
      if (purchasedItems.length === 0) {
        toast({
          title: "No Items Found",
          description: "There are no purchased items to mark as received.",
        });
        return;
      }

      // Update each purchased product
      for (const item of purchasedItems) {
        const weight = weights.get(item.id);
        await supabase
          .from("product_requests")
          .update({
            status: "received" as ProductRequestStatus,
            updated_at: new Date().toISOString(),
            ...(weight !== undefined ? { weight } : {}),
          })
          .eq("id", item.id);
      }

      // After updating all purchased items, check if ALL items in the order are now received
      const { data: allOrderItems } = await supabase
        .from("order_items")
        .select(`
          product_request_id,
          product_requests!inner(status)
        `)
        .eq("order_id", order.id);

      // Check if every item in the order is now 'received'
      const allReceived = allOrderItems?.every((item: any) => 
        item.product_requests.status === "received"
      );

      if (allReceived && allOrderItems && allOrderItems.length > 0) {
        await createNotification(
          order.user_id,
          "items_at_warehouse",
          `All your items for Order #${order.order_personal_id} have arrived at our warehouse!`,
          order.order_personal_id,
          null,
          order.id
        );
      }

      toast({
        title: "Products Marked",
        description: `${purchasedItems.length} product(s) marked as received.`,
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark products as received.",
        variant: "destructive",
      });
    }
  };

  const markProductsAsPurchased = async (order: OrderWithDetails) => {
    try {
      const paidProducts = order.items.filter((item) => item.status === "paid");
      if (paidProducts.length === 0) {
        toast({
          title: "No Products to Mark",
          description: "No paid products found to mark as purchased",
        });
        return;
      }

      // Collect invoice IDs from visible inputs
      const updates = paidProducts.map((item) => {
        const invoiceInput = document.getElementById(`invoice-${item.id}`) as HTMLInputElement;
        const invoiceId = invoiceInput?.value?.trim() || null;
        return { id: item.id, invoice_id: invoiceId };
      });

      // Bulk update
      for (const { id, invoice_id } of updates) {
        await supabase
          .from("product_requests")
          .update({
            status: "purchased" as ProductRequestStatus,
            invoice_id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);
      }

      toast({
        title: "Products Marked",
        description: `${updates.length} product(s) marked as purchased with invoice IDs`,
      });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark products as purchased",
        variant: "destructive",
      });
    }
  };


  const markIndividualProductAsPurchased = async (productId: string) => {
    try {
      // get invoice input
      const invoiceInput = document.getElementById(`invoice-${productId}`) as HTMLInputElement;
      const invoiceId = invoiceInput?.value?.trim() || null;

      const { error } = await supabase
        .from("product_requests")
        .update({
          status: "purchased" as ProductRequestStatus,
          invoice_id: invoiceId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);


      if (error) throw error;

      toast({
        title: "Product Marked",
        description: "Product marked as purchased",
      });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark product as purchased",
        variant: "destructive",
      });
    }
  };

  const updateProductInvoiceId = async (productId: string, invoiceId: string) => {
    try {
      const { error } = await supabase
        .from("product_requests")
        .update({
          invoice_id: invoiceId.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Invoice ID Updated",
        description: "Product invoice ID has been updated",
      });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update invoice ID",
        variant: "destructive",
      });
    }
  };

  const markIndividualProductAsReceived = async (productRequestId: string, weight?: number) => {
    try {
      const updateData: any = {
        status: "received" as ProductRequestStatus,
        updated_at: new Date().toISOString(),
      };

      if (weight !== undefined) {
        updateData.weight = weight;
      }

      const { error } = await supabase.from("product_requests").update(updateData).eq("id", productRequestId);

      if (error) throw error;

      // Check if all items in this order are now 'received'
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_request_id, order_id")
        .eq("product_request_id", productRequestId)
        .single();

      if (orderItems) {
        // Get all items for this order
        const { data: allOrderItems } = await supabase
          .from("order_items")
          .select(
            `
            product_request_id,
            product_requests!inner(status)
          `,
          )
          .eq("order_id", orderItems.order_id);

        // Check if all items are 'received'
        const allReceived = allOrderItems?.every((item: any) => item.product_requests.status === "received");

        if (allReceived && allOrderItems && allOrderItems.length > 0) {
          // Get order user_id
          const { data: order } = await supabase
            .from("orders")
            .select("user_id, order_personal_id")
            .eq("id", orderItems.order_id)
            .single();

          if (order) {
            await createNotification(
              order.user_id,
              "items_at_warehouse",
              `All your items for Order #${order.order_personal_id} have arrived at our warehouse!`,
              order.order_personal_id,
              null,
              orderItems.order_id,
            );
          }
        }
      }

      toast({
        title: "Product Marked",
        description: "Product marked as received",
      });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark product as received",
        variant: "destructive",
      });
    }
  };




  const createShippingQuote = async (order: OrderWithDetails) => {
    if (!shippingPrice || !shippingInvoiceUrl) return;

    try {
      // Create shipping quote
      const { error: quoteError } = await supabase.from("quotes").insert({
        type: "shipping" as Database["public"]["Enums"]["quote_type"],
        order_id: order.id,
        price_jpy: parseFloat(shippingPrice),
        status: "sent" as Database["public"]["Enums"]["quote_status"],
        quote_url: shippingInvoiceUrl,
      });

      if (quoteError) throw quoteError;

      // Update product statuses to shipping_quoted
      const productIds = order.items.map((item) => item.id);

      const { error: productError } = await supabase
        .from("product_requests")
        .update({ status: "shipping_quoted" as ProductRequestStatus })
        .in("id", productIds);

      if (productError) throw productError;

      // Update order status
      const { error: orderError } = await supabase
        .from("orders")
        .update({ status: "awaiting_shipping_payment" as Database["public"]["Enums"]["order_status"] })
        .eq("id", order.id);

      if (orderError) throw orderError;

      toast({
        title: "Shipping Quote Created",
        description: "Shipping quote has been sent to the customer",
      });
      setShowShippingDialog(false);
      setShippingPrice("");
      setShippingInvoiceUrl("");
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create shipping quote",
        variant: "destructive",
      });
    }
  };

  const confirmShippingPayment = async (order: OrderWithDetails) => {
    try {
      // Update shipping quote status to paid
      const shippingQuote = order.quotes?.find((q) => q.type === "shipping" && q.status === "sent");
      if (shippingQuote) {
        const { error: quoteError } = await supabase
          .from("quotes")
          .update({ status: "paid" as Database["public"]["Enums"]["quote_status"] })
          .eq("id", shippingQuote.id);

        if (quoteError) throw quoteError;
      }

      // Update all product requests to shipping_paid status
      const productIds = order.items.map((item) => item.id);

      const { error: productError } = await supabase
        .from("product_requests")
        .update({ status: "shipping_paid" as ProductRequestStatus })
        .in("id", productIds);

      if (productError) throw productError;

      toast({
        title: "Shipping Payment Confirmed",
        description: "Shipping payment has been confirmed",
      });
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to confirm shipping payment",
        variant: "destructive",
      });
    }
  };

  const shipOrder = async (order: OrderWithDetails) => {
    if (!trackingNumber) return;

    try {
      // Update order status and tracking
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: "shipped" as Database["public"]["Enums"]["order_status"],
          tracking_number: trackingNumber,
          shipped_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (orderError) throw orderError;

      // Update all product requests to shipped status
      const productIds = order.items.map((item) => item.id);

      const { error: productError } = await supabase
        .from("product_requests")
        .update({ status: "shipped" as ProductRequestStatus })
        .in("id", productIds);

      if (productError) throw productError;

      toast({
        title: "Order Shipped",
        description: "Order has been marked as shipped",
      });
      setShowTrackingDialog(false);
      setTrackingNumber("");
      fetchOrders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to ship order",
        variant: "destructive",
      });
    }
  };

  const getOrderStatus = (order: OrderWithDetails) => {
    if (order.is_rejected) return "Rejected";
    if (order.status === "shipped") return "Shipped";

    // Check product statuses for more accurate status
    const productStatuses = order.items.map((item) => item.status);
    const allSameStatus = productStatuses.every((status) => status === productStatuses[0]);

    if (allSameStatus && productStatuses[0]) {
      switch (productStatuses[0]) {
        case "shipping_paid":
          return "Ready to Ship";
        case "shipping_quoted":
          return "Awaiting Shipping Payment";
        case "received":
          return "Stored";
        case "purchased":
          return "Purchased";
        case "paid":
          return "Paid";
        case "quoted":
          return "Quoted";
        case "requested":
          return "New";
      }
    }

    // Handle mixed statuses
    const hasPurchased = productStatuses.includes("purchased");
    const hasPaid = productStatuses.includes("paid");
    const hasReceived = productStatuses.includes("received");

    if (hasPurchased && hasPaid) {
      return "Partially Purchased";
    }
    if (hasReceived && (hasPurchased || hasPaid)) {
      return "Partial Processing";
    }

    // Fallback to order status
    if (order.status === "awaiting_shipping_payment") return "Awaiting Shipping Payment";
    if (order.status === "weighing") return "Weighing";
    if (order.status === "preparing") return "Preparing";
    return "New";
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "New":
        // Slightly bluish-gray to show "just created"
        return "bg-capybara-yellow text-red-500 border-slate-400/20";

      case "Quoted":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";

      case "Paid":
        // Keep strong green tone for payment success
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";

      case "Partially Purchased":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";

      case "Purchased":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";

      case "Partial Processing":
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";

      case "Preparing":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";

      case "Stored":
        // Shifted to blue-cyan — visually distinct from green Paid
        return "bg-sky-500/10 text-sky-600 border-sky-500/20";

      case "Awaiting Shipping":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";

      case "Shipped":
        return "bg-cyan-500/10 text-cyan-600 border-cyan-500/20";

      case "Rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20";

      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };



  const getStatusSteps = (order: OrderWithDetails) => {
    type StepStatus = "completed" | "current" | "rejected" | "upcoming";

    const status = getOrderStatus(order);

    // Check purchase and transit progress
    const allPurchased = order.items.every((item) =>
      ["purchased", "received", "shipping_quoted", "shipping_paid", "shipped"].includes(item.status),
    );
    const somePurchased = order.items.some((item) =>
      ["purchased", "received", "shipping_quoted", "shipping_paid", "shipped"].includes(item.status),
    );
    const hasReceived = order.items.some((item) => item.status === "received");
    const allReceived = order.items.every((item) => item.status === "received");

    // Determine dynamic labels for purchase and transit steps
    const purchaseLabel =
      allPurchased ||
        status === "Partial Processing" ||
        status === "Weighing" ||
        status === "Awaiting Shipping Payment" ||
        allReceived
        ? "Items Purchased"
        : "Item(s) being purchased";

    const steps = [
      { label: "Request Submitted", status: "upcoming" as StepStatus, icon: <Clock className="h-4 w-4" /> },
      { label: "Payment Confirmed", status: "upcoming" as StepStatus, icon: <CheckCircle className="h-4 w-4" /> },
      { label: purchaseLabel, status: "upcoming" as StepStatus, icon: <ShoppingCart className="h-4 w-4" /> },
      {
        label: "Item(s) on the way to warehouse",
        status: "upcoming" as StepStatus,
        icon: <Truck className="h-4 w-4" />,
      },
      { label: "All Items at Warehouse", status: "upcoming" as StepStatus, icon: <Home className="h-4 w-4" /> },
    ];

    const statusMap: Record<string, number> = {
      New: 0,
      Quoted: 0,
      Paid: 1,
      Purchased: 2,
      "Partially Purchased": 2,
      "Partial Processing": 3,
      Weighing: 4,
      "Awaiting Shipping Payment": 4,
      "Ready to Ship": 4,
      Shipped: 4,
    };

    const currentIndex = statusMap[status] ?? -1;
    if (status === "Rejected") {
      return steps.map((step, index) => ({
        ...step,
        status: (index === currentIndex ? "rejected" : "upcoming") as StepStatus,
      }));
    }

    return steps.map((step, index) => {
      // Request Submitted (index 0) is always completed for any order
      if (index === 0) return { ...step, status: "completed" as StepStatus };


      if (index === 1) {
        const normalizedStatus = status.toLowerCase();

        // For "new" and "quoted" → highlight "Payment Confirmed"
        if (["new", "quoted"].includes(normalizedStatus)) {
          return { ...step, status: "current" as StepStatus };
        }

        // For paid or later → mark as completed
        if (["paid", "purchased", "weighing", "shipped"].includes(normalizedStatus)) {
          return { ...step, status: "completed" as StepStatus };
        }
      }

      // Step 2: highlight "Items being purchased" for PAID only
      if (index === 2) {
        const normalizedStatus = status.toLowerCase();

        if (normalizedStatus === "paid") {
          return { ...step, status: "current" as StepStatus };
        }

        // Once purchased or later, mark as completed
        if (["purchased", "weighing", "shipped"].includes(normalizedStatus)) {
          return { ...step, status: "completed" as StepStatus };
        }
      }



      // Special case: mark all steps as completed when items are at warehouse
      if (status === "Stored" || status === "Awaiting Shipping Payment" || status === "Ready to Ship") {
        if (index <= 4) return { ...step, status: "completed" as StepStatus };
      }

      // Special case for Purchased status - mark purchase step complete, transit step current
      if (status === "Purchased" && allPurchased) {
        if (index < 2) return { ...step, status: "completed" as StepStatus };
        if (index === 2) return { ...step, status: "completed" as StepStatus }; // Items Purchased
        if (index === 3) return { ...step, status: "current" as StepStatus }; // On the way
        return { ...step, status: "upcoming" as StepStatus };
      }

      if (index < currentIndex) return { ...step, status: "completed" as StepStatus };
      if (index === currentIndex) return { ...step, status: "current" as StepStatus };

      // Special case: if we're at transit (step 3), mark purchase step (step 2) as completed
      if (status === "Partial Processing" && index === 2) return { ...step, status: "completed" as StepStatus };

      return { ...step, status: "upcoming" as StepStatus };
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading orders...</div>
        </CardContent>
      </Card>
    );
  }

  // Apply search filter
  let filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.profiles?.full_name?.toLowerCase().includes(searchLower) ||
      order.profiles?.email?.toLowerCase().includes(searchLower) ||
      order.profiles?.user_personal_id?.toLowerCase().includes(searchLower) ||
      order.order_personal_id?.toLowerCase().includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower)
    );
  });

  // Apply status filter
  if (statusFilter !== "all") {
    filteredOrders = filteredOrders.filter((order) => {
      const status = getOrderStatus(order);
      return status.toLowerCase() === statusFilter.toLowerCase();
    });
  }

  // Calculate pagination
  const totalFilteredPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
  // Utility to shorten URL but keep domain + ~40 chars after
  const formatShortUrl = (url: string): string => {
    try {
      const parsed = new URL(url);
      const domain = parsed.hostname.replace(/^www\./, "");
      const path = parsed.pathname + parsed.search + parsed.hash;

      // Show only first 40 characters after the domain
      const shortenedPath =
        path.length > 40 ? path.slice(0, 40) + "..." : path;

      return `${domain}${shortenedPath}`;
    } catch {
      // fallback for invalid URLs
      return url.length > 50 ? url.slice(0, 50) + "..." : url;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>Manage customer orders and product requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters and Controls */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by customer name, email, customer ID, or order ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-[350px]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="quoted">Quoted</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="purchased">Purchased</SelectItem>
                        <SelectItem value="partially purchased">Partially Purchased</SelectItem>
                        <SelectItem value="partial processing">Partial Processing</SelectItem>
                        <SelectItem value="weighing">Weighing</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-2">
                      <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                      {refreshing ? "Refreshing..." : "Update"}
                    </Button>
                    <Checkbox
                      id="hide-rejected-products"
                      checked={hideRejected}
                      onCheckedChange={(checked) => setHideRejected(checked === true)}
                    />
                    <label htmlFor="hide-rejected-products" className="text-sm font-medium cursor-pointer">
                      Hide rejected
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Show:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={(val) => setItemsPerPage(Number(val))}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">per page</span>
                </div>
              </div>

              {filteredOrders.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders List */}
          {filteredOrders.length === 0 && orders.length > 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders found with this filter</p>
              <p className="text-sm mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders found matching your criteria.</p>
          ) : (
            paginatedOrders.map((order) => {
              const isOpen = openOrders.has(order.id);
              const orderStatus = getOrderStatus(order);

              return (
                <Collapsible key={order.id} open={isOpen} onOpenChange={() => toggleOrder(order.id)}>
                  <Card id={`order-${order.id}`} className="border">

                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full p-0 h-auto hover:bg-transparent"
                        onClick={(e) => {
                          if ((window.getSelection()?.toString().length ?? 0) > 0) {
                            e.stopPropagation();
                          }
                        }}
                      >
                        <div className="w-full p-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            {/* LEFT SIDE — Order info */}
                            <div className="flex flex-col text-left flex-1 min-w-0 space-y-1">

                              {/* Customer Name */}
                              <div className="flex items-center gap-1 min-w-0">
                                <p className="font-medium text-base flex items-baseline gap-1 min-w-0">
                                  <span className="flex-shrink-0 select-text" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>Order from</span>
                                  <span 
                                    className="text-blue-500 font-semibold truncate select-text"
                                    title={order.profiles?.full_name || order.profiles?.email || "Unknown"}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {order.profiles?.full_name || order.profiles?.email || "Unknown"}
                                  </span>
                                </p>
                                {order.profiles?.full_name || order.profiles?.email ? (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(order.profiles?.full_name || order.profiles?.email || "");
                                      sonnerToast.success("Customer name copied to clipboard");
                                    }}
                                    title="Copy Customer Name"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                ) : null}
                              </div>

                              {/* Customer ID */}
                              <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-0">
                                <span className="flex items-baseline gap-1 min-w-0">
                                  <span className="flex-shrink-0 select-text" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>Customer ID:</span>
                                  <span 
                                    className="font-medium text-green-500 truncate select-text"
                                    title={order.profiles?.user_personal_id ? `#${order.profiles.user_personal_id}` : "N/A"}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {order.profiles?.user_personal_id ? `#${order.profiles.user_personal_id}` : "N/A"}
                                  </span>
                                </span>
                                {order.profiles?.user_personal_id && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(order.profiles?.user_personal_id || "");
                                      sonnerToast.success("Customer ID copied to clipboard");
                                    }}
                                    title="Copy Customer ID"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>

                              {/* Customer Order ID */}
                              <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-0">
                                <span className="flex items-baseline gap-1 min-w-0">
                                  <span className="flex-shrink-0 select-text" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>Customer Order ID:</span>
                                  <span 
                                    className="font-medium text-green-500 truncate select-text"
                                    title={order.order_personal_id ? `#${order.order_personal_id}` : "N/A"}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {order.order_personal_id ? `#${order.order_personal_id}` : "N/A"}
                                  </span>
                                </span>
                                {order.order_personal_id && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(order.order_personal_id || "");
                                      sonnerToast.success("Customer Order ID copied to clipboard");
                                    }}
                                    title="Copy Customer Order ID"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>

                              <div className="flex items-center gap-1 text-sm text-muted-foreground min-w-0">
                                <span 
                                  className="font-medium truncate select-text"
                                  title={`Order #${order.id.slice(0, 8).toUpperCase()}`}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Order #{order.id.slice(0, 8).toUpperCase()}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(order.id);
                                    sonnerToast.success("Order ID copied to clipboard");
                                  }}
                                  title="Copy Order ID"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>


                            {/* RIGHT SIDE — Status + Chevron */}
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1 text-right flex-shrink-0 min-w-fit">
                              <div className="flex items-center gap-2">
                                <Badge className={`${getOrderStatusColor(orderStatus)} text-xs`}>
                                  {orderStatus}
                                </Badge>
                                <ChevronDown
                                  className={`h-5 w-5 text-muted-foreground transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                                    }`}
                                />
                              </div>

                              <div className="flex flex-col sm:items-end text-xs text-muted-foreground">
                                <p className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(order.created_at).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <p>
                                  {order.items.length} product{order.items.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                      </Button>
                    </CollapsibleTrigger>




                    <CollapsibleContent>
                      <div className="px-4 pb-4 border-t pt-3">
                        {/* Status Flow */}
                        <div className="mb-4">
                          <StatusFlow steps={getStatusSteps(order)} />
                        </div>

                        {/* Rejection Details */}
                        {order.is_rejected && order.rejection_details && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="font-medium text-red-900 mb-1">Order Rejected</p>
                                <p className="text-sm text-red-800">{order.rejection_details.rejection_reason}</p>
                                <p className="text-xs text-red-600 mt-2">
                                  Rejected on {new Date(order.rejection_details.rejected_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Products */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Products in this order:</h4>
                          {order.items.map((item, index: number) => (
                            <div key={item.id} className="p-3 bg-secondary/30 rounded-lg">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{index + 1}) {item.item_name || "Unnamed Product"}</p>
                                    {item.has_purchase_issue && (
                                      <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                                        <Flag className="h-3 w-3 mr-1" />
                                        Issue Flagged
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>Qty: {item.quantity}</span>
                                    {/* Product Link + Preview */}
                                    <div className="space-y-2">
                                      <a
                                        href={item.product_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 hover:underline break-all"
                                        title={item.product_url} // shows full link on hover
                                      >
                                        <Link className="h-3 w-3 flex-shrink-0" />
                                        {formatShortUrl(item.product_url)}
                                      </a>


                                    </div>

                                  </div>

                                  {item.notes && <p className="text-sm text-muted-foreground">Notes: {item.notes}</p>}

                                  {/* Show rejection issue from snapshot */}
                                  {(() => {
                                    if (order.rejection_details) {
                                      const rejectionIssue = order.rejection_details.product_issues?.find(
                                        (pi: any) => pi.product_id === item.id,
                                      );

                                      return rejectionIssue?.has_issue && rejectionIssue?.issue_description ? (
                                        <div className="flex items-center gap-1 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                                          <AlertCircle className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                                          <span className="text-xs text-yellow-700">
                                            Issue: {rejectionIssue.issue_description}
                                          </span>
                                        </div>
                                      ) : null;
                                    } else {
                                      return item.purchase_issue_description ? (
                                        <div className="flex items-center gap-1 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                                          <AlertCircle className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                                          <span className="text-xs text-yellow-700">
                                            Issue: {item.purchase_issue_description}
                                          </span>
                                        </div>
                                      ) : null;
                                    }
                                  })()}

                                  {/* Individual purchase button for paid items */}
                                  {item.status === "paid" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => markIndividualProductAsPurchased(item.id)}
                                      className="mt-2"
                                    >
                                      <Package className="h-3 w-3 mr-1" />
                                      Mark as Purchased
                                    </Button>
                                  )}

                                  {/* Invoice ID field logic */}
                                  {["paid", "purchased", "received", "shipping_quoted", "shipping_paid", "shipped"].includes(item.status) && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <Input
                                        type="text"
                                        placeholder="Invoice ID"
                                        className="w-40 h-8"
                                        defaultValue={(item as any).invoice_id || ""}
                                        id={`invoice-${item.id}`}
                                      />

                                      {/* Only show Save button if status is purchased or later */}
                                      {["purchased", "received", "shipping_quoted", "shipping_paid", "shipped"].includes(item.status) && (
                                        <Button
                                          onClick={() => {
                                            const invoiceInput = document.getElementById(`invoice-${item.id}`) as HTMLInputElement;
                                            if (invoiceInput) {
                                              updateProductInvoiceId(item.id, invoiceInput.value);
                                            }
                                          }}
                                          size="sm"
                                          variant="outline"
                                        >
                                          Save Invoice ID
                                        </Button>
                                      )}
                                    </div>
                                  )}


                                  {/* Individual received button with weight input for purchased items */}
                                  {item.status === "purchased" && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <Input
                                        type="number"
                                        placeholder="Weight (g)"
                                        className="w-28 h-8"
                                        id={`weight-${item.id}`}
                                        min="0"
                                        step="1"
                                      />
                                      <Button
                                        onClick={() => {
                                          const weightInput = document.getElementById(
                                            `weight-${item.id}`,
                                          ) as HTMLInputElement;
                                          const weight = weightInput ? parseFloat(weightInput.value) : undefined;
                                          markIndividualProductAsReceived(item.id, weight);
                                        }}
                                        size="sm"
                                        variant="outline"
                                      >
                                        <Check className="h-3 w-3 mr-1" />
                                        Mark as Received
                                      </Button>
                                    </div>
                                  )}

                                  {/* Display weight for received items */}
                                  {item.status === "received" && (item as any).weight && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                      Weight: {(item as any).weight}g
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        {!order.is_rejected && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {/* Show create quote if no quotes exist */}
                            {!order.quotes?.length && (
                              <>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                                      <DollarSign className="h-4 w-4 mr-1" />
                                      Create Quote
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Create Order Quote</DialogTitle>
                                      <DialogDescription>Enter the invoice URL for this order quote.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="quote-url">Invoice URL</Label>
                                        <Input
                                          id="quote-url"
                                          type="url"
                                          value={quoteInvoiceUrl}
                                          onChange={(e) => setQuoteInvoiceUrl(e.target.value)}
                                          placeholder="Enter PayPal invoice URL"
                                          className="mt-2"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button onClick={createOrderQuote}>Create Quote</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>


                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => setSelectedOrder(order)}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject Order
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Reject Order</DialogTitle>
                                      <DialogDescription>
                                        Reject the entire order. The customer will be able to edit and resubmit.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                                        <Textarea
                                          id="rejection-reason"
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                          placeholder="Explain why the order is being rejected..."
                                          className="min-h-[100px]"
                                        />
                                      </div>

                                      {/* Product Issues */}
                                      <div>
                                        <Label>Flag Specific Products with Issues (optional)</Label>
                                        <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                                          {order.items.map((item) => {
                                            const issue = productIssues.get(item.id) || {
                                              hasIssue: false,
                                              description: "",
                                            };
                                            return (
                                              <div key={item.id} className="p-3 border rounded-lg">
                                                <div className="flex items-start gap-2">
                                                  <Checkbox
                                                    checked={issue.hasIssue}
                                                    onCheckedChange={(checked) =>
                                                      updateProductIssue(item.id, checked as boolean, issue.description)
                                                    }
                                                  />
                                                  <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                      {item.item_name || "Unnamed Product"}
                                                    </p>
                                                    {issue.hasIssue && (
                                                      <Input
                                                        className="mt-2"
                                                        placeholder="Describe the issue with this product..."
                                                        value={issue.description}
                                                        onChange={(e) =>
                                                          updateProductIssue(item.id, true, e.target.value)
                                                        }
                                                      />
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button variant="destructive" onClick={rejectOrder}>
                                        Reject Order
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}

                            {/* Show confirm payment button for sent product quotes */}
                            {order.quotes?.some((q) => q.status === "sent" && q.type === "product") && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => confirmProductPayment(order)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Confirm Payment
                              </Button>
                            )}

                            {/* After product payment confirmed - Mark as Purchased */}
                            {order.items.some((item) => item.status === "paid") && (
                              <Button size="sm" variant="outline" onClick={() => markProductsAsPurchased(order)}>
                                <Package className="h-4 w-4 mr-1" />
                                Mark All Paid as Purchased
                              </Button>
                            )}

                            {/* After purchased - Mark as Received */}
                            {order.items.some((item) => item.status === "purchased") && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // Collect weights from all input fields
                                  const weights = new Map<string, number>();
                                  order.items.forEach((item) => {
                                    if (item.status === "purchased") {
                                      const weightInput = document.getElementById(
                                        `weight-${item.id}`,
                                      ) as HTMLInputElement;
                                      if (weightInput?.value) {
                                        const weight = parseFloat(weightInput.value);
                                        if (!isNaN(weight)) {
                                          weights.set(item.id, weight);
                                        }
                                      }
                                    }
                                  });
                                  markProductsAsReceived(order, weights);
                                }}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Mark All Purchased as Received
                              </Button>
                            )}

                            {/* Show confirm shipping payment button */}
                            {order.quotes?.some((q) => q.status === "sent" && q.type === "shipping") && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => confirmShippingPayment(order)}
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                Confirm Shipping Payment
                              </Button>
                            )}

                            {/* After shipping payment confirmed - Ship Order */}
                            {order.items.every((item) => item.status === "shipping_paid") && (
                              <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700">
                                    <Truck className="h-4 w-4 mr-1" />
                                    Mark as Shipped
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Ship Order</DialogTitle>
                                    <DialogDescription>Enter the tracking number for this shipment.</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="tracking">Tracking Number</Label>
                                      <Input
                                        id="tracking"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        placeholder="Enter tracking number"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={() => shipOrder(order)}>Confirm Shipment</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        )}

                        {/* Quote Information */}
                        {order.quotes && order.quotes.length > 0 && (
                          <div className="mt-4 p-4 border border-blue-200 bg-blue-50/50 rounded-xl">
                            <p className="text-sm font-semibold text-blue-900 mb-2">Quote Information</p>

                            <div className="space-y-2">
                              {order.quotes.map((quote) => {
                                // Capitalize first letter of status
                                const formattedStatus =
                                  quote.status.charAt(0).toUpperCase() + quote.status.slice(1);

                                // Shorten URL (domain + 20 chars max)
                                let shortUrl = quote.quote_url;
                                try {
                                  const parsed = new URL(quote.quote_url);
                                  const domain = parsed.hostname.replace(/^www\./, "");
                                  const path = parsed.pathname + parsed.search + parsed.hash;
                                  shortUrl = `${domain}${path.length > 20 ? path.slice(0, 20) + "..." : path}`;
                                } catch {
                                  shortUrl = quote.quote_url.length > 25
                                    ? quote.quote_url.slice(0, 25) + "..."
                                    : quote.quote_url;
                                }

                                return (
                                  <div
                                    key={quote.id}
                                    className="flex items-center justify-between bg-white/60 rounded-lg p-3 border border-blue-100 "
                                  >
                                    <div className=" sm:flex-row sm:items-center sm:gap-3 text-sm">
                                      <p className="text-blue-900 font-medium">Status: {formattedStatus}</p>

                                      <a
                                        href={quote.quote_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                                        title={quote.quote_url}
                                      >
                                        <Link className="h-3.5 w-3.5" />
                                        {shortUrl}
                                      </a>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })
          )}

          {/* Pagination */}
          {totalFilteredPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm">
                Page {currentPage} of {totalFilteredPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalFilteredPages, prev + 1))}
                disabled={currentPage === totalFilteredPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
