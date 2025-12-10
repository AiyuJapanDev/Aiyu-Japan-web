import { Article } from "@/types/blog";
import { HomePageData } from "@/types/home";
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

async function strapiFetchAPI<T>(
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

    console.count("STRAPI API CALL");
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

const getAllBlogArticles = async (
  locale: string = "en",
  pageSize: number = 25
): Promise<{ posts: Article[]; total: number }> => {
  const data = await strapiFetchAPI<StrapiResponse<Article[]>>(
    `/api/articles?locale=&populate[0]=cover&populate[1]=author&pagination[pageSize]=${pageSize}`
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
    `/api/news?locale=&populate[0]=image&pagination[pageSize]=${pageSize}&sort[0]=date:desc`
  );
  return {
    posts: data.data,
    total: data.meta?.pagination?.total || 0,
  };
};

const getHomeComponents = async (language: string): Promise<HomePageData> => {
  const featuredBanner = await strapiFetchAPI<StrapiResponse<HomePageData>>(
    `/api/home?populate[blocks][on][components.featured-banner][populate][blog_posts][populate][0]=cover&locale=${language}`
  );
  return featuredBanner.data;
};

const getHomeBannerCarousel = async () => {
  const data = await strapiFetchAPI<StrapiResponse<any>>(
    `/api/banner?populate[0]=carousell&populate[1]=carousell.image&populate[2]=carousell.article`,
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
    `/api/recommended-stores?sort=sortOrder&locale=&populate=*`
  );
  return data.data;
};

const getStoreCategories = async (locale: string = "*") => {
  const data = await strapiFetchAPI<StrapiResponse<StoreCategory[]>>(
    `/api/store-categories?locale=`
  );
  return data.data;
};

export {
  getAllBlogArticles,
  getHomeBannerCarousel,
  getHomeComponents,
  getAllNewsPosts,
  getStoreCategories,
  getStoreMarkets,
  StrapiError,
};
