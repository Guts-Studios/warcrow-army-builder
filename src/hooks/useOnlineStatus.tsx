
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileSession } from "@/hooks/useProfileSession";
import { toast } from "sonner";

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
    
    console.log("Setting up presence tracking for current user:", currentUserId);
    
    // Create a channel for user presence
    const channel = supabase.channel('online-users');
    
    // Function to update presence
    const updatePresence = async () => {
      try {
        await channel.track({
          user_id: currentUserId,
          online_at: new Date().toISOString(),
        });
        console.log("Updated presence for user:", currentUserId);
      } catch (err) {
        console.error("Error updating presence:", err);
      }
    };
    
    // Subscribe to the channel
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        console.log("Subscribed to presence channel");
        
        // Initially set the user's status when subscribed
        await updatePresence();
        
        // Update presence every 15 seconds while tab is active (reduced from 30 seconds)
        const interval = setInterval(updatePresence, 15000);
        
        // Handle visibility changes (tab switching)
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            console.log("Document visible, updating presence");
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
      console.log("Cleaning up presence tracking");
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
          // Find this user in the presence state
          const userPresence = Object.entries(presenceState).find(([key]) => {
            return key === userId || key.includes(`online-users:${userId}`);
          });
          
          const isOnline = Boolean(userPresence);
          newStatus[userId] = isOnline;
          
          // Debug log for each user
          console.log(`User ${userId} online status:`, isOnline, 
                      isOnline ? "(Found in presence state)" : "(Not in presence state)");
        });
        
        setOnlineStatus(newStatus);
        
        // If current user is being tracked, show a toast when online status is established
        if (currentUserId && validUserIds.includes(currentUserId) && newStatus[currentUserId]) {
          toast.success("You're now online", { 
            id: "online-status",
            position: "bottom-right",
            duration: 2000
          });
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        if (!newPresences || newPresences.length === 0) return;
        
        const presenceUserId = newPresences[0]?.user_id;
        
        if (presenceUserId && validUserIds.includes(presenceUserId)) {
          console.log(`Setting ${presenceUserId} as online`);
          setOnlineStatus(prev => ({
            ...prev,
            [presenceUserId]: true
          }));
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        if (!leftPresences || leftPresences.length === 0) return;
        
        const presenceUserId = leftPresences[0]?.user_id;
        
        if (presenceUserId && validUserIds.includes(presenceUserId)) {
          console.log(`Setting ${presenceUserId} as offline`);
          setOnlineStatus(prev => ({
            ...prev,
            [presenceUserId]: false
          }));
        }
      })
      .subscribe();
    
    // If current user is in the list, ensure they show as online
    if (currentUserId && validUserIds.includes(currentUserId)) {
      setOnlineStatus(prev => ({
        ...prev,
        [currentUserId]: true
      }));
    }
    
    return () => {
      console.log("Removing presence channel");
      supabase.removeChannel(channel);
    };
  }, [userIds, currentUserId]);
  
  return { onlineStatus };
};
