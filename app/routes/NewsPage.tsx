import { Route } from ".react-router/types/app/routes/+types/NewsPage";
import { getNewPost } from "@/lib/strapi";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { New } from "@/types/strapi-news";
import { useApp } from "@/contexts/AppContext";

export async function loader({ params }: Route.LoaderArgs) {
  const news = await getNewPost(params.newsSlug, params.lang);
  if (!news) {
    throw new Response("Not Found", { status: 404 });
  }
  return news;
}

export default function NewsPage({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;

  const { title, image, content } = loaderData as New;

  const { language, t } = useApp();

  const imageUrl = image?.url
    ? `${import.meta.env.VITE_STRAPI_URL}${image.url}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[400px] bg-gray-900 overflow-hidden">
        {imageUrl && (
          <>
            <img
              src={imageUrl}
              alt={image?.alternativeText || title}
              className="absolute inset-0 w-full h-full object-cover md:object-top opacity-60 object-left"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          </>
        )}

        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto w-full">
          <Link
            to={`/news/${language}`}
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backToNews")}
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12">
          {content && (
            <p className="text-xl text-gray-600 mb-8 font-medium leading-relaxed border-l-4 border-blue-500 pl-4 italic">
              {content}
            </p>
          )}
          <p className="text-gray-500 italic">{t("noContent")}</p>
        </div>
      </article>
    </div>
  );
}
