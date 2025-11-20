-- Add admin delete policy for product_requests
CREATE POLICY "Admins can delete product requests"
ON public.product_requests
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));