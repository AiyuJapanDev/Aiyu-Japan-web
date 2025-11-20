-- Create a trigger function to clear product issues when shipping quote is approved (status changes from rejected)
CREATE OR REPLACE FUNCTION clear_product_issues_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- Only clear issues if status changed from 'rejected' to something else
  IF OLD.status = 'rejected' AND NEW.status != 'rejected' THEN
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
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to execute the function after shipping quote is updated
CREATE TRIGGER clear_issues_on_approval
AFTER UPDATE ON shipping_quotes
FOR EACH ROW
EXECUTE FUNCTION clear_product_issues_on_approval();