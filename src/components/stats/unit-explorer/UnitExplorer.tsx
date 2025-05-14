
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { units as allUnits } from '@/data/factions';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslateKeyword } from "@/utils/translation";
import { UnitFilters } from './UnitFilters';
import { UnitTable } from './UnitTable';
import { normalizeAndDeduplicate } from './utils';

const UnitExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [factionFilter, setFactionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { t } = useLanguage();

  // Get normalized and deduplicated units
  const { deduplicatedUnits, factions, unitTypes } = useMemo(() => 
    normalizeAndDeduplicate(allUnits), 
  []);
  
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
