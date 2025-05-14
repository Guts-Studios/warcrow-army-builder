
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { UnitFilters } from './UnitFilters';
import { UnitTable } from './UnitTable';
import { normalizeAndDeduplicate } from './utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const UnitExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [factionFilter, setFactionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [units, setUnits] = useState<any[]>([]);
  const { t } = useLanguage();
  
  // Fetch units directly from Supabase
  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('unit_data')
        .select('*')
        .order('faction')
        .order('name');
        
      if (error) throw error;
      
      // Format units to match the expected structure 
      const formattedUnits = data.map(unit => ({
        ...unit,
        id: unit.id,
        name: unit.name,
        faction: unit.faction,
        highCommand: unit.characteristics?.highCommand || false,
        pointsCost: unit.points || 0,
        keywords: unit.keywords || []
      }));
      
      setUnits(formattedUnits);
    } catch (error: any) {
      console.error("Error fetching units:", error);
      toast.error(`Failed to fetch unit data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch units on component mount
  useEffect(() => {
    fetchUnits();
  }, []);
  
  // Get normalized and deduplicated units
  const { deduplicatedUnits, factions, unitTypes } = useMemo(() => 
    normalizeAndDeduplicate(units), 
  [units]);
  
  // Filter and sort units
  const filteredUnits = useMemo(() => {
    return deduplicatedUnits.filter(unit => {
      // Name filter
      const nameMatch = unit.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Faction filter
      const factionMatch = factionFilter === 'all' || unit.faction === factionFilter;
      
      // Type filter
      let typeMatch = true;
      if (typeFilter !== 'all') {
        if (typeFilter === 'high-command') {
          typeMatch = unit.highCommand === true;
        } else if (typeFilter === 'character') {
          typeMatch = unit.keywords?.some(k => {
            const keywordName = typeof k === 'string' ? k : k.name;
            return keywordName === 'Character';
          }) && !unit.highCommand;
        } else if (typeFilter === 'troop') {
          typeMatch = !unit.highCommand && !unit.keywords?.some(k => {
            const keywordName = typeof k === 'string' ? k : k.name;
            return keywordName === 'Character';
          });
        }
      }
      
      return nameMatch && factionMatch && typeMatch;
    }).sort((a, b) => {
      // Sort by faction first, then by name
      if (a.faction !== b.faction) {
        return a.faction.localeCompare(b.faction);
      }
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, factionFilter, typeFilter, deduplicatedUnits]);

  return (
    <Card className="bg-warcrow-background border-warcrow-gold/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-warcrow-gold text-xl">{t('unitDatabase')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        
        <UnitTable 
          filteredUnits={filteredUnits}
          t={t}
          isLoading={isLoading}
        />
        
        <div className="text-sm text-warcrow-muted">
          {filteredUnits.length > 0 && (
            <p>
              {t('showing')} {filteredUnits.length} {filteredUnits.length === 1 ? t('unit') : t('units')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitExplorer;
