import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  MapPin,
  Package,
  Truck,
  Calendar,
  CreditCard,
  CheckCircle,
  X,
  Link,
  Send,
  DollarSign,
  Hash,
  AlertCircle,
  AlertTriangle,
  Edit,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { createNotification } from "@/lib/notificationUtils";
import { Textarea } from "@/components/ui/textarea";
import { StatusFlow } from "@/components/ui/status-flow";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrackingUrlEntry {
  item_id: string;
  tracking_url: string;
  box_description: string;
}

interface ProductRequest {
  id: string;
  product_url: string;
  item_name?: string;
  quantity: number;
  weight?: number;
  has_shipping_issue?: boolean;
  shipping_issue_description?: string;
  is_box?: boolean;
  local_tracking_number?: string;
}

interface ShippingRequest {
  id: string;
  user_id: string;
  shipment_personal_id?: string;
  destination: string;
  shipping_method: string;
  total_weight: number;
  estimated_cost: number | null;
  actual_cost: number | null;
  status: string;
  shipping_address: any;
  items: ProductRequest[];
  created_at: string;
  rejection_reason?: string | null;
  rejection_details?: any;
  tracking_url?: string | null;
  tracking_urls?: TrackingUrlEntry[];
  quote_url?: string | null;
  user: {
    full_name: string;
    email: string;
    phone_number: string;
    user_personal_id?: string;
  };
}

interface ProductIssue {
  productId: string;
  hasIssue: boolean;
  issueDescription: string;
}

interface ShippingRequestsManagementProps {
  shipmentId?: string | null;
}

