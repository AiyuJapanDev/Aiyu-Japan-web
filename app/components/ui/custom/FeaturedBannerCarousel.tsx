import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getImage } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Link } from "react-router";

interface FeaturedBannerCarouselProps {
  data: any;
  lang: string;
}

const FeaturedBannerCarousel: React.FC<FeaturedBannerCarouselProps> = ({
  data,
  lang,
}) => {
  const carouselData = data.articles;

  if (carouselData.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto rounded-xl overflow-hidden shadow-xl ">
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
                    to={`blog/${slug}`}
                    className="relative block w-full transition-transform hover:scale-105 overflow-hidden"
                    draggable={false}
                  >
                    <img
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
