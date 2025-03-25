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

export const NotificationsMenu = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isPreviewId = userId === "preview-user-id";

  const fetchNotifications = async () => {
    if (isPreviewId) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }
      
      setNotifications(data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
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
        return;
      }
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const unreadNotifications = notifications.filter(n => !n.read);

  // Return a simplified menu for preview mode
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative rounded-full border-warcrow-gold/30 bg-black hover:bg-black"
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
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {notification.message}
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
            <DropdownMenuItem className="text-center hover:bg-warcrow-gold/10 data-[state=open]:bg-warcrow-gold/10">
              Mark all as read
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
