import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SavedList } from "@/types/army";
import { useNavigate } from "react-router-dom";

export interface ProfileFormData {
  username: string | null;
  bio: string | null;
  location: string | null;
  favorite_faction: string | null;
  social_discord: string | null;
  social_twitter: string | null;
  avatar_url: string | null;
  wab_id?: string | null;
}

interface ProfileContextType {
  profile: any;
  formData: ProfileFormData;
  isEditing: boolean;
  isLoading: boolean;
  updateProfile: any;
  setIsEditing: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleAvatarUpdate: (url: string) => void;
  handleListSelect: (list: SavedList) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileDataProvider");
  }
  return context;
};

export const ProfileDataProvider = ({ children }: { children: ReactNode }) => {
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

  const isPreview = window.location.hostname === 'lovableproject.com' || 
                  window.location.hostname.endsWith('.lovableproject.com');

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      console.log("Fetching profile data");
      
      if (isPreview) {
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
    enabled: !isPreview,
  });

  const updateProfile = useMutation({
    mutationFn: async (updateData: ProfileFormData) => {
      if (isPreview) {
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
    if (isPreview) {
      setFormData({
        username: "Preview User",
        bio: "This is a preview account",
        location: "Preview Land",
        favorite_faction: "Hegemony of Embersig",
        social_discord: "preview#1234",
        social_twitter: "@previewUser",
        avatar_url: "/art/portrait/nuada_portrait.jpg",
        wab_id: "WAB-PREV-MODE-DEMO"
      });
    } else if (profile) {
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
  }, [profile, isPreview]);

  useEffect(() => {
    if (isError && error) {
      console.error("Profile loading error:", error);
      toast.error("Failed to load profile: " + (error as Error).message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (profile?.id && !isPreview) {
      const notificationsChannel = supabase
        .channel('notifications-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `recipient_id=eq.${profile.id}`
          },
          (payload) => {
            console.log('New notification received:', payload);
          }
        )
        .subscribe();

      const friendshipsChannel = supabase
        .channel('friendships-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'friendships',
            filter: `or(sender_id.eq.${profile.id},recipient_id.eq.${profile.id})`
          },
          (payload) => {
            console.log('Friendship change:', payload);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(notificationsChannel);
        supabase.removeChannel(friendshipsChannel);
      };
    }
  }, [profile?.id, isPreview]);

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

  const value = {
    profile: isPreview ? {
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
    } : profile,
    formData,
    isEditing,
    isLoading: !isPreview && isLoading,
    updateProfile,
    setIsEditing,
    handleInputChange,
    handleSubmit,
    handleAvatarUpdate,
    handleListSelect
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
