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

      {/*       <AnimatedSection delay={100}>
        <FeaturedBlog
          homeData={currentData.home}
          featuredArticles={currentData.featured}
        />
      </AnimatedSection>

      <AnimatedSection delay={200}>
        <FeaturedNews newsPosts={currentData.news} />
      </AnimatedSection>

      <AnimatedSection delay={300}>
        <ServiceFeatures />
      </AnimatedSection>

      <AnimatedSection delay={300}>
        <ComparisonTableSection />
      </AnimatedSection>

      <AnimatedSection delay={400}>
        <RecommendedStoresSection storeMarkets={currentData.storeMarkets} />
      </AnimatedSection>

      <AnimatedSection delay={500}>
        <SocialMediaSection />
      </AnimatedSection>

      <AnimatedSection delay={550}>
        <ReviewsSection />
      </AnimatedSection>

      <AnimatedSection delay={600}>
        <div className="mt-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t("faqTitle")}
            </h2>
          </div>
          <div className="mb-12">
            <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg max-w-4xl mx-auto">
              <CardContent className="p-8 space-y-4">
                <Accordion type="single" collapsible>
                  {[
                    [t("faq1Question"), t("faq1Answer")],
                    [t("faq2Question"), t("faq2Answer")],
                    [t("faq3Question"), t("faq3Answer")],
                    [t("faq4Question"), t("faq4Answer")],
                    [t("faq5Question"), t("faq5Answer")],
                    [t("faq6Question"), t("faq6Answer")],
                    [t("faq7Question"), t("faq7Answer")],
                    [t("faq8Question"), t("faq8Answer")],
                    [t("faq9Question"), t("faq9Answer")],
                  ].map(([question, answer], index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border-b border-blue-200"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        {question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 whitespace-pre-line">
                        {answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={800}>
        <ChatAssistant />
      </AnimatedSection> */}
    </div>
  );
};

export default Home;
