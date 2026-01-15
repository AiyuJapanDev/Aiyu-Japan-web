import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { getImage } from "@/lib/utils";
import AutoScroll from "embla-carousel-auto-scroll";
import React from "react";
import { Link } from "react-router";

interface FeaturedBlogSliderProps {
  lang: string;
  data: any;
  contentData: any;
}

const FeaturedBlogSlider: React.FC<FeaturedBlogSliderProps> = ({
  lang,
  data,
  contentData,
}) => {
  const articles = contentData.articles.posts.filter(
    (post) => post.featured === true
  );
  if (!articles || articles.length === 0) return [];

  let items = [...articles];
  while (items.length < 6) {
    items = [...items, ...articles];
  }
  return (
    <div className="max-w-7xl mx-auto">
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
        className="w-full "
      >
        <CarouselContent className="-ml-4">
          {items.map((blog, index) => {
            const slug = blog.slug;
            const { src, srcset } = getImage(blog.cover);
            const sizes =
              "(min-width: 1280px) 525px, (min-width: 1040px) calc(30.45vw + 141px), (min-width: 780px) calc(63.33vw - 39px), calc(95vw - 43px)";
            console.log(blog);

            return (
              <CarouselItem
                key={`${blog.id}-${index}`}
                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 mb-6"
              >
                <Link
                  to={`blog/${slug}`}
                  className="block w-full aspect-video rounded-xl overflow-clip shadow-lg transition-transform hover:scale-105 hover:shadow-lg relative group"
                  draggable={false}
                >
                  <img
                    src={src}
                    srcSet={srcset}
                    sizes={sizes}
                    alt={blog.cover?.alternativeText || "Banner image"}
                    /*                     width={blog.cover?.width}
                    height={blog.cover?.height} */
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                    loading={index < 5 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-black/0 active:bg-black/10 transition-colors" />
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default FeaturedBlogSlider;
