
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { UnitTable } from './UnitTable';
import { UnitFilters } from './UnitFilters';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/translation';
import { useCharacteristicTranslations } from '@/utils/translation/hooks/useCharacteristicTranslations';

const UnitExplorer = () => {
  const { t, language } = useLanguage();
  const { translateCharacteristic } = useCharacteristicTranslations();
  const [units, setUnits] = useState<any[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [factions, setFactions] = useState<string[]>([]);
  const [unitTypes, setUnitTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchUnits();
  }, [language]); // Refetch when language changes to get proper translations

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
      let processedUnits = unitData || [];
      
      // Normalize faction names for consistency
      processedUnits = processedUnits.map(unit => ({
        ...unit,
        faction: normalizeFactionName(unit.faction)
      }));
      
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

  // Helper function to normalize faction names
  const normalizeFactionName = (faction: string): string => {
    // Handle case variants
    if (faction.toLowerCase() === 'syenann' || faction.toLowerCase() === 'sÿenann') {
      return 'syenann';
    }
    
    // Handle different formats of faction names
    if (faction.toLowerCase() === 'hegemony') return 'hegemony-of-embersig';
    if (faction.toLowerCase() === 'tribes') return 'northern-tribes';
    if (faction.toLowerCase() === 'scions') return 'scions-of-yaldabaoth';
    
    return faction.toLowerCase();
  };

  const handleFilterChange = (filters: { search: string; faction: string; type: string }) => {
    const { search, faction, type } = filters;
    
    const filtered = units.filter(unit => {
      const matchesSearch = !search || 
        unit.name.toLowerCase().includes(search.toLowerCase()) || 
        (Array.isArray(unit.keywords) && unit.keywords.some((k: any) => {
          const keywordName = typeof k === 'string' ? k : k.name;
          return keywordName.toLowerCase().includes(search.toLowerCase());
        }));
      
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
