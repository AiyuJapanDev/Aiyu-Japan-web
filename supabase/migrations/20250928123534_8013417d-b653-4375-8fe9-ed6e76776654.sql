-- Add quote_url field to shipping_quotes table if not exists
ALTER TABLE public.shipping_quotes 
ADD COLUMN IF NOT EXISTS quote_url TEXT;