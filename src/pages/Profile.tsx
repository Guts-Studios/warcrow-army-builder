
import { ProfileDataProvider, useProfileContext } from "@/components/profile/ProfileData";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { LoadingScreen } from "@/components/profile/LoadingScreen";
import { Toaster } from "sonner";

const ProfileWithData = () => {
  const { isLoading } = useProfileContext();
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  return <ProfileContent />;
};

const Profile = () => {
  return (
    <ProfileDataProvider>
      <ProfileWithData />
      <Toaster position="top-right" />
    </ProfileDataProvider>
  );
};

export default Profile;
