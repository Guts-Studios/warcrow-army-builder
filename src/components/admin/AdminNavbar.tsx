
import React from "react";
import { Button } from "@/components/ui/button";
import {
  LucideLayoutDashboard,
  BookOpen,
  HelpCircle,
  Users,
  Bell,
  FileText,
  Swords,
} from "lucide-react";

interface AdminNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LucideLayoutDashboard className="h-4 w-4" /> },
    { id: "rules", label: "Rules", icon: <BookOpen className="h-4 w-4" /> },
    { id: "faq", label: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
    { id: "users", label: "Users", icon: <Users className="h-4 w-4" /> },
    { id: "alerts", label: "Alerts", icon: <Bell className="h-4 w-4" /> },
    { id: "news", label: "News", icon: <FileText className="h-4 w-4" /> },
    { id: "units", label: "Units", icon: <Swords className="h-4 w-4" /> },
  ];

  return (
    <div className="mb-8 admin-nav bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-2 justify-start">
        {navItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            variant={activeTab === item.id ? "default" : "outline"}
            className={
              activeTab === item.id
                ? "bg-warcrow-gold hover:bg-warcrow-gold/90 text-black font-medium"
                : "border-warcrow-gold/50 bg-white hover:bg-warcrow-gold/10 text-black/80 font-medium"
            }
            size="sm"
          >
            {item.icon}
            <span className="ml-1">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AdminNavbar;
