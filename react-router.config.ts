import type { Config } from "@react-router/dev/config";
import "dotenv/config";
import { allBlogPosts, allNewsPosts } from "./app/lib/data.server";
import { calculateTotalPages, POSTS_PER_PAGE } from "./app/lib/pagination";
import { Article } from "./app/types/blog";
import { New } from "./app/types/strapi-news";

console.count("TIMES react-router.config.ts is run: ");

const generateRoutes = (
  base: string,
  allPosts: { posts: Article[] | New[]; total: number }
) => {
  const paginatedRoutes: string[] = [];
  const entriesRoutes: string[] = [];
  const { total } = allPosts;
  const totalPages = calculateTotalPages(total, POSTS_PER_PAGE);

  console.log("totalPages", totalPages);

  // Add base blog route for page 1
  paginatedRoutes.push(base);

  // Add routes for pages 2, 3, 4, etc. with /page/ prefix
  for (let page = 2; page <= totalPages; page++) {
    paginatedRoutes.push(`${base}/page/${page}`);
  }

  for (const entry of allPosts.posts) {
    entriesRoutes.push(`${base}/${entry.slug}`);
  }

  return [...paginatedRoutes, ...entriesRoutes];
};

console.log(generateRoutes("/blog", allBlogPosts));
console.log(generateRoutes("/news", allNewsPosts));

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
    ...generateRoutes("/blog", allBlogPosts),
    /* News Routes */
    ...generateRoutes("/news", allNewsPosts),
  ],
} satisfies Config;
