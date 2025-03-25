import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Friend {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface FriendRequest {
  id: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  sender_username: string;
  sender_avatar_url: string | null;
}

interface OutgoingRequest {
  id: string;
  recipient_id: string;
  created_at: string;
  recipient_username: string;
  recipient_avatar_url: string | null;
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
      const { data, error } = await supabase
        .from('friends')
        .select(`
          id,
          profiles (
            id,
            username,
            avatar_url
          )
        `)
        .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);
      
      if (error) {
        console.error("Error fetching friends:", error);
        return;
      }
      
      const formattedFriends: Friend[] = data.map(friendship => {
        const friendProfile = friendship.profiles;
        
        if (!friendProfile) {
          console.warn("Friend profile is null for friendship:", friendship);
          return null;
        }
        
        return {
          id: friendProfile.id,
          username: friendProfile.username,
          avatar_url: friendProfile.avatar_url
        };
      }).filter(friend => friend !== null && friend.id !== userId) as Friend[];
      
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
        .from('friend_requests')
        .select(`
          id,
          sender_id,
          recipient_id,
          created_at,
          sender_profile:profiles!friend_requests_sender_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('recipient_id', userId);
      
      if (error) {
        console.error("Error fetching friend requests:", error);
        return;
      }
      
      const formattedRequests: FriendRequest[] = data.map(request => ({
        id: request.id,
        sender_id: request.sender_id,
        recipient_id: request.recipient_id,
        created_at: request.created_at,
        sender_username: request.sender_profile?.username || 'Unknown',
        sender_avatar_url: request.sender_profile?.avatar_url || null,
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
        .from('friend_requests')
        .select(`
          id,
          recipient_id,
          created_at,
          recipient_profile:profiles!friend_requests_recipient_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('sender_id', userId);
      
      if (error) {
        console.error("Error fetching outgoing requests:", error);
        return;
      }
      
      const formattedRequests: OutgoingRequest[] = data.map(request => ({
        id: request.id,
        recipient_id: request.recipient_id,
        created_at: request.created_at,
        recipient_username: request.recipient_profile?.username || 'Unknown',
        recipient_avatar_url: request.recipient_profile?.avatar_url || null,
      }));
      
      setOutgoingRequests(formattedRequests);
    } catch (err) {
      console.error("Error fetching outgoing requests:", err);
      setOutgoingRequests([]);
    }
  };

  const sendFriendRequest = async (recipientId: string) => {
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .insert([{ sender_id: userId, recipient_id: recipientId }]);
      
      if (error) {
        console.error("Error sending friend request:", error);
        toast.error("Failed to send friend request");
        return false;
      }
      
      fetchOutgoingRequests();
      toast.success("Friend request sent!");
      return true;
    } catch (err) {
      console.error("Error sending friend request:", err);
      toast.error("Failed to send friend request");
      return false;
    }
  };

  const acceptFriendRequest = async (requestId: string, senderId: string) => {
    try {
      // First, create the friendship
      const { error: friendError } = await supabase
        .from('friends')
        .insert([
          { user_id_1: userId, user_id_2: senderId },
        ]);
      
      if (friendError) {
        console.error("Error creating friendship:", friendError);
        toast.error("Failed to accept friend request");
        return;
      }
      
      // Then, delete the friend request
      const { error: requestError } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId);
      
      if (requestError) {
        console.error("Error deleting friend request:", requestError);
        toast.error("Failed to accept friend request");
        return;
      }
      
      // Refresh lists
      fetchFriends();
      fetchFriendRequests();
      toast.success("Friend request accepted!");
    } catch (err) {
      console.error("Error accepting friend request:", err);
      toast.error("Failed to accept friend request");
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId);
      
      if (error) {
        console.error("Error rejecting friend request:", error);
        toast.error("Failed to reject friend request");
        return;
      }
      
      fetchFriendRequests();
      toast.success("Friend request rejected");
    } catch (err) {
      console.error("Error rejecting friend request:", err);
      toast.error("Failed to reject friend request");
    }
  };

  const unfriend = async (friendId: string) => {
    try {
      // Find the friendship to delete; it could be in either direction
      const { data: existingFriendship, error: findError } = await supabase
        .from('friends')
        .select('id')
        .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
        .or(`user_id_1.eq.${friendId},user_id_2.eq.${friendId}`)
        .limit(1)
        .single();
      
      if (findError) {
        console.error("Error finding friendship:", findError);
        toast.error("Failed to unfriend");
        return;
      }
      
      if (!existingFriendship) {
        console.log("No friendship found between users");
        toast.error("No friendship found");
        return;
      }
      
      // Delete the friendship
      const { error: deleteError } = await supabase
        .from('friends')
        .delete()
        .eq('id', existingFriendship.id);
      
      if (deleteError) {
        console.error("Error deleting friendship:", deleteError);
        toast.error("Failed to unfriend");
        return;
      }
      
      fetchFriends();
      toast.success("Unfriended successfully");
    } catch (err) {
      console.error("Error unfriending:", err);
      toast.error("Failed to unfriend");
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
    unfriend
  };
};
