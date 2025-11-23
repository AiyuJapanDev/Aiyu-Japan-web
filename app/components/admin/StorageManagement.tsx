import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Package, User, Weight, Link, Plus, Trash2, PackageCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createNotification } from '@/lib/notificationUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface StoredItem {
  id: string;
  item_name: string;
  product_url: string;
  quantity: number;
  weight: number | null;
  invoice_id: string | null;
  created_at: string;
  status: string;
  isShipped: boolean;
  is_box: boolean | null;
  local_tracking_number: string | null;
}

interface CustomerStorage {
  user_id: string;
  user: {
    full_name: string;
    email: string;
    phone_number: string;
    user_personal_id?: string;
  };
  items: StoredItem[];
  totalWeight: number;
  totalItems: number;
}

// Utility to shorten URL display
const formatShortUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname + parsed.search + parsed.hash;
    
    // Show only first 40 characters after the domain
    const shortenedPath = path.length > 40 ? path.slice(0, 40) + "..." : path;
    
    return domain + shortenedPath;
  } catch {
    // If URL parsing fails, show first 60 chars of the raw string
    return url.length > 60 ? url.slice(0, 60) + "..." : url;
  }
};

export const StorageManagement = React.memo(() => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [invoiceIds, setInvoiceIds] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [preSelectedUserId, setPreSelectedUserId] = useState<string | null>(null);
  const [isBoxConfirmDialogOpen, setIsBoxConfirmDialogOpen] = useState(false);
  const [pendingBoxItemData, setPendingBoxItemData] = useState<any>(null);
  
  // Add item form state
  const [selectedUserId, setSelectedUserId] = useState('');
  const [itemName, setItemName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [itemWeight, setItemWeight] = useState('');
  const [itemInvoiceId, setItemInvoiceId] = useState('');
  const [notes, setNotes] = useState('');
  const [isBox, setIsBox] = useState(false);
  const [localTrackingNumber, setLocalTrackingNumber] = useState('');
  const [formErrors, setFormErrors] = useState<{
    userId?: boolean;
    itemName?: boolean;
    productUrl?: boolean;
    isBox?: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch all users for the add item dropdown
  const { data: allUsers } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_personal_id')
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: storageData, isLoading } = useQuery({
    queryKey: ['admin-storage'],
    queryFn: async () => {
      // First, fetch all product requests with status 'received'
      const { data: productRequests, error: requestsError } = await supabase
        .from('product_requests')
        .select('*')
        .eq('status', 'received')
        .order('created_at', { ascending: false }) as any;

      if (requestsError) throw requestsError;
      if (!productRequests || productRequests.length === 0) return [];

      // Fetch all shipped order items from shipping_quotes with status 'sent'
      const { data: shippedQuotes, error: shippedError } = await supabase
        .from('shipping_quotes')
        .select('items')
        .eq('status', 'sent');

      if (shippedError) throw shippedError;

      // Extract all shipped order_item_ids
      const shippedOrderItemIds = new Set<string>();
      shippedQuotes?.forEach(quote => {
        const items = quote.items as any[];
        items?.forEach(item => {
          if (item.order_item_id) {
            shippedOrderItemIds.add(item.order_item_id);
          }
        });
      });

      // Get product request IDs
      const productRequestIds = productRequests.map(pr => pr.id);

      // Fetch order_items to map product_request_id to order_item_id
      const { data: orderItems, error: orderItemsError } = await supabase
        .from('order_items')
        .select('id, product_request_id')
        .in('product_request_id', productRequestIds);

      if (orderItemsError) throw orderItemsError;

      // Create a map: product_request_id -> order_item_id
      const productToOrderItemMap = new Map(
        orderItems?.map(oi => [oi.product_request_id, oi.id]) || []
      );

      // Get unique user IDs
      const userIds = [...new Set(productRequests.map((pr: any) => pr.user_id))] as string[];

      // Fetch profiles for those users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone_number, user_personal_id')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of profiles for quick lookup
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // Group items by user
      const grouped: Record<string, CustomerStorage> = {};
      productRequests.forEach((item: any) => {
        const userId = item.user_id;
        const profile = profileMap.get(userId);
        const orderItemId = productToOrderItemMap.get(item.id);
        const isShipped = (orderItemId && shippedOrderItemIds.has(orderItemId)) || shippedOrderItemIds.has(item.id);
        
        if (!grouped[userId]) {
          grouped[userId] = {
            user_id: userId,
            user: {
              full_name: profile?.full_name || 'Unknown User',
              email: profile?.email || 'No email',
              phone_number: profile?.phone_number || 'No phone'
            },
            items: [],
            totalWeight: 0,
            totalItems: 0,
          };
        }
        
        grouped[userId].items.push({
          id: item.id,
          item_name: item.item_name,
          product_url: item.product_url,
          quantity: item.quantity,
          weight: item.weight,
          invoice_id: item.invoice_id,
          created_at: item.created_at,
          status: item.status,
          isShipped,
          is_box: item.is_box,
          local_tracking_number: item.local_tracking_number,
        });
        grouped[userId].totalWeight += item.weight || 0;
        grouped[userId].totalItems += item.quantity || 1;
      });

      return Object.values(grouped);
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const updateWeightMutation = useMutation({
    mutationFn: async ({ itemId, weight }: { itemId: string; weight: number }) => {
      const { error } = await supabase
        .from('product_requests')
        .update({ weight })
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-storage'] });
      toast({
        title: 'Weight updated',
        description: 'Item weight has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update weight. Please try again.',
        variant: 'destructive',
      });
      console.error('Update weight error:', error);
    },
  });

  const updateInvoiceIdMutation = useMutation({
    mutationFn: async ({ itemId, invoiceId }: { itemId: string; invoiceId: string }) => {
      const { error } = await supabase
        .from('product_requests')
        .update({ invoice_id: invoiceId } as any)
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-storage'] });
      toast({
        title: 'Invoice ID updated',
        description: 'Item invoice ID has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update invoice ID. Please try again.',
        variant: 'destructive',
      });
      console.error('Update invoice ID error:', error);
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (itemData: {
      user_id: string;
      item_name: string;
      product_url: string;
      quantity: number;
      weight?: number;
      invoice_id?: string;
      notes?: string;
      is_box: boolean;
      local_tracking_number?: string;
    }) => {
      const { error } = await supabase
        .from('product_requests')
        .insert({
          ...itemData,
          status: 'received',
        });
      
      if (error) throw error;
      return itemData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-storage'] });
      
      // Only auto-close dialog for non-box items
      if (!data.is_box) {
        setIsAddDialogOpen(false);
        resetAddForm();
        toast({
          title: 'Item added',
          description: 'Item has been added to storage successfully.',
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add item. Please try again.',
        variant: 'destructive',
      });
      console.error('Add item error:', error);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('product_requests')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-storage'] });
      setDeleteItemId(null);
      toast({
        title: 'Item deleted',
        description: 'Item has been removed from storage successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete item. Please try again.',
        variant: 'destructive',
      });
      console.error('Delete item error:', error);
    },
  });

  const handleWeightUpdate = (itemId: string) => {
    const weight = parseFloat(weights[itemId]);
    if (!isNaN(weight) && weight > 0) {
      updateWeightMutation.mutate({ itemId, weight });
    }
  };

  const handleInvoiceIdUpdate = (itemId: string) => {
    const invoiceId = invoiceIds[itemId]?.trim();
    if (invoiceId) {
      updateInvoiceIdMutation.mutate({ itemId, invoiceId });
    }
  };

  const resetAddForm = () => {
    setSelectedUserId('');
    setItemName('');
    setProductUrl('');
    setQuantity('1');
    setItemWeight('');
    setItemInvoiceId('');
    setNotes('');
    setIsBox(false);
    setLocalTrackingNumber('');
    setPreSelectedUserId(null);
    setFormErrors({});
  };

  const handleAddItemForUser = (userId: string) => {
    setPreSelectedUserId(userId);
    setSelectedUserId(userId);
    setIsAddDialogOpen(true);
  };

  const handleAddItem = () => {
    const errors = {
      userId: !selectedUserId,
      itemName: !itemName.trim(),
      productUrl: !productUrl.trim(),
      isBox: false,
    };
    
    setFormErrors(errors);
    
    if (Object.values(errors).some(error => error)) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields (marked with *).',
        variant: 'destructive',
      });
      return;
    }

    const itemData: any = {
      user_id: selectedUserId,
      item_name: itemName.trim(),
      product_url: productUrl.trim(),
      quantity: parseInt(quantity) || 1,
      is_box: isBox,
    };

    if (itemWeight) {
      itemData.weight = parseFloat(itemWeight);
    }

    if (itemInvoiceId?.trim()) {
      itemData.invoice_id = itemInvoiceId.trim();
    }

    if (notes?.trim()) {
      itemData.notes = notes.trim();
    }

    if (isBox && localTrackingNumber.trim()) {
      itemData.local_tracking_number = localTrackingNumber.trim();
    }

    // If it's a box item, show confirmation dialog
    if (isBox) {
      setPendingBoxItemData(itemData);
      setIsBoxConfirmDialogOpen(true);
    } else {
      // Non-box items proceed directly
      addItemMutation.mutate(itemData);
    }
  };

  const handleConfirmBoxItem = async () => {
    if (!pendingBoxItemData) return;
    
    try {
      await addItemMutation.mutateAsync(pendingBoxItemData);
      
      await createNotification(
        pendingBoxItemData.user_id,
        'box_item_added',
        `A box shipment (${pendingBoxItemData.item_name}) has arrived at our warehouse and has been added to your storage.`,
        null,
        null,
        null
      );
      
      setIsBoxConfirmDialogOpen(false);
      setPendingBoxItemData(null);
      setIsAddDialogOpen(false);
      resetAddForm();
      
      toast({
        title: 'Box item added',
        description: 'Box item added successfully and user has been notified by email.',
      });
      
    } catch (error) {
      console.error('Error adding box item:', error);
      setIsBoxConfirmDialogOpen(false);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItemMutation.mutate(itemId);
  };

  const toggleSection = (userId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const filteredData = storageData?.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.user.full_name?.toLowerCase().includes(searchLower) ||
      customer.user.email?.toLowerCase().includes(searchLower) ||
      customer.items.some(item => 
        item.item_name?.toLowerCase().includes(searchLower)
      )
    );
  });

  // Calculate pagination
  const totalCustomers = filteredData?.length || 0;
  const totalPages = Math.ceil(totalCustomers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, endIndex);

  // Reset to page 1 when search changes or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-muted-foreground">Loading storage data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Storage Management</CardTitle>
              <CardDescription>
                View and manage all products currently in storage, grouped by customer
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                resetAddForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto px-4 sm:px-6">
                <DialogHeader>
                  <DialogTitle>Add Item to Storage</DialogTitle>
                  <DialogDescription>
                    Add a new item directly to a customer's storage
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="user">Customer *</Label>
                    <Select 
                      value={selectedUserId} 
                      onValueChange={(value) => {
                        setSelectedUserId(value);
                        setFormErrors(prev => ({ ...prev, userId: false }));
                      }}
                    >
                      <SelectTrigger className={formErrors.userId ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {allUsers?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.full_name} ({user.user_personal_id || user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.userId && (
                      <p className="text-xs text-destructive">Customer is required</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="item-name">Item Name *</Label>
                    <Input
                      id="item-name"
                      value={itemName}
                      onChange={(e) => {
                        setItemName(e.target.value);
                        setFormErrors(prev => ({ ...prev, itemName: false }));
                      }}
                      placeholder="Enter item name"
                      className={formErrors.itemName ? 'border-destructive' : ''}
                    />
                    {formErrors.itemName && (
                      <p className="text-xs text-destructive">Item name is required</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product-url">Product URL *</Label>
                    <Input
                      id="product-url"
                      value={productUrl}
                      onChange={(e) => {
                        setProductUrl(e.target.value);
                        setFormErrors(prev => ({ ...prev, productUrl: false }));
                      }}
                      placeholder="https://..."
                      className={formErrors.productUrl ? 'border-destructive' : ''}
                    />
                    {formErrors.productUrl && (
                      <p className="text-xs text-destructive">Product URL is required</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="weight">Weight (g)</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="0"
                        value={itemWeight}
                        onChange={(e) => setItemWeight(e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="invoice-id">Invoice ID</Label>
                    <Input
                      id="invoice-id"
                      value={itemInvoiceId}
                      onChange={(e) => setItemInvoiceId(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="is-box" className="flex items-center gap-2">
                      Is this a box shipment? *
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is-box"
                        checked={isBox}
                        onCheckedChange={(checked) => {
                          setIsBox(checked === true);
                          setFormErrors(prev => ({ ...prev, isBox: false }));
                          // Clear tracking number if unchecked
                          if (!checked) {
                            setLocalTrackingNumber('');
                          }
                        }}
                        className={formErrors.isBox ? 'border-destructive' : ''}
                      />
                      <label htmlFor="is-box" className="text-sm">
                        Check if this item is a box shipment
                      </label>
                    </div>
                    {formErrors.isBox && (
                      <p className="text-xs text-destructive">Please specify if this is a box shipment</p>
                    )}
                  </div>
                  {isBox && (
                    <div className="grid gap-2">
                      <Label htmlFor="local-tracking">Local Tracking Number</Label>
                      <Input
                        id="local-tracking"
                        value={localTrackingNumber}
                        onChange={(e) => setLocalTrackingNumber(e.target.value)}
                        placeholder="Optional - Enter local tracking number"
                      />
                      <p className="text-xs text-muted-foreground">
                        Only applicable for box shipments
                      </p>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem} disabled={addItemMutation.isPending}>
                    {addItemMutation.isPending ? 'Adding...' : 'Add Item'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Pagination Controls - Top */}
          {totalPages > 1 && (
            <div className="mb-6 pb-6 border-b flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Items per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(parseInt(value))}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalCustomers)} of {totalCustomers}
                </span>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {currentPage > 2 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(1)}
                        isActive={currentPage === 1}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="cursor-pointer"
                      >
                        {currentPage - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationLink isActive className="cursor-default">
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="cursor-pointer"
                      >
                        {currentPage + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  {currentPage < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  
                  {currentPage < totalPages - 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                        isActive={currentPage === totalPages}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <div className="mb-6">
            <Input
              placeholder="Search by customer name, email, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-sm"
            />
          </div>

        <div className="space-y-4">
          {filteredData?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No items currently in storage
            </div>
          ) : (
            paginatedData?.map((customer) => (
              <Collapsible
                key={customer.user_id}
                open={openSections[customer.user_id]}
                onOpenChange={() => toggleSection(customer.user_id)}
              >
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium truncate">
                              {customer.user.full_name}
                              {customer.user.user_personal_id && (
                                <span className="text-xs text-muted-foreground ml-2">#{customer.user.user_personal_id}</span>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">{customer.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="text-left sm:text-right">
                            <p className="text-sm font-medium">{customer.totalItems} items</p>
                            <p className="text-sm text-muted-foreground">
                              {customer.totalWeight}g total
                            </p>
                          </div>
                          {openSections[customer.user_id] ? (
                            <ChevronUp className="h-5 w-5 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Card className="mt-2 bg-accent/5">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {customer.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-lg space-y-2 border border-border"
                        >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Package className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium break-words">{item.item_name || 'Unnamed Item'}</span>
                                  <Badge variant="outline">Qty: {item.quantity}</Badge>
                                  {item.isShipped && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                      <PackageCheck className="h-3 w-3 mr-1" />
                                      Shipped
                                    </Badge>
                                  )}
                                </div>
                                {item.is_box && item.local_tracking_number ? (
                                  <div className="flex items-center gap-1 text-sm mt-1">
                                    <Package className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                    <span className="font-medium">Tracking #:</span>
                                    <span className="text-muted-foreground">{item.local_tracking_number}</span>
                                  </div>
                                ) : (
                                  <a
                                    href={item.product_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline break-all mt-1"
                                    title={item.product_url}
                                  >
                                    <Link className="h-3 w-3 flex-shrink-0" />
                                    {formatShortUrl(item.product_url)}
                                  </a>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteItemId(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2">
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Weight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                <Input
                                  type="number"
                                  placeholder="Weight (g)"
                                  className="flex-1 sm:w-24 min-w-0"
                                  value={weights[item.id] !== undefined ? weights[item.id] : (item.weight || '')}
                                  onChange={(e) => setWeights(prev => ({
                                    ...prev,
                                    [item.id]: e.target.value
                                  }))}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleWeightUpdate(item.id)}
                                  disabled={!weights[item.id] || updateWeightMutation.isPending}
                                >
                                  Update
                                </Button>
                              </div>
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <span className="text-sm text-muted-foreground whitespace-nowrap">Invoice:</span>
                                <Input
                                  type="text"
                                  placeholder="Invoice ID"
                                  className="flex-1 sm:w-32 min-w-0"
                                  value={invoiceIds[item.id] !== undefined ? invoiceIds[item.id] : (item.invoice_id || '')}
                                  onChange={(e) => setInvoiceIds(prev => ({
                                    ...prev,
                                    [item.id]: e.target.value
                                  }))}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleInvoiceIdUpdate(item.id)}
                                  disabled={invoiceIds[item.id] === undefined || updateInvoiceIdMutation.isPending}
                                >
                                  Update
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          className="w-full sm:w-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddItemForUser(customer.user_id);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item for {customer.user.full_name}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
        </div>
      </CardContent>
    </Card>

    <AlertDialog open={deleteItemId !== null} onOpenChange={(open) => !open && setDeleteItemId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Item</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this item from storage? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteItemId && handleDeleteItem(deleteItemId)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={isBoxConfirmDialogOpen} onOpenChange={setIsBoxConfirmDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Box Item to Storage</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to add this box item to storage? 
            <br /><br />
            <strong>This will notify the user by email</strong> that their package has arrived at the warehouse.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setIsBoxConfirmDialogOpen(false);
            setPendingBoxItemData(null);
          }}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirmBoxItem}
            disabled={addItemMutation.isPending}
          >
            {addItemMutation.isPending ? 'Adding...' : 'Confirm and Notify User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
});

StorageManagement.displayName = 'StorageManagement';