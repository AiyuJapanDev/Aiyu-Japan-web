import { type BlocksContent } from "@strapi/blocks-react-renderer";

// --- Image Types ---
export interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: string | null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// --- Block Types ---
export interface RichTextBlock {
  __component: "shared.rich-text";
  id: number;
  body: string;
}

export interface QuoteBlock {
  __component: "shared.quote";
  id: number;
  title: string;
  body: string;
}

export interface MediaBlock {
  __component: "shared.media";
  id: number;
  file?: StrapiImage;
}

export interface SliderBlock {
  __component: "shared.slider";
  id: number;
  files?: StrapiImage[];
}

export type ArticleBlock =
  | RichTextBlock
  | QuoteBlock
  | MediaBlock
  | SliderBlock;

// --- Author Type ---
export interface Author {
  id: number;
  documentId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// --- Category Type ---
export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// --- Localization Type ---
export interface ArticleLocalization {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  featured: boolean | null;
}

// --- Main Article Entry Type ---
export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  featured: boolean | null;
  cover: StrapiImage | null;
  author?: Author;
  category?: Category;
  content: BlocksContent;
  localizations?: ArticleLocalization[];
}

// --- Legacy Support (for backward compatibility) ---
export interface SimpleCover {
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}
