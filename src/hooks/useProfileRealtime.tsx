
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProfileRealtime = (profileId: string | null, isPreview: boolean) => {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!profileId || isPreview) {
      // Don't set up real-time connections for preview mode or when no profile ID is available
      return;
    }

    console.log("Setting up realtime subscriptions for profile:", profileId);
    setIsInitialized(true);
    
    const notificationsChannel = supabase
      .channel('notifications-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${profileId}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          
          // Show a toast notification for the new notification
          const notificationType = payload.new?.type;
          const senderName = payload.new?.content?.sender_name || "Someone";
          
          switch (notificationType) {
            case 'friend_request':
              toast.info("New Friend Request", {
                description: `${senderName} sent you a friend request`,
                position: "top-right",
                duration: 5000
              });
              break;
            case 'friend_accepted':
              toast.success("Friend Request Accepted", {
                description: `${senderName} accepted your friend request`,
                position: "top-right",
                duration: 5000
              });
              break;
            case 'direct_message':
              toast.info("New Message", {
                description: `${senderName} sent you a message`,
                position: "top-right",
                duration: 5000
              });
              break;
            default:
              toast.info("New Notification", {
                description: `You have a new notification`,
                position: "top-right",
                duration: 5000
              });
          }
          
          // Invalidate notifications query to refresh data
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      )
      .subscribe();

    const friendshipsChannel = supabase
      .channel('friendships-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: `or(sender_id.eq.${profileId},recipient_id.eq.${profileId})`
        },
        (payload) => {
          console.log('Friendship change:', payload);
          
          // Show toast notifications for friendship changes
          if (payload.eventType === 'INSERT' && payload.new?.recipient_id === profileId) {
            toast.info("New Friend Request", {
              description: "You have a new friend request",
              position: "top-right"
            });
          } else if (payload.eventType === 'UPDATE' && payload.new?.status === 'accepted') {
            if (payload.new?.sender_id === profileId) {
              toast.success("Friend Request Accepted", {
                description: "Your friend request was accepted",
                position: "top-right"
              });
            }
          }
          
          // Invalidate friends query to refresh data
          queryClient.invalidateQueries({ queryKey: ["friends"] });
        }
      )
      .subscribe();
      
    const messagesChannel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `recipient_id=eq.${profileId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          
          // Show toast notification for new messages
          toast("New Message", {
            description: "You have received a new message",
            position: "top-right",
            duration: 5000,
            action: {
              label: "View",
              onClick: () => {
                // We could navigate to the messages view here
                // but we would need access to the router
                queryClient.invalidateQueries({ queryKey: ["messages"] });
              }
            }
          });
          
          // Invalidate any messages queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["messages"] });
          // Also invalidate notifications since we create a notification for new messages
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscriptions");
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(friendshipsChannel);
      supabase.removeChannel(messagesChannel);
      setIsInitialized(false);
    };
  }, [profileId, isPreview, queryClient]);

  return { isInitialized };
};
