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
  const [items] = useState<ProductItem[]>([
    { url: "", name: "", quantity: 1, notes: "" },
  ]);

  const isDashboardOnMobile =
    isMobile &&
    (location.pathname === "/user-dashboard" ||
      location.pathname === "/admin-dashboard");

  const fabBottomClass = isDashboardOnMobile ? "bottom-20" : "bottom-4";

  const shouldHide =
    isAdmin ||
    location.pathname === "/auth" ||
    (location.pathname === "/user-dashboard" &&
      (!searchParams.get("tab") || searchParams.get("tab") === "submit"));

  const handleFABClick = () => {
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
      <button
        onClick={handleFABClick}
        className={`fixed ${fabBottomClass} right-3 z-40 flex items-center justify-center gap-2 px-6 py-3 rounded-full 
          bg-capybara-orange shadow-md 
          transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95`}
        aria-label={t("makeOrderButton")}
      >
        <Plus className="text-white h-5 w-5" />
        <span className="text-sm font-medium text-white">
          {t("makeOrderButton")}
        </span>
      </button>

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
