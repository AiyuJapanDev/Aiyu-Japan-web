-- Add personal ID columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_personal_id TEXT;
ALTER TABLE shipping_quotes ADD COLUMN IF NOT EXISTS shipment_personal_id TEXT;

-- Function to generate next order_personal_id
CREATE OR REPLACE FUNCTION generate_order_personal_id()
RETURNS TRIGGER AS $$
DECLARE
  next_id INTEGER;
BEGIN
  -- Only generate if not already set
  IF NEW.order_personal_id IS NULL OR NEW.order_personal_id = '' THEN
    -- Get the max personal ID for this user
    SELECT COALESCE(MAX(CAST(order_personal_id AS INTEGER)), 0) + 1
    INTO next_id
    FROM orders
    WHERE user_id = NEW.user_id
    AND order_personal_id ~ '^\d+$'; -- Only numeric IDs
    
    -- Format with leading zeros (4 digits)
    NEW.order_personal_id := LPAD(next_id::TEXT, 4, '0');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to generate next shipment_personal_id
CREATE OR REPLACE FUNCTION generate_shipment_personal_id()
RETURNS TRIGGER AS $$
DECLARE
  next_id INTEGER;
BEGIN
  -- Only generate if not already set
  IF NEW.shipment_personal_id IS NULL OR NEW.shipment_personal_id = '' THEN
    -- Get the max personal ID for this user
    SELECT COALESCE(MAX(CAST(shipment_personal_id AS INTEGER)), 0) + 1
    INTO next_id
    FROM shipping_quotes
    WHERE user_id = NEW.user_id
    AND shipment_personal_id ~ '^\d+$'; -- Only numeric IDs
    
    -- Format with leading zeros (4 digits)
    NEW.shipment_personal_id := LPAD(next_id::TEXT, 4, '0');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers
DROP TRIGGER IF EXISTS set_order_personal_id ON orders;
CREATE TRIGGER set_order_personal_id
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_personal_id();

DROP TRIGGER IF EXISTS set_shipment_personal_id ON shipping_quotes;
CREATE TRIGGER set_shipment_personal_id
BEFORE INSERT ON shipping_quotes
FOR EACH ROW
EXECUTE FUNCTION generate_shipment_personal_id();

-- Backfill existing orders
WITH numbered_orders AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as rn
  FROM orders
  WHERE order_personal_id IS NULL OR order_personal_id = ''
)
UPDATE orders o
SET order_personal_id = LPAD(numbered_orders.rn::TEXT, 4, '0')
FROM numbered_orders
WHERE o.id = numbered_orders.id;

-- Backfill existing shipping_quotes
WITH numbered_quotes AS (
  SELECT 
    id,
    user_id,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as rn
  FROM shipping_quotes
  WHERE shipment_personal_id IS NULL OR shipment_personal_id = ''
)
UPDATE shipping_quotes sq
SET shipment_personal_id = LPAD(numbered_quotes.rn::TEXT, 4, '0')
FROM numbered_quotes
WHERE sq.id = numbered_quotes.id;

-- Make columns NOT NULL with default
ALTER TABLE orders ALTER COLUMN order_personal_id SET DEFAULT '';
ALTER TABLE orders ALTER COLUMN order_personal_id SET NOT NULL;

ALTER TABLE shipping_quotes ALTER COLUMN shipment_personal_id SET DEFAULT '';
ALTER TABLE shipping_quotes ALTER COLUMN shipment_personal_id SET NOT NULL;