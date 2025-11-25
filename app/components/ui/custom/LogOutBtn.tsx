import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { LogOut } from "lucide-react";
import { useRef, useState } from "react";
import { useLocation } from "react-router";
import { Button } from "../button";
import { cn } from "@/lib/utils";

function LogOutBtn({ className }: { className?: string }) {
  const { t } = useApp();
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        setIsMobileMenuOpen(false);
        await handleSignOut();
      }}
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      <LogOut className="w-4 h-4" />
      <span>{t("logout")}</span>
    </Button>
  );
}

export default LogOutBtn;
