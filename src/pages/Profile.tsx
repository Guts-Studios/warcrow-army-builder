import * as React from "react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ArmyListsSection } from "@/components/profile/ArmyListsSection";
import { SavedList } from "@/types/army";
import { useNavigate } from "react-router-dom";

interface ProfileFormData {
  username: string | null;
  bio: string | null;
  location: string | null;
  favorite_faction: string | null;
  social_discord: string | null;
  social_twitter: string | null;
  avatar_url: string | null;
  wab_id?: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
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
    wab_id: "",
  });

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("Fetching profile data");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found");
        throw new Error("Not authenticated");
      }

      console.log("User ID:", session.user.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Profile data:", data);
      return data;
    },
    retry: 1,
  });

  const updateProfile = useMutation({
    mutationFn: async (updateData: ProfileFormData) => {
      console.log("Updating profile with data:", updateData);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found during update");
        throw new Error("Not authenticated");
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", session.user.id);

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
      console.log("Profile update successful");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Update profile error:", error);
      toast.error("Failed to update profile: " + error.message);
    },
  });

  useEffect(() => {
    if (profile) {
      console.log("Setting form data from profile:", profile);
      setFormData({
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        favorite_faction: profile.favorite_faction || "",
        social_discord: profile.social_discord || "",
        social_twitter: profile.social_twitter || "",
        avatar_url: profile.avatar_url || "",
        wab_id: profile.wab_id || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (isError && error) {
      console.error("Profile loading error:", error);
      toast.error("Failed to load profile: " + (error as Error).message);
    }
  }, [isError, error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting profile update:", formData);
    updateProfile.mutate(formData);
  };

  const handleAvatarUpdate = (url: string) => {
    console.log("Updating avatar URL:", url);
    const updatedData = { ...formData, avatar_url: url };
    updateProfile.mutate(updatedData);
    setFormData(updatedData);
  };

  const handleListSelect = (list: SavedList) => {
    navigate('/builder', { state: { selectedFaction: list.faction, loadList: list } });
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

export default Profile;
