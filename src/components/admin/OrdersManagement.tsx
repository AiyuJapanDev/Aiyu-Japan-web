import { useEffect, useState } from 'react';
import { Plus, Truck, DollarSign, Package, CheckCircle, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Order, ProductRequest } from '@/types/orders';

interface OrderWithDetails extends Order {
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
  profiles?: {
    full_name?: string;
    email?: string;
    user_personal_id?: string;
  };
  order_items?: {
    product_request_id: string;
  }[];
}

export function OrdersManagement() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [availableProducts, setAvailableProducts] = useState<ProductRequest[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shippingPrice, setShippingPrice] = useState('');
  const [shippingInvoiceUrl, setShippingInvoiceUrl] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false);
  const [paidShippingQuotes, setPaidShippingQuotes] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_request_id
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch user profiles separately
      const userIds = [...new Set(ordersData?.map(o => o.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_personal_id')
        .in('id', userIds);

      // Combine the data
      const ordersWithProfiles = ordersData?.map(order => ({
        ...order,
        profiles: profilesData?.find(p => p.id === order.user_id)
      })) || [];

      setOrders(ordersWithProfiles as any);
      
      // Fetch paid shipping quotes
      const { data: paidQuotes } = await supabase
        .from('quotes')
        .select('order_id')
        .eq('type', 'shipping')
        .eq('status', 'paid');
      
      const paidOrderIds = new Set(paidQuotes?.map(q => q.order_id) || []);
      setPaidShippingQuotes(paidOrderIds);

      // Fetch available products (received but not in any order)
      const { data: productsData, error: productsError } = await supabase
        .from('product_requests')
        .select('*')
        .eq('status', 'received');

      if (productsError) throw productsError;

      // Filter out products already in orders
      const usedProductIds = new Set(
        ordersData?.flatMap(order => 
          order.order_items?.map((item: any) => item.product_request_id) || []
        ) || []
      );

      const availableProducts = productsData?.filter(
        product => !usedProductIds.has(product.id)
      ) || [];

      setAvailableProducts(availableProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    if (selectedProducts.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one product',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      // Get user_id from first selected product
      const { data: productData } = await supabase
        .from('product_requests')
        .select('user_id')
        .eq('id', selectedProducts[0])
        .single();

      if (!productData) throw new Error('Product not found');

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: productData.user_id,
          status: 'preparing',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add products to order
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(
          selectedProducts.map(productId => ({
            order_id: orderData.id,
            product_request_id: productId,
          }))
        );

      if (itemsError) throw itemsError;

      toast({
        title: 'Order Created',
        description: 'Order has been created successfully',
      });

      setSelectedProducts([]);
      fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create order',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const createShippingQuote = async () => {
    if (!selectedOrder || !shippingPrice || !shippingInvoiceUrl) return;

    try {
      const { error: quoteError } = await supabase.from('quotes').insert({
        type: 'shipping',
        order_id: selectedOrder.id,
        price_jpy: parseFloat(shippingPrice),
        status: 'sent',
        quote_url: shippingInvoiceUrl,
      });

      if (quoteError) throw quoteError;

      // Update order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'awaiting_shipping_payment' })
        .eq('id', selectedOrder.id);

      if (updateError) throw updateError;

      toast({
        title: 'Shipping Quote Created',
        description: 'Shipping quote has been sent to the customer',
      });

      // Reset state and close dialog
      setSelectedOrder(null);
      setShippingPrice('');
      setShippingInvoiceUrl('');
      setIsQuoteDialogOpen(false);
      await fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create shipping quote',
        variant: 'destructive',
      });
    }
  };

  const confirmShippingPayment = async (orderId: string) => {
    try {
      // Find the shipping quote for this order
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('order_id', orderId)
        .eq('type', 'shipping')
        .eq('status', 'sent')
        .single();

      if (quoteError || !quote) {
        toast({
          title: 'Error',
          description: 'No pending shipping quote found',
          variant: 'destructive',
        });
        return;
      }

      // Update quote status to paid
      const { error: updateQuoteError } = await supabase
        .from('quotes')
        .update({ status: 'paid' })
        .eq('id', quote.id);

      if (updateQuoteError) throw updateQuoteError;

      // The order remains in awaiting_shipping_payment status until actually shipped
      
      toast({
        title: 'Payment Confirmed',
        description: 'Shipping payment has been confirmed. You can now mark the order as shipped.',
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to confirm payment',
        variant: 'destructive',
      });
    }
  };

  const markAsShipped = async (orderId: string) => {
    if (!trackingNumber) {
      toast({
        title: 'Error',
        description: 'Please enter a tracking number',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'shipped',
          tracking_number: trackingNumber,
          shipped_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Order Shipped',
        description: 'Order has been marked as shipped',
      });

      setTrackingNumber('');
      setIsShippingDialogOpen(false);
      await fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Create Order */}
      {availableProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Create Order</CardTitle>
            <CardDescription>
              Group received products into a shipping order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Products</Label>
                {availableProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={product.id}
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts([...selectedProducts, product.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                        }
                      }}
                    />
                    <label
                      htmlFor={product.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {product.item_name || 'Unnamed Product'}
                    </label>
                  </div>
                ))}
              </div>
              <Button onClick={createOrder} disabled={isCreating}>
                <Plus className="h-4 w-4 mr-2" />
                {isCreating ? 'Creating...' : 'Create Order'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Manage shipping orders and tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
            <TableCell>
              <div>
                <p className="font-medium text-sm">#{order.order_personal_id || order.id.slice(0, 8)}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <p className="text-xs font-mono text-muted-foreground">UUID: {order.id.slice(0, 13)}...</p>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(order.id);
                      toast({ title: "UUID copied to clipboard" });
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {order.profiles?.full_name || 'Unknown'}
                        {order.profiles?.user_personal_id && (
                          <span className="text-xs text-muted-foreground ml-2">#{order.profiles.user_personal_id}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.profiles?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.order_items?.length || 0} items</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.tracking_number ? (
                      <span className="font-mono text-xs">{order.tracking_number}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {order.status === 'preparing' && (
                        <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsQuoteDialogOpen(true);
                              }}
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create Shipping Quote</DialogTitle>
                              <DialogDescription>
                                Enter the shipping price in JPY
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="shipping-price">Shipping Price (JPY)</Label>
                                <Input
                                  id="shipping-price"
                                  type="number"
                                  placeholder="Enter shipping price"
                                  value={shippingPrice}
                                  onChange={(e) => setShippingPrice(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="shipping-invoice-url">Invoice URL *</Label>
                                <Input
                                  id="shipping-invoice-url"
                                  type="url"
                                  placeholder="https://pay.example.com/invoice/..."
                                  value={shippingInvoiceUrl}
                                  onChange={(e) => setShippingInvoiceUrl(e.target.value)}
                                  required
                                />
                              </div>
                              <Button
                                onClick={createShippingQuote}
                                disabled={!shippingPrice || !shippingInvoiceUrl}
                                className="w-full"
                              >
                                Create Quote
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      {order.status === 'awaiting_shipping_payment' && !paidShippingQuotes.has(order.id) && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => confirmShippingPayment(order.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirm Payment
                        </Button>
                      )}
                      
                      {order.status === 'awaiting_shipping_payment' && paidShippingQuotes.has(order.id) && (
                        <Dialog open={isShippingDialogOpen} onOpenChange={setIsShippingDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setIsShippingDialogOpen(true)}
                            >
                              <Truck className="h-4 w-4" />
                              Confirm Shipped
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Mark as Shipped</DialogTitle>
                              <DialogDescription>
                                Enter tracking number to mark order as shipped
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="tracking">Tracking Number</Label>
                                <Input
                                  id="tracking"
                                  placeholder="Enter tracking number"
                                  value={trackingNumber}
                                  onChange={(e) => setTrackingNumber(e.target.value)}
                                />
                              </div>
                              <Button
                                onClick={() => markAsShipped(order.id)}
                                disabled={!trackingNumber}
                                className="w-full"
                              >
                                Mark as Shipped
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}