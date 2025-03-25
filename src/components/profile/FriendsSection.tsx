import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Friend } from "@/types/profile";
import { toast } from "sonner";
import { RefreshCw, UserPlus, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/providers/UserProvider";
import { Skeleton } from "@/components/ui/skeleton";

interface FriendsSectionProps {
  userId: string;
  isCompact?: boolean;
}

export const FriendsSection = ({ userId, isCompact = false }: FriendsSectionProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendCount, setFriendCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    loadFriends();
  }, [userId]);

  const loadFriends = async () => {
    setIsLoading(true);
    try {
      const { data: friendsData, error: friendsError } = await supabase
        .from('user_relationships')
        .select('target_user_id(*)')
        .eq('source_user_id', userId)
        .eq('status', 'accepted');

      if (friendsError) {
        console.error("Error loading friends:", friendsError);
        toast.error("Failed to load friends.");
        return;
      }

      const friendDetails = friendsData.map(friend => ({
        id: friend.target_user_id.id,
        username: friend.target_user_id.username,
        avatar_url: friend.target_user_id.avatar_url,
        is_online: friend.target_user_id.is_online,
      }));

      setFriends(friendDetails);
      setFriendCount(friendDetails.length);
    } catch (error) {
      console.error("Error fetching friends:", error);
      toast.error("Failed to fetch friends.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshFriends = () => {
    loadFriends();
  };

  const handleAddFriend = async () => {
    if (!user) {
      toast.error("You must be logged in to add friends.");
      return;
    }

    try {
      const { error } = await supabase
        .from('user_relationships')
        .insert([
          { source_user_id: user.id, target_user_id: userId, status: 'pending' },
        ]);

      if (error) {
        console.error("Error adding friend:", error);
        toast.error("Failed to send friend request.");
      } else {
        toast.success("Friend request sent!");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request.");
    }
  };

  const handleRemoveFriend = async () => {
    if (!user) {
      toast.error("You must be logged in to remove friends.");
      return;
    }

    try {
      const { error } = await supabase
        .from('user_relationships')
        .delete()
        .match({ source_user_id: user.id, target_user_id: userId });

      if (error) {
        console.error("Error removing friend:", error);
        toast.error("Failed to remove friend.");
      } else {
        toast.success("Friend removed successfully.");
        loadFriends(); // Refresh the friend list
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Failed to remove friend.");
    }
  };

  return (
    <div className={`bg-black/50 backdrop-filter backdrop-blur-sm rounded-lg p-4 border border-warcrow-gold/10 relative ${isCompact ? 'max-h-80' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-warcrow-gold font-medium">Friends {friendCount > 0 && `(${friendCount})`}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"
            onClick={() => refreshFriends()}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
          {user && user.id !== userId && (
            <>
              {friends.some(friend => friend.id === user.id) ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                  onClick={handleRemoveFriend}
                >
                  <UserMinus className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-500/50 text-green-500 hover:bg-green-500/10"
                  onClick={handleAddFriend}
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Add Friend
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className={`space-y-2 ${isCompact ? 'profile-scroll-container' : ''}`}>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <li key={friend.id} className="flex items-center space-x-3">
                <img src={friend.avatar_url || "/images/user.png"} alt={friend.username} className="h-8 w-8 rounded-full" />
                <div>
                  <div className="font-medium text-warcrow-gold">{friend.username}</div>
                  <div className="text-sm text-warcrow-text/70">{friend.is_online ? 'Online' : 'Offline'}</div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-warcrow-text/70">No friends yet.</li>
          )}
        </ul>
      )}
    </div>
  );
};
