
import React, { useState } from 'react';
import { useUnitData } from './useUnitData';
import UnitFilters from './UnitFilters';
import UnitList from './UnitList';
import UnitTable from './UnitTable';
import UnitStatCard from '../UnitStatCard';
import { ExtendedUnit } from '@/types/extendedUnit';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, Grid } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TranslationPanel from './TranslationPanel';
import UnitTranslationStatus from './UnitTranslationStatus';

const UnitExplorer: React.FC = () => {
  const { t } = useLanguage();
  const [selectedUnit, setSelectedUnit] = useState<ExtendedUnit | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [selectedFaction, setSelectedFaction] = useState<string | 'all'>('all');
  const [showSymbolBg, setShowSymbolBg] = useState<boolean>(true);
  const [symbolBgColor, setSymbolBgColor] = useState<string>('#1a1a1a');
  const { units, isLoading, factions } = useUnitData();
  
  // Filter units by faction if a specific faction is selected
  const filteredUnits = selectedFaction === 'all' 
    ? units 
    : units.filter(unit => unit.type.toLowerCase() === selectedFaction.toLowerCase());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-warcrow-gold">Unit Explorer</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewMode('list')} 
            className={viewMode === 'list' ? 'bg-warcrow-gold text-black' : ''}
          >
            <Grid size={16} className="mr-1" /> List
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewMode('table')} 
            className={viewMode === 'table' ? 'bg-warcrow-gold text-black' : ''}
          >
            <Table size={16} className="mr-1" /> Table
          </Button>
        </div>
      </div>

      <UnitFilters 
        selectedFaction={selectedFaction} 
        onFactionChange={setSelectedFaction}
        factions={factions}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={viewMode === 'list' ? 'md:col-span-1' : 'md:col-span-3'}>
          {viewMode === 'list' && (
            <Card className="bg-warcrow-background border-warcrow-gold/30">
              <CardContent className="p-2">
                <UnitList 
                  units={filteredUnits}
                  selectedUnit={selectedUnit}
                  onSelectUnit={setSelectedUnit}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          )}
          
          {viewMode === 'table' && (
            <Card className="bg-warcrow-background border-warcrow-gold/30">
              <CardContent className="p-2">
                <UnitTable 
                  units={filteredUnits}
                  onSelectUnit={setSelectedUnit}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          )}
        </div>
        
        {viewMode === 'list' && selectedUnit && (
          <div className="md:col-span-2 space-y-4">
            <UnitStatCard 
              unit={selectedUnit}
              showSymbolBg={showSymbolBg}
              symbolBgColor={symbolBgColor}
            />
            
            <Card className="bg-warcrow-background border-warcrow-gold/30">
              <CardContent className="p-4">
                <UnitTranslationStatus unit={selectedUnit} />
              </CardContent>
            </Card>
            
            {selectedUnit && (
              <TranslationPanel unit={selectedUnit} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitExplorer;
