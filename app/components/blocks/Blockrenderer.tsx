import FeaturedBannerCarousel from "../ui/custom/FeaturedBannerCarousel";

import { BlockData, ComponentType } from "@/types/blocks";
import { ComparisonTable } from "../ui/custom/ComparisonTable";
import FeaturedBlogSlider from "../ui/custom/FeaturedBlogSlider";
import { BlockSection } from "./BlockSection";
import ContentSection from "./ContentSection";
import ContentWithImage from "./ContentWithImage";
import Faqs from "./Faqs";
import FeaturedNews from "./FeaturedNews";
import Hero from "./Hero";
import RecommendedStoresSection from "./RecommendedStoresSection";
import { ReviewsSection } from "./ReviewsSection";
import SectionHeading from "./SectionHeading";
import ServiceFeatures from "./ServiceFeatures";
import SocialMediaSection from "./SocialMediaSection";

const componentMap: Record<ComponentType, any> = {
  "blocks.content-with-image": ContentWithImage,
  "blocks.featured-banner": FeaturedBannerCarousel,
  "blocks.featured-articles-carousel": FeaturedBlogSlider,
  "blocks.latest-news": FeaturedNews,
  "blocks.heading-section": SectionHeading,
  "blocks.card-grid": ServiceFeatures,
  "blocks.comparison-table": ComparisonTable,
  "blocks.stores-cards-grid": RecommendedStoresSection,
  "blocks.social-media-iframe": SocialMediaSection,
  "blocks.testimonials": ReviewsSection,
  "blocks.faqs": Faqs,
  "blocks.hero": Hero,
  "blocks.content-section": ContentSection,
  "blocks.markdown": null,
  "blocks.newsletter": null,
  "blocks.person-card": null,
  "blocks.featured-articles": null,
};

function BlockRenderer({
  blocks,
  lang,
  contentData,
}: {
  blocks: any[];
  lang: string;
  contentData: any;
}) {
  if (!blocks) return "No Data";
  if (blocks.length === 0) return null;

  return (
    <div className="block-renderer">
      {blocks.map((block: BlockData) => {
        const Component = componentMap[block.__component];

        return Component ? (
          <BlockSection
            key={block.__component}
            component={block.__component}
            blockBackground={block.background}
            isAnimated={block.animate}
          >
            <Component data={block} lang={lang} contentData={contentData} />
          </BlockSection>
        ) : null;
      })}
    </div>
  );
}

export default BlockRenderer;
