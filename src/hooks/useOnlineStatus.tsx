
import { useEffect, useState, useCallback } from "react";
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
  
  // Function to update presence - defined outside useEffect to use in multiple places
  const updatePresence = useCallback(async (channel: any, userId: string) => {
    if (!userId || userId === "preview-user-id") return;
    
    try {
      await channel.track({
        user_id: userId,
        online_at: new Date().toISOString(),
      });
      console.log("Updated presence for user:", userId);
      
      // Update local state to reflect that current user is online
      setOnlineStatus(prev => ({
        ...prev,
        [userId]: true
      }));
    } catch (err) {
      console.error("Error updating presence:", err);
    }
  }, []);
  
  // Track current user's online status
  useEffect(() => {
    if (!currentUserId || currentUserId === "preview-user-id") return;
    
    console.log("Setting up presence tracking for current user:", currentUserId);
    
    // Create a channel for user presence with a unique name to prevent conflicts
    const channelName = `online-users:${currentUserId}`;
    const channel = supabase.channel(channelName);
    
    // Subscribe to the channel
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to presence channel: ${channelName}`);
        
        // Initially set the user's status when subscribed
        await updatePresence(channel, currentUserId);
        
        // Update presence every 10 seconds while tab is active (reduced from 15 seconds)
        const interval = setInterval(() => updatePresence(channel, currentUserId), 10000);
        
        // Handle visibility changes (tab switching)
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            console.log("Document visible, updating presence");
            updatePresence(channel, currentUserId);
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Handle online/offline browser events
        const handleOnline = () => {
          console.log("Browser went online, updating presence");
          updatePresence(channel, currentUserId);
          toast.success("You're back online", { id: "connection-status" });
        };
        
        const handleOffline = () => {
          console.log("Browser went offline");
          toast.error("You're offline", { id: "connection-status" });
        };
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
          clearInterval(interval);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    });
    
    return () => {
      console.log(`Cleaning up presence tracking for ${channelName}`);
      supabase.removeChannel(channel);
    };
  }, [currentUserId, updatePresence]);
  
  // Listen for online status of all requested userIds
  useEffect(() => {
    if (userIds.length === 0) return;
    
    // Filter out invalid IDs
    const validUserIds = userIds.filter(id => id && id !== "preview-user-id");
    if (validUserIds.length === 0) return;
    
    console.log("Monitoring online status for users:", validUserIds);
    
    const channelName = 'online-users-tracker';
    const channel = supabase.channel(channelName);
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        console.log("Presence state updated:", presenceState);
        
        // Create a new status object based on presence data
        const newStatus: OnlineStatus = {};
        
        // Loop through all user IDs we're monitoring
        validUserIds.forEach(userId => {
          let isOnline = false;
          
          // Check all presence entries for this user
          Object.entries(presenceState).forEach(([key, presences]) => {
            // Check if this channel belongs to the user we're looking for
            if (key === userId || key.includes(`:${userId}`)) {
              // The user has an active presence
              isOnline = true;
            } else {
              // For each presence entry, check if the user_id matches
              const userPresenceArray = presences as Array<any>;
              if (userPresenceArray.some(presence => presence.user_id === userId)) {
                isOnline = true;
              }
            }
          });
          
          newStatus[userId] = isOnline;
          console.log(`User ${userId} online status:`, isOnline);
        });
        
        setOnlineStatus(prev => ({
          ...prev,
          ...newStatus
        }));
        
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
        
        newPresences.forEach(presence => {
          const presenceUserId = presence.user_id;
          
          if (presenceUserId && validUserIds.includes(presenceUserId)) {
            console.log(`Setting ${presenceUserId} as online from join event`);
            setOnlineStatus(prev => ({
              ...prev,
              [presenceUserId]: true
            }));
          }
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        if (!leftPresences || leftPresences.length === 0) return;
        
        // Don't immediately mark users as offline when they leave
        // They might just be changing pages or refreshing
        // Instead, set a timeout to mark them offline after a delay
        leftPresences.forEach(presence => {
          const presenceUserId = presence.user_id;
          
          if (presenceUserId && validUserIds.includes(presenceUserId)) {
            // Wait 15 seconds before marking user as offline
            // This helps prevent flickering when users navigate between pages
            console.log(`Setting timeout to mark ${presenceUserId} as offline`);
            setTimeout(() => {
              // Check if they've rejoined before marking offline
              channel.presenceState();
              const presenceState = channel.presenceState();
              let stillOnline = false;
              
              // Check all presence entries to see if the user has rejoined
              Object.values(presenceState).forEach((presences: any) => {
                if (presences.some((p: any) => p.user_id === presenceUserId)) {
                  stillOnline = true;
                }
              });
              
              if (!stillOnline) {
                console.log(`Marking ${presenceUserId} as offline after delay`);
                setOnlineStatus(prev => ({
                  ...prev,
                  [presenceUserId]: false
                }));
              }
            }, 15000);
          }
        });
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
  }, [userIds, currentUserId, updatePresence]);
  
  return { onlineStatus };
};
