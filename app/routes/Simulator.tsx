import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, ExternalLink } from 'lucide-react';

const Simulator = () => {
    const { t } = useApp();
    const [productCost, setProductCost] = useState('');
    const [destination, setDestination] = useState('');
    const [results, setResults] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // To prevent double calculation animation

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateCosts = () => {
    const cost = parseFloat(productCost);
    if (!cost || !destination) return;

    const serviceFee = 500;
    const tax = cost * 0.1;
    const shippingCost = getShippingCost(destination);
    const total = cost + serviceFee + tax + shippingCost;

    setResults({
      productCost: cost,
      serviceFee,
      tax,
      shippingCost,
      total
    });
  };

  const getShippingCost = (country) => {
    const shippingRates = {
      'US': 2500,
      'CA': 2800,
      'GB': 2200,
      'AU': 3000,
      'DE': 2300,
      'FR': 2300,
      'ES': 2400,
      'IT': 2400,
      'BR': 3500,
      'MX': 3200,
      'KR': 1800,
      'TW': 1600,
      'SG': 2000
    };
    return shippingRates[country] || 2500;
  };

  const animeStores = [
    { name: "AmiAmi", url: "https://www.amiami.com/", category: t("figuresCollectiblesCategory") },
    { name: "HobbyLink Japan", url: "https://www.hlj.com/", category: t("modelKitsFiguresCategory") },
    { name: "Mandarake", url: "https://order.mandarake.co.jp/", category: t("rareVintageCategory") },
    { name: "Good Smile Company", url: "https://goodsmileshop.com/", category: t("officialFiguresCategory") }
  ];

  const fashionStores = [
    { name: "Uniqlo Japan", url: "https://www.uniqlo.com/jp/", category: t("casualWearCategory") },
    { name: "Rakuten Fashion", url: "https://fashion.rakuten.co.jp/", category: t("fashionMallCategory") },
    { name: "Zozotown", url: "https://zozo.jp/", category: t("trendyFashionCategory") },
    { name: "Wego", url: "https://www.wego.jp/", category: t("streetFashionCategory") }
  ];

  const electronicsStores = [
    { name: "Yodobashi Camera", url: "https://www.yodobashi.com/", category: t("consumerElectronicsCategory") },
    { name: "Bic Camera", url: "https://www.biccamera.com/", category: t("consumerElectronicsCategory") },
    { name: "Amazon Japan", url: "https://amazon.co.jp/", category: t("everythingElectronicsCategory") },
    { name: "Rakuten", url: "https://www.rakuten.co.jp/", category: t("onlineMallCategory") }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-scale-in">
          <span className="text-6xl mb-4 block">🦫</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('quotationSimulator')}</h1>
          <p className="text-gray-600">{t('simulatorSubtitle')}</p>
        </div>

        <Tabs defaultValue="simulator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="simulator" className="transition-all duration-300">{t('quotationSimulator')}</TabsTrigger>
            <TabsTrigger value="stores" className="transition-all duration-300">{t('storeGuide')}</TabsTrigger>
          </TabsList>

          <TabsContent value="simulator" className="animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-400" />
                    {t('costCalculator')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cost">{t('productCost')}</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder={t('enterCostPlaceholder')}
                      value={productCost}
                      onChange={(e) => setProductCost(e.target.value)}
                      className="transition-all duration-300 focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">{t('destination')}</Label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-blue-300">
                        <SelectValue placeholder={t('selectCountryPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">{t('countryUS')}</SelectItem>
                        <SelectItem value="CA">{t('countryCA')}</SelectItem>
                        <SelectItem value="GB">{t('countryGB')}</SelectItem>
                        <SelectItem value="AU">{t('countryAU')}</SelectItem>
                        <SelectItem value="DE">{t('countryDE')}</SelectItem>
                        <SelectItem value="FR">{t('countryFR')}</SelectItem>
                        <SelectItem value="ES">{t('countryES')}</SelectItem>
                        <SelectItem value="IT">{t('countryIT')}</SelectItem>
                        <SelectItem value="BR">{t('countryBR')}</SelectItem>
                        <SelectItem value="MX">{t('countryMX')}</SelectItem>
                        <SelectItem value="KR">{t('countryKR')}</SelectItem>
                        <SelectItem value="TW">{t('countryTW')}</SelectItem>
                        <SelectItem value="SG">{t('countrySG')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={calculateCosts} 
                    className="w-full bg-blue-300 hover:bg-blue-400 text-white rounded-full hover-scale transition-all duration-300"
                    disabled={!productCost || !destination}
                  >
                    {t('calculate')}
                  </Button>
                </CardContent>
              </Card>

              {results && (
                <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg animate-scale-in">
                  <CardHeader>
                    <CardTitle>{t('costBreakdown')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>{t('productCostLabel')}</span>
                      <span>¥{results.productCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('serviceFee')}:</span>
                      <span>¥{results.serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('handlingFee')}:</span>
                      <span>¥{results.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('estimatedShipping')}:</span>
                      <span>¥{results.shippingCost.toLocaleString()}</span>
                    </div>
                    <hr className="border-blue-200" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>{t('total')}:</span>
                      <span className="text-blue-600">¥{results.total.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stores" className="animate-fade-in">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('animeStores')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {animeStores.map((store, index) => (
                    <Card key={index} className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 hover-scale">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-gray-900">{store.name}</h4>
                            <p className="text-gray-600 text-sm">{store.category}</p>
                          </div>
                          <a 
                            href={store.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-600 transition-colors duration-300"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('fashionStores')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {fashionStores.map((store, index) => (
                    <Card key={index} className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 hover-scale">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-gray-900">{store.name}</h4>
                            <p className="text-gray-600 text-sm">{store.category}</p>
                          </div>
                          <a 
                            href={store.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-600 transition-colors duration-300"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('electronicsStores')}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {electronicsStores.map((store, index) => (
                    <Card key={index} className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 hover-scale">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-gray-900">{store.name}</h4>
                            <p className="text-gray-600 text-sm">{store.category}</p>
                          </div>
                          <a 
                            href={store.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-600 transition-colors duration-300"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Simulator;
