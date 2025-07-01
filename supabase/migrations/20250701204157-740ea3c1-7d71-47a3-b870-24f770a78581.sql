-- Fix Syenann units: move "Syenann" from keywords to characteristics
-- This addresses the data structure issue where "Syenann" should be a characteristic, not a keyword

-- Update all Syenann faction units to:
-- 1. Remove "Syenann" from keywords array
-- 2. Add "Syenann" to characteristics object

UPDATE public.unit_data 
SET 
  keywords = ARRAY(
    SELECT unnest(keywords) 
    WHERE unnest(keywords) != 'Syenann'
  ),
  characteristics = characteristics || jsonb_build_object('faction_characteristic', 'Syenann')
WHERE 
  faction = 'syenann' 
  AND 'Syenann' = ANY(keywords);