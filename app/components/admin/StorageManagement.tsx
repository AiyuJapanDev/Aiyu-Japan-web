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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  width: number | null;
  length: number | null;
  height: number | null;
  created_at: string;
  status: string;
  isShipped: boolean;
  is_box: boolean | null;
  local_tracking_number: string | null;
}

interface CustomerStorage {
  user_id: string;
  batchDate: string; // Date string for grouping
  isNew: boolean; // If batch contains new items (last 3 days)
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
  const [widths, setWidths] = useState<Record<string, string>>({});
  const [lengths, setLengths] = useState<Record<string, string>>({});
  const [heights, setHeights] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [preSelectedUserId, setPreSelectedUserId] = useState<string | null>(null);
  const [isBoxConfirmDialogOpen, setIsBoxConfirmDialogOpen] = useState(false);
  const [pendingBoxItemData, setPendingBoxItemData] = useState<any>(null);
  const [userSearchOpen, setUserSearchOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  
  // Add item form state
  const [selectedUserId, setSelectedUserId] = useState('');
  const [itemName, setItemName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [itemWeight, setItemWeight] = useState('');
  const [itemWidth, setItemWidth] = useState('');
  const [itemLength, setItemLength] = useState('');
  const [itemHeight, setItemHeight] = useState('');
  const [notes, setNotes] = useState('');
  const [isBox, setIsBox] = useState(false);
  const [localTrackingNumber, setLocalTrackingNumber] = useState('');
  const [formErrors, setFormErrors] = useState<{
    userId?: boolean;
    itemName?: boolean;
    productUrl?: boolean;
    isBox?: boolean;
  }>({});
  
  // Paginación del servidor (product_requests)
  const [serverPage, setServerPage] = useState(1);
  const serverPageSize = 50; // 50 product_requests por página
  const [totalProducts, setTotalProducts] = useState(0);

  // Debounce search term to prevent input interruption
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
    queryKey: ['admin-storage', serverPage, debouncedSearchTerm],
    queryFn: async () => {
      const hasSearch = debouncedSearchTerm.trim().length > 0;
      
      // When searching, fetch all matching records; otherwise paginate
      let query = supabase
        .from('product_requests')
        .select(`
          *,
          order_items!order_items_product_request_id_fkey(id)
        `, { count: 'exact' })
        .eq('status', 'received')
        .order('created_at', { ascending: false });

      if (hasSearch) {
        // Server-side search: fetch all matching users first
        const searchLower = debouncedSearchTerm.toLowerCase();
        
        // Search in profiles for name, email, or personal_id
        const { data: matchingProfiles } = await supabase
          .from('profiles')
          .select('id')
          .or(`full_name.ilike.%${searchLower}%,email.ilike.%${searchLower}%,user_personal_id.ilike.%${searchLower}%`);
        
        const matchingUserIds = matchingProfiles?.map(p => p.id) || [];
        
        // Search in product_requests for item names
        const { data: matchingItems } = await supabase
          .from('product_requests')
          .select('user_id')
          .eq('status', 'received')
          .ilike('item_name', `%${searchLower}%`);
        
        const itemUserIds = matchingItems?.map(i => i.user_id) || [];
        
        // Combine both search results
        const allMatchingUserIds = [...new Set([...matchingUserIds, ...itemUserIds])];
        
        if (allMatchingUserIds.length === 0) {
          setTotalProducts(0);
          return [];
        }
        
        // Fetch all products for matching users (no pagination when searching)
        query = query.in('user_id', allMatchingUserIds);
      } else {
        // Normal pagination when not searching
        const from = (serverPage - 1) * serverPageSize;
        const to = from + serverPageSize - 1;
        query = query.range(from, to);
      }

      const { data: productRequests, error: requestsError, count } = await query as any;

      if (count !== null) {
        setTotalProducts(count);
      }

      if (requestsError) throw requestsError;
      if (!productRequests || productRequests.length === 0) {
        return [];
      }

      // ✅ 3. Fetch shipped quotes to filter already shipped items
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

      // ✅ 4. Get unique user IDs
      const userIds = [...new Set(productRequests.map((pr: any) => pr.user_id))] as string[];

      // ✅ 5. Fetch profiles for those users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone_number, user_personal_id')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of profiles for quick lookup
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      // ✅ 6. Group items by user AND by 10-day windows
      // First, sort products by user and date
      const sortedByUser: Record<string, any[]> = {};
      productRequests.forEach((item: any) => {
        const userId = item.user_id;
        if (!sortedByUser[userId]) {
          sortedByUser[userId] = [];
        }
        sortedByUser[userId].push(item);
      });

      // Sort each user's products by date
      Object.keys(sortedByUser).forEach(userId => {
        sortedByUser[userId].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      const grouped: Record<string, CustomerStorage> = {};
      const now = new Date();
      const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
      let groupCounter = 0;
      
      // Group products within 10-day windows for each user
      Object.keys(sortedByUser).forEach(userId => {
        const userProducts = sortedByUser[userId];
        const profile = profileMap.get(userId);
        
        let currentGroup: any[] = [];
        let groupStartDate: Date | null = null;
        
        userProducts.forEach((item: any, index: number) => {
          const itemDate = new Date(item.created_at);
          
          // If this is the first item or within 10 days of group start, add to current group
          if (!groupStartDate || (itemDate.getTime() - groupStartDate.getTime()) <= 10 * 24 * 60 * 60 * 1000) {
            if (!groupStartDate) {
              groupStartDate = itemDate;
            }
            currentGroup.push(item);
          } else {
            // Save current group and start a new one
            const groupKey = `${userId}_${groupCounter++}`;
            const isNew = groupStartDate! >= eightDaysAgo;
            
            grouped[groupKey] = {
              user_id: groupKey,
              batchDate: groupStartDate!.toISOString().split('T')[0],
              isNew,
              user: {
                full_name: profile?.full_name || 'Unknown User',
                email: profile?.email || 'No email',
                phone_number: profile?.phone_number || 'No phone',
                user_personal_id: profile?.user_personal_id
              },
              items: [],
              totalWeight: 0,
              totalItems: 0,
            };
            
            currentGroup.forEach((groupItem: any) => {
              const orderItemIds = groupItem.order_items?.map((oi: any) => oi.id) || [];
              const isShipped = orderItemIds.some((id: string) => shippedOrderItemIds.has(id));
              
              grouped[groupKey].items.push({
                id: groupItem.id,
                item_name: groupItem.item_name,
                product_url: groupItem.product_url,
                quantity: groupItem.quantity,
                weight: groupItem.weight,
                width: groupItem.width,
                length: groupItem.length,
                height: groupItem.height,
                created_at: groupItem.created_at,
                status: groupItem.status,
                isShipped,
                is_box: groupItem.is_box,
                local_tracking_number: groupItem.local_tracking_number,
              });
              grouped[groupKey].totalWeight += groupItem.weight || 0;
              grouped[groupKey].totalItems += groupItem.quantity || 1;
            });
            
            // Start new group with current item
            currentGroup = [item];
            groupStartDate = itemDate;
          }
          
          // Handle last group
          if (index === userProducts.length - 1 && currentGroup.length > 0) {
            const groupKey = `${userId}_${groupCounter++}`;
            const isNew = groupStartDate! >= eightDaysAgo;
            
            grouped[groupKey] = {
              user_id: groupKey,
              batchDate: groupStartDate!.toISOString().split('T')[0],
              isNew,
              user: {
                full_name: profile?.full_name || 'Unknown User',
                email: profile?.email || 'No email',
                phone_number: profile?.phone_number || 'No phone',
                user_personal_id: profile?.user_personal_id
              },
              items: [],
              totalWeight: 0,
              totalItems: 0,
            };
            
            currentGroup.forEach((groupItem: any) => {
              const orderItemIds = groupItem.order_items?.map((oi: any) => oi.id) || [];
              const isShipped = orderItemIds.some((id: string) => shippedOrderItemIds.has(id));
              
              grouped[groupKey].items.push({
                id: groupItem.id,
                item_name: groupItem.item_name,
                product_url: groupItem.product_url,
                quantity: groupItem.quantity,
                weight: groupItem.weight,
                width: groupItem.width,
                length: groupItem.length,
                height: groupItem.height,
                created_at: groupItem.created_at,
                status: groupItem.status,
                isShipped,
                is_box: groupItem.is_box,
                local_tracking_number: groupItem.local_tracking_number,
              });
              grouped[groupKey].totalWeight += groupItem.weight || 0;
              grouped[groupKey].totalItems += groupItem.quantity || 1;
            });
          }
        });
      });

      // Sort groups by batch date (newest first)
      return Object.values(grouped).sort((a, b) => 
        new Date(b.batchDate).getTime() - new Date(a.batchDate).getTime()
      );
    },
  });

  const updateItemDetailsMutation = useMutation({
    mutationFn: async ({ itemId, weight, width, length, height }: { 
      itemId: string; 
      weight?: number;
      width?: number;
      length?: number;
      height?: number;
    }) => {
      const updateData: any = {};
      if (weight !== undefined) updateData.weight = weight;
      if (width !== undefined) updateData.width = width;
      if (length !== undefined) updateData.length = length;
      if (height !== undefined) updateData.height = height;
      
      const { error } = await supabase
        .from('product_requests')
        .update(updateData)
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-storage'] });
      toast({
        title: 'Item updated',
        description: 'Weight and dimensions have been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update item details. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (itemData: {
      user_id: string;
      item_name: string;
      product_url: string;
      quantity: number;
      weight?: number;
      width?: number;
      length?: number;
      height?: number;
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
    },
  });

  const handleItemDetailsUpdate = (itemId: string) => {
    const weight = weights[itemId] ? parseFloat(weights[itemId]) : undefined;
    const width = widths[itemId] ? parseFloat(widths[itemId]) : undefined;
    const length = lengths[itemId] ? parseFloat(lengths[itemId]) : undefined;
    const height = heights[itemId] ? parseFloat(heights[itemId]) : undefined;
    
    if (weight !== undefined || width !== undefined || length !== undefined || height !== undefined) {
      updateItemDetailsMutation.mutate({ itemId, weight, width, length, height });
    }
  };

  const resetAddForm = () => {
    setSelectedUserId('');
    setItemName('');
    setProductUrl('');
    setQuantity('1');
    setItemWeight('');
    setItemWidth('');
    setItemLength('');
    setItemHeight('');
    setNotes('');
    setIsBox(false);
    setLocalTrackingNumber('');
    setPreSelectedUserId(null);
    setFormErrors({});
    setUserSearchQuery('');
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

    if (itemWidth) {
      itemData.width = parseFloat(itemWidth);
    }

    if (itemLength) {
      itemData.length = parseFloat(itemLength);
    }

    if (itemHeight) {
      itemData.height = parseFloat(itemHeight);
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

  // No client-side filtering needed - search is done server-side
  const filteredData = storageData;

  // Cálculos de paginación del servidor
  const totalPages = Math.ceil(totalProducts / serverPageSize);

  // Reset to page 1 when search changes
  useEffect(() => {
    setServerPage(1);
  }, [debouncedSearchTerm]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serverPage]);

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
                    <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={userSearchOpen}
                          className={`w-full justify-between rounded-xl px-4 py-3 text-sm transition-all duration-300 font-body bg-white focus:ring-2 focus:ring-black focus:ring-offset-2 shadow-sm h-auto ${!selectedUserId ? 'text-gray-500' : 'font-medium text-gray-900'}`}
                        >
                          {selectedUserId
                            ? (() => {
                                const user = allUsers?.find((u) => u.id === selectedUserId);
                                return user ? `${user.full_name} (${user.user_personal_id || user.email})` : 'Select a customer';
                              })()
                            : 'Select a customer for id, name or email'}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search customer..."
                            value={userSearchQuery}
                            onValueChange={setUserSearchQuery}
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No customer found.</CommandEmpty>
                            <CommandGroup>
                              {allUsers
                                ?.filter((user) => {
                                  if (!userSearchQuery) return true;
                                  const searchLower = userSearchQuery.toLowerCase();
                                  return (
                                    user.full_name.toLowerCase().includes(searchLower) ||
                                    user.email.toLowerCase().includes(searchLower) ||
                                    user.id.toLowerCase().includes(searchLower) ||
                                    (user.user_personal_id && user.user_personal_id.toLowerCase().includes(searchLower))
                                  );
                                })
                                .map((user) => (
                                  <CommandItem
                                    key={user.id}
                                    value={user.id}
                                    onSelect={() => {
                                      setSelectedUserId(user.id);
                                      setFormErrors(prev => ({ ...prev, userId: false }));
                                      setUserSearchOpen(false);
                                      setUserSearchQuery('');
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">{user.full_name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {user.user_personal_id || user.email}
                                      </span>
                                    </div>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="width">Width (cm)</Label>
                      <Input
                        id="width"
                        type="number"
                        min="0"
                        step="0.1"
                        value={itemWidth}
                        onChange={(e) => setItemWidth(e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="length">Length (cm)</Label>
                      <Input
                        id="length"
                        type="number"
                        min="0"
                        step="0.1"
                        value={itemLength}
                        onChange={(e) => setItemLength(e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        min="0"
                        step="0.1"
                        value={itemHeight}
                        onChange={(e) => setItemHeight(e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
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
          {/* Controles de paginación del servidor - ocultar durante búsqueda */}
          {totalPages > 1 && !debouncedSearchTerm.trim() && (
            <div className="mb-6 pb-6 border-b">
              <div className="flex flex-col items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground text-center">
                  Mostrando página {serverPage} de {totalPages} ({totalProducts} productos en total)
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setServerPage(1)}
                    disabled={serverPage === 1 || isLoading}
                  >
                    Primera
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setServerPage(p => Math.max(1, p - 1))}
                    disabled={serverPage === 1 || isLoading}
                  >
                    ← Anterior
                  </Button>
                  <div className="flex items-center gap-2 px-3 py-1 bg-accent rounded-md">
                    <span className="text-sm font-medium">{serverPage}</span>
                    <span className="text-sm text-muted-foreground">/</span>
                    <span className="text-sm text-muted-foreground">{totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setServerPage(p => Math.min(totalPages, p + 1))}
                    disabled={serverPage === totalPages || isLoading}
                  >
                    Siguiente →
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setServerPage(totalPages)}
                    disabled={serverPage === totalPages || isLoading}
                  >
                    Última
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <Input
              placeholder="Search by customer name, personal ID, email, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-sm"
            />
            {debouncedSearchTerm.trim() && (
              <div className="mt-2 text-sm text-muted-foreground">
                {isLoading ? (
                  'Searching...'
                ) : (
                  `Found ${totalProducts} product${totalProducts !== 1 ? 's' : ''} matching "${debouncedSearchTerm}"`
                )}
              </div>
            )}
          </div>

        <div className="space-y-4">
          {filteredData?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {debouncedSearchTerm.trim() 
                ? `No results found for "${debouncedSearchTerm}"` 
                : 'No items currently in storage'
              }
            </div>
          ) : (
            filteredData?.map((customer) => (
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
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium truncate">
                                {customer.user.full_name}
                                {customer.user.user_personal_id && (
                                  <span className="text-xs text-muted-foreground ml-2">#{customer.user.user_personal_id}</span>
                                )}
                              </h3>
                              {customer.isNew && (
                                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-semibold">
                                  NEW
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{customer.user.email}</p>
                            <p className="text-xs text-muted-foreground">Pedido del {new Date(customer.batchDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
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
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Weight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="Weight (g)"
                                className="w-24"
                                value={weights[item.id] !== undefined ? weights[item.id] : (item.weight || '')}
                                onChange={(e) => setWeights(prev => ({ ...prev, [item.id]: e.target.value }))}
                              />
                              <span className="text-sm text-muted-foreground ml-2">Dimensions:</span>
                              <Input
                                type="number"
                                placeholder="W (cm)"
                                className="w-20"
                                value={widths[item.id] !== undefined ? widths[item.id] : (item.width || '')}
                                onChange={(e) => setWidths(prev => ({ ...prev, [item.id]: e.target.value }))}
                              />
                              <span className="text-muted-foreground">×</span>
                              <Input
                                type="number"
                                placeholder="L (cm)"
                                className="w-20"
                                value={lengths[item.id] !== undefined ? lengths[item.id] : (item.length || '')}
                                onChange={(e) => setLengths(prev => ({ ...prev, [item.id]: e.target.value }))}
                              />
                              <span className="text-muted-foreground">×</span>
                              <Input
                                type="number"
                                placeholder="H (cm)"
                                className="w-20"
                                value={heights[item.id] !== undefined ? heights[item.id] : (item.height || '')}
                                onChange={(e) => setHeights(prev => ({ ...prev, [item.id]: e.target.value }))}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleItemDetailsUpdate(item.id)}
                                disabled={updateItemDetailsMutation.isPending}
                              >
                                Update
                              </Button>
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