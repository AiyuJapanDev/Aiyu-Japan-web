-- Add weight field to product_requests table if it doesn't exist
ALTER TABLE public.product_requests 
ADD COLUMN IF NOT EXISTS weight INTEGER;