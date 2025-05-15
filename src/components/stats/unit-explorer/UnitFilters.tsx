
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export interface UnitFiltersProps {
  onFilterChange: (filters: { searchQuery: string; selectedFaction: string; }) => void;
  factions: { id: string; name: string; }[];
  isLoading: boolean;
}

export const UnitFilters: React.FC<UnitFiltersProps> = ({
  onFilterChange,
  factions,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFaction, setSelectedFaction] = useState<string>("all");
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    onFilterChange({ searchQuery: newQuery, selectedFaction });
  };

  const handleFactionChange = (newFaction: string) => {
    setSelectedFaction(newFaction);
    onFilterChange({ searchQuery, selectedFaction: newFaction });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedFaction('all');
    onFilterChange({ searchQuery: '', selectedFaction: 'all' });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold">Unit Explorer</h1>
      
      <div className="flex flex-wrap gap-2">
        <Select value={selectedFaction} onValueChange={handleFactionChange} disabled={isLoading}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Faction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Factions</SelectItem>
            {factions?.map(faction => (
              <SelectItem key={faction.id} value={faction.id}>{faction.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input
          placeholder="Search units..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-60"
          disabled={isLoading}
        />

        {(searchQuery || selectedFaction !== 'all') && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={clearFilters}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default UnitFilters;
