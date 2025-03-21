
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ArmyListsSection } from "@/components/profile/ArmyListsSection";
import { Button } from "@/components/ui/button";
import { useProfileContext } from "./ProfileData";

export const ProfileContent = () => {
  const { 
    profile,
    formData, 
    isEditing, 
    updateProfile,
    setIsEditing,
    handleInputChange,
    handleSubmit,
    handleAvatarUpdate,
    handleListSelect
  } = useProfileContext();

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <ProfileHeader />

      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="bg-black/50 rounded-lg p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <ProfileAvatar
              avatarUrl={formData.avatar_url}
              username={formData.username}
              isEditing={isEditing}
              onAvatarUpdate={handleAvatarUpdate}
            />
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
              >
                Edit Profile
              </Button>
            )}
          </div>

          <ProfileForm
            formData={formData}
            isEditing={isEditing}
            isPending={updateProfile.isPending}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
          />

          <div className="pt-4 border-t border-warcrow-gold/20">
            <div className="text-sm text-warcrow-gold/60 mb-4">
              <p>Games Won: {profile?.games_won || 0}</p>
              <p>Games Lost: {profile?.games_lost || 0}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-warcrow-gold">My Army Lists</h2>
              <ArmyListsSection onListSelect={handleListSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
