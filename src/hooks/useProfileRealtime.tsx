
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useProfileRealtime = (profileId: string | undefined, isPreview: boolean) => {
  useEffect(() => {
    if (profileId && !isPreview) {
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
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(notificationsChannel);
        supabase.removeChannel(friendshipsChannel);
      };
    }
  }, [profileId, isPreview]);
};
