
import { ProfileDataProvider, useProfileContext } from "@/components/profile/ProfileData";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { LoadingScreen } from "@/components/profile/LoadingScreen";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useMemo } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useFriends } from "@/hooks/useFriends";

const ProfileWithData = () => {
  const { isLoading, profile, error } = useProfileContext();
  
  // Get the current user ID and any friend IDs to track
  const currentUserId = profile?.id || null;
  
  // Get friends list to track online status
  const { friends } = useFriends(currentUserId || '');
  
  // Create a list of IDs to track online status for (current user + friends)
  const idsToTrack = useMemo(() => {
    if (!currentUserId) return [];
    
    // Track current user and all friends
    const friendIds = friends.map(friend => friend.id);
    return [currentUserId, ...friendIds];
  }, [currentUserId, friends]);
  
  // Initialize online tracking for current user and their friends
  const { onlineStatus } = useOnlineStatus(idsToTrack);
  
  // Log current user's online status for debugging
  useEffect(() => {
    if (currentUserId && onlineStatus) {
      console.log("Current user online status:", { 
        userId: currentUserId, 
        isOnline: onlineStatus[currentUserId] 
      });
    }
  }, [currentUserId, onlineStatus]);
  
  useEffect(() => {
    if (error) {
      console.error("Profile loading error:", error);
      toast({
        title: "Error loading profile",
        description: "There was an error loading your profile data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center">
        <div className="text-warcrow-gold text-xl mb-4">Profile Not Available</div>
        <div className="text-warcrow-text/70 text-center max-w-md px-4">
          Your profile could not be loaded. This may be due to connection issues or account permissions.
        </div>
      </div>
    );
  }

  return <ProfileContent isOnline={currentUserId ? onlineStatus[currentUserId] : false} />;
};

const Profile = () => {
  return (
    <ProfileDataProvider>
      <ProfileWithData />
    </ProfileDataProvider>
  );
};

export default Profile;
