import { useApp } from "@/contexts/AppContext";
import { getMarketLogo } from "@/lib/utils";

export default function RecommendedStoresSection({
  lang,
  data,
  contentData,
}: {
  lang: string;
  data: any;
  contentData: any;
}) {
  const { t } = useApp();

  const storeMarkets = contentData.markets;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-4 sm:grid-cols-8 gap-2 [&_div]:h-[50px] [&_div]:sm:h-[80px] [&_div]:bg-white [&_div]:border [&_div]:border-[#DFE0E2] [&_div]:rounded-xl [&_div]:flex [&_div]:items-center [&_div]:justify-center">
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
            src={getMarketLogo(shop)}
            alt={shop.title}
          />
        </a>
      ))}
    </div>
  );
}
