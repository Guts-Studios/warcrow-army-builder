import * as React from "react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Loader2 } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      {/* Navigation Header */}
      <div className="bg-black/50 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <img 
                src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
                alt="Warcrow Logo" 
                className="h-16"
              />
              <h1 className="text-3xl font-bold text-warcrow-gold text-center md:text-left">Profile</h1>
            </div>
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
              onClick={() => navigate('/landing')}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto py-8 px-4">
        <div className="bg-black/50 rounded-lg p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.avatar_url || undefined} />
              <AvatarFallback className="bg-warcrow-gold text-black text-xl">
                {formData.username?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-warcrow-gold">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-black/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-warcrow-gold">Bio</Label>
              <Input
                id="bio"
                name="bio"
                value={formData.bio || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-black/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-warcrow-gold">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-black/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="favorite_faction" className="text-warcrow-gold">Favorite Faction</Label>
              <Input
                id="favorite_faction"
                name="favorite_faction"
                value={formData.favorite_faction || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-black/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_discord" className="text-warcrow-gold">Discord</Label>
              <Input
                id="social_discord"
                name="social_discord"
                value={formData.social_discord || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-black/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="social_twitter" className="text-warcrow-gold">Twitter</Label>
              <Input
                id="social_twitter"
                name="social_twitter"
                value={formData.social_twitter || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-black/50"
              />
            </div>

            {isEditing && (
              <div className="flex gap-4 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            )}
          </form>

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
