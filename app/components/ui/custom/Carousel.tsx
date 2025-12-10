import React, { useMemo } from "react";
import { Link } from "react-router";
import { useApp } from "@/contexts/AppContext";
import { getImage, getLangSlug } from "@/lib/utils";
import { Article } from "@/types/blog";
import { HomePageData, FeaturedBannerBlock } from "@/types/home";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface FeaturedBannerCarouselProps {
  data: HomePageData;
}

const FeaturedBannerCarousel: React.FC<FeaturedBannerCarouselProps> = ({
  data,
}) => {
  const { language } = useApp();

  const carouselData = useMemo(() => {
    const featuredBannerBlock = data.blocks.find(
      (block): block is FeaturedBannerBlock =>
        block.__component === "components.featured-banner"
    );

    if (featuredBannerBlock && featuredBannerBlock.blog_posts) {
      return featuredBannerBlock.blog_posts.filter(
        (item) => item.cover !== null && item.cover !== undefined
      );
    }
    return [];
  }, [data]);

  if (carouselData.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-xl">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {carouselData.map((banner, index) => {
            const { src, srcset } = getImage(banner.cover);
            const sizes = "(min-width: 1260px) 1153px, 94.04vw";
            const slug = banner.slug;

            return (
              <CarouselItem key={`${banner.id}-${index}`} className="pl-0">
                <div className="relative flex-shrink-0 w-full">
                  <Link
                    to={`/blog/${language}/${slug}` || "#"}
                    className="relative block w-full transition-transform hover:scale-105 overflow-hidden"
                    draggable={false}
                  >
                    <img
                      src={src}
                      srcSet={srcset}
                      sizes={sizes}
                      alt={banner.cover?.alternativeText || "Banner image"}
                      className="w-full h-auto object-cover select-none"
                      height={banner.cover?.height}
                      width={banner.cover?.width}
                      draggable={false}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </Link>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default FeaturedBannerCarousel;
