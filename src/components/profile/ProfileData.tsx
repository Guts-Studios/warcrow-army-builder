
import { ReactNode, useEffect } from "react";
import ProfileContext from "@/context/ProfileContext";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileRealtime } from "@/hooks/useProfileRealtime";
import { useEnvironment } from "@/hooks/useEnvironment";

export { useProfileContext } from "@/context/ProfileContext";

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
  const profileData = useProfileData();
  const { isPreview } = useEnvironment();
  
  // Configure real-time subscriptions only if we have a valid profile ID that's not the preview ID
  const profileId = profileData.profile?.id || null;
  const isPreviewMode = isPreview || profileId === "preview-user-id";
    
  // Pass both the profile ID and whether this is preview mode
  // If in preview mode, don't attempt to set up realtime subscriptions
  const { isInitialized } = useProfileRealtime(
    isPreviewMode ? null : profileId, 
    isPreviewMode
  );

  // Check for WAB ID - but don't show errors in preview mode
  useEffect(() => {
    if (profileData.profile && !profileData.profile.wab_id && !isPreviewMode) {
      console.error("ProfileDataProvider - WAB ID is missing from profile data:", profileData.profile);
      // Don't show toast here now since we'll generate it in useProfileData
    }
  }, [profileData.profile, isPreviewMode]);

  // Log the initialization state for debugging
  console.log("ProfileDataProvider - realtime subscriptions initialized:", isInitialized, 
              "Profile ID:", profileId,
              "Is Preview Mode:", isPreviewMode,
              "WAB ID present:", !!profileData.profile?.wab_id,
              "Notifications enabled:", !isPreviewMode && isInitialized);

  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
};
