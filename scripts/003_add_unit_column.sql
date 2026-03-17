-- Add unit column to supplies table
ALTER TABLE supplies ADD COLUMN IF NOT EXISTS unit VARCHAR(50) DEFAULT 'unidad';
