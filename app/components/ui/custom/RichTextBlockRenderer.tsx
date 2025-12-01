import { BlocksContent, BlocksRenderer } from "@strapi/blocks-react-renderer";
import React from "react";
import { useApp } from "@/contexts/AppContext";

function RichTextBlockRenderer({ content }: { content: BlocksContent }) {
  const { t } = useApp();

  if (!content) return <p className="text-gray-500 italic">{t("noContent")}</p>;

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        image: ({ image }) => {
          const imageUrl = image.url;
          // Construct srcset optimized for blog articles
          const formats = image.formats;
          const srcset = formats
            ? [
                formats.small ? `${formats.small.url} 500w` : "",
                formats.medium ? `${formats.medium.url} 750w` : "",
                formats.large ? `${formats.large.url} 1200w` : "",
                `${imageUrl} ${image.width}w`,
              ]
                .filter(Boolean)
                .join(", ")
            : undefined;

          // Responsive sizes for blog article layout
          const sizes =
            "(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px";

          return (
            <img
              src={imageUrl}
              srcSet={srcset}
              sizes={sizes}
              alt={image.alternativeText || "Article image"}
              className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
            />
          );
        },
      }}
    />
  );
}

export default RichTextBlockRenderer;
