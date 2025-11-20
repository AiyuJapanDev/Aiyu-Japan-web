-- Add tracking_urls column to shipping_quotes table to support multiple tracking URLs for box items
ALTER TABLE shipping_quotes 
ADD COLUMN tracking_urls jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN shipping_quotes.tracking_urls IS 'Array of tracking URL objects for box items: [{item_id, tracking_url, box_description}]';