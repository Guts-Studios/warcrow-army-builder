
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ProfileFormData, Profile } from "@/types/profile";
import { SavedList } from "@/types/army";

export const useProfileData = () => {
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

  // Check if we're running in preview mode
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                  window.location.hostname.endsWith('.lovableproject.com');

  // Get the session to check if user is authenticated
  const { data: sessionData, error: sessionError } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    },
    retry: 1,
  });

  // Determine if we're authenticated and if we should use preview data
  const isAuthenticated = !!sessionData?.session?.user;
  const usePreviewData = isPreview && !isAuthenticated;

  console.log("Auth status:", { isPreview, isAuthenticated, usePreviewData });

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("Fetching profile data");
      
      if (usePreviewData) {
        console.log("Using preview mode profile data");
        return {
          id: "preview-user-id",
          username: "Preview User",
          bio: "This is a preview account",
          location: "Preview Land",
          favorite_faction: "Hegemony of Embersig",
          social_discord: "preview#1234",
          social_twitter: "@previewUser",
          avatar_url: "/art/portrait/nuada_portrait.jpg",
          wab_id: "WAB-PREV-MODE-DEMO",
          games_won: 5,
          games_lost: 2
        };
      }
      
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
    enabled: usePreviewData || isAuthenticated,
  });

  const updateProfile = useMutation({
    mutationFn: async (updateData: ProfileFormData) => {
      if (usePreviewData) {
        console.log("Update skipped in preview mode");
        return;
      }
      
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
      toast.error("Failed to update profile: " + (error as Error).message);
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

  return {
    profile,
    formData,
    isEditing,
    isLoading: isLoading && !usePreviewData,
    updateProfile,
    setIsEditing,
    handleInputChange,
    handleSubmit,
    handleAvatarUpdate,
    handleListSelect
  };
};
