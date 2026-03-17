-- Add completed_at column to purchase_orders table
ALTER TABLE purchase_orders 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

-- Add total_amount column to purchase_orders table if it doesn't exist
ALTER TABLE purchase_orders 
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2) DEFAULT 0;
