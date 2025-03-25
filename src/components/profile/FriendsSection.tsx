
import { useState } from "react";
import { useFriends, Friend, FriendRequest, OutgoingRequest } from "@/hooks/useFriends";
import { useProfileSession } from "@/hooks/useProfileSession";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, Check, X, MessageSquare, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FriendProfileDialog } from "@/components/profile/FriendProfileDialog";
import { DirectMessageDialog } from "@/components/profile/DirectMessageDialog";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { profileFadeIn, staggerChildren } from "./animations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast: uiToast } = useToast();
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [selectedFriendForMessage, setSelectedFriendForMessage] = useState<Friend | null>(null);
  const [activeTab, setActiveTab] = useState("friends");

  // Get friend IDs to track online status
  const friendIds = friends.map(friend => friend.id);
  const { onlineStatus } = useOnlineStatus(friendIds);

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
  
  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    friend.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    !searchQuery
  );

  if (!isAuthenticated && userId === "preview-user-id") {
    return (
      <div className="bg-black/50 backdrop-filter backdrop-blur-sm rounded-lg p-6 border border-warcrow-gold/10 shadow-lg">
        <h2 className="text-xl font-semibold text-warcrow-gold">Friends</h2>
        <p className="text-warcrow-text/70 italic mt-4">You need to be logged in to manage friends</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-black/50 backdrop-filter backdrop-blur-sm rounded-lg p-6 border border-warcrow-gold/10 shadow-lg h-full"
      variants={profileFadeIn}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-xl font-semibold text-warcrow-gold mb-4">Friends</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 text-warcrow-gold animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Add Friend Section */}
          <div className="space-y-2">
            <h3 className="text-warcrow-gold/90 text-sm">Add Friend</h3>
            <div className="flex gap-2">
              <Input
                type="text"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                placeholder="Enter WAB ID or User ID"
                className="flex-1 bg-black/30 text-warcrow-text border border-warcrow-gold/30 rounded p-2 placeholder:text-warcrow-text/50"
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

          {/* Tabs for Friends, Requests, Pending */}
          <Tabs defaultValue="friends" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-black/20 w-full grid grid-cols-3 border border-warcrow-gold/20">
              <TabsTrigger 
                value="friends" 
                className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold"
              >
                Friends {friends.length > 0 && `(${friends.length})`}
              </TabsTrigger>
              <TabsTrigger 
                value="requests" 
                className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold"
              >
                Requests {friendRequests.length > 0 && `(${friendRequests.length})`}
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold"
              >
                Pending {outgoingRequests.length > 0 && `(${outgoingRequests.length})`}
              </TabsTrigger>
            </TabsList>
            
            <motion.div
              key={activeTab}
              variants={profileFadeIn}
              initial="hidden"
              animate="visible"
              className="pt-4"
            >
              {/* Friends Tab */}
              <TabsContent value="friends" className="mt-0 space-y-2">
                {friends.length > 0 && (
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-warcrow-text/50" />
                    <Input
                      type="text"
                      placeholder="Search friends..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 bg-black/30 border-warcrow-gold/20 placeholder:text-warcrow-text/50"
                    />
                  </div>
                )}
                
                {friends.length === 0 ? (
                  <div className="py-6 text-center text-warcrow-text/70 italic bg-black/20 rounded-md">
                    <p>You haven't added any friends yet</p>
                    <p className="text-sm mt-1">Use the search box above to find new friends</p>
                  </div>
                ) : filteredFriends.length === 0 ? (
                  <div className="py-6 text-center text-warcrow-text/70 italic bg-black/20 rounded-md">
                    <p>No friends match your search</p>
                  </div>
                ) : (
                  <motion.div 
                    className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin"
                    variants={staggerChildren}
                  >
                    {filteredFriends.map((friend) => (
                      <motion.div 
                        key={friend.id} 
                        className="flex items-center justify-between p-2 bg-black/30 rounded-md border border-warcrow-gold/10 hover:bg-black/40 transition-colors"
                        variants={profileFadeIn}
                      >
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
                            isOnline={onlineStatus[friend.id]}
                          />
                          <span className="ml-2 text-warcrow-text">
                            {friend.username || "Unnamed User"}
                            {onlineStatus[friend.id] && 
                              <span className="ml-2 text-green-500 text-xs">Online</span>
                            }
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
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              {/* Friend Requests Tab */}
              <TabsContent value="requests" className="mt-0">
                {friendRequests.length === 0 ? (
                  <div className="py-6 text-center text-warcrow-text/70 italic bg-black/20 rounded-md">
                    <p>No pending friend requests</p>
                  </div>
                ) : (
                  <motion.div 
                    className="space-y-2 max-h-[300px] overflow-y-auto pr-1"
                    variants={staggerChildren}
                  >
                    {friendRequests.map((request) => (
                      <motion.div 
                        key={request.id} 
                        className="flex items-center justify-between p-2 bg-black/30 rounded-md border border-warcrow-gold/10 hover:bg-black/40 transition-colors"
                        variants={profileFadeIn}
                      >
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
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              {/* Outgoing Requests Tab */}
              <TabsContent value="pending" className="mt-0">
                {outgoingRequests.length === 0 ? (
                  <div className="py-6 text-center text-warcrow-text/70 italic bg-black/20 rounded-md">
                    <p>No outgoing friend requests</p>
                  </div>
                ) : (
                  <motion.div 
                    className="space-y-2 max-h-[300px] overflow-y-auto pr-1"
                    variants={staggerChildren}
                  >
                    {outgoingRequests.map((request) => (
                      <motion.div 
                        key={request.id} 
                        className="flex items-center justify-between p-2 bg-black/30 rounded-md border border-warcrow-gold/10 hover:bg-black/40 transition-colors"
                        variants={profileFadeIn}
                      >
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
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>
            </motion.div>
          </Tabs>
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
    </motion.div>
  );
};
