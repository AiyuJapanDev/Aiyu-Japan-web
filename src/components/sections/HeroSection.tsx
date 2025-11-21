import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/useAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import YouTubeEmbed from "../ui/youtube-embeded-video";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  showButtons?: boolean;
  showMascot?: boolean;
  mascotImage?: string;
}

const HeroSection = ({
  title,
  subtitle,
  description,
  showButtons = false,
  showMascot = true,
  mascotImage = "MascotBox.png",
}: HeroSectionProps) => {
  const { t } = useApp();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleClick = () => {
    if (user && !isAdmin) {
      navigate("/user-dashboard?tab=submit");
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleSignIn = () => {
    setIsDialogOpen(false);
    navigate("/auth");
  };

  return (
    <section className="relative overflow-hidden animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-16">
        <div
          className={`${
            showMascot && "md:grid md:grid-cols-2 md:items-center md:text-left"
          } flex-col justify-center text-center max-w-5xl mx-auto`}
        >
          {/* Mascot - Top on mobile, right on desktop */}
          {showMascot && (
            <div className="flex md:hidden justify-center mb-2 -mt-10 animate-scale-in">
              <img
                src={mascotImage}
                alt="Capybara Mascot"
                className="w-24 md:w-48"
              />
            </div>
          )}

          {/* Text Content */}
          <div className="md:order-1">
            <h1 className="text-4xl md:text-5xl font-paytone text-[#3b434d] mb-8 animate-fade-in">
              {title}
            </h1>
            <div>
              <YouTubeEmbed
                videoId="0WErOWz1P5c"
                title={title}
                // Optional: Use your own optimized WebP image here
                thumbnail="/where-to-shop.png"
              />
            </div>

            {showButtons && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-scale-in">
                {/* Request Products button */}
                <Button
                  onClick={handleClick}
                  className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-capybara-orange/20 bg-white/95 shadow-md 
                             transition-all duration-300 hover:scale-105 hover:bg-white/80 active:scale-95"
                >
                  <Plus className="text-capybara-orange h-5 w-5" />
                  <span className="text-base font-medium text-gray-700">
                    {t("makeOrderButton")}
                  </span>
                </Button>

                {/* Store Guide button */}
                <Link to="/store-guide">
                  <Button
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-capybara-orange/20 bg-white/95 shadow-md 
                               transition-all duration-300 hover:scale-105 hover:bg-white/80 active:scale-95"
                  >
                    <ShoppingBag className="text-capybara-orange h-5 w-5" />
                    <span className="text-base font-medium text-gray-700">
                      {t("whereToShop")}
                    </span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mascot - Right on desktop */}
          {showMascot && (
            <div className="hidden md:flex order-1 md:order-2 justify-center animate-scale-in">
              <div className="w-full flex justify-end pr-12 md:pr-16 lg:pr-24 -mt-8">
                <img
                  src={mascotImage}
                  alt="Capybara Mascot"
                  className="w-48 md:w-56 lg:w-64"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog for non-logged-in users */}
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
            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <Label>{t("productDetails")}</Label>
              </div>
              <Input
                placeholder={t("productUrlPlaceholder")}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="md:col-span-2"
              />
            </div>

            <Button
              onClick={handleSignIn}
              className="w-full bg-[var(--capybara-orange)] transition-all duration-300 hover:bg-capybara-blue text-white"
            >
              {t("signInToSubmit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
