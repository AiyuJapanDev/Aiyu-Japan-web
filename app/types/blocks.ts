import { Article, StrapiImage } from "./blog";

export interface Image {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
}

export interface Logo {
  id: number;
  logoText: string;
  logoLink: string;
  image: Image;
}

export interface Link {
  href: string;
  label: string;
  isExternal: boolean;
  isButtonLink: boolean;
  type: "PRIMARY" | "SECONDARY";
}

export interface SharedCard {
  id: number;
  heading: string;
  icon: Image;
  content: string; // RichText
  List: {
    id: number;
    text: string;
  }[];
}

export interface ComponentFaq {
  id: number;
  question: string;
  answer: string; // RichText
}

export interface GlobalPageHeader {
  logo: Logo;
  navItems: Link[];
  cta: Link;
}

export interface GlobalPageFooter {
  logo: Logo;
  navItems: Link[];
  socialLinks: Logo[];
  text: string;
}

export type ComponentType =
  | "blocks.content-with-image"
  | "blocks.featured-banner"
  | "blocks.featured-articles-carousel"
  | "blocks.latest-news"
  | "blocks.heading-section"
  | "blocks.card-grid"
  | "blocks.comparison-table"
  | "blocks.stores-cards-grid"
  | "blocks.social-media-iframe"
  | "blocks.testimonials"
  | "blocks.faqs"
  | "blocks.hero"
  | "blocks.markdown"
  | "blocks.newsletter"
  | "blocks.person-card"
  | "blocks.featured-articles"
  | "blocks.content-section";

interface BackgroundProps {
  background: boolean;
  transparentBackground: boolean;
}

export interface Base<
  T extends ComponentType,
  D extends object = Record<string, unknown>,
> {
  id?: number;
  __component: T;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  background?: BackgroundProps;
  animate?: boolean;
  data?: D; // Kept for compatibility, but flattened props are preferred
}

// --- Block Interfaces ---

export interface HeadingSectionBlock extends Base<"blocks.heading-section"> {
  subHeading: string;
  heading: string;
  anchorLink: string;
  paragraph: string; // RichText
}

export interface CardGridBlock extends Base<"blocks.card-grid"> {
  card: SharedCard[];
}

export interface ContentWithImageBlock extends Base<"blocks.content-with-image"> {
  heading: string;
  text: string; // RichText
  link: Link;
  image: StrapiImage;
  reversed: boolean;
}

export interface FaqsBlock extends Base<"blocks.faqs"> {
  faq: ComponentFaq[];
}

export interface FeaturedBannerBlock extends Base<"blocks.featured-banner"> {
  articles: Article[];
}

export interface FeaturedArticlesCarouselBlock extends Base<"blocks.featured-articles-carousel"> {
  // Attributes empty in schema
}

export interface FeaturedArticlesBlock extends Base<"blocks.featured-articles"> {
  articles: Article[];
}

export interface LatestNewsBlock extends Base<"blocks.latest-news"> {
  // Attributes empty in schema
}

export interface StoresCardsGridBlock extends Base<"blocks.stores-cards-grid"> {
  // Attributes empty in schema
}

export interface ComparisonTableBlock extends Base<"blocks.comparison-table"> {
  // Attributes empty in schema
}

export interface SocialMediaIframeBlock extends Base<"blocks.social-media-iframe"> {
  url: string;
}

export interface TestimonialsBlock extends Base<"blocks.testimonials"> {
  // Attributes empty in schema
}

export interface HeroBlock extends Base<"blocks.hero"> {
  heading: string;
  image: Image;
  links: Link[];
  text: string; // RichText
}

export interface MarkdownBlock extends Base<"blocks.markdown"> {
  content: string; // RichText
}

export interface NewsletterBlock extends Base<"blocks.newsletter"> {
  formId: string;
  heading: string;
  label: string;
  placeholder: string;
  text: string;
}

export interface PersonCardBlock extends Base<"blocks.person-card"> {
  image: Image;
  personJob: string;
  personName: string;
  text: string;
}

export type BlockData =
  | HeadingSectionBlock
  | CardGridBlock
  | ContentWithImageBlock
  | FaqsBlock
  | FeaturedBannerBlock
  | FeaturedArticlesCarouselBlock
  | FeaturedArticlesBlock
  | LatestNewsBlock
  | StoresCardsGridBlock
  | ComparisonTableBlock
  | SocialMediaIframeBlock
  | TestimonialsBlock
  | HeroBlock
  | MarkdownBlock
  | NewsletterBlock
  | PersonCardBlock;
