import { useApp } from "@/contexts/AppContext";
import { Clock, MoveRight, Newspaper } from "lucide-react";
import { Link } from "react-router";
interface NewsEntry {
  id: number;
  title: string;
  date: Date | number;
  link: string;
}

const FeaturedNews = () => {
  const { t, language } = useApp();

  // Sample blog entries
  const newsEntries: NewsEntry[] = [
    {
      id: 1,
      title: t("newsBlog1Title"),
      date: 1763739388,
      link: "/blog/1",
    },
    {
      id: 2,
      title: t("newsBlog2Title"),
      date: 1763739388,
      link: "/blog/2",
    },
    {
      id: 3,
      title: t("newsBlog3Title"),
      date: 1763739388,
      link: "/blog/3",
    },
    {
      id: 4,
      title: t("newsBlog4Title"),
      date: 1763739388,
      link: "/blog/3",
    },
    // Add more entries as needed
  ];

  return (
    <section className="py-10 px-4">
      <div className="p-4 w-full drop-shadow-md text-blue-800 bg-white rounded-lg max-w-3xl mx-auto space-y-2">
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

        {newsEntries.map((entry) => (
          <a
            key={entry.id}
            href={entry.link}
            className="flex flex-col transition-transform transform hover:translate-x-1"
          >
            <span className="text-black inline-flex gap-2 items-center">
              <Clock size={16} />
              {new Intl.DateTimeFormat(language, {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(entry.date))}
            </span>
            <p>{entry.title}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default FeaturedNews;
