import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Truck, AlertCircle, Scale, Info, Globe, ArrowRight, Clock, ChevronDown, Link, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ShippingQuoteDialog from './ShippingQuoteDialog';
import {
  calculateShippingCost,
  destinations
} from '@/lib/shippingUtils';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface StorageItem {
  id: string;
  product_request_id: string;
  order_id?: string; // Made optional
  order_personal_id?: string;
  product_url: string;
  item_name?: string;
  quantity: number;
  weight?: number;
  status: string;
  created_at: string;
  order_created_at: string;
  is_box?: boolean | null;
  local_tracking_number?: string | null;
  product_request: {
    item_name: string;
    quantity: number;
    product_url?: string;
  };
}

interface ShippingQuoteGroup {
  id: string;
  shipment_personal_id?: string;
  created_at: string;
  status: string;
  items: StorageItem[];
  total_weight: number;
  destination: string;
  shipping_method: string;
}

export const StoragePage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<StorageItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [shippingQuotes, setShippingQuotes] = useState<ShippingQuoteGroup[]>([]);
  const { t } = useApp();

  // Calculate values for selected items
  const selectedItemsList = items.filter(item => selectedItems.has(item.id));
  const totalWeight = selectedItemsList.reduce((sum, item) => sum + (item.weight || 0), 0);

  useEffect(() => {
    fetchStorageItems();
    fetchShippingQuotes();
  }, []);

  const fetchShippingQuotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('shipping_quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group items by shipping quote
      const groups: ShippingQuoteGroup[] = [];
      for (const quote of data || []) {
        const itemIds = (quote.items as any[]).map(item => item.order_item_id);
        const group: ShippingQuoteGroup = {
          id: quote.id,
          shipment_personal_id: quote.shipment_personal_id,
          created_at: quote.created_at,
          status: quote.status,
          items: [],
          total_weight: quote.total_weight,
          destination: quote.destination,
          shipping_method: quote.shipping_method
        };
        groups.push(group);
      }
      setShippingQuotes(groups);
    } catch (error) {
      console.error('Error fetching shipping quotes:', error);
    }
  };

  const fetchStorageItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Query product_requests directly with LEFT JOIN to orders
      const { data, error } = await supabase
        .from('product_requests')
        .select(`
          id,
          product_url,
          item_name,
          quantity,
          status,
          weight,
          is_box,
          local_tracking_number,
          created_at,
          order_items!left (
            id,
            order:orders!left (
              id,
              order_personal_id,
              created_at
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'received')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data into StorageItem format
      const storageItems: StorageItem[] = data?.map(item => {
        const orderItem = item.order_items?.[0];
        const order = orderItem?.order;
        
        return {
          id: orderItem?.id || item.id, // Use order_item id if available, else product_request id
          product_request_id: item.id,
          order_id: order?.id,
          order_personal_id: order?.order_personal_id,
          product_url: item.product_url,
          item_name: item.item_name,
          quantity: item.quantity || 1,
          weight: item.weight,
          status: item.status,
          created_at: item.created_at,
          order_created_at: order?.created_at || item.created_at,
          is_box: item.is_box,
          local_tracking_number: item.local_tracking_number,
          product_request: {
            item_name: item.item_name || 'Unnamed Product',
            quantity: item.quantity || 1,
            product_url: item.product_url
          }
        };
      }) || [];

      console.log('Fetched storage items:', storageItems.length, 'items');
      setItems(storageItems);

      // Update shipping quotes with actual items
      const { data: quotesData } = await supabase
        .from('shipping_quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const groups: ShippingQuoteGroup[] = [];
      for (const quote of quotesData || []) {
        const quoteItems: StorageItem[] = [];
        for (const quoteItem of (quote.items as any[])) {
          const item = storageItems.find(si => si.id === (quoteItem.order_item_id || quoteItem.id)); // Handle both field names for backward compatibility
          if (item) {
            quoteItems.push(item);
          }
        }
        if (quoteItems.length > 0) {
          groups.push({
            id: quote.id,
            shipment_personal_id: quote.shipment_personal_id,
            created_at: quote.created_at,
            status: quote.status,
            items: quoteItems,
            total_weight: quote.total_weight,
            destination: quote.destination,
            shipping_method: quote.shipping_method
          });
        }
      }
      setShippingQuotes(groups);
    } catch (error) {
      console.error('Error fetching storage items:', error);
      toast.error('Failed to load storage items');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Get items that are not in any non-rejected shipping quote
      const available = items.filter(item =>
        !shippingQuotes.some(quote =>
          quote.status !== 'rejected' && quote.items.some(quoteItem => quoteItem.id === item.id)
        )
      );
      // Only select items that have weights and are NOT box items
      const selectableItems = available.filter(item => 
        item.weight !== null && 
        item.weight !== undefined && 
        !item.is_box
      );
      setSelectedItems(new Set(selectableItems.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const item = items.find(i => i.id === itemId);
    // Don't allow selection if item doesn't have weight or is part of a shipping quote
    if (item && (item.weight === null || item.weight === undefined)) {
      return;
    }

    // Check if item is part of a non-rejected shipping quote
    const isInShippingQuote = shippingQuotes.some(quote =>
      quote.status !== 'rejected' && quote.items.some(quoteItem => quoteItem.id === itemId)
    );
    if (isInShippingQuote) {
      return;
    }

    // Prevent mixing box items with regular items
    if (checked && item) {
      // If trying to select a box item, check if any regular items are selected
      if (item.is_box && selectedItems.size > 0) {
        const hasRegularItems = items.some(i => 
          selectedItems.has(i.id) && !i.is_box
        );
        if (hasRegularItems) {
          toast.error('Cannot mix address service items with regular items');
          return;
        }
      }
      
      // If trying to select a regular item, check if any box items are selected
      if (!item.is_box && selectedItems.size > 0) {
        const hasBoxItems = items.some(i => 
          selectedItems.has(i.id) && i.is_box
        );
        if (hasBoxItems) {
          toast.error('Cannot mix regular items with address service items');
          return;
        }
      }
    }

    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleRequestShipping = () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item to ship');
      return;
    }

    setQuoteDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading storage items...</div>;
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{t('noItemsAtWarehouse')}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t('noItemsDescription')}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get items that are not in any non-rejected shipping quote
  const availableItems = items.filter(item =>
    !shippingQuotes.some(quote =>
      quote.status !== 'rejected' && quote.items.some(quoteItem => quoteItem.id === item.id)
    )
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">{t('warehouseStorage')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('selectItemsToShip')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={fetchStorageItems}>
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Refresh</span>
          </Button>
          <Badge variant="outline" className="text-xs sm:text-sm whitespace-nowrap">
            <Package className="h-3 w-3 mr-1" />
            {availableItems.length} <span className="hidden xs:inline">{availableItems.length === 1 ? t('itemLabel') : t('itemsLabel')}</span>
          </Badge>
        </div>
      </div>



      {availableItems.length > 0 && (
        <>
          <h3 className="text-lg font-semibold">{t('availableItems')}</h3>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          availableItems.filter(item => 
                            item.weight !== null && 
                            item.weight !== undefined && 
                            !item.is_box
                          ).length > 0 &&
                          selectedItems.size === availableItems.filter(item => 
                            item.weight !== null && 
                            item.weight !== undefined && 
                            !item.is_box
                          ).length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>{t('itemName')}</TableHead>
                    <TableHead>{t('quantity')}</TableHead>
                    <TableHead>{t('weight')}</TableHead>
                    <TableHead>{t('orderNumberShort')}</TableHead>
                    <TableHead>{t('arrived')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableItems.map(item => {
                    const hasWeight = item.weight !== null && item.weight !== undefined;
                    const isInShippingQuote = shippingQuotes.some(quote =>
                      quote.status !== 'rejected' && quote.items.some(quoteItem => quoteItem.id === item.id)
                    );
                    
                    // Check if this item should be disabled based on current selection
                    const hasSelectedBoxItems = selectedItems.size > 0 && items.some(i => 
                      selectedItems.has(i.id) && i.is_box
                    );
                    const hasSelectedRegularItems = selectedItems.size > 0 && items.some(i => 
                      selectedItems.has(i.id) && !i.is_box
                    );
                    const isDisabledBySelection = 
                      (item.is_box && hasSelectedRegularItems) || // Box item disabled if regular items selected
                      (!item.is_box && hasSelectedBoxItems); // Regular items disabled if box selected
                    
                    return (
                      <TableRow key={item.id} className={!hasWeight || isInShippingQuote || isDisabledBySelection ? 'opacity-60' : ''}>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.has(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                            disabled={!hasWeight || isInShippingQuote || isDisabledBySelection}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{item.item_name || t('unnamedProduct')}</p>
                              {item.is_box && (
                                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                                  {t('addressService')}
                                </Badge>
                              )}
                            </div>
                            <div className="max-w-[280px] truncate">
                              {item.is_box && item.local_tracking_number ? (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                  <Package className="h-3 w-3 flex-shrink-0" />
                                  <span className="font-medium">Local Tracking #:</span>
                                  <span>{item.local_tracking_number}</span>
                                </div>
                              ) : (
                                <a
                                  href={item.product_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs"
                                  title={item.product_url}
                                >
                                  <Link className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{item.product_url}</span>
                                </a>
                              )}
                            </div>
                          </div>

                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {hasWeight ? (
                            <div className="flex items-center gap-1">
                              <Scale className="h-3 w-3 text-muted-foreground" />
                              <span>{item.weight}g</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-600">
                              <AlertCircle className="h-3 w-3" />
                              <span className="text-sm">{t('awaitingWeighing')}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-mono">
                            #{item.order_personal_id || (item.order_id ? item.order_id.slice(0, 8) : '-')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(item.order_created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {selectedItems.size > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {selectedItems.size} {selectedItems.size === 1 ? t('itemSelected') : t('itemsSelected')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('totalWeight')} {totalWeight}g
                    </p>
                  </div>
                  <Button
                    onClick={handleRequestShipping}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    {t('requestShippingQuote')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="text-sm space-y-1 mt-2">
                <li>• {t('storageAlert1')}</li>
                <li>• {t('storageAlert2')}</li>
                <li>• {t('storageAlert3')}</li>
              </ul>
            </AlertDescription>
          </Alert>
        </>


      )}

      {/* Show non-rejected shipping quotes */}
      {shippingQuotes.filter(q => q.status === 'pending' || q.status === 'quoted').length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('shippingQuotesRequested')}</h3>
          {shippingQuotes.filter(q => q.status === 'pending' || q.status === 'quoted').map(quote => (
            <Collapsible key={quote.id}>
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {t('shipmentNumber')}{quote.shipment_personal_id || quote.id.slice(0, 8)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {quote.items.length} items • {quote.total_weight}g • {quote.destination} • {quote.shipping_method}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {quote.status}
                        </Badge>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                      </div>
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                  <CardContent>  
                    <div className="space-y-2">
                      {quote.items.map(item => (
                        <div key={item.id} className="text-sm p-2 bg-background rounded">
                          <span className="font-medium">{item.item_name || 'Unnamed Product'}</span>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => navigate('/user-dashboard?tab=shipping')}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      {t('viewInShipping')}
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}



      {/* Shipping Quote Dialog */}
      <ShippingQuoteDialog
        open={quoteDialogOpen}
        onOpenChange={setQuoteDialogOpen}
        selectedItems={selectedItemsList}
        totalWeight={totalWeight}
        onSuccess={() => {
          // Refresh data after successful quote creation
          fetchStorageItems();
          fetchShippingQuotes();
          // Clear selected items
          setSelectedItems(new Set());
        }}
      />
    </div>
  );
};