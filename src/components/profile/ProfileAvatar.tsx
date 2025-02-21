
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  username: string | null;
  isEditing: boolean;
  onAvatarUpdate: (url: string) => void;
}

export const ProfileAvatar = ({ 
  avatarUrl, 
  username, 
  isEditing, 
  onAvatarUpdate 
}: ProfileAvatarProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("You must be logged in to upload an avatar");
      return;
    }

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      onAvatarUpdate(publicUrl);
      toast.success("Avatar uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload avatar: " + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="bg-warcrow-gold text-black text-xl">
          {username?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      {isEditing && (
        <label 
          htmlFor="avatar-upload" 
          className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-warcrow-gold animate-spin" />
          ) : (
            <Upload className="h-6 w-6 text-warcrow-gold" />
          )}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
};
