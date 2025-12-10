import fs from "node:fs/promises";
import path from "node:path";
import {
  getAllBlogArticles,
  getAllNewsPosts,
  getHomeComponents,
  getStoreCategories,
  getStoreMarkets,
} from "./strapi.server";
import { Article } from "@/types/blog";
import { New } from "@/types/strapi-news";

const CACHE_FILE_PATH = path.resolve(
  process.cwd(),
  "node_modules/.cache/aiyu-build-data.json"
);

interface CachedData {
  allBlogPosts: { posts: Article[]; total: number };
  allNewsPosts: { posts: New[]; total: number };
  homeData: any;
  storeMarkets: any;
  storeCategories: any;
}

async function getPrerenderData(): Promise<CachedData> {
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
  const [allBlogPosts, allNewsPosts, homeData, storeMarkets, storeCategories] =
    await Promise.all([
      getAllBlogArticles("en", 100),
      getAllNewsPosts("en", 100),
      getHomeComponents("en"),
      getStoreMarkets("en"),
      getStoreCategories(),
    ]);

  const data = {
    allBlogPosts,
    allNewsPosts,
    homeData,
    storeMarkets,
    storeCategories,
  };

  // Write to cache (Best effort - ignore errors on read-only filesystems like Vercel)
  try {
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(data));
  } catch (error) {
    console.warn(
      "Could not write to build cache (likely read-only FS):",
      error
    );
  }

  return data;
}

const { allBlogPosts, allNewsPosts, homeData, storeMarkets, storeCategories } =
  await getPrerenderData();

export { allBlogPosts, allNewsPosts, homeData, storeMarkets, storeCategories };