export const ShippingRequestsManagement = React.memo(
  ({ shipmentId }: ShippingRequestsManagementProps) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
      {},
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectingRequest, setRejectingRequest] =
      useState<ShippingRequest | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [productIssues, setProductIssues] = useState<ProductIssue[]>([]);
    const [trackingUrl, setTrackingUrl] = useState("");
    const [trackingUrls, setTrackingUrls] = useState<{
      [itemId: string]: string;
    }>({});
    const [currentShipmentBoxItems, setCurrentShipmentBoxItems] = useState<
      ProductRequest[]
    >([]);
    const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
    const [trackingRequestId, setTrackingRequestId] = useState<string | null>(
      null,
    );
    const [sendQuoteDialogOpen, setSendQuoteDialogOpen] = useState(false);
    const [sendQuoteRequestId, setSendQuoteRequestId] = useState<string | null>(
      null,
    );
    const [quotePrice, setQuotePrice] = useState("");
    const [quoteUrl, setQuoteUrl] = useState("");
    const [editTrackingDialogOpen, setEditTrackingDialogOpen] = useState(false);
    const [editTrackingUrl, setEditTrackingUrl] = useState("");
    const [editTrackingRequestId, setEditTrackingRequestId] = useState<
      string | null
    >(null);
    const [editBoxTrackingDialogOpen, setEditBoxTrackingDialogOpen] =
      useState(false);
    const [editBoxTrackingUrl, setEditBoxTrackingUrl] = useState("");
    const [editBoxTrackingRequestId, setEditBoxTrackingRequestId] = useState<
      string | null
    >(null);
    const [editBoxTrackingItemId, setEditBoxTrackingItemId] = useState<
      string | null
    >(null);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [hideRejected, setHideRejected] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancellingRequestId, setCancellingRequestId] = useState<
      string | null
    >(null);
    const [cancellingRequest, setCancellingRequest] = useState<ShippingRequest | null>(null);
    const [cancelCreditAmount, setCancelCreditAmount] = useState("");
    const [cancelCreditReason, setCancelCreditReason] = useState("");

    // Confirm Payment Dialog
    const [confirmPaymentDialogOpen, setConfirmPaymentDialogOpen] =
      useState(false);
    const [paymentRequestForConfirmation, setPaymentRequestForConfirmation] =
      useState<ShippingRequest | null>(null);
    const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

    // Mark as Sent Confirmation Dialog
    const [markAsSentDialogOpen, setMarkAsSentDialogOpen] = useState(false);
    const [requestForMarkAsSent, setRequestForMarkAsSent] =
      useState<ShippingRequest | null>(null);

    const formatShipmentNumber = (id: string) => {
      return `SHP-${id.substring(0, 8).toUpperCase()}`;
    };

    const { data: shippingRequests, isLoading } = useQuery({
      queryKey: ["admin-shipping-requests"],
      queryFn: async () => {
        // First, fetch all shipping quotes with their items
        const { data: quotes, error: quotesError } = await supabase
          .from("shipping_quotes")
          .select("*")
          .order("created_at", { ascending: false });

        if (quotesError) throw quotesError;
        if (!quotes || quotes.length === 0) return [];

        // Get unique user IDs
        const userIds = [...new Set(quotes.map((q) => q.user_id))];

        // Fetch profiles for those users
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone_number, user_personal_id")
          .in("id", userIds);

        if (profilesError) throw profilesError;

        // Create a map of profiles for quick lookup
        const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

        // Process each quote to get product request details
        const processedQuotes = await Promise.all(
          quotes.map(async (quote) => {
            // Parse the items array and fetch product request details
            const items = Array.isArray(quote.items) ? quote.items : [];
            const itemsWithDetails = await Promise.all(
              items.map(async (item: any) => {
                if (item.order_item_id) {
                  // Query product_requests directly since order_item_id actually contains product_request_id
                  const { data: productRequest } = await supabase
                    .from("product_requests")
                    .select(
                      "id, product_url, item_name, quantity, weight, has_shipping_issue, shipping_issue_description, is_box, local_tracking_number",
                    )
                    .eq("id", item.order_item_id)
                    .maybeSingle();

                  if (productRequest) {
                    return {
                      ...item,
                      ...productRequest,
                    };
                  }
                }
                return item;
              }),
            );

            return {
              ...quote,
              items: itemsWithDetails,
              tracking_urls:
                (quote.tracking_urls as unknown as TrackingUrlEntry[] | null) ||
                undefined,
              user: profileMap.get(quote.user_id) || {
                full_name: "Unknown User",
                email: "No email",
                phone_number: "No phone",
              },
            };
          }),
        );

        return processedQuotes as ShippingRequest[];
      },
      refetchInterval: 30000,
    });

    // Auto-open and scroll to shipment when shipmentId is provided
    React.useEffect(() => {
      if (shipmentId && shippingRequests && shippingRequests.length > 0) {
        setOpenSections((prev) => ({ ...prev, [shipmentId]: true }));
        setTimeout(() => {
          const element = document.getElementById(`shipment-${shipmentId}`);
          element?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    }, [shipmentId, shippingRequests]);

    // Reset to page 1 when filter or items per page changes
    React.useEffect(() => {
      setCurrentPage(1);
    }, [statusFilter, itemsPerPage, hideRejected]);

    // Scroll to top when page changes
    React.useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const sendQuoteMutation = useMutation({
      mutationFn: async ({
        requestId,
        price,
        url,
      }: {
        requestId: string;
        price: number;
        url: string;
      }) => {
        const { error } = await supabase
          .from("shipping_quotes")
          .update({
            actual_cost: price,
            quote_url: url,
            status: "quoted",
          })
          .eq("id", requestId);

        if (error) throw error;
      },
      onSuccess: async (_, variables) => {
        // Send notification to user
        const request = shippingRequests?.find(
          (r) => r.id === variables.requestId,
        );
        if (request) {
          await createNotification(
            request.user_id,
            "shipping_quote_received",
            `Your shipping quote of ¥${variables.price.toLocaleString()} for Shipment #${request.shipment_personal_id}. Please review and complete payment.`,
            null,
            request.shipment_personal_id,
            variables.requestId,
          );
        }

        queryClient.invalidateQueries({
          queryKey: ["admin-shipping-requests"],
        });
        toast({
          title: "Quote sent",
          description: "Shipping quote has been sent to the customer.",
        });
        setSendQuoteDialogOpen(false);
        setQuotePrice("");
        setQuoteUrl("");
        setSendQuoteRequestId(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to send quote. Please try again.",
          variant: "destructive",
        });
        console.error("Send quote error:", error);
      },
    });

    const updateStatusMutation = useMutation({
      mutationFn: async ({
        requestId,
        status,
        tracking_url,
        tracking_urls,
      }: {
        requestId: string;
        status: string;
        tracking_url?: string;
        tracking_urls?: Array<{ item_id: string; tracking_url: string }>;
      }) => {
        const updates: any = { status };
        if (tracking_url !== undefined) updates.tracking_url = tracking_url;
        if (tracking_urls !== undefined) updates.tracking_urls = tracking_urls;

        const { error } = await supabase
          .from("shipping_quotes")
          .update(updates)
          .eq("id", requestId);

        if (error) throw error;

        // Send notification based on status change
        const { data: request } = await supabase
          .from("shipping_quotes")
          .select(
            "user_id, destination, tracking_url, tracking_urls, shipment_personal_id",
          )
          .eq("id", requestId)
          .single();

        if (request) {
          if (status === "paid") {
            await createNotification(
              request.user_id,
              "shipping_payment_confirmed",
              `Your payment for Shipment #${request.shipment_personal_id} has been confirmed! We will prepare your shipment to ${request.destination}.`,
              null,
              request.shipment_personal_id,
              requestId,
            );
          } else if (status === "sent") {
            let trackingMsg = "";
            const trackingUrlsArray = request.tracking_urls as unknown as
              | TrackingUrlEntry[]
              | null;
            if (trackingUrlsArray && trackingUrlsArray.length > 0) {
              trackingMsg = ` Your shipment includes ${trackingUrlsArray.length} box(es) with tracking information.`;
            } else if (tracking_url) {
              trackingMsg = ` Track your package at: ${tracking_url}`;
            }
            await createNotification(
              request.user_id,
              "shipment_sent",
              `Your Shipment #${request.shipment_personal_id} to ${request.destination} has been sent!${trackingMsg}`,
              null,
              request.shipment_personal_id,
              requestId,
            );
          }
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["admin-shipping-requests"],
        });
        toast({
          title: "Status updated",
          description: "Shipping request status has been updated.",
        });
        setTrackingDialogOpen(false);
        setTrackingUrl("");
        setTrackingRequestId(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update status. Please try again.",
          variant: "destructive",
        });
        console.error("Update status error:", error);
      },
    });

    const updateTrackingUrlMutation = useMutation({
      mutationFn: async ({
        requestId,
        tracking_url,
      }: {
        requestId: string;
        tracking_url: string;
      }) => {
        const { error } = await supabase
          .from("shipping_quotes")
          .update({ tracking_url })
          .eq("id", requestId);

        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["admin-shipping-requests"],
        });
        toast({
          title: "Tracking URL updated",
          description: "The tracking URL has been updated successfully.",
        });
        setEditTrackingDialogOpen(false);
        setEditTrackingUrl("");
        setEditTrackingRequestId(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update tracking URL. Please try again.",
          variant: "destructive",
        });
        console.error("Update tracking URL error:", error);
      },
    });

    const updateBoxTrackingUrlMutation = useMutation({
      mutationFn: async ({
        requestId,
        itemId,
        tracking_url,
      }: {
        requestId: string;
        itemId: string;
        tracking_url: string;
      }) => {
        // First, fetch the current request to get existing tracking_urls
        const { data: request, error: fetchError } = await supabase
          .from("shipping_quotes")
          .select("tracking_urls")
          .eq("id", requestId)
          .single();

        if (fetchError) throw fetchError;

        // Update or add the tracking URL for this specific item
        const currentUrls =
          (request.tracking_urls as unknown as TrackingUrlEntry[]) || [];
        const updatedUrls = currentUrls.map((entry) =>
          entry.item_id === itemId ? { ...entry, tracking_url } : entry,
        );

        // If the item wasn't found, add it
        if (!currentUrls.some((entry) => entry.item_id === itemId)) {
          updatedUrls.push({
            item_id: itemId,
            tracking_url,
            box_description: "",
          });
        }

        // Update the database
        const { error } = await supabase
          .from("shipping_quotes")
          .update({ tracking_urls: updatedUrls as unknown as any })
          .eq("id", requestId);

        if (error) throw error;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["admin-shipping-requests"],
        });
        toast({
          title: "Tracking URL updated",
          description: "The box tracking URL has been updated successfully.",
        });
        setEditBoxTrackingDialogOpen(false);
        setEditBoxTrackingUrl("");
        setEditBoxTrackingRequestId(null);
        setEditBoxTrackingItemId(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update tracking URL. Please try again.",
          variant: "destructive",
        });
        console.error("Update box tracking URL error:", error);
      },
    });

    const rejectRequestMutation = useMutation({
      mutationFn: async ({
        requestId,
        reason,
        productIssues,
        requestItems,
      }: {
        requestId: string;
        reason: string;
        productIssues: ProductIssue[];
        requestItems: ProductRequest[];
      }) => {
        // Build rejection_details snapshot using already-processed items

        // Build a complete rejection snapshot including all items
        const productIssuesSnapshot = requestItems.map((item) => {
          const issue = productIssues.find((pi) => pi.productId === item.id);

          return {
            product_id: item.id,
            product_url: item.product_url,
            item_name: item.item_name,
            quantity: item.quantity,
            weight: item.weight,
            has_issue: issue?.hasIssue || false,
            issue_description: issue?.issueDescription || null,
          };
        });

        const rejectionDetails = {
          rejection_reason: reason,
          rejected_at: new Date().toISOString(),
          product_issues: productIssuesSnapshot,
        };

        // Update shipping quote
        const { error: quoteError } = await supabase
          .from("shipping_quotes")
          .update({
            status: "rejected",
            rejection_reason: reason,
            rejection_details: rejectionDetails,
          })
          .eq("id", requestId);

        if (quoteError) throw quoteError;

        // Get request data for notification
        const { data: request } = await supabase
          .from("shipping_quotes")
          .select("user_id, shipment_personal_id")
          .eq("id", requestId)
          .single();

        if (request) {
          await createNotification(
            request.user_id,
            "shipping_request_rejected",
            `Your shipping request for Shipment #${request.shipment_personal_id} has been rejected. Reason: ${reason.substring(0, 100)}${reason.length > 100 ? "..." : ""}`,
            null,
            request.shipment_personal_id,
            requestId,
          );
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["admin-shipping-requests"],
        });
        toast({
          title: "Request rejected",
          description: "Shipping request has been rejected with issue details.",
        });
        setRejectDialogOpen(false);
        setRejectionReason("");
        setProductIssues([]);
        setRejectingRequest(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to reject request. Please try again.",
          variant: "destructive",
        });
        console.error("Reject request error:", error);
      },
    });

    const cancelShipmentMutation = useMutation({
      mutationFn: async ({ requestId }: { requestId: string }) => {
        const { error } = await supabase
          .from("shipping_quotes")
          .update({ status: "cancelled" })
          .eq("id", requestId);

        if (error) throw error;

        // Get request details for notification
        const { data: request } = await supabase
          .from("shipping_quotes")
          .select("user_id, shipment_personal_id, destination")
          .eq("id", requestId)
          .single();

        if (request) {
          await createNotification(
            request.user_id,
            "shipment_cancelled",
            `Your Shipment #${request.shipment_personal_id} to ${request.destination} has been cancelled by the administrator.`,
            null,
            request.shipment_personal_id,
            requestId,
          );
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["admin-shipping-requests"],
        });
        toast({
          title: "Shipment cancelled",
          description: "The shipping request has been cancelled.",
        });
        setCancelDialogOpen(false);
        setCancellingRequestId(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to cancel shipment. Please try again.",
          variant: "destructive",
        });
        console.error("Cancel shipment error:", error);
      },
    });

    const handleRefresh = async () => {
      setRefreshing(true);
      try {
        await queryClient.invalidateQueries({
          queryKey: ["admin-shipping-requests"],
        });
        toast({
          title: "Updated",
          description: "Shipping requests refreshed successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to refresh data.",
          variant: "destructive",
        });
      } finally {
        setRefreshing(false);
      }
    };

    const handleReject = (request: ShippingRequest) => {
      setRejectingRequest(request);
      // Initialize product issues state
      const initialIssues = request.items.map((item) => ({
        productId: item.id,
        hasIssue: false,
        issueDescription: "",
      }));
      setProductIssues(initialIssues);
      setRejectDialogOpen(true);
    };

    const handleConfirmReject = () => {
      if (!rejectingRequest || !rejectionReason.trim()) return;

      rejectRequestMutation.mutate({
        requestId: rejectingRequest.id,
        reason: rejectionReason,
        productIssues: productIssues,
        requestItems: rejectingRequest.items,
      });
    };

    const updateProductIssue = (
      productId: string,
      field: "hasIssue" | "issueDescription",
      value: boolean | string,
    ) => {
      setProductIssues((prev) =>
        prev.map((issue) => {
          if (issue.productId === productId) {
            if (field === "hasIssue") {
              return {
                ...issue,
                hasIssue: value as boolean,
                issueDescription: value ? issue.issueDescription : "",
              };
            } else {
              return { ...issue, issueDescription: value as string };
            }
          }
          return issue;
        }),
      );
    };

    const handleSendQuote = (requestId: string) => {
      setSendQuoteRequestId(requestId);
      setSendQuoteDialogOpen(true);
    };

    const handleConfirmSendQuote = () => {
      if (!sendQuoteRequestId || !quotePrice || !quoteUrl) return;
      sendQuoteMutation.mutate({
        requestId: sendQuoteRequestId,
        price: parseFloat(quotePrice),
        url: quoteUrl,
      });
    };

    const handleMarkAsSent = (request: ShippingRequest) => {
      setTrackingRequestId(request.id);
      setTrackingDialogOpen(true);

      // Pre-populate if editing existing tracking
      if (request.tracking_url) {
        setTrackingUrl(request.tracking_url);
      } else {
        setTrackingUrl("");
      }
    };

    const handleConfirmSent = () => {
      if (!trackingRequestId) return;

      updateStatusMutation.mutate({
        requestId: trackingRequestId,
        status: "sent",
        tracking_url: trackingUrl || undefined,
      });
    };

    const handleEditTrackingUrl = (requestId: string, currentUrl: string) => {
      setEditTrackingRequestId(requestId);
      setEditTrackingUrl(currentUrl || "");
      setEditTrackingDialogOpen(true);
    };

    const handleConfirmUpdateTrackingUrl = () => {
      if (editTrackingRequestId) {
        updateTrackingUrlMutation.mutate({
          requestId: editTrackingRequestId,
          tracking_url: editTrackingUrl,
        });
      }
    };

    const handleEditBoxTrackingUrl = (
      requestId: string,
      itemId: string,
      currentUrl: string,
    ) => {
      setEditBoxTrackingRequestId(requestId);
      setEditBoxTrackingItemId(itemId);
      setEditBoxTrackingUrl(currentUrl || "");
      setEditBoxTrackingDialogOpen(true);
    };

    const handleConfirmUpdateBoxTrackingUrl = () => {
      if (editBoxTrackingRequestId && editBoxTrackingItemId) {
        updateBoxTrackingUrlMutation.mutate({
          requestId: editBoxTrackingRequestId,
          itemId: editBoxTrackingItemId,
          tracking_url: editBoxTrackingUrl,
        });
      }
    };

    const toggleSection = (requestId: string) => {
      setOpenSections((prev) => ({
        ...prev,
        [requestId]: !prev[requestId],
      }));
    };

    const handleCancelShipment = (requestId: string, request?: ShippingRequest) => {
      setCancellingRequestId(requestId);
      setCancellingRequest(request || null);
      setCancelDialogOpen(true);
    };

    const handleConfirmCancel = async () => {
      if (!cancellingRequestId) return;
      
      const isPaid = cancellingRequest?.status === "paid";
      
      // Validate credit fields if shipment is paid
      if (isPaid) {
        const creditNum = parseFloat(cancelCreditAmount);
        if (!cancelCreditAmount || isNaN(creditNum) || creditNum < 0) {
          toast({
            title: "Credit amount required",
            description: "Please enter a valid credit amount for this cancelled shipment.",
            variant: "destructive",
          });
          return;
        }
        if (!cancelCreditReason.trim()) {
          toast({
            title: "Reason required",
            description: "Please enter a reason for the credit.",
            variant: "destructive",
          });
          return;
        }
      }
      
      cancelShipmentMutation.mutate({ requestId: cancellingRequestId });
      
      // If paid, also assign credit
      if (isPaid && cancellingRequest && cancelCreditAmount && parseFloat(cancelCreditAmount) > 0) {
        const { error: creditError } = await (supabase.rpc as any)('cancel_shipping_with_credit', {
          target_user_id: cancellingRequest.user_id,
          credit_amount: parseFloat(cancelCreditAmount),
          cancel_reason: cancelCreditReason.trim(),
          target_shipping_id: cancellingRequest.id,
        });
        
        if (creditError) {
          console.error('Credit assignment error:', creditError);
          toast({
            title: "Shipment cancelled but credit failed",
            description: `Shipment was cancelled but credit assignment failed: ${creditError.message}`,
            variant: "destructive",
          });
        }
      }
      
      setCancelCreditAmount("");
      setCancelCreditReason("");
      setCancellingRequest(null);
    };

    const handleOpenConfirmPaymentDialog = (request: ShippingRequest) => {
      setPaymentRequestForConfirmation(request);
      setConfirmPaymentDialogOpen(true);
    };

    const handleConfirmPaymentAction = async () => {
      if (!paymentRequestForConfirmation) return;
      setIsConfirmingPayment(true);
      try {
        await updateStatusMutation.mutateAsync({
          requestId: paymentRequestForConfirmation.id,
          status: "paid",
        });
        setConfirmPaymentDialogOpen(false);
        setPaymentRequestForConfirmation(null);
      } finally {
        setIsConfirmingPayment(false);
      }
    };

    const handleOpenMarkAsSentDialog = (request: ShippingRequest) => {
      setRequestForMarkAsSent(request);
      setMarkAsSentDialogOpen(true);
    };

    const handleConfirmMarkAsSent = () => {
      if (!requestForMarkAsSent) return;
      setMarkAsSentDialogOpen(false);
      // Proceed to tracking URL dialog
      handleMarkAsSent(requestForMarkAsSent);
      setRequestForMarkAsSent(null);
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "quoted":
          return "bg-blue-100 text-blue-800";
        case "sent":
          return "bg-purple-100 text-purple-800";
        case "paid":
          return "bg-green-100 text-green-800";
        case "rejected":
          return "bg-red-100 text-red-800";
        case "cancelled":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getStatusSteps = (currentStatus: string) => {
      const baseSteps = [
        {
          label: "Request Received",
          status: "completed" as const,
          icon: <Package className="h-4 w-4" />,
        },
        {
          label: "Quote Sent",
          status: "upcoming" as const,
          icon: <Send className="h-4 w-4" />,
        },
        {
          label: "Payment Confirmed",
          status: "upcoming" as const,
          icon: <CreditCard className="h-4 w-4" />,
        },
        {
          label: "Shipment Sent",
          status: "upcoming" as const,
          icon: <Truck className="h-4 w-4" />,
        },
      ];

      if (currentStatus === "rejected") {
        return [
          {
            label: "Request Received",
            status: "completed" as const,
            icon: <Package className="h-4 w-4" />,
          },
          {
            label: "Rejected",
            status: "rejected" as const,
            icon: <AlertCircle className="h-4 w-4" />,
          },
        ];
      }

      if (currentStatus === "cancelled") {
        return [
          {
            label: "Request Received",
            status: "completed" as const,
            icon: <Package className="h-4 w-4" />,
          },
          {
            label: "Cancelled",
            status: "rejected" as const,
            icon: <X className="h-4 w-4" />,
          },
        ];
      }

      const statusIndex =
        {
          pending: 0,
          quoted: 1,
          paid: 2,
          sent: 3,
        }[currentStatus] || 0;

      return baseSteps.map((step, index) => ({
        ...step,
        status: (index <= statusIndex ? "completed" : "upcoming") as
          | "completed"
          | "upcoming",
      }));
    };

    // Apply search filter
    let filteredRequests =
      shippingRequests?.filter((request) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          request.user.full_name?.toLowerCase().includes(searchLower) ||
          request.user.email?.toLowerCase().includes(searchLower) ||
          request.user.user_personal_id?.toLowerCase().includes(searchLower) ||
          request.destination?.toLowerCase().includes(searchLower) ||
          request.shipment_personal_id?.toLowerCase().includes(searchLower) ||
          request.id.toLowerCase().includes(searchLower)
        );
      }) || [];

    // Apply status filter
    if (statusFilter !== "all") {
      filteredRequests = filteredRequests.filter(
        (request) => request.status === statusFilter,
      );
    }

    // Apply hide rejected and cancelled filter
    if (hideRejected) {
      filteredRequests = filteredRequests.filter(
        (request) =>
          request.status !== "rejected" && request.status !== "cancelled",
      );
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    if (isLoading) {
      return (
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-muted-foreground">
              Loading shipping requests...
            </div>
          </CardContent>
        </Card>
      );
    }

    const getVisiblePages = (current: number, total: number) => {
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

      if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
      if (current >= total - 3)
        return [1, "...", total - 4, total - 3, total - 2, total - 1, total];

      return [1, "...", current - 1, current, current + 1, "...", total];
    };

    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Shipping Requests</CardTitle>
            <CardDescription>
              Manage all shipping quote requests with complete shipping
              information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Input
                placeholder="Search by customer name, email, customer ID, shipment ID, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            {/* Filters and Controls */}
            <Card className="bg-muted/30 mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Status:</span>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending Quote</SelectItem>
                          <SelectItem value="quoted">
                            Awaiting Payment
                          </SelectItem>
                          <SelectItem value="paid">Payment Received</SelectItem>
                          <SelectItem value="sent">Shipped</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Update Button and Hide Rejected Checkbox */}
                    <div className="flex items-center gap-2">
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
                        {refreshing ? "Refreshing..." : "Update"}
                      </Button>

                      <Checkbox
                        id="hide-rejected"
                        checked={hideRejected}
                        onCheckedChange={(checked) =>
                          setHideRejected(checked === true)
                        }
                      />
                      <label
                        htmlFor="hide-rejected"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Hide rejected
                      </label>
                    </div>
                  </div>

                  {/* Items per page */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Show:</span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={(val) => setItemsPerPage(Number(val))}
                    >
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
                    <span className="text-sm text-muted-foreground">
                      per page
                    </span>
                  </div>
                </div>

                {/* Item count display */}
                {filteredRequests.length > 0 && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredRequests.length)} of{" "}
                    {filteredRequests.length} shipping requests
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              {filteredRequests.length === 0 &&
                shippingRequests &&
                shippingRequests.length > 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No shipping requests found with this filter</p>
                    <p className="text-sm mt-2">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              {filteredRequests.length === 0 &&
                (!shippingRequests || shippingRequests.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    No shipping requests found
                  </div>
                )}
              {paginatedRequests.length > 0 &&
                paginatedRequests?.map((request) => (
                  <Collapsible
                    key={request.id}
                    open={openSections[request.id]}
                    onOpenChange={() => toggleSection(request.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Card
                        id={`shipment-${request.id}`}
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={(e) => {
                          if (
                            (window.getSelection()?.toString().length ?? 0) > 0
                          ) {
                            e.stopPropagation();
                          }
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            {/* LEFT COLUMN — Shipment + Customer Info */}
                            <div className="flex flex-col text-left flex-1 space-y-1">
                              <p className="font-medium text-base">
                                <span
                                  className="select-text"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Shipment for{" "}
                                </span>
                                <span
                                  className="text-blue-500 font-semibold select-text"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {request.user.full_name ||
                                    request.user.email ||
                                    "Unknown"}
                                </span>
                              </p>

                              <p className="text-sm text-muted-foreground">
                                <span
                                  className="select-text"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Customer ID:{" "}
                                </span>
                                <span
                                  className="font-medium text-emerald-500 select-text"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {request.user.user_personal_id
                                    ? `#${request.user.user_personal_id}`
                                    : "N/A"}
                                </span>
                              </p>

                              <p className="text-sm text-muted-foreground">
                                <span
                                  className="select-text"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Customer Shipment ID:{" "}
                                </span>
                                <span
                                  className="font-medium text-emerald-500 select-text"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {request.shipment_personal_id
                                    ? `#${request.shipment_personal_id}`
                                    : "N/A"}
                                </span>
                              </p>

                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <span
                                  className="font-medium select-text"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Shipment #
                                  {request.id.substring(0, 8).toUpperCase()}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(request.id);
                                    toast({
                                      title: "Shipment ID copied to clipboard",
                                    });
                                  }}
                                  title="Copy Shipment ID"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {/* RIGHT COLUMN — Status + Summary Info + Chevron */}
                            <div className="flex flex-col sm:items-end gap-1 text-left sm:text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Badge
                                  className={getStatusColor(request.status)}
                                >
                                  {request.status}
                                </Badge>

                                <ChevronDown
                                  className={`h-4 w-4 text-muted-foreground transform transition-transform duration-300 ${
                                    openSections[request.id]
                                      ? "rotate-180"
                                      : "rotate-0"
                                  }`}
                                />
                              </div>

                              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground sm:justify-end">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {request.destination}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Truck className="h-3 w-3" />
                                  {request.shipping_method}
                                </span>
                              </div>

                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(request.created_at), "PPpp")}
                              </span>

                              <p className="text-xs text-muted-foreground">
                                ¥
                                {request.actual_cost ||
                                  request.estimated_cost ||
                                  "-"}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <Card className="mt-2">
                        <CardContent className="pt-4">
                          {/* Status Flow Diagram */}
                          <div className="mb-6">
                            <h4 className="font-medium mb-3">Status Flow</h4>
                            <StatusFlow
                              steps={getStatusSteps(request.status)}
                            />
                          </div>

                          {/* Tracking Information (if sent) */}
                          {request.status === "sent" && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-blue-800 mb-1">
                                    Tracking Information
                                  </h4>
                                  {request.tracking_url ? (
                                    <a
                                      href={request.tracking_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-700 hover:underline flex items-center gap-1"
                                    >
                                      <Link className="h-3 w-3" />
                                      {request.tracking_url}
                                    </a>
                                  ) : (
                                    <p className="text-sm text-blue-400 italic">
                                      No tracking URL assigned yet
                                    </p>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleEditTrackingUrl(
                                      request.id,
                                      request.tracking_url || "",
                                    )
                                  }
                                  className="border-blue-500 text-blue-700 hover:bg-blue-100"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  {request.tracking_url
                                    ? "Edit URL"
                                    : "Add URL"}
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Customer Information */}
                          <div className="mb-4 p-3 bg-accent/20 rounded-lg">
                            <h4 className="font-medium mb-2">
                              Customer Information
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Email:
                                </span>{" "}
                                {request.user.email}
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Phone:
                                </span>{" "}
                                {request.user.phone_number}
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="mb-4 p-3 bg-accent/20 rounded-lg">
                            <h4 className="font-medium mb-2">
                              Shipping Address
                            </h4>
                            <div className="text-sm">
                              {request.shipping_address && (
                                <>
                                  <p className="font-medium">
                                    {request.shipping_address.full_name}
                                  </p>
                                  <p>{request.shipping_address.phone_number}</p>
                                  <p className="mt-2">
                                    {request.shipping_address.address}
                                  </p>
                                  {(request.shipping_address.city ||
                                    request.shipping_address.state) && (
                                    <p>
                                      {[
                                        request.shipping_address.city,
                                        request.shipping_address.state,
                                      ]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </p>
                                  )}
                                  <p>{request.shipping_address.postal_code}</p>
                                  <p>{request.shipping_address.country}</p>
                                  <p>
                                    {request.shipping_address.tax_vat_Id
                                      ? `Tax/VAT ID: ${request.shipping_address.tax_vat_Id}`
                                      : "No Tax/VAT ID included"}
                                  </p>

                                  {request.shipping_address.address_notes && (
                                    <p className="mt-2 text-muted-foreground">
                                      Notes:{" "}
                                      {request.shipping_address.address_notes}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {request.status === "rejected" &&
                            request.rejection_details && (
                              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <h4 className="font-medium mb-2 text-destructive">
                                  Rejection Details
                                </h4>
                                <p className="text-sm mb-2">
                                  <span className="font-medium">Reason:</span>{" "}
                                  {request.rejection_details.rejection_reason}
                                </p>
                                <p className="text-xs text-muted-foreground mb-3">
                                  Rejected on{" "}
                                  {new Date(
                                    request.rejection_details.rejected_at,
                                  ).toLocaleString()}
                                </p>

                                {Array.isArray(
                                  request.rejection_details.product_issues,
                                ) &&
                                  request.rejection_details.product_issues
                                    .length > 0 && (
                                    <div className="space-y-4">
                                      {/* ⚠️ Flagged Products */}
                                      {request.rejection_details.product_issues.some(
                                        (i: any) => i.has_issue,
                                      ) && (
                                        <div>
                                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                          <p className="text-sm font-semibold text-destructive mb-1">
                                            Flagged Products
                                          </p>
                                          {request.rejection_details.product_issues
                                            .filter(
                                              (issue: any) => issue.has_issue,
                                            )
                                            .map(
                                              (issue: any, index: number) => (
                                                <div
                                                  key={index}
                                                  className="pl-3 border-l-2 border-destructive/30"
                                                >
                                                  <p className="text-sm font-medium text-destructive">
                                                    {issue.item_name ||
                                                      "Item " + (index + 1)}
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    Qty: {issue.quantity} |
                                                    Weight: {issue.weight}g
                                                  </p>
                                                  {issue.issue_description && (
                                                    <p className="text-xs text-destructive mt-1">
                                                      Issue:{" "}
                                                      {issue.issue_description}
                                                    </p>
                                                  )}
                                                  {issue.product_url && (
                                                    <a
                                                      href={issue.product_url}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="ml-5 text-xs text-blue-700 hover:underline break-all"
                                                    >
                                                      {issue.product_url
                                                        .length > 60
                                                        ? issue.product_url.substring(
                                                            0,
                                                            60,
                                                          ) + "..."
                                                        : issue.product_url}
                                                    </a>
                                                  )}
                                                </div>
                                              ),
                                            )}
                                        </div>
                                      )}

                                      {request.rejection_details.product_issues.some(
                                        (i: any) => !i.has_issue,
                                      ) && (
                                        <div>
                                          <p className="text-sm font-semibold text-green-700 mb-1">
                                            Products
                                          </p>
                                          {request.rejection_details.product_issues
                                            .filter(
                                              (issue: any) => !issue.has_issue,
                                            )
                                            .map(
                                              (issue: any, index: number) => (
                                                <div
                                                  key={index}
                                                  className="pl-3 border-l-2 border-green-300"
                                                >
                                                  <p className="text-sm font-medium text-green-800">
                                                    {issue.item_name ||
                                                      "Item " + (index + 1)}
                                                  </p>
                                                  <p className="text-xs text-muted-foreground">
                                                    Qty: {issue.quantity} |
                                                    Weight: {issue.weight}g
                                                  </p>
                                                  {issue.product_url && (
                                                    <a
                                                      href={issue.product_url}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="ml-5 text-xs text-blue-700 hover:underline break-all"
                                                    >
                                                      {issue.product_url
                                                        .length > 60
                                                        ? issue.product_url.substring(
                                                            0,
                                                            60,
                                                          ) + "..."
                                                        : issue.product_url}
                                                    </a>
                                                  )}
                                                </div>
                                              ),
                                            )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>
                            )}

                          {/* Items (only show if NOT rejected with snapshot details) */}
                          {!(
                            request.status === "rejected" &&
                            request.rejection_details
                          ) && (
                            <div className="mb-4 p-3 bg-accent/20 rounded-lg">
                              <h4 className="font-medium mb-2">
                                Items ({request.items?.length || 0})
                              </h4>
                              <div className="space-y-2">
                                {request.items?.map(
                                  (item: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <Package className="h-3 w-3 text-muted-foreground" />
                                          <span>
                                            {item.item_name ||
                                              "Item " + (index + 1)}
                                          </span>
                                          <Badge variant="outline">
                                            Qty: {item.quantity}
                                          </Badge>
                                        </div>
                                        {item.is_box
                                          ? item.local_tracking_number && (
                                              <div className="ml-5 text-xs text-muted-foreground">
                                                Local Tracking:{" "}
                                                {item.local_tracking_number}
                                              </div>
                                            )
                                          : item.product_url && (
                                              <a
                                                href={item.product_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-5 text-xs text-blue-700 hover:underline break-all"
                                              >
                                                {item.product_url.length > 60
                                                  ? item.product_url.substring(
                                                      0,
                                                      60,
                                                    ) + "..."
                                                  : item.product_url}
                                              </a>
                                            )}
                                      </div>
                                      <span className="text-muted-foreground">
                                        {item.weight}g
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                              <div className="mt-2 pt-2 border-t">
                                <div className="flex justify-between text-sm font-medium">
                                  <span>Total Weight:</span>
                                  <span>{request.total_weight}g</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Costs and Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Estimated Cost
                                </p>
                                <p className="font-medium">
                                  ¥{request.estimated_cost || "-"}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Actual Cost
                                </p>
                                <p className="font-medium">
                                  ¥{request.actual_cost || "-"}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {request.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSendQuote(request.id)}
                                  >
                                    <Send className="h-3 w-3 mr-1" />
                                    Send Quote
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-gray-600 hover:text-gray-700"
                                    onClick={() =>
                                      handleCancelShipment(request.id, request)
                                    }
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleReject(request)}
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {request.status === "quoted" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() =>
                                      handleOpenConfirmPaymentDialog(request)
                                    }
                                  >
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    Confirm Payment
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-gray-600 hover:text-gray-700"
                                    onClick={() =>
                                      handleCancelShipment(request.id, request)
                                    }
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {request.status === "paid" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-purple-600 hover:text-purple-700"
                                    onClick={() =>
                                      handleOpenMarkAsSentDialog(request)
                                    }
                                  >
                                    <Truck className="h-3 w-3 mr-1" />
                                    Mark as Sent
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-black hover:text-red-700 hover:bg-red-50 border-gray-300"
                                    onClick={() =>
                                      handleCancelShipment(request.id, request)
                                    }
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Cancel Shipment
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {(request.status === "quoted" ||
                            request.status === "paid" ||
                            request.status === "sent") &&
                            request.quote_url &&
                            request.actual_cost && (
                              <div className="mt-4 p-4 border border-blue-200 bg-blue-50/50 rounded-xl">
                                <p className="text-sm font-semibold text-blue-900 mb-2">
                                  Quote Information
                                </p>
                                <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                                    <p className="text-blue-900 font-medium">
                                      Price: ¥
                                      {request.actual_cost.toLocaleString()}
                                    </p>
                                    <a
                                      href={request.quote_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline break-all"
                                      title={request.quote_url}
                                    >
                                      <Link className="h-3 w-3 flex-shrink-0" />
                                      {request.quote_url.length > 40
                                        ? `${request.quote_url.substring(0, 40)}...`
                                        : request.quote_url}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
            </div>

            {/* Pagination Controls */}
            {filteredRequests.length > 0 && totalPages > 1 && (
              <div className="mt-8 px-4 py-6 bg-background border border-border/60 rounded-2xl shadow-sm flex flex-col gap-6 items-center justify-between md:flex-row md:px-6">
                {/* Info de página: se centra en móvil, se alinea a la izquierda en desktop */}
                <div className="flex flex-col gap-1 items-center md:items-start order-2 md:order-1">
                  <p className="text-sm md:text-base font-bold text-foreground">
                    Página {currentPage} de {totalPages}
                  </p>
                  <p className="text-[10px] md:text-xs text-muted-foreground tracking-widest uppercase font-medium">
                    {filteredRequests.length} resultados totales
                  </p>
                </div>

                {/* Contenedor de botones: Wrap habilitado para móviles */}
                <div className="flex items-center justify-center gap-1 md:gap-2 order-1 md:order-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 md:h-11 md:w-11 rounded-xl shrink-0"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>

                  {/* Los números se envuelven (wrap) si la pantalla es muy pequeña */}
                  <div className="flex flex-wrap items-center justify-center gap-1 md:gap-1.5 max-w-[200px] sm:max-w-none">
                    {getVisiblePages(currentPage, totalPages).map(
                      (page, index) => (
                        <React.Fragment key={index}>
                          {page === "..." ? (
                            <span className="px-1 text-muted-foreground font-bold text-xs md:text-sm">
                              ...
                            </span>
                          ) : (
                            <Button
                              variant={
                                currentPage === page ? "default" : "ghost"
                              }
                              onClick={() => setCurrentPage(page as number)}
                              className={`h-8 w-8 md:h-11 md:min-w-[2.75rem] rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all ${
                                currentPage === page
                                  ? "bg-[#0f172a] text-white shadow-md md:scale-110 z-10"
                                  : "text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {page}
                            </Button>
                          )}
                        </React.Fragment>
                      ),
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 md:h-11 md:w-11 rounded-xl shrink-0"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Reject Dialog with Product Issues */}
        <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Shipping Request</AlertDialogTitle>
              <AlertDialogDescription>
                Flag products with issues and provide rejection reasons.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              {/* Overall rejection reason */}
              <div>
                <Label htmlFor="rejection-reason">
                  Overall Rejection Reason
                </Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Enter the main reason for rejecting this shipping request..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Product issues */}
              {rejectingRequest && rejectingRequest.items.length > 0 && (
                <div>
                  <Label>Product Issues</Label>
                  <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <div className="space-y-4">
                      {rejectingRequest.items.map((item, index) => {
                        const issue = productIssues.find(
                          (pi) => pi.productId === item.id,
                        );
                        return (
                          <div
                            key={item.id || index}
                            className="space-y-2 p-3 border rounded-lg"
                          >
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id={`issue-${item.id}`}
                                checked={issue?.hasIssue || false}
                                onCheckedChange={(checked) =>
                                  updateProductIssue(
                                    item.id,
                                    "hasIssue",
                                    checked as boolean,
                                  )
                                }
                              />
                              <div className="flex-1 space-y-1">
                                <Label
                                  htmlFor={`issue-${item.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {item.item_name || "Item " + (index + 1)}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} | Weight: {item.weight}g
                                </p>
                                {item.product_url && (
                                  <a
                                    href={item.product_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-5 text-xs text-blue hover:underline break-all"
                                  >
                                    {item.product_url.length > 60
                                      ? item.product_url.substring(0, 60) +
                                        "..."
                                      : item.product_url}
                                  </a>
                                )}
                              </div>
                            </div>
                            {issue?.hasIssue && (
                              <Textarea
                                placeholder="Describe the issue with this product..."
                                value={issue.issueDescription}
                                onChange={(e) =>
                                  updateProductIssue(
                                    item.id,
                                    "issueDescription",
                                    e.target.value,
                                  )
                                }
                                className="min-h-[60px] text-sm"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setRejectionReason("");
                  setProductIssues([]);
                  setRejectingRequest(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmReject}
                disabled={!rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reject Request
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Send Quote Dialog */}
        <Dialog
          open={sendQuoteDialogOpen}
          onOpenChange={setSendQuoteDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Shipping Quote</DialogTitle>
              <DialogDescription>
                Enter the shipping cost and payment URL for the customer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="quote-price">Shipping Cost (¥)</Label>
                <Input
                  id="quote-price"
                  type="number"
                  value={quotePrice}
                  onChange={(e) => setQuotePrice(e.target.value)}
                  placeholder="Enter shipping cost"
                  required
                />
              </div>
              <div>
                <Label htmlFor="quote-url">Payment URL</Label>
                <Input
                  id="quote-url"
                  type="url"
                  value={quoteUrl}
                  onChange={(e) => setQuoteUrl(e.target.value)}
                  placeholder="https://payment.example.com/..."
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setSendQuoteDialogOpen(false);
                  setQuotePrice("");
                  setQuoteUrl("");
                  setSendQuoteRequestId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSendQuote}
                disabled={!quotePrice || !quoteUrl}
              >
                Send Quote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tracking URL Dialog */}
        <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Shipment as Sent</DialogTitle>
              <DialogDescription>
                Enter the tracking URL for this shipment (optional).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Items included in this shipment */}
              {(() => {
                const currentRequest = shippingRequests?.find(
                  (r) => r.id === trackingRequestId,
                );
                if (currentRequest && currentRequest.items?.length > 0) {
                  return (
                    <div className="p-3 bg-accent/20 rounded-lg">
                      <Label className="text-sm font-medium mb-2 block">
                        Items in this shipment ({currentRequest.items.length})
                      </Label>
                      <ol className="space-y-1 list-decimal list-inside">
                        {currentRequest.items.map((item, index) => (
                          <li key={item.id || index} className="text-sm">
                            <span className="font-medium">
                              {item.item_name || `Item ${index + 1}`}
                            </span>
                            {" — "}
                            <span className="text-muted-foreground">
                              Qty: {item.quantity}
                            </span>
                            {item.product_url && (
                              <a
                                href={item.product_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-xs text-blue-600 hover:underline break-all"
                              >
                                {item.product_url.length > 50
                                  ? item.product_url.substring(0, 50) + "..."
                                  : item.product_url}
                              </a>
                            )}
                            {item.local_tracking_number && (
                              <span className="ml-2 text-xs text-muted-foreground">
                                (Local: {item.local_tracking_number})
                              </span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </div>
                  );
                }
                return null;
              })()}
              <div>
                <Label htmlFor="tracking-url">Tracking URL (Optional)</Label>
                <Input
                  id="tracking-url"
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://tracking.example.com/..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setTrackingDialogOpen(false);
                  setTrackingUrl("");
                  setTrackingRequestId(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmSent}>Mark as Sent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Tracking URL Dialog */}
        <Dialog
          open={editTrackingDialogOpen}
          onOpenChange={setEditTrackingDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tracking URL</DialogTitle>
              <DialogDescription>
                Update the tracking URL for this shipment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-tracking-url">Tracking URL</Label>
                <Input
                  id="edit-tracking-url"
                  type="url"
                  value={editTrackingUrl}
                  onChange={(e) => setEditTrackingUrl(e.target.value)}
                  placeholder="https://tracking.example.com/..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setEditTrackingDialogOpen(false);
                  setEditTrackingUrl("");
                  setEditTrackingRequestId(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmUpdateTrackingUrl}>
                Update URL
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Box Tracking URL Dialog */}
        <Dialog
          open={editBoxTrackingDialogOpen}
          onOpenChange={setEditBoxTrackingDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Box Tracking URL</DialogTitle>
              <DialogDescription>
                Update the tracking URL for this box item.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-box-tracking-url">Tracking URL</Label>
                <Input
                  id="edit-box-tracking-url"
                  type="url"
                  value={editBoxTrackingUrl}
                  onChange={(e) => setEditBoxTrackingUrl(e.target.value)}
                  placeholder="https://tracking.example.com/..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setEditBoxTrackingDialogOpen(false);
                  setEditBoxTrackingUrl("");
                  setEditBoxTrackingRequestId(null);
                  setEditBoxTrackingItemId(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmUpdateBoxTrackingUrl}>
                Update URL
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Shipment Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={(open) => {
          setCancelDialogOpen(open);
          if (!open) {
            setCancelCreditAmount("");
            setCancelCreditReason("");
            setCancellingRequest(null);
          }
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {cancellingRequest?.status === "paid" && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Cancel Shipment?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                {cancellingRequest?.status === "paid" ? (
                  <>
                    <p className="font-semibold text-red-600">
                      ⚠️ WARNING: This shipment has already been paid!
                    </p>
                    <p>
                      Are you sure you want to cancel Shipment #{cancellingRequest?.shipment_personal_id}?
                    </p>
                    <p className="text-sm">
                      The customer has already paid for shipping. This action cannot be undone.
                      The items will be freed back to their storage.
                    </p>
                  </>
                ) : (
                  <p>
                    Are you sure you want to cancel this shipping request? The
                    customer will be notified and the items will be freed back to
                    their storage.
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>

            {/* Credit fields — only shown when shipment is paid */}
            {cancellingRequest?.status === "paid" && (
              <div className="space-y-3 py-2">
                <div>
                  <Label htmlFor="cancel-shipping-credit-amount" className="text-sm font-medium">
                    Credit Amount <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cancel-shipping-credit-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={cancelCreditAmount}
                    onChange={(e) => setCancelCreditAmount(e.target.value)}
                    placeholder="Enter credit amount to assign..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cancel-shipping-credit-reason" className="text-sm font-medium">
                    Reason <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="cancel-shipping-credit-reason"
                    value={cancelCreditReason}
                    onChange={(e) => setCancelCreditReason(e.target.value)}
                    placeholder="Reason for the credit (e.g. shipping issue, address problem)..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setCancelDialogOpen(false);
                  setCancellingRequestId(null);
                  setCancellingRequest(null);
                  setCancelCreditAmount("");
                  setCancelCreditReason("");
                }}
              >
                No, Keep It
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmCancel}
                disabled={cancelShipmentMutation.isPending || (
                  cancellingRequest?.status === "paid" && 
                  (!cancelCreditAmount || !cancelCreditReason.trim())
                )}
                className={cancellingRequest?.status === "paid"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-white"}
              >
                {cancelShipmentMutation.isPending ? "Cancelling..." : "Yes, Cancel Shipment"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Confirm Payment Dialog */}
        <AlertDialog
          open={confirmPaymentDialogOpen}
          onOpenChange={setConfirmPaymentDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Payment?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to confirm payment for Shipment #
                {paymentRequestForConfirmation?.shipment_personal_id}? This will
                mark the shipping quote as paid and notify the customer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isConfirmingPayment}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmPaymentAction}
                disabled={isConfirmingPayment}
                className="bg-green-600 hover:bg-green-700"
              >
                {isConfirmingPayment ? "Confirming..." : "Confirm Payment"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Mark as Sent Confirmation Dialog */}
        <AlertDialog
          open={markAsSentDialogOpen}
          onOpenChange={setMarkAsSentDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark Shipment as Sent?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark Shipment #
                {requestForMarkAsSent?.shipment_personal_id} as sent? You will
                be able to add tracking information in the next step.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmMarkAsSent}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  },
);
