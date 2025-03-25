
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { PortraitSelector } from "./PortraitSelector";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  username: string | null;
  isEditing: boolean;
  onAvatarUpdate: (url: string) => void;
  size?: "default" | "sm" | "lg";
  isOnline?: boolean;
}

export const ProfileAvatar = ({
  avatarUrl,
  username,
  isEditing,
  onAvatarUpdate,
  size = "default",
  isOnline
}: ProfileAvatarProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const getSize = () => {
    switch (size) {
      case "sm": return "h-10 w-10";
      case "lg": return "h-24 w-24";
      default: return "h-16 w-16";
    }
  };
  
  const getInitials = (name: string | null) => {
    if (!name) return "?";
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  };

  return (
    <div className="relative">
      <Avatar className={`${getSize()} border-2 border-warcrow-gold`}>
        <AvatarImage src={avatarUrl || undefined} alt={username || "User"} />
        <AvatarFallback className="bg-warcrow-gold/20 text-warcrow-gold">
          {getInitials(username)}
        </AvatarFallback>
      </Avatar>
      
      {isOnline !== undefined && (
        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
      )}
      
      {isEditing && (
        <Button
          size="icon"
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-warcrow-gold bg-black hover:bg-black"
        >
          <PencilIcon className="h-3 w-3 text-warcrow-gold" />
        </Button>
      )}
      
      <PortraitSelector 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSelectPortrait={onAvatarUpdate}
      />
    </div>
  );
};
