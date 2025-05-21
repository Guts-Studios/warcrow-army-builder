
import React from "react";
import { DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export const NotificationsEmpty = () => {
  return (
    <DropdownMenuContent className="w-80 border-warcrow-gold/30 text-warcrow-text">
      <DropdownMenuLabel className="text-warcrow-gold">Notifications</DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-warcrow-gold/20" />
      <div className="py-2 px-3 text-center text-sm">
        No new notifications
      </div>
    </DropdownMenuContent>
  );
};
