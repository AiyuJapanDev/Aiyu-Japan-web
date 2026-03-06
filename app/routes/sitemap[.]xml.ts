import { SITE_URL } from "@/lib/seo";
import contentData from "@/lib/data.server";

/**
 * Dynamic sitemap.xml route handler.
 * Generates an XML sitemap with hreflang alternates for all public pages.
 */
export async function loader() {
  const langs = ["es", "en"];

  // Static pages (without lang prefix)
  const staticPages = [
    "",
    "calculator",
    "contact",
    "services",
    "help-center",
    "terms-of-service",
    "privacy-policy",
    "store-guide/what-is",
    "store-guide/how-it-works",
    "store-guide/fees",
    "store-guide/commission",
    "store-guide/popular-markets",
    "store-guide/restrictions",
  ];

  // Build URLs
  const urls: Array<{
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
    alternates: Array<{ lang: string; href: string }>;
  }> = [];

  const today = new Date().toISOString().split("T")[0];

  // Static pages
  for (const page of staticPages) {
    for (const lang of langs) {
      const path = page ? `/${lang}/${page}` : `/${lang}`;
      const alternateLang = lang === "es" ? "en" : "es";
      const alternatePath = page
        ? `/${alternateLang}/${page}`
        : `/${alternateLang}`;

      urls.push({
        loc: `${SITE_URL}${path}`,
        lastmod: today,
        changefreq: page === "" ? "daily" : "weekly",
        priority: page === "" ? "1.0" : "0.8",
        alternates: [
          { lang, href: `${SITE_URL}${path}` },
          { lang: alternateLang, href: `${SITE_URL}${alternatePath}` },
          { lang: "x-default", href: `${SITE_URL}/es${page ? `/${page}` : ""}` },
        ],
      });
    }
  }

  // Blog pages
  for (const lang of langs) {
    const { posts } = contentData[lang].blogPosts;

    // Blog index
    urls.push({
      loc: `${SITE_URL}/${lang}/blog`,
      lastmod: today,
      changefreq: "daily",
      priority: "0.9",
      alternates: [
        { lang: "es", href: `${SITE_URL}/es/blog` },
        { lang: "en", href: `${SITE_URL}/en/blog` },
        { lang: "x-default", href: `${SITE_URL}/es/blog` },
      ],
    });

    // Blog articles
    for (const post of posts) {
      urls.push({
        loc: `${SITE_URL}/${lang}/blog/${post.slug}`,
        lastmod: post.publishedAt
          ? new Date(post.publishedAt).toISOString().split("T")[0]
          : today,
        changefreq: "monthly",
        priority: "0.7",
        alternates: [
          { lang: "es", href: `${SITE_URL}/es/blog/${post.slug}` },
          { lang: "en", href: `${SITE_URL}/en/blog/${post.slug}` },
          { lang: "x-default", href: `${SITE_URL}/es/blog/${post.slug}` },
        ],
      });
    }
  }

  // News pages
  for (const lang of langs) {
    const { posts } = contentData[lang].newsPosts;

    // News index
    urls.push({
      loc: `${SITE_URL}/${lang}/news`,
      lastmod: today,
      changefreq: "daily",
      priority: "0.9",
      alternates: [
        { lang: "es", href: `${SITE_URL}/es/news` },
        { lang: "en", href: `${SITE_URL}/en/news` },
        { lang: "x-default", href: `${SITE_URL}/es/news` },
      ],
    });

    // News articles
    for (const post of posts) {
      urls.push({
        loc: `${SITE_URL}/${lang}/news/${post.slug}`,
        lastmod: post.date
          ? new Date(post.date).toISOString().split("T")[0]
          : today,
        changefreq: "monthly",
        priority: "0.6",
        alternates: [
          { lang: "es", href: `${SITE_URL}/es/news/${post.slug}` },
          { lang: "en", href: `${SITE_URL}/en/news/${post.slug}` },
          { lang: "x-default", href: `${SITE_URL}/es/news/${post.slug}` },
        ],
      });
    }
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${url.alternates
  .map(
    (alt) =>
      `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`
  )
  .join("\n")}
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
