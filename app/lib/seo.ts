const SITE_URL = "https://www.aiyujapan.com";
const DEFAULT_IMAGE = `${SITE_URL}/aiyupreview.png`;
const SITE_NAME = "Aiyu Japan";

interface MetaArgs {
  title: string;
  description: string;
  lang: string;
  path: string; // e.g. "blog", "contact", "store-guide/fees" (no leading slash, no lang prefix)
  image?: string;
  type?: string; // "website" | "article"
}

/**
 * Generates a consistent set of meta tags for a route.
 * Includes: title, description, OG, Twitter, canonical, and hreflang alternates.
 */
export function generateMeta({
  title,
  description,
  lang,
  path,
  image,
  type = "website",
}: MetaArgs) {
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;
  const canonicalPath = path ? `/${lang}/${path}` : `/${lang}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const ogImage = image || DEFAULT_IMAGE;

  // Build alternate lang URL
  const alternateLang = lang === "es" ? "en" : "es";
  const alternatePath = path
    ? `/${alternateLang}/${path}`
    : `/${alternateLang}`;
  const alternateUrl = `${SITE_URL}${alternatePath}`;

  return [
    { title: fullTitle },
    { name: "description", content: description },
    // Open Graph
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:url", content: canonicalUrl },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImage },
    // Canonical
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    // Hreflang alternates
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: lang,
      href: canonicalUrl,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: alternateLang,
      href: alternateUrl,
    },
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: `${SITE_URL}/es${path ? `/${path}` : ""}`,
    },
  ];
}

// Re-export for use in sitemap
export { SITE_URL };
