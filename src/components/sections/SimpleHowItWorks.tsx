
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ShoppingCart, Truck } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const SimpleHowItWorks = () => {
  const { t } = useApp();
  const steps = [
    {
      icon: Search,
      title: t('step1Title'),
      description: t('step1Description'),
    },
    {
      icon: ShoppingCart,
      title: t('step2Title'),
      description: t('step2Description'),
    },
    {
      icon: Truck,
      title: t('step3Title'),
      description: t('step3Description'),
    },
  ];

  return (
    <section className="py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('howItWorks')}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SimpleHowItWorks;
