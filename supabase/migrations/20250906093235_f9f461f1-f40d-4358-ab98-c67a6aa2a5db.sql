-- Add new fields to profiles table for complete user information
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS address_notes TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT;

-- Update existing rows with default values to prevent null constraint violations
UPDATE public.profiles
SET 
  phone_number = COALESCE(phone_number, ''),
  address = COALESCE(address, ''),
  country = COALESCE(country, ''),
  postal_code = COALESCE(postal_code, ''),
  city = COALESCE(city, ''),
  state = COALESCE(state, '');

-- Now make required fields NOT NULL (if desired)
ALTER TABLE public.profiles
ALTER COLUMN phone_number SET NOT NULL,
ALTER COLUMN address SET NOT NULL,
ALTER COLUMN country SET NOT NULL,
ALTER COLUMN postal_code SET NOT NULL;

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles table with all required fields
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email,
    phone_number,
    address,
    address_notes,
    country,
    postal_code,
    city,
    state
  )
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'phone_number', ''),
    COALESCE(new.raw_user_meta_data ->> 'address', ''),
    new.raw_user_meta_data ->> 'address_notes',
    COALESCE(new.raw_user_meta_data ->> 'country', ''),
    COALESCE(new.raw_user_meta_data ->> 'postal_code', ''),
    COALESCE(new.raw_user_meta_data ->> 'city', ''),
    COALESCE(new.raw_user_meta_data ->> 'state', '')
  );

  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;
