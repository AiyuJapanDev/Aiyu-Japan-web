import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Package, Truck, DollarSign, AlertCircle, Flag, Edit, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { StatusFlow } from '@/components/ui/status-flow';
import type { ProductRequest, Order, Quote } from '@/types/orders';
import { useNavigate } from 'react-router';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface OrderWithDetails extends Order {
  is_rejected?: boolean;
  rejection_reason?: string | null;
  order_personal_id?: string;
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
  quotes: Quote[];
  order_items: Array<{
    id: string;
    product_request: ProductRequest & {
      has_issue?: boolean;
      issue_description?: string | null;
    };
  }>;
}

export function QuotesView() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrders, setOpenOrders] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch orders with all related data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          quotes (*),
          order_items (
            id,
            product_request:product_requests (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      setOrders(ordersData || [] as any);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusSteps = (order: OrderWithDetails) => {
    const steps = [
      { key: 'requested', label: 'REQUESTED', icon: <Clock className="w-4 h-4" /> },
      { key: 'quoted', label: 'QUOTED', icon: <DollarSign className="w-4 h-4" /> },
      { key: 'paid', label: 'PAID', icon: <DollarSign className="w-4 h-4" /> },
      { key: 'purchased', label: 'PURCHASED', icon: <Package className="w-4 h-4" /> },
      { key: 'received', label: 'RECEIVED', icon: <Package className="w-4 h-4" /> },
      { key: 'shipped', label: 'SHIPPED', icon: <Truck className="w-4 h-4" /> },
    ];

    if (order.is_rejected) {
      return [
        { key: 'requested', label: 'REQUESTED', icon: <Clock className="w-4 h-4" />, status: 'completed' as const },
        { key: 'rejected', label: 'REJECTED', icon: <AlertCircle className="w-4 h-4" />, status: 'rejected' as const }
      ];
    }

    // Determine current step
    let currentStepIndex = 0;
    const hasQuote = order.quotes.some(q => q.status === 'sent' || q.status === 'pending');
    const isPaid = order.quotes.some(q => q.status === 'paid');
    
    if (order.status === 'shipped') {
      currentStepIndex = 5;
    } else if (isPaid) {
      currentStepIndex = 2;
    } else if (hasQuote) {
      currentStepIndex = 1;
    }

    return steps.map((step, index) => ({
      ...step,
      status: (index < currentStepIndex ? 'completed' : index === currentStepIndex ? 'current' : 'upcoming') as 'completed' | 'current' | 'upcoming' | 'rejected'
    }));
  };

  const handlePayment = (quoteUrl: string) => {
    window.open(quoteUrl, '_blank');
  };

  const handleEditOrder = (orderId: string) => {
    // Navigate to order editing (we'll create this page next)
    navigate(`/edit-order/${orderId}`);
  };

  const getOrderStatusLabel = (order: OrderWithDetails) => {
    if (order.is_rejected) return 'Rejected';
    if (order.status === 'shipped') return 'Shipped';
    if (order.quotes.some(q => q.status === 'paid')) return 'Paid';
    if (order.quotes.some(q => q.status === 'sent')) return 'Quote Sent';
    return 'Processing';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Rejected':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'Shipped':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Paid':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Quote Sent':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
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

  if (loading) {
    return <div className="text-center py-4">Loading your orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Orders</h2>
        <p className="text-muted-foreground">Track your orders and manage requests</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        orders.map((order) => {
          const statusLabel = getOrderStatusLabel(order);
          const hasPendingQuote = order.quotes.some(q => q.status === 'sent');
          const isOpen = openOrders.has(order.id);
          
          return (
            <Card key={order.id}>
              <Collapsible open={isOpen} onOpenChange={() => toggleOrder(order.id)}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle>Order #{order.order_personal_id || order.id.slice(0, 8)}</CardTitle>
                        <CardDescription>
                          Created on {new Date(order.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(statusLabel)}>
                        {statusLabel}
                      </Badge>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1">
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>
                </CardHeader>
                
                <CollapsibleContent>
                  <CardContent className="space-y-4">
                {/* Status Flow */}
                <StatusFlow steps={getOrderStatusSteps(order)} />

                {/* Rejection Information */}
                {order.is_rejected && order.rejection_reason && (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-900 mb-1">Order Rejected</p>
                    <p className="text-sm text-red-700">{order.rejection_reason}</p>
                    <Button 
                      onClick={() => handleEditOrder(order.id)}
                      className="mt-3"
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit and Resubmit Order
                    </Button>
                  </div>
                )}

                {/* Products */}
                <div>
                  <h4 className="font-medium mb-2">Products in this order:</h4>
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="p-3 bg-secondary/30 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">
                              {item.product_request.item_name || 'Product'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.product_request.quantity}
                            </p>
                            {item.product_request.product_url && (
                              <a 
                                href={item.product_request.product_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                              >
                                View Product
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {item.product_request.notes && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Notes: {item.product_request.notes}
                              </p>
                            )}
                          </div>
                          {item.product_request.has_issue && (
                            <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                              <Flag className="h-3 w-3 mr-1" />
                              Issue
                            </Badge>
                          )}
                        </div>
                        {item.product_request.issue_description && (
                          <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-700">
                            <strong>Issue:</strong> {item.product_request.issue_description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quote Information */}
                {order.quotes.length > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Quote Information</h4>
                    {order.quotes.map((quote) => (
                      <div key={quote.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-blue-700">
                              {quote.type === 'product' ? 'Product Quote' : 'Shipping Quote'}
                            </p>
                            <p className="text-sm text-blue-700">
                              Amount: ¥{quote.price_jpy.toLocaleString()}
                            </p>
                            <p className="text-sm text-blue-600">
                              Status: {quote.status === 'sent' ? 'Awaiting Payment' : quote.status}
                            </p>
                          </div>
                          {quote.status === 'sent' && (
                            <Button
                              onClick={() => handlePayment(quote.quote_url)}
                              size="sm"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tracking Information */}
                {order.tracking_number && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Tracking Information</p>
                    <p className="text-sm text-green-700">
                      Tracking Number: {order.tracking_number}
                    </p>
                    {order.shipped_at && (
                      <p className="text-sm text-green-600">
                        Shipped on: {new Date(order.shipped_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })
      )}
    </div>
  );
}