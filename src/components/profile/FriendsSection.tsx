
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; 
import { UserPlus, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { ProfileAvatar } from "./ProfileAvatar";

interface Friend {
  id: string;
  friendship_id: string;
  status: string;
  username: string | null;
  wab_id: string;
  avatar_url: string | null;
  is_sender: boolean;
}

interface FriendsSectionProps {
  userId: string;
}

export const FriendsSection = ({ userId }: FriendsSectionProps) => {
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

  const incomingRequests = pendingRequests.filter(request => !request.is_sender);

  return (
    <div className="space-y-6">
      {incomingRequests.length > 0 && (
        <Card className="bg-black/50 border-warcrow-gold/20">
          <CardHeader>
            <CardTitle className="text-warcrow-gold">Friend Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {incomingRequests.map((request) => (
              <div key={request.friendship_id} className="flex items-center justify-between bg-black/30 p-3 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <ProfileAvatar 
                    avatarUrl={request.avatar_url} 
                    username={request.username || request.wab_id}
                    isEditing={false}
                    onAvatarUpdate={() => {}}
                    size="sm"
                  />
                  <div>
                    <div className="font-medium">{request.username || "Anonymous User"}</div>
                    <div className="text-sm text-warcrow-gold/60">{request.wab_id}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleAcceptRequest(request.friendship_id, request.id)}
                    size="sm"
                    className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
                  >
                    Accept
                  </Button>
                  <Button 
                    onClick={() => handleRejectRequest(request.friendship_id)}
                    size="sm"
                    variant="outline"
                    className="border-warcrow-gold/60 text-warcrow-gold/60 hover:bg-black hover:text-warcrow-gold"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-black/50 border-warcrow-gold/20">
        <CardHeader>
          <CardTitle className="text-warcrow-gold">My Friends</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-warcrow-text/60 text-center">Loading friends...</p>
          ) : friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend.friendship_id} className="flex items-center justify-between bg-black/30 p-3 rounded-lg mb-2">
                <div className="flex items-center gap-3">
                  <ProfileAvatar 
                    avatarUrl={friend.avatar_url} 
                    username={friend.username || friend.wab_id}
                    isEditing={false}
                    onAvatarUpdate={() => {}}
                    size="sm"
                  />
                  <div>
                    <div className="font-medium">{friend.username || "Anonymous User"}</div>
                    <div className="text-sm text-warcrow-gold/60">{friend.wab_id}</div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleRemoveFriend(friend.friendship_id)}
                  size="sm"
                  variant="outline"
                  className="border-warcrow-gold/60 text-warcrow-gold/60 hover:bg-black hover:text-red-500 hover:border-red-500"
                >
                  <UserMinus className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ))
          ) : (
            <p className="text-warcrow-text/60 text-center">No friends added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
