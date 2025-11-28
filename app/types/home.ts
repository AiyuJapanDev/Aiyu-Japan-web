import { Article } from "./blog";

export interface FeaturedBannerBlock {
  __component: "components.featured-banner";
  id: number;
  blog_posts: Article[];
}

export type HomeBlock = FeaturedBannerBlock;

export interface HomePageData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blocks: HomeBlock[];
}
