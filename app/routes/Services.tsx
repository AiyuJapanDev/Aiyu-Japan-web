
import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import HeroSection from '@/components/sections/HeroSection';
import SimpleHowItWorks from '@/components/sections/SimpleHowItWorks';
import ServiceFeatures from '@/components/sections/ServiceFeatures';
import ShoppingCategories from '@/components/sections/ShoppingCategories';
import PricingInfo from '@/components/sections/PricingInfo';

const Services = () => {
  const { t } = useApp();
  
  const { ref: howItWorksRef, hasIntersected: howItWorksVisible } = useIntersectionObserver();
  const { ref: featuresRef, hasIntersected: featuresVisible } = useIntersectionObserver();
  const { ref: categoriesRef, hasIntersected: categoriesVisible } = useIntersectionObserver();
  const { ref: pricingRef, hasIntersected: pricingVisible } = useIntersectionObserver();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat animate-fade-in">
      <HeroSection 
        title={t('servicesTitle')}
        subtitle={t('servicesSubtitle')}
        description={t('servicesDescription')}
        showButtons={false}
        showMascot={true}
        mascotImage="MascotBox.png"
      />

      <div ref={howItWorksRef} className={`transition-all duration-700 ${howItWorksVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <SimpleHowItWorks />
      </div>
      <div ref={featuresRef} className={`transition-all duration-700 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <ServiceFeatures />
      </div>
      <div ref={categoriesRef} className={`transition-all duration-700 ${categoriesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <ShoppingCategories />
      </div>
      <div ref={pricingRef} className={`transition-all duration-700 ${pricingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <PricingInfo />
      </div>
    </div>
  );
};

export default Services;
