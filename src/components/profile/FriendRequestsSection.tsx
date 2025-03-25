
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FriendRequestItem } from "./FriendRequestItem";
import { Friend } from "@/hooks/useFriends";

interface FriendRequestsSectionProps {
  requests: Friend[];
  onAccept: (friendshipId: string, senderId: string) => Promise<void>;
  onReject: (friendshipId: string) => Promise<void>;
}

export const FriendRequestsSection = ({
  requests,
  onAccept,
  onReject
}: FriendRequestsSectionProps) => {
  if (requests.length === 0) {
    return null;
  }

  return (
    <Card className="bg-black/50 border-warcrow-gold/20">
      <CardHeader>
        <CardTitle className="text-warcrow-gold">Friend Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.map((request) => (
          <FriendRequestItem
            key={request.friendship_id}
            id={request.id}
            username={request.username}
            wab_id={request.wab_id}
            avatar_url={request.avatar_url}
            friendship_id={request.friendship_id}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))}
      </CardContent>
    </Card>
  );
};
