import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/useAuth";
import { Home, Package, Plus, Truck, User } from "lucide-react";
import { Link } from "react-router";
import LogOutBtn from "./LogOutBtn";

export default function MobileAccountMenu() {
  const { t } = useApp();
  const { user, profile } = useAuth();

  // Utility for display name
  const displayName = profile?.full_name?.trim()
    ? profile?.full_name
    : (user?.email ?? "");

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="account" className="border-none">
        <AccordionTrigger className="flex items-center gap-2 py-2.5  rounded-lg hover:bg-accent transition-colors w-full hover:no-underline">
          <div className="flex items-center gap-2 flex-1 text-left">
            <Avatar className="rounded-lg h-8 w-8">
              <AvatarFallback className="rounded-lg bg-capybara-orange text-primary-foreground">
                {displayName[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{"My Account"}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                {user.email}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="ml-4 mt-2 pb-2">
          <div className="flex flex-col gap-6 text-gray-700 text-base">
            {/* New Order */}
            <Link
              to="/user-dashboard?tab=submit"
              className="flex items-center rounded-md hover:bg-accent transition-colors font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("submitRequest") || "New Order"}
            </Link>

            {/* Profile */}
            <Link
              to="/user-dashboard?tab=profile"
              className="flex items-center rounded-md hover:bg-accent transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              {t("profile") || "Profile"}
            </Link>

            {/* Orders */}
            <Link
              to="/user-dashboard?tab=orders"
              className="flex items-center rounded-md hover:bg-accent transition-colors"
            >
              <Package className="h-4 w-4 mr-2" />
              {t("orders") || "Orders"}
            </Link>

            {/* Storage */}
            <Link
              to="/user-dashboard?tab=storage"
              className="flex items-center rounded-md hover:bg-accent transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              {t("storage") || "Storage"}
            </Link>

            {/* Shipping */}
            <Link
              to="/user-dashboard?tab=shipping"
              className="flex items-center rounded-md hover:bg-accent transition-colors"
            >
              <Truck className="h-4 w-4 mr-2" />
              {t("shipping") || "Shipping"}
            </Link>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
