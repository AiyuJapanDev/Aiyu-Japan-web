import { useApp } from "@/contexts/AppContext";
import { StoreMarket } from "@/types/strapi-stores";

export default function RecommendedStoresSection({
  storeMarkets,
}: {
  storeMarkets: StoreMarket[];
}) {
  const { t } = useApp();
  const shops = [
    {
      id: 1,
      image: "banpresto.png",
    },
    {
      id: 2,
      image: "banpresto.png",
    },
    {
      id: 3,
      image: "banpresto.png",
    },
    {
      id: 4,
      image: "banpresto.png",
    },
    {
      id: 5,
      image: "banpresto.png",
    },
    {
      id: 6,
      image: "banpresto.png",
    },
    {
      id: 6,
      image: "banpresto.png",
    },
    {
      id: 6,
      image: "banpresto.png",
    },
    {
      id: 6,
      image: "banpresto.png",
    },
    {
      id: 6,
      image: "banpresto.png",
    },
    {
      id: 6,
      image: "banpresto.png",
    },
    {
      id: 6,
      image: "banpresto.png",
    },
    {
      id: 6,
      image: "banpresto.png",
    },
    {
      id: 6,
      image: "banpresto.png",
    },
    {
      id: 6,
      image: "banpresto.png",
    },
  ];
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
          <div key={shop.id} className="overflow-hidden">
            <a
              href={shop.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Weverse"
            >
              <img
                className="object-cover"
                src={`${import.meta.env.VITE_STRAPI_URL}${shop.logo.url}`}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
