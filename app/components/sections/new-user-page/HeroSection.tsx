import { useApp } from "@/contexts/AppContext";

export const HeroSection = () => {
  const { t } = useApp();

  return (
    <div className="relative h-[400px] w-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-600">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2092&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      <div className="container relative mx-auto flex h-full flex-col justify-center px-4 text-white">
        <h1 className="mb-4 text-4xl font-bold md:text-6xl">
          {t("storeGuideHeroTitle")}
        </h1>
        <p className="max-w-2xl text-xl text-white/90">
          {t("storeGuideHeroSubtitle")}
        </p>
      </div>
    </div>
  );
};
