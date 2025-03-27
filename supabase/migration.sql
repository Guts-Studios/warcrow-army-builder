
-- Add new social media columns to the profiles table
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS social_instagram text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS social_youtube text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS social_twitch text DEFAULT NULL;

-- Create a function to create a join code
CREATE OR REPLACE FUNCTION public.create_join_code(
  p_code TEXT,
  p_game_id TEXT,
  p_expires_at TIMESTAMPTZ
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.game_join_codes (code, game_id, expires_at)
  VALUES (p_code, p_game_id, p_expires_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get a game by join code
CREATE OR REPLACE FUNCTION public.get_game_by_join_code(
  p_code TEXT
) RETURNS TEXT AS $$
DECLARE
  v_game_id TEXT;
BEGIN
  SELECT game_id INTO v_game_id
  FROM public.game_join_codes
  WHERE code = p_code
  AND expires_at > NOW()
  AND used = false;
  
  -- If found, mark as used
  IF v_game_id IS NOT NULL THEN
    UPDATE public.game_join_codes
    SET used = true
    WHERE code = p_code;
  END IF;
  
  RETURN v_game_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
