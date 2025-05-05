
import { supabase } from "@/integrations/supabase/client";

export interface FAQItem {
  id: string;
  section: string;
  content: string;
  section_es?: string; 
  content_es?: string;
  order_index: number;
}

export const fetchFAQSections = async (language: string = 'en'): Promise<FAQItem[]> => {
  console.log(`Fetching FAQ data with language: ${language}`);
  
  const { data, error } = await supabase
    .from('faq_sections')
    .select('*')
    .order('order_index');

  if (error) {
    console.error('Error fetching FAQ sections:', error);
    return [];
  }

  // Debug the raw data returned from Supabase
  console.log('Raw FAQ data:', data);

  // Process data to use the translated fields if available
  const processedData = (data || []).map(item => {
    // Create a processed item with all original fields
    const processedItem: FAQItem = { ...item };
    
    // For Spanish language, use the Spanish content if available
    if (language === 'es') {
      // Replace section with section_es if section_es exists and is not empty
      if (item.section_es && item.section_es.trim() !== '') {
        processedItem.section = item.section_es;
      }
      
      // Replace content with content_es if content_es exists and is not empty
      if (item.content_es && item.content_es.trim() !== '') {
        processedItem.content = item.content_es;
      }
      
      console.log(`Processed Spanish item: ${processedItem.section}`);
    }
    
    return processedItem;
  });

  console.log('Processed FAQ data:', processedData);
  return processedData;
};
