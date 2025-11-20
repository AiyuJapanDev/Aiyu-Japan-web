-- Phase 1: Immediate Security Fix - Secure Currency Rates Table
-- Replace public access with authenticated user access only

DROP POLICY IF EXISTS "Anyone can view currency rates" ON public.currency_rates;

CREATE POLICY "Authenticated users can view currency rates" 
ON public.currency_rates 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);