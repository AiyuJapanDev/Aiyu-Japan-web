-- Create table for currency rates
CREATE TABLE public.currency_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  currency_code TEXT NOT NULL UNIQUE,
  rate_to_jpy NUMERIC(10, 6) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read currency rates (needed for calculators)
CREATE POLICY "Anyone can view currency rates"
ON public.currency_rates
FOR SELECT
USING (true);

-- Only admins can update currency rates
CREATE POLICY "Admins can update currency rates"
ON public.currency_rates
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert currency rates
CREATE POLICY "Admins can insert currency rates"
ON public.currency_rates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default currency rates
INSERT INTO public.currency_rates (currency_code, rate_to_jpy) VALUES
  ('USD', 0.0069),
  ('MXN', 0.14),
  ('CLP', 6.56);

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_currency_rates_updated_at
  BEFORE UPDATE ON public.currency_rates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();