
import { ProfileDataProvider } from "@/components/profile/ProfileData";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { LoadingScreen } from "@/components/profile/LoadingScreen";
import { useProfileContext } from "@/components/profile/ProfileData";

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
    </ProfileDataProvider>
  );
};

export default Profile;
