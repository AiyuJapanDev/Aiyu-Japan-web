import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import ChatAssistant from '@/components/ChatAssistant';
import HeroSection from '@/components/sections/HeroSection';
import DetailedHowItWorks from '@/components/sections/DetailedHowItWorks';
import WhyChooseSection from '@/components/sections/WhyChooseSection';
import AdditionalServices from '@/components/sections/AdditionalServices';
import SocialMediaSection from '@/components/sections/SocialMediaSection';
import CTASection from '@/components/sections/CTASection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, hasIntersected } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        hasIntersected
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      }`}
      style={{
        transitionDelay: hasIntersected ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const { t } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat">
      <div className="animate-fade-in">
        <HeroSection 
          title={t('welcomeTitle')}
          subtitle={t('subtitle')}
          description={t('heroDescription')}
          showButtons={true}
          showMascot={true}
          mascotImage="MascotBox.png"
        />
      </div>

      <AnimatedSection delay={100}>
        <DetailedHowItWorks />
      </AnimatedSection>
      
      <AnimatedSection delay={200}>
        <WhyChooseSection />
      </AnimatedSection>
      
      <AnimatedSection delay={100}>
        <AdditionalServices />
      </AnimatedSection>
      
      <AnimatedSection delay={150}>
        <SocialMediaSection />
      </AnimatedSection>
      
      

      <AnimatedSection delay={100}>
      
      
      {/* FAQ Section */}
        <div className="mt-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t('faqTitle')}
            </h2>
          </div>
            <div className="mb-12">

  <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg max-w-4xl mx-auto">
  <CardContent className="p-8 space-y-4">
    <Accordion type="single" collapsible>
      {[
        [t('faq1Question'), t('faq1Answer')],
        [t('faq2Question'), t('faq2Answer')],
        [t('faq3Question'), t('faq3Answer')],
        [t('faq4Question'), t('faq4Answer')],
        [t('faq5Question'), t('faq5Answer')],
        [t('faq6Question'), t('faq6Answer')],
        [t('faq7Question'), t('faq7Answer')],
        [t('faq8Question'), t('faq8Answer')],
        [t('faq9Question'), t('faq9Answer')]
      ].map(([question, answer], index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-b border-blue-200">
          <AccordionTrigger className="text-left hover:no-underline">
            {question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 whitespace-pre-line">
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </CardContent>
</Card>


</div>
          
        </div>
        </AnimatedSection>
        <AnimatedSection delay={100}>
      <CTASection />
      </AnimatedSection>
      <ChatAssistant />
    </div>
  );
};

export default Home;