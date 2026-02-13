-- Update admin_cancel_order function to allow emergency cancellations even for paid orders
-- This is needed for cases where items are out of stock or unavailable after purchase

CREATE OR REPLACE FUNCTION public.admin_cancel_order(p_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_order_user_id UUID;
  v_order_personal_id TEXT;
BEGIN
  -- Check if caller is an admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  -- Get order details
  SELECT user_id, order_personal_id INTO v_order_user_id, v_order_personal_id
  FROM orders 
  WHERE id = p_order_id;
  
  IF v_order_user_id IS NULL THEN
    RAISE EXCEPTION 'Order not found';
  END IF;
  
  -- Note: Removed the paid quote check to allow emergency cancellations
  -- Admins can now cancel orders at any stage for emergency situations
  -- (e.g., out of stock, unavailable items after purchase)
  
  -- Mark order as cancelled
  UPDATE orders 
  SET 
    is_cancelled = true,
    status = 'cancelled'::order_status,
    cancelled_at = now(),
    updated_at = now()
  WHERE id = p_order_id;
  
  -- Update all product requests related to this order
  -- Note: Using 'cancelled' status (added in separate migration)
  UPDATE product_requests 
  SET 
    status = 'cancelled'::product_request_status,
    updated_at = now()
  WHERE id IN (
    SELECT product_request_id FROM order_items WHERE order_id = p_order_id
  );
  
  -- Create notification for user about the cancellation
  INSERT INTO notifications (user_id, type, message, personal_order_id, created_at)
  VALUES (
    v_order_user_id,
    'order_cancelled',
    'Order #' || v_order_personal_id || ' has been cancelled by administration. You will be contacted shortly regarding this cancellation.',
    v_order_personal_id,
    now()
  );
  
  RETURN TRUE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.admin_cancel_order(uuid) TO authenticated;
