-- Add rejection_details JSONB column to orders table to store immutable snapshot of rejection data
ALTER TABLE orders 
ADD COLUMN rejection_details JSONB;

COMMENT ON COLUMN orders.rejection_details IS 'Immutable snapshot of rejection data including reason and product issues at time of rejection';