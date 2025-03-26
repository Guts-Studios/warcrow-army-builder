
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw, UserPlus, UserMinus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from '@/hooks/use-mobile';
import { useFriends } from '@/hooks/useFriends';
import { useProfileContext } from './ProfileData';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProfileSession } from '@/hooks/useProfileSession';
import { FriendProfileDialog } from './FriendProfileDialog';

interface Friend {
  id: string;
  username: string | null;
  avatar_url: string | null;
  friendship_id: string;
}

interface FriendsSectionProps {
  userId: string;
  isCompact?: boolean;
}

export const FriendsSection: React.FC<FriendsSectionProps> = ({ userId, isCompact = false }) => {
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [showFriendProfile, setShowFriendProfile] = useState(false);
  const isMobile = useIsMobile();
  const { profile } = useProfileContext();
  const { userId: currentUserId } = useProfileSession();
  
  // Use the useFriends hook to get actual friends data
  const { 
    friends, 
    isLoading, 
    sendFriendRequest, 
    unfriend,
    acceptFriendRequest,
    rejectFriendRequest
  } = useFriends(userId);

  // Create a list of friend IDs to track online status
  const friendIds = friends.map(friend => friend.id);
  
  // Add current user to the tracked IDs to ensure their status is tracked
  const trackedIds = [...friendIds];
  if (currentUserId) {
    trackedIds.push(currentUserId);
  }
  
  // Force refresh of online status every 30 seconds
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Track online status of all friends and current user
  const { onlineStatus } = useOnlineStatus(trackedIds);

  // Check if this is the current user's profile
  useEffect(() => {
    if (profile && userId) {
      setIsCurrentUser(profile.id === userId);
    }
  }, [profile, userId]);

  const refreshFriends = () => {
    // Manually force refresh the online status
    setRefreshTrigger(prev => prev + 1);
    // This will trigger a refetch in the useFriends hook
    window.location.reload();
    toast.success("Refreshing friends list");
  };

  const handleAddFriend = async () => {
    if (!profile) {
      toast.error("You must be logged in to add friends.");
      return;
    }
    
    try {
      await sendFriendRequest(userId);
      toast.success("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request.");
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    if (!profile) {
      toast.error("You must be logged in to remove friends.");
      return;
    }
    
    try {
      await unfriend(friendshipId);
      toast.success("Friend removed successfully.");
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Failed to remove friend.");
    }
  };

  const handleFriendClick = (friendId: string) => {
    setSelectedFriendId(friendId);
    setShowFriendProfile(true);
  };

  // Calculate display height based on number of friends (show up to 10 without scrolling)
  const getListHeight = () => {
    if (isCompact) {
      // For compact view
      const baseHeight = isMobile ? 240 : 320;
      return {
        maxHeight: `${baseHeight}px`,
        contentHeight: friends.length <= 10 ? 'auto' : `${isMobile ? 220 : 300}px`
      };
    } else {
      // For full view - show up to 10 friends without scrolling
      return {
        maxHeight: 'none',
        contentHeight: friends.length <= 10 ? 'auto' : '400px'
      };
    }
  };

  const { maxHeight, contentHeight } = getListHeight();

  // For debugging online status
  useEffect(() => {
    if (currentUserId) {
      console.log("Current user online status:", currentUserId, onlineStatus[currentUserId]);
    }
    if (friends.length > 0) {
      console.log("Friend online statuses:", 
        friends.map(f => ({ id: f.id, username: f.username, isOnline: onlineStatus[f.id] }))
      );
    }
  }, [onlineStatus, currentUserId, friends, refreshTrigger]);

  return (
    <>
      <div className={`bg-black/50 backdrop-filter backdrop-blur-sm rounded-lg p-3 border border-warcrow-gold/10 relative`} style={{ maxHeight }}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-warcrow-gold font-medium text-sm md:text-base">
            Friends {friends.length > 0 && `(${friends.length})`}
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

            {!isCurrentUser && profile && (
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
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
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
          <ScrollArea className={contentHeight !== 'auto' ? `h-[${contentHeight}]` : ''}>
            <ul className="space-y-2 pr-2">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <li 
                    key={friend.id} 
                    className="flex items-center justify-between group"
                  >
                    <div 
                      className="flex items-center space-x-2 flex-1 cursor-pointer hover:bg-black/30 p-1 rounded-md transition-colors"
                      onClick={() => handleFriendClick(friend.id)}
                    >
                      <div className="relative">
                        <img src={friend.avatar_url || "/images/user.png"} alt={friend.username || ''} className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
                        <span 
                          className={`absolute bottom-0 right-0 h-2 w-2 md:h-3 md:w-3 rounded-full border border-black ${
                            onlineStatus[friend.id] ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-warcrow-gold text-xs md:text-sm group-hover:underline">{friend.username}</div>
                        <div className="text-[10px] md:text-xs text-warcrow-text/70">
                          {onlineStatus[friend.id] ? 'Online' : 'Offline'}
                        </div>
                      </div>
                    </div>
                    
                    {isCurrentUser && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/50 text-red-500 hover:bg-red-500/10 h-7 px-2 py-1 text-xs ml-2"
                        onClick={() => handleRemoveFriend(friend.friendship_id)}
                      >
                        <UserMinus className="h-3 w-3" />
                      </Button>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-warcrow-text/70 text-xs md:text-sm">No friends yet.</li>
              )}
            </ul>
          </ScrollArea>
        )}
      </div>

      {/* Friend Profile Dialog */}
      <FriendProfileDialog 
        friendId={selectedFriendId}
        isOpen={showFriendProfile}
        onClose={() => setShowFriendProfile(false)}
      />
    </>
  );
};
