-- Simple function to check if a tax ID already exists (bypasses RLS)
CREATE OR REPLACE FUNCTION check_tax_id_exists(input_tax_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_input TEXT;
BEGIN
  -- Return false if input is null or empty
  IF input_tax_id IS NULL OR TRIM(input_tax_id) = '' THEN
    RETURN FALSE;
  END IF;

  -- Clean the input (remove special chars, uppercase)
  clean_input := UPPER(REGEXP_REPLACE(input_tax_id, '[^a-zA-Z0-9]', '', 'g'));

  -- Check if this exact cleaned tax ID exists
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE UPPER(REGEXP_REPLACE("tax_vat_Id", '[^a-zA-Z0-9]', '', 'g')) = clean_input
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION check_tax_id_exists(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_tax_id_exists(TEXT) TO anon;

COMMENT ON FUNCTION check_tax_id_exists IS 'Checks if a tax ID already exists in the database (after sanitization). Returns TRUE if exists, FALSE otherwise.';
