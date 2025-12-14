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
import { Article } from "@/types/blog";
import { New } from "@/types/strapi-news";

const CACHE_FILE_PATH = path.resolve(
  process.cwd(),
  "node_modules/.cache/aiyu-build-data.json"
);

interface CachedData {
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
  const [
    allBlogPostsEs,
    allBlogPostsEn,
    allNewsPostsEs,
    allNewsPostsEn,
    homeDataEs,
    homeDataEn,
    storeMarketsEs,
    storeMarketsEn,
    storeCategories,
    paraguayDeliveries,
  ] = await Promise.all([
    getAllBlogArticles("es", 999),
    getAllBlogArticles("en", 999),
    getAllNewsPosts("es", 999),
    getAllNewsPosts("en", 999),
    getHomeComponents("es"),
    getHomeComponents("en"),
    getStoreMarkets("es"),
    getStoreMarkets("en"),
    getStoreCategories(),
    getParaguayDeliveryData(),
  ]);

  const data = {
    allBlogPostsEs,
    allBlogPostsEn,
    allNewsPostsEs,
    allNewsPostsEn,
    homeDataEs,
    homeDataEn,
    storeMarketsEs,
    storeMarketsEn,
    storeCategories,
    paraguayDeliveries,
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

const {
  allBlogPostsEs,
  allBlogPostsEn,
  allNewsPostsEs,
  allNewsPostsEn,
  homeDataEs,
  homeDataEn,
  storeMarketsEs,
  storeMarketsEn,
  storeCategories,
  paraguayDeliveries,
} = await getPrerenderData();

export {
  allBlogPostsEs,
  allBlogPostsEn,
  allNewsPostsEs,
  allNewsPostsEn,
  homeDataEs,
  homeDataEn,
  storeMarketsEs,
  storeMarketsEn,
  storeCategories,
  paraguayDeliveries,
};
