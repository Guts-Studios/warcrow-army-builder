
import * as React from "react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";

interface ProfileFormData {
  username: string | null;
  bio: string | null;
  location: string | null;
  favorite_faction: string | null;
  social_discord: string | null;
  social_twitter: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    bio: "",
    location: "",
    favorite_faction: "",
    social_discord: "",
    social_twitter: "",
    avatar_url: "",
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updateData: ProfileFormData) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Failed to update profile: " + error.message);
    },
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        favorite_faction: profile.favorite_faction || "",
        social_discord: profile.social_discord || "",
        social_twitter: profile.social_twitter || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  const handleAvatarUpdate = (url: string) => {
    const updatedData = { ...formData, avatar_url: url };
    updateProfile.mutate(updatedData);
    setFormData(updatedData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold" />
      </div>
    );
  }

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
            <div className="text-sm text-warcrow-gold/60">
              <p>Games Won: {profile?.games_won || 0}</p>
              <p>Games Lost: {profile?.games_lost || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
