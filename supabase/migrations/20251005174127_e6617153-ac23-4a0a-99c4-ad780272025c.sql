-- Add rejection_details column to shipping_quotes table to store snapshot of rejection data
ALTER TABLE shipping_quotes 
ADD COLUMN rejection_details jsonb;