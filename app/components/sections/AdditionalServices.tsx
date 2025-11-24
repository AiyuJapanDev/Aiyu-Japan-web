import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useApp } from '@/contexts/AppContext';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from '@/components/ui/carousel';

const AdditionalServices = () => {
  const isMobile = useIsMobile();
  const { t } = useApp();
  
  const services = [
    {
      title: t('customerServiceTitle'),
      description: t('customerServiceDescription'),
      image: "Client.png"
    },
    {
      title: t('securityTitle'),
      description: t('securityDescription'),
      image: "Security.png"
    },
    {
      title: t('webServiceTitle'),
      description: t('webServiceDescription'),
      image: "Service.png"
    }
  ];

  const renderServiceCard = (service: typeof services[0], index: number) => (
    <Card key={index} className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg overflow-hidden h-full flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-400/30 to-transparent"></div>
      </div>
      <CardContent className="p-6 flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {service.title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {service.description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('additionalServicesTitle')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('additionalServicesSubtitle')}
          </p>
        </div>
        
        {isMobile ? (
          <Carousel className="w-full max-w-xs mx-auto" opts={{ align: "start" }}>
            <CarouselContent>
              {services.map((service, index) => (
                <CarouselItem key={index}>
                  <div className="p-1 h-full">
                    {renderServiceCard(service, index)}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-[-1rem]" />
            <CarouselNext className="right-[-1rem]" />
          </Carousel>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => renderServiceCard(service, index))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdditionalServices;
