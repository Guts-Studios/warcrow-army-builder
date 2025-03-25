
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";
import { UserMinus } from "lucide-react";

interface FriendItemProps {
  username: string | null;
  wab_id: string;
  avatar_url: string | null;
  friendship_id: string;
  onRemove: (friendshipId: string) => Promise<void>;
}

export const FriendItem = ({
  username,
  wab_id,
  avatar_url,
  friendship_id,
  onRemove
}: FriendItemProps) => {
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
        onClick={() => onRemove(friendship_id)}
        size="sm"
        variant="outline"
        className="border-warcrow-gold/60 text-warcrow-gold/60 hover:bg-black hover:text-red-500 hover:border-red-500"
      >
        <UserMinus className="h-4 w-4 mr-1" />
        Remove
      </Button>
    </div>
  );
};
