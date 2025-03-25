
import { ProfileDataProvider, useProfileContext } from "@/components/profile/ProfileData";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { LoadingScreen } from "@/components/profile/LoadingScreen";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

const ProfileWithData = () => {
  const { isLoading, profile, error } = useProfileContext();
  
  // Initialize online tracking when profile is loaded
  // This ensures the current user's online status is tracked
  const currentUserId = profile?.id || null;
  useOnlineStatus(currentUserId ? [currentUserId] : []);
  
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

  return <ProfileContent />;
};

const Profile = () => {
  return (
    <ProfileDataProvider>
      <ProfileWithData />
    </ProfileDataProvider>
  );
};

export default Profile;
