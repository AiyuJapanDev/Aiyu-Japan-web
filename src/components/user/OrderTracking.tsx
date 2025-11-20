import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, AlertCircle, DollarSign, CreditCard, Check, Ship, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { StatusFlow } from '@/components/ui/status-flow';
import { supabase } from '@/integrations/supabase/client';
import type { ProductRequest, Order, Quote } from '@/types/orders';

interface OrderWithItems {
  order: Order & {
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
  };
  items: ProductRequest[];
  quotes?: Quote[];
}

const ITEMS_PER_PAGE = 5;

export function OrderTracking() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openOrders, setOpenOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First get total count for pagination
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (count) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }

      // Fetch paginated orders with items
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_request_id
          ),
          quotes (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (ordersError) throw ordersError;

      // Get all product request IDs from the orders
      const allProductRequestIds = new Set<string>();
      (ordersData || []).forEach(order => {
        order.order_items.forEach((item: any) => {
          allProductRequestIds.add(item.product_request_id);
        });
      });

      // Fetch all product requests in one query
      const { data: allRequests, error: requestsError } = await supabase
        .from('product_requests')
        .select('*')
        .in('id', Array.from(allProductRequestIds));

      if (requestsError) throw requestsError;

      // Create a map for quick lookup
      const requestsMap = new Map<string, ProductRequest>();
      (allRequests || []).forEach(request => {
        requestsMap.set(request.id, request);
      });

      // Map orders with their items and quotes
      const ordersWithItems = (ordersData || []).map(order => {
        const items = order.order_items
          .map((item: any) => requestsMap.get(item.product_request_id))
          .filter(Boolean) as ProductRequest[];
        
        return { order, items, quotes: order.quotes };
      });

      setOrders(ordersWithItems as any);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId: string) => {
    setOpenOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getOrderStatus = (order: OrderWithItems['order'], items: ProductRequest[]) => {
    if (order.is_rejected) return 'Rejected';
    if (order.status === 'shipped') return 'Shipped';
    
    // Check product statuses for more accurate status
    const productStatuses = items.map(item => item.status);
    const allSameStatus = productStatuses.every(status => status === productStatuses[0]);
    
    if (allSameStatus && productStatuses[0]) {
      switch (productStatuses[0]) {
        case 'shipping_paid':
          return 'Ready to Ship';
        case 'shipping_quoted':
          return 'Awaiting Shipping Payment';
        case 'received':
          return 'Weighing';
        case 'purchased':
          return 'Purchased';
        case 'paid':
          return 'Paid';
        case 'quoted':
          return 'Quoted';
        case 'requested':
          return 'New';
      }
    }
    
    return 'In Progress';
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'Quoted':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Paid':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Purchased':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'Weighing':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'Awaiting Shipping Payment':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Ready to Ship':
        return 'bg-teal-500/10 text-teal-600 border-teal-500/20';
      case 'Shipped':
        return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusSteps = (order: OrderWithItems['order'], items: ProductRequest[], quotes?: Quote[]) => {
    const steps = [
      { key: 'requested', label: 'REQUESTED', icon: <Clock className="w-4 h-4" /> },
      { key: 'quoted', label: 'QUOTED', icon: <DollarSign className="w-4 h-4" /> },
      { key: 'paid', label: 'PAID', icon: <CreditCard className="w-4 h-4" /> },
      { key: 'purchased', label: 'PURCHASED', icon: <Package className="w-4 h-4" /> },
      { key: 'received', label: 'RECEIVED', icon: <Check className="w-4 h-4" /> },
      { key: 'shipping_quoted', label: 'SHIPPING QUOTED', icon: <Ship className="w-4 h-4" /> },
      { key: 'shipping_paid', label: 'SHIPPING PAID', icon: <CreditCard className="w-4 h-4" /> },
      { key: 'shipped', label: 'SHIPPED', icon: <Truck className="w-4 h-4" /> },
    ];

    if (order.is_rejected) {
      return [
        { key: 'requested', label: 'REQUESTED', icon: <Clock className="w-4 h-4" />, status: 'completed' as const },
        { key: 'rejected', label: 'REJECTED', icon: <X className="w-4 h-4" />, status: 'rejected' as const }
      ];
    }

    // Determine current step based on product statuses and order status
    let currentStepIndex = 0;
    
    const productStatuses = items.map(item => item.status);
    const allSameStatus = productStatuses.every(status => status === productStatuses[0]);
    
    if (allSameStatus && productStatuses[0]) {
      const statusMap: Record<string, number> = {
        'requested': 0,
        'quoted': 1,
        'paid': 2,
        'purchased': 3,
        'received': 4,
        'shipping_quoted': 5,
        'shipping_paid': 6,
        'shipped': 7
      };
      currentStepIndex = statusMap[productStatuses[0]] || 0;
    }
    
    if (order.status === 'shipped') {
      currentStepIndex = 7;
    }

    return steps.map((step, index) => ({
      ...step,
      status: (index < currentStepIndex ? 'completed' : index === currentStepIndex ? 'current' : 'upcoming') as 'completed' | 'current' | 'upcoming' | 'rejected'
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested':
        return <Clock className="h-4 w-4" />;
      case 'quoted':
        return <DollarSign className="h-4 w-4" />;
      case 'paid':
        return <CreditCard className="h-4 w-4" />;
      case 'purchased':
        return <Package className="h-4 w-4" />;
      case 'received':
        return <Check className="h-4 w-4" />;
      case 'shipping_quoted':
        return <Ship className="h-4 w-4" />;
      case 'shipping_paid':
        return <CreditCard className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'quoted':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'paid':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'purchased':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'received':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'shipping_quoted':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'shipping_paid':
        return 'bg-teal-500/10 text-teal-600 border-teal-500/20';
      case 'shipped':
        return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
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

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>
            Track all your product orders and shipping status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No orders yet. Submit product requests to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>
            Track all your product orders and shipping status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orders.map(({ order, items, quotes }) => {
            const isOpen = openOrders.has(order.id);
            const orderStatus = getOrderStatus(order, items);
            
            return (
              <Collapsible
                key={order.id}
                open={isOpen}
                onOpenChange={() => toggleOrder(order.id)}
              >
                <Card className="border">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full p-0 h-auto hover:bg-transparent"
                    >
                      <div className="w-full p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="flex items-center gap-2">
                              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </div>
                            <div className="text-left">
                              <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {items.length} item{items.length !== 1 ? 's' : ''} • {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <Badge className={`${getOrderStatusColor(orderStatus)} text-xs`}>
                            {orderStatus}
                          </Badge>
                        </div>
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t pt-3">
                      {/* Status Flow */}
                      <div className="mb-4">
                        <StatusFlow steps={getStatusSteps(order, items, quotes)} />
                      </div>

                      {/* Rejection Reason if rejected */}
                      {order.is_rejected && order.rejection_reason && (
                        <div className="mb-4 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-700">
                            <strong>Rejection Reason:</strong> {order.rejection_reason}
                          </p>
                        </div>
                      )}

                      {/* Tracking Info */}
                      {order.tracking_number && (
                        <div className="mb-4 bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Tracking Number</p>
                          <p className="font-mono text-sm">{order.tracking_number}</p>
                        </div>
                      )}

                      {order.shipped_at && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Truck className="h-4 w-4" />
                          <span>Shipped on {new Date(order.shipped_at).toLocaleDateString()}</span>
                        </div>
                      )}

                      {/* Quote Information */}
                      {quotes && quotes.length > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">Quote Information</p>
                          {quotes.map((quote) => (
                            <div key={quote.id} className="mt-2 text-sm text-blue-700">
                              <p>
                                {quote.type === 'product' ? 'Product' : 'Shipping'} Quote: ¥{quote.price_jpy}
                              </p>
                              <p>Status: {quote.status}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Products */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Products in this order:</h4>
                        {order.rejection_details ? (
                          // Rejected orders: render from rejection_details snapshot
                          order.rejection_details.product_issues?.map((issue: any, index: number) => (
                            <div key={issue.product_id} className="flex items-start justify-between p-3 bg-secondary/30 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {index + 1}) {issue.item_name || 'Unnamed Product'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate max-w-md">
                                  {issue.product_url}
                                </p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    Qty: {issue.quantity || 1}
                                  </span>
                                </div>
                                {issue.has_issue && issue.issue_description && (
                                  <div className="flex items-center gap-1 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                                    <AlertCircle className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                                    <span className="text-xs text-yellow-700">
                                      Issue: {issue.issue_description}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          // Active orders: render from fetched items
                          items.map((item, index: number) => (
                            <div key={item.id} className="flex items-start justify-between p-3 bg-secondary/30 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {index + 1}) {item.item_name || 'Unnamed Product'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate max-w-md">
                                  {item.product_url}
                                </p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    Qty: {item.quantity}
                                  </span>
                                  {item.notes && (
                                    <span className="text-xs text-muted-foreground">
                                      Note: {item.notes}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-3">
                                {getStatusIcon(item.status)}
                                <Badge className={`${getStatusColor(item.status)} text-xs`}>
                                  {item.status.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
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