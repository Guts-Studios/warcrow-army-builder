
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { UnitTable } from './UnitTable';
import { UnitFilters } from './UnitFilters';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/translation';

const UnitExplorer = () => {
  const { t } = useLanguage();
  const [units, setUnits] = useState<any[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [factions, setFactions] = useState<string[]>([]);
  const [unitTypes, setUnitTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const { data: unitData, error } = await supabase
        .from('unit_data')
        .select('*')
        .order('faction')
        .order('name');

      if (error) throw error;

      // Process and deduplicate units
      const processedUnits = unitData || [];
      setUnits(processedUnits);
      setFilteredUnits(processedUnits);

      // Extract unique factions and unit types
      const uniqueFactions = [...new Set(processedUnits.map(unit => unit.faction))].sort();
      const uniqueTypes = [...new Set(processedUnits.map(unit => unit.type))].filter(Boolean).sort();
      
      setFactions(uniqueFactions);
      setUnitTypes(uniqueTypes);

    } catch (error: any) {
      console.error('Error fetching units:', error);
      toast({
        title: t('errorFetchingUnits'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: { search: string; faction: string; type: string }) => {
    const { search, faction, type } = filters;
    
    const filtered = units.filter(unit => {
      const matchesSearch = !search || unit.name.toLowerCase().includes(search.toLowerCase());
      const matchesFaction = !faction || unit.faction === faction;
      const matchesType = !type || unit.type === type;
      
      return matchesSearch && matchesFaction && matchesType;
    });
    
    setFilteredUnits(filtered);
  };

  return (
    <Card className="bg-black border-warcrow-gold/30 p-5">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-warcrow-gold">{t('unitExplorer')}</h2>
        <UnitFilters 
          onFilterChange={handleFilterChange} 
          factions={factions} 
          unitTypes={unitTypes}
          t={t}
        />
        <UnitTable filteredUnits={filteredUnits} t={t} isLoading={isLoading} />
      </div>
    </Card>
  );
};

export default UnitExplorer;
