
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ArmyListsSection } from "@/components/profile/ArmyListsSection";
import { FriendsSection } from "@/components/profile/FriendsSection";
import { Button } from "@/components/ui/button";
import { useProfileContext } from "./ProfileData";
import { useEffect } from "react";
import { toast } from "sonner";

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
    handleListSelect,
    error
  } = useProfileContext();

  // Show toast notification for profile errors
  useEffect(() => {
    if (error) {
      toast.error(`Error loading profile: ${error.message}`);
    }
  }, [error]);

  // Log WAB ID to help debug disappearing issue
  useEffect(() => {
    if (profile?.wab_id) {
      console.log("ProfileContent: WAB ID present:", profile.wab_id);
    } else {
      console.warn("ProfileContent: WAB ID missing from profile data");
    }
  }, [profile]);

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <ProfileHeader />

      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="bg-black/50 rounded-lg p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex flex-col items-center space-y-4">
              <ProfileAvatar
                avatarUrl={profile?.avatar_url || formData.avatar_url}
                username={profile?.username || formData.username}
                isEditing={isEditing}
                onAvatarUpdate={handleAvatarUpdate}
              />
              
              {profile?.username && (
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-warcrow-gold">
                    {profile.username}
                  </h2>
                  {profile?.wab_id && (
                    <div className="text-sm text-warcrow-gold/80 font-mono mt-1">
                      {profile.wab_id}
                    </div>
                  )}
                </div>
              )}
              
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
            
            <div className="flex-1">
              <ProfileForm
                formData={{
                  ...formData,
                  wab_id: profile?.wab_id || formData.wab_id || null
                }}
                isEditing={isEditing}
                isPending={updateProfile.isPending}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-warcrow-gold/20">
            <div className="text-sm text-warcrow-gold/60 mb-4">
              <p>Games Won: {profile?.games_won || 0}</p>
              <p>Games Lost: {profile?.games_lost || 0}</p>
            </div>

            {profile?.id && (
              <div className="space-y-6">
                <FriendsSection userId={profile.id} />
              </div>
            )}

            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold text-warcrow-gold">My Army Lists</h2>
              <ArmyListsSection onListSelect={handleListSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
