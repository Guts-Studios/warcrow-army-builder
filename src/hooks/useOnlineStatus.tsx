import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileSession } from "@/hooks/useProfileSession";

export type OnlineStatus = {
  [userId: string]: boolean;
};

export const useOnlineStatus = (userIds: string[]) => {
  const [onlineStatus, setOnlineStatus] = useState<OnlineStatus>({});
  const { userId } = useProfileSession();
  const currentUserId = userId;
  
  // Track current user's online status
  useEffect(() => {
    if (!currentUserId || currentUserId === "preview-user-id") return;
    
    // Create a channel for user presence
    const channel = supabase.channel('online-users');
    
    // Function to update presence
    const updatePresence = async () => {
      await channel.track({
        user_id: currentUserId,
        online_at: new Date().toISOString(),
      });
    };
    
    // Subscribe to the channel
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        // Initially set the user's status when subscribed
        await updatePresence();
        
        // Update presence every 30 seconds while tab is active
        const interval = setInterval(updatePresence, 30000);
        
        // Handle visibility changes (tab switching)
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            updatePresence();
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
          clearInterval(interval);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      }
    });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);
  
  // Listen for online status of all requested userIds
  useEffect(() => {
    if (userIds.length === 0) return;
    
    // Filter out invalid IDs
    const validUserIds = userIds.filter(id => id && id !== "preview-user-id");
    if (validUserIds.length === 0) return;
    
    console.log("Monitoring online status for users:", validUserIds);
    
    const channel = supabase.channel('online-users');
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        console.log("Presence state updated:", presenceState);
        
        // Create a new status object based on presence data
        const newStatus: OnlineStatus = {};
        
        // Loop through all user IDs we're monitoring
        validUserIds.forEach(userId => {
          // Check if this user is in the presence state
          const userPresence = Object.entries(presenceState).find(([key]) => {
            return key.includes(userId);
          });
          
          // If user is in presence state, mark as online
          newStatus[userId] = Boolean(userPresence);
        });
        
        setOnlineStatus(newStatus);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        const userId = newPresences[0]?.user_id;
        
        if (userId && validUserIds.includes(userId)) {
          setOnlineStatus(prev => ({
            ...prev,
            [userId]: true
          }));
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        const userId = leftPresences[0]?.user_id;
        
        if (userId && validUserIds.includes(userId)) {
          setOnlineStatus(prev => ({
            ...prev,
            [userId]: false
          }));
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userIds]);
  
  return { onlineStatus };
};
