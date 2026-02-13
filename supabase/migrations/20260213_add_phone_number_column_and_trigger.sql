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
    phone_number,
    address,
    address_notes,
    country,
    postal_code,
    city,
    state,
    "tax_vat_Id"
  )
  VALUES (
    new.id, 
    -- Buscamos tanto full_name como fullName por si acaso
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'fullName'),
    new.email,
    -- COALESCE previene el error 23502 (NOT NULL violation)
    COALESCE(new.raw_user_meta_data ->> 'phone_number', ''),
    COALESCE(new.raw_user_meta_data ->> 'address', ''),
    new.raw_user_meta_data ->> 'address_notes',
    COALESCE(new.raw_user_meta_data ->> 'country', ''),
    COALESCE(new.raw_user_meta_data ->> 'postal_code', ''),
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'state',
    new.raw_user_meta_data ->> 'tax_vat_Id'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;