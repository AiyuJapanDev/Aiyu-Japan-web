import type { Route } from ".react-router/types/app/routes/+types/Blog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { POSTS_PER_PAGE, calculateTotalPages } from "@/lib/pagination";
import type { Article } from "@/types/blog";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Link } from "react-router";

import { useApp } from "@/contexts/AppContext";
import { allBlogPostsEn, allBlogPostsEs } from "@/lib/data.server";
import { getImage } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

export async function loader({ params }: Route.LoaderArgs) {
  const page = params.page ? parseInt(params.page, 10) : 1;
  const { posts, total } =
    params.lang === "es" ? allBlogPostsEs : allBlogPostsEn;
  const featuredPosts = posts.filter((post) => post.featured);
  const totalPages = calculateTotalPages(total, POSTS_PER_PAGE);

  return {
    posts,
    featuredPosts,
    currentPage: page,
    totalPages,
    total,
    locale: params.lang,
  };
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { t, language } = useApp();
  if (!loaderData) return null;
  const { posts, featuredPosts, currentPage, totalPages } = loaderData as {
    posts: Article[];
    featuredPosts?: Article[];
    currentPage: number;
    totalPages: number;
    total: number;
    locale: string;
  };

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  const ArticleCard = ({
    post,
    className = "",
  }: {
    post: Article;
    className?: string;
  }) => {
    const { src, srcset } = getImage(post.cover);
    const sizes = "(min-width: 1260px) 1153px, 94.04vw";
    const slug = post.slug;

    return (
      <Link
        to={`/blog/${language}/${post.slug}`}
        className={`group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 ${className}`}
      >
        <div className="relative h-48 overflow-hidden">
          {post.cover ? (
            <img
              src={src}
              srcSet={srcset}
              sizes={sizes}
              alt={post.cover?.alternativeText || post.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {post.category && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
              {post.category.name}
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
            {post.author && (
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {post.author.name}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
            {post.description}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-blue-600 text-sm font-semibold">
            {t("readMore")}{" "}
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-gray-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('/tile_background.png')] opacity-10" />

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
            dangerouslySetInnerHTML={{ __html: t("blogTitle") }}
          />
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t("blogSubtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 relative z-20">
        {/* Featured Articles Carousel */}
        {featuredPosts && featuredPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-blue-500 w-2 h-8 rounded-full inline-block"></span>
                {t("featuredArticles")}
              </h2>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {featuredPosts.map((post) => (
                  <CarouselItem
                    key={post.id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3"
                  >
                    <ArticleCard post={post} className="h-full" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-12 bg-white/10 hover:bg-white/20 text-white border-none" />
                <CarouselNext className="-right-12 bg-white/10 hover:bg-white/20 text-white border-none" />
              </div>
            </Carousel>
          </div>
        )}

        {/* All Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-gray-900 w-2 h-8 rounded-full inline-block"></span>
            {t("allArticles")}
          </h2>
          {posts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts
                  .slice(
                    (currentPage - 1) * POSTS_PER_PAGE,
                    currentPage * POSTS_PER_PAGE
                  )
                  .map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pb-16">
                  {/* Previous Button */}
                  {hasPrevPage ? (
                    <Link
                      to={
                        currentPage - 1 === 1
                          ? `/blog/${language}`
                          : `/blog/${language}/page/${currentPage - 1}`
                      }
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
                            to={
                              isFirstPage
                                ? `/blog/${language}`
                                : `/blog/${language}/page/${page}`
                            }
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
                      to={`/blog/${language}/page/${currentPage + 1}`}
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
              <p className="text-gray-500 text-lg">{t("noArticlesFound")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
