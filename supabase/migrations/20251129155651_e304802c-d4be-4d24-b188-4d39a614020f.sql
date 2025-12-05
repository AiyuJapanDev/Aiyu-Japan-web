-- Create function to cancel an order
CREATE OR REPLACE FUNCTION public.cancel_order(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_quote_status TEXT;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  -- Verify the order belongs to the user
  IF NOT EXISTS (
    SELECT 1 FROM orders 
    WHERE id = p_order_id AND user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'Order not found or access denied';
  END IF;
  
  -- Check if there's a paid quote (can't cancel if already paid)
  SELECT q.status INTO v_quote_status
  FROM quotes q
  WHERE q.order_id = p_order_id AND q.type = 'product' AND q.status = 'paid';
  
  IF v_quote_status = 'paid' THEN
    RAISE EXCEPTION 'Cannot cancel order that has already been paid';
  END IF;
  
  -- Delete quotes first
  DELETE FROM quotes WHERE order_id = p_order_id;
  
  -- Delete product requests associated with order items
  DELETE FROM product_requests 
  WHERE id IN (
    SELECT product_request_id FROM order_items WHERE order_id = p_order_id
  );
  
  -- Delete order items
  DELETE FROM order_items WHERE order_id = p_order_id;
  
  -- Delete the order
  DELETE FROM orders WHERE id = p_order_id;
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.cancel_order(UUID) TO authenticated;