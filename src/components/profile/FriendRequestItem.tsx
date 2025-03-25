
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";

interface FriendRequestItemProps {
  id: string;
  username: string | null;
  wab_id: string;
  avatar_url: string | null;
  friendship_id: string;
  onAccept: (friendshipId: string, senderId: string) => Promise<void>;
  onReject: (friendshipId: string) => Promise<void>;
}

export const FriendRequestItem = ({
  id,
  username,
  wab_id,
  avatar_url,
  friendship_id,
  onAccept,
  onReject
}: FriendRequestItemProps) => {
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
      <div className="flex gap-2">
        <Button 
          onClick={() => onAccept(friendship_id, id)}
          size="sm"
          className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
        >
          Accept
        </Button>
        <Button 
          onClick={() => onReject(friendship_id)}
          size="sm"
          variant="outline"
          className="border-warcrow-gold/60 text-warcrow-gold/60 hover:bg-black hover:text-warcrow-gold"
        >
          Reject
        </Button>
      </div>
    </div>
  );
};
