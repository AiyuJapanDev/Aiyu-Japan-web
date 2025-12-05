-- Add 'cancelled' to shipping_quotes status constraint
ALTER TABLE shipping_quotes DROP CONSTRAINT IF EXISTS shipping_quotes_status_check;
ALTER TABLE shipping_quotes ADD CONSTRAINT shipping_quotes_status_check 
  CHECK (status = ANY (ARRAY['pending', 'quoted', 'paid', 'sent', 'rejected', 'cancelled']));

-- Add RLS policy for users to cancel their own pending/quoted shipping quotes
CREATE POLICY "Users can cancel their own pending shipping quotes"
ON shipping_quotes
FOR UPDATE
USING (auth.uid() = user_id AND status IN ('pending', 'quoted'))
WITH CHECK (auth.uid() = user_id AND status = 'cancelled');