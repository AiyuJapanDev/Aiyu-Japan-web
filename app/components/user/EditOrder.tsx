import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Flag, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { ProductRequest, Order } from '@/types/orders';
import { notifyAllAdmins } from '@/lib/notificationUtils';
import { useApp } from '@/contexts/AppContext'; // ✅ for t()

interface OrderWithDetails extends Order {
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
  order_items: Array<{
    id: string;
    product_request: ProductRequest & {
      has_purchase_issue?: boolean;
      purchase_issue_description?: string | null;
    };
  }>;
}

interface EditableProduct {
  id: string;
  product_url: string;
  item_name?: string;
  quantity: number;
  notes?: string;
  has_purchase_issue?: boolean;
  purchase_issue_description?: string | null;
  isNew?: boolean;
  toDelete?: boolean;
}

export function EditOrder() {
  const { t } = useApp(); // ✅ access translations
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [products, setProducts] = useState<EditableProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_request:product_requests (*)
          )
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .eq('is_rejected', true)
        .single();

      if (orderError || !orderData) {
        toast({
          title: t('error'),
          description: t('orderNotFound'),
          variant: 'destructive',
        });
        navigate('/user-dashboard');
        return;
      }

      setOrder(orderData as any);

      const editableProducts = orderData.order_items.map((item) => ({
        id: item.product_request.id,
        product_url: item.product_request.product_url,
        item_name: item.product_request.item_name,
        quantity: item.product_request.quantity || 1,
        notes: item.product_request.notes,
        has_purchase_issue: item.product_request.has_purchase_issue,
        purchase_issue_description: item.product_request.purchase_issue_description,
        isNew: false,
        toDelete: false,
      }));

      setProducts(editableProducts);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: t('error'),
        description: t('loadingOrderDetails'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (index: number, field: keyof EditableProduct, value: any) => {
    const updatedProducts = [...products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setProducts(updatedProducts);
  };

  const addNewProduct = () => {
    setProducts([
      ...products,
      { id: `new-${Date.now()}`, product_url: '', item_name: '', quantity: 1, notes: '', isNew: true, toDelete: false },
    ]);
  };

  const toggleDeleteProduct = (index: number) => {
    const updatedProducts = [...products];
    updatedProducts[index].toDelete = !updatedProducts[index].toDelete;
    setProducts(updatedProducts);
  };

  const handleResubmit = async () => {
    const activeProducts = products.filter((p) => !p.toDelete);
    if (activeProducts.length === 0) {
      toast({ title: t('error'), description: t('atLeastOneProductError'), variant: 'destructive' });
      return;
    }

    for (const product of activeProducts) {
      if (!product.product_url) {
        toast({ title: t('error'), description: t('allProductsUrlError'), variant: 'destructive' });
        return;
      }
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, user_personal_id')
        .eq('id', user.id)
        .single();

      const customerName = profile?.full_name || 'Unknown User';
      const customerId = profile?.user_personal_id ? `#${profile.user_personal_id}` : '';

      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'preparing',
          is_resubmitted: true,
          parent_order_id: orderId,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      await notifyAllAdmins(
        'order_resubmitted',
        `Order resubmitted by ${customerName} ${customerId}.`,
        newOrder.id
      );

      for (const product of activeProducts) {
        const { data: newProduct } = await supabase
          .from('product_requests')
          .insert({
            user_id: user.id,
            product_url: product.product_url,
            item_name: product.item_name,
            quantity: product.quantity,
            notes: product.notes,
            status: 'requested',
          })
          .select()
          .single();

        await supabase.from('order_items').insert({
          order_id: newOrder.id,
          product_request_id: newProduct.id,
        });
      }

      toast({ title: t('success'), description: t('orderResubmittedSuccess') });
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Error resubmitting order:', error);
      toast({ title: t('error'), description: t('orderResubmitError'), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">{t('loadingOrderDetails')}</div>;
  if (!order) return <div className="text-center py-8">{t('orderNotFound')}</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/user-dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t('editRejectedOrder')}</h1>
          <p className="text-muted-foreground">
            {t('orderNumber')} {order.order_personal_id}
          </p>
        </div>
      </div>

      {order.rejection_reason && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              {t('orderRejectionReasonTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{order.rejection_reason}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('productsInOrder')}</CardTitle>
          <CardDescription>{t('editOrderDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {products.map((product, index) => (
            <Card
              key={product.id}
              className={`p-4 ${product.toDelete ? 'opacity-50' : ''} ${
                product.has_purchase_issue ? 'border-yellow-500' : ''
              }`}
            >
              <div className="space-y-4">
                {product.has_purchase_issue && product.purchase_issue_description && (
                  <div className="p-3 bg-yellow-50 rounded-lg flex items-start gap-2">
                    <Flag className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">{t('productIssue')}</p>
                      <p className="text-sm text-yellow-700">{product.purchase_issue_description}</p>
                    </div>
                  </div>
                )}

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor={`url-${index}`}>Product URL *</Label>
                    <Input
                      id={`url-${index}`}
                      value={product.product_url}
                      onChange={(e) => handleProductChange(index, 'product_url', e.target.value)}
                      placeholder="https://example.com/product"
                      disabled={product.toDelete}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${index}`}>{t('productName')}</Label>
                      <Input
                        id={`name-${index}`}
                        value={product.item_name || ''}
                        onChange={(e) => handleProductChange(index, 'item_name', e.target.value)}
                        placeholder={t('productNamePlaceholder')}
                        disabled={product.toDelete}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`quantity-${index}`}>{t('quantity')}</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          handleProductChange(index, 'quantity', parseInt(e.target.value) || 1)
                        }
                        disabled={product.toDelete}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`notes-${index}`}>{t('productNotes')}</Label>
                    <Textarea
                      id={`notes-${index}`}
                      value={product.notes || ''}
                      onChange={(e) => handleProductChange(index, 'notes', e.target.value)}
                      placeholder={t('productNotesPlaceholder')}
                      disabled={product.toDelete}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {product.isNew && <Badge variant="secondary">{t('newProductBadge')}</Badge>}
                    {product.toDelete && <Badge variant="destructive">{t('willBeRemoved')}</Badge>}
                  </div>
                  <Button
                    variant={product.toDelete ? 'default' : 'destructive'}
                    size="sm"
                    onClick={() => toggleDeleteProduct(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {product.toDelete ? t('restore') : t('remove')}
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          <Button variant="outline" onClick={addNewProduct} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {t('addNewProduct')}
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={() => navigate('/user-dashboard')} disabled={submitting}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleResubmit}
          disabled={submitting || products.filter((p) => !p.toDelete).length === 0}
        >
          <Save className="h-4 w-4 mr-2" />
          {submitting ? t('resubmitting') : t('resubmitOrder')}
        </Button>
      </div>
    </div>
  );
}
