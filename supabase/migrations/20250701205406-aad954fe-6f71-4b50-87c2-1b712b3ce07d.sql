-- Add tournament_legal column to unit_data table for better data structure
ALTER TABLE public.unit_data 
ADD COLUMN IF NOT EXISTS tournament_legal BOOLEAN DEFAULT true;

-- Update existing units to have tournament_legal = true as default
UPDATE public.unit_data 
SET tournament_legal = true 
WHERE tournament_legal IS NULL;