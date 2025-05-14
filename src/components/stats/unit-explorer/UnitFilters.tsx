
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatFactionName } from './utils';

interface UnitFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  factionFilter: string;
  setFactionFilter: (faction: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  factions: string[];
  unitTypes: string[];
  t: (key: string) => string;
}

export const UnitFilters: React.FC<UnitFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  factionFilter,
  setFactionFilter,
  typeFilter,
  setTypeFilter,
  factions,
  unitTypes,
  t
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <Input
        placeholder={t('searchUnits')}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-warcrow-accent/50 border-warcrow-gold/30"
      />
      
      <Select value={factionFilter} onValueChange={setFactionFilter}>
        <SelectTrigger className="w-full md:w-[180px] bg-warcrow-accent/50 border-warcrow-gold/30">
          <SelectValue placeholder={t('allFactions')} />
        </SelectTrigger>
        <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
          <SelectItem value="all">{t('allFactions')}</SelectItem>
          {factions.map(faction => (
            <SelectItem key={faction} value={faction}>
              {formatFactionName(faction)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-full md:w-[180px] bg-warcrow-accent/50 border-warcrow-gold/30">
          <SelectValue placeholder={t('allTypes')} />
        </SelectTrigger>
        <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
          <SelectItem value="all">{t('allTypes')}</SelectItem>
          {unitTypes.map((type: string) => (
            <SelectItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
