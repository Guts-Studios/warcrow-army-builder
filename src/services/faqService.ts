
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
  const { data, error } = await supabase
    .from('faq_sections')
    .select('*')
    .order('order_index');

  if (error) {
    console.error('Error fetching FAQ sections:', error);
    return [];
  }

  // Process data to use the translated fields if available
  return (data || []).map(item => {
    if (language === 'es') {
      // For Spanish, use Spanish content if available or fall back to English
      return {
        ...item,
        section: item.section_es || item.section,
        content: item.content_es || item.content
      };
    }
    
    // For English or other languages, use default fields
    return item;
  });
};
