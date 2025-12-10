import { Article, ArticleLocalization, StrapiImage } from "@/types/blog";
import { New } from "@/types/strapi-news";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLangSlug = (article: Article, language: string): string => {
  if (article.locale === language) {
    return article.slug;
  }
  if (article.localizations && article.localizations.length > 0) {
    return article.localizations.find(
      (l: ArticleLocalization) => l.locale === language
    )?.slug;
  }
  return article.slug;
};

export const getImage = (
  cover: StrapiImage
): {
  src: string;
  srcset: string;
  sizes: string;
} => {
  if (!cover) {
    return {
      src: "",
      srcset: "",
      sizes: "",
    };
  }
  const baseURL = import.meta.env.VITE_STRAPI_URL;
  const formats = cover?.formats;
  const fallbackUrl = formats?.large?.url;
  // Construct srcset
  const srcset = [
    formats.large && `${baseURL}${formats.large.url} 1000w`,
    formats.medium && `${baseURL}${formats.medium.url} 750w`,
    formats.small && `${baseURL}${formats.small.url} 500w`,
    formats.thumbnail && `${baseURL}${formats.thumbnail.url} 245w`,
  ]
    .filter(Boolean)
    .join(", ");

  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 750px, 1000px";

  return {
    src: fallbackUrl,
    srcset,
    sizes,
  };
};
