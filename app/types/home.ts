import { BlockData, FeaturedBannerBlock } from "./blocks";

export type { FeaturedBannerBlock };

export type HomeBlock = BlockData;

export interface HomePageData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  blocks: HomeBlock[];
}
