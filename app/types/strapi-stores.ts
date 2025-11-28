import { StrapiImage } from "./blog";

export interface StoreCategory {
  id: number;
  documentId: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  color: null | string;
  name_en: string;
  name_es: string;
}

export interface StoreMarket {
  id: number;
  documentId: string;
  title: string;
  description: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  locale: Locale;
  sortOrder: number;
  logo: StrapiImage;
  store_categories: StoreCategory[];
  localizations: any[];
}

export enum Locale {
  En = "en",
  Es = "es",
}
