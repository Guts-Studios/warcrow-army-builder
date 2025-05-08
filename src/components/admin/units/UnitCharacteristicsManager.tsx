
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, Save, Pencil } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { batchTranslate } from "@/utils/translation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";

interface CharacteristicItem {
  id?: string;
  name: string;
  description: string;
  description_es?: string;
  description_fr?: string;
}

const UnitCharacteristicsManager: React.FC = () => {
  const [characteristics, setCharacteristics] = useState<CharacteristicItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCharacteristic, setEditingCharacteristic] = useState<CharacteristicItem | null>(null);
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    fetchCharacteristics();
  }, []);

  const fetchCharacteristics = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('unit_characteristics')
        .select('*')
        .order('name');

      if (error) throw error;
      setCharacteristics(data || []);
    } catch (error: any) {
      console.error("Error fetching characteristics:", error);
      toast.error(`Failed to fetch characteristics: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (characteristic: CharacteristicItem) => {
    setEditingCharacteristic({ ...characteristic });
  };

  const saveCharacteristic = async () => {
    if (!editingCharacteristic) return;
    
    try {
      const { data, error } = await supabase
        .from('unit_characteristics')
        .upsert({
          id: editingCharacteristic.id,
          name: editingCharacteristic.name,
          description: editingCharacteristic.description,
          description_es: editingCharacteristic.description_es,
          description_fr: editingCharacteristic.description_fr
        }, { onConflict: 'id' });

      if (error) throw error;
      
      setCharacteristics(characteristics.map(c => c.id === editingCharacteristic.id ? editingCharacteristic : c));
      setEditingCharacteristic(null);
      toast.success(`Saved characteristic: ${editingCharacteristic.name}`);
    } catch (error: any) {
      console.error("Error saving characteristic:", error);
      toast.error(`Failed to save: ${error.message}`);
    }
  };

  const translateAllCharacteristics = async (targetLanguage: string) => {
    if (characteristics.length === 0) {
      toast.error("No characteristics to translate");
      return;
    }

    setTranslationInProgress(true);
    setTranslationProgress(0);
    
    try {
      const itemsToTranslate = characteristics
        .filter(c => c.description && (!c.description_es || targetLanguage === 'fr' && !c.description_fr))
        .map(c => ({
          id: c.id || '',
          key: 'description',
          source: c.description
        }));
      
      if (itemsToTranslate.length === 0) {
        toast.info("All characteristics already have translations");
        setTranslationInProgress(false);
        return;
      }

      // Track progress
      const total = itemsToTranslate.length;
      let completed = 0;

      // Process in batches
      const batchSize = 10;
      for (let i = 0; i < itemsToTranslate.length; i += batchSize) {
        const batch = itemsToTranslate.slice(i, i + batchSize);
        const results = await batchTranslate(batch, targetLanguage, true, 'unit_characteristics');
        
        completed += batch.length;
        setTranslationProgress(Math.round((completed / total) * 100));
        
        // Small delay between batches
        if (i + batchSize < itemsToTranslate.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      await fetchCharacteristics(); // Refresh characteristic list
      toast.success(`Successfully translated ${itemsToTranslate.length} characteristics`);
    } catch (error: any) {
      console.error("Error translating characteristics:", error);
      toast.error(`Translation error: ${error.message}`);
    } finally {
      setTranslationInProgress(false);
    }
  };

  return (
    <Card className="p-4 bg-black border-warcrow-gold/30">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-lg font-semibold text-warcrow-gold">Characteristics Management</h2>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="border-warcrow-gold/50 text-warcrow-gold"
              onClick={() => translateAllCharacteristics('es')}
              disabled={isLoading || translationInProgress}
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate to Spanish
            </Button>
            <Button 
              variant="outline" 
              className="border-warcrow-gold/50 text-warcrow-gold"
              onClick={() => translateAllCharacteristics('fr')}
              disabled={isLoading || translationInProgress}
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate to French
            </Button>
          </div>
        </div>

        {translationInProgress && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-warcrow-text/90">Translation progress</span>
              <span className="text-sm font-medium text-warcrow-gold">{translationProgress}%</span>
            </div>
            <Progress value={translationProgress} className="h-1.5 bg-warcrow-gold/20" />
          </div>
        )}
        
        {editingCharacteristic && (
          <Card className="p-4 border-warcrow-gold bg-black/70">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Characteristic Name</label>
                <Input 
                  value={editingCharacteristic.name}
                  onChange={(e) => setEditingCharacteristic({...editingCharacteristic, name: e.target.value})}
                  className="bg-black border-warcrow-gold/50"
                />
              </div>
              
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Description (English)</label>
                <Textarea 
                  value={editingCharacteristic.description}
                  onChange={(e) => setEditingCharacteristic({...editingCharacteristic, description: e.target.value})}
                  className="bg-black border-warcrow-gold/50 h-24"
                />
              </div>
              
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Description (Spanish)</label>
                <Textarea 
                  value={editingCharacteristic.description_es || ''}
                  onChange={(e) => setEditingCharacteristic({...editingCharacteristic, description_es: e.target.value})}
                  className="bg-black border-warcrow-gold/50 h-24"
                />
              </div>
              
              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Description (French)</label>
                <Textarea 
                  value={editingCharacteristic.description_fr || ''}
                  onChange={(e) => setEditingCharacteristic({...editingCharacteristic, description_fr: e.target.value})}
                  className="bg-black border-warcrow-gold/50 h-24"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingCharacteristic(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
                  onClick={saveCharacteristic}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        <div className="rounded border border-warcrow-gold/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
                <TableHead className="text-warcrow-gold">Characteristic</TableHead>
                <TableHead className="text-warcrow-gold">Description</TableHead>
                <TableHead className="text-warcrow-gold">Spanish</TableHead>
                <TableHead className="text-warcrow-gold">French</TableHead>
                <TableHead className="text-warcrow-gold w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-warcrow-text/70">Loading...</TableCell>
                </TableRow>
              ) : characteristics.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-warcrow-text/70">No characteristics found</TableCell>
                </TableRow>
              ) : (
                characteristics.map((characteristic) => (
                  <TableRow key={characteristic.id} className="hover:bg-warcrow-accent/5">
                    <TableCell className="font-medium text-warcrow-text">{characteristic.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-warcrow-text">{characteristic.description}</TableCell>
                    <TableCell className="text-warcrow-text">
                      {characteristic.description_es ? '✓' : '—'}
                    </TableCell>
                    <TableCell className="text-warcrow-text">
                      {characteristic.description_fr ? '✓' : '—'}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => startEditing(characteristic)}
                      >
                        <Pencil className="h-4 w-4 text-warcrow-gold" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default UnitCharacteristicsManager;
