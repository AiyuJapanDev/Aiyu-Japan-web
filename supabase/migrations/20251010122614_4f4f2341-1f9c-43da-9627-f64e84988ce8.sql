-- Add user_personal_id column to profiles table
ALTER TABLE public.profiles
ADD COLUMN user_personal_id TEXT NOT NULL DEFAULT '';

-- Create trigger function to auto-generate user IDs
CREATE OR REPLACE FUNCTION public.generate_user_personal_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  next_id INTEGER;
BEGIN
  -- Only generate if not already set
  IF NEW.user_personal_id IS NULL OR NEW.user_personal_id = '' THEN
    -- Get the max personal ID globally (not per user)
    SELECT COALESCE(MAX(CAST(SUBSTRING(user_personal_id FROM 3) AS INTEGER)), 0) + 1
    INTO next_id
    FROM profiles
    WHERE user_personal_id ~ '^AJ\d+$'; -- Only IDs matching AJ pattern
    
    -- Format with AJ prefix and 5 digits (AJ00001)
    NEW.user_personal_id := 'AJ' || LPAD(next_id::TEXT, 5, '0');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
CREATE TRIGGER generate_user_personal_id_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_user_personal_id();

-- Backfill existing users with sequential IDs
DO $$
DECLARE
  user_record RECORD;
  counter INTEGER := 1;
BEGIN
  FOR user_record IN 
    SELECT id FROM profiles 
    WHERE user_personal_id IS NULL OR user_personal_id = ''
    ORDER BY created_at ASC
  LOOP
    UPDATE profiles
    SET user_personal_id = 'AJ' || LPAD(counter::TEXT, 5, '0')
    WHERE id = user_record.id;
    
    counter := counter + 1;
  END LOOP;
END $$;