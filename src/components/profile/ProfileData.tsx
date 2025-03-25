
import { ReactNode } from "react";
import ProfileContext from "@/context/ProfileContext";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileRealtime } from "@/hooks/useProfileRealtime";

export { useProfileContext } from "@/context/ProfileContext";

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const profileData = useProfileData();
  
  // Configure real-time subscriptions
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                  window.location.hostname.endsWith('.lovableproject.com');
  useProfileRealtime(profileData.profile?.id, isPreview);

  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
};
