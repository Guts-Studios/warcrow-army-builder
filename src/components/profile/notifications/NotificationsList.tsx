
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { NotificationItem } from "./NotificationItem";

interface NotificationsListProps {
  notifications: any[];
  isLoading: boolean;
  onRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsList = ({ 
  notifications, 
  isLoading, 
  onRead, 
  onMarkAllAsRead 
}: NotificationsListProps) => {
  if (isLoading) {
    return <div className="py-2 px-3 text-center text-sm">Loading notifications...</div>;
  }
  
  if (notifications.length === 0) {
    return <div className="py-2 px-3 text-center text-sm">No notifications yet</div>;
  }
  
  return (
    <>
      <ScrollArea className="max-h-64">
        {notifications.map(notification => (
          <NotificationItem 
            key={notification.id}
            notification={notification} 
            onRead={onRead} 
          />
        ))}
      </ScrollArea>
      <DropdownMenuSeparator className="bg-warcrow-gold/20" />
      <div 
        className="text-center py-1.5 px-2 cursor-pointer hover:bg-warcrow-gold/10 data-[state=open]:bg-warcrow-gold/10"
        onClick={onMarkAllAsRead}
      >
        Mark all as read
      </div>
    </>
  );
};
