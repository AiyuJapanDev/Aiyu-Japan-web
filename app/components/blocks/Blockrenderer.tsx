import FeaturedBannerCarousel from "../ui/custom/Carousel";

import { BlockData, ComponentType } from "@/types/blocks";
import ContentWithImage from "./ContentWithImage";
import FeaturedBlogSlider from "../ui/custom/FeaturedBlogSlider";
import FeaturedNews from "../sections/FeaturedNews";
import ServiceFeatures from "../sections/ServiceFeatures";
import ComparisonTableSection from "../sections/ComparisonTableSection";
import RecommendedStoresSection from "../sections/RecommendedStoresSection";
import SocialMediaSection from "../sections/SocialMediaSection";
import { ReviewsSection } from "../sections/ReviewsSection";
import Faqs from "./Faqs";
import SectionHeading from "./SectionHeading";

const componentMap: Record<ComponentType, any> = {
  "blocks.content-with-image": ContentWithImage,
  "components.featured-banner": FeaturedBannerCarousel,
  "blocks.featured-articles-carousel": FeaturedBlogSlider,
  "blocks.latest-news": FeaturedNews,
  "blocks.heading-section": SectionHeading,
  "blocks.card-grid": ServiceFeatures,
  "blocks.comparison-table": ComparisonTableSection,
  "blocks.stores-cards-grid": RecommendedStoresSection,
  "blocks.social-media-iframe": SocialMediaSection,
  "blocks.testimonials": ReviewsSection,
  "blocks.faqs": Faqs,
};

function BlockRenderer(blocks: BlockData[]) {
  return (
    <div className="block-renderer">
      {blocks.map((block: BlockData) => {
        // console.log(block, "block.data");
        const Component = componentMap[block.__component];
        return Component ? <Component data={block} /> : null;
      })}
    </div>
  );
}

export default BlockRenderer;
