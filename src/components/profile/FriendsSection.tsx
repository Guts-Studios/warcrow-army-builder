
import { useFriends } from "@/hooks/useFriends";
import { FriendRequestsSection } from "./FriendRequestsSection";
import { FriendsListSection } from "./FriendsListSection";

interface FriendsSectionProps {
  userId: string;
}

export const FriendsSection = ({ userId }: FriendsSectionProps) => {
  const {
    friends,
    isLoading,
    incomingRequests,
    handleAcceptRequest,
    handleRejectRequest,
    handleRemoveFriend
  } = useFriends(userId);

  return (
    <div className="space-y-6">
      {incomingRequests.length > 0 && (
        <FriendRequestsSection
          requests={incomingRequests}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      )}

      <FriendsListSection
        friends={friends}
        isLoading={isLoading}
        onRemove={handleRemoveFriend}
      />
    </div>
  );
};
