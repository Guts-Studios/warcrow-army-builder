
import { ReactNode } from "react";
import ProfileContext from "@/context/ProfileContext";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileRealtime } from "@/hooks/useProfileRealtime";

export { useProfileContext } from "@/context/ProfileContext";

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const profileData = useProfileData();
  
  // Configure real-time subscriptions only if we have a profile ID that's not the preview ID
  const shouldSetupRealtime = 
    profileData.profile?.id && 
    profileData.profile.id !== "preview-user-id";
    
  // Pass both the profile ID and whether this is preview mode
  useProfileRealtime(
    shouldSetupRealtime ? profileData.profile?.id : null, 
    profileData.profile?.id === "preview-user-id"
  );

  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
};
