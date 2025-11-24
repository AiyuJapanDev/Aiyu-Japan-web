import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyRates {
  usd: number;
  mxn: number;
  clp: number;
}

export const useCurrencyRates = () => {
  const [rates, setRates] = useState<CurrencyRates>({
    usd: 0.0069,
    mxn: 0.14,
    clp: 6.56
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('currency_code, rate_to_jpy');

      if (error) throw error;

      if (data) {
        const ratesMap: CurrencyRates = {
          usd: 0.0069,
          mxn: 0.14,
          clp: 6.56
        };

        data.forEach((rate) => {
          const code = rate.currency_code.toLowerCase() as keyof CurrencyRates;
          if (code in ratesMap) {
            ratesMap[code] = Number(rate.rate_to_jpy);
          }
        });

        setRates(ratesMap);
      }
    } catch (error) {
      console.error('Error fetching currency rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = (amountJpy: number, currency: 'usd' | 'mxn' | 'clp'): string => {
    const converted = amountJpy * rates[currency];
    return converted.toFixed(2);
  };

  return { rates, loading, convertCurrency };
};
