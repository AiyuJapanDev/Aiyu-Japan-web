import { Route } from ".react-router/types/app/routes/+types/PopularMarketsSection";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/contexts/AppContext";
import { getStoreCategories, getStoreMarkets } from "@/lib/strapi";
import { StoreCategory, StoreMarket } from "@/types/strapi-stores";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const storeCategories = await getStoreCategories();
  const storeMarkets = await getStoreMarkets();
  if (!storeCategories) {
    throw new Response("Not Found", { status: 404 });
  }
  return { storeCategories, storeMarkets };
}

export const PopularMarketsSection = ({ loaderData }: Route.ComponentProps) => {
  const { t, language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { storeCategories, storeMarkets } = loaderData as {
    storeCategories: StoreCategory[];
    storeMarkets: StoreMarket[];
  };
  const allCategories = {
    all: {
      en: "All Categories",
      es: "Todas las Categorías",
    },
  };

  let categoryLabels = storeCategories.reduce(
    (acc, category) => {
      acc[category.slug] = {
        en: category.name_en,
        es: category.name_es,
      };
      return acc;
    },
    {} as Record<string, { en: string; es: string }>
  );

  categoryLabels = {
    ...allCategories,
    ...categoryLabels,
  };

  const getFilteredMarkets = () => {
    // Filter by language first
    const marketsByLanguage = storeMarkets.filter(
      (market) => market.locale === language
    );

    // If "all" is selected, return all markets for the current language
    if (selectedCategory === "all") {
      return marketsByLanguage;
    }

    // Filter by selected category
    return marketsByLanguage.filter((market) =>
      market.store_categories.some(
        (category) => category.slug === selectedCategory
      )
    );
  };

  const StoreCard = (market: StoreMarket, index: number) => (
    <div
      key={index}
      className="overflow-clip border group relative rounded-2xl bg-white  shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl col-span-1"
    >
      <div className=" mb-4 flex items-center justify-between bg-capybara-blue px-4 py-2">
        <div className="rounded-full border overflow-clip w-20 p-1 ">
          <img
            src={`${import.meta.env.VITE_STRAPI_URL}${market.logo.url}`}
            alt={market.title}
            className="w-full h-full rounded-full"
          />
        </div>
        <Button
          asChild
          className="flex p-6 items-center justify-center gap-2 rounded-xl bg-gray-800  py-3 font-medium text-white transition-colors hover:bg-gray-700"
        >
          <Link to={market.link} target="_blank">
            {t("marketsExplore")}
            <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="px-4 pb-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900">{market.title}</h3>
        <p className="mb-4 text-gray-600">{market.description}</p>
        <div className=" space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t("marketsMainCategory")}
          </p>
          <div className="flex flex-wrap gap-2">
            {market.store_categories.map((category) => (
              <span className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                {category.name_en}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("marketsTitle")}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            {t("marketsSubtitle")}
          </p>
        </div>

        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {selectedCategory
            ? categoryLabels?.[selectedCategory]?.[language]
            : allCategories?.[language]}
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getFilteredMarkets().map((market, index) =>
            StoreCard(market, index)
          )}
        </div>

        <div className="mt-16 rounded-3xl bg-white p-8 shadow-lg md:p-12">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                {t("marketsNotFoundTitle")}
              </h3>
              <p className="max-w-xl text-gray-600">
                {t("marketsNotFoundDesc")}
              </p>
            </div>
            <button className="flex-shrink-0 rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700">
              {t("marketsContactSupport")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularMarketsSection;
