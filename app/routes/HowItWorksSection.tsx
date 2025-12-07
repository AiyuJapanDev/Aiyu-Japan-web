import { useApp } from "@/contexts/AppContext";
import { ArrowRight, Package, Plane, Search, ShoppingCart } from "lucide-react";
import { Route } from ".react-router/types/app/routes/+types/HowItWorksSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import DetailedHowItWorks from "@/components/sections/DetailedHowItWorks";

export async function loader({ params }: Route.LoaderArgs) {
  return null;
}

export const HowItWorksSection = () => {
  const { t } = useApp();

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("howItWorksTitle")}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            {t("howItWorksSubtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop only) */}
          {/*  <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 bg-gray-200 lg:block"></div> */}
          <DetailedHowItWorks />
        </div>

        <div className="mt-16 text-center">
          <Button
            asChild
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700"
          >
            <Link to="/user-dashboard?tab=submit">
              {t("howItWorksCTA")} <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
