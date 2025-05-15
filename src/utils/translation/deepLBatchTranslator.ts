
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
