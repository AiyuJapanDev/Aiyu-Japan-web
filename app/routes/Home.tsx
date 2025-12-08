import { Route } from ".react-router/types/app/routes/+types/Home";
import ChatAssistant from "@/components/ChatAssistant";
import FeaturedBlog from "@/components/sections/FeaturedBlog";
import FeaturedNews from "@/components/sections/FeaturedNews";
import HeroSection from "@/components/sections/HeroSection";
import RecommendedStoresSection from "@/components/sections/RecommendedStoresSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import ServiceFeatures from "@/components/sections/ServiceFeatures";
import SimpleHowItWorks from "@/components/sections/SimpleHowItWorks";
import SocialMediaSection from "@/components/sections/SocialMediaSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import {
  getAllNewsPosts,
  getFeaturedBlogArticles,
  getHomeComponents,
  getStoreMarkets,
} from "@/lib/strapi";
import React, { useEffect } from "react";
import { useLoaderData } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const [
    homeDataEn,
    homeDataEs,
    featuredArticlesEn,
    featuredArticlesEs,
    newsPostsEn,
    newsPostsEs,
    storeMarkets,
  ] = await Promise.all([
    getHomeComponents("en"),
    getHomeComponents("es"),
    getFeaturedBlogArticles("en"),
    getFeaturedBlogArticles("es"),
    getAllNewsPosts("en"),
    getAllNewsPosts("es"),
    getStoreMarkets("en"),
  ]);

  return {
    en: {
      home: homeDataEn,
      featured: featuredArticlesEn,
      news: newsPostsEn,
      storeMarkets: storeMarkets,
    },
    es: {
      home: homeDataEs,
      featured: featuredArticlesEs,
      news: newsPostsEs,
      storeMarkets: storeMarkets,
    },
  };
}

const AnimatedSection = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{
        transitionDelay: hasIntersected ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
};

const Home = ({ loaderData }: Route.ComponentProps) => {
  const { t, language } = useApp();
  const data = loaderData as Awaited<ReturnType<typeof loader>>;

  const currentData = data[language as keyof typeof data] || data.en;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[url('/tile_background.png')] bg-repeat">
      <div className="animate-fade-in">
        <HeroSection />
      </div>

      <AnimatedSection delay={100}>
        <FeaturedBlog
          homeData={currentData.home}
          featuredArticles={currentData.featured}
        />
      </AnimatedSection>

      <AnimatedSection delay={200}>
        <FeaturedNews newsPosts={currentData.news} />
      </AnimatedSection>

      <AnimatedSection delay={300}>
        <SimpleHowItWorks />
      </AnimatedSection>

      <AnimatedSection delay={300}>
        <ServiceFeatures />
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
        {/* FAQ Section */}
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
      </AnimatedSection>
    </div>
  );
};

export default Home;
