-- Fix RLS policy on unit_data table to allow public read access
-- Currently only admins can read unit data, but all users should be able to read it

-- Drop the existing restrictive policy
DROP POLICY "Allow admin access to unit data" ON public.unit_data;

-- Create separate policies for read and write access
-- Allow everyone to read unit data (this is public game data)
CREATE POLICY "Allow public read access to unit data" 
ON public.unit_data 
FOR SELECT 
USING (true);

-- Only allow admins to insert/update/delete unit data
CREATE POLICY "Allow admin write access to unit data" 
ON public.unit_data 
FOR ALL 
USING (auth.uid() IN ( SELECT profiles.id FROM profiles WHERE (profiles.wab_admin = true)))
WITH CHECK (auth.uid() IN ( SELECT profiles.id FROM profiles WHERE (profiles.wab_admin = true)));