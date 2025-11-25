import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { getHomeBannerCarousel } from "@/lib/strapi";
import { Link } from "react-router";

// --- Types ---
interface ImageFormat {
  url: string;
  width: number;
  height: number;
}

interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    large?: ImageFormat;
  } | null;
}

interface BannerItem {
  id: number;
  article: {
    id: number;
    title: string;
    slug: string;
  } | null;
  image: StrapiImage | null;
  link?: string; // Derived or optional
}

const FeaturedBlog: React.FC = () => {
  const [carouselData, setCarouselData] = useState<BannerItem[]>([]);

  useEffect(() => {
    getHomeBannerCarousel().then((data: any[]) => {
      // Filter out items that don't have an image
      const validData = data.filter(
        (item) => item.image !== null && item.image !== undefined
      );
      setCarouselData(validData);
    });
  }, []);

  // 1. PREPARE DATA WITH CLONES (Infinite Loop Logic)
  // [Clone Last, ...Originals, Clone First]
  const BANNER_DATA = useMemo(() => {
    if (carouselData.length === 0) return [];

    // If we only have 1 item, we can't really loop effectively with this logic,
    // but let's just return it to avoid errors.
    if (carouselData.length === 1) return carouselData;

    return [
      { ...carouselData[carouselData.length - 1], id: -1 }, // Clone of Last
      ...carouselData,
      { ...carouselData[0], id: -2 }, // Clone of First
    ];
  }, [carouselData]);

  // Start at index 1 because index 0 is the "Clone Last"
  const [currentIndex, setCurrentIndex] = useState<number>(1);

  // Controls whether the CSS transition is active (we turn it off for instant jumps)
  const [isTransitioning, setIsTransitioning] = useState(true);

  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- DRAG STATE ---
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [hasMoved, setHasMoved] = useState(false); // New flag to fix link clicking

  // --- NAVIGATION LOGIC ---

  const nextSlide = useCallback(() => {
    if (BANNER_DATA.length <= 1) return;
    if (currentIndex >= BANNER_DATA.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, BANNER_DATA.length]);

  const prevSlide = useCallback(() => {
    if (BANNER_DATA.length <= 1) return;
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [currentIndex, BANNER_DATA.length]);

  const goToSlide = (originalIndex: number) => {
    setIsTransitioning(true);
    // originalIndex 0 maps to index 1 in our cloned array
    setCurrentIndex(originalIndex + 1);
  };

  // --- INFINITE LOOP JUMP LOGIC ---
  // This fires whenever the CSS transition finishes
  const handleTransitionEnd = () => {
    if (BANNER_DATA.length <= 1) return;

    // If we are at the "Clone First" (end of array), jump to Real First
    if (currentIndex === BANNER_DATA.length - 1) {
      setIsTransitioning(false); // Disable animation
      setCurrentIndex(1); // Jump to real first
    }
    // If we are at the "Clone Last" (start of array), jump to Real Last
    else if (currentIndex === 0) {
      setIsTransitioning(false); // Disable animation
      setCurrentIndex(BANNER_DATA.length - 2); // Jump to real last
    }
  };

  // --- AUTOPLAY ---
  useEffect(() => {
    if (!isPaused && !isDragging && BANNER_DATA.length > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isDragging, nextSlide, BANNER_DATA.length]);

  // --- DRAG HANDLERS ---

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (BANNER_DATA.length <= 1) return;
    setIsTransitioning(false); // Disable transition for 1:1 drag movement
    setIsDragging(true);
    setIsPaused(true);
    setHasMoved(false); // Reset movement flag

    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - startX;

    // If moved more than 5 pixels, mark as moved (to block links)
    if (Math.abs(diff) > 5) {
      setHasMoved(true);
    }

    setCurrentTranslate(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);
    setIsTransitioning(true); // Re-enable transition for the snap animation

    const threshold = 100;
    if (currentTranslate < -threshold) {
      nextSlide();
    } else if (currentTranslate > threshold) {
      prevSlide();
    } else {
      // Snap back if didn't drag far enough
    }

    setCurrentTranslate(0);
  };

  // --- LINK CLICK BLOCKER ---
  const handleLinkClick = (e: React.MouseEvent) => {
    // If we dragged (hasMoved is true), prevent the link from opening
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (carouselData.length === 0) {
    return null; // Or a skeleton loader
  }

  return (
    <div className="w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-xl">
      <div
        className="w-full overflow-hidden  group cursor-grab active:cursor-grabbing select-none relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          if (isDragging) handleDragEnd();
        }}
        // Mouse Events
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        // Touch Events
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Slides Container */}
        <div
          className="w-full flex"
          onTransitionEnd={handleTransitionEnd}
          style={{
            // Toggle transition based on state
            transition: isTransitioning ? "transform 500ms ease-out" : "none",
            // Math: (Index * 100%) + (Drag Pixels)
            transform: `translateX(calc(-${
              currentIndex * 100
            }% + ${currentTranslate}px))`,
          }}
        >
          {BANNER_DATA.map((banner, index) => {
            const imageUrl = `${import.meta.env.VITE_STRAPI_URL}${banner.image?.url}`;

            // Construct srcset
            const formats = banner.image?.formats;
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
                  `${imageUrl} ${banner.image?.width}w`, // Original as fallback/highest quality
                ]
                  .filter(Boolean)
                  .join(", ")
              : undefined;

            const sizes =
              "(max-width: 640px) 100vw, (max-width: 1024px) 750px, 1000px";

            return (
              <div
                key={`${banner.id}-${index}`} // Unique key for clones
                className="relative flex-shrink-0 w-full"
              >
                <Link
                  to={`/blog/${banner.article.slug}` || "#"} // Fallback link
                  className="relative block w-full h-full transition-transform hover:scale-105 max-h-[324px] overflow-clip"
                  draggable={false}
                  onClick={handleLinkClick} // <--- 2. ATTACH THE BLOCKER HERE
                >
                  <img
                    src={imageUrl}
                    srcSet={srcset}
                    sizes={sizes}
                    alt={banner.image?.alternativeText || "Banner image"}
                    width={banner.image?.width}
                    height={banner.image?.height}
                    className="w-full h-auto object-cover pointer-events-none select-none"
                    draggable={false}
                    loading={index === 1 ? "eager" : "lazy"} // Eager load the first real slide (index 1 in cloned array)
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Dot Navigation */}
        {carouselData.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
            {carouselData.map((_, index) => {
              // Determine active dot based on infinite index
              // currentIndex 1 = dot 0, currentIndex 2 = dot 1, etc.
              let isActive = false;
              if (currentIndex === index + 1) isActive = true;
              // Edge cases for when we are currently on a "Clone" before the jump happens
              if (currentIndex === 0 && index === carouselData.length - 1)
                isActive = true;
              if (currentIndex === BANNER_DATA.length - 1 && index === 0)
                isActive = true;

              return (
                <button
                  key={index}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={() => goToSlide(index)}
                  className="group relative p-2"
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <span
                    className={`block h-3 w-3 rounded-full transition-all duration-300 
                      ${
                        isActive
                          ? "w-8 bg-blue-500"
                          : "bg-white/50 hover:bg-blue-500/50"
                      }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedBlog;
