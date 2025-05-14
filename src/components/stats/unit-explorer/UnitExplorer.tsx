
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import UnitTable from './UnitTable';
import UnitFilters from './UnitFilters';

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
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('units')
          .select('*');
        
        if (error) {
          console.error('Error fetching units:', error);
          return;
        }
        
        // Cast data to the UnitData interface with type safety
        const typedData = data as UnitData[];
        setUnits(typedData);
      } catch (error) {
        console.error('Error in fetchUnits:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUnits();
  }, []);

  const filteredUnits = units.filter((unit) => {
    // Type guard for characteristics.highCommand
    const isHighCommand = 
      unit.characteristics && 
      typeof unit.characteristics === 'object' && 
      'highCommand' in unit.characteristics && 
      unit.characteristics.highCommand === true;
    
    if (selectedFaction && unit.faction !== selectedFaction) {
      return false;
    }
    
    if (selectedType) {
      if (selectedType === 'high-command' && !isHighCommand) {
        return false;
      } else if (selectedType !== 'high-command' && unit.type !== selectedType) {
        return false;
      }
    }
    
    return true;
  });

  const handleFactionChange = (faction: string | null) => {
    setSelectedFaction(faction);
  };

  const handleTypeChange = (type: string | null) => {
    setSelectedType(type);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Unit Explorer</h1>
      
      <UnitFilters 
        onFactionChange={handleFactionChange}
        onTypeChange={handleTypeChange}
      />
      
      <Tabs defaultValue="table" className="mt-4">
        <TabsList>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <UnitTable units={filteredUnits} loading={loading} />
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
