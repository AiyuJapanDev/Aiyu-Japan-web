import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { CardGridBlock } from "@/types/blocks";
import { CheckCircle } from "lucide-react";
import React from "react";

interface ServiceFeaturesProps {
  data: CardGridBlock;
}

const ServiceFeatures: React.FC<ServiceFeaturesProps> = ({ data }) => {
  const { t } = useApp();
  const serviceFeatures = data.card;
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {serviceFeatures.map((feature, index) => {
        const src =
          import.meta.env.MODE === "development"
            ? `${import.meta.env.VITE_STRAPI_URL}${feature.icon.url}`
            : feature.icon.url;

        return (
          <Card
            key={index}
            className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in"
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                {src ? (
                  <img
                    src={src}
                    alt={feature.heading}
                    className="w-8 h-8 object-contain brightness-0 invert"
                  />
                ) : (
                  <div className="w-8 h-8" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.heading}
              </h3>
              <div
                className="text-gray-600 leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: feature.content }}
              ></div>
              {feature.List.length > 0 && (
                <ul className="text-left space-y-2">
                  {feature.List.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center text-gray-700"
                    >
                      <CheckCircle className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                      <span className="text-sm">{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ServiceFeatures;
