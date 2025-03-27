
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
    // Use a direct insert instead of the RPC function
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
    // Use a direct query instead of the RPC function
    const { data, error } = await supabase
      .from('game_join_codes')
      .select('game_id')
      .eq('code', joinCode)
      .gt('expires_at', new Date().toISOString())
      .eq('used', false)
      .single();

    if (error || !data) {
      console.error("Error retrieving game by join code:", error);
      return null;
    }
    
    // Mark the code as used
    if (data.game_id) {
      await supabase
        .from('game_join_codes')
        .update({ used: true })
        .eq('code', joinCode);
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

// Send invitation to friend
export const inviteFriendToGame = async (friendId: string, gameId: string, senderName: string): Promise<boolean> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No authenticated user found");
      return false;
    }
    
    // Generate and save the join code
    const joinCode = generateJoinCode();
    const success = await saveJoinCode(gameId, joinCode);
    
    if (!success) {
      console.error("Failed to generate invitation code");
      return false;
    }
    
    console.log("Sending game invitation to friend:", {
      friendId,
      gameId,
      joinCode,
      senderName,
      senderId: user.id
    });
    
    // Send notification to the friend
    const { data, error } = await supabase.from('notifications')
      .insert({
        recipient_id: friendId,
        sender_id: user.id,
        type: 'game_invitation',
        content: {
          message: "invited you to join a game",
          sender_name: senderName,
          game_id: gameId,
          join_code: joinCode
        }
      })
      .select();
    
    if (error) {
      console.error("Error sending game invitation:", error);
      if (error.code === '42501') {
        console.error("Permission denied. This might be an RLS policy issue.");
      }
      return false;
    }
    
    console.log("Game invitation sent successfully:", data);
    return true;
  } catch (err) {
    console.error("Error inviting friend to game:", err);
    return false;
  }
};
