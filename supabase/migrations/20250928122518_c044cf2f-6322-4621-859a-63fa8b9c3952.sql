-- Add rejection_reason and tracking_url to shipping_quotes table
ALTER TABLE public.shipping_quotes 
ADD COLUMN rejection_reason TEXT,
ADD COLUMN tracking_url TEXT;

-- Update the status check constraint to include 'rejected' status
-- First drop the existing constraint if it exists
ALTER TABLE public.shipping_quotes 
DROP CONSTRAINT IF EXISTS shipping_quotes_status_check;

-- Add new constraint with all valid statuses
ALTER TABLE public.shipping_quotes 
ADD CONSTRAINT shipping_quotes_status_check 
CHECK (status IN ('pending', 'quoted', 'paid', 'sent', 'rejected'));