import { Article, ArticleLocalization } from "@/types/blog";
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
