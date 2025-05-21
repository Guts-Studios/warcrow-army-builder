
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import UnitValidationTool from './UnitValidationTool';

const ValidationsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="units" className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 mb-4 bg-warcrow-gold/10">
          <TabsTrigger 
            value="units" 
            className="data-[state=active]:bg-warcrow-gold/80 data-[state=active]:text-black"
          >
            Unit Data
          </TabsTrigger>
          <TabsTrigger 
            value="rules" 
            className="data-[state=active]:bg-warcrow-gold/80 data-[state=active]:text-black"
            disabled
          >
            Rules Data
          </TabsTrigger>
          <TabsTrigger 
            value="faq" 
            className="data-[state=active]:bg-warcrow-gold/80 data-[state=active]:text-black"
            disabled
          >
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
