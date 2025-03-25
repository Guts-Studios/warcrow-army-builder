
import { useState, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const NotificationsMenu = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast: uiToast } = useToast();
  const queryClient = useQueryClient();
  const [triggerRefresh, setTriggerRefresh] = useState<number>(0);
  
  const isPreviewId = userId === "preview-user-id";

  const fetchNotifications = async () => {
    if (isPreviewId) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
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
        uiToast({
          title: "Error fetching notifications",
          description: "Please try again later",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Notifications fetched:", data?.length || 0, "notifications");
      setNotifications(data || []);
      
      // If there are unread notifications, show a toast
      const unreadCount = data ? data.filter(n => !n.read).length : 0;
      if (unreadCount > 0) {
        toast.info(`You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`, {
          position: "top-right",
          duration: 3000
        });
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      toast.error("Error fetching notifications", {
        description: "Please try again later",
        position: "top-right"
      });
      uiToast({
        title: "Error fetching notifications",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (isPreviewId) return;
    
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
        uiToast({
          title: "Error marking notification as read",
          description: "Please try again later",
          variant: "destructive"
        });
        return;
      }
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast.error("Error marking notification as read", {
        description: "Please try again later",
        position: "top-right"
      });
      uiToast({
        title: "Error marking notification as read",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  const markAllAsRead = async () => {
    if (isPreviewId || notifications.length === 0) return;
    
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      if (unreadNotifications.length === 0) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('recipient_id', userId)
        .eq('read', false);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      toast.success("All notifications marked as read", {
        position: "top-right"
      });
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast.error("Failed to mark all as read", {
        position: "top-right"
      });
    }
  };

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (isPreviewId || !userId) return;

    console.log("Setting up realtime subscription for notifications");
    
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`
        },
        (payload) => {
          console.log('New notification received via realtime:', payload);
          // Add new notification to state
          setNotifications(prev => [payload.new, ...prev]);
          
          // Trigger a refresh of the notifications via query cache
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          
          // Trigger the component to refresh
          setTriggerRefresh(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, isPreviewId, queryClient]);

  // Fetch notifications when component mounts or when userId changes
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, triggerRefresh]);

  // Also refetch notifications when we detect a change through the query cache
  useEffect(() => {
    // Listen for query cache invalidations
    const unsubscribe = queryClient.getQueryCache().subscribe({
      onSuccess: (query) => {
        if (query.queryKey[0] === "notifications") {
          console.log("Notifications query succeeded, refreshing...");
          fetchNotifications();
        }
      },
      onError: (error, query) => {
        if (query.queryKey[0] === "notifications") {
          console.log("Notifications query error, refreshing...");
          fetchNotifications();
        }
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [queryClient, userId]);

  // Handle notification refresh
  const refreshNotifications = () => {
    if (userId) {
      fetchNotifications();
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  if (isPreviewId) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="relative rounded-full border-warcrow-gold/30 bg-black hover:bg-black"
          >
            <Bell className="h-5 w-5 text-warcrow-gold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 bg-black border-warcrow-gold/30 text-warcrow-text">
          <DropdownMenuLabel className="text-warcrow-gold">Notifications (Preview)</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-warcrow-gold/20" />
          <div className="py-2 px-3 text-center text-sm">
            No notifications in preview mode
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const formatNotificationContent = (notification: any) => {
    // If there's a direct message or content with message property
    if (notification.type === 'direct_message') {
      const senderName = notification.content?.sender_name || 'Someone';
      return `${senderName} sent you a message`;
    }
    
    // For friend requests
    if (notification.type === 'friend_request') {
      const senderName = notification.content?.sender_name || 'Someone';
      return `${senderName} sent you a friend request`;
    }
    
    // For friend request accepted
    if (notification.type === 'friend_accepted') {
      const senderName = notification.content?.sender_name || 'Someone';
      return `${senderName} accepted your friend request`;
    }
    
    // Default fallback for any other type
    return notification.message || notification.content?.message || "New notification";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative rounded-full border-warcrow-gold/30 bg-black hover:bg-black"
          onClick={refreshNotifications}
        >
          <Bell className="h-5 w-5 text-warcrow-gold" />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-black border-warcrow-gold/30 text-warcrow-text">
        <DropdownMenuLabel className="text-warcrow-gold">Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-warcrow-gold/20" />
        <ScrollArea className="max-h-64">
          {isLoading ? (
            <div className="py-2 px-3 text-center text-sm">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="py-2 px-3 text-center text-sm">No notifications yet</div>
          ) : (
            notifications.map(notification => (
              <DropdownMenuItem 
                key={notification.id} 
                onClick={() => markAsRead(notification.id)}
                className="hover:bg-warcrow-gold/10 data-[state=open]:bg-warcrow-gold/10"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm">
                    {formatNotificationContent(notification)}
                  </div>
                  {notification.read ? (
                    <CheckCheck className="h-4 w-4 ml-2 text-green-500" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-blue-500 ml-2"></span>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-warcrow-gold/20" />
            <DropdownMenuItem 
              className="text-center hover:bg-warcrow-gold/10 data-[state=open]:bg-warcrow-gold/10"
              onClick={markAllAsRead}
            >
              Mark all as read
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
