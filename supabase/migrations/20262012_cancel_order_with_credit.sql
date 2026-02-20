CREATE OR REPLACE FUNCTION cancel_order_with_credit(
  target_user_id UUID,
  credit_amount NUMERIC,
  cancel_reason TEXT,
  target_order_id UUID -- Este es el nombre del parámetro que usas en el código
)
RETURNS void AS $$
BEGIN
    -- 1. Actualizar el saldo en profiles
    UPDATE public.profiles
    SET credit_balance = credit_balance + credit_amount
    WHERE id = target_user_id;

    -- 2. Insertar en credit_logs usando el nombre exacto: orders_id
    INSERT INTO public.credit_logs (user_id, amount, reason, admin_id, orders_id) 
    VALUES (target_user_id, credit_amount, cancel_reason, auth.uid(), target_order_id);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar permisos
GRANT EXECUTE ON FUNCTION cancel_order_with_credit(UUID, NUMERIC, TEXT, UUID) TO authenticated;