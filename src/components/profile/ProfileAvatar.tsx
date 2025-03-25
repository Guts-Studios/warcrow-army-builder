
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

const PORTRAIT_OPTIONS = [
  "/art/portrait/namaoin_portrait.jpg",
  "/art/portrait/nayra_caladren_portrait.jpg",
  "/art/portrait/naergon_caladren_portrait.jpg",
  "/art/portrait/dragoslav_portrait.jpg",
  "/art/portrait/amelia_hellbroth_portrait.jpg",
  "/art/portrait/aide_portrait.jpg",
  "/art/portrait/nuada_portrait.jpg"
];

interface ProfileAvatarProps {
  avatarUrl: string | null;
  username: string | null;
  isEditing: boolean;
  onAvatarUpdate: (url: string) => void;
  size?: "default" | "sm" | "lg";
}

export const ProfileAvatar = ({
  avatarUrl,
  username,
  isEditing,
  onAvatarUpdate,
  size = "default"
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/90 border-warcrow-gold text-warcrow-text">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Choose an Avatar</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            {PORTRAIT_OPTIONS.map((portrait) => (
              <div
                key={portrait}
                className={`cursor-pointer rounded-md overflow-hidden border-2 hover:border-warcrow-gold transition-all ${
                  avatarUrl === portrait ? "border-warcrow-gold" : "border-transparent"
                }`}
                onClick={() => {
                  onAvatarUpdate(portrait);
                  setIsDialogOpen(false);
                }}
              >
                <img src={portrait} alt="Avatar option" className="w-full h-auto aspect-square object-cover" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
