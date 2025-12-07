import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Heart, Package, Truck } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const ServiceFeatures = () => {
  const { t } = useApp();
  const serviceFeatures = [
    {
      title: t("personalShoppingTitle"),
      description: t("personalShoppingDescription"),
      icon: Heart,
      benefits: [t("expertKnowledge"), t("accessExclusive"), t("negotiation")],
    },
    {
      title: t("packageConsolidationTitle"),
      description: t("packageConsolidationDescription"),
      icon: Package,
      benefits: [
        t("reducedCosts"),
        t("freeStorage"),
        t("professionalPackaging"),
      ],
    },
    {
      title: t("fastShippingTitle"),
      description: t("fastShippingDescription"),
      icon: Truck,
      benefits: [
        t("expressShipping"),
        t("insuranceCoverage"),
        t("realTimeTracking"),
      ],
    },
  ];

  return (
    <section className="py-20 bg-white/50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("whyChooseTitle")}
          </h2>
          <p className="text-lg text-gray-600">{t("whyChooseSubtitle")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {serviceFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p
                    className="text-gray-600 leading-relaxed mb-6"
                    dangerouslySetInnerHTML={{ __html: feature.description }}
                  ></p>
                  <ul className="text-left space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceFeatures;
