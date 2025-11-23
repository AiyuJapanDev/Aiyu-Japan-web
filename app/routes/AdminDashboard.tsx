
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Menu } from 'lucide-react';
import { UserRole, UserProfile, UserWithRole } from '@/types/user';
import { RequestItem } from '@/types/dashboard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UserManagement from '@/components/admin/UserManagement';
import { ProductRequestsManagement } from '@/components/admin/ProductRequestsManagement';

import { StorageManagement } from '@/components/admin/StorageManagement';
import { ShippingRequestsManagement } from '@/components/admin/ShippingRequestsManagement';
import { NotificationsView } from '@/components/user/NotificationsView';
import Analytics from '@/components/admin/Analytics';
import Settings from '@/components/admin/Settings';

const fetchUsers = async () => {
  // Fetch profiles with emails and roles from the database
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, email, created_at, user_personal_id, country')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return [];
  }

  const { data: rolesData, error: rolesError } = await supabase
    .from('user_roles')
    .select('*');

  if (rolesError) {
    console.error('Error fetching roles:', rolesError);
  }

  // Combine the data
  return (profilesData || []).map((profile: any) => {
    const userRole = rolesData?.find((role: any) => role.user_id === profile.id);
    
    return {
      id: profile.id,
      email: profile.email || 'No email',
      full_name: profile.full_name || 'Unknown',
      role: (userRole?.role as UserRole) || 'user',
      created_at: profile.created_at,
      user_personal_id: profile.user_personal_id,
      country: profile.country,
    };
  });
};

const AdminDashboard = () => {
  const { t } = useApp();
  const { assignRole } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('requests');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  // Set active tab from URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['requests', 'storage', 'shipping-requests', 'users', 'notifications', 'analytics', 'settings', 'orders'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Extract orderId and shipmentId from URL params
  const orderId = searchParams.get('orderId');
  const shipmentId = searchParams.get('shipmentId');

  // Caching users with React Query
  const { data: users = [], refetch: refetchUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
    staleTime: 60 * 1000,
  });

  // Mock data for demonstration (leave as useState for now)
  const [requests] = useState<RequestItem[]>([
    {
      id: 'AJ-001',
      clientId: 'USER-123',
      clientName: 'John Doe',
      productUrl: 'https://example.com/anime-figure',
      quantity: 1,
      status: 'pending',
      estimatedCost: '¥5,000',
      finalQuote: '',
      paypalLink: '',
      notes: 'Limited edition figure',
      internalNotes: '',
      date: '2024-06-10'
    },
    {
      id: 'AJ-002',
      clientId: 'USER-456',
      clientName: 'Jane Smith',
      productUrl: 'https://example.com/manga-set',
      quantity: 5,
      status: 'approved',
      estimatedCost: '¥3,000',
      finalQuote: '¥3,500',
      paypalLink: 'https://paypal.me/example',
      notes: 'Complete manga series',
      internalNotes: 'Customer is a regular',
      date: '2024-06-08'
    }
  ]);

  // UseCallback for role changes
  const handleRoleChange = useCallback(async (userId: string, newRole: UserRole) => {
    const { error } = await assignRole(userId, newRole);
    if (!error) {
      // Invalidate cache and refetch
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  }, [assignRole, queryClient]);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'users':
        return (
          <UserManagement
            users={users}
            usersLoading={usersLoading}
            refetchUsers={refetchUsers}
            handleRoleChange={handleRoleChange}
          />
        );
      case 'requests':
        return <ProductRequestsManagement orderId={orderId} />;
      case 'storage':
        return <StorageManagement />;
      case 'shipping-requests':
        return <ShippingRequestsManagement shipmentId={shipmentId} />;
      case 'notifications':
        return <NotificationsView />;
      
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <ProductRequestsManagement orderId={orderId} />;
    }
  };

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex w-full">
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMobile={isMobile}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            refetchUsers={refetchUsers}
          />

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-8 min-w-0 overflow-x-auto">
            {/* Mobile header */}
            {isMobile && (
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Menu
                </Button>
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              </div>
            )}

            {renderActiveTab()}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default React.memo(AdminDashboard);
