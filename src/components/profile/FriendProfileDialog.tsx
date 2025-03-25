
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFriendProfileFetch } from "@/hooks/useFriendProfileFetch";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, MessageSquare, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FriendProfileDialogProps {
  friendId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FriendProfileDialog = ({ friendId, isOpen, onClose }: FriendProfileDialogProps) => {
  const { profile, isLoading, isError } = useFriendProfileFetch(friendId);
  
  // Close dialog if friend ID changes to null
  useEffect(() => {
    if (!friendId && isOpen) {
      onClose();
    }
  }, [friendId, isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="bg-black/90 border-warcrow-gold/30 text-warcrow-text max-w-md">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">Player Profile</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-warcrow-gold animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-6 text-red-400">
            <p>Failed to load profile</p>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="mt-4 border-warcrow-gold/40 text-warcrow-gold hover:bg-black"
            >
              Close
            </Button>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <ProfileAvatar
                avatarUrl={profile.avatar_url}
                username={profile.username || "User"}
                isEditing={false}
                onAvatarUpdate={() => {}}
                size="lg"
              />
              <div>
                <h3 className="text-xl font-semibold text-warcrow-gold">
                  {profile.username || "Anonymous User"}
                </h3>
                {profile.wab_id && (
                  <div className="text-sm font-mono text-warcrow-gold/70 mt-1">
                    {profile.wab_id}
                  </div>
                )}
              </div>
            </div>

            {profile.bio && (
              <div className="bg-black/30 p-3 rounded-md border border-warcrow-gold/10">
                <p className="text-warcrow-text/90 italic">{profile.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-warcrow-gold/70">Games Won</div>
                <div className="text-lg font-semibold">{profile.games_won || 0}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-warcrow-gold/70">Games Lost</div>
                <div className="text-lg font-semibold">{profile.games_lost || 0}</div>
              </div>
            </div>

            <div className="space-y-2">
              {profile.favorite_faction && (
                <Badge variant="outline" className="bg-black/60 border-warcrow-gold/30 text-warcrow-gold">
                  {profile.favorite_faction}
                </Badge>
              )}
              
              {profile.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-warcrow-gold/70" />
                  <span>{profile.location}</span>
                </div>
              )}
              
              {profile.social_discord && (
                <div className="flex items-center text-sm">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-warcrow-gold/70" />
                  <span>{profile.social_discord}</span>
                </div>
              )}
              
              {profile.social_twitter && (
                <div className="flex items-center text-sm">
                  <AtSign className="h-3.5 w-3.5 mr-1.5 text-warcrow-gold/70" />
                  <span>{profile.social_twitter}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-warcrow-text/70">
            <p>No profile information available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
