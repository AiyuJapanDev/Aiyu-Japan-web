import type { Config } from "@react-router/dev/config";
import "dotenv/config";
import {
  allBlogPostsEs,
  allBlogPostsEn,
  allNewsPostsEs,
  allNewsPostsEn,
} from "./app/lib/data.server";
import { calculateTotalPages, POSTS_PER_PAGE } from "./app/lib/pagination";
import { Article } from "./app/types/blog";
import { New } from "./app/types/strapi-news";

const languages = ["es", "en"];

const generateRoutes = (
  base: string,
  allPosts: { posts: Article[] | New[]; total: number }
) => {
  const paginatedRoutes: string[] = [];
  const entriesRoutes: string[] = [];
  const { total } = allPosts;
  const totalPages = calculateTotalPages(total, POSTS_PER_PAGE);

  for (const lang in languages) {
    // Add base blog route for page 1
    paginatedRoutes.push(`${base}/${lang}`);

    // Add routes for pages 2, 3, 4, etc. with /page/ prefix
    for (let page = 2; page <= totalPages; page++) {
      paginatedRoutes.push(`${base}/${lang}/page/${page}`);
    }

    for (const entry of allPosts.posts) {
      entriesRoutes.push(`${base}/${lang}/${entry.slug}`);
    }
  }

  return [...paginatedRoutes, ...entriesRoutes];
};

export default {
  ssr: true,
  // return a list of RELEVANT STATIC URLs to prerender at build time
  // Each blog or news entry is rendered at runtime to save API calls and reduce build time
  prerender: [
    "/",
    "/calculator",
    "/contact",
    /* Store Guide Routes */
    "/store-guide/what-is",
    "/store-guide/how-it-works",
    "/store-guide/fees",
    "/store-guide/commission",
    "/store-guide/popular-markets",
    "/store-guide/restrictions",
    /* Blog Routes */
    ...generateRoutes("/blog", allBlogPostsEs),
    ...generateRoutes("/blog", allBlogPostsEn),
    /* News Routes */
    ...generateRoutes("/news", allNewsPostsEs),
    ...generateRoutes("/news", allNewsPostsEn),
  ],
} satisfies Config;
