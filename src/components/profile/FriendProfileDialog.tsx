
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFriendProfileFetch } from "@/hooks/useFriendProfileFetch";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { DirectMessageDialog } from "@/components/profile/DirectMessageDialog";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface FriendProfileDialogProps {
  friendId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FriendProfileDialog = ({ friendId, isOpen, onClose }: FriendProfileDialogProps) => {
  const { profile, isLoading } = useFriendProfileFetch(friendId);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const { onlineStatus } = useOnlineStatus(friendId ? [friendId] : []);
  const isOnline = friendId ? onlineStatus[friendId] : false;

  useEffect(() => {
    if (!isOpen) {
      setShowMessageDialog(false);
    }
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-warcrow-background border-warcrow-gold/30 text-warcrow-text">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Friend Profile</DialogTitle>
            <DialogDescription className="text-warcrow-text/70">
              View information about your friend
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center py-8">Loading profile...</div>
          ) : profile ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <ProfileAvatar
                  avatarUrl={profile.avatar_url}
                  username={profile.username || "User"}
                  isEditing={false}
                  onAvatarUpdate={() => {}}
                  size="lg"
                  isOnline={isOnline}
                />
                <div>
                  <h3 className="text-xl font-medium text-warcrow-gold">{profile.username || "Unnamed User"}</h3>
                  <div className="flex items-center mt-1">
                    <div className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-warcrow-text/70">{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                  {profile.wab_id && (
                    <p className="text-sm text-warcrow-text/70 mt-1">WAB ID: {profile.wab_id}</p>
                  )}
                </div>
              </div>

              {profile.bio && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-warcrow-gold">Bio</h4>
                  <p className="text-warcrow-text/90 mt-1">{profile.bio}</p>
                </div>
              )}

              {profile.location && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-warcrow-gold">Location</h4>
                  <p className="text-warcrow-text/90">{profile.location}</p>
                </div>
              )}

              {profile.favorite_faction && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-warcrow-gold">Favorite Faction</h4>
                  <p className="text-warcrow-text/90">{profile.favorite_faction}</p>
                </div>
              )}

              <div className="mt-4 space-x-2 flex justify-end">
                <Button 
                  onClick={() => setShowMessageDialog(true)}
                  className="bg-warcrow-gold/80 hover:bg-warcrow-gold text-black"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center">Could not load profile</div>
          )}
        </DialogContent>
      </Dialog>

      <DirectMessageDialog
        friendId={friendId}
        friendUsername={profile?.username || null}
        friendAvatar={profile?.avatar_url || null}
        isOpen={showMessageDialog}
        onClose={() => setShowMessageDialog(false)}
      />
    </>
  );
};
