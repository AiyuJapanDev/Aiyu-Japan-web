import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import {
  ChevronsUpDown,
  MapPin,
  Package,
  Plus,
  User,
  Bell,
  Truck,
  Home,
  Coins,
  JapaneseYen,
  Info
} from "lucide-react";
import { Link } from "react-router";
import LogOutBtn from "./LogOutBtn";
import { Button } from "../button";

export default function MyAccountMenu() {
  const { t } = useApp();
  const { user, profile } = useAuth();
  const { unreadCount } = useNotifications();

  // Utility for display name
  const displayName = profile?.full_name?.trim()
    ? profile?.full_name
    : (user?.email ?? "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 py-2.5 rounded-lg hover:bg-accent transition-colors">
        <Avatar className="rounded-lg h-8 w-8">
          <AvatarFallback className="rounded-lg bg-capybara-orange text-primary-foreground">
            {displayName[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="text-start flex flex-col">
          <p className="text-xs font-medium">{t("myAccountLabel")}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
            {user.email}
          </p>
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-orange-600 transition-colors cursor-pointer">
                <JapaneseYen className="h-3.5 w-3.5 shrink-0" color="orange" />
                <span className="text-xs">{t("creditLabel")}</span>
                <span className="text-sm font-medium">
                  {profile?.credit_balance?.toLocaleString('en-US') ?? '0'}
                </span>
                <Info className="h-3 w-3 ml-0.5" color="orange" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent 
              className="w-64 p-3 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 shadow-lg"
              align="start"
              side="bottom"
            >
              <div className="flex items-start gap-2">
                <div className="bg-orange-100 p-1.5 rounded-full flex-shrink-0">
                  <Coins className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900 mb-1">
                    {t("creditLabel")} {profile?.credit_balance?.toLocaleString('en-US') ?? '0'}¥
                  </p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    {t("creditTooltip").replace("{amount}", profile?.credit_balance?.toLocaleString('en-US') ?? '0')}
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuSeparator />

        {/* New Order */}
        <DropdownMenuItem asChild>
          <Link
            to="/user-dashboard?tab=submit"
            className="flex items-center cursor-pointer font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("submitRequest") || "New Order"}
          </Link>
        </DropdownMenuItem>

        {/* Profile */}
        <DropdownMenuItem asChild>
          <Link
            to="/user-dashboard?tab=profile"
            className="flex items-center cursor-pointer"
          >
            <User className="h-4 w-4 mr-2" />
            {t("profile") || "Profile"}
          </Link>
        </DropdownMenuItem>

        {/* Orders */}
        <DropdownMenuItem asChild>
          <Link
            to="/user-dashboard?tab=orders"
            className="flex items-center cursor-pointer"
          >
            <Package className="h-4 w-4 mr-2" />
            {t("orders") || "Orders"}
          </Link>
        </DropdownMenuItem>

        {/* Storage */}
        <DropdownMenuItem asChild>
          <Link
            to="/user-dashboard?tab=storage"
            className="flex items-center cursor-pointer"
          >
            <Home className="h-4 w-4 mr-2" />
            {t("storage") || "Storage"}
          </Link>
        </DropdownMenuItem>

        {/* Shipping */}
        <DropdownMenuItem asChild>
          <Link
            to="/user-dashboard?tab=shipping"
            className="flex items-center cursor-pointer"
          >
            <Truck className="h-4 w-4 mr-2" />
            {t("shipping") || "Shipping"}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout Button */}
        <DropdownMenuItem className="p-0">
          <LogOutBtn className="w-full justify-start" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
