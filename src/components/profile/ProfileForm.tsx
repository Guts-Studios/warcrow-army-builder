
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";

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

      <div className="space-y-2">
        <Label htmlFor="social_discord" className="text-warcrow-gold">Discord</Label>
        <Input
          id="social_discord"
          name="social_discord"
          value={formData.social_discord || ""}
          onChange={onInputChange}
          disabled={!isEditing}
          className={`bg-black/50 ${!isEditing ? "text-warcrow-gold opacity-100" : "text-white"}`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="social_twitter" className="text-warcrow-gold">Twitter</Label>
        <Input
          id="social_twitter"
          name="social_twitter"
          value={formData.social_twitter || ""}
          onChange={onInputChange}
          disabled={!isEditing}
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
