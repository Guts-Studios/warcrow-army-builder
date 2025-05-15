
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/toast-core';

type BatchItem = {
  id: string;
  text: string;
  targetField: string;
  table: string;
};

/**
 * Batch translate and update multiple items in the database
 */
export async function batchTranslateAndUpdate(
  items: BatchItem[],
  targetLanguage: string = 'es',
  progressCallback?: (completed: number, total: number) => void
): Promise<{ success: boolean; errors: Error[] }> {
  if (!items.length) {
    return { success: true, errors: [] };
  }

  // Create batches of no more than 10 items to avoid rate limiting
  const batchSize = 10;
  const batches: BatchItem[][] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  const errors: Error[] = [];
  let completedCount = 0;

  // Process each batch sequentially
  for (const batch of batches) {
    try {
      // Extract the text to translate from each item
      const textsToTranslate = batch.map(item => item.text);

      // Translate the texts
      const { data, error } = await supabase.functions.invoke('deepl-translate', {
        body: {
          texts: textsToTranslate,
          targetLanguage: targetLanguage
        }
      });

      if (error) {
        throw new Error(`Translation error: ${error.message}`);
      }

      if (!data || !data.translations || !Array.isArray(data.translations)) {
        throw new Error('Invalid response from translation service');
      }

      // Update each item in the database with its translation
      for (let i = 0; i < batch.length; i++) {
        const item = batch[i];
        const translatedText = data.translations[i];

        // Skip if no translation was returned
        if (!translatedText) continue;

        // Update the item in the database
        const { error: updateError } = await supabase
          .from(item.table)
          .update({ [item.targetField]: translatedText })
          .eq('id', item.id);

        if (updateError) {
          console.error(`Error updating ${item.table} with ID ${item.id}:`, updateError);
          errors.push(new Error(`Failed to update ${item.table} with ID ${item.id}: ${updateError.message}`));
        }
      }

      // Update progress
      completedCount += batch.length;
      if (progressCallback) {
        progressCallback(completedCount, items.length);
      }
      
      // Add a small delay to avoid hammering the API
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error('Batch translation error:', error);
      errors.push(error instanceof Error ? error : new Error(String(error)));
    }
  }

  return {
    success: errors.length === 0,
    errors
  };
}

/**
 * Translate all missing content for a specific language
 */
export async function translateAllMissingContent(targetLanguage: string = 'fr'): Promise<{
  success: boolean;
  errors: string[];
  stats: Record<string, number>;
}> {
  const stats: Record<string, number> = {
    rules_chapters: 0,
    rules_sections: 0,
    faqs: 0,
    faq_sections: 0,
    news_items: 0,
    unit_keywords: 0,
    unit_data: 0,
    special_rules: 0,
    characteristics: 0
  };
  
  const errors: string[] = [];
  let completed = 0;
  let total = 0;
  
  // Helper function to update progress
  const updateProgress = (completed: number, total: number) => {
    const event = new CustomEvent('translation-progress', {
      detail: { completed, total }
    });
    window.dispatchEvent(event);
  };
  
  try {
    // Start with unit names first
    const { data: unitData, error: unitError } = await supabase
      .from('unit_data')
      .select('id, name')
      .is(`name_${targetLanguage}`, null);
      
    if (unitError) throw new Error(`Error fetching unit data: ${unitError.message}`);
    
    if (unitData && unitData.length > 0) {
      total += unitData.length;
      updateProgress(completed, total);
      
      const unitItems = unitData.map(unit => ({
        id: unit.id,
        text: unit.name,
        targetField: `name_${targetLanguage}`,
        table: 'unit_data'
      }));
      
      const { success, errors: unitErrors } = await batchTranslateAndUpdate(
        unitItems,
        targetLanguage,
        (done, all) => {
          completed += done;
          updateProgress(completed, total);
        }
      );
      
      if (success) {
        stats.unit_data = unitItems.length;
      } else {
        errors.push(...unitErrors.map(e => e.message));
      }
    }
    
    // Add more translation categories as needed...
    
    return {
      success: errors.length === 0,
      errors,
      stats
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);
    return {
      success: false,
      errors,
      stats
    };
  }
}
