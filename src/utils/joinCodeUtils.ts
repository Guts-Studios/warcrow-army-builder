
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Generate a 6-character alphanumeric code
export const generateJoinCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Save a game join code in Supabase
export const saveJoinCode = async (gameId: string, joinCode: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('game_join_codes')
      .insert({
        code: joinCode,
        game_id: gameId,
        expires_at: new Date(Date.now() + 1000 * 60 * 60).toISOString() // 1 hour expiration
      });

    if (error) {
      console.error("Error saving join code:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error in saveJoinCode:", err);
    return false;
  }
};

// Retrieve a game by join code
export const getGameByJoinCode = async (joinCode: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('game_join_codes')
      .select('game_id')
      .eq('code', joinCode)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) {
      console.error("Error retrieving game by join code:", error);
      return null;
    }
    
    return data.game_id;
  } catch (err) {
    console.error("Error in getGameByJoinCode:", err);
    return null;
  }
};

// Format a join code for display (XXX-XXX)
export const formatJoinCode = (code: string): string => {
  if (code.length !== 6) return code;
  return `${code.substring(0, 3)}-${code.substring(3)}`;
};
