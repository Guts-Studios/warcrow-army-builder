
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnitFilters from './UnitFilters';
import UnitList from './UnitList';
import { UnitTable } from './UnitTable';
import TranslationPanel from './TranslationPanel';
import { useUnitData, useFactions, Unit } from './useUnitData';

const UnitExplorer: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("units");
  const [viewType, setViewType] = useState<"cards" | "table">("cards");
  const { t, language } = useLanguage();
  
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

  // Filter units based on search query
  const filteredUnits = units?.filter(unit => 
    unit.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Display error if any
  if (unitsError) {
    return (
      <Card className="p-6 border-red-500 bg-black/50 text-red-400">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
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
      
      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-2 bg-warcrow-accent/50 p-1 rounded">
          <button 
            className={`px-3 py-1 rounded ${viewType === "cards" ? "bg-warcrow-gold/20 text-warcrow-gold" : "text-warcrow-text"}`}
            onClick={() => setViewType("cards")}
          >
            Cards
          </button>
          <button 
            className={`px-3 py-1 rounded ${viewType === "table" ? "bg-warcrow-gold/20 text-warcrow-gold" : "text-warcrow-text"}`}
            onClick={() => setViewType("table")}
          >
            Table
          </button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="units" className="space-y-4">
          {viewType === "cards" ? (
            <UnitList 
              units={filteredUnits}
              searchQuery={searchQuery}
              isLoading={isLoading}
              error={unitsError}
            />
          ) : (
            <UnitTable 
              filteredUnits={filteredUnits}
              t={t}
              isLoading={isLoading}
            />
          )}
        </TabsContent>
        
        <TabsContent value="translations" className="space-y-4">
          <TranslationPanel 
            units={units || [] as Unit[]} 
            onTranslationComplete={refetchUnits}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnitExplorer;
