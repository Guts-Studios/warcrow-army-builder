import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Trash2, Save, X } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

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
  description?: string;
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
  const [editingUnit, setEditingUnit] = useState<UnitDataItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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
        special_rules: item.special_rules || [],
        description: item.description
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

  const updateUnit = async () => {
    if (!editingUnit) return;
    
    try {
      const { error } = await supabase
        .from('unit_data')
        .update({
          name: editingUnit.name,
          faction: editingUnit.faction,
          type: editingUnit.type,
          points: editingUnit.points,
          characteristics: editingUnit.characteristics,
          keywords: editingUnit.keywords,
          special_rules: editingUnit.special_rules,
          description: editingUnit.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUnit.id);

      if (error) throw error;
      
      toast.success('Unit updated successfully');
      setIsEditDialogOpen(false);
      fetchUnitData();
    } catch (error: any) {
      console.error("Error updating unit:", error);
      toast.error(`Failed to update unit: ${error.message}`);
    }
  };

  const deleteUnit = async (id: string) => {
    if (!confirm("Are you sure you want to delete this unit? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('unit_data')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Unit deleted successfully');
      fetchUnitData();
    } catch (error: any) {
      console.error("Error deleting unit:", error);
      toast.error(`Failed to delete unit: ${error.message}`);
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

  const handleEditUnit = (unit: UnitDataItem) => {
    setEditingUnit({...unit});
    setIsEditDialogOpen(true);
  };

  const handleInputChange = (field: string, value: any) => {
    if (!editingUnit) return;
    
    if (field === 'command' || field === 'availability') {
      setEditingUnit({
        ...editingUnit,
        characteristics: {
          ...editingUnit.characteristics,
          [field]: parseInt(value) || 0
        }
      });
    } else if (field === 'highCommand') {
      setEditingUnit({
        ...editingUnit,
        characteristics: {
          ...editingUnit.characteristics,
          highCommand: value === 'true'
        }
      });
    } else if (field === 'keywords' || field === 'special_rules') {
      setEditingUnit({
        ...editingUnit,
        [field]: value.split(',').map((item: string) => item.trim())
      });
    } else {
      setEditingUnit({
        ...editingUnit,
        [field]: field === 'points' ? parseInt(value) || 0 : value
      });
    }
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
                <SelectItem value="all-factions">All Factions</SelectItem>
                {getUniqueValues('faction').map(faction => (
                  faction ? (
                    <SelectItem key={faction} value={faction}>
                      {faction}
                    </SelectItem>
                  ) : null
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-40 bg-black border-warcrow-gold/30 text-warcrow-text">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
                <SelectItem value="all-types">All Types</SelectItem>
                {getUniqueValues('type').map(type => (
                  type ? (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ) : null
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
                <TableHead className="text-warcrow-gold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-warcrow-text/70">Loading...</TableCell>
                </TableRow>
              ) : filteredUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-warcrow-text/70">No unit data found</TableCell>
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
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditUnit(unit)}
                          className="h-8 w-8 p-0 text-warcrow-gold hover:text-warcrow-gold/80"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteUnit(unit.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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

      {/* Edit Unit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-warcrow-accent border-warcrow-gold/30 text-warcrow-text max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Edit Unit</DialogTitle>
          </DialogHeader>
          
          {editingUnit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-warcrow-text/80 mb-1 block">Unit Name</label>
                  <Input
                    value={editingUnit.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-black/60 border-warcrow-gold/30"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-warcrow-text/80 mb-1 block">Faction</label>
                  <Input
                    value={editingUnit.faction}
                    onChange={(e) => handleInputChange('faction', e.target.value)}
                    className="bg-black/60 border-warcrow-gold/30"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-warcrow-text/80 mb-1 block">Unit Type</label>
                  <Input
                    value={editingUnit.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="bg-black/60 border-warcrow-gold/30"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-warcrow-text/80 mb-1 block">Points Cost</label>
                  <Input
                    type="number"
                    value={editingUnit.points}
                    onChange={(e) => handleInputChange('points', e.target.value)}
                    className="bg-black/60 border-warcrow-gold/30"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-warcrow-text/80 mb-1 block">Command</label>
                  <Input
                    type="number"
                    value={editingUnit.characteristics?.command || ''}
                    onChange={(e) => handleInputChange('command', e.target.value)}
                    className="bg-black/60 border-warcrow-gold/30"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-warcrow-text/80 mb-1 block">Availability</label>
                  <Input
                    type="number"
                    value={editingUnit.characteristics?.availability || ''}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    className="bg-black/60 border-warcrow-gold/30"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-warcrow-text/80 mb-1 block">High Command</label>
                  <Select 
                    value={String(editingUnit.characteristics?.highCommand || false)} 
                    onValueChange={(val) => handleInputChange('highCommand', val)}
                  >
                    <SelectTrigger className="bg-black/60 border-warcrow-gold/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-warcrow-text/80 mb-1 block">Keywords (comma separated)</label>
                  <Input
                    value={editingUnit.keywords.join(', ')}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    className="bg-black/60 border-warcrow-gold/30"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-warcrow-text/80 mb-1 block">Special Rules (comma separated)</label>
                  <Input
                    value={editingUnit.special_rules.join(', ')}
                    onChange={(e) => handleInputChange('special_rules', e.target.value)}
                    className="bg-black/60 border-warcrow-gold/30"
                  />
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="text-sm text-warcrow-text/80 mb-1 block">Description</label>
                <Textarea
                  value={editingUnit.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-black/60 border-warcrow-gold/30 min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="border-warcrow-gold/30 text-warcrow-text"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={updateUnit}
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UnitDataTable;
