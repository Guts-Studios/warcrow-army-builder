
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: string;
  content: { message: string } | Record<string, any>;
  read: boolean;
  created_at: string;
  sender: {
    id: string;
    username: string | null;
    wab_id: string;
    avatar_url: string | null;
  } | null;
}

interface NotificationsMenuProps {
  userId: string;
}

export const NotificationsMenu = ({ userId }: NotificationsMenuProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!userId) return;

        const { data, error } = await supabase
          .from("notifications")
          .select(`
            id,
            type,
            content,
            read,
            created_at,
            sender:profiles!notifications_sender_id_fkey(id, username, wab_id, avatar_url)
          `)
          .eq("recipient_id", userId)
          .order("created_at", { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        // Type assertion to ensure correct handling of content field
        const typedNotifications = (data || []).map(item => ({
          ...item,
          content: typeof item.content === 'object' ? item.content : { message: String(item.content) }
        }));
        
        setNotifications(typedNotifications);
        setUnreadCount(typedNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`
        },
        (payload) => {
          console.log('New notification:', payload);
          fetchNotifications();
          toast.info("You have a new notification!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    
    // Mark notifications as read when opening the menu
    if (open && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n.id);
      
      if (unreadIds.length === 0) return;
      
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .in("id", unreadIds);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => unreadIds.includes(n.id) ? { ...n, read: true } : n)
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="relative border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-black/90 border-warcrow-gold text-warcrow-text p-0">
        <div className="p-3 border-b border-warcrow-gold/20">
          <h3 className="text-lg font-semibold text-warcrow-gold">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-warcrow-text/60">
              No notifications yet
            </div>
          ) : (
            notifications.map(notification => {
              const sender = notification.sender ? 
                (notification.sender.username || notification.sender.wab_id) : 
                "Someone";
              
              return (
                <div 
                  key={notification.id} 
                  className={`p-3 border-b border-warcrow-gold/10 ${notification.read ? "" : "bg-warcrow-gold/5"}`}
                >
                  <div className="flex justify-between">
                    <p className="text-sm">
                      <span className="font-medium">{sender}</span>{" "}
                      {notification.content.message}
                    </p>
                    <span className="text-xs text-warcrow-text/60">
                      {formatTimeAgo(notification.created_at)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
