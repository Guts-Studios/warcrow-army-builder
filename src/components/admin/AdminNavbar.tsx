
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserIcon,
  BookOpen,
  MessageSquareQuote,
  LayoutDashboard,
  AlertCircle,
  Newspaper,
  Database
} from "lucide-react";

interface AdminNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNavbar = ({ activeTab, setActiveTab }: AdminNavbarProps) => {
  return (
    <div className="sticky top-0 z-50 bg-warcrow-background border-b border-warcrow-gold/30 pb-2">
      <h1 className="text-2xl font-semibold text-warcrow-gold mb-4">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="overflow-x-auto">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="dashboard" className="flex flex-col items-center sm:flex-row sm:gap-2 text-xs sm:text-sm">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          
          <TabsTrigger value="rules" className="flex flex-col items-center sm:flex-row sm:gap-2 text-xs sm:text-sm">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Rules</span>
          </TabsTrigger>
          
          <TabsTrigger value="faq" className="flex flex-col items-center sm:flex-row sm:gap-2 text-xs sm:text-sm">
            <MessageSquareQuote className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
          
          <TabsTrigger value="users" className="flex flex-col items-center sm:flex-row sm:gap-2 text-xs sm:text-sm">
            <UserIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          
          <TabsTrigger value="alerts" className="flex flex-col items-center sm:flex-row sm:gap-2 text-xs sm:text-sm">
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          
          <TabsTrigger value="news" className="flex flex-col items-center sm:flex-row sm:gap-2 text-xs sm:text-sm">
            <Newspaper className="h-4 w-4" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
          
          <TabsTrigger value="units" className="flex flex-col items-center sm:flex-row sm:gap-2 text-xs sm:text-sm">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Units</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AdminNavbar;
