import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  BadgePercent,
  PackagePlus,
  Globe,
  Search,
  Link as LinkIcon,
  Tag,
  MessageSquareText,
  PlusCircle,
  Send,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const HowItWorks = () => {
  const { t } = useApp();

  const [api, setApi] = React.useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      const index = api.selectedScrollSnap();
      setCurrent(index + 1);
      // Sync the thumbnail carousel to scroll to the active item
      thumbsApi?.scrollTo(index);
    });
  }, [api, thumbsApi]);

  const handleThumbClick = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  // Mapped to the 7 steps in src/constants/stepsTranslations.ts
  const reasons = [
    {
      icon: Search,
      title: t("step1DetailedTitle"),
      description: t("step1DetailedDescription"),
      image: "KapyShopping.png",
    },
    {
      icon: LinkIcon,
      title: t("step2DetailedTitle"),
      description: t("step2DetailedDescription"),
      image: "KapyBed.png",
    },
    {
      icon: BadgePercent,
      title: t("step3DetailedTitle"),
      description: t("step3DetailedDescription"),
      image: "KapyWarehouse.png",
    },
    {
      icon: Tag,
      title: t("step4DetailedTitle"),
      description: t("step4DetailedDescription"),
      image: "KapyGlobal.png",
    },
    {
      icon: MessageSquareText,
      title: t("step5DetailedTitle"),
      description: t("step5DetailedDescription"),
      image: "KapyGlobal.png",
    },
    {
      icon: PlusCircle,
      title: t("step6DetailedTitle"),
      description: t("step6DetailedDescription"),
      image: "KapyShopping.png",
    },
    {
      icon: Send,
      title: t("step7DetailedTitle"),
      description: t("step7DetailedDescription"),
      image: "KapyBed.png",
    },
  ];

  const renderCard = (reason: (typeof reasons)[0], index: number) => {
    const IconComponent = reason.icon;
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg overflow-hidden h-full flex flex-col">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={reason.image}
            alt={reason.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-300/20"></div>
        </div>
        <CardContent className="p-6 text-center flex-grow flex flex-col">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            {reason.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {reason.description}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="py-20 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("howItWorksDetailedTitle")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("howItWorksDetailedDescription1")}
          </p>
        </div>

        <div className="mx-auto w-full relative space-y-8">
          {/* 1. Main Content Carousel */}
          <Carousel
            setApi={setApi}
            className="w-full max-w-xs md:max-w-4xl lg:max-w-6xl mx-auto"
            opts={{
              align: "start",
            }}
          >
            <CarouselContent className="-ml-4">
              {reasons.map((reason, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1 h-full">{renderCard(reason, index)}</div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="h-12 w-12 -left-[1rem] border-blue-200 hover:bg-blue-50 text-blue-500" />
            <CarouselNext className="h-12 w-12 -right-[1rem] border-blue-200 hover:bg-blue-50 text-blue-500" />
          </Carousel>
        </div>

        <div className="max-w-3xl mx-auto space-y-8 mt-16">
          <p className="text-center text-lg text-gray-600">
            {t("howItWorksDetailedDescription2")}
          </p>
          <a
            type="button"
            href="/guide"
            className={`block mx-auto w-fit bubble-btn-secondary`}
          >
            <span className="font-bold">{t("newUserLinkBtn")}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
