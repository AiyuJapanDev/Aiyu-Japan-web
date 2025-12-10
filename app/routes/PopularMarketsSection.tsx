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
import { storeCategories, storeMarkets } from "@/lib/data.server";
import { StoreCategory, StoreMarket } from "@/types/strapi-stores";
import { ExternalLink } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";

const MARKETS_PER_PAGE = 12;

export async function loader({ params }: Route.LoaderArgs) {
  const page = params.page ? parseInt(params.page, 10) : 1;

  return {
    storeCategories,
    storeMarkets,
    currentPage: page,
  };
}

export const PopularMarketsSection = ({ loaderData }: Route.ComponentProps) => {
  const { t, language } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";

  const { storeCategories, storeMarkets, currentPage } = loaderData as {
    storeCategories: StoreCategory[];
    storeMarkets: StoreMarket[];
    currentPage: number;
  };

  //store categories
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

  const filteredMarkets = getFilteredMarkets();
  const totalFiltered = filteredMarkets.length;
  const totalPages = Math.ceil(totalFiltered / MARKETS_PER_PAGE);

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const currentMarkets = filteredMarkets.slice(
    (currentPage - 1) * MARKETS_PER_PAGE,
    currentPage * MARKETS_PER_PAGE
  );

  const handleCategoryChange = (value: string) => {
    // Navigate to page 1 with new category
    navigate(`/store-guide/popular-markets?category=${value}`);
  };

  const StoreCard = ({ market }: { market: StoreMarket }) => {
    const src = `${import.meta.env.VITE_STRAPI_URL}${market.logo.url}`;
    return (
      <div className="overflow-clip border group relative rounded-2xl bg-white  shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl col-span-1">
        <div className=" mb-4 flex items-center justify-between bg-capybara-blue px-4 py-2">
          <div className="rounded-full border overflow-clip w-20 p-1 ">
            <img
              src={src}
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
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            {market.title}
          </h3>
          <p className="mb-4 text-gray-600">{market.description}</p>
          <div className=" space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("marketsMainCategory")}
            </p>
            <div className="flex flex-wrap gap-2">
              {market.store_categories.length > 1 &&
                market.store_categories.map((category) => (
                  <span
                    key={category.name_en}
                    className="rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                  >
                    {category.name_en}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={label["en"]} value={key}>
                    {label["en"]}
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
          {currentMarkets.map((market, index) => (
            <StoreCard key={market.title + index} market={market} />
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 pb-16">
            {/* Previous Button */}
            {hasPrevPage ? (
              <Link
                to={`/store-guide/popular-markets/${currentPage - 1 === 1 ? "" : `page/${currentPage - 1}`}?${searchParams.toString()}`}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                {t("previous")}
              </Link>
            ) : (
              <button
                disabled
                className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed font-medium"
              >
                {t("previous")}
              </button>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  const isCurrentPage = page === currentPage;
                  const isFirstPage = page === 1;

                  return (
                    <Link
                      key={page}
                      to={`/store-guide/popular-markets/${isFirstPage ? "" : `page/${page}`}?${searchParams.toString()}`}
                      className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                        isCurrentPage
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </Link>
                  );
                }
              )}
            </div>

            {/* Next Button */}
            {hasNextPage ? (
              <Link
                to={`/store-guide/popular-markets/page/${currentPage + 1}?${searchParams.toString()}`}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                {t("next")}
              </Link>
            ) : (
              <button
                disabled
                className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed font-medium"
              >
                {t("next")}
              </button>
            )}
          </div>
        )}
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
