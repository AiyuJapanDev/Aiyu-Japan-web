import React from "react";
import Carousel from "../ui/custom/Carousel";
import FeaturedBlogSlider from "../ui/custom/FeaturedBlogSlider";
import { HomePageData } from "@/types/home";
import { Article } from "@/types/blog";

interface FeaturedBlogProps {
  homeData: HomePageData;
  featuredArticles: Article[] | undefined;
}

const FeaturedBlog: React.FC<FeaturedBlogProps> = ({
  homeData,
  featuredArticles,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto py-4 space-y-4 px-4">
      <Carousel data={homeData} />
      <FeaturedBlogSlider articles={featuredArticles} />
    </section>
  );
};

export default FeaturedBlog;
