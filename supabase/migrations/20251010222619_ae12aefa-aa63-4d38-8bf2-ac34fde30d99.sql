-- Function to notify all admins about a new order
-- Uses SECURITY DEFINER to bypass RLS and safely notify admins
CREATE OR REPLACE FUNCTION public.notify_admins_about_order(
  p_type text,
  p_message text,
  p_order_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record RECORD;
BEGIN
  -- Loop through all admin users and create notifications
  FOR admin_record IN 
    SELECT user_id 
    FROM public.user_roles 
    WHERE role = 'admin'
  LOOP
    INSERT INTO public.notifications (user_id, type, message, order_group_id)
    VALUES (admin_record.user_id, p_type, p_message, p_order_id);
  END LOOP;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.notify_admins_about_order(text, text, uuid) TO authenticated;