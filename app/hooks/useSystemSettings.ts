import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SystemSettings {
  dhlFuelPercentage: number;
}

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    dhlFuelPercentage: 32, // Default fallback
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .eq('setting_key', 'dhl_fuel_percentage')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          dhlFuelPercentage: parseFloat(data.setting_value) || 32,
        });
      }
    } catch (error) {
      // Use default values on error
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading };
};
