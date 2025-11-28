import React from "react";
import { useAuth } from "@/contexts/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Link } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallbackMessage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  fallbackMessage,
}) => {
  const { user, loading, isAdmin, userRole } = useAuth();
  const { t } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-300" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
            <CardContent className="p-12 text-center">
              <Lock className="w-16 h-16 text-blue-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("loginRequired")}
              </h2>
              <p className="text-gray-600 mb-8">{t("pleaseSignInToAccess")}</p>
              <Link to="/auth">
                <Button className="bg-blue-300 hover:bg-blue-400 text-white rounded-full px-8 py-3">
                  {t("signIn")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <span className="text-6xl">🚫</span>
              </div>
              <Lock className="w-16 h-16 text-blue-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t("adminAccessRequired")}
              </h2>
              <p className="text-gray-600 mb-4">
                {fallbackMessage || t("defaultFallbackMessage")}
              </p>
              <p className="text-sm text-gray-500 mb-8">
                {t("currentRole")}: {userRole || t("loading")}
              </p>
              <Link to="/dashboard">
                <Button className="bg-blue-300 hover:bg-blue-400 text-white rounded-full px-8 py-3">
                  {t("backToDashboard")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
