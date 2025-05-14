
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { UnitTable } from './UnitTable';
import { UnitFilters } from './UnitFilters';
import { useTranslateKeyword } from '@/utils/translation';

// Define the interface for the unit data
interface UnitData {
  id: string;
  name: string;
  faction: string;
  type: string;
  characteristics: {
    highCommand?: boolean;
    [key: string]: any;
  };
}

const UnitExplorer = () => {
  const [units, setUnits] = useState<UnitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [factionFilter, setFactionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { language, t } = useLanguage();
  const [factions, setFactions] = useState<string[]>([]);
  const [unitTypes, setUnitTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('unit_data')
          .select('*');
        
        if (error) {
          console.error('Error fetching units:', error);
          return;
        }
        
        // Cast data to the UnitData interface with type safety
        const typedData = data as UnitData[];
        setUnits(typedData);
        
        // Extract unique factions and unit types
        const uniqueFactions = Array.from(new Set(typedData.map(unit => unit.faction)));
        const uniqueTypes = Array.from(new Set(typedData.map(unit => unit.type)));
        
        setFactions(uniqueFactions);
        setUnitTypes(uniqueTypes);
      } catch (error) {
        console.error('Error in fetchUnits:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUnits();
  }, []);

  const filteredUnits = units.filter((unit) => {
    // Filter by search query
    if (searchQuery && !unit.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by faction
    if (factionFilter !== 'all' && unit.faction !== factionFilter) {
      return false;
    }
    
    // Filter by type
    if (typeFilter !== 'all') {
      if (typeFilter === 'high-command' && !unit.characteristics?.highCommand) {
        return false;
      } else if (typeFilter !== 'high-command' && unit.type !== typeFilter) {
        return false;
      }
    }
    
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Unit Explorer</h1>
      
      <UnitFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        factionFilter={factionFilter}
        setFactionFilter={setFactionFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        factions={factions}
        unitTypes={unitTypes}
        t={t}
      />
      
      <Tabs defaultValue="table" className="mt-4">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <UnitTable filteredUnits={filteredUnits} t={t} isLoading={loading} />
        </TabsContent>
        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <p>Loading...</p>
            ) : (
              filteredUnits.map((unit) => (
                <div key={unit.id} className="border p-4 rounded">
                  <h2>{unit.name}</h2>
                  <p>{unit.faction}</p>
                  <p>{unit.type}</p>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnitExplorer;
