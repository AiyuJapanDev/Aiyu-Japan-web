
import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Crown, X, Package, Users, FileText, Settings, Truck, Warehouse, Bell } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobile: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  refetchUsers: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isMobile, 
  sidebarOpen, 
  setSidebarOpen,
  refetchUsers
}) => {
  const navigate = useNavigate();
  const navigationItems = [
    { id: 'requests', label: 'Product Requests', icon: Package },
    { id: 'storage', label: 'Storage', icon: Warehouse },
    { id: 'shipping-requests', label: 'Shipping Requests', icon: Truck },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm border-r border-blue-200 transform transition-transform duration-300' : 'w-64 bg-white/90 backdrop-blur-sm border-r border-blue-200 min-h-screen'} ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'} p-6`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center">
            <Crown className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Admin Panel</h2>
            <p className="text-sm text-gray-600">Website Management</p>
          </div>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => {
              navigate(`/admin-dashboard?tab=${item.id}`, { replace: true });
              if (isMobile) setSidebarOpen(false);
              if (item.id === 'users') refetchUsers();
            }}
          >
            <IconComponent className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
