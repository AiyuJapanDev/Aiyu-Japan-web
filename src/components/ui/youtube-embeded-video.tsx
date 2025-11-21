import { useState } from "react";

export default function YouTubeEmbed({ videoId, title, thumbnail }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // 1. If no custom thumbnail is provided, try to fetch the high-res YouTube one
  const posterUrl =
    thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div
      className={`mx-auto max-w-4xl relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-900 ${
        !isPlaying ? "cursor-pointer group" : ""
      }`}
      onClick={() => setIsPlaying(true)}
    >
      {!isPlaying ? (
        <>
          {/* The Facade Image */}
          <img
            src={posterUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          />

          {/* Dark Overlay for Contrast */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Custom Play Button */}
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       w-14 h-14 bg-white/90 rounded-full flex items-center justify-center 
                       backdrop-blur-sm shadow-lg transition-all duration-300 
                       group-hover:scale-110 group-hover:bg-white text-slate-900 z-10"
            aria-label={`Play video: ${title}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8 ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </>
      ) : (
        /* The Actual Iframe (Loads only on click) */
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}
