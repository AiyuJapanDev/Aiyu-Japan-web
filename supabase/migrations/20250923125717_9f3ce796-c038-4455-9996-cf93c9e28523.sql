-- First drop the dependent RLS policy
DROP POLICY IF EXISTS "Users can view quotes for their requests" ON quotes;

-- Add order-level rejection and quote handling
ALTER TABLE orders 
ADD COLUMN rejection_reason TEXT,
ADD COLUMN is_rejected BOOLEAN DEFAULT false,
ADD COLUMN is_resubmitted BOOLEAN DEFAULT false,
ADD COLUMN parent_order_id UUID REFERENCES orders(id);

-- Add product flagging for issues
ALTER TABLE product_requests
ADD COLUMN has_issue BOOLEAN DEFAULT false,
ADD COLUMN issue_description TEXT;

-- Update quotes table to link to orders instead of individual products
ALTER TABLE quotes 
DROP COLUMN product_request_id;

-- Add constraint to ensure quotes are linked to orders (if not already set)
ALTER TABLE quotes
ALTER COLUMN order_id SET NOT NULL;

-- Create new RLS policy for quotes linked to orders
CREATE POLICY "Users can view quotes for their orders" 
ON public.quotes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders o
    WHERE o.id = quotes.order_id 
    AND o.user_id = auth.uid()
  )
);

-- Create index for better performance
CREATE INDEX idx_orders_parent_order ON orders(parent_order_id);
CREATE INDEX idx_product_requests_has_issue ON product_requests(has_issue);

-- Update RLS policies for order editing
CREATE POLICY "Users can update their rejected orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = user_id AND is_rejected = true);

-- Allow users to delete product requests from rejected orders
CREATE POLICY "Users can delete items from rejected orders" 
ON public.product_requests 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM orders o 
    INNER JOIN order_items oi ON o.id = oi.order_id
    WHERE oi.product_request_id = product_requests.id 
    AND o.user_id = auth.uid() 
    AND o.is_rejected = true
  )
);

-- Allow users to update product requests in rejected orders
CREATE POLICY "Users can update items in rejected orders" 
ON public.product_requests 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM orders o 
    INNER JOIN order_items oi ON o.id = oi.order_id
    WHERE oi.product_request_id = product_requests.id 
    AND o.user_id = auth.uid() 
    AND o.is_rejected = true
  )
);