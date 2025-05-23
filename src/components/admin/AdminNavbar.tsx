
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Book, 
  Image, 
  HelpCircle, 
  Newspaper, 
  Globe, 
  LayoutDashboard,
  Bug, 
  ActivitySquare,
  Flag,
  FileCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-4 w-4 mr-2" /> },
    { id: 'validations', label: 'Validations', icon: <ActivitySquare className="h-4 w-4 mr-2" /> },
    { id: 'unit-images', label: 'Unit Images', icon: <Image className="h-4 w-4 mr-2" /> },
    { id: 'factions', label: 'Factions', icon: <Flag className="h-4 w-4 mr-2" /> },
    { id: 'rules', label: 'Rules', icon: <Book className="h-4 w-4 mr-2" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="h-4 w-4 mr-2" /> },
    { id: 'news', label: 'News', icon: <Newspaper className="h-4 w-4 mr-2" /> },
    { id: 'translation', label: 'Translation', icon: <Globe className="h-4 w-4 mr-2" /> },
    { id: 'debug', label: 'Debug', icon: <Bug className="h-4 w-4 mr-2" /> },
    { id: 'api', label: 'API Status', icon: <ActivitySquare className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="mb-6 border-b border-warcrow-gold/30">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`flex items-center gap-1 px-4 py-2 ${
                activeTab === tab.id
                  ? 'bg-warcrow-gold text-black'
                  : 'bg-black/20 text-warcrow-gold hover:bg-black/40'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <Link 
          to="/admin/validate-csv"
          className="flex items-center gap-1 px-4 py-2 bg-black/20 text-warcrow-gold hover:bg-black/40 rounded"
        >
          <FileCheck className="h-4 w-4 mr-2" />
          CSV Validator
        </Link>
      </div>
    </div>
  );
};

export default AdminNavbar;
