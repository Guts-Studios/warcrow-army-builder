
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UnitDataItem {
  id: string;
  name: string;
  faction: string;
  type: string;
  points: number;
  characteristics: {
    command?: number;
    availability?: number;
    highCommand?: boolean;
  };
  keywords: string[];
  special_rules: string[];
}

interface UnitDataResponseItem {
  id: string;
  name: string;
  faction: string;
  type: string;
  points: number;
  characteristics: any;
  keywords: string[];
  special_rules: string[];
  description: string;
  description_es: string;
  description_fr: string;
  name_es: string;
  name_fr: string;
  options: any[];
  created_at: string;
  updated_at: string;
}

const UnitDataTable: React.FC = () => {
  const [units, setUnits] = useState<UnitDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [factionFilter, setFactionFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  const fetchUnitData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('unit_data')
        .select('*')
        .order('faction')
        .order('name');

      if (error) throw error;
      
      // Convert Supabase response to UnitDataItem[]
      const unitItems: UnitDataItem[] = (data || []).map((item: UnitDataResponseItem) => ({
        id: item.id,
        name: item.name,
        faction: item.faction,
        type: item.type,
        points: item.points,
        characteristics: item.characteristics || {},
        keywords: item.keywords || [],
        special_rules: item.special_rules || []
      }));
      
      setUnits(unitItems);
      console.log('Fetched unit data:', data);
    } catch (error: any) {
      console.error("Error fetching unit data:", error);
      toast.error(`Failed to fetch unit data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnitData();
  }, []);

  const getUniqueValues = (field: string) => {
    if (field === 'faction') {
      return [...new Set(units.map(unit => unit.faction))].sort();
    } else if (field === 'type') {
      return [...new Set(units.map(unit => unit.type))].sort();
    }
    return [];
  };

  const filteredUnits = units.filter(unit => {
    const matchesSearch = searchTerm === '' || 
      unit.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFaction = factionFilter === '' || unit.faction === factionFilter;
    
    const matchesType = typeFilter === '' || unit.type === typeFilter;
    
    return matchesSearch && matchesFaction && matchesType;
  });

  const getCommandValue = (unit: UnitDataItem) => {
    return unit.characteristics && unit.characteristics.command !== undefined 
      ? unit.characteristics.command 
      : '-';
  };

  const getAvailability = (unit: UnitDataItem) => {
    return unit.characteristics && unit.characteristics.availability !== undefined 
      ? unit.characteristics.availability 
      : '-';
  };

  const isHighCommand = (unit: UnitDataItem) => {
    return unit.characteristics && unit.characteristics.highCommand === true;
  };

  const formatKeywords = (keywords: string[]) => {
    if (!keywords || keywords.length === 0) return '-';
    return keywords.join(', ');
  };

  const formatSpecialRules = (rules: string[]) => {
    if (!rules || rules.length === 0) return '-';
    return rules.join(', ');
  };

  return (
    <Card className="p-4 bg-black border-warcrow-gold/30">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          <h2 className="text-lg font-semibold text-warcrow-gold">Unit Database</h2>
          
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <Input
              placeholder="Search units..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-48 bg-black border-warcrow-gold/30 text-warcrow-text"
            />
            
            <Select value={factionFilter} onValueChange={setFactionFilter}>
              <SelectTrigger className="w-full lg:w-40 bg-black border-warcrow-gold/30 text-warcrow-text">
                <SelectValue placeholder="All Factions" />
              </SelectTrigger>
              <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
                <SelectItem value="">All Factions</SelectItem>
                {getUniqueValues('faction').map(faction => (
                  <SelectItem key={faction} value={faction}>
                    {faction}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-40 bg-black border-warcrow-gold/30 text-warcrow-text">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
                <SelectItem value="">All Types</SelectItem>
                {getUniqueValues('type').map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={fetchUnitData}
              className="border-warcrow-gold/30 text-warcrow-gold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="rounded border border-warcrow-gold/30 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
                <TableHead className="text-warcrow-gold">Faction</TableHead>
                <TableHead className="text-warcrow-gold">Unit Type</TableHead>
                <TableHead className="text-warcrow-gold">Unit Name</TableHead>
                <TableHead className="text-warcrow-gold">Command</TableHead>
                <TableHead className="text-warcrow-gold">AVB</TableHead>
                <TableHead className="text-warcrow-gold">Keywords</TableHead>
                <TableHead className="text-warcrow-gold">High Command</TableHead>
                <TableHead className="text-warcrow-gold">Points Cost</TableHead>
                <TableHead className="text-warcrow-gold">Special Rules</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-warcrow-text/70">Loading...</TableCell>
                </TableRow>
              ) : filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-warcrow-text/70">No unit data found</TableCell>
                </TableRow>
              ) : (
                filteredUnits.map((unit) => (
                  <TableRow key={unit.id} className="hover:bg-warcrow-accent/5">
                    <TableCell>{unit.faction}</TableCell>
                    <TableCell>{unit.type}</TableCell>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell>{getCommandValue(unit)}</TableCell>
                    <TableCell>{getAvailability(unit)}</TableCell>
                    <TableCell className="max-w-xs truncate">{formatKeywords(unit.keywords)}</TableCell>
                    <TableCell>{isHighCommand(unit) ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{unit.points}</TableCell>
                    <TableCell className="max-w-xs truncate">{formatSpecialRules(unit.special_rules)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {filteredUnits.length > 0 && (
          <div className="text-sm text-warcrow-text/70">
            Showing {filteredUnits.length} of {units.length} units
          </div>
        )}
      </div>
    </Card>
  );
};

export default UnitDataTable;
