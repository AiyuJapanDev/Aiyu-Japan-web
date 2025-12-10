import { useApp } from "@/contexts/AppContext";
import { StoreMarket } from "@/types/strapi-stores";

export default function RecommendedStoresSection({
  storeMarkets,
}: {
  storeMarkets: StoreMarket[];
}) {
  const { t } = useApp();

  return (
    <div className="py-20 sm:mx-auto px-4 sm:px-[19px] max-w-6xl">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t("recommendedStoresTitle")}
        </h2>
        <p className="text-lg text-gray-600">
          {t("recommendedStoresDescription")}
        </p>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 [&_div]:h-[50px] [&_div]:sm:h-[80px] [&_div]:bg-white [&_div]:border [&_div]:border-[#DFE0E2] [&_div]:rounded-xl [&_div]:flex [&_div]:items-center [&_div]:justify-center">
        {storeMarkets.map((shop) => (
          <a
            key={shop.id}
            href={shop.link}
            target="_blank"
            rel="noopener noreferrer"
            className="h-[50px] sm:h-[80px] bg-white border border-[#DFE0E2] rounded-xl flex items-center justify-center p-2"
            aria-label={shop.title}
          >
            <img
              className="object-contain w-full h-full"
              src={`${import.meta.env.VITE_STRAPI_URL}${shop.logo.url}`}
              alt={shop.title}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
