
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface UnitFiltersProps {
  onFilterChange: (filters: { search: string; faction: string; type: string }) => void;
  factions: string[];
  unitTypes: string[];
  t: (key: string) => string;
}

export const UnitFilters: React.FC<UnitFiltersProps> = ({
  onFilterChange,
  factions,
  unitTypes,
  t
}) => {
  const [search, setSearch] = useState('');
  const [faction, setFaction] = useState('');
  const [type, setType] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    onFilterChange({ search: newSearch, faction, type });
  };

  const handleFactionChange = (newFaction: string) => {
    setFaction(newFaction);
    onFilterChange({ search, faction: newFaction, type });
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    onFilterChange({ search, faction, type: newType });
  };

  const clearFilters = () => {
    setSearch('');
    setFaction('');
    setType('');
    onFilterChange({ search: '', faction: '', type: '' });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <Input
          value={search}
          onChange={handleSearchChange}
          placeholder={t('searchUnits')}
          className="pl-9 bg-warcrow-accent/10 border-warcrow-gold/30"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-warcrow-gold/60" />
      </div>
      
      <Select value={faction} onValueChange={handleFactionChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-warcrow-accent/10 border-warcrow-gold/30">
          <SelectValue placeholder={t('allFactions')} />
        </SelectTrigger>
        <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
          <SelectItem value="">{t('allFactions')}</SelectItem>
          {factions.map(faction => (
            <SelectItem key={faction} value={faction}>{faction}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={type} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-full sm:w-[180px] bg-warcrow-accent/10 border-warcrow-gold/30">
          <SelectValue placeholder={t('allTypes')} />
        </SelectTrigger>
        <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
          <SelectItem value="">{t('allTypes')}</SelectItem>
          {unitTypes.map(type => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {(search || faction || type) && (
        <Button 
          variant="outline" 
          size="icon"
          onClick={clearFilters}
          className="border-warcrow-gold/30"
          title={t('clearFilters')}
        >
          <X className="h-4 w-4 text-warcrow-gold/60" />
        </Button>
      )}
    </div>
  );
};
