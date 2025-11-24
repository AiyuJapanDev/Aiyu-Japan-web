import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Calculator, CreditCard, Clock, Truck, DollarSign, Package, CloudCog } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useApp } from '@/contexts/AppContext';

const DetailedHowItWorks = () => {
  const { t } = useApp();
  
  const steps = [
  {
    icon: Search,
    title: t('step1DetailedTitle'),
    description: "",
    details: t('step1DetailedDescription'),
    step: "01"
  },
  {
    icon: Calculator,
    title: t('step2DetailedTitle'),
    description: "",
    details: t('step2DetailedDescription'),
    step: "02"
  },
  {
    icon: CreditCard,
    title: t('step3DetailedTitle'),
    description: "",
    details: t('step3DetailedDescription'),
    step: "03"
  },
  {
    icon: Clock,
    title: t('step4DetailedTitle'),
    description: "",
    details: t('step4DetailedDescription'),
    step: "04"
  },
  {
    icon: Truck,
    title: t('step5DetailedTitle'),
    description: "",
    details: t('step5DetailedDescription'),
    step: "05"
  },
  {
    icon: DollarSign,
    title: t('step6DetailedTitle'),
    description: "",
    details: t('step6DetailedDescription'),
    step: "06"
  },
  {
    icon: Package,
    title: t('step7DetailedTitle'),
    description: "",
    details: t('step7DetailedDescription'),
    step: "07"
  }
];


  const StepCard = ({ step, index, isLast }: { step: typeof steps[0], index: number, isLast: boolean }) => {
    const { ref, hasIntersected } = useIntersectionObserver();
    const IconComponent = step.icon;
    const isEven = index % 2 === 0;

    console.log("Element "+index+" intersected: "+hasIntersected);
    
    return (
      <div 
        ref={ref}
        className={`relative flex flex-col items-center w-full ${isEven ? 'md:items-start md:pl-12' : 'md:items-end md:pr-12'} transition-all duration-700 ease-out ${
          hasIntersected
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
        style={{
          transitionDelay: hasIntersected ? `${index * 50}ms` : '0ms',
        }}
      >
        {/* Step Card */}
        <div className="relative bg-white/90 backdrop-blur-sm border-2 border-yellow-300 shadow-lg rounded-3xl p-6 max-w-sm w-full mx-auto md:mx-0 transform hover:scale-105 transition-all duration-300">
          {/* Connecting pill bar integrated into card */}
          {(
            <div className={`absolute top-2 ${!isEven ? 'left-4' : 'right-4'} z-10`}>
              <div className="w-2 h-12 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full shadow-md"></div>
            </div>
          )}
          
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon with step number */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -left-2 w-10 h-10 bg-yellow-600 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-md">
                {step.step}
              </div>
            </div>
            
            {/* Content */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.details}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('howItWorksDetailedTitle')}
          </h2>
        </div>
        
        {/* Vertical flow design */}
        <div className="flex flex-col items-center space-y-8">
          {steps.map((step, index) => (
            <StepCard 
              key={index}
              step={step} 
              index={index} 
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedHowItWorks;