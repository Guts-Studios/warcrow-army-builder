
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UnitFilters } from './UnitFilters';
import { UnitTable } from './UnitTable';
import { useUnitData, useFactions } from './useUnitData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const UnitExplorer = () => {
  const [selectedFaction, setSelectedFaction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showHidden, setShowHidden] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('table');
  
  const { t } = useLanguage();
  const { data: units = [], isLoading } = useUnitData(selectedFaction);
  const { data: factions = [], isLoading: isLoadingFactions } = useFactions();
  
  console.log("Factions loaded:", factions); // Debug: Log factions being loaded
  
  // Filter units based on search query and showHidden setting
  const filteredUnits = units.filter(unit => {
    const matchesSearch = searchQuery === '' || 
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (unit.name_es && unit.name_es.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (unit.name_fr && unit.name_fr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (unit.description && unit.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (unit.keywords && unit.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (unit.special_rules && unit.special_rules.some(rule => rule.toLowerCase().includes(searchQuery.toLowerCase())));

    // If showHidden is false, only show units where showInBuilder is not explicitly false
    const matchesVisibility = showHidden || unit.characteristics?.showInBuilder !== false;
    
    return matchesSearch && matchesVisibility;
  });

  return (
    <Card className="bg-warcrow-background border-warcrow-gold/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-warcrow-gold text-xl">{t('unitExplorer')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="table" className="text-sm">{t('tableView')}</TabsTrigger>
            <TabsTrigger value="translations" className="text-sm">{t('translations')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="pt-2">
            <UnitFilters 
              factions={factions}
              selectedFaction={selectedFaction}
              onFactionChange={setSelectedFaction}
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              t={t}
              showHidden={showHidden}
              onShowHiddenChange={setShowHidden}
            />
            
            {isLoading ? (
              <div className="space-y-3 mt-4">
                <Skeleton className="h-8 w-full bg-warcrow-accent/30" />
                <Skeleton className="h-64 w-full bg-warcrow-accent/30" />
              </div>
            ) : (
              <div className="mt-4">
                <UnitTable 
                  filteredUnits={filteredUnits} 
                  t={t}
                  isLoading={isLoading}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="translations" className="pt-2">
            <div className="p-6 text-center text-warcrow-muted">
              {t('translationFeatureComingSoon')}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UnitExplorer;
