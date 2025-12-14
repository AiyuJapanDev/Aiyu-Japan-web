import type { Route } from ".react-router/types/app/routes/+types/Blog";
import { POSTS_PER_PAGE, calculateTotalPages } from "@/lib/pagination";
import type { New } from "@/types/strapi-news";
import { format } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { Calendar, Newspaper } from "lucide-react";
import { Link } from "react-router";

import { useApp } from "@/contexts/AppContext";
import { allNewsPostsEn, allNewsPostsEs } from "@/lib/data.server";

export async function loader({ params }: Route.LoaderArgs) {
  const page = params.page ? parseInt(params.page, 10) : 1;
  const { posts, total } =
    params.lang === "es" ? allNewsPostsEs : allNewsPostsEn;

  const totalPages = calculateTotalPages(total, POSTS_PER_PAGE);

  return {
    posts,
    currentPage: page,
    totalPages,
    total,
    locale: params.lang,
  };
}

export default function News({ loaderData }: Route.ComponentProps) {
  const { t, language } = useApp();
  if (!loaderData) return null;
  const { posts, currentPage, totalPages, locale } = loaderData as {
    posts: New[];
    currentPage: number;
    totalPages: number;
    total: number;
    locale: string;
  };

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const NewsCard = ({
    news,
    className = "",
  }: {
    news: New;
    className?: string;
  }) => (
    <Link
      to={`/news/${language}/${news.slug}`}
      className={`relative px-6 py-2 group flex flex-row gap-6 h-full items-center bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="absolute w-2 h-full inset-0 bg-capybara-blue" />
      {/* Image */}
      <div className="relative h-24 w-24 overflow-hidden rounded-lg">
        {news.image ? (
          <img
            src={`${news.image.url}`}
            alt={news.image.alternativeText || news.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Newspaper className="w-8 h-8 opacity-50" />
          </div>
        )}
      </div>

      <div className=" flex flex-col flex-grow">
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <time dateTime={news.date.toString()} className="flex items-center">
            <Calendar className="w-3 h-3 mr-1.5" />
            {format(new Date(news.date), "PPP", {
              locale: locale === "es" ? es : enUS,
            })}
          </time>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
          {news.title}
        </h3>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('/tile_background.png')] opacity-10" />

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            dangerouslySetInnerHTML={{ __html: t("newsBlogTitle") }}
          />
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t("newsBlogSubtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative z-20">
        {/* All Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-gray-900 w-2 h-8 rounded-full inline-block"></span>
            {t("newsBlogAllNews")}
          </h2>
          {posts.length > 0 ? (
            <>
              <div className="flex flex-col gap-4 mb-12">
                {posts.map((post) => (
                  <NewsCard key={post.id} news={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pb-16">
                  {/* Previous Button */}
                  {hasPrevPage ? (
                    <Link
                      to={`/blog/${currentPage - 1 === 1 ? "" : `/page/${currentPage - 1}`}`}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      {t("previous")}
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed font-medium"
                    >
                      {t("previous")}
                    </button>
                  )}

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        const isCurrentPage = page === currentPage;
                        const isFirstPage = page === 1;

                        return (
                          <Link
                            key={page}
                            to={`/blog/${isFirstPage ? "" : `/page/${page}`}`}
                            className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                              isCurrentPage
                                ? "bg-blue-600 text-white"
                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </Link>
                        );
                      }
                    )}
                  </div>

                  {/* Next Button */}
                  {hasNextPage ? (
                    <Link
                      to={`/blog/page/${currentPage + 1}`}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      {t("next")}
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed font-medium"
                    >
                      {t("next")}
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {t("newsBlogNoNewsFound")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
