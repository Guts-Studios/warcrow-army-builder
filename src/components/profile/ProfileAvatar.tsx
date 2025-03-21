
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PortraitSelector } from "./PortraitSelector";

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
  const [isPortraitDialogOpen, setIsPortraitDialogOpen] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload an image file (JPEG, PNG, GIF, or WEBP)");
      return;
    }

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

  const handleSelectPortrait = (url: string) => {
    onAvatarUpdate(url);
    toast.success("Portrait selected as avatar");
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
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2">
          <label 
            htmlFor="avatar-upload" 
            className="cursor-pointer"
          >
            <Button 
              variant="outline" 
              size="sm"
              className="bg-blue-500 border-blue-600 text-white hover:bg-blue-600 hover:border-blue-700 hover:text-white"
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-1" />
              )}
              Upload
            </Button>
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={isUploading}
            />
          </label>
          
          <Button 
            variant="outline" 
            size="sm"
            className="bg-purple-500 border-purple-600 text-white hover:bg-purple-600 hover:border-purple-700 hover:text-white"
            onClick={() => setIsPortraitDialogOpen(true)}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            Portraits
          </Button>
        </div>
      )}
      
      <PortraitSelector 
        open={isPortraitDialogOpen}
        onOpenChange={setIsPortraitDialogOpen}
        onSelectPortrait={handleSelectPortrait}
      />
    </div>
  );
};
