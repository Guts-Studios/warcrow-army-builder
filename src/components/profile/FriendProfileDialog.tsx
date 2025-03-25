import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { SocialMediaLinks } from "./SocialMediaLinks";

interface FriendProfileDialogProps {
  friendId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FriendProfileDialog = ({
  friendId,
  isOpen,
  onClose,
}: FriendProfileDialogProps) => {
  const { data: friendProfile, isLoading, isError, error } = useQuery<Profile | null>({
    queryKey: ["friendProfile", friendId],
    queryFn: async () => {
      if (!friendId) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", friendId)
        .single();

      if (error) {
        console.error("Error fetching friend profile:", error);
        throw error;
      }

      return data as Profile;
    },
    enabled: !!friendId && isOpen,
  });

  useEffect(() => {
    if (isError && error) {
      console.error("Error loading friend profile:", error);
    }
  }, [isError, error]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <Avatar>
              {friendProfile?.avatar_url ? (
                <AvatarImage src={friendProfile.avatar_url} alt={friendProfile.username || "Friend Avatar"} />
              ) : (
                <AvatarFallback>{friendProfile?.username?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
              )}
            </Avatar>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              friendProfile?.username || "Unnamed User"
            )}
          </DialogTitle>
          <DialogDescription>
            {friendProfile?.bio || "No bio available"}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 text-warcrow-gold animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="username" className="text-right text-sm font-medium leading-none text-warcrow-gold">
                Username
              </label>
              <div className="col-span-3">
                <input
                  type="text"
                  id="username"
                  value={friendProfile?.username || "N/A"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-black/30 text-warcrow-text"
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="location" className="text-right text-sm font-medium leading-none text-warcrow-gold">
                Location
              </label>
              <div className="col-span-3">
                <input
                  type="text"
                  id="location"
                  value={friendProfile?.location || "N/A"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-black/30 text-warcrow-text"
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="faction" className="text-right text-sm font-medium leading-none text-warcrow-gold">
                Faction
              </label>
              <div className="col-span-3">
                <input
                  type="text"
                  id="faction"
                  value={friendProfile?.favorite_faction || "N/A"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-black/30 text-warcrow-text"
                  disabled
                />
              </div>
            </div>
          </div>
        )}

        {/* Social Media Links */}
        {(friendProfile?.social_discord || friendProfile?.social_twitter ||
          friendProfile?.social_instagram || friendProfile?.social_youtube ||
          friendProfile?.social_twitch) && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-warcrow-gold/80">Social Platforms</h3>
            <SocialMediaLinks
              social_discord={friendProfile?.social_discord}
              social_twitter={friendProfile?.social_twitter}
              social_instagram={friendProfile?.social_instagram}
              social_youtube={friendProfile?.social_youtube}
              social_twitch={friendProfile?.social_twitch}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
