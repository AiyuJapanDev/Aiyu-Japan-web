import type { Config } from "@react-router/dev/config";
import "dotenv/config";
import { calculateTotalPages, POSTS_PER_PAGE } from "./app/lib/pagination";
import contentData from "./app/lib/data.server";
import { Article } from "./app/types/blog";
import { New } from "./app/types/strapi-news";

// Helper to generate correct paths: /:lang/:base/:slug
const generateRoutes = (
  basePath: string, // e.g., "blog" (no slash)
  lang: string,
  allPosts: { posts: Article[] | New[]; total: number }
) => {
  const routes: string[] = [];
  const { total, posts } = allPosts;

  // 1. Index Route: /es/blog
  routes.push(`/${lang}/${basePath}`);

  // 2. Pagination Routes: /es/blog/page/2
  const totalPages = calculateTotalPages(total, POSTS_PER_PAGE);
  for (let page = 2; page <= totalPages; page++) {
    routes.push(`/${lang}/${basePath}/page/${page}`);
  }

  // 3. Detail Routes: /es/blog/my-slug
  for (const entry of posts) {
    routes.push(`/${lang}/${basePath}/${entry.slug}`);
  }

  return routes;
};

export default {
  ssr: true,
  // Using async function is safer for data handling
  async prerender() {
    const paths: string[] = [];
    const langs = ["es", "en"];

    // ---------------------------------------------------------
    // 1. STATIC PAGES (Auto-generated for both langs)
    // ---------------------------------------------------------
    // Define your pages without lang prefix
    const staticPages = [
      "", // Represents the root inside the lang (e.g., /es)
      "calculator",
      "contact",
      "store-guide/what-is",
      "store-guide/how-it-works",
      "store-guide/fees",
      "store-guide/commission",
      "store-guide/popular-markets",
      "store-guide/restrictions",
    ];

    // Loop to create /es/contact, /en/contact, etc.
    langs.forEach((lang) => {
      staticPages.forEach((page) => {
        // Avoid double slashes if page is empty string
        const path = page ? `/${lang}/${page}` : `/${lang}`;
        paths.push(path);
      });
    });

    // ---------------------------------------------------------
    // 2. DYNAMIC CONTENT (Blog & News)
    // ---------------------------------------------------------
    // We spread the results of our helper directly into the array
    paths.push(
      ...generateRoutes("blog", "es", contentData.es.blogPosts),
      ...generateRoutes("blog", "en", contentData.en.blogPosts),
      ...generateRoutes("news", "es", contentData.es.newsPosts),
      ...generateRoutes("news", "en", contentData.en.newsPosts)
    );

    return paths;
  },
} satisfies Config;
