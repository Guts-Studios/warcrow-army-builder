
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
