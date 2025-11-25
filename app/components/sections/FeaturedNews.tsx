"use client";

import { useApp } from "@/contexts/AppContext";
import { getArticleNews } from "@/lib/strapi";
import { Article } from "@/types/blog";
import { Clock, MoveRight, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const FeaturedNews = () => {
  const { t, language } = useApp();

  // Sample blog entries
  const [newsData, setNewsData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getArticleNews({ language })
      .then((data) => {
        setNewsData(data);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [language]);

  return (
    <section className="py-10 px-4">
      <div className="p-4 w-full shadow-lg text-blue-800 bg-white rounded-lg max-w-3xl mx-auto space-y-2">
        <div className="flex justify-between">
          <div className=" inline-flex gap-2 items-center ">
            <Newspaper size={16} />
            <p>{t("featNewsTitle")}</p>
          </div>
          <Link to={"/"}>
            <span className="inline-flex gap-2 items-center">
              {t("featNewsAll")}
              <MoveRight size={16} />
            </span>
          </Link>
        </div>

        {loading && <p>Loading...</p>}

        {!loading && newsData.length === 0 && <p>No news available.</p>}

        {!loading && newsData.length > 0 && (
          <div className="space-y-2">
            {newsData.map((entry) => (
              <Link
                key={entry.id}
                to={`/blog/${language}/${entry.slug}`}
                className="flex flex-col transition-transform transform hover:translate-x-1"
              >
                <span className="text-black inline-flex gap-2 items-center">
                  <Clock size={16} />
                  {new Intl.DateTimeFormat(language, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(entry.createdAt))}
                </span>
                <p>{entry.title}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedNews;
