import { Article } from "@/types/blog";

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

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
    console.error(`Error fetching from ${requestUrl}:`, error);
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
  const docId = await strapiFetchAPI<StrapiResponse<Article[]>>(
    `/api/articles?locale=*&filters[slug][$eq]=${slug}`
  ).then((res) => {
    return res.data[0].documentId;
  });

  const data = await strapiFetchAPI<StrapiResponse<Article>>(
    `/api/articles/${docId}?locale=${language}`
  );

  return data.data;
};
const getFeaturedBlogArticles = async (): Promise<Article[] | undefined> => {
  const data = await strapiFetchAPI<StrapiResponse<Article[]>>(
    `/api/articles?locale=*&filters[featured][$eq]=true&populate[0]=cover`
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

const getBlogPosts = async (locale: string = "*"): Promise<Article[]> => {
  const data = await strapiFetchAPI<StrapiResponse<Article[]>>(
    `/api/articles?locale=${locale}&sort[0]=publishedAt:desc&populate[cover][fields][0]=url&populate[cover][fields][1]=alternativeText&populate[cover][fields][2]=width&populate[cover][fields][3]=height&populate[author][fields][0]=name&populate[category][fields][0]=name`
  );
  return data.data;
};

export {
  getAllBlogArticles,
  getBlogArticle,
  getHomeBannerCarousel,
  getArticleNews,
  getFeaturedBlogArticles,
  getBlogPosts,
  StrapiError,
};
