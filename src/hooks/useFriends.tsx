import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Friend {
  id: string;
  username: string | null;
  avatar_url: string | null;
  wab_id: string | null;
  friendship_id: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  sender_username: string | null;
  sender_avatar_url: string | null;
  friendship_id: string;
}

export interface OutgoingRequest {
  id: string;
  recipient_id: string;
  created_at: string;
  recipient_username: string | null;
  recipient_avatar_url: string | null;
  friendship_id: string;
}

export const useFriends = (userId: string) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<OutgoingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isPreviewId = userId === "preview-user-id";

  const fetchFriends = async () => {
    if (isPreviewId) {
      setFriends([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      // Query friendships table where the user is either sender or recipient
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          status,
          sender_id,
          recipient_id,
          sender:profiles!friendships_sender_id_fkey(id, username, avatar_url, wab_id),
          recipient:profiles!friendships_recipient_id_fkey(id, username, avatar_url, wab_id)
        `)
        .eq('status', 'accepted')
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
      
      if (error) {
        console.error("Error fetching friends:", error);
        setFriends([]);
        setIsLoading(false);
        return;
      }
      
      // Format the data to get the friend's info (not the current user's)
      const formattedFriends: Friend[] = data.map(friendship => {
        // Determine if the friend is the sender or recipient
        const isSender = friendship.sender_id === userId;
        const friendProfile = isSender ? friendship.recipient : friendship.sender;
        
        return {
          id: friendProfile.id,
          username: friendProfile.username,
          avatar_url: friendProfile.avatar_url,
          wab_id: friendProfile.wab_id,
          friendship_id: friendship.id
        };
      });
      
      setFriends(formattedFriends);
    } catch (err) {
      console.error("Error fetching friends:", err);
      setFriends([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFriendRequests = async () => {
    if (isPreviewId) {
      setFriendRequests([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          sender_id,
          recipient_id,
          created_at,
          sender:profiles!friendships_sender_id_fkey(username, avatar_url, wab_id)
        `)
        .eq('recipient_id', userId)
        .eq('status', 'pending');
      
      if (error) {
        console.error("Error fetching friend requests:", error);
        setFriendRequests([]);
        return;
      }
      
      const formattedRequests: FriendRequest[] = data.map(request => ({
        id: request.sender_id,
        sender_id: request.sender_id,
        recipient_id: request.recipient_id,
        created_at: request.created_at,
        sender_username: request.sender.username,
        sender_avatar_url: request.sender.avatar_url,
        friendship_id: request.id
      }));
      
      setFriendRequests(formattedRequests);
    } catch (err) {
      console.error("Error fetching friend requests:", err);
      setFriendRequests([]);
    }
  };

  const fetchOutgoingRequests = async () => {
    if (isPreviewId) {
      setOutgoingRequests([]);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          recipient_id,
          created_at,
          recipient:profiles!friendships_recipient_id_fkey(username, avatar_url, wab_id)
        `)
        .eq('sender_id', userId)
        .eq('status', 'pending');
      
      if (error) {
        console.error("Error fetching outgoing requests:", error);
        setOutgoingRequests([]);
        return;
      }
      
      const formattedRequests: OutgoingRequest[] = data.map(request => ({
        id: request.recipient_id,
        recipient_id: request.recipient_id,
        created_at: request.created_at,
        recipient_username: request.recipient.username,
        recipient_avatar_url: request.recipient.avatar_url,
        friendship_id: request.id
      }));
      
      setOutgoingRequests(formattedRequests);
    } catch (err) {
      console.error("Error fetching outgoing requests:", err);
      setOutgoingRequests([]);
    }
  };

  const sendFriendRequest = async (recipientId: string) => {
    try {
      // First check if friendship already exists in either direction
      const { data: existingFriendship, error: checkError } = await supabase
        .from('friendships')
        .select()
        .or(`and(sender_id.eq.${userId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${userId})`)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking existing friendship:", checkError);
        throw new Error("Failed to send friend request");
      }
      
      if (existingFriendship) {
        console.log("Friendship already exists:", existingFriendship);
        throw new Error("A friend request already exists for this user");
      }
      
      // Insert new friendship record
      const { data, error } = await supabase
        .from('friendships')
        .insert({
          sender_id: userId,
          recipient_id: recipientId,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error sending friend request:", error);
        throw new Error("Failed to send friend request");
      }
      
      // Create notification for recipient
      await supabase
        .from('notifications')
        .insert({
          recipient_id: recipientId,
          sender_id: userId,
          type: 'friend_request',
          content: { message: "sent you a friend request" }
        });
      
      // Refresh the outgoing requests list
      fetchOutgoingRequests();
      return true;
    } catch (err) {
      console.error("Error sending friend request:", err);
      throw err;
    }
  };

  const acceptFriendRequest = async (friendshipId: string, senderId: string) => {
    try {
      // Update the friendship status to accepted
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', friendshipId)
        .eq('recipient_id', userId)
        .eq('sender_id', senderId);
      
      if (error) {
        console.error("Error accepting friend request:", error);
        throw new Error("Failed to accept friend request");
      }
      
      // Create notification for sender
      await supabase
        .from('notifications')
        .insert({
          recipient_id: senderId,
          sender_id: userId,
          type: 'friend_accepted',
          content: { message: "accepted your friend request" }
        });
      
      // Refresh lists
      fetchFriends();
      fetchFriendRequests();
    } catch (err) {
      console.error("Error accepting friend request:", err);
      throw err;
    }
  };

  const rejectFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId)
        .eq('recipient_id', userId);
      
      if (error) {
        console.error("Error rejecting friend request:", error);
        throw new Error("Failed to reject friend request");
      }
      
      fetchFriendRequests();
    } catch (err) {
      console.error("Error rejecting friend request:", err);
      throw err;
    }
  };

  const cancelFriendRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);
      
      if (error) {
        console.error("Error canceling friend request:", error);
        throw new Error("Failed to cancel friend request");
      }
      
      fetchOutgoingRequests();
    } catch (err) {
      console.error("Error canceling friend request:", err);
      throw err;
    }
  };

  const unfriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);
      
      if (error) {
        console.error("Error unfriending:", error);
        throw new Error("Failed to unfriend");
      }
      
      fetchFriends();
    } catch (err) {
      console.error("Error unfriending:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriends();
      fetchFriendRequests();
      fetchOutgoingRequests();
    }
  }, [userId]);

  return {
    friends,
    friendRequests,
    outgoingRequests,
    isLoading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    unfriend
  };
};
