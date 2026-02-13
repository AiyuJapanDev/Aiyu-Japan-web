-- ROLLBACK: Remove 'cancelled' status from product_request_status enum
-- WARNING: This will fail if there are any product_requests with status = 'cancelled'
-- You must first update those records to another status (like 'rejected') before running this

-- You cannot directly remove a value from an enum in PostgreSQL
-- You need to:
-- 1. Create a new enum without 'cancelled'
-- 2. Update the column to use the new enum
-- 3. Drop the old enum
-- 4. Rename the new enum

-- First, check if any records use 'cancelled' status
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM product_requests WHERE status = 'cancelled') THEN
    RAISE EXCEPTION 'Cannot remove cancelled status: records exist with this status. Update them first.';
  END IF;
END $$;

-- Create new enum without 'cancelled'
CREATE TYPE product_request_status_without_cancelled AS ENUM (
  'requested',
  'quoted', 
  'paid',
  'purchased',
  'received',
  'shipping_quoted',
  'shipping_paid',
  'shipped',
  'rejected'
);

-- Update the column
ALTER TABLE product_requests 
ALTER COLUMN status TYPE product_request_status_without_cancelled 
USING status::text::product_request_status_without_cancelled;

-- Drop old enum
DROP TYPE product_request_status;

-- Rename new enum to original name
ALTER TYPE product_request_status_without_cancelled RENAME TO product_request_status;
