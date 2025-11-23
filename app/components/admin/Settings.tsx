import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Loader2, Truck } from 'lucide-react';

interface CurrencyRate {
  id: string;
  currency_code: string;
  rate_to_jpy: number;
}

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
}

const Settings: React.FC = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [dhlFuelPercentage, setDhlFuelPercentage] = useState('32');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRates();
    fetchSystemSettings();
  }, []);

  const fetchRates = async () => {
    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('*')
        .order('currency_code');

      if (error) throw error;
      setRates(data || []);
    } catch (error) {
      console.error('Error fetching currency rates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load currency rates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('setting_key', 'dhl_fuel_percentage')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setDhlFuelPercentage(data.setting_value);
      }
    } catch (error) {
      console.error('Error fetching system settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load system settings',
        variant: 'destructive',
      });
    }
  };

  const updateRate = (id: string, value: string) => {
    setRates(rates.map(rate => 
      rate.id === id ? { ...rate, rate_to_jpy: parseFloat(value) || 0 } : rate
    ));
  };

  const handleSaveCurrencyRates = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      for (const rate of rates) {
        const { error } = await supabase
          .from('currency_rates')
          .update({ 
            rate_to_jpy: rate.rate_to_jpy,
            updated_by: user?.id 
          })
          .eq('id', rate.id);

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Currency rates updated successfully',
      });
    } catch (error) {
      console.error('Error updating currency rates:', error);
      toast({
        title: 'Error',
        description: 'Failed to update currency rates',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveShippingSettings = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: dhlFuelPercentage,
          updated_by: user?.id 
        })
        .eq('setting_key', 'dhl_fuel_percentage');

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Shipping settings updated successfully',
      });
    } catch (error) {
      console.error('Error updating shipping settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update shipping settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Currency Exchange Rates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Set the exchange rates from JPY to other currencies. These rates are used in the purchase and shipping calculators.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rates.map((rate) => (
              <div key={rate.id}>
                <label className="block text-sm font-medium mb-2">
                  1 JPY = {rate.currency_code}
                </label>
                <Input
                  type="number"
                  step="0.000001"
                  value={rate.rate_to_jpy}
                  onChange={(e) => updateRate(rate.id, e.target.value)}
                  placeholder={`Rate to ${rate.currency_code}`}
                />
              </div>
            ))}
          </div>
          <Button 
            onClick={handleSaveCurrencyRates} 
            disabled={saving}
            className="bg-blue-300 hover:bg-blue-400 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Currency Rates'
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Configure shipping-related settings such as DHL fuel surcharge percentage.
          </p>
          <div>
            <label className="block text-sm font-medium mb-2">
              DHL Fuel Surcharge (%)
            </label>
            <Input
              type="number"
              step="0.1"
              min="0"
              value={dhlFuelPercentage}
              onChange={(e) => setDhlFuelPercentage(e.target.value)}
              placeholder="Enter fuel surcharge percentage"
            />
            <p className="text-xs text-gray-500 mt-1">
              This percentage will be applied to all DHL shipments in the calculator.
            </p>
          </div>
          <Button 
            onClick={handleSaveShippingSettings} 
            disabled={saving}
            className="bg-blue-300 hover:bg-blue-400 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Shipping Settings'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
