
-- Add name_es and name_fr columns to the special_rules table
ALTER TABLE special_rules ADD COLUMN IF NOT EXISTS name_es TEXT;
ALTER TABLE special_rules ADD COLUMN IF NOT EXISTS name_fr TEXT;

-- Create an index on the name column to improve lookup performance
CREATE INDEX IF NOT EXISTS idx_special_rules_name ON special_rules(name);
