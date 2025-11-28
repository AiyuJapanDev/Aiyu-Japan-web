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

const blogSlugs: Article[] = await getAllBlogArticles();
const newsSlugs: New[] = await getAllNewsPosts();

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
  // return a list of URLs to prerender at build time
  prerender: [
    "/",
    "/services",
    "/auth",
    "/forgot-password",
    "/auth/reset-password",
    "/email-verification",
    "/calculator",
    /* Store Guide Routes */
    "/store-guide/what-is",
    "/store-guide/how-it-works",
    "/store-guide/fees",
    "/store-guide/commission",
    "/store-guide/popular-markets",
    "/store-guide/restrictions",
    /* Dashboard Routes */
    "/dashboard",
    "/user-dashboard",
    "/admin-dashboard",
    /* Contact Routes */
    "/contact",
    /* Terms and Privacy Routes */
    "/terms-of-service",
    "/privacy-policy",
    ...paginatedBlogRoutes,
    ...blogSlugs.map((blogEntry: Article) => {
      /* Maps all blogSlugs to prerender articles */
      /* return each entry slug with locale */
      return `/blog/${blogEntry.locale}/${blogEntry.slug}`;
    }),
    ...paginatedNewsRoutes,
    ...newsSlugs.map((newsEntry: New) => {
      /* Maps all newsSlugs to prerender articles */
      /* return each entry slug with locale */
      return `/news/${newsEntry.locale}/${newsEntry.slug}`;
    }),
  ],
} satisfies Config;
