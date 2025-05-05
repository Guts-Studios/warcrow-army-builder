
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Languages, BookOpen } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface AdminNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNavbar = ({ activeTab, setActiveTab }: AdminNavbarProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-4 border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-warcrow-gold">Admin Dashboard</h1>
      </div>
      
      <div className="flex flex-wrap space-x-2 mb-6 border-b border-warcrow-gold/20 pb-2">
        <Button
          variant={activeTab === 'dashboard' ? 'default' : 'outline'}
          className={activeTab === 'dashboard' 
            ? "bg-warcrow-gold text-black mb-2" 
            : "border-warcrow-gold/30 text-warcrow-gold mb-2"}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </Button>
        <Button
          variant={activeTab === 'news' ? 'default' : 'outline'}
          className={activeTab === 'news' 
            ? "bg-warcrow-gold text-black mb-2" 
            : "border-warcrow-gold/30 text-warcrow-gold mb-2"}
          onClick={() => setActiveTab('news')}
        >
          <FileText className="h-4 w-4 mr-2" />
          News Management
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-warcrow-gold/30 text-warcrow-gold mb-2"
            >
              <Languages className="h-4 w-4 mr-2" />
              Translations
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black border border-warcrow-gold/30">
            <DropdownMenuItem 
              className="text-warcrow-gold hover:bg-warcrow-gold/10 cursor-pointer"
              onClick={() => setActiveTab('rules')}
            >
              <Languages className="h-4 w-4 mr-2" />
              Rules Translations
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-warcrow-gold hover:bg-warcrow-gold/10 cursor-pointer"
              onClick={() => setActiveTab('faq')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              FAQ Translations
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

export default AdminNavbar;
