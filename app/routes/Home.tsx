import { Route } from ".react-router/types/app/+types/root";
import BlockRenderer from "@/components/blocks/Blockrenderer";
import HeroSection from "@/components/sections/HeroSection";
import { useApp } from "@/contexts/AppContext";
import contentData from "@/lib/data.server";
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

export function meta() {
  return [
    { title: "Aiyu Japan" },
    {
      property: "og:title",
      content: "Aiyu Japan | From Japan to Your Home Anyday",
    },
    {
      name: "description",
      content:
        "We are passionate about connecting different cultures and building great services. Login to use our service and find out more!.",
    },
  ];
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
