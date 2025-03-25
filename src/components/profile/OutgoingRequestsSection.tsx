
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OutgoingRequestItem } from "./OutgoingRequestItem";
import { Friend } from "@/hooks/useFriends";

interface OutgoingRequestsSectionProps {
  requests: Friend[];
  onCancel: (friendshipId: string) => Promise<void>;
}

export const OutgoingRequestsSection = ({
  requests,
  onCancel
}: OutgoingRequestsSectionProps) => {
  if (requests.length === 0) {
    return null;
  }

  return (
    <Card className="bg-black/50 border-warcrow-gold/20">
      <CardHeader>
        <CardTitle className="text-warcrow-gold">Outgoing Friend Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.map((request) => (
          <OutgoingRequestItem
            key={request.friendship_id}
            username={request.username}
            wab_id={request.wab_id}
            avatar_url={request.avatar_url}
            friendship_id={request.friendship_id}
            onCancel={onCancel}
          />
        ))}
      </CardContent>
    </Card>
  );
};
