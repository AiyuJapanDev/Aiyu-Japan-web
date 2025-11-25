import type { Config } from "@react-router/dev/config";
import { Article } from "./app/types/blog";
import { getAllBlogArticles } from "./app/lib/strapi";
import { supportedLocales } from "./app/lib/i18n";

const slugs: Article[] = await getAllBlogArticles();

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
    "/store-guide",
    "/dashboard",
    "/user-dashboard",
    "/admin-dashboard",
    "/contact",
    "/terms-of-service",
    "/privacy-policy",
    ...supportedLocales.map((locale) => `/${locale}/blog`),
    ...slugs.map((blogEntry: Article) => {
      /* Maps all slugs to prerender articles */
      /* return each entry slug with locale */
      return `/${blogEntry.locale}/blog/${blogEntry.slug}`;
    }),
  ],
} satisfies Config;
