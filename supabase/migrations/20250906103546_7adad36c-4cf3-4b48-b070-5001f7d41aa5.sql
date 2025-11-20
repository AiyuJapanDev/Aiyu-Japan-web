-- Create ENUM types for status fields
CREATE TYPE public.product_request_status AS ENUM ('requested', 'quoted', 'paid', 'purchased', 'received', 'shipped');
CREATE TYPE public.quote_type AS ENUM ('product', 'shipping');
CREATE TYPE public.quote_status AS ENUM ('pending', 'sent', 'paid');
CREATE TYPE public.order_status AS ENUM ('preparing', 'weighing', 'awaiting_shipping_payment', 'shipped');

-- Create product_requests table
CREATE TABLE public.product_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_url TEXT NOT NULL,
  item_name TEXT,
  status product_request_status NOT NULL DEFAULT 'requested',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type quote_type NOT NULL,
  product_request_id UUID REFERENCES public.product_requests(id) ON DELETE CASCADE,
  order_id UUID, -- Will reference orders table after it's created
  price_jpy NUMERIC(10, 2) NOT NULL,
  status quote_status NOT NULL DEFAULT 'pending',
  quote_url TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT quote_reference_check CHECK (
    (type = 'product' AND product_request_id IS NOT NULL AND order_id IS NULL) OR
    (type = 'shipping' AND product_request_id IS NULL AND order_id IS NOT NULL)
  )
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  paypal_invoice_id TEXT,
  amount_paid NUMERIC(10, 2) NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'preparing',
  tracking_number TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key for order_id in quotes table
ALTER TABLE public.quotes
ADD CONSTRAINT quotes_order_id_fkey 
FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_request_id UUID NOT NULL REFERENCES public.product_requests(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_id, product_request_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_product_requests_user_id ON public.product_requests(user_id);
CREATE INDEX idx_product_requests_status ON public.product_requests(status);
CREATE INDEX idx_quotes_product_request_id ON public.quotes(product_request_id);
CREATE INDEX idx_quotes_order_id ON public.quotes(order_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_quote_id ON public.payments(quote_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_request_id ON public.order_items(product_request_id);

-- Enable Row Level Security
ALTER TABLE public.product_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for product_requests
CREATE POLICY "Users can view their own product requests" 
ON public.product_requests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own product requests" 
ON public.product_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all product requests" 
ON public.product_requests FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all product requests" 
ON public.product_requests FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for quotes
CREATE POLICY "Users can view quotes for their requests" 
ON public.quotes FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.product_requests pr 
    WHERE pr.id = quotes.product_request_id 
    AND pr.user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.orders o 
    WHERE o.id = quotes.order_id 
    AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all quotes" 
ON public.quotes FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create quotes" 
ON public.quotes FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quotes" 
ON public.quotes FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" 
ON public.payments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
ON public.payments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" 
ON public.payments FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update payments" 
ON public.payments FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON public.orders FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create orders" 
ON public.orders FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update orders" 
ON public.orders FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for order_items
CREATE POLICY "Users can view their order items" 
ON public.order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders o 
    WHERE o.id = order_items.order_id 
    AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all order items" 
ON public.order_items FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create order items" 
ON public.order_items FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete order items" 
ON public.order_items FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_product_requests_updated_at
BEFORE UPDATE ON public.product_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON public.quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();