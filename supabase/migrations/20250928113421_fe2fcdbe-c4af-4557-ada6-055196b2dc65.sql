-- Update existing shipping quotes to include product URLs
DO $$
DECLARE
  quote_record RECORD;
  item JSONB;
  updated_items JSONB;
  item_index INT;
  product_url_value TEXT;
BEGIN
  -- Loop through all shipping quotes
  FOR quote_record IN SELECT id, items FROM shipping_quotes
  LOOP
    updated_items := '[]'::JSONB;
    
    -- Loop through each item in the quote
    FOR item_index IN 0..(jsonb_array_length(quote_record.items) - 1)
    LOOP
      item := quote_record.items->item_index;
      
      -- Look up the product URL from product_requests via order_items
      SELECT pr.product_url INTO product_url_value
      FROM order_items oi
      JOIN product_requests pr ON pr.id = oi.product_request_id
      WHERE oi.order_id = (item->>'order_id')::UUID
        AND (pr.item_name = item->>'item_name' OR 
             (pr.item_name IS NULL AND item->>'item_name' IS NULL))
      LIMIT 1;
      
      -- Add product_url to the item if found
      IF product_url_value IS NOT NULL THEN
        item := jsonb_set(item, '{product_url}', to_jsonb(product_url_value));
      END IF;
      
      -- Append the updated item to the array
      updated_items := updated_items || item;
    END LOOP;
    
    -- Update the shipping quote with the new items array
    UPDATE shipping_quotes 
    SET items = updated_items,
        updated_at = now()
    WHERE id = quote_record.id;
  END LOOP;
END $$;