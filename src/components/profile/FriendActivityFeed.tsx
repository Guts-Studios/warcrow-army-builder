
import { useState, useEffect } from "react";
import { useFriendActivities, FriendActivity } from "@/hooks/useFriendActivities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { formatDistanceToNow } from "date-fns";
import { Loader2, User2, Shield, Plus, ListPlus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface FriendActivityFeedProps {
  userId: string;
}

export const FriendActivityFeed = ({ userId }: FriendActivityFeedProps) => {
  const { activities, isLoading, error } = useFriendActivities(userId);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const { onlineStatus } = useOnlineStatus(friendIds);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (activities.length > 0) {
      const uniqueFriendIds = [...new Set(activities.map(activity => activity.user_id))];
      setFriendIds(uniqueFriendIds);
    }
  }, [activities]);

  const getActivityIcon = (activity: FriendActivity) => {
    switch (activity.activity_type) {
      case 'list_created':
        return <ListPlus className="w-5 h-5 text-green-500" />;
      case 'friend_added':
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      default:
        return <Shield className="w-5 h-5 text-warcrow-gold" />;
    }
  };

  const getActivityMessage = (activity: FriendActivity) => {
    switch (activity.activity_type) {
      case 'list_created':
        return (
          <span>
            created a new <span className="font-semibold">{activity.activity_data.faction}</span> list: 
            <span className="font-medium italic ml-1">"{activity.activity_data.list_name}"</span>
          </span>
        );
      case 'friend_added':
        return "added a new friend";
      default:
        return "performed an activity";
    }
  };

  const handleListClick = (activity: FriendActivity) => {
    if (activity.activity_type === 'list_created' && activity.activity_data.list_id) {
      // Navigate to the list view in the builder
      navigate('/builder', { 
        state: { 
          viewSharedList: true, 
          listId: activity.activity_data.list_id 
        } 
      });
    }
  };

  if (error) {
    console.error("Error loading friend activities:", error);
    return (
      <Card className="bg-black/50 border-warcrow-gold/20">
        <CardHeader>
          <CardTitle className="text-warcrow-gold">Friend Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-warcrow-text/60">
            Unable to load friend activities
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50 border-warcrow-gold/20">
      <CardHeader>
        <CardTitle className="text-warcrow-gold">Friend Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 text-warcrow-gold animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-warcrow-text/60">
            No recent friend activity
            {userId === "preview-user-id" && (
              <div className="text-xs mt-2">
                (Friend activities are only available for logged-in users)
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  activity.activity_type === 'list_created' 
                    ? 'cursor-pointer hover:bg-warcrow-gold/10' 
                    : ''
                }`}
                onClick={() => activity.activity_type === 'list_created' ? handleListClick(activity) : null}
              >
                <div className="flex-shrink-0">
                  <ProfileAvatar
                    avatarUrl={activity.avatar_url}
                    username={activity.username || "User"}
                    isEditing={false}
                    onAvatarUpdate={() => {}}
                    size="sm"
                    isOnline={onlineStatus[activity.user_id]}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-warcrow-gold">
                        {activity.username || "Unknown User"}
                      </span>
                      {onlineStatus[activity.user_id] && (
                        <span className="text-xs text-green-500">(online)</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-warcrow-text/60 text-xs">
                      {getActivityIcon(activity)}
                      <span>
                        {activity.created_at
                          ? formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })
                          : "recently"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-warcrow-text/90">
                    {getActivityMessage(activity)}
                  </p>
                  {activity.activity_type === 'list_created' && (
                    <div className="text-xs text-warcrow-gold/70 italic mt-1">
                      Click to view list
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
