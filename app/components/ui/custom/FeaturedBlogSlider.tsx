import { getFeaturedBlogArticles } from "@/lib/strapi";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Link } from "react-router";
import { Article } from "@/types/blog";
import { useApp } from "@/contexts/AppContext";

const FeaturedBlogSlider: React.FC = () => {
  const { language } = useApp();
  const [featuredBlogData, setFeaturedBlogData] = useState<Article[]>([]);

  useEffect(() => {
    getFeaturedBlogArticles().then((data) => {
      if (data) setFeaturedBlogData(data);
    });
  }, []);

  // --- MOBILE CONFIG ---
  const DESIRED_BUFFER = 3;
  const ITEM_WIDTH_PERCENT = 75;
  const CENTER_OFFSET = (100 - ITEM_WIDTH_PERCENT) / 2;

  // 1. Create Clones (Dynamic Buffer)
  const SLIDER_DATA = useMemo(() => {
    if (featuredBlogData.length === 0) return [];

    // If we have fewer items than the buffer, we clone what we have
    const prependItems = featuredBlogData.slice(-DESIRED_BUFFER);
    const appendItems = featuredBlogData.slice(0, DESIRED_BUFFER);

    // If data length is small, we might need to duplicate more to ensure smooth scrolling
    // But for now, standard cloning:
    return [...prependItems, ...featuredBlogData, ...appendItems];
  }, [featuredBlogData]);

  // The actual number of clones on the left side
  const PREPEND_COUNT = useMemo(() => {
    return featuredBlogData.length > 0
      ? Math.min(DESIRED_BUFFER, featuredBlogData.length)
      : 0;
  }, [featuredBlogData]);

  // Start at the first item (after clones)
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize index once data is loaded
  useEffect(() => {
    if (featuredBlogData.length > 0) {
      setCurrentIndex(Math.min(DESIRED_BUFFER, featuredBlogData.length));
    }
  }, [featuredBlogData]);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- LOOP LOGIC ---
  const nextSlide = useCallback(() => {
    if (SLIDER_DATA.length === 0) return;
    if (currentIndex >= SLIDER_DATA.length - PREPEND_COUNT) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, SLIDER_DATA.length, PREPEND_COUNT]);

  const prevSlide = useCallback(() => {
    if (SLIDER_DATA.length === 0) return;
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [currentIndex, SLIDER_DATA.length]);

  // Handle Teleporting
  const handleTransitionEnd = () => {
    const totalRealItems = featuredBlogData.length;
    if (totalRealItems === 0) return;

    // Scrolled past end -> Teleport to start
    if (currentIndex >= SLIDER_DATA.length - PREPEND_COUNT) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - totalRealItems);
    }
    // Scrolled past start -> Teleport to end
    else if (currentIndex < PREPEND_COUNT) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + totalRealItems);
    }
  };

  // Autoplay
  useEffect(() => {
    // Only autoplay if we have enough items to warrant a slider
    if (!isDragging && featuredBlogData.length > 1) {
      timerRef.current = setInterval(nextSlide, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDragging, nextSlide, featuredBlogData.length]);

  // --- DRAG HANDLERS ---
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (featuredBlogData.length <= 1) return; // No drag if single item
    setIsTransitioning(false);
    setIsDragging(true);
    setHasMoved(false);
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - startX;

    if (Math.abs(diff) > 5) setHasMoved(true);
    setCurrentTranslate(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsTransitioning(true);

    const threshold = 50;
    if (currentTranslate < -threshold) nextSlide();
    else if (currentTranslate > threshold) prevSlide();

    setCurrentTranslate(0);
  };

  // --- DESKTOP GRID LOGIC ---
  // Determine column count: 2 items -> grid-cols-2, 5+ items -> grid-cols-5
  const itemCount = featuredBlogData.length;
  let gridColsClass = "md:grid-cols-5"; // default cap
  if (itemCount === 1) gridColsClass = "md:grid-cols-1";
  else if (itemCount === 2) gridColsClass = "md:grid-cols-2";
  else if (itemCount === 3) gridColsClass = "md:grid-cols-3";
  else if (itemCount === 4) gridColsClass = "md:grid-cols-4";

  const gridItems = featuredBlogData.map((blog, index) => {
    const imageUrl = blog.cover?.url
      ? `${import.meta.env.VITE_STRAPI_URL}${blog.cover.url}`
      : "";

    // Construct srcset
    const formats = blog.cover?.formats;
    const srcset = formats
      ? [
          formats.small
            ? `${import.meta.env.VITE_STRAPI_URL}${formats.small.url} 500w`
            : "",
          formats.medium
            ? `${import.meta.env.VITE_STRAPI_URL}${formats.medium.url} 750w`
            : "",
          formats.large
            ? `${import.meta.env.VITE_STRAPI_URL}${formats.large.url} 1000w`
            : "",
          blog.cover?.width ? `${imageUrl} ${blog.cover.width}w` : "", // Original as fallback/highest quality
        ]
          .filter(Boolean)
          .join(", ")
      : undefined;

    const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 750px, 1000px";

    return (
      <Link
        key={blog.id}
        to={`${language}/blog/${blog.slug}`}
        className="block w-full aspect-video overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-lg"
      >
        {imageUrl && (
          <img
            src={imageUrl}
            srcSet={srcset}
            sizes={sizes}
            alt={blog.cover?.alternativeText || "Banner image"}
            width={blog.cover?.width}
            height={blog.cover?.height}
            className="w-full h-full object-cover"
            draggable={false}
            loading={index === 1 ? "eager" : "lazy"} // Eager load the first real slide (index 1 in cloned array)
          />
        )}
      </Link>
    );
  });

  // Use SLIDER_DATA for the mobile slides to support infinite loop
  const slides = SLIDER_DATA.map((blog, index) => {
    const imageUrl = blog.cover?.url
      ? `${import.meta.env.VITE_STRAPI_URL}${blog.cover.url}`
      : "";

    // Construct srcset
    const formats = blog.cover?.formats;
    const srcset = formats
      ? [
          formats.small
            ? `${import.meta.env.VITE_STRAPI_URL}${formats.small.url} 500w`
            : "",
          formats.medium
            ? `${import.meta.env.VITE_STRAPI_URL}${formats.medium.url} 750w`
            : "",
          formats.large
            ? `${import.meta.env.VITE_STRAPI_URL}${formats.large.url} 1000w`
            : "",
          blog.cover?.width ? `${imageUrl} ${blog.cover.width}w` : "", // Original as fallback/highest quality
        ]
          .filter(Boolean)
          .join(", ")
      : undefined;

    const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 750px, 1000px";

    return (
      <div
        key={`featured-blog-${index}`} // Use index because we have duplicates
        className="flex-shrink-0 px-2 "
        style={{ width: `${ITEM_WIDTH_PERCENT}%` }}
      >
        <Link
          to={`${language}/blog/${blog.slug}`}
          draggable={false}
          onClick={(e) => hasMoved && e.preventDefault()}
          className="block w-full aspect-video overflow-hidden rounded-xl shadow-lg relative group"
        >
          {imageUrl && (
            <img
              src={imageUrl}
              srcSet={srcset}
              sizes={sizes}
              alt={blog.cover?.alternativeText || "Banner image"}
              width={blog.cover?.width}
              height={blog.cover?.height}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
              loading={index === 1 ? "eager" : "lazy"} // Eager load the first real slide (index 1 in cloned array)
            />
          )}
          <div className="absolute inset-0 bg-black/0 active:bg-black/10 transition-colors" />
        </Link>
      </div>
    );
  });

  if (featuredBlogData.length === 0) {
    return null; // Or a skeleton loader
  }

  return (
    <section className="max-w-6xl mx-auto px-4 xl:px-0">
      {/* --- MOBILE VIEW (Centered Infinite Slider) --- */}
      <div className="md:hidden w-full overflow-hidden pb-6 relative cursor-grab active:cursor-grabbing touch-pan-y">
        <div
          className="flex w-full "
          onTransitionEnd={handleTransitionEnd}
          // Drag Events
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={() => isDragging && handleDragEnd()}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          style={{
            transition: isTransitioning ? "transform 400ms ease-out" : "none",
            transform: `translateX(calc(-${
              currentIndex * ITEM_WIDTH_PERCENT
            }% + ${CENTER_OFFSET}% + ${currentTranslate}px))`,
          }}
        >
          {slides}
        </div>
      </div>

      {/* --- DESKTOP VIEW (Dynamic Grid with Clip) --- */}

      <div className="hidden md:block w-full max-w-7xl mx-auto ">
        <div className={`grid ${gridColsClass} gap-4`}>{gridItems}</div>
      </div>
    </section>
  );
};

export default FeaturedBlogSlider;
