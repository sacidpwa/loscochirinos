-- Add supplier column to supplies table
ALTER TABLE supplies ADD COLUMN IF NOT EXISTS supplier TEXT;
