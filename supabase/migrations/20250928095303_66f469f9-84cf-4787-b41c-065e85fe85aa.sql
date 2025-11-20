-- Create shipping_quotes table
CREATE TABLE public.shipping_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_method TEXT NOT NULL,
  destination TEXT NOT NULL,
  total_weight INTEGER NOT NULL,
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shipping_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for users to create and view their own shipping quotes
CREATE POLICY "Users can create their own shipping quotes" 
ON public.shipping_quotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own shipping quotes" 
ON public.shipping_quotes 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policies for admins
CREATE POLICY "Admins can view all shipping quotes" 
ON public.shipping_quotes 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update shipping quotes" 
ON public.shipping_quotes 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updating updated_at
CREATE TRIGGER update_shipping_quotes_updated_at
BEFORE UPDATE ON public.shipping_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();