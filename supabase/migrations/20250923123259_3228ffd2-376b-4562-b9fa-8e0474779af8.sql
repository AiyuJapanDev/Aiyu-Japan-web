-- Drop the existing trigger that creates individual orders for each product request
DROP TRIGGER IF EXISTS create_order_on_product_request ON product_requests;

-- Drop the function as we'll handle order creation differently
DROP FUNCTION IF EXISTS create_order_for_product_requests();

-- Create a function to handle batch product request submission with order creation
CREATE OR REPLACE FUNCTION public.create_order_with_product_requests(
  p_user_id UUID,
  p_product_requests JSONB
)
RETURNS TABLE (
  order_id UUID,
  product_request_ids UUID[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_order_id UUID;
  v_product_request_id UUID;
  v_product_request_ids UUID[] := '{}';
  v_request JSONB;
BEGIN
  -- Create a new order
  INSERT INTO orders (user_id, status, created_at, updated_at)
  VALUES (p_user_id, 'preparing', now(), now())
  RETURNING id INTO v_order_id;
  
  -- Process each product request
  FOR v_request IN SELECT * FROM jsonb_array_elements(p_product_requests)
  LOOP
    -- Create product request
    INSERT INTO product_requests (
      user_id,
      product_url,
      item_name,
      quantity,
      notes,
      status,
      created_at,
      updated_at
    )
    VALUES (
      p_user_id,
      v_request->>'product_url',
      v_request->>'item_name',
      COALESCE((v_request->>'quantity')::INTEGER, 1),
      v_request->>'notes',
      'requested'::product_request_status,
      now(),
      now()
    )
    RETURNING id INTO v_product_request_id;
    
    -- Add to array
    v_product_request_ids := array_append(v_product_request_ids, v_product_request_id);
    
    -- Link product request to order
    INSERT INTO order_items (order_id, product_request_id, created_at)
    VALUES (v_order_id, v_product_request_id, now());
  END LOOP;
  
  -- Return the created order and product request IDs
  RETURN QUERY SELECT v_order_id, v_product_request_ids;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_order_with_product_requests(UUID, JSONB) TO authenticated;

-- Create RLS policy for the function (users can only create orders for themselves)
CREATE POLICY "Users can create their own orders with products"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Ensure order_items RLS allows users to create items for their orders
CREATE POLICY "Users can create order items for their orders"
  ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
      AND o.user_id = auth.uid()
    )
  );

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_request_id ON order_items(product_request_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id_created_at ON orders(user_id, created_at DESC);