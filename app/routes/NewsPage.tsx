import { Route } from ".react-router/types/app/routes/+types/NewsPage";
import { allNewsPosts } from "@/lib/data.server";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { New } from "@/types/strapi-news";
import { useApp } from "@/contexts/AppContext";
import RichTextBlockRenderer from "@/components/ui/custom/RichTextBlockRenderer";
import { getImage } from "@/lib/utils";

const getNewPost = (slug: string) => {
  return allNewsPosts.posts.find((post) => post.slug === slug);
};

export async function loader({ params }: Route.LoaderArgs) {
  const news = getNewPost(params.newsSlug);
  if (!news) {
    throw new Response("Not Found", { status: 404 });
  }
  return news;
}

export default function NewsPage({ loaderData }: Route.ComponentProps) {
  let navigate = useNavigate();
  if (!loaderData) return null;

  const { title, image, content } = loaderData as New;

  const { t } = useApp();

  // Get image
  const { src, srcset } = getImage(image);
  const sizes = "(min-width: 1260px) 1153px, 94.04vw";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[400px] bg-gray-900 overflow-hidden">
        {image && (
          <>
            <img
              src={src}
              srcSet={srcset}
              sizes={sizes}
              alt={image?.alternativeText || title}
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
            {t("backToNews")}
          </button>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12">
          <RichTextBlockRenderer content={content} />
        </div>
      </article>
    </div>
  );
}
