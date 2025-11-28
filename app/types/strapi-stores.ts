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
