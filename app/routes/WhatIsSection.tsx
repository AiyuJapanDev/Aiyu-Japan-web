import { Route } from ".react-router/types/app/routes/+types/WhatIsSection";
import { useApp } from "@/contexts/AppContext";
import {
  CheckCircle,
  Globe,
  Package,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

export async function loader({ params }: Route.LoaderArgs) {
  return null;
}

export const WhatIsSection = ({ loaderData }: Route.ComponentProps) => {
  const { t } = useApp();
  const data = loaderData;

  const benefits = [
    {
      icon: <ShoppingBag className="h-6 w-6 text-blue-600" />,
      title: t("whatIsBenefit1Title"),
      description: t("whatIsBenefit1Desc"),
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
      title: t("whatIsBenefit2Title"),
      description: t("whatIsBenefit2Desc"),
    },
    {
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      title: t("whatIsBenefit3Title"),
      description: t("whatIsBenefit3Desc"),
    },
    {
      icon: <Package className="h-6 w-6 text-blue-600" />,
      title: t("whatIsBenefit4Title"),
      description: t("whatIsBenefit4Desc"),
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24 ">
      <div className="container mx-auto px-4 ">
        <div className=" grid gap-12 md:grid-cols-2 lg:gap-20 ">
          <div className="flex flex-col justify-center ">
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
              {t("whatIsTitle")}
            </h2>
            <div className="space-y-4 text-lg text-gray-600">
              <p>{t("whatIsDescription1")}</p>
              <p>{t("whatIsDescription2")}</p>
              <ul className="space-y-2 pl-4">
                {[
                  t("whatIsFeature1"),
                  t("whatIsFeature2"),
                  t("whatIsFeature3"),
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-medium text-blue-600">
                {t("whatIsDescription3")}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 rounded-full bg-blue-50 p-2">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-500">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className=" relative aspect-video w-full rounded-2xl shadow-2xl">
              {/* Placeholder for video or main image */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/0WErOWz1P5c"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <p className="font-medium">{t("whatIsVideoTitle")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsSection;
