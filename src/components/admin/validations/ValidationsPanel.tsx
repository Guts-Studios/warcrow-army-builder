
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UnitValidationTool from './UnitValidationTool';

const ValidationsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("units");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-warcrow-gold">Data Validations</h1>
      </div>

      <Card className="bg-black/50 border-warcrow-gold/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-warcrow-gold">Validation Tools</CardTitle>
          <CardDescription>
            Compare and validate data across different sources to ensure consistency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="units" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-4 bg-black/80 border border-warcrow-gold/30">
              <TabsTrigger 
                value="units" 
                className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
              >
                Unit Validation
              </TabsTrigger>
              <TabsTrigger 
                value="keywords" 
                className="text-xs sm:text-sm text-warcrow-text data-[state=active]:bg-warcrow-gold/90 data-[state=active]:text-black font-medium"
                disabled
              >
                Keywords Validation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="units">
              <UnitValidationTool />
            </TabsContent>
            
            <TabsContent value="keywords">
              <div className="p-4 text-center text-warcrow-text/60">
                Keywords validation tool will be implemented soon
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValidationsPanel;
