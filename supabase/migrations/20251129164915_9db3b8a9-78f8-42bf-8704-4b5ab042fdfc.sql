-- Create function to allow admins to cancel orders
CREATE OR REPLACE FUNCTION public.admin_cancel_order(p_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_order_user_id UUID;
  v_quote_status TEXT;
BEGIN
  -- Check if caller is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  -- Get order details
  SELECT user_id INTO v_order_user_id
  FROM orders 
  WHERE id = p_order_id;
  
  IF v_order_user_id IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  
  -- Check if there's a paid quote (can't cancel if already paid)
  SELECT q.status INTO v_quote_status
  FROM quotes q
  WHERE q.order_id = p_order_id AND q.type = 'product' AND q.status = 'paid';
  
  IF v_quote_status = 'paid' THEN
    RAISE EXCEPTION 'Cannot cancel order that has already been paid';
  END IF;
  
  -- Mark order as cancelled
  UPDATE orders 
  SET 
    is_cancelled = true,
    status = 'cancelled'::order_status,
    cancelled_at = now(),
    updated_at = now()
  WHERE id = p_order_id;
  
  -- Update product requests status to 'rejected' with cancellation reason
  UPDATE product_requests 
  SET 
    status = 'rejected'::product_request_status,
    rejection_reason = 'Order cancelled by admin',
    updated_at = now()
  WHERE id IN (
    SELECT product_request_id FROM order_items WHERE order_id = p_order_id
  );
  
  RETURN TRUE;
END;
$$;