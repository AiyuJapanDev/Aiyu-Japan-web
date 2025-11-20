-- Add rejection support to product_requests
ALTER TYPE product_request_status ADD VALUE IF NOT EXISTS 'rejected';

-- Add rejection reason column
ALTER TABLE public.product_requests 
ADD COLUMN rejection_reason text;