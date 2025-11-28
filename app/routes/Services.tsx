import DetailedHowItWorks from "@/components/sections/DetailedHowItWorks";
import HeroSection from "@/components/sections/HeroSection";
import PricingInfo from "@/components/sections/PricingInfo";
import ShoppingCategories from "@/components/sections/ShoppingCategories";
import { useApp } from "@/contexts/AppContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useEffect } from "react";

const Services = () => {
  const { t } = useApp();

  const { ref: categoriesRef, hasIntersected: categoriesVisible } =
    useIntersectionObserver();
  const { ref: howItWorksRef, hasIntersected: howItWorksVisible } =
    useIntersectionObserver();
  const { ref: pricingRef, hasIntersected: pricingVisible } =
    useIntersectionObserver();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[url('/tile_background.png')] bg-repeat animate-fade-in">
      <HeroSection />

      <div
        ref={howItWorksRef}
        className={`transition-all duration-700 ${howItWorksVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <DetailedHowItWorks />
      </div>
      <div
        ref={categoriesRef}
        className={`transition-all duration-700 ${categoriesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <ShoppingCategories />
      </div>
      <div
        ref={pricingRef}
        className={`transition-all duration-700 ${pricingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <PricingInfo />
      </div>
    </div>
  );
};

export default Services;
