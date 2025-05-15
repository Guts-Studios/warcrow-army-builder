
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UnitFiltersProps {
  factions: any[];
  selectedFaction: string;
  onFactionChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
  showHidden: boolean;
  onShowHiddenChange: (value: boolean) => void;
}

export const UnitFilters: React.FC<UnitFiltersProps> = ({
  factions,
  selectedFaction,
  onFactionChange,
  searchQuery,
  onSearchChange,
  t,
  showHidden,
  onShowHiddenChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warcrow-gold/70 h-4 w-4" />
          <Input
            type="text"
            placeholder={t('searchUnits')}
            value={searchQuery}
            onChange={onSearchChange}
            className="pl-10 bg-warcrow-accent/50 border-warcrow-gold/30 text-warcrow-text placeholder:text-warcrow-muted/70"
          />
        </div>
        
        <Select
          value={selectedFaction}
          onValueChange={onFactionChange}
        >
          <SelectTrigger className="bg-warcrow-accent/50 border-warcrow-gold/30 text-warcrow-text">
            <SelectValue placeholder={t('selectFaction')} />
          </SelectTrigger>
          <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
            <SelectItem value="all">{t('allFactions')}</SelectItem>
            {factions.map(faction => (
              <SelectItem key={faction.id} value={faction.id}>
                {faction.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-2">
          <Switch 
            id="show-hidden" 
            checked={showHidden}
            onCheckedChange={onShowHiddenChange}
            className="data-[state=checked]:bg-warcrow-gold"
          />
          <Label htmlFor="show-hidden" className="text-warcrow-text cursor-pointer">
            {t('showHiddenUnits')}
          </Label>
        </div>
      </div>
    </div>
  );
};
