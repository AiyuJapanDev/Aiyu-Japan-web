import { useApp } from "@/contexts/AppContext";

import "ckeditor5/ckeditor5-content.css";
export function ComparisonTable({ data }) {
  const { table } = data;
  const { t } = useApp();

  return (
    <div
      className="overflow-x-auto -mx-4 sm:mx-0 strapi-comparison-wrapper  "
      dangerouslySetInnerHTML={{ __html: table }}
    />
  );
}
