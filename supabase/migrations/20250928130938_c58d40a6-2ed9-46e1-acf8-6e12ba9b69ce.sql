-- Fix the security issue by setting search_path in the function
CREATE OR REPLACE FUNCTION clear_product_issues_on_shipping_quote()
RETURNS TRIGGER AS $$
BEGIN
  -- Clear has_issue and issue_description for all product requests
  -- that are part of the items in this shipping quote
  UPDATE product_requests pr
  SET 
    has_issue = false,
    issue_description = NULL,
    updated_at = now()
  FROM (
    SELECT DISTINCT (item->>'order_item_id')::uuid as order_item_id
    FROM jsonb_array_elements(NEW.items) as item
    WHERE item->>'order_item_id' IS NOT NULL
  ) items_data
  JOIN order_items oi ON oi.id = items_data.order_item_id
  WHERE pr.id = oi.product_request_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;