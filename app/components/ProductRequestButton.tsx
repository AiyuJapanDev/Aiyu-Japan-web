import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useApp } from "@/contexts/AppContext";
import { useLocation, useNavigate, useSearchParams } from "react-router";

interface ProductItem {
  url: string;
  name: string;
  quantity: number;
  notes: string;
}

const ProductRequestButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const { user, isAdmin } = useAuth();
  const { t } = useApp();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [items] = useState<ProductItem[]>([
    { url: "", name: "", quantity: 1, notes: "" },
  ]);

  const isDashboardOnMobile =
    isMobile &&
    (location.pathname === "/user-dashboard" ||
      location.pathname === "/admin-dashboard");

  const fabBottomClass = isDashboardOnMobile ? "bottom-36" : "bottom-6";

  const shouldHide =
    isAdmin ||
    location.pathname === "/auth" ||
    (location.pathname === "/user-dashboard" &&
      (!searchParams.get("tab") || searchParams.get("tab") === "submit"));

  const handleFABClick = () => {
    if (isMobile) {
      setIsMenuOpen(!isMenuOpen);
    } else {
      if (user) {
        navigate("/user-dashboard?tab=submit");
      } else {
        setIsDialogOpen(true);
      }
    }
  };

  const handleMenuAction = () => {
    setIsMenuOpen(false);
    if (user) {
      navigate("/user-dashboard?tab=submit");
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleSignIn = () => {
    setIsDialogOpen(false);
    navigate("/auth");
  };

  if (shouldHide) return null;

  return (
    <>
      {isMobile && isMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="fixed-fab-wrapper group">
        {isMobile && isMenuOpen && (
          <div className={`fixed ${fabBottomClass} right-4 z-40 mb-16 animate-fade-in`}>
            <button
              onClick={handleMenuAction}
              className="bg-white shadow-lg rounded-lg px-5 py-3 flex items-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <Plus className="w-5 h-5 text-capybara-orange" strokeWidth={3} />
              <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                {t("makeOrder")}
              </span>
            </button>
          </div>
        )}

        <button
          onClick={handleFABClick}
          className={`fixed ${fabBottomClass} right-4 z-40 flex items-center justify-center rounded-full 
            bg-capybara-orange shadow-lg
            transition-all duration-300 hover:shadow-xl active:scale-95
            ${isMobile ? 'w-12 h-12' : 'w-14 h-14'}`}
          aria-label={t("makeOrder")}
        >
          <Plus 
            className={`text-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''} ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} 
            strokeWidth={3} 
          />
        </button>
        
        {!isMobile && (
          <div className={`fixed ${fabBottomClass} right-20 z-40 pointer-events-none`}>
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {t("makeOrder")}
              <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-lg p-6"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{t("requestProductsTitle")}</DialogTitle>
            <DialogDescription>
              {t("requestProductsDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {items.map((item, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <Label>{t("productDetails")}</Label>
                </div>
                <Input
                  placeholder={t("productUrlPlaceholder")}
                  value={item.url}
                  className="md:col-span-2"
                />
              </div>
            ))}

            <Button
              onClick={handleSignIn}
              className="w-full bg-[var(--capybara-orange)] transition-all duration-300 hover:bg-capybara-blue"
            >
              {t("signInToSubmit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductRequestButton;
