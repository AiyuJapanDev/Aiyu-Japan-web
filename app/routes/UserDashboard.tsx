import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSearchParams, useNavigate } from 'react-router';
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
    { id: 'orders', label: t('orders'), desc: t('ordersDesc'), icon: Package },
    { id: 'storage', label: t('storage'), desc: t('storageDesc'), icon: Home },
    { id: 'shipping', label: t('shipping'), desc: t('shippingDesc'), icon: Truck },
    { id: 'profile', label: t('profile'), desc: t('profileDesc'), icon: User },
  ];

  const submitItem = { id: 'submit', label: t('submitRequest'), desc: t('submitRequestDesc'), icon: Plus };

  const navigationItems = [submitItem, ...bottomNavItems];

  const Sidebar = () => (
    <div className={`${isMobile ? 'hidden' : 'w-64 bg-white/90 backdrop-blur-sm border-r border-blue-200 min-h-screen'} p-6`}>
      <div className="flex items-center space-x-3 pl-4 mb-8">
        <div>
          <h2 className="font-bold text-gray-800">{t('dashboard')}</h2>
          <p className="text-sm text-gray-500">User Panel</p>
        </div>
      </div>

      <nav className="space-y-1.5">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 ${
                isActive
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-capybara-orange'
              }`}
              onClick={() => navigate(`/user-dashboard?tab=${item.id}`, { replace: true })}
            >
              <IconComponent className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-capybara-yellow' : ''}`} />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{item.label}</span>
                <span className={`text-[11px] leading-tight ${isActive ? 'text-gray-400' : 'text-gray-400'}`}>
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );

  const BottomNav = () => {
    const mobileLabels: Record<string, string> = {
      orders: t('orders'),
      storage: t('storage'),
      shipping: t('shipping'),
      profile: t('profile'),
    };
    const leftItems = bottomNavItems.filter(i => i.id === 'orders' || i.id === 'storage');
    const rightItems = bottomNavItems.filter(i => i.id === 'shipping' || i.id === 'profile');
    const isSubmitActive = activeTab === 'submit';

    const NavButton = ({ item }: { item: typeof bottomNavItems[0] }) => {
      const IconComponent = item.icon;
      const isActive = activeTab === item.id;
      return (
        <button
          key={item.id}
          onClick={() => navigate(`/user-dashboard?tab=${item.id}`, { replace: true })}
          className={`flex flex-1 flex-col justify-center items-center gap-0.5 transition-all min-w-0 ${isActive
            ? 'text-orange-500'
            : 'text-gray-400 hover:text-orange-400'
          }`}
        >
          <IconComponent className="h-5 w-5" />
          <span className={`text-xs truncate max-w-full px-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
            {mobileLabels[item.id] || item.label}
          </span>
        </button>
      );
    };

    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="absolute left-1/2 -translate-x-1/2 -top-4 z-50">
          <button
            onClick={() => navigate('/user-dashboard?tab=submit', { replace: true })}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-[3px] transition-all active:scale-95 ${
              isSubmitActive
                ? 'bg-orange-500 border-orange-200 text-white'
                : 'bg-orange-400 border-white text-white hover:bg-orange-500'
            }`}
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        <nav className="bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] flex items-stretch h-14 relative">
          {leftItems.map((item) => <NavButton key={item.id} item={item} />)}
          <div className="w-14 shrink-0" />
          {rightItems.map((item) => <NavButton key={item.id} item={item} />)}
        </nav>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex">
        <Sidebar />

        <div className={`flex-1 p-4 md:p-8 min-w-0 overflow-x-auto ${isMobile ? 'pb-24' : ''}`}>
          {activeTab === 'submit' && (
            <div className="max-w-4xl mx-auto">
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
