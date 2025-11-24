import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, AlertCircle, User, Calendar, RefreshCw, DollarSign, ShoppingCart, Home, PackageCheck, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusFlow } from '@/components/ui/status-flow';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ProductRequest, Order } from '@/types/orders';
import type { Database } from '@/integrations/supabase/types';
import { useApp } from '@/contexts/AppContext';

type OrderStatus = Database['public']['Enums']['order_status'];
type ProductRequestStatus = Database['public']['Enums']['product_request_status'];

interface OrderWithItems {
  order: Order & {
    order_personal_id?: string;
    profiles?: {
      full_name: string | null;
      email: string | null;
      user_personal_id?: string | null;
    } | null;
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
}

export function OrdersOverview() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openOrders, setOpenOrders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [hideRejected, setHideRejected] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { t } = useApp();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filterStatus, searchTerm, hideRejected, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, itemsPerPage, hideRejected]);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Build query for orders with optional filters
      let ordersQuery = supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_request_id
          )
        `, { count: 'exact' });

      // Apply hide rejected filter
      if (hideRejected) {
        ordersQuery = ordersQuery.eq('is_rejected', false);
      }

      // Apply status filter
      if (filterStatus !== 'all') {
        ordersQuery = ordersQuery.eq('status', filterStatus as OrderStatus);
      }

      // Apply search filter (search by order ID or user email)
      if (searchTerm) {
        ordersQuery = ordersQuery.or(`id.ilike.%${searchTerm}%`);
      }

      // Get total count for pagination
      const { count } = await ordersQuery;
      
      if (count) {
        setTotalPages(Math.ceil(count / itemsPerPage));
      }

      // Fetch paginated orders with items
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data: ordersData, error: ordersError } = await ordersQuery
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

      // Map orders with their items and fetch user profiles separately
      const ordersWithItems = await Promise.all((ordersData || []).map(async (order) => {
        // Fetch profile for this order's user
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email, user_personal_id')
          .eq('id', order.user_id)
          .single();

        let items: ProductRequest[];
        
        console.log('Order:', order.id, 'is_rejected:', order.is_rejected, 'has rejection_details:', !!order.rejection_details);
        
        // For rejected orders, use rejection_details snapshot
        if (order.is_rejected && order.rejection_details && typeof order.rejection_details === 'object') {
          const rejectionDetails = order.rejection_details as any;
          console.log('Processing rejected order:', order.id, 'product_issues:', rejectionDetails.product_issues);
          
          if (rejectionDetails.product_issues && Array.isArray(rejectionDetails.product_issues)) {
            items = rejectionDetails.product_issues.map((issue: any) => ({
              id: issue.product_id,
              user_id: order.user_id,
              product_url: issue.product_url,
              item_name: issue.item_name,
              quantity: issue.quantity || 1,
              status: 'rejected' as ProductRequestStatus,
              has_purchase_issue: issue.has_issue,
              purchase_issue_description: issue.issue_description,
              created_at: order.created_at,
              updated_at: order.updated_at,
            })) as ProductRequest[];
            console.log('Constructed items from rejection_details:', items);
          } else {
            console.warn('No product_issues found in rejection_details');
            items = [];
          }
        } else {
          // For active orders, use fetched product_requests
          items = order.order_items
            .map((item: any) => requestsMap.get(item.product_request_id))
            .filter(Boolean) as ProductRequest[];
          console.log('Active order items:', items);
        }
        
        return { 
          order: {
            ...order,
            profiles: profileData || null
          }, 
          items 
        };
      }));

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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus as OrderStatus,
          updated_at: new Date().toISOString(),
          ...(newStatus === 'shipped' ? { shipped_at: new Date().toISOString() } : {})
        })
        .eq('id', orderId);

      if (error) throw error;

      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateProductStatus = async (productId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('product_requests')
        .update({ 
          status: newStatus as ProductRequestStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;

      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'requested':
        return <Clock className="h-4 w-4" />;
      case 'purchased':
      case 'received':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
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

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'weighing':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'awaiting_shipping_payment':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'shipped':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getPurchaseProgress = (items: ProductRequest[]) => {
    const statuses = items.map(item => item.status);
    const purchasedCount = statuses.filter(s => s === 'purchased').length;
    const receivedCount = statuses.filter(s => s === 'received').length;
    const totalCount = statuses.length;
    
    return {
      somePurchased: purchasedCount > 0 && purchasedCount < totalCount && receivedCount === 0,
      allPurchased: purchasedCount === totalCount && totalCount > 0 && receivedCount === 0,
      someReceived: receivedCount > 0 && receivedCount < totalCount,
      allReceived: receivedCount === totalCount && totalCount > 0,
      purchasedCount,
      receivedCount,
      totalCount
    };
  };

  const getOrderStatus = (order: any): string => {
    if (order.is_rejected) return 'rejected';

    const productStatuses = order.items?.map((item: any) => item.status) ?? [];
    const progress = getPurchaseProgress(order.items || []);

    if (progress.allReceived) {
      return 'all_received';
    }

    if (progress.allPurchased || (progress.purchasedCount > 0 && progress.receivedCount > 0)) {
      return 'in_transit';
    }

    if (progress.somePurchased) return 'some_purchased';

    // Check for quotes - need to query separately or get from order data
    return 'requested';
  };

  const getStatusSteps = (status: string, items: ProductRequest[]) => {
    type StepStatus = 'completed' | 'current' | 'rejected' | 'upcoming';
    const progress = getPurchaseProgress(items);

    const purchaseLabel = progress.allPurchased || status === 'in_transit' || status === 'all_received'
      ? 'Item(s) Purchased'
      : 'Item(s) being purchased';

    const steps = [
      { label: 'Request Submitted', status: 'upcoming' as StepStatus, icon: <Clock className="h-4 w-4" /> },
      { label: 'Awaiting Payment', status: 'upcoming' as StepStatus, icon: <DollarSign className="h-4 w-4" /> },
      { label: 'Payment Received', status: 'upcoming' as StepStatus, icon: <CheckCircle className="h-4 w-4" /> },
      { label: purchaseLabel, status: 'upcoming' as StepStatus, icon: <ShoppingCart className="h-4 w-4" /> },
      { label: 'Item(s) on the way to warehouse', status: 'upcoming' as StepStatus, icon: <Truck className="h-4 w-4" /> },
      { label: 'All Items at Warehouse', status: 'upcoming' as StepStatus, icon: <Home className="h-4 w-4" /> }
    ];

    const statusMap: Record<string, number> = {
      'requested': 0,
      'quoted': 1,
      'paid': 3,
      'some_purchased': 3,
      'all_purchased': 3,
      'in_transit': 4,
      'received': 5,
      'all_received': 5
    };

    const currentIndex = statusMap[status] ?? -1;
    if (status === 'rejected') {
      return steps.map((step, index) => ({
        ...step,
        status: (index === currentIndex ? 'rejected' : 'upcoming') as StepStatus
      }));
    }

    return steps.map((step, index) => {
      if (status === 'all_received' || status === 'received') {
        if (index <= 5) return { ...step, status: 'completed' as StepStatus };
      }
      
      if (index < currentIndex) return { ...step, status: 'completed' as StepStatus };
      if (index === currentIndex) return { ...step, status: 'current' as StepStatus };
      
      if (status === 'in_transit' && index === 3) return { ...step, status: 'completed' as StepStatus };
      
      return { ...step, status: 'upcoming' as StepStatus };
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
      toast.success('Orders updated successfully');
    } catch (error) {
      toast.error('Failed to refresh orders');
    } finally {
      setRefreshing(false);
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

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Manage all customer orders and their product requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters and Controls */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <Input
                    placeholder="Search by order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-[200px]"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="requested">Requested</SelectItem>
                        <SelectItem value="quoted">Awaiting Payment</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="some_purchased">Some Purchased</SelectItem>
                        <SelectItem value="all_purchased">All Purchased</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="all_received">All at Warehouse</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                      {refreshing ? 'Refreshing...' : 'Update'}
                    </Button>
                    <Checkbox 
                      id="hide-rejected-admin" 
                      checked={hideRejected}
                      onCheckedChange={(checked) => setHideRejected(checked === true)}
                    />
                    <label 
                      htmlFor="hide-rejected-admin" 
                      className="text-sm font-medium cursor-pointer"
                    >
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

              {orders.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, orders.length)} of {orders.length} orders
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders List */}
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No orders found matching your criteria.
            </p>
           ) : (
            orders.map(({ order, items }) => {
              const isOpen = openOrders.has(order.id);
              const orderStatus = getOrderStatus({ ...order, items });
              const statusSteps = getStatusSteps(orderStatus, items);
              
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
                                <div>
                                  <p className="font-medium">Order #{order.order_personal_id || order.id.slice(0, 8)}</p>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <p className="text-xs font-mono text-muted-foreground">
                                      UUID: {order.id.slice(0, 13)}...
                                    </p>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-4 w-4 p-0" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(order.id);
                                        toast("UUID copied to clipboard");
                                      }}
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <User className="h-3 w-3" />
                                  <span>
                                    {order.profiles?.full_name || order.profiles?.email || 'Unknown User'}
                                    {order.profiles?.user_personal_id && ` #${order.profiles.user_personal_id}`}
                                  </span>
                                  <Calendar className="h-3 w-3 ml-2" />
                                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {items.length} item{items.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {order.is_rejected && (
                                <Badge className="bg-red-100 text-red-800 border-red-300">
                                  Rejected
                                </Badge>
                              )}
                              <Badge className={getOrderStatusColor(order.status)}>
                                {order.status.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-3">
                        {/* Status Flow */}
                        <div className="mt-4">
                          <StatusFlow steps={statusSteps} />
                        </div>

                        {/* Rejection Details */}
                        {order.is_rejected && order.rejection_details && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
                        {/* Order Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Select 
                            value={order.status} 
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="weighing">Weighing</SelectItem>
                              <SelectItem value="awaiting_shipping_payment">Awaiting Shipping Payment</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          {order.tracking_number && (
                            <div className="bg-muted/50 rounded-lg p-2 flex-1">
                              <p className="text-xs text-muted-foreground">Tracking: {order.tracking_number}</p>
                            </div>
                          )}
                        </div>

                        {order.shipped_at && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Truck className="h-4 w-4" />
                            <span>Shipped on {new Date(order.shipped_at).toLocaleDateString()}</span>
                          </div>
                        )}

                        <div className="border-t pt-3">
                          <p className="text-sm font-medium mb-3">Items in this order:</p>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-start justify-between p-3 bg-secondary/30 rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {item.item_name || 'Unnamed Product'}
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
                                  {item.has_purchase_issue && item.purchase_issue_description && (
                                    <div className="flex items-center gap-1 mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                                      <AlertCircle className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                                      <span className="text-xs text-yellow-700">
                                        Issue: {item.purchase_issue_description}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {!order.is_rejected && (
                                  <div className="flex items-center gap-2 ml-3">
                                    <Badge className={getStatusColor(item.status)}>
                                      {getStatusIcon(item.status)}
                                      <span className="ml-1">{item.status.replace(/_/g, ' ')}</span>
                                    </Badge>
                                    <Select
                                      value={item.status}
                                      onValueChange={(value) => updateProductStatus(item.id, value)}
                                    >
                                      <SelectTrigger className="w-[140px] h-8 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="requested">Requested</SelectItem>
                                        <SelectItem value="quoted">Quoted</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="purchased">Purchased</SelectItem>
                                        <SelectItem value="received">Received</SelectItem>
                                        <SelectItem value="shipping_quoted">Shipping Quoted</SelectItem>
                                        <SelectItem value="shipping_paid">Shipping Paid</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })
          )}

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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
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