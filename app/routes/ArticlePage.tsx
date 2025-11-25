import { Route } from ".react-router/types/app/routes/+types/Article";
import { getBlogArticle } from "@/lib/strapi";
import {
  ArticleBlock,
  RichTextBlock,
  QuoteBlock,
  MediaBlock,
  SliderBlock,
  Article,
} from "@/types/blog";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router";
import { ArrowLeft, Calendar, Clock, Quote } from "lucide-react";

export async function loader({ params }: Route.LoaderArgs) {
  const article = await getBlogArticle(params.blogSlug);
  if (!article) {
    throw new Response("Not Found", { status: 404 });
  }
  return article;
}

// Block renderers
function RichTextBlockRenderer({ block }: { block: RichTextBlock }) {
  return (
    <div className="prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl prose-img:shadow-lg">
      <ReactMarkdown>{block.body}</ReactMarkdown>
    </div>
  );
}

function QuoteBlockRenderer({ block }: { block: QuoteBlock }) {
  return (
    <blockquote className="relative border-l-4 border-blue-500 bg-blue-50 p-6 my-8 rounded-r-lg">
      <Quote className="absolute top-4 left-4 w-8 h-8 text-blue-300 opacity-50" />
      <p className="text-lg italic text-gray-700 mb-2 pl-8">{block.body}</p>
      {block.title && (
        <cite className="block text-sm font-semibold text-blue-600 pl-8">
          — {block.title}
        </cite>
      )}
    </blockquote>
  );
}

function MediaBlockRenderer({ block }: { block: MediaBlock }) {
  if (!block.file) return null;

  const imageUrl = `${import.meta.env.VITE_STRAPI_URL}${block.file.url}`;

  return (
    <figure className="my-8">
      <img
        src={imageUrl}
        alt={block.file.alternativeText || "Article image"}
        className="w-full rounded-xl shadow-lg"
      />
      {block.file.caption && (
        <figcaption className="text-center text-sm text-gray-600 mt-2 italic">
          {block.file.caption}
        </figcaption>
      )}
    </figure>
  );
}

function SliderBlockRenderer({ block }: { block: SliderBlock }) {
  if (!block.files || block.files.length === 0) return null;

  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {block.files.map((file) => {
        const imageUrl = `${import.meta.env.VITE_STRAPI_URL}${file.url}`;
        return (
          <figure key={file.id}>
            <img
              src={imageUrl}
              alt={file.alternativeText || "Slider image"}
              className="w-full rounded-xl shadow-lg "
            />
            {file.caption && (
              <figcaption className="text-center text-sm text-gray-600 mt-2 italic">
                {file.caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}

function BlockRenderer({ block }: { block: ArticleBlock }) {
  switch (block.__component) {
    case "shared.rich-text":
      return <RichTextBlockRenderer block={block} />;
    case "shared.quote":
      return <QuoteBlockRenderer block={block} />;
    case "shared.media":
      return <MediaBlockRenderer block={block} />;
    case "shared.slider":
      return <SliderBlockRenderer block={block} />;
    default:
      return null;
  }
}

export default function ArticlePage({ loaderData }: Route.ComponentProps) {
  const {
    title,
    description,
    blocks,
    cover,
    publishedAt,
    locale,
    author,
    category,
  } = loaderData as Article;

  const imageUrl = cover?.url
    ? `${import.meta.env.VITE_STRAPI_URL}${cover.url}`
    : null;

  const formattedDate = new Date(publishedAt).toLocaleDateString(
    locale || "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Estimate reading time from all rich text blocks
  const wordCount =
    blocks
      ?.filter(
        (block): block is RichTextBlock =>
          block.__component === "shared.rich-text"
      )
      .reduce(
        (count, block) => count + (block.body?.split(/\s+/).length || 0),
        0
      ) || 0;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[400px] bg-gray-900 overflow-hidden">
        {imageUrl && (
          <>
            <img
              src={imageUrl}
              alt={cover?.alternativeText || title}
              className="absolute inset-0 w-full h-full object-cover md:object-top opacity-60 object-left"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          </>
        )}

        <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto w-full">
          <Link
            to="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

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
            {readingTime > 0 && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {readingTime} min read
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12">
          {description && (
            <p className="text-xl text-gray-600 mb-8 font-medium leading-relaxed border-l-4 border-blue-500 pl-4 italic">
              {description}
            </p>
          )}

          {/* Render blocks */}
          {blocks && blocks.length > 0 ? (
            <div className="space-y-6">
              {blocks.map((block, index) => (
                <BlockRenderer
                  key={`${block.__component}-${block.id}-${index}`}
                  block={block}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No content available.</p>
          )}
        </div>
      </article>
    </div>
  );
}
