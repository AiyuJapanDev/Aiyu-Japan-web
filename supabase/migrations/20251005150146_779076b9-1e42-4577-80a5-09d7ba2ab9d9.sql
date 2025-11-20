-- Rename existing issue columns to be specific to purchase phase
ALTER TABLE product_requests 
  RENAME COLUMN has_issue TO has_purchase_issue;

ALTER TABLE product_requests 
  RENAME COLUMN issue_description TO purchase_issue_description;

-- Add new columns for shipping phase issues
ALTER TABLE product_requests 
  ADD COLUMN has_shipping_issue boolean DEFAULT false,
  ADD COLUMN shipping_issue_description text;

-- Add comment to clarify the purpose of each column
COMMENT ON COLUMN product_requests.has_purchase_issue IS 'Issue flagged during product quote/purchase phase';
COMMENT ON COLUMN product_requests.purchase_issue_description IS 'Description of issue during purchase phase';
COMMENT ON COLUMN product_requests.has_shipping_issue IS 'Issue flagged during shipping quote phase';
COMMENT ON COLUMN product_requests.shipping_issue_description IS 'Description of issue during shipping phase';