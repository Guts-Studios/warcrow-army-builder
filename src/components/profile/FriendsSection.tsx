
import { useState } from "react";
import { useFriends, Friend, FriendRequest, OutgoingRequest } from "@/hooks/useFriends";
import { useProfileSession } from "@/hooks/useProfileSession";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, Check, X, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FriendProfileDialog } from "@/components/profile/FriendProfileDialog";
import { DirectMessageDialog } from "@/components/profile/DirectMessageDialog";
import { toast } from "sonner";

interface FriendsSectionProps {
  userId: string;
}

export const FriendsSection = ({ userId }: FriendsSectionProps) => {
  const { isAuthenticated } = useProfileSession();
  const { 
    friends, 
    friendRequests, 
    outgoingRequests,
    isLoading,
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest,
    cancelFriendRequest,
    unfriend
  } = useFriends(userId);
  const [friendCode, setFriendCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: uiToast } = useToast();
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [selectedFriendForMessage, setSelectedFriendForMessage] = useState<Friend | null>(null);

  const handleAddFriend = async () => {
    if (!friendCode.trim()) return;
    
    setIsSubmitting(true);
    try {
      await sendFriendRequest(friendCode.trim());
      setFriendCode("");
      
      // Show sonner toast notification
      toast.success("Friend request sent", {
        description: "We'll notify you when they respond",
        position: "top-right"
      });
      
      // Also use the UI toast for consistent interfaces
      uiToast({
        title: "Friend request sent",
        description: "We'll notify you when they respond",
      });
    } catch (error: any) {
      // Show error notification with sonner
      toast.error("Failed to send friend request", {
        description: error.message || "Please try a valid WAB ID or user ID",
        position: "top-right"
      });
      
      uiToast({
        title: "Failed to send friend request",
        description: error.message || "Please try a valid WAB ID or user ID",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated && userId === "preview-user-id") {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-warcrow-gold">Friends</h2>
        <p className="text-warcrow-text/70 italic">You need to be logged in to manage friends</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-warcrow-gold">Friends</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 text-warcrow-gold animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Add Friend Section */}
          <div className="space-y-2">
            <h3 className="text-warcrow-gold/90">Add Friend</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                placeholder="Enter WAB ID or User ID"
                className="flex-1 bg-black/30 text-warcrow-text border border-warcrow-gold/30 rounded p-2"
              />
              <Button
                onClick={handleAddFriend}
                disabled={isSubmitting || !friendCode.trim()}
                className="bg-warcrow-gold/80 hover:bg-warcrow-gold text-black"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-1" />}
                Add
              </Button>
            </div>
          </div>

          {/* Friends List */}
          <div className="space-y-2">
            <h3 className="text-warcrow-gold/90">My Friends ({friends.length})</h3>
            {friends.length === 0 ? (
              <p className="text-warcrow-text/70 italic">You haven't added any friends yet</p>
            ) : (
              <div className="space-y-2">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between p-2 bg-black/30 rounded-md border border-warcrow-gold/10">
                    <button 
                      className="flex items-center flex-1 text-left"
                      onClick={() => setSelectedFriend(friend.id)}
                    >
                      <ProfileAvatar
                        avatarUrl={friend.avatar_url}
                        username={friend.username || "User"}
                        isEditing={false}
                        onAvatarUpdate={() => {}}
                        size="sm"
                      />
                      <span className="ml-2 text-warcrow-text">
                        {friend.username || "Unnamed User"}
                      </span>
                    </button>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedFriendForMessage(friend);
                          // Show a subtle notification when opening message dialog
                          toast.info(`Opening chat with ${friend.username || "friend"}`, {
                            position: "top-right",
                            duration: 2000
                          });
                        }}
                        className="text-warcrow-gold hover:bg-black/50"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          unfriend(friend.friendship_id);
                          // Show notification when unfriending
                          toast.info(`Removed ${friend.username || "friend"} from friends list`, {
                            position: "top-right"
                          });
                        }}
                        className="border-warcrow-gold/30 text-warcrow-gold hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/30"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Friend Requests */}
          {friendRequests.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-warcrow-gold/90">Friend Requests ({friendRequests.length})</h3>
              <div className="space-y-2">
                {friendRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-2 bg-black/30 rounded-md border border-warcrow-gold/10">
                    <div className="flex items-center flex-1">
                      <ProfileAvatar
                        avatarUrl={request.sender_avatar_url}
                        username={request.sender_username || "User"}
                        isEditing={false}
                        onAvatarUpdate={() => {}}
                        size="sm"
                      />
                      <span className="ml-2 text-warcrow-text">
                        {request.sender_username || "Unnamed User"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => {
                          acceptFriendRequest(request.friendship_id, request.sender_id);
                          // Show notification when accepting a friend request
                          toast.success(`Accepted friend request from ${request.sender_username || "user"}`, {
                            position: "top-right"
                          });
                        }}
                        className="bg-warcrow-gold/80 hover:bg-warcrow-gold text-black"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          rejectFriendRequest(request.friendship_id);
                          // Show notification when rejecting a friend request
                          toast.info(`Rejected friend request`, {
                            position: "top-right"
                          });
                        }}
                        className="border-red-900/30 text-red-400 hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outgoing Requests */}
          {outgoingRequests.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-warcrow-gold/90">Pending Requests ({outgoingRequests.length})</h3>
              <div className="space-y-2">
                {outgoingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-2 bg-black/30 rounded-md border border-warcrow-gold/10">
                    <div className="flex items-center flex-1">
                      <ProfileAvatar
                        avatarUrl={request.recipient_avatar_url}
                        username={request.recipient_username || "User"}
                        isEditing={false}
                        onAvatarUpdate={() => {}}
                        size="sm"
                      />
                      <span className="ml-2 text-warcrow-text">
                        {request.recipient_username || "Unnamed User"}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => cancelFriendRequest(request.friendship_id)}
                      className="border-warcrow-gold/30 text-warcrow-gold hover:bg-black"
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Friend Profile Dialog */}
      <FriendProfileDialog 
        friendId={selectedFriend}
        isOpen={!!selectedFriend}
        onClose={() => setSelectedFriend(null)}
      />

      {/* Direct Message Dialog */}
      <DirectMessageDialog
        friendId={selectedFriendForMessage?.id || null}
        friendUsername={selectedFriendForMessage?.username || null}
        friendAvatar={selectedFriendForMessage?.avatar_url || null}
        isOpen={!!selectedFriendForMessage}
        onClose={() => setSelectedFriendForMessage(null)}
      />
    </div>
  );
};
