-- Update clear_product_issues_on_shipping_quote function to use correct column names
CREATE OR REPLACE FUNCTION public.clear_product_issues_on_shipping_quote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Clear has_purchase_issue and purchase_issue_description for all product requests
  -- that are part of the items in this shipping quote
  UPDATE product_requests pr
  SET 
    has_purchase_issue = false,
    purchase_issue_description = NULL,
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
$function$;

-- Update clear_product_issues_on_approval function to use correct column names
CREATE OR REPLACE FUNCTION public.clear_product_issues_on_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only clear issues if status changed from 'rejected' to something else
  IF OLD.status = 'rejected' AND NEW.status != 'rejected' THEN
    -- Clear has_purchase_issue and purchase_issue_description for all product requests
    -- that are part of the items in this shipping quote
    UPDATE product_requests pr
    SET 
      has_purchase_issue = false,
      purchase_issue_description = NULL,
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
$function$;