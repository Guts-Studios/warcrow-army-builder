
import { ReactNode } from "react";
import ProfileContext from "@/context/ProfileContext";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileRealtime } from "@/hooks/useProfileRealtime";

export { useProfileContext } from "@/context/ProfileContext";

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const profileData = useProfileData();
  
  // Configure real-time subscriptions only if we have a profile ID that's not the preview ID
  const profileId = profileData.profile?.id || null;
  const isPreviewMode = profileId === "preview-user-id";
    
  // Pass both the profile ID and whether this is preview mode
  useProfileRealtime(profileId, isPreviewMode);

  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
};
