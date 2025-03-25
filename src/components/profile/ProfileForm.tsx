import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, MessageSquare, Twitter, Instagram, Youtube, Twitch } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

interface ProfileFormData {
  username: string | null;
  bio: string | null;
  location: string | null;
  favorite_faction: string | null;
  social_discord: string | null;
  social_twitter: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  social_twitch: string | null;
  avatar_url: string | null;
  wab_id?: string | null;
}

interface ProfileFormProps {
  formData: ProfileFormData;
  isEditing: boolean;
  isPending: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const ProfileForm = ({
  formData,
  isEditing,
  isPending,
  onInputChange,
  onSubmit,
  onCancel
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-warcrow-gold flex items-center gap-1">
          Username
          {isEditing && <span className="text-xs text-warcrow-gold/70 ml-1">(must be unique)</span>}
        </Label>
        <Input
          id="username"
          name="username"
          value={formData.username || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          className={`bg-black/50 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
          placeholder={isEditing ? "Enter a unique username" : ""}
        />
        {isEditing && (
          <p className="text-xs flex items-center gap-1 text-warcrow-gold/70">
            <AlertCircle className="h-3 w-3" />
            Usernames must be unique across all users
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-warcrow-gold">Bio</Label>
        <Input
          id="bio"
          name="bio"
          value={formData.bio || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          className={`bg-black/50 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-warcrow-gold">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          className={`bg-black/50 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="favorite_faction" className="text-warcrow-gold">Favorite Faction</Label>
        <Input
          id="favorite_faction"
          name="favorite_faction"
          value={formData.favorite_faction || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          className={`bg-black/50 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>

      <Separator className="my-4 bg-warcrow-gold/20" />
      
      <div className="mb-2">
        <h3 className="text-warcrow-gold text-lg">Social Media Links</h3>
        <p className="text-xs text-warcrow-gold/70">Connect your profile to other platforms</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="social_discord" className="text-warcrow-gold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" /> Discord
        </Label>
        <Input
          id="social_discord"
          name="social_discord"
          value={formData.social_discord || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          placeholder={isEditing ? "e.g. username#1234" : ""}
          className={`bg-black/50 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="social_twitter" className="text-warcrow-gold flex items-center gap-2">
          <Twitter className="h-4 w-4" /> Twitter
        </Label>
        <Input
          id="social_twitter"
          name="social_twitter"
          value={formData.social_twitter || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          placeholder={isEditing ? "e.g. @username" : ""}
          className={`bg-black/50 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="social_instagram" className="text-warcrow-gold flex items-center gap-2">
          <Instagram className="h-4 w-4" /> Instagram
        </Label>
        <Input
          id="social_instagram"
          name="social_instagram"
          value={formData.social_instagram || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          placeholder={isEditing ? "e.g. @username" : ""}
          className={`bg-black/50 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="social_youtube" className="text-warcrow-gold flex items-center gap-2">
          <Youtube className="h-4 w-4" /> YouTube
        </Label>
        <Input
          id="social_youtube"
          name="social_youtube"
          value={formData.social_youtube || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          placeholder={isEditing ? "e.g. @channel or channel URL" : ""}
          className={`bg-black/50 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="social_twitch" className="text-warcrow-gold flex items-center gap-2">
          <Twitch className="h-4 w-4" /> Twitch
        </Label>
        <Input
          id="social_twitch"
          name="social_twitch"
          value={formData.social_twitch || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          placeholder={isEditing ? "e.g. username" : ""}
          className={`bg-black/50 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>

      {isEditing && (
        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
          >
            {isPending ? (
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
  );
};
