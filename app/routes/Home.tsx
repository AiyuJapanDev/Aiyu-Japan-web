import { Route } from ".react-router/types/app/+types/root";
import BlockRenderer from "@/components/blocks/Blockrenderer";
import HeroSection from "@/components/sections/HeroSection";
import { useApp } from "@/contexts/AppContext";
import contentData from "@/lib/data.server";
import { generateMeta } from "@/lib/seo";
import { useEffect } from "react";

export async function loader({ params }: Route.LoaderArgs) {
  const { lang } = params;

  // contentData is keyed by locale code (e.g. "en", "es")
  // Fallback to "en" if "lang" is not found in contentData (or handle 404)
  const currentLangData = contentData[lang] || contentData["en"];

  const homeBlcoks = currentLangData?.homePage?.blocks || [];
  const homeData = {
    articles: currentLangData?.blogPosts || [],
    news: currentLangData?.newsPosts || [],
    markets: currentLangData?.markets || [],
  };

  return {
    homeBlcoks,
    homeData,
    lang,
  };
}

export function meta({ data }: { data: Awaited<ReturnType<typeof loader>> }) {
  const lang = data?.lang || "es";

  const titles: Record<string, { title: string; description: string }> = {
    es: {
      title: "Aiyu Japan | De Japón a Tu Casa",
      description:
        "¡Servicio personalizado de compras en Japón! Compramos por ti y te lo enviamos a tu país.",
    },
    en: {
      title: "Aiyu Japan | From Japan to Your Home",
      description:
        "Personalized Japanese proxy shopping service! We buy for you and ship to your country.",
    },
  };

  const { title, description } = titles[lang] || titles.es;

  return generateMeta({
    title,
    description,
    lang,
    path: "",
  });
}

const Home = ({ loaderData }: Route.ComponentProps) => {
  const { t, language } = useApp();
  const { homeBlcoks, homeData, lang } = loaderData as Awaited<
    ReturnType<typeof loader>
  >;

  const { articles, news } = homeData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[url('/tile_background.png')] bg-repeat">
      <div className="animate-fade-in">
        <HeroSection />
      </div>

      <BlockRenderer blocks={homeBlcoks} lang={lang} contentData={homeData} />
    </div>
  );
};

export default Home;
