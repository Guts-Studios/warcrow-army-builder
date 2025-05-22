
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bug, Users, CheckCircle, Database, BookOpen, QuestionMarkCircle, Newspaper, Globe, Activity, Image } from "lucide-react";

interface AdminNavbarProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const AdminNavbar = ({ activeTab, setActiveTab }: AdminNavbarProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10 h-auto">
        <TabsTrigger value="dashboard" className="flex flex-col items-center py-2">
          <Activity className="h-4 w-4 mb-1" />
          <span className="text-xs">Dashboard</span>
        </TabsTrigger>
        
        <TabsTrigger value="users" className="flex flex-col items-center py-2">
          <Users className="h-4 w-4 mb-1" />
          <span className="text-xs">Users</span>
        </TabsTrigger>
        
        <TabsTrigger value="validations" className="flex flex-col items-center py-2">
          <CheckCircle className="h-4 w-4 mb-1" />
          <span className="text-xs">Validations</span>
        </TabsTrigger>
        
        <TabsTrigger value="unit-images" className="flex flex-col items-center py-2">
          <Image className="h-4 w-4 mb-1" />
          <span className="text-xs">Images</span>
        </TabsTrigger>
        
        <TabsTrigger value="rules" className="flex flex-col items-center py-2">
          <BookOpen className="h-4 w-4 mb-1" />
          <span className="text-xs">Rules</span>
        </TabsTrigger>
        
        <TabsTrigger value="faq" className="flex flex-col items-center py-2">
          <QuestionMarkCircle className="h-4 w-4 mb-1" />
          <span className="text-xs">FAQ</span>
        </TabsTrigger>
        
        <TabsTrigger value="news" className="flex flex-col items-center py-2">
          <Newspaper className="h-4 w-4 mb-1" />
          <span className="text-xs">News</span>
        </TabsTrigger>
        
        <TabsTrigger value="translation" className="flex flex-col items-center py-2">
          <Globe className="h-4 w-4 mb-1" />
          <span className="text-xs">Translation</span>
        </TabsTrigger>
        
        <TabsTrigger value="debug" className="flex flex-col items-center py-2">
          <Bug className="h-4 w-4 mb-1" />
          <span className="text-xs">Debug</span>
        </TabsTrigger>
        
        <TabsTrigger value="api" className="flex flex-col items-center py-2">
          <Database className="h-4 w-4 mb-1" />
          <span className="text-xs">API</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AdminNavbar;
