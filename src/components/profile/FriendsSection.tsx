
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useFriends } from "@/hooks/useFriends";
import { useUserSearch } from "@/hooks/useUserSearch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const FriendsSection = ({ userId }: { userId: string }) => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { searchQuery, setSearchQuery, searchResults, isSearching, searchUsers } = useUserSearch();
  const { toast } = useToast();
  
  // Always call useFriends hook regardless of userId value
  const { 
    friends, 
    friendRequests, 
    outgoingRequests, 
    isLoading, 
    acceptFriendRequest, 
    rejectFriendRequest,
    cancelFriendRequest,
    sendFriendRequest,
    unfriend
  } = useFriends(userId);

  // Check if we're in preview mode after all hooks are called
  const isPreviewMode = userId === "preview-user-id";
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const handleSendFriendRequest = async (recipientId: string) => {
    try {
      await sendFriendRequest(recipientId);
      toast({
        title: "Friend request sent!",
        description: "Your friend request has been sent."
      });
    } catch (error: any) {
      toast({
        title: "Error sending friend request",
        description: error.message || "Failed to send friend request.",
        variant: "destructive"
      });
    }
  };

  const handleAcceptFriendRequest = async (friendshipId: string, senderId: string) => {
    try {
      await acceptFriendRequest(friendshipId, senderId);
      toast({
        title: "Friend request accepted!",
        description: "You are now friends."
      });
    } catch (error: any) {
      toast({
        title: "Error accepting friend request",
        description: error.message || "Failed to accept friend request.",
        variant: "destructive"
      });
    }
  };

  const handleRejectFriendRequest = async (friendshipId: string) => {
    try {
      await rejectFriendRequest(friendshipId);
      toast({
        title: "Friend request rejected",
        description: "You have rejected the friend request."
      });
    } catch (error: any) {
      toast({
        title: "Error rejecting friend request",
        description: error.message || "Failed to reject friend request.",
        variant: "destructive"
      });
    }
  };

  const handleCancelFriendRequest = async (friendshipId: string) => {
    try {
      await cancelFriendRequest(friendshipId);
      toast({
        title: "Friend request cancelled",
        description: "You have cancelled the friend request."
      });
    } catch (error: any) {
      toast({
        title: "Error cancelling friend request",
        description: error.message || "Failed to cancel friend request.",
        variant: "destructive"
      });
    }
  };

  const handleUnfriend = async (friendshipId: string) => {
    try {
      await unfriend(friendshipId);
      toast({
        title: "Friend removed",
        description: "You have removed this friend."
      });
    } catch (error: any) {
      toast({
        title: "Error removing friend",
        description: error.message || "Failed to remove friend.",
        variant: "destructive"
      });
    }
  };

  // For preview mode, return a simplified UI
  if (isPreviewMode) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-warcrow-gold">Friends</h2>
        <div className="bg-black/20 p-4 rounded border border-warcrow-gold/10 text-center">
          <p className="text-warcrow-text/70">Friends feature is not available in preview mode</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-warcrow-gold">Friends</h2>

      {/* Search for Users */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-warcrow-gold">Search Users</Label>
        <Input
          id="search"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="bg-black/50 border-warcrow-gold/30 text-warcrow-text"
        />

        {isSearching && (
          <div className="text-warcrow-text/70 italic">Searching...</div>
        )}

        {searchResults.length > 0 && (
          <Card className="bg-black/50 border-warcrow-gold/30">
            <CardContent className="p-4">
              <ScrollArea className="h-40">
                <div className="space-y-2">
                  {searchResults.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || undefined} alt={user.username || "User"} />
                          <AvatarFallback className="bg-warcrow-gold/20 text-warcrow-gold">
                            {user.username?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-warcrow-text">{user.username || "User"}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                        }}
                        disabled={outgoingRequests.some(req => req.recipient_id === user.id) ||
                                  friends.some(friend => friend.id === user.id)}
                        className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
                      >
                        {outgoingRequests.some(req => req.recipient_id === user.id) ? 'Pending...' : 'Add Friend'}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Friend Requests */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-warcrow-gold">Friend Requests</h3>
        {isLoading ? (
          <div className="text-warcrow-text/70 italic">Loading friend requests...</div>
        ) : friendRequests.length > 0 ? (
          <div className="space-y-2">
            {friendRequests.map(request => (
              <Card key={request.id} className="bg-black/50 border-warcrow-gold/30">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={request.sender_avatar_url || undefined} alt={request.sender_username || "User"} />
                      <AvatarFallback className="bg-warcrow-gold/20 text-warcrow-gold">
                        {request.sender_username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-warcrow-text">{request.sender_username || "Anonymous User"}</span>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAcceptFriendRequest(request.friendship_id, request.sender_id)}
                      className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
                    >
                      Accept
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRejectFriendRequest(request.friendship_id)}
                      className="text-warcrow-text hover:bg-black/20"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-warcrow-text/70 italic">No friend requests</div>
        )}
      </div>

      {/* Friend List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-warcrow-gold">My Friends</h3>
        {isLoading ? (
          <div className="text-warcrow-text/70 italic">Loading friends...</div>
        ) : friends.length > 0 ? (
          <div className="space-y-2">
            {friends.map(friend => (
              <Card key={friend.id} className="bg-black/50 border-warcrow-gold/30">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={friend.avatar_url || undefined} alt={friend.username || "User"} />
                      <AvatarFallback className="bg-warcrow-gold/20 text-warcrow-gold">
                        {friend.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-warcrow-text">{friend.username || "Anonymous User"}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedUser(friend);
                    }}
                    className="text-warcrow-text hover:bg-black/20"
                  >
                    Unfriend
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-warcrow-text/70 italic">No friends yet</div>
        )}
      </div>

      {/* Outgoing Friend Requests */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-warcrow-gold">Outgoing Friend Requests</h3>
        {isLoading ? (
          <div className="text-warcrow-text/70 italic">Loading outgoing requests...</div>
        ) : outgoingRequests.length > 0 ? (
          <div className="space-y-2">
            {outgoingRequests.map(request => (
              <Card key={request.id} className="bg-black/50 border-warcrow-gold/30">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={request.recipient_avatar_url || undefined} alt={request.recipient_username || "User"} />
                      <AvatarFallback className="bg-warcrow-gold/20 text-warcrow-gold">
                        {request.recipient_username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-warcrow-text">{request.recipient_username || "Anonymous User"}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCancelFriendRequest(request.friendship_id)}
                    className="text-warcrow-text hover:bg-black/20"
                  >
                    Cancel Request
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-warcrow-text/70 italic">No outgoing friend requests</div>
        )}
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedUser} onOpenChange={(open) => {
        if (!open) setSelectedUser(null);
      }}>
        <AlertDialogContent className="bg-black border-warcrow-gold/30 text-warcrow-text">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warcrow-gold">
              {friends.some(friend => friend.id === selectedUser?.id) ? "Unfriend" : "Send Friend Request"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-warcrow-text/80">
              {friends.some(friend => friend.id === selectedUser?.id) ? 
                `Are you sure you want to remove ${selectedUser?.username} from your friends?` :
                `Are you sure you want to send a friend request to ${selectedUser?.username}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-warcrow-text hover:bg-black/20">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                if (friends.some(friend => friend.id === selectedUser?.id)) {
                  if (selectedUser?.id) {
                    const friend = friends.find(f => f.id === selectedUser.id);
                    if (friend) {
                      await handleUnfriend(friend.friendship_id);
                      toast({
                        title: "Friend Removed",
                        description: `${selectedUser.username} has been removed from your friends.`,
                      });
                    }
                  }
                } else {
                  if (selectedUser?.id) {
                    await handleSendFriendRequest(selectedUser.id);
                    toast({
                      title: "Friend Request Sent",
                      description: `A friend request has been sent to ${selectedUser.username}.`,
                    });
                  }
                }
                setSelectedUser(null);
              }}
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
            >
              {friends.some(friend => friend.id === selectedUser?.id) ? "Unfriend" : "Send Request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
