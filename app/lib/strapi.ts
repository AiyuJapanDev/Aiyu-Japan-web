import "dotenv/config";

import { Article } from "@/types/blog";
import { HomePageData } from "@/types/home";
import { New } from "@/types/strapi-news";

const STRAPI_URL =
  import.meta.env?.VITE_STRAPI_URL ||
  process.env.VITE_STRAPI_URL ||
  "http://localhost:1337";

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
  const apiKey =
    import.meta.env?.VITE_STRAPI_API_KEY || process.env.VITE_STRAPI_API_KEY;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
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

const getAllBlogArticles = async (): Promise<Article[]> => {
  const data = await strapiFetchAPI<StrapiResponse<Article[]>>(
    `/api/articles?locale=*&filters[category][name][$eq]=news`
  );
  return data.data;
};

const getBlogArticle = async (
  slug: string,
  language: string
): Promise<Article | undefined> => {
  const data = await strapiFetchAPI<StrapiResponse<Article[]>>(
    `/api/articles?locale=${language}&filters[slug][$eq]=${slug}`
  );

  return data.data[0];
};

const getHomeComponents = async (language: string): Promise<HomePageData> => {
  const featuredBanner = await strapiFetchAPI<StrapiResponse<HomePageData>>(
    `/api/home?populate[blocks][on][components.featured-banner][populate][blog_posts][populate][0]=cover&locale=${language}`
  );
  return featuredBanner.data;
};

const getFeaturedBlogArticles = async (
  locale: string = "*"
): Promise<Article[] | undefined> => {
  const data = await strapiFetchAPI<StrapiResponse<Article[]>>(
    `/api/articles?locale=${locale}&filters[featured][$eq]=true&sort[0]=publishedAt:desc&populate[cover][fields][0]=url&populate[cover][fields][1]=alternativeText&populate[cover][fields][2]=width&populate[cover][fields][3]=height&populate[author][fields][0]=name&populate[category][fields][0]=name&populate[localizations][fields][0]=locale&populate[localizations][fields][1]=slug`
  );

  return data.data;
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

/* Gets the last 5 news article by its date of creation in descending order */
const getArticleNews = async ({
  language,
  limit = 5,
}: {
  language: string;
  limit?: number;
}) => {
  const data = await strapiFetchAPI<StrapiResponse<Article[]>>(
    `/api/articles?locale=${language}&filters[category][name][$eq]=news&sort=createdAt:desc&agination[page]=1&pagination[pageSize]=${limit}`
  );
  return data.data;
};

const getBlogPosts = async (
  locale: string = "*",
  page: number = 1,
  pageSize: number = 25
): Promise<{ posts: Article[]; total: number }> => {
  const data = await strapiFetchAPI<StrapiResponse<Article[]>>(
    `/api/articles?locale=${locale}&sort[0]=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate[cover][fields][0]=url&populate[cover][fields][1]=alternativeText&populate[cover][fields][2]=width&populate[cover][fields][3]=height&populate[author][fields][0]=name&populate[category][fields][0]=name`
  );
  return {
    posts: data.data,
    total: data.meta?.pagination?.total || 0,
  };
};

const getNewsPosts = async (
  locale: string = "*",
  page: number = 1,
  pageSize: number = 5
): Promise<{ news: New[]; total: number }> => {
  const data = await strapiFetchAPI<StrapiResponse<New[]>>(
    `/api/news?locale=${locale}&sort[0]=date:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`
  );
  return {
    news: data.data,
    total: data.meta?.pagination?.total || 0,
  };
};

const getAllNewsPosts = async (locale: string = "*"): Promise<New[]> => {
  const data = await strapiFetchAPI<StrapiResponse<New[]>>(
    `/api/news?locale=${locale}&sort[0]=date:desc&populate=*`
  );
  return data.data;
};

const getNewPost = async (slug: string): Promise<New | undefined> => {
  const article = await strapiFetchAPI<StrapiResponse<New[]>>(
    `/api/news?locale=*&filters[slug][$eq]=${slug}&populate=*`
  ).then((res) => {
    return res.data[0];
  });

  return article;
};

export {
  getAllBlogArticles,
  getArticleNews,
  getBlogArticle,
  getBlogPosts,
  getFeaturedBlogArticles,
  getHomeBannerCarousel,
  getHomeComponents,
  getNewsPosts,
  getAllNewsPosts,
  getNewPost,
  StrapiError,
};
