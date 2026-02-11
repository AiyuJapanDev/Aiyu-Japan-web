import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import PurchaseCalculator from '@/components/PurchaseCalculator';
import ShippingCalculator from '@/components/ShippingCalculator';
import { Truck, ShoppingCart } from 'lucide-react';


const Calculator = () => {
  const { t } = useApp();
  const [isShippingMode, setIsShippingMode] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen py-8 animate-fade-in bg-[url(tile_background.png)] bg-repeat">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-scale-in">
          <h1 className="text-4xl font-heading font-bold text-gray-800 mb-4">
            {t('calculatorBetaPage')}
          </h1>
        </div>

        <div className="flex justify-center mb-6">
          <div
            className="flex flex-row items-center justify-center gap-3 sm:gap-6 px-4 sm:px-6 py-3 
               rounded-full shadow-md bg-white border-2 border-[var(--capybara-yellow)] 
               w-full max-w-[22rem] sm:max-w-md cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-capybara-orange/50"
            onClick={() => setIsShippingMode(!isShippingMode)}
          >
            <span
              className={`text-sm sm:text-base font-medium transition-all duration-300 text-center sm:text-right cursor-pointer
                  ${!isShippingMode ? 'text-[var(--capybara-orange)] font-bold scale-105' : 'text-gray-600 hover:text-gray-800'}`}
            >
              {t('purchaseCalculator')}
            </span>

            <label className="relative inline-flex items-center cursor-pointer select-none" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={isShippingMode}
                onChange={() => setIsShippingMode(!isShippingMode)}
                className="sr-only peer"
              />

              <div
                className="
      w-20 h-10 sm:w-24 sm:h-12
      rounded-full bg-gradient-to-r from-capybara-orange/20 to-capybara-blue/20
      shadow-inner transition-all duration-500 hover:shadow-md
      peer-checked:from-capybara-blue/20 peer-checked:to-capybara-orange/20
    "
              ></div>

              <div
                className="
      absolute top-1 left-1
      sm:top-1.5 sm:left-1.5
      h-8 w-8 sm:h-9 sm:w-9
      bg-white border-2 border-capybara-orange shadow-lg
      rounded-full flex items-center justify-center
      transition-all duration-500
      peer-checked:translate-x-[40px] sm:peer-checked:translate-x-[48px]
      peer-checked:border-capybara-blue
      hover:scale-110
    "
              >
                {isShippingMode ? (
                  <Truck className="h-4 w-4 text-capybara-blue transition-transform duration-500" />
                ) : (
                  <ShoppingCart className="h-4 w-4 text-capybara-orange transition-transform duration-500" />
                )}
              </div>
            </label>

            <span
              className={`text-sm sm:text-base font-medium transition-all duration-300 text-center sm:text-left cursor-pointer
                  ${isShippingMode ? 'text-[var(--capybara-orange)] font-bold scale-105' : 'text-gray-600 hover:text-gray-800'}`}
            >
              {t('shippingCalculator')}
            </span>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-xs text-gray-500 font-body animate-pulse">
            👆 Tap to switch calculators
          </p>
        </div>

        <div className="mt-6">
          {isShippingMode ? <ShippingCalculator /> : <PurchaseCalculator />}
        </div>

        <div className="text-center mt-8">
          <div className="p-3 bg-white/90 rounded-full inline-block">
            <p className="font-body font-bold text-gray-600 text-sm">
              {t('calculatorDisclaimer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
