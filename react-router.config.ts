import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // return a list of URLs to prerender at build time
  prerender:
[ "/", "/services", "/auth", "/forgot-password", "/auth/reset-password", "/email-verification", "/calculator", "/store-guide", "/dashboard", "/user-dashboard", "/admin-dashboard", "/contact", "/terms-of-service", "/privacy-policy", "/"]

} satisfies Config;
