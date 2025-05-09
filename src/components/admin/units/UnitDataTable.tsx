
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw, Trash2, Save, X, Languages } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from '@/contexts/LanguageContext';
import { batchTranslate } from '@/utils/translation/batchTranslate';

interface UnitDataItem {
  id: string;
  name: string;
  name_es?: string;
  name_fr?: string;
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
  description_es?: string;
  description_fr?: string;
}

interface FactionItem {
  id: string;
  name: string;
  name_es?: string;
  name_fr?: string;
}

// Map to normalize older faction IDs to canonical ones
const factionIdMap: Record<string, string> = {
  'hegemony': 'hegemony-of-embersig',
  'tribes': 'northern-tribes',
  'scions': 'scions-of-yaldabaoth'
};

const UnitDataTable: React.FC = () => {
  const [units, setUnits] = useState<UnitDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [factionFilter, setFactionFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [editingUnit, setEditingUnit] = useState<UnitDataItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTranslationTab, setActiveTranslationTab] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [factions, setFactions] = useState<FactionItem[]>([]);
  const [factionDisplayNames, setFactionDisplayNames] = useState<Record<string, string>>({});
  const { language } = useLanguage();

  // Fetch factions from the database
  const fetchFactions = async () => {
    try {
      const { data, error } = await supabase
        .from('factions')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setFactions(data || []);
      
      // Create mapping of faction IDs to display names
      const displayNames: Record<string, string> = {};
      data?.forEach(faction => {
        displayNames[faction.id] = faction.name;
      });
      
      setFactionDisplayNames(displayNames);
    } catch (error: any) {
      console.error("Error fetching factions:", error);
      toast.error(`Failed to fetch factions: ${error.message}`);
    }
  };
  
  const fetchUnitData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('unit_data')
        .select('*')
        .order('faction')
        .order('name');

      if (error) throw error;
      
      // Process the unit data to ensure consistency and deduplicate
      const processedData = normalizeAndDeduplicate(data || []);
      setUnits(processedData);
    } catch (error: any) {
      console.error("Error fetching unit data:", error);
      toast.error(`Failed to fetch unit data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Normalize faction IDs and deduplicate units
  const normalizeAndDeduplicate = (data: any[]): UnitDataItem[] => {
    // First, normalize faction IDs
    const normalizedData = data.map(item => {
      // Check if the faction ID needs to be normalized
      const normalizedFaction = factionIdMap[item.faction] || item.faction;
      
      return {
        ...item,
        faction: normalizedFaction,
        characteristics: item.characteristics || {},
        keywords: item.keywords || [],
        special_rules: item.special_rules || []
      };
    });
    
    // Then deduplicate based on name and faction
    const uniqueUnits: {[key: string]: UnitDataItem} = {};
    
    normalizedData.forEach(item => {
      const key = `${item.name}_${item.faction}`;
      
      // Only add if this combination doesn't exist or if this is the newer entry
      if (!uniqueUnits[key] || new Date(item.updated_at) > new Date(uniqueUnits[key].updated_at)) {
        uniqueUnits[key] = item;
      }
    });
    
    return Object.values(uniqueUnits);
  };

  const updateUnit = async () => {
    if (!editingUnit) return;
    
    try {
      const { error } = await supabase
        .from('unit_data')
        .update({
          name: editingUnit.name,
          name_es: editingUnit.name_es,
          name_fr: editingUnit.name_fr,
          faction: editingUnit.faction,
          type: editingUnit.type,
          points: editingUnit.points,
          characteristics: editingUnit.characteristics,
          keywords: editingUnit.keywords,
          special_rules: editingUnit.special_rules,
          description: editingUnit.description,
          description_es: editingUnit.description_es,
          description_fr: editingUnit.description_fr,
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

  const translateUnitData = async () => {
    if (!editingUnit) return;
    
    setIsTranslating(true);
    try {
      let translationUpdates: Partial<UnitDataItem> = {};
      
      // Determine which fields to translate based on the active tab
      if (activeTranslationTab === 'es') {
        // Translate to Spanish
        const nameResult = await batchTranslate([editingUnit.name], 'es') as string[];
        const descriptionResult = editingUnit.description 
          ? await batchTranslate([editingUnit.description], 'es') as string[]
          : [''];
          
        translationUpdates = {
          name_es: nameResult[0],
          description_es: descriptionResult[0]
        };
      } else if (activeTranslationTab === 'fr') {
        // Translate to French
        const nameResult = await batchTranslate([editingUnit.name], 'fr') as string[];
        const descriptionResult = editingUnit.description 
          ? await batchTranslate([editingUnit.description], 'fr') as string[]
          : [''];
          
        translationUpdates = {
          name_fr: nameResult[0],
          description_fr: descriptionResult[0]
        };
      }
      
      setEditingUnit({
        ...editingUnit,
        ...translationUpdates
      });
      
      toast.success(`Translation to ${activeTranslationTab === 'es' ? 'Spanish' : 'French'} completed`);
    } catch (error: any) {
      console.error("Translation error:", error);
      toast.error(`Failed to translate: ${error.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    fetchFactions();
    fetchUnitData();
  }, []);

  const getUniqueValues = (field: keyof UnitDataItem) => {
    if (field === 'type') {
      return [...new Set(units.map(unit => unit.type))].filter(Boolean).sort();
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
    setActiveTranslationTab('en'); // Reset to English tab when opening edit dialog
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
        [field]: value.split(',').map((item: string) => item.trim()).filter(Boolean)
      });
    } else {
      setEditingUnit({
        ...editingUnit,
        [field]: field === 'points' ? parseInt(value) || 0 : value
      });
    }
  };

  // Handle filter value changes
  const handleFactionFilterChange = (value: string) => {
    setFactionFilter(value === 'all-factions' ? '' : value);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value === 'all-types' ? '' : value);
  };

  // Get faction display name from faction ID
  const getFactionDisplayName = (factionId: string): string => {
    return factionDisplayNames[factionId] || factionId;
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
            
            <Select value={factionFilter || 'all-factions'} onValueChange={handleFactionFilterChange}>
              <SelectTrigger className="w-full lg:w-40 bg-black border-warcrow-gold/30 text-warcrow-text">
                <SelectValue placeholder="All Factions" />
              </SelectTrigger>
              <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
                <SelectItem value="all-factions">All Factions</SelectItem>
                {factions.map(faction => (
                  <SelectItem key={faction.id} value={faction.id}>
                    {faction.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter || 'all-types'} onValueChange={handleTypeFilterChange}>
              <SelectTrigger className="w-full lg:w-40 bg-black border-warcrow-gold/30 text-warcrow-text">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
                <SelectItem value="all-types">All Types</SelectItem>
                {getUniqueValues('type').map((type) => (
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
                    <TableCell>{getFactionDisplayName(unit.faction)}</TableCell>
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
        <DialogContent className="bg-warcrow-accent border-warcrow-gold/30 text-warcrow-text max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Edit Unit</DialogTitle>
          </DialogHeader>
          
          {editingUnit && (
            <>
              <Tabs value={activeTranslationTab} onValueChange={setActiveTranslationTab} className="w-full mt-2">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="en" className="text-sm">English</TabsTrigger>
                  <TabsTrigger value="es" className="text-sm">Español</TabsTrigger>
                  <TabsTrigger value="fr" className="text-sm">Français</TabsTrigger>
                </TabsList>
                
                {/* English Content */}
                <TabsContent value="en" className="pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Select 
                          value={editingUnit.faction}
                          onValueChange={(val) => handleInputChange('faction', val)}
                        >
                          <SelectTrigger className="bg-black/60 border-warcrow-gold/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-warcrow-accent border-warcrow-gold/30">
                            {factions.map(faction => (
                              <SelectItem key={faction.id} value={faction.id}>
                                {faction.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                </TabsContent>
                
                {/* Spanish Content */}
                <TabsContent value="es" className="pt-2">
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      onClick={translateUnitData}
                      disabled={isTranslating}
                      className="border-warcrow-gold/30 text-warcrow-gold"
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      {isTranslating ? 'Translating...' : 'Translate to Spanish'}
                    </Button>
                  </div>
                
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Unit Name (Spanish)</label>
                      <Input
                        value={editingUnit.name_es || ''}
                        onChange={(e) => handleInputChange('name_es', e.target.value)}
                        className="bg-black/60 border-warcrow-gold/30"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Description (Spanish)</label>
                      <Textarea
                        value={editingUnit.description_es || ''}
                        onChange={(e) => handleInputChange('description_es', e.target.value)}
                        className="bg-black/60 border-warcrow-gold/30 min-h-[150px]"
                      />
                    </div>
                    
                    {/* Show original English for reference */}
                    <div className="p-3 bg-black/30 border border-warcrow-gold/20 rounded-md">
                      <h4 className="text-sm font-medium text-warcrow-gold mb-2">English Reference</h4>
                      <div className="space-y-2 text-sm text-warcrow-text/80">
                        <p><span className="font-medium">Name:</span> {editingUnit.name}</p>
                        {editingUnit.description && (
                          <p><span className="font-medium">Description:</span> {editingUnit.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* French Content */}
                <TabsContent value="fr" className="pt-2">
                  <div className="flex justify-end mb-4">
                    <Button 
                      variant="outline" 
                      onClick={translateUnitData}
                      disabled={isTranslating}
                      className="border-warcrow-gold/30 text-warcrow-gold"
                    >
                      <Languages className="h-4 w-4 mr-2" />
                      {isTranslating ? 'Translating...' : 'Translate to French'}
                    </Button>
                  </div>
                
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Unit Name (French)</label>
                      <Input
                        value={editingUnit.name_fr || ''}
                        onChange={(e) => handleInputChange('name_fr', e.target.value)}
                        className="bg-black/60 border-warcrow-gold/30"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-warcrow-text/80 mb-1 block">Description (French)</label>
                      <Textarea
                        value={editingUnit.description_fr || ''}
                        onChange={(e) => handleInputChange('description_fr', e.target.value)}
                        className="bg-black/60 border-warcrow-gold/30 min-h-[150px]"
                      />
                    </div>
                    
                    {/* Show original English for reference */}
                    <div className="p-3 bg-black/30 border border-warcrow-gold/20 rounded-md">
                      <h4 className="text-sm font-medium text-warcrow-gold mb-2">English Reference</h4>
                      <div className="space-y-2 text-sm text-warcrow-text/80">
                        <p><span className="font-medium">Name:</span> {editingUnit.name}</p>
                        {editingUnit.description && (
                          <p><span className="font-medium">Description:</span> {editingUnit.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
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
