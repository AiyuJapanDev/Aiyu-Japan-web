import React from "react";
import { Link } from "react-router";
import { Article } from "@/types/blog";
import { useApp } from "@/contexts/AppContext";
import { getLangSlug } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";

interface FeaturedBlogSliderProps {
  articles: Article[] | undefined;
}

const FeaturedBlogSlider: React.FC<FeaturedBlogSliderProps> = ({
  articles,
}) => {
  const { language } = useApp();

  const displayArticles = React.useMemo(() => {
    if (!articles || articles.length === 0) return [];

    let items = [...articles];
    while (items.length < 6) {
      items = [...items, ...articles];
    }
    return items;
  }, [articles]);

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 xl:px-0 rounded-lg overflow-clip">
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[
          AutoScroll({
            playOnInit: true,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            speed: 1,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {displayArticles.map((blog, index) => {
            const imageUrl = blog.cover?.url
              ? `${import.meta.env.VITE_STRAPI_URL}${blog.cover.url}`
              : "";

            const slug = getLangSlug(blog, language);

            // Construct srcset
            const formats = blog.cover?.formats;
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
                  blog.cover?.width ? `${imageUrl} ${blog.cover.width}w` : "", // Original as fallback/highest quality
                ]
                  .filter(Boolean)
                  .join(", ")
              : undefined;

            const sizes =
              "(max-width: 640px) 100vw, (max-width: 1024px) 750px, 1000px";

            return (
              <CarouselItem
                key={`${blog.id}-${index}`}
                className="pl-4 basis-1/3 mb-6"
              >
                <Link
                  to={`/blog/${language}/${slug}`}
                  className=" block w-full aspect-video rounded-xl overflow-clip shadow-lg transition-transform hover:scale-105 hover:shadow-lg relative group"
                  draggable={false}
                >
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      srcSet={srcset}
                      sizes={sizes}
                      alt={blog.cover?.alternativeText || "Banner image"}
                      width={blog.cover?.width}
                      height={blog.cover?.height}
                      className="w-full h-full object-cover pointer-events-none"
                      draggable={false}
                      loading={index < 5 ? "eager" : "lazy"}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 active:bg-black/10 transition-colors" />
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default FeaturedBlogSlider;
