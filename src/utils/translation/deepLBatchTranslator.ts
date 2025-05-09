
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TranslationBatch {
  text: string;
  targetField: string;
  id: string;
  table: string;
}

/**
 * Translates multiple pieces of content and updates database fields directly
 * Designed for admin translation workflows
 */
export async function batchTranslateAndUpdate(
  batches: TranslationBatch[],
  targetLanguage: 'es' | 'fr' = 'fr',
  onProgress?: (completed: number, total: number) => void
): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = [];
  const batchSize = 20; // DeepL API limits
  const total = batches.length;
  let completed = 0;
  
  try {
    // Process in smaller batches to avoid API limits
    for (let i = 0; i < total; i += batchSize) {
      const currentBatch = batches.slice(i, i + batchSize);
      const textsToTranslate = currentBatch.map(b => b.text);
      
      // Skip empty texts
      if (textsToTranslate.length === 0 || textsToTranslate.every(t => !t || t.trim() === '')) {
        completed += currentBatch.length;
        if (onProgress) onProgress(completed, total);
        continue;
      }
      
      // Translate the current batch
      const { data, error } = await supabase.functions.invoke('deepl-translate', {
        body: {
          texts: textsToTranslate.filter(t => t && t.trim() !== ''),
          targetLanguage: targetLanguage.toUpperCase(),
          formality: 'more'
        }
      });

      if (error || !data || !data.translations) {
        console.error("Translation error:", error);
        errors.push(`Failed to translate batch ${i}-${i + currentBatch.length}: ${error?.message || 'Unknown error'}`);
        // Continue with other batches despite errors
        completed += currentBatch.length;
        if (onProgress) onProgress(completed, total);
        continue;
      }
      
      // Update database with translated content
      const translations = data.translations;
      let validTranslationIndex = 0;
      
      for (let j = 0; j < currentBatch.length; j++) {
        const { id, table, targetField, text } = currentBatch[j];
        
        // Skip empty content
        if (!text || text.trim() === '') {
          continue;
        }
        
        // Get the translation for this item
        const translation = translations[validTranslationIndex];
        validTranslationIndex++;
        
        if (translation) {
          // Update the database
          const { error: updateError } = await supabase
            .from(table)
            .update({ [targetField]: translation })
            .eq('id', id);
            
          if (updateError) {
            console.error(`Error updating ${table}.${targetField}:`, updateError);
            errors.push(`Failed to update ${table}.${targetField} for ID ${id}: ${updateError.message}`);
          }
        }
      }
      
      // Update progress
      completed += currentBatch.length;
      if (onProgress) onProgress(completed, total);
      
      // Small delay to avoid hitting API rate limits
      if (i + batchSize < total) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    return {
      success: errors.length === 0,
      errors
    };
  } catch (error: any) {
    const errorMessage = `Batch translation error: ${error.message || 'Unknown error'}`;
    console.error(errorMessage);
    errors.push(errorMessage);
    
    return {
      success: false,
      errors
    };
  }
}

/**
 * Translates missing content in FAQ, Rules and News sections
 * Used by admin panel for bulk translation operations
 */
