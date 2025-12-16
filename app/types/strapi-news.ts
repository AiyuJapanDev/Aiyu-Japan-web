import { type BlocksContent } from "@strapi/blocks-react-renderer";
import { StrapiImage } from "./blog";

export interface New {
  id: number;
  documentId: string;
  title: string;
  content: string;
  slug: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  image: StrapiImage;
  locale: string;
}
