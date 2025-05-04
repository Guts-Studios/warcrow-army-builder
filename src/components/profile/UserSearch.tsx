import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileAvatar } from "./ProfileAvatar";
import { useProfileSession } from "@/hooks/useProfileSession";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchResult {
  id: string;
  username: string | null;
  wab_id: string;
  avatar_url: string | null;
}

export const UserSearch = () => {
  const { userId: currentUserId } = useProfileSession();
  const { t } = useLanguage();
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
        toast.info(t('noResults'), {
          description: t('tryDifferent'),
          position: "top-right"
        });
      } else if (data && data.length > 0) {
        const countMessage = data.length > 1 ? t('foundUsersPlural').replace('{count}', String(data.length)) : t('foundUsers').replace('{count}', String(data.length));
        toast.success(countMessage, {
          position: "top-right",
          duration: 2000
        });
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error(t('failedToSend'), {
        position: "top-right"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (recipientId: string, username: string | null) => {
    try {
      setPendingFriends(prev => ({ ...prev, [recipientId]: true }));
      
      // Check if friendship already exists
      const { data: checkResult, error: checkError } = await supabase
        .from("friendships")
        .select()
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // Store the result in a local variable to avoid scope issues
      const existingFriendship = checkResult;
      
      if (existingFriendship) {
        toast.info(t('alreadyFriends'), {
          description: t('friendRequestExisting'),
          position: "top-right"
        });
        return;
      }
      
      // Send friend request
      const { error: insertError } = await supabase
        .from("friendships")
        .insert({
          sender_id: currentUserId,
          recipient_id: recipientId,
          status: "pending"
        });
      
      if (insertError) throw insertError;
      
      // Create notification
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          recipient_id: recipientId,
          sender_id: currentUserId,
          type: "friend_request",
          content: { message: "sent you a friend request" }
        });
      
      if (notificationError) throw notificationError;
      
      toast.success(t('requestSent'), {
        description: t('requestSentTo').replace('{username}', username || t('anonymous')),
        position: "top-right"
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error(t('failedToSend'), {
        position: "top-right"
      });
    } finally {
      // Keep the button disabled after successful request
      setTimeout(() => {
        setPendingFriends(prev => ({ ...prev, [recipientId]: false }));
      }, 2000);
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
        {t('findFriends')}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border-warcrow-gold text-warcrow-text">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">{t('findFriends')}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSearch} className="space-y-4 mt-2">
            <div className="flex gap-2">
              <Input
                placeholder={t('searchPlaceholder')}
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
                {isSearching ? t('searching') : t('noResults')}
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
                      <div className="font-medium">{user.username || t('anonymous')}</div>
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
                    {pendingFriends[user.id] ? t('sent') : t('addFriend')}
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
