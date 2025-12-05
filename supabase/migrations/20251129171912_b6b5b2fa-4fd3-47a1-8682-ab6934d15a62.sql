-- Add dimension columns to product_requests table
ALTER TABLE product_requests ADD COLUMN width integer;
ALTER TABLE product_requests ADD COLUMN length integer;
ALTER TABLE product_requests ADD COLUMN height integer;

COMMENT ON COLUMN product_requests.width IS 'Width in centimeters';
COMMENT ON COLUMN product_requests.length IS 'Length in centimeters';
COMMENT ON COLUMN product_requests.height IS 'Height in centimeters';