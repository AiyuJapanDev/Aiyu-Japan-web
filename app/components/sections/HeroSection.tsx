import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
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
import globeMap from "/global-delivery.png";

interface SlideData {
  id: number;
  bgClass: string;
  title: string;
  titleColor: string;
  subtitle: string;
  subtitleColor: string;

  image?: string;
  CustomVisual?: React.FC;
}

// --- MAIN COMPONENT ---

const HeroSection = () => {
  const { t } = useApp();
  const SLIDES: SlideData[] = [
    {
      id: 1,
      bgClass: "bg-white",
      title: t("heroSlide1Title"),
      titleColor: "text-capybara-blue",
      subtitle: t("heroSlide1TitleSubtitle"),
      subtitleColor: "text-gray-500",
      image: globeMap,
    },
    {
      id: 2,
      bgClass: "bg-capybara-blue",
      title: t("heroSlide2Title"),
      titleColor: "text-white",
      subtitle: "",
      subtitleColor: "",
    },
  ];

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [url, setUrl] = useState("");

  // Autoplay Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // Kept your original logic logic
  const handleSignIn = () => {
    setIsDialogOpen(false);
    navigate("/auth");
  };

  return (
    <section className="relative w-full animate-fade-in ">
      <div className="w-full h-[500px] sm:h-[370px]">
        <div className="relative group w-full h-full bg-gray-100 overflow-hidden">
          {/* SLIDER TRACK */}
          <div
            className="flex w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {SLIDES.map((slide) => (
              <div key={slide.id} className="min-w-full h-full relative">
                <div className={`${slide.bgClass} size-full`}>
                  <div className="relative h-full flex flex-col-reverse sm:flex-row items-center justify-center sm:justify-start py-6 px-8 gap-6 sm:py-0 overflow-hidden sm:mx-auto sm:px-[19px] max-w-[1140px]">
                    {/* Text Content */}
                    <div className="flex flex-col gap-6 sm:gap-12 items-center sm:items-start z-10">
                      <div className="space-y-4 sm:w-[510px] break-words text-center sm:text-left">
                        <p
                          className={`${slide.titleColor} font-bold text-[28px] sm:text-[36px] leading-10`}
                        >
                          {slide.title}
                        </p>
                        {slide.subtitle && (
                          <p className={`${slide.subtitleColor} text-[16px]`}>
                            {slide.subtitle}
                          </p>
                        )}
                      </div>
                      <a href="/login">
                        <button
                          type="button"
                          className={`flex items-center justify-center whitespace-nowrap rounded-3xl font-medium transition-all enabled:active:scale-95 opacity-50 enabled:opacity-100 text-[12px] px-8 h-[44px] border 
                          bubble-btn-primary`}
                        >
                          <span className="font-bold">
                            Login to use the service
                          </span>
                        </button>
                      </a>
                    </div>

                    {/* Visual Content (Image or SVG) */}
                    {slide.image ? (
                      <img
                        src={slide.image}
                        alt="Banner"
                        className="sm:absolute sm:top-6 sm:right-5 w-full sm:w-auto" // Added responsive width control
                      />
                    ) : (
                      slide.CustomVisual && (
                        <div>
                          <slide.CustomVisual />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* NAVIGATION DOTS */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center justify-center space-x-2 z-10">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDotClick(index)}
                aria-label={`Go to Slide ${index + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-3 h-3 bg-capybara-blue"
                    : "w-2 h-2 bg-capybara-blue/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* DIALOG */}
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
              <Label>{t("productDetails")}</Label>
              <Input
                placeholder={t("productUrlPlaceholder")}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
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
