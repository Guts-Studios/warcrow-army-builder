
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
    // Create a copy of the original item
    const processedItem = { ...item };
    
    if (language === 'es') {
      // For Spanish, use Spanish content if available or fall back to English
      if (item.section_es) {
        processedItem.section = item.section_es;
      }
      
      if (item.content_es) {
        processedItem.content = item.content_es;
      }
      
      console.log(`Processed Spanish item: ${processedItem.section}`);
    }
    
    return processedItem;
  });

  console.log('Processed FAQ data:', processedData);
  return processedData;
};
