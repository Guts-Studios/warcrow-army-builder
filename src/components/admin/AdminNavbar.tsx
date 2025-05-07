
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Database, Home, MessageSquare, Users, Languages } from "lucide-react";

interface AdminNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-warcrow-gold/30 pb-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-warcrow-gold mb-4">Admin Dashboard</h1>
        <Button 
          onClick={() => window.open('/', '_blank')}
          variant="outline"
          className="text-warcrow-gold border-warcrow-gold/30"
        >
          Back to Site
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 bg-black border border-warcrow-gold/30">
          <TabsTrigger value="dashboard" className={activeTab === 'dashboard' ? "bg-warcrow-gold text-black" : ""}>
            <Home className="h-4 w-4 mr-2" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="rules" className={activeTab === 'rules' ? "bg-warcrow-gold text-black" : ""}>
            <BookOpen className="h-4 w-4 mr-2" /> Rules
          </TabsTrigger>
          <TabsTrigger value="faq" className={activeTab === 'faq' ? "bg-warcrow-gold text-black" : ""}>
            <MessageSquare className="h-4 w-4 mr-2" /> FAQ
          </TabsTrigger>
          <TabsTrigger value="users" className={activeTab === 'users' ? "bg-warcrow-gold text-black" : ""}>
            <Users className="h-4 w-4 mr-2" /> Users
          </TabsTrigger>
          <TabsTrigger value="news" className={activeTab === 'news' ? "bg-warcrow-gold text-black" : ""}>
            <Database className="h-4 w-4 mr-2" /> News
          </TabsTrigger>
          <TabsTrigger value="translations" className={activeTab === 'translations' ? "bg-warcrow-gold text-black" : ""}>
            <Languages className="h-4 w-4 mr-2" /> Translations
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default AdminNavbar;
