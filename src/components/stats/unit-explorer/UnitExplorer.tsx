
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnitFilters from './UnitFilters';
import UnitList from './UnitList';
import TranslationPanel from './TranslationPanel';
import { useUnitData, useFactions } from './useUnitData';

const UnitExplorer: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("units");
  const { language } = useLanguage();
  
  // Fetch units data with custom hook
  const { 
    data: units, 
    isLoading: isLoadingUnits, 
    error: unitsError,
    refetch: refetchUnits
  } = useUnitData(selectedFaction);
  
  // Fetch factions for filter
  const { 
    data: factions,
    isLoading: isLoadingFactions
  } = useFactions();

  // Handle filter changes
  const handleFilterChange = ({ searchQuery, selectedFaction }: { searchQuery: string; selectedFaction: string }) => {
    setSearchQuery(searchQuery);
    setSelectedFaction(selectedFaction);
  };
  
  const isLoading = isLoadingUnits || isLoadingFactions;

  // Display error if any
  if (unitsError) {
    return (
      <Card className="p-6 border-red-500 bg-red-50 text-red-900">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold">Error Loading Units</h3>
        </div>
        <p>{(unitsError as Error).message}</p>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <UnitFilters
        onFilterChange={handleFilterChange}
        factions={factions || []}
        isLoading={isLoading}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="units" className="space-y-4">
          <UnitList 
            units={units || []}
            searchQuery={searchQuery}
            isLoading={isLoading}
            error={unitsError}
          />
        </TabsContent>
        
        <TabsContent value="translations" className="space-y-4">
          <TranslationPanel 
            units={units || []} 
            onTranslationComplete={refetchUnits}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnitExplorer;
