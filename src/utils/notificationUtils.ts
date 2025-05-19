
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Warcrow site constants
const WARCROW_SITE_NAME = "warcrow-army-builder";
const WARCROW_SITE_ALT_NAME = "warcrowarmy.com";

// Format notification content based on type
export const formatNotificationContent = (notification: any) => {
  if (notification.type === 'direct_message') {
    const senderName = notification.content?.sender_name || 'Someone';
    return `${senderName} sent you a message`;
  }
  
  if (notification.type === 'friend_request') {
    const senderName = notification.content?.sender_name || 'Someone';
    return `${senderName} sent you a friend request`;
  }
  
  if (notification.type === 'friend_accepted') {
    const senderName = notification.content?.sender_name || 'Someone';
    return `${senderName} accepted your friend request`;
  }
  
  if (notification.type === 'profile_comment') {
    const senderName = notification.content?.sender_name || 'Someone';
    return `${senderName} commented on your profile`;
  }
  
  if (notification.type === 'build_failure') {
    try {
      const content = typeof notification.content === 'string' 
        ? JSON.parse(notification.content) 
        : notification.content;
      
      const siteName = content?.site_name || 'Unknown site';
      const branch = content?.branch || 'unknown branch';
      return `Build failed: ${siteName} (${branch})`;
    } catch (error) {
      console.error("Error parsing build_failure notification:", error);
      return "Build failure notification";
    }
  }
  
  return notification.message || notification.content?.message || "New notification";
};

// Fetch notifications for a user
export const fetchNotifications = async (userId: string, isPreviewId: boolean) => {
  if (isPreviewId) {
    return { notifications: [], error: null };
  }
  
  try {
    console.log("Fetching notifications for user:", userId);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Error fetching notifications", {
        description: "Please try again later",
        position: "top-right"
      });
      return { notifications: [], error };
    }
    
    console.log("Notifications fetched:", data?.length || 0, "notifications");
    
    // If there are unread notifications, show a toast
    const unreadCount = data ? data.filter(n => !n.read).length : 0;
    if (unreadCount > 0) {
      toast.info(`You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`, {
        position: "top-right",
        duration: 3000
      });
    }
    
    // Check if a notification is for warcrow site
    const isWarcrowSite = (notification: any) => {
      if (notification.type !== 'build_failure') return false;
      
      try {
        const content = typeof notification.content === 'string' 
          ? JSON.parse(notification.content) 
          : notification.content;
          
        return content?.site_name === WARCROW_SITE_NAME || 
               content?.site_name === WARCROW_SITE_ALT_NAME;
      } catch {
        return false;
      }
    };
    
    // Only show the most recent warcrow build failure notification if it's unread and from the last 24 hours
    let hasShownBuildFailureNotification = false;
    const recentBuildFailures = data ? data.filter(n => {
      const isRecent = n.type === 'build_failure' && 
             !n.read && 
             isWarcrowSite(n) &&
             // Check if created within the last 24 hours
             (new Date().getTime() - new Date(n.created_at).getTime() < 24 * 60 * 60 * 1000);
      
      if (isRecent && !hasShownBuildFailureNotification) {
        hasShownBuildFailureNotification = true;
        return true;
      }
      return false;
    }) : [];
    
    // Only show a toast for the most recent build failure notification
    if (recentBuildFailures.length > 0) {
      const newestFailure = recentBuildFailures[0];
      try {
        const content = typeof newestFailure.content === 'string' 
          ? JSON.parse(newestFailure.content) 
          : newestFailure.content;
        
        toast.error(`Netlify build failed!`, {
          description: `${content.site_name}: ${content.branch} - ${content.error_message || 'Unknown error'}`,
          position: "top-right",
          duration: 8000
        });
      } catch (err) {
        console.error("Error parsing build failure notification:", err);
      }
    }
    
    return { notifications: data || [], error: null };
    
  } catch (err) {
    console.error("Error fetching notifications:", err);
    toast.error("Error fetching notifications", {
      description: "Please try again later",
      position: "top-right"
    });
    return { notifications: [], error: err };
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string, isPreviewId: boolean) => {
  if (isPreviewId) return { success: true, error: null };
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Error marking notification as read", {
        description: "Please try again later",
        position: "top-right"
      });
      return { success: false, error };
    }
    
    return { success: true, error: null };
  } catch (err) {
    console.error("Error marking notification as read:", err);
    toast.error("Error marking notification as read", {
      description: "Please try again later",
      position: "top-right"
    });
    return { success: false, error: err };
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string, isPreviewId: boolean) => {
  if (isPreviewId) return { success: true, error: null };
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('recipient_id', userId)
      .eq('read', false);
    
    if (error) {
      console.error("Error marking all notifications as read:", error);
      return { success: false, error };
    }
    
    toast.success("All notifications marked as read", {
      position: "top-right"
    });
    
    return { success: true, error: null };
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    toast.error("Failed to mark all as read", {
      position: "top-right"
    });
    return { success: false, error: err };
  }
};

// Check and return build failure notifications for admin display
export const getBuildFailureNotifications = async () => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('type', 'build_failure')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error("Error fetching build failure notifications:", error);
      return { notifications: [], error };
    }
    
    // Filter out notifications for non-warcrow sites
    const filteredNotifications = data ? data.filter(notification => {
      try {
        // Parse the content if it's a string
        const content = typeof notification.content === 'string' 
          ? JSON.parse(notification.content) 
          : notification.content;
        
        // Only include warcrow site notifications
        if (!(content?.site_name === WARCROW_SITE_NAME || content?.site_name === WARCROW_SITE_ALT_NAME)) {
          return false;
        }
        
        // Only include notifications from the last 24 hours
        return new Date().getTime() - new Date(notification.created_at).getTime() < 24 * 60 * 60 * 1000;
      } catch (err) {
        console.error("Error parsing notification content:", err);
        return false;
      }
    }) : [];
    
    return { notifications: filteredNotifications || [], error: null };
  } catch (err) {
    console.error("Error fetching build failure notifications:", err);
    return { notifications: [], error: err };
  }
};
