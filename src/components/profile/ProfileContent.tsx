
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { FriendsSection } from "@/components/profile/FriendsSection";
import { FriendActivityFeed } from "@/components/profile/FriendActivityFeed";
import { Button } from "@/components/ui/button";
import { useProfileContext } from "./ProfileData";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Edit } from "lucide-react";
import { ProfileCompletionIndicator } from "./ProfileCompletionIndicator";
import { ProfileTabs } from "./ProfileTabs";
import { motion } from "framer-motion";
import { profileFadeIn, staggerChildren } from "./animations";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(`Error loading profile: ${error.message}`);
    }
  }, [error]);

  useEffect(() => {
    if (profile?.wab_id) {
      console.log("ProfileContent: WAB ID present:", profile.wab_id);
    } else {
      console.warn("ProfileContent: WAB ID missing from profile data");
    }
  }, [profile]);

  const copyWabIdToClipboard = async () => {
    if (profile?.wab_id) {
      try {
        await navigator.clipboard.writeText(profile.wab_id);
        setCopied(true);
        toast.success("WAB ID copied to clipboard");
        
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
    <div className="min-h-screen bg-warcrow-background text-warcrow-text bg-gradient-to-b from-black/60 to-transparent overflow-auto pb-12">
      <ProfileHeader />

      <motion.div 
        className="container max-w-5xl mx-auto py-4 px-4"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-black/50 backdrop-filter backdrop-blur-sm rounded-lg p-6 space-y-6 border border-warcrow-gold/10 shadow-lg"
              variants={profileFadeIn}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <motion.div 
                  className="flex flex-col items-center space-y-4"
                  variants={profileFadeIn}
                >
                  <ProfileAvatar
                    avatarUrl={profile?.avatar_url || formData.avatar_url}
                    username={profile?.username || formData.username}
                    isEditing={isEditing}
                    onAvatarUpdate={handleAvatarUpdate}
                    isOnline={isOnline}
                  />
                  
                  {profile?.username ? (
                    <div className="text-center">
                      <h2 className="text-xl font-semibold text-warcrow-gold">
                        {profile.username}
                      </h2>
                      <div className="mt-1 flex items-center justify-center text-sm">
                        <span className={`h-2 w-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        <span className="text-warcrow-text/70">{isOnline ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <Skeleton className="h-6 w-32 bg-warcrow-gold/10" />
                      <Skeleton className="h-4 w-20 mx-auto bg-warcrow-gold/10" />
                    </div>
                  )}
                  
                  {!isEditing && (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="bg-warcrow-gold text-black border-warcrow-gold hover:bg-warcrow-gold/80 hover:border-warcrow-gold/80 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="bg-black border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10 hover:border-warcrow-gold transition-colors"
                    onClick={() => setShowStats(!showStats)}
                  >
                    {showStats ? 'Hide Stats' : 'Show Stats'}
                  </Button>
                </motion.div>
                
                <div className="flex-1">
                  {profile?.wab_id && (
                    <motion.div 
                      className="mb-4 p-3 bg-gradient-to-r from-black/70 to-black/50 rounded-md border border-warcrow-gold/50 shadow-md"
                      variants={profileFadeIn}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-warcrow-gold font-semibold">Warcrow Army Builder ID:</span>
                        <Button 
                          onClick={copyWabIdToClipboard}
                          variant="outline"
                          size="sm"
                          className="h-7 bg-warcrow-gold/20 border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/30"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="text-warcrow-gold font-mono text-lg tracking-wide mt-1">{profile.wab_id}</div>
                      <div className="text-xs text-warcrow-gold/70 mt-1">Use this ID to link your army lists</div>
                    </motion.div>
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
                  
                  {!isEditing && profile && (
                    <motion.div
                      className="mt-4"
                      variants={profileFadeIn}
                    >
                      <ProfileCompletionIndicator profile={profile} />
                    </motion.div>
                  )}
                </div>
              </div>

              <motion.div 
                className="pt-4 border-t border-warcrow-gold/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-warcrow-gold/80 font-medium mb-2">Game Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-black/30 p-3 rounded-md border border-warcrow-gold/10">
                    <div className="text-2xl font-bold text-warcrow-gold">{profile.games_won}</div>
                    <div className="text-xs text-warcrow-text/70">Games Won</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-md border border-warcrow-gold/10">
                    <div className="text-2xl font-bold text-warcrow-text/80">{profile.games_lost}</div>
                    <div className="text-xs text-warcrow-text/70">Games Lost</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-md border border-warcrow-gold/10">
                    <div className="text-2xl font-bold text-green-500">
                      {profile.games_won + profile.games_lost > 0 
                        ? Math.round((profile.games_won / (profile.games_won + profile.games_lost)) * 100) 
                        : 0}%
                    </div>
                    <div className="text-xs text-warcrow-text/70">Win Rate</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-md border border-warcrow-gold/10">
                    <div className="text-2xl font-bold text-blue-400">{profile.games_won + profile.games_lost}</div>
                    <div className="text-xs text-warcrow-text/70">Total Games</div>
                  </div>
                </div>
              </motion.div>

              <ProfileTabs onListSelect={handleListSelect} />
            </motion.div>
          </div>
          
          <motion.div 
            className="space-y-4 flex flex-col"
            variants={profileFadeIn}
          >
            {profile?.id && (
              <>
                <div className="flex-shrink">
                  <FriendsSection userId={profile.id} isCompact={true} />
                </div>
                <div className="flex-1">
                  <FriendActivityFeed userId={profile.id} />
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
