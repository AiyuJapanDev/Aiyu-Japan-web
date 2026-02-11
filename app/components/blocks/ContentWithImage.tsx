import { getImage } from "@/lib/utils";
import type { ContentWithImageBlock } from "@/types/blocks";

const BASE_URL =
  import.meta.env.VITE_STRAPI_URL ?? "http://localhost:1337";

function ContentWithImage({ data }: { data: ContentWithImageBlock }) {
  const { heading, text, image, link, reversed } = data;

  function getStrapiMedia(url: string | null) {
    if (url == null) return null;
    // Return as-is if it's a data URL (base64)
    if (url.startsWith("data:")) return url;
    // Return as-is if it's an absolute URL
    if (url.startsWith("http") || url.startsWith("//")) return url;
    // Prepend BASE_URL for relative URLs
    return `${BASE_URL}${url}`;
  }

  const { src, srcset } = getImage(image);
  const sizes = "(min-width: 1260px) 1153px, 94.04vw";
  return (
    <div className=" max-w-7xl ">
      <div className="container mx-auto px-4">
        <div
          className={`mb-8 flex flex-col lg:flex-row gap-4 ${reversed && "lg:flex-row-reverse"}`}
        >
          <div className="w-full lg:w-1/2 ">
            <img
              src={src}
              srcSet={srcset}
              sizes={sizes}
              alt={image.alternativeText}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center w-full lg:w-1/2 py-6 lg:pt-10 px-6 rounded-r bg-white">
            {heading && <h2 className="my-4 text-2xl font-bold">{heading}</h2>}
            {text && (
              <p
                className="mb-4 text-gray-400 leading-loose"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}
            {link && (
              <a
                className="text-green-600 hover:text-green-700 font-bold"
                href={link.href}
                target={link.isExternal ? "_blank" : "_self"}
              >
                {link.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentWithImage;
