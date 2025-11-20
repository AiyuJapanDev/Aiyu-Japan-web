-- Add missing admin INSERT policy for product_requests
CREATE POLICY "Admins can insert any product requests"
ON public.product_requests
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);