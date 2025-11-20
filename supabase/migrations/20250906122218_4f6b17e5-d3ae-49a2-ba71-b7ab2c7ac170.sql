-- Add missing statuses to product_request_status enum
ALTER TYPE product_request_status ADD VALUE IF NOT EXISTS 'shipping_quoted' AFTER 'received';
ALTER TYPE product_request_status ADD VALUE IF NOT EXISTS 'shipping_paid' AFTER 'shipping_quoted';