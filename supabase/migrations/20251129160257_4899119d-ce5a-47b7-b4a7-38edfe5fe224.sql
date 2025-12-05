-- Add 'cancelled' to order_status enum
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'cancelled';

-- Add is_cancelled and cancelled_at columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_cancelled boolean DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at timestamp with time zone;

-- Update the cancel_order RPC function to mark orders as cancelled instead of deleting
CREATE OR REPLACE FUNCTION public.cancel_order(p_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Mark order as cancelled (instead of deleting)
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
    rejection_reason = 'Order cancelled by user',
    updated_at = now()
  WHERE id IN (
    SELECT product_request_id FROM order_items WHERE order_id = p_order_id
  );
  
  RETURN TRUE;
END;
$function$;