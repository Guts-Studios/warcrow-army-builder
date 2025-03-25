
import { useFriends } from "@/hooks/useFriends";
import { FriendRequestsSection } from "./FriendRequestsSection";
import { FriendsListSection } from "./FriendsListSection";
import { UserSearch } from "./UserSearch";
import { OutgoingRequestsSection } from "./OutgoingRequestsSection";

interface FriendsSectionProps {
  userId: string;
}

export const FriendsSection = ({ userId }: FriendsSectionProps) => {
  const {
    friends,
    isLoading,
    incomingRequests,
    outgoingRequests,
    handleAcceptRequest,
    handleRejectRequest,
    handleRemoveFriend,
    handleCancelRequest
  } = useFriends(userId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-warcrow-gold">Friends</h2>
        <UserSearch currentUserId={userId} />
      </div>

      {incomingRequests.length > 0 && (
        <FriendRequestsSection
          requests={incomingRequests}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      )}

      {outgoingRequests.length > 0 && (
        <OutgoingRequestsSection
          requests={outgoingRequests}
          onCancel={handleCancelRequest}
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
