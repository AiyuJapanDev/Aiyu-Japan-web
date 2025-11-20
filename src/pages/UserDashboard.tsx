import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProfileView from '@/components/ProfileView';
import { ProductRequestForm } from '@/components/user/ProductRequestForm';
import { OrdersPage } from '@/components/user/OrdersPage';
import { StoragePage } from '@/components/user/StoragePage';
import { ShippingPage } from '@/components/user/ShippingPage';
import { NotificationsView } from '@/components/user/NotificationsView';
import {
  Package,
  User,
  Bell,
  Truck,
  Plus,
  Menu,
  X,
  Home
} from 'lucide-react';

const UserDashboardContent = () => {
  const { t } = useApp();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('submit');

  // Set active tab from URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['submit', 'orders', 'storage', 'shipping', 'profile', 'notifications'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams.toString()]);

  // Scroll to top when activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const bottomNavItems = [
    { id: 'orders', label: t('orders'), icon: Package },
    { id: 'storage', label: t('storage'), icon: Home },
    { id: 'shipping', label: t('shipping'), icon: Truck },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  const submitItem = { id: 'submit', label: t('submitRequest'), icon: Plus };

  const navigationItems = [submitItem, ...bottomNavItems];

  const Sidebar = () => (
    <div className={`${isMobile ? 'hidden' : 'w-64 bg-white/90 backdrop-blur-sm border-r border-blue-200 min-h-screen'} p-6`}>
      <div className="flex items-center space-x-3 pl-4 mb-8">
        <div>
          <h2 className="font-bold text-gray-800">{t('dashboard')}</h2>
          <p className="text-sm text-gray-600">User Panel</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => navigate(`/user-dashboard?tab=${item.id}`, { replace: true })}
            >
              <IconComponent className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );

  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-capybara-yellow shadow-lg md:hidden">
      <nav className="flex items-stretch justify-around h-16"> {/* stretch items to full height */}
        {bottomNavItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(`/user-dashboard?tab=${item.id}`, { replace: true })}
              className={`bg-white/95 flex flex-1 flex-col justify-center items-center gap-1 transition-all ${isActive
                ? 'text-capybara-orange'
                : 'text-gray-700 hover:text-capybara-orange hover:capybara-cream'
                }`}
            >
              <IconComponent className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <div className={`flex-1 p-4 md:p-8 min-w-0 overflow-x-auto ${isMobile ? 'pb-24' : ''}`}>
          {activeTab === 'submit' && (
            <div className="max-w-2xl">
              <ProductRequestForm />
            </div>
          )}
          {activeTab === 'shipping' && <ShippingPage />}

          {activeTab === 'storage' && <StoragePage />}

          {activeTab === 'orders' && <OrdersPage />}

          {activeTab === 'profile' && <ProfileView />}

          {activeTab === 'notifications' && <NotificationsView />}
        </div>
      </div>

      {/* Mobile bottom navigation */}
      {isMobile && <BottomNav />}
    </div>
  );
};

const UserDashboard = () => {
  return (
    <ProtectedRoute>
      <UserDashboardContent />
    </ProtectedRoute>
  );
};

export default UserDashboard;
