
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
    // Since the RPC function isn't in the TypeScript types, we'll use a raw query
    const { error } = await supabase.rpc('create_join_code', {
      p_code: joinCode,
      p_game_id: gameId,
      p_expires_at: new Date(Date.now() + 1000 * 60 * 60).toISOString() // 1 hour expiration
    }) as { error: any };

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
    // Since the RPC function isn't in the TypeScript types, we'll use a raw query with type casting
    const { data, error } = await supabase.rpc('get_game_by_join_code', {
      p_code: joinCode
    }) as { data: string | null, error: any };

    if (error || !data) {
      console.error("Error retrieving game by join code:", error);
      return null;
    }
    
    return data;
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
