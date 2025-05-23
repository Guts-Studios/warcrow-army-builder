
import React, { useState } from 'react';
import UnitCsvValidator from '@/utils/validateUnitCsvData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CsvUnitValidationPage: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<string>('northern-tribes');

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold text-warcrow-gold mb-6">CSV Unit Data Validation</h1>
      
      <Tabs 
        defaultValue="northern-tribes"
        value={selectedFaction}
        onValueChange={setSelectedFaction}
        className="w-full"
      >
        <TabsList className="bg-black border border-warcrow-gold/30 mb-4">
          <TabsTrigger 
            value="northern-tribes"
            className="data-[state=active]:bg-warcrow-accent/20 data-[state=active]:text-warcrow-gold"
          >
            Northern Tribes
          </TabsTrigger>
          <TabsTrigger 
            value="syenann"
            className="data-[state=active]:bg-warcrow-accent/20 data-[state=active]:text-warcrow-gold"
          >
            Syenann
          </TabsTrigger>
          <TabsTrigger 
            value="hegemony-of-embersig"
            className="data-[state=active]:bg-warcrow-accent/20 data-[state=active]:text-warcrow-gold"
          >
            Hegemony of Embersig
          </TabsTrigger>
          <TabsTrigger 
            value="scions-of-yaldabaoth"
            className="data-[state=active]:bg-warcrow-accent/20 data-[state=active]:text-warcrow-gold"
          >
            Scions of Yaldabaoth
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="northern-tribes">
          <UnitCsvValidator faction="northern-tribes" />
        </TabsContent>
        
        <TabsContent value="syenann">
          <UnitCsvValidator faction="syenann" />
        </TabsContent>
        
        <TabsContent value="hegemony-of-embersig">
          <UnitCsvValidator faction="hegemony-of-embersig" />
        </TabsContent>
        
        <TabsContent value="scions-of-yaldabaoth">
          <UnitCsvValidator faction="scions-of-yaldabaoth" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CsvUnitValidationPage;
