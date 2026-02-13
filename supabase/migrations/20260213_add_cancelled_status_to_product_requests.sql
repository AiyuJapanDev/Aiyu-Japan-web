-- Add 'cancelled' status to product_request_status enum
-- This allows us to differentiate between rejected (needs fixing) and cancelled (order terminated)

-- Add the new value to the existing enum
-- Note: ALTER TYPE ADD VALUE cannot be executed inside a transaction block in some PostgreSQL versions
-- If this fails, you may need to run it separately in the SQL editor
ALTER TYPE product_request_status ADD VALUE IF NOT EXISTS 'cancelled';

-- Add comment explaining the difference
COMMENT ON TYPE product_request_status IS 
'Product request statuses:
- requested: Initial state
- quoted: Quote sent to customer
- paid: Customer paid the quote
- purchased: Admin purchased the item
- received: Item received at warehouse
- shipping_quoted: Shipping quote sent
- shipping_paid: Customer paid shipping
- shipped: Item shipped to customer
- rejected: Order rejected, customer can edit and resubmit
- cancelled: Order cancelled by admin or customer, cannot be resubmitted';
