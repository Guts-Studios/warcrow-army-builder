
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
    if (language === 'es') {
      // For Spanish, use Spanish content if available or fall back to English
      const processedItem = {
        ...item,
        section: item.section_es || item.section,
        content: item.content_es || item.content
      };
      console.log(`Processed Spanish item: ${processedItem.section}`);
      return processedItem;
    }
    
    // For English or other languages, use default fields
    console.log(`Using English item: ${item.section}`);
    return item;
  });

  console.log('Processed FAQ data:', processedData);
  return processedData;
};
