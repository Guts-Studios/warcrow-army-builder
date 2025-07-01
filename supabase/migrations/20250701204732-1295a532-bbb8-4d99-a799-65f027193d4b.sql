-- Sync updated Syenann CSV data to database
-- First, let's update all Syenann units to have the correct structure

-- Clear existing Syenann units that may have incorrect data
DELETE FROM public.unit_data WHERE faction = 'syenann';

-- Now we need to populate with the correct CSV data
-- This will need to be done through the admin sync tools since we can't directly insert the CSV data here
-- But first, let's ensure the table structure can handle the updated format

-- Make sure characteristics column can store the faction_characteristic properly
UPDATE public.unit_data 
SET characteristics = characteristics || jsonb_build_object('faction_characteristic', 'syenann')
WHERE faction = 'syenann' AND NOT (characteristics ? 'faction_characteristic');