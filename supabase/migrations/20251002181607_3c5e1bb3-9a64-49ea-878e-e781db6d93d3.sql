-- Revert currency_rates to public access for the public calculator
-- Exchange rates are non-sensitive business data needed for conversion estimates

DROP POLICY IF EXISTS "Authenticated users can view currency rates" ON public.currency_rates;

CREATE POLICY "Anyone can view currency rates" 
ON public.currency_rates 
FOR SELECT 
USING (true);