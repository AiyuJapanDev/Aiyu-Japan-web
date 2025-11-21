import React from "react";
import { useApp } from "@/contexts/AppContext";

const FeaturedBlog = () => {
  const { t } = useApp();

  // Sample blog entries
  const blogEntries = [
    {
      id: 1,
      title: t("blog1Title"),
      image: "/paraguay_banner.png",
      link: "/blog/1",
    },
    {
      id: 2,
      title: t("blog2Title"),
      image: "/how-to-calculator.png",
      link: "/blog/2",
    },
    {
      id: 3,
      title: t("blog3Title"),
      image: "/staff-introduction.png",
      link: "/blog/3",
    },
    {
      id: 4,
      title: t("blog4Title"),
      image: "/where-to-shop.png",
      link: "/blog/3",
    },
    // Add more entries as needed
  ];

  return (
    <section className="py-10 px-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-6xl mx-auto">
        {blogEntries.map((entry) => (
          <a
            key={entry.id}
            href={entry.link}
            className="first:col-span-3 relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 flex flex-col"
          >
            <img
              src={entry.image}
              alt={entry.title}
              className="w-full h-auto object-contain transition-transform duration-300 ease-in-out"
            />
            <div className="text-center absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xs md:text-base font-semibold opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100">
              {entry.title}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBlog;
