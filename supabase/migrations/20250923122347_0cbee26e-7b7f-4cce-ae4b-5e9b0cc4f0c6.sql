-- Fix the search path security issue for the new function
CREATE OR REPLACE FUNCTION public.create_order_for_product_requests()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
  v_user_id UUID;
BEGIN
  -- Get the user_id from the first inserted product request
  v_user_id := NEW.user_id;
  
  -- Create a new order for this batch of product requests
  INSERT INTO public.orders (user_id, status, created_at, updated_at)
  VALUES (v_user_id, 'preparing', now(), now())
  RETURNING id INTO v_order_id;
  
  -- Link the product request to the order
  INSERT INTO public.order_items (order_id, product_request_id, created_at)
  VALUES (v_order_id, NEW.id, now());
  
  RETURN NEW;
END;
$$;