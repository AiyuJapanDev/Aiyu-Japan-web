-- Drop the existing check constraint if it exists
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quote_reference_check;

-- Add a new check constraint that ensures exactly one reference is set
ALTER TABLE quotes ADD CONSTRAINT quote_reference_check 
CHECK (
  (product_request_id IS NOT NULL AND order_id IS NULL) OR 
  (product_request_id IS NULL AND order_id IS NOT NULL)
);