import { useApp } from "@/contexts/AppContext";
import { ArrowRight, Package, Plane, Search, ShoppingCart } from "lucide-react";

export const HowItWorksSection = () => {
  const { t } = useApp();

  const steps = [
    {
      icon: <Search className="h-8 w-8 text-white" />,
      title: t("howItWorksStep1Title"),
      description: t("howItWorksStep1Desc"),
      color: "bg-blue-500",
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-white" />,
      title: t("howItWorksStep2Title"),
      description: t("howItWorksStep2Desc"),
      color: "bg-purple-500",
    },
    {
      icon: <Package className="h-8 w-8 text-white" />,
      title: t("howItWorksStep3Title"),
      description: t("howItWorksStep3Desc"),
      color: "bg-pink-500",
    },
    {
      icon: <Package className="h-8 w-8 text-white" />,
      title: t("howItWorksStep4Title"),
      description: t("howItWorksStep4Desc"),
      color: "bg-orange-500",
    },
    {
      icon: <Plane className="h-8 w-8 text-white" />,
      title: t("howItWorksStep5Title"),
      description: t("howItWorksStep5Desc"),
      color: "bg-green-500",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("howItWorksTitle")}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            {t("howItWorksSubtitle")}
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="absolute left-1/2 top-0 hidden h-full w-1 -translate-x-1/2 bg-gray-200 lg:block"></div>

          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center lg:flex-row ${
                  index % 2 === 0 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 lg:px-12">
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg lg:mx-0 ${
                      index % 2 === 0 ? "lg:ml-auto" : "lg:mr-auto"
                    } ${step.color}`}
                  >
                    {step.icon}
                  </div>
                </div>

                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gray-900 text-lg font-bold text-white shadow-xl">
                  {index + 1}
                </div>

                <div className="flex-1 text-center lg:px-12 lg:text-left">
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700">
            {t("howItWorksCTA")}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
