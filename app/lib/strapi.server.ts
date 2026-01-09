import { Article } from "@/types/blog";
import { New } from "@/types/strapi-news";
import { StoreCategory, StoreMarket } from "@/types/strapi-stores";

const STRAPI_URL = process.env.VITE_STRAPI_URL;
const STRAPI_API_KEY = process.env.STRAPI_API_KEY;

class StrapiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string
  ) {
    super(message || `Strapi API Error: ${status} ${statusText}`);
    this.name = "StrapiError";
  }
}

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
  error?: {
    status: number;
    name: string;
    message: string;
    details: Record<string, unknown>;
  };
}

export async function strapiFetchAPI<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${STRAPI_API_KEY}`,
  };

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const requestUrl = `${STRAPI_URL}${path}`;

  try {
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new StrapiError(
        response.status,
        response.statusText,
        data?.error?.message || "An error occurred while fetching from Strapi"
      );
    }

    return data;
  } catch (error) {
    console.error(`Error fetching from ${requestUrl}:`);
    if (error instanceof StrapiError) {
      console.error(`Status: ${error.status} ${error.statusText}`);
      console.error(`Message: ${error.message}`);
    } else {
      console.error(error);
    }
    throw error;
  }
}

const getHomepage = async (
  locale: string = "en"
): Promise<{ posts: Article[]; total: number }> => {
  const data = await strapiFetchAPI<StrapiResponse<Article[]>>(
    `/api/home?locale=${locale}&populate=*`
  );
  return {
    posts: data.data,
    total: data.meta?.pagination?.total || 0,
  };
};
const getAllBlogArticles = async (
  locale: string = "en",
  pageSize: number = 25
): Promise<{ posts: Article[]; total: number }> => {
  const data = await strapiFetchAPI<StrapiResponse<Article[]>>(
    `/api/articles?locale=${locale}&populate[0]=cover&populate[1]=author&pagination[pageSize]=${pageSize}&sort=createdAt&populate[blocks][populate]=*`
  );
  return {
    posts: data.data,
    total: data.meta?.pagination?.total || 0,
  };
};

const getAllNewsPosts = async (
  locale: string = "en",
  pageSize: number = 25
): Promise<{ posts: New[]; total: number }> => {
  const data = await strapiFetchAPI<StrapiResponse<New[]>>(
    `/api/news?locale=${locale}&populate[0]=image&pagination[pageSize]=${pageSize}&sort[0]=date:desc`
  );
  return {
    posts: data.data,
    total: data.meta?.pagination?.total || 0,
  };
};

const getHomeComponents = async (language: string): Promise<any> => {
  const data = await strapiFetchAPI<StrapiResponse<any>>(
    `/api/home?locale=${language}&populate[blocks][on][blocks.featured-banner][populate][articles][populate][0]=cover&populate[blocks][on][blocks.featured-articles-carousel][populate]=*&populate[blocks][on][blocks.latest-news][populate]=*&populate[blocks][on][blocks.hero][populate]=*&populate[blocks][on][blocks.card-grid][populate][card][populate][0]=icon&populate[blocks][on][blocks.card-grid][populate]=background&populate[blocks][on][blocks.card-grid][populate][card][populate][1]=List&populate[blocks][on][blocks.comparison-table][populate]=*&populate[blocks][on][blocks.stores-cards-grid][populate]=*&populate[blocks][on][blocks.social-media-iframe][populate]=*&populate[blocks][on][blocks.testimonials][populate]=*&populate[blocks][on][blocks.faqs][populate]=*&populate[blocks][on][blocks.heading-section][populate]=*`
  );
  return data.data;
};

const getHomeBannerCarousel = async (locale: string) => {
  const data = await strapiFetchAPI<StrapiResponse<any>>(
    `/api/banner?locale=${locale}populate[0]=carousell&populate[1]=carousell.image&populate[2]=carousell.article`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_KEY}`,
      },
    }
  );
  return data.data.carousell;
};

/* Recommended Stores */

const getStoreMarkets = async (locale: string = "*") => {
  const data = await strapiFetchAPI<StrapiResponse<StoreMarket[]>>(
    `/api/recommended-stores?locale=${locale}&sort=sortOrder&locale=&populate=*`
  );
  return data.data;
};

const getStoreCategories = async (locale: string = "*") => {
  const data = await strapiFetchAPI<StrapiResponse<StoreCategory[]>>(
    `/api/store-categories`
  );
  return data.data;
};

const getParaguayDeliveryData = async () => {
  const data = await strapiFetchAPI<StrapiResponse<StoreCategory[]>>(
    `/api/paraguay-deliveries`
  );
  return data.data;
};

export const getLocales = async (): Promise<any[]> => {
  const data = await strapiFetchAPI<any>("/api/i18n/locales");
  return data;
};

export {
  getAllBlogArticles,
  getAllNewsPosts,
  getHomeBannerCarousel,
  getHomeComponents,
  getParaguayDeliveryData,
  getStoreCategories,
  getStoreMarkets,
  StrapiError,
};
