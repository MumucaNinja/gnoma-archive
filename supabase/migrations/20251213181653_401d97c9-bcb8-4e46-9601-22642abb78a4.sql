-- Add combo fields to products table
ALTER TABLE products 
ADD COLUMN is_combo BOOLEAN DEFAULT false,
ADD COLUMN combo_seed_type TEXT, -- 'automaticas' or 'fotoperiodo'
ADD COLUMN combo_quantity INTEGER DEFAULT 3;

-- Add display_order for sorting (combos first)
ALTER TABLE products 
ADD COLUMN display_order INTEGER DEFAULT 100;