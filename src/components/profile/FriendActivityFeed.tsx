import { useState, useEffect } from "react";
import { useFriendActivities, FriendActivity } from "@/hooks/useFriendActivities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { formatDistanceToNow } from "date-fns";
import { Loader2, User2, Shield, Plus, ListPlus, UserPlus, Heart, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { motion } from "framer-motion";
import { profileFadeIn, staggerChildren, cardHover } from "./animations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FriendActivityFeedProps {
  userId: string;
  isCompact?: boolean;
}

export const FriendActivityFeed = ({ userId, isCompact = false }: FriendActivityFeedProps) => {
  const { activities, isLoading, error } = useFriendActivities(userId);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const { onlineStatus } = useOnlineStatus(friendIds);
  const navigate = useNavigate();
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());
  
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
      navigate('/builder', { 
        state: { 
          viewSharedList: true, 
          listId: activity.activity_data.list_id 
        } 
      });
    }
  };
  
  const handleLike = (activityId: string) => {
    if (likedActivities.has(activityId)) {
      const newLiked = new Set(likedActivities);
      newLiked.delete(activityId);
      setLikedActivities(newLiked);
      toast.info("Like removed");
    } else {
      setLikedActivities(new Set(likedActivities).add(activityId));
      toast.success("Activity liked");
    }
  };
  
  const handleComment = (activity: FriendActivity) => {
    toast.info(`Commenting on ${activity.username}'s activity`, {
      description: "Comment functionality coming soon!",
      action: {
        label: "Notify me",
        onClick: () => toast.success("You'll be notified when this feature is available")
      }
    });
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
  
  const displayActivities = isCompact ? activities.slice(0, 5) : activities;
  const maxHeight = isCompact ? "max-h-[400px]" : "max-h-[600px]";

  return (
    <Card className="bg-black/50 border-warcrow-gold/20">
      <CardHeader className={isCompact ? "p-4" : ""}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-warcrow-gold">Friend Activity</CardTitle>
          {isCompact && activities.length > 5 && (
            <Button 
              variant="link" 
              className="text-warcrow-gold p-0 h-auto"
              onClick={() => navigate('/profile')}
            >
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className={isCompact ? "p-4 pt-0" : ""}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 text-warcrow-gold animate-spin" />
          </div>
        ) : displayActivities.length === 0 ? (
          <div className="text-center text-warcrow-text/60">
            No recent friend activity
            {userId === "preview-user-id" && (
              <div className="text-xs mt-2">
                (Friend activities are only available for logged-in users)
              </div>
            )}
          </div>
        ) : (
          <ScrollArea className={maxHeight}>
            <motion.div 
              className="space-y-4 pr-4"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              {displayActivities.map((activity) => (
                <motion.div 
                  key={activity.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    activity.activity_type === 'list_created' 
                      ? 'cursor-pointer hover:bg-warcrow-gold/10' 
                      : ''
                  }`}
                  onClick={() => activity.activity_type === 'list_created' ? handleListClick(activity) : null}
                  variants={profileFadeIn}
                  whileHover={activity.activity_type === 'list_created' ? "hover" : "initial"}
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
                    
                    <div className="flex items-center mt-2 space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-warcrow-text/60 hover:text-warcrow-gold hover:bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(activity.id);
                              }}
                            >
                              <Heart 
                                className={`h-4 w-4 mr-1 ${likedActivities.has(activity.id) ? 'fill-red-500 text-red-500' : ''}`} 
                              />
                              <span className="text-xs">Like</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="bg-black/90 border-warcrow-gold/30">
                            {likedActivities.has(activity.id) ? 'Unlike this activity' : 'Like this activity'}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2 text-warcrow-text/60 hover:text-warcrow-gold hover:bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleComment(activity);
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span className="text-xs">Comment</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="bg-black/90 border-warcrow-gold/30">
                            Comment on this activity
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    {activity.activity_type === 'list_created' && (
                      <div className="text-xs text-warcrow-gold/70 italic mt-1">
                        Click to view list
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
