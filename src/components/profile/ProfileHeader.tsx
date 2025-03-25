
import { useProfileContext } from "./ProfileData";
import { NotificationsMenu } from "./NotificationsMenu";

export const ProfileHeader = () => {
  const { profile } = useProfileContext();
  
  return (
    <div className="bg-black py-4 border-b border-warcrow-gold/20">
      <div className="container max-w-2xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-warcrow-gold">My Profile</h1>
        {profile && profile.id && (
          <NotificationsMenu userId={profile.id} />
        )}
      </div>
    </div>
  );
};
