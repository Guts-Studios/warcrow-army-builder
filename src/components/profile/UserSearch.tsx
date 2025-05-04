import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileAvatar } from "./ProfileAvatar";
import { useProfileSession } from "@/hooks/useProfileSession";

interface SearchResult {
  id: string;
  username: string | null;
  wab_id: string;
  avatar_url: string | null;
}

export const UserSearch = () => {
  const { userId: currentUserId } = useProfileSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingFriends, setPendingFriends] = useState<Record<string, boolean>>({});

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, wab_id, avatar_url")
        .or(`wab_id.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .neq("id", currentUserId)
        .limit(5);
      
      if (error) throw error;
      
      setSearchResults(data || []);
      
      if (data && data.length === 0) {
        toast.info("No users found", {
          description: "Try a different username or WAB ID",
          position: "top-right"
        });
      } else if (data && data.length > 0) {
        toast.success(`Found ${data.length} user${data.length > 1 ? 's' : ''}`, {
          position: "top-right",
          duration: 2000
        });
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Failed to search users", {
        position: "top-right"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (recipientId: string, username: string | null) => {
    try {
      setPendingFriends(prev => ({ ...prev, [recipientId]: true }));
      
      const { data: existingFriendship, error: checkError } = await supabase
        .from("friendships")
        .select()
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingFriendship) {
        toast.info("Already connected", {
          description: "You already have a friendship or pending request with this user",
          position: "top-right"
        });
        return;
      }
      
      const { error: insertError } = await supabase
        .from("friendships")
        .insert({
          sender_id: currentUserId,
          recipient_id: recipientId,
          status: "pending"
        });
      
      if (insertError) throw insertError;
      
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: recipientId,
          sender_id: currentUserId,
          type: "friend_request",
          content: { message: "sent you a friend request" }
        });
      
      if (notificationError) throw notificationError;
      
      toast.success("Friend request sent!", {
        description: `Request sent to ${username || "user"}`,
        position: "top-right"
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send friend request", {
        position: "top-right"
      });
    } finally {
      // Keep the button disabled after successful request
      if (!existingFriendship) {
        setTimeout(() => {
          setPendingFriends(prev => ({ ...prev, [recipientId]: false }));
        }, 2000);
      }
    }
  };

  if (!currentUserId) {
    return null; // Don't show search if user is not logged in
  }

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
      >
        <Search className="h-4 w-4 mr-2" />
        Find Friends
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border-warcrow-gold text-warcrow-text">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Find Players</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSearch} className="space-y-4 mt-2">
            <div className="flex gap-2">
              <Input
                placeholder="Search by WAB ID or username"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isSearching}
                className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
          
          <div className="mt-4 space-y-2">
            {searchResults.length === 0 ? (
              <p className="text-warcrow-text/60 text-center">
                {isSearching ? "Searching..." : "No results found"}
              </p>
            ) : (
              searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between bg-black/50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ProfileAvatar 
                      avatarUrl={user.avatar_url} 
                      username={user.username || user.wab_id}
                      isEditing={false}
                      onAvatarUpdate={() => {}}
                      size="sm"
                    />
                    <div>
                      <div className="font-medium">{user.username || "Anonymous User"}</div>
                      <div className="text-sm text-warcrow-gold/60">{user.wab_id}</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => sendFriendRequest(user.id, user.username)}
                    size="sm"
                    disabled={pendingFriends[user.id]}
                    className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    {pendingFriends[user.id] ? "Sent" : "Add"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
