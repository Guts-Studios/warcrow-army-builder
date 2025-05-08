
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
    <div className="mb-8 admin-nav">
      <div className="flex flex-wrap gap-2 justify-start">
        {navItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            variant={activeTab === item.id ? "default" : "outline"}
            className={
              activeTab === item.id
                ? "bg-warcrow-gold hover:bg-warcrow-gold/90 text-black"
                : "border-warcrow-gold/30 bg-black/50 hover:bg-warcrow-gold/10"
            }
            size="sm"
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AdminNavbar;
