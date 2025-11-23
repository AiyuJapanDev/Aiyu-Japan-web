import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, Truck, CheckCircle, AlertCircle, DollarSign, XCircle, ShoppingBag, RefreshCw, Filter, X, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string | null;
  read_at: string | null;
  created_at: string;
  order_group_id: string | null;
}

export const NotificationsView = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Filter and pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [readStatusFilter, setReadStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | '90days' | 'all'>('all');
  const ITEMS_PER_PAGE = 15;

  // Check if user is admin
  const { data: userRole } = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      return data?.role || 'user';
    },
    enabled: !!user,
  });

  const isAdmin = userRole === 'admin';

  // Category grouping helper
  const getCategoryForNotification = (type: string): string => {
    const orderTypes = ['quote_received', 'order_rejected', 'payment_confirmed', 'order_update', 'quote_approved', 'quote_rejected', 'order_issue'];
    const shippingTypes = ['shipping_quote_received', 'shipping_request_rejected', 'shipping_payment_confirmed', 'shipment_sent', 'shipping_update'];
    const warehouseTypes = ['items_at_warehouse'];
    const adminTypes = ['new_product_request', 'order_resubmitted', 'new_shipping_request'];

    if (orderTypes.includes(type)) return 'orders';
    if (shippingTypes.includes(type)) return 'shipping';
    if (warehouseTypes.includes(type)) return 'warehouse';
    if (adminTypes.includes(type)) return 'admin';
    return 'other';
  };

  // Calculate date threshold for time filter
  const getDateThreshold = () => {
    const now = new Date();
    switch (timeFilter) {
      case '7days':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case '30days':
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      case '90days':
        return new Date(now.setDate(now.getDate() - 90)).toISOString();
      case 'all':
      default:
        return null;
    }
  };

  // Fetch total count
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['notifications', 'count', user?.id, readStatusFilter, categoryFilter, timeFilter],
    queryFn: async () => {
      if (!user) return 0;
      
      let query = supabase
        .from('notifications')
        .select('type, read_at, created_at')
        .eq('user_id', user.id);

      // Apply read status filter
      if (readStatusFilter === 'unread') {
        query = query.is('read_at', null);
      } else if (readStatusFilter === 'read') {
        query = query.not('read_at', 'is', null);
      }

      // Apply time filter
      const dateThreshold = getDateThreshold();
      if (dateThreshold) {
        query = query.gte('created_at', dateThreshold);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Apply category filter client-side
      if (categoryFilter !== 'all' && data) {
        return data.filter(n => getCategoryForNotification(n.type) === categoryFilter).length;
      }

      return data?.length || 0;
    },
    enabled: !!user,
  });

  // Fetch notifications with filtering
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id, currentPage, readStatusFilter, categoryFilter, timeFilter],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id);

      // Apply read status filter
      if (readStatusFilter === 'unread') {
        query = query.is('read_at', null);
      } else if (readStatusFilter === 'read') {
        query = query.not('read_at', 'is', null);
      }

      // Apply time filter
      const dateThreshold = getDateThreshold();
      if (dateThreshold) {
        query = query.gte('created_at', dateThreshold);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;

      // Apply category filter client-side
      let filteredData = data || [];
      if (categoryFilter !== 'all') {
        filteredData = filteredData.filter(n => getCategoryForNotification(n.type) === categoryFilter);
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      return (filteredData.slice(startIndex, endIndex) as Notification[]);
    },
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user?.id || '');
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
    },
    onError: () => {
      toast.error('Failed to mark notification as read');
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', user?.id || '')
        .is('read_at', null);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread'] });
      toast.success('All notifications marked as read');
    },
    onError: () => {
      toast.error('Failed to mark all as read');
    },
  });

  // Clear all filters
  const clearFilters = () => {
    setReadStatusFilter('all');
    setCategoryFilter('all');
    setTimeFilter('all');
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE - 1, totalCount);

  // Active filters count
  const activeFiltersCount = [
    readStatusFilter !== 'all',
    categoryFilter !== 'all',
    timeFilter !== 'all'
  ].filter(Boolean).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quote_received':
        return <DollarSign className="h-5 w-5 text-blue-500" />;
      case 'order_rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'payment_confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'items_at_warehouse':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'shipping_quote_received':
        return <DollarSign className="h-5 w-5 text-cyan-500" />;
      case 'shipping_request_rejected':
        return <XCircle className="h-5 w-5 text-orange-500" />;
      case 'shipping_payment_confirmed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'shipment_sent':
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case 'order_update':
        return <Package className="h-5 w-5 text-primary" />;
      case 'shipping_update':
        return <Truck className="h-5 w-5 text-primary" />;
      case 'quote_approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'quote_rejected':
      case 'order_issue':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      // Admin notification icons
      case 'new_product_request':
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'order_resubmitted':
        return <RefreshCw className="h-5 w-5 text-purple-500" />;
      case 'new_shipping_request':
        return <Package className="h-5 w-5 text-teal-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getButtonText = (type: string): string => {
    switch (type) {
      case 'quote_received':
        return 'Click here to view order';
      case 'order_rejected':
        return 'Click here to review and resubmit';
      case 'payment_confirmed':
        return 'Click here to view order';
      case 'items_at_warehouse':
        return 'Click here to view warehouse';
      case 'shipping_quote_received':
        return 'Click here to view shipment';
      case 'shipping_request_rejected':
        return 'Click here to review shipment';
      case 'shipping_payment_confirmed':
        return 'Click here to view shipment';
      case 'shipment_sent':
        return 'Click here to track shipment';
      // Admin notification button texts
      case 'new_product_request':
        return 'Click here to view new order';
      case 'order_resubmitted':
        return 'Click here to review resubmitted order';
      case 'new_shipping_request':
        return 'Click here to process shipping request';
      default:
        return 'Click here to view details';
    }
  };

  const handleNotificationAction = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.read_at) {
      await markAsReadMutation.mutateAsync(notification.id);
    }
    
    // Navigate based on type
    if (notification.order_group_id) {
      // Admin notifications - redirect to admin pages
      if (notification.type === 'new_product_request' || 
          notification.type === 'order_resubmitted') {
        navigate(`/admin-dashboard?tab=requests&orderId=${notification.order_group_id}`);
      } 
      // Admin shipping request notification
      else if (notification.type === 'new_shipping_request') {
        navigate(`/admin-dashboard?tab=shipping-requests&shipmentId=${notification.order_group_id}`);
      }
      // User shipping-related notifications
      else if (notification.type === 'shipping_quote_received' || 
          notification.type === 'shipping_request_rejected' ||
          notification.type === 'shipping_payment_confirmed' ||
          notification.type === 'shipment_sent') {
        navigate(`/user-dashboard?tab=shipping&shipmentId=${notification.order_group_id}`);
      } 
      // Storage notification
      else if (notification.type === 'items_at_warehouse') {
        navigate('/user-dashboard?tab=storage');
      } 
      // All other order-related notifications
      else {
        navigate(`/user-dashboard?tab=orders&orderId=${notification.order_group_id}`);
      }
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read_at);
  const readNotifications = notifications.filter(n => n.read_at);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-base">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={readStatusFilter} onValueChange={(value: any) => {
                setReadStatusFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All notifications</SelectItem>
                  <SelectItem value="unread">Unread only</SelectItem>
                  <SelectItem value="read">Read only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={categoryFilter} onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  {isAdmin && <SelectItem value="admin">Admin</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Time</label>
              <Select value={timeFilter} onValueChange={(value: any) => {
                setTimeFilter(value);
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results count and Mark all as read */}
      {!isLoading && totalCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex}-{endIndex} of {totalCount} notifications
          </p>
          {notifications.some(n => !n.read_at) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="self-start sm:self-auto"
            >
              {markAllAsReadMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Mark all as read
            </Button>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : totalCount === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">
              {activeFiltersCount > 0 ? 'No notifications found' : 'No notifications yet'}
            </p>
            {activeFiltersCount > 0 && (
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Clear filters to see all notifications
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-600 px-2">Unread</h3>
              {unreadNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className="border-l-4 border-l-primary bg-primary/5"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1">
                          <p className="text-gray-800 font-semibold break-words flex-1">
                            {notification.message}
                          </p>
                          <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  size="sm"
                  onClick={() => handleNotificationAction(notification)}
                  className="w-full sm:flex-1 text-xs sm:text-sm"
                >
                  <span className="truncate">{getButtonText(notification.type)}</span>
                </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                            disabled={markAsReadMutation.isPending}
                            className="sm:whitespace-nowrap"
                          >
                            Mark as read
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-600 px-2">Read</h3>
              {readNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-600 break-words">{notification.message}</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleNotificationAction(notification)}
                          className="w-full text-xs sm:text-sm"
                        >
                          <span className="truncate">{getButtonText(notification.type)}</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                    const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
