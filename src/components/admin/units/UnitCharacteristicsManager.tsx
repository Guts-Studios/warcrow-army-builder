
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages, Save, Pencil, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { batchTranslate } from "@/utils/translation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { useTranslateKeyword } from "@/utils/translationUtils";

interface CharacteristicItem {
  id?: string;
  name: string;
  name_es?: string;
  name_fr?: string;
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
  const { translateCharacteristic } = useTranslateKeyword();

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
          name_es: editingCharacteristic.name_es,
          name_fr: editingCharacteristic.name_fr,
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
  
  const translateAllCharacteristicsNames = async (targetLanguage: string) => {
    if (characteristics.length === 0) {
      toast.error("No characteristics to translate");
      return;
    }
    
    setTranslationInProgress(true);
    setTranslationProgress(0);
    
    try {
      // Filter characteristics missing translations
      const missingTranslations = characteristics.filter(c => {
        if (targetLanguage === 'es' && !c.name_es) return true;
        if (targetLanguage === 'fr' && !c.name_fr) return true;
        return false;
      });
      
      if (missingTranslations.length === 0) {
        toast.info("All characteristic names already have translations");
        setTranslationInProgress(false);
        return;
      }
      
      // Call the dedicated edge function for translations
      const { data, error } = await supabase.functions.invoke('translate-characteristics', {
        body: {
          characteristics: missingTranslations,
          targetLanguage: targetLanguage
        }
      });
      
      if (error || !data || !data.translations) {
        throw new Error(error?.message || 'Failed to translate characteristics');
      }
      
      // Update the database with translations
      let completedCount = 0;
      const totalCount = data.translations.length;
      
      for (const item of data.translations) {
        const { id, translation } = item;
        
        const { error: updateError } = await supabase
          .from('unit_characteristics')
          .update({ 
            [targetLanguage === 'es' ? 'name_es' : 'name_fr']: translation 
          })
          .eq('id', id);
          
        if (updateError) {
          console.error("Error updating translation:", updateError);
          toast.error(`Error updating translation for: ${item.name}`);
        }
        
        completedCount++;
        setTranslationProgress(Math.round((completedCount / totalCount) * 100));
      }
      
      await fetchCharacteristics(); // Refresh the list
      toast.success(`Successfully translated ${completedCount} characteristic names to ${targetLanguage === 'es' ? 'Spanish' : 'French'}`);
    } catch (error: any) {
      console.error("Error translating characteristics:", error);
      toast.error(`Translation error: ${error.message}`);
    } finally {
      setTranslationInProgress(false);
    }
  };
  
