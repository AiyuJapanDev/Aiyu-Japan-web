import DetailedHowItWorks from "@/components/sections/DetailedHowItWorks";
import HeroSection from "@/components/sections/HeroSection";
import PricingInfo from "@/components/sections/PricingInfo";
import ShoppingCategories from "@/components/sections/ShoppingCategories";
import { useApp } from "@/contexts/AppContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useEffect } from "react";
import { generateMeta } from "@/lib/seo";
import type { Route } from ".react-router/types/app/routes/+types/Services";

export async function loader({ params }: Route.LoaderArgs) {
  return { lang: params.lang || "es" };
}

export function meta({ data }: { data: Awaited<ReturnType<typeof loader>> }) {
  const lang = data?.lang || "es";
  const titles: Record<string, { title: string; description: string }> = {
    es: {
      title: "Servicios",
      description: "Conoce todos nuestros servicios de compras en Japón: proxy shopping, envío internacional y más.",
    },
    en: {
      title: "Services",
      description: "Discover all our Japanese shopping services: proxy shopping, international shipping & more.",
    },
  };
  const { title, description } = titles[lang] || titles.es;
  return generateMeta({ title, description, lang, path: "services" });
}

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
