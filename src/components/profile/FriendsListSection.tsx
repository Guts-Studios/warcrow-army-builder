
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FriendItem } from "./FriendItem";
import { Friend } from "@/hooks/useFriends";

interface FriendsListSectionProps {
  friends: Friend[];
  isLoading: boolean;
  onRemove: (friendshipId: string) => Promise<void>;
}

export const FriendsListSection = ({
  friends,
  isLoading,
  onRemove
}: FriendsListSectionProps) => {
  return (
    <Card className="bg-black/50 border-warcrow-gold/20">
      <CardHeader>
        <CardTitle className="text-warcrow-gold">My Friends</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-warcrow-text/60 text-center">Loading friends...</p>
        ) : friends.length > 0 ? (
          friends.map((friend) => (
            <FriendItem
              key={friend.friendship_id}
              username={friend.username}
              wab_id={friend.wab_id}
              avatar_url={friend.avatar_url}
              friendship_id={friend.friendship_id}
              onRemove={onRemove}
            />
          ))
        ) : (
          <p className="text-warcrow-text/60 text-center">No friends added yet.</p>
        )}
      </CardContent>
    </Card>
  );
};
