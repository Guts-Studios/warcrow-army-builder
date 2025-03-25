
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Friend {
  id: string;
  friendship_id: string;
  status: string;
  username: string | null;
  wab_id: string;
  avatar_url: string | null;
  is_sender: boolean;
}

export const useFriends = (userId: string) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Fetch accepted friends
        const { data: acceptedFriends, error: acceptedError } = await supabase
          .from("friendships")
          .select(`
            id,
            status,
            sender_id,
            recipient_id,
            sender:profiles!friendships_sender_id_fkey(id, username, wab_id, avatar_url),
            recipient:profiles!friendships_recipient_id_fkey(id, username, wab_id, avatar_url)
          `)
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
          .eq("status", "accepted");

        // Fetch pending requests
        const { data: pendingFriends, error: pendingError } = await supabase
          .from("friendships")
          .select(`
            id,
            status,
            sender_id,
            recipient_id,
            sender:profiles!friendships_sender_id_fkey(id, username, wab_id, avatar_url),
            recipient:profiles!friendships_recipient_id_fkey(id, username, wab_id, avatar_url)
          `)
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
          .eq("status", "pending");
        
        if (acceptedError || pendingError) throw acceptedError || pendingError;
        
        // Format the friends data
        const formattedAccepted = (acceptedFriends || []).map(friendship => {
          const isSender = friendship.sender_id === userId;
          const otherUser = isSender ? friendship.recipient : friendship.sender;
          
          return {
            id: otherUser.id,
            friendship_id: friendship.id,
            status: friendship.status,
            username: otherUser.username,
            wab_id: otherUser.wab_id,
            avatar_url: otherUser.avatar_url,
            is_sender: isSender
          };
        });
        
        const formattedPending = (pendingFriends || []).map(friendship => {
          const isSender = friendship.sender_id === userId;
          const otherUser = isSender ? friendship.recipient : friendship.sender;
          
          return {
            id: otherUser.id,
            friendship_id: friendship.id,
            status: friendship.status,
            username: otherUser.username,
            wab_id: otherUser.wab_id,
            avatar_url: otherUser.avatar_url,
            is_sender: isSender
          };
        });
        
        setFriends(formattedAccepted);
        setPendingRequests(formattedPending);
      } catch (error) {
        console.error("Error fetching friends:", error);
        toast.error("Failed to load friends list");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  const handleAcceptRequest = async (friendshipId: string, senderId: string) => {
    try {
      const { error } = await supabase
        .from("friendships")
        .update({ status: "accepted" })
        .eq("id", friendshipId);
      
      if (error) throw error;
      
      // Create notification for sender
      await supabase
        .from("notifications")
        .insert({
          recipient_id: senderId,
          sender_id: userId,
          type: "friend_accepted",
          content: { message: "accepted your friend request" }
        });
      
      // Update the local state
      setPendingRequests(prev => prev.filter(request => request.friendship_id !== friendshipId));
      
      // Refresh the friends list
      const { data: updatedFriendship } = await supabase
        .from("friendships")
        .select(`
          id,
          status,
          sender_id,
          recipient_id,
          sender:profiles!friendships_sender_id_fkey(id, username, wab_id, avatar_url),
          recipient:profiles!friendships_recipient_id_fkey(id, username, wab_id, avatar_url)
        `)
        .eq("id", friendshipId)
        .single();
      
      if (updatedFriendship) {
        const isSender = updatedFriendship.sender_id === userId;
        const otherUser = isSender ? updatedFriendship.recipient : updatedFriendship.sender;
        
        setFriends(prev => [...prev, {
          id: otherUser.id,
          friendship_id: updatedFriendship.id,
          status: updatedFriendship.status,
          username: otherUser.username,
          wab_id: otherUser.wab_id,
          avatar_url: otherUser.avatar_url,
          is_sender: isSender
        }]);
      }
      
      toast.success("Friend request accepted");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("Failed to accept friend request");
    }
  };

  const handleRejectRequest = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from("friendships")
        .update({ status: "rejected" })
        .eq("id", friendshipId);
      
      if (error) throw error;
      
      // Update the local state
      setPendingRequests(prev => prev.filter(request => request.friendship_id !== friendshipId));
      
      toast.success("Friend request rejected");
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast.error("Failed to reject friend request");
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from("friendships")
        .delete()
        .eq("id", friendshipId);
      
      if (error) throw error;
      
      // Update the local state
      setFriends(prev => prev.filter(friend => friend.friendship_id !== friendshipId));
      
      toast.success("Friend removed");
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Failed to remove friend");
    }
  };

  return {
    friends,
    pendingRequests,
    isLoading,
    incomingRequests: pendingRequests.filter(request => !request.is_sender),
    handleAcceptRequest,
    handleRejectRequest,
    handleRemoveFriend
  };
};
