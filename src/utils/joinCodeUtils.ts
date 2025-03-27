
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Generate a 6-character alphanumeric code
export const generateJoinCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789'; // Removed similar looking characters
  let result = '';
  
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Save a game join code in Supabase
export const saveJoinCode = async (gameId: string, joinCode: string): Promise<boolean> => {
  try {
    console.log("Saving join code:", {
      code: joinCode,
      game_id: gameId,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // 24 hour expiration
    });
    
    // Use a direct insert instead of the RPC function
    const { error } = await supabase
      .from('game_join_codes')
      .insert({
        code: joinCode,
        game_id: gameId,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString() // 24 hour expiration
      });

    if (error) {
      console.error("Error saving join code:", error);
      return false;
    }
    
    console.log("Successfully saved join code", joinCode, "for game", gameId);
    return true;
  } catch (err) {
    console.error("Error in saveJoinCode:", err);
    return false;
  }
};

// Retrieve a game by join code
export const getGameByJoinCode = async (joinCode: string): Promise<string | null> => {
  try {
    // Normalize the join code by removing any dashes
    const normalizedCode = joinCode.replace(/-/g, '');
    console.log("Looking up join code (normalized):", normalizedCode);
    
    // First get all join codes to debug
    const { data: allCodes, error: listError } = await supabase
      .from('game_join_codes')
      .select('code, expires_at, used, game_id')
      .limit(10);
      
    if (!listError && allCodes) {
      console.log("Recent join codes in database:", allCodes.map(c => ({
        code: c.code,
        expires: new Date(c.expires_at).toLocaleString(),
        isExpired: new Date(c.expires_at) < new Date(),
        used: c.used
      })));
    }
    
    // Check if the code exists at all
    const { data: codeExists, error: lookupError } = await supabase
      .from('game_join_codes')
      .select('code, expires_at, used')
      .eq('code', normalizedCode)
      .single();
    
    if (lookupError) {
      console.error("Error looking up join code:", lookupError);
      if (lookupError.code === 'PGRST116') {
        // Code doesn't exist
        console.log(`Join code "${normalizedCode}" not found in database`);
        toast.error("Invalid join code. Please check and try again.");
      } else {
        toast.error("Error checking join code. Please try again.");
      }
      return null;
    }
    
    if (!codeExists) {
      console.log(`Join code "${normalizedCode}" not found in database (no lookup error)`);
      toast.error("Invalid join code. Please check and try again.");
      return null;
    }
    
    // Check if the code is expired
    const now = new Date();
    const expiryDate = new Date(codeExists.expires_at);
    if (expiryDate < now) {
      console.error("Join code expired:", {
        code: normalizedCode,
        expiry: expiryDate.toLocaleString(),
        now: now.toLocaleString(),
        difference: `${Math.floor((now.getTime() - expiryDate.getTime()) / 1000 / 60)} minutes ago`
      });
      toast.error("This join code has expired. Please ask for a new code.");
      return null;
    }
    
    // Check if the code has been used
    if (codeExists.used) {
      console.error("Join code already used:", normalizedCode);
      toast.error("This join code has already been used. Please ask for a new code.");
      return null;
    }
    
    // If we got here, the code is valid, not expired, and not used
    // Now get the game ID and mark the code as used
    const { data, error } = await supabase
      .from('game_join_codes')
      .select('game_id')
      .eq('code', normalizedCode)
      .single();

    if (error || !data) {
      console.error("Error retrieving game by join code:", error);
      toast.error("Error retrieving game data. Please try again.");
      return null;
    }
    
    // Mark the code as used
    if (data.game_id) {
      const { error: updateError } = await supabase
        .from('game_join_codes')
        .update({ used: true })
        .eq('code', normalizedCode);
      
      if (updateError) {
        console.error("Error marking join code as used:", updateError);
        // Don't return null here, we still want the user to join the game even if marking the code as used fails
      }
      
      console.log("Successfully joined game with ID:", data.game_id);
      toast.success("Join code valid! Connecting to game...");
    }
    
    return data.game_id;
  } catch (err) {
    console.error("Error in getGameByJoinCode:", err);
    toast.error("An unexpected error occurred. Please try again.");
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
      toast.error("You must be logged in to invite friends.");
      return false;
    }
    
    // Generate and save the join code
    const joinCode = generateJoinCode();
    const success = await saveJoinCode(gameId, joinCode);
    
    if (!success) {
      console.error("Failed to generate invitation code");
      toast.error("Failed to generate invite code. Please try again.");
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
        toast.error("Permission denied. You might not have access to send invitations.");
      } else {
        toast.error("Failed to send invitation. Please try again.");
      }
      return false;
    }
    
    console.log("Game invitation sent successfully:", data);
    return true;
  } catch (err) {
    console.error("Error inviting friend to game:", err);
    toast.error("An error occurred while sending the invitation.");
    return false;
  }
};
