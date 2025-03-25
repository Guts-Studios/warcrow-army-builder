
import { useState, useEffect } from "react";
import { ProfileFormData } from "@/types/profile";
import { toast } from "sonner";
import { useProfileSession } from "./useProfileSession";
import { useProfileFetch } from "./useProfileFetch";
import { useProfileUpdate } from "./useProfileUpdate";
import { useProfileNavigation } from "./useProfileNavigation";
import { ensureWabId } from "@/utils/wabIdUtils";

export const useProfileData = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    bio: "",
    location: "",
    favorite_faction: "",
    social_discord: "",
    social_twitter: "",
    social_instagram: "",
    social_youtube: "",
    social_twitch: "",
    avatar_url: "",
    wab_id: "",
  });

  // Get session information with session checked status
  const { isAuthenticated, usePreviewData, userId, sessionChecked } = useProfileSession();

  // Fetch profile data, only when session is checked
  const { profile, isLoading, isError, error, refetch } = useProfileFetch({
    isAuthenticated,
    usePreviewData,
    userId,
    sessionChecked
  });

  // Profile update hooks
  const { updateProfile } = useProfileUpdate({
    usePreviewData,
    profile,
    onSuccess: () => setIsEditing(false)
  });

  // Navigation hooks
  const { handleListSelect } = useProfileNavigation();

  // Check and generate WAB ID if needed
  useEffect(() => {
    const checkWabId = async () => {
      if (profile && !profile.wab_id && userId && !usePreviewData) {
        console.log("Profile missing WAB ID, generating one...");
        const newWabId = await ensureWabId(userId);
        
        if (newWabId) {
          // Refetch profile to get the updated WAB ID
          console.log("WAB ID generated, refetching profile");
          refetch();
        }
      }
    };
    
    checkWabId();
  }, [profile, userId, usePreviewData, refetch]);

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
        social_instagram: profile.social_instagram || "",
        social_youtube: profile.social_youtube || "",
        social_twitch: profile.social_twitch || "",
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

  return {
    profile,
    formData,
    isEditing,
    isLoading: (isLoading && !usePreviewData) || (!sessionChecked && !usePreviewData),
    error: isError ? error as Error : null,
    updateProfile,
    setIsEditing,
    handleInputChange,
    handleSubmit,
    handleAvatarUpdate,
    handleListSelect
  };
};
