import fs from "node:fs/promises";
import path from "node:path";
import {
  getAllBlogArticles,
  getAllNewsPosts,
  getHomeComponents,
  getParaguayDeliveryData,
  getStoreCategories,
  getStoreMarkets,
} from "./strapi.server";

const CACHE_FILE_PATH = path.resolve(
  process.cwd(),
  "node_modules/.cache/aiyu-build-data.json"
);

/* interface CachedData {
  allBlogPostsEs: any;
  allBlogPostsEn: any;
  allNewsPostsEs: any;
  allNewsPostsEn: any;
  homeDataEs: any;
  homeDataEn: any;
  storeMarketsEs: any;
  storeMarketsEn: any;
  storeCategories: any;
  paraguayDeliveries: any;
} */

async function getPrerenderData(): Promise</* CachedData */ any> {
  // Ensure cache directory exists
  const cacheDir = path.dirname(CACHE_FILE_PATH);

  // Try to read from cache (it might fail if file doesn't exist, which is fine)
  try {
    const cached = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    console.log("Reading from build cache...");
    return JSON.parse(cached);
  } catch (error) {
    // Cache miss or error reading
  }

  console.log("Fetching data from Strapi...");

  const { getLocales } = await import("./strapi.server");
  const locales = await getLocales();
  const localeCodes = locales.map((l: any) => l.code);

  console.log(`Found locales: ${localeCodes.join(", ")}`);

  const [storeCategories, paraguayDeliveries] = await Promise.all([
    getStoreCategories(),
    getParaguayDeliveryData(),
  ]);

  const localeDataPromises = localeCodes.map(async (code: string) => {
    const [blogPosts, newsPosts, homePage, markets] = await Promise.all([
      getAllBlogArticles(code, 999),
      getAllNewsPosts(code, 999),
      getHomeComponents(code),
      getStoreMarkets(code),
    ]);
    return {
      code,
      data: {
        blogPosts,
        newsPosts,
        homePage,
        markets,
        storeCategories,
        paraguayDeliveries,
      },
    };
  });

  const localeDataResults = await Promise.all(localeDataPromises);

  const contentData: any = {};
  for (const { code, data } of localeDataResults) {
    contentData[code] = data;
  }

  // Write to cache (Best effort - ignore errors on read-only filesystems like Vercel)
  try {
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(contentData));
  } catch (error) {
    console.warn(
      "Could not write to build cache (likely read-only FS):",
      error
    );
  }

  return contentData;
}

const contentData = await getPrerenderData();

export default contentData;