  const translateAllCharacteristicsDescriptions = async (targetLanguage: string) => {
    if (characteristics.length === 0) {
      toast.error("No characteristics to translate");
      return;
    }

    setTranslationInProgress(true);
    setTranslationProgress(0);
    
    try {
      // Prepare items for translation - only descriptions
      const itemsToTranslate = characteristics
        .filter(c => c.description && (targetLanguage === 'es' && !c.description_es || targetLanguage === 'fr' && !c.description_fr))
        .map(c => ({
          id: c.id || '',
          key: targetLanguage === 'es' ? 'description_es' : 'description_fr',
          source: c.description
        }));
      
      if (itemsToTranslate.length === 0) {
        toast.info("All characteristic descriptions already have translations");
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
      toast.success(`Successfully translated ${itemsToTranslate.length} characteristic descriptions`);
    } catch (error: any) {
      console.error("Error translating characteristics:", error);
      toast.error(`Translation error: ${error.message}`);
    } finally {
      setTranslationInProgress(false);
    }
  };

  const getMissingTranslationsCount = (language: string) => {
    let namesMissing = 0;
    let descriptionsMissing = 0;
    
    characteristics.forEach(c => {
      if (language === 'es') {
        if (!c.name_es || c.name_es === c.name) namesMissing++;
        if (!c.description_es && c.description) descriptionsMissing++;
      } else if (language === 'fr') {
        if (!c.name_fr || c.name_fr === c.name) namesMissing++;
        if (!c.description_fr && c.description) descriptionsMissing++;
      }
    });
    
    return { namesMissing, descriptionsMissing };
  };
  
  const { namesMissing: spanishNamesMissing, descriptionsMissing: spanishDescMissing } = getMissingTranslationsCount('es');
  const { namesMissing: frenchNamesMissing, descriptionsMissing: frenchDescMissing } = getMissingTranslationsCount('fr');

  return (
    <Card className="p-4 bg-black border-warcrow-gold/30">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-lg font-semibold text-warcrow-gold">Characteristics Management</h2>
          
          <div className="flex gap-2 flex-wrap">
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-warcrow-gold/50 text-warcrow-gold"
                  onClick={() => translateAllCharacteristicsNames('es')}
                  disabled={isLoading || translationInProgress || spanishNamesMissing === 0}
                  size="sm"
                >
                  <Languages className="h-4 w-4 mr-1" />
                  Names to Spanish {spanishNamesMissing > 0 && `(${spanishNamesMissing})`}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-warcrow-gold/50 text-warcrow-gold"
                  onClick={() => translateAllCharacteristicsDescriptions('es')}
                  disabled={isLoading || translationInProgress || spanishDescMissing === 0}
                  size="sm"
                >
                  <Languages className="h-4 w-4 mr-1" />
                  Descriptions to Spanish {spanishDescMissing > 0 && `(${spanishDescMissing})`}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="border-warcrow-gold/50 text-warcrow-gold"
                  onClick={() => translateAllCharacteristicsNames('fr')}
                  disabled={isLoading || translationInProgress || frenchNamesMissing === 0}
                  size="sm"
                >
                  <Languages className="h-4 w-4 mr-1" />
                  Names to French {frenchNamesMissing > 0 && `(${frenchNamesMissing})`}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-warcrow-gold/50 text-warcrow-gold"
                  onClick={() => translateAllCharacteristicsDescriptions('fr')}
                  disabled={isLoading || translationInProgress || frenchDescMissing === 0}
                  size="sm"
                >
                  <Languages className="h-4 w-4 mr-1" />
                  Descriptions to French {frenchDescMissing > 0 && `(${frenchDescMissing})`}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {(spanishNamesMissing > 0 || frenchNamesMissing > 0 || spanishDescMissing > 0 || frenchDescMissing > 0) && (
          <div className="p-2 border border-amber-500/30 rounded bg-amber-500/10 flex items-start gap-2">
            <AlertTriangle className="text-amber-500 h-5 w-5 mt-0.5" />
            <div className="text-sm text-warcrow-text">
              <p className="font-medium">Missing translations detected:</p>
              <ul className="list-disc list-inside mt-1 ml-1 space-y-0.5">
                {spanishNamesMissing > 0 && <li>{spanishNamesMissing} characteristic names missing Spanish translations</li>}
                {spanishDescMissing > 0 && <li>{spanishDescMissing} characteristic descriptions missing Spanish translations</li>}
                {frenchNamesMissing > 0 && <li>{frenchNamesMissing} characteristic names missing French translations</li>}
                {frenchDescMissing > 0 && <li>{frenchDescMissing} characteristic descriptions missing French translations</li>}
              </ul>
            </div>
          </div>
        )}

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
                <label className="text-sm text-warcrow-text/90 mb-1 block">Characteristic Name (English)</label>
                <Input 
                  value={editingCharacteristic.name}
                  onChange={(e) => setEditingCharacteristic({...editingCharacteristic, name: e.target.value})}
                  className="bg-black border-warcrow-gold/50"
                />
              </div>

              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Characteristic Name (Spanish)</label>
                <Input 
                  value={editingCharacteristic.name_es || ''}
                  onChange={(e) => setEditingCharacteristic({...editingCharacteristic, name_es: e.target.value})}
                  className="bg-black border-warcrow-gold/50"
                />
              </div>

              <div>
                <label className="text-sm text-warcrow-text/90 mb-1 block">Characteristic Name (French)</label>
                <Input 
                  value={editingCharacteristic.name_fr || ''}
                  onChange={(e) => setEditingCharacteristic({...editingCharacteristic, name_fr: e.target.value})}
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
                <TableHead className="text-warcrow-gold">Spanish Name</TableHead>
                <TableHead className="text-warcrow-gold">Spanish Desc</TableHead>
                <TableHead className="text-warcrow-gold">French Name</TableHead>
                <TableHead className="text-warcrow-gold">French Desc</TableHead>
                <TableHead className="text-warcrow-gold w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-warcrow-text/70">Loading...</TableCell>
                </TableRow>
              ) : characteristics.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-warcrow-text/70">No characteristics found</TableCell>
                </TableRow>
              ) : (
                characteristics.map((characteristic) => (
                  <TableRow key={characteristic.id} className="hover:bg-warcrow-accent/5">
                    <TableCell className="font-medium text-warcrow-text">
                      {language !== 'en' 
                        ? translateCharacteristic(characteristic.name, language) || characteristic.name
                        : characteristic.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-warcrow-text">{characteristic.description}</TableCell>
                    <TableCell className={`text-warcrow-text ${(!characteristic.name_es || characteristic.name_es === characteristic.name) ? 'text-red-500' : ''}`}>
                      {characteristic.name_es ? (characteristic.name_es === characteristic.name ? '=' : '✓') : '—'}
                    </TableCell>
                    <TableCell className="text-warcrow-text">
                      {characteristic.description_es ? '✓' : '—'}
                    </TableCell>
                    <TableCell className={`text-warcrow-text ${(!characteristic.name_fr || characteristic.name_fr === characteristic.name) ? 'text-red-500' : ''}`}>
                      {characteristic.name_fr ? (characteristic.name_fr === characteristic.name ? '=' : '✓') : '—'}
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
