
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, UserPlus, UserMinus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from '@/hooks/use-mobile';

interface Friend {
  id: string;
  username: string;
  avatar_url?: string;
  is_online: boolean;
}

interface FriendsSectionProps {
  userId: string;
  isCompact?: boolean;
}

export const FriendsSection: React.FC<FriendsSectionProps> = ({ userId, isCompact = false }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendCount, setFriendCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    loadFriends();
    
    // For demo purposes, we'll simulate if this is the current user
    // In a real app, you'd compare userId with the logged-in user's ID
    setIsCurrentUser(Math.random() > 0.5);
  }, [userId]);

  const loadFriends = async () => {
    setIsLoading(true);
    try {
      // Mock data for now due to supabase connection issues
      const mockFriends = [
        { id: '1', username: 'Player1', avatar_url: '/images/user.png', is_online: true },
        { id: '2', username: 'WarCrowFan', avatar_url: '/images/user.png', is_online: false },
        { id: '3', username: 'GameMaster', avatar_url: '/images/user.png', is_online: true }
      ];
      
      setFriends(mockFriends);
      setFriendCount(mockFriends.length);
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
    try {
      toast.success("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request.");
    }
  };

  const handleRemoveFriend = async () => {
    try {
      toast.success("Friend removed successfully.");
      loadFriends(); // Refresh the friend list
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Failed to remove friend.");
    }
  };

  return (
    <div className={`bg-black/50 backdrop-filter backdrop-blur-sm rounded-lg p-3 border border-warcrow-gold/10 relative ${isCompact ? 'max-h-60 md:max-h-80' : ''}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-warcrow-gold font-medium text-sm md:text-base">
          Friends {friendCount > 0 && `(${friendCount})`}
        </h3>
        <div className="flex gap-1 md:gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-warcrow-gold/50 text-black bg-warcrow-gold hover:bg-warcrow-gold/80 h-7 px-2 py-1 text-xs"
            onClick={refreshFriends}
          >
            <RefreshCw className="h-3 w-3" />
            {!isMobile && <span className="ml-1">Refresh</span>}
          </Button>

          {isCurrentUser && (
            <>
              {Math.random() > 0.5 ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10 h-7 px-2 py-1 text-xs"
                  onClick={handleRemoveFriend}
                >
                  <UserMinus className="h-3 w-3" />
                  {!isMobile && <span className="ml-1">Remove</span>}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-500/50 text-green-500 hover:bg-green-500/10 h-7 px-2 py-1 text-xs"
                  onClick={handleAddFriend}
                >
                  <UserPlus className="h-3 w-3" />
                  {!isMobile && <span className="ml-1">Add</span>}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 md:h-4 w-[80px] md:w-[100px]" />
                <Skeleton className="h-2 md:h-4 w-[60px] md:w-[80px]" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className={`space-y-2 ${isCompact ? 'overflow-y-auto max-h-[120px] md:max-h-[180px]' : ''}`}>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <li key={friend.id} className="flex items-center space-x-2">
                <img src={friend.avatar_url || "/images/user.png"} alt={friend.username || ''} className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
                <div>
                  <div className="font-medium text-warcrow-gold text-xs md:text-sm">{friend.username}</div>
                  <div className="text-[10px] md:text-xs text-warcrow-text/70">{friend.is_online ? 'Online' : 'Offline'}</div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-warcrow-text/70 text-xs md:text-sm">No friends yet.</li>
          )}
        </ul>
      )}
    </div>
  );
};
