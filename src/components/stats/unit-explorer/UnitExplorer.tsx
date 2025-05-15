
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { UnitFilters } from './UnitFilters';
import { UnitTable } from './UnitTable';
import { useUnitData, useFactions } from './useUnitData';
import { useLanguage } from '@/contexts/LanguageContext';

const UnitExplorer: React.FC = () => {
  const [selectedFaction, setSelectedFaction] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHiddenUnits, setShowHiddenUnits] = useState(false);
  
  const { t, language } = useLanguage();
  const { data: units = [], isLoading } = useUnitData(selectedFaction);
  const { data: factions = [] } = useFactions();

  // Filter units based on search query and visibility
  const filteredUnits = units.filter(unit => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (unit.keywords && unit.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchQuery.toLowerCase())
      )) ||
      (unit.special_rules && unit.special_rules.some(rule => 
        rule.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    // Filter by visibility if showHiddenUnits is false
    const shouldShow = showHiddenUnits || 
      (unit.characteristics && unit.characteristics.showInBuilder !== false);
    
    return matchesSearch && shouldShow;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFactionChange = (value: string) => {
    setSelectedFaction(value);
  };

  const handleShowHiddenChange = (value: boolean) => {
    setShowHiddenUnits(value);
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-warcrow-gold mb-2">{t('unitExplorer')}</h1>
          <p className="text-warcrow-text/80">{t('unitExplorerDescription')}</p>
        </div>
        
        <Card className="p-4 bg-black/40 border border-warcrow-gold/30">
          <UnitFilters
            factions={factions}
            selectedFaction={selectedFaction}
            onFactionChange={handleFactionChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            t={t}
            showHidden={showHiddenUnits}
            onShowHiddenChange={handleShowHiddenChange}
          />
          
          <div className="mt-4">
            <UnitTable 
              filteredUnits={filteredUnits}
              t={t}
              isLoading={isLoading}
            />
          </div>
        </Card>
        
        {language !== 'en' && (
          <div className="p-4 border border-warcrow-gold/30 rounded-md bg-black/40">
            <p className="text-warcrow-text">Translation features are available in this panel.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitExplorer;
