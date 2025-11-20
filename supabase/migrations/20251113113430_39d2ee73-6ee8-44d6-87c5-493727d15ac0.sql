-- Create system_settings table for configurable system values
CREATE TABLE IF NOT EXISTS public.system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value text NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Admins can manage all settings
CREATE POLICY "Admins can manage settings"
  ON public.system_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Everyone can read settings (needed for calculator)
CREATE POLICY "Anyone can read settings"
  ON public.system_settings FOR SELECT
  USING (true);

-- Insert default DHL fuel percentage
INSERT INTO public.system_settings (setting_key, setting_value, description)
VALUES (
  'dhl_fuel_percentage',
  '32',
  'Fuel surcharge percentage for DHL shipments'
)
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();