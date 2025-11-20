
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

const ShoppingCategories = () => {
  const { t } = useApp();
  const categories = [
    { category: t('animeCategory'), items: [t('figures'), t('collectibles'), t('limitedEditions'), t('doujinshi')], emoji: "🎌" },
    { category: t('fashionCategory'), items: [t('clothing'), t('cosmetics'), t('accessories'), t('shoes')], emoji: "👘" },
    { category: t('electronicsCategory'), items: [t('gaming'), t('gadgets'), t('audio'), t('cameras')], emoji: "🎮" },
    { category: t('traditionalCategory'), items: [t('crafts'), t('tea'), t('snacks'), t('souvenirs')], emoji: "🍵" }
  ];

  return (
    <section className="py-20 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('whatCanWeShop')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('whatCanWeShopSubtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">{category.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  {category.category}
                </h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-600 text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShoppingCategories;
