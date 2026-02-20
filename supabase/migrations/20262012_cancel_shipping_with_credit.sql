CREATE OR REPLACE FUNCTION cancel_shipping_with_credit(
  target_user_id UUID,
  credit_amount NUMERIC,
  cancel_reason TEXT,
  target_shipping_id UUID
)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles SET credit_balance = credit_balance + credit_amount WHERE id = target_user_id;
    
    INSERT INTO public.credit_logs (user_id, amount, reason, admin_id, shipping_id) -- <--- Usa shipping_id
    VALUES (target_user_id, credit_amount, cancel_reason, auth.uid(), target_shipping_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION cancel_shipping_with_credit(UUID, NUMERIC, TEXT, UUID) TO authenticated;