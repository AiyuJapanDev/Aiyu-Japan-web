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
    { name: "AmiAmi", url: "https://www.amiami.com/", category: "Figures & Collectibles" },
    { name: "HobbyLink Japan", url: "https://www.hlj.com/", category: "Model Kits & Figures" },
    { name: "Mandarake", url: "https://order.mandarake.co.jp/", category: "Rare & Vintage" },
    { name: "Good Smile Company", url: "https://goodsmileshop.com/", category: "Official Figures" }
  ];

  const fashionStores = [
    { name: "Uniqlo Japan", url: "https://www.uniqlo.com/jp/", category: "Casual Wear" },
    { name: "Rakuten Fashion", url: "https://fashion.rakuten.co.jp/", category: "Fashion Mall" },
    { name: "Zozotown", url: "https://zozo.jp/", category: "Trendy Fashion" },
    { name: "Wego", url: "https://www.wego.jp/", category: "Street Fashion" }
  ];

  const electronicsStores = [
    { name: "Yodobashi Camera", url: "https://www.yodobashi.com/", category: "Electronics & Cameras" },
    { name: "Bic Camera", url: "https://www.biccamera.com/", category: "Consumer Electronics" },
    { name: "Amazon Japan", url: "https://amazon.co.jp/", category: "Everything Electronics" },
    { name: "Rakuten", url: "https://www.rakuten.co.jp/", category: "Online Mall" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-scale-in">
          <span className="text-6xl mb-4 block">🦫</span>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('quotationSimulator')}</h1>
          <p className="text-gray-600">Estimate your shopping costs and discover great Japanese stores</p>
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
                    Cost Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cost">{t('productCost')}</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="Enter cost in Japanese Yen (¥)"
                      value={productCost}
                      onChange={(e) => setProductCost(e.target.value)}
                      className="transition-all duration-300 focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">{t('destination')}</Label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger className="transition-all duration-300 focus:ring-2 focus:ring-blue-300">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="FR">France</SelectItem>
                        <SelectItem value="ES">Spain</SelectItem>
                        <SelectItem value="IT">Italy</SelectItem>
                        <SelectItem value="BR">Brazil</SelectItem>
                        <SelectItem value="MX">Mexico</SelectItem>
                        <SelectItem value="KR">South Korea</SelectItem>
                        <SelectItem value="TW">Taiwan</SelectItem>
                        <SelectItem value="SG">Singapore</SelectItem>
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
                    <CardTitle>Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Product Cost:</span>
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
