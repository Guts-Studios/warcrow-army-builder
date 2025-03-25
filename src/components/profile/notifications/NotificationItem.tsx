
import React from "react";
import { CheckCheck } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatNotificationContent } from "@/utils/notificationUtils";

interface NotificationItemProps {
  notification: any;
  onRead: (id: string) => void;
}

export const NotificationItem = ({ notification, onRead }: NotificationItemProps) => {
  return (
    <DropdownMenuItem 
      key={notification.id} 
      onClick={() => onRead(notification.id)}
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
  );
};
