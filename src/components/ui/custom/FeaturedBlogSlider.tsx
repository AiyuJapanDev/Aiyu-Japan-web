import React, { useState, useEffect, useCallback, useRef } from "react";

interface BlogPost {
  id: number;
  image: string;
  link: string;
  alt: string;
}

const BLOG_DATA: BlogPost[] = [
  { id: 1, image: "/staff-introduction.png", link: "/blog/1", alt: "Blog 1" },
  { id: 2, image: "/how-to-calculator.png", link: "/blog/2", alt: "Blog 2" },
  { id: 3, image: "/where-to-shop.png", link: "/blog/3", alt: "Blog 3" },
];

const FeaturedBlogSlider: React.FC = () => {
  // --- MOBILE CONFIG ---
  const DESIRED_BUFFER = 3;
  const ITEM_WIDTH_PERCENT = 75;
  const CENTER_OFFSET = (100 - ITEM_WIDTH_PERCENT) / 2;

  // 1. Create Clones (Dynamic Buffer)
  // If we have fewer items than the buffer, we can only clone what we have.
  // We wrap this in useMemo or just run it on render since data is static constant here.
  const prependItems = BLOG_DATA.slice(-DESIRED_BUFFER);
  const appendItems = BLOG_DATA.slice(0, DESIRED_BUFFER);

  const SLIDER_DATA = [...prependItems, ...BLOG_DATA, ...appendItems];

  // The actual number of clones on the left side (important if data.length < buffer)
  const PREPEND_COUNT = prependItems.length;

  // Start at the first item
  const [currentIndex, setCurrentIndex] = useState(PREPEND_COUNT);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- LOOP LOGIC ---
  const nextSlide = useCallback(() => {
    if (currentIndex >= SLIDER_DATA.length - PREPEND_COUNT) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, SLIDER_DATA.length, PREPEND_COUNT]);

  const prevSlide = useCallback(() => {
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  // Handle Teleporting
  const handleTransitionEnd = () => {
    const totalRealItems = BLOG_DATA.length;

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
    if (!isDragging && BLOG_DATA.length > 1) {
      timerRef.current = setInterval(nextSlide, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDragging, nextSlide]);

  // --- DRAG HANDLERS ---
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (BLOG_DATA.length <= 1) return; // No drag if single item
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
  const itemCount = BLOG_DATA.length;
  let gridColsClass = "md:grid-cols-5"; // default cap
  if (itemCount === 1) gridColsClass = "md:grid-cols-1";
  else if (itemCount === 2) gridColsClass = "md:grid-cols-2";
  else if (itemCount === 3) gridColsClass = "md:grid-cols-3";
  else if (itemCount === 4) gridColsClass = "md:grid-cols-4";

  return (
    <section className="max-w-6xl mx-auto">
      {/* --- MOBILE VIEW (Centered Infinite Slider) --- */}
      <div className="md:hidden w-full overflow-hidden relative cursor-grab active:cursor-grabbing touch-pan-y">
        <div
          className="flex w-full"
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
          {SLIDER_DATA.map((blog, index) => (
            <div
              key={`${blog.id}-${index}`}
              className="flex-shrink-0 px-2"
              style={{ width: `${ITEM_WIDTH_PERCENT}%` }}
            >
              <a
                href={blog.link}
                draggable={false}
                onClick={(e) => hasMoved && e.preventDefault()}
                className="block w-full aspect-video overflow-hidden rounded-xl shadow-md relative group"
              >
                <img
                  src={blog.image}
                  alt={blog.alt}
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/0 active:bg-black/10 transition-colors" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* --- DESKTOP VIEW (Dynamic Grid with Clip) --- */}

      <div className="hidden md:block w-full max-w-7xl mx-auto overflow-hidden">
        <div className={`grid ${gridColsClass} gap-4`}>
          {BLOG_DATA.map((blog) => (
            <a
              key={blog.id}
              href={blog.link}
              className="block w-full aspect-video overflow-hidden rounded-xl shadow-md transition-transform hover:scale-105 hover:shadow-lg"
            >
              <img
                src={blog.image}
                alt={blog.alt}
                className="w-full h-full object-cover"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBlogSlider;
