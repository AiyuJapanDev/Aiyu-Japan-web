import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

const PricingInfo = () => {
  const { t } = useApp();
  return (
    <section className="py-20 bg-white/50 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl">
          <CardContent className="p-12">
            <div className="mb-6">
              
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('transparentPricing')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">¥500</div>
                <div className="text-gray-600">{t('serviceFeePerItem')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">10%</div>
                <div className="text-gray-600">{t('taxOnItemCost')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">{t('variable')}</div>
                <div className="text-gray-600">{t('internationalShipping')}</div>
              </div>
            </div>
            <p className="text-gray-600 mb-8 text-lg">
              {t('noHiddenFeesTransparent')}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PricingInfo;
