
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { batchTranslate } from "@/utils/translation";

interface CharacteristicItem {
  id?: string;
  name: string;
  name_es?: string;
  name_fr?: string;
  description: string;
  description_es?: string;
  description_fr?: string;
}

export const useCharacteristics = () => {
  const [characteristics, setCharacteristics] = useState<CharacteristicItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCharacteristic, setEditingCharacteristic] = useState<CharacteristicItem | null>(null);
  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);

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
      
      setCharacteristics(characteristics.map(c => 
        c.id === editingCharacteristic.id ? editingCharacteristic : c
      ));
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
      // Prepare characteristics that may need translation
      const characteristicsForTranslation = characteristics.map(c => ({
        id: c.id,
        name: c.name,
        name_es: c.name_es,
        name_fr: c.name_fr
      }));
      
      // Call the dedicated edge function for translations
      const { data, error } = await supabase.functions.invoke('translate-characteristics', {
        body: {
          characteristics: characteristicsForTranslation,
          targetLanguage: targetLanguage
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to translate characteristics');
      }
      
      if (!data || !data.translations) {
        throw new Error('No translation data received');
      }
      
      if (data.translations.length === 0) {
        toast.info(`All characteristic names already have ${targetLanguage === 'es' ? 'Spanish' : 'French'} translations`);
        setTranslationInProgress(false);
        return;
      }
      
      console.log(`Received ${data.translations.length} translated characteristics`);
      
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
        .filter(c => c.description && (
          targetLanguage === 'es' && (!c.description_es || c.description_es.trim() === '') || 
          targetLanguage === 'fr' && (!c.description_fr || c.description_fr.trim() === '')
        ))
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
        if (!c.name_es || c.name_es.trim() === '' || c.name_es === c.name) namesMissing++;
        if ((!c.description_es || c.description_es.trim() === '') && c.description) descriptionsMissing++;
      } else if (language === 'fr') {
        if (!c.name_fr || c.name_fr.trim() === '' || c.name_fr === c.name) namesMissing++;
        if ((!c.description_fr || c.description_fr.trim() === '') && c.description) descriptionsMissing++;
      }
    });
    
    return { namesMissing, descriptionsMissing };
  };

  return {
    characteristics,
    isLoading,
    editingCharacteristic,
    translationInProgress,
    translationProgress,
    setEditingCharacteristic,
    fetchCharacteristics,
    startEditing,
    saveCharacteristic,
    translateAllCharacteristicsNames,
    translateAllCharacteristicsDescriptions,
    getMissingTranslationsCount
  };
};
