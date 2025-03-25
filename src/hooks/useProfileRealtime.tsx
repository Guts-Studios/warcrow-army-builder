
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useProfileRealtime = (profileId: string | null, isPreview: boolean) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!profileId || isPreview) {
      // Don't set up real-time connections for preview mode or when no profile ID is available
      return;
    }

    console.log("Setting up realtime subscriptions for profile:", profileId);
    
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
          // Invalidate friends query to refresh data
          queryClient.invalidateQueries({ queryKey: ["friends"] });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscriptions");
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(friendshipsChannel);
    };
  }, [profileId, isPreview, queryClient]);
};
