
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";
import { X } from "lucide-react";

interface OutgoingRequestItemProps {
  username: string | null;
  wab_id: string;
  avatar_url: string | null;
  friendship_id: string;
  onCancel: (friendshipId: string) => Promise<void>;
}

export const OutgoingRequestItem = ({
  username,
  wab_id,
  avatar_url,
  friendship_id,
  onCancel
}: OutgoingRequestItemProps) => {
  return (
    <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg mb-2">
      <div className="flex items-center gap-3">
        <ProfileAvatar 
          avatarUrl={avatar_url} 
          username={username || wab_id}
          isEditing={false}
          onAvatarUpdate={() => {}}
          size="sm"
        />
        <div>
          <div className="font-medium">{username || "Anonymous User"}</div>
          <div className="text-sm text-warcrow-gold/60">{wab_id}</div>
        </div>
      </div>
      <Button 
        onClick={() => onCancel(friendship_id)}
        size="sm"
        variant="outline"
        className="border-warcrow-gold/60 text-warcrow-gold/60 hover:bg-black hover:text-red-500 hover:border-red-500"
      >
        <X className="h-4 w-4 mr-1" />
        Cancel
      </Button>
    </div>
  );
};
