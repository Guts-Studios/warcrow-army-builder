
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import UnitValidationTool from './UnitValidationTool';
import { Database, Server, FileQuestion } from 'lucide-react';

const ValidationsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="units" className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 mb-4 bg-black border border-warcrow-gold/30 p-1 rounded-md">
          <TabsTrigger 
            value="units" 
            className="text-warcrow-gold/80 hover:bg-warcrow-gold/20 hover:text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold data-[state=active]:border-warcrow-gold py-2"
          >
            <Database className="w-4 h-4 mr-2" />
            Unit Data
          </TabsTrigger>
          <TabsTrigger 
            value="rules" 
            className="text-warcrow-gold/80 hover:bg-warcrow-gold/20 hover:text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold data-[state=active]:border-warcrow-gold py-2"
            disabled
          >
            <FileQuestion className="w-4 h-4 mr-2" />
            Rules Data
          </TabsTrigger>
          <TabsTrigger 
            value="faq" 
            className="text-warcrow-gold/80 hover:bg-warcrow-gold/20 hover:text-warcrow-gold data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold data-[state=active]:border-warcrow-gold py-2"
            disabled
          >
            <Server className="w-4 h-4 mr-2" />
            FAQ Data
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="units">
          <Card className="p-4 bg-black/50 border-warcrow-gold/30">
            <UnitValidationTool />
          </Card>
        </TabsContent>
        
        <TabsContent value="rules">
          <Card className="p-4 bg-black/50 border-warcrow-gold/30">
            <p className="text-warcrow-gold/70 p-4 text-center">
              Rules validation coming soon
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card className="p-4 bg-black/50 border-warcrow-gold/30">
            <p className="text-warcrow-gold/70 p-4 text-center">
              FAQ validation coming soon
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ValidationsPanel;
