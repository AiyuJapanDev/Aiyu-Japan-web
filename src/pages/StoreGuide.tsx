
import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink } from 'lucide-react';

const StoreGuide = () => {
  const { t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const storeCategories = {
  general_and_anime_goods: [ /* Marketplace General */
    {
      name: t('amazonJapan'),
      url: "https://www.amazon.co.jp/",
      description: t('amazonJapanDesc'),
      logo: "amazon.png"
    },
    {
      name: t('rakuten'),
      url: "https://www.rakuten.co.jp/",
      description: t('rakutenDesc'),
      logo: "rakuten.png"
    },
    {
      name: t('yahooShopping'),
      url: "https://paypayfleamarket.yahoo.co.jp/",
      description: t('yahooShoppingDesc'),
      logo: "yahoo.png"
    },
    {
      name: t('mercariJapan'),
      url: "https://jp.mercari.com/",
      description: t('mercariJapanDesc'),
      logo: "mercari.png"
    },
    {
      name: t('buyma'),
      url: "https://www.buyma.com/",
      description: t('buymaDesc'),
      logo: "buyma.png"
    }
  ],
  official_anime_stores: [ /* Anime, Manga y Merchandising */
    {
      name: t('surugaya'),
      url: "https://www.suruga-ya.jp/",
      description: t('surugayaDesc'),
      logo: "surugaya.png"
    },
    {
      name: t('mandarake'),
      url: "https://www.mandarake.co.jp/",
      description: t('mandarakeDesc'),
      logo: "mandarake.png"
    },
    {
      name: t('animate'),
      url: "https://www.animate-onlineshop.jp/",
      description: t('animateDesc'),
      logo: "animate.png"
    },
    {
      name: t('jumpShop'),
      url: "https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwjcm66vh5-KAxUal7kFHUkQByQYABAAGgJ0bQ",
      description: t('jumpShopDesc'),
      logo: "jump.png"
    },
    {
      name: t('chiikawaStore'),
      url: "https://chiikawamarket.jp/",
      description: t('chiikawaStoreDesc'),
      logo: "chiikawa.png"
    },
    {
      name: t('cdJapan'),
      url: "https://www.cdjapan.co.jp/",
      description: t('cdJapanDesc'),
      logo: "CDJapan.png"
    },
    {
      name: t('evangelionStore'),
      url: "https://www.evastore.jp/shop/",
      description: t('evangelionStoreDesc'),
      logo: "eva.png"
    },
    {
      name: t('pokemonCenter'),
      url: "https://www.pokemoncenter-online.com/",
      description: t('pokemonCenterDesc'),
      logo: "pokemon.png"
    },
    {
      name: t('sailorMoonStore'),
      url: "https://sailormoon-store.com/shop/default.aspx",
      description: t('sailorMoonStoreDesc'),
      logo: "sailormoon.png"
    },
    {
      name: t('sanrioStore'),
      url: "https://shop.sanrio.co.jp/",
      description: t('sanrioStoreDesc'),
      logo: "sanrio.png"
    },
    {
      name: t('studioGhibliStore'),
      url: "https://www.donguri-sora.com/",
      description: t('studioGhibliStoreDesc'),
      logo: "ghibli.png"
    },
    {
      name: t('usjStore'),
      url: "https://www.onlinestore.usj.co.jp/",
      description: t('usjStoreDesc'),
      logo: "usj.png"
    },
    {
      name: t('disneyStore'),
      url: "https://store.disney.co.jp/",
      description: t('disneyStoreDesc'),
      logo: "disney.png"
    }
  ],
  figures_and_collectibles: [ /* Figuras y Juguetes de Colección */
    {
      name: t('mediaWorld'),
      url: "https://mediaworld.co.jp/?srsltid=AfmBOorw5PlhviizHbBrw5PGUDZ4FADX9GImZWgxrTScP6BfAt30h7Oe",
      description: t('mediaWorldDesc'),
      logo: "mediaworld.png"
    },
    {
      name: t('banpresto'),
      url: "https://bsp-prize.jp/",
      description: t('banprestoDesc'),
      logo: "banpresto.png"
    },
    {
      name: t('popMart'),
      url: "https://www.popmart.co.jp/",
      description: t('popMartDesc'),
      logo: "popmart.png"
    },
    {
      name: t('sylvanianFamilies'),
      url: "https://www.sylvanianfamilies.com/ja-jp/",
      description: t('sylvanianFamiliesDesc'),
      logo: "sylvanian.png"
    },
    {
      name: t('amiAmi'),
      url: "https://www.amiami.jp/",
      description: t('amiAmiDesc'),
      logo: "amiami.png"
    },
    {
      name: t('goodSmileOnline'),
      url: "https://www.goodsmile.com/ja",
      description: t('goodSmileOnlineDesc'),
      logo: "goodsmile.png"
    }
  ],
  fashion_and_lifestyle: [ /* Ropa y Accesorios */
    {
      name: t('uniqlo'),
      url: "https://www.uniqlo.com/jp/ja/",
      description: t('uniqloDesc'),
      logo: "uniqlo.png"
    },
    {
      name: t('gu'),
      url: "https://www.gu-global.com/jp/ja/",
      description: t('guDesc'),
      logo: "gu.png"
    },
    {
      name: t('zozotown'),
      url: "https://zozo.jp/",
      description: t('zozotownDesc'),
      logo: "zozo.png"
    },
    {
      name: t('graniph'),
      url: "https://www.graniph.com/",
      description: t('graniphDesc'),
      logo: "graniph.png"
    },
    {
      name: t('weverseShop'),
      url: "https://shop.weverse.io/ja/home",
      description: t('weverseShopDesc'),
      logo: "weverse.png"
    },
    {
      name: t('btsOfficialShop'),
      url: "https://bts-officialshop.jp/",
      description: t('btsOfficialShopDesc'),
      logo: "bts.png"
    },
    {
      name: t('newEra'),
      url: "https://www.neweracap.jp/",
      description: t('newEraDesc'),
      logo: "newera.png"
    },
    {
      name: t('onitsukaTiger'),
      url: "https://www.onitsukatiger.com/jp",
      description: t('onitsukaTigerDesc'),
      logo: "onitsuka.png"
    },
    {
      name: t('crocsJapan'),
      url: "https://www.crocs.co.jp/",
      description: t('crocsJapanDesc'),
      logo: "crocs.png"
    },
    {
      name: t('humanMadeJapan'),
      url: "https://humanmade.jp/",
      description: t('humanMadeJapanDesc'),
      logo: "humanmade.png"
    },
    {
      name: t('adidasJapan'),
      url: "https://www.adidas.jp/",
      description: t('adidasJapanDesc'),
      logo: "adidas.png"
    },
    {
      name: t('nikeJapan'),
      url: "https://nike.jp/",
      description: t('nikeJapanDesc'),
      logo: "nike.png"
    },
    {
      name: t('stripeClub'),
      url: "https://stripe-club.com/",
      description: t('stripeClubDesc'),
      logo: "stripe.png"
    }
  ],
  household_and_misc: [ /* Artículos para el Hogar y Decoración */
    {
      name: t('daisoJapan'),
      url: "https://jp.daisonet.com",
      description: t('daisoJapanDesc'),
      logo: "daiso.png"
    },
    {
      name: t('nitori'),
      url: "https://www.nitori-net.jp/ec/",
      description: t('nitoriDesc'),
      logo: "nitori.png"
    },
    {
      name: t('loft'),
      url: "https://www.loft.co.jp/",
      description: t('loftDesc'),
      logo: "loft.png"
    },
    {
      name: t('palCloset'),
      url: "https://www.palcloset.jp/",
      description: t('palClosetDesc'),
      logo: "palcloset.png"
    },
    {
      name: t('yodobashiCamera'),
      url: "https://www.yodobashi.com/",
      description: t('yodobashiCameraDesc'),
      logo: "yodobashi.png"
    },
    {
      name: t('mujiJapan'),
      url: "https://www.muji.com/jp/ja/store",
      description: t('mujiJapanDesc'),
      logo: "muji.png"
    }
  ],
  beauty_and_cosmetics: [ /* Belleza y Cosméticos */
    {
      name: t('oliveYoungGlobal'),
      url: "https://global.oliveyoung.com/",
      description: t('oliveYoungGlobalDesc'),
      logo: "oliveyoung.png"
    },
    {
      name: t('cosmeCom'),
      url: "https://www.cosme.com/",
      description: t('cosmeComDesc'),
      logo: "cosme.png"
    },
    {
      name: t('amazonJapan'),
      url: "https://www.amazon.co.jp/",
      description: t('amazonJapanDesc'),
      logo: "amazon.png"
    },
    {
      name: t('rakuten'),
      url: "https://www.rakuten.co.jp/",
      description: t('rakutenDesc'),
      logo: "rakuten.png"
    }
  ]
};


  const categoryLabels = {
  all: t('allCategories'),
  general_and_anime_goods: t('generalMarketplace'),
  official_anime_stores: t('animeMangaMerchandising'),
  fashion_and_lifestyle: t('fashionAccessories'),
  household_and_misc: t('householdDecoration'),
  beauty_and_cosmetics: t('beautyCosmetics'),
  figures_and_collectibles: t('figuresCollectibles')
};

  const getFilteredStores = () => {
    if (selectedCategory === 'all') {
      return Object.entries(storeCategories).flatMap(([category, stores]) => 
        stores.map(store => ({ ...store, category }))
      );
    }
    return storeCategories[selectedCategory as keyof typeof storeCategories]?.map(store => 
      ({ ...store, category: selectedCategory })
    ) || [];
  };

  const renderStoreCard = (store: any, index: number) => (
    <Card key={`${selectedCategory}-${index}`} className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-md animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border overflow-hidden">
            {store.logo ? (
              <img src={store.logo} alt={`${store.name} logo`} className="w-full h-full object-cover" />
            ) : (
              <div className="text-xs text-gray-400 text-center">LOGO</div>
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-2">{store.name}</h4>
            <p className="text-gray-600 text-sm">{store.description}</p>
          </div>
          <a 
            href={store.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600 transition-colors duration-300 flex-shrink-0"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[url(tile_background.png)] bg-repeat py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-scale-in">
          <div className="flex justify-center mb-4">
          <img src="KapyShoppingBags.png" alt="Capybara Logo" className="w-32" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('storeGuideTitle')}</h1>
          <p className="text-gray-600">{t('storeGuideDescription')}</p>
        </div>

        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {categoryLabels[selectedCategory as keyof typeof categoryLabels]}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {getFilteredStores().map((store, index) => renderStoreCard(store, index))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreGuide;
