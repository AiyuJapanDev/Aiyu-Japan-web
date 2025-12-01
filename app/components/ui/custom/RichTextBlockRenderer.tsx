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
          return (
            <img
              src={image.url}
              alt={image.alternativeText || "Article image"}
              className="w-full rounded-xl shadow-lg"
            />
          );
        },
      }}
    />
  );
}

export default RichTextBlockRenderer;
