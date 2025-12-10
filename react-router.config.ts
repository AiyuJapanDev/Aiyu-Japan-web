import "dotenv/config";
import type { Config } from "@react-router/dev/config";
import { New } from "./app/types/strapi-news";
import { Article } from "./app/types/blog";
import {
  getAllBlogArticles,
  getBlogPosts,
  getAllNewsPosts,
  getNewsPosts,
} from "./app/lib/strapi";
import { supportedLocales } from "./app/lib/i18n";
import { calculateTotalPages, POSTS_PER_PAGE } from "./app/lib/pagination";

const allBlogs: Article[] = await getAllBlogArticles();
const allNews: New[] = await getAllNewsPosts();

// Generate paginated blog routes for each locale
const paginatedBlogRoutes: string[] = [];
const paginatedNewsRoutes: string[] = [];
for (const locale of supportedLocales) {
  const { total } = await getBlogPosts(locale);
  const totalPages = calculateTotalPages(total, POSTS_PER_PAGE);

  // Add base blog route for page 1
  paginatedBlogRoutes.push(`/blog/${locale}`);

  // Add routes for pages 2, 3, 4, etc. with /page/ prefix
  for (let page = 2; page <= totalPages; page++) {
    paginatedBlogRoutes.push(`/blog/${locale}/page/${page}`);
  }
}

for (const locale of supportedLocales) {
  const { total } = await getNewsPosts(locale);
  const totalPages = calculateTotalPages(total, POSTS_PER_PAGE);

  // Add base news route for page 1
  paginatedNewsRoutes.push(`/news/${locale}`);

  // Add routes for pages 2, 3, 4, etc. with /page/ prefix
  for (let page = 2; page <= totalPages; page++) {
    paginatedNewsRoutes.push(`/news/${locale}/page/${page}`);
  }
}

export default {
  ssr: true,
  // return a list of RELEVANT STATIC URLs to prerender at build time
  // Each blog or news entry is rendered at runtime to save API calls and reduce build time
  prerender: [
    "/",
    "/calculator",
    /* Store Guide Routes */
    "/store-guide/what-is",
    "/store-guide/how-it-works",
    "/store-guide/fees",
    "/store-guide/commission",
    "/store-guide/popular-markets",
    "/store-guide/restrictions",
    /* Contact Routes */
    "/contact",
    /* Blog Routes */
    ...paginatedBlogRoutes,
    /* News Routes */
    ...paginatedNewsRoutes,
  ],
} satisfies Config;
