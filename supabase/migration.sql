
-- Add new social media columns to the profiles table
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS social_instagram text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS social_youtube text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS social_twitch text DEFAULT NULL;
