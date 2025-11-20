-- Add quantity and notes fields to product_requests table
ALTER TABLE public.product_requests 
ADD COLUMN quantity integer NOT NULL DEFAULT 1,
ADD COLUMN notes text;

-- Add constraint to ensure quantity is positive
ALTER TABLE public.product_requests
ADD CONSTRAINT positive_quantity CHECK (quantity > 0);