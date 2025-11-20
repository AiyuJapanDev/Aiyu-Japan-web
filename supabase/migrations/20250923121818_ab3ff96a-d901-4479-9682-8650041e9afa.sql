-- Remove extra columns from product_requests table
ALTER TABLE public.product_requests 
DROP COLUMN IF EXISTS order_group_id,
DROP COLUMN IF EXISTS edit_version,
DROP COLUMN IF EXISTS warehouse_arrival_date;

-- First, drop the default constraint
ALTER TABLE public.product_requests ALTER COLUMN status DROP DEFAULT;

-- Create a temporary enum with the desired values
CREATE TYPE product_request_status_new AS ENUM (
  'requested',
  'quoted', 
  'paid',
  'purchased',
  'received',
  'shipping_quoted',
  'shipping_paid',
  'shipped',
  'rejected'
);

-- Update the column to use the new enum
ALTER TABLE public.product_requests 
ALTER COLUMN status TYPE product_request_status_new 
USING status::text::product_request_status_new;

-- Drop the old enum
DROP TYPE product_request_status;

-- Rename the new enum to the original name
ALTER TYPE product_request_status_new RENAME TO product_request_status;

-- Re-add the default constraint with the correct type
ALTER TABLE public.product_requests ALTER COLUMN status SET DEFAULT 'requested'::product_request_status;