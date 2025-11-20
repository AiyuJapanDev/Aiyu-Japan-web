
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProtectedRoute from '@/components/ProtectedRoute';

const DashboardContent = () => {
  const { user, loading, isAdmin, userRole } = useAuth();
  const navigate = useNavigate();

  console.log('Dashboard - user:', user?.id, 'loading:', loading, 'userRole:', userRole, 'isAdmin:', isAdmin);

  useEffect(() => {
    // Only redirect if we have a user and userRole is determined
    if (user && userRole !== null) {
      console.log('Dashboard - redirecting based on role:', userRole);
      if (userRole === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/user-dashboard', { replace: true });
      }
    }
  }, [user, userRole, navigate]);

  // Loader while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-300" />
          <Skeleton className="h-8 w-52 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    );
  }

  // Loader while userRole is still being fetched (user exists but role is null)
  if (user && userRole === null) {
    return (
      <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-44" />
          <p className="text-sm text-gray-500">Loading user role...</p>
        </div>
      </div>
    );
  }

  // If user exists and has a role, the useEffect should handle redirection
  // This should not render, but just in case show a loader
  if (user && userRole) {
    return (
      <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // This should not render since ProtectedRoute handles unauthenticated users
  return null;
};

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

export default Dashboard;
