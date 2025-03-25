
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ArmyListsSection } from "@/components/profile/ArmyListsSection";
import { FriendsSection } from "@/components/profile/FriendsSection";
import { FriendActivityFeed } from "@/components/profile/FriendActivityFeed";
import { ProfileComments } from "@/components/profile/ProfileComments";
import { Button } from "@/components/ui/button";
import { useProfileContext } from "./ProfileData";
import { useEffect } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { SocialMediaLinks } from "./SocialMediaLinks";

interface ProfileContentProps {
  isOnline?: boolean;
}

export const ProfileContent = ({ isOnline = false }: ProfileContentProps) => {
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

  const [copied, setCopied] = useState(false);

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

  // Function to copy WAB ID to clipboard
  const copyWabIdToClipboard = async () => {
    if (profile?.wab_id) {
      try {
        await navigator.clipboard.writeText(profile.wab_id);
        setCopied(true);
        toast.success("WAB ID copied to clipboard");
        
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        toast.error("Failed to copy WAB ID");
        console.error("Failed to copy: ", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <ProfileHeader />

      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Profile information */}
          <div className="lg:col-span-2">
            <div className="bg-black/50 rounded-lg p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <ProfileAvatar
                    avatarUrl={profile?.avatar_url || formData.avatar_url}
                    username={profile?.username || formData.username}
                    isEditing={isEditing}
                    onAvatarUpdate={handleAvatarUpdate}
                    isOnline={isOnline}
                  />
                  
                  {profile?.username && (
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-warcrow-gold">
                        {profile.username}
                      </h2>
                      <div className="mt-1 flex items-center justify-center text-sm">
                        <span className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-warcrow-text/70">{isOnline ? 'Online' : 'Offline'}</span>
                      </div>
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
                  {/* Add a prominent WAB ID display at the top of the right column */}
                  {profile?.wab_id && (
                    <div className="mb-4 p-3 bg-black/70 rounded-md border border-warcrow-gold/50 shadow-md">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-warcrow-gold font-semibold">Warcrow Army Builder ID:</span>
                        <Button 
                          onClick={copyWabIdToClipboard}
                          variant="outline"
                          size="sm"
                          className="h-7 border-warcrow-gold/50 text-warcrow-gold hover:bg-black/50"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="text-warcrow-gold font-mono text-lg tracking-wide mt-1">{profile.wab_id}</div>
                      <div className="text-xs text-warcrow-gold/70 mt-1">Use this ID to link your army lists</div>
                    </div>
                  )}

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

              {/* Social Media Links Section */}
              {(profile.social_discord || profile.social_twitter || profile.social_instagram || 
                profile.social_youtube || profile.social_twitch) && (
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-warcrow-gold/80">Social Platforms</h3>
                  <SocialMediaLinks
                    social_discord={profile.social_discord}
                    social_twitter={profile.social_twitter}
                    social_instagram={profile.social_instagram}
                    social_youtube={profile.social_youtube}
                    social_twitch={profile.social_twitch}
                  />
                </div>
              )}

              <div className="pt-4 border-t border-warcrow-gold/20">
                <div className="text-sm text-warcrow-gold/60 mb-4">
                  <p>Games Won: {profile?.games_won || 0}</p>
                  <p>Games Lost: {profile?.games_lost || 0}</p>
                </div>

                <div className="mt-6 space-y-4">
                  <h2 className="text-xl font-semibold text-warcrow-gold">My Army Lists</h2>
                  <ArmyListsSection onListSelect={handleListSelect} />
                </div>
                
                {/* Add the ProfileComments section */}
                {profile?.id && (
                  <div className="mt-6 pt-6 border-t border-warcrow-gold/20">
                    <ProfileComments profileId={profile.id} />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right column - Friends and Activity */}
          <div className="space-y-6">
            {profile?.id && (
              <>
                <FriendsSection userId={profile.id} />
                <FriendActivityFeed userId={profile.id} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
