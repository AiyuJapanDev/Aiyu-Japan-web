import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import ShippingCalculator from '@/components/ShippingCalculator';

const Calculator = () => {
  const { t } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen py-8 animate-fade-in bg-[url(tile_background.png)] bg-repeat">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-12 animate-scale-in">
          <h1 className="text-4xl font-heading font-bold text-gray-800 mb-4">
            {t('shippingCalculator')}
          </h1>
          <p className="text-gray-600 font-body">
            {t('calculatorBetaPage')}
          </p>
        </div>

        <div className="mt-6">
          <ShippingCalculator />
        </div>

        <div className="text-center mt-12">
          <div className="p-4 bg-white/90 shadow-sm rounded-2xl inline-block border border-gray-100">
            <p className="font-body font-bold text-gray-600 text-sm italic">
              {t('calculatorDisclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;