import React from "react";
import Carousel from "../ui/custom/Carousel";
import FeaturedBlogSlider from "../ui/custom/FeaturedBlogSlider";

const FeaturedBlog: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto py-4 space-y-4">
      <Carousel />
      <FeaturedBlogSlider />
    </section>
  );
};

export default FeaturedBlog;
