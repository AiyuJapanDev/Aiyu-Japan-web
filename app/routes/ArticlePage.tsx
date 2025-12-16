import { Route } from ".react-router/types/app/routes/+types/ArticlePage";
import { useApp } from "@/contexts/AppContext";
import { allBlogPostsEn, allBlogPostsEs } from "@/lib/data.server";
import { getImage } from "@/lib/utils";
import { Article } from "@/types/blog";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router";

import "ckeditor5/ckeditor5-content.css";

export async function loader({ params }: Route.LoaderArgs) {
  const { posts, total } =
    params.lang === "es" ? allBlogPostsEs : allBlogPostsEn;
  const article = posts.find((article) => article.slug === params.articleSlug);
  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }

  return article;
}

export function meta({ loaderData }: Route.ComponentProps) {
  const {
    title,
    content,
    cover,
    publishedAt,
    locale,
    author,
    category,
    description,
  } = loaderData as Article;

  const { src, srcset } = getImage(cover);
  return [
    { title: "Aiyu Japan" },
    {
      property: "og:title",
      content: title,
    },
    {
      property: "og:image",
      content: src,
    },
    {
      name: "description",
      content: description,
    },
    {
      name: "og:type",
      content: "article",
    },
  ];
}

export default function ArticlePage({ loaderData }: Route.ComponentProps) {
  let navigate = useNavigate();
  if (!loaderData) return null;

  const { title, content, cover, publishedAt, locale, author, category } =
    loaderData as Article;

  const { language, t } = useApp();

  const formattedDate = new Date(publishedAt).toLocaleDateString(
    locale || "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Get image
  const { src, srcset } = getImage(cover);
  const sizes = "(min-width: 1260px) 1153px, 94.04vw";

  return (
    <div className="min-h-screen bg-gray-50 pb-20 w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[400px] bg-gray-900 overflow-hidden">
        {src && (
          <>
            <img
              src={src}
              srcSet={srcset}
              sizes={sizes}
              alt={cover?.alternativeText || title}
              className="absolute inset-0 w-full h-full object-cover md:object-top opacity-60 object-left"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          </>
        )}

        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto w-full">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToBlogs")}
          </button>

          {category && (
            <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full mb-4 w-fit">
              {category.name}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl leading-tight">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base">
            {author && (
              <div className="flex items-center">
                <span className="font-semibold">{author.name}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formattedDate}
            </div>
            {/*      {readingTime > 0 && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {readingTime} {t("minRead")}
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {content && (
          <div
            className="bg-white rounded-xl shadow-xl p-8 md:p-12 prose border max-w-none overflow-clip ck-content relative"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </article>
    </div>
  );
}
