import React from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  AlertCircle,
  DollarSign,
  ShoppingCart,
  Home,
  Send
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext'; // ✅ for t()

export interface OrderWithDetails {
  id: string;
  user_id: string;
  status: string;
  tracking_number?: string;
  shipped_at?: string;
  created_at: string;
  updated_at: string;
  is_rejected?: boolean;
  rejection_reason?: string;
  is_resubmitted?: boolean;
  parent_order_id?: string;
  quotes?: Array<{
    id: string;
    type: string;
    price_jpy: number;
    status: string;
    quote_url: string;
    created_at: string;
  }>;
  order_items?: Array<{
    product_request: {
      id: string;
      product_url: string;
      item_name?: string;
      quantity?: number;
      notes?: string;
      status: string;
      has_issue?: boolean;
      issue_description?: string;
    };
  }>;
}

export const getOrderPhase = (order: OrderWithDetails): 'orders' | 'storage' | 'shipping' => {
  if (order.tracking_number || order.status === 'shipped') return 'shipping';
  const allProductsReceived = order.order_items?.every(
    item => item.product_request.status === 'received'
  ) ?? false;
  const hasShippingQuote = order.quotes?.some(q => q.type === 'shipping') ?? false;
  if (allProductsReceived || hasShippingQuote || order.status === 'awaiting_shipping_payment') {
    return 'storage';
  }
  return 'orders';
};

export const getOrderStatus = (order: OrderWithDetails): string => {
  if (order.is_rejected) return 'rejected';
  if (order.tracking_number) return 'shipped';

  const shippingQuote = order.quotes?.find(q => q.type === 'shipping');
  if (shippingQuote) return shippingQuote.status === 'paid' ? 'shipping_paid' : 'shipping_quoted';

  const productStatuses = order.order_items?.map(item => item.product_request.status) ?? [];
  if (productStatuses.every(s => s === 'received')) return 'received';
  if (productStatuses.some(s => s === 'purchased')) return 'purchased';

  const productQuote = order.quotes?.find(q => q.type === 'product');
  if (productQuote) return productQuote.status === 'paid' ? 'paid' : 'quoted';

  return 'requested';
};

/** ✅ Use inside a component so we can access t() */
export const useOrderStatusLabel = () => {
  const { t } = useApp();
  return (status: string): string => {
    const labels: Record<string, string> = {
      requested: t('statusRequested'),
      quoted: t('statusAwaitingPayment'),
      paid: t('statusPaid'),
      some_purchased: t('statusSomePurchased'),
      all_purchased: t('statusAllPurchased'),
      in_transit: t('statusInTransit'),
      all_received: t('statusAllAtWarehouse'),
      purchased: t('statusAllPurchased'),
      received: t('statusAllAtWarehouse'),
      shipping_quoted: t('shippingQuoteSent'),
      shipping_paid: t('shippingPaid'),
      shipped: t('statusShipped'),
      rejected: t('statusRejected'),
    };
    return labels[status] || status;
  };
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    requested: 'bg-blue-100 text-blue-800',
    quoted: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    some_purchased: 'bg-purple-100 text-purple-800',
    all_purchased: 'bg-green-100 text-green-800',
    in_transit: 'bg-blue-100 text-blue-800',
    all_received: 'bg-indigo-100 text-indigo-800',
    purchased: 'bg-purple-100 text-purple-800',
    received: 'bg-indigo-100 text-indigo-800',
    shipping_quoted: 'bg-orange-100 text-orange-800',
    shipping_paid: 'bg-teal-100 text-teal-800',
    shipped: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusIcon = (status: string) => {
  const icons: Record<string, React.ReactElement> = {
    requested: <Clock className="h-4 w-4 text-blue-600" />,
    quoted: <DollarSign className="h-4 w-4 text-yellow-600" />,
    paid: <CheckCircle className="h-4 w-4 text-green-600" />,
    some_purchased: <ShoppingCart className="h-4 w-4 text-purple-600" />,
    all_purchased: <ShoppingCart className="h-4 w-4 text-green-600" />,
    in_transit: <Truck className="h-4 w-4 text-blue-600" />,
    all_received: <Home className="h-4 w-4 text-indigo-600" />,
    purchased: <ShoppingCart className="h-4 w-4 text-purple-600" />,
    received: <Home className="h-4 w-4 text-indigo-600" />,
    shipping_quoted: <Send className="h-4 w-4 text-orange-600" />,
    shipping_paid: <CheckCircle className="h-4 w-4 text-teal-600" />,
    shipped: <Truck className="h-4 w-4 text-gray-600" />,
    rejected: <XCircle className="h-4 w-4 text-red-600" />,
  };
  return icons[status] || <Package className="h-4 w-4 text-gray-600" />;
};

/** ✅ Product status steps translated */
export const useProductStatusSteps = () => {
  const { t } = useApp();
  return [
    { label: t('statusRequested'), status: 'upcoming' as const },
    { label: t('statusPaid'), status: 'upcoming' as const },
    { label: t('statusAllPurchased'), status: 'upcoming' as const },
    { label: t('statusInTransit'), status: 'upcoming' as const },
    { label: t('statusAllAtWarehouse'), status: 'upcoming' as const },
  ];
};

/** ✅ Shipping status steps translated */
export const useShippingStatusSteps = () => {
  const { t } = useApp();
  return [
    { label: t('statusAllAtWarehouse'), status: 'completed' as const },
    { label: t('shippingQuoteSent'), status: 'upcoming' as const },
    { label: t('shippingPaid'), status: 'upcoming' as const },
    { label: t('statusShipped'), status: 'upcoming' as const },
    { label: t('statusDelivered'), status: 'upcoming' as const },
  ];
};

export const updateStatusSteps = (steps: any[], currentStatus: string) => {
  const statusMap: Record<string, number> = {
    requested: 0,
    quoted: 1,
    paid: 1,
    purchased: 2,
    received: 3,
    shipping_quoted: 1,
    shipping_paid: 2,
    shipped: 3,
  };

  const currentIndex = statusMap[currentStatus] ?? -1;

  return steps.map((step, index) => ({
    ...step,
    status:
      index < currentIndex
        ? 'completed'
        : index === currentIndex
        ? 'current'
        : 'upcoming',
  }));
};
