import React, { useMemo } from "react";
import { Link } from "react-router";
import { useApp } from "@/contexts/AppContext";
import { getLangSlug } from "@/lib/utils";
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
    <div className="w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-xl">
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
        <CarouselContent>
          {carouselData.map((banner, index) => {
            const imageUrl = `${import.meta.env.VITE_STRAPI_URL}${
              banner.cover?.url
            }`;
            const slug = getLangSlug(banner, language);
            // Construct srcset
            const formats = banner.cover?.formats;
            const srcset = formats
              ? [
                  formats.small
                    ? `${import.meta.env.VITE_STRAPI_URL}${
                        formats.small.url
                      } 500w`
                    : "",
                  formats.medium
                    ? `${import.meta.env.VITE_STRAPI_URL}${
                        formats.medium.url
                      } 750w`
                    : "",
                  formats.large
                    ? `${import.meta.env.VITE_STRAPI_URL}${
                        formats.large.url
                      } 1000w`
                    : "",
                  `${imageUrl} ${banner.cover?.width}w`, // Original as fallback/highest quality
                ]
                  .filter(Boolean)
                  .join(", ")
              : undefined;

            const sizes =
              "(max-width: 640px) 100vw, (max-width: 1024px) 750px, 1000px";

            return (
              <CarouselItem key={`${banner.id}-${index}`}>
                <div className="relative flex-shrink-0 w-full">
                  <Link
                    to={`/blog/${language}/${slug}` || "#"}
                    className="relative block w-full h-full transition-transform hover:scale-105 max-h-[324px] overflow-clip"
                    draggable={false}
                  >
                    <img
                      src={imageUrl}
                      srcSet={srcset}
                      sizes={sizes}
                      alt={banner.cover?.alternativeText || "Banner image"}
                      width={banner.cover?.width}
                      height={banner.cover?.height}
                      className="w-full h-auto object-cover select-none"
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
