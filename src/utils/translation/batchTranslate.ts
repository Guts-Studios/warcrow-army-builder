
import { supabase } from "@/integrations/supabase/client";

type TranslationItem = {
  id: string;
  key: string;
  source: string;
  translation?: string;
};

type TableType = 'rules_chapters' | 'rules_sections' | 'faq_sections' | 'unit_keywords' | 'special_rules' | 'unit_characteristics' | 'unit_data';

/**
 * Batch translation utility for handling mass translations
 * This can be used to translate multiple items at once and optionally save to database
 */
export const batchTranslate = async (
  items: Array<TranslationItem>,
  targetLanguage: string,
  saveToDatabase: boolean = false,
  tableType: TableType = 'rules_sections',
  useDeepL: boolean = true
): Promise<Array<TranslationItem & { translation: string }>> => {
  try {
    console.log(`Starting batch translation of ${items.length} items to ${targetLanguage}`);
    const results = [];
    
    // Process items in batches to avoid overloading the translation API
    const batchSize = 10;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(items.length/batchSize)}`);
      
      // Translate each item in the batch
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          let translation = '';
          
          if (useDeepL) {
            // Try to use DeepL for translation
            try {
              const { data, error } = await supabase.functions.invoke('deepl-translate', {
                body: {
                  texts: [item.source],
                  targetLanguage: targetLanguage.toUpperCase(),
                  formality: 'more'
                }
              });
              
              if (error) {
                throw error;
              }
              
              if (data && data.translations && data.translations.length > 0) {
                translation = data.translations[0];
                console.log(`DeepL translation successful for item ${item.id}`);
              } else {
                throw new Error('No translation returned from DeepL');
              }
            } catch (error) {
              console.error(`DeepL translation failed for item ${item.id}:`, error);
              translation = `[${targetLanguage}] ${item.source}`; // Fallback
            }
          } else {
            // Use placeholder translation if DeepL is not enabled
            translation = `[${targetLanguage}] ${item.source}`;
          }
          
          return {
            ...item,
            translation
          };
        })
      );
      
      results.push(...batchResults);
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Dispatch progress event for other components to track
      if (typeof window !== 'undefined') {
        const progressEvent = new CustomEvent('translation-progress', {
          detail: { completed: i + batch.length, progress: Math.round((i + batch.length) / items.length * 100) }
        });
        window.dispatchEvent(progressEvent);
      }
    }

    if (saveToDatabase && tableType) {
      // Determine which fields to update based on the item key and table type
      for (const item of results) {
        let columnPrefix = targetLanguage.toLowerCase();
        let columnName = '';
        
        if (tableType === 'rules_chapters') {
          columnName = `title_${columnPrefix}`;
        } else if (tableType === 'rules_sections') {
          // For either rules_sections or faq_sections
          // Use 'key' to determine whether to update section/title or content 
          if (item.key === 'section' || item.key === 'title') {
            columnName = `title_${columnPrefix}`;
          } else {
            columnName = `content_${columnPrefix}`;
          }
        } else if (tableType === 'faq_sections') {
          if (item.key === 'section') {
            columnName = `section_${columnPrefix}`;
          } else {
            columnName = `content_${columnPrefix}`;
          }
        } else if (['unit_keywords', 'special_rules', 'unit_characteristics', 'unit_data'].includes(tableType)) {
          // For unit related tables
          if (item.key === 'name') {
            columnName = `name_${columnPrefix}`;
          } else {
            columnName = `description_${columnPrefix}`;
          }
        }
        
        // Update the database with the translation
        try {
          const { error } = await supabase
            .from(tableType)
            .update({ [columnName]: item.translation })
            .eq('id', item.id);
            
          if (error) {
            console.error(`Error updating translation for ${item.id}:`, error);
          }
        } catch (updateError) {
          console.error(`Database update error for ${item.id}:`, updateError);
        }
      }
      
      console.log(`Saved ${results.length} translations to database`);
    }
    
    return results;
  } catch (error) {
    console.error("Error in batch translation:", error);
    return items.map(item => ({...item, translation: ''}));
  }
};
