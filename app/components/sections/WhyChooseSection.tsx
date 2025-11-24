import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, BadgePercent, PackagePlus, Globe } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApp } from '@/contexts/AppContext';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from '@/components/ui/carousel';

const WhyChooseSection = () => {
  const isMobile = useIsMobile();
  const { t } = useApp();

  const reasons = [
    {
      icon: ShoppingCart,
      title: t('reason1Title'),
      description: t('reason1Description'),
      image: "KapyShopping.png"
    },
    {
      icon: BadgePercent,
      title: t('reason2Title'),
      description: t('reason2Description'),
      image: "KapyBed.png"
    },
    {
      icon: PackagePlus,
      title: t('reason3Title'),
      description: t('reason3Description'),
      image: "KapyWarehouse.png"
    },
    {
      icon: Globe,
      title: t('reason4Title'),
      description: t('reason4Description'),
      image: "KapyGlobal.png"
    }
  ];

  const renderCard = (reason: typeof reasons[0], index: number) => {
    const IconComponent = reason.icon;
    return (
      <Card key={index} className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg overflow-hidden h-full flex flex-col">
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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('whyChooseTitle')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('whyChooseSubtitle')}
          </p>
        </div>
        
        {isMobile ? (
          <Carousel className="w-full max-w-xs mx-auto" opts={{ align: "start" }}>
            <CarouselContent>
              {reasons.map((reason, index) => (
                <CarouselItem key={index}>
                  <div className="p-1 h-full">
                    {renderCard(reason, index)}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-[-1rem]" />
            <CarouselNext className="right-[-1rem]" />
          </Carousel>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason, index) => renderCard(reason, index))}
          </div>
        )}
      </div>
    </section>
  );
};

export default WhyChooseSection;
