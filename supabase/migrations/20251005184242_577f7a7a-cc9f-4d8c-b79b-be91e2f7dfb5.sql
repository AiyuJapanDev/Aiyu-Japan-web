-- Function to clear shipping issues when a shipping quote is rejected
CREATE OR REPLACE FUNCTION public.clear_shipping_issues_on_rejection()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only clear issues if status changed TO 'rejected'
  IF NEW.status = 'rejected' AND (OLD.status IS NULL OR OLD.status != 'rejected') THEN
    -- Clear has_shipping_issue and shipping_issue_description for all product requests
    -- that are part of the items in this shipping quote
    UPDATE product_requests pr
    SET 
      has_shipping_issue = false,
      shipping_issue_description = NULL,
      updated_at = now()
    FROM (
      SELECT DISTINCT (item->>'order_item_id')::uuid as order_item_id
      FROM jsonb_array_elements(NEW.items) as item
      WHERE item->>'order_item_id' IS NOT NULL
    ) items_data
    JOIN order_items oi ON oi.id = items_data.order_item_id
    WHERE pr.id = oi.product_request_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to clear shipping issues after rejection
CREATE TRIGGER clear_shipping_issues_after_rejection
  AFTER UPDATE ON shipping_quotes
  FOR EACH ROW
  EXECUTE FUNCTION clear_shipping_issues_on_rejection();