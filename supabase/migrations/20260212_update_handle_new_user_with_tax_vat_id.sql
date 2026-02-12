-- Add tax_vat_Id column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tax_vat_Id TEXT;

-- Add unique constraint to tax_vat_Id (allows NULL values to be non-unique)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_tax_vat_id_unique'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT profiles_tax_vat_id_unique UNIQUE (tax_vat_Id);
  END IF;
END $$;

-- Update handle_new_user function to include all profile fields including tax_vat_Id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email,
    address,
    address_notes,
    country,
    postal_code,
    city,
    state,
    tax_vat_Id
  )
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.raw_user_meta_data ->> 'address',
    new.raw_user_meta_data ->> 'address_notes',
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'postal_code',
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'state',
    new.raw_user_meta_data ->> 'tax_vat_Id'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;