export async function translateAllMissingContent(
  targetLanguage: 'es' | 'fr' = 'fr'
): Promise<{ success: boolean; errors: string[]; stats: any }> {
  const errors: string[] = [];
  const stats = {
    rules_chapters: 0,
    rules_sections: 0,
    faqs: 0,
    faq_sections: 0,
    news_items: 0,
    unit_keywords: 0,
    unit_data: 0,
    special_rules: 0
  };
  
  try {
    // 1. Create a custom event for tracking progress
    const progressEvent = new CustomEvent('translation-progress', {
      detail: { completed: 0, total: 0 }
    });
    
    let totalItems = 0;
    let completedItems = 0;
    
    const updateProgress = (completed: number, total: number) => {
      completedItems = completed;
      totalItems = total;
      progressEvent.detail.completed = completed;
      progressEvent.detail.total = total;
      window.dispatchEvent(progressEvent);
    };
    
    // 2. Fetch missing translations from Rules Chapters
    const targetField = targetLanguage === 'es' ? 'title_es' : 'title_fr';
    const { data: chaptersData, error: chaptersError } = await supabase
      .from('rules_chapters')
      .select('id, title')
      .or(`${targetField}.is.null,${targetField}.eq.''`);
      
    if (chaptersError) {
      errors.push(`Failed to fetch rules chapters: ${chaptersError.message}`);
    } else if (chaptersData && chaptersData.length > 0) {
      const chapterBatches: TranslationBatch[] = chaptersData.map(chapter => ({
        id: chapter.id,
        text: chapter.title,
        targetField: targetField,
        table: 'rules_chapters'
      }));
      
      const { errors: chapterErrors } = await batchTranslateAndUpdate(
        chapterBatches,
        targetLanguage,
        (completed, total) => updateProgress(completedItems + completed, totalItems + total - completed)
      );
      
      if (chapterErrors.length > 0) {
        errors.push(...chapterErrors);
      }
      
      stats.rules_chapters = chaptersData.length;
    }
    
    // 3. Fetch missing translations from Rules Sections
    const contentField = targetLanguage === 'es' ? 'content_es' : 'content_fr';
    const titleField = targetLanguage === 'es' ? 'title_es' : 'title_fr';
    
    const { data: sectionsData, error: sectionsError } = await supabase
      .from('rules_sections')
      .select('id, title, content')
      .or(`${contentField}.is.null,${contentField}.eq.'',${titleField}.is.null,${titleField}.eq.''`);
      
    if (sectionsError) {
      errors.push(`Failed to fetch rules sections: ${sectionsError.message}`);
    } else if (sectionsData && sectionsData.length > 0) {
      // Process titles and content separately
      const titleBatches: TranslationBatch[] = sectionsData
        .filter(section => !section[titleField])
        .map(section => ({
          id: section.id,
          text: section.title,
          targetField: titleField,
          table: 'rules_sections'
        }));
        
      const contentBatches: TranslationBatch[] = sectionsData
        .filter(section => !section[contentField])
        .map(section => ({
          id: section.id,
          text: section.content,
          targetField: contentField,
          table: 'rules_sections'
        }));
        
      // Translate titles
      if (titleBatches.length > 0) {
        const { errors: titleErrors } = await batchTranslateAndUpdate(
          titleBatches,
          targetLanguage,
          (completed, total) => updateProgress(completedItems + completed, totalItems + total - completed)
        );
        
        if (titleErrors.length > 0) {
          errors.push(...titleErrors);
        }
      }
      
      // Translate content
      if (contentBatches.length > 0) {
        const { errors: contentErrors } = await batchTranslateAndUpdate(
          contentBatches,
          targetLanguage,
          (completed, total) => updateProgress(completedItems + completed, totalItems + total - completed)
        );
        
        if (contentErrors.length > 0) {
          errors.push(...contentErrors);
        }
      }
      
      stats.rules_sections = sectionsData.length;
    }
    
    // 4. Process FAQs
    const faqContentField = targetLanguage === 'es' ? 'content_es' : 'content_fr';
    
    const { data: faqsData, error: faqsError } = await supabase
      .from('faqs')
      .select('id, content')
      .or(`${faqContentField}.is.null,${faqContentField}.eq.''`);
      
    if (faqsError) {
      errors.push(`Failed to fetch FAQs: ${faqsError.message}`);
    } else if (faqsData && faqsData.length > 0) {
      const faqBatches: TranslationBatch[] = faqsData.map(faq => ({
        id: faq.id,
        text: faq.content,
        targetField: faqContentField,
        table: 'faqs'
      }));
      
      const { errors: faqErrors } = await batchTranslateAndUpdate(
        faqBatches,
        targetLanguage,
        (completed, total) => updateProgress(completedItems + completed, totalItems + total - completed)
      );
      
      if (faqErrors.length > 0) {
        errors.push(...faqErrors);
      }
      
      stats.faqs = faqsData.length;
    }
    
    // 5. Process FAQ Sections
    const faqSectionField = targetLanguage === 'es' ? 'section_es' : 'section_fr';
    const faqSecContentField = targetLanguage === 'es' ? 'content_es' : 'content_fr';
    
    const { data: faqSectionsData, error: faqSectionsError } = await supabase
      .from('faq_sections')
      .select('id, section, content')
      .or(`${faqSectionField}.is.null,${faqSectionField}.eq.'',${faqSecContentField}.is.null,${faqSecContentField}.eq.''`);
      
    if (faqSectionsError) {
      errors.push(`Failed to fetch FAQ sections: ${faqSectionsError.message}`);
    } else if (faqSectionsData && faqSectionsData.length > 0) {
      // Process section titles
      const sectionBatches: TranslationBatch[] = faqSectionsData
        .filter(section => !section[faqSectionField])
        .map(section => ({
          id: section.id,
          text: section.section,
          targetField: faqSectionField,
          table: 'faq_sections'
        }));
        
      // Process content
      const contentBatches: TranslationBatch[] = faqSectionsData
        .filter(section => !section[faqSecContentField])
        .map(section => ({
          id: section.id,
          text: section.content,
          targetField: faqSecContentField,
          table: 'faq_sections'
        }));
        
      // Translate section titles
      if (sectionBatches.length > 0) {
        const { errors: sectionErrors } = await batchTranslateAndUpdate(
          sectionBatches,
          targetLanguage,
          (completed, total) => updateProgress(completedItems + completed, totalItems + total - completed)
        );
        
        if (sectionErrors.length > 0) {
          errors.push(...sectionErrors);
        }
      }
      
      // Translate content
      if (contentBatches.length > 0) {
        const { errors: contentErrors } = await batchTranslateAndUpdate(
          contentBatches,
          targetLanguage,
          (completed, total) => updateProgress(completedItems + completed, totalItems + total - completed)
        );
        
        if (contentErrors.length > 0) {
          errors.push(...contentErrors);
        }
      }
      
      stats.faq_sections = faqSectionsData.length;
    }
    
    // 6. Process News Items
    const newsContentField = targetLanguage === 'es' ? 'content_es' : 'content_fr';
    
    const { data: newsData, error: newsError } = await supabase
      .from('news_items')
      .select('id, content_en')
      .or(`${newsContentField}.is.null,${newsContentField}.eq.''`);
      
    if (newsError) {
      errors.push(`Failed to fetch news items: ${newsError.message}`);
    } else if (newsData && newsData.length > 0) {
      const newsBatches: TranslationBatch[] = newsData.map(news => ({
        id: news.id,
        text: news.content_en,
        targetField: newsContentField,
        table: 'news_items'
      }));
      
      const { errors: newsErrors } = await batchTranslateAndUpdate(
        newsBatches,
        targetLanguage,
        (completed, total) => updateProgress(completedItems + completed, totalItems + total - completed)
      );
      
      if (newsErrors.length > 0) {
        errors.push(...newsErrors);
      }
      
      stats.news_items = newsData.length;
    }
    
    // 7. Process special rules
    const specialRuleField = targetLanguage === 'es' ? 'description_es' : 'description_fr';
    
    const { data: rulesData, error: rulesError } = await supabase
      .from('special_rules')
      .select('id, description')
      .or(`${specialRuleField}.is.null,${specialRuleField}.eq.''`);
      
    if (rulesError) {
      errors.push(`Failed to fetch special rules: ${rulesError.message}`);
    } else if (rulesData && rulesData.length > 0) {
      const rulesBatches: TranslationBatch[] = rulesData.map(rule => ({
        id: rule.id,
        text: rule.description,
        targetField: specialRuleField,
        table: 'special_rules'
      }));
      
      const { errors: rulesErrors } = await batchTranslateAndUpdate(
        rulesBatches,
        targetLanguage,
        (completed, total) => updateProgress(completedItems + completed, totalItems + total - completed)
      );
      
      if (rulesErrors.length > 0) {
        errors.push(...rulesErrors);
      }
      
      stats.special_rules = rulesData.length;
    }

    // 8. Process unit keywords
    const keywordDescField = targetLanguage === 'es' ? 'description_es' : 'description_fr';
    const keywordNameField = targetLanguage === 'es' ? 'name_es' : 'name_fr';
    
    const { data: keywordsData, error: keywordsError } = await supabase
      .from('unit_keywords')
      .select('id, name, description')
      .or(`${keywordDescField}.is.null,${keywordDescField}.eq.'',${keywordNameField}.is.null,${keywordNameField}.eq.''`);
      
    if (keywordsError) {
      errors.push(`Failed to fetch unit keywords: ${keywordsError.message}`);
    } else if (keywordsData && keywordsData.length > 0) {
      // Process keyword names
      const namesBatches: TranslationBatch[] = keywordsData
        .filter(kw => !kw[keywordNameField])
        .map(kw => ({
          id: kw.id,
          text: kw.name,
          targetField: keywordNameField,
          table: 'unit_keywords'
        }));
        
      // Process descriptions
      const descBatches: TranslationBatch[] = keywordsData
        .filter(kw => kw.description && !kw[keywordDescField])
        .map(kw => ({
          id: kw.id,
          text: kw.description,
          targetField: keywordDescField,
          table: 'unit_keywords'
        }));
        
      // Translate names
      if (namesBatches.length > 0) {
        const { errors: namesErrors } = await batchTranslateAndUpdate(
          namesBatches,
          targetLanguage,
          (completed, total) => updateProgress(completedItems + completed, totalItems + total - completed)
        );
        
        if (namesErrors.length > 0) {
          errors.push(...namesErrors);
        }
      }
      
      // Translate descriptions
      if (descBatches.length > 0) {
        const { errors: descErrors } = await batchTranslateAndUpdate(
          descBatches,
          targetLanguage,
          (completed, total) => updateProgress(completedItems + completed, totalItems + total - completed)
        );
        
        if (descErrors.length > 0) {
          errors.push(...descErrors);
        }
      }
      
      stats.unit_keywords = keywordsData.length;
    }
    
    // 9. Process unit data (names)
    const unitNameField = targetLanguage === 'es' ? 'name_es' : 'name_fr';
    
    const { data: unitsData, error: unitsError } = await supabase
      .from('unit_data')
      .select('id, name')
      .or(`${unitNameField}.is.null,${unitNameField}.eq.''`);
      
    if (unitsError) {
      errors.push(`Failed to fetch unit data: ${unitsError.message}`);
    } else if (unitsData && unitsData.length > 0) {
      const unitsBatches: TranslationBatch[] = unitsData.map(unit => ({
        id: unit.id,
        text: unit.name,
        targetField: unitNameField,
        table: 'unit_data'
      }));
      
      const { errors: unitsErrors } = await batchTranslateAndUpdate(
        unitsBatches,
        targetLanguage,
        (completed, total) => updateProgress(completedItems + completed, totalItems + total - completed)
      );
      
      if (unitsErrors.length > 0) {
        errors.push(...unitsErrors);
      }
      
      stats.unit_data = unitsData.length;
    }
    
    // Complete!
    toast.success(
      `Translation complete! Translated ${completedItems} items to ${targetLanguage === 'es' ? 'Spanish' : 'French'}`, 
      { duration: 5000 }
    );
    
    return {
      success: errors.length === 0,
      errors,
      stats
    };
    
  } catch (error: any) {
    console.error("Error in translateAllMissingContent:", error);
    return {
      success: false,
      errors: [`Translation process failed: ${error.message || 'Unknown error'}`],
      stats
    };
  }
}
